import type { Question } from '../../data/types'
import type { GradeResult, Response } from '../../engine/grading'

export type Phase = 'answering' | 'retry' | 'correct' | 'failed'

export interface QuestionViewProps<Q extends Question = Question> {
  question: Q
  response: Response | null
  onChange: (r: Response) => void
  /** answer submitted and waiting for Continue */
  locked: boolean
  phase: Phase
  grade: GradeResult | null
  /** wrong choices from the first attempt (multiple choice) */
  disabledOptions: number[]
  /** display order of multiple-choice options (indexes into question.options) */
  optionOrder?: number[]
  /** called when the learner presses Enter inside an input */
  onSubmit: () => void
}

export const TYPE_LABEL: Record<Question['type'], string> = {
  'multiple-choice': 'Multiple choice',
  'predict-output': 'Predict the output',
  'type-output': 'Predict the output',
  'true-false': 'True or false?',
  'fill-blank': 'Fill in the blank',
  'error-type': 'Error identification',
  arrange: 'Arrange the code',
  'find-bug': 'Debugging challenge',
  'fix-code': 'Debugging challenge',
  'write-code': 'Code completion',
}

/** Is the draft response complete enough to be checked? */
export function isComplete(q: Question, r: Response | null): boolean {
  if (!r) return false
  switch (r.type) {
    case 'choice':
    case 'bool':
    case 'error-kind':
    case 'line':
      return true
    case 'text':
      return r.value.trim().length > 0
    case 'blanks':
      return q.type === 'fill-blank' && r.values.length === q.blanks.length && r.values.every((v) => v.trim().length > 0)
    case 'arrange':
      return q.type === 'arrange' && r.lines.length === q.lines.length
    case 'code':
      return r.code.trim().length > 0
  }
}

/** Random display order for answer options, so the right answer isn't always in the same spot. */
export function shuffledOrder(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
