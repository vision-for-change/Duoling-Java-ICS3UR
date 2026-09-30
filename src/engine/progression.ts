/**
 * Where the learner is on the learning path. Nothing is locked: every lesson, checkpoint and the
 * Final Challenge can be opened at any time. `nextStep` only recommends where to go next.
 */
import { checkpointId, UNITS } from '../data/curriculum'
import type { Lesson, Unit } from '../data/types'
import type { Progress } from '../state/types'

export type NodeStatus = 'available' | 'completed'

export function unitIndex(unitId: string): number {
  return UNITS.findIndex((u) => u.id === unitId)
}

export function isUnitComplete(p: Progress, unit: Unit): boolean {
  return !!p.units[unit.id]?.checkpointPassedAt
}

export function isPlacedOut(p: Progress, unit: Unit): boolean {
  return !!p.units[unit.id]?.placedOut
}

export function lessonStatus(p: Progress, lesson: Lesson): NodeStatus {
  return p.lessons[lesson.id] ? 'completed' : 'available'
}

export function checkpointStatus(p: Progress, unit: Unit): NodeStatus {
  return isUnitComplete(p, unit) ? 'completed' : 'available'
}

export function unitProgress(p: Progress, unit: Unit): { done: number; total: number; fraction: number } {
  const total = unit.lessons.length + 1
  const done = unit.lessons.filter((l) => p.lessons[l.id]).length + (isUnitComplete(p, unit) ? 1 : 0)
  return { done, total, fraction: done / total }
}

/** Every unit is finished, so the Final Challenge is the recommended next step. */
export function isFinalReady(p: Progress): boolean {
  const last = UNITS[UNITS.length - 1]
  return UNITS.every((u) => isUnitComplete(p, u) || isPlacedOut(p, u)) && isUnitComplete(p, last)
}

export type NextStep =
  | { kind: 'lesson'; id: string; unitId: string; title: string }
  | { kind: 'checkpoint'; id: string; unitId: string; title: string }
  | { kind: 'final'; id: 'final'; unitId: null; title: string }

type PathStep = Extract<NextStep, { kind: 'lesson' | 'checkpoint' }>

/** Every lesson and checkpoint, in course order. */
const PATH: PathStep[] = UNITS.flatMap((u) => [
  ...u.lessons.map((l): PathStep => ({ kind: 'lesson', id: l.id, unitId: u.id, title: l.title })),
  { kind: 'checkpoint', id: checkpointId(u.id), unitId: u.id, title: `Unit ${u.number} Checkpoint` },
])

const stepFor = (id: string) => PATH.find((s) => s.id === id)!

/** A unit that is still on the recommended path: not passed and not placed out. */
function inProgress(p: Progress, unit: Unit): boolean {
  return !isUnitComplete(p, unit) && !isPlacedOut(p, unit)
}

/** The first unfinished lesson in a unit (looking after `from` first), or its checkpoint once every lesson is done. */
function stepInUnit(p: Progress, unit: Unit, from = 0): PathStep {
  const open = (l: Lesson) => !p.lessons[l.id]
  const lesson = unit.lessons.slice(from).find(open) ?? unit.lessons.find(open)
  return stepFor(lesson ? lesson.id : checkpointId(unit.id))
}

/** The lesson or checkpoint the learner finished most recently. */
function lastFinished(p: Progress): PathStep | null {
  let last: PathStep | null = null
  let lastAt = 0
  for (const s of PATH) {
    const at = s.kind === 'lesson' ? p.lessons[s.id]?.lastCompletedAt : p.units[s.unitId]?.checkpointPassedAt
    if (at && at >= lastAt) [last, lastAt] = [s, at]
  }
  return last
}

/**
 * Where "Continue learning" should take the learner. It follows the learner around: after a
 * lesson it suggests the next one in the same unit, and after a finished unit the next unfinished
 * unit. A brand-new learner starts at the first unit that wasn't placed out.
 */
export function nextStep(p: Progress): NextStep | null {
  const last = lastFinished(p)
  const lastUnit = last ? UNITS[unitIndex(last.unitId)] : null
  if (last && lastUnit && inProgress(p, lastUnit)) {
    return stepInUnit(p, lastUnit, lastUnit.lessons.findIndex((l) => l.id === last.id) + 1)
  }
  const from = lastUnit ? unitIndex(lastUnit.id) + 1 : 0
  const unit = [...UNITS.slice(from), ...UNITS.slice(0, from)].find((u) => inProgress(p, u))
  if (unit) return stepInUnit(p, unit)
  if (isFinalReady(p) && !p.final.completedAt) return { kind: 'final', id: 'final', unitId: null, title: 'Java Final Challenge' }
  // everything done, or only placed-out units left: suggest the first unfinished lesson anywhere
  return PATH.find((s) => (s.kind === 'lesson' ? !p.lessons[s.id] : !isUnitComplete(p, UNITS[unitIndex(s.unitId)]))) ?? null
}

/** The next few unfinished lessons, starting at the recommended step. */
export function upcomingLessons(p: Progress, count: number): Lesson[] {
  const next = nextStep(p)
  const start = next && next.kind !== 'final' ? PATH.indexOf(stepFor(next.id)) : 0
  const lessons = UNITS.filter((u) => inProgress(p, u)).flatMap((u) => u.lessons)
  const order = (l: Lesson) => (PATH.indexOf(stepFor(l.id)) - start + PATH.length) % PATH.length
  return lessons
    .filter((l) => !p.lessons[l.id])
    .sort((a, b) => order(a) - order(b))
    .slice(0, count)
}

/** True when opening `id` (a lesson or checkpoint) jumps past the recommended next step. */
export function isAheadOfPath(p: Progress, id: string): boolean {
  const next = nextStep(p)
  if (!next || next.kind === 'final') return false
  return PATH.indexOf(stepFor(id)) > PATH.indexOf(stepFor(next.id))
}

export function completedLessonCount(p: Progress): number {
  return Object.keys(p.lessons).length
}

/** Question ids the learner has been taught (completed lessons or placed-out units). */
export function taughtQuestionIds(p: Progress): Set<string> {
  const ids = new Set<string>()
  for (const unit of UNITS) {
    const placed = isPlacedOut(p, unit)
    for (const l of unit.lessons) {
      if (placed || p.lessons[l.id]) [...l.questions, l.challenge].forEach((q) => ids.add(q))
    }
    if (isUnitComplete(p, unit) || placed) unit.checkpoint.forEach((q) => ids.add(q))
  }
  return ids
}
