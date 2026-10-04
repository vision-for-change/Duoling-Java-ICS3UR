/**
 * The progress store: a tiny external store (useSyncExternalStore-friendly)
 * that owns the Progress document, applies game rules and persists changes
 * through a ProgressRepository.
 */
import { checkpointId, UNITS } from '../data/curriculum'
import { finalStages } from '../data/final'
import type { Difficulty, TopicId } from '../data/types'
import { getAchievement, newlyEarned } from '../engine/achievements'
import { dayKey, registerActivity } from '../engine/dates'
import { levelFor, XP, type LevelInfo } from '../engine/gamification'
import { skipPlan, unitIndex } from '../engine/progression'
import type { SessionSummary } from '../engine/session'
import { LocalStorageRepository, migrate, type ProgressRepository } from './repository'
import { createEmptyProgress, type ActivityEvent, type PlacementResult, type Progress, type SessionSource, type Settings } from './types'

export type StoreEvent =
  | { type: 'xp'; amount: number }
  | { type: 'level-up'; level: LevelInfo }
  | { type: 'achievement'; id: string }
  | { type: 'streak'; days: number }
  | { type: 'daily-goal' }

export interface Reward {
  xp: number
  breakdown: { label: string; xp: number }[]
  streakExtended: boolean
  streak: number
  levelUp: LevelInfo | null
  achievements: string[]
  dailyGoalReached: boolean
}

const HISTORY_CAP = 2500
const ACTIVITY_CAP = 60

let idSeq = 0
const newId = () => `${Date.now().toString(36)}-${(idSeq++).toString(36)}`

export class ProgressStore {
  private state: Progress = createEmptyProgress()
  private listeners = new Set<() => void>()
  private eventListeners = new Set<(e: StoreEvent) => void>()
  private saveTimer: ReturnType<typeof setTimeout> | null = null
  /** unsaved local changes exist */
  private dirty = false
  private repo: ProgressRepository
  ready = false

  constructor(repo: ProgressRepository) {
    this.repo = repo
  }

  async hydrate(): Promise<void> {
    const loaded = await this.repo.load()
    if (loaded) this.state = loaded
    this.ready = true
    // another tab saved newer progress: adopt it (without writing it back)
    this.repo.watch?.((external) => {
      if (this.dirty) return
      this.state = external
      this.notify()
    })
    this.notify()
  }

  getSnapshot = (): Progress => this.state

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  onEvent(fn: (e: StoreEvent) => void): () => void {
    this.eventListeners.add(fn)
    return () => this.eventListeners.delete(fn)
  }

  private notify() {
    for (const l of this.listeners) l()
  }

  private commit(next: Progress, events: StoreEvent[] = []) {
    this.state = next
    this.dirty = true
    this.notify()
    this.scheduleSave()
    for (const e of events) for (const l of this.eventListeners) l(e)
  }

  private scheduleSave() {
    if (this.saveTimer) clearTimeout(this.saveTimer)
    this.saveTimer = setTimeout(() => this.flush(), 150)
  }

  /** Persist pending changes now (no-op when nothing changed, so other tabs' saves aren't clobbered). */
  flush() {
    if (this.saveTimer) clearTimeout(this.saveTimer)
    this.saveTimer = null
    if (!this.dirty) return
    this.dirty = false
    void this.repo.save(this.state)
  }

  // ------------------------------------------------------------------
  // reward pipeline shared by every activity
  // ------------------------------------------------------------------
  private reward(
    p: Progress,
    breakdown: { label: string; xp: number }[],
    activity: Omit<ActivityEvent, 'id' | 'at' | 'xp'> | null,
    lessonsDelta = 0,
  ): { next: Progress; reward: Reward; events: StoreEvent[] } {
    const now = Date.now()
    const today = dayKey()
    const xp = breakdown.reduce((s, b) => s + b.xp, 0)
    const events: StoreEvent[] = []

    const dayBefore = p.days[today] ?? { xp: 0, lessons: 0, answered: 0 }
    const day = { ...dayBefore, xp: dayBefore.xp + xp, lessons: dayBefore.lessons + lessonsDelta }
    const { streak, extended } = registerActivity(p.streak, today)
    const levelBefore = levelFor(p.xp)
    const levelAfter = levelFor(p.xp + xp)

    let next: Progress = {
      ...p,
      xp: p.xp + xp,
      streak,
      days: { ...p.days, [today]: day },
    }
    const newActivity: ActivityEvent[] = []
    if (activity) newActivity.push({ ...activity, id: newId(), at: now, xp })
    if (extended && streak.current > 1) {
      newActivity.push({ id: newId(), at: now, kind: 'streak', title: `${streak.current} day streak!`, detail: 'Keep it going tomorrow.' })
      events.push({ type: 'streak', days: streak.current })
    }
    const levelUp = levelAfter.level > levelBefore.level ? levelAfter : null
    if (levelUp) {
      newActivity.push({ id: newId(), at: now, kind: 'level', title: `Reached Level ${levelUp.level}`, detail: levelUp.title })
    }
    next = { ...next, activity: [...newActivity.reverse(), ...next.activity].slice(0, ACTIVITY_CAP) }

    const { next: withAch, unlocked } = this.unlockAchievements(next)
    next = withAch

    const dailyGoalReached = dayBefore.xp < p.settings.dailyGoal && day.xp >= p.settings.dailyGoal
    if (xp > 0) events.push({ type: 'xp', amount: xp })
    if (levelUp) events.push({ type: 'level-up', level: levelUp })
    for (const id of unlocked) events.push({ type: 'achievement', id })
    if (dailyGoalReached) events.push({ type: 'daily-goal' })

    return {
      next,
      events,
      reward: { xp, breakdown, streakExtended: extended, streak: streak.current, levelUp, achievements: unlocked, dailyGoalReached },
    }
  }

  private unlockAchievements(p: Progress): { next: Progress; unlocked: string[] } {
    const unlocked = newlyEarned(p)
    if (!unlocked.length) return { next: p, unlocked }
    const now = Date.now()
    const achievements = { ...p.achievements }
    const acts: ActivityEvent[] = []
    for (const id of unlocked) {
      achievements[id] = now
      const def = getAchievement(id)
      acts.push({ id: newId(), at: now, kind: 'achievement', title: `Unlocked “${def?.title ?? id}”`, detail: def?.description })
    }
    return { next: { ...p, achievements, activity: [...acts, ...p.activity].slice(0, ACTIVITY_CAP) }, unlocked }
  }

  /** Re-check achievements after changes that don't award XP (e.g. running programs). */
  private commitWithAchievements(p: Progress) {
    const { next, unlocked } = this.unlockAchievements(p)
    this.commit(next, unlocked.map((id) => ({ type: 'achievement' as const, id })))
  }

  // ------------------------------------------------------------------
  // actions
  // ------------------------------------------------------------------
  setProfileName(name: string) {
    this.commit({ ...this.state, profile: { ...this.state.profile, name: name.trim().slice(0, 24) } })
  }

  updateSettings(patch: Partial<Settings>) {
    this.commit({ ...this.state, settings: { ...this.state.settings, ...patch } })
  }

  recordAnswer(input: {
    qid: string
    topic: TopicId
    difficulty: Difficulty
    correct: boolean
    solved: boolean
    source: SessionSource
    isDebugging: boolean
  }) {
    const p = this.state
    const today = dayKey()
    const day = p.days[today] ?? { xp: 0, lessons: 0, answered: 0 }
    const history = [...p.history, { qid: input.qid, topic: input.topic, difficulty: input.difficulty, correct: input.correct, solved: input.solved, at: Date.now(), source: input.source }]
    const counted = input.source !== 'placement'
    this.commitWithAchievements({
      ...p,
      history: history.length > HISTORY_CAP ? history.slice(-HISTORY_CAP) : history,
      days: counted ? { ...p.days, [today]: { ...day, answered: day.answered + 1 } } : p.days,
      stats: counted
        ? {
            ...p.stats,
            answered: p.stats.answered + 1,
            correct: p.stats.correct + (input.correct ? 1 : 0),
            bugsFixed: p.stats.bugsFixed + (input.isDebugging && input.solved ? 1 : 0),
          }
        : p.stats,
    })
  }

  finishLesson(lessonId: string, title: string, s: SessionSummary): Reward {
    const p = this.state
    const prev = p.lessons[lessonId]
    const now = Date.now()
    const breakdown: { label: string; xp: number }[] = [{ label: 'Questions', xp: s.xp }, { label: 'Lesson complete', xp: XP.lessonComplete }]
    if (s.perfect) breakdown.push({ label: 'Perfect lesson', xp: XP.perfectBonus })
    // finishing a lesson clears its "skipped" mark
    const { [lessonId]: _skipped, ...stillSkipped } = p.skipped
    void _skipped
    const withLesson: Progress = {
      ...p,
      skipped: stillSkipped,
      lessons: {
        ...p.lessons,
        [lessonId]: {
          firstCompletedAt: prev?.firstCompletedAt ?? now,
          lastCompletedAt: now,
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, s.accuracy),
          timesCompleted: (prev?.timesCompleted ?? 0) + 1,
          perfect: (prev?.perfect ?? false) || s.perfect,
        },
      },
      stats: { ...p.stats, bestCombo: Math.max(p.stats.bestCombo, s.bestCombo) },
    }
    const { next, reward, events } = this.reward(
      withLesson,
      breakdown,
      { kind: 'lesson', title: `Completed “${title}”`, detail: `${Math.round(s.accuracy * 100)}% accuracy` },
      1,
    )
    this.commit(next, events)
    return reward
  }

  finishCheckpoint(unitId: string, s: SessionSummary, passed: boolean): Reward {
    const p = this.state
    const unit = UNITS.find((u) => u.id === unitId)!
    const prev = p.units[unitId] ?? {}
    const firstPass = passed && !prev.checkpointPassedAt
    const breakdown: { label: string; xp: number }[] = [{ label: 'Questions', xp: s.xp }]
    if (firstPass) breakdown.push({ label: 'Unit complete', xp: XP.unitComplete })
    const { [checkpointId(unitId)]: _skipped, ...stillSkipped } = p.skipped
    void _skipped
    const withUnit: Progress = {
      ...p,
      skipped: passed ? stillSkipped : p.skipped,
      units: {
        ...p.units,
        [unitId]: {
          ...prev,
          checkpointPassedAt: prev.checkpointPassedAt ?? (passed ? Date.now() : undefined),
          bestCheckpointAccuracy: Math.max(prev.bestCheckpointAccuracy ?? 0, s.accuracy),
        },
      },
      stats: { ...p.stats, bestCombo: Math.max(p.stats.bestCombo, s.bestCombo) },
    }
    const { next, reward, events } = this.reward(withUnit, breakdown, {
      kind: 'checkpoint',
      title: passed ? `Passed the Unit ${unit.number} Checkpoint` : `Attempted the Unit ${unit.number} Checkpoint`,
      detail: `${unit.title} · ${Math.round(s.accuracy * 100)}%`,
    })
    this.commit(next, events)
    return reward
  }

  finishPractice(title: string, s: SessionSummary): Reward {
    const p = this.state
    const withStats: Progress = {
      ...p,
      stats: { ...p.stats, practiceSessions: p.stats.practiceSessions + 1, bestCombo: Math.max(p.stats.bestCombo, s.bestCombo) },
    }
    const { next, reward, events } = this.reward(
      withStats,
      [{ label: 'Questions', xp: s.xp }, { label: 'Practice complete', xp: XP.practiceComplete }],
      { kind: 'practice', title, detail: `${s.firstTry}/${s.total} correct on the first try` },
    )
    this.commit(next, events)
    return reward
  }

  /**
   * The learner chose to jump ahead to a lesson, a checkpoint or the Final Challenge. Everything passed over
   * is marked as skipped (not completed, and still open to finish later), and the target is opened.
   * Returns how many steps were skipped.
   */
  skipAhead(id: string): number {
    const p = this.state
    const plan = skipPlan(p, id)
    if (!plan) return 0
    const now = Date.now()
    const skipped = { ...p.skipped }
    for (const k of plan.skipped) skipped[k] = now
    this.commit({ ...p, skipped, unlocked: { ...p.unlocked, [id]: p.unlocked[id] ?? now } })
    return plan.skipped.length
  }

  /** Placement test or "I'm brand new". Marks earlier units as placed out. */
  completeOnboarding(name: string, placement: PlacementResult): Reward {
    const p = this.state
    const start = unitIndex(placement.startUnitId)
    const units = { ...p.units }
    UNITS.forEach((u, i) => {
      if (i < start) units[u.id] = { ...units[u.id], placedOut: true }
    })
    const base: Progress = {
      ...p,
      onboarded: true,
      profile: { ...p.profile, name: name.trim().slice(0, 24) || p.profile.name },
      placement,
      units,
    }
    if (placement.skipped) {
      const { next, unlocked } = this.unlockAchievements(base)
      this.commit(next, unlocked.map((id) => ({ type: 'achievement' as const, id })))
      return { xp: 0, breakdown: [], streakExtended: false, streak: p.streak.current, levelUp: null, achievements: unlocked, dailyGoalReached: false }
    }
    const { next, reward, events } = this.reward(base, [{ label: 'Placement test', xp: XP.placementComplete }], {
      kind: 'placement',
      title: 'Finished the placement test',
      detail: placement.message,
    })
    this.commit(next, events)
    return reward
  }

  recordProgramRun() {
    const p = this.state
    this.commitWithAchievements({ ...p, stats: { ...p.stats, programsRun: p.stats.programsRun + 1 } })
  }

  saveFinalCode(stageId: string, code: string) {
    const p = this.state
    this.commit({ ...p, final: { ...p.final, code: { ...p.final.code, [stageId]: code } } })
  }

  /** Stages can be finished in any order; the challenge is complete once every stage is done. */
  completeFinalStage(stageId: string, title: string): Reward | null {
    const p = this.state
    if (p.final.stagesDone.includes(stageId)) return null
    const breakdown: { label: string; xp: number }[] = [{ label: `Stage: ${title}`, xp: XP.finalStage }]
    const done = [...p.final.stagesDone, stageId]
    const finished = finalStages.every((s) => done.includes(s.id)) && !p.final.completedAt
    if (finished) breakdown.push({ label: 'Final Challenge complete', xp: XP.finalComplete })
    const base: Progress = { ...p, final: { ...p.final, stagesDone: done, completedAt: finished ? Date.now() : p.final.completedAt } }
    const { next, reward, events } = this.reward(base, breakdown, {
      kind: 'final',
      title: finished ? 'Completed the Java Final Challenge!' : `Final Challenge: “${title}” done`,
    })
    this.commit(next, events)
    return reward
  }

  resetProgress() {
    void this.repo.clear()
    this.commit(createEmptyProgress())
  }

  exportJson(): string {
    return JSON.stringify(this.state, null, 2)
  }

  importJson(json: string): boolean {
    try {
      const p = migrate(JSON.parse(json))
      if (!p) return false
      this.commit(p)
      return true
    } catch {
      return false
    }
  }
}

export const store = new ProgressStore(new LocalStorageRepository())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => store.flush())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') store.flush()
  })
}
