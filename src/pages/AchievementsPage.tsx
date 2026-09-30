import { Trophy } from 'lucide-react'
import { AchievementBadge } from '../components/AchievementBadge'
import { PageTitle } from '../components/Navbar'
import { ProgressBar } from '../components/ProgressBar'
import { LevelBadge } from '../components/Stats'
import { ACHIEVEMENTS } from '../engine/achievements'
import { LEVELS } from '../engine/gamification'
import { useDerived } from '../state/hooks'

export function AchievementsPage() {
  const { progress: p, level } = useDerived()
  const unlocked = ACHIEVEMENTS.filter((a) => p.achievements[a.id]).length
  return (
    <div>
      <PageTitle title="Achievements" subtitle={`${unlocked} of ${ACHIEVEMENTS.length} badges unlocked`} icon={<Trophy size={36} className="text-sun-600" />} />
      <ProgressBar value={unlocked / ACHIEVEMENTS.length} color="sun" height={16} label="Achievements unlocked" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const at = p.achievements[a.id]
          const prog = !at && a.progress ? a.progress(p) : null
          return (
            <div
              key={a.id}
              className={`flex items-center gap-4 rounded-3xl border-2 p-4 ${at ? 'border-espresso-100 bg-white shadow-[0_4px_0_var(--color-espresso-100)]' : 'border-dashed border-espresso-200 bg-cream-100/50'}`}
            >
              <AchievementBadge def={a} unlocked={!!at} size={72} />
              <div className="min-w-0 flex-1">
                <div className={`font-display text-lg leading-tight font-semibold ${at ? '' : 'text-espresso-500'}`}>{a.title}</div>
                <div className="text-sm text-espresso-500">{a.description}</div>
                {at ? (
                  <div className="mt-1 text-xs font-bold text-mint-600">Unlocked {new Date(at).toLocaleDateString()}</div>
                ) : prog ? (
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={Math.min(1, prog.value / prog.goal)} color="brew" height={8} shine={false} label={`${a.title} progress`} />
                    <span className="shrink-0 text-xs font-bold text-espresso-400">
                      {Math.min(prog.value, prog.goal).toLocaleString()}/{prog.goal.toLocaleString()}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-bold">Levels</h2>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((l) => {
          const reached = p.xp >= l.minXp
          const current = level.current.level === l.level
          return (
            <li
              key={l.level}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${current ? 'border-sun-500 bg-sun-50' : reached ? 'border-espresso-100 bg-white' : 'border-dashed border-espresso-200 opacity-70'}`}
            >
              <LevelBadge level={l} size={46} />
              <div>
                <div className="font-display text-lg font-semibold">
                  Level {l.level}: {l.title}
                </div>
                <div className="text-sm text-espresso-500">{l.minXp.toLocaleString()} XP{current ? ' · you are here' : ''}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
