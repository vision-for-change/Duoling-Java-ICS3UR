import { getQuestion } from '../data/curriculum'
import type { MultipleChoiceQuestion } from '../data/types'
import type { Progress } from '../state/types'
import { taughtQuestionIds } from './progression'

/**
 * The Practice battle: answer multiple-choice questions against the clock while Bryan and Avik fight back.
 * Bryan goes first; when he is down, Avik steps in. Beat both to win, or lose when your health runs out.
 * Everything here is pure, so the page just keeps a BattleState and feeds answers in.
 */

export type Foe = 'bryan' | 'avik'

export const PLAYER_HP = 100
export const FOE_HP = 100
/** damage the player deals per correct answer, and on a critical hit (a streak of 3 or more) */
export const HIT = 25
export const CRIT = 35
export const CRIT_STREAK = 3
/** damage each villain deals for a wrong answer or a timeout (Avik hits harder: he is the final boss) */
export const FOE_HIT: Record<Foe, number> = { bryan: 20, avik: 25 }
export const DECK_SIZE = 20

export interface BattleState {
  deck: string[]
  /** index of the current question in the deck */
  index: number
  playerHp: number
  foeHp: Record<Foe, number>
  /** the villain currently fighting */
  foe: Foe
  streak: number
  bestStreak: number
  score: number
  answered: number
  correct: number
  status: 'fighting' | 'won' | 'lost'
}

/** What the last answer did, so the page can animate it. */
export interface Turn {
  correct: boolean
  timedOut: boolean
  /** who got hit: the player or a villain */
  target: 'player' | Foe
  damage: number
  crit: boolean
  points: number
  /** set when this answer knocked a villain out */
  knockedOut?: Foe
}

/** Only four-option questions fit the battle layout. */
function isBattleQuestion(id: string): boolean {
  const q = getQuestion(id)
  return (q.type === 'multiple-choice' || q.type === 'predict-output') && q.options.length === 4
}

export function battleQuestion(id: string): MultipleChoiceQuestion {
  return getQuestion(id) as MultipleChoiceQuestion
}

/** Questions from lessons the learner has already met (or placed out of). */
export function battlePool(p: Progress): string[] {
  return [...taughtQuestionIds(p)].filter(isBattleQuestion)
}

function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** The difficulty the battle aims for at each question: questions 1 to 4 easy, 5 to 8 medium, then hard. */
export function targetDifficulty(i: number): 1 | 2 | 3 {
  return i < 4 ? 1 : i < 8 ? 2 : 3
}

const PREFERENCE: Record<1 | 2 | 3, (1 | 2 | 3)[]> = { 1: [1, 2, 3], 2: [2, 1, 3], 3: [3, 2, 1] }

/**
 * The questions for one battle, getting harder as it goes (see targetDifficulty). When there is no question
 * at the target difficulty yet (early in the course), the closest one is used. A small pool is reused,
 * reshuffled, so the battle never runs dry, and the same question never comes twice in a row.
 */
export function buildDeck(pool: string[], rand: () => number = Math.random, size = DECK_SIZE): string[] {
  if (!pool.length) return []
  const byDifficulty = { 1: [] as string[], 2: [] as string[], 3: [] as string[] }
  for (const id of shuffle(pool, rand)) byDifficulty[getQuestion(id).difficulty].push(id)
  let used = new Set<string>()
  const deck: string[] = []
  const take = (target: 1 | 2 | 3): string => {
    for (let pass = 0; pass < 2; pass++) {
      for (const d of PREFERENCE[target]) {
        const id = byDifficulty[d].find((q) => !used.has(q) && q !== deck[deck.length - 1])
        if (id) return id
      }
      used = new Set() // every question has been used: start reusing them
    }
    return deck[deck.length - 1] // a pool of one question
  }
  for (let i = 0; i < size; i++) {
    const id = take(targetDifficulty(i))
    used.add(id)
    deck.push(id)
  }
  return deck
}

export function startBattle(deck: string[]): BattleState {
  return {
    deck,
    index: 0,
    playerHp: PLAYER_HP,
    foeHp: { bryan: FOE_HP, avik: FOE_HP },
    foe: 'bryan',
    streak: 0,
    bestStreak: 0,
    score: 0,
    answered: 0,
    correct: 0,
    status: 'fighting',
  }
}

/** Seconds allowed for a question: more when there is code to read or it is a hard one. */
export function timeFor(q: { code?: string; difficulty: number }): number {
  const lines = q.code ? q.code.split('\n').length : 0
  return 20 + (lines ? Math.min(12, 4 + lines) : 0) + (q.difficulty === 3 ? 5 : 0)
}

/** Points for a correct answer: a base, a speed bonus, and a streak multiplier. */
export function pointsFor(secondsLeft: number, streak: number): number {
  return Math.round((100 + Math.max(0, Math.round(secondsLeft)) * 5) * (1 + 0.2 * Math.min(Math.max(streak - 1, 0), 5)))
}

/** Apply an answer (or a timeout, with `correct` false) and return the new state plus what happened. */
export function answer(s: BattleState, correct: boolean, secondsLeft: number, timedOut = false): { state: BattleState; turn: Turn } {
  if (s.status !== 'fighting') throw new Error('the battle is over')
  const base = { ...s, answered: s.answered + 1, index: s.index + 1 }
  if (correct) {
    const streak = s.streak + 1
    const crit = streak >= CRIT_STREAK
    const damage = crit ? CRIT : HIT
    const points = pointsFor(secondsLeft, streak)
    const hp = Math.max(0, s.foeHp[s.foe] - damage)
    const foeHp = { ...s.foeHp, [s.foe]: hp }
    const knockedOut = hp === 0 ? s.foe : undefined
    const next: BattleState = {
      ...base,
      correct: s.correct + 1,
      streak,
      bestStreak: Math.max(s.bestStreak, streak),
      score: s.score + points,
      foeHp,
      foe: knockedOut === 'bryan' ? 'avik' : s.foe,
      status: knockedOut === 'avik' ? 'won' : 'fighting',
    }
    return { state: next, turn: { correct: true, timedOut: false, target: s.foe, damage, crit, points, knockedOut } }
  }
  const damage = FOE_HIT[s.foe]
  const playerHp = Math.max(0, s.playerHp - damage)
  const next: BattleState = { ...base, streak: 0, playerHp, status: playerHp === 0 ? 'lost' : 'fighting' }
  return { state: next, turn: { correct: false, timedOut, target: 'player', damage, crit: false, points: 0 } }
}

export function accuracy(s: BattleState): number {
  return s.answered ? s.correct / s.answered : 0
}

/** The deck is long enough for any battle, but loop around just in case. */
export function currentQuestionId(s: BattleState): string {
  return s.deck[s.index % s.deck.length]
}
