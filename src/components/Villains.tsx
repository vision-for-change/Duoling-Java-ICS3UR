import { useId } from 'react'

/**
 * Bryan and Avik, the two villains of the Practice battle, drawn as mascots in the same style as Byte:
 * big head, small body, thick ink outlines. Their looks come from the photos in the project folder.
 * Bryan: short spiky black hair, half-rim glasses, a huge grin and a white tee (plus a football, of course).
 * Avik: big wavy black hair, thick brows, sleepy eyes, a smirk, a black striped tee and his robotic arm.
 */

export type VillainId = 'bryan' | 'avik'
export type VillainPose = 'idle' | 'taunt' | 'attack' | 'hurt' | 'defeated' | 'victory'

const INK = '#241812'

interface Look {
  skin: string
  skinShade: string
  hair: string
  shirt: string
  pants: string
  cheek: string
}

const LOOKS: Record<VillainId, Look> = {
  bryan: { skin: '#f1c6a0', skinShade: '#d9a47b', hair: '#1f1b22', shirt: '#f7f5f0', pants: '#33415f', cheek: '#f08a7a' },
  avik: { skin: '#c88b5f', skinShade: '#a96f45', hair: '#151217', shirt: '#25222b', pants: '#4a4f5c', cheek: '#d9715f' },
}

/** A sleeve with a hand at the end. */
function Arm({ d, hand, sleeve, skin }: { d: string; hand: [number, number]; sleeve: string; skin: string }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d={d} stroke={sleeve} strokeWidth={8} strokeLinecap="round" fill="none" />
      <circle cx={hand[0]} cy={hand[1]} r={9} fill={skin} stroke={INK} strokeWidth={4} />
    </g>
  )
}

/** Avik's robotic arm: metal segments, a glowing joint and a two-prong claw. */
function RobotArm({ pose }: { pose: VillainPose }) {
  // [shoulder, elbow, hand] and the claw angle, per pose
  const shapes: Record<VillainPose, { pts: [number, number][]; angle: number }> = {
    idle: { pts: [[134, 146], [150, 160], [152, 176]], angle: 90 },
    taunt: { pts: [[134, 144], [156, 136], [160, 112]], angle: -90 },
    attack: { pts: [[134, 146], [156, 144], [178, 140]], angle: 0 },
    hurt: { pts: [[134, 148], [152, 164], [146, 180]], angle: 120 },
    defeated: { pts: [[134, 150], [148, 170], [140, 186]], angle: 130 },
    victory: { pts: [[134, 144], [154, 130], [158, 106]], angle: -90 },
  }
  const { pts, angle } = shapes[pose]
  const [s, e, h] = pts
  const glow = pose === 'attack' || pose === 'taunt' || pose === 'victory' ? '#5ee6ff' : pose === 'defeated' ? '#ff6b5e' : '#3fb8d6'
  return (
    <g>
      <path d={`M${s[0]} ${s[1]} L${e[0]} ${e[1]} L${h[0]} ${h[1]}`} stroke={INK} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${s[0]} ${s[1]} L${e[0]} ${e[1]} L${h[0]} ${h[1]}`} stroke="#a7b1bd" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${s[0]} ${s[1]} L${e[0]} ${e[1]}`} stroke="#d7dde4" strokeWidth={3} strokeLinecap="round" fill="none" />
      <circle cx={e[0]} cy={e[1]} r={6.5} fill="#6c7785" stroke={INK} strokeWidth={3} />
      <circle cx={e[0]} cy={e[1]} r={2.6} fill={glow} />
      <g transform={`translate(${h[0]} ${h[1]}) rotate(${angle})`}>
        <rect x={-6} y={-7} width={12} height={14} rx={3} fill="#6c7785" stroke={INK} strokeWidth={3} />
        <path d="M5 -6 L16 -10 L14 -3" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 6 L16 10 L14 3" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={0} cy={0} r={2.4} fill={glow} />
      </g>
      {(pose === 'hurt' || pose === 'defeated') && (
        <g stroke="#ffc21f" strokeWidth={2.5} strokeLinecap="round">
          <path d={`M${e[0] + 8} ${e[1] - 8} l6 -6`} />
          <path d={`M${e[0] + 10} ${e[1]} l8 0`} />
          <path d={`M${e[0] + 6} ${e[1] + 8} l5 6`} />
        </g>
      )}
    </g>
  )
}

/** A classic black and white football. */
function Football({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={3.5} />
      <path
        d={`M${cx} ${cy - r * 0.42} l${r * 0.4} ${r * 0.29} l-${r * 0.15} ${r * 0.47} h-${r * 0.5} l-${r * 0.15} -${r * 0.47} z`}
        fill={INK}
      />
      <path d={`M${cx} ${cy - r * 0.42} V${cy - r}`} stroke={INK} strokeWidth={2} />
      <path d={`M${cx + r * 0.4} ${cy - r * 0.13} L${cx + r * 0.95} ${cy - r * 0.3}`} stroke={INK} strokeWidth={2} />
      <path d={`M${cx - r * 0.4} ${cy - r * 0.13} L${cx - r * 0.95} ${cy - r * 0.3}`} stroke={INK} strokeWidth={2} />
      <path d={`M${cx + r * 0.25} ${cy + r * 0.34} L${cx + r * 0.55} ${cy + r * 0.82}`} stroke={INK} strokeWidth={2} />
      <path d={`M${cx - r * 0.25} ${cy + r * 0.34} L${cx - r * 0.55} ${cy + r * 0.82}`} stroke={INK} strokeWidth={2} />
    </g>
  )
}

function Crown() {
  return (
    <g>
      <path d="M78 40 L82 18 L94 32 L100 14 L106 32 L118 18 L122 40 Z" fill="#ffc21f" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cx={100} cy={30} r={3} fill="#fa5d80" />
    </g>
  )
}

/** Swirly "seeing stars" eyes for a knockout. */
function DizzyEye({ cx, cy }: { cx: number; cy: number }) {
  return <path d={`M${cx} ${cy} m-6 0 a6 6 0 1 1 6 6 a3.5 3.5 0 1 1 -3.5 -3.5`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
}

function Stars() {
  return (
    <g fill="#ffc21f" stroke={INK} strokeWidth={2}>
      <path d="M56 30 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" />
      <path d="M144 26 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" />
      <path d="M100 6 l2.5 5 l5 2.5 l-5 2.5 l-2.5 5 l-2.5 -5 l-5 -2.5 l5 -2.5 z" />
    </g>
  )
}

const line = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }

// ------------------------------------------------------------------ Bryan

function BryanFace({ pose }: { pose: VillainPose }) {
  const glassesTilt = pose === 'hurt' ? 6 : pose === 'defeated' ? 12 : 0
  const eyes = (() => {
    if (pose === 'defeated') return [<DizzyEye key="l" cx={81} cy={90} />, <DizzyEye key="r" cx={119} cy={90} />]
    if (pose === 'hurt')
      return [<path key="l" d="M75 85 L86 90 L75 95" {...line} />, <path key="r" d="M125 85 L114 90 L125 95" {...line} />]
    if (pose === 'victory' || pose === 'taunt')
      // happy squint behind the glasses
      return [<path key="l" d="M74 93 Q81 84 88 93" {...line} strokeWidth={4} />, <path key="r" d="M112 93 Q119 84 126 93" {...line} strokeWidth={4} />]
    return [
      <g key="l">
        <circle cx={81} cy={90} r={5} fill={INK} />
        <circle cx={82.8} cy={88.2} r={1.7} fill="#fff" />
      </g>,
      <g key="r">
        <circle cx={119} cy={90} r={5} fill={INK} />
        <circle cx={120.8} cy={88.2} r={1.7} fill="#fff" />
      </g>,
    ]
  })()
  const mouth = (() => {
    if (pose === 'defeated') return <ellipse cx={100} cy={120} rx={7} ry={8} fill={INK} />
    if (pose === 'hurt') return <path d="M84 120 Q90 114 96 120 Q102 126 108 120 Q114 114 118 120" {...line} />
    // the big grin from the photo, teeth and all
    return (
      <g>
        <path d="M78 111 Q100 138 122 111 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M82 113 L118 113 L115 119 L85 119 Z" fill="#fff" />
        <path d="M91 113 V119 M100 113 V119 M109 113 V119" stroke="#d9d4cc" strokeWidth={1.4} />
        {pose === 'victory' && <ellipse cx={100} cy={128} rx={6} ry={3} fill="#fa5d80" />}
      </g>
    )
  })()
  return (
    <g>
      {/* brows, peeking under the fringe */}
      <path d={pose === 'attack' ? 'M70 76 L90 80' : 'M70 77 Q80 73 90 77'} stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <path d={pose === 'attack' ? 'M130 76 L110 80' : 'M110 77 Q120 73 130 77'} stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      {eyes}
      {/* half-rim glasses: a thick dark top bar, thin wire below */}
      <g transform={`rotate(${glassesTilt} 100 88)`}>
        <rect x={67} y={81} width={28} height={18} rx={5} fill="#cfe8ff" fillOpacity={0.28} stroke={INK} strokeWidth={1.8} />
        <rect x={105} y={81} width={28} height={18} rx={5} fill="#cfe8ff" fillOpacity={0.28} stroke={INK} strokeWidth={1.8} />
        <path d="M67 83 Q81 79 95 83 M105 83 Q119 79 133 83" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
        <path d="M95 85 Q100 82 105 85" {...line} strokeWidth={2.5} />
        <path d="M67 84 L58 86 M133 84 L142 86" {...line} strokeWidth={2.5} />
        <path d="M71 86 L75 82" stroke="#fff" strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" />
      </g>
      <path d="M100 98 Q96 106 101 108" {...line} strokeWidth={3} />
      {mouth}
    </g>
  )
}

function BryanArms({ pose, look }: { pose: VillainPose; look: Look }) {
  const a = { sleeve: look.shirt, skin: look.skin }
  switch (pose) {
    case 'taunt':
      // pointing at you, other hand on the hip
      return (
        <>
          <Arm d="M68 148 Q56 156 60 168" hand={[62, 170]} {...a} />
          <Arm d="M132 146 Q150 140 164 132" hand={[166, 131]} {...a} />
        </>
      )
    case 'attack':
      return (
        <>
          <Arm d="M68 146 Q50 140 40 128" hand={[38, 126]} {...a} />
          <Arm d="M132 146 Q150 140 160 128" hand={[162, 126]} {...a} />
        </>
      )
    case 'victory':
      return (
        <>
          <Arm d="M68 146 Q52 136 44 116" hand={[43, 113]} {...a} />
          <Arm d="M132 146 Q148 136 156 116" hand={[157, 113]} {...a} />
        </>
      )
    case 'hurt':
    case 'defeated':
      return (
        <>
          <Arm d="M68 148 Q50 152 42 160" hand={[40, 162]} {...a} />
          <Arm d="M132 148 Q150 152 158 160" hand={[160, 162]} {...a} />
        </>
      )
    default:
      return (
        <>
          <Arm d="M68 148 Q54 160 50 172" hand={[50, 174]} {...a} />
          <Arm d="M132 148 Q146 160 150 172" hand={[150, 174]} {...a} />
        </>
      )
  }
}

function BryanHair() {
  // short, spiky on top, with a jagged fringe falling over the forehead
  return (
    <path
      d="M56 92 Q52 54 78 42 L74 28 L90 38 L94 20 L106 35 L118 22 L120 40 L136 32 L132 48 Q150 60 144 92 Q140 74 130 68 L124 78 L116 64 L108 76 L100 62 L92 76 L84 64 L76 78 L70 68 Q60 74 56 92 Z"
      fill="#1f1b22"
      stroke={INK}
      strokeWidth={4.5}
      strokeLinejoin="round"
    />
  )
}

// ------------------------------------------------------------------ Avik

function AvikFace({ pose }: { pose: VillainPose }) {
  // sleepy, half-lidded eyes: the lid covers the top of each eye
  const lid = (cx: number, low = 0) => (
    <g key={cx}>
      <ellipse cx={cx} cy={92} rx={9} ry={7.5} fill="#fff" stroke={INK} strokeWidth={3} />
      <circle cx={cx + 1} cy={94} r={4.2} fill={INK} />
      <path d={`M${cx - 10} ${91 + low} Q${cx} ${85 + low} ${cx + 10} ${91 + low} L${cx + 10} 82 L${cx - 10} 82 Z`} fill="#c88b5f" />
      <path d={`M${cx - 10} ${91 + low} Q${cx} ${85 + low} ${cx + 10} ${91 + low}`} {...line} />
    </g>
  )
  const eyes = (() => {
    if (pose === 'defeated') return [<DizzyEye key="l" cx={81} cy={92} />, <DizzyEye key="r" cx={119} cy={92} />]
    if (pose === 'hurt') return [<path key="l" d="M72 92 L90 92" {...line} strokeWidth={4} />, <path key="r" d="M110 92 L128 92" {...line} strokeWidth={4} />]
    if (pose === 'victory') return [lid(81, -2), lid(119, -2)]
    if (pose === 'attack') return [lid(81, 2), lid(119, 2)]
    return [lid(81), lid(119)]
  })()
  const brows =
    pose === 'victory' || pose === 'taunt'
      ? ['M69 78 Q80 70 91 76', 'M109 74 Q120 66 131 72']
      : pose === 'attack'
        ? ['M70 76 L91 81', 'M130 76 L109 81']
        : ['M70 79 Q80 73 91 78', 'M109 78 Q120 73 130 79']
  const mouth =
    pose === 'defeated' ? (
      <path d="M88 122 L112 122" {...line} />
    ) : pose === 'hurt' ? (
      <path d="M88 124 Q100 116 112 124" {...line} />
    ) : pose === 'victory' ? (
      <path d="M86 116 Q100 126 116 113" {...line} />
    ) : (
      // the photo's lopsided smirk
      <path d="M88 119 Q100 123 114 113" {...line} />
    )
  return (
    <g>
      <path d={brows[0]} stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none" />
      <path d={brows[1]} stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none" />
      {eyes}
      <path d="M101 96 Q96 108 103 110" {...line} strokeWidth={3} />
      {mouth}
    </g>
  )
}

/** Avik's hair is a big wavy cloud: outlines first, then fills on top so only the outer edge shows. */
const AVIK_CURLS = [
  { x: 56, y: 96, r: 15 },
  { x: 52, y: 76, r: 17 },
  { x: 60, y: 54, r: 19 },
  { x: 78, y: 38, r: 20 },
  { x: 100, y: 32, r: 21 },
  { x: 122, y: 38, r: 20 },
  { x: 140, y: 54, r: 19 },
  { x: 148, y: 76, r: 17 },
  { x: 144, y: 96, r: 15 },
]

function AvikHair({ back }: { back: boolean }) {
  if (back) {
    return (
      <g>
        {AVIK_CURLS.map((c, i) => (
          <circle key={`o${i}`} cx={c.x} cy={c.y} r={c.r} fill="#151217" stroke={INK} strokeWidth={4.5} />
        ))}
        {AVIK_CURLS.map((c, i) => (
          <circle key={`f${i}`} cx={c.x} cy={c.y} r={c.r} fill="#151217" />
        ))}
        <path d="M66 46 Q84 30 104 34" stroke="#3a3440" strokeWidth={3} strokeLinecap="round" fill="none" />
      </g>
    )
  }
  // the fringe sweeps across the forehead in loose waves
  return (
    <g>
      <path
        d="M58 86 Q60 54 92 50 Q124 46 142 74 Q132 66 124 72 Q116 62 106 70 Q98 60 88 72 Q80 64 72 76 Q64 74 58 86 Z"
        fill="#151217"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M84 58 Q96 54 108 58" stroke="#3a3440" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </g>
  )
}

// ------------------------------------------------------------------ the character

export function Villain({ who, pose = 'idle', size = 140, className = '' }: { who: VillainId; pose?: VillainPose; size?: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const look = LOOKS[who]
  const clipId = `shirt-${uid}`
  const tilt = pose === 'defeated' ? -10 : pose === 'hurt' ? 6 : pose === 'taunt' ? -4 : 0
  const name = who === 'bryan' ? 'Bryan' : 'Avik'
  return (
    <div className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size * 1.1 }} role="img" aria-label={`${name} (${pose})`}>
      <svg viewBox="0 0 200 220" width="100%" height="100%" overflow="visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={58} y={128} width={84} height={62} rx={24} />
          </clipPath>
        </defs>
        <ellipse cx={100} cy={208} rx={46} ry={7} fill={INK} opacity={0.12} />
        {pose === 'defeated' && <Stars />}
        {who === 'bryan' && pose === 'victory' && <Crown />}

        {/* legs */}
        <rect x={70} y={180} width={24} height={22} rx={9} fill={look.pants} stroke={INK} strokeWidth={4.5} />
        <rect x={106} y={180} width={24} height={22} rx={9} fill={look.pants} stroke={INK} strokeWidth={4.5} />
        <ellipse cx={82} cy={201} rx={14} ry={6} fill={INK} />
        <ellipse cx={118} cy={201} rx={14} ry={6} fill={INK} />

        {/* arms, then the shirt on top */}
        {who === 'bryan' ? (
          <BryanArms pose={pose} look={look} />
        ) : (
          <Arm
            d={pose === 'victory' || pose === 'taunt' ? 'M68 148 Q54 156 52 168' : pose === 'attack' ? 'M68 148 Q52 144 44 136' : 'M68 148 Q54 160 50 172'}
            hand={pose === 'victory' || pose === 'taunt' ? [52, 170] : pose === 'attack' ? [42, 135] : [50, 174]}
            sleeve={look.shirt}
            skin={look.skin}
          />
        )}
        <rect x={58} y={128} width={84} height={62} rx={24} fill={look.shirt} stroke={INK} strokeWidth={5} />
        {who === 'bryan' ? (
          <>
            <path d="M86 130 Q100 140 114 130" stroke="#d6d1c7" strokeWidth={3.5} strokeLinecap="round" fill="none" />
            <text x={100} y={166} textAnchor="middle" fontSize={20} fontWeight={700} fontFamily="Fredoka Variable, Fredoka, sans-serif" fill="#f76f22" stroke={INK} strokeWidth={2.2} paintOrder="stroke">
              GG
            </text>
          </>
        ) : (
          <>
            <g clipPath={`url(#${clipId})`}>
              <rect x={56} y={160} width={88} height={7} fill="#c9ccd2" />
              <rect x={56} y={172} width={88} height={4} fill="#c9ccd2" />
            </g>
            <path d="M86 130 Q100 140 114 130" stroke="#3b3742" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          </>
        )}
        {who === 'avik' && <RobotArm pose={pose} />}

        {/* head */}
        <g transform={`rotate(${tilt} 100 96)`}>
          {who === 'avik' && <AvikHair back />}
          <circle cx={58} cy={98} r={9} fill={look.skin} stroke={INK} strokeWidth={4} />
          <circle cx={142} cy={98} r={9} fill={look.skin} stroke={INK} strokeWidth={4} />
          <ellipse cx={100} cy={94} rx={42} ry={44} fill={look.skin} stroke={INK} strokeWidth={5} />
          <ellipse cx={68} cy={108} rx={6.5} ry={4} fill={look.cheek} opacity={0.35} />
          <ellipse cx={132} cy={108} rx={6.5} ry={4} fill={look.cheek} opacity={0.35} />
          {who === 'bryan' ? <BryanFace pose={pose} /> : <AvikFace pose={pose} />}
          {who === 'bryan' ? <BryanHair /> : <AvikHair back={false} />}
        </g>

        {who === 'bryan' && pose !== 'attack' && <Football cx={160} cy={196} />}
      </svg>
    </div>
  )
}

