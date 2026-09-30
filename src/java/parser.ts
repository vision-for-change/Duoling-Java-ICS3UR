import type {
  CatchClause,
  ClassDecl,
  Declarator,
  Expr,
  FieldDecl,
  MethodDecl,
  Param,
  Program,
  Stmt,
  TypeRef,
} from './ast'
import { CompileError, UnsupportedError } from './errors'
import { tokenize, type Token } from './lexer'

const PRIMITIVES = new Set(['int', 'double', 'boolean', 'char', 'long', 'float', 'short', 'byte'])
const MODIFIERS = new Set(['public', 'private', 'protected', 'static', 'final', 'abstract'])
const ASSIGN_OPS = new Set(['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>='])

const BINARY_PRECEDENCE: Record<string, number> = {
  '||': 1,
  '&&': 2,
  '|': 3,
  '^': 4,
  '&': 5,
  '==': 6,
  '!=': 6,
  '<': 7,
  '>': 7,
  '<=': 7,
  '>=': 7,
  '<<': 8,
  '>>': 8,
  '>>>': 8,
  '+': 9,
  '-': 9,
  '*': 10,
  '/': 10,
  '%': 10,
}

type Block = Stmt & { kind: 'Block' }

export function parseProgram(source: string): Program {
  const p = new Parser(source)
  return p.parseProgram()
}

class Parser {
  private toks: Token[]
  private i = 0
  private source: string

  constructor(source: string) {
    this.source = source
    this.toks = tokenize(source)
  }

  // ---------- token helpers ----------
  private get cur(): Token {
    return this.toks[this.i]
  }
  private peek(k = 1): Token {
    return this.toks[Math.min(this.i + k, this.toks.length - 1)]
  }
  private get prev(): Token {
    return this.toks[Math.max(this.i - 1, 0)]
  }
  private advance(): Token {
    const t = this.toks[this.i]
    if (this.i < this.toks.length - 1) this.i++
    return t
  }
  private is(value: string): boolean {
    const t = this.cur
    return (t.kind === 'op' || t.kind === 'keyword') && t.value === value
  }
  private isAt(k: number, value: string): boolean {
    const t = this.peek(k)
    return (t.kind === 'op' || t.kind === 'keyword') && t.value === value
  }
  private accept(value: string): boolean {
    if (this.is(value)) {
      this.advance()
      return true
    }
    return false
  }
  private fail(msg: string, tok: Token = this.cur): never {
    if (tok.kind === 'eof') throw new CompileError('reached end of file while parsing', tok.line, tok.col)
    throw new CompileError(msg, tok.line, tok.col)
  }
  /** javac reports "X expected" just after the previous token. */
  private failAfterPrev(msg: string): never {
    if (this.cur.kind === 'eof' && msg !== "';' expected") {
      throw new CompileError('reached end of file while parsing', this.cur.line, this.cur.col)
    }
    const p = this.prev
    const lines = this.source.slice(0, p.end).split('\n')
    throw new CompileError(msg, lines.length, lines[lines.length - 1].length + 1)
  }
  private expect(value: string, msg?: string): Token {
    if (this.is(value)) return this.advance()
    if (value === ';' || value === ')' || value === ']') this.failAfterPrev(msg ?? `'${value}' expected`)
    return this.fail(msg ?? `'${value}' expected`)
  }
  private expectIdent(): Token {
    if (this.cur.kind === 'ident') return this.advance()
    return this.fail('<identifier> expected')
  }
  private unsupported(what: string, tok: Token = this.cur): never {
    throw new UnsupportedError(what, tok.line, tok.col)
  }
  private pos(t: Token) {
    return { line: t.line, col: t.col, start: t.start, end: t.end }
  }
  private finish<T extends { end: number }>(node: T): T {
    node.end = this.prev.end
    return node
  }

  // ---------- program ----------
  parseProgram(): Program {
    const imports: Program['imports'] = []
    if (this.is('package')) {
      while (!this.is(';') && this.cur.kind !== 'eof') this.advance()
      this.expect(';')
    }
    while (this.is('import')) {
      const t = this.advance()
      let name = ''
      this.accept('static')
      while (!this.is(';') && this.cur.kind !== 'eof') {
        name += this.advance().value
      }
      this.expect(';')
      imports.push({ name, line: t.line, col: t.col })
    }

    if (this.looksLikeClass()) {
      const cls = this.parseClass()
      if (this.cur.kind !== 'eof') {
        if (this.looksLikeClass()) this.unsupported('Only one class per program is supported in the sandbox.')
        this.fail('class, interface, enum, or record expected')
      }
      return { imports, cls, isSnippet: false, source: this.source }
    }

    // Methods written without a surrounding class (e.g. just `public static void main(...) {...}`)
    if (this.looksLikeTopLevelMethod()) {
      const first = this.cur
      const cls = this.parseClassBody('Main', first, true)
      return { imports, cls, isSnippet: true, source: this.source }
    }

    // Snippet: bare statements, wrapped in `public static void main(String[] args)`
    const first = this.cur
    const body: Stmt[] = []
    while (this.cur.kind !== 'eof') {
      if (this.is('}')) this.fail('class, interface, enum, or record expected')
      body.push(this.parseStatement())
    }
    const block: Block = { kind: 'Block', body, ...this.pos(first), end: this.prev.end }
    const main: MethodDecl = {
      name: 'main',
      isStatic: true,
      returnType: { name: 'void', dims: 0, ...this.pos(first) },
      params: [{ type: { name: 'String', dims: 1, ...this.pos(first) }, name: 'args', ...this.pos(first) }],
      body: block,
      ...this.pos(first),
    }
    const cls: ClassDecl = { name: 'Main', fields: [], methods: [main], ...this.pos(first) }
    return { imports, cls, isSnippet: true, source: this.source }
  }

  private looksLikeClass(): boolean {
    let k = 0
    while (this.peek(k).kind === 'keyword' && MODIFIERS.has(this.peek(k).value)) k++
    const t = this.peek(k)
    if (t.kind === 'keyword' && (t.value === 'interface' || t.value === 'enum')) return true
    if (t.kind === 'ident' && t.value === 'record') return true
    return t.kind === 'keyword' && t.value === 'class'
  }

  private looksLikeTopLevelMethod(): boolean {
    let k = 0
    while (this.peek(k).kind === 'keyword' && MODIFIERS.has(this.peek(k).value)) k++
    const t = this.peek(k)
    const isType = (t.kind === 'keyword' && (PRIMITIVES.has(t.value) || t.value === 'void')) || t.kind === 'ident'
    if (!isType) return false
    k++
    while (this.isAt(k, '[') && this.isAt(k + 1, ']')) k += 2
    return this.peek(k).kind === 'ident' && this.isAt(k + 1, '(')
  }

  private parseClass(): ClassDecl {
    const start = this.cur
    while (this.cur.kind === 'keyword' && MODIFIERS.has(this.cur.value)) this.advance()
    if (!this.is('class')) this.unsupported('Only classes are supported in the sandbox (no interfaces, enums or records).')
    this.advance()
    const name = this.expectIdent().value
    if (this.is('extends') || this.is('implements')) this.unsupported('Inheritance is not supported in the sandbox.')
    if (this.is('<')) this.unsupported('Generics are not supported in the sandbox.')
    this.expect('{')
    const cls = this.parseClassBody(name, start, false)
    this.expect('}')
    cls.end = this.prev.end
    return cls
  }

  /** Parses class members until '}' (or EOF when `untilEof`). Does not consume the closing brace. */
  private parseClassBody(name: string, start: Token, untilEof: boolean): ClassDecl {
    const fields: FieldDecl[] = []
    const methods: MethodDecl[] = []
    while (untilEof ? this.cur.kind !== 'eof' : !this.is('}')) {
      if (this.cur.kind === 'eof') this.fail('reached end of file while parsing')
      if (untilEof && this.is('}')) this.fail('class, interface, enum, or record expected')
      if (this.accept(';')) continue
      const memberStart = this.cur
      const mods = new Set<string>()
      while (this.cur.kind === 'keyword' && MODIFIERS.has(this.cur.value)) mods.add(this.advance().value)
      if (this.is('class') || this.is('interface') || this.is('enum')) this.unsupported('Nested classes are not supported in the sandbox.')
      if (this.is('{')) this.unsupported('Initializer blocks are not supported in the sandbox.')
      // constructor?
      if (this.cur.kind === 'ident' && this.cur.value === name && this.isAt(1, '(')) {
        this.unsupported('Constructors and objects are not supported in the sandbox. Use static methods.')
      }
      const type = this.parseType()
      const nameTok = this.expectIdent()
      if (this.is('(')) {
        methods.push(this.parseMethodRest(memberStart, mods, type, nameTok))
      } else {
        const decl = this.parseVarDeclRest(memberStart, type, mods.has('final'), nameTok)
        this.expect(';')
        fields.push({ decl: this.finish(decl), isStatic: mods.has('static'), ...this.pos(memberStart) })
      }
    }
    return { name, fields, methods, ...this.pos(start), end: this.prev.end }
  }

  private parseMethodRest(start: Token, mods: Set<string>, returnType: TypeRef, nameTok: Token): MethodDecl {
    this.expect('(')
    const params: Param[] = []
    if (!this.is(')')) {
      do {
        const pStart = this.cur
        this.accept('final')
        const type = this.parseType()
        if (this.is('...')) this.unsupported('Varargs are not supported in the sandbox.')
        const pname = this.expectIdent()
        if (this.is('[')) {
          this.advance()
          this.expect(']')
          type.dims++
        }
        params.push({ type, name: pname.value, ...this.pos(pStart), end: this.prev.end })
      } while (this.accept(','))
    }
    this.expect(')')
    if (this.is('throws')) {
      this.advance()
      do {
        this.expectIdent()
      } while (this.accept(','))
    }
    if (this.is(';')) this.fail('missing method body, or declare abstract')
    const body = this.parseBlock()
    return {
      name: nameTok.value,
      isStatic: mods.has('static'),
      returnType,
      params,
      body,
      ...this.pos(start),
      end: this.prev.end,
    }
  }

  // ---------- types ----------
  private isTypeStart(): boolean {
    const t = this.cur
    if (t.kind === 'keyword' && (PRIMITIVES.has(t.value) || t.value === 'void')) return true
    return t.kind === 'ident'
  }

  private parseType(): TypeRef {
    const t = this.cur
    if (t.kind === 'keyword' && (PRIMITIVES.has(t.value) || t.value === 'void')) {
      this.advance()
    } else if (t.kind === 'ident') {
      this.advance()
      // qualified names like java.util.Scanner
      let name = t.value
      while (this.is('.') && this.peek().kind === 'ident') {
        this.advance()
        name = this.advance().value
      }
      if (this.is('<')) this.unsupported('Generics are not supported in the sandbox.')
      const ref: TypeRef = { name, dims: 0, ...this.pos(t) }
      return this.parseDims(ref)
    } else {
      this.fail('<identifier> expected')
    }
    return this.parseDims({ name: t.value, dims: 0, ...this.pos(t) })
  }

  private parseDims(ref: TypeRef): TypeRef {
    while (this.is('[') && this.isAt(1, ']')) {
      this.advance()
      this.advance()
      ref.dims++
    }
    return ref
  }

  /** Decide whether the upcoming tokens are a local variable declaration. */
  private looksLikeVarDecl(): boolean {
    const t = this.cur
    if (t.kind === 'keyword' && PRIMITIVES.has(t.value)) return true
    if (t.kind !== 'ident') return false
    // Ident Ident  |  Ident[] Ident  |  a.b.C Ident
    let k = 1
    while (this.isAt(k, '.') && this.peek(k + 1).kind === 'ident') k += 2
    if (this.isAt(k, '<')) return true // generic type: will be reported as unsupported
    while (this.isAt(k, '[') && this.isAt(k + 1, ']')) k += 2
    return this.peek(k).kind === 'ident'
  }

  // ---------- statements ----------
  private parseBlock(): Block {
    const start = this.expect('{')
    const body: Stmt[] = []
    while (!this.is('}')) {
      if (this.cur.kind === 'eof') this.fail('reached end of file while parsing')
      body.push(this.parseStatement())
    }
    this.advance()
    return { kind: 'Block', body, ...this.pos(start), end: this.prev.end }
  }

  parseStatement(): Stmt {
    const t = this.cur
    const P = this.pos(t)

    if (t.kind === 'op') {
      if (t.value === '{') return this.parseBlock()
      if (t.value === ';') {
        this.advance()
        return { kind: 'Empty', ...P }
      }
    }

    if (t.kind === 'keyword') {
      switch (t.value) {
        case 'if': {
          this.advance()
          this.expect('(')
          const cond = this.parseExpression()
          this.expect(')')
          const then = this.parseStatement()
          let els: Stmt | null = null
          if (this.accept('else')) els = this.parseStatement()
          return this.finish({ kind: 'If', cond, then, else: els, ...P })
        }
        case 'else':
          this.fail("'else' without 'if'")
          break
        case 'while': {
          this.advance()
          this.expect('(')
          const cond = this.parseExpression()
          this.expect(')')
          const body = this.parseStatement()
          return this.finish({ kind: 'While', cond, body, ...P })
        }
        case 'do': {
          this.advance()
          const body = this.parseStatement()
          this.expect('while', "'while' expected")
          this.expect('(')
          const cond = this.parseExpression()
          this.expect(')')
          this.expect(';')
          return this.finish({ kind: 'DoWhile', body, cond, ...P })
        }
        case 'for': {
          this.advance()
          this.expect('(')
          const init: Stmt[] = []
          if (!this.is(';')) {
            if (this.is('final') || this.looksLikeVarDecl()) {
              const initStart = this.cur
              const isFinal = this.accept('final')
              const type = this.parseType()
              const nameTok = this.expectIdent()
              if (this.is(':')) this.unsupported('Enhanced for loops (for-each) need arrays, which the sandbox does not support.')
              init.push(this.finish(this.parseVarDeclRest(initStart, type, isFinal, nameTok)))
            } else {
              do {
                const e = this.parseExpression()
                this.checkStatementExpression(e)
                init.push({ kind: 'ExprStmt', expr: e, line: e.line, col: e.col, start: e.start, end: e.end })
              } while (this.accept(','))
            }
          }
          this.expect(';')
          const cond = this.is(';') ? null : this.parseExpression()
          this.expect(';')
          const update: Expr[] = []
          if (!this.is(')')) {
            do {
              const e = this.parseExpression()
              this.checkStatementExpression(e)
              update.push(e)
            } while (this.accept(','))
          }
          this.expect(')')
          const body = this.parseStatement()
          return this.finish({ kind: 'For', init, cond, update, body, ...P })
        }
        case 'break':
          this.advance()
          if (this.cur.kind === 'ident') this.unsupported('Labeled break is not supported in the sandbox.')
          this.expect(';')
          return this.finish({ kind: 'Break', ...P })
        case 'continue':
          this.advance()
          if (this.cur.kind === 'ident') this.unsupported('Labeled continue is not supported in the sandbox.')
          this.expect(';')
          return this.finish({ kind: 'Continue', ...P })
        case 'return': {
          this.advance()
          const value = this.is(';') ? null : this.parseExpression()
          this.expect(';')
          return this.finish({ kind: 'Return', value, ...P })
        }
        case 'throw': {
          this.advance()
          const expr = this.parseExpression()
          this.expect(';')
          return this.finish({ kind: 'Throw', expr, ...P })
        }
        case 'try':
          return this.parseTry()
        case 'switch':
          this.unsupported('switch statements are not supported in the sandbox yet. Try an if / else if chain.')
          break
        case 'final': {
          this.advance()
          if (!this.isTypeStart()) this.fail('<identifier> expected')
          const type = this.parseType()
          const nameTok = this.expectDeclName()
          const decl = this.parseVarDeclRest(t, type, true, nameTok)
          this.expect(';')
          return this.finish(decl)
        }
        case 'class':
        case 'interface':
        case 'enum':
          this.unsupported('Local classes are not supported in the sandbox.')
          break
        case 'public':
        case 'private':
        case 'protected':
        case 'static':
          // e.g. a method or field written inside main
          this.fail('illegal start of expression')
          break
        case 'case':
        case 'default':
          this.fail('orphaned ' + t.value)
          break
        case 'catch':
          this.fail("'catch' without 'try'")
          break
        case 'finally':
          this.fail("'finally' without 'try'")
          break
      }
    }

    if (t.kind === 'ident' && t.value === 'var' && this.peek().kind === 'ident') {
      this.unsupported("'var' is not supported in the sandbox. Write the type (like int or String) instead.")
    }

    if (this.looksLikeVarDecl()) {
      const type = this.parseType()
      if (type.dims > 0) this.unsupported('Arrays are not supported in the sandbox yet.', t)
      const nameTok = this.expectDeclName()
      const decl = this.parseVarDeclRest(t, type, false, nameTok)
      this.expect(';')
      return this.finish(decl)
    }

    // expression statement
    const expr = this.parseExpression()
    this.checkStatementExpression(expr)
    this.expect(';')
    return this.finish({ kind: 'ExprStmt', expr, ...P })
  }

  /** after a type: expect a variable name, mimicking javac's messages for bad names */
  private expectDeclName(): Token {
    const t = this.cur
    if (t.kind === 'ident') return this.advance()
    if (t.kind === 'keyword') {
      // e.g. `int class = 5;`  -> javac: "not a statement"
      this.fail('not a statement', this.prev)
    }
    if (t.kind === 'int' || t.kind === 'double') this.fail('not a statement', this.prev)
    return this.fail('<identifier> expected')
  }

  private parseVarDeclRest(start: Token, type: TypeRef, isFinal: boolean, firstName: Token): Stmt & { kind: 'VarDecl' } {
    const declarators: Declarator[] = []
    let nameTok = firstName
    while (true) {
      if (this.is('[')) this.unsupported('Arrays are not supported in the sandbox yet.')
      let init: Expr | null = null
      if (this.accept('=')) {
        if (this.is('{')) this.unsupported('Arrays are not supported in the sandbox yet.')
        init = this.parseExpression()
      }
      declarators.push({ name: nameTok.value, init, ...this.pos(nameTok), end: this.prev.end })
      if (!this.accept(',')) break
      nameTok = this.expectDeclName()
    }
    if (!this.is(';') && !this.is(')') && this.cur.kind !== 'eof') {
      if (this.cur.kind === 'ident' || this.cur.kind === 'keyword' || this.cur.kind === 'int' || this.cur.kind === 'string' || this.cur.kind === 'double' || this.cur.kind === 'char') this.failAfterPrev("';' expected")
    }
    return { kind: 'VarDecl', type, isFinal, declarators, ...this.pos(start) }
  }

  private parseTry(): Stmt {
    const t = this.advance()
    if (this.is('(')) this.unsupported('try-with-resources is not supported in the sandbox.')
    const block = this.parseBlock()
    const catches: CatchClause[] = []
    while (this.is('catch')) {
      const ct = this.advance()
      this.expect('(')
      this.accept('final')
      const types: string[] = [this.parseQualifiedName()]
      while (this.accept('|')) types.push(this.parseQualifiedName())
      const name = this.expectIdent().value
      this.expect(')')
      const body = this.parseBlock()
      catches.push({ types, name, body, ...this.pos(ct), end: this.prev.end })
    }
    let fin: Block | null = null
    if (this.accept('finally')) fin = this.parseBlock()
    if (catches.length === 0 && !fin) this.fail("'try' without 'catch', 'finally' or resource declarations", t)
    return { kind: 'Try', block, catches, finally: fin, ...this.pos(t), end: this.prev.end }
  }

  private parseQualifiedName(): string {
    let name = this.expectIdent().value
    while (this.is('.') && this.peek().kind === 'ident') {
      this.advance()
      name = this.advance().value
    }
    return name
  }

  private checkStatementExpression(e: Expr) {
    const ok =
      e.kind === 'Assign' ||
      e.kind === 'Call' ||
      e.kind === 'New' ||
      (e.kind === 'Unary' && (e.op === '++' || e.op === '--'))
    if (!ok) throw new CompileError('not a statement', e.line, e.col)
  }

  // ---------- expressions ----------
  parseExpression(): Expr {
    return this.parseAssignment()
  }

  private parseAssignment(): Expr {
    const left = this.parseTernary()
    const t = this.cur
    if (t.kind === 'op' && ASSIGN_OPS.has(t.value)) {
      this.advance()
      const value = this.parseAssignment()
      return { kind: 'Assign', op: t.value, target: left, value, line: left.line, col: left.col, start: left.start, end: value.end, opLine: t.line } as Expr
    }
    return left
  }

  private parseTernary(): Expr {
    const cond = this.parseBinary(1)
    if (this.is('?')) {
      this.advance()
      const then = this.parseTernary()
      this.expect(':', "':' expected")
      const els = this.parseTernaryOrLambda()
      return { kind: 'Ternary', cond, then, else: els, line: cond.line, col: cond.col, start: cond.start, end: els.end }
    }
    return cond
  }

  private parseTernaryOrLambda(): Expr {
    return this.parseTernary()
  }

  private parseBinary(minPrec: number): Expr {
    let left = this.parseUnary()
    while (true) {
      const t = this.cur
      if (t.kind === 'keyword' && t.value === 'instanceof') this.unsupported('instanceof is not supported in the sandbox.')
      if (t.kind !== 'op') break
      const prec = BINARY_PRECEDENCE[t.value]
      if (prec === undefined || prec < minPrec) break
      this.advance()
      const right = this.parseBinary(prec + 1)
      left = { kind: 'Binary', op: t.value, left, right, line: left.line, col: left.col, start: left.start, end: right.end, opCol: t.col, opLine: t.line } as Expr
    }
    return left
  }

  private parseUnary(): Expr {
    const t = this.cur
    if (t.kind === 'op') {
      if (t.value === '+' || t.value === '-' || t.value === '!' || t.value === '~') {
        this.advance()
        // -2147483648 is the only place that literal is allowed
        if (t.value === '-' && this.cur.kind === 'int' && this.cur.num === 2147483648) {
          const lit = this.advance()
          const node: Expr = { kind: 'Literal', litType: 'int', value: -2147483648, ...this.pos(t), end: lit.end }
          return this.parsePostfix(node)
        }
        if (t.value === '-' && this.cur.kind === 'long' && this.cur.num === 1n << 63n) {
          const lit = this.advance()
          return this.parsePostfix({ kind: 'Literal', litType: 'long', value: -(1n << 63n), ...this.pos(t), end: lit.end })
        }
        const operand = this.parseUnary()
        return { kind: 'Unary', op: t.value, operand, prefix: true, ...this.pos(t), end: operand.end }
      }
      if (t.value === '++' || t.value === '--') {
        this.advance()
        const operand = this.parseUnary()
        return { kind: 'Unary', op: t.value, operand, prefix: true, ...this.pos(t), end: operand.end }
      }
      if (t.value === '(') {
        // cast?  (int) x   (double) (a + b)
        const n1 = this.peek(1)
        if (n1.kind === 'keyword' && PRIMITIVES.has(n1.value) && this.isAt(2, ')')) {
          this.advance()
          const typeTok = this.advance()
          this.advance()
          const expr = this.parseUnary()
          return { kind: 'Cast', typeName: typeTok.value, expr, ...this.pos(t), end: expr.end }
        }
        if (n1.kind === 'ident' && n1.value === 'String' && this.isAt(2, ')') && this.startsPrimary(this.peek(3))) {
          this.advance()
          this.advance()
          this.advance()
          const expr = this.parseUnary()
          return { kind: 'Cast', typeName: 'String', expr, ...this.pos(t), end: expr.end }
        }
      }
    }
    return this.parsePostfix(this.parsePrimary())
  }

  private startsPrimary(t: Token): boolean {
    if (t.kind === 'ident' || t.kind === 'string' || t.kind === 'char' || t.kind === 'int' || t.kind === 'double') return true
    return t.kind === 'op' && t.value === '('
  }

  private parsePrimary(): Expr {
    const t = this.cur
    const P = this.pos(t)
    switch (t.kind) {
      case 'int':
        if ((t.num as number) > 2147483647) this.fail('integer number too large')
        this.advance()
        return { kind: 'Literal', litType: 'int', value: t.num as number, ...P }
      case 'long':
        if ((t.num as bigint) > (1n << 63n) - 1n) this.fail('integer number too large')
        this.advance()
        return { kind: 'Literal', litType: 'long', value: t.num as bigint, ...P }
      case 'double':
        this.advance()
        return { kind: 'Literal', litType: 'double', value: t.num as number, ...P }
      case 'float':
        this.advance()
        return { kind: 'Literal', litType: 'float', value: t.num as number, ...P }
      case 'char':
        this.advance()
        return { kind: 'Literal', litType: 'char', value: t.value.charCodeAt(0), ...P }
      case 'string':
        this.advance()
        return { kind: 'Literal', litType: 'String', value: t.value, ...P }
      case 'ident':
        this.advance()
        if (this.is('->')) this.unsupported('Lambdas are not supported in the sandbox.')
        return { kind: 'Name', name: t.value, ...P }
      case 'keyword':
        if (t.value === 'true' || t.value === 'false') {
          this.advance()
          return { kind: 'Literal', litType: 'boolean', value: t.value === 'true', ...P }
        }
        if (t.value === 'null') {
          this.advance()
          return { kind: 'Literal', litType: 'null', value: null, ...P }
        }
        if (t.value === 'new') {
          this.advance()
          const typeTok = this.cur
          if (typeTok.kind === 'keyword' && PRIMITIVES.has(typeTok.value)) this.unsupported('Arrays are not supported in the sandbox yet.')
          const typeName = this.parseQualifiedName()
          if (this.is('[')) this.unsupported('Arrays are not supported in the sandbox yet.')
          if (this.is('<')) this.unsupported('Generics are not supported in the sandbox.')
          this.expect('(')
          const args = this.parseArgs()
          return { kind: 'New', typeName, args, ...P, end: this.prev.end }
        }
        if (t.value === 'this' || t.value === 'super') this.unsupported(`'${t.value}' is not supported in the sandbox (no objects yet).`)
        if (t.value === 'switch') this.unsupported('switch is not supported in the sandbox yet.')
        if (PRIMITIVES.has(t.value) && this.isAt(1, '.')) {
          this.unsupported('Class literals are not supported in the sandbox.')
        }
        return this.fail(PRIMITIVES.has(t.value) ? "'.class' expected" : 'illegal start of expression')
      case 'op':
        if (t.value === '(') {
          this.advance()
          if (this.is(')')) this.unsupported('Lambdas are not supported in the sandbox.')
          const expr = this.parseExpression()
          this.expect(')')
          return { kind: 'Paren', expr, ...P, end: this.prev.end }
        }
        return this.fail('illegal start of expression')
      case 'eof':
        return this.fail('reached end of file while parsing')
    }
  }

  private parseArgs(): Expr[] {
    // assumes '(' already consumed
    const args: Expr[] = []
    if (this.accept(')')) return args
    while (true) {
      args.push(this.parseExpression())
      if (this.accept(')')) break
      if (this.accept(',')) continue
      this.failAfterPrev("')' or ',' expected")
    }
    return args
  }

  private parsePostfix(expr: Expr): Expr {
    while (true) {
      const t = this.cur
      if (t.kind !== 'op') break
      if (t.value === '.') {
        this.advance()
        const nameTok = this.cur
        if (nameTok.kind !== 'ident') {
          if (nameTok.kind === 'keyword' && nameTok.value === 'class') this.unsupported('Class literals are not supported in the sandbox.')
          this.fail('<identifier> expected')
        }
        this.advance()
        if (this.is('(')) {
          this.advance()
          const args = this.parseArgs()
          expr = { kind: 'Call', target: expr, name: nameTok.value, args, line: expr.line, col: expr.col, start: expr.start, end: this.prev.end, nameLine: nameTok.line, nameCol: nameTok.col } as Expr
        } else {
          expr = { kind: 'Field', target: expr, name: nameTok.value, line: expr.line, col: expr.col, start: expr.start, end: nameTok.end, nameLine: nameTok.line, nameCol: nameTok.col } as Expr
        }
        continue
      }
      if (t.value === '(' && expr.kind === 'Name') {
        this.advance()
        const args = this.parseArgs()
        expr = { kind: 'Call', target: null, name: expr.name, args, line: expr.line, col: expr.col, start: expr.start, end: this.prev.end }
        continue
      }
      if (t.value === '[') this.unsupported('Arrays are not supported in the sandbox yet.')
      if (t.value === '++' || t.value === '--') {
        this.advance()
        expr = { kind: 'Unary', op: t.value, operand: expr, prefix: false, line: expr.line, col: expr.col, start: expr.start, end: t.end }
        continue
      }
      if (t.value === '::') this.unsupported('Method references are not supported in the sandbox.')
      break
    }
    return expr
  }
}
