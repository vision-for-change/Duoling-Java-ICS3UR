import { CheckCircle2 } from 'lucide-react'
import { getQuestion, getUnit } from '../data/curriculum'
import type { Lesson } from '../data/types'
import { XP } from '../engine/gamification'
import type { NodeStatus } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import type { LessonRecord } from '../state/types'
import { ButtonLink } from './Button'

const DOTS = ['', '🟢', '🟡', '🔴']

/** Compact card for a lesson: unit, title, difficulty range, status and a start/review button. */
export function LessonCard({ lesson, status, record }: { lesson: Lesson; status: NodeStatus; record?: LessonRecord }) {
  const unit = getUnit(lesson.unitId)!
  const style = UNIT_STYLES[unit.color]
  const difficulties = [...new Set([...lesson.questions, lesson.challenge].map((q) => getQuestion(q).difficulty))].sort()
  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-espresso-100 bg-white p-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${style.soft}`} aria-hidden>
        {unit.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-xs font-extrabold tracking-wider uppercase ${style.text}`}>
          Unit {unit.number} · {unit.title}
        </div>
        <div className="truncate font-display text-lg font-semibold text-espresso-900">{lesson.title}</div>
        <div className="flex flex-wrap items-center gap-x-3 text-sm text-espresso-500">
          <span>{lesson.summary}</span>
          <span title="Difficulty range">{difficulties.map((d) => DOTS[d]).join('')}</span>
          {status === 'completed' && record && (
            <span className="inline-flex items-center gap-1 font-bold text-mint-600">
              <CheckCircle2 size={14} /> best {Math.round(record.bestAccuracy * 100)}%
            </span>
          )}
        </div>
      </div>
      <ButtonLink to={`/lesson/${lesson.id}`} size="sm" variant={status === 'completed' ? 'secondary' : 'primary'} className="shrink-0">
        {status === 'completed' ? 'Review' : `Start · ${XP.lessonComplete}+ XP`}
      </ButtonLink>
    </div>
  )
}
