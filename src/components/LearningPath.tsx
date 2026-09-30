import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpenText, Check, Crown, FastForward, Star, Trophy } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { checkpointId, getQuestion } from '../data/curriculum'
import type { Unit } from '../data/types'
import { XP } from '../engine/gamification'
import { checkpointStatus, isAheadOfPath, isPlacedOut, isUnitComplete, lessonStatus, nextStep, unitProgress, type NodeStatus } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import type { Progress } from '../state/types'
import { buttonClass } from './Button'
import { Mascot } from './Mascot'
import { ProgressBar } from './ProgressBar'

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
  /** shown in the popover when opening this node skips part of the suggested order */
  skipNote: string | null
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
    skipNote: !p.lessons[l.id] && isAheadOfPath(p, l.id) ? 'Skipping ahead is fine! Earlier lessons stay open whenever you want them.' : null,
  }))
  const cp: PathNode = {
    id: checkpointId(unit.id),
    kind: 'checkpoint',
    title: `Unit ${unit.number} Checkpoint`,
    summary: 'Harder questions that combine everything in this unit.',
    status: checkpointStatus(p, unit),
    to: `/checkpoint/${unit.id}`,
    questionCount: unit.checkpoint.length,
    skipNote: !isUnitComplete(p, unit) && unit.lessons.some((l) => !p.lessons[l.id]) ? 'Already know this unit? Pass the checkpoint to complete it right away.' : null,
  }
  return [...lessons, cp]
}

function NodeButton({ node, unit, current, onClick, active }: { node: PathNode; unit: Unit; current: boolean; onClick: () => void; active: boolean }) {
  const style = UNIT_STYLES[unit.color]
  const done = node.status === 'completed'
  const size = node.kind === 'checkpoint' ? NODE + 10 : NODE
  const Icon = done ? (node.kind === 'checkpoint' ? Crown : Check) : node.kind === 'checkpoint' ? Trophy : current ? Star : BookOpenText
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${node.title} (${done ? 'completed' : current ? 'up next' : 'not started'})`}
      aria-expanded={active}
      className={`relative flex items-center justify-center rounded-full border-[3px] transition-transform active:translate-y-[4px] ${
        done
          ? 'border-sun-700 bg-sun-400 text-espresso-900 shadow-[0_6px_0_var(--color-sun-700)] active:shadow-[0_2px_0_var(--color-sun-700)]'
          : current
            ? `${style.border} ${style.bg} animate-pulse-ring text-white`
            : `${style.border} ${style.text} bg-white`
      }`}
      style={{ width: size, height: size, boxShadow: done ? undefined : `0 6px 0 ${style.shade}` }}
    >
      {(done || current) && <span className="absolute inset-x-3 top-2 h-1/3 rounded-full bg-white/25" aria-hidden />}
      <Icon size={node.kind === 'checkpoint' ? 36 : 32} strokeWidth={2.6} fill={current ? 'currentColor' : 'none'} />
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
        {unit.icon}
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

function Popover({ node, unit, onClose }: { node: PathNode; unit: Unit; onClose: () => void }) {
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
        {node.kind === 'checkpoint' ? 'Unit challenge' : 'Lesson'} · {node.questionCount} questions · {'🟢🟡🔴'.slice(0, hardest * 2)}
      </div>
      <h3 className="mt-1 text-xl font-bold">{node.title}</h3>
      <p className="mt-1 text-sm text-espresso-600">{node.summary}</p>
      {node.skipNote && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
          <FastForward size={16} className="mt-0.5 shrink-0" /> {node.skipNote}
        </p>
      )}
      <button type="button" onClick={() => navigate(node.to)} className={buttonClass(node.status === 'completed' ? 'secondary' : 'primary', 'md', 'mt-3 w-full')} autoFocus>
        {node.status === 'completed' ? 'Practice again' : node.kind === 'checkpoint' ? 'Start checkpoint' : 'Start'} · {xp}
      </button>
    </motion.div>
  )
}

function UnitPath({ unit, p, currentId, interactive }: { unit: Unit; p: Progress; currentId: string | null; interactive: boolean }) {
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
  // color the trail up to the first node that isn't finished (lessons can be done in any order)
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
            <NodeButton node={n} unit={unit} current={isCurrent} active={open === n.id} onClick={() => interactive && setOpen(open === n.id ? null : n.id)} />
            {isCurrent && (
              <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${OFFSETS[i % OFFSETS.length] >= 0 ? 'right-full mr-6' : 'left-full ml-6'}`}>
                <Mascot mood="excited" size={78} float />
              </div>
            )}
            <AnimatePresence>{open === n.id && <Popover node={n} unit={unit} onClose={() => setOpen(null)} />}</AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export function LearningPath({ units, progress, interactive = true, showBanners = true }: { units: Unit[]; progress: Progress; interactive?: boolean; showBanners?: boolean }) {
  const next = nextStep(progress)
  const currentId = next && next.kind !== 'final' ? next.id : null
  return (
    <div className="space-y-10">
      {units.map((unit) => (
        <section key={unit.id} id={unit.id} className="scroll-mt-24 space-y-8" aria-label={`Unit ${unit.number}: ${unit.title}`}>
          {showBanners && <UnitBanner unit={unit} p={progress} guide={interactive} />}
          <UnitPath unit={unit} p={progress} currentId={currentId} interactive={interactive} />
        </section>
      ))}
    </div>
  )
}
