/**
 * Where the learner is on the learning path.
 *
 * Learning is sequential by default: a lesson opens when the lesson before it is finished, and the first
 * lesson of the next unit opens when the last lesson of a unit is finished. A learner can still jump ahead
 * on purpose (the UI asks for confirmation first). Jumping ahead never completes anything. It marks the
 * lessons that were passed over as "skipped" so they can be finished later, and opens the one chosen.
 */
import { checkpointId, UNITS } from '../data/curriculum'
import { getProject } from '../data/projects'
import type { Lesson, Unit } from '../data/types'
import type { Progress } from '../state/types'

/**
 * completed: finished.
 * current: the one to do next.
 * unlocked: open and ready (it came up in order, or it was opened by skipping ahead).
 * skipped: passed over on purpose. It can still be done at any time.
 * locked: not open yet.
 */
export type NodeStatus = 'completed' | 'current' | 'unlocked' | 'skipped' | 'locked'

export function unitIndex(unitId: string): number {
  return UNITS.findIndex((u) => u.id === unitId)
}

export function isUnitComplete(p: Progress, unit: Unit): boolean {
  return !!p.units[unit.id]?.checkpointPassedAt
}

export function isPlacedOut(p: Progress, unit: Unit): boolean {
  return !!p.units[unit.id]?.placedOut
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

const stepFor = (id: string): PathStep | null => PATH.find((s) => s.id === id) ?? null
const unitOfStep = (s: PathStep): Unit => UNITS[unitIndex(s.unitId)]

function isDone(p: Progress, s: PathStep): boolean {
  return s.kind === 'lesson' ? !!p.lessons[s.id] : isUnitComplete(p, unitOfStep(s))
}

/** The step that has to be finished before this one opens up on its own. */
function gate(s: PathStep): PathStep | null {
  const unit = unitOfStep(s)
  if (s.kind === 'checkpoint') return stepFor(unit.lessons[unit.lessons.length - 1].id)
  const i = unit.lessons.findIndex((l) => l.id === s.id)
  if (i > 0) return stepFor(unit.lessons[i - 1].id)
  // the first lesson of a unit opens when the last lesson of the unit before it is finished
  const prev = UNITS[unitIndex(s.unitId) - 1]
  return prev ? stepFor(prev.lessons[prev.lessons.length - 1].id) : null
}

function isOpen(p: Progress, s: PathStep): boolean {
  if (isDone(p, s) || p.skipped[s.id] || p.unlocked[s.id]) return true
  if (isPlacedOut(p, unitOfStep(s))) return true
  const g = gate(s)
  if (!g) return true
  return isDone(p, g) || isPlacedOut(p, unitOfStep(g))
}

/** True when every lesson of the course is finished, so the final project is next. */
function lastLessonDone(p: Progress): boolean {
  const last = UNITS[UNITS.length - 1]
  return !!p.lessons[last.lessons[last.lessons.length - 1].id]
}

export function isFinalUnlocked(p: Progress): boolean {
  return !!p.final.completedAt || p.final.stagesDone.length > 0 || !!p.unlocked.final || lastLessonDone(p)
}

/** Where "Continue learning" should take the learner: the first open step that is not finished or skipped. */
export function nextStep(p: Progress): NextStep | null {
  const cur = PATH.find((s) => isOpen(p, s) && !isDone(p, s) && !p.skipped[s.id] && !isPlacedOut(p, unitOfStep(s)))
  if (cur) return cur
  if (isFinalUnlocked(p) && !p.final.completedAt) return { kind: 'final', id: 'final', unitId: null, title: `Final project: ${getProject(p.project)?.title ?? 'your program'}` }
  // nothing new is waiting: bring the learner back to something they skipped, or to the first unfinished step
  return PATH.find((s) => !isDone(p, s) && p.skipped[s.id]) ?? PATH.find((s) => !isDone(p, s)) ?? null
}

export function nodeStatus(p: Progress, id: string): NodeStatus {
  const s = stepFor(id)
  if (!s) return 'locked'
  if (isDone(p, s)) return 'completed'
  const cur = nextStep(p)
  if (cur && cur.id === id) return 'current'
  if (p.skipped[id]) return 'skipped'
  return isOpen(p, s) ? 'unlocked' : 'locked'
}

export function lessonStatus(p: Progress, lesson: Lesson): NodeStatus {
  return nodeStatus(p, lesson.id)
}

export function checkpointStatus(p: Progress, unit: Unit): NodeStatus {
  return nodeStatus(p, checkpointId(unit.id))
}

/** Can the learner open this right now, without skipping ahead? */
export function canOpen(status: NodeStatus): boolean {
  return status !== 'locked'
}

/** A unit shows up in the course navigation once any of it is open. */
export function isUnitRevealed(p: Progress, unit: Unit): boolean {
  return PATH.some((s) => s.unitId === unit.id && isOpen(p, s))
}

/**
 * What skipping ahead to `id` (a lesson, a checkpoint or 'final') would do: the steps that are passed over.
 * Steps that are already finished or already skipped are left alone.
 */
export function skipPlan(p: Progress, id: string): { target: string; skipped: string[] } | null {
  const end = id === 'final' ? PATH.length : PATH.findIndex((s) => s.id === id)
  if (end < 0) return null
  return { target: id, skipped: PATH.slice(0, end).filter((s) => !isDone(p, s) && !p.skipped[s.id] && !isPlacedOut(p, unitOfStep(s))).map((s) => s.id) }
}

export function unitProgress(p: Progress, unit: Unit): { done: number; total: number; fraction: number } {
  const total = unit.lessons.length + 1
  const done = unit.lessons.filter((l) => p.lessons[l.id]).length + (isUnitComplete(p, unit) ? 1 : 0)
  return { done, total, fraction: done / total }
}

/** The next few lessons the learner can open and has not finished, starting with the current one. */
export function upcomingLessons(p: Progress, count: number): Lesson[] {
  const lessons = UNITS.flatMap((u) => u.lessons)
  const rank = (l: Lesson) => {
    const s = nodeStatus(p, l.id)
    return s === 'current' ? 0 : s === 'unlocked' ? 1 : s === 'skipped' ? 2 : 3
  }
  return lessons
    .filter((l) => rank(l) < 3 && !isPlacedOut(p, UNITS[unitIndex(l.unitId)]))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, count)
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
