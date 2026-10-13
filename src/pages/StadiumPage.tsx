import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Link } from 'react-router'
import { AppIcon } from '../components/AppIcon'
import { Button, ButtonLink } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { Defender } from '../components/Defenders'
import { Mascot } from '../components/Mascot'
import { Md } from '../components/Md'
import { shuffledOrder } from '../components/questions/types'
import type { Effect } from '../components/stadium/Effects'
import { Stage, type BallActor, type Camera, type DefenderActor, type LauderActor, type Scene } from '../components/stadium/Stage'
import { getUnit, UNITS } from '../data/curriculum'
import { DEFENDERS, LAUDER_LINES, pickFrom, type DefenderId, type StadiumMoment } from '../data/stadium'
import type { IconName } from '../data/types'
import { answerXp } from '../engine/gamification'
import {
  accuracy,
  answer,
  currentDefender,
  DEFENDER_COUNT,
  defendersBeaten,
  finalScore,
  isKeeper,
  lifetimeUnitCounts,
  pickQuestion,
  POSSESSIONS,
  rating,
  stadiumPool,
  stadiumQuestion,
  startMatch,
  unitsCovered,
  type MatchState,
  type Play,
  type PoolQuestion,
} from '../engine/stadium'
import { celebrate } from '../lib/motion'
import { stadiumSound } from '../lib/stadiumSound'
import { useProgress } from '../state/hooks'
import { store, type Reward } from '../state/store'

// ------------------------------------------------------------------ the pitch plan (world coordinates)

const LANE = 604
const START = { x: 70, y: LANE }
const SPOTS = Array.from({ length: DEFENDER_COUNT }, (_, i) => ({ x: 178 + i * 88, y: [586, 612, 590, 616, 588, 610, 594][i] }))
const KEEPER_HOME = { x: 862, y: 545 }
const SHOT_SPOT = { x: 782, y: 590 }
const OVERVIEW: Camera = { cx: 463, cy: 470, zoom: 1, dur: 1 }
/** the camera stops at the bottom edge of the stadium image, so this means "as low as it goes" */
const WORLD_BOTTOM = 675

class Cancelled extends Error {}

function lobbyScene(lineup: DefenderId[]): Scene {
  const defenders: Scene['defenders'] = {}
  lineup.forEach((id, i) => {
    const home = i < DEFENDER_COUNT ? SPOTS[i] : KEEPER_HOME
    defenders[id] = { x: home.x, y: home.y, pose: 'idle', stride: false, dur: 0.6 }
  })
  return {
    camera: OVERVIEW,
    lauder: { x: START.x, y: START.y, mood: 'happy', stride: false, dur: 0.6 },
    ball: { x: START.x + 15, y: START.y + 2, h: 0, spin: 0, dribble: false, dur: 0.6 },
    defenders,
    effects: [],
    crowd: 'idle',
    flash: false,
    ripple: false,
    shake: 0,
  }
}

function homeOf(match: MatchState, id: DefenderId) {
  const i = match.lineup.indexOf(id)
  return i < DEFENDER_COUNT ? SPOTS[i] : KEEPER_HOME
}

// ------------------------------------------------------------------ small UI pieces

const TILE: Record<'brew' | 'sun' | 'mint' | 'sky' | 'berry' | 'espresso', string> = {
  brew: 'bg-brew-100 text-brew-600',
  sun: 'bg-sun-100 text-sun-700',
  mint: 'bg-mint-100 text-mint-700',
  sky: 'bg-sky-100 text-sky-700',
  berry: 'bg-berry-100 text-berry-600',
  espresso: 'bg-espresso-100 text-espresso-600',
}

function IconTile({ icon, tone, size = 36 }: { icon: IconName; tone: keyof typeof TILE; size?: number }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-xl ${TILE[tone]}`} style={{ width: size, height: size }}>
      <AppIcon name={icon} size={size * 0.55} strokeWidth={2.4} />
    </span>
  )
}

function Stat({ icon, tone, label, value }: { icon: IconName; tone: keyof typeof TILE; label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-espresso-100 bg-white p-3 text-center">
      <div className="mb-1 flex justify-center">
        <IconTile icon={icon} tone={tone} size={34} />
      </div>
      <div className="font-display text-2xl font-bold text-espresso-900">{value}</div>
      <div className="text-xs font-extrabold tracking-wide text-espresso-400 uppercase">{label}</div>
    </div>
  )
}

/** Which units this match has covered: done, still to come, or not studied yet. */
function UnitCoverage({ match, available }: { match: MatchState | null; available: string[] }) {
  const counts: Record<string, number> = {}
  for (const a of match?.asked ?? []) counts[a.unitId] = (counts[a.unitId] ?? 0) + 1
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Units covered this match">
      {UNITS.map((u) => {
        const n = counts[u.id] ?? 0
        const open = available.includes(u.id)
        return (
          <span
            key={u.id}
            title={`Unit ${u.number}: ${u.title}${open ? '' : ' (not studied yet)'}`}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
              n ? 'bg-mint-100 text-mint-800' : open ? 'bg-espresso-50 text-espresso-500' : 'bg-espresso-50 text-espresso-300'
            }`}
          >
            {n ? <AppIcon name="check-circle" size={12} /> : open ? null : <AppIcon name="shield" size={12} />}U{u.number}
            {n > 1 && <span className="opacity-70">x{n}</span>}
          </span>
        )
      })}
    </div>
  )
}

function Portrait({ who, size = 34 }: { who: DefenderId | 'lauder'; size?: number }) {
  return who === 'lauder' ? <Mascot mood="happy" size={size} /> : <Defender who={who} pose="idle" size={size} />
}

// ------------------------------------------------------------------ the game

/** True on phone-sized screens, where the question needs more of the stage. */
function useNarrow(): boolean {
  const query = '(max-width: 639px)'
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setNarrow(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return narrow
}

/** One line that says what an answer did on the pitch. */
function resultLine(play: Play): string {
  const d = DEFENDERS[play.defender]
  if (play.goal) return `GOAL! +${play.points} points`
  if (play.correct) return `${d.skill}! Past ${d.name}. +${play.points}`
  if (play.turnover) return `${d.name} wins the ball.`
  return `${d.powerName}! You lose a possession.`
}

type Phase = 'lobby' | 'kickoff' | 'approach' | 'duel' | 'playing' | 'feedback' | 'results'

interface Speech {
  who: DefenderId | 'lauder'
  text: string
  key: number
}

interface Caption {
  title: string
  sub?: string
  tone: 'good' | 'bad' | 'goal'
  key: number
}

function StadiumGame({ pool }: { pool: PoolQuestion[] }) {
  const p = useProgress()
  const available = useMemo(() => [...new Set(pool.map((q) => q.unitId))], [pool])
  const [match, setMatch] = useState<MatchState>(() => startMatch())
  const [scene, setScene] = useState<Scene>(() => lobbyScene(match.lineup))
  const [phase, setPhase] = useState<Phase>('lobby')
  const [question, setQuestion] = useState<PoolQuestion | null>(null)
  const [order, setOrder] = useState(() => shuffledOrder(4))
  const [picked, setPicked] = useState<number | null>(null)
  const [play, setPlay] = useState<Play | null>(null)
  const [speech, setSpeech] = useState<Speech | null>(null)
  const [caption, setCaption] = useState<Caption | null>(null)
  const [xp, setXp] = useState(0)
  const [panelOpen, setPanelOpen] = useState(true)
  const narrow = useNarrow()
  const narrowRef = useRef(narrow)
  narrowRef.current = narrow
  const stageRef = useRef<HTMLDivElement>(null)
  const [reward, setReward] = useState<Reward | null>(null)
  const token = useRef(0)
  const ids = useRef(1)
  const lastLine = useRef<Record<string, string>>({})
  const matchRef = useRef(match)
  matchRef.current = match

  // ---------------------------------------------------------------- directing helpers

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const t = token.current
        setTimeout(() => (token.current === t ? resolve() : reject(new Cancelled())), ms)
      }),
    [],
  )
  const lauder = (patch: Partial<LauderActor>) => setScene((s) => ({ ...s, lauder: { ...s.lauder, ...patch } }))
  const ball = (patch: Partial<BallActor>) => setScene((s) => ({ ...s, ball: { ...s.ball, ...patch } }))
  const defender = (id: DefenderId, patch: Partial<DefenderActor>) =>
    setScene((s) => ({ ...s, defenders: { ...s.defenders, [id]: { ...s.defenders[id]!, ...patch } } }))
  const camera = (c: Camera) => setScene((s) => ({ ...s, camera: c }))
  const crowd = (mood: Scene['crowd']) => setScene((s) => ({ ...s, crowd: mood }))
  const shake = () => setScene((s) => ({ ...s, shake: s.shake + 1 }))
  const addEffect = (e: Effect extends infer T ? (T extends Effect ? Omit<T, 'id'> : never) : never): number => {
    const id = ids.current++
    setScene((s) => ({ ...s, effects: [...s.effects, { ...e, id } as Effect] }))
    return id
  }
  const updateEffect = (id: number, patch: Partial<Effect>) => setScene((s) => ({ ...s, effects: s.effects.map((e) => (e.id === id ? ({ ...e, ...patch } as Effect) : e)) }))
  const removeEffect = (id: number) => setScene((s) => ({ ...s, effects: s.effects.filter((e) => e.id !== id) }))
  /** a short effect that cleans itself up */
  const burst = (e: Parameters<typeof addEffect>[0], ms = 900) => {
    const id = addEffect(e)
    setTimeout(() => removeEffect(id), ms)
  }

  const say = (who: DefenderId | 'lauder', lines: string[]) => {
    const text = pickFrom(lines, lastLine.current[who])
    lastLine.current[who] = text
    const key = ids.current++
    setSpeech({ who, text, key })
    setTimeout(() => setSpeech((s) => (s?.key === key ? null : s)), 3800)
  }
  const sayAs = (id: DefenderId, moment: StadiumMoment) => say(id, DEFENDERS[id].lines[moment])
  const show = (title: string, tone: Caption['tone'], sub?: string, ms = 1700) => {
    const key = ids.current++
    setCaption({ title, sub, tone, key })
    setTimeout(() => setCaption((c) => (c?.key === key ? null : c)), ms)
  }
  const footsteps = (seconds: number) => {
    const n = Math.floor((seconds * 1000) / 270)
    for (let i = 0; i < n; i++) setTimeout(() => stadiumSound.step(), i * 270)
  }

  /** Run a scripted sequence; restarting or leaving the page cancels it cleanly. */
  const direct = useCallback(async (fn: () => Promise<void>) => {
    try {
      await fn()
    } catch (e) {
      if (!(e instanceof Cancelled)) throw e
    }
  }, [])

  useEffect(
    () => () => {
      token.current++
      stadiumSound.stopCrowd()
    },
    [],
  )

  // the lobby: Bryan, Avik and the rest of the team take turns trash-talking
  useEffect(() => {
    if (phase !== 'lobby') return
    const order: DefenderId[] = ['bryan', 'avik', ...match.lineup.slice(2)]
    let i = 0
    sayAs(order[0], 'intro')
    const id = setInterval(() => {
      i = (i + 1) % order.length
      sayAs(order[i], 'intro')
    }, 3600)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, match.lineup])

  // ---------------------------------------------------------------- the match flow

  const nextQuestion = (m: MatchState) => {
    const q = pickQuestion(m, pool, lifetimeUnitCounts(store.getSnapshot()))
    setQuestion(q)
    setOrder(shuffledOrder(4))
    setPicked(null)
    setPlay(null)
    setPanelOpen(true)
    setPhase('duel')
  }

  /** Mr. Lauder dribbles up to the next defender, who steps in to block him. */
  const approach = (m: MatchState) =>
    direct(async () => {
      setPhase('approach')
      const id = currentDefender(m)
      const keeper = isKeeper(m)
      const target = keeper ? SHOT_SPOT : { x: SPOTS[m.encounter].x - 56, y: LANE }
      const from = scene.lauder
      const dist = Math.max(40, target.x - (Array.isArray(from.x) ? from.x[from.x.length - 1] : from.x))
      const dur = Math.max(0.8, dist / 150)
      lauder({ x: target.x, y: target.y, dur, ease: 'easeInOut', mood: 'happy', stride: true, rot: 0, times: undefined })
      setScene((s) => ({ ...s, ball: { x: target.x + 15, y: target.y + 2, h: 0, spin: s.ball.spin + dist * 5, dribble: true, dur, ease: 'easeInOut', times: undefined } }))
      camera({ cx: target.x + 70, cy: 610, zoom: 1.7, dur })
      footsteps(dur)
      await wait(dur * 400)
      const meet = keeper ? { x: KEEPER_HOME.x - 4, y: 556 } : { x: target.x + 58, y: LANE }
      defender(id, { x: meet.x, y: meet.y, stride: true, pose: 'idle', dur: dur * 0.6, rot: 0, times: undefined })
      await wait(dur * 600)
      lauder({ stride: false, mood: 'thinking' })
      ball({ dribble: false })
      defender(id, { stride: false, pose: 'taunt' })
      // a cinematic close-up for the one-on-one
      // the question sits over the top half of the pitch, so the camera keeps the players low in the frame
      camera({ cx: (target.x + meet.x) / 2, cy: WORLD_BOTTOM, zoom: narrowRef.current ? 1.35 : keeper ? 2 : 2.1, dur: 0.9 })
      sayAs(id, m.asked.some((a) => a.defender === id) ? 'taunt' : m.encounter < 2 ? 'taunt' : 'intro')
      await wait(500)
      nextQuestion(m)
    })

  const kickOff = () => {
    const m = startMatch()
    token.current++
    setMatch(m)
    setScene(lobbyScene(m.lineup))
    setXp(0)
    setReward(null)
    setQuestion(null)
    setPlay(null)
    setPicked(null)
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    void direct(async () => {
      setPhase('kickoff')
      stadiumSound.startCrowd()
      stadiumSound.whistle(1)
      stadiumSound.cheer(1)
      crowd('cheer')
      say('lauder', LAUDER_LINES.kickoff)
      show('KICK OFF!', 'good')
      camera({ cx: START.x + 120, cy: 610, zoom: 1.7, dur: 1.4 })
      await wait(1500)
      crowd('idle')
      await approach(m)
    })
  }

  // ---------------------------------------------------------------- what happens on a right answer

  /** Mr. Lauder skips past the defender, who is left behind looking dizzy. */
  const passBy = async (id: DefenderId, x: number) => {
    const m = matchRef.current
    const home = homeOf(m, id)
    defender(id, { pose: 'beaten', x: home.x + 10, y: 556, rot: 0, opacity: 0.9, dur: 0.7, blur: false, times: undefined })
    lauder({ x: x + 40, y: LANE, stride: true, mood: 'excited', dur: 0.6, rot: 0, times: undefined })
    setScene((s) => ({ ...s, ball: { ...s.ball, x: x + 55, y: LANE + 2, h: 0, dribble: true, dur: 0.6, ease: 'easeOut', times: undefined } }))
    await wait(650)
    lauder({ stride: false })
    ball({ dribble: false })
  }

  const beat = (id: DefenderId, lx: number, ly: number) =>
    direct(async () => {
      const d = DEFENDERS[id]
      const dx = lx + 58
      stadiumSound.power(d.power)
      defender(id, { pose: 'power' })
      switch (d.power) {
        case 'firewall': {
          const wall = addEffect({ kind: 'firewall', x: lx + 31, y: ly })
          await wait(450)
          lauder({ x: [lx, lx - 5, lx + 4, lx - 5, lx], dur: 0.6, times: [0, 0.25, 0.5, 0.75, 1], mood: 'excited' })
          await wait(600)
          stadiumSound.kick()
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, lx + 72, lx + 128], h: [0, 72, 0], y: ly + 2, times: [0, 0.5, 1], dur: 0.8, ease: 'easeOut', spin: s.ball.spin + 720 } }))
          lauder({ x: [lx, lx + 40, lx + 110], y: [ly, ly + 22, ly], times: [0, 0.5, 1], dur: 0.8, stride: true })
          await wait(380)
          removeEffect(wall)
          burst({ kind: 'shards', x: lx + 31, y: ly - 46, color: '#ff8a2f' })
          stadiumSound.shatter()
          await wait(450)
          await passBy(id, lx + 110)
          break
        }
        case 'speed': {
          defender(id, { blur: true })
          burst({ kind: 'speed', x: dx, y: ly, dir: -1 }, 600)
          defender(id, { x: lx + 10, dur: 0.22, ease: 'easeIn' })
          ball({ x: lx - 8, dur: 0.22 })
          await wait(240)
          // the Cruyff turn: drag it back, turn, and Avik flies straight past
          defender(id, { x: lx - 70, dur: 0.3, ease: 'easeOut', rot: -15 })
          await wait(150)
          stadiumSound.kick()
          setScene((s) => ({ ...s, ball: { ...s.ball, x: lx + 70, dur: 0.6, ease: 'easeOut', spin: s.ball.spin + 540 } }))
          lauder({ x: lx + 60, stride: true, dur: 0.6, mood: 'excited' })
          await wait(300)
          defender(id, { pose: 'beaten', blur: false })
          await wait(350)
          await passBy(id, lx + 60)
          break
        }
        case 'ice': {
          const a = addEffect({ kind: 'ice-wall', x: dx, y: ly - 26 })
          const b = addEffect({ kind: 'ice-wall', x: dx, y: ly + 30 })
          await wait(500)
          // the nutmeg: straight through the legs
          stadiumSound.kick()
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, dx, dx + 56], y: ly + 2, h: 0, times: [0, 0.5, 1], dur: 0.6, ease: 'linear', spin: s.ball.spin + 600 } }))
          lauder({ x: [lx, dx - 6, dx + 44], y: [ly, ly + 30, ly], times: [0, 0.5, 1], dur: 0.75, stride: true, mood: 'excited' })
          await wait(450)
          removeEffect(a)
          removeEffect(b)
          burst({ kind: 'shards', x: dx, y: ly - 50, color: '#9be3ff' })
          burst({ kind: 'shards', x: dx, y: ly + 4, color: '#9be3ff' })
          stadiumSound.shatter()
          defender(id, { pose: 'beaten', rot: 20 })
          await wait(400)
          await passBy(id, dx + 44)
          break
        }
        case 'teleport': {
          burst({ kind: 'pixels', x: dx, y: ly - 30 }, 700)
          defender(id, { opacity: 0, dur: 0.1 })
          await wait(160)
          defender(id, { x: lx + 30, y: ly, dur: 0 })
          await wait(40)
          defender(id, { opacity: 1, dur: 0.1 })
          burst({ kind: 'pixels', x: lx + 30, y: ly - 30 }, 700)
          await wait(300)
          // the roulette: spin around the defender who just appeared
          lauder({ x: [lx, lx + 24, lx + 62], y: [ly, ly - 26, ly], rot: [0, 180, 360], times: [0, 0.5, 1], dur: 0.6, mood: 'excited' })
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, lx + 40, lx + 76], y: [ly + 2, ly - 20, ly + 2], times: [0, 0.5, 1], dur: 0.6, spin: s.ball.spin + 360 } }))
          await wait(400)
          burst({ kind: 'pixels', x: lx + 30, y: ly - 30 }, 700)
          defender(id, { x: lx - 40, y: ly - 12, pose: 'beaten', dur: 0 })
          await wait(450)
          lauder({ rot: 0, dur: 0 })
          await passBy(id, lx + 62)
          break
        }
        case 'gravity': {
          const v = addEffect({ kind: 'vortex', x: lx + 24, y: ly + 2 })
          ball({ h: 24, dur: 0.5, ease: 'easeOut' })
          await wait(550)
          // the rainbow flick: up and over
          stadiumSound.kick()
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, dx, dx + 62], h: [24, 98, 0], times: [0, 0.5, 1], dur: 0.9, ease: 'easeOut', spin: s.ball.spin + 900 } }))
          lauder({ x: [lx, dx - 8, dx + 50], y: [ly, ly - 16, ly], times: [0, 0.5, 1], dur: 0.9, stride: true, mood: 'excited' })
          await wait(300)
          removeEffect(v)
          await wait(600)
          defender(id, { pose: 'beaten', rot: -12 })
          await passBy(id, dx + 50)
          break
        }
        case 'magnet': {
          const fx = addEffect({ kind: 'magnet', x1: lx + 15, x2: dx, y: ly, flipped: false })
          ball({ x: lx + 30, dur: 0.4 })
          await wait(450)
          // the elastico: out, back, and past, while the poles flip
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 30, lx + 20, lx + 46], y: [ly + 2, ly + 16, ly - 8], times: [0, 0.4, 1], dur: 0.4, spin: s.ball.spin + 300 } }))
          lauder({ x: [lx, lx + 6, lx + 16], y: [ly, ly + 12, ly - 6], times: [0, 0.4, 1], dur: 0.4, mood: 'excited' })
          updateEffect(fx, { flipped: true } as Partial<Effect>)
          stadiumSound.power('magnet')
          defender(id, { x: dx + 34, rot: 18, dur: 0.4, pose: 'beaten' })
          await wait(600)
          removeEffect(fx)
          await passBy(id, lx + 50)
          break
        }
        case 'quake': {
          defender(id, { y: [ly, ly - 32, ly], times: [0, 0.5, 1], dur: 0.5 })
          await wait(480)
          burst({ kind: 'shockwave', x: dx, y: ly }, 1100)
          shake()
          await wait(250)
          // jump the shockwave and burst away
          lauder({ x: [lx, lx + 30, lx + 62], y: [ly, ly - 40, ly], times: [0, 0.5, 1], dur: 0.6, mood: 'excited' })
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, lx + 46, lx + 78], h: [0, 38, 0], times: [0, 0.5, 1], dur: 0.6, spin: s.ball.spin + 500 } }))
          await wait(650)
          defender(id, { pose: 'beaten', rot: -20 })
          await passBy(id, lx + 62)
          break
        }
        case 'shield':
          break
      }
    })

  /** The shot: past the keeper and through the energy shield. */
  const scoreGoal = (lx: number, ly: number) =>
    direct(async () => {
      const id = 'null'
      stadiumSound.power('shield')
      defender(id, { pose: 'power' })
      const sh = addEffect({ kind: 'shield' })
      camera({ cx: 830, cy: WORLD_BOTTOM, zoom: 2, dur: 0.6 })
      await wait(550)
      lauder({ x: lx - 12, dur: 0.25, mood: 'excited' })
      await wait(260)
      lauder({ x: lx + 6, dur: 0.15 })
      stadiumSound.kick()
      setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, 893], y: [ly + 2, 540], h: [0, 50], times: undefined, dur: 0.45, ease: 'easeIn', spin: s.ball.spin + 900 } }))
      await wait(330)
      removeEffect(sh)
      burst({ kind: 'shards', x: 870, y: 500, color: '#5ee6ff' })
      stadiumSound.shatter()
      defender(id, { pose: 'beaten', x: KEEPER_HOME.x - 10, y: 528, rot: -70, dur: 0.35 })
      await wait(160)
      setScene((s) => ({ ...s, ripple: true }))
      stadiumSound.net()
      ball({ x: 904, y: 548, h: 8, dur: 0.4, ease: 'easeOut' })
      await wait(200)
      // GOAL!
      show('GOAL!', 'goal', 'Mr. Lauder scores!', 2600)
      stadiumSound.cheer(2)
      stadiumSound.whistle(1)
      setScene((s) => ({ ...s, crowd: 'wave', flash: true }))
      celebrate('big')
      say('lauder', LAUDER_LINES.goal)
      lauder({ x: [lx, 820, 848], y: [ly, 628, 640], rot: [0, 0, -12], times: [0, 0.7, 1], dur: 1.3, stride: true, mood: 'celebrating' })
      camera({ cx: 830, cy: 590, zoom: 2.5, dur: 1.3 })
      await wait(1300)
      lauder({ stride: false })
      await wait(900)
      setScene((s) => ({ ...s, crowd: 'cheer', ripple: false }))
      sayAs(id, 'beaten')
      await wait(600)
    })

  // ---------------------------------------------------------------- what happens on a wrong answer

  const stopped = (id: DefenderId, lx: number, ly: number) =>
    direct(async () => {
      const d = DEFENDERS[id]
      const dx = isKeeper(matchRef.current) || id === 'null' ? KEEPER_HOME.x - 4 : lx + 58
      stadiumSound.power(d.power)
      defender(id, { pose: 'power' })
      show(d.powerName.toUpperCase() + '!', 'bad', `${d.name} uses ${d.powerName}`)
      switch (d.power) {
        case 'firewall': {
          const wall = addEffect({ kind: 'firewall', x: lx + 30, y: ly })
          await wait(400)
          lauder({ x: lx + 12, dur: 0.22, stride: true })
          await wait(230)
          lauder({ x: lx - 40, rot: [-8, 0], dur: 0.45, stride: false, mood: 'surprised' })
          ball({ x: lx - 25, dur: 0.45, ease: 'easeOut' })
          shake()
          await wait(700)
          removeEffect(wall)
          break
        }
        case 'speed': {
          defender(id, { blur: true })
          burst({ kind: 'speed', x: dx, y: ly, dir: -1 }, 600)
          defender(id, { x: lx + 14, dur: 0.22, ease: 'easeIn' })
          await wait(230)
          setScene((s) => ({ ...s, ball: { ...s.ball, x: lx - 62, dur: 0.35, ease: 'easeOut', spin: s.ball.spin - 720 } }))
          lauder({ mood: 'surprised' })
          defender(id, { x: dx, dur: 0.3, blur: false, pose: 'victory' })
          await wait(400)
          lauder({ x: lx - 48, stride: true, dur: 0.5 })
          await wait(520)
          break
        }
        case 'ice': {
          const wall = addEffect({ kind: 'ice-wall', x: lx + 30, y: ly })
          await wait(250)
          const block = addEffect({ kind: 'ice-block', x: lx, y: ly })
          lauder({ mood: 'surprised', stride: false })
          await wait(1100)
          removeEffect(block)
          removeEffect(wall)
          burst({ kind: 'shards', x: lx, y: ly - 36, color: '#9be3ff' })
          stadiumSound.shatter()
          await wait(300)
          break
        }
        case 'teleport': {
          burst({ kind: 'pixels', x: dx, y: ly - 30 }, 700)
          defender(id, { opacity: 0, dur: 0.1 })
          await wait(160)
          defender(id, { x: lx - 30, y: ly, dur: 0 })
          await wait(40)
          defender(id, { opacity: 1, dur: 0.1 })
          burst({ kind: 'pixels', x: lx - 30, y: ly - 30 }, 700)
          setScene((s) => ({ ...s, ball: { ...s.ball, x: lx - 80, dur: 0.4, ease: 'easeOut', spin: s.ball.spin - 600 } }))
          lauder({ mood: 'surprised' })
          await wait(500)
          burst({ kind: 'pixels', x: lx - 30, y: ly - 30 }, 700)
          defender(id, { opacity: 0, dur: 0.1 })
          await wait(150)
          defender(id, { x: dx, y: ly, dur: 0, pose: 'victory' })
          await wait(40)
          defender(id, { opacity: 1, dur: 0.1 })
          lauder({ x: lx - 66, stride: true, dur: 0.5 })
          await wait(520)
          break
        }
        case 'gravity': {
          const v = addEffect({ kind: 'vortex', x: lx, y: ly + 2 })
          lauder({ y: [ly, ly - 46, ly - 46, ly], rot: [0, -18, 16, 0], times: [0, 0.35, 0.75, 1], dur: 1.1, mood: 'surprised' })
          setScene((s) => ({ ...s, ball: { ...s.ball, h: [0, 52, 52, 0], times: [0, 0.35, 0.75, 1], dur: 1.1 } }))
          await wait(1100)
          shake()
          stadiumSound.kick()
          removeEffect(v)
          await wait(300)
          break
        }
        case 'magnet': {
          const fx = addEffect({ kind: 'magnet', x1: lx + 15, x2: dx, y: ly, flipped: false })
          ball({ x: dx - 14, dur: 0.45, ease: 'easeIn' })
          await wait(500)
          updateEffect(fx, { flipped: true } as Partial<Effect>)
          lauder({ x: lx - 36, rot: [-10, 0], dur: 0.4, mood: 'surprised' })
          await wait(450)
          removeEffect(fx)
          defender(id, { pose: 'victory' })
          // the ball is played back for the restart
          stadiumSound.kick()
          setScene((s) => ({ ...s, ball: { ...s.ball, x: lx - 20, dur: 0.6, ease: 'easeOut', spin: s.ball.spin - 500 } }))
          await wait(600)
          break
        }
        case 'quake': {
          defender(id, { y: [ly, ly - 32, ly], times: [0, 0.5, 1], dur: 0.5 })
          await wait(480)
          burst({ kind: 'shockwave', x: dx, y: ly }, 1100)
          shake()
          await wait(200)
          lauder({ rot: -75, dur: 0.3, mood: 'surprised' })
          setScene((s) => ({ ...s, ball: { ...s.ball, x: lx - 38, h: [0, 22, 0], times: [0, 0.5, 1], dur: 0.6, spin: s.ball.spin - 400 } }))
          await wait(900)
          lauder({ rot: 0, dur: 0.35 })
          await wait(350)
          break
        }
        case 'shield': {
          const sh = addEffect({ kind: 'shield' })
          await wait(450)
          stadiumSound.kick()
          setScene((s) => ({ ...s, ball: { ...s.ball, x: [lx + 15, 866, lx + 30], y: [ly + 2, 540, ly + 2], h: [0, 44, 0], times: [0, 0.45, 1], dur: 0.9, spin: s.ball.spin + 700 } }))
          await wait(400)
          stadiumSound.power('shield')
          lauder({ mood: 'surprised' })
          await wait(600)
          removeEffect(sh)
          defender(id, { pose: 'victory' })
          break
        }
      }
      stadiumSound.groan()
      crowd('groan')
      sayAs(id, 'power')
    })

  /** Back to the duel position, ready for the next question against the same defender. */
  const regroup = (id: DefenderId, lx: number, ly: number) =>
    direct(async () => {
      crowd('idle')
      setScene((s) => ({ ...s, ball: { ...s.ball, x: lx + 15, y: ly + 2, h: 0, dur: 0.6, ease: 'easeInOut', times: undefined, dribble: true } }))
      lauder({ x: lx, y: ly, rot: 0, stride: true, mood: 'thinking', dur: 0.6, times: undefined })
      await wait(620)
      lauder({ stride: false })
      ball({ dribble: false })
      defender(id, { pose: 'taunt' })
    })

  /** The last possession is gone: the defender takes the ball away. */
  const turnover = (id: DefenderId, ly: number) =>
    direct(async () => {
      await wait(400)
      show('TURNOVER!', 'bad', `${DEFENDERS[id].name} wins the ball`, 2400)
      stadiumSound.whistle(3)
      setScene((s) => ({
        ...s,
        ball: { ...s.ball, x: 40, y: ly + 2, h: 0, dur: 2.2, ease: 'easeIn', dribble: true, spin: s.ball.spin - 1600 },
        defenders: { ...s.defenders, [id]: { ...s.defenders[id]!, x: 26, y: ly, stride: true, pose: 'victory', dur: 2.2, ease: 'easeIn', opacity: 1, rot: 0, blur: false, times: undefined } },
      }))
      lauder({ mood: 'confused', stride: false, rot: 0 })
      camera({ cx: 300, cy: 520, zoom: 1.3, dur: 2.2 })
      sayAs(id, 'victory')
      await wait(1400)
      say('lauder', LAUDER_LINES.lost)
      await wait(800)
    })

  // ---------------------------------------------------------------- answering

  const choose = (displayIndex: number) => {
    if (phase !== 'duel' || !question || picked !== null) return
    const q = stadiumQuestion(question.id)
    const correct = order[displayIndex] === q.answer
    setPicked(displayIndex)
    const before = matchRef.current
    const id = currentDefender(before)
    const { state, play: pl } = answer(before, question, correct)
    setMatch(state)
    setPlay(pl)
    setPhase('playing')
    store.recordAnswer({ qid: q.id, topic: q.topic, difficulty: q.difficulty, correct, solved: correct, source: 'practice', isDebugging: false })
    if (correct) setXp((v) => v + answerXp(q.difficulty, 1))
    const l = scene.lauder
    const lx = Array.isArray(l.x) ? l.x[l.x.length - 1] : l.x
    const ly = Array.isArray(l.y) ? l.y[l.y.length - 1] : l.y
    void direct(async () => {
      if (correct) {
        stadiumSound.cheer(0.8)
        crowd('cheer')
        if (pl.goal) await scoreGoal(lx, ly)
        else {
          show(DEFENDERS[id].skill.toUpperCase() + '!', 'good', `Past ${DEFENDERS[id].name}`)
          say('lauder', LAUDER_LINES.beat)
          await beat(id, lx, ly)
          sayAs(id, 'beaten')
          crowd('idle')
        }
      } else {
        await stopped(id, lx, ly)
        if (pl.turnover) await turnover(id, ly)
        else await regroup(id, lx, ly)
      }
      setPhase('feedback')
    })
  }

  const finish = (m: MatchState) => {
    stadiumSound.stopCrowd()
    const r = store.finishBattle({
      won: m.status === 'scored',
      score: finalScore(m),
      correct: m.asked.filter((a) => a.correct).length,
      answered: m.asked.length,
      bestStreak: m.bestStreak,
      xp,
    })
    setReward(r)
    setPhase('results')
  }

  const proceed = () => {
    if (phase !== 'feedback') return
    const m = matchRef.current
    if (m.status !== 'playing') return finish(m)
    if (play?.correct) void approach(m)
    else {
      sayAs(currentDefender(m), 'taunt')
      nextQuestion(m)
    }
  }

  const backToLobby = () => {
    token.current++
    stadiumSound.stopCrowd()
    const m = startMatch()
    setMatch(m)
    setScene(lobbyScene(m.lineup))
    setPhase('lobby')
    setQuestion(null)
    setCaption(null)
  }

  // keys: 1 to 4 answer, Enter continues
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return
      if (phase === 'duel' && /^[1-4]$/.test(e.key)) choose(Number(e.key) - 1)
      else if (phase === 'feedback' && e.key === 'Enter') {
        e.preventDefault()
        proceed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const sound = p.settings.sound
  const toggleSound = () => {
    store.updateSettings({ sound: !sound })
    if (sound) stadiumSound.stopCrowd()
    else if (phase !== 'lobby' && phase !== 'results') setTimeout(() => stadiumSound.startCrowd(), 0)
  }

  // ---------------------------------------------------------------- the view

  const inMatch = phase !== 'lobby' && phase !== 'results'
  const cinematic = phase === 'duel' || phase === 'playing' || phase === 'feedback'
  const q = question ? stadiumQuestion(question.id) : null
  const unit = question ? getUnit(question.unitId) : null
  const facing = currentDefender(match)
  const beatenCount = defendersBeaten(match)
  const questionNumber = match.asked.length + (phase === 'duel' ? 1 : 0)
  const longCode = !!q?.code && q.code.split('\n').length > 3
  // short answers fit two to a row even on a phone
  const shortOptions = !!q && q.options.every((o) => o.text.length <= 18 && !o.text.includes('\n'))

  const overlay = (
    <div className="pointer-events-none absolute inset-0">
      {/* letterbox bars for the one-on-one close-ups */}
      <motion.div className="absolute inset-x-0 top-0 bg-black/85" initial={false} animate={{ height: cinematic && !narrow ? '7%' : '0%' }} transition={{ duration: 0.5 }} />
      <motion.div className="absolute inset-x-0 bottom-0 bg-black/85" initial={false} animate={{ height: cinematic && !narrow ? '7%' : '0%' }} transition={{ duration: 0.5 }} />

      {inMatch && (
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 sm:top-3 sm:left-3">
          {unit && cinematic && !panelOpen && (
            <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase backdrop-blur sm:text-xs">
              Unit {unit.number} · {unit.title}
            </span>
          )}
          {questionNumber > 0 && <span className="rounded-lg bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white/90 sm:text-xs">Question {questionNumber}</span>}
        </div>
      )}
      <div className="pointer-events-auto absolute top-2 right-2 flex items-center gap-1.5 sm:top-3 sm:right-3">
        {inMatch && (
          <>
            <span className="flex items-center gap-0.5 rounded-lg bg-black/60 px-1.5 py-1 backdrop-blur" aria-label={`${match.possessions} of ${POSSESSIONS} possessions left`}>
              {Array.from({ length: POSSESSIONS }, (_, i) => (
                <AppIcon key={i} name="football" size={15} strokeWidth={2.2} className={i < match.possessions ? 'text-white' : 'text-white/25'} />
              ))}
            </span>
            <span className="rounded-lg bg-black/60 px-2 py-1 font-display text-xs font-semibold text-sun-300 backdrop-blur sm:text-sm">{match.score}</span>
          </>
        )}
        <button
          type="button"
          onClick={toggleSound}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur hover:bg-black/75"
          aria-label={sound ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={sound}
        >
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
      </div>

      {/* who is talking (during a duel it shows in the question panel instead) */}
      <div className={`absolute inset-x-0 top-[9%] ${cinematic && panelOpen ? 'hidden' : ''} grid justify-items-center px-12 sm:top-[11%]`}>
        <AnimatePresence>
          {speech && (
            <motion.div
              key={speech.key}
              style={{ gridArea: '1 / 1' }}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex max-w-md items-center gap-2 rounded-2xl border-2 border-espresso-900 bg-white/95 py-1 pr-3 pl-1 shadow-[0_3px_0_var(--color-espresso-900)]"
              aria-live="polite"
            >
              <span className="hidden sm:block">
                <Portrait who={speech.who} size={34} />
              </span>
              <span className="text-[11px] leading-snug font-bold text-espresso-900 sm:text-[13px]">
                <span className={speech.who === 'lauder' ? 'text-brew-600' : 'text-berry-600'}>{speech.who === 'lauder' ? 'Mr. Lauder' : DEFENDERS[speech.who].name}: </span>
                {speech.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* big moments, over the players (below the question panel) */}
      <div className={`absolute inset-x-0 flex items-center justify-center ${cinematic ? 'top-[50%] bottom-[16%]' : 'inset-y-0'}`}>
        <AnimatePresence>
          {caption && (
            <motion.div
              key={caption.key}
              initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="text-center"
            >
              <div
                className={`font-display font-bold tracking-wide italic ${caption.tone === 'goal' ? 'text-6xl text-sun-300 sm:text-8xl' : caption.tone === 'good' ? 'text-3xl text-white sm:text-5xl' : 'text-3xl text-berry-300 sm:text-5xl'}`}
                style={{ WebkitTextStroke: caption.tone === 'goal' ? '3px #241812' : '2px #241812', textShadow: '0 4px 0 #241812' }}
              >
                {caption.title}
              </div>
              {caption.sub && <div className="mt-1 inline-block rounded-lg bg-black/60 px-2 py-0.5 text-xs font-bold text-white sm:text-sm">{caption.sub}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* the question, right on the pitch */}
      {cinematic && q && question && (
        <div className="pointer-events-none absolute inset-x-1.5 top-10 flex h-[calc(96%-2.5rem)] items-start justify-center sm:inset-x-5 sm:top-[calc(7%+6px)] sm:h-[57%]">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="pointer-events-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-espresso-900 bg-white/95 shadow-[0_4px_0_var(--color-espresso-900)] backdrop-blur"
            role="region"
            aria-label="Question"
          >
            <div className="flex items-center gap-2 border-b-2 border-espresso-100 px-3 py-1.5">
              <Portrait who={play?.defender ?? facing} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-extrabold tracking-wider text-espresso-400 uppercase sm:text-[11px]">
                  <span className="rounded-full bg-grape-100 px-1.5 py-px text-grape-700">
                    Unit {unit?.number} · {unit?.title}
                  </span>
                  <span className={q.difficulty === 1 ? 'text-mint-600' : q.difficulty === 2 ? 'text-sun-700' : 'text-berry-600'}>{q.difficulty === 1 ? 'Beginner' : q.difficulty === 2 ? 'Intermediate' : 'Advanced'}</span>
                  <span className="truncate">
                    vs {DEFENDERS[play?.defender ?? facing].name}, {DEFENDERS[play?.defender ?? facing].title}
                  </span>
                </div>
                {speech && (
                  <div className="truncate text-[11px] font-bold text-espresso-600 sm:text-xs" aria-live="polite">
                    <span className={speech.who === 'lauder' ? 'text-brew-600' : 'text-berry-600'}>{speech.who === 'lauder' ? 'Mr. Lauder' : DEFENDERS[speech.who].name}: </span>
                    {speech.text}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen((o) => !o)}
                className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-extrabold tracking-wide text-espresso-500 uppercase hover:bg-espresso-100"
                aria-expanded={panelOpen}
              >
                {panelOpen ? 'Hide' : 'Show question'}
              </button>
            </div>
            {panelOpen && phase === 'playing' && play && (
              <div className={`flex items-center gap-2 px-3 py-2 font-display text-base font-bold sm:text-lg ${play.correct ? 'text-mint-800' : 'text-berry-700'}`} aria-live="polite">
                <IconTile icon={play.goal ? 'trophy' : play.correct ? 'zap' : 'heart-crack'} tone={play.correct ? 'mint' : 'berry'} size={26} />
                {resultLine(play)}
              </div>
            )}
            {panelOpen && phase !== 'playing' && (
              <div className="min-h-0 overflow-y-auto px-2.5 py-1.5 sm:px-4 sm:py-3">
                {/* long code: the answers sit beside it on wider screens, so the card stays short */}
                <div className={longCode ? 'sm:grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-start sm:gap-3' : undefined}>
                <div className="min-w-0">
                <div className="text-[14px] leading-snug font-semibold text-espresso-900 sm:text-base">
                  <Md text={q.prompt} />
                </div>
                {q.code && <CodeBlock code={q.code} size="sm" className="mt-1.5 sm:mt-2 [&_.font-mono]:text-[11px] [&_.font-mono]:leading-[1.45] sm:[&_.font-mono]:text-[12px] sm:[&_.font-mono]:leading-[1.5]" copy={false} />}
                {q.stdin && (
                  <p className="mt-1.5 text-xs font-semibold text-espresso-500 sm:text-sm">
                    The user types: <code className="rounded bg-espresso-50 px-1.5 py-0.5 font-mono">{q.stdin.trim().split('\n').join(', ')}</code>
                  </p>
                )}
                </div>
                <div className={`mt-1.5 grid gap-1 sm:mt-2 sm:gap-2 ${shortOptions && !longCode ? 'grid-cols-2' : 'grid-cols-1'} ${longCode ? '' : 'sm:grid-cols-2'}`}>
                  {order.map((oi, di) => {
                    const opt = q.options[oi]
                    const right = picked !== null && oi === q.answer
                    const wrong = picked === di && oi !== q.answer
                    const mono = q.optionStyle === 'code' || q.optionStyle === 'output'
                    return (
                      <button
                        key={`${question.id}-${oi}`}
                        type="button"
                        disabled={phase !== 'duel'}
                        onClick={() => choose(di)}
                        className={`flex items-start gap-2 rounded-xl border-2 px-2 py-1 text-left text-[13px] transition sm:px-3 sm:py-2 sm:text-sm ${
                          right
                            ? 'border-mint-500 bg-mint-50'
                            : wrong
                              ? 'border-berry-400 bg-berry-50'
                              : picked !== null
                                ? 'border-espresso-100 opacity-60'
                                : 'border-espresso-200 bg-white shadow-[0_2px_0_var(--color-espresso-200)] hover:border-sky-300 hover:bg-sky-50 active:translate-y-[2px] active:shadow-none'
                        }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold sm:h-6 sm:w-6 sm:text-xs ${right ? 'bg-mint-500 text-white' : wrong ? 'bg-berry-500 text-white' : 'bg-espresso-100 text-espresso-600'}`}>{di + 1}</span>
                        <span className={`min-w-0 flex-1 ${mono ? 'font-mono text-[12px] whitespace-pre-wrap sm:text-[13px]' : 'font-semibold'}`}>{mono ? opt.text : <Md text={opt.text} />}</span>
                        {right && <AppIcon name="check-circle" size={18} className="shrink-0 text-mint-600" />}
                        {wrong && <AppIcon name="x-circle" size={18} className="shrink-0 text-berry-500" />}
                      </button>
                    )
                  })}
                </div>
                </div>
                {play && picked !== null && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-2 rounded-xl border-2 p-2.5 sm:p-3 ${play.correct ? 'border-mint-300 bg-mint-50' : 'border-berry-200 bg-berry-50'}`}>
                    <div className={`flex items-center gap-2 font-display text-base font-bold sm:text-lg ${play.correct ? 'text-mint-800' : 'text-berry-700'}`}>
                      <IconTile icon={play.goal ? 'trophy' : play.correct ? 'zap' : 'heart-crack'} tone={play.correct ? 'mint' : 'berry'} size={26} />
                      {resultLine(play)}
                    </div>
                    {!play.correct && q.options[order[picked]].feedback && (
                      <p className="mt-1 text-sm text-espresso-800">
                        <Md text={q.options[order[picked]].feedback!} />
                      </p>
                    )}
                    <p className="mt-1 text-sm text-espresso-700">
                      <Md text={q.explanation} />
                    </p>
                    {!play.correct && !play.turnover && <p className="mt-1 text-xs font-semibold text-espresso-500">Same defender, new question. You have {match.possessions} possession{match.possessions === 1 ? '' : 's'} left.</p>}
                  </motion.div>
                )}
              </div>
            )}
            {play && picked !== null && phase === 'feedback' && (
              <div className="flex justify-end border-t-2 border-espresso-100 px-3 py-1.5">
                <Button onClick={proceed} disabled={phase !== 'feedback'} size="sm" icon={<ArrowRight size={16} />} variant={play.correct ? 'success' : 'primary'}>
                  {phase !== 'feedback' ? 'Watch the play...' : match.status !== 'playing' ? 'See results' : play.correct ? 'Next defender' : 'Try again'}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* defenders left */}
      {inMatch && (
        <div className="absolute inset-x-0 bottom-[8%] flex justify-center sm:bottom-[9%]">
          <div className="flex items-center gap-1 rounded-2xl bg-black/55 px-2 py-1 backdrop-blur" aria-label={`${DEFENDER_COUNT - beatenCount} defenders left`}>
            {match.lineup.map((id, i) => {
              const done = i < match.encounter
              const now = i === match.encounter && match.status === 'playing'
              return (
                <span key={id} className={`relative rounded-full ${now ? 'ring-2 ring-sun-300' : ''} ${done ? 'opacity-45 grayscale' : ''}`} title={`${DEFENDERS[id].name}, ${DEFENDERS[id].title}`}>
                  <Defender who={id} pose={done ? 'beaten' : 'idle'} size={20} />
                  {done && <AppIcon name="check-circle" size={11} className="absolute -right-0.5 -bottom-0.5 rounded-full bg-mint-500 text-white" />}
                </span>
              )
            })}
            <span className="ml-1 text-[10px] font-extrabold whitespace-nowrap text-white uppercase sm:text-xs">
              {match.status === 'scored' ? 'Goal!' : isKeeper(match) ? 'Keeper' : `${DEFENDER_COUNT - beatenCount} left`}
            </span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div ref={stageRef} className="scroll-mt-20">
        <Stage
          scene={scene}
          overlay={overlay}
          className={`w-full rounded-[28px] border-2 border-espresso-900 shadow-[0_6px_0_var(--color-espresso-900)] ${
            inMatch ? 'h-[calc(100dvh-10.25rem)] min-h-[26rem] sm:h-[calc(100dvh-7.5rem)] sm:min-h-[30rem]' : 'aspect-[4/3] sm:aspect-[16/9]'
          }`}
        />
      </div>

      {phase === 'lobby' && <Lobby lineup={match.lineup} available={available} onKickOff={kickOff} />}

      {(phase === 'kickoff' || phase === 'approach') && (
        <div className="flex items-center gap-3 rounded-3xl border-2 border-espresso-100 bg-white p-5">
          <IconTile icon="football" tone="mint" />
          <div className="flex-1">
            <div className="font-display text-lg font-semibold">{phase === 'kickoff' ? 'Kick off!' : `Mr. Lauder is on the ball`}</div>
            <div className="text-sm text-espresso-500">
              Next up: <b>{DEFENDERS[facing].name}</b>, {DEFENDERS[facing].title}. Get ready for a question.
            </div>
          </div>
          <UnitCoverage match={match} available={available} />
        </div>
      )}

      {(phase === 'duel' || phase === 'playing' || phase === 'feedback') && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-3xl border-2 border-espresso-100 bg-white p-4">
            <Portrait who={play?.defender ?? facing} size={40} />
            <p className="text-sm text-espresso-600">
              <b className="text-espresso-900">
                {DEFENDERS[play?.defender ?? facing].name}, {DEFENDERS[play?.defender ?? facing].title}.
              </b>{' '}
              {DEFENDERS[play?.defender ?? facing].powerName}: {DEFENDERS[play?.defender ?? facing].powerText}
            </p>
          </div>
          <div className="rounded-3xl border-2 border-espresso-100 bg-white p-4">
            <div className="mb-2 text-xs font-extrabold tracking-wider text-espresso-400 uppercase">Units this match</div>
            <UnitCoverage match={match} available={available} />
          </div>
        </div>
      )}

      {phase === 'results' && <Results match={match} reward={reward} available={available} onAgain={kickOff} onLobby={backToLobby} />}
    </div>
  )
}

// ------------------------------------------------------------------ lobby and results

function Lobby({ lineup, available, onKickOff }: { lineup: DefenderId[]; available: string[]; onKickOff: () => void }) {
  const p = useProgress()
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-mint-100 px-3 py-1 text-xs font-extrabold tracking-widest text-mint-800 uppercase">
          <AppIcon name="football" size={14} /> Practice
        </div>
        <h1 className="text-4xl font-bold sm:text-5xl">Stadium Challenge</h1>
        <p className="max-w-2xl text-espresso-600">
          Mr. Lauder has the ball. Between him and the goal: Bryan, Avik and a team of superpowered villains. Every right answer is a skill move past a defender. Every wrong answer lets their superpower strike.
        </p>
        <Button size="lg" onClick={onKickOff} icon={<AppIcon name="football" size={22} />} className="min-w-64">
          Kick off
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold">How it works</h2>
          <ul className="space-y-2.5 text-[15px] text-espresso-700">
            <li className="flex gap-3">
              <IconTile icon="swords" tone="berry" size={30} /> <span className="self-center">Each defender blocks Mr. Lauder with one question. Answer it right to dribble past.</span>
            </li>
            <li className="flex gap-3">
              <IconTile icon="heart-crack" tone="sun" size={30} /> <span className="self-center">A wrong answer triggers their superpower and costs one of your {POSSESSIONS} possessions. Then you try again with a new question.</span>
            </li>
            <li className="flex gap-3">
              <IconTile icon="trophy" tone="brew" size={30} /> <span className="self-center">Beat all {DEFENDER_COUNT} defenders, then beat the keeper to score. Lose every possession and the defenders win the ball.</span>
            </li>
            <li className="flex gap-3">
              <IconTile icon="layers" tone="sky" size={30} /> <span className="self-center">Questions rotate evenly through every unit you have studied, and get harder the closer you get to goal.</span>
            </li>
          </ul>
          <div className="mt-4">
            <div className="mb-1.5 text-xs font-extrabold tracking-wider text-espresso-400 uppercase">Units in your matches</div>
            <UnitCoverage match={null} available={available} />
            {available.length < UNITS.length && <p className="mt-1.5 text-xs text-espresso-400">More units join the rotation as you finish their lessons.</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          <Stat icon="football" tone="espresso" label="Matches" value={p.battle.played} />
          <Stat icon="trophy" tone="sun" label="Goals" value={p.battle.wins} />
          <Stat icon="star" tone="brew" label="Best score" value={p.battle.bestScore} />
        </div>
      </div>

      <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Today's defenders</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {lineup.map((id, i) => {
            const d = DEFENDERS[id]
            return (
              <div key={id} className="flex flex-col items-center rounded-2xl border-2 border-espresso-100 p-3 text-center">
                <Defender who={id} pose="taunt" size={64} />
                <div className="mt-1 text-[10px] font-extrabold tracking-wider text-espresso-400 uppercase">{i < DEFENDER_COUNT ? `Defender ${i + 1}` : 'Goalkeeper'}</div>
                <div className="font-display text-lg leading-tight font-semibold">{d.name}</div>
                <div className="text-xs font-bold text-berry-600">{d.title}</div>
                <div className="mt-1 text-xs text-espresso-500">{d.powerText}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <Link to="/practice/session?mode=smart" className="text-sm font-bold text-espresso-400 hover:text-espresso-600">
          Want a calm review instead? Start a quiet practice session
        </Link>
      </div>
    </div>
  )
}

function Results({ match, reward, available, onAgain, onLobby }: { match: MatchState; reward: Reward | null; available: string[]; onAgain: () => void; onLobby: () => void }) {
  const scored = match.status === 'scored'
  const r = rating(match)
  const right = match.asked.filter((a) => a.correct).length
  const wrong = match.asked.length - right
  const missed = match.asked.filter((a) => !a.correct)
  return (
    <div className="space-y-5 text-center">
      <div>
        <div className="mb-2 flex justify-center">
          <IconTile icon={scored ? 'trophy' : 'heart-crack'} tone={scored ? 'sun' : 'berry'} size={64} />
        </div>
        <h1 className={`text-5xl font-bold ${scored ? 'text-mint-700' : 'text-berry-600'}`}>{scored ? 'GOAL! You win!' : 'Turnover!'}</h1>
        <p className="mt-2 text-espresso-600">
          {scored ? 'Mr. Lauder dribbled past every defender and scored. The crowd is still on its feet.' : 'The defenders won the ball this time. Every answer you review now is a defender you beat next time.'}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border-2 border-sun-300 bg-sun-50 px-4 py-2 shadow-[0_3px_0_var(--color-sun-300)]">
          <span className="flex">
            {[1, 2, 3, 4].map((s) => (
              <AppIcon key={s} name="star" size={20} className={s <= r.stars ? 'fill-sun-400 text-sun-600' : 'text-sun-300'} />
            ))}
          </span>
          <span className="font-display text-lg font-semibold text-espresso-900">{r.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="star" tone="brew" label="Final score" value={finalScore(match)} />
        <Stat icon="target" tone="sky" label="Accuracy" value={`${Math.round(accuracy(match) * 100)}%`} />
        <Stat icon="swords" tone="berry" label="Defenders beaten" value={`${defendersBeaten(match)}/${DEFENDER_COUNT}`} />
        <Stat icon="football" tone="mint" label="Goal" value={scored ? 'Yes' : 'No'} />
        <Stat icon="check-circle" tone="mint" label="Correct" value={right} />
        <Stat icon="x-circle" tone="berry" label="Incorrect" value={wrong} />
        <Stat icon="flame" tone="sun" label="Best streak" value={match.bestStreak} />
        <Stat icon="layers" tone="sky" label="Units covered" value={`${unitsCovered(match).length}/${available.length}`} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <UnitCoverage match={match} available={available} />
        {reward && (
          <p className="inline-flex items-center gap-1.5 font-display text-lg font-semibold text-sun-700">
            <AppIcon name="zap" size={20} className="fill-sun-300" /> +{reward.xp} XP
          </p>
        )}
      </div>

      {missed.length > 0 && (
        <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5 text-left">
          <h2 className="mb-2 text-lg font-bold">Worth another look</h2>
          <ul className="space-y-2">
            {missed.map((a, i) => {
              const q = stadiumQuestion(a.qid)
              const u = getUnit(a.unitId)
              return (
                <li key={i} className="rounded-2xl bg-espresso-50 p-3 text-sm">
                  <div className="text-xs font-extrabold tracking-wider text-espresso-400 uppercase">
                    Unit {u?.number} · vs {DEFENDERS[a.defender].name}
                  </div>
                  <div className="font-semibold text-espresso-800">
                    <Md text={q.prompt} />
                  </div>
                  <div className="mt-1 text-espresso-600">
                    Answer: <b>{q.options[q.answer].text}</b>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onAgain} icon={<RotateCcw size={20} />}>
          {scored ? 'Play again' : 'Retry the challenge'}
        </Button>
        <Button size="lg" variant="secondary" onClick={onLobby}>
          Back to the team sheet
        </Button>
        <ButtonLink size="lg" variant="ghost" to="/learn">
          Continue learning
        </ButtonLink>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ page

export function StadiumPage() {
  const p = useProgress()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pool = useMemo(() => stadiumPool(p), [p.lessons, p.units])
  if (!pool.length) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
        <div className="flex items-end gap-2">
          <Defender who="bryan" pose="taunt" size={100} />
          <Mascot mood="thinking" size={110} />
          <Defender who="avik" pose="idle" size={100} />
        </div>
        <h1 className="mt-4 text-3xl font-bold">The stadium is waiting</h1>
        <p className="mt-2 text-espresso-600">The Stadium Challenge uses questions from lessons you have finished. Finish your first lesson, then come back and take on Bryan, Avik and the rest of the team.</p>
        <ButtonLink to="/learn" size="lg" className="mt-6">
          Go to the path
        </ButtonLink>
      </div>
    )
  }
  return <StadiumGame pool={pool} />
}
