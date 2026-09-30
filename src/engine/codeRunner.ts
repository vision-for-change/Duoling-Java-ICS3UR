/**
 * Runs learner code against a question's tests using the Java sandbox.
 */
import { normalizeOutput, outputsMatch, runJava, type RunResult } from '../java'
import type { CodeTest } from '../data/types'

/** Override the initial value of variables in the code, e.g. { temp: '35' } turns `int temp = 22;` into `int temp = 35;`. */
export function applySet(code: string, set: Record<string, string> | undefined): { code: string; missing: string[] } {
  if (!set) return { code, missing: [] }
  let out = code
  const missing: string[] = []
  for (const [name, value] of Object.entries(set)) {
    const re = new RegExp(`(\\b${name}\\s*=(?!=)\\s*)([^,;]+)`)
    if (!re.test(out)) {
      missing.push(name)
      continue
    }
    out = out.replace(re, (_m, prefix: string) => `${prefix}${value}`)
  }
  return { code: out, missing }
}

export interface TestResult {
  test: CodeTest
  passed: boolean
  expected: string
  actual: string
  result: RunResult
  /** human-readable reason when it failed */
  reason?: string
}

export interface CodeTaskResult {
  passed: boolean
  tests: TestResult[]
  /** unmet mustInclude requirements */
  missingPatterns: string[]
  /** compile / unsupported error that stopped every test */
  blockingError?: RunResult
}

export function expectedOutputFor(test: CodeTest, solution: string): string {
  if (test.output !== undefined) return test.output
  if (test.outputPattern) return `(matches ${test.outputPattern})`
  const { code } = applySet(solution, test.set)
  return runJava(code, { stdin: test.stdin ?? '' }).stdout
}

export function runCodeTask(
  code: string,
  tests: CodeTest[],
  solution: string,
  mustInclude: { pattern: string; message: string }[] = [],
): CodeTaskResult {
  const missingPatterns = mustInclude.filter((m) => !new RegExp(m.pattern).test(stripComments(code))).map((m) => m.message)
  const results: TestResult[] = []
  let blockingError: RunResult | undefined
  for (const test of tests) {
    const { code: prepared, missing } = applySet(code, test.set)
    const expected = expectedOutputFor(test, solution)
    if (missing.length) {
      const result = runJava(prepared, { stdin: test.stdin ?? '' })
      results.push({
        test,
        passed: false,
        expected,
        actual: result.stdout,
        result,
        reason: `Keep the variable${missing.length > 1 ? 's' : ''} ${missing.map((m) => `\`${m}\``).join(', ')} declared with an = so the tests can change ${missing.length > 1 ? 'their values' : 'its value'}.`,
      })
      continue
    }
    const result = runJava(prepared, { stdin: test.stdin ?? '' })
    if (result.status === 'compile-error' || result.status === 'unsupported') {
      blockingError = result
      results.push({ test, passed: false, expected, actual: '', result, reason: 'The code does not compile.' })
      break
    }
    let passed: boolean
    let reason: string | undefined
    if (result.status === 'timeout') {
      passed = false
      reason = 'The program never finished. It is probably stuck in an infinite loop.'
    } else if (result.status === 'needs-input') {
      passed = false
      reason = 'The program tried to read more input than the test provides.'
    } else if (test.outputPattern) {
      passed = result.status === 'ok' && new RegExp(test.outputPattern).test(normalizeOutput(result.stdout))
      if (!passed) reason = result.status === 'runtime-error' ? `It crashed with ${result.error?.exception}.` : 'The output doesn\'t have the right format.'
    } else {
      passed = result.status === 'ok' && outputsMatch(result.stdout, expected)
      if (!passed) reason = result.status === 'runtime-error' ? `It crashed with ${result.error?.exception}.` : 'The output doesn\'t match.'
    }
    results.push({ test, passed, expected, actual: result.stdout, result, reason })
  }
  return {
    passed: !blockingError && missingPatterns.length === 0 && results.length === tests.length && results.every((r) => r.passed),
    tests: results,
    missingPatterns,
    blockingError,
  }
}

function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}
