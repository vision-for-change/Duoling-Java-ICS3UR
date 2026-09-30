/**
 * Builds adaptive review sessions from the learner's history.
 * Only questions from lessons the learner has already been taught are used.
 */
import { getQuestion, TOPICS, UNITS } from '../data/curriculum'
import type { Question, TopicId } from '../data/types'
import type { Progress } from '../state/types'
import { taughtQuestionIds } from './progression'
import { missedQuestionIds, topicStats, weakTopics } from './stats'

export type PracticeMode = 'smart' | 'topic' | 'mistakes' | 'unit'

export interface PracticePlan {
  qids: string[]
  followupPool: string[]
  title: string
  /** why these questions were chosen, for the UI */
  focus: TopicId[]
}

const isCodeTask = (q: Question) => q.type === 'write-code' || q.type === 'fix-code'

/** Deterministic-ish shuffle so a session feels fresh but tests stay stable with a seed. */
function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function lastSeen(p: Progress): Map<string, number> {
  const m = new Map<string, number>()
  for (const a of p.history) m.set(a.qid, a.at)
  return m
}

export function availableTopics(p: Progress): TopicId[] {
  const taught = taughtQuestionIds(p)
  const topics = new Set<TopicId>()
  for (const id of taught) topics.add(getQuestion(id).topic)
  return TOPICS.map((t) => t.id).filter((t) => topics.has(t))
}

export function buildPractice(p: Progress, mode: PracticeMode, topic?: TopicId, size = 8, rand: () => number = Math.random, unitId?: string): PracticePlan {
  const taught = [...taughtQuestionIds(p)].map(getQuestion)
  const followupPool = taught.filter((q) => !isCodeTask(q)).map((q) => q.id)
  if (!taught.length) return { qids: [], followupPool, title: 'Practice', focus: [] }

  const seen = lastSeen(p)
  const missed = missedQuestionIds(p.history).filter((id) => taught.some((q) => q.id === id))
  const chosen: string[] = []
  const add = (q: Question | string) => {
    const id = typeof q === 'string' ? q : q.id
    if (!chosen.includes(id) && chosen.length < size) chosen.push(id)
  }
  const codeLimit = 1
  const addSome = (qs: Question[], n: number) => {
    let added = 0
    for (const q of qs) {
      if (added >= n || chosen.length >= size) break
      if (isCodeTask(q) && chosen.map(getQuestion).filter(isCodeTask).length >= codeLimit) continue
      if (chosen.includes(q.id)) continue
      add(q)
      added++
    }
  }
  // least recently seen first, unseen before seen
  const byStaleness = (qs: Question[]) => shuffle(qs, rand).sort((a, b) => (seen.get(a.id) ?? 0) - (seen.get(b.id) ?? 0))

  if (mode === 'mistakes') {
    addSome(missed.map(getQuestion), size)
    return { qids: chosen, followupPool, title: 'Fix your mistakes', focus: [...new Set(chosen.map((id) => getQuestion(id).topic))] }
  }

  if (mode === 'unit' && unitId) {
    const unit = UNITS.find((u) => u.id === unitId)
    const ids = new Set(unit ? unit.lessons.flatMap((l) => [...l.questions, l.challenge]) : [])
    const pool = taught.filter((q) => ids.has(q.id))
    addSome(missed.map(getQuestion).filter((q) => ids.has(q.id)), 4)
    addSome(byStaleness(pool.filter((q) => q.difficulty >= 2)), size)
    addSome(byStaleness(pool), size)
    chosen.sort((a, b) => getQuestion(a).difficulty - getQuestion(b).difficulty)
    return { qids: chosen, followupPool, title: unit ? `Review: ${unit.title}` : 'Unit review', focus: [...new Set(pool.map((q) => q.topic))] }
  }

  if (mode === 'topic' && topic) {
    const pool = taught.filter((q) => q.topic === topic)
    addSome(missed.map(getQuestion).filter((q) => q.topic === topic), 3)
    addSome(byStaleness(pool), size)
    chosen.sort((a, b) => getQuestion(a).difficulty - getQuestion(b).difficulty)
    const label = TOPICS.find((t) => t.id === topic)?.short ?? topic
    return { qids: chosen, followupPool, title: `Practice: ${label}`, focus: [topic] }
  }

  // smart: weakest topics first, then recent mistakes, then spaced review of everything taught
  const stats = topicStats(p.history)
  const weak = weakTopics(stats).map((s) => s.topic).filter((t) => taught.some((q) => q.topic === t))
  const focus = weak.slice(0, 2)
  for (const t of focus) addSome(byStaleness(taught.filter((q) => q.topic === t)), Math.ceil(size * 0.3))
  addSome(missed.map(getQuestion), Math.ceil(size * 0.25))
  addSome(byStaleness(taught), size)
  chosen.sort((a, b) => getQuestion(a).difficulty - getQuestion(b).difficulty)
  return { qids: chosen, followupPool, title: focus.length ? 'Practice your weak areas' : 'Mixed review', focus }
}
