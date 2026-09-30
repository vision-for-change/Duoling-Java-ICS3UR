/**
 * Accuracy and mastery analysis from the answer history.
 */
import { TOPICS } from '../data/curriculum'
import type { TopicId } from '../data/types'
import type { Progress, QuestionAttempt } from '../state/types'

export interface TopicStat {
  topic: TopicId
  attempts: number
  correct: number
  /** first-try accuracy over the most recent attempts (0..1) */
  accuracy: number
  /** last few results, oldest first */
  recent: boolean[]
  lastAt: number
}

const RECENT_WINDOW = 20

export function topicStats(history: QuestionAttempt[]): Record<TopicId, TopicStat> {
  const out = {} as Record<TopicId, TopicStat>
  for (const t of TOPICS) out[t.id] = { topic: t.id, attempts: 0, correct: 0, accuracy: 0, recent: [], lastAt: 0 }
  for (const a of history) {
    const s = out[a.topic]
    if (!s) continue
    s.attempts++
    if (a.correct) s.correct++
    s.recent.push(a.correct)
    s.lastAt = Math.max(s.lastAt, a.at)
  }
  for (const s of Object.values(out)) {
    const window = s.recent.slice(-RECENT_WINDOW)
    s.accuracy = window.length ? window.filter(Boolean).length / window.length : 0
    s.recent = s.recent.slice(-10)
  }
  return out
}

export const MIN_ATTEMPTS = 3
export const STRONG_THRESHOLD = 0.85
export const WEAK_THRESHOLD = 0.8

export function weakTopics(stats: Record<TopicId, TopicStat>): TopicStat[] {
  return Object.values(stats)
    .filter((s) => s.attempts >= MIN_ATTEMPTS && s.accuracy < WEAK_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy)
}

export function strongTopics(stats: Record<TopicId, TopicStat>): TopicStat[] {
  return Object.values(stats)
    .filter((s) => s.attempts >= MIN_ATTEMPTS && s.accuracy >= STRONG_THRESHOLD)
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)
}

export function overallAccuracy(p: Progress): number {
  return p.stats.answered ? p.stats.correct / p.stats.answered : 0
}

/** Questions whose most recent attempt was not correct on the first try. */
export function missedQuestionIds(history: QuestionAttempt[]): string[] {
  const latest = new Map<string, QuestionAttempt>()
  for (const a of history) {
    if (a.source === 'placement') continue
    latest.set(a.qid, a)
  }
  return [...latest.values()].filter((a) => !a.correct).sort((a, b) => b.at - a.at).map((a) => a.qid)
}

/** Mastery 0..1 shown on topic progress bars: accuracy, discounted when there is little evidence. */
export function mastery(s: TopicStat): number {
  if (s.attempts === 0) return 0
  const confidence = Math.min(1, s.attempts / 6)
  return s.accuracy * confidence
}
