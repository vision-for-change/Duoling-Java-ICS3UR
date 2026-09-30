import { CompileError } from './errors'

export type TokenKind =
  | 'ident'
  | 'keyword'
  | 'int'
  | 'long'
  | 'double'
  | 'float'
  | 'char'
  | 'string'
  | 'op'
  | 'eof'

export interface Token {
  kind: TokenKind
  /** Source text for idents/keywords/ops; decoded value for char/string literals. */
  value: string
  /** Numeric value for number literals (bigint for long literals). */
  num?: number | bigint
  line: number
  col: number
  start: number
  end: number
}

export const KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
  'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
  'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
  'volatile', 'while', 'true', 'false', 'null',
])

// Longest operators first so that e.g. ">>=" wins over ">>" and ">".
const OPERATORS = [
  '>>>=', '<<=', '>>=', '>>>', '...', '->', '::', '++', '--', '&&', '||', '==', '!=', '<=', '>=',
  '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>',
  '+', '-', '*', '/', '%', '=', '<', '>', '!', '~', '?', ':', ';', ',', '.', '(', ')', '{', '}',
  '[', ']', '&', '|', '^', '@',
]

const INT_MAX = 2147483647
const LONG_MAX = (1n << 63n) - 1n

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_$]/.test(ch)
}
function isIdentPart(ch: string): boolean {
  return /[A-Za-z0-9_$]/.test(ch)
}
function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9'
}

export function tokenize(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  let line = 1
  let lineStart = 0
  const n = src.length

  const col = (pos: number) => pos - lineStart + 1

  const err = (msg: string, pos: number): never => {
    throw new CompileError(msg, line, col(pos))
  }

  const readEscape = (pos: number): [string, number] => {
    // src[pos] === '\\'
    const c = src[pos + 1]
    switch (c) {
      case 'n': return ['\n', pos + 2]
      case 't': return ['\t', pos + 2]
      case 'r': return ['\r', pos + 2]
      case 'b': return ['\b', pos + 2]
      case 'f': return ['\f', pos + 2]
      case 's': return [' ', pos + 2]
      case '0': return ['\0', pos + 2]
      case '\\': return ['\\', pos + 2]
      case "'": return ["'", pos + 2]
      case '"': return ['"', pos + 2]
      case 'u': {
        let p = pos + 1
        while (src[p] === 'u') p++
        const hex = src.slice(p, p + 4)
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) err('illegal unicode escape', pos)
        return [String.fromCharCode(parseInt(hex, 16)), p + 4]
      }
      default:
        return err('illegal escape character', pos)
    }
  }

  while (i < n) {
    const ch = src[i]

    // newlines / whitespace
    if (ch === '\n') {
      i++
      line++
      lineStart = i
      continue
    }
    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\f') {
      i++
      continue
    }

    // comments
    if (ch === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      const startLine = line
      const startCol = col(i)
      i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') {
          line++
          lineStart = i + 1
        }
        i++
      }
      if (i >= n) throw new CompileError('unclosed comment', startLine, startCol)
      i += 2
      continue
    }

    const start = i
    const startCol = col(i)

    // identifiers & keywords
    if (isIdentStart(ch)) {
      while (i < n && isIdentPart(src[i])) i++
      const word = src.slice(start, i)
      tokens.push({
        kind: KEYWORDS.has(word) ? 'keyword' : 'ident',
        value: word,
        line,
        col: startCol,
        start,
        end: i,
      })
      continue
    }

    // numbers
    if (isDigit(ch) || (ch === '.' && isDigit(src[i + 1] ?? ''))) {
      tokens.push(readNumber())
      continue
    }

    // char literal
    if (ch === "'") {
      let p = i + 1
      if (src[p] === "'") err('empty character literal', i)
      if (src[p] === '\n' || p >= n) err('illegal line end in character literal', i)
      let value: string
      if (src[p] === '\\') {
        ;[value, p] = readEscape(p)
      } else {
        value = src[p]
        p++
      }
      if (src[p] !== "'") err('unclosed character literal', i)
      i = p + 1
      tokens.push({ kind: 'char', value, line, col: startCol, start, end: i })
      continue
    }

    // string literal
    if (ch === '"') {
      if (src.startsWith('"""', i)) err('text blocks are not supported in the sandbox', i)
      let p = i + 1
      let value = ''
      while (true) {
        if (p >= n || src[p] === '\n' || src[p] === '\r') err('unclosed string literal', i)
        const c = src[p]
        if (c === '"') break
        if (c === '\\') {
          const [v, np] = readEscape(p)
          value += v
          p = np
        } else {
          value += c
          p++
        }
      }
      i = p + 1
      tokens.push({ kind: 'string', value, line, col: startCol, start, end: i })
      continue
    }

    // operators
    let matched: string | null = null
    for (const op of OPERATORS) {
      if (src.startsWith(op, i)) {
        matched = op
        break
      }
    }
    if (matched) {
      i += matched.length
      tokens.push({ kind: 'op', value: matched, line, col: startCol, start, end: i })
      continue
    }

    if (ch === '#' || ch === '`' || ch === '\\') err(`illegal character: '${ch}'`, i)
    err(`illegal character: '${ch}'`, i)
  }

  tokens.push({ kind: 'eof', value: '<EOF>', line, col: col(i), start: i, end: i })
  return tokens

  function readNumber(): Token {
    const start = i
    const startCol = col(i)
    // hex / binary
    if (src[i] === '0' && /[xXbB]/.test(src[i + 1] ?? '')) {
      const isHex = /[xX]/.test(src[i + 1])
      i += 2
      const digitStart = i
      while (i < n && (isHex ? /[0-9a-fA-F_]/ : /[01_]/).test(src[i])) i++
      const digits = src.slice(digitStart, i).replace(/_/g, '')
      let isLong = false
      if (src[i] === 'l' || src[i] === 'L') {
        isLong = true
        i++
      }
      if (!digits) err(isHex ? 'hexadecimal numbers must contain at least one hexadecimal digit' : 'binary numbers must contain at least one binary digit', start)
      const big = BigInt((isHex ? '0x' : '0b') + digits)
      if (isLong) {
        if (big > (1n << 64n) - 1n) err('integer number too large', start)
        return { kind: 'long', value: src.slice(start, i), num: BigInt.asIntN(64, big), line, col: startCol, start, end: i }
      }
      if (big > 0xffffffffn) err('integer number too large', start)
      return { kind: 'int', value: src.slice(start, i), num: Number(BigInt.asIntN(32, big)), line, col: startCol, start, end: i }
    }

    while (i < n && (isDigit(src[i]) || src[i] === '_')) i++
    let isFloating = false
    if (src[i] === '.' && isDigit(src[i + 1] ?? '')) {
      isFloating = true
      i++
      while (i < n && (isDigit(src[i]) || src[i] === '_')) i++
    } else if (src[i] === '.' && !isIdentStart(src[i + 1] ?? '') && src[i + 1] !== '.') {
      // "5." is a valid double literal
      isFloating = true
      i++
    }
    if (src[i] === 'e' || src[i] === 'E') {
      let p = i + 1
      if (src[p] === '+' || src[p] === '-') p++
      if (isDigit(src[p] ?? '')) {
        isFloating = true
        i = p
        while (i < n && isDigit(src[i])) i++
      } else {
        err('malformed floating-point literal', start)
      }
    }
    const text = src.slice(start, i).replace(/_/g, '')
    const suffix = src[i]
    if (suffix === 'f' || suffix === 'F') {
      i++
      return { kind: 'float', value: src.slice(start, i), num: Math.fround(parseFloat(text)), line, col: startCol, start, end: i }
    }
    if (suffix === 'd' || suffix === 'D') {
      i++
      return { kind: 'double', value: src.slice(start, i), num: parseFloat(text), line, col: startCol, start, end: i }
    }
    if (isFloating) {
      return { kind: 'double', value: src.slice(start, i), num: parseFloat(text), line, col: startCol, start, end: i }
    }
    const isOctal = text.length > 1 && text[0] === '0'
    if (suffix === 'l' || suffix === 'L') {
      i++
      const big = isOctal ? BigInt('0o' + text.slice(1)) : BigInt(text)
      if (big > LONG_MAX + 1n) err('integer number too large', start)
      return { kind: 'long', value: src.slice(start, i), num: big, line, col: startCol, start, end: i }
    }
    if (isIdentStart(src[i] ?? '')) {
      // e.g. "2x" -> javac reports "not a statement"/"';' expected"; keep it simple
      err("';' expected", start)
    }
    const value = isOctal ? parseInt(text.slice(1), 8) : Number(text)
    // 2147483648 is only legal as the operand of unary minus; the parser checks that case.
    if (value > INT_MAX + 1) err('integer number too large', start)
    return { kind: 'int', value: src.slice(start, i), num: value, line, col: startCol, start, end: i }
  }
}
