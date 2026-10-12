import { memo } from 'react'
import stadiumUrl from '../../assets/stadium.png'

/**
 * The stadium, built on the supplied stadium image (926 x 675, its native size is the world size).
 * The stands layer and the pitch layer are both cut from that image: the stands drift a little slower
 * than the pitch when the camera moves (parallax), and the LED boards hide the seam between them.
 * On top: a crowd, floodlights, drifting clouds, goal lines and goals, and lighting.
 */

export const WORLD_W = 926
export const WORLD_H = 675
/** where the pitch starts in the image (the bottom of the fence) */
const PITCH_TOP = 414
/** the goal lines we draw (the image crops the pitch at both ends) */
export const GOAL_LINE_RIGHT = 884
export const GOAL_LINE_LEFT = WORLD_W - GOAL_LINE_RIGHT

export type CrowdMood = 'idle' | 'cheer' | 'groan' | 'wave'

/** A small seeded random, so the crowd looks the same on every render. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SHIRTS = ['#e8692a', '#2f8f46', '#e9e6df', '#e0b23a', '#e8692a', '#4f86c6', '#2f8f46', '#3a3743', '#3a3743']
const SKINS = ['#f1c6a0', '#c88b5f', '#7a4a2c', '#e0ac7e', '#a96f45', '#f6d3b3']
const BANDS = 12

interface Fan {
  x: number
  y: number
  shirt: string
  skin: string
  scarf: boolean
}

/** Fans in the seats, grouped into vertical bands so they can bob, jump and do the wave together. */
const FANS: Fan[][] = (() => {
  const rand = seeded(7)
  const bands: Fan[][] = Array.from({ length: BANDS }, () => [])
  for (let row = 0; row < 8; row++) {
    const y = 250 + row * 20.5
    for (let x = 8; x < WORLD_W - 4; x += 19) {
      // leave the two aisles (the stairs in the image) and a few empty seats
      if ((x > 292 && x < 356) || (x > 652 && x < 716)) continue
      if (rand() < 0.5) continue
      const fan = { x: x + rand() * 4 - 2, y, shirt: SHIRTS[Math.floor(rand() * SHIRTS.length)], skin: SKINS[Math.floor(rand() * SKINS.length)], scarf: rand() < 0.18 }
      bands[Math.min(BANDS - 1, Math.floor((x / WORLD_W) * BANDS))].push(fan)
    }
  }
  return bands
})()

const Crowd = memo(function Crowd({ mood }: { mood: CrowdMood }) {
  return (
    <svg className={`fans fans-${mood} pointer-events-none absolute inset-0`} width={WORLD_W} height={WORLD_H} viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} aria-hidden>
      {FANS.map((band, i) => (
        <g key={i} className="fan-band" style={{ ['--band' as string]: i, animationDelay: mood === 'wave' ? `${i * 0.11}s` : `${-(i * 0.37) % 1.4}s` }}>
          {band.map((f, k) => (
            <g key={k}>
              <rect x={f.x - 6.5} y={f.y - 1} width={13} height={10} rx={4} fill={f.shirt} stroke="#1d1b22" strokeWidth={1.2} />
              <circle cx={f.x} cy={f.y - 6} r={4.6} fill={f.skin} stroke="#1d1b22" strokeWidth={1.2} />
              {f.scarf && <rect x={f.x - 9} y={f.y - 15} width={18} height={4} rx={2} fill="#f76f22" stroke="#1d1b22" strokeWidth={1} />}
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
})

function Floodlight({ x, flash }: { x: number; flash: boolean }) {
  return (
    <g>
      <rect x={x - 3} y={186} width={6} height={50} fill="#4b4f5a" stroke="#1d1b22" strokeWidth={1.5} />
      <path d={`M${x - 3} 194 L${x + 3} 214 M${x + 3} 194 L${x - 3} 214`} stroke="#2f323a" strokeWidth={1.2} />
      <circle cx={x} cy={172} r={flash ? 92 : 64} fill="url(#flood-glow)" className={flash ? 'flood-flash' : undefined} style={{ mixBlendMode: 'screen' }} />
      <rect x={x - 27} y={158} width={54} height={28} rx={4} fill="#2f323a" stroke="#1d1b22" strokeWidth={2} />
      {[0, 1].map((r) =>
        [0, 1, 2, 3].map((c) => <circle key={`${r}${c}`} cx={x - 18 + c * 12} cy={166 + r * 12} r={4.4} fill="#fffbe6" stroke="#c9c19a" strokeWidth={1} />),
      )}
    </g>
  )
}

/** The stands half of the image, plus everything that lives up there. */
export const StandsLayer = memo(function StandsLayer({ crowd, flash }: { crowd: CrowdMood; flash: boolean }) {
  return (
    <div className="absolute inset-0" style={{ width: WORLD_W, height: WORLD_H }}>
      <img src={stadiumUrl} alt="" draggable={false} className="absolute inset-0 select-none" style={{ width: WORLD_W, height: WORLD_H, maxWidth: 'none' }} />
      {/* two extra clouds drift slowly across the sky */}
      <svg className="pointer-events-none absolute inset-0" width={WORLD_W} height={WORLD_H} aria-hidden>
        <g className="cloud-drift" opacity={0.85}>
          <path d="M120 120 q10 -22 34 -14 q12 -18 34 -4 q24 -4 24 18 q-4 14 -22 12 h-62 q-18 0 -8 -12 z" fill="#ffffff" />
        </g>
        <g className="cloud-drift-slow" opacity={0.7}>
          <path d="M640 62 q8 -16 26 -10 q10 -14 26 -2 q18 -2 18 13 q-3 10 -16 9 h-46 q-14 0 -8 -10 z" fill="#ffffff" />
        </g>
      </svg>
      <Crowd mood={crowd} />
      <svg className="pointer-events-none absolute inset-0" width={WORLD_W} height={WORLD_H} aria-hidden>
        <defs>
          <radialGradient id="flood-glow">
            <stop offset="0" stopColor="#fffbe6" stopOpacity={0.95} />
            <stop offset="0.35" stopColor="#fff3b0" stopOpacity={0.45} />
            <stop offset="1" stopColor="#fff3b0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <Floodlight x={24} flash={flash} />
        <Floodlight x={WORLD_W - 24} flash={flash} />
      </svg>
    </div>
  )
})

/** LED advertising boards along the bottom of the fence. */
function AdBoards() {
  const text = 'BYTEBREW   JAVA   ICS3UR   LEARN ONE BYTE AT A TIME   '
  return (
    <div className="absolute overflow-hidden border-y-2 border-[#15131b] bg-[#1d1b22]" style={{ left: 0, top: PITCH_TOP - 18, width: WORLD_W, height: 20 }}>
      <div className="led-scroll flex whitespace-nowrap font-display text-[12px] leading-[16px] font-bold tracking-[0.3em] text-brew-400" style={{ width: 'max-content' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="px-2">
            {text}
            <span className="text-mint-400">{text}</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_153px,#15131b_153px_156px)]" />
    </div>
  )
}

/** A goal seen from the side of the pitch, with a net that ripples when a shot goes in. */
function Goal({ mirror = false, ripple = false }: { mirror?: boolean; ripple?: boolean }) {
  return (
    <g transform={mirror ? `translate(${WORLD_W} 0) scale(-1 1)` : undefined}>
      <g className={ripple ? 'net-ripple' : undefined} style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}>
        {/* net: side, roof and back */}
        <path d="M884 514 L918 522 L918 568 L884 566 Z" fill="url(#net)" stroke="#e8eef2" strokeWidth={1} opacity={0.9} />
        <path d="M880 459 L914 470 L918 522 L884 514 Z" fill="url(#net)" stroke="#e8eef2" strokeWidth={1} opacity={0.75} />
        <path d="M880 505 L914 512 L914 470 L880 459 Z" fill="url(#net)" stroke="#e8eef2" strokeWidth={1} opacity={0.6} />
      </g>
      {/* posts and crossbar */}
      <path d="M880 505 L880 459 L884 514 L884 566" fill="none" stroke="#1d1b22" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M880 505 L880 459 L884 514 L884 566" fill="none" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx={884} cy={567} rx={5} ry={2} fill="#1d1b22" opacity={0.3} />
    </g>
  )
}

/** The pitch half of the image, with lighting, goal lines, goals and boards on top. */
export const PitchLayer = memo(function PitchLayer({ ripple }: { ripple: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ width: WORLD_W, height: WORLD_H }}>
      <img
        src={stadiumUrl}
        alt=""
        draggable={false}
        className="absolute inset-0 select-none"
        style={{ width: WORLD_W, height: WORLD_H, maxWidth: 'none', clipPath: `inset(${PITCH_TOP}px 0 0 0)` }}
      />
      {/* lighting: the stand's shadow, sunshine, a mowed texture, and a soft vignette */}
      <div className="absolute" style={{ left: 0, top: PITCH_TOP, width: WORLD_W, height: 70, background: 'linear-gradient(rgba(16,32,8,0.38), rgba(16,32,8,0))' }} />
      <div className="absolute" style={{ left: 0, top: PITCH_TOP, width: WORLD_W, height: WORLD_H - PITCH_TOP, background: 'repeating-linear-gradient(112deg, rgba(255,255,255,0.035) 0 7px, rgba(0,0,0,0.02) 7px 14px)' }} />
      <div className="absolute" style={{ left: 0, top: PITCH_TOP, width: WORLD_W, height: WORLD_H - PITCH_TOP, background: 'radial-gradient(ellipse 60% 70% at 55% 35%, rgba(255,248,200,0.22), rgba(255,248,200,0) 70%)', mixBlendMode: 'soft-light' }} />
      <svg className="absolute inset-0" width={WORLD_W} height={WORLD_H} aria-hidden>
        <defs>
          <pattern id="net" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 6 M6 0 L0 6" stroke="#ffffff" strokeWidth={0.8} opacity={0.8} />
          </pattern>
          <linearGradient id="byline" x1="0" x2="1">
            <stop offset="0" stopColor="#5f8f2a" />
            <stop offset="1" stopColor="#4d7a22" />
          </linearGradient>
        </defs>
        {/* behind each goal line: the grass past the end of the pitch */}
        <rect x={GOAL_LINE_RIGHT} y={PITCH_TOP} width={WORLD_W - GOAL_LINE_RIGHT} height={WORLD_H - PITCH_TOP} fill="url(#byline)" />
        <rect x={0} y={PITCH_TOP} width={GOAL_LINE_LEFT} height={WORLD_H - PITCH_TOP} fill="url(#byline)" />
        <path d={`M${GOAL_LINE_RIGHT} 437 V662 M${GOAL_LINE_LEFT} 437 V662`} stroke="#ffffff" strokeWidth={2.4} />
        <Goal ripple={ripple} />
        <Goal mirror />
      </svg>
      <AdBoards />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 75% at 50% 55%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.22))' }} />
    </div>
  )
})
