import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router'
import { SessionPlayer, type FinishInfo } from '../components/SessionPlayer'
import { getLesson, getUnit } from '../data/curriculum'
import { isPlacedOut, nextStep } from '../engine/progression'
import { createCheckpointSession, createLessonSession, summarize, type SessionState } from '../engine/session'
import { useProgress } from '../state/hooks'
import { store } from '../state/store'

const PASS_MARK = 0.6

function continueTarget(): { label: string; to: string } {
  const next = nextStep(store.getSnapshot())
  if (!next) return { label: 'Back to the path', to: '/learn' }
  if (next.kind === 'final') return { label: 'Take the Final Challenge', to: '/final' }
  return { label: 'Continue', to: '/learn' }
}

export function LessonPage() {
  const { lessonId = '' } = useParams()
  const p = useProgress()
  const lesson = getLesson(lessonId)
  const unit = lesson ? getUnit(lesson.unitId) : undefined
  const hearts = p.settings.heartsEnabled ? p.settings.maxHearts : null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => (lesson ? createLessonSession(lesson, unit, { hearts }) : null), [lessonId])

  if (!lesson || !initial) return <Navigate to="/learn" replace />

  const onFinish = (s: SessionState): FinishInfo => {
    const sum = summarize(s)
    const reward = store.finishLesson(lesson.id, lesson.title, sum)
    return {
      reward,
      headline: sum.perfect ? 'Perfect lesson! 💯' : 'Lesson complete! Java level up!',
      subline: `“${lesson.title}” · ${sum.firstTry}/${sum.total} right on the first try`,
      mood: 'celebrating',
      primary: continueTarget(),
      secondary: sum.accuracy < 0.8 ? { label: 'Practice this topic', to: `/practice/session?mode=topic&topic=${lesson.topic}` } : { label: 'Dashboard', to: '/home' },
    }
  }

  return <SessionPlayer key={lesson.id} initial={initial} onFinish={onFinish} exitTo="/learn" noun="lesson" />
}

export function CheckpointPage() {
  const { unitId = '' } = useParams()
  const p = useProgress()
  const unit = getUnit(unitId)
  const hearts = p.settings.heartsEnabled ? p.settings.maxHearts : null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => (unit ? createCheckpointSession(unit, { hearts }) : null), [unitId])

  if (!unit || !initial) return <Navigate to="/learn" replace />

  const onFinish = (s: SessionState): FinishInfo => {
    const sum = summarize(s)
    const passed = sum.accuracy >= PASS_MARK
    const reward = store.finishCheckpoint(unit.id, sum, passed)
    const after = store.getSnapshot()
    if (!passed) {
      // unit practice reviews finished lessons, so someone who jumped straight here starts with the lessons
      const learned = isPlacedOut(after, unit) || unit.lessons.some((l) => after.lessons[l.id])
      const firstLesson = unit.lessons.find((l) => !after.lessons[l.id]) ?? unit.lessons[0]
      return {
        reward,
        passed: false,
        mood: 'encouraging',
        headline: 'So close! Let\'s review.',
        subline: `You got ${Math.round(sum.accuracy * 100)}% on the first try, and ${Math.round(PASS_MARK * 100)}% passes the checkpoint. ${learned ? 'Practice a bit and try again!' : 'The lessons in this unit will get you there!'}`,
        primary: learned ? { label: 'Practice this unit', to: `/practice/session?mode=unit&unit=${unit.id}` } : { label: `Start Unit ${unit.number}`, to: `/lesson/${firstLesson.id}` },
        secondary: { label: 'Back to the path', to: '/learn' },
      }
    }
    const allDone = nextStep(after)?.kind === 'final'
    return {
      reward,
      passed: true,
      headline: `Unit ${unit.number} complete! 🎉`,
      subline: allDone ? 'You finished every unit. Time for the Java Final Challenge!' : `You mastered ${unit.title}.`,
      primary: allDone ? { label: 'Open the Final Challenge', to: '/final' } : continueTarget(),
      secondary: { label: 'Dashboard', to: '/home' },
    }
  }

  return <SessionPlayer key={unit.id} initial={initial} onFinish={onFinish} exitTo="/learn" noun="checkpoint" />
}
