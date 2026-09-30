/**
 * XP rules and levels.
 */
import type { Difficulty, IconName } from '../data/types'

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
  icon: IconName
  minXp: number
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Java Rookie', icon: 'sprout', minXp: 0 },
  { level: 2, title: 'Code Explorer', icon: 'compass', minXp: 300 },
  { level: 3, title: 'Loop Learner', icon: 'repeat', minXp: 1000 },
  { level: 4, title: 'Java Builder', icon: 'brick-wall', minXp: 2200 },
  { level: 5, title: 'Debugger', icon: 'bug', minXp: 3600 },
  { level: 6, title: 'Java Master', icon: 'crown', minXp: 5200 },
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

export const DIFFICULTY_LABEL: Record<Difficulty, { label: string; className: string }> = {
  1: { label: 'Beginner', className: 'text-mint-700 bg-mint-100' },
  2: { label: 'Intermediate', className: 'text-sun-800 bg-sun-100' },
  3: { label: 'Advanced', className: 'text-berry-700 bg-berry-100' },
}
