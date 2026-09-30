/**
 * Error types produced by ByteBrew's Java sandbox.
 *
 * CompileError   -> the code would not compile with javac (syntax / type errors)
 * UnsupportedError -> valid Java that the beginner sandbox does not implement
 * JavaThrow      -> a Java exception thrown at runtime (may be caught by try/catch)
 */

export class CompileError extends Error {
  line: number
  col: number
  constructor(message: string, line: number, col: number) {
    super(message)
    this.name = 'CompileError'
    this.line = line
    this.col = col
  }
}

export class UnsupportedError extends Error {
  line: number
  col: number
  constructor(message: string, line: number, col: number) {
    super(message)
    this.name = 'UnsupportedError'
    this.line = line
    this.col = col
  }
}

/** Fully-qualified names + parent class for the exceptions the sandbox knows about. */
export const EXCEPTION_TYPES: Record<string, { pkg: string; parent: string | null }> = {
  Throwable: { pkg: 'java.lang', parent: null },
  Exception: { pkg: 'java.lang', parent: 'Throwable' },
  RuntimeException: { pkg: 'java.lang', parent: 'Exception' },
  ArithmeticException: { pkg: 'java.lang', parent: 'RuntimeException' },
  IllegalArgumentException: { pkg: 'java.lang', parent: 'RuntimeException' },
  IllegalStateException: { pkg: 'java.lang', parent: 'RuntimeException' },
  NumberFormatException: { pkg: 'java.lang', parent: 'IllegalArgumentException' },
  IndexOutOfBoundsException: { pkg: 'java.lang', parent: 'RuntimeException' },
  StringIndexOutOfBoundsException: { pkg: 'java.lang', parent: 'IndexOutOfBoundsException' },
  NullPointerException: { pkg: 'java.lang', parent: 'RuntimeException' },
  NoSuchElementException: { pkg: 'java.util', parent: 'RuntimeException' },
  InputMismatchException: { pkg: 'java.util', parent: 'NoSuchElementException' },
  IllegalFormatException: { pkg: 'java.util', parent: 'IllegalArgumentException' },
  IllegalFormatConversionException: { pkg: 'java.util', parent: 'IllegalFormatException' },
  MissingFormatArgumentException: { pkg: 'java.util', parent: 'IllegalFormatException' },
  UnknownFormatConversionException: { pkg: 'java.util', parent: 'IllegalFormatException' },
  IllegalFormatPrecisionException: { pkg: 'java.util', parent: 'IllegalFormatException' },
  MissingFormatWidthException: { pkg: 'java.util', parent: 'IllegalFormatException' },
  StackOverflowError: { pkg: 'java.lang', parent: 'Throwable' },
}

export function isExceptionType(name: string): boolean {
  return name in EXCEPTION_TYPES
}

/** true if `child` is the same class as, or a subclass of, `ancestor`. */
export function isSubclassOf(child: string, ancestor: string): boolean {
  let cur: string | null = child
  while (cur) {
    if (cur === ancestor) return true
    cur = EXCEPTION_TYPES[cur]?.parent ?? null
  }
  return false
}

export interface JavaExceptionValue {
  kind: 'exception'
  type: string
  message: string | null
}

export function qualifiedExceptionName(type: string): string {
  const info = EXCEPTION_TYPES[type]
  return info ? `${info.pkg}.${type}` : type
}

export function exceptionToString(e: JavaExceptionValue): string {
  const name = qualifiedExceptionName(e.type)
  return e.message === null ? name : `${name}: ${e.message}`
}

export class JavaThrow extends Error {
  exception: JavaExceptionValue
  line: number
  /** text printf had already written before failing (Java writes format output piece by piece) */
  partialOutput?: string
  constructor(type: string, message: string | null, line = 0) {
    super(message ?? type)
    this.name = 'JavaThrow'
    this.exception = { kind: 'exception', type, message }
    this.line = line
  }
}
