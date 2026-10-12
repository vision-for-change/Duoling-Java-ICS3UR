import { unit1 } from './units/unit1'
import { unit2 } from './units/unit2'
import { unit3 } from './units/unit3'
import { unit4 } from './units/unit4'
import { unit5 } from './units/unit5'
import { unit6 } from './units/unit6'
import { unit7 } from './units/unit7'
import { unit8 } from './units/unit8'
import { placementItems } from './placement'
import type { IconName, Lesson, Question, TopicId, Unit } from './types'

const contents = [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8]

export const UNITS: Unit[] = contents.map((c) => c.unit)

export const QUESTIONS: Question[] = contents.flatMap((c) => c.questions)

const questionIndex = new Map<string, Question>()
for (const q of [...QUESTIONS, ...placementItems.map((p) => p.question)]) {
  if (questionIndex.has(q.id)) throw new Error(`Duplicate question id ${q.id}`)
  questionIndex.set(q.id, q)
}

export function getQuestion(id: string): Question {
  const q = questionIndex.get(id)
  if (!q) throw new Error(`Unknown question ${id}`)
  return q
}

export const LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons)

const lessonIndex = new Map(LESSONS.map((l) => [l.id, l]))
export function getLesson(id: string): Lesson | undefined {
  return lessonIndex.get(id)
}

const unitIndex = new Map(UNITS.map((u) => [u.id, u]))
export function getUnit(id: string): Unit | undefined {
  return unitIndex.get(id)
}

/** Which lesson a question belongs to (undefined for checkpoint-only questions). */
const lessonOfQuestion = new Map<string, string>()
for (const l of LESSONS) {
  for (const qid of [...l.questions, l.challenge]) lessonOfQuestion.set(qid, l.id)
}
export function lessonOf(questionId: string): string | undefined {
  return lessonOfQuestion.get(questionId)
}

/** Unit of a question (lesson or checkpoint). */
const unitOfQuestion = new Map<string, string>()
for (const u of UNITS) {
  for (const l of u.lessons) for (const qid of [...l.questions, l.challenge]) unitOfQuestion.set(qid, u.id)
  for (const qid of u.checkpoint) unitOfQuestion.set(qid, u.id)
}
export function unitOf(questionId: string): string | undefined {
  return unitOfQuestion.get(questionId)
}

/** Checkpoint ids look like "u3-checkpoint". */
export function checkpointId(unitId: string): string {
  return `${unitId}-checkpoint`
}
export function isCheckpointId(id: string): boolean {
  return id.endsWith('-checkpoint')
}

export interface TopicInfo {
  id: TopicId
  label: string
  short: string
  icon: IconName
  unitId: string
}

export const TOPICS: TopicInfo[] = [
  { id: 'basics', label: 'Program Basics', short: 'Basics', icon: 'book', unitId: 'u1' },
  { id: 'variables', label: 'Variables & Constants', short: 'Variables', icon: 'package', unitId: 'u1' },
  { id: 'types', label: 'Data Types & Strings', short: 'Data types', icon: 'type', unitId: 'u1' },
  { id: 'input', label: 'Scanner Input', short: 'Input', icon: 'keyboard', unitId: 'u2' },
  { id: 'arithmetic', label: 'Operators & Casting', short: 'Operators', icon: 'divide', unitId: 'u3' },
  { id: 'errors', label: 'Errors & Debugging', short: 'Errors', icon: 'bug', unitId: 'u4' },
  { id: 'printf', label: 'printf Formatting', short: 'printf', icon: 'printer', unitId: 'u5' },
  { id: 'expressions', label: 'Expressions & Relational Operators', short: 'Expressions', icon: 'calculator', unitId: 'u6' },
  { id: 'boolean-logic', label: 'Logical Operators', short: 'Logic', icon: 'scale', unitId: 'u6' },
  { id: 'conditionals', label: 'if / else', short: 'if / else', icon: 'git-branch', unitId: 'u6' },
  { id: 'nested-if', label: 'Nested ifs', short: 'Nested if', icon: 'layers', unitId: 'u6' },
  { id: 'while-loops', label: 'while Loops', short: 'while loops', icon: 'repeat', unitId: 'u7' },
  { id: 'do-while', label: 'do-while Loops', short: 'do-while', icon: 'recycle', unitId: 'u7' },
  { id: 'loop-control', label: 'break & continue', short: 'break / continue', icon: 'footsteps', unitId: 'u7' },
  { id: 'for-loops', label: 'for & Nested Loops', short: 'for loops', icon: 'repeat-once', unitId: 'u7' },
  { id: 'switch', label: 'switch Statements', short: 'switch', icon: 'puzzle', unitId: 'u8' },
  { id: 'try-catch', label: 'try / catch', short: 'try / catch', icon: 'shield', unitId: 'u8' },
]

const topicIndex = new Map(TOPICS.map((t) => [t.id, t]))
export function getTopic(id: TopicId): TopicInfo {
  return topicIndex.get(id)!
}

export function questionsForTopic(topic: TopicId): Question[] {
  return QUESTIONS.filter((q) => q.topic === topic)
}

export const TOTAL_LESSONS = LESSONS.length
