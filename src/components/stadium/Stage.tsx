import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, type Transition } from 'motion/react'
import type { DefenderId } from '../../data/stadium'
import type { MascotMood } from '../../data/types'
import { Defender, type DefenderPose } from '../Defenders'
import { Mascot } from '../Mascot'
import { EffectView, type Effect } from './Effects'
import { PitchLayer, StandsLayer, WORLD_H, WORLD_W, type CrowdMood } from './Environment'

/**
 * The stadium stage: a camera looking at the world (the stadium image's 926 x 675 space).
 * Everything that moves is described by plain state; motion tweens between states, so the page can
 * direct a scene by setting targets and waiting.
 */

type Coord = number | number[]

export interface Move {
  x: Coord
  y: Coord
  /** how long the tween to these targets takes, in seconds */
  dur?: number
  ease?: Transition['ease']
  rot?: Coord
  opacity?: number
  /** keyframe timings (0..1) when x / y are arrays */
  times?: number[]
}

export interface LauderActor extends Move {
  mood: MascotMood
  stride: boolean
}

export interface DefenderActor extends Move {
  pose: DefenderPose
  stride: boolean
  blur?: boolean
}

export interface BallActor extends Move {
  /** height above the ground, which lifts the ball and shrinks its shadow */
  h: Coord
  spin: number
  dribble: boolean
}

export interface Camera {
  cx: number
  cy: number
  zoom: number
  dur?: number
}

export interface Scene {
  camera: Camera
  lauder: LauderActor
  ball: BallActor
  defenders: Partial<Record<DefenderId, DefenderActor>>
  effects: Effect[]
  crowd: CrowdMood
  flash: boolean
  ripple: boolean
  /** bump to shake the camera */
  shake: number
}

const LAUDER_SIZE = 56
const DEFENDER_SIZE = 56
/** the feet sit this far down a character's box */
const FEET = 0.93

const map = (c: Coord, f: (v: number) => number): Coord => (Array.isArray(c) ? c.map(f) : f(c))
const last = (c: Coord): number => (Array.isArray(c) ? c[c.length - 1] : c)

function transitionOf(m: Move): Transition {
  return { duration: m.dur ?? 0.5, ease: m.ease ?? 'easeInOut', times: m.times }
}

/** The stage's size in pixels, kept up to date. */
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, ...size }
}

function Shadow({ x, y, w, dur, opacity = 0.28 }: { x: Coord; y: Coord; w: number; dur: Transition; opacity?: number }) {
  // the sun sits high on the left, so shadows fall a little to the right
  return (
    <motion.div
      className="pointer-events-none absolute rounded-[50%] bg-black"
      style={{ left: 0, top: 0, width: w, height: w * 0.22, zIndex: 1, filter: 'blur(1.5px)' }}
      initial={false}
      animate={{ x: map(x, (v) => v - w / 2 + w * 0.12), y: map(y, (v) => v - w * 0.11), opacity }}
      transition={dur}
    />
  )
}

function Ball({ b }: { b: BallActor }) {
  const t = transitionOf(b)
  const lift = Array.isArray(b.h) ? b.h : [b.h]
  const ys = Array.isArray(b.y) ? b.y : [b.y]
  // combine the ground position and the height into one screen position
  const screenY = (Array.isArray(b.h) || Array.isArray(b.y))
    ? Array.from({ length: Math.max(lift.length, ys.length) }, (_, i) => (ys[Math.min(i, ys.length - 1)] ?? 0) - (lift[Math.min(i, lift.length - 1)] ?? 0) - 7)
    : last(b.y) - last(b.h) - 7
  const shadowScale = Math.max(0.35, 1 - last(b.h) / 90)
  return (
    <>
      <motion.div
        className="pointer-events-none absolute rounded-[50%] bg-black"
        style={{ left: 0, top: 0, width: 13, height: 4, filter: 'blur(1px)', zIndex: Math.round(last(b.y)) - 1 }}
        initial={false}
        animate={{ x: map(b.x, (v) => v - 5), y: map(b.y, (v) => v - 2), scale: shadowScale, opacity: 0.3 * shadowScale }}
        transition={t}
      />
      <motion.div className="pointer-events-none absolute" style={{ left: 0, top: 0, width: 13, height: 13, zIndex: Math.round(last(b.y)) + 2 }} initial={false} animate={{ x: map(b.x, (v) => v - 6.5), y: screenY }} transition={t}>
        <div className={b.dribble ? 'ball-dribble' : undefined}>
          <motion.svg width={13} height={13} viewBox="0 0 30 30" initial={false} animate={{ rotate: b.spin }} transition={t}>
            <circle cx={15} cy={15} r={13} fill="#fff" stroke="#241812" strokeWidth={2.5} />
            <path d="M15 9 l5.7 4.1 -2.2 6.7 h-7 l-2.2 -6.7 z" fill="#241812" />
            <path d="M15 9 V2 M20.7 13.1 L27 11 M18.5 19.8 L22 25.5 M11.5 19.8 L8 25.5 M9.3 13.1 L3 11" stroke="#241812" strokeWidth={1.8} />
          </motion.svg>
        </div>
      </motion.div>
    </>
  )
}

function Actor({ m, size, children }: { m: Move; size: number; children: ReactNode }) {
  const h = size * 1.1
  const t = transitionOf(m)
  return (
    <>
      <Shadow x={m.x} y={m.y} w={size * 0.7} dur={t} opacity={(m.opacity ?? 1) * 0.28} />
      <motion.div
        className="pointer-events-none absolute"
        style={{ left: 0, top: 0, width: size, height: h, zIndex: Math.round(last(m.y)), transformOrigin: '50% 90%' }}
        initial={false}
        animate={{ x: map(m.x, (v) => v - size / 2), y: map(m.y, (v) => v - h * FEET), rotate: m.rot ?? 0, opacity: m.opacity ?? 1 }}
        transition={t}
      >
        {children}
      </motion.div>
    </>
  )
}

export function Stage({ scene, overlay, className = '' }: { scene: Scene; overlay?: ReactNode; className?: string }) {
  const { ref, w, h } = useSize<HTMLDivElement>()
  const { camera } = scene
  // fit the world so it always covers the stage, then zoom and pan, keeping the camera inside the image
  const base = w && h ? Math.max(w / WORLD_W, h / WORLD_H) : 1
  const s = base * camera.zoom
  const hw = w / (2 * s)
  const hh = h / (2 * s)
  const cx = 2 * hw >= WORLD_W ? WORLD_W / 2 : Math.min(Math.max(camera.cx, hw), WORLD_W - hw)
  const cy = 2 * hh >= WORLD_H ? WORLD_H / 2 : Math.min(Math.max(camera.cy, hh), WORLD_H - hh)
  const cam: Transition = { duration: camera.dur ?? 0.8, ease: [0.4, 0, 0.2, 1] }

  return (
    <div ref={ref} className={`relative overflow-hidden bg-[#7ec3f0] select-none ${className}`}>
      {w > 0 && (
        <motion.div
          key={scene.shake}
          className="absolute inset-0"
          initial={false}
          animate={scene.shake ? { x: [0, -7, 6, -5, 4, -2, 0], y: [0, 4, -3, 2, -2, 1, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute top-0 left-0"
            style={{ width: WORLD_W, height: WORLD_H, transformOrigin: '0 0', willChange: 'transform' }}
            initial={false}
            animate={{ x: w / 2 - cx * s, y: h / 2 - cy * s, scale: s }}
            transition={cam}
          >
            {/* the stands drift a little slower than the pitch, which gives the picture depth */}
            <motion.div className="absolute inset-0" style={{ transformOrigin: '50% 50%' }} initial={false} animate={{ x: (cx - WORLD_W / 2) * 0.1, scale: 1.06 }} transition={cam}>
              <StandsLayer crowd={scene.crowd} flash={scene.flash} />
            </motion.div>
            <PitchLayer ripple={scene.ripple} />

            <div className="absolute inset-0">
              {Object.entries(scene.defenders).map(([id, d]) =>
                d ? (
                  <Actor key={id} m={d} size={DEFENDER_SIZE}>
                    <div style={{ filter: d.blur ? 'blur(1.2px)' : undefined }}>
                      <Defender who={id as DefenderId} pose={d.pose} size={DEFENDER_SIZE} stride={d.stride} />
                    </div>
                  </Actor>
                ) : null,
              )}
              <Actor m={scene.lauder} size={LAUDER_SIZE}>
                <Mascot mood={scene.lauder.mood} size={LAUDER_SIZE} stride={scene.lauder.stride} />
              </Actor>
              <Ball b={scene.ball} />
              <div className="pointer-events-none absolute inset-0" style={{ zIndex: 900 }}>
                <AnimatePresence>
                  {scene.effects.map((e) => (
                    <EffectView key={e.id} e={e} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {overlay}
    </div>
  )
}
