/**
 * Adaptive session engine used by lessons, checkpoints, practice and the placement test.
 *
 * Pedagogy:
 *  - Lessons interleave teaching cards and questions:
 *      concept → example → Q → Q → (tip / common mistake) → Q → Q → Q → mini challenge
 *  - Questions are picked adaptively: first-try successes raise the target
 *    difficulty, mistakes lower it.
 *  - A wrong first attempt never reveals the answer: the learner gets targeted
 *    feedback and a second try. After a first-try mistake an EASIER follow-up on
 *    the same concept is inserted, and a question failed twice comes back later.
 *
 * Everything here is pure: (state, input) -> new state.
 */
import { getLesson, getQuestion, lessonOf } from '../data/curriculum'
import type { Lesson, Question, TeachCard, Unit } from '../data/types'
import { allowsRetry } from './grading'
import { answerXp } from './gamification'

export type SessionMode = 'lesson' | 'checkpoint' | 'practice' | 'placement'
export type QuestionRole = 'core' | 'followup' | 'retry' | 'challenge'

export type Step =
  | { kind: 'teach'; card: TeachCard; key: string }
  | { kind: 'question'; qid: string; role: QuestionRole; key: string }
  | { kind: 'slot'; key: string }

export interface AnswerRecord {
  qid: string
  role: QuestionRole
  /** correct on the first try */
  correct: boolean
  solved: boolean
  attempts: number
  xp: number
  skipped?: boolean
}

export interface SessionState {
  mode: SessionMode
  /** lesson id, "<unit>-checkpoint", "practice" or "placement" */
  id: string
  title: string
  steps: Step[]
  index: number
  /** lesson pool for adaptive core picks */
  pool: string[]
  /** questions allowed as easier follow-ups */
  followupPool: string[]
  used: string[]
  /** adaptive difficulty estimate, 1 (beginner) … 3 (advanced) */
  level: number
  combo: number
  bestCombo: number
  hearts: number | null
  maxHearts: number | null
  answers: AnswerRecord[]
  xp: number
  /** how many extra (follow-up / retry) questions may still be inserted */
  extraBudget: number
  /** attempt number for the current question (1 or 2) */
  attempt: number
  retried: string[]
}

export interface SessionOptions {
  hearts: number | null
  startLevel?: number
}

let keySeq = 0
const key = (p: string) => `${p}-${++keySeq}`

function base(mode: SessionMode, id: string, title: string, opts: SessionOptions): Omit<SessionState, 'steps' | 'pool' | 'followupPool'> {
  return {
    mode,
    id,
    title,
    index: 0,
    used: [],
    level: opts.startLevel ?? 1,
    combo: 0,
    bestCombo: 0,
    hearts: opts.hearts,
    maxHearts: opts.hearts,
    answers: [],
    xp: 0,
    extraBudget: mode === 'placement' ? 0 : 3,
    attempt: 1,
    retried: [],
  }
}

/** Earlier lessons of the same unit (already taught) can supply easier follow-ups. */
function taughtBefore(lesson: Lesson, unit: Unit | undefined): string[] {
  if (!unit) return []
  const idx = unit.lessons.findIndex((l) => l.id === lesson.id)
  return unit.lessons.slice(0, idx).flatMap((l) => l.questions)
}

export function createLessonSession(lesson: Lesson, unit: Unit | undefined, opts: SessionOptions): SessionState {
  const teach = lesson.teach
  const steps: Step[] = []
  // 1. very short explanation  2. example
  teach.slice(0, 2).forEach((card) => steps.push({ kind: 'teach', card, key: key('teach') }))
  // 3. question  5. another question
  steps.push({ kind: 'slot', key: key('slot') }, { kind: 'slot', key: key('slot') })
  // tips / common mistakes, then more practice
  teach.slice(2).forEach((card) => steps.push({ kind: 'teach', card, key: key('teach') }))
  const coreCount = Math.min(5, lesson.questions.length)
  for (let i = 2; i < coreCount; i++) steps.push({ kind: 'slot', key: key('slot') })
  // 6. mini challenge
  steps.push({ kind: 'question', qid: lesson.challenge, role: 'challenge', key: key('challenge') })
  const s: SessionState = {
    ...base('lesson', lesson.id, lesson.title, opts),
    steps,
    pool: [...lesson.questions],
    followupPool: [...lesson.questions, ...taughtBefore(lesson, unit)],
  }
  return resolve(s)
}

export function createCheckpointSession(unit: Unit, opts: SessionOptions): SessionState {
  const steps: Step[] = unit.checkpoint.map((qid) => ({ kind: 'question' as const, qid, role: 'core' as const, key: key('cp') }))
  return {
    ...base('checkpoint', `${unit.id}-checkpoint`, `Unit ${unit.number} Checkpoint`, { ...opts, startLevel: 2 }),
    steps,
    pool: [],
    followupPool: unit.lessons.flatMap((l) => l.questions),
    extraBudget: 2,
  }
}

export function createPracticeSession(qids: string[], title: string, followupPool: string[], opts: SessionOptions): SessionState {
  const steps: Step[] = qids.map((qid) => ({ kind: 'question' as const, qid, role: 'core' as const, key: key('pr') }))
  return { ...base('practice', 'practice', title, opts), steps, pool: [], followupPool, used: [...qids] }
}

export function createPlacementSession(qids: string[]): SessionState {
  const steps: Step[] = qids.map((qid) => ({ kind: 'question' as const, qid, role: 'core' as const, key: key('pl') }))
  return { ...base('placement', 'placement', 'Placement Test', { hearts: null }), steps, pool: [], followupPool: [] }
}

/** Pick a core question: among the next few unused pool questions, the one closest to the target difficulty. */
function pickCore(s: SessionState): string | null {
  const unused = s.pool.filter((q) => !s.used.includes(q))
  if (!unused.length) return null
  const window = unused.slice(0, 3)
  const target = Math.round(s.level)
  let best = window[0]
  let bestDist = Infinity
  for (const qid of window) {
    const d = Math.abs(getQuestion(qid).difficulty - target)
    if (d < bestDist) {
      best = qid
      bestDist = d
    }
  }
  return best
}

/** Replace a slot at the current index with a concrete question (or drop it if the pool is empty). */
function resolve(s: SessionState): SessionState {
  let state = s
  while (state.index < state.steps.length && state.steps[state.index].kind === 'slot') {
    const qid = pickCore(state)
    const steps = [...state.steps]
    if (qid) {
      steps[state.index] = { kind: 'question', qid, role: 'core', key: steps[state.index].key }
      state = { ...state, steps, used: [...state.used, qid] }
    } else {
      steps.splice(state.index, 1)
      state = { ...state, steps }
    }
  }
  const cur = state.steps[state.index]
  if (cur && cur.kind === 'question' && !state.used.includes(cur.qid)) state = { ...state, used: [...state.used, cur.qid] }
  return state
}

export function currentStep(s: SessionState): Step | null {
  return s.steps[s.index] ?? null
}

export function isFinished(s: SessionState): boolean {
  return s.index >= s.steps.length
}

/** 0..1 progress for the top bar */
export function progressFraction(s: SessionState): number {
  if (!s.steps.length) return 1
  return Math.min(1, s.index / s.steps.length)
}

export function outOfHearts(s: SessionState): boolean {
  return s.hearts !== null && s.hearts <= 0
}

export function disableHearts(s: SessionState): SessionState {
  return { ...s, hearts: null }
}

export function advance(s: SessionState): SessionState {
  return resolve({ ...s, index: s.index + 1, attempt: 1 })
}

export type AttemptOutcome = 'correct' | 'retry' | 'failed'

function pickFollowup(s: SessionState, missed: Question): string | null {
  const candidates = s.followupPool
    .filter((qid) => qid !== missed.id && !s.used.includes(qid))
    .map(getQuestion)
    .filter((q) => q.topic === missed.topic && (q.difficulty < missed.difficulty || (missed.difficulty === 1 && q.difficulty === 1)))
    .filter((q) => q.type !== 'write-code' && q.type !== 'fix-code')
  if (!candidates.length) return null
  const sameConcept = candidates.filter((q) => q.concept && q.concept === missed.concept)
  const list = sameConcept.length ? sameConcept : candidates
  // easiest first
  list.sort((a, b) => a.difficulty - b.difficulty)
  return list[0].id
}

/**
 * Record the result of checking an answer for the current question.
 * `skipped` is only used by the placement test ("I don't know yet").
 */
export function recordAttempt(
  s: SessionState,
  q: Question,
  correct: boolean,
  skipped = false,
): { state: SessionState; outcome: AttemptOutcome; xp: number } {
  const step = currentStep(s)
  const role: QuestionRole = step && step.kind === 'question' ? step.role : 'core'
  const placement = s.mode === 'placement'

  if (correct) {
    const xp = placement ? 0 : answerXp(q.difficulty, s.attempt)
    const firstTry = s.attempt === 1
    const combo = firstTry ? s.combo + 1 : 0
    let state: SessionState = {
      ...s,
      xp: s.xp + xp,
      combo,
      bestCombo: Math.max(s.bestCombo, combo),
      level: firstTry ? Math.min(3, s.level + 0.6) : s.level,
      answers: [...s.answers, { qid: q.id, role, correct: firstTry, solved: true, attempts: s.attempt, xp }],
    }
    // solved on the second try: still follow up with an easier question on the same idea
    if (!firstTry && !placement) state = addFollowup(state, q)
    return { state, outcome: 'correct', xp }
  }

  // wrong
  const loseHeart = s.attempt === 1 && s.hearts !== null
  let state: SessionState = {
    ...s,
    combo: 0,
    hearts: loseHeart ? Math.max(0, (s.hearts ?? 0) - 1) : s.hearts,
    level: s.attempt === 1 ? Math.max(1, s.level - 1) : s.level,
  }

  if (!placement && !skipped && s.attempt === 1 && allowsRetry(q)) {
    return { state: { ...state, attempt: 2 }, outcome: 'retry', xp: 0 }
  }

  state = { ...state, answers: [...state.answers, { qid: q.id, role, correct: false, solved: false, attempts: s.attempt, xp: 0, skipped }] }

  if (!placement) state = scheduleRemediation(state, q)
  return { state, outcome: 'failed', xp: 0 }
}

/** Insert an easier question on the same concept right after the current one. */
function addFollowup(s: SessionState, q: Question): SessionState {
  if (s.extraBudget <= 0) return s
  const followup = pickFollowup(s, q)
  if (!followup) return s
  const steps = [...s.steps]
  steps.splice(s.index + 1, 0, { kind: 'question', qid: followup, role: 'followup', key: key('fu') })
  return { ...s, steps, extraBudget: s.extraBudget - 1, used: [...s.used, followup] }
}

/** After a failed question: an easier follow-up right away, and a retry of this question later. */
function scheduleRemediation(s: SessionState, q: Question): SessionState {
  let state = addFollowup(s, q)
  const steps = [...state.steps]
  if (state.extraBudget > 0 && !state.retried.includes(q.id)) {
    // re-ask before the mini challenge (or at the very end)
    let at = steps.length
    const challengeIdx = steps.findIndex((st, i) => i > state.index && st.kind === 'question' && st.role === 'challenge')
    if (challengeIdx !== -1) at = challengeIdx
    steps.splice(at, 0, { kind: 'question', qid: q.id, role: 'retry', key: key('re') })
    state = { ...state, extraBudget: state.extraBudget - 1, retried: [...state.retried, q.id] }
  }
  return { ...state, steps }
}

export interface SessionSummary {
  total: number
  firstTry: number
  accuracy: number
  mistakes: number
  perfect: boolean
  xp: number
  bestCombo: number
}

export function summarize(s: SessionState): SessionSummary {
  const graded = s.answers.filter((a) => a.role !== 'retry')
  const total = graded.length
  const firstTry = graded.filter((a) => a.correct).length
  const mistakes = s.answers.filter((a) => !a.correct).length
  return {
    total,
    firstTry,
    accuracy: total ? firstTry / total : 0,
    mistakes,
    perfect: mistakes === 0 && total > 0,
    xp: s.xp,
    bestCombo: s.bestCombo,
  }
}

export function lessonForSession(s: SessionState): Lesson | undefined {
  return s.mode === 'lesson' ? getLesson(s.id) : undefined
}

export { lessonOf }
