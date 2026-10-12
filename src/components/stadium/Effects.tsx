import { motion } from 'motion/react'
import { GOAL_LINE_RIGHT } from './Environment'

/** The superpower effects, drawn in world coordinates (the same 926 x 675 space as the stadium image). */
export type Effect =
  | { id: number; kind: 'firewall'; x: number; y: number }
  | { id: number; kind: 'ice-wall'; x: number; y: number }
  | { id: number; kind: 'ice-block'; x: number; y: number }
  | { id: number; kind: 'pixels'; x: number; y: number }
  | { id: number; kind: 'vortex'; x: number; y: number }
  | { id: number; kind: 'magnet'; x1: number; x2: number; y: number; flipped: boolean }
  | { id: number; kind: 'shockwave'; x: number; y: number }
  | { id: number; kind: 'shield' }
  | { id: number; kind: 'speed'; x: number; y: number; dir: 1 | -1 }
  | { id: number; kind: 'shards'; x: number; y: number; color: string }
  | { id: number; kind: 'sparkle'; x: number; y: number }

/** Pieces flying apart: a broken firewall, ice or shield. */
function Shards({ x, y, color, seed }: { x: number; y: number; color: string; seed: number }) {
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const a = ((i * 137.5 + seed * 31) % 360) * (Math.PI / 180)
        const d = 28 + ((i * 53 + seed) % 30)
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: x, top: y, width: 6 + (i % 3) * 3, height: 8 + (i % 4) * 3, background: color, clipPath: 'polygon(50% 0, 100% 60%, 30% 100%, 0 40%)', boxShadow: `0 0 6px ${color}` }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8 + 18, rotate: (i % 2 ? 1 : -1) * 260, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )
      })}
    </>
  )
}

export function EffectView({ e }: { e: Effect }) {
  switch (e.kind) {
    case 'firewall':
      // a blazing hexagon force field
      return (
        <motion.div
          className="absolute"
          style={{ left: e.x - 13, top: e.y - 92, width: 26, height: 96, transformOrigin: '50% 100%' }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <svg width={26} height={96} viewBox="0 0 26 96" overflow="visible">
            <defs>
              <linearGradient id={`fw-${e.id}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#ff3b1f" stopOpacity={0.9} />
                <stop offset="0.6" stopColor="#ff8a2f" stopOpacity={0.75} />
                <stop offset="1" stopColor="#ffd84a" stopOpacity={0.3} />
              </linearGradient>
              <pattern id={`hex-${e.id}`} width="10" height="9" patternUnits="userSpaceOnUse">
                <path d="M2.5 0 H7.5 L10 4.5 L7.5 9 H2.5 L0 4.5 Z" fill="none" stroke="#fff3c4" strokeWidth={0.8} opacity={0.7} />
              </pattern>
            </defs>
            <rect x={0} y={0} width={26} height={96} rx={10} fill={`url(#fw-${e.id})`} style={{ filter: 'drop-shadow(0 0 8px #ff6a2f)' }} />
            <rect x={0} y={0} width={26} height={96} rx={10} fill={`url(#hex-${e.id})`} />
            <g className="flame-flicker">
              <path d="M4 4 q4 -12 8 -2 q3 -10 7 0 q3 -8 5 2" fill="#ffd84a" opacity={0.8} />
            </g>
          </svg>
        </motion.div>
      )
    case 'ice-wall':
      return (
        <motion.div
          className="absolute"
          style={{ left: e.x - 20, top: e.y - 70, width: 40, height: 74, transformOrigin: '50% 100%' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <svg width={40} height={74} viewBox="0 0 40 74" overflow="visible">
            <path d="M2 74 L6 22 L14 34 L18 2 L24 30 L30 12 L34 40 L38 74 Z" fill="#bfeaff" fillOpacity={0.75} stroke="#4cb8e8" strokeWidth={2} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px #7fdcff)' }} />
            <path d="M18 8 L20 40 M30 18 L28 50 M8 30 L10 60" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" opacity={0.85} />
          </svg>
        </motion.div>
      )
    case 'ice-block':
      return (
        <motion.div
          className="absolute rounded-md border-2 border-[#4cb8e8] bg-[#bfeaff]/60"
          style={{ left: e.x - 30, top: e.y - 70, width: 60, height: 72, boxShadow: '0 0 12px #7fdcff, inset 0 0 12px #ffffff' }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute top-2 left-2 h-8 w-1.5 rotate-12 rounded bg-white/80" />
          <div className="absolute top-3 left-5 h-4 w-1 rotate-12 rounded bg-white/70" />
        </motion.div>
      )
    case 'pixels':
      return (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: e.x, top: e.y, width: 5, height: 5, background: i % 3 === 0 ? '#ff4fd8' : i % 3 === 1 ? '#3ef08b' : '#45e0ff' }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 30, opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            )
          })}
        </>
      )
    case 'vortex':
      return (
        <motion.div className="absolute" style={{ left: e.x - 50, top: e.y - 16, width: 100, height: 32 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-[50%] border-2"
              style={{ borderColor: i === 1 ? '#e2c9ff' : '#a970ff', margin: i * 8, boxShadow: '0 0 10px #a970ff' }}
              animate={{ rotate: i % 2 ? -360 : 360 }}
              transition={{ duration: 1.2 - i * 0.2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`p${i}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#e2c9ff]"
              style={{ left: 20 + i * 15, top: 14 }}
              animate={{ y: [-2, -40], opacity: [1, 0] }}
              transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </motion.div>
      )
    case 'magnet': {
      const left = Math.min(e.x1, e.x2)
      const w = Math.abs(e.x2 - e.x1)
      return (
        <motion.svg className="absolute overflow-visible" style={{ left, top: e.y - 40, width: w, height: 50 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              className="magnet-dash"
              d={`M0 ${40} Q${w / 2} ${12 - i * 14} ${w} ${40}`}
              fill="none"
              stroke={(i % 2 === 0) !== e.flipped ? '#ff5a4f' : '#2f6fe0'}
              strokeWidth={2.5}
              strokeDasharray="6 5"
              style={{ filter: 'drop-shadow(0 0 3px #ffffff)' }}
            />
          ))}
        </motion.svg>
      )
    }
    case 'shockwave':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-[50%] border-[3px] border-[#ff8a3d]"
              style={{ left: e.x - 10, top: e.y - 4, width: 20, height: 8, boxShadow: '0 0 8px #ff8a3d' }}
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 9, opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
            />
          ))}
        </>
      )
    case 'shield':
      // a crackling energy dome over the whole goal mouth
      return (
        <motion.div
          className="absolute"
          style={{ left: GOAL_LINE_RIGHT - 34, top: 438, width: 54, height: 140 }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
        >
          <svg width={54} height={140} viewBox="0 0 54 140" overflow="visible">
            <defs>
              <pattern id={`sh-${e.id}`} width="9" height="8" patternUnits="userSpaceOnUse">
                <path d="M2.2 0 H6.8 L9 4 L6.8 8 H2.2 L0 4 Z" fill="none" stroke="#dffbff" strokeWidth={0.7} />
              </pattern>
            </defs>
            <path d="M50 136 Q-10 70 50 4" fill="#5ee6ff" fillOpacity={0.35} stroke="#5ee6ff" strokeWidth={3} style={{ filter: 'drop-shadow(0 0 8px #5ee6ff)' }} />
            <path d="M50 136 Q-10 70 50 4" fill={`url(#sh-${e.id})`} />
          </svg>
        </motion.div>
      )
    case 'speed':
      return (
        <motion.div className="absolute" style={{ left: e.x - 40, top: e.y - 50, width: 80, height: 50 }} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute h-[3px] rounded-full bg-white"
              style={{ top: 6 + i * 9, width: 30 + (i % 3) * 14, boxShadow: '0 0 6px #5ee6ff' }}
              initial={{ x: e.dir > 0 ? 0 : 60 }}
              animate={{ x: e.dir > 0 ? 50 : -10 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </motion.div>
      )
    case 'shards':
      return <Shards x={e.x} y={e.y} color={e.color} seed={e.id} />
    case 'sparkle':
      return (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rotate-45 bg-sun-300"
                style={{ left: e.x, top: e.y, boxShadow: '0 0 6px #ffd84a' }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{ x: Math.cos(a) * 26, y: Math.sin(a) * 22, scale: [0, 1.2, 0] }}
                transition={{ duration: 0.6 }}
              />
            )
          })}
        </>
      )
  }
}
