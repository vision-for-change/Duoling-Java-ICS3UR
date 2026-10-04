/**
 * Static checker for the sandbox: resolves names, computes static types,
 * folds constants and reports the same compile errors javac would for
 * beginner programs (type mismatches, uninitialized variables, unreachable code...).
 */
import type { CatchClause, ConstValue, Expr, MethodDecl, Program, Stmt, TypeRef, VarInfo, JType } from './ast'
import { CompileError, UnsupportedError, isExceptionType, isSubclassOf } from './errors'
import {
  arith,
  compare,
  constFits,
  convertPrim,
  INT_TYPES,
  isIntegral,
  isNumeric,
  isPrimitive,
  isReference,
  isWidening,
  javaToString,
  promote,
  promoteUnary,
  shift,
} from './values'

const JAVA_UTIL = new Set(['Scanner', 'Random', 'InputMismatchException', 'NoSuchElementException'])
const STATIC_CLASSES = new Set(['Math', 'System', 'Integer', 'Double', 'Long', 'String', 'Character', 'Boolean', 'Float', 'Short', 'Byte'])
const WRAPPER_TYPES = new Set(['Integer', 'Double', 'Long', 'Character', 'Boolean', 'Float', 'Short', 'Byte'])
const DECLARABLE = new Set(['int', 'double', 'boolean', 'char', 'long', 'float', 'short', 'byte', 'String', 'Scanner', 'Random', 'Object'])

interface Scope {
  vars: Map<string, VarInfo>
  parent: Scope | null
  /** method-level scope: duplicate-name checks stop here */
  isMethod: boolean
}

interface DA {
  set: Set<number>
  /** unreachable point: everything is vacuously definitely assigned */
  dead: boolean
}

interface LoopCtx {
  breakDAs: DA[]
  hasBreak: boolean
  hasContinue: boolean
  /** a switch takes `break` but not `continue` */
  isSwitch?: boolean
}

interface StmtResult {
  da: DA
  completes: boolean
}

export interface CheckedProgram {
  program: Program
  main: MethodDecl
  staticFields: VarInfo[]
}

const liveDA = (): DA => ({ set: new Set(), dead: false })
const deadDA = (): DA => ({ set: new Set(), dead: true })
const copyDA = (d: DA): DA => ({ set: new Set(d.set), dead: d.dead })
function mergeDA(a: DA, b: DA): DA {
  if (a.dead) return copyDA(b)
  if (b.dead) return copyDA(a)
  const set = new Set<number>()
  for (const id of a.set) if (b.set.has(id)) set.add(id)
  return { set, dead: false }
}
function mergeAll(list: DA[]): DA {
  if (list.length === 0) return deadDA()
  return list.reduce((acc, d) => mergeDA(acc, d))
}

function typeLabel(t: JType | undefined): string {
  if (!t) return '?'
  if (t === 'null') return '<null>'
  return t
}

function err(msg: string, node: { line: number; col: number }): never {
  throw new CompileError(msg, node.line, node.col)
}

function opPos(e: Expr): { line: number; col: number } {
  return { line: e.opLine ?? e.line, col: e.opCol ?? e.col }
}

export function checkProgram(program: Program): CheckedProgram {
  return new Checker(program).run()
}

class Checker {
  private program: Program
  private nextId = 1
  private classScope: Scope = { vars: new Map(), parent: null, isMethod: false }
  private scope: Scope = this.classScope
  private loops: LoopCtx[] = []
  private method: MethodDecl | null = null
  private staticContext = true
  private fieldStatic = new Map<number, boolean>()

  constructor(program: Program) {
    this.program = program
  }

  run(): CheckedProgram {
    const cls = this.program.cls
    const staticFields: VarInfo[] = []

    // --- fields
    for (const f of cls.fields) {
      const decl = f.decl
      this.checkTypeRef(decl.type)
      for (const d of decl.declarators) {
        if (this.classScope.vars.has(d.name)) err(`variable ${d.name} is already defined in class ${cls.name}`, d)
        const v: VarInfo = { id: this.nextId++, name: d.name, type: decl.type.name, isFinal: decl.isFinal, isField: true, line: d.line }
        d.v = v
        this.classScope.vars.set(d.name, v)
        this.fieldStatic.set(v.id, f.isStatic)
        if (f.isStatic) staticFields.push(v)
      }
    }
    for (const f of cls.fields) {
      this.staticContext = f.isStatic
      for (const d of f.decl.declarators) {
        if (d.init) {
          this.expr(d.init, liveDA())
          this.assignable(f.decl.type.name, d.init)
          if (d.v!.isFinal && d.init.cv !== undefined && (isPrimitive(d.v!.type) || d.v!.type === 'String')) {
            d.v!.constValue = this.coerceConst(d.init.cv, d.init.t!, d.v!.type)
          }
        } else if (f.decl.isFinal) {
          err(`variable ${d.name} not initialized in the default constructor`, d)
        }
      }
    }

    // --- methods: duplicate signatures
    const sigs = new Set<string>()
    for (const m of cls.methods) {
      const sig = `${m.name}(${m.params.map((p) => p.type.name + '[]'.repeat(p.type.dims)).join(',')})`
      if (sigs.has(sig)) err(`method ${sig} is already defined in class ${cls.name}`, m)
      sigs.add(sig)
    }

    for (const m of cls.methods) this.checkMethod(m)

    const main = cls.methods.find(
      (m) => m.name === 'main' && m.isStatic && m.params.length === 1 && m.params[0].type.name === 'String' && m.params[0].type.dims === 1,
    )
    if (!main) {
      throw new CompileError(
        `no main method found in class ${cls.name}. Add: public static void main(String[] args)`,
        cls.line,
        cls.col,
      )
    }
    return { program: this.program, main, staticFields }
  }

  // ---------------- helpers ----------------
  private checkTypeRef(t: TypeRef) {
    if (t.dims > 0) {
      // allowed only for String[] args
      if (!(t.name === 'String' && t.dims === 1)) throw new UnsupportedError('Arrays are not supported in the sandbox yet.', t.line, t.col)
      return
    }
    if (t.name === 'void') return
    if (WRAPPER_TYPES.has(t.name)) {
      throw new UnsupportedError(`Wrapper types like ${t.name} are not supported in the sandbox. Use the primitive type instead.`, t.line, t.col)
    }
    if (DECLARABLE.has(t.name) || isExceptionType(t.name)) {
      this.requireImport(t.name, t)
      return
    }
    err(`cannot find symbol\n  symbol:   class ${t.name}\n  location: class ${this.program.cls.name}`, t)
  }

  private requireImport(name: string, node: { line: number; col: number }) {
    if (this.program.isSnippet || !JAVA_UTIL.has(name)) return
    const ok = this.program.imports.some((i) => i.name === `java.util.${name}` || i.name === 'java.util.*')
    if (!ok) err(`cannot find symbol\n  symbol:   class ${name}\n  location: class ${this.program.cls.name}\n  (did you forget "import java.util.${name};" at the top?)`, node)
  }

  private lookup(name: string): VarInfo | null {
    let s: Scope | null = this.scope
    while (s) {
      const v = s.vars.get(name)
      if (v) return v
      s = s.parent
    }
    return null
  }

  private declare(name: string, type: JType, isFinal: boolean, node: { line: number; col: number }): VarInfo {
    let s: Scope | null = this.scope
    while (s) {
      if (s.vars.has(name)) {
        err(`variable ${name} is already defined in method ${this.methodSig()}`, node)
      }
      if (s.isMethod) break
      s = s.parent
    }
    const v: VarInfo = { id: this.nextId++, name, type, isFinal, isField: false, line: node.line }
    this.scope.vars.set(name, v)
    return v
  }

  private methodSig(): string {
    const m = this.method
    if (!m) return 'main(String[])'
    return `${m.name}(${m.params.map((p) => p.type.name + '[]'.repeat(p.type.dims)).join(',')})`
  }

  private pushScope(isMethod = false) {
    this.scope = { vars: new Map(), parent: this.scope, isMethod }
  }
  private popScope() {
    this.scope = this.scope.parent!
  }

  private isDA(da: DA, v: VarInfo): boolean {
    return v.isField || da.dead || da.set.has(v.id)
  }

  private coerceConst(cv: ConstValue, from: JType, to: JType): ConstValue {
    if (to === 'String' || from === 'String') return cv
    if (to === 'boolean') return cv
    return convertPrim(cv, from, to) as ConstValue
  }

  /** assignment conversion check (JLS 5.2) */
  private assignable(target: JType, e: Expr, at: { line: number; col: number } = e) {
    const s = e.t!
    if (s === target) return
    if (s === 'void') err(`incompatible types: void cannot be converted to ${target}`, at)
    if (isNumeric(target) && isNumeric(s)) {
      if (isWidening(s, target)) return
      if (e.cv !== undefined && INT_TYPES.has(s) && (target === 'byte' || target === 'short' || target === 'char') && constFits(e.cv as number, target)) return
      err(`incompatible types: possible lossy conversion from ${s} to ${target}`, at)
    }
    if (isReference(target)) {
      if (s === 'null') return
      if (target === 'Object' && s !== 'void') return
      if (isExceptionType(s) && isExceptionType(target) && isSubclassOf(s, target)) return
    }
    err(`incompatible types: ${typeLabel(s)} cannot be converted to ${target}`, at)
  }

  // ---------------- methods ----------------
  private checkMethod(m: MethodDecl) {
    this.method = m
    this.staticContext = m.isStatic
    this.checkTypeRef(m.returnType)
    this.pushScope(true)
    const da = liveDA()
    for (const p of m.params) {
      this.checkTypeRef(p.type)
      const v = this.declare(p.name, p.type.dims ? `${p.type.name}[]` : p.type.name, false, p)
      p.v = v
      da.set.add(v.id)
    }
    const r = this.block(m.body, da, false)
    if (m.returnType.name !== 'void' && r.completes) {
      const lines = this.program.source.slice(0, m.body.end).split('\n')
      throw new CompileError('missing return statement', lines.length, lines[lines.length - 1].length)
    }
    this.popScope()
    this.method = null
  }

  // ---------------- statements ----------------
  private block(b: Stmt & { kind: 'Block' }, da: DA, newScope = true): StmtResult {
    if (newScope) this.pushScope()
    let cur = da
    let completes = true
    for (const s of b.body) {
      if (!completes) err('unreachable statement', s)
      const r = this.stmt(s, cur)
      cur = r.da
      completes = r.completes
    }
    if (newScope) this.popScope()
    return { da: cur, completes }
  }

  private cond(e: Expr, da: DA): { t: DA; f: DA; after: DA } {
    const after = this.expr(e, da)
    if (e.t !== 'boolean') {
      if (e.kind === 'Assign' && e.op === '=') err(`incompatible types: ${typeLabel(e.t)} cannot be converted to boolean`, opPos(e))
      err(`incompatible types: ${typeLabel(e.t)} cannot be converted to boolean`, e)
    }
    return {
      t: e.cv === false ? deadDA() : copyDA(after),
      f: e.cv === true ? deadDA() : copyDA(after),
      after,
    }
  }

  private stmt(s: Stmt, da: DA): StmtResult {
    switch (s.kind) {
      case 'Block':
        return this.block(s, da)
      case 'Empty':
        return { da, completes: true }
      case 'VarDecl': {
        this.checkTypeRef(s.type)
        if (s.type.name === 'void') err("illegal start of expression", s.type)
        let cur = da
        for (const d of s.declarators) {
          const v = this.declare(d.name, s.type.name, s.isFinal, d)
          d.v = v
          if (d.init) {
            cur = this.expr(d.init, cur)
            this.assignable(s.type.name, d.init)
            cur = copyDA(cur)
            cur.set.add(v.id)
            if (s.isFinal && d.init.cv !== undefined && (isPrimitive(v.type) || v.type === 'String')) {
              v.constValue = this.coerceConst(d.init.cv, d.init.t!, v.type)
            }
          }
        }
        return { da: cur, completes: true }
      }
      case 'ExprStmt':
        return { da: this.expr(s.expr, da), completes: true }
      case 'If': {
        const c = this.cond(s.cond, da)
        const r1 = this.stmt(s.then, c.t)
        const r2 = s.else ? this.stmt(s.else, c.f) : { da: c.f, completes: true }
        return { da: mergeDA(r1.da, r2.da), completes: s.else ? r1.completes || r2.completes : true }
      }
      case 'While': {
        const c = this.cond(s.cond, da)
        if (s.cond.cv === false) err('unreachable statement', s.body)
        const ctx: LoopCtx = { breakDAs: [], hasBreak: false, hasContinue: false }
        this.loops.push(ctx)
        this.stmt(s.body, c.t)
        this.loops.pop()
        const infinite = s.cond.cv === true
        return {
          da: infinite ? mergeAll(ctx.breakDAs) : mergeAll([c.f, ...ctx.breakDAs]),
          completes: !infinite || ctx.hasBreak,
        }
      }
      case 'DoWhile': {
        const ctx: LoopCtx = { breakDAs: [], hasBreak: false, hasContinue: false }
        this.loops.push(ctx)
        const rb = this.stmt(s.body, da)
        this.loops.pop()
        const c = this.cond(s.cond, rb.da.dead && ctx.hasContinue ? da : rb.da)
        const infinite = s.cond.cv === true
        return {
          da: infinite ? mergeAll(ctx.breakDAs) : mergeAll([c.f, ...ctx.breakDAs]),
          completes: (!infinite && (rb.completes || ctx.hasContinue)) || ctx.hasBreak,
        }
      }
      case 'For': {
        this.pushScope()
        let cur = da
        for (const init of s.init) cur = this.stmt(init, cur).da
        let t = cur
        let f = cur
        if (s.cond) {
          const c = this.cond(s.cond, cur)
          t = c.t
          f = c.f
          if (s.cond.cv === false) err('unreachable statement', s.body)
        } else {
          f = deadDA()
        }
        const ctx: LoopCtx = { breakDAs: [], hasBreak: false, hasContinue: false }
        this.loops.push(ctx)
        const rb = this.stmt(s.body, t)
        this.loops.pop()
        let ud = rb.da.dead ? t : rb.da
        for (const u of s.update) ud = this.expr(u, ud)
        this.popScope()
        const infinite = !s.cond || s.cond.cv === true
        return {
          da: infinite ? mergeAll(ctx.breakDAs) : mergeAll([f, ...ctx.breakDAs]),
          completes: !infinite || ctx.hasBreak,
        }
      }
      case 'Switch': {
        const after = this.value(s.selector, da)
        const st = s.selector.t!
        if (!['int', 'char', 'short', 'byte', 'String'].includes(st)) {
          if (['long', 'float', 'double', 'boolean'].includes(st)) err(`selector type ${st} is not allowed`, s.selector)
          err(`incompatible types: ${typeLabel(st)} cannot be converted to int`, s.selector)
        }
        this.pushScope()
        const ctx: LoopCtx = { breakDAs: [], hasBreak: false, hasContinue: false, isSwitch: true }
        this.loops.push(ctx)
        const seen = new Set<string>()
        let last: StmtResult | null = null
        for (const c of s.cases) {
          if (c.label) {
            this.expr(c.label, copyDA(after))
            if (c.label.cv === undefined) err('constant expression required', c.label)
            this.assignable(st, c.label)
            const key = typeof c.label.cv + ':' + String(c.label.cv)
            if (seen.has(key)) err('duplicate case label', c.label)
            seen.add(key)
          }
          // every label is a way in, so the statements right after it are reachable
          let cur = copyDA(after)
          let completes = true
          for (const b of c.body) {
            if (!completes) err('unreachable statement', b)
            const r = this.stmt(b, cur)
            cur = r.da
            completes = r.completes
          }
          last = { da: cur, completes }
        }
        this.loops.pop()
        this.popScope()
        const ends: DA[] = [...ctx.breakDAs]
        if (last && last.completes) ends.push(last.da)
        if (!s.hasDefault) ends.push(copyDA(after))
        return {
          da: mergeAll(ends),
          completes: !s.hasDefault || ctx.hasBreak || !last || last.completes,
        }
      }
      case 'Break': {
        const ctx = this.loops[this.loops.length - 1]
        if (!ctx) err('break outside switch or loop', s)
        ctx.hasBreak = true
        ctx.breakDAs.push(copyDA(da))
        return { da: deadDA(), completes: false }
      }
      case 'Continue': {
        const ctx = [...this.loops].reverse().find((c) => !c.isSwitch)
        if (!ctx) err('continue outside of loop', s)
        ctx.hasContinue = true
        return { da: deadDA(), completes: false }
      }
      case 'Return': {
        const rt = this.method?.returnType.name ?? 'void'
        if (s.value) {
          if (rt === 'void') err('incompatible types: unexpected return value', s.value)
          const d = this.expr(s.value, da)
          this.assignable(rt, s.value)
          void d
        } else if (rt !== 'void') {
          err('missing return value', s)
        }
        return { da: deadDA(), completes: false }
      }
      case 'Throw': {
        this.expr(s.expr, da)
        if (!isExceptionType(s.expr.t!)) err(`incompatible types: ${typeLabel(s.expr.t)} cannot be converted to Throwable`, s.expr)
        return { da: deadDA(), completes: false }
      }
      case 'Try': {
        const r0 = this.block(s.block, copyDA(da))
        const results: StmtResult[] = [r0]
        const seen: string[] = []
        for (const c of s.catches) results.push(this.catchClause(c, da, seen))
        let merged = mergeAll(results.map((r) => r.da))
        let completes = results.some((r) => r.completes)
        if (s.finally) {
          const rf = this.block(s.finally, copyDA(da))
          if (!merged.dead) for (const id of rf.da.set) merged.set.add(id)
          if (!rf.completes) {
            merged = deadDA()
            completes = false
          }
        }
        return { da: merged, completes }
      }
    }
  }

  private catchClause(c: CatchClause, da: DA, seen: string[]): StmtResult {
    for (const t of c.types) {
      if (!isExceptionType(t)) {
        if (/^[A-Z]/.test(t) && t.endsWith('Exception')) {
          throw new UnsupportedError(`${t} is not available in the sandbox.`, c.line, c.col)
        }
        err(`cannot find symbol\n  symbol:   class ${t}`, c)
      }
      this.requireImport(t, c)
      for (const prev of seen) {
        if (isSubclassOf(t, prev)) err(`exception ${t} has already been caught`, c)
      }
    }
    seen.push(...c.types)
    this.pushScope()
    const type = c.types.length === 1 ? c.types[0] : 'Exception'
    const v = this.declare(c.name, type, false, c)
    c.v = v
    const d = copyDA(da)
    d.set.add(v.id)
    const r = this.block(c.body, d, false)
    this.popScope()
    return r
  }

  // ---------------- expressions ----------------
  /** Check an expression used as a value (not a bare class name). */
  private value(e: Expr, da: DA): DA {
    const r = this.expr(e, da)
    if (e.t === '#class') {
      const name = e.kind === 'Name' ? e.name : '?'
      err(`cannot find symbol\n  symbol:   variable ${name}`, e)
    }
    return r
  }

  expr(e: Expr, da: DA): DA {
    switch (e.kind) {
      case 'Literal':
        e.t = e.litType
        if (e.value !== null) e.cv = e.value
        return da
      case 'Paren': {
        const r = this.value(e.expr, da)
        e.t = e.expr.t
        e.cv = e.expr.cv
        return r
      }
      case 'Name': {
        const v = this.lookup(e.name)
        if (v) {
          e.v = v
          e.t = v.type
          if (v.constValue !== undefined) e.cv = v.constValue
          if (!this.isDA(da, v)) err(`variable ${e.name} might not have been initialized`, e)
          if (v.isField && this.staticContext && this.fieldStatic.get(v.id) === false) {
            err(`non-static variable ${e.name} cannot be referenced from a static context`, e)
          }
          return da
        }
        if (STATIC_CLASSES.has(e.name) || e.name === this.program.cls.name || e.name === 'Scanner' || e.name === 'Random' || isExceptionType(e.name)) {
          e.classRef = e.name
          e.t = '#class'
          return da
        }
        err(`cannot find symbol\n  symbol:   variable ${e.name}`, e)
        break
      }
      case 'Field':
        return this.field(e, da)
      case 'Call':
        return this.call(e, da)
      case 'New':
        return this.newExpr(e, da)
      case 'Unary':
        return this.unary(e, da)
      case 'Binary':
        return this.binary(e, da)
      case 'Assign':
        return this.assign(e, da)
      case 'Ternary': {
        const c = this.cond(e.cond, da)
        const d1 = this.value(e.then, c.t)
        const d2 = this.value(e.else, c.f)
        const a = e.then.t!
        const b = e.else.t!
        if (a === b) e.t = a
        else if (isNumeric(a) && isNumeric(b)) {
          if ((a === 'char' || a === 'short' || a === 'byte') && b === 'int' && e.else.cv !== undefined && constFits(e.else.cv as number, a)) e.t = a
          else if ((b === 'char' || b === 'short' || b === 'byte') && a === 'int' && e.then.cv !== undefined && constFits(e.then.cv as number, b)) e.t = b
          else e.t = promote(a, b)
        } else if (a === 'null' && isReference(b)) e.t = b
        else if (b === 'null' && isReference(a)) e.t = a
        else if (a === 'void' || b === 'void') err("'void' type not allowed here", e)
        else e.t = 'Object'
        if (e.cond.cv !== undefined && e.then.cv !== undefined && e.else.cv !== undefined && e.t !== 'Object') {
          const chosen = e.cond.cv ? e.then : e.else
          e.cv = this.coerceConst(chosen.cv!, chosen.t!, e.t)
        }
        return e.cond.cv === true ? d1 : e.cond.cv === false ? d2 : mergeDA(d1, d2)
      }
      case 'Cast': {
        const r = this.value(e.expr, da)
        const from = e.expr.t!
        const to = e.typeName
        const ok =
          (isNumeric(from) && isNumeric(to)) ||
          (from === 'boolean' && to === 'boolean') ||
          (to === 'String' && (from === 'String' || from === 'null' || from === 'Object'))
        if (!ok) err(`incompatible types: ${typeLabel(from)} cannot be converted to ${to}`, e)
        e.t = to
        if (e.expr.cv !== undefined && to !== 'String') e.cv = this.coerceConst(e.expr.cv, from, to)
        else if (e.expr.cv !== undefined) e.cv = e.expr.cv
        return r
      }
    }
    return da
  }

  private field(e: Expr & { kind: 'Field' }, da: DA): DA {
    const pos = { line: e.nameLine ?? e.line, col: e.nameCol ?? e.col }
    const target = e.target
    if (target.kind === 'Name' && !this.lookup(target.name) && !STATIC_CLASSES.has(target.name) && target.name !== this.program.cls.name && !isExceptionType(target.name) && target.name !== 'Scanner') {
      err(`package ${target.name} does not exist`, pos)
    }
    const r = this.expr(target, da)
    if (target.t === '#class' && target.kind === 'Name') {
      const cls = target.classRef!
      const key = `${cls}.${e.name}`
      const constants: Record<string, [JType, ConstValue | undefined]> = {
        'Math.PI': ['double', Math.PI],
        'Math.E': ['double', Math.E],
        'Integer.MAX_VALUE': ['int', 2147483647],
        'Integer.MIN_VALUE': ['int', -2147483648],
        'Long.MAX_VALUE': ['long', (1n << 63n) - 1n],
        'Long.MIN_VALUE': ['long', -(1n << 63n)],
        'Double.MAX_VALUE': ['double', Number.MAX_VALUE],
        'Double.MIN_VALUE': ['double', Number.MIN_VALUE],
        'Double.POSITIVE_INFINITY': ['double', Infinity],
        'Double.NEGATIVE_INFINITY': ['double', -Infinity],
        'Double.NaN': ['double', NaN],
        'Short.MAX_VALUE': ['short', 32767],
        'Short.MIN_VALUE': ['short', -32768],
        'Byte.MAX_VALUE': ['byte', 127],
        'Byte.MIN_VALUE': ['byte', -128],
        'Character.MAX_VALUE': ['char', 0xffff],
        'Character.MIN_VALUE': ['char', 0],
        'System.out': ['PrintStream', undefined],
        'System.err': ['PrintStream', undefined],
        'System.in': ['InputStream', undefined],
      }
      const c = constants[key]
      if (c) {
        e.staticKey = key
        e.t = c[0]
        if (c[1] !== undefined) e.cv = c[1]
        return r
      }
      if (cls === this.program.cls.name) {
        const v = this.classScope.vars.get(e.name)
        if (v) {
          e.v = v
          e.t = v.type
          if (v.constValue !== undefined) e.cv = v.constValue
          if (this.staticContext && this.fieldStatic.get(v.id) === false) err(`non-static variable ${e.name} cannot be referenced from a static context`, pos)
          return r
        }
      }
      err(`cannot find symbol\n  symbol:   variable ${e.name}\n  location: class ${cls}`, pos)
    }
    if (isPrimitive(target.t)) err(`${target.t} cannot be dereferenced`, pos)
    err(`cannot find symbol\n  symbol:   variable ${e.name}\n  location: ${target.t === 'PrintStream' ? 'variable out of type PrintStream' : `class ${typeLabel(target.t)}`}`, pos)
  }

  private newExpr(e: Expr & { kind: 'New' }, da: DA): DA {
    let cur = da
    for (const a of e.args) cur = this.value(a, cur)
    const types = e.args.map((a) => a.t!)
    const name = e.typeName
    if (WRAPPER_TYPES.has(name)) throw new UnsupportedError(`Wrapper types like ${name} are not supported in the sandbox.`, e.line, e.col)
    this.requireImport(name, e)
    const bad = (): never => err(`no suitable constructor found for ${name}(${types.map(typeLabel).join(',')})`, e)
    if (name === 'Scanner') {
      if (types.length !== 1 || !(types[0] === 'InputStream' || types[0] === 'String')) bad()
    } else if (name === 'Random') {
      if (types.length > 1 || (types.length === 1 && !isIntegral(types[0]))) bad()
    } else if (name === 'String') {
      if (types.length > 1 || (types.length === 1 && types[0] !== 'String')) bad()
    } else if (isExceptionType(name)) {
      if (types.length > 1 || (types.length === 1 && types[0] !== 'String' && types[0] !== 'null')) bad()
    } else if (name === 'Object') {
      throw new UnsupportedError('Objects are not supported in the sandbox yet.', e.line, e.col)
    } else {
      err(`cannot find symbol\n  symbol:   class ${name}`, e)
    }
    e.t = name
    return cur
  }

  private unary(e: Expr & { kind: 'Unary' }, da: DA): DA {
    const op = e.op
    if (op === '++' || op === '--') {
      const target = e.operand
      const r = this.value(target, da)
      const v = this.varOf(target)
      if (!v) err(`unexpected type\n  required: variable\n  found:    value`, e)
      if (!isNumeric(target.t)) err(`bad operand type ${typeLabel(target.t)} for unary operator '${op}'`, e)
      if (v.isFinal) err(`cannot assign a value to final variable ${v.name}`, e)
      e.t = target.t
      return r
    }
    const r = this.value(e.operand, da)
    const t = e.operand.t!
    if (op === '!') {
      if (t !== 'boolean') err(`bad operand type ${typeLabel(t)} for unary operator '!'`, e)
      e.t = 'boolean'
      if (e.operand.cv !== undefined) e.cv = !e.operand.cv
      return r
    }
    if (op === '~') {
      if (!isIntegral(t)) err(`bad operand type ${typeLabel(t)} for unary operator '~'`, e)
      e.t = promoteUnary(t)
      if (e.operand.cv !== undefined) {
        const v = convertPrim(e.operand.cv, t, e.t)
        e.cv = e.t === 'long' ? ~(v as bigint) : ~(v as number)
      }
      return r
    }
    // + / -
    if (!isNumeric(t)) err(`bad operand type ${typeLabel(t)} for unary operator '${op}'`, e)
    e.t = promoteUnary(t)
    if (e.operand.cv !== undefined) {
      const v = convertPrim(e.operand.cv, t, e.t)
      if (op === '+') e.cv = v as ConstValue
      else e.cv = (e.t === 'long' ? BigInt.asIntN(64, -(v as bigint)) : e.t === 'int' ? -(v as number) | 0 : -(v as number)) as ConstValue
    }
    return r
  }

  private binary(e: Expr & { kind: 'Binary' }, da: DA): DA {
    const op = e.op
    const L = e.left
    const R = e.right
    const at = opPos(e)
    const badOps = (): never =>
      err(`bad operand types for binary operator '${op}'\n  first type:  ${typeLabel(L.t)}\n  second type: ${typeLabel(R.t)}`, at)

    if (op === '&&' || op === '||') {
      const c = this.cond2(L, da)
      const rightDA = op === '&&' ? c.t : c.f
      this.value(R, rightDA)
      if (L.t !== 'boolean' || R.t !== 'boolean') badOps()
      e.t = 'boolean'
      if (L.cv !== undefined && R.cv !== undefined) e.cv = op === '&&' ? (L.cv as boolean) && (R.cv as boolean) : (L.cv as boolean) || (R.cv as boolean)
      return c.after
    }

    let cur = this.value(L, da)
    cur = this.value(R, cur)
    const a = L.t!
    const b = R.t!
    if (a === 'void' || b === 'void') err("'void' type not allowed here", at)

    if (op === '+' && (a === 'String' || b === 'String')) {
      e.t = 'String'
      e.opType = 'String'
      if (L.cv !== undefined && R.cv !== undefined) e.cv = javaToString(L.cv, a) + javaToString(R.cv, b)
      return cur
    }

    switch (op) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%': {
        if (!isNumeric(a) || !isNumeric(b)) badOps()
        const t = promote(a, b)
        e.t = t
        e.opType = t
        this.fold(e, () => arith(op, convertPrim(L.cv, a, t), convertPrim(R.cv, b, t), t))
        return cur
      }
      case '<':
      case '>':
      case '<=':
      case '>=': {
        if (!isNumeric(a) || !isNumeric(b)) badOps()
        const t = promote(a, b)
        e.t = 'boolean'
        e.opType = t
        this.fold(e, () => compare(op, convertPrim(L.cv, a, t), convertPrim(R.cv, b, t)))
        return cur
      }
      case '==':
      case '!=': {
        e.t = 'boolean'
        if (isNumeric(a) && isNumeric(b)) {
          const t = promote(a, b)
          e.opType = t
          this.fold(e, () => compare(op, convertPrim(L.cv, a, t), convertPrim(R.cv, b, t)))
        } else if (a === 'boolean' && b === 'boolean') {
          e.opType = 'boolean'
          this.fold(e, () => (op === '==' ? L.cv === R.cv : L.cv !== R.cv))
        } else if (isReference(a) && isReference(b)) {
          const related =
            a === b || a === 'null' || b === 'null' || a === 'Object' || b === 'Object' ||
            (isExceptionType(a) && isExceptionType(b) && (isSubclassOf(a, b) || isSubclassOf(b, a)))
          if (!related) err(`incomparable types: ${typeLabel(a)} and ${typeLabel(b)}`, at)
          e.opType = 'ref'
        } else if ((a === 'boolean' && isNumeric(b)) || (b === 'boolean' && isNumeric(a))) {
          err(`incomparable types: ${typeLabel(a)} and ${typeLabel(b)}`, at)
        } else {
          badOps()
        }
        return cur
      }
      case '&':
      case '|':
      case '^': {
        if (a === 'boolean' && b === 'boolean') {
          e.t = 'boolean'
          e.opType = 'boolean'
          this.fold(e, () => arith(op, L.cv, R.cv, 'boolean'))
          return cur
        }
        if (!isIntegral(a) || !isIntegral(b)) badOps()
        const t = promote(a, b)
        e.t = t
        e.opType = t
        this.fold(e, () => arith(op, convertPrim(L.cv, a, t), convertPrim(R.cv, b, t), t))
        return cur
      }
      case '<<':
      case '>>':
      case '>>>': {
        if (!isIntegral(a) || !isIntegral(b)) badOps()
        const t = promoteUnary(a)
        e.t = t
        e.opType = t
        this.fold(e, () => shift(op, convertPrim(L.cv, a, t), R.cv, t, promoteUnary(b)))
        return cur
      }
    }
    return badOps()
  }

  /** like cond() but without the boolean requirement (reported by caller with operator message) */
  private cond2(e: Expr, da: DA): { t: DA; f: DA; after: DA } {
    const after = this.value(e, da)
    return {
      t: e.cv === false ? deadDA() : copyDA(after),
      f: e.cv === true ? deadDA() : copyDA(after),
      after,
    }
  }

  private fold(e: Expr, compute: () => unknown) {
    const L = (e as { left: Expr }).left
    const R = (e as { right: Expr }).right
    if (L.cv === undefined || R.cv === undefined) return
    try {
      e.cv = compute() as ConstValue
    } catch {
      // e.g. division by zero: not a constant, fails at runtime instead
    }
  }

  private varOf(target: Expr): VarInfo | null {
    if (target.kind === 'Name' && target.v) return target.v
    if (target.kind === 'Field' && target.v) return target.v
    if (target.kind === 'Paren') return this.varOf(target.expr)
    return null
  }

  private assign(e: Expr & { kind: 'Assign' }, da: DA): DA {
    const target = e.target
    const at = opPos(e)
    // Resolve target without the definite-assignment read check for plain '='
    let v: VarInfo | null = null
    if (target.kind === 'Name') {
      v = this.lookup(target.name)
      if (!v) {
        if (STATIC_CLASSES.has(target.name)) err(`unexpected type\n  required: variable\n  found:    class`, target)
        err(`cannot find symbol\n  symbol:   variable ${target.name}`, target)
      }
      target.v = v
      target.t = v.type
      if (v.isField && this.staticContext && this.fieldStatic.get(v.id) === false) {
        err(`non-static variable ${target.name} cannot be referenced from a static context`, target)
      }
    } else if (target.kind === 'Field') {
      this.expr(target, da)
      v = target.v ?? null
      if (!v) {
        if (target.staticKey) err(`cannot assign a value to final variable ${target.name}`, target)
        err(`unexpected type\n  required: variable\n  found:    value`, target)
      }
    } else {
      this.expr(target, da)
      err(`unexpected type\n  required: variable\n  found:    value`, target)
    }

    const assignedBefore = this.isDA(da, v)
    if (e.op !== '=' && !assignedBefore) err(`variable ${v.name} might not have been initialized`, target)

    let cur = this.value(e.value, da)
    const tt = v.type
    const vt = e.value.t!

    if (v.isFinal && (v.isField || assignedBefore)) err(`cannot assign a value to final variable ${v.name}`, target)

    if (e.op === '=') {
      this.assignable(tt, e.value, e.value)
    } else {
      const bop = e.op.slice(0, -1)
      if (vt === 'void') err("'void' type not allowed here", e.value)
      if (bop === '+' && tt === 'String') {
        e.opType = 'String'
      } else if (['+', '-', '*', '/', '%'].includes(bop)) {
        if (!isNumeric(tt) || !isNumeric(vt)) err(`bad operand types for binary operator '${bop}'\n  first type:  ${typeLabel(tt)}\n  second type: ${typeLabel(vt)}`, at)
        e.opType = promote(tt, vt)
      } else if (['&', '|', '^'].includes(bop)) {
        if (tt === 'boolean' && vt === 'boolean') e.opType = 'boolean'
        else if (isIntegral(tt) && isIntegral(vt)) e.opType = promote(tt, vt)
        else err(`bad operand types for binary operator '${bop}'\n  first type:  ${typeLabel(tt)}\n  second type: ${typeLabel(vt)}`, at)
      } else {
        if (!isIntegral(tt) || !isIntegral(vt)) err(`bad operand types for binary operator '${bop}'`, at)
        e.opType = promoteUnary(tt)
      }
    }
    e.t = tt
    if (!v.isField) {
      cur = copyDA(cur)
      cur.set.add(v.id)
    }
    return cur
  }

  // ---------------- method calls ----------------
  private call(e: Expr & { kind: 'Call' }, da: DA): DA {
    const pos = { line: e.nameLine ?? e.line, col: e.nameCol ?? e.col }
    let cur = da
    let owner: string | null = null // static owner class
    let recvType: JType | null = null

    if (e.target) {
      const t = e.target
      if (t.kind === 'Name' && !this.lookup(t.name) && !STATIC_CLASSES.has(t.name) && t.name !== this.program.cls.name && t.name !== 'Scanner' && !isExceptionType(t.name)) {
        err(`cannot find symbol\n  symbol:   variable ${t.name}`, t)
      }
      cur = this.expr(t, cur)
      if (t.t === '#class' && t.kind === 'Name') owner = t.classRef!
      else recvType = t.t!
    }

    for (const a of e.args) cur = this.value(a, cur)
    const argTypes = e.args.map((a) => a.t!)
    const argList = argTypes.map(typeLabel).join(',')
    const notFound = (loc?: string): never =>
      err(`cannot find symbol\n  symbol:   method ${e.name}(${argList})${loc ? `\n  location: ${loc}` : ''}`, pos)

    // user-defined static methods
    if (!e.target || owner === this.program.cls.name) {
      const candidates = this.program.cls.methods.filter((m) => m.name === e.name)
      if (candidates.length === 0) notFound(`class ${this.program.cls.name}`)
      const applicable = candidates.filter(
        (m) => m.params.length === argTypes.length && m.params.every((p, i) => this.canAssign(p.type.dims ? p.type.name + '[]' : p.type.name, e.args[i])),
      )
      if (applicable.length === 0) {
        const m = candidates[0]
        err(
          `method ${e.name} in class ${this.program.cls.name} cannot be applied to given types;\n  required: ${m.params.map((p) => p.type.name).join(',') || 'no arguments'}\n  found:    ${argList || 'no arguments'}`,
          pos,
        )
      }
      const exact = applicable.find((m) => m.params.every((p, i) => p.type.name === argTypes[i]))
      const m = exact ?? applicable[0]
      if (!m.isStatic && this.staticContext) {
        err(`non-static method ${m.name}(${m.params.map((p) => p.type.name).join(',')}) cannot be referenced from a static context`, pos)
      }
      e.resolved = { kind: 'user', method: m }
      e.t = m.returnType.name
      return cur
    }

    const set = (key: string, ret: JType) => {
      e.resolved = { kind: 'builtin', key }
      e.t = ret
      return cur
    }
    const n = argTypes.length
    const expectArgs = (count: number, required: string) => {
      if (n !== count) {
        err(`method ${e.name} in class ${owner ?? recvType} cannot be applied to given types;\n  required: ${required}\n  found:    ${argList || 'no arguments'}`, pos)
      }
    }
    const numArg = (i: number, to: JType = 'double') => {
      if (!isNumeric(argTypes[i]) || !(argTypes[i] === to || isWidening(argTypes[i], to))) {
        err(`incompatible types: ${typeLabel(argTypes[i])} cannot be converted to ${to}`, e.args[i])
      }
    }
    const strArg = (i: number) => {
      if (argTypes[i] !== 'String' && argTypes[i] !== 'null') err(`incompatible types: ${typeLabel(argTypes[i])} cannot be converted to String`, e.args[i])
    }
    const intArg = (i: number) => numArg(i, 'int')
    const charArg = (i: number) => {
      if (!(argTypes[i] === 'char' || (argTypes[i] === 'int' && e.args[i].cv !== undefined) || argTypes[i] === 'int')) {
        err(`incompatible types: ${typeLabel(argTypes[i])} cannot be converted to char`, e.args[i])
      }
    }

    if (owner) {
      const key = `${owner}.${e.name}`
      switch (key) {
        case 'Math.abs': {
          expectArgs(1, 'int')
          if (!isNumeric(argTypes[0])) err(`no suitable method found for abs(${argList})`, pos)
          return set(key, promoteUnary(argTypes[0]))
        }
        case 'Math.max':
        case 'Math.min': {
          expectArgs(2, 'int,int')
          if (!isNumeric(argTypes[0]) || !isNumeric(argTypes[1])) err(`no suitable method found for ${e.name}(${argList})`, pos)
          return set(key, promote(argTypes[0], argTypes[1]))
        }
        case 'Math.pow':
        case 'Math.atan2':
        case 'Math.hypot':
          expectArgs(2, 'double,double')
          numArg(0)
          numArg(1)
          return set(key, 'double')
        case 'Math.sqrt':
        case 'Math.cbrt':
        case 'Math.floor':
        case 'Math.ceil':
        case 'Math.rint':
        case 'Math.exp':
        case 'Math.log':
        case 'Math.log10':
        case 'Math.sin':
        case 'Math.cos':
        case 'Math.tan':
        case 'Math.asin':
        case 'Math.acos':
        case 'Math.atan':
        case 'Math.toRadians':
        case 'Math.toDegrees':
          expectArgs(1, 'double')
          numArg(0)
          return set(key, 'double')
        case 'Math.signum':
          expectArgs(1, 'double')
          numArg(0)
          return set(key, argTypes[0] === 'float' ? 'float' : 'double')
        case 'Math.round':
          expectArgs(1, 'double')
          if (!isNumeric(argTypes[0])) err(`no suitable method found for round(${argList})`, pos)
          return set(key, argTypes[0] === 'double' ? 'long' : 'int')
        case 'Math.random':
          expectArgs(0, 'no arguments')
          return set(key, 'double')
        case 'Math.floorDiv':
        case 'Math.floorMod': {
          expectArgs(2, 'int,int')
          if (!isIntegral(argTypes[0]) || !isIntegral(argTypes[1])) err(`no suitable method found for ${e.name}(${argList})`, pos)
          return set(key, promote(argTypes[0], argTypes[1]))
        }
        case 'Integer.parseInt':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'int')
        case 'Integer.valueOf':
          expectArgs(1, 'String')
          if (argTypes[0] !== 'String' && !INT_TYPES.has(argTypes[0])) strArg(0)
          return set(key, 'int')
        case 'Integer.toString':
        case 'Integer.toBinaryString':
        case 'Integer.toHexString':
          expectArgs(1, 'int')
          intArg(0)
          return set(key, 'String')
        case 'Integer.max':
        case 'Integer.min':
        case 'Integer.sum':
          expectArgs(2, 'int,int')
          intArg(0)
          intArg(1)
          return set(key, 'int')
        case 'Double.parseDouble':
        case 'Double.valueOf':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'double')
        case 'Double.toString':
          expectArgs(1, 'double')
          numArg(0)
          return set(key, 'String')
        case 'Double.isNaN':
          expectArgs(1, 'double')
          numArg(0)
          return set(key, 'boolean')
        case 'Long.parseLong':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'long')
        case 'Boolean.parseBoolean':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'boolean')
        case 'String.valueOf':
          expectArgs(1, 'Object')
          return set(key, 'String')
        case 'String.format':
          if (n < 1) expectArgs(1, 'String,Object...')
          strArg(0)
          return set(key, 'String')
        case 'Character.isDigit':
        case 'Character.isLetter':
        case 'Character.isLetterOrDigit':
        case 'Character.isUpperCase':
        case 'Character.isLowerCase':
        case 'Character.isWhitespace':
          expectArgs(1, 'char')
          charArg(0)
          return set(key, 'boolean')
        case 'Character.toUpperCase':
        case 'Character.toLowerCase':
          expectArgs(1, 'char')
          charArg(0)
          return set(key, argTypes[0] === 'char' ? 'char' : 'int')
        case 'Character.getNumericValue':
          expectArgs(1, 'char')
          charArg(0)
          return set(key, 'int')
        case 'System.exit':
          expectArgs(1, 'int')
          intArg(0)
          return set(key, 'void')
        case 'System.currentTimeMillis':
        case 'System.nanoTime':
          expectArgs(0, 'no arguments')
          return set(key, 'long')
      }
      if (owner === 'System' && (e.name === 'println' || e.name === 'print' || e.name === 'printf')) {
        err(`cannot find symbol\n  symbol:   method ${e.name}(${argList})\n  location: class System\n  (did you mean System.out.${e.name}?)`, pos)
      }
      notFound(`class ${owner}`)
    }

    const rt = recvType!
    if (isPrimitive(rt)) err(`${rt} cannot be dereferenced`, pos)
    if (rt === 'null') err('<null> cannot be dereferenced', pos)
    const key = `${rt}.${e.name}`

    if (rt === 'PrintStream') {
      switch (e.name) {
        case 'println':
          if (n > 1) err(`no suitable method found for println(${argList})\n  (use + to join values, e.g. println(a + " " + b))`, pos)
          if (n === 1 && argTypes[0] === 'void') err("'void' type not allowed here", e.args[0])
          return set('out.println', 'void')
        case 'print':
          if (n !== 1) err(`no suitable method found for print(${argList || 'no arguments'})`, pos)
          if (argTypes[0] === 'void') err("'void' type not allowed here", e.args[0])
          return set('out.print', 'void')
        case 'printf':
        case 'format':
          if (n < 1) err(`no suitable method found for ${e.name}(no arguments)`, pos)
          if (argTypes[0] !== 'String') err(`incompatible types: ${typeLabel(argTypes[0])} cannot be converted to String`, e.args[0])
          for (let i = 1; i < n; i++) if (argTypes[i] === 'void') err("'void' type not allowed here", e.args[i])
          return set('out.printf', 'PrintStream')
        case 'flush':
          return set('out.flush', 'void')
      }
      notFound('variable out of type PrintStream')
    }

    if (rt === 'String') {
      switch (e.name) {
        case 'length':
        case 'hashCode':
          expectArgs(0, 'no arguments')
          return set(key, 'int')
        case 'isEmpty':
        case 'isBlank':
          expectArgs(0, 'no arguments')
          return set(key, 'boolean')
        case 'toUpperCase':
        case 'toLowerCase':
        case 'trim':
        case 'strip':
          expectArgs(0, 'no arguments')
          return set(key, 'String')
        case 'charAt':
          expectArgs(1, 'int')
          intArg(0)
          return set(key, 'char')
        case 'equals':
          expectArgs(1, 'Object')
          return set(key, 'boolean')
        case 'equalsIgnoreCase':
        case 'contains':
        case 'startsWith':
        case 'endsWith':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'boolean')
        case 'compareTo':
        case 'compareToIgnoreCase':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'int')
        case 'concat':
          expectArgs(1, 'String')
          strArg(0)
          return set(key, 'String')
        case 'repeat':
          expectArgs(1, 'int')
          intArg(0)
          return set(key, 'String')
        case 'substring':
          if (n !== 1 && n !== 2) expectArgs(1, 'int')
          for (let i = 0; i < n; i++) intArg(i)
          return set(key, 'String')
        case 'indexOf':
        case 'lastIndexOf':
          if (n !== 1 && n !== 2) expectArgs(1, 'String')
          if (argTypes[0] !== 'String' && argTypes[0] !== 'char' && argTypes[0] !== 'int') strArg(0)
          if (n === 2) intArg(1)
          return set(key, 'int')
        case 'replace':
          expectArgs(2, 'char,char')
          if (!((argTypes[0] === 'char' && argTypes[1] === 'char') || (argTypes[0] === 'String' && argTypes[1] === 'String'))) {
            err(`no suitable method found for replace(${argList})`, pos)
          }
          return set(key, 'String')
        case 'toString':
          expectArgs(0, 'no arguments')
          return set(key, 'String')
      }
      notFound(`variable of type String`)
    }

    if (rt === 'Scanner') {
      const ret: Record<string, JType> = {
        nextInt: 'int',
        nextDouble: 'double',
        nextLong: 'long',
        nextBoolean: 'boolean',
        next: 'String',
        nextLine: 'String',
        hasNextInt: 'boolean',
        hasNextDouble: 'boolean',
        hasNextLong: 'boolean',
        hasNextBoolean: 'boolean',
        hasNext: 'boolean',
        hasNextLine: 'boolean',
        close: 'void',
      }
      if (ret[e.name]) {
        expectArgs(0, 'no arguments')
        return set(key, ret[e.name])
      }
      notFound('variable of type Scanner')
    }

    if (rt === 'Random') {
      if (e.name === 'nextInt') {
        if (n > 2) expectArgs(1, 'int')
        for (let i = 0; i < n; i++) intArg(i)
        return set(key, 'int')
      }
      if (e.name === 'nextDouble' || e.name === 'nextBoolean') {
        expectArgs(0, 'no arguments')
        return set(key, e.name === 'nextDouble' ? 'double' : 'boolean')
      }
      notFound('variable of type Random')
    }

    if (isExceptionType(rt)) {
      if (e.name === 'getMessage' || e.name === 'toString' || e.name === 'getLocalizedMessage') {
        expectArgs(0, 'no arguments')
        return set(`Exception.${e.name === 'toString' ? 'toString' : 'getMessage'}`, 'String')
      }
      if (e.name === 'printStackTrace') {
        expectArgs(0, 'no arguments')
        return set('Exception.printStackTrace', 'void')
      }
      notFound(`variable of type ${rt}`)
    }

    if (rt === 'Object') {
      if (e.name === 'toString') return set('Object.toString', 'String')
      if (e.name === 'equals') return set('Object.equals', 'boolean')
    }
    return notFound(`class ${typeLabel(rt)}`)
  }

  /** assignability test without throwing */
  private canAssign(target: JType, e: Expr): boolean {
    try {
      this.assignable(target, e)
      return true
    } catch {
      return false
    }
  }
}
