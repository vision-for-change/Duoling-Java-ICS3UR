import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Flame, Heart, Zap } from 'lucide-react'
import type { LevelInfo } from '../engine/gamification'

/** Number that animates when it changes. */
export function AnimatedNumber({ value, className = '' }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 90, damping: 18 })
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString())
  useEffect(() => {
    spring.set(value)
  }, [spring, value])
  return <motion.span className={className}>{text}</motion.span>
}

export function StreakDisplay({ days, active, compact = false }: { days: number; active: boolean; compact?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl font-display font-semibold ${compact ? 'px-2 py-1 text-base' : 'px-3 py-1.5 text-lg'} ${
        active ? 'text-brew-600' : 'text-espresso-400'
      }`}
      title={active ? `${days} day streak. You practiced today!` : days ? `${days} day streak. Practice today to keep it!` : 'No streak yet. Finish a lesson to start one.'}
      aria-label={`${days} day streak`}
    >
      <Flame size={compact ? 20 : 24} className={active ? 'fill-brew-400 text-brew-600' : 'text-espresso-300'} strokeWidth={2.4} />
      <span>{days}</span>
      {!compact && <span className="text-sm font-medium text-espresso-500">day{days === 1 ? '' : 's'}</span>}
    </div>
  )
}

export function XPDisplay({ xp, compact = false }: { xp: number; compact?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl font-display font-semibold text-sun-700 ${compact ? 'px-2 py-1 text-base' : 'px-3 py-1.5 text-lg'}`}
      aria-label={`${xp} XP`}
      title="Total XP"
    >
      <Zap size={compact ? 20 : 24} className="fill-sun-400 text-sun-600" strokeWidth={2.4} />
      <AnimatedNumber value={xp} />
      {!compact && <span className="text-sm font-medium text-espresso-500">XP</span>}
    </div>
  )
}

export function HeartsDisplay({ hearts, max }: { hearts: number | null; max: number | null }) {
  if (hearts === null || max === null) {
    return (
      <div className="inline-flex items-center gap-1 font-display font-semibold text-berry-500" title="Hearts are off (unlimited mistakes)" aria-label="Unlimited hearts">
        <Heart size={24} className="fill-berry-400 text-berry-600" strokeWidth={2.4} />
        <span className="text-xl">∞</span>
      </div>
    )
  }
  return (
    <motion.div
      key={hearts}
      initial={{ scale: 1.35 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1 font-display text-lg font-semibold ${hearts === 0 ? 'text-espresso-400' : 'text-berry-500'}`}
      aria-label={`${hearts} of ${max} hearts left`}
      title={`${hearts} of ${max} hearts left`}
    >
      <Heart size={24} className={hearts ? 'fill-berry-400 text-berry-600' : 'text-espresso-300'} strokeWidth={2.4} />
      {hearts}
    </motion.div>
  )
}

export function LevelBadge({ level, size = 44 }: { level: LevelInfo; size?: number }) {
  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center rounded-2xl border-2 border-espresso-900 bg-gradient-to-br from-sun-300 to-brew-400 font-display font-bold text-espresso-900 shadow-[0_3px_0_var(--color-espresso-900)]"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      title={`Level ${level.level}: ${level.title}`}
      aria-label={`Level ${level.level}, ${level.title}`}
    >
      {level.level}
      <span className="absolute -right-2 -bottom-2 text-base" aria-hidden style={{ fontSize: size * 0.36 }}>
        {level.emoji}
      </span>
    </div>
  )
}

export function StatTile({ icon, label, value, tone = 'brew', sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: string; sub?: string }) {
  const tones: Record<string, string> = {
    brew: 'bg-brew-50 text-brew-600',
    sun: 'bg-sun-50 text-sun-700',
    mint: 'bg-mint-50 text-mint-700',
    sky: 'bg-sky-50 text-sky-700',
    grape: 'bg-grape-50 text-grape-700',
    berry: 'bg-berry-50 text-berry-700',
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-espresso-100 bg-white p-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${tones[tone] ?? tones.brew}`}>{icon}</div>
      <div className="min-w-0">
        <div className="font-display text-xl leading-tight font-semibold text-espresso-900">{value}</div>
        <div className="text-xs leading-tight font-bold tracking-wide text-espresso-400 uppercase">{label}</div>
        {sub && <div className="truncate text-xs text-espresso-500">{sub}</div>}
      </div>
    </div>
  )
}
