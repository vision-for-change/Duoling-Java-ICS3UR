/**
 * Persisted learner progress.
 *
 * This is the single document a backend would store per user. Everything in
 * it is plain JSON (timestamps are epoch ms, days are "YYYY-MM-DD" in local time).
 */
import type { Difficulty, PlacementArea, TopicId } from '../data/types'

export const PROGRESS_VERSION = 1

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
    profile: { name: '', createdAt: now, avatar: 'robot' },
    onboarded: false,
    settings: { ...DEFAULT_SETTINGS },
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDay: null },
    days: {},
    lessons: {},
    units: {},
    history: [],
    achievements: {},
    placement: null,
    activity: [],
    stats: { answered: 0, correct: 0, bestCombo: 0, practiceSessions: 0, programsRun: 0, bugsFixed: 0 },
    final: { stagesDone: [], code: {} },
  }
}
