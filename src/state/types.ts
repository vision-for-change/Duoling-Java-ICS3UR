/**
 * Persisted learner progress.
 *
 * This is the single document a backend would store per user. Everything in
 * it is plain JSON (timestamps are epoch ms, days are "YYYY-MM-DD" in local time).
 */
import type { Difficulty, PlacementArea, ProjectId, TopicId } from '../data/types'

/**
 * 2: the course was rewritten (new units, lessons and questions), so lesson progress from
 * version 1 no longer lines up with anything. See `migrate` in repository.ts.
 * 3: lessons unlock in order, and `skipped` / `unlocked` record the ones the learner jumped past or opened early.
 * 4: the café kiosk final was replaced by four projects. `project` is the one the learner picked,
 *    and old kiosk stages in `final` are dropped.
 */
export const PROGRESS_VERSION = 4

export type SessionSource = 'lesson' | 'practice' | 'checkpoint' | 'placement'

export interface QuestionAttempt {
  qid: string
  topic: TopicId
  difficulty: Difficulty
  /** correct on the first try */
  correct: boolean
  /** eventually answered correctly (possibly on the second try) */
  solved: boolean
  at: number
  source: SessionSource
}

export interface LessonRecord {
  firstCompletedAt: number
  lastCompletedAt: number
  bestAccuracy: number
  timesCompleted: number
  perfect: boolean
}

export interface UnitRecord {
  checkpointPassedAt?: number
  bestCheckpointAccuracy?: number
  placedOut?: boolean
}

export type ActivityKind = 'lesson' | 'checkpoint' | 'practice' | 'achievement' | 'level' | 'placement' | 'final' | 'streak'

export interface ActivityEvent {
  id: string
  at: number
  kind: ActivityKind
  title: string
  detail?: string
  xp?: number
}

export interface PlacementResult {
  completedAt: number
  skipped: boolean
  scores: Partial<Record<PlacementArea, { correct: number; total: number }>>
  startUnitId: string
  message: string
}

export interface Settings {
  heartsEnabled: boolean
  maxHearts: number
  sound: boolean
  motion: 'system' | 'reduced' | 'full'
  dailyGoal: number
}

export interface DayRecord {
  xp: number
  lessons: number
  answered: number
}

export interface Progress {
  version: number
  profile: { name: string; createdAt: number; avatar: string }
  onboarded: boolean
  settings: Settings
  xp: number
  streak: { current: number; longest: number; lastActiveDay: string | null }
  days: Record<string, DayRecord>
  lessons: Record<string, LessonRecord>
  units: Record<string, UnitRecord>
  /** lesson / checkpoint id -> when the learner chose to skip past it. Skipped is not completed. */
  skipped: Record<string, number>
  /** lesson / checkpoint id (or 'final') -> when skipping ahead opened it early */
  unlocked: Record<string, number>
  /** oldest first, capped */
  history: QuestionAttempt[]
  /** achievement id -> unlocked at */
  achievements: Record<string, number>
  placement: PlacementResult | null
  /** newest first, capped */
  activity: ActivityEvent[]
  stats: {
    answered: number
    correct: number
    bestCombo: number
    practiceSessions: number
    programsRun: number
    bugsFixed: number
  }
  /** the final project the learner chose when they started (null until they pick one) */
  project: ProjectId | null
  /** stage ids are project specific (cart-1, guesser-2, ...); completedAt is set when the chosen project is finished */
  final: { stagesDone: string[]; completedAt?: number; code: Record<string, string> }
}

export const DEFAULT_SETTINGS: Settings = {
  heartsEnabled: true,
  maxHearts: 5,
  sound: true,
  motion: 'system',
  dailyGoal: 50,
}

export function createEmptyProgress(now = Date.now()): Progress {
  return {
    version: PROGRESS_VERSION,
    profile: { name: '', createdAt: now, avatar: 'lion' },
    onboarded: false,
    settings: { ...DEFAULT_SETTINGS },
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDay: null },
    days: {},
    lessons: {},
    units: {},
    skipped: {},
    unlocked: {},
    history: [],
    achievements: {},
    placement: null,
    activity: [],
    stats: { answered: 0, correct: 0, bestCombo: 0, practiceSessions: 0, programsRun: 0, bugsFixed: 0 },
    project: null,
    final: { stagesDone: [], code: {} },
  }
}
