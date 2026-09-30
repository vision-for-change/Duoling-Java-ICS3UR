import { motion } from 'motion/react'

export type BarColor = 'brew' | 'mint' | 'sun' | 'sky' | 'grape' | 'berry' | 'teal' | 'cocoa'

const FILL: Record<BarColor, string> = {
  brew: 'bg-brew-500',
  mint: 'bg-mint-500',
  sun: 'bg-sun-400',
  sky: 'bg-sky-500',
  grape: 'bg-grape-500',
  berry: 'bg-berry-500',
  teal: 'bg-teal-500',
  cocoa: 'bg-cocoa-500',
}

interface ProgressBarProps {
  value: number
  color?: BarColor
  height?: number
  label?: string
  shine?: boolean
  className?: string
  track?: string
}

/** Rounded, animated progress bar. `value` is 0..1. */
export function ProgressBar({ value, color = 'brew', height = 14, label, shine = true, className = '', track = 'bg-espresso-100' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div
      className={`relative w-full overflow-hidden rounded-full ${track} ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <motion.div
        className={`relative h-full overflow-hidden rounded-full ${FILL[color]}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{ minWidth: pct > 0 ? height : 0 }}
      >
        <span className="absolute inset-x-2 top-[3px] h-[28%] rounded-full bg-white/35" />
        {shine && pct > 0 && <span className="animate-shine absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />}
      </motion.div>
    </div>
  )
}
