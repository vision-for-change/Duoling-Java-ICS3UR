import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { pickWarmup, warmupRank, type WarmupQuestion } from '../data/warmup'
import type { FinalProject } from '../data/types'
import { sfx } from '../lib/sound'
import { AppIcon } from './AppIcon'
import { Button } from './Button'
import { MascotSays } from './Mascot'
import { shuffledOrder } from './questions/types'

interface Option {
  text: string
  correct: boolean
  reaction: string
}

function optionsFor(q: WarmupQuestion): Option[] {
  const all: Option[] = [{ text: q.saying, correct: true, reaction: q.correctReaction }, ...q.decoys.map((d) => ({ text: d.text, correct: false, reaction: d.reaction }))]
  return shuffledOrder(all.length).map((i) => all[i])
}

/**
 * The warm-up before a final project: a few quick, silly questions built from the class sayings.
 * It is separate from the project itself and does not count towards anything.
 */
export function WarmupQuiz({ project, onDone }: { project: FinalProject; onDone: () => void }) {
  const questions = useMemo(() => pickWarmup(), [])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const q = questions[index]
  const options = useMemo(() => optionsFor(q), [q])

  if (finished) {
    const rank = warmupRank(score, questions.length)
    return (
      <div className="mx-auto max-w-2xl text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brew-100 text-brew-600">
            <AppIcon name="party" size={36} />
          </span>
          <h1 className="mt-3 text-4xl font-bold">Warm-up complete!</h1>
          <p className="mt-2 font-display text-2xl font-semibold text-brew-600">
            {score} of {questions.length}
          </p>
          <div className="mx-auto mt-4 inline-flex items-center gap-3 rounded-2xl border-2 border-sun-300 bg-sun-50 px-4 py-2.5 shadow-[0_3px_0_var(--color-sun-300)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-sun-600 bg-sun-400 text-white">
              <AppIcon name={rank.icon} size={24} strokeWidth={2.6} className="drop-shadow-[0_1px_0_rgba(36,24,18,0.45)]" />
            </span>
            <span className="text-left">
              <span className="block text-xs font-extrabold tracking-wider text-sun-800 uppercase">Your rank</span>
              <span className="block font-display text-lg font-semibold text-espresso-900">{rank.title}</span>
            </span>
          </div>
        </motion.div>
        <MascotSays mood="celebrating" size={96} className="mt-6 justify-center text-left">
          <span>Brain warmed up, sayings refreshed. Now let us build your {project.title}!</span>
        </MascotSays>
        <Button size="lg" className="mt-8" onClick={onDone} icon={<AppIcon name={project.icon} size={22} />}>
          Start building
        </Button>
      </div>
    )
  }

  const answered = picked !== null
  const chosen = answered ? options[picked] : null

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="text-sm font-extrabold tracking-widest text-brew-600 uppercase">Project warm-up</div>
        <h1 className="mt-1 text-3xl font-bold">Before we build: a quick classroom quiz</h1>
        <p className="mt-1 text-espresso-500">A tradition. It does not count for anything except bragging rights.</p>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2" aria-label={`Question ${index + 1} of ${questions.length}`}>
        {questions.map((_, i) => (
          <span key={i} className={`h-2.5 w-10 rounded-full ${i < index ? 'bg-mint-500' : i === index ? 'bg-brew-500' : 'bg-espresso-100'}`} />
        ))}
      </div>

      <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-6 rounded-3xl border-2 border-espresso-100 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <AppIcon name={q.icon} size={28} />
          </span>
          <h2 className="text-xl font-bold">{q.prompt}</h2>
        </div>
        <div className="mt-4 grid gap-2">
          {options.map((o, i) => {
            const right = answered && o.correct
            const wrong = picked === i && !o.correct
            return (
              <button
                key={o.text}
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(i)
                  if (o.correct) {
                    setScore((s) => s + 1)
                    sfx.correct()
                  } else sfx.wrong()
                }}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold transition ${
                  right ? 'border-mint-500 bg-mint-50' : wrong ? 'border-berry-400 bg-berry-50' : answered ? 'border-espresso-100 opacity-60' : 'border-espresso-200 bg-white shadow-[0_3px_0_var(--color-espresso-200)] hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                <span className="flex-1">{o.text}</span>
                {right && <AppIcon name="check-circle" size={20} className="shrink-0 text-mint-600" />}
                {wrong && <AppIcon name="x-circle" size={20} className="shrink-0 text-berry-500" />}
              </button>
            )
          })}
        </div>
        {chosen && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <MascotSays mood={chosen.correct ? 'celebrating' : 'confused'} size={64} tone={chosen.correct ? 'success' : 'error'} float={false}>
              <span className="flex items-start gap-2">
                <AppIcon name={chosen.correct ? 'party' : 'laugh'} size={20} className={`mt-0.5 shrink-0 ${chosen.correct ? 'text-mint-600' : 'text-berry-500'}`} />
                <span>{chosen.reaction}</span>
              </span>
              {!chosen.correct && (
                <span className="mt-1 flex items-start gap-1.5 text-sm">
                  <AppIcon name={q.icon} size={16} className="mt-0.5 shrink-0" />
                  <span>
                    The real one: <b>"{q.saying}"</b>
                  </span>
                </span>
              )}
            </MascotSays>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  if (index + 1 >= questions.length) setFinished(true)
                  else {
                    setIndex(index + 1)
                    setPicked(null)
                  }
                }}
                icon={<ArrowRight size={18} />}
                autoFocus
              >
                {index + 1 >= questions.length ? 'Finish' : 'Next'}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
