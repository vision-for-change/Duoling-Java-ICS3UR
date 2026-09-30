import { Lock } from 'lucide-react'
import type { AchievementDef } from '../engine/achievements'

const RING: Record<AchievementDef['color'], string> = {
  brew: 'from-brew-300 to-brew-500',
  sky: 'from-sky-300 to-sky-500',
  grape: 'from-grape-300 to-grape-500',
  mint: 'from-mint-300 to-mint-500',
  berry: 'from-berry-300 to-berry-500',
  sun: 'from-sun-200 to-sun-400',
  teal: 'from-teal-300 to-teal-500',
  cocoa: 'from-cocoa-200 to-cocoa-400',
}

/** Hexagonal badge. Locked badges are greyed out with a lock. */
export function AchievementBadge({ def, unlocked, size = 72 }: { def: AchievementDef; unlocked: boolean; size?: number }) {
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0">
        <defs>
          <clipPath id={`hex-${def.id}`}>
            <path d="M50 3 L91 26 L91 74 L50 97 L9 74 L9 26 Z" />
          </clipPath>
        </defs>
        <path
          d="M50 3 L91 26 L91 74 L50 97 L9 74 L9 26 Z"
          fill={unlocked ? '#241812' : '#c4ad9b'}
          transform="translate(0 4)"
        />
        <path d="M50 3 L91 26 L91 74 L50 97 L9 74 L9 26 Z" fill={unlocked ? '#fff' : '#efe5dc'} stroke={unlocked ? '#241812' : '#c4ad9b'} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div
        className={`absolute inset-[14%] flex items-center justify-center rounded-full bg-gradient-to-br ${
          unlocked ? RING[def.color] : 'from-espresso-100 to-espresso-200'
        }`}
      >
        <span className={`leading-none ${unlocked ? '' : 'opacity-40 grayscale'}`} style={{ fontSize: size * 0.36 }}>
          {def.icon}
        </span>
      </div>
      {!unlocked && (
        <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-espresso-300 bg-white text-espresso-400">
          <Lock size={14} strokeWidth={2.6} />
        </span>
      )}
    </div>
  )
}
