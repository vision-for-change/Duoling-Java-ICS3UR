/**
 * XP rules and levels.
 */
import type { Difficulty } from '../data/types'

export const XP = {
  /** correct on the first try */
  correct: 10,
  /** correct on the first try, advanced question */
  hard: 20,
  /** correct on the second try */
  secondTry: 5,
  lessonComplete: 50,
  perfectBonus: 10,
  unitComplete: 100,
  practiceComplete: 20,
  finalStage: 50,
  finalComplete: 200,
  placementComplete: 25,
} as const

export function answerXp(difficulty: Difficulty, attempt: number): number {
  if (attempt > 1) return XP.secondTry
  return difficulty === 3 ? XP.hard : XP.correct
}

export interface LevelInfo {
  level: number
  title: string
  emoji: string
  minXp: number
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Java Rookie', emoji: '🌱', minXp: 0 },
  { level: 2, title: 'Code Explorer', emoji: '🧭', minXp: 300 },
  { level: 3, title: 'Loop Learner', emoji: '🔁', minXp: 1000 },
  { level: 4, title: 'Java Builder', emoji: '🧱', minXp: 2200 },
  { level: 5, title: 'Debugger', emoji: '🐞', minXp: 3600 },
  { level: 6, title: 'Java Master', emoji: '👑', minXp: 5200 },
]

export function levelFor(xp: number): LevelInfo {
  let current = LEVELS[0]
  for (const l of LEVELS) if (xp >= l.minXp) current = l
  return current
}

export function nextLevel(xp: number): LevelInfo | null {
  return LEVELS.find((l) => l.minXp > xp) ?? null
}

/** 0..1 progress from the current level to the next */
export function levelProgress(xp: number): { current: LevelInfo; next: LevelInfo | null; fraction: number; into: number; span: number } {
  const current = levelFor(xp)
  const next = nextLevel(xp)
  if (!next) return { current, next: null, fraction: 1, into: xp - current.minXp, span: 0 }
  const span = next.minXp - current.minXp
  const into = xp - current.minXp
  return { current, next, fraction: into / span, into, span }
}

export const DIFFICULTY_LABEL: Record<Difficulty, { label: string; dot: string; className: string }> = {
  1: { label: 'Beginner', dot: '🟢', className: 'text-mint-700 bg-mint-100' },
  2: { label: 'Intermediate', dot: '🟡', className: 'text-sun-800 bg-sun-100' },
  3: { label: 'Advanced', dot: '🔴', className: 'text-berry-700 bg-berry-100' },
}
