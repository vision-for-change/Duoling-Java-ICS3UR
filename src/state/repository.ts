/**
 * Persistence boundary. The app only talks to a ProgressRepository, so moving
 * from localStorage to a real backend means writing one new class, e.g.
 *
 *   class ApiRepository implements ProgressRepository {
 *     load = () => fetch('/api/progress').then(r => r.ok ? r.json() : null)
 *     save = (p) => fetch('/api/progress', { method: 'PUT', body: JSON.stringify(p) })
 *     clear = () => fetch('/api/progress', { method: 'DELETE' })
 *   }
 */
import { createEmptyProgress, DEFAULT_SETTINGS, PROGRESS_VERSION, type Progress } from './types'

export interface ProgressRepository {
  load(): Promise<Progress | null>
  save(progress: Progress): Promise<void>
  clear(): Promise<void>
  /** optional: notify when the data changes elsewhere (another tab, another device) */
  watch?(onChange: (progress: Progress) => void): () => void
}

const KEY = 'bytebrew.progress.v1'

export class LocalStorageRepository implements ProgressRepository {
  private key: string
  constructor(key = KEY) {
    this.key = key
  }

  async load(): Promise<Progress | null> {
    try {
      const raw = localStorage.getItem(this.key)
      if (!raw) return null
      return migrate(JSON.parse(raw))
    } catch {
      return null
    }
  }

  async save(progress: Progress): Promise<void> {
    try {
      localStorage.setItem(this.key, JSON.stringify(progress))
    } catch {
      // storage full or unavailable (private mode): progress stays in memory
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.key)
    } catch {
      // ignore
    }
  }

  /** The `storage` event fires when another tab writes the same key. */
  watch(onChange: (progress: Progress) => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key !== this.key || !e.newValue) return
      try {
        const p = migrate(JSON.parse(e.newValue))
        if (p) onChange(p)
      } catch {
        // ignore malformed data
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }
}

/** In-memory repository, used by tests. */
export class MemoryRepository implements ProgressRepository {
  data: Progress | null = null
  async load() {
    return this.data ? structuredClone(this.data) : null
  }
  async save(p: Progress) {
    this.data = structuredClone(p)
  }
  async clear() {
    this.data = null
  }
}

/** Lessons that no longer exist (version 5 removed the Math class and random numbers). */
const REMOVED_LESSONS = ['u3-l5', 'u3-l6']
const REMOVED_QUESTION = /^u3l[56]-/

function withoutKeys<T>(record: Record<string, T>, keys: string[]): Record<string, T> {
  const out = { ...record }
  for (const k of keys) delete out[k]
  return out
}

function dropRemovedLessons(course: { lessons: Progress['lessons']; history: Progress['history'] }) {
  course.lessons = withoutKeys(course.lessons, REMOVED_LESSONS)
  course.history = course.history.filter((a) => !REMOVED_QUESTION.test(a.qid) && (a.topic as string) !== 'math')
}

/**
 * Validate and upgrade a stored document. Unknown or missing fields are filled
 * from defaults so older saves keep working as the schema grows.
 */
export function migrate(raw: unknown): Progress | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<Progress>
  if (typeof r.version !== 'number' || r.version > PROGRESS_VERSION) return null
  const empty = createEmptyProgress(r.profile?.createdAt ?? Date.now())
  // Saves from before the course rewrite keep who the learner is (name, goal, XP, streak, badges)
  // but start the new course fresh, because the old lesson and question ids no longer exist.
  const oldCourse = r.version < 2
  const course = oldCourse
    ? { lessons: {}, units: {}, history: [], placement: null, activity: [], final: { ...empty.final } }
    : {
        lessons: r.lessons ?? {},
        units: r.units ?? {},
        history: Array.isArray(r.history) ? r.history : [],
        placement: r.placement ?? null,
        activity: Array.isArray(r.activity) ? r.activity : [],
        // the café kiosk (version 3 and older) is gone, so its stages are dropped
        final: r.version < 4 ? { ...empty.final } : { ...empty.final, ...r.final },
      }
  // version 5 removed the Math class and random numbers lessons, so forget them
  if (r.version < 5) dropRemovedLessons(course)
  return {
    ...empty,
    ...r,
    ...course,
    version: PROGRESS_VERSION,
    profile: { ...empty.profile, ...r.profile, avatar: 'lauder' },
    settings: { ...DEFAULT_SETTINGS, ...r.settings },
    streak: { ...empty.streak, ...r.streak },
    stats: { ...empty.stats, ...r.stats },
    battle: { ...empty.battle, ...r.battle },
    warmups: r.warmups ?? {},
    skipped: withoutKeys(r.skipped ?? {}, REMOVED_LESSONS),
    unlocked: withoutKeys(r.unlocked ?? {}, REMOVED_LESSONS),
    project: r.version < 4 ? null : (r.project ?? null),
    days: r.days ?? {},
    achievements: r.achievements ?? {},
  }
}
