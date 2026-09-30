/**
 * Simulation of java.util.Scanner over a string buffer, faithful to the
 * behaviours beginners trip over:
 *  - nextInt() leaves the newline behind, so a following nextLine() returns ""
 *  - a failed nextInt() does NOT consume the bad token (classic infinite loop)
 *  - hasNextInt() peeks without consuming
 *
 * In interactive mode, running out of input throws NeedInput so the UI can ask
 * the learner for another line and re-run the (deterministic) program.
 */
import { JavaThrow } from './errors'

export class NeedInput extends Error {
  constructor() {
    super('needs input')
    this.name = 'NeedInput'
  }
}

const INT_RE = /^[+-]?\d+$/
const DOUBLE_RE = /^[+-]?((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?$|^[+-]?(NaN|Infinity)$/
const WS = /\s/

export class ScannerSim {
  private buf: string
  private pos = 0
  private interactive: boolean
  private touched = new Set<number>()
  private lineStarts: number[] = [0]
  closed = false
  /** called the first time the program reads from input line `index` */
  onTouchLine: ((text: string) => void) | null = null
  line = 0

  constructor(buf: string, interactive: boolean) {
    this.buf = buf
    this.interactive = interactive
    for (let i = 0; i < buf.length; i++) if (buf[i] === '\n') this.lineStarts.push(i + 1)
  }

  private touch(p: number) {
    if (!this.onTouchLine) return
    let idx = 0
    while (idx + 1 < this.lineStarts.length && this.lineStarts[idx + 1] <= p) idx++
    if (this.touched.has(idx)) return
    this.touched.add(idx)
    const start = this.lineStarts[idx]
    let end = this.buf.indexOf('\n', start)
    if (end === -1) end = this.buf.length
    this.onTouchLine(this.buf.slice(start, end).replace(/\r$/, ''))
  }

  private ensureOpen() {
    if (this.closed) throw new JavaThrow('IllegalStateException', 'Scanner closed', this.line)
  }

  private peekToken(): { tok: string; start: number; end: number } | null {
    this.ensureOpen()
    let p = this.pos
    while (p < this.buf.length && WS.test(this.buf[p])) p++
    if (p >= this.buf.length) {
      if (this.interactive) throw new NeedInput()
      return null
    }
    let q = p
    while (q < this.buf.length && !WS.test(this.buf[q])) q++
    this.touch(p)
    return { tok: this.buf.slice(p, q), start: p, end: q }
  }

  hasNext(): boolean {
    return this.peekToken() !== null
  }
  hasNextInt(): boolean {
    const t = this.peekToken()
    return t !== null && INT_RE.test(t.tok) && inRange(t.tok, 2147483647n)
  }
  hasNextLong(): boolean {
    const t = this.peekToken()
    return t !== null && INT_RE.test(t.tok) && inRange(t.tok, (1n << 63n) - 1n)
  }
  hasNextDouble(): boolean {
    const t = this.peekToken()
    return t !== null && DOUBLE_RE.test(t.tok)
  }
  hasNextBoolean(): boolean {
    const t = this.peekToken()
    return t !== null && /^(true|false)$/i.test(t.tok)
  }
  hasNextLine(): boolean {
    this.ensureOpen()
    if (this.pos < this.buf.length) {
      this.touch(this.pos)
      return true
    }
    if (this.interactive) throw new NeedInput()
    return false
  }

  next(): string {
    const t = this.peekToken()
    if (!t) throw new JavaThrow('NoSuchElementException', null, this.line)
    this.pos = t.end
    return t.tok
  }

  private nextToken(re: RegExp, max: bigint | null): string {
    const t = this.peekToken()
    if (!t) throw new JavaThrow('NoSuchElementException', null, this.line)
    // Java skips the delimiters even when the token does not match
    this.pos = t.start
    if (!re.test(t.tok)) throw new JavaThrow('InputMismatchException', null, this.line)
    if (max !== null && !inRange(t.tok, max)) {
      throw new JavaThrow('InputMismatchException', `For input string: "${t.tok}"`, this.line)
    }
    this.pos = t.end
    return t.tok
  }

  nextInt(): number {
    return Number(BigInt(this.nextToken(INT_RE, 2147483647n)))
  }
  nextLong(): bigint {
    return BigInt(this.nextToken(INT_RE, (1n << 63n) - 1n))
  }
  nextDouble(): number {
    const tok = this.nextToken(DOUBLE_RE, null)
    return parseFloat(tok.replace(/^\+/, ''))
  }
  nextBoolean(): boolean {
    return this.nextToken(/^(true|false)$/i, null).toLowerCase() === 'true'
  }

  nextLine(): string {
    this.ensureOpen()
    if (this.pos >= this.buf.length) {
      if (this.interactive) throw new NeedInput()
      throw new JavaThrow('NoSuchElementException', 'No line found', this.line)
    }
    this.touch(this.pos)
    const nl = this.buf.indexOf('\n', this.pos)
    if (nl === -1) {
      const s = this.buf.slice(this.pos)
      this.pos = this.buf.length
      return s
    }
    const s = this.buf.slice(this.pos, nl).replace(/\r$/, '')
    this.pos = nl + 1
    return s
  }

  close() {
    this.closed = true
  }
}

function inRange(tok: string, max: bigint): boolean {
  const v = BigInt(tok)
  return v <= max && v >= -max - 1n
}
