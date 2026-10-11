import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Clock, Flame, Heart, LogOut, RotateCcw, Swords, Trophy, XCircle, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { Button, ButtonLink } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { Mascot } from '../components/Mascot'
import { Md } from '../components/Md'
import { ProgressBar } from '../components/ProgressBar'
import { shuffledOrder } from '../components/questions/types'
import { FootballIcon, Villain, type VillainPose } from '../components/Villains'
import { pickLine, type BattleMoment } from '../data/battleDialogue'
import type { MascotMood } from '../data/types'
import {
  accuracy,
  answer,
  battlePool,
  battleQuestion,
  buildDeck,
  CRIT_STREAK,
  currentQuestionId,
  FOE_HP,
  PLAYER_HP,
  startBattle,
  timeFor,
  type BattleState,
  type Foe,
  type Turn,
} from '../engine/battle'
import { answerXp } from '../engine/gamification'
import { celebrate } from '../lib/motion'
import { sfx } from '../lib/sound'
import { useProgress } from '../state/hooks'
import { store, type Reward } from '../state/store'

const NAMES: Record<Foe, string> = { bryan: 'Bryan', avik: 'Avik' }

/** True on screens at least 640px wide, so the fighters can be drawn bigger. */
function useWide(): boolean {
  const query = '(min-width: 640px)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

// ------------------------------------------------------------------ small pieces

function HpBar({ label, hp, max, tone }: { label: string; hp: number; max: number; tone: 'mint' | 'berry' }) {
  return (
    <div className="w-full min-w-0">
      <div className="mb-0.5 flex items-center justify-between gap-2 text-xs font-extrabold tracking-wide text-espresso-700 uppercase">
        <span className="truncate">{label}</span>
        <span className="flex items-center gap-1 font-display">
          <Heart size={12} className={tone === 'mint' ? 'fill-mint-500 text-mint-600' : 'fill-berry-500 text-berry-600'} />
          {hp}
        </span>
      </div>
      <ProgressBar value={hp / max} color={hp / max > 0.5 ? tone : hp / max > 0.25 ? 'sun' : 'berry'} height={10} shine={false} label={`${label} health`} />
    </div>
  )
}

/** A speech bubble above a character. It never takes clicks, so it can't get in the way of answering. */
function Bubble({ text, align = 'center' }: { text: string; align?: 'center' | 'right' | 'left' }) {
  const pos = align === 'right' ? 'right-0' : align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className={`pointer-events-none absolute bottom-full z-20 mb-1 w-max max-w-[min(15rem,46vw)] rounded-2xl border-2 border-espresso-900 bg-white px-3 py-1.5 text-[13px] leading-snug font-bold text-espresso-900 shadow-[0_3px_0_var(--color-espresso-900)] ${pos}`}
      aria-live="polite"
    >
      {text}
    </motion.div>
  )
}

/** Moves a character for its pose: a lunge to attack, a shake when hit, a slump when knocked out. */
function Fighter({ pose, facing, children }: { pose: VillainPose; facing: 1 | -1; children: ReactNode }) {
  const anim =
    pose === 'attack'
      ? { x: [0, 34 * facing, 0], rotate: 0, y: 0, opacity: 1, filter: 'grayscale(0) brightness(1)' }
      : pose === 'hurt'
        ? { x: [0, -12 * facing, 9 * facing, -5 * facing, 0], rotate: 0, y: 0, opacity: 1, filter: ['brightness(1.8) saturate(0.4)', 'brightness(1) saturate(1)'] }
        : pose === 'defeated'
          ? { x: 0, rotate: -12 * facing, y: 10, opacity: 0.6, filter: 'grayscale(0.85) brightness(1)' }
          : pose === 'victory'
            ? { x: 0, rotate: 0, y: [0, -14, 0], opacity: 1, filter: 'grayscale(0) brightness(1)' }
            : { x: 0, rotate: 0, y: 0, opacity: 1, filter: 'grayscale(0) brightness(1)' }
  return (
    <motion.div
      animate={anim}
      transition={pose === 'victory' ? { duration: 0.7, repeat: Infinity } : { duration: pose === 'hurt' ? 0.45 : 0.4, ease: 'easeOut' }}
      style={{ transformOrigin: 'bottom center' }}
    >
      {children}
    </motion.div>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-espresso-100 bg-white p-3 text-center">
      <div className="mx-auto mb-1 flex justify-center">{icon}</div>
      <div className="font-display text-2xl font-bold text-espresso-900">{value}</div>
      <div className="text-xs font-extrabold tracking-wide text-espresso-400 uppercase">{label}</div>
    </div>
  )
}

// ------------------------------------------------------------------ lobby

function Lobby({ onStart, poolSize }: { onStart: () => void; poolSize: number }) {
  const p = useProgress()
  // Bryan and Avik take turns trash-talking, so their bubbles never cover each other
  const [talk, setTalk] = useState(() => ({ who: 'bryan' as Foe, text: pickLine('bryan', 'intro'), key: 0 }))
  useEffect(() => {
    const id = setInterval(() => {
      setTalk((t) => {
        const who: Foe = t.who === 'bryan' ? 'avik' : 'bryan'
        return { who, text: pickLine(who, t.key % 4 < 2 ? 'intro' : 'taunt'), key: t.key + 1 }
      })
    }, 3200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-berry-100 px-3 py-1 text-xs font-extrabold tracking-widest text-berry-700 uppercase">
          <Swords size={14} /> Practice battle
        </div>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Java Battle</h1>
        <p className="mx-auto mt-2 max-w-xl text-espresso-600">Bryan and Avik think they know more Java than you. Answer fast, answer right, and prove them wrong.</p>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[32px] border-2 border-espresso-900 bg-gradient-to-b from-sky-100 via-cream-50 to-cream-50 shadow-[0_6px_0_var(--color-espresso-900)]">
        <Pitch />
        <div className="relative flex items-end justify-between gap-2 px-4 pt-24 pb-6 sm:px-10">
          <div className="flex flex-col items-center">
            <Mascot mood="encouraging" size={130} float />
            <span className="mt-1 rounded-full bg-espresso-900 px-2.5 py-0.5 text-xs font-extrabold tracking-wide text-white uppercase">You + Byte</span>
          </div>
          <div className="pb-14 font-display text-4xl font-bold text-berry-500 sm:text-5xl">VS</div>
          <div className="flex items-end gap-1 sm:gap-4">
            {(['bryan', 'avik'] as Foe[]).map((f) => (
              <div key={f} className="relative flex flex-col items-center">
                <AnimatePresence>{talk.who === f && <Bubble key={talk.key} text={talk.text} align={f === 'avik' ? 'right' : 'center'} />}</AnimatePresence>
                <Villain who={f} pose={talk.who === f ? 'taunt' : 'idle'} size={130} />
                <span className="mt-1 rounded-full bg-berry-600 px-2.5 py-0.5 text-xs font-extrabold tracking-wide text-white uppercase">{NAMES[f]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold">How to win</h2>
          <ul className="space-y-2.5 text-[15px] text-espresso-700">
            <li className="flex gap-3">
              <Clock size={20} className="mt-0.5 shrink-0 text-sky-600" /> Every question has a timer. Read carefully, but don't fall asleep.
            </li>
            <li className="flex gap-3">
              <Zap size={20} className="mt-0.5 shrink-0 text-sun-600" /> A right answer attacks. Get {CRIT_STREAK} in a row for critical hits.
            </li>
            <li className="flex gap-3">
              <FootballIcon size={20} /> A wrong answer (or running out of time) lets them hit back.
            </li>
            <li className="flex gap-3">
              <Trophy size={20} className="mt-0.5 shrink-0 text-brew-500" /> Knock out Bryan, then Avik, before your health runs out. Questions get harder as you go.
            </li>
          </ul>
          <p className="mt-3 text-xs font-semibold text-espresso-400">
            Questions only come from lessons you have finished ({poolSize} so far). Keys 1 to 4 pick an answer, and Enter moves on.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
            <Stat icon={<Swords size={18} className="text-espresso-500" />} label="Battles" value={p.battle.played} />
            <Stat icon={<Trophy size={18} className="text-sun-600" />} label="Wins" value={p.battle.wins} />
            <Stat icon={<Zap size={18} className="text-brew-500" />} label="Best score" value={p.battle.bestScore} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Button size="lg" onClick={onStart} icon={<Swords size={22} />} className="min-w-64">
          Start battle
        </Button>
        <Link to="/practice/session?mode=smart" className="text-sm font-bold text-espresso-400 hover:text-espresso-600">
          Want a calm review instead? Start a quiet practice session
        </Link>
      </div>
    </div>
  )
}

/** A football pitch for the arena floor. */
function Pitch() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#6cc56f_0_56px,#5db861_56px_112px)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-white/80" />
      <div className="absolute top-0 left-1/2 h-full w-1 -translate-x-1/2 bg-white/70" />
      <div className="absolute top-[30%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border-4 border-white/70" />
    </div>
  )
}

// ------------------------------------------------------------------ the battle

interface Fx {
  key: number
  kind: 'code' | 'ball' | 'laser'
  from: { x: number; y: number }
  to: { x: number; y: number }
}

interface Popup {
  key: number
  target: 'player' | Foe
  text: string
  crit: boolean
}

function Battle({ pool, onDone, onQuit }: { pool: string[]; onDone: (s: BattleState, xp: number) => void; onQuit: () => void }) {
  const [state, setState] = useState<BattleState>(() => startBattle(buildDeck(pool)))
  // the question on screen only changes when the learner presses Next, not the moment they answer
  const [shown, setShown] = useState(0)
  const qid = currentQuestionId({ ...state, index: shown })
  const q = battleQuestion(qid)
  const [order, setOrder] = useState(() => shuffledOrder(4))
  const [picked, setPicked] = useState<number | null>(null) // display index, or -1 for a timeout
  const [turn, setTurn] = useState<Turn | null>(null)
  const total = timeFor(q)
  const [timeLeft, setTimeLeft] = useState(total)
  const [poses, setPoses] = useState<Record<Foe, VillainPose>>({ bryan: 'taunt', avik: 'idle' })
  const [playerMood, setPlayerMood] = useState<MascotMood>('encouraging')
  const [playerPose, setPlayerPose] = useState<VillainPose>('idle')
  const [bubbles, setBubbles] = useState<Record<Foe, { text: string; key: number } | null>>({ bryan: { text: pickLine('bryan', 'intro'), key: 1 }, avik: null })
  const [fx, setFx] = useState<Fx | null>(null)
  const [popup, setPopup] = useState<Popup | null>(null)
  const [xp, setXp] = useState(0)
  const arena = useRef<HTMLDivElement>(null)
  const wide = useWide()
  const refs = { player: useRef<HTMLDivElement>(null), bryan: useRef<HTMLDivElement>(null), avik: useRef<HTMLDivElement>(null) }
  const lastLine = useRef<Record<Foe, string>>({ bryan: '', avik: '' })
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const counter = useRef(10)

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const say = useCallback((who: Foe, moment: BattleMoment, delay = 0) => {
    const text = pickLine(who, moment, lastLine.current[who])
    if (!text) return
    lastLine.current[who] = text
    const key = ++counter.current
    // one speaker at a time, so the bubbles never overlap
    later(delay, () => setBubbles({ bryan: null, avik: null, [who]: { text, key } }))
    later(delay + 3400, () => setBubbles((b) => (b[who]?.key === key ? { ...b, [who]: null } : b)))
  }, [])

  // the intro bubble fades on its own; Avik chimes in a moment later
  useEffect(() => {
    later(3200, () => setBubbles((b) => (b.bryan?.key === 1 ? { ...b, bryan: null } : b)))
    say('avik', 'intro', 1200)
    later(900, () => setPoses((p) => ({ ...p, bryan: 'idle' })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const center = (el: HTMLDivElement | null) => {
    const a = arena.current?.getBoundingClientRect()
    const r = el?.getBoundingClientRect()
    if (!a || !r) return { x: 0, y: 0 }
    return { x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height * 0.4 }
  }

  const resolve = (displayIndex: number, secondsLeft: number) => {
    if (picked !== null || state.status !== 'fighting') return
    const timedOut = displayIndex === -1
    const correct = !timedOut && order[displayIndex] === q.answer
    setPicked(displayIndex)
    const foe = state.foe
    const { state: next, turn: t } = answer(state, correct, secondsLeft, timedOut)
    setTurn(t)
    setState(next)
    store.recordAnswer({ qid: q.id, topic: q.topic, difficulty: q.difficulty, correct, solved: correct, source: 'practice', isDebugging: false })
    const key = ++counter.current

    if (correct) {
      sfx.correct()
      setXp((v) => v + answerXp(q.difficulty, 1))
      setPlayerMood('excited')
      setPlayerPose('attack')
      setFx({ key, kind: 'code', from: center(refs.player.current), to: center(refs[foe].current) })
      later(380, () => {
        setPoses((p) => ({ ...p, [foe]: t.knockedOut ? 'defeated' : 'hurt' }))
        setPopup({ key, target: foe, text: `-${t.damage}`, crit: t.crit })
      })
      if (t.knockedOut) {
        say(foe, 'defeated', 420)
        if (t.knockedOut === 'bryan') {
          later(1300, () => setPoses((p) => ({ ...p, avik: 'taunt' })))
          say('avik', 'stepIn', 1500)
        }
      } else say(foe, 'hit', 420)
    } else {
      sfx.wrong()
      setPoses((p) => ({ ...p, [foe]: 'attack' }))
      setFx({ key, kind: foe === 'bryan' ? 'ball' : 'laser', from: center(refs[foe].current), to: center(refs.player.current) })
      say(foe, timedOut ? 'timeout' : 'attack')
      later(380, () => {
        setPlayerMood(next.status === 'lost' ? 'confused' : 'surprised')
        setPlayerPose('hurt')
        setPopup({ key, target: 'player', text: `-${t.damage}`, crit: false })
      })
      if (next.status === 'lost') {
        later(900, () => setPoses((p) => ({ ...p, [foe]: 'victory' })))
      }
    }
    later(900, () => {
      setPlayerPose('idle')
      setPoses((p) => {
        const out = { ...p }
        for (const f of ['bryan', 'avik'] as Foe[]) if (out[f] === 'hurt' || out[f] === 'attack') out[f] = next.foeHp[f] === 0 ? 'defeated' : 'idle'
        return out
      })
      if (next.status === 'fighting') setPlayerMood('happy')
      if (next.status === 'won') setPlayerMood('celebrating')
    })
  }

  // the countdown: runs until an answer is picked
  useEffect(() => {
    if (picked !== null || state.status !== 'fighting') return
    const deadline = performance.now() + total * 1000
    setTimeLeft(total)
    const id = setInterval(() => {
      const left = Math.max(0, (deadline - performance.now()) / 1000)
      setTimeLeft(left)
      if (left <= 0) clearInterval(id)
    }, 100)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, picked === null])

  useEffect(() => {
    if (picked === null && timeLeft <= 0 && state.status === 'fighting') resolve(-1, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const nextQuestion = () => {
    if (picked === null) return
    if (state.status !== 'fighting') {
      onDone(state, xp)
      return
    }
    setShown(state.index)
    setPicked(null)
    setTurn(null)
    setOrder(shuffledOrder(4))
    setFx(null)
    if (Math.random() < 0.35) say(state.foe, 'taunt', 200)
  }

  // keys: 1 to 4 answer, Enter moves on
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return
      if (picked === null && /^[1-4]$/.test(e.key)) resolve(Number(e.key) - 1, timeLeft)
      else if (picked !== null && e.key === 'Enter') {
        e.preventDefault()
        nextQuestion()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const urgent = timeLeft <= 5
  const correctIndex = order.indexOf(q.answer)
  const chosen = picked !== null && picked >= 0 ? q.options[order[picked]] : null
  const optionMono = q.optionStyle === 'code' || q.optionStyle === 'output'
  const fighting = (f: Foe) => state.foe === f && state.foeHp[f] > 0

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-espresso-900 px-3 py-1.5 font-display text-sm font-semibold text-white">
            Score <span className="ml-1 text-sun-300">{state.score}</span>
          </span>
          <motion.span
            key={state.streak}
            initial={{ scale: state.streak ? 1.25 : 1 }}
            animate={{ scale: 1 }}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-display text-sm font-semibold ${state.streak >= CRIT_STREAK ? 'bg-brew-500 text-white' : 'bg-brew-100 text-brew-700'}`}
          >
            <Flame size={16} className={state.streak ? 'fill-current' : ''} /> {state.streak} streak
            {state.streak >= CRIT_STREAK && <span className="ml-1 text-[11px] font-extrabold tracking-wider uppercase">Crits on!</span>}
          </motion.span>
          <span className="hidden rounded-xl bg-white px-3 py-1.5 text-sm font-bold text-espresso-500 sm:inline">Question {state.answered + (picked === null ? 1 : 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={<RotateCcw size={16} />} onClick={() => onDone({ ...state, status: 'lost' }, -1)}>
            Restart
          </Button>
          <Button variant="ghost" size="sm" icon={<LogOut size={16} />} onClick={onQuit}>
            Quit
          </Button>
        </div>
      </div>

      {/* arena */}
      <div ref={arena} className="relative overflow-hidden rounded-[32px] border-2 border-espresso-900 bg-gradient-to-b from-sky-100 via-cream-50 to-cream-50 shadow-[0_6px_0_var(--color-espresso-900)]">
        <Pitch />
        <div className="relative grid grid-cols-[1fr_auto_1fr_1fr] items-end gap-2 px-3 pt-24 pb-4 sm:px-8 sm:pt-20">
          {/* player */}
          <div className="flex flex-col items-center gap-2">
            <div ref={refs.player} className="relative">
              <Fighter pose={playerPose} facing={1}>
                <Mascot mood={playerMood} size={wide ? 124 : 80} />
              </Fighter>
              <AnimatePresence>{popup?.target === 'player' && <DamagePopup key={popup.key} popup={popup} />}</AnimatePresence>
            </div>
            <HpBar label="You" hp={state.playerHp} max={PLAYER_HP} tone="mint" />
          </div>
          <div className="self-center pb-12 font-display text-2xl font-bold text-berry-400 sm:text-3xl">VS</div>
          {(['bryan', 'avik'] as Foe[]).map((f) => (
            <div key={f} className={`relative flex flex-col items-center gap-2 transition-opacity ${fighting(f) || state.foeHp[f] === 0 || state.status !== 'fighting' ? 'opacity-100' : 'opacity-70'}`}>
              <AnimatePresence>{bubbles[f] && <Bubble key={bubbles[f]!.key} text={bubbles[f]!.text} align={f === 'avik' ? 'right' : 'center'} />}</AnimatePresence>
              <div ref={refs[f]} className="relative">
                {fighting(f) && <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded-full bg-berry-500 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-white uppercase">Fighting</span>}
                <Fighter pose={poses[f]} facing={-1}>
                  <Villain who={f} pose={poses[f]} size={fighting(f) ? (wide ? 132 : 84) : wide ? 104 : 70} />
                </Fighter>
                <AnimatePresence>{popup?.target === f && <DamagePopup key={popup.key} popup={popup} />}</AnimatePresence>
              </div>
              <HpBar label={NAMES[f]} hp={state.foeHp[f]} max={FOE_HP} tone="berry" />
            </div>
          ))}
        </div>
        <AnimatePresence>{fx && <Projectile key={fx.key} fx={fx} />}</AnimatePresence>
      </div>

      {/* timer */}
      <div className="flex items-center gap-3">
        <Clock size={18} className={urgent ? 'text-berry-500' : 'text-espresso-400'} />
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-espresso-100" role="timer" aria-label={`${Math.ceil(timeLeft)} seconds left`}>
          <div
            className={`h-full rounded-full transition-[width] duration-100 ease-linear ${timeLeft / total > 0.5 ? 'bg-mint-500' : urgent ? 'bg-berry-500' : 'bg-sun-400'}`}
            style={{ width: `${(timeLeft / total) * 100}%` }}
          />
        </div>
        <span className={`w-10 text-right font-display font-bold tabular-nums ${urgent && picked === null ? 'animate-pulse text-berry-600' : 'text-espresso-700'}`}>{Math.ceil(timeLeft)}s</span>
      </div>

      {/* question */}
      <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold tracking-wider text-espresso-400 uppercase">
          <span className={q.difficulty === 1 ? 'text-mint-600' : q.difficulty === 2 ? 'text-sun-700' : 'text-berry-600'}>{q.difficulty === 1 ? 'Beginner' : q.difficulty === 2 ? 'Intermediate' : 'Advanced'}</span>
          <span>·</span>
          <span>{q.type === 'predict-output' ? 'What does it print?' : 'Pick one'}</span>
        </div>
        <div className="text-lg font-semibold text-espresso-900">
          <Md text={q.prompt} />
        </div>
        {q.code && <CodeBlock code={q.code} size="sm" className="mt-3" copy={false} />}
        {q.stdin && (
          <p className="mt-2 text-sm font-semibold text-espresso-500">
            The user types: <code className="rounded bg-espresso-50 px-1.5 py-0.5 font-mono">{q.stdin.trim().split('\n').join(', ')}</code>
          </p>
        )}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {order.map((oi, di) => {
            const opt = q.options[oi]
            const isRight = picked !== null && di === correctIndex
            const isWrongPick = picked === di && di !== correctIndex
            return (
              <button
                key={`${qid}-${oi}`}
                type="button"
                disabled={picked !== null}
                onClick={() => resolve(di, timeLeft)}
                className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                  isRight
                    ? 'border-mint-500 bg-mint-50'
                    : isWrongPick
                      ? 'border-berry-400 bg-berry-50'
                      : picked !== null
                        ? 'border-espresso-100 opacity-60'
                        : 'border-espresso-200 bg-white shadow-[0_3px_0_var(--color-espresso-200)] hover:border-sky-300 hover:bg-sky-50 active:translate-y-[2px] active:shadow-none'
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${isRight ? 'bg-mint-500 text-white' : isWrongPick ? 'bg-berry-500 text-white' : 'bg-espresso-100 text-espresso-600'}`}>{di + 1}</span>
                <span className={`min-w-0 flex-1 ${optionMono ? 'font-mono text-sm whitespace-pre-wrap' : 'font-semibold'}`}>{optionMono ? opt.text : <Md text={opt.text} />}</span>
                {isRight && <CheckCircle2 size={20} className="shrink-0 text-mint-600" />}
                {isWrongPick && <XCircle size={20} className="shrink-0 text-berry-500" />}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {picked !== null && turn && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-2xl border-2 p-4 ${turn.correct ? 'border-mint-300 bg-mint-50' : 'border-berry-200 bg-berry-50'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <div className={`font-display text-xl font-bold ${turn.correct ? 'text-mint-800' : 'text-berry-700'}`}>
                    {turn.correct
                      ? `${turn.crit ? 'Critical hit! ' : 'Hit! '}+${turn.points} points`
                      : turn.timedOut
                        ? `Time's up! ${NAMES[state.foe]} hits back.`
                        : 'Not quite. They hit back.'}
                  </div>
                  {!turn.correct && chosen?.feedback && (
                    <p className="mt-1 text-[15px] text-espresso-800">
                      <Md text={chosen.feedback} />
                    </p>
                  )}
                  <p className="mt-1 text-[15px] text-espresso-700">
                    <Md text={q.explanation} />
                  </p>
                </div>
                <Button onClick={nextQuestion} icon={<ArrowRight size={18} />} variant={turn.correct ? 'success' : 'primary'} className="shrink-0" autoFocus>
                  {state.status === 'fighting' ? 'Next' : 'See results'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function DamagePopup({ popup }: { popup: Popup }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], y: -46, scale: popup.crit ? 1.35 : 1.1 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
      className={`pointer-events-none absolute top-6 left-1/2 z-30 -translate-x-1/2 font-display text-2xl font-bold whitespace-nowrap ${popup.target === 'player' ? 'text-berry-500' : 'text-brew-600'}`}
      style={{ WebkitTextStroke: '1.5px #241812' }}
    >
      {popup.crit && <span className="mr-1 text-sun-400">CRIT</span>}
      {popup.text}
    </motion.div>
  )
}

/** The attack flying across the arena: Byte's code bolt, Bryan's football, Avik's robot-arm laser. */
function Projectile({ fx }: { fx: Fx }) {
  if (fx.kind === 'laser') {
    const dx = fx.to.x - fx.from.x
    const dy = fx.to.y - fx.from.y
    const len = Math.hypot(dx, dy)
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    return (
      <motion.div
        className="pointer-events-none absolute z-20 h-2 origin-left rounded-full bg-[#5ee6ff] shadow-[0_0_14px_4px_rgba(94,230,255,0.8)]"
        style={{ left: fx.from.x, top: fx.from.y, width: len, rotate: angle }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.55, 1] }}
      />
    )
  }
  return (
    <motion.div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: 0, top: 0 }}
      initial={{ x: fx.from.x, y: fx.from.y, scale: 0.6, rotate: 0, opacity: 1 }}
      animate={{ x: fx.to.x, y: [fx.from.y, Math.min(fx.from.y, fx.to.y) - 50, fx.to.y], scale: 1, rotate: fx.kind === 'ball' ? -540 : 0, opacity: [1, 1, 0] }}
      transition={{ duration: 0.42, ease: 'easeIn', opacity: { times: [0, 0.85, 1], duration: 0.5 } }}
    >
      {fx.kind === 'ball' ? (
        <FootballIcon size={34} />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-espresso-900 bg-brew-400 font-mono text-sm font-bold text-white shadow-[0_0_16px_4px_rgba(247,111,34,0.6)]">{'{ }'}</span>
      )}
    </motion.div>
  )
}

// ------------------------------------------------------------------ results

function Results({ state, reward, onAgain, onLobby }: { state: BattleState; reward: Reward | null; onAgain: () => void; onLobby: () => void }) {
  const won = state.status === 'won'
  const p = useProgress()
  const [lines] = useState(() => ({
    bryan: pickLine('bryan', won ? 'playerWon' : 'victory'),
    avik: pickLine('avik', won ? 'playerWon' : 'victory'),
  }))
  const newBest = state.score > 0 && state.score >= p.battle.bestScore
  // they take turns, so the bubbles never overlap
  const [speaker, setSpeaker] = useState<Foe>('bryan')
  useEffect(() => {
    const id = setInterval(() => setSpeaker((s) => (s === 'bryan' ? 'avik' : 'bryan')), 3200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.h1 initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-5xl font-bold ${won ? 'text-mint-700' : 'text-berry-600'}`}>
        {won ? 'Victory!' : 'Defeated... for now'}
      </motion.h1>
      <p className="mt-2 text-espresso-600">{won ? 'You out-coded Bryan and Avik. They will never live this down.' : 'Bryan and Avik win this round. Every question you missed is one you will know next time.'}</p>

      <div className="relative mt-6 overflow-hidden rounded-[32px] border-2 border-espresso-900 bg-gradient-to-b from-sky-100 via-cream-50 to-cream-50 shadow-[0_6px_0_var(--color-espresso-900)]">
        <Pitch />
        <div className="relative flex items-end justify-between gap-2 px-4 pt-24 pb-6 sm:px-10">
          <Fighter pose={won ? 'victory' : 'defeated'} facing={1}>
            <Mascot mood={won ? 'celebrating' : 'confused'} size={110} />
          </Fighter>
          <div className="flex items-end gap-2 sm:gap-6">
            {(['bryan', 'avik'] as Foe[]).map((f) => (
              <div key={f} className="relative">
                <AnimatePresence>{speaker === f && <Bubble key={f} text={lines[f]} align={f === 'avik' ? 'right' : 'center'} />}</AnimatePresence>
                <Fighter pose={won ? 'defeated' : 'victory'} facing={-1}>
                  <Villain who={f} pose={won ? 'defeated' : 'victory'} size={104} />
                </Fighter>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<Zap size={18} className="text-brew-500" />} label={newBest ? 'New best!' : 'Score'} value={state.score} />
        <Stat icon={<CheckCircle2 size={18} className="text-mint-600" />} label="Accuracy" value={`${Math.round(accuracy(state) * 100)}%`} />
        <Stat icon={<Swords size={18} className="text-espresso-500" />} label="Correct" value={`${state.correct}/${state.answered}`} />
        <Stat icon={<Flame size={18} className="text-brew-500" />} label="Best streak" value={state.bestStreak} />
      </div>
      {reward && <p className="mt-3 font-display text-lg font-semibold text-sun-700">+{reward.xp} XP</p>}

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onAgain} icon={<RotateCcw size={20} />}>
          {won ? 'Play again' : 'Rematch'}
        </Button>
        <Button size="lg" variant="secondary" onClick={onLobby}>
          Back to the lobby
        </Button>
        <ButtonLink size="lg" variant="ghost" to="/learn">
          Continue learning
        </ButtonLink>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ page

export function BattlePage() {
  const p = useProgress()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pool = useMemo(() => battlePool(p), [p.lessons, p.units])
  const [phase, setPhase] = useState<'lobby' | 'battle' | 'results'>('lobby')
  const [run, setRun] = useState(0)
  const [final, setFinal] = useState<{ state: BattleState; reward: Reward | null } | null>(null)

  if (!pool.length) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
        <div className="flex items-end gap-2">
          <Villain who="bryan" pose="taunt" size={110} />
          <Villain who="avik" pose="idle" size={110} />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Bryan and Avik are waiting</h1>
        <p className="mt-2 text-espresso-600">The Java battle uses questions from lessons you have finished. Finish your first lesson, then come back and show them what you learned.</p>
        <ButtonLink to="/learn" size="lg" className="mt-6">
          Go to the path
        </ButtonLink>
      </div>
    )
  }

  const start = () => {
    setFinal(null)
    setRun((r) => r + 1)
    setPhase('battle')
  }

  if (phase === 'battle') {
    return (
      <Battle
        key={run}
        pool={pool}
        onQuit={() => setPhase('lobby')}
        onDone={(s, xp) => {
          // a restart from the HUD just starts over without recording anything
          if (xp < 0) return start()
          const reward = store.finishBattle({ won: s.status === 'won', score: s.score, correct: s.correct, answered: s.answered, bestStreak: s.bestStreak, xp })
          if (s.status === 'won') {
            sfx.complete()
            celebrate('big')
          }
          setFinal({ state: s, reward })
          setPhase('results')
        }}
      />
    )
  }
  if (phase === 'results' && final) return <Results state={final.state} reward={final.reward} onAgain={start} onLobby={() => setPhase('lobby')} />
  return <Lobby onStart={start} poolSize={pool.length} />
}
