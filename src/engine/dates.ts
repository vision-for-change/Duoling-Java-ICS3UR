/** Local-calendar day helpers ("YYYY-MM-DD"), used for streaks and daily goals. */

export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, n: number): string {
  const d = parseDay(key)
  d.setDate(d.getDate() + n)
  return dayKey(d)
}

export interface Streak {
  current: number
  longest: number
  lastActiveDay: string | null
}

/** Register activity on `today`. Returns the new streak and whether it grew. */
export function registerActivity(streak: Streak, today: string): { streak: Streak; extended: boolean } {
  if (streak.lastActiveDay === today) return { streak, extended: false }
  const current = streak.lastActiveDay === addDays(today, -1) ? streak.current + 1 : 1
  return {
    streak: { current, longest: Math.max(streak.longest, current), lastActiveDay: today },
    extended: true,
  }
}

/** The streak as it should be displayed today (0 if a day was missed). */
export function liveStreak(streak: Streak, today: string): number {
  if (!streak.lastActiveDay) return 0
  if (streak.lastActiveDay === today || streak.lastActiveDay === addDays(today, -1)) return streak.current
  return 0
}

/** The last `n` days ending today, oldest first. */
export function lastDays(today: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)))
}

export function relativeTime(ts: number, now = Date.now()): string {
  const s = Math.round((now - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d} days ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
