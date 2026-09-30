import { useId, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { MascotMood } from '../data/types'

const INK = '#241812'
const SHELL = '#fff5e8'
const SCREEN = '#2a1d17'
const GLOW = '#6cdbae'
const ORANGE = '#f76f22'
const ORANGE_LIGHT = '#ff8a45'
const CHEEK = '#fa5d80'

interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
  /** gentle floating idle animation */
  float?: boolean
  title?: string
}

type Arms = 'down' | 'up' | 'think' | 'thumb' | 'out'

const ARMS: Record<MascotMood, Arms> = {
  happy: 'down',
  excited: 'up',
  thinking: 'think',
  confused: 'down',
  celebrating: 'up',
  encouraging: 'thumb',
  surprised: 'out',
}

function Arm({ d, hand }: { d: string; hand: [number, number] }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={13} strokeLinecap="round" fill="none" />
      <path d={d} stroke={ORANGE_LIGHT} strokeWidth={6} strokeLinecap="round" fill="none" />
      <circle cx={hand[0]} cy={hand[1]} r={8.5} fill={SHELL} stroke={INK} strokeWidth={4} />
    </g>
  )
}

function ArmsFor({ arms }: { arms: Arms }) {
  switch (arms) {
    case 'up':
      return (
        <>
          <Arm d="M68 146 Q52 136 44 116" hand={[43, 113]} />
          <Arm d="M132 146 Q148 136 156 116" hand={[157, 113]} />
        </>
      )
    case 'think':
      return (
        <>
          <Arm d="M68 148 Q54 160 50 172" hand={[50, 174]} />
          <Arm d="M132 146 Q152 142 146 124" hand={[145, 121]} />
        </>
      )
    case 'thumb':
      return (
        <>
          <Arm d="M68 148 Q54 160 50 172" hand={[50, 174]} />
          <Arm d="M132 146 Q150 138 158 120" hand={[159, 117]} />
          <rect x={155} y={100} width={8} height={14} rx={4} fill={SHELL} stroke={INK} strokeWidth={3.5} />
        </>
      )
    case 'out':
      return (
        <>
          <Arm d="M68 148 Q52 146 40 138" hand={[38, 137]} />
          <Arm d="M132 148 Q148 146 160 138" hand={[162, 137]} />
        </>
      )
    default:
      return (
        <>
          <Arm d="M68 148 Q54 160 50 172" hand={[50, 174]} />
          <Arm d="M132 148 Q146 160 150 172" hand={[150, 174]} />
        </>
      )
  }
}

function Face({ mood, glowId }: { mood: MascotMood; glowId: string }) {
  const eye = { fill: GLOW, filter: `url(#${glowId})` }
  const line = { stroke: GLOW, strokeWidth: 5.5, strokeLinecap: 'round' as const, fill: 'none', filter: `url(#${glowId})` }
  switch (mood) {
    case 'happy':
      return (
        <g>
          <path d="M71 84 Q80 72 89 84" {...line} />
          <path d="M111 84 Q120 72 129 84" {...line} />
          <path d="M89 97 Q100 106 111 97" {...line} />
        </g>
      )
    case 'excited':
      return (
        <g>
          <ellipse cx={80} cy={79} rx={9} ry={11} {...eye} />
          <ellipse cx={120} cy={79} rx={9} ry={11} {...eye} />
          <circle cx={83} cy={75} r={3} fill="#fff" />
          <circle cx={123} cy={75} r={3} fill="#fff" />
          <path d="M87 95 Q100 112 113 95 Z" fill={GLOW} filter={`url(#${glowId})`} />
        </g>
      )
    case 'thinking':
      return (
        <g>
          <ellipse cx={84} cy={76} rx={6.5} ry={8.5} {...eye} />
          <ellipse cx={124} cy={76} rx={6.5} ry={8.5} {...eye} />
          <path d="M92 100 L110 97" {...line} />
        </g>
      )
    case 'confused':
      return (
        <g>
          <ellipse cx={80} cy={80} rx={8} ry={10} {...eye} />
          <path d="M112 81 L128 79" {...line} />
          <path d="M86 101 Q93 95 100 101 Q107 107 114 101" {...line} />
        </g>
      )
    case 'celebrating':
      return (
        <g>
          <path d="M70 83 Q80 70 90 83" {...line} />
          <path d="M110 83 Q120 70 130 83" {...line} />
          <path d="M86 93 Q100 114 114 93 Z" fill={GLOW} filter={`url(#${glowId})`} />
        </g>
      )
    case 'encouraging':
      return (
        <g>
          <ellipse cx={80} cy={80} rx={7.5} ry={9} {...eye} />
          <ellipse cx={120} cy={80} rx={7.5} ry={9} {...eye} />
          <circle cx={82.5} cy={77} r={2.5} fill="#fff" />
          <circle cx={122.5} cy={77} r={2.5} fill="#fff" />
          <path d="M90 98 Q100 105 110 98" {...line} />
        </g>
      )
    case 'surprised':
      return (
        <g>
          <circle cx={80} cy={79} r={9.5} fill="none" stroke={GLOW} strokeWidth={5} filter={`url(#${glowId})`} />
          <circle cx={120} cy={79} r={9.5} fill="none" stroke={GLOW} strokeWidth={5} filter={`url(#${glowId})`} />
          <circle cx={100} cy={100} r={5.5} fill="none" stroke={GLOW} strokeWidth={4.5} filter={`url(#${glowId})`} />
        </g>
      )
  }
}

function Extras({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'thinking':
      return (
        <g fill={SHELL} stroke={INK} strokeWidth={3}>
          <circle cx={164} cy={44} r={5} />
          <circle cx={176} cy={30} r={7} />
          <circle cx={186} cy={12} r={9} />
        </g>
      )
    case 'confused':
      return (
        <text x={160} y={52} fontSize={34} fontFamily="Fredoka Variable, Fredoka, sans-serif" fontWeight={700} fill={ORANGE} stroke={INK} strokeWidth={2}>
          ?
        </text>
      )
    case 'surprised':
      return (
        <text x={162} y={50} fontSize={34} fontFamily="Fredoka Variable, Fredoka, sans-serif" fontWeight={700} fill="#ffc21f" stroke={INK} strokeWidth={2}>
          !
        </text>
      )
    case 'celebrating':
      return (
        <g>
          <rect x={22} y={60} width={9} height={9} rx={2} fill="#ffc21f" transform="rotate(20 26 64)" />
          <rect x={170} y={70} width={9} height={9} rx={2} fill="#45a5f8" transform="rotate(-25 174 74)" />
          <circle cx={34} cy={96} r={4.5} fill="#fa5d80" />
          <circle cx={168} cy={100} r={4.5} fill="#37c68e" />
          <path d="M150 40 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z" fill="#ffc21f" stroke={INK} strokeWidth={2} />
          <path d="M40 32 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" fill="#9b74f7" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'excited':
      return (
        <g stroke={INK} strokeWidth={2}>
          <path d="M156 42 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z" fill="#ffc21f" />
          <path d="M36 46 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" fill="#45a5f8" />
        </g>
      )
    default:
      return null
  }
}

/** Byte: ByteBrew's robot barista mascot. */
export function Mascot({ mood = 'happy', size = 120, className = '', float = false, title }: MascotProps) {
  const uid = useId().replace(/:/g, '')
  const glowId = `glow-${uid}`
  const screenId = `screen-${uid}`
  const tilt = mood === 'confused' ? -7 : mood === 'thinking' ? 4 : 0
  const bulb = mood === 'thinking' || mood === 'surprised' ? '#ffc21f' : ORANGE_LIGHT
  const steaming = mood === 'excited' || mood === 'celebrating' || mood === 'happy'

  return (
    <div
      className={`relative inline-block shrink-0 ${float ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size * 1.1 }}
      role="img"
      aria-label={title ?? `Byte the robot looks ${mood}`}
    >
      <svg viewBox="0 0 200 220" width="100%" height="100%" overflow="visible">
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={screenId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b2a21" />
            <stop offset="1" stopColor={SCREEN} />
          </linearGradient>
        </defs>

        {/* floor shadow */}
        <ellipse cx={100} cy={208} rx={46} ry={7} fill={INK} opacity={0.12} />

        <Extras mood={mood} />

        {/* body */}
        <ArmsFor arms={ARMS[mood]} />
        <rect x={62} y={126} width={76} height={62} rx={24} fill={ORANGE} stroke={INK} strokeWidth={5} />
        <path d="M70 134 Q100 128 130 134" stroke="#ffa56b" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />
        <rect x={82} y={144} width={36} height={26} rx={9} fill={SHELL} stroke={INK} strokeWidth={4} />
        <text x={100} y={163.5} textAnchor="middle" fontSize={17} fontWeight={800} fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace" fill={INK}>
          {'{}'}
        </text>
        <rect x={74} y={185} width={18} height={12} rx={6} fill={INK} />
        <rect x={108} y={185} width={18} height={12} rx={6} fill={INK} />

        {/* head */}
        <g transform={`rotate(${tilt} 100 90)`}>
          {steaming && (
            <g stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.35}>
              <path className="origin-bottom animate-steam" d="M88 10 q-6 -8 0 -16" />
              <path className="origin-bottom animate-steam [animation-delay:0.8s]" d="M112 10 q6 -8 0 -16" />
            </g>
          )}
          <line x1={100} y1={38} x2={100} y2={20} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <circle cx={100} cy={16} r={8} fill={bulb} stroke={INK} strokeWidth={4} />
          <circle cx={97.5} cy={13.5} r={2.3} fill="#fff" opacity={0.85} />
          <rect x={27} y={68} width={16} height={30} rx={7} fill={ORANGE} stroke={INK} strokeWidth={4.5} />
          <rect x={157} y={68} width={16} height={30} rx={7} fill={ORANGE} stroke={INK} strokeWidth={4.5} />
          <rect x={38} y={34} width={124} height={94} rx={32} fill={SHELL} stroke={INK} strokeWidth={5} />
          <rect x={52} y={48} width={96} height={66} rx={22} fill={`url(#${screenId})`} stroke={INK} strokeWidth={3} />
          <path d="M60 58 Q66 52 76 52" stroke="#fff" strokeOpacity={0.14} strokeWidth={4} strokeLinecap="round" fill="none" />
          <ellipse cx={66} cy={102} rx={7} ry={4} fill={CHEEK} opacity={0.45} />
          <ellipse cx={134} cy={102} rx={7} ry={4} fill={CHEEK} opacity={0.45} />
          <g className="origin-center" style={{ transformBox: 'fill-box' }}>
            <Face mood={mood} glowId={glowId} />
          </g>
        </g>
      </svg>
    </div>
  )
}

interface SpeechProps {
  mood?: MascotMood
  size?: number
  children: ReactNode
  side?: 'left' | 'right'
  className?: string
  float?: boolean
  tone?: 'default' | 'success' | 'error'
}

/** Byte with a speech bubble. */
export function MascotSays({ mood = 'happy', size = 88, children, side = 'right', className = '', float = true, tone = 'default' }: SpeechProps) {
  const bubbleTone =
    tone === 'success'
      ? 'bg-mint-50 border-mint-300 text-mint-800'
      : tone === 'error'
        ? 'bg-berry-50 border-berry-300 text-berry-800'
        : 'bg-white border-espresso-200 text-espresso-800'
  return (
    <div className={`flex items-center gap-3 ${side === 'left' ? 'flex-row-reverse' : ''} ${className}`}>
      <Mascot mood={mood} size={size} float={float} />
      <motion.div
        key={String(children)}
        initial={{ opacity: 0, scale: 0.85, x: side === 'right' ? -8 : 8 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        className={`relative max-w-md rounded-2xl border-2 px-4 py-3 font-semibold leading-snug shadow-[0_3px_0_var(--color-espresso-200)] ${bubbleTone}`}
        aria-live="polite"
      >
        {children}
        <span
          aria-hidden
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-2 ${bubbleTone} ${
            side === 'right' ? '-left-[9px] border-t-0 border-r-0' : '-right-[9px] border-b-0 border-l-0'
          }`}
        />
      </motion.div>
    </div>
  )
}
