import { getQuestion, UNITS } from '../data/curriculum'
import { FIRST_DEFENDERS, KEEPER, OTHER_DEFENDERS, type DefenderId } from '../data/stadium'
import type { MultipleChoiceQuestion } from '../data/types'
import type { Progress } from '../state/types'
import { taughtQuestionIds } from './progression'

/**
 * The Practice stadium match, as pure logic. Mr. Lauder faces 7 outfield defenders and a goalkeeper,
 * one question each. A right answer beats that defender; a wrong answer costs one of his 3 possessions
 * and he faces the same defender again with a new question. Questions rotate across every unit the
 * learner has studied, so no unit gets asked twice before the others have had a turn.
 */

export const POSSESSIONS = 3
export const DEFENDER_COUNT = 7
/** points for beating an outfield defender and for scoring */
export const BEAT_BONUS = 150
export const GOAL_BONUS = 500

export interface PoolQuestion {
  id: string
  unitId: string
  difficulty: 1 | 2 | 3
}

export interface Asked {
  qid: string
  unitId: string
  correct: boolean
  defender: DefenderId
}

export interface MatchState {
  /** 7 outfield defenders, then the keeper */
  lineup: DefenderId[]
  /** index into the lineup of the defender Mr. Lauder is facing */
  encounter: number
  possessions: number
  score: number
  streak: number
  bestStreak: number
  asked: Asked[]
  status: 'playing' | 'scored' | 'lost'
}

/** What an answer did, so the page can play it out on the pitch. */
export interface Play {
  correct: boolean
  defender: DefenderId
  /** true when this answer beat the keeper */
  goal: boolean
  /** true when this answer lost the last possession */
  turnover: boolean
  points: number
}

/** Which unit every question belongs to (its lesson, challenge or checkpoint). */
const UNIT_OF = new Map<string, string>()
for (const u of UNITS) {
  for (const l of u.lessons) for (const q of [...l.questions, l.challenge]) UNIT_OF.set(q, u.id)
  for (const q of u.checkpoint) UNIT_OF.set(q, u.id)
}

export function unitOf(qid: string): string | undefined {
  return UNIT_OF.get(qid)
}

export function stadiumQuestion(id: string): MultipleChoiceQuestion {
  return getQuestion(id) as MultipleChoiceQuestion
}

/** Four-option questions from everything the learner has studied (finished lessons or placed-out units). */
export function stadiumPool(p: Progress): PoolQuestion[] {
  const out: PoolQuestion[] = []
  for (const id of taughtQuestionIds(p)) {
    const q = getQuestion(id)
    const unitId = UNIT_OF.get(id)
    if (!unitId) continue
    if ((q.type === 'multiple-choice' || q.type === 'predict-output') && q.options.length === 4) out.push({ id, unitId, difficulty: q.difficulty })
  }
  return out
}

/** The units the learner can be quizzed on, in course order. */
export function poolUnits(pool: PoolQuestion[]): string[] {
  const ids = new Set(pool.map((q) => q.unitId))
  return UNITS.map((u) => u.id).filter((id) => ids.has(id))
}

/** How many Practice answers the learner has given per unit, all time (used to balance coverage across matches). */
export function lifetimeUnitCounts(p: Progress): Record<string, number> {
  const out: Record<string, number> = {}
  for (const a of p.history) {
    if (a.source !== 'practice') continue
    const u = UNIT_OF.get(a.qid)
    if (u) out[u] = (out[u] ?? 0) + 1
  }
  return out
}

function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function startMatch(rand: () => number = Math.random): MatchState {
  return {
    lineup: [...FIRST_DEFENDERS, ...shuffle(OTHER_DEFENDERS, rand), KEEPER],
    encounter: 0,
    possessions: POSSESSIONS,
    score: 0,
    streak: 0,
    bestStreak: 0,
    asked: [],
    status: 'playing',
  }
}

export function currentDefender(s: MatchState): DefenderId {
  return s.lineup[Math.min(s.encounter, s.lineup.length - 1)]
}

export function isKeeper(s: MatchState): boolean {
  return s.encounter >= DEFENDER_COUNT
}

/** Questions get harder down the pitch: easy for the first defenders, hard for the last ones and the keeper. */
export function targetDifficulty(encounter: number): 1 | 2 | 3 {
  return encounter < 2 ? 1 : encounter < 5 ? 2 : 3
}

/**
 * The next question: from the unit asked least in this match (then least all time, then at random),
 * at the difficulty for this point of the pitch (or the closest one that unit has).
 */
export function pickQuestion(s: MatchState, pool: PoolQuestion[], lifetime: Record<string, number> = {}, rand: () => number = Math.random): PoolQuestion | null {
  const units = poolUnits(pool)
  if (!units.length) return null
  const inMatch: Record<string, number> = {}
  for (const a of s.asked) inMatch[a.unitId] = (inMatch[a.unitId] ?? 0) + 1
  const least = Math.min(...units.map((u) => inMatch[u] ?? 0))
  let candidates = units.filter((u) => (inMatch[u] ?? 0) === least)
  const leastLifetime = Math.min(...candidates.map((u) => lifetime[u] ?? 0))
  candidates = candidates.filter((u) => (lifetime[u] ?? 0) === leastLifetime)
  const unitId = candidates[Math.floor(rand() * candidates.length)]

  const asked = new Set(s.asked.map((a) => a.qid))
  const last = s.asked[s.asked.length - 1]?.qid
  const inUnit = pool.filter((q) => q.unitId === unitId)
  const fresh = inUnit.filter((q) => !asked.has(q.id))
  const options = fresh.length ? fresh : inUnit.filter((q) => q.id !== last).length ? inUnit.filter((q) => q.id !== last) : inUnit
  const target = targetDifficulty(s.encounter)
  const distance = Math.min(...options.map((q) => Math.abs(q.difficulty - target)))
  const best = options.filter((q) => Math.abs(q.difficulty - target) === distance)
  return best[Math.floor(rand() * best.length)]
}

/** Points for a right answer: harder questions and streaks are worth more. */
export function pointsFor(difficulty: 1 | 2 | 3, streak: number): number {
  return [0, 100, 150, 200][difficulty] + 25 * Math.min(Math.max(streak - 1, 0), 4)
}

/** Apply an answer to the current encounter. */
export function answer(s: MatchState, q: PoolQuestion, correct: boolean): { state: MatchState; play: Play } {
  if (s.status !== 'playing') throw new Error('the match is over')
  const defender = currentDefender(s)
  const asked = [...s.asked, { qid: q.id, unitId: q.unitId, correct, defender }]
  if (correct) {
    const streak = s.streak + 1
    const goal = isKeeper(s)
    const points = pointsFor(q.difficulty, streak) + (goal ? GOAL_BONUS : BEAT_BONUS)
    const state: MatchState = {
      ...s,
      asked,
      streak,
      bestStreak: Math.max(s.bestStreak, streak),
      score: s.score + points,
      encounter: s.encounter + 1,
      status: goal ? 'scored' : 'playing',
    }
    return { state, play: { correct, defender, goal, turnover: false, points } }
  }
  const possessions = s.possessions - 1
  const state: MatchState = { ...s, asked, streak: 0, possessions, status: possessions === 0 ? 'lost' : 'playing' }
  return { state, play: { correct, defender, goal: false, turnover: possessions === 0, points: 0 } }
}

export function accuracy(s: MatchState): number {
  return s.asked.length ? s.asked.filter((a) => a.correct).length / s.asked.length : 0
}

export function defendersBeaten(s: MatchState): number {
  return Math.min(s.encounter, DEFENDER_COUNT)
}

export function unitsCovered(s: MatchState): string[] {
  const seen = new Set(s.asked.map((a) => a.unitId))
  return UNITS.map((u) => u.id).filter((id) => seen.has(id))
}

/** The final score: what was earned on the pitch, plus bonuses for accuracy and for keeping the ball. */
export function finalScore(s: MatchState): number {
  const keep = s.status === 'scored' ? s.possessions * 100 : 0
  return s.score + keep + Math.round(accuracy(s) * 300)
}

/** A playful rating for the results screen. */
export function rating(s: MatchState): { title: string; stars: 1 | 2 | 3 | 4 } {
  const acc = accuracy(s)
  if (s.status === 'scored' && acc >= 0.9) return { title: 'World Class', stars: 4 }
  if (s.status === 'scored' && acc >= 0.7) return { title: 'Professional', stars: 3 }
  if (s.status === 'scored') return { title: 'Semi-Pro', stars: 2 }
  return { title: defendersBeaten(s) >= 4 ? 'Rising Star' : 'Sunday League', stars: 1 }
}
