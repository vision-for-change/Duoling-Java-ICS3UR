import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, PartyPopper, XCircle } from 'lucide-react'
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
    return (
      <div className="mx-auto max-w-2xl text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <PartyPopper size={48} className="mx-auto text-brew-500" />
          <h1 className="mt-2 text-4xl font-bold">Warm-up complete!</h1>
          <p className="mt-2 font-display text-2xl font-semibold text-brew-600">
            {score} of {questions.length}
          </p>
          <p className="mt-1 text-lg font-bold text-espresso-700">Your rank: {warmupRank(score, questions.length)}</p>
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
        <h2 className="text-xl font-bold">{q.prompt}</h2>
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
                {right && <CheckCircle2 size={20} className="shrink-0 text-mint-600" />}
                {wrong && <XCircle size={20} className="shrink-0 text-berry-500" />}
              </button>
            )
          })}
        </div>
        {chosen && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <MascotSays mood={chosen.correct ? 'celebrating' : 'confused'} size={64} tone={chosen.correct ? 'success' : 'error'} float={false}>
              <span>{chosen.reaction}</span>
              {!chosen.correct && (
                <span className="mt-1 block text-sm">
                  The real one: <b>"{q.saying}"</b>
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
