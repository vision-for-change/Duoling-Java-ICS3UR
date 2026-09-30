import { useEffect } from 'react'
import { Compass, Flag, Target } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { ButtonLink } from '../components/Button'
import { LearningPath } from '../components/LearningPath'
import { Mascot } from '../components/Mascot'
import { PageLayout } from '../components/Navbar'
import { ProgressBar } from '../components/ProgressBar'
import { UNITS } from '../data/curriculum'
import { isFinalReady, isUnitComplete, nextStep, unitProgress } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import { useDerived } from '../state/hooks'
import { Card, WeekStrip } from './DashboardPage'

function FinalNode() {
  const { progress: p } = useDerived()
  const ready = isFinalReady(p)
  const done = !!p.final.completedAt
  const started = p.final.stagesDone.length > 0
  return (
    <div
      id="final"
      className={`mx-auto max-w-md scroll-mt-24 rounded-3xl border-2 p-6 text-center ${ready || done ? 'border-espresso-900 bg-gradient-to-br from-sun-200 via-brew-100 to-mint-100 shadow-[0_5px_0_var(--color-espresso-900)]' : 'border-espresso-200 bg-white shadow-[0_5px_0_var(--color-espresso-200)]'}`}
    >
      <div className="text-5xl" aria-hidden>
        {done ? '🏆' : '🏁'}
      </div>
      <h2 className="mt-2 text-2xl font-bold">Java Final Challenge</h2>
      <p className="mt-1 text-espresso-600">Build Byte's Café Kiosk: input validation, loops, try/catch, Math and a printf receipt, in 5 guided stages.</p>
      <ButtonLink to="/final" size="lg" className="mt-4" variant={ready && !done ? 'primary' : 'secondary'}>
        {done ? 'Open the kiosk again' : started ? 'Continue the challenge' : 'Start the challenge'}
      </ButtonLink>
      {!ready && !done && <p className="mt-3 text-sm font-semibold text-espresso-500">Open anytime. It uses ideas from every unit, so it's easiest after Unit 8.</p>}
    </div>
  )
}

export function LearnPage() {
  const { progress: p, streak, today, todayXp } = useDerived()
  const location = useLocation()
  const next = nextStep(p)

  useEffect(() => {
    const id = location.hash.slice(1) || (next ? (next.unitId ?? 'final') : '')
    if (!id) return
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      if (location.hash) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else {
        // scroll so the current node is visible
        const target = el.querySelector('.animate-pulse-ring') ?? el
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash])

  return (
    <PageLayout
      aside={
        <div className="space-y-4 xl:sticky xl:top-24">
          <Card title={streak ? `${streak} day streak` : 'Start a streak'} icon={<span className="text-xl">🔥</span>}>
            <WeekStrip days={p.days} today={today} />
          </Card>
          <Card title="Daily goal" icon={<Target className="text-mint-600" size={22} />}>
            <div className="flex items-center gap-3">
              <ProgressBar value={todayXp / p.settings.dailyGoal} color="mint" label="Daily goal" />
              <span className="shrink-0 font-display font-semibold">
                {todayXp}/{p.settings.dailyGoal}
              </span>
            </div>
          </Card>
          <Card title="Units" icon={<Flag className="text-brew-500" size={22} />}>
            <ul className="space-y-1.5">
              {UNITS.map((u) => {
                const pr = unitProgress(p, u)
                return (
                  <li key={u.id}>
                    <Link to={`#${u.id}`} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-espresso-700 hover:bg-cream-100">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-white ${UNIT_STYLES[u.color].bg}`}>{u.number}</span>
                      <span className="flex-1 truncate">{u.title}</span>
                      <span className="text-xs text-espresso-400">{isUnitComplete(p, u) ? '✓' : `${pr.done}/${pr.total}`}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      }
    >
      <div className="paper-dots -mx-4 rounded-none px-4 py-2 sm:mx-0 sm:rounded-[40px] sm:px-6">
        {p.placement && !p.placement.skipped && Object.values(p.units).some((u) => u.placedOut) ? (
          <div className="mt-4 flex items-center gap-3 rounded-3xl border-2 border-sky-200 bg-sky-50 p-4">
            <Mascot mood="happy" size={56} />
            <p className="text-sm font-semibold text-sky-900">
              Based on your placement test, earlier units are <b>placed out</b>. Every lesson is still open, so review them whenever you like.
            </p>
          </div>
        ) : (
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm font-semibold text-espresso-500">
            <Compass size={18} className="shrink-0 text-brew-500" />
            <span>
              Every lesson is open. Follow the <b>Next</b> marker, or tap any lesson to jump to it.
            </span>
          </p>
        )}
        <div className="py-6">
          <LearningPath units={UNITS} progress={p} />
        </div>
        <div className="pb-10">
          <FinalNode />
        </div>
      </div>
    </PageLayout>
  )
}
