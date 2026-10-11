import { useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { ButtonLink } from '../components/Button'
import { MascotSays } from '../components/Mascot'
import { SessionPlayer, type FinishInfo } from '../components/SessionPlayer'
import type { TopicId } from '../data/types'
import { buildPractice, type PracticeMode } from '../engine/practice'
import { createPracticeSession, summarize, type SessionState } from '../engine/session'
import { useProgress } from '../state/hooks'
import { store } from '../state/store'

/**
 * A quiet, adaptive review session (topic, unit, mistakes or a smart mix). The Practice page itself is
 * now the Java battle (BattlePage); lessons and the dashboard still link here for calm review.
 */
export function PracticeSessionPage() {
  const [params] = useSearchParams()
  const p = useProgress()
  const mode = (params.get('mode') as PracticeMode) || 'smart'
  const topic = (params.get('topic') as TopicId) || undefined
  const unitId = params.get('unit') || undefined
  const hearts = p.settings.heartsEnabled ? p.settings.maxHearts : null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const plan = useMemo(() => buildPractice(store.getSnapshot(), mode, topic, 8, Math.random, unitId), [mode, topic, unitId])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => createPracticeSession(plan.qids, plan.title, plan.followupPool, { hearts, startLevel: 1 }), [plan])

  if (!plan.qids.length) {
    if (mode === 'mistakes') return <Navigate to="/practice" replace />
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <MascotSays mood="thinking">There is nothing to practice yet. Finish a lesson first, and then come back.</MascotSays>
        <ButtonLink to="/learn">Go to the path</ButtonLink>
      </div>
    )
  }

  const onFinish = (s: SessionState): FinishInfo => {
    const sum = summarize(s)
    const reward = store.finishPractice(plan.title, sum)
    return {
      reward,
      headline: sum.accuracy >= 0.8 ? 'Practice complete. Nice work.' : 'Practice complete!',
      subline: `${sum.firstTry}/${sum.total} right on the first try. Every mistake you fix makes the idea stick.`,
      primary: { label: 'Back to practice', to: '/practice' },
      secondary: { label: 'Continue learning', to: '/learn' },
    }
  }

  return <SessionPlayer initial={initial} onFinish={onFinish} exitTo="/practice" noun="practice session" />
}

