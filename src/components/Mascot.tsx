import { useId, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { MascotMood } from '../data/types'

const INK = '#241812'
const FUR = '#d98a3d'
const FUR_DARK = '#9a5a25'
const MUZZLE = '#f2c592'
const MANE = '#f6b922'
const MANE_LIGHT = '#ffd256'
const JERSEY = '#33a24d'
const STRIPE = '#ffc21f'
const SLEEVE = '#34303f'
const TONGUE = '#fa5d80'
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

/** A dark sleeve with a yellow cuff stripe and a furry paw at the end. */
function Arm({ d, hand }: { d: string; hand: [number, number] }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d={d} stroke={SLEEVE} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d={d} pathLength={100} stroke={STRIPE} strokeWidth={8} fill="none" strokeDasharray="7 100" strokeDashoffset={-64} />
      <circle cx={hand[0]} cy={hand[1]} r={9.5} fill={FUR} stroke={INK} strokeWidth={4} />
      <circle cx={hand[0]} cy={hand[1] + 1.5} r={3.6} fill={MUZZLE} />
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
          <rect x={155} y={100} width={8} height={14} rx={4} fill={FUR} stroke={INK} strokeWidth={3.5} />
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

interface EyeProps {
  cx: number
  cy: number
  rx?: number
  ry?: number
  /** pupil offset and radius */
  px?: number
  py?: number
  pr?: number
}

function Eye({ cx, cy, rx = 10, ry = 11, px = 0, py = 0, pr = 6.5 }: EyeProps) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={3.5} />
      <circle cx={cx + px} cy={cy + py} r={pr} fill={INK} />
      <circle cx={cx + px + pr * 0.35} cy={cy + py - pr * 0.4} r={Math.max(1.6, pr * 0.3)} fill="#fff" />
    </g>
  )
}

const brow = { stroke: INK, strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none', opacity: 0.75 }
const mouthLine = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }

function OpenMouth() {
  return (
    <g>
      <path d="M87 106 Q100 132 113 106 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={100} cy={116} rx={6.5} ry={3.6} fill={TONGUE} />
    </g>
  )
}

function Face({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'happy':
      return (
        <g>
          <path d="M70 63 Q80 59 90 63" {...brow} />
          <path d="M110 63 Q120 59 130 63" {...brow} />
          <Eye cx={80} cy={78} />
          <Eye cx={120} cy={78} />
          <path d="M100 103 V108 M100 108 Q91 117 84 109 M100 108 Q109 117 116 109" {...mouthLine} />
        </g>
      )
    case 'excited':
      return (
        <g>
          <path d="M69 60 Q80 54 91 59" {...brow} />
          <path d="M109 59 Q120 54 131 60" {...brow} />
          <Eye cx={80} cy={77} rx={11} ry={13} pr={7.5} py={-1} />
          <Eye cx={120} cy={77} rx={11} ry={13} pr={7.5} py={-1} />
          <OpenMouth />
        </g>
      )
    case 'thinking':
      return (
        <g>
          <path d="M70 60 Q80 55 90 60" {...brow} />
          <path d="M110 65 L130 61" {...brow} />
          <Eye cx={80} cy={78} px={3} py={-3} />
          <Eye cx={120} cy={78} px={3} py={-3} />
          <path d="M100 103 V106 M93 111 Q101 108 109 112" {...mouthLine} />
        </g>
      )
    case 'confused':
      return (
        <g>
          <path d="M70 65 Q80 59 90 63" {...brow} />
          <path d="M111 60 L130 66" {...brow} />
          <Eye cx={80} cy={78} />
          <Eye cx={120} cy={80} rx={8} ry={8.5} pr={5} px={-1} />
          <path d="M100 103 V106 M88 113 Q94 106 100 110 Q106 114 112 108" {...mouthLine} />
        </g>
      )
    case 'celebrating':
      return (
        <g>
          <path d="M69 81 Q80 66 91 81" stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none" />
          <path d="M109 81 Q120 66 131 81" stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none" />
          <OpenMouth />
        </g>
      )
    case 'encouraging':
      return (
        <g>
          <path d="M71 64 Q80 60 89 63" {...brow} />
          <path d="M111 63 Q120 60 129 64" {...brow} />
          <Eye cx={80} cy={78} />
          <Eye cx={120} cy={78} />
          <path d="M100 103 V107 M100 107 Q94 113 89 108 M100 107 Q106 113 111 108" {...mouthLine} />
        </g>
      )
    case 'surprised':
      return (
        <g>
          <path d="M70 57 Q80 51 90 57" {...brow} />
          <path d="M110 57 Q120 51 130 57" {...brow} />
          <Eye cx={80} cy={78} rx={11} ry={13} pr={3.8} />
          <Eye cx={120} cy={78} rx={11} ry={13} pr={3.8} />
          <ellipse cx={100} cy={114} rx={5.5} ry={7} fill={INK} />
        </g>
      )
  }
}

function Extras({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'thinking':
      return (
        <g fill="#fff5e8" stroke={INK} strokeWidth={3}>
          <circle cx={166} cy={36} r={5} />
          <circle cx={178} cy={22} r={7} />
          <circle cx={188} cy={4} r={9} />
        </g>
      )
    case 'confused':
      return (
        <text x={166} y={40} fontSize={34} fontFamily="Fredoka Variable, Fredoka, sans-serif" fontWeight={700} fill="#f76f22" stroke={INK} strokeWidth={2}>
          ?
        </text>
      )
    case 'surprised':
      return (
        <text x={168} y={40} fontSize={34} fontFamily="Fredoka Variable, Fredoka, sans-serif" fontWeight={700} fill="#ffc21f" stroke={INK} strokeWidth={2}>
          !
        </text>
      )
    case 'celebrating':
      return (
        <g>
          <rect x={20} y={58} width={9} height={9} rx={2} fill="#ffc21f" transform="rotate(20 24 62)" />
          <rect x={172} y={72} width={9} height={9} rx={2} fill="#45a5f8" transform="rotate(-25 176 76)" />
          <circle cx={30} cy={96} r={4.5} fill="#fa5d80" />
          <circle cx={172} cy={102} r={4.5} fill="#37c68e" />
          <path d="M166 30 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z" fill="#ffc21f" stroke={INK} strokeWidth={2} />
          <path d="M30 26 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" fill="#9b74f7" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'excited':
      return (
        <g stroke={INK} strokeWidth={2}>
          <path d="M168 34 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z" fill="#ffc21f" />
          <path d="M28 38 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" fill="#45a5f8" />
        </g>
      )
    default:
      return null
  }
}

/** The mane is a ring of overlapping tufts; drawing the outline first and the fill on top keeps only the outer edge. */
const TUFTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180
  return { x: +(100 + 42 * Math.cos(a)).toFixed(1), y: +(80 + 42 * Math.sin(a)).toFixed(1) }
})

/** Byte: ByteBrew's lion mascot. */
export function Mascot({ mood = 'happy', size = 120, className = '', float = false, title }: MascotProps) {
  const uid = useId().replace(/:/g, '')
  const maneId = `mane-${uid}`
  const clipId = `jersey-${uid}`
  const tilt = mood === 'confused' ? -7 : mood === 'thinking' ? 4 : 0

  return (
    <div
      className={`relative inline-block shrink-0 ${float ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size * 1.1 }}
      role="img"
      aria-label={title ?? `Byte the lion looks ${mood}`}
    >
      <svg viewBox="0 0 200 220" width="100%" height="100%" overflow="visible">
        <defs>
          <radialGradient id={maneId} cx="0.5" cy="0.42" r="0.6">
            <stop offset="0.45" stopColor={MANE_LIGHT} />
            <stop offset="1" stopColor={MANE} />
          </radialGradient>
          <clipPath id={clipId}>
            <rect x={58} y={128} width={84} height={62} rx={24} />
          </clipPath>
        </defs>

        {/* floor shadow */}
        <ellipse cx={100} cy={208} rx={46} ry={7} fill={INK} opacity={0.12} />

        <Extras mood={mood} />

        {/* legs */}
        <rect x={70} y={180} width={24} height={22} rx={10} fill={FUR} stroke={INK} strokeWidth={4.5} />
        <rect x={106} y={180} width={24} height={22} rx={10} fill={FUR} stroke={INK} strokeWidth={4.5} />
        <ellipse cx={82} cy={196} rx={7} ry={3.6} fill={MUZZLE} />
        <ellipse cx={118} cy={196} rx={7} ry={3.6} fill={MUZZLE} />

        {/* arms, then the jersey on top so the shoulders tuck under it */}
        <ArmsFor arms={ARMS[mood]} />
        <rect x={58} y={128} width={84} height={62} rx={24} fill={JERSEY} stroke={INK} strokeWidth={5} />
        <g clipPath={`url(#${clipId})`}>
          <rect x={56} y={167} width={88} height={6} fill={STRIPE} />
          <rect x={56} y={177} width={88} height={6} fill={STRIPE} />
        </g>
        <path d="M68 138 Q100 132 132 138" stroke="#fff" strokeOpacity={0.25} strokeWidth={4} strokeLinecap="round" fill="none" />
        <text
          x={100}
          y={159}
          textAnchor="middle"
          fontSize={22}
          fontWeight={700}
          letterSpacing={1}
          fontFamily="Fredoka Variable, Fredoka, sans-serif"
          fill={STRIPE}
          stroke={INK}
          strokeWidth={2.4}
          paintOrder="stroke"
        >
          EOM
        </text>

        {/* head */}
        <g transform={`rotate(${tilt} 100 90)`}>
          {TUFTS.map((t, i) => (
            <circle key={`o${i}`} cx={t.x} cy={t.y} r={20} fill={MANE} stroke={INK} strokeWidth={5} />
          ))}
          {TUFTS.map((t, i) => (
            <circle key={`f${i}`} cx={t.x} cy={t.y} r={20} fill={MANE} />
          ))}
          <circle cx={100} cy={80} r={57} fill={`url(#${maneId})`} />
          {/* ears */}
          <circle cx={62} cy={38} r={13} fill={FUR} stroke={INK} strokeWidth={4.5} />
          <circle cx={62} cy={39} r={6} fill={MUZZLE} />
          <circle cx={138} cy={38} r={13} fill={FUR} stroke={INK} strokeWidth={4.5} />
          <circle cx={138} cy={39} r={6} fill={MUZZLE} />
          {/* face */}
          <ellipse cx={100} cy={88} rx={44} ry={39} fill={FUR} stroke={INK} strokeWidth={5} />
          <path d="M72 52 Q84 44 100 44 Q116 44 128 52" stroke={FUR_DARK} strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" fill="none" />
          <ellipse cx={66} cy={98} rx={7} ry={4.5} fill={CHEEK} opacity={0.35} />
          <ellipse cx={134} cy={98} rx={7} ry={4.5} fill={CHEEK} opacity={0.35} />
          <ellipse cx={100} cy={103} rx={22} ry={16} fill={MUZZLE} stroke={INK} strokeWidth={3.5} />
          <path d="M90 92 Q100 85 110 92 Q109 101 100 104 Q91 101 90 92 Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx={96} cy={92} rx={3.2} ry={1.8} fill="#fff" opacity={0.55} />
          <g className="origin-center" style={{ transformBox: 'fill-box' }}>
            <Face mood={mood} />
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
