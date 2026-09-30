/**
 * AST for the subset of Java supported by ByteBrew's sandbox.
 * The checker annotates expression nodes with their static type (`t`) and,
 * for compile-time constants, their constant value (`cv`).
 */

export type JType = string // 'int' | 'double' | 'String' | 'Scanner' | exception names | ...

export interface Pos {
  line: number
  col: number
  start: number
  end: number
}

export interface VarInfo {
  id: number
  name: string
  type: JType
  isFinal: boolean
  isField: boolean
  line: number
  /** constant value if final + constant initializer (used for narrowing & string interning) */
  constValue?: ConstValue
}

export type ConstValue = number | bigint | boolean | string

interface ExprBase extends Pos {
  /** position of the operator (binary/assign) or member name (call/field), for error carets */
  opLine?: number
  opCol?: number
  nameLine?: number
  nameCol?: number
  /** static type, filled by the checker */
  t?: JType
  /** compile-time constant value, filled by the checker */
  cv?: ConstValue
  /** operand type used to evaluate binary / compound-assignment operators */
  opType?: JType
}

export type Expr =
  | (ExprBase & { kind: 'Literal'; litType: JType; value: ConstValue | null })
  | (ExprBase & { kind: 'Name'; name: string; v?: VarInfo; classRef?: string })
  | (ExprBase & { kind: 'Field'; target: Expr; name: string; v?: VarInfo; staticKey?: string })
  | (ExprBase & { kind: 'Call'; target: Expr | null; name: string; args: Expr[]; resolved?: CallTarget })
  | (ExprBase & { kind: 'New'; typeName: string; args: Expr[] })
  | (ExprBase & { kind: 'Unary'; op: string; operand: Expr; prefix: boolean })
  | (ExprBase & { kind: 'Binary'; op: string; left: Expr; right: Expr })
  | (ExprBase & { kind: 'Assign'; op: string; target: Expr; value: Expr })
  | (ExprBase & { kind: 'Ternary'; cond: Expr; then: Expr; else: Expr })
  | (ExprBase & { kind: 'Cast'; typeName: string; expr: Expr })
  | (ExprBase & { kind: 'Paren'; expr: Expr })

export type CallTarget =
  | { kind: 'builtin'; key: string } // e.g. 'Math.sqrt', 'String.length', 'System.out.println'
  | { kind: 'user'; method: MethodDecl }

export interface TypeRef extends Pos {
  name: string
  dims: number
}

export interface Declarator extends Pos {
  name: string
  init: Expr | null
  v?: VarInfo
}

interface StmtBase extends Pos {}

export type Stmt =
  | (StmtBase & { kind: 'Block'; body: Stmt[] })
  | (StmtBase & { kind: 'VarDecl'; type: TypeRef; isFinal: boolean; declarators: Declarator[] })
  | (StmtBase & { kind: 'ExprStmt'; expr: Expr })
  | (StmtBase & { kind: 'If'; cond: Expr; then: Stmt; else: Stmt | null })
  | (StmtBase & { kind: 'While'; cond: Expr; body: Stmt })
  | (StmtBase & { kind: 'DoWhile'; body: Stmt; cond: Expr })
  | (StmtBase & { kind: 'For'; init: Stmt[]; cond: Expr | null; update: Expr[]; body: Stmt })
  | (StmtBase & { kind: 'Break' })
  | (StmtBase & { kind: 'Continue' })
  | (StmtBase & { kind: 'Return'; value: Expr | null })
  | (StmtBase & { kind: 'Throw'; expr: Expr })
  | (StmtBase & { kind: 'Try'; block: Stmt & { kind: 'Block' }; catches: CatchClause[]; finally: (Stmt & { kind: 'Block' }) | null })
  | (StmtBase & { kind: 'Empty' })

export interface CatchClause extends Pos {
  types: string[]
  name: string
  body: Stmt & { kind: 'Block' }
  v?: VarInfo
}

export interface Param extends Pos {
  type: TypeRef
  name: string
  v?: VarInfo
}

export interface MethodDecl extends Pos {
  name: string
  isStatic: boolean
  returnType: TypeRef
  params: Param[]
  body: Stmt & { kind: 'Block' }
}

export interface FieldDecl extends Pos {
  decl: Stmt & { kind: 'VarDecl' }
  isStatic: boolean
}

export interface ClassDecl extends Pos {
  name: string
  fields: FieldDecl[]
  methods: MethodDecl[]
}

export interface Program {
  imports: { name: string; line: number; col: number }[]
  cls: ClassDecl
  /** true when the source was a bare snippet that we wrapped in a main method */
  isSnippet: boolean
  source: string
}
