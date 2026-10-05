import { useEffect, useState } from 'react'
import { Compass, Flag, Lock, Target } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Button, ButtonLink } from '../components/Button'
import { LearningPath } from '../components/LearningPath'
import { Mascot } from '../components/Mascot'
import { PageLayout } from '../components/Navbar'
import { ProgressBar } from '../components/ProgressBar'
import { CourseOutline, OutlineButton, useCourseNavigation, type NavTarget } from '../components/SkipAhead'
import { UNITS } from '../data/curriculum'
import { getProject, stagesDoneIn } from '../data/projects'
import { isFinalUnlocked, isUnitComplete, isUnitRevealed, nextStep, unitProgress } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import { useDerived } from '../state/hooks'
import { Card, WeekStrip } from './DashboardPage'
import { AppIcon } from '../components/AppIcon'

function FinalNode({ onSkip }: { onSkip: (t: NavTarget) => void }) {
  const { progress: p } = useDerived()
  const unlocked = isFinalUnlocked(p)
  const project = getProject(p.project)
  const doneCount = project ? stagesDoneIn(project, p.final.stagesDone) : 0
  const done = !!project && doneCount === project.stages.length
  const started = doneCount > 0
  const title = project ? project.title : 'Your final project'
  return (
    <div
      id="final"
      className={`mx-auto max-w-md scroll-mt-24 rounded-3xl border-2 p-6 text-center ${unlocked ? 'border-espresso-900 bg-gradient-to-br from-sun-200 via-brew-100 to-mint-100 shadow-[0_5px_0_var(--color-espresso-900)]' : 'border-dashed border-espresso-200 bg-white'}`}
    >
      <AppIcon name={done ? 'trophy' : (project?.icon ?? 'flag')} size={52} strokeWidth={2} className="mx-auto text-brew-600" />
      <div className="mt-2 text-xs font-extrabold tracking-widest text-brew-600 uppercase">Final project</div>
      <h2 className="text-2xl font-bold">{title}</h2>
      {project && (
        <p className="mt-1 text-espresso-600">
          {project.pitch} You will build it in {project.stages.length} guided stages, with a video walkthrough to help.
        </p>
      )}
      {unlocked ? (
        <ButtonLink to="/final" size="lg" className="mt-4" variant={done ? 'secondary' : 'primary'}>
          {done ? 'Open your program again' : started ? 'Keep building' : 'Start building'}
        </ButtonLink>
      ) : (
        <>
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-espresso-50 px-3 py-2 text-sm font-bold text-espresso-500">
            <Lock size={16} /> Unlocks when you finish the last lesson of Unit 8
          </p>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => onSkip({ id: 'final', title: `Final project: ${title}`, to: '/final', status: 'locked' })}>
              Skip to the final project
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export function LearnPage() {
  const { progress: p, streak, today, todayXp } = useDerived()
  const location = useLocation()
  const next = nextStep(p)
  const nav = useCourseNavigation()
  const [outlineOpen, setOutlineOpen] = useState(false)

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
          <Card title={streak ? `${streak} day streak` : 'Start a streak'} icon={<AppIcon name="flame" size={22} className="fill-brew-300 text-brew-600" />}>
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
              {UNITS.filter((u) => isUnitRevealed(p, u)).map((u) => {
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
              Based on your placement test, earlier units are <b>placed out</b>. Those lessons stay open, so you can review them whenever you like.
            </p>
          </div>
        ) : (
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm font-semibold text-espresso-500">
            <Compass size={18} className="shrink-0 text-brew-500" />
            <span>Finish a lesson to unlock the next one. Want to jump ahead? You can, and I will check first.</span>
          </p>
        )}
        <div className="mt-3 flex justify-center">
          <OutlineButton onClick={() => setOutlineOpen(true)} />
        </div>
        <div className="py-6">
          <LearningPath units={UNITS} progress={p} onSkip={nav.open} />
        </div>
        <div className="pb-10">
          <FinalNode onSkip={nav.open} />
        </div>
      </div>
      <CourseOutline open={outlineOpen} onClose={() => setOutlineOpen(false)} progress={p} onPick={nav.open} />
      {nav.dialog}
    </PageLayout>
  )
}
