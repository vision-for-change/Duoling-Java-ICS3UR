import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { dayKey, liveStreak } from '../engine/dates'
import { levelProgress } from '../engine/gamification'
import { topicStats } from '../engine/stats'
import { store, type StoreEvent } from './store'
import type { Progress } from './types'

export function useProgress(): Progress {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}

export function useStoreEvents(fn: (e: StoreEvent) => void) {
  useEffect(() => store.onEvent(fn), [fn])
}

/** Frequently used derived values. */
export function useDerived() {
  const p = useProgress()
  return useMemo(() => {
    const today = dayKey()
    return {
      progress: p,
      today,
      streak: liveStreak(p.streak, today),
      activeToday: p.streak.lastActiveDay === today,
      level: levelProgress(p.xp),
      todayXp: p.days[today]?.xp ?? 0,
      topics: topicStats(p.history),
    }
  }, [p])
}
