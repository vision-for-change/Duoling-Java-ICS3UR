import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpenText, Check, Crown, Lock, Play, SkipForward, Trophy } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { checkpointId, getQuestion } from '../data/curriculum'
import type { Difficulty, Unit } from '../data/types'
import { XP } from '../engine/gamification'
import { checkpointStatus, isPlacedOut, isUnitComplete, isUnitRevealed, lessonStatus, nextStep, unitProgress, type NodeStatus } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import type { Progress } from '../state/types'
import { buttonClass } from './Button'
import { Mascot } from './Mascot'
import { ProgressBar } from './ProgressBar'
import { AppIcon, DifficultyDots } from './AppIcon'
import type { NavTarget } from './SkipAhead'

const OFFSETS = [0, 58, 88, 58, 0, -58, -88, -58]
const GAP = 108
const NODE = 76

interface PathNode {
  id: string
  kind: 'lesson' | 'checkpoint'
  title: string
  summary: string
  status: NodeStatus
  to: string
  questionCount: number
}

function nodesFor(unit: Unit, p: Progress): PathNode[] {
  const lessons: PathNode[] = unit.lessons.map((l) => ({
    id: l.id,
    kind: 'lesson',
    title: l.title,
    summary: l.summary,
    status: lessonStatus(p, l),
    to: `/lesson/${l.id}`,
    questionCount: Math.min(5, l.questions.length) + 1,
  }))
  const cp: PathNode = {
    id: checkpointId(unit.id),
    kind: 'checkpoint',
    title: `Unit ${unit.number} Checkpoint`,
    summary: 'Harder questions that combine everything in this unit.',
    status: checkpointStatus(p, unit),
    to: `/checkpoint/${unit.id}`,
    questionCount: unit.checkpoint.length,
  }
  return [...lessons, cp]
}

const STATUS_TEXT: Record<NodeStatus, string> = {
  completed: 'completed',
  current: 'up next',
  unlocked: 'unlocked',
  skipped: 'skipped',
  locked: 'locked',
}

function NodeButton({ node, unit, onClick, active }: { node: PathNode; unit: Unit; onClick: () => void; active: boolean }) {
  const style = UNIT_STYLES[unit.color]
  const s = node.status
  const size = node.kind === 'checkpoint' ? NODE + 10 : NODE
  const iconSize = node.kind === 'checkpoint' ? 36 : 32
  const Icon = s === 'completed' ? (node.kind === 'checkpoint' ? Crown : Check) : s === 'locked' ? Lock : s === 'current' ? Play : s === 'skipped' ? SkipForward : node.kind === 'checkpoint' ? Trophy : BookOpenText
  const look =
    s === 'completed'
      ? 'border-sun-700 bg-sun-400 text-espresso-900 active:shadow-[0_2px_0_var(--color-sun-700)]'
      : s === 'current'
        ? `${style.border} ${style.bg} animate-pulse-ring text-white`
        : s === 'skipped'
          ? 'border-dashed border-sun-600 bg-sun-50 text-sun-700'
          : s === 'locked'
            ? 'border-espresso-200 bg-espresso-50 text-espresso-300'
            : `${style.border} ${style.text} bg-white`
  const shade = s === 'completed' ? 'var(--color-sun-700)' : s === 'skipped' ? 'var(--color-sun-600)' : s === 'locked' ? 'var(--color-espresso-200)' : style.shade
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${node.title} (${STATUS_TEXT[s]})`}
      aria-expanded={active}
      className={`relative flex items-center justify-center rounded-full border-[3px] transition-transform active:translate-y-[4px] ${look}`}
      style={{ width: size, height: size, boxShadow: `0 6px 0 ${shade}` }}
    >
      {(s === 'completed' || s === 'current') && <span className="absolute inset-x-3 top-2 h-1/3 rounded-full bg-white/25" aria-hidden />}
      <Icon size={iconSize} strokeWidth={2.6} fill={s === 'current' ? 'currentColor' : 'none'} />
      {s === 'skipped' && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-sun-600 bg-sun-50 px-2 text-[10px] font-extrabold tracking-wider text-sun-700 uppercase">Skipped</span>
      )}
    </button>
  )
}

function UnitBanner({ unit, p, guide = true }: { unit: Unit; p: Progress; guide?: boolean }) {
  const style = UNIT_STYLES[unit.color]
  const prog = unitProgress(p, unit)
  const placed = isPlacedOut(p, unit)
  const complete = isUnitComplete(p, unit)
  return (
    <div className={`relative overflow-hidden rounded-3xl border-2 ${style.border} bg-gradient-to-br ${style.gradient} p-5 text-white shadow-[0_5px_0_var(--shade)]`} style={{ ['--shade' as string]: style.shade }}>
      <div className="pointer-events-none absolute -top-8 -right-6 text-[120px] leading-none opacity-15 select-none" aria-hidden>
        <AppIcon name={unit.icon} size={120} strokeWidth={1.6} />
      </div>
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold tracking-widest text-white/80 uppercase">
            Unit {unit.number}
            {complete ? ' · complete ✓' : placed ? ' · placed out' : ''}
          </div>
          <h2 className="mt-1 text-2xl leading-tight font-bold">{unit.title}</h2>
          <p className="mt-1 text-sm font-semibold text-white/90">{unit.tagline}</p>
        </div>
        {guide && (
          <Link
            to={`/guide/${unit.id}`}
            className="shrink-0 rounded-2xl border-2 border-white/40 bg-white/15 px-3 py-2 font-display text-sm font-semibold tracking-wide uppercase transition hover:bg-white/25"
          >
            <span className="hidden sm:inline">Guidebook</span>
            <BookOpenText size={20} className="sm:hidden" />
          </Link>
        )}
      </div>
      <div className="relative mt-4 flex items-center gap-3">
        <ProgressBar value={prog.fraction} color="sun" height={12} track="bg-white/25" label={`Unit ${unit.number} progress`} />
        <span className="shrink-0 font-display text-sm font-semibold">
          {prog.done}/{prog.total}
        </span>
      </div>
    </div>
  )
}

function Popover({ node, unit, onClose, onSkip }: { node: PathNode; unit: Unit; onClose: () => void; onSkip: (t: NavTarget) => void }) {
  const navigate = useNavigate()
  const style = UNIT_STYLES[unit.color]
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    setTimeout(() => document.addEventListener('mousedown', onDown), 0)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  const xp = node.kind === 'checkpoint' ? `up to ${XP.unitComplete}+ XP` : `${XP.lessonComplete}+ XP`
  const hardest = node.kind === 'checkpoint' ? 3 : Math.max(...unit.lessons.find((l) => l.id === node.id)!.questions.map((q) => getQuestion(q).difficulty))
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.95 }}
      className={`absolute top-full left-1/2 z-20 mt-4 w-72 -translate-x-1/2 rounded-3xl border-2 p-4 shadow-[0_5px_0_var(--shade)] ${style.border} bg-white`}
      style={{ ['--shade' as string]: style.shade }}
      role="dialog"
      aria-label={node.title}
    >
      <div className="text-xs font-extrabold tracking-wider text-espresso-400 uppercase">
        {node.kind === 'checkpoint' ? 'Unit challenge' : 'Lesson'} · {node.questionCount} questions · <DifficultyDots upTo={hardest as Difficulty} />
      </div>
      <h3 className="mt-1 text-xl font-bold">{node.title}</h3>
      <p className="mt-1 text-sm text-espresso-600">{node.summary}</p>
      {node.status === 'locked' ? (
        <>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-espresso-50 px-3 py-2 text-sm font-semibold text-espresso-600">
            <Lock size={16} className="mt-0.5 shrink-0" /> Locked. It opens when you finish the lesson before it.
          </p>
          <button type="button" onClick={() => onSkip({ id: node.id, title: node.title, to: node.to, status: node.status })} className={buttonClass('secondary', 'md', 'mt-3 w-full')} autoFocus>
            Skip ahead to this one
          </button>
        </>
      ) : (
        <>
          {node.status === 'skipped' && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-sun-50 px-3 py-2 text-sm font-semibold text-sun-800">
              <SkipForward size={16} className="mt-0.5 shrink-0" /> You skipped this one. It is not completed yet, but you can do it any time.
            </p>
          )}
          <button type="button" onClick={() => navigate(node.to)} className={buttonClass(node.status === 'completed' ? 'secondary' : 'primary', 'md', 'mt-3 w-full')} autoFocus>
            {node.status === 'completed' ? 'Practice again' : node.kind === 'checkpoint' ? 'Start checkpoint' : 'Start'} · {xp}
          </button>
        </>
      )}
    </motion.div>
  )
}

function UnitPath({ unit, p, currentId, interactive, onSkip }: { unit: Unit; p: Progress; currentId: string | null; interactive: boolean; onSkip: (t: NavTarget) => void }) {
  const nodes = nodesFor(unit, p)
  const [open, setOpen] = useState<string | null>(null)
  const width = 340
  const height = nodes.length * GAP
  const centers = nodes.map((_, i) => ({ x: width / 2 + OFFSETS[i % OFFSETS.length], y: i * GAP + GAP / 2 }))
  const style = UNIT_STYLES[unit.color]
  let d = ''
  centers.forEach((c, i) => {
    if (i === 0) d += `M ${c.x} ${c.y}`
    else {
      const prev = centers[i - 1]
      const my = (prev.y + c.y) / 2
      d += ` C ${prev.x} ${my}, ${c.x} ${my}, ${c.x} ${c.y}`
    }
  })
  const doneCount = nodes.filter((n) => n.status === 'completed').length
  // color the trail up to the first node that is not finished
  const firstOpen = nodes.findIndex((n) => n.status !== 'completed')
  const trail = firstOpen === -1 ? nodes.length : firstOpen

  return (
    <div className="relative mx-auto" style={{ width, height }}>
      <svg className="absolute inset-0" width={width} height={height} aria-hidden>
        <path d={d} fill="none" stroke="var(--color-espresso-200)" strokeWidth={10} strokeLinecap="round" strokeDasharray="2 18" />
        {trail > 0 && (
          <path
            d={d}
            fill="none"
            stroke={style.hex}
            strokeOpacity={0.35}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${trail * GAP * 1.08} 99999`}
          />
        )}
      </svg>
      {nodes.map((n, i) => {
        const c = centers[i]
        const isCurrent = n.id === currentId
        return (
          <div key={n.id} className="absolute" style={{ left: c.x, top: c.y, transform: 'translate(-50%, -50%)', zIndex: open === n.id ? 30 : 10 }}>
            {isCurrent && (
              <motion.div
                initial={{ y: 4 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className={`absolute -top-12 left-1/2 -translate-x-1/2 rounded-xl border-2 bg-white px-3 py-1 font-display text-sm font-bold tracking-wider whitespace-nowrap uppercase ${style.text} ${style.border}`}
              >
                {n.kind === 'checkpoint' ? 'Challenge!' : doneCount === 0 && i === 0 ? 'Start' : 'Next'}
                <span className={`absolute top-full left-1/2 -mt-[5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r-2 border-b-2 bg-white ${style.border}`} />
              </motion.div>
            )}
            <NodeButton node={n} unit={unit} active={open === n.id} onClick={() => interactive && setOpen(open === n.id ? null : n.id)} />
            {isCurrent && (
              <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${OFFSETS[i % OFFSETS.length] >= 0 ? 'right-full mr-6' : 'left-full ml-6'}`}>
                <Mascot mood="excited" size={78} float />
              </div>
            )}
            <AnimatePresence>{open === n.id && <Popover node={n} unit={unit} onClose={() => setOpen(null)} onSkip={(target) => { setOpen(null); onSkip(target) }} />}</AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export function LearningPath({
  units,
  progress,
  interactive = true,
  showBanners = true,
  onSkip,
}: {
  units: Unit[]
  progress: Progress
  interactive?: boolean
  showBanners?: boolean
  /** called when a locked node is chosen, so the page can ask "skip ahead?" */
  onSkip: (t: NavTarget) => void
}) {
  const next = nextStep(progress)
  const currentId = next && next.kind !== 'final' ? next.id : null
  // later units stay hidden until the learner reaches them (or skips ahead to them)
  const shown = units.filter((u) => isUnitRevealed(progress, u))
  const hidden = units.length - shown.length
  return (
    <div className="space-y-10">
      {shown.map((unit) => (
        <section key={unit.id} id={unit.id} className="scroll-mt-24 space-y-8" aria-label={`Unit ${unit.number}: ${unit.title}`}>
          {showBanners && <UnitBanner unit={unit} p={progress} guide={interactive} />}
          <UnitPath unit={unit} p={progress} currentId={currentId} interactive={interactive} onSkip={onSkip} />
        </section>
      ))}
      {hidden > 0 && (
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-3xl border-2 border-dashed border-espresso-200 bg-white/70 p-4 text-sm font-semibold text-espresso-500">
          <Lock size={20} className="shrink-0 text-espresso-300" aria-hidden />
          <span>{hidden === 1 ? 'One more unit' : `${hidden} more units`} will appear as you finish the lessons in front of you.</span>
        </div>
      )}
    </div>
  )
}
