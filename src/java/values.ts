/**
 * Runtime value helpers shared by the checker (constant folding) and the interpreter.
 *
 * Representation of Java values in JS:
 *   int / short / byte / char -> number   (char = UTF-16 code unit)
 *   long                      -> bigint
 *   float / double            -> number
 *   boolean                   -> boolean
 *   String                    -> JStr (object, so that == compares identity like Java)
 */
import type { JType } from './ast'
import { exceptionToString, isExceptionType, JavaThrow, type JavaExceptionValue } from './errors'
import { formatDouble, formatFloat } from './format'

export class JStr {
  s: string
  constructor(s: string) {
    this.s = s
  }
}

const internPool = new Map<string, JStr>()
/** String literals and compile-time constant strings are interned, exactly like Java. */
export function intern(s: string): JStr {
  let v = internPool.get(s)
  if (!v) {
    v = new JStr(s)
    internPool.set(s, v)
  }
  return v
}

export const INT_TYPES = new Set(['int', 'short', 'byte', 'char'])
export const NUMERIC_TYPES = new Set(['int', 'short', 'byte', 'char', 'long', 'float', 'double'])
export const PRIMITIVE_TYPES = new Set([...NUMERIC_TYPES, 'boolean'])

export function isNumeric(t: JType | undefined): boolean {
  return !!t && NUMERIC_TYPES.has(t)
}
export function isIntegral(t: JType | undefined): boolean {
  return !!t && (INT_TYPES.has(t) || t === 'long')
}
export function isPrimitive(t: JType | undefined): boolean {
  return !!t && PRIMITIVE_TYPES.has(t)
}
export function isReference(t: JType | undefined): boolean {
  return !!t && !PRIMITIVE_TYPES.has(t) && t !== 'void'
}

/** Binary numeric promotion (JLS 5.6.2) */
export function promote(a: JType, b: JType): JType {
  if (a === 'double' || b === 'double') return 'double'
  if (a === 'float' || b === 'float') return 'float'
  if (a === 'long' || b === 'long') return 'long'
  return 'int'
}
/** Unary numeric promotion */
export function promoteUnary(a: JType): JType {
  return a === 'char' || a === 'short' || a === 'byte' ? 'int' : a
}

const WIDENING: Record<string, string[]> = {
  byte: ['short', 'int', 'long', 'float', 'double'],
  short: ['int', 'long', 'float', 'double'],
  char: ['int', 'long', 'float', 'double'],
  int: ['long', 'float', 'double'],
  long: ['float', 'double'],
  float: ['double'],
}
export function isWidening(from: JType, to: JType): boolean {
  return WIDENING[from]?.includes(to) ?? false
}

/** Fits a constant int value into byte/short/char without loss? */
export function constFits(value: number, to: JType): boolean {
  if (to === 'byte') return value >= -128 && value <= 127
  if (to === 'short') return value >= -32768 && value <= 32767
  if (to === 'char') return value >= 0 && value <= 0xffff
  return false
}

// ---------- conversions ----------
const INT_MIN = -2147483648
const INT_MAX = 2147483647
const LONG_MIN = -(1n << 63n)
const LONG_MAX = (1n << 63n) - 1n

function floatingToInt(v: number): number {
  if (Number.isNaN(v)) return 0
  if (v >= INT_MAX) return INT_MAX
  if (v <= INT_MIN) return INT_MIN
  return Math.trunc(v) | 0
}
function floatingToLong(v: number): bigint {
  if (Number.isNaN(v)) return 0n
  if (v >= 9223372036854775807) return LONG_MAX
  if (v <= -9223372036854775808) return LONG_MIN
  return BigInt(Math.trunc(v))
}

/** Convert a primitive value from one primitive type to another (casting rules). */
export function convertPrim(value: unknown, from: JType, to: JType): unknown {
  if (from === to) return value
  if (to === 'boolean' || from === 'boolean') return value
  // normalise source to either a JS number (int-like / floating) or bigint (long)
  switch (to) {
    case 'double':
      return from === 'long' ? Number(value as bigint) : (value as number)
    case 'float':
      return Math.fround(from === 'long' ? Number(value as bigint) : (value as number))
    case 'long':
      if (from === 'float' || from === 'double') return floatingToLong(value as number)
      return BigInt(value as number)
    case 'int': {
      if (from === 'long') return Number(BigInt.asIntN(32, value as bigint))
      if (from === 'float' || from === 'double') return floatingToInt(value as number)
      return value as number
    }
    case 'short': {
      const i = convertPrim(value, from, 'int') as number
      return (i << 16) >> 16
    }
    case 'byte': {
      const i = convertPrim(value, from, 'int') as number
      return (i << 24) >> 24
    }
    case 'char': {
      const i = convertPrim(value, from, 'int') as number
      return i & 0xffff
    }
  }
  return value
}

// ---------- arithmetic (operands already converted to `type`) ----------
export function arith(op: string, a: unknown, b: unknown, type: JType, line = 0): unknown {
  if (type === 'int') {
    const x = a as number
    const y = b as number
    switch (op) {
      case '+': return (x + y) | 0
      case '-': return (x - y) | 0
      case '*': return Math.imul(x, y)
      case '/':
        if (y === 0) throw new JavaThrow('ArithmeticException', '/ by zero', line)
        return (x / y) | 0
      case '%':
        if (y === 0) throw new JavaThrow('ArithmeticException', '/ by zero', line)
        return (x % y) | 0
      case '&': return x & y
      case '|': return x | y
      case '^': return x ^ y
    }
  } else if (type === 'long') {
    const x = a as bigint
    const y = b as bigint
    switch (op) {
      case '+': return BigInt.asIntN(64, x + y)
      case '-': return BigInt.asIntN(64, x - y)
      case '*': return BigInt.asIntN(64, x * y)
      case '/':
        if (y === 0n) throw new JavaThrow('ArithmeticException', '/ by zero', line)
        return BigInt.asIntN(64, x / y)
      case '%':
        if (y === 0n) throw new JavaThrow('ArithmeticException', '/ by zero', line)
        return BigInt.asIntN(64, x % y)
      case '&': return x & y
      case '|': return x | y
      case '^': return x ^ y
    }
  } else if (type === 'double' || type === 'float') {
    const x = a as number
    const y = b as number
    let r: number
    switch (op) {
      case '+': r = x + y; break
      case '-': r = x - y; break
      case '*': r = x * y; break
      case '/': r = x / y; break
      case '%': r = x % y; break
      default: throw new Error('bad floating op ' + op)
    }
    return type === 'float' ? Math.fround(r) : r
  } else if (type === 'boolean') {
    const x = a as boolean
    const y = b as boolean
    switch (op) {
      case '&': return x && y
      case '|': return x || y
      case '^': return x !== y
    }
  }
  throw new Error(`unsupported arithmetic ${op} on ${type}`)
}

export function shift(op: string, a: unknown, b: unknown, leftType: JType, rightType: JType): unknown {
  const count = rightType === 'long' ? Number(BigInt.asUintN(6, b as bigint)) : (b as number)
  if (leftType === 'long') {
    const x = a as bigint
    const c = BigInt(count & 63)
    if (op === '<<') return BigInt.asIntN(64, x << c)
    if (op === '>>') return x >> c
    return BigInt.asIntN(64, BigInt.asUintN(64, x) >> c)
  }
  const x = a as number
  const c = count & 31
  if (op === '<<') return x << c
  if (op === '>>') return x >> c
  return (x >>> c) | 0
}

export function compare(op: string, a: unknown, b: unknown): boolean {
  const x = a as number
  const y = b as number
  switch (op) {
    case '<': return x < y
    case '>': return x > y
    case '<=': return x <= y
    case '>=': return x >= y
    case '==': return x === y
    case '!=': return x !== y
  }
  throw new Error('bad compare ' + op)
}

// ---------- string conversion ----------
export interface BoxedValue {
  boxed: true
  type: JType
  value: unknown
}

export function isBoxed(v: unknown): v is BoxedValue {
  return typeof v === 'object' && v !== null && (v as BoxedValue).boxed === true
}

/** String.valueOf(value) given the value's static type. */
export function javaToString(value: unknown, type: JType): string {
  if (isBoxed(value)) return javaToString(value.value, value.type)
  switch (type) {
    case 'int':
    case 'short':
    case 'byte':
      return String(value)
    case 'long':
      return (value as bigint).toString()
    case 'char':
      return String.fromCharCode(value as number)
    case 'boolean':
      return value ? 'true' : 'false'
    case 'double':
      return formatDouble(value as number)
    case 'float':
      return formatFloat(value as number)
    case 'null':
      return 'null'
  }
  if (value === null || value === undefined) return 'null'
  if (value instanceof JStr) return value.s
  if (typeof value === 'object' && (value as JavaExceptionValue).kind === 'exception') {
    return exceptionToString(value as JavaExceptionValue)
  }
  if (type === 'Scanner') return 'java.util.Scanner[delimiters=\\p{javaWhitespace}+]'
  if (type === 'Random') return 'java.util.Random@6d06d69c'
  if (isExceptionType(type)) return exceptionToString(value as JavaExceptionValue)
  return String(value)
}

/** How a variable's value is shown in the step-by-step trace. */
export function displayValue(value: unknown, type: JType): string {
  if (value === undefined) return '?'
  if (isBoxed(value)) return displayValue(value.value, value.type)
  if (type === 'String') return value === null ? 'null' : JSON.stringify((value as JStr).s)
  if (type === 'char') {
    const c = String.fromCharCode(value as number)
    return c === '\n' ? "'\\n'" : `'${c}'`
  }
  if (type === 'Scanner') return 'Scanner'
  if (type === 'Random') return 'Random'
  return javaToString(value, type)
}

/** Boxed class name used in printf error messages, e.g. "java.lang.Integer". */
export function boxedClassName(type: JType): string {
  switch (type) {
    case 'int': return 'java.lang.Integer'
    case 'long': return 'java.lang.Long'
    case 'short': return 'java.lang.Short'
    case 'byte': return 'java.lang.Byte'
    case 'double': return 'java.lang.Double'
    case 'float': return 'java.lang.Float'
    case 'char': return 'java.lang.Character'
    case 'boolean': return 'java.lang.Boolean'
    case 'String': return 'java.lang.String'
    case 'Scanner': return 'java.util.Scanner'
    default: return 'java.lang.Object'
  }
}
