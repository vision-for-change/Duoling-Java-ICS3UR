/**
 * Java-accurate number formatting:
 *  - Double.toString / Float.toString   (what println prints for decimals)
 *  - java.util.Formatter subset         (System.out.printf / String.format)
 *
 * Verified against a real JDK: Java's %f rounds HALF_UP using the *shortest*
 * decimal representation of the double (so %.2f of 1.005 is "1.01", unlike C/JS).
 */
import type { JType } from './ast'
import { JavaThrow } from './errors'
import { boxedClassName, javaToString, JStr } from './values'

interface Decimal {
  /** significant digits, no leading zeros (e.g. [1,2,3]) */
  digits: number[]
  /** value = 0.d1d2d3... * 10^pointPos  (i.e. pointPos = number of integer digits) */
  pointPos: number
}

/** Shortest round-tripping decimal digits of a positive finite double. */
function shortestDouble(abs: number): Decimal {
  const [mant, e] = abs.toExponential().split('e')
  const digits = mant.replace('.', '').split('').map(Number)
  return { digits, pointPos: parseInt(e, 10) + 1 }
}

/** Shortest decimal digits that round-trip through a 32-bit float. */
function shortestFloat(abs: number): Decimal {
  for (let p = 1; p <= 9; p++) {
    const s = abs.toExponential(p - 1)
    if (Math.fround(parseFloat(s)) === abs) {
      const [mant, e] = s.split('e')
      let digits = mant.replace('.', '').split('').map(Number)
      while (digits.length > 1 && digits[digits.length - 1] === 0) digits = digits.slice(0, -1)
      return { digits, pointPos: parseInt(e, 10) + 1 }
    }
  }
  return shortestDouble(abs)
}

function toJavaString(d: number, dec: (abs: number) => Decimal): string {
  if (Number.isNaN(d)) return 'NaN'
  if (d === Infinity) return 'Infinity'
  if (d === -Infinity) return '-Infinity'
  if (d === 0) return Object.is(d, -0) ? '-0.0' : '0.0'
  const sign = d < 0 ? '-' : ''
  const abs = Math.abs(d)
  const { digits, pointPos } = dec(abs)
  const ds = digits.join('')
  if (abs >= 1e-3 && abs < 1e7) {
    if (pointPos <= 0) return `${sign}0.${'0'.repeat(-pointPos)}${ds}`
    if (pointPos >= ds.length) return `${sign}${ds}${'0'.repeat(pointPos - ds.length)}.0`
    return `${sign}${ds.slice(0, pointPos)}.${ds.slice(pointPos)}`
  }
  const mantissa = ds.length > 1 ? `${ds[0]}.${ds.slice(1)}` : `${ds[0]}.0`
  return `${sign}${mantissa}E${pointPos - 1}`
}

/** Double.toString(d) */
export function formatDouble(d: number): string {
  return toJavaString(d, shortestDouble)
}

/** Float.toString(f) */
export function formatFloat(f: number): string {
  return toJavaString(f, shortestFloat)
}

/** Round a digit list HALF_UP keeping `keep` digits. Returns new digits and whether a carry added a digit. */
function roundHalfUp(digits: number[], keep: number): { digits: number[]; grew: boolean } {
  if (keep < 0) return { digits: [], grew: false }
  if (digits.length <= keep) return { digits: [...digits, ...Array(keep - digits.length).fill(0)], grew: false }
  const out = digits.slice(0, keep)
  if (digits[keep] >= 5) {
    let i = keep - 1
    while (i >= 0) {
      if (out[i] === 9) {
        out[i] = 0
        i--
      } else {
        out[i]++
        break
      }
    }
    if (i < 0) {
      out.unshift(1)
      return { digits: out, grew: true }
    }
  }
  return { digits: out, grew: false }
}

/** Fixed-point magnitude string for %f (abs value, no sign). */
export function fixedMagnitude(abs: number, precision: number): string {
  if (abs === 0) return precision > 0 ? '0.' + '0'.repeat(precision) : '0'
  const { digits, pointPos } = shortestDouble(abs)
  let ds = digits
  let pp = pointPos
  if (pp < 0) {
    ds = [...Array(-pp).fill(0), ...ds]
    pp = 0
  }
  const r = roundHalfUp(ds, pp + precision)
  if (r.grew) pp++
  const all = r.digits
  let intPart = pp > 0 ? all.slice(0, pp).join('') : '0'
  intPart = intPart.replace(/^0+(?=\d)/, '')
  const frac = all.slice(pp).join('')
  return precision > 0 ? `${intPart}.${frac}` : intPart
}

/** Scientific magnitude for %e: d.ddddde+XX */
function sciMagnitude(abs: number, precision: number, upper: boolean): string {
  let mant: number[]
  let exp: number
  if (abs === 0) {
    mant = Array(precision + 1).fill(0)
    exp = 0
  } else {
    const { digits, pointPos } = shortestDouble(abs)
    const r = roundHalfUp(digits, precision + 1)
    mant = r.digits
    exp = pointPos - 1 + (r.grew ? 1 : 0)
    if (r.grew) mant = mant.slice(0, precision + 1)
  }
  const m = precision > 0 ? `${mant[0]}.${mant.slice(1).join('')}` : `${mant[0]}`
  const es = `${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`
  return `${m}${upper ? 'E' : 'e'}${es}`
}

function groupThousands(intDigits: string): string {
  return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export interface FormatArg {
  value: unknown
  type: JType
}

const SPEC_RE = /%(\d+\$)?([-#+ 0,(<]*)?(\d+)?(\.\d+)?([tT])?([a-zA-Z%])/y

/**
 * Parse-time checks. Like java.util.Formatter, these errors are thrown before
 * anything is printed; argument errors (wrong type, missing argument) happen
 * later, after the text before them has already been written.
 */
function validateFormat(fmt: string, line: number) {
  let i = 0
  while (i < fmt.length) {
    if (fmt[i] !== '%') {
      i++
      continue
    }
    SPEC_RE.lastIndex = i
    const m = SPEC_RE.exec(fmt)
    if (!m) {
      const next = fmt[i + 1]
      throw new JavaThrow('UnknownFormatConversionException', `Conversion = '${next === undefined ? '%' : next}'`, line)
    }
    i += m[0].length
    const flags = m[2] ?? ''
    const conv = m[6]
    if (m[5]) throw new JavaThrow('UnknownFormatConversionException', `Conversion = '${m[5]}'`, line)
    if (conv === 'n' || conv === '%') continue
    if (!'bBsScCdoxXeEfgG'.includes(conv)) throw new JavaThrow('UnknownFormatConversionException', `Conversion = '${conv}'`, line)
    if ((flags.includes('-') || flags.includes('0')) && !m[3]) throw new JavaThrow('MissingFormatWidthException', m[0], line)
    if (m[4] && 'cCdoxX'.includes(conv)) throw new JavaThrow('IllegalFormatPrecisionException', m[4].slice(1), line)
  }
}

/** java.util.Formatter subset used by printf and String.format. */
export function javaFormat(fmt: string, args: FormatArg[], line = 0): string {
  validateFormat(fmt, line)
  const state = { out: '' }
  try {
    return formatBody(fmt, args, line, state)
  } catch (e) {
    if (e instanceof JavaThrow) e.partialOutput = state.out
    throw e
  }
}

function formatBody(fmt: string, args: FormatArg[], line: number, state: { out: string }): string {
  let out = ''
  let i = 0
  let ordinary = 0
  let last = -1
  while (i < fmt.length) {
    const ch = fmt[i]
    if (ch !== '%') {
      out = state.out += ch
      i++
      continue
    }
    SPEC_RE.lastIndex = i
    const m = SPEC_RE.exec(fmt)
    if (!m) {
      const next = fmt[i + 1]
      throw new JavaThrow('UnknownFormatConversionException', `Conversion = '${next === undefined ? '%' : next}'`, line)
    }
    const spec = m[0]
    const flags = m[2] ?? ''
    const width = m[3] ? parseInt(m[3], 10) : -1
    const precision = m[4] ? parseInt(m[4].slice(1), 10) : -1
    const conv = m[6]
    i += spec.length

    if (m[5]) throw new JavaThrow('UnknownFormatConversionException', `Conversion = '${m[5]}'`, line)

    if (conv === 'n') {
      out = state.out += '\n'
      continue
    }
    if (conv === '%') {
      out = state.out += pad('%', width, flags.includes('-'))
      continue
    }
    if (!'bBsScCdoxXeEfgG'.includes(conv)) {
      throw new JavaThrow('UnknownFormatConversionException', `Conversion = '${conv}'`, line)
    }
    if ((flags.includes('-') || flags.includes('0')) && width === -1) {
      throw new JavaThrow('MissingFormatWidthException', spec, line)
    }

    // pick argument
    let index: number
    if (m[1]) index = parseInt(m[1], 10) - 1
    else if (flags.includes('<')) index = last
    else index = ordinary++
    if (index < 0 || index >= args.length) {
      throw new JavaThrow('MissingFormatArgumentException', `Format specifier '${spec}'`, line)
    }
    last = index
    const arg = args[index]
    const t = arg.type
    const v = arg.value
    const isNull = v === null || t === 'null'
    const left = flags.includes('-')

    const mismatch = (): never => {
      throw new JavaThrow('IllegalFormatConversionException', `${conv.toLowerCase()} != ${boxedClassName(t)}`, line)
    }

    switch (conv) {
      case 'b':
      case 'B': {
        let s = isNull ? 'false' : t === 'boolean' ? String(v) : 'true'
        if (precision >= 0) s = s.slice(0, precision)
        out = state.out += pad(conv === 'B' ? s.toUpperCase() : s, width, left)
        break
      }
      case 's':
      case 'S': {
        let s = isNull ? 'null' : javaToString(v, t)
        if (precision >= 0) s = s.slice(0, precision)
        out = state.out += pad(conv === 'S' ? s.toUpperCase() : s, width, left)
        break
      }
      case 'c':
      case 'C': {
        if (precision >= 0) throw new JavaThrow('IllegalFormatPrecisionException', String(precision), line)
        let s: string
        if (isNull) s = 'null'
        else if (t === 'char') s = String.fromCharCode(v as number)
        else if (t === 'int' || t === 'short' || t === 'byte') s = String.fromCodePoint(v as number)
        else return mismatch()
        out = state.out += pad(conv === 'C' ? s.toUpperCase() : s, width, left)
        break
      }
      case 'd': {
        if (precision >= 0) throw new JavaThrow('IllegalFormatPrecisionException', String(precision), line)
        if (isNull) {
          out = state.out += pad('null', width, left)
          break
        }
        if (!(t === 'int' || t === 'long' || t === 'short' || t === 'byte')) mismatch()
        const big = t === 'long' ? (v as bigint) : BigInt(v as number)
        const neg = big < 0n
        let mag = (neg ? -big : big).toString()
        if (flags.includes(',')) mag = groupThousands(mag)
        out = state.out += signAndPad(mag, neg, flags, width)
        break
      }
      case 'o':
      case 'x':
      case 'X': {
        if (precision >= 0) throw new JavaThrow('IllegalFormatPrecisionException', String(precision), line)
        if (isNull) {
          out = state.out += pad('null', width, left)
          break
        }
        if (!(t === 'int' || t === 'long' || t === 'short' || t === 'byte')) mismatch()
        const radix = conv === 'o' ? 8 : 16
        let s: string
        if (t === 'long') s = BigInt.asUintN(64, v as bigint).toString(radix)
        else if (t === 'byte') s = ((v as number) & 0xff).toString(radix)
        else if (t === 'short') s = ((v as number) & 0xffff).toString(radix)
        else s = ((v as number) >>> 0).toString(radix)
        if (flags.includes('#')) s = (radix === 16 ? '0x' : '0') + s
        if (conv === 'X') s = s.toUpperCase()
        if (flags.includes('0') && width > s.length) s = s.padStart(width, '0')
        out = state.out += pad(s, width, left)
        break
      }
      case 'f':
      case 'e':
      case 'E':
      case 'g':
      case 'G': {
        if (isNull) {
          out = state.out += pad('null', width, left)
          break
        }
        if (!(t === 'double' || t === 'float')) mismatch()
        const d = v as number
        if (Number.isNaN(d)) {
          out = state.out += pad('NaN', width, left)
          break
        }
        const neg = d < 0 || Object.is(d, -0)
        const abs = Math.abs(d)
        if (abs === Infinity) {
          const s = neg ? (flags.includes('(') ? '(Infinity)' : '-Infinity') : flags.includes('+') ? '+Infinity' : 'Infinity'
          out = state.out += pad(s, width, left)
          break
        }
        let mag: string
        if (conv === 'f') {
          mag = fixedMagnitude(abs, precision === -1 ? 6 : precision)
        } else if (conv === 'e' || conv === 'E') {
          mag = sciMagnitude(abs, precision === -1 ? 6 : precision, conv === 'E')
        } else {
          let p = precision === -1 ? 6 : precision === 0 ? 1 : precision
          // round to p significant digits first to decide notation
          let useSci: boolean
          if (abs === 0) useSci = false
          else {
            const { digits, pointPos } = shortestDouble(abs)
            const r = roundHalfUp(digits, p)
            const exp10 = pointPos - 1 + (r.grew ? 1 : 0)
            useSci = exp10 < -4 || exp10 >= p
            if (!useSci) p = p - (exp10 + 1)
            else p = p - 1
          }
          mag = useSci ? sciMagnitude(abs, p, conv === 'G') : fixedMagnitude(abs, Math.max(p, 0))
        }
        if (flags.includes(',') && conv === 'f') {
          const [ip, fp] = mag.split('.')
          mag = groupThousands(ip) + (fp !== undefined ? '.' + fp : '')
        }
        out = state.out += signAndPad(mag, neg, flags, width)
        break
      }
    }
  }
  return out
}

function pad(s: string, width: number, left: boolean): string {
  if (width <= s.length) return s
  return left ? s.padEnd(width, ' ') : s.padStart(width, ' ')
}

function signAndPad(mag: string, neg: boolean, flags: string, width: number): string {
  const paren = neg && flags.includes('(')
  const prefix = neg ? (paren ? '(' : '-') : flags.includes('+') ? '+' : flags.includes(' ') ? ' ' : ''
  const suffix = paren ? ')' : ''
  let body = mag
  if (flags.includes('0') && width > 0) {
    const needed = width - prefix.length - suffix.length - body.length
    if (needed > 0) body = '0'.repeat(needed) + body
  }
  return pad(prefix + body + suffix, width, flags.includes('-'))
}

/** helper for String.valueOf-style concatenation on format args */
export function argToString(a: FormatArg): string {
  if (a.value instanceof JStr) return a.value.s
  return javaToString(a.value, a.type)
}
