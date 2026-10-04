import { useState, type ReactNode } from 'react'
import { BookOpenText, Check, Flag, ListTree, Lock, Play, SkipForward, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router'
import { UNITS, checkpointId } from '../data/curriculum'
import { canOpen, isFinalUnlocked, nodeStatus, type NodeStatus } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import { store } from '../state/store'
import type { Progress } from '../state/types'
import { Button } from './Button'
import { Modal } from './Modal'

/** Something the learner can open: a lesson, a unit checkpoint or the Final Challenge. */
export interface NavTarget {
  id: string
  title: string
  to: string
  status: NodeStatus
}

export const STATUS_LABEL: Record<NodeStatus, string> = {
  completed: 'Completed',
  current: 'Up next',
  unlocked: 'Unlocked',
  skipped: 'Skipped',
  locked: 'Locked',
}

export function StatusIcon({ status, size = 18 }: { status: NodeStatus; size?: number }) {
  const props = { size, strokeWidth: 2.6, 'aria-hidden': true as const }
  switch (status) {
    case 'completed':
      return <Check {...props} className="text-mint-600" />
    case 'current':
      return <Play {...props} className="fill-brew-500 text-brew-500" />
    case 'skipped':
      return <SkipForward {...props} className="text-sun-700" />
    case 'locked':
      return <Lock {...props} className="text-espresso-300" />
    default:
      return <BookOpenText {...props} className="text-sky-600" />
  }
}

/** Ask before opening something that has not been unlocked yet. */
export function SkipAheadDialog({ target, onCancel, onConfirm }: { target: NavTarget | null; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal open={!!target} onClose={onCancel} title="Are you sure you want to skip ahead?" size="sm">
      <p className="text-espresso-700">You haven't completed the lessons between your current lesson and this one. Skipping means you won't review or complete those lessons first.</p>
      {target && (
        <p className="mt-3 rounded-xl bg-espresso-50 px-3 py-2 text-sm font-semibold text-espresso-600">
          Jumping to: <span className="font-bold text-espresso-900">{target.title}</span>
        </p>
      )}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm} data-autofocus>
          Yes, Skip Ahead
        </Button>
      </div>
    </Modal>
  )
}

/**
 * Opening things the right way: unlocked things just open. A locked one asks first, and only after
 * the learner confirms does it mark what was passed over as skipped, open the target and go there.
 */
export function useCourseNavigation(): { open: (t: NavTarget) => void; dialog: ReactNode } {
  const navigate = useNavigate()
  const [pending, setPending] = useState<NavTarget | null>(null)
  const open = (t: NavTarget) => {
    if (canOpen(t.status)) navigate(t.to)
    else setPending(t)
  }
  const dialog = (
    <SkipAheadDialog
      target={pending}
      onCancel={() => setPending(null)}
      onConfirm={() => {
        if (!pending) return
        store.skipAhead(pending.id)
        navigate(pending.to)
        setPending(null)
      }}
    />
  )
  return { open, dialog }
}

/** The whole course in one list, so a learner can pick any lesson. Locked ones go through the skip dialog. */
export function CourseOutline({ open, onClose, progress: p, onPick }: { open: boolean; onClose: () => void; progress: Progress; onPick: (t: NavTarget) => void }) {
  const finalStatus: NodeStatus = p.final.completedAt ? 'completed' : isFinalUnlocked(p) ? 'unlocked' : 'locked'
  return (
    <Modal open={open} onClose={onClose} title="Course outline" size="lg">
      <p className="mb-4 text-espresso-600">Pick any lesson. If it is not unlocked yet, I will check that you really want to skip ahead.</p>
      <div className="space-y-5">
        {UNITS.map((unit) => {
          const style = UNIT_STYLES[unit.color]
          const rows: NavTarget[] = [
            ...unit.lessons.map((l) => ({ id: l.id, title: l.title, to: `/lesson/${l.id}`, status: nodeStatus(p, l.id) })),
            { id: checkpointId(unit.id), title: `Unit ${unit.number} Checkpoint`, to: `/checkpoint/${unit.id}`, status: nodeStatus(p, checkpointId(unit.id)) },
          ]
          return (
            <section key={unit.id}>
              <h3 className={`mb-1.5 text-sm font-extrabold tracking-wider uppercase ${style.text}`}>
                Unit {unit.number}: {unit.title}
              </h3>
              <ul className="space-y-1">
                {rows.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onPick(r)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border-2 border-transparent px-3 py-2 text-left transition hover:border-espresso-100 hover:bg-cream-100"
                    >
                      <StatusIcon status={r.status} />
                      <span className={`flex-1 font-semibold ${r.status === 'locked' ? 'text-espresso-400' : 'text-espresso-900'}`}>
                        {r.id.endsWith('-checkpoint') && <Trophy size={14} className="mr-1.5 inline -mt-0.5 text-sun-700" aria-hidden />}
                        {r.title}
                      </span>
                      <span className="text-xs font-bold text-espresso-400">{STATUS_LABEL[r.status]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <section>
          <h3 className="mb-1.5 text-sm font-extrabold tracking-wider text-espresso-500 uppercase">The finish line</h3>
          <button
            type="button"
            onClick={() => {
              onClose()
              onPick({ id: 'final', title: 'Java Final Challenge', to: '/final', status: finalStatus })
            }}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-transparent px-3 py-2 text-left transition hover:border-espresso-100 hover:bg-cream-100"
          >
            {finalStatus === 'locked' ? <Lock size={18} strokeWidth={2.6} className="text-espresso-300" aria-hidden /> : <Flag size={18} strokeWidth={2.6} className="text-brew-500" aria-hidden />}
            <span className={`flex-1 font-semibold ${finalStatus === 'locked' ? 'text-espresso-400' : 'text-espresso-900'}`}>Java Final Challenge</span>
            <span className="text-xs font-bold text-espresso-400">{STATUS_LABEL[finalStatus]}</span>
          </button>
        </section>
      </div>
    </Modal>
  )
}

/** The button that opens the course outline. */
export function OutlineButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border-2 border-espresso-200 bg-white px-4 py-2 font-display text-sm font-semibold tracking-wide text-espresso-700 uppercase shadow-[0_3px_0_var(--color-espresso-200)] transition hover:bg-cream-100 active:translate-y-[2px] active:shadow-none"
    >
      <ListTree size={18} aria-hidden /> Course outline
    </button>
  )
}
