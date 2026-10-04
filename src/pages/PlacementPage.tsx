import { useMemo, useState } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { Mascot, MascotSays } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { SessionPlayer, type FinishInfo } from '../components/SessionPlayer'
import { getUnit, UNITS } from '../data/curriculum'
import { PLACEMENT_AREAS, placementItems } from '../data/placement'
import type { PlacementArea } from '../data/types'
import { evaluatePlacement } from '../engine/placement'
import { createPlacementSession, type SessionState } from '../engine/session'
import { useProgress } from '../state/hooks'
import { store } from '../state/store'
import type { PlacementResult } from '../state/types'

export function PlacementResults({ result }: { result: PlacementResult }) {
  const areas = Object.keys(PLACEMENT_AREAS) as PlacementArea[]
  return (
    <div className="rounded-3xl border-2 border-espresso-100 bg-white p-4 text-left">
      <p className="mb-4 rounded-2xl bg-sky-50 px-4 py-3 font-semibold text-sky-900">{result.message}</p>
      <ul className="space-y-2.5">
        {areas.map((a) => {
          const s = result.scores[a]
          if (!s) return null
          const ok = s.correct === s.total
          return (
            <li key={a} className="flex items-center gap-3">
              {ok ? <CheckCircle2 size={20} className="shrink-0 text-mint-500" /> : <CircleAlert size={20} className="shrink-0 text-sun-600" />}
              <span className="w-36 shrink-0 text-sm font-bold text-espresso-700">{PLACEMENT_AREAS[a].label}</span>
              <ProgressBar value={s.correct / s.total} color={ok ? 'mint' : 'sun'} height={10} shine={false} label={`${PLACEMENT_AREAS[a].label} score`} />
              <span className="w-10 shrink-0 text-right font-mono text-sm text-espresso-500">
                {s.correct}/{s.total}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function PlacementPage() {
  const p = useProgress()
  const [started, setStarted] = useState(false)
  const initial = useMemo(() => createPlacementSession(placementItems.map((i) => i.question.id)), [])

  const onFinish = (s: SessionState): FinishInfo => {
    const answers = s.answers.map((a) => ({
      area: placementItems.find((i) => i.question.id === a.qid)!.area,
      correct: a.correct,
    }))
    const result = evaluatePlacement(answers)
    const reward = store.completeOnboarding(p.profile.name, result)
    const unit = getUnit(result.startUnitId)!
    const skipped = UNITS.findIndex((u) => u.id === unit.id)
    return {
      reward,
      headline: 'All done with the placement test.',
      subline: skipped > 0 ? `You'll start at Unit ${unit.number}: ${unit.title}. Earlier units stay open for review.` : 'You will start at the very beginning, which is a great place to build strong foundations.',
      mood: 'celebrating',
      primary: { label: `Start Unit ${unit.number}`, to: '/learn' },
      secondary: { label: 'Go to dashboard', to: '/home' },
      extra: <PlacementResults result={result} />,
    }
  }

  if (!started) {
    return (
      <div className="flex min-h-dvh flex-col bg-cream-50">
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5">
          <Logo />
        </header>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 pb-10 text-center">
          <Mascot mood="thinking" size={150} float />
          <h1 className="mt-4 text-4xl font-bold">How much Java do you already know?</h1>
          <p className="mt-3 max-w-lg text-lg text-espresso-600">
            {placementItems.length} quick questions that walk through the course, from variables to loops and exceptions. No hearts, no pressure. Tap <b>"I don't know yet"</b> whenever you're unsure.
          </p>
          <MascotSays mood="encouraging" size={70} className="mt-6 text-left">
            This is not a test you can fail. It just helps me pick the right place for you to start.
          </MascotSays>
          <div className="mt-auto flex w-full flex-col gap-3 pt-10">
            <Button size="lg" full onClick={() => setStarted(true)} autoFocus>
              Start placement test
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return <SessionPlayer initial={initial} onFinish={onFinish} exitTo={p.onboarded ? '/profile' : '/start'} noun="placement test" />
}
