import { Activity, BookOpen, Flame, Target, Trophy, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { AchievementBadge } from '../components/AchievementBadge'
import { ButtonLink } from '../components/Button'
import { LessonCard } from '../components/LessonCard'
import { MascotSays } from '../components/Mascot'
import { PageLayout } from '../components/Navbar'
import { ProgressBar } from '../components/ProgressBar'
import { LevelBadge, StatTile } from '../components/Stats'
import { getTopic, getUnit, TOPICS, TOTAL_LESSONS, UNITS } from '../data/curriculum'
import { finalStages } from '../data/final'
import { ACHIEVEMENTS } from '../engine/achievements'
import { lastDays, relativeTime } from '../engine/dates'
import { completedLessonCount, isFinalUnlocked, isPlacedOut, isUnitComplete, isUnitRevealed, lessonStatus, nextStep, unitProgress, upcomingLessons } from '../engine/progression'
import { mastery, MIN_ATTEMPTS, overallAccuracy, strongTopics, weakTopics } from '../engine/stats'
import { UNIT_STYLES } from '../lib/unitStyles'
import { useDerived } from '../state/hooks'
import { AppIcon } from '../components/AppIcon'
import type { IconName } from '../data/types'
import type { ActivityEvent } from '../state/types'

const ACTIVITY_ICON: Record<ActivityEvent['kind'], IconName> = {
  lesson: 'book',
  checkpoint: 'trophy',
  practice: 'dumbbell',
  achievement: 'medal',
  level: 'star',
  placement: 'compass',
  final: 'flag',
  streak: 'flame',
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Card({ title, icon, children, action }: { title: string; icon?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function WeekStrip({ days, today }: { days: Record<string, { xp: number }>; today: string }) {
  const week = lastDays(today, 7)
  return (
    <div className="flex justify-between gap-1">
      {week.map((d) => {
        const active = (days[d]?.xp ?? 0) > 0
        const label = new Date(d + 'T00:00').toLocaleDateString(undefined, { weekday: 'narrow' })
        return (
          <div key={d} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                active ? 'border-brew-600 bg-brew-400 text-white' : d === today ? 'border-dashed border-brew-300 bg-white text-brew-300' : 'border-espresso-100 bg-espresso-50 text-espresso-200'
              }`}
              title={`${d}: ${days[d]?.xp ?? 0} XP`}
            >
              <Flame size={16} className={active ? 'fill-sun-300' : ''} />
            </div>
            <span className={`text-xs font-bold ${d === today ? 'text-brew-600' : 'text-espresso-400'}`}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function DashboardPage() {
  const { progress: p, streak, activeToday, level, todayXp, topics, today } = useDerived()
  const next = nextStep(p)
  const weak = weakTopics(topics)
  const strong = strongTopics(topics)
  const lessonsDone = completedLessonCount(p)
  const goal = p.settings.dailyGoal
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => p.achievements[a.id]).sort((a, b) => p.achievements[b.id] - p.achievements[a.id])
  const name = p.profile.name || 'coder'

  const byteLine = !activeToday
    ? streak > 0
      ? `Your ${streak}-day streak is waiting for you. One lesson keeps it going.`
      : 'Ready to write some Java? One short lesson gets your streak started.'
    : todayXp >= goal
      ? 'You hit your daily goal. Anything extra is bonus XP.'
      : `${goal - todayXp} XP to go for today's goal. You can do it.`

  const nextUnit = next && next.unitId ? getUnit(next.unitId) : undefined
  // the next few lessons on the path that aren't finished yet
  const upNext = upcomingLessons(p, 3)
  const nextStyle = nextUnit ? UNIT_STYLES[nextUnit.color] : UNIT_STYLES.brew

  return (
    <PageLayout
      aside={
        <>
          <Card title="Daily goal" icon={<Target className="text-mint-600" size={22} />}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold">{todayXp}</span>
              <span className="font-bold text-espresso-400">/ {goal} XP</span>
            </div>
            <ProgressBar value={todayXp / goal} color="mint" className="mt-2" label="Daily goal progress" />
            <div className="mt-5">
              <WeekStrip days={p.days} today={today} />
            </div>
          </Card>
          <Card
            title="Achievements"
            icon={<Trophy className="text-sun-600" size={22} />}
            action={
              <Link to="/achievements" className="text-sm font-bold text-brew-600 hover:underline">
                View all
              </Link>
            }
          >
            {unlockedAchievements.length === 0 ? (
              <p className="text-sm text-espresso-500">Finish your first lesson and you will earn your first badge.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {unlockedAchievements.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex flex-col items-center text-center" title={a.description}>
                    <AchievementBadge def={a} unlocked size={56} />
                    <span className="mt-1 text-xs leading-tight font-bold text-espresso-600">{a.title}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs font-bold text-espresso-400">
              {unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
            </p>
          </Card>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {greeting()}, {name}!
          </h1>
          <MascotSays mood={activeToday ? 'happy' : 'encouraging'} size={72} className="mt-3">
            {byteLine}
          </MascotSays>
        </div>

        {/* level + stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="col-span-2 flex items-center gap-3 rounded-2xl border-2 border-espresso-100 bg-white p-3 md:col-span-3">
            <LevelBadge level={level.current} size={52} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-display text-lg font-semibold">
                  Level {level.current.level} · {level.current.title}
                </span>
                <span className="shrink-0 text-xs font-bold text-espresso-400">{level.next ? `${level.next.minXp - p.xp} XP to Level ${level.next.level}` : 'Max level!'}</span>
              </div>
              <ProgressBar value={level.fraction} color="sun" height={12} className="mt-1.5" label="Level progress" />
            </div>
          </div>
          <StatTile icon={<Flame className="fill-brew-300 text-brew-600" />} tone="brew" label="Day streak" value={streak} sub={`Best: ${p.streak.longest}`} />
          <StatTile icon={<Zap className="fill-sun-300 text-sun-600" />} tone="sun" label="Total XP" value={p.xp.toLocaleString()} />
          <StatTile icon={<BookOpen />} tone="sky" label="Lessons done" value={`${lessonsDone}/${TOTAL_LESSONS}`} />
          <StatTile icon={<Target />} tone="mint" label="Accuracy" value={p.stats.answered ? `${Math.round(overallAccuracy(p) * 100)}%` : 'N/A'} sub={`${p.stats.answered} answers`} />
          <StatTile icon={<Trophy />} tone="grape" label="Badges" value={`${unlockedAchievements.length}/${ACHIEVEMENTS.length}`} />
          <StatTile icon={<Activity />} tone="berry" label="Programs run" value={p.stats.programsRun} />
        </div>

        {/* continue */}
        <div className={`relative overflow-hidden rounded-3xl border-2 ${nextStyle.border} bg-gradient-to-br ${nextStyle.gradient} p-6 text-white shadow-[0_5px_0_var(--shade)]`} style={{ ['--shade' as string]: nextStyle.shade }}>
          <div className="pointer-events-none absolute -right-4 -bottom-10 opacity-15" aria-hidden>
            <AppIcon name={nextUnit?.icon ?? 'flag'} size={150} strokeWidth={1.5} />
          </div>
          <div className="relative">
            <div className="text-xs font-extrabold tracking-widest text-white/80 uppercase">
              {next?.kind === 'final' ? 'All units complete!' : nextUnit ? `Unit ${nextUnit.number} · ${nextUnit.title}` : 'You finished everything!'}
            </div>
            <h2 className="mt-1 text-3xl font-bold">{next ? next.title : 'Keep your skills sharp'}</h2>
            {nextUnit && (
              <div className="mt-3 flex max-w-md items-center gap-3">
                <ProgressBar value={unitProgress(p, nextUnit).fraction} color="sun" height={12} track="bg-white/25" label="Unit progress" />
                <span className="font-display text-sm font-semibold">
                  {unitProgress(p, nextUnit).done}/{unitProgress(p, nextUnit).total}
                </span>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {next ? (
                <ButtonLink to={next.kind === 'lesson' ? `/lesson/${next.id}` : next.kind === 'checkpoint' ? `/checkpoint/${next.unitId}` : '/final'} variant="secondary" size="lg">
                  {next.kind === 'lesson' ? 'Continue learning' : next.kind === 'checkpoint' ? 'Start checkpoint' : 'Start the Final Challenge'}
                </ButtonLink>
              ) : (
                <ButtonLink to="/practice" variant="secondary" size="lg">
                  Practice
                </ButtonLink>
              )}
              <ButtonLink to="/learn" variant="ghost" size="lg" className="text-white hover:bg-white/15">
                View path
              </ButtonLink>
            </div>
          </div>
        </div>

        {upNext.length > 0 && (
          <Card
            title="Up next"
            icon={<BookOpen className="text-brew-500" size={22} />}
            action={
              <Link to="/learn" className="text-sm font-bold text-brew-600 hover:underline">
                See the path
              </Link>
            }
          >
            <div className="space-y-3">
              {upNext.map((l) => (
                <LessonCard key={l.id} lesson={l} status={lessonStatus(p, l)} record={p.lessons[l.id]} />
              ))}
            </div>
          </Card>
        )}

        {/* recommended practice */}
        <Card
          title="Recommended practice"
          icon={<Target className="text-brew-500" size={22} />}
          action={
            <ButtonLink to="/practice/session?mode=smart" size="sm">
              Practice now
            </ButtonLink>
          }
        >
          {weak.length === 0 ? (
            <p className="text-espresso-600">
              {p.stats.answered < 6 ? 'Answer a few more questions and we will find what needs practice.' : 'Nothing is giving you trouble right now. A quick mixed review keeps it that way.'}
            </p>
          ) : (
            <>
              <p className="mb-3 font-semibold text-espresso-700">Practice your weak areas:</p>
              <ul className="space-y-2.5">
                {weak.slice(0, 4).map((w) => (
                  <li key={w.topic}>
                    <Link to={`/practice/session?mode=topic&topic=${w.topic}`} className="flex items-center gap-3 rounded-xl p-1 hover:bg-cream-100">
                      <AppIcon name={getTopic(w.topic).icon} size={22} className="w-6 shrink-0 text-brew-500" />
                      <span className="w-32 shrink-0 font-bold">{getTopic(w.topic).short}</span>
                      <ProgressBar value={w.accuracy} color={w.accuracy < 0.6 ? 'berry' : 'sun'} height={10} shine={false} label={`${getTopic(w.topic).short} accuracy`} />
                      <span className="w-12 shrink-0 text-right font-display font-semibold">{Math.round(w.accuracy * 100)}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Unit progress" icon={<BookOpen className="text-sky-600" size={22} />}>
            <ul className="space-y-3">
              {UNITS.filter((u) => isUnitRevealed(p, u)).map((u) => {
                const pr = unitProgress(p, u)
                const s = UNIT_STYLES[u.color]
                return (
                  <li key={u.id}>
                    <Link to={`/learn#${u.id}`} className="block rounded-xl p-1 hover:bg-cream-100">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="flex items-center gap-2">
                          <AppIcon name={u.icon} size={18} className={s.text} />
                          <span className={s.text}>{u.number}.</span> {u.title}
                        </span>
                        <span className="text-espresso-400">{isUnitComplete(p, u) ? '✓ done' : isPlacedOut(p, u) ? 'placed out' : `${pr.done}/${pr.total}`}</span>
                      </div>
                      <ProgressBar value={pr.fraction} color={u.color} height={9} shine={false} className="mt-1" label={`${u.title} progress`} />
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link to={isFinalUnlocked(p) ? '/final' : '/learn#final'} className="flex items-center justify-between rounded-xl bg-espresso-50 px-2 py-2 text-sm font-bold text-espresso-600 hover:bg-cream-100">
                  <span className="flex items-center gap-2">
                    <AppIcon name="flag" size={18} /> Final Challenge
                  </span>
                  <span className="text-espresso-400">
                    {p.final.completedAt ? '✓ done' : p.final.stagesDone.length ? `${p.final.stagesDone.length}/${finalStages.length} stages` : isFinalUnlocked(p) ? 'ready!' : 'locked'}
                  </span>
                </Link>
              </li>
            </ul>
          </Card>

          <Card title="Topic mastery" icon={<Target className="text-grape-600" size={22} />}>
            <ul className="space-y-2">
              {TOPICS.map((t) => {
                const s = topics[t.id]
                const m = mastery(s)
                return (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <AppIcon name={t.icon} size={18} className="w-6 shrink-0 text-brew-500" />
                    <span className="w-28 shrink-0 truncate font-bold text-espresso-700">{t.short}</span>
                    <ProgressBar value={m} color={m >= 0.85 ? 'mint' : m >= 0.6 ? 'sun' : 'brew'} height={9} shine={false} label={`${t.short} mastery`} />
                    <span className="w-10 shrink-0 text-right text-xs font-bold text-espresso-400">{s.attempts ? `${Math.round(s.accuracy * 100)}%` : '-'}</span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Strongest topics" icon={<TrendingUp className="text-mint-600" size={22} />}>
            {strong.length === 0 ? (
              <p className="text-sm text-espresso-500">Answer at least {MIN_ATTEMPTS} questions on a topic with 85%+ accuracy to see it here.</p>
            ) : (
              <ul className="space-y-2">
                {strong.slice(0, 4).map((s) => (
                  <li key={s.topic} className="flex items-center justify-between rounded-xl bg-mint-50 px-3 py-2 font-bold text-mint-800">
                    <span className="flex items-center gap-2">
                      <AppIcon name={getTopic(s.topic).icon} size={18} /> {getTopic(s.topic).short}
                    </span>
                    <span>{Math.round(s.accuracy * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Weakest topics" icon={<TrendingDown className="text-berry-500" size={22} />}>
            {weak.length === 0 ? (
              <p className="text-sm text-espresso-500">Nothing is below 80% yet. Keep it up.</p>
            ) : (
              <ul className="space-y-2">
                {weak.slice(0, 4).map((s) => (
                  <li key={s.topic}>
                    <Link to={`/practice/session?mode=topic&topic=${s.topic}`} className="flex items-center justify-between rounded-xl bg-berry-50 px-3 py-2 font-bold text-berry-800 hover:bg-berry-100">
                      <span className="flex items-center gap-2">
                        <AppIcon name={getTopic(s.topic).icon} size={18} /> {getTopic(s.topic).short}
                      </span>
                      <span>{Math.round(s.accuracy * 100)}% · practice →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Recent activity" icon={<Activity className="text-brew-500" size={22} />}>
          {p.activity.length === 0 ? (
            <p className="text-espresso-500">Your lessons, badges and level-ups will show up here.</p>
          ) : (
            <ul className="divide-y-2 divide-espresso-50">
              {p.activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-brew-600">
                    <AppIcon name={ACTIVITY_ICON[a.kind]} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-espresso-800">{a.title}</div>
                    {a.detail && <div className="truncate text-sm text-espresso-500">{a.detail}</div>}
                  </div>
                  <div className="shrink-0 text-right">
                    {a.xp ? <div className="font-display text-sm font-semibold text-sun-700">+{a.xp} XP</div> : null}
                    <div className="text-xs text-espresso-400">{relativeTime(a.at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageLayout>
  )
}
