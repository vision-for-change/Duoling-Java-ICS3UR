import { useMemo } from 'react'
import { Dumbbell, FlaskConical, RotateCcw, Target } from 'lucide-react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { ButtonLink } from '../components/Button'
import { Mascot, MascotSays } from '../components/Mascot'
import { PageLayout, PageTitle } from '../components/Navbar'
import { ProgressBar } from '../components/ProgressBar'
import { SessionPlayer, type FinishInfo } from '../components/SessionPlayer'
import { getTopic, TOPICS } from '../data/curriculum'
import type { TopicId } from '../data/types'
import { availableTopics, buildPractice, type PracticeMode } from '../engine/practice'
import { createPracticeSession, summarize, type SessionState } from '../engine/session'
import { mastery, missedQuestionIds, MIN_ATTEMPTS, weakTopics } from '../engine/stats'
import { useDerived, useProgress } from '../state/hooks'
import { store } from '../state/store'
import { AppIcon } from '../components/AppIcon'

function pct(v: number) {
  return `${Math.round(v * 100)}%`
}

export function PracticePage() {
  const { progress, topics } = useDerived()
  const open = availableTopics(progress)
  const weak = weakTopics(topics).filter((t) => open.includes(t.topic))
  const missed = missedQuestionIds(progress.history)

  if (open.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
        <Mascot mood="thinking" size={140} float />
        <h1 className="mt-4 text-3xl font-bold">Practice unlocks after your first lesson</h1>
        <p className="mt-2 text-espresso-600">Byte builds practice sessions from what you've already learned, and focuses on what you find tricky.</p>
        <ButtonLink to="/learn" size="lg" className="mt-6">
          Go to the path
        </ButtonLink>
      </div>
    )
  }

  return (
    <PageLayout
      aside={
        <>
          <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <FlaskConical className="text-mint-600" /> Java Sandbox
            </div>
            <p className="mt-1 text-sm text-espresso-600">Experiment freely: write any small program, run it and watch it step by step.</p>
            <ButtonLink to="/sandbox" variant="success" size="sm" className="mt-3">
              Open sandbox
            </ButtonLink>
          </div>
          <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5 text-sm text-espresso-600">
            <div className="mb-1 font-display text-lg font-semibold text-espresso-900">How practice works</div>
            Byte looks at your answer history, finds topics under 80% accuracy and the questions you missed, and mixes them into short sessions. Get them right and your mastery bars grow!
          </div>
        </>
      }
    >
      <PageTitle title="Practice" subtitle="Short, adaptive review sessions built from your mistakes." icon={<Dumbbell size={36} className="text-brew-500" />} />

      <div className="rounded-3xl border-2 border-brew-600 bg-gradient-to-br from-brew-400 to-brew-600 p-6 text-white shadow-[0_5px_0_var(--color-brew-700)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Mascot mood="encouraging" size={100} />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{weak.length ? 'Practice your weak areas' : 'Smart mixed review'}</h2>
            {weak.length ? (
              <ul className="mt-2 space-y-1.5">
                {weak.slice(0, 3).map((w) => (
                  <li key={w.topic} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 font-bold">{getTopic(w.topic).short}</span>
                    <ProgressBar value={w.accuracy} color="sun" height={10} track="bg-white/25" shine={false} label={`${getTopic(w.topic).short} accuracy`} />
                    <span className="w-12 shrink-0 text-right font-display font-semibold">{pct(w.accuracy)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-white/90">No weak spots yet. Nice! A mixed review keeps everything fresh.</p>
            )}
          </div>
          <ButtonLink to="/practice/session?mode=smart" variant="sun" size="lg" icon={<Target size={20} />}>
            Start
          </ButtonLink>
        </div>
      </div>

      {missed.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-3xl border-2 border-berry-200 bg-berry-50 p-5 sm:flex-row sm:items-center">
          <RotateCcw className="shrink-0 text-berry-500" size={32} />
          <div className="flex-1">
            <div className="font-display text-xl font-semibold text-berry-800">Fix your mistakes</div>
            <p className="text-sm text-berry-700">
              {missed.length} question{missed.length === 1 ? '' : 's'} you didn't get right the first time.
            </p>
          </div>
          <ButtonLink to="/practice/session?mode=mistakes" variant="danger">
            Retry them
          </ButtonLink>
        </div>
      )}

      <h2 className="mt-10 mb-4 text-2xl font-bold">Practice a topic</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {TOPICS.map((t) => {
          const s = topics[t.id]
          const unlocked = open.includes(t.id)
          const m = mastery(s)
          const inner = (
            <>
              <AppIcon name={t.icon} size={32} className={unlocked ? 'shrink-0 text-brew-500' : 'shrink-0 text-espresso-300'} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg font-semibold">{t.label}</span>
                <span className="mt-1 flex items-center gap-2">
                  <ProgressBar value={m} color={m >= 0.85 ? 'mint' : m >= 0.6 ? 'sun' : 'brew'} height={8} shine={false} label={`${t.label} mastery`} />
                  <span className="w-24 shrink-0 text-right text-xs font-bold text-espresso-500">
                    {!unlocked ? 'Not started' : s.attempts < MIN_ATTEMPTS ? `${s.attempts} answered` : `${pct(s.accuracy)} · ${s.attempts}`}
                  </span>
                </span>
              </span>
            </>
          )
          return unlocked ? (
            <Link
              key={t.id}
              to={`/practice/session?mode=topic&topic=${t.id}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-espresso-100 bg-white p-4 shadow-[0_3px_0_var(--color-espresso-100)] transition hover:border-brew-200 hover:bg-brew-50/40 active:translate-y-[2px] active:shadow-none"
            >
              {inner}
            </Link>
          ) : (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-espresso-100 p-4 opacity-60">
              {inner}
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}

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
        <MascotSays mood="thinking">Nothing to practice here yet. Finish a lesson first!</MascotSays>
        <ButtonLink to="/learn">Go to the path</ButtonLink>
      </div>
    )
  }

  const onFinish = (s: SessionState): FinishInfo => {
    const sum = summarize(s)
    const reward = store.finishPractice(plan.title, sum)
    return {
      reward,
      headline: sum.accuracy >= 0.8 ? 'Practice complete. Great work!' : 'Practice complete!',
      subline: `${sum.firstTry}/${sum.total} right on the first try. Every mistake you fix makes the idea stick.`,
      primary: { label: 'Back to practice', to: '/practice' },
      secondary: { label: 'Continue learning', to: '/learn' },
    }
  }

  return <SessionPlayer initial={initial} onFinish={onFinish} exitTo="/practice" noun="practice session" />
}

