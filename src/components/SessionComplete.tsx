import { useEffect } from 'react'
import { motion } from 'motion/react'
import { Flame, Target, Trophy, Zap } from 'lucide-react'
import { getAchievement } from '../engine/achievements'
import { summarize, type SessionState } from '../engine/session'
import { celebrate } from '../lib/motion'
import { sfx } from '../lib/sound'
import { AchievementBadge } from './AchievementBadge'
import { Button, ButtonLink } from './Button'
import { Mascot } from './Mascot'
import type { FinishInfo } from './SessionPlayer'
import { AnimatedNumber } from './Stats'

function Tile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-1 flex-col items-center overflow-hidden rounded-2xl border-2 ${color}`}
    >
      <div className="w-full py-1 text-center text-xs font-extrabold tracking-wider text-white uppercase">{label}</div>
      <div className="flex w-full flex-1 items-center justify-center gap-1.5 bg-white py-3 font-display text-2xl font-bold">
        {icon}
        {value}
      </div>
    </motion.div>
  )
}

export function SessionComplete({ info, summaryState }: { info: FinishInfo; summaryState: SessionState }) {
  const sum = summarize(summaryState)
  const reward = info.reward
  const passed = info.passed ?? true
  const placement = summaryState.mode === 'placement'

  useEffect(() => {
    if (passed) celebrate(reward?.levelUp ? 'big' : 'small')
    if (reward?.levelUp) setTimeout(() => sfx.levelUp(), 500)
    else if (reward?.achievements.length) setTimeout(() => sfx.achievement(), 500)
  }, [passed, reward])

  return (
    <div className="flex min-h-dvh flex-col items-center bg-cream-50 px-4 py-10">
      <div className="w-full max-w-xl text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
          <Mascot mood={info.mood ?? (passed ? 'celebrating' : 'encouraging')} size={170} float />
        </motion.div>
        <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="mt-3 text-3xl font-bold text-espresso-900 sm:text-4xl">
          {info.headline}
        </motion.h1>
        {info.subline && <p className="mt-2 text-lg text-espresso-600">{info.subline}</p>}

        <div className="mt-6 flex gap-3">
          <Tile
            label="XP earned"
            color="border-sun-500 bg-sun-500"
            icon={<Zap size={22} className="fill-sun-400 text-sun-600" />}
            value={<AnimatedNumber value={reward?.xp ?? 0} />}
          />
          {placement ? (
            // a diagnostic isn't about accuracy: show what was found instead
            <Tile label="Correct" color="border-sky-500 bg-sky-500" icon={<Target size={22} className="text-sky-500" />} value={`${sum.firstTry}/${sum.total}`} />
          ) : (
            <Tile
              label="Accuracy"
              color={sum.accuracy >= 0.8 ? 'border-mint-500 bg-mint-500' : 'border-sky-500 bg-sky-500'}
              icon={<Target size={22} className={sum.accuracy >= 0.8 ? 'text-mint-500' : 'text-sky-500'} />}
              value={`${Math.round(sum.accuracy * 100)}%`}
            />
          )}
          {!placement && (
            <Tile label="Best combo" color="border-brew-500 bg-brew-500" icon={<Flame size={22} className="fill-brew-300 text-brew-500" />} value={sum.bestCombo} />
          )}
        </div>

        {reward && reward.breakdown.length > 0 && (
          <ul className="mx-auto mt-5 max-w-sm space-y-1 text-left text-espresso-700">
            {reward.breakdown
              .filter((b) => b.xp > 0)
              .map((b) => (
                <li key={b.label} className="flex justify-between rounded-xl bg-white px-3 py-1.5 font-semibold">
                  <span>{b.label}</span>
                  <span className="font-display text-sun-700">+{b.xp} XP</span>
                </li>
              ))}
          </ul>
        )}

        <div className="mt-5 space-y-2">
          {reward?.streakExtended && reward.streak > 0 && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-2xl border-2 border-brew-300 bg-brew-50 px-4 py-3 font-display text-lg font-semibold text-brew-700">
              🔥 {reward.streak} day streak{reward.streak > 1 ? '! You\'re on fire!' : ' started! Come back tomorrow.'}
            </motion.div>
          )}
          {reward?.dailyGoalReached && (
            <div className="rounded-2xl border-2 border-mint-300 bg-mint-50 px-4 py-3 font-display text-lg font-semibold text-mint-700">🎯 Daily goal reached!</div>
          )}
          {reward?.levelUp && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45, type: 'spring' }} className="rounded-2xl border-2 border-espresso-900 bg-gradient-to-r from-sun-300 to-brew-300 px-4 py-3 shadow-[0_4px_0_var(--color-espresso-900)]">
              <div className="text-xs font-extrabold tracking-widest text-espresso-800 uppercase">Java level up!</div>
              <div className="font-display text-2xl font-bold">
                Level {reward.levelUp.level} {reward.levelUp.emoji} {reward.levelUp.title}
              </div>
            </motion.div>
          )}
          {reward && reward.achievements.length > 0 && (
            <div className="rounded-2xl border-2 border-espresso-100 bg-white p-4">
              <div className="mb-3 flex items-center justify-center gap-2 text-sm font-extrabold tracking-wider text-brew-600 uppercase">
                <Trophy size={16} /> New achievement{reward.achievements.length > 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {reward.achievements.map((id) => {
                  const def = getAchievement(id)
                  if (!def) return null
                  return (
                    <motion.div key={id} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.5 }} className="flex w-28 flex-col items-center text-center">
                      <AchievementBadge def={def} unlocked size={64} />
                      <div className="mt-1 text-sm leading-tight font-bold">{def.title}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
          {info.extra}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <ButtonLink to={info.primary.to} size="lg" full>
            {info.primary.label}
          </ButtonLink>
          {info.secondary &&
            (info.secondary.to ? (
              <ButtonLink to={info.secondary.to} variant="secondary" size="lg" full>
                {info.secondary.label}
              </ButtonLink>
            ) : (
              <Button variant="secondary" size="lg" full onClick={info.secondary.onClick}>
                {info.secondary.label}
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}
