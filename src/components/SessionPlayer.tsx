import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { getQuestion } from '../data/curriculum'
import type { MascotMood, Question } from '../data/types'
import { runJava, type RunResult } from '../java'
import { fillBlanks, grade as gradeAnswer, type GradeResult, type Response } from '../engine/grading'
import {
  advance,
  currentStep,
  disableHearts,
  isFinished,
  outOfHearts,
  progressFraction,
  recordAttempt,
  type SessionState,
} from '../engine/session'
import { sessionFlag } from '../lib/motion'
import { sfx } from '../lib/sound'
import { store, type Reward } from '../state/store'
import { Button } from './Button'
import { FeedbackPanel } from './FeedbackPanel'
import { Mascot } from './Mascot'
import { Modal } from './Modal'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import { isComplete, shuffledOrder, type Phase } from './questions/types'
import { SessionComplete } from './SessionComplete'
import { HeartsDisplay } from './Stats'
import { TeachCardView } from './TeachCardView'
import { TraceViewer } from './TraceViewer'
import { AppIcon } from './AppIcon'

export interface FinishInfo {
  reward: Reward | null
  headline: string
  subline?: string
  mood?: MascotMood
  passed?: boolean
  primary: { label: string; to: string }
  secondary?: { label: string; to?: string; onClick?: () => void }
  extra?: ReactNode
}

interface SessionPlayerProps {
  initial: SessionState
  onFinish: (s: SessionState) => FinishInfo
  exitTo: string
  /** label for the quit dialog, e.g. "lesson" */
  noun?: string
}

const KIND_ORDER = ['syntax', 'runtime', 'logic', 'none']

function initialResponse(q: Question): Response | null {
  if (q.type === 'write-code' || q.type === 'fix-code') return { type: 'code', code: q.starter }
  return null
}

/** Code that can be traced after answering ("Watch it run"). */
function traceSource(q: Question): { code: string; stdin: string } | null {
  switch (q.type) {
    case 'predict-output':
    case 'type-output':
      return q.code ? { code: q.code, stdin: q.stdin ?? '' } : null
    case 'error-type':
      // code with a compile error never runs, so there is nothing to step through
      return q.answer === 'syntax' ? null : { code: q.code, stdin: q.stdin ?? '' }
    case 'fill-blank':
      return { code: fillBlanks(q.code, q.blanks.map((b) => b[0])), stdin: q.stdin ?? '' }
    case 'find-bug':
      return { code: q.fixedCode, stdin: q.stdin ?? '' }
    default:
      return null
  }
}

export function SessionPlayer({ initial, onFinish, exitTo, noun = 'lesson' }: SessionPlayerProps) {
  const navigate = useNavigate()
  const [s, setS] = useState(initial)
  const [phase, setPhase] = useState<Phase>('answering')
  const [response, setResponse] = useState<Response | null>(null)
  const [grade, setGrade] = useState<GradeResult | null>(null)
  const [disabledOptions, setDisabledOptions] = useState<number[]>([])
  const [lastXp, setLastXp] = useState(0)
  const [codeFailures, setCodeFailures] = useState(0)
  const [followupAdded, setFollowupAdded] = useState(false)
  const [finish, setFinish] = useState<FinishInfo | null>(null)
  const [quitOpen, setQuitOpen] = useState(false)
  const [heartsOpen, setHeartsOpen] = useState(false)
  // guards the out-of-hearts buttons against double activation while the dialog closes
  const heartsHandled = useRef(false)
  const openHearts = () => {
    heartsHandled.current = false
    setHeartsOpen(true)
  }
  const [trace, setTrace] = useState<{ code: string; result: RunResult } | null>(null)
  const maxFraction = useRef(0)
  // achievements can unlock mid-session (e.g. "First Bug Fixed"); show them all at the end
  const startAchievements = useRef(new Set(Object.keys(store.getSnapshot().achievements)))
  const finishWith = useCallback(
    (state: SessionState) => {
      const info = onFinish(state)
      const earned = Object.keys(store.getSnapshot().achievements).filter((id) => !startAchievements.current.has(id))
      if (info.reward) info.reward = { ...info.reward, achievements: [...new Set([...earned, ...info.reward.achievements])] }
      setFinish(info)
    },
    [onFinish],
  )
  const lastText = useRef<string | undefined>(undefined)

  const step = currentStep(s)
  const question = step && step.kind === 'question' ? getQuestion(step.qid) : null
  const stepKey = step?.key ?? 'done'
  // shuffle answer options once per step, so the right answer isn't always first
  const optionOrder = useMemo(
    () => (question && (question.type === 'multiple-choice' || question.type === 'predict-output') ? shuffledOrder(question.options.length) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stepKey],
  )

  useEffect(() => {
    sessionFlag.active = true
    return () => {
      sessionFlag.active = false
    }
  }, [])

  // reset per-step UI state
  useEffect(() => {
    setPhase('answering')
    setGrade(null)
    setDisabledOptions([])
    setCodeFailures(0)
    setFollowupAdded(false)
    setResponse(question ? initialResponse(question) : null)
    window.scrollTo({ top: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey])

  const fraction = useMemo(() => {
    const f = finish ? 1 : progressFraction(s)
    maxFraction.current = Math.max(maxFraction.current, f)
    return maxFraction.current
  }, [s, finish])

  const recordToStore = useCallback(
    (q: Question, firstTry: boolean, solved: boolean) => {
      store.recordAnswer({
        qid: q.id,
        topic: q.topic,
        difficulty: q.difficulty,
        correct: firstTry,
        solved,
        source: s.mode,
        isDebugging: q.type === 'find-bug' || q.type === 'fix-code' || q.type === 'error-type',
      })
    },
    [s.mode],
  )

  const check = useCallback(
    (skipped = false) => {
      if (!question) return
      if (!skipped && (!response || !isComplete(question, response))) return
      const g = skipped ? { correct: false } : gradeAnswer(question, response!)
      lastText.current = response?.type === 'text' ? response.value : undefined
      setGrade(g)
      const isCode = question.type === 'write-code' || question.type === 'fix-code'
      if (isCode && !g.correct) setCodeFailures((n) => n + 1)
      if (isCode && !g.correct && s.attempt >= 2) {
        // unlimited test runs after the first try: no extra penalty
        setPhase('retry')
        sfx.wrong()
        return
      }
      const { state, outcome, xp } = recordAttempt(s, question, g.correct, skipped)
      setFollowupAdded(state.steps.length > s.steps.length)
      setS(state)
      if (outcome === 'correct') {
        sfx.correct()
        setLastXp(xp)
        setPhase('correct')
        recordToStore(question, s.attempt === 1, true)
      } else if (outcome === 'retry') {
        sfx.wrong()
        setPhase('retry')
        if (response?.type === 'choice') setDisabledOptions((d) => [...d, response.index])
        if (response?.type === 'error-kind') setDisabledOptions((d) => [...d, KIND_ORDER.indexOf(response.value)])
      } else {
        if (!skipped) sfx.wrong()
        setPhase('failed')
        recordToStore(question, false, false)
      }
    },
    [question, response, s, recordToStore],
  )

  const showSolution = useCallback(() => {
    if (!question) return
    const { state } = recordAttempt({ ...s, attempt: 2 }, question, false)
    setFollowupAdded(state.steps.length > s.steps.length)
    setS(state)
    setPhase('failed')
    recordToStore(question, false, false)
  }, [question, s, recordToStore])

  const goNext = useCallback(() => {
    if (outOfHearts(s)) {
      openHearts()
      return
    }
    const next = advance(s)
    if (isFinished(next)) {
      setS(next)
      sfx.complete()
      finishWith(next)
      return
    }
    setS(next)
  }, [s, finishWith])

  const retry = useCallback(() => {
    if (outOfHearts(s)) {
      openHearts()
      return
    }
    setPhase('answering')
    if (response?.type === 'choice' || response?.type === 'error-kind' || response?.type === 'bool' || response?.type === 'line') setResponse(null)
    setGrade((g) => (g && (question?.type === 'fill-blank' || question?.type === 'write-code' || question?.type === 'fix-code') ? g : null))
  }, [s, response, question])

  const openTrace = useMemo(() => {
    if (!question) return undefined
    const src = traceSource(question)
    if (!src) return undefined
    return () => {
      const result = runJava(src.code, { stdin: src.stdin, trace: true, maxTraceSteps: 400 })
      if (result.trace.length) setTrace({ code: src.code, result })
    }
  }, [question])

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finish || quitOpen || heartsOpen || trace) return
      const target = e.target as HTMLElement
      const typing = target instanceof HTMLTextAreaElement || (target instanceof HTMLInputElement && target.type !== 'range')
      if (e.key === 'Escape' && !typing) {
        setQuitOpen(true)
        return
      }
      if (typing) return
      if (e.key === 'Enter') {
        if (target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement) {
          // Enter on an already-chosen answer means "check"; any other focused button/link
          // handles Enter natively (so we never trigger two actions at once)
          const chosen =
            target.hasAttribute('data-answer-option') &&
            (target.getAttribute('aria-pressed') === 'true' || target.getAttribute('aria-selected') === 'true')
          if (!chosen) return
        }
        e.preventDefault()
        if (!step) return
        if (step.kind === 'teach') return goNext()
        if (phase === 'answering') return check()
        if (phase === 'retry') return retry()
        return goNext()
      }
      if (question && phase === 'answering' && /^[1-9]$/.test(e.key)) {
        const n = Number(e.key) - 1
        if ((question.type === 'multiple-choice' || question.type === 'predict-output') && n < question.options.length) {
          // number keys follow the order the options are displayed in
          const original = optionOrder.length === question.options.length ? optionOrder[n] : n
          if (!disabledOptions.includes(original)) setResponse({ type: 'choice', index: original })
        } else if (question.type === 'true-false' && n < 2) {
          setResponse({ type: 'bool', value: n === 0 })
        } else if (question.type === 'error-type' && n < 4 && !disabledOptions.includes(n)) {
          setResponse({ type: 'error-kind', value: KIND_ORDER[n] as 'syntax' })
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish, quitOpen, heartsOpen, trace, step, phase, question, disabledOptions, optionOrder, check, retry, goNext])

  if (finish) {
    return <SessionComplete info={finish} summaryState={s} />
  }

  const placement = s.mode === 'placement'
  const locked = phase === 'correct' || phase === 'failed'

  return (
    <div className="flex min-h-dvh flex-col bg-cream-50">
      <header className="sticky top-0 z-20 border-b-2 border-espresso-100 bg-cream-50/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
          <button type="button" onClick={() => setQuitOpen(true)} className="rounded-xl p-2 text-espresso-400 transition hover:bg-espresso-100 hover:text-espresso-700" aria-label={`Quit ${noun}`}>
            <X size={26} strokeWidth={2.6} />
          </button>
          <ProgressBar value={fraction} height={16} label={`${noun} progress`} />
          {s.combo >= 3 && !placement && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="hidden shrink-0 font-display text-sm font-bold text-brew-600 sm:block" title="Answers in a row">
              <AppIcon name="flame" size={16} className="mr-0.5 inline-block align-[-2px] fill-brew-300" /> {s.combo}
            </motion.span>
          )}
          {!placement && <HeartsDisplay hearts={s.hearts} max={s.maxHearts} />}
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <motion.div key={stepKey} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} data-answer-area>
              {step?.kind === 'teach' && <TeachCardView card={step.card} />}
              {step?.kind === 'question' && question && (
                <QuestionCard
                  question={question}
                  role={step.role}
                  response={response}
                  onChange={(r) => phase === 'answering' && setResponse(r)}
                  locked={locked}
                  phase={phase}
                  grade={grade}
                  disabledOptions={disabledOptions}
                  optionOrder={optionOrder}
                  onSubmit={() => (phase === 'answering' ? check() : phase === 'retry' ? retry() : goNext())}
                />
              )}
          </motion.div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-20">
        <FeedbackPanel
          teaching={step?.kind === 'teach'}
          phase={phase}
          question={question}
          grade={grade}
          canCheck={!!question && isComplete(question, response)}
          checkLabel={question && (question.type === 'write-code' || question.type === 'fix-code') ? 'Run tests' : 'Check'}
          xp={lastXp}
          combo={s.combo}
          attempt={s.attempt}
          followupAdded={followupAdded}
          placement={placement}
          onCheck={() => check()}
          onContinue={goNext}
          onRetry={retry}
          onSkip={placement ? () => check(true) : undefined}
          onShowSolution={codeFailures >= 2 ? showSolution : undefined}
          onTrace={openTrace}
          lastResponseText={lastText.current}
        />
      </footer>

      <Modal open={quitOpen} onClose={() => setQuitOpen(false)} size="sm">
        <div className="flex flex-col items-center text-center">
          <Mascot mood="surprised" size={110} />
          <h2 className="mt-2 text-2xl font-bold">Leave this {noun}?</h2>
          <p className="mt-1 text-espresso-600">Your answers so far help Byte track your progress, but you won't get the {noun} XP.</p>
          <div className="mt-5 flex w-full flex-col gap-2">
            <Button full onClick={() => setQuitOpen(false)} data-autofocus>
              Keep learning
            </Button>
            <Button full variant="ghost" onClick={() => navigate(exitTo)}>
              Quit {noun}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={heartsOpen} onClose={() => setHeartsOpen(false)} size="sm" dismissible={false}>
        <div className="flex flex-col items-center text-center">
          <Mascot mood="encouraging" size={110} />
          <h2 className="mt-2 text-2xl font-bold">Out of hearts</h2>
          <p className="mt-1 text-espresso-600">Mistakes are how programmers learn! Keep going without hearts, or start fresh.</p>
          <div className="mt-5 flex w-full flex-col gap-2">
            <Button
              full
              onClick={() => {
                if (heartsHandled.current) return
                heartsHandled.current = true
                const next = disableHearts(s)
                setHeartsOpen(false)
                const adv = advance(next)
                if (phase === 'retry') {
                  setS(next)
                  setPhase('answering')
                  if (response?.type === 'choice' || response?.type === 'error-kind' || response?.type === 'bool' || response?.type === 'line') setResponse(null)
                } else if (isFinished(adv)) {
                  setS(adv)
                  sfx.complete()
                  finishWith(adv)
                } else {
                  setS(adv)
                }
              }}
              data-autofocus
            >
              Keep practicing (no hearts)
            </Button>
            <Button
              full
              variant="secondary"
              onClick={() => {
                if (heartsHandled.current) return
                heartsHandled.current = true
                setHeartsOpen(false)
                maxFraction.current = 0
                setS(initial)
              }}
            >
              Restart {noun}
            </Button>
            <Button full variant="ghost" onClick={() => navigate(exitTo)}>
              Quit
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!trace} onClose={() => setTrace(null)} title="Watch it run" size="xl">
        {trace && <TraceViewer code={trace.code} result={trace.result} />}
      </Modal>
    </div>
  )
}
