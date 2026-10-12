import { useId, type ReactNode } from 'react'
import type { DefenderId } from '../data/stadium'
import { Villain, type VillainPose } from './Villains'

/**
 * The original villains of the Practice stadium, drawn in the same chunky style as Mr. Lauder,
 * Bryan and Avik (200 x 220 view box, thick ink outlines). Hands are always round fists.
 */

export type DefenderPose = 'idle' | 'taunt' | 'power' | 'beaten' | 'victory'

const INK = '#241812'

interface Style {
  skin: string
  kit: string
  kitAlt?: string
  trim: string
  pants: string
  glove?: string
  /** the color of their superpower glow */
  glow: string
  /** a bigger build for the heavy hitters */
  big?: boolean
}

const STYLES: Record<Exclude<DefenderId, 'bryan' | 'avik'>, Style> = {
  frostbyte: { skin: '#cfe7f2', kit: '#eaf7ff', trim: '#45a5f8', pants: '#2d6fb5', glow: '#7fdcff' },
  glitch: { skin: '#e9b98f', kit: '#1f1d2b', trim: '#3ef08b', pants: '#2c2a3a', glow: '#3ef08b' },
  graviton: { skin: '#6b4632', kit: '#3b2466', trim: '#c08bff', pants: '#241638', glow: '#a970ff', big: true },
  polarity: { skin: '#f2c8a2', kit: '#e8463a', kitAlt: '#2f6fe0', trim: '#ffffff', pants: '#2a2a35', glow: '#ff5a4f' },
  tremor: { skin: '#9b8b7a', kit: '#6b4a2b', trim: '#ff8a3d', pants: '#3a2a1c', glow: '#ff8a3d', big: true },
  null: { skin: '#d8a982', kit: '#19d3c5', trim: '#0f2a33', pants: '#0f2a33', glove: '#ffcf3a', glow: '#5ee6ff' },
}

const NUMBERS: Record<DefenderId, string> = { bryan: '1', avik: '2', frostbyte: '0', glitch: '404', graviton: '9.8', polarity: '+-', tremor: '8.0', null: '1' }

const line = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }

function Arm({ d, hand, sleeve, fist, glow }: { d: string; hand: [number, number]; sleeve: string; fist: string; glow?: string }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d={d} stroke={sleeve} strokeWidth={8} strokeLinecap="round" fill="none" />
      {glow && <circle cx={hand[0]} cy={hand[1]} r={17} fill={glow} opacity={0.35} />}
      <circle cx={hand[0]} cy={hand[1]} r={fist === 'big' ? 12 : 9.5} fill={fist === 'big' ? '#ffcf3a' : fist} stroke={INK} strokeWidth={4} />
    </g>
  )
}

function Arms({ pose, s }: { pose: DefenderPose; s: Style }) {
  const fist = s.glove ? 'big' : s.skin
  const sleeveL = s.kit
  const sleeveR = s.kitAlt ?? s.kit
  const glow = pose === 'power' ? s.glow : undefined
  switch (pose) {
    case 'taunt':
      return (
        <>
          <Arm d="M68 148 Q56 156 58 168" hand={[60, 170]} sleeve={sleeveL} fist={fist} />
          <Arm d="M132 146 Q150 136 156 116" hand={[157, 113]} sleeve={sleeveR} fist={fist} />
        </>
      )
    case 'power':
      return (
        <>
          <Arm d="M68 146 Q50 138 38 130" hand={[36, 128]} sleeve={sleeveL} fist={fist} glow={glow} />
          <Arm d="M132 146 Q150 138 162 130" hand={[164, 128]} sleeve={sleeveR} fist={fist} glow={glow} />
        </>
      )
    case 'victory':
      return (
        <>
          <Arm d="M68 146 Q52 136 44 116" hand={[43, 113]} sleeve={sleeveL} fist={fist} />
          <Arm d="M132 146 Q148 136 156 116" hand={[157, 113]} sleeve={sleeveR} fist={fist} />
        </>
      )
    case 'beaten':
      return (
        <>
          <Arm d="M68 148 Q50 150 40 140" hand={[38, 138]} sleeve={sleeveL} fist={fist} />
          <Arm d="M132 148 Q152 156 160 166" hand={[161, 168]} sleeve={sleeveR} fist={fist} />
        </>
      )
    default:
      return (
        <>
          <Arm d="M68 148 Q54 160 50 172" hand={[50, 174]} sleeve={sleeveL} fist={fist} />
          <Arm d="M132 148 Q146 160 150 172" hand={[150, 174]} sleeve={sleeveR} fist={fist} />
        </>
      )
  }
}

function Dizzy({ cx, cy }: { cx: number; cy: number }) {
  return <path d={`M${cx} ${cy} m-6 0 a6 6 0 1 1 6 6 a3.5 3.5 0 1 1 -3.5 -3.5`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
}

/** Eyes, brows and mouth, per villain and pose. */
function Face({ who, pose }: { who: keyof typeof STYLES; pose: DefenderPose }) {
  if (pose === 'beaten') {
    return (
      <g>
        <Dizzy cx={81} cy={92} />
        <Dizzy cx={119} cy={92} />
        <ellipse cx={100} cy={118} rx={6} ry={7} fill={INK} />
      </g>
    )
  }
  const angry = pose === 'power' || pose === 'taunt'
  const grin = pose === 'victory' || pose === 'taunt'
  const brows = angry ? ['M70 78 L91 84', 'M130 78 L109 84'] : ['M70 80 Q80 75 91 79', 'M109 79 Q120 75 130 80']
  const mouth = grin ? <path d="M86 113 Q100 126 114 113 Z" fill={INK} /> : <path d="M88 117 Q100 121 112 114" {...line} />
  switch (who) {
    case 'glitch':
      return (
        <g>
          <rect x={66} y={84} width={68} height={15} rx={5} fill="#16161f" stroke={INK} strokeWidth={3} />
          <rect x={70} y={88} width={60} height={7} rx={3} fill="#45e0ff" opacity={pose === 'power' ? 1 : 0.85} />
          <rect x={74} y={89} width={12} height={2.5} fill="#fff" opacity={0.8} />
          <path d={grin ? 'M84 114 L90 119 L96 114 L102 119 L108 114 L114 119' : 'M86 116 L92 119 L98 115 L104 119 L112 116'} {...line} />
        </g>
      )
    case 'null':
      // the keeper's visor: two glowing slits where eyes should be
      return (
        <g>
          <rect x={64} y={80} width={72} height={24} rx={11} fill="#0f2a33" stroke={INK} strokeWidth={3} />
          <rect x={72} y={89} width={20} height={5} rx={2.5} fill="#5ee6ff" />
          <rect x={108} y={89} width={20} height={5} rx={2.5} fill="#5ee6ff" />
          <path d="M88 118 L112 118" {...line} />
        </g>
      )
    case 'graviton':
    case 'tremor': {
      const iris = who === 'graviton' ? '#c08bff' : '#ff6b4a'
      return (
        <g>
          <path d={who === 'tremor' ? 'M66 80 Q100 70 134 80 L134 86 Q100 78 66 86 Z' : brows[0]} {...(who === 'tremor' ? { fill: '#6e6052', stroke: INK, strokeWidth: 3 } : { stroke: INK, strokeWidth: 6, strokeLinecap: 'round' as const, fill: 'none' })} />
          {who === 'graviton' && <path d={brows[1]} stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />}
          <ellipse cx={81} cy={93} rx={8} ry={5} fill={iris} stroke={INK} strokeWidth={3} />
          <ellipse cx={119} cy={93} rx={8} ry={5} fill={iris} stroke={INK} strokeWidth={3} />
          <circle cx={81} cy={93} r={2} fill="#fff" />
          <circle cx={119} cy={93} r={2} fill="#fff" />
          {who === 'tremor' ? (
            <g>
              <rect x={84} y={112} width={32} height={10} rx={3} fill="#fff" stroke={INK} strokeWidth={3} />
              <path d="M92 112 V122 M100 112 V122 M108 112 V122" stroke={INK} strokeWidth={2} />
            </g>
          ) : (
            mouth
          )}
        </g>
      )
    }
    default: {
      const iris = who === 'frostbyte' ? '#45c8ff' : '#2b2b2b'
      return (
        <g>
          <path d={brows[0]} stroke={who === 'polarity' ? '#e8463a' : INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d={brows[1]} stroke={who === 'polarity' ? '#2f6fe0' : INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          <ellipse cx={81} cy={92} rx={9} ry={10} fill="#fff" stroke={INK} strokeWidth={3.2} />
          <ellipse cx={119} cy={92} rx={9} ry={10} fill="#fff" stroke={INK} strokeWidth={3.2} />
          <circle cx={82} cy={93} r={5} fill={iris} />
          <circle cx={120} cy={93} r={5} fill={iris} />
          <circle cx={83.5} cy={91} r={1.6} fill="#fff" />
          <circle cx={121.5} cy={91} r={1.6} fill="#fff" />
          {mouth}
        </g>
      )
    }
  }
}

/** Hair, helmets and other headgear, drawn on top of the head. */
function Headgear({ who, s }: { who: keyof typeof STYLES; s: Style }) {
  switch (who) {
    case 'frostbyte':
      return (
        <g>
          <path
            d="M56 86 L52 52 L66 66 L68 30 L82 56 L92 18 L100 52 L110 20 L118 56 L132 30 L134 66 L148 52 L144 86 Q140 70 128 66 L100 60 L72 66 Q60 70 56 86 Z"
            fill="#a5e3ff"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path d="M92 26 L96 50 M110 28 L106 50 M68 38 L74 58 M132 38 L126 58" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
        </g>
      )
    case 'glitch':
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={84 + i * 0} y={40 - i * 7} width={32} height={9} fill={i % 2 ? '#c08bff' : '#9b5cf6'} stroke={INK} strokeWidth={3} transform={`translate(${(i % 2) * 4 - 2} 0)`} />
          ))}
          <path d="M56 84 Q56 54 84 46 L116 46 Q144 54 144 84 Q134 64 116 60 L84 60 Q66 64 56 84 Z" fill="#2c2a3a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )
    case 'graviton':
      return (
        <g>
          <ellipse cx={100} cy={46} rx={56} ry={10} fill="none" stroke="#c08bff" strokeWidth={5} opacity={0.9} transform="rotate(-8 100 46)" />
          <circle cx={46} cy={52} r={6} fill="#7d6a8c" stroke={INK} strokeWidth={2.5} />
          <circle cx={152} cy={40} r={4.5} fill="#7d6a8c" stroke={INK} strokeWidth={2.5} />
          <path d="M70 54 Q84 48 98 50" stroke="#fff" strokeOpacity={0.2} strokeWidth={4} strokeLinecap="round" fill="none" />
        </g>
      )
    case 'polarity':
      return (
        <g>
          <path d="M56 86 Q52 46 100 38 L100 62 Q72 62 56 86 Z" fill="#e8463a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d="M144 86 Q148 46 100 38 L100 62 Q128 62 144 86 Z" fill="#2f6fe0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <text x={76} y={56} fontSize={14} fontWeight={800} fill="#fff" fontFamily="Fredoka Variable, Fredoka, sans-serif">N</text>
          <text x={114} y={56} fontSize={14} fontWeight={800} fill="#fff" fontFamily="Fredoka Variable, Fredoka, sans-serif">S</text>
        </g>
      )
    case 'tremor':
      return (
        <g>
          <path d="M70 60 L80 70 L76 82 M126 56 L118 66 L124 78 M98 44 L102 56 L96 64" stroke="#6e6052" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      )
    case 'null':
      return (
        <g>
          <path d="M54 92 Q50 40 100 34 Q150 40 146 92 Q138 66 100 62 Q62 66 54 92 Z" fill="#0f2a33" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d="M100 34 L100 62" stroke={s.kit} strokeWidth={5} />
        </g>
      )
  }
}

export function Defender({
  who,
  pose = 'idle',
  size = 120,
  stride = false,
  className = '',
}: {
  who: DefenderId
  pose?: DefenderPose
  size?: number
  stride?: boolean
  className?: string
}) {
  const uid = useId().replace(/:/g, '')
  if (who === 'bryan' || who === 'avik') {
    const map: Record<DefenderPose, VillainPose> = { idle: 'idle', taunt: 'taunt', power: 'attack', beaten: 'defeated', victory: 'victory' }
    return <Villain who={who} pose={map[pose]} size={size} stride={stride} className={className} />
  }
  const s = STYLES[who]
  const clip = `kit-${uid}`
  const w = s.big ? 96 : 84
  const x = 100 - w / 2
  const tilt = pose === 'beaten' ? -10 : pose === 'taunt' ? -4 : 0
  const head: ReactNode = (
    <g transform={`rotate(${tilt} 100 96)`}>
      {who !== 'null' && (
        <>
          <circle cx={58} cy={98} r={9} fill={s.skin} stroke={INK} strokeWidth={4} />
          <circle cx={142} cy={98} r={9} fill={s.skin} stroke={INK} strokeWidth={4} />
        </>
      )}
      <ellipse cx={100} cy={94} rx={s.big ? 46 : 42} ry={44} fill={s.skin} stroke={INK} strokeWidth={5} />
      {who === 'tremor' && <path d="M66 104 L78 98 L84 108 M124 102 L132 112" stroke="#6e6052" strokeWidth={3} strokeLinecap="round" fill="none" />}
      <Face who={who} pose={pose} />
      <Headgear who={who} s={s} />
    </g>
  )
  return (
    <div className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size * 1.1 }} role="img" aria-label={`${who} (${pose})`}>
      <svg viewBox="0 0 200 220" width="100%" height="100%" overflow="visible">
        <defs>
          <clipPath id={clip}>
            <rect x={x} y={128} width={w} height={62} rx={24} />
          </clipPath>
        </defs>
        <ellipse cx={100} cy={208} rx={46} ry={7} fill={INK} opacity={0.12} />
        {pose === 'power' && <ellipse cx={100} cy={120} rx={86} ry={96} fill={s.glow} opacity={0.18} />}
        {/* Glitch never quite holds still: a ghost copy in two colors */}
        {who === 'glitch' && (
          <g opacity={0.35}>
            <ellipse cx={94} cy={94} rx={42} ry={44} fill="#ff4fd8" />
            <ellipse cx={106} cy={94} rx={42} ry={44} fill="#45e0ff" />
          </g>
        )}
        <g className={stride ? 'stride-a' : undefined}>
          <rect x={70} y={180} width={24} height={22} rx={9} fill={s.pants} stroke={INK} strokeWidth={4.5} />
          <ellipse cx={82} cy={201} rx={14} ry={6} fill={INK} />
        </g>
        <g className={stride ? 'stride-b' : undefined}>
          <rect x={106} y={180} width={24} height={22} rx={9} fill={s.pants} stroke={INK} strokeWidth={4.5} />
          <ellipse cx={118} cy={201} rx={14} ry={6} fill={INK} />
        </g>
        <Arms pose={pose} s={s} />
        <rect x={x} y={128} width={w} height={62} rx={24} fill={s.kit} stroke={INK} strokeWidth={5} />
        <g clipPath={`url(#${clip})`}>
          {s.kitAlt && <rect x={100} y={126} width={60} height={70} fill={s.kitAlt} />}
          {who === 'glitch' && [0, 1, 2, 3].map((i) => <rect key={i} x={x + 8 + i * 20} y={168 + (i % 2) * 6} width={10} height={6} fill={s.trim} />)}
          {who === 'graviton' && [[70, 146], [126, 140], [84, 176], [118, 172], [104, 158]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={1.8} fill="#e9dcff" />)}
          {who === 'tremor' && <path d="M52 150 L80 160 L94 150 L114 166 L150 156" stroke={s.trim} strokeWidth={4} fill="none" />}
          {who === 'frostbyte' && <rect x={x} y={172} width={w} height={6} fill={s.trim} />}
          {who === 'null' && <rect x={x} y={150} width={w} height={8} fill={s.trim} />}
        </g>
        {s.kitAlt && <path d="M100 129 V189" stroke={INK} strokeWidth={2} />}
        <text
          x={100}
          y={NUMBERS[who].length > 2 ? 163 : 166}
          textAnchor="middle"
          fontSize={NUMBERS[who].length > 2 ? 15 : 20}
          fontWeight={700}
          fontFamily="Fredoka Variable, Fredoka, sans-serif"
          fill={who === 'frostbyte' || who === 'null' ? '#0f2a33' : '#fff'}
          stroke={INK}
          strokeWidth={who === 'frostbyte' || who === 'null' ? 0 : 2}
          paintOrder="stroke"
        >
          {NUMBERS[who]}
        </text>
        {head}
        {/* frosty breath and an ice crown glint while Frostbyte uses the power */}
        {who === 'frostbyte' && pose === 'power' && (
          <g fill="#e6f8ff" stroke="#7fdcff" strokeWidth={2}>
            <circle cx={128} cy={122} r={6} />
            <circle cx={140} cy={116} r={8} />
            <circle cx={154} cy={110} r={5} />
          </g>
        )}
      </svg>
    </div>
  )
}

export const DEFENDER_GLOW: Record<DefenderId, string> = {
  bryan: '#ff7a2f',
  avik: '#5ee6ff',
  frostbyte: '#7fdcff',
  glitch: '#3ef08b',
  graviton: '#a970ff',
  polarity: '#ff5a4f',
  tremor: '#ff8a3d',
  null: '#5ee6ff',
}
