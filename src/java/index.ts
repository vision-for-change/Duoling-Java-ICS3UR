/**
 * Public API of ByteBrew's Java sandbox.
 *
 *   runJava(source, { stdin })  ->  RunResult
 *
 * Supports a beginner-friendly subset of Java: primitive types, String,
 * expressions, if/else, while/do-while/for, Scanner input, try/catch,
 * Math, printf/String.format and static methods. Anything else produces an
 * honest "unsupported" result instead of pretending to run.
 */
import { checkProgram } from './checker'
import { CompileError, exceptionToString, JavaThrow, UnsupportedError } from './errors'
import { ExitSignal, Interpreter, TimeoutSignal, type ConsoleSegment, type TraceStep } from './interpreter'
import { parseProgram } from './parser'
import { NeedInput } from './scanner'

export type { ConsoleSegment, TraceStep, TraceVar } from './interpreter'

export type RunStatus = 'ok' | 'compile-error' | 'runtime-error' | 'timeout' | 'needs-input' | 'unsupported'

export interface RunError {
  /** javac-style message (compile) or "java.lang.X: msg" (runtime) */
  message: string
  line?: number
  col?: number
  /** simple exception class name for runtime errors, e.g. "ArithmeticException" */
  exception?: string
  exceptionMessage?: string | null
}

export interface RunResult {
  status: RunStatus
  /** everything printed to System.out */
  stdout: string
  /** console transcript: output, error output and echoed input, in order */
  segments: ConsoleSegment[]
  error?: RunError
  trace: TraceStep[]
  traceTruncated: boolean
  steps: number
  exitCode?: number
}

export interface RunOptions {
  stdin?: string
  /** ask for more input instead of failing when input runs out */
  interactive?: boolean
  trace?: boolean
  maxSteps?: number
  maxTraceSteps?: number
  seed?: number
}

export const DEFAULT_MAX_STEPS = 100_000

export function runJava(source: string, options: RunOptions = {}): RunResult {
  const base: RunResult = { status: 'ok', stdout: '', segments: [], trace: [], traceTruncated: false, steps: 0 }
  let checked
  try {
    checked = checkProgram(parseProgram(source))
  } catch (e) {
    if (e instanceof CompileError) {
      return { ...base, status: 'compile-error', error: { message: e.message, line: e.line, col: e.col } }
    }
    if (e instanceof UnsupportedError) {
      return { ...base, status: 'unsupported', error: { message: e.message, line: e.line, col: e.col } }
    }
    return { ...base, status: 'unsupported', error: { message: 'The sandbox could not understand this program: ' + String((e as Error).message ?? e) } }
  }

  const interp = new Interpreter(checked, {
    stdin: options.stdin ?? '',
    interactive: options.interactive ?? false,
    maxSteps: options.maxSteps ?? DEFAULT_MAX_STEPS,
    trace: options.trace ?? false,
    maxTraceSteps: options.maxTraceSteps ?? 500,
    seed: options.seed ?? 42,
    maxOutput: 40_000,
  })

  const finish = (partial: Partial<RunResult>): RunResult => ({
    ...base,
    stdout: interp.stdout,
    segments: interp.segments,
    trace: interp.trace,
    traceTruncated: interp.traceTruncated,
    steps: interp.steps,
    ...partial,
  })

  try {
    interp.run()
    return finish({ status: 'ok', exitCode: 0 })
  } catch (e) {
    if (e instanceof ExitSignal) return finish({ status: 'ok', exitCode: e.code })
    if (e instanceof NeedInput) return finish({ status: 'needs-input' })
    if (e instanceof TimeoutSignal) {
      return finish({
        status: 'timeout',
        error: {
          message:
            e.reason === 'steps'
              ? `Stopped after ${(options.maxSteps ?? DEFAULT_MAX_STEPS).toLocaleString('en-US')} steps. This looks like an infinite loop.`
              : 'Stopped because the program printed too much output. This looks like an infinite loop.',
          line: interp.curLine,
        },
      })
    }
    let thrown: JavaThrow | null = null
    if (e instanceof JavaThrow) thrown = e
    else if (e instanceof RangeError) thrown = new JavaThrow('StackOverflowError', null, interp.curLine)
    if (thrown) {
      const line = thrown.line || interp.curLine
      const text = exceptionToString(thrown.exception)
      const trace = `Exception in thread "main" ${text}\n\tat Main.main(Main.java:${line})\n`
      const segments = [...interp.segments]
      const last = segments[segments.length - 1]
      if (last && last.kind === 'err') segments[segments.length - 1] = { kind: 'err', text: last.text + trace }
      else segments.push({ kind: 'err', text: trace })
      return finish({
        status: 'runtime-error',
        segments,
        error: { message: text, line, exception: thrown.exception.type, exceptionMessage: thrown.exception.message },
      })
    }
    return finish({
      status: 'unsupported',
      error: { message: 'The sandbox hit an internal problem running this program: ' + String((e as Error)?.message ?? e) },
    })
  }
}

/** Compare program output the way the graders do: ignore trailing spaces and trailing blank lines. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}

export function outputsMatch(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected)
}
