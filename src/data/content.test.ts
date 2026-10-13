/**
 * Validates the whole question bank against the Java sandbox:
 * every "what does this print?" answer is checked by actually running the code,
 * every "error type" is checked by compiling/running, every coding task's
 * reference solution must pass its tests (and the starter must not).
 */
import { describe, expect, it } from 'vitest'
import { outputsMatch, runJava, type RunResult } from '../java'
import { runCodeTask } from '../engine/codeRunner'
import { arrangeProgram, blankCount, fillBlanks, grade } from '../engine/grading'
import { getQuestion, LESSONS, QUESTIONS, UNITS } from './curriculum'
import { ALL_PROJECT_STAGES, PROJECTS } from './projects'
import { placementItems } from './placement'
import type { ErrorKind, Question, Verify } from './types'

const ALL: Question[] = [...QUESTIONS, ...placementItems.map((p) => p.question)]

function statusFor(kind: ErrorKind, r: RunResult): boolean {
  switch (kind) {
    case 'syntax':
      return r.status === 'compile-error'
    case 'runtime':
      return r.status === 'runtime-error'
    case 'logic':
      return r.status === 'ok' || r.status === 'timeout'
    case 'none':
      return r.status === 'ok'
  }
}

function checkVerify(v: Verify, r: RunResult) {
  expect(r.status, r.error?.message).toBe(v.status)
  if (v.exception) expect(r.error?.exception).toBe(v.exception)
  if (v.output !== undefined) expect(r.stdout.trimEnd()).toBe(v.output)
}

describe('curriculum structure', () => {
  it('every lesson question exists and has a unique id', () => {
    for (const l of LESSONS) {
      for (const id of [...l.questions, l.challenge]) expect(() => getQuestion(id), id).not.toThrow()
      expect(new Set(l.questions).size).toBe(l.questions.length)
      expect(l.questions.length).toBeGreaterThanOrEqual(5)
    }
    for (const u of UNITS) for (const id of u.checkpoint) expect(() => getQuestion(id), id).not.toThrow()
  })

  it('every question is used somewhere', () => {
    const used = new Set<string>()
    for (const u of UNITS) {
      u.checkpoint.forEach((id) => used.add(id))
      for (const l of u.lessons) [...l.questions, l.challenge].forEach((id) => used.add(id))
    }
    const unused = QUESTIONS.filter((q) => !used.has(q.id)).map((q) => q.id)
    expect(unused).toEqual([])
  })

  it('has a substantial question bank per topic', () => {
    const counts: Record<string, number> = {}
    for (const q of QUESTIONS) counts[q.topic] = (counts[q.topic] ?? 0) + 1
    for (const [topic, n] of Object.entries(counts)) expect(n, topic).toBeGreaterThanOrEqual(10)
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(200)
  })
})

describe('question bank is correct Java', () => {
  for (const q of ALL) {
    it(`${q.id} (${q.type})`, () => {
      const stdin = q.stdin ?? ''
      switch (q.type) {
        case 'predict-output': {
          expect(q.answer).toBeLessThan(q.options.length)
          const r = runJava(q.code!, { stdin })
          if (q.verify) {
            checkVerify(q.verify, r)
            break
          }
          expect(r.status, r.error?.message).toBe('ok')
          expect(outputsMatch(r.stdout, q.options[q.answer].text), `printed ${JSON.stringify(r.stdout)}`).toBe(true)
          // no other option may also be the real output
          q.options.forEach((o, i) => {
            if (i !== q.answer) expect(outputsMatch(r.stdout, o.text), `option ${i} also matches`).toBe(false)
          })
          break
        }
        case 'multiple-choice':
          expect(q.answer).toBeLessThan(q.options.length)
          if (q.verify && q.code) checkVerify(q.verify, runJava(q.code, { stdin }))
          break
        case 'type-output': {
          const r = runJava(q.code, { stdin })
          if (q.verify) {
            checkVerify(q.verify, r)
            break
          }
          expect(r.status, r.error?.message).toBe('ok')
          expect(outputsMatch(r.stdout, q.answer), `printed ${JSON.stringify(r.stdout)}`).toBe(true)
          break
        }
        case 'fill-blank': {
          expect(blankCount(q.code)).toBe(q.blanks.length)
          const canonical = q.blanks.map((b) => b[0])
          const r = runJava(fillBlanks(q.code, canonical), { stdin })
          if (q.verify) checkVerify(q.verify, r)
          else expect(r.status, r.error?.message).toBe('ok')
          if (q.expectedOutput !== undefined) expect(r.stdout.trimEnd()).toBe(q.expectedOutput)
          // every accepted alternative must also work
          q.blanks.forEach((accepted, i) => {
            for (const alt of accepted) {
              const values = [...canonical]
              values[i] = alt
              const ra = runJava(fillBlanks(q.code, values), { stdin })
              if (!q.verify?.random) expect(ra.status, `${alt}: ${ra.error?.message}`).toBe('ok')
              if (q.expectedOutput !== undefined) expect(ra.stdout.trimEnd(), alt).toBe(q.expectedOutput)
            }
          })
          // word-bank decoys must be graded wrong
          if (q.bank) {
            q.blanks.forEach((accepted, i) => {
              for (const option of q.bank!) {
                if (accepted.includes(option)) continue
                const values = [...canonical]
                values[i] = option
                expect(grade(q, { type: 'blanks', values }).correct, `decoy "${option}" accepted`).toBe(false)
              }
            })
          }
          expect(grade(q, { type: 'blanks', values: canonical }).correct).toBe(true)
          break
        }
        case 'error-type': {
          const r = runJava(q.code, { stdin })
          expect(statusFor(q.answer, r), `${q.answer} but got ${r.status}: ${r.error?.message ?? r.stdout}`).toBe(true)
          break
        }
        case 'arrange': {
          const r = runJava(arrangeProgram(q, q.lines), { stdin })
          expect(r.status, r.error?.message).toBe('ok')
          if (q.expectedOutput !== undefined) expect(r.stdout.trimEnd()).toBe(q.expectedOutput)
          for (const alt of q.alternatives ?? []) {
            const ra = runJava(arrangeProgram(q, alt.map((i) => q.lines[i])), { stdin })
            expect(ra.status).toBe('ok')
            if (q.expectedOutput !== undefined) expect(ra.stdout.trimEnd()).toBe(q.expectedOutput)
          }
          expect(grade(q, { type: 'arrange', lines: q.lines }).correct).toBe(true)
          break
        }
        case 'find-bug': {
          const lines = q.code.split('\n').length
          for (const l of q.bugLines) expect(l).toBeLessThanOrEqual(lines)
          const buggy = runJava(q.code, { stdin })
          expect(statusFor(q.bugKind, buggy) && q.bugKind !== 'none', `bugKind ${q.bugKind} but ${buggy.status}: ${buggy.error?.message}`).toBe(true)
          const fixed = runJava(q.fixedCode, { stdin })
          expect(fixed.status, fixed.error?.message).toBe('ok')
          if (q.bugKind === 'logic' && buggy.status === 'ok') expect(buggy.stdout).not.toBe(fixed.stdout)
          break
        }
        case 'fix-code':
        case 'write-code': {
          const sol = runCodeTask(q.solution, q.tests, q.solution, q.mustInclude)
          const failing = sol.tests.filter((t) => !t.passed).map((t) => `${t.test.label}: expected ${JSON.stringify(t.expected)} got ${JSON.stringify(t.actual)} ${t.result.error?.message ?? ''}`)
          expect(failing).toEqual([])
          expect(sol.missingPatterns).toEqual([])
          expect(sol.passed).toBe(true)
          const starter = runCodeTask(q.starter, q.tests, q.solution, q.mustInclude)
          expect(starter.passed, 'starter code must not already pass').toBe(false)
          break
        }
        case 'true-false':
          break
      }
    })
  }
})

describe('teaching cards run', () => {
  for (const l of LESSONS) {
    it(l.id, () => {
      for (const card of l.teach) {
        if (card.kind === 'example') {
          const r = runJava(card.code, { stdin: card.stdin ?? '' })
          expect(r.status, `${card.title}: ${r.error?.message}`).toBe(card.crashes ? 'runtime-error' : 'ok')
          expect(r.stdout.length, card.title).toBeGreaterThan(0)
          for (const n of card.notes ?? []) expect(n.line).toBeLessThanOrEqual(card.code.split('\n').length)
        }
        if (card.kind === 'mistake') {
          const right = runJava(card.right, { stdin: card.stdin ?? '' })
          expect(right.status, `${card.title} (right): ${right.error?.message}`).toBe('ok')
          const wrong = runJava(card.wrong, { stdin: card.stdin ?? '' })
          const differs = wrong.status !== 'ok' || wrong.stdout !== right.stdout
          expect(differs, `${card.title}: wrong and right behave the same`).toBe(true)
        }
      }
    })
  }
})

describe('final projects', () => {
  for (const stage of ALL_PROJECT_STAGES) {
    it(stage.id, () => {
      const sol = runCodeTask(stage.solution, stage.tests, stage.solution, stage.mustInclude)
      expect(sol.passed, JSON.stringify(sol.tests.map((t) => [t.reason, t.actual]))).toBe(true)
      for (const t of sol.tests) expect(t.result.status).toBe('ok')
      const starter = runCodeTask(stage.starter, stage.tests, stage.solution, stage.mustInclude)
      expect(starter.passed).toBe(false)
      expect(stage.explain.length).toBeGreaterThan(0)
    })
  }
  it('has six projects with a video each, ending in a crash-proof program', () => {
    expect(PROJECTS.map((p) => p.title)).toEqual(['Shopping Cart', 'Number Guesser', 'Mini Banking', 'Grade Analyzer', 'Number Statistics Analyzer', 'Java Quiz'])
    for (const p of PROJECTS) {
      expect(p.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/)
      const last = p.stages[p.stages.length - 1].solution
      expect(last).toMatch(/\btry\b/)
      expect(last).toMatch(/\bcatch\b/)
      expect(last).toMatch(/nextInt\(\)/)
    }
  })
})
