import { useId, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { MascotMood } from '../data/types'

/*
 * Mr. Lauder, ByteBrew's mascot, drawn from Lauder.jpg in the same chunky style as the rest of the cast:
 * a bald head, a full salt-and-pepper beard (dark up top, grey below), strong brows with a
 * slightly skeptical look, a dark blazer and a light patterned shirt.
 */
const INK = '#241812'
const SKIN = '#7a4a2c'
const SKIN_SHADE = '#5c351e'
const BROW = '#1e1613'
const BLAZER = '#2c2b35'
const LAPEL = '#3f3e4b'
const SHIRT = '#dde1e6'
const SHIRT_DOT = '#7e848d'
const POCKET = '#f76f22'
const TONGUE = '#fa5d80'
const CHEEK = '#d9715f'

interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
  /** gentle floating idle animation */
  float?: boolean
  title?: string
  /** legs swing as if running (the Practice stadium) */
  stride?: boolean
}

type Arms = 'down' | 'up' | 'think' | 'out'

const ARMS: Record<MascotMood, Arms> = {
  happy: 'down',
  excited: 'up',
  thinking: 'think',
  confused: 'down',
  celebrating: 'up',
  // both hands resting down as round fists: no raised finger or thumb
  encouraging: 'down',
  surprised: 'out',
}

/** A blazer sleeve with a shirt cuff peeking out and a hand at the end. */
function Arm({ d, hand }: { d: string; hand: [number, number] }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d={d} stroke={BLAZER} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d={d} pathLength={100} stroke={SHIRT} strokeWidth={8} fill="none" strokeDasharray="7 100" strokeDashoffset={-82} />
      <circle cx={hand[0]} cy={hand[1]} r={9.5} fill={SKIN} stroke={INK} strokeWidth={4} />
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
          <Arm d="M132 146 Q154 144 150 128" hand={[149, 125]} />
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
  /** heavy upper lids, for the calm, slightly skeptical look from the photo */
  lid?: boolean
}

function Eye({ cx, cy, rx = 9, ry = 9.5, px = 0, py = 0, pr = 5.5, lid = false }: EyeProps) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={3.2} />
      <circle cx={cx + px} cy={cy + py + (lid ? 1.5 : 0)} r={pr} fill={INK} />
      <circle cx={cx + px + pr * 0.35} cy={cy + py - pr * 0.4 + (lid ? 1.5 : 0)} r={Math.max(1.5, pr * 0.3)} fill="#fff" />
      {lid && (
        <>
          <path d={`M${cx - rx - 1.5} ${cy - 1} Q${cx} ${cy - ry * 0.9} ${cx + rx + 1.5} ${cy - 1} L${cx + rx + 1.5} ${cy - ry - 3} L${cx - rx - 1.5} ${cy - ry - 3} Z`} fill={SKIN} />
          <path d={`M${cx - rx - 1} ${cy - 1} Q${cx} ${cy - ry * 0.9} ${cx + rx + 1} ${cy - 1}`} stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />
        </>
      )}
    </g>
  )
}

const brow = { stroke: BROW, strokeWidth: 6, strokeLinecap: 'round' as const, fill: 'none' }
const mouthLine = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }

function OpenMouth() {
  return (
    <g>
      <path d="M88 113 Q100 134 112 113 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={100} cy={124} rx={6} ry={3.4} fill={TONGUE} />
    </g>
  )
}

function Face({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'happy':
      return (
        <g>
          <path d="M71 69 Q81 65 91 69" {...brow} />
          <path d="M109 69 Q119 65 129 69" {...brow} />
          <Eye cx={81} cy={84} lid />
          <Eye cx={119} cy={84} lid />
          <path d="M89 114 Q100 123 111 114" {...mouthLine} />
        </g>
      )
    case 'excited':
      return (
        <g>
          <path d="M70 65 Q81 58 92 64" {...brow} />
          <path d="M108 64 Q119 58 130 65" {...brow} />
          <Eye cx={81} cy={83} rx={10} ry={11.5} pr={6.5} py={-1} />
          <Eye cx={119} cy={83} rx={10} ry={11.5} pr={6.5} py={-1} />
          <OpenMouth />
        </g>
      )
    case 'thinking':
      // the photo's raised eyebrow
      return (
        <g>
          <path d="M71 64 Q81 58 91 64" {...brow} />
          <path d="M109 71 L129 68" {...brow} />
          <Eye cx={81} cy={84} px={2.5} py={-2.5} lid />
          <Eye cx={119} cy={84} px={2.5} py={-2.5} lid />
          <path d="M92 116 Q101 113 109 117" {...mouthLine} />
        </g>
      )
    case 'confused':
      return (
        <g>
          <path d="M71 70 Q81 64 91 68" {...brow} />
          <path d="M110 64 L129 70" {...brow} />
          <Eye cx={81} cy={84} />
          <Eye cx={119} cy={85} rx={7.5} ry={8} pr={4.5} px={-1} />
          <path d="M88 118 Q94 112 100 116 Q106 120 112 114" {...mouthLine} />
        </g>
      )
    case 'celebrating':
      return (
        <g>
          <path d="M70 66 Q81 60 92 65" {...brow} />
          <path d="M108 65 Q119 60 130 66" {...brow} />
          <path d="M72 87 Q81 75 90 87" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d="M110 87 Q119 75 128 87" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          <OpenMouth />
        </g>
      )
    case 'encouraging':
      return (
        <g>
          <path d="M72 68 Q81 65 90 67" {...brow} />
          <path d="M110 67 Q119 65 128 68" {...brow} />
          <Eye cx={81} cy={84} lid />
          <Eye cx={119} cy={84} lid />
          <path d="M88 113 Q100 125 112 113" {...mouthLine} />
        </g>
      )
    case 'surprised':
      return (
        <g>
          <path d="M71 62 Q81 55 91 61" {...brow} />
          <path d="M109 61 Q119 55 129 62" {...brow} />
          <Eye cx={81} cy={83} rx={10} ry={11.5} pr={3.6} />
          <Eye cx={119} cy={83} rx={10} ry={11.5} pr={3.6} />
          <ellipse cx={100} cy={119} rx={5} ry={6.5} fill={INK} />
        </g>
      )
  }
}

/** A few light curls so the grey part of the beard reads as a beard, not a bib. */
const CURLS = [
  [78, 130],
  [90, 140],
  [102, 145],
  [114, 139],
  [124, 128],
  [94, 151],
  [108, 151],
  [70, 120],
  [130, 119],
] as const

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


/** Mr. Lauder: ByteBrew's mascot. */
export function Mascot({ mood = 'happy', size = 120, className = '', float = false, title, stride = false }: MascotProps) {
  const uid = useId().replace(/:/g, '')
  const beardId = `beard-${uid}`
  const dotsId = `dots-${uid}`
  const tilt = mood === 'confused' ? -7 : mood === 'thinking' ? 4 : 0
  const wide = mood === 'surprised' || mood === 'excited'

  return (
    <div
      className={`relative inline-block shrink-0 ${float ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size * 1.1 }}
      role="img"
      aria-label={title ?? `Mr. Lauder looks ${mood}`}
    >
      <svg viewBox="0 0 200 220" width="100%" height="100%" overflow="visible">
        <defs>
          <linearGradient id={beardId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b231f" />
            <stop offset="0.38" stopColor="#433b36" />
            <stop offset="0.7" stopColor="#938e89" />
            <stop offset="1" stopColor="#cfccc7" />
          </linearGradient>
          <pattern id={dotsId} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill={SHIRT_DOT} />
            <circle cx="5.5" cy="5.5" r="0.9" fill={SHIRT_DOT} />
          </pattern>
        </defs>

        {/* floor shadow */}
        <ellipse cx={100} cy={208} rx={46} ry={7} fill={INK} opacity={0.12} />

        <Extras mood={mood} />

        {/* legs and shoes */}
        <g className={stride ? 'stride-a' : undefined}>
          <rect x={70} y={180} width={24} height={22} rx={9} fill={BLAZER} stroke={INK} strokeWidth={4.5} />
          <ellipse cx={82} cy={201} rx={14} ry={6} fill={INK} />
        </g>
        <g className={stride ? 'stride-b' : undefined}>
          <rect x={106} y={180} width={24} height={22} rx={9} fill={BLAZER} stroke={INK} strokeWidth={4.5} />
          <ellipse cx={118} cy={201} rx={14} ry={6} fill={INK} />
        </g>

        {/* arms, then the blazer on top so the shoulders tuck under it */}
        <ArmsFor arms={ARMS[mood]} />
        <rect x={58} y={128} width={84} height={62} rx={24} fill={BLAZER} stroke={INK} strokeWidth={5} />
        {/* patterned shirt in the open V of the blazer, with lapels and a pocket square */}
        <path d="M76 130 L100 174 L124 130 Z" fill={SHIRT} />
        <path d="M76 130 L100 174 L124 130 Z" fill={`url(#${dotsId})`} />
        <path d="M76 130 L100 174 L124 130" stroke={INK} strokeWidth={3} strokeLinejoin="round" fill="none" />
        <path d="M76 131 L92 162 L82 166 Z" fill={LAPEL} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M124 131 L108 162 L118 166 Z" fill={LAPEL} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M124 156 L137 156 L133 149 L129 153 L126 148 Z" fill={POCKET} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={100} cy={181} r={2.6} fill={LAPEL} stroke={INK} strokeWidth={1.5} />

        {/* head */}
        <g transform={`rotate(${tilt} 100 92)`}>
          {/* ears */}
          <circle cx={56} cy={92} r={9} fill={SKIN} stroke={INK} strokeWidth={4.5} />
          <circle cx={56} cy={93} r={4} fill={SKIN_SHADE} />
          <circle cx={144} cy={92} r={9} fill={SKIN} stroke={INK} strokeWidth={4.5} />
          <circle cx={144} cy={93} r={4} fill={SKIN_SHADE} />
          {/* bald head with a little shine */}
          <ellipse cx={100} cy={86} rx={44} ry={49} fill={SKIN} stroke={INK} strokeWidth={5} />
          <ellipse cx={82} cy={50} rx={13} ry={6.5} fill="#fff" opacity={0.18} transform="rotate(-18 82 50)" />
          {/* forehead lines */}
          <path d={wide ? 'M86 50 Q100 46 114 50 M89 56 Q100 53 111 56' : 'M87 55 Q100 51 113 55'} stroke={SKIN_SHADE} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.7} />
          <ellipse cx={68} cy={100} rx={6} ry={3.6} fill={CHEEK} opacity={0.3} />
          <ellipse cx={132} cy={100} rx={6} ry={3.6} fill={CHEEK} opacity={0.3} />
          {/* nose */}
          <path d="M100 82 Q96 93 92 96 Q100 101 108 96 Q104 93 100 82" fill={SKIN_SHADE} opacity={0.55} />
          <path d="M92 96 Q100 101 108 96" stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />
          {/* the beard: dark near the face, salt-and-pepper grey at the bottom */}
          <path
            d="M57 92 C57 122 66 141 80 150 C88 155 94 157 100 157 C106 157 112 155 120 150 C134 141 143 122 143 92 C140 104 135 111 128 115 C120 120 112 125 100 125 C88 125 80 120 72 115 C65 111 60 104 57 92 Z"
            fill={`url(#${beardId})`}
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {CURLS.map(([x, y], i) => (
            <path key={i} d={`M${x - 3.5} ${y} q3.5 -4.5 7 0`} stroke="#ece9e4" strokeOpacity={y > 128 ? 0.85 : 0.35} strokeWidth={2} strokeLinecap="round" fill="none" />
          ))}
          {/* moustache */}
          <ellipse cx={100} cy={117} rx={11} ry={5} fill="#93553a" />
          <path d="M82 107 Q91 100 100 104 Q109 100 118 107 Q112 112 100 109 Q88 112 82 107 Z" fill="#2b231f" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
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

/** Mr. Lauder with a speech bubble. */
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
