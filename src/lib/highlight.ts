/**
 * Small, forgiving Java syntax highlighter (works on broken code too, which
 * matters for "find the bug" questions). Produces tokens per line.
 */

export type TokenClass =
  | 'keyword'
  | 'type'
  | 'string'
  | 'char'
  | 'number'
  | 'comment'
  | 'method'
  | 'literal'
  | 'operator'
  | 'punct'
  | 'annotation'
  | 'plain'
  | 'blank'

export interface HToken {
  text: string
  cls: TokenClass
  /** index of the blank (for fill-in-the-blank) */
  blank?: number
}

const KEYWORDS = new Set([
  'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'do', 'else', 'enum',
  'extends', 'final', 'finally', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'interface', 'native',
  'new', 'package', 'private', 'protected', 'public', 'return', 'static', 'strictfp', 'super', 'switch',
  'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'volatile', 'while', 'var', 'record',
])
const PRIMITIVES = new Set(['int', 'double', 'boolean', 'char', 'long', 'float', 'short', 'byte', 'void'])
const LITERALS = new Set(['true', 'false', 'null'])

const RULES: [RegExp, TokenClass | 'word'][] = [
  [/^___/, 'blank'],
  [/^\/\/[^\n]*/, 'comment'],
  [/^\/\*[\s\S]*?(\*\/|$)/, 'comment'],
  [/^"(?:\\.|[^"\\\n])*"?/, 'string'],
  [/^'(?:\\.|[^'\\\n])*'?/, 'char'],
  [/^(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?[lLfFdD]?|\.\d+(?:[eE][+-]?\d+)?[fFdD]?)/, 'number'],
  [/^@[A-Za-z_]\w*/, 'annotation'],
  [/^[A-Za-z_$][\w$]*/, 'word'],
  [/^(?:>>>=|<<=|>>=|>>>|\+\+|--|&&|\|\||==|!=|<=|>=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<|>>|->|::|[+\-*/%=<>!&|^~?:])/, 'operator'],
  [/^[(){}[\];,.]/, 'punct'],
  [/^\s+/, 'plain'],
]

export function highlightJava(code: string): HToken[][] {
  const lines: HToken[][] = [[]]
  let rest = code
  let blankIndex = 0
  const push = (text: string, cls: TokenClass, blank?: number) => {
    // split multi-line tokens (block comments) across lines
    const parts = text.split('\n')
    parts.forEach((part, i) => {
      if (i > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, cls, blank })
    })
  }
  while (rest.length) {
    let matched = false
    for (const [re, cls] of RULES) {
      const m = re.exec(rest)
      if (!m) continue
      const text = m[0]
      matched = true
      if (cls === 'blank') {
        push(text, 'blank', blankIndex++)
      } else if (cls === 'word') {
        const after = rest.slice(text.length)
        let c: TokenClass = 'plain'
        if (KEYWORDS.has(text)) c = 'keyword'
        else if (PRIMITIVES.has(text)) c = 'type'
        else if (LITERALS.has(text)) c = 'literal'
        else if (/^\s*\(/.test(after)) c = 'method'
        else if (/^[A-Z]/.test(text) && !/^[A-Z0-9_]+$/.test(text)) c = 'type'
        push(text, c)
      } else {
        push(text, cls)
      }
      rest = rest.slice(text.length)
      break
    }
    if (!matched) {
      push(rest[0], 'plain')
      rest = rest.slice(1)
    }
  }
  return lines
}
