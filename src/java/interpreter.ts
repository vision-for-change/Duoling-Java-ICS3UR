/**
 * Tree-walking interpreter for checked sandbox programs.
 * Deterministic (seeded Math.random, fake clock) so interactive programs can be
 * re-run from the start each time the learner types another line of input.
 */
import type { Expr, JType, MethodDecl, Stmt, VarInfo } from './ast'
import type { CheckedProgram } from './checker'
import { exceptionToString, isSubclassOf, JavaThrow, type JavaExceptionValue } from './errors'
import { formatDouble, javaFormat, type FormatArg } from './format'
import { ScannerSim } from './scanner'
import {
  arith,
  compare,
  convertPrim,
  displayValue,
  intern,
  isBoxed,
  isNumeric,
  isPrimitive,
  javaToString,
  JStr,
  shift,
} from './values'

export interface TraceVar {
  name: string
  type: string
  value: string
  changed: boolean
}

export interface TraceStep {
  line: number
  kind: 'stmt' | 'cond' | 'update' | 'call' | 'return' | 'exception' | 'catch'
  vars: TraceVar[]
  /** length of the console output (stdout) at this step */
  out: number
  note?: string
}

export interface ConsoleSegment {
  kind: 'out' | 'err' | 'in'
  text: string
}

export class TimeoutSignal extends Error {
  reason: 'steps' | 'output'
  constructor(reason: 'steps' | 'output') {
    super('timeout')
    this.reason = reason
  }
}
export class ExitSignal extends Error {
  code: number
  constructor(code: number) {
    super('exit')
    this.code = code
  }
}

const BREAK = { kind: 'break' } as const
const CONTINUE = { kind: 'continue' } as const
type Completion = typeof BREAK | typeof CONTINUE | { kind: 'return'; value: unknown } | undefined

interface Frame {
  locals: Map<number, unknown>
  visible: VarInfo[]
}

const OUT = { kind: 'PrintStream', err: false }
const ERR = { kind: 'PrintStream', err: true }
const IN = { kind: 'InputStream' }

interface ScannerRef {
  kind: 'Scanner'
  sim: ScannerSim
}
interface RandomRef {
  kind: 'Random'
  next: () => number
}

export interface InterpreterOptions {
  stdin: string
  interactive: boolean
  maxSteps: number
  trace: boolean
  maxTraceSteps: number
  seed: number
  maxOutput: number
}

function mulberry32(seed: number): () => number {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Character.isWhitespace: Unicode space separators except no-break spaces, plus 	 
    and - */
function isJavaWhitespace(c: number): boolean {
  if (c === 0x09 || c === 0x0a || c === 0x0b || c === 0x0c || c === 0x0d) return true
  if (c >= 0x1c && c <= 0x1f) return true
  if (c === 0x00a0 || c === 0x2007 || c === 0x202f) return false
  return c === 0x20 || c === 0x1680 || (c >= 0x2000 && c <= 0x200a) || c === 0x2028 || c === 0x2029 || c === 0x205f || c === 0x3000
}

function defaultValue(t: JType): unknown {
  switch (t) {
    case 'int':
    case 'short':
    case 'byte':
    case 'char':
    case 'double':
    case 'float':
      return 0
    case 'long':
      return 0n
    case 'boolean':
      return false
    default:
      return null
  }
}

export class Interpreter {
  stdout = ''
  stderr = ''
  segments: ConsoleSegment[] = []
  trace: TraceStep[] = []
  traceTruncated = false
  steps = 0
  curLine = 0

  private prog: CheckedProgram
  private opts: InterpreterOptions
  private statics = new Map<number, unknown>()
  private frame: Frame = { locals: new Map(), visible: [] }
  private stdinSim: ScannerSim
  private rng: () => number
  private depth = 0
  private lastShown = new Map<number, string>()
  private source: string

  constructor(prog: CheckedProgram, opts: InterpreterOptions) {
    this.prog = prog
    this.opts = opts
    this.source = prog.program.source
    this.rng = mulberry32(opts.seed)
    this.stdinSim = new ScannerSim(opts.stdin, opts.interactive)
    this.stdinSim.onTouchLine = (text) => this.write('in', text + '\n')
  }

  // ---------------- output ----------------
  private write(kind: ConsoleSegment['kind'], text: string) {
    if (!text) return
    if (kind === 'out') this.stdout += text
    else if (kind === 'err') this.stderr += text
    const last = this.segments[this.segments.length - 1]
    if (last && last.kind === kind) last.text += text
    else this.segments.push({ kind, text })
    if (this.stdout.length + this.stderr.length > this.opts.maxOutput) throw new TimeoutSignal('output')
  }

  // ---------------- tracing ----------------
  private tick(line: number) {
    this.curLine = line
    this.stdinSim.line = line
    if (++this.steps > this.opts.maxSteps) throw new TimeoutSignal('steps')
  }

  private record(line: number, kind: TraceStep['kind'], note?: string) {
    if (!this.opts.trace) return
    if (this.trace.length >= this.opts.maxTraceSteps) {
      this.traceTruncated = true
      return
    }
    const vars: TraceVar[] = []
    const add = (v: VarInfo, value: unknown) => {
      const shown = displayValue(value, v.type)
      const prev = this.lastShown.get(v.id)
      vars.push({ name: v.name, type: v.type, value: shown, changed: prev !== shown })
      this.lastShown.set(v.id, shown)
    }
    for (const v of this.prog.staticFields) add(v, this.statics.get(v.id))
    for (const v of this.frame.visible) {
      if (v.type === 'String[]') continue
      add(v, this.frame.locals.get(v.id))
    }
    this.trace.push({ line, kind, vars, out: this.stdout.length, note })
  }

  /** Human-friendly note for a trace step, e.g. "count is now 3" or "printed 5". */
  private describe(e: Expr, printed: string): string | undefined {
    if (printed) {
      const shown = printed.length > 40 ? printed.slice(0, 40) + '…' : printed
      return `printed ${shown.replace(/\n/g, '⏎')}`
    }
    const target = e.kind === 'Assign' ? e.target : e.kind === 'Unary' && (e.op === '++' || e.op === '--') ? e.operand : null
    if (target && (target.kind === 'Name' || target.kind === 'Field') && target.v) {
      const v = target.v
      return `${v.name} is now ${displayValue(this.readVar(v), v.type)}`
    }
    if (e.kind === 'Call') return `called ${e.name}()`
    return undefined
  }

  private text(e: { start: number; end: number }): string {
    return this.source.slice(e.start, e.end).replace(/\s+/g, ' ')
  }

  // ---------------- program ----------------
  run(): void {
    for (const f of this.prog.program.cls.fields) {
      for (const d of f.decl.declarators) this.statics.set(d.v!.id, defaultValue(d.v!.type))
    }
    for (const f of this.prog.program.cls.fields) {
      if (!f.isStatic) continue
      for (const d of f.decl.declarators) {
        if (d.init) {
          this.tick(d.line)
          this.statics.set(d.v!.id, this.assignConv(this.eval(d.init), d.init.t!, d.v!.type))
        }
      }
    }
    this.invoke(this.prog.main, [null], true)
  }

  private invoke(m: MethodDecl, args: unknown[], isEntry = false): unknown {
    if (++this.depth > 400) {
      this.depth = 0
      throw new JavaThrow('StackOverflowError', null, this.curLine)
    }
    const saved = this.frame
    this.frame = { locals: new Map(), visible: [] }
    m.params.forEach((p, i) => {
      this.frame.locals.set(p.v!.id, args[i])
      this.frame.visible.push(p.v!)
    })
    try {
      if (!isEntry) {
        this.record(m.line, 'call', `call ${m.name}(${m.params.map((p, i) => displayValue(args[i], p.type.name)).join(', ')})`)
      }
      const r = this.execBlock(m.body.body)
      if (r && r.kind === 'return') return r.value
      return undefined
    } finally {
      this.frame = saved
      this.depth--
    }
  }

  // ---------------- statements ----------------
  private execBlock(stmts: Stmt[]): Completion {
    const mark = this.frame.visible.length
    try {
      for (const s of stmts) {
        const r = this.exec(s)
        if (r) return r
      }
      return undefined
    } finally {
      this.frame.visible.length = mark
    }
  }

  private cond(e: Expr, line: number, label: string): boolean {
    const v = this.eval(e) as boolean
    this.record(line, 'cond', `${label}${this.text(e)} → ${v}`)
    return v
  }

  private exec(s: Stmt): Completion {
    switch (s.kind) {
      case 'Block':
        return this.execBlock(s.body)
      case 'Empty':
        this.tick(s.line)
        return undefined
      case 'VarDecl': {
        this.tick(s.line)
        const parts: string[] = []
        for (const d of s.declarators) {
          const v = d.v!
          this.frame.visible.push(v)
          const value = d.init ? this.assignConv(this.eval(d.init), d.init.t!, v.type) : undefined
          this.frame.locals.set(v.id, value)
          parts.push(d.init ? `${v.name} = ${displayValue(value, v.type)}` : `${v.name} (no value yet)`)
        }
        this.record(s.line, 'stmt', `new ${s.type.name} ${parts.join(', ')}`)
        return undefined
      }
      case 'ExprStmt': {
        this.tick(s.line)
        const before = this.stdout.length
        this.eval(s.expr)
        this.record(s.line, 'stmt', this.describe(s.expr, this.stdout.slice(before)))
        return undefined
      }
      case 'If': {
        this.tick(s.line)
        if (this.cond(s.cond, s.cond.line, 'if ')) return this.exec(s.then)
        if (s.else) return this.exec(s.else)
        return undefined
      }
      case 'While': {
        while (true) {
          this.tick(s.line)
          if (!this.cond(s.cond, s.cond.line, 'while ')) break
          const r = this.exec(s.body)
          if (r === BREAK) break
          if (r === CONTINUE) continue
          if (r) return r
        }
        return undefined
      }
      case 'DoWhile': {
        while (true) {
          this.tick(s.line)
          const r = this.exec(s.body)
          if (r === BREAK) break
          if (r && r !== CONTINUE) return r
          this.tick(s.cond.line)
          if (!this.cond(s.cond, s.cond.line, 'while ')) break
        }
        return undefined
      }
      case 'For': {
        const mark = this.frame.visible.length
        try {
          for (const init of s.init) this.exec(init)
          while (true) {
            this.tick(s.line)
            if (s.cond && !this.cond(s.cond, s.cond.line, 'for: ')) break
            const r = this.exec(s.body)
            if (r === BREAK) break
            if (r && r !== CONTINUE) return r
            for (const u of s.update) {
              this.tick(s.line)
              this.eval(u)
              this.record(u.line, 'update', `update: ${this.text(u)}`)
            }
          }
        } finally {
          this.frame.visible.length = mark
        }
        return undefined
      }
      case 'Switch': {
        this.tick(s.line)
        const sel = this.eval(s.selector)
        if (sel === null && s.selector.t === 'String') throw new JavaThrow('NullPointerException', null, s.line)
        const shown = displayValue(sel, s.selector.t!)
        const key = sel instanceof JStr ? sel.s : sel
        let start = s.cases.findIndex((c) => c.label !== null && c.label.cv === key)
        const matched = start !== -1
        if (!matched) start = s.cases.findIndex((c) => c.label === null)
        this.record(
          s.line,
          'cond',
          matched ? `switch (${this.text(s.selector)}) is ${shown}, jump to case ${this.text(s.cases[start].label!)}` : start !== -1 ? `switch (${this.text(s.selector)}) is ${shown}, no case matches, use default` : `switch (${this.text(s.selector)}) is ${shown}, no case matches`,
        )
        if (start === -1) return undefined
        const mark = this.frame.visible.length
        try {
          // fall through from the matching label until a break (or return) is reached
          for (let i = start; i < s.cases.length; i++) {
            for (const b of s.cases[i].body) {
              const r = this.exec(b)
              if (r === BREAK) return undefined
              if (r) return r
            }
          }
        } finally {
          this.frame.visible.length = mark
        }
        return undefined
      }
      case 'Break':
        this.tick(s.line)
        this.record(s.line, 'stmt', 'break → leave the loop or switch')
        return BREAK
      case 'Continue':
        this.tick(s.line)
        this.record(s.line, 'stmt', 'continue → next iteration')
        return CONTINUE
      case 'Return': {
        this.tick(s.line)
        const value = s.value ? this.eval(s.value) : undefined
        const m = this.currentReturnType()
        const conv = s.value && m ? this.assignConv(value, s.value.t!, m) : value
        this.record(s.line, 'return', s.value ? `return ${displayValue(conv, m ?? s.value.t!)}` : 'return')
        return { kind: 'return', value: conv }
      }
      case 'Throw': {
        this.tick(s.line)
        const ex = this.eval(s.expr) as JavaExceptionValue | null
        if (!ex) throw new JavaThrow('NullPointerException', null, s.line)
        const t = new JavaThrow(ex.type, ex.message, s.line)
        t.exception = ex
        throw t
      }
      case 'Try':
        return this.execTry(s)
    }
  }

  private returnTypes: string[] = []
  private currentReturnType(): string | null {
    return this.returnTypes[this.returnTypes.length - 1] ?? null
  }

  private execTry(s: Stmt & { kind: 'Try' }): Completion {
    let result: Completion
    let thrown: unknown = null
    try {
      result = this.execBlock(s.block.body)
    } catch (ex) {
      if (!(ex instanceof JavaThrow)) throw ex
      const clause = s.catches.find((c) => c.types.some((t) => isSubclassOf(ex.exception.type, t)))
      if (!clause) {
        thrown = ex
      } else {
        this.record(clause.line, 'catch', `caught ${ex.exception.type}`)
        const mark = this.frame.visible.length
        this.frame.visible.push(clause.v!)
        this.frame.locals.set(clause.v!.id, ex.exception)
        try {
          result = this.execBlock(clause.body.body)
        } catch (ex2) {
          if (!(ex2 instanceof JavaThrow)) throw ex2
          thrown = ex2
        } finally {
          this.frame.visible.length = mark
        }
      }
    }
    if (s.finally) {
      const fin = this.execBlock(s.finally.body)
      if (fin) return fin
    }
    if (thrown) throw thrown
    return result
  }

  // ---------------- expressions ----------------
  private readVar(v: VarInfo): unknown {
    return v.isField ? this.statics.get(v.id) : this.frame.locals.get(v.id)
  }
  private writeVar(v: VarInfo, value: unknown) {
    if (v.isField) this.statics.set(v.id, value)
    else this.frame.locals.set(v.id, value)
  }

  private assignConv(value: unknown, from: JType, to: JType): unknown {
    if (from === to) return value
    if (isPrimitive(from) && isPrimitive(to)) return convertPrim(value, from, to)
    return value
  }

  private varOf(e: Expr): VarInfo {
    if (e.kind === 'Paren') return this.varOf(e.expr)
    if ((e.kind === 'Name' || e.kind === 'Field') && e.v) return e.v
    throw new Error('not a variable')
  }

  eval(e: Expr): unknown {
    if (e.cv !== undefined) {
      return typeof e.cv === 'string' && e.t === 'String' ? intern(e.cv) : e.cv
    }
    switch (e.kind) {
      case 'Literal':
        return e.value === null ? null : e.value
      case 'Paren':
        return this.eval(e.expr)
      case 'Name':
        return this.readVar(e.v!)
      case 'Field':
        if (e.staticKey === 'System.out') return OUT
        if (e.staticKey === 'System.err') return ERR
        if (e.staticKey === 'System.in') return IN
        if (e.v) return this.readVar(e.v)
        throw new Error('unknown field ' + e.name)
      case 'New':
        return this.evalNew(e)
      case 'Call':
        return this.evalCall(e)
      case 'Unary':
        return this.evalUnary(e)
      case 'Binary':
        return this.evalBinary(e)
      case 'Assign':
        return this.evalAssign(e)
      case 'Ternary': {
        const c = this.eval(e.cond) as boolean
        const branch = c ? e.then : e.else
        const v = this.eval(branch)
        if (e.t === 'Object') return { boxed: true, type: branch.t!, value: v }
        return this.assignConv(v, branch.t!, e.t!)
      }
      case 'Cast': {
        const v = this.eval(e.expr)
        if (e.typeName === 'String') return isBoxed(v) ? v.value : v
        if (isBoxed(v)) return convertPrim(v.value, v.type, e.typeName)
        return convertPrim(v, e.expr.t!, e.typeName)
      }
    }
  }

  private evalNew(e: Expr & { kind: 'New' }): unknown {
    const args = e.args.map((a) => this.eval(a))
    switch (e.typeName) {
      case 'Scanner': {
        if (args[0] === IN) return { kind: 'Scanner', sim: this.stdinSim } satisfies ScannerRef
        const s = args[0] as JStr | null
        if (!s) throw new JavaThrow('NullPointerException', null, e.line)
        return { kind: 'Scanner', sim: new ScannerSim(s.s, false) } satisfies ScannerRef
      }
      case 'Random': {
        const next = args.length ? mulberry32(Number(args[0])) : mulberry32(Math.floor(this.rng() * 2 ** 31))
        return { kind: 'Random', next } satisfies RandomRef
      }
      case 'String':
        return new JStr(args.length ? ((args[0] as JStr | null)?.s ?? '') : '')
      default: {
        const msg = args.length ? (args[0] as JStr | null)?.s ?? null : null
        return { kind: 'exception', type: e.typeName, message: msg } satisfies JavaExceptionValue
      }
    }
  }

  private evalUnary(e: Expr & { kind: 'Unary' }): unknown {
    const op = e.op
    if (op === '++' || op === '--') {
      const v = this.varOf(e.operand)
      const t = v.type
      const old = this.readVar(v)
      let nv: unknown
      if (t === 'long') nv = BigInt.asIntN(64, (old as bigint) + (op === '++' ? 1n : -1n))
      else if (t === 'double') nv = (old as number) + (op === '++' ? 1 : -1)
      else if (t === 'float') nv = Math.fround((old as number) + (op === '++' ? 1 : -1))
      else nv = convertPrim(((old as number) + (op === '++' ? 1 : -1)) | 0, 'int', t)
      this.writeVar(v, nv)
      return e.prefix ? nv : old
    }
    const raw = this.eval(e.operand)
    const val = isBoxed(raw) ? raw.value : raw
    if (op === '!') return !val
    const t = e.t!
    const v = convertPrim(val, e.operand.t!, t)
    if (op === '+') return v
    if (op === '~') return t === 'long' ? ~(v as bigint) : ~(v as number)
    if (t === 'long') return BigInt.asIntN(64, -(v as bigint))
    if (t === 'int') return -(v as number) | 0
    if (t === 'float') return Math.fround(-(v as number))
    return -(v as number)
  }

  private evalBinary(e: Expr & { kind: 'Binary' }): unknown {
    const op = e.op
    if (op === '&&') return (this.eval(e.left) as boolean) && (this.eval(e.right) as boolean)
    if (op === '||') return (this.eval(e.left) as boolean) || (this.eval(e.right) as boolean)
    const lv = this.eval(e.left)
    const rv = this.eval(e.right)
    const ot = e.opType!
    const L = e.left.t!
    const R = e.right.t!
    if (ot === 'String') return new JStr(javaToString(lv, L) + javaToString(rv, R))
    if (ot === 'ref') {
      const a = isBoxed(lv) ? lv.value : lv
      const b = isBoxed(rv) ? rv.value : rv
      return op === '==' ? a === b : a !== b
    }
    if (ot === 'boolean') {
      if (op === '==') return lv === rv
      if (op === '!=') return lv !== rv
      return arith(op, lv, rv, 'boolean', e.line)
    }
    if (op === '<<' || op === '>>' || op === '>>>') {
      return shift(op, convertPrim(lv, L, ot), convertPrim(rv, R, R === 'long' ? 'long' : 'int'), ot, R === 'long' ? 'long' : 'int')
    }
    const a = convertPrim(lv, L, ot)
    const b = convertPrim(rv, R, ot)
    if (op === '<' || op === '>' || op === '<=' || op === '>=' || op === '==' || op === '!=') return compare(op, a, b)
    return arith(op, a, b, ot, e.opLine ?? e.line)
  }

  private evalAssign(e: Expr & { kind: 'Assign' }): unknown {
    const v = this.varOf(e.target)
    const T = v.type
    if (e.op === '=') {
      const val = this.assignConv(this.eval(e.value), e.value.t!, T)
      this.writeVar(v, val)
      return val
    }
    const old = this.readVar(v)
    const rhs = this.eval(e.value)
    const bop = e.op.slice(0, -1)
    const ot = e.opType!
    let result: unknown
    if (ot === 'String') {
      result = new JStr(javaToString(old, T) + javaToString(rhs, e.value.t!))
    } else if (bop === '<<' || bop === '>>' || bop === '>>>') {
      const rt = e.value.t === 'long' ? 'long' : 'int'
      result = convertPrim(shift(bop, convertPrim(old, T, ot), convertPrim(rhs, e.value.t!, rt), ot, rt), ot, T)
    } else {
      const r = arith(bop, convertPrim(old, T, ot), convertPrim(rhs, e.value.t!, ot), ot, e.opLine ?? e.line)
      result = ot === 'boolean' ? r : convertPrim(r, ot, T)
    }
    this.writeVar(v, result)
    return result
  }

  // ---------------- calls ----------------
  private str(v: unknown, line: number): string {
    if (v === null || v === undefined) throw new JavaThrow('NullPointerException', null, line)
    return (v as JStr).s
  }

  private evalCall(e: Expr & { kind: 'Call' }): unknown {
    const r = e.resolved!
    if (r.kind === 'user') {
      const m = r.method
      const args = e.args.map((a, i) => this.assignConv(this.eval(a), a.t!, m.params[i].type.name))
      this.returnTypes.push(m.returnType.name)
      try {
        const value = this.invoke(m, args)
        return value
      } finally {
        this.returnTypes.pop()
      }
    }
    const key = r.key
    const line = e.line

    // receiver
    let recv: unknown = undefined
    if (e.target && e.target.t !== '#class') recv = this.eval(e.target)
    const argVals = e.args.map((a) => this.eval(a))
    const argTypes = e.args.map((a) => a.t!)
    const num = (i: number, to: JType = 'double') => {
      const v = argVals[i]
      if (isBoxed(v)) return convertPrim(v.value, v.type, to) as number
      return convertPrim(v, argTypes[i], to) as number
    }

    switch (key) {
      case 'out.println':
      case 'out.print': {
        const target = recv as typeof OUT
        const text = argVals.length ? javaToString(argVals[0], argTypes[0]) : ''
        this.write(target.err ? 'err' : 'out', key === 'out.println' ? text + '\n' : text)
        return undefined
      }
      case 'out.printf': {
        const target = recv as typeof OUT
        const fmt = this.str(argVals[0], line)
        const fargs: FormatArg[] = argVals.slice(1).map((v, i) => (isBoxed(v) ? { value: v.value, type: v.type } : { value: v, type: argTypes[i + 1] }))
        let text: string
        try {
          text = javaFormat(fmt, fargs, line)
        } catch (e) {
          if (e instanceof JavaThrow && e.partialOutput) this.write(target.err ? 'err' : 'out', e.partialOutput)
          throw e
        }
        this.write(target.err ? 'err' : 'out', text)
        return recv
      }
      case 'out.flush':
        return undefined
      case 'String.format': {
        const fmt = this.str(argVals[0], line)
        const fargs: FormatArg[] = argVals.slice(1).map((v, i) => (isBoxed(v) ? { value: v.value, type: v.type } : { value: v, type: argTypes[i + 1] }))
        return new JStr(javaFormat(fmt, fargs, line))
      }
      case 'String.valueOf':
        return new JStr(javaToString(argVals[0], argTypes[0]))

      // ----- Math -----
      case 'Math.abs': {
        const t = e.t!
        const v = convertPrim(isBoxed(argVals[0]) ? argVals[0].value : argVals[0], argTypes[0], t)
        if (t === 'long') return (v as bigint) < 0n ? BigInt.asIntN(64, -(v as bigint)) : v
        if (t === 'int') return (v as number) < 0 ? -(v as number) | 0 : v
        return Math.abs(v as number)
      }
      case 'Math.max':
      case 'Math.min': {
        const t = e.t!
        const a = convertPrim(argVals[0], argTypes[0], t)
        const b = convertPrim(argVals[1], argTypes[1], t)
        if (t === 'long') return key === 'Math.max' ? ((a as bigint) > (b as bigint) ? a : b) : (a as bigint) < (b as bigint) ? a : b
        return key === 'Math.max' ? Math.max(a as number, b as number) : Math.min(a as number, b as number)
      }
      case 'Math.pow':
        return Math.pow(num(0), num(1))
      case 'Math.sqrt':
        return Math.sqrt(num(0))
      case 'Math.cbrt':
        return Math.cbrt(num(0))
      case 'Math.floor':
        return Math.floor(num(0))
      case 'Math.ceil':
        return Math.ceil(num(0))
      case 'Math.rint': {
        const x = num(0)
        const f = Math.floor(x)
        const diff = x - f
        if (diff < 0.5) return f
        if (diff > 0.5) return f + 1
        return f % 2 === 0 ? f : f + 1
      }
      case 'Math.exp':
        return Math.exp(num(0))
      case 'Math.log':
        return Math.log(num(0))
      case 'Math.log10':
        return Math.log10(num(0))
      case 'Math.sin':
        return Math.sin(num(0))
      case 'Math.cos':
        return Math.cos(num(0))
      case 'Math.tan':
        return Math.tan(num(0))
      case 'Math.asin':
        return Math.asin(num(0))
      case 'Math.acos':
        return Math.acos(num(0))
      case 'Math.atan':
        return Math.atan(num(0))
      case 'Math.atan2':
        return Math.atan2(num(0), num(1))
      case 'Math.hypot':
        return Math.hypot(num(0), num(1))
      case 'Math.toRadians':
        return (num(0) / 180) * Math.PI
      case 'Math.toDegrees':
        return (num(0) * 180) / Math.PI
      case 'Math.signum':
        return Math.sign(num(0))
      case 'Math.round': {
        if (e.t === 'long') {
          // JS Math.round has Java's semantics (ties toward +infinity)
          return convertPrim(Math.round(num(0)), 'double', 'long') as bigint
        }
        return convertPrim(Math.round(Math.fround(num(0, 'float'))), 'double', 'int')
      }
      case 'Math.random':
        return this.rng()
      case 'Math.floorDiv':
      case 'Math.floorMod': {
        const t = e.t!
        const a = convertPrim(argVals[0], argTypes[0], t)
        const b = convertPrim(argVals[1], argTypes[1], t)
        if (t === 'long') {
          const x = a as bigint
          const y = b as bigint
          if (y === 0n) throw new JavaThrow('ArithmeticException', '/ by zero', line)
          let q = x / y
          if ((x % y !== 0n) && ((x < 0n) !== (y < 0n))) q -= 1n
          return key === 'Math.floorDiv' ? q : x - q * y
        }
        const x = a as number
        const y = b as number
        if (y === 0) throw new JavaThrow('ArithmeticException', '/ by zero', line)
        const q = Math.floor(x / y)
        return key === 'Math.floorDiv' ? q | 0 : (x - q * y) | 0
      }

      // ----- wrappers -----
      case 'Integer.parseInt':
      case 'Integer.valueOf': {
        if (argTypes[0] !== 'String') return num(0, 'int')
        const s = argVals[0] as JStr | null
        if (s === null) throw new JavaThrow('NumberFormatException', 'Cannot parse null string: null', line)
        if (!/^[+-]?\d+$/.test(s.s)) throw new JavaThrow('NumberFormatException', `For input string: "${s.s}"`, line)
        const v = BigInt(s.s)
        if (v > 2147483647n || v < -2147483648n) throw new JavaThrow('NumberFormatException', `For input string: "${s.s}"`, line)
        return Number(v)
      }
      case 'Integer.toString':
        return new JStr(String(num(0, 'int')))
      case 'Integer.toBinaryString':
        return new JStr((num(0, 'int') >>> 0).toString(2))
      case 'Integer.toHexString':
        return new JStr((num(0, 'int') >>> 0).toString(16))
      case 'Integer.max':
        return Math.max(num(0, 'int'), num(1, 'int'))
      case 'Integer.min':
        return Math.min(num(0, 'int'), num(1, 'int'))
      case 'Integer.sum':
        return (num(0, 'int') + num(1, 'int')) | 0
      case 'Double.parseDouble':
      case 'Double.valueOf': {
        const s = argVals[0] as JStr | null
        if (s === null) throw new JavaThrow('NullPointerException', null, line)
        const t = s.s.trim()
        if (t === '') throw new JavaThrow('NumberFormatException', 'empty String', line)
        if (!/^[+-]?(NaN|Infinity|((\d+\.?\d*|\.\d+)([eE][+-]?\d+)?)[fFdD]?)$/.test(t)) {
          throw new JavaThrow('NumberFormatException', `For input string: "${s.s}"`, line)
        }
        return parseFloat(t.replace(/[fFdD]$/, '').replace(/^\+/, ''))
      }
      case 'Double.toString':
        return new JStr(formatDouble(num(0)))
      case 'Double.isNaN':
        return Number.isNaN(num(0))
      case 'Long.parseLong': {
        const s = argVals[0] as JStr | null
        if (s === null || !/^[+-]?\d+$/.test(s.s)) throw new JavaThrow('NumberFormatException', `For input string: "${s?.s ?? 'null'}"`, line)
        const v = BigInt(s.s)
        if (v > (1n << 63n) - 1n || v < -(1n << 63n)) throw new JavaThrow('NumberFormatException', `For input string: "${s.s}"`, line)
        return v
      }
      case 'Boolean.parseBoolean': {
        const s = argVals[0] as JStr | null
        return s !== null && s.s.toLowerCase() === 'true'
      }
      case 'Character.isDigit':
        return /\p{Nd}/u.test(String.fromCharCode(num(0, 'int')))
      case 'Character.isLetter':
        return /\p{L}/u.test(String.fromCharCode(num(0, 'int')))
      case 'Character.isLetterOrDigit':
        return /[\p{L}\p{Nd}]/u.test(String.fromCharCode(num(0, 'int')))
      case 'Character.isUpperCase':
        return /\p{Lu}/u.test(String.fromCharCode(num(0, 'int')))
      case 'Character.isLowerCase':
        return /\p{Ll}/u.test(String.fromCharCode(num(0, 'int')))
      case 'Character.isWhitespace':
        return isJavaWhitespace(num(0, 'int'))
      case 'Character.toUpperCase':
      case 'Character.toLowerCase': {
        const c = String.fromCharCode(num(0, 'int'))
        const m = key === 'Character.toUpperCase' ? c.toUpperCase() : c.toLowerCase()
        return (m.length === 1 ? m : c).charCodeAt(0)
      }
      case 'Character.getNumericValue': {
        const c = String.fromCharCode(num(0, 'int'))
        if (/[0-9]/.test(c)) return Number(c)
        if (/[a-z]/i.test(c)) return c.toLowerCase().charCodeAt(0) - 87
        return -1
      }
      case 'System.exit':
        throw new ExitSignal(num(0, 'int'))
      case 'System.currentTimeMillis':
        return 1_760_000_000_000n + BigInt(this.steps)
      case 'System.nanoTime':
        return 1_000_000_000n + BigInt(this.steps) * 1000n
    }

    // ----- instance methods -----
    if (key.startsWith('String.')) return this.stringMethod(key.slice(7), recv as JStr | null, argVals, argTypes, e)
    if (key.startsWith('Scanner.')) {
      const sc = recv as ScannerRef | null
      if (!sc) throw new JavaThrow('NullPointerException', null, line)
      const sim = sc.sim
      sim.line = line
      switch (key) {
        case 'Scanner.nextInt': return sim.nextInt()
        case 'Scanner.nextDouble': return sim.nextDouble()
        case 'Scanner.nextLong': return sim.nextLong()
        case 'Scanner.nextBoolean': return sim.nextBoolean()
        case 'Scanner.next': return new JStr(sim.next())
        case 'Scanner.nextLine': return new JStr(sim.nextLine())
        case 'Scanner.hasNextInt': return sim.hasNextInt()
        case 'Scanner.hasNextDouble': return sim.hasNextDouble()
        case 'Scanner.hasNextLong': return sim.hasNextLong()
        case 'Scanner.hasNextBoolean': return sim.hasNextBoolean()
        case 'Scanner.hasNext': return sim.hasNext()
        case 'Scanner.hasNextLine': return sim.hasNextLine()
        case 'Scanner.close': sim.close(); return undefined
      }
    }
    if (key.startsWith('Random.')) {
      const rnd = recv as RandomRef
      switch (key) {
        case 'Random.nextInt': {
          if (argVals.length === 0) return (Math.floor(rnd.next() * 4294967296) | 0)
          if (argVals.length === 1) {
            const bound = num(0, 'int')
            if (bound <= 0) throw new JavaThrow('IllegalArgumentException', 'bound must be positive', line)
            return Math.floor(rnd.next() * bound)
          }
          const origin = num(0, 'int')
          const bound = num(1, 'int')
          if (origin >= bound) throw new JavaThrow('IllegalArgumentException', 'bound must be greater than origin', line)
          return origin + Math.floor(rnd.next() * (bound - origin))
        }
        case 'Random.nextDouble':
          return rnd.next()
        case 'Random.nextBoolean':
          return rnd.next() < 0.5
      }
    }
    if (key.startsWith('Exception.')) {
      const ex = recv as JavaExceptionValue | null
      if (!ex) throw new JavaThrow('NullPointerException', null, line)
      if (key === 'Exception.getMessage') return ex.message === null ? null : new JStr(ex.message)
      if (key === 'Exception.toString') return new JStr(exceptionToString(ex))
      if (key === 'Exception.printStackTrace') {
        this.write('err', `${exceptionToString(ex)}\n\tat ${this.prog.program.cls.name}.main(${this.prog.program.cls.name}.java)\n`)
        return undefined
      }
    }
    if (key === 'Object.toString') {
      return new JStr(javaToString(recv, 'Object'))
    }
    if (key === 'Object.equals') {
      const a = isBoxed(recv) ? recv.value : recv
      const b = isBoxed(argVals[0]) ? argVals[0].value : argVals[0]
      if (a instanceof JStr && b instanceof JStr) return a.s === b.s
      return a === b
    }
    throw new Error('Unhandled builtin ' + key)
  }

  private stringMethod(name: string, recv: JStr | null, args: unknown[], types: JType[], e: Expr & { kind: 'Call' }): unknown {
    const line = e.line
    if (recv === null || recv === undefined) {
      const who = e.target && e.target.kind === 'Name' ? `"${e.target.name}"` : 'the value'
      throw new JavaThrow('NullPointerException', `Cannot invoke "String.${name}()" because ${who} is null`, line)
    }
    const s = recv.s
    const intArg = (i: number) => convertPrim(args[i], types[i], 'int') as number
    const strArg = (i: number): string => {
      const v = args[i] as JStr | null
      if (v === null) throw new JavaThrow('NullPointerException', null, line)
      return v.s
    }
    const sameOrNew = (r: string) => (r === s ? recv : new JStr(r))
    switch (name) {
      case 'length':
        return s.length
      case 'isEmpty':
        return s.length === 0
      case 'isBlank':
        return s.trim().length === 0
      case 'charAt': {
        const i = intArg(0)
        if (i < 0 || i >= s.length) throw new JavaThrow('StringIndexOutOfBoundsException', `Index ${i} out of bounds for length ${s.length}`, line)
        return s.charCodeAt(i)
      }
      case 'equals': {
        const o = isBoxed(args[0]) ? args[0].value : args[0]
        return o instanceof JStr && o.s === s
      }
      case 'equalsIgnoreCase': {
        const o = args[0] as JStr | null
        return o !== null && o.s.length === s.length && o.s.toLowerCase() === s.toLowerCase()
      }
      case 'toUpperCase':
        return sameOrNew(s.toUpperCase())
      case 'toLowerCase':
        return sameOrNew(s.toLowerCase())
      case 'trim':
        return sameOrNew(s.replace(/^[\u0000- ]+|[\u0000- ]+$/g, ''))
      case 'strip':
        return sameOrNew(s.trim())
      case 'substring': {
        const b = intArg(0)
        const end = args.length > 1 ? intArg(1) : s.length
        if (b < 0 || end > s.length || b > end) {
          throw new JavaThrow('StringIndexOutOfBoundsException', `Range [${b}, ${end}) out of bounds for length ${s.length}`, line)
        }
        if (b === 0 && end === s.length) return recv
        return new JStr(s.slice(b, end))
      }
      case 'indexOf':
      case 'lastIndexOf': {
        const needle = types[0] === 'String' ? strArg(0) : String.fromCharCode(intArg(0))
        if (name === 'indexOf') return args.length > 1 ? s.indexOf(needle, Math.max(0, intArg(1))) : s.indexOf(needle)
        return args.length > 1 ? s.lastIndexOf(needle, intArg(1)) : s.lastIndexOf(needle)
      }
      case 'contains':
        return s.includes(strArg(0))
      case 'startsWith':
        return s.startsWith(strArg(0))
      case 'endsWith':
        return s.endsWith(strArg(0))
      case 'compareTo':
      case 'compareToIgnoreCase': {
        let a = s
        let b = strArg(0)
        if (name === 'compareToIgnoreCase') {
          a = a.toLowerCase()
          b = b.toLowerCase()
        }
        const n = Math.min(a.length, b.length)
        for (let i = 0; i < n; i++) if (a.charCodeAt(i) !== b.charCodeAt(i)) return a.charCodeAt(i) - b.charCodeAt(i)
        return a.length - b.length
      }
      case 'concat': {
        const o = strArg(0)
        return o.length === 0 ? recv : new JStr(s + o)
      }
      case 'repeat': {
        const n = intArg(0)
        if (n < 0) throw new JavaThrow('IllegalArgumentException', `count is negative: ${n}`, line)
        if (n === 1) return recv
        return new JStr(s.repeat(n))
      }
      case 'replace': {
        const from = types[0] === 'char' ? String.fromCharCode(args[0] as number) : strArg(0)
        const to = types[1] === 'char' ? String.fromCharCode(args[1] as number) : strArg(1)
        return sameOrNew(s.split(from).join(to))
      }
      case 'hashCode': {
        let h = 0
        for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
        return h
      }
      case 'toString':
        return recv
    }
    throw new Error('Unhandled String method ' + name)
  }
}

export function isNumericType(t: string): boolean {
  return isNumeric(t)
}
