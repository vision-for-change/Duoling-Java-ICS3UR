/**
 * Grading for every question type. Pure functions: easy to unit test and
 * easy to move to a server later.
 */
import { outputsMatch, runJava, type RunResult } from '../java'
import type { ArrangeQuestion, ErrorKind, FillBlankQuestion, IconName, Question } from '../data/types'
import { runCodeTask, type CodeTaskResult } from './codeRunner'

export type Response =
  | { type: 'choice'; index: number }
  | { type: 'bool'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'blanks'; values: string[] }
  | { type: 'error-kind'; value: ErrorKind }
  | { type: 'arrange'; lines: string[] }
  | { type: 'line'; line: number }
  | { type: 'code'; code: string }

export interface GradeResult {
  correct: boolean
  /** targeted feedback for this particular wrong answer */
  feedback?: string
  /** per-blank correctness for fill-in-the-blank */
  blankResults?: boolean[]
  /** correct, but different from the model answer */
  alternative?: boolean
  codeResult?: CodeTaskResult
  runResult?: RunResult
}

export const BLANK = '___'

/** Remove whitespace outside of string/char literals so `i<5` equals `i < 5`. */
export function normalizeCode(s: string): string {
  let out = ''
  let quote: string | null = null
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (quote) {
      out += c
      if (c === '\\' && i + 1 < s.length) {
        out += s[++i]
      } else if (c === quote) {
        quote = null
      }
    } else if (c === '"' || c === "'") {
      quote = c
      out += c
    } else if (!/\s/.test(c)) {
      out += c
    }
  }
  return out.replace(/;+$/, '')
}

export function fillBlanks(code: string, values: string[]): string {
  const parts = code.split(BLANK)
  return parts.map((p, i) => (i < values.length ? p + values[i] : p)).join('')
}

export function blankCount(code: string): number {
  return code.split(BLANK).length - 1
}

export function arrangeProgram(q: ArrangeQuestion, lines: string[]): string {
  return (q.given ? q.given + '\n' : '') + lines.join('\n')
}

function gradeFillBlank(q: FillBlankQuestion, values: string[]): GradeResult {
  const blankResults = q.blanks.map((accepted, i) =>
    accepted.some((a) => normalizeCode(a) === normalizeCode(values[i] ?? '')),
  )
  if (blankResults.every(Boolean)) return { correct: true, blankResults }
  if (q.expectedOutput !== undefined && values.every((v) => v.trim() !== '')) {
    const run = runJava(fillBlanks(q.code, values), { stdin: q.stdin ?? '' })
    if (run.status === 'ok' && outputsMatch(run.stdout, q.expectedOutput)) {
      return { correct: true, alternative: true, blankResults: blankResults.map(() => true), runResult: run }
    }
    return { correct: false, blankResults, runResult: run }
  }
  return { correct: false, blankResults }
}

function gradeArrange(q: ArrangeQuestion, lines: string[]): GradeResult {
  const trimmed = lines.map((l) => l.trim())
  const distractors = new Set((q.distractors ?? []).map((d) => d.trim()))
  if (trimmed.some((l) => distractors.has(l) && !q.lines.some((real) => real.trim() === l))) {
    return { correct: false, feedback: 'One of the lines you used is a decoy that doesn\'t belong in this program.' }
  }
  if (trimmed.length !== q.lines.length) {
    return { correct: false, feedback: `This program needs exactly ${q.lines.length} lines.` }
  }
  const orders = [q.lines.map((_, i) => i), ...(q.alternatives ?? [])]
  for (const order of orders) {
    if (order.every((idx, pos) => q.lines[idx].trim() === trimmed[pos])) return { correct: true }
  }
  if (q.expectedOutput !== undefined) {
    const run = runJava(arrangeProgram(q, trimmed), { stdin: q.stdin ?? '' })
    if (run.status === 'ok' && outputsMatch(run.stdout, q.expectedOutput)) return { correct: true, alternative: true, runResult: run }
    return { correct: false, runResult: run }
  }
  return { correct: false }
}

export function grade(q: Question, r: Response): GradeResult {
  switch (q.type) {
    case 'multiple-choice':
    case 'predict-output': {
      if (r.type !== 'choice') break
      const correct = r.index === q.answer
      return { correct, feedback: correct ? undefined : q.options[r.index]?.feedback }
    }
    case 'true-false':
      if (r.type !== 'bool') break
      return { correct: r.value === q.answer, feedback: r.value === q.answer ? undefined : q.wrongFeedback }
    case 'type-output':
      if (r.type !== 'text') break
      return { correct: outputsMatch(r.value, q.answer) }
    case 'fill-blank':
      if (r.type !== 'blanks') break
      return gradeFillBlank(q, r.values)
    case 'error-type':
      if (r.type !== 'error-kind') break
      return { correct: r.value === q.answer, feedback: r.value === q.answer ? undefined : q.feedback?.[r.value] }
    case 'arrange':
      if (r.type !== 'arrange') break
      return gradeArrange(q, r.lines)
    case 'find-bug':
      if (r.type !== 'line') break
      return { correct: q.bugLines.includes(r.line) }
    case 'fix-code':
    case 'write-code': {
      if (r.type !== 'code') break
      const codeResult = runCodeTask(r.code, q.tests, q.solution, q.mustInclude)
      return { correct: codeResult.passed, codeResult }
    }
  }
  return { correct: false }
}

export const ERROR_KIND_LABELS: Record<ErrorKind, { label: string; hint: string; icon: IconName }> = {
  syntax: { label: 'Syntax / compile error', hint: 'Java refuses to compile it', icon: 'brick-wall' },
  runtime: { label: 'Runtime error', hint: 'It starts, then crashes', icon: 'bomb' },
  logic: { label: 'Logic error', hint: 'It runs, but the result is wrong', icon: 'brain' },
  none: { label: 'No error', hint: 'It works as intended', icon: 'check-circle' },
}

/** Short text describing the right answer (shown after the learner runs out of attempts). */
export function answerSummary(q: Question): string {
  switch (q.type) {
    case 'multiple-choice':
    case 'predict-output':
      return q.options[q.answer].text
    case 'true-false':
      return q.answer ? 'True' : 'False'
    case 'type-output':
      return q.answer
    case 'fill-blank':
      return q.blanks.map((b) => b[0]).join('  ·  ')
    case 'error-type':
      return ERROR_KIND_LABELS[q.answer].label
    case 'arrange':
      return q.lines.join('\n')
    case 'find-bug':
      return `Line ${q.bugLines[0]}`
    case 'fix-code':
    case 'write-code':
      return q.solution
  }
}

/** Question types where a second attempt makes sense (not a coin flip). */
export function allowsRetry(q: Question): boolean {
  return q.type !== 'true-false'
}
