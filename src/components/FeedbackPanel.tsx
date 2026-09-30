import { AnimatePresence, motion } from 'motion/react'
import { Clapperboard, Eye, RotateCcw, Zap } from 'lucide-react'
import type { Question } from '../data/types'
import { answerSummary, type GradeResult } from '../engine/grading'
import { Button } from './Button'
import { Mascot } from './Mascot'
import { Md } from './Md'
import type { Phase } from './questions/types'
import { outputHint } from './questions/CodeQuestions'

const CORRECT = ['Nice! You got it!', 'Brewed to perfection! ☕', 'Correct!', 'Java-tastic!', 'Spot on!', 'Exactly right!']
const SECOND = ['Got it on the second try!', 'That\'s the spirit! Mistakes help you learn.']
const RETRY = ['Almost! Let\'s look at what happened.', 'Not quite. Take another look.', 'Close! Check the highlighted part.']
const FAILED = ['Here\'s how it works.', 'Let\'s learn from this one.']

function pick(list: string[], seed: string) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0
  return list[Math.abs(h) % list.length]
}

interface FeedbackPanelProps {
  phase: Phase
  question: Question | null
  grade: GradeResult | null
  canCheck: boolean
  checkLabel?: string
  xp: number
  combo: number
  attempt: number
  followupAdded: boolean
  placement?: boolean
  onCheck: () => void
  onContinue: () => void
  onRetry: () => void
  onSkip?: () => void
  onShowSolution?: () => void
  onTrace?: () => void
  /** teaching step: only a Continue button */
  teaching?: boolean
  lastResponseText?: string
}

function wrongFeedback(q: Question, grade: GradeResult | null, lastResponseText?: string): string | null {
  if (grade?.feedback) return grade.feedback
  if (q.type === 'type-output' && lastResponseText !== undefined) {
    const h = outputHint(q.answer, lastResponseText)
    if (h) return h
  }
  if ((q.type === 'fill-blank' || q.type === 'arrange') && grade?.runResult) {
    // show what the learner's version actually does: a hint that doesn't give the answer away
    const r = grade.runResult
    if (r.status === 'compile-error' && r.error) return `With your answer, Java won't compile it: *${r.error.message.split('\n')[0]}*`
    if (r.status === 'runtime-error' && r.error) return `With your answer, the program crashes with ${r.error.exception}.`
    if (r.status === 'timeout') return 'With your answer, the program never finishes: it is stuck in an infinite loop!'
    if (r.status === 'ok') return `With your answer, the program prints \`${r.stdout.trim().replace(/\n/g, ' ⏎ ') || '(nothing)'}\`, which is not what we want.`
  }
  if (q.type === 'fill-blank' && grade?.blankResults) {
    const bad = grade.blankResults.map((ok, i) => (ok ? null : i + 1)).filter(Boolean)
    if (bad.length && bad.length < grade.blankResults.length) return `Blank${bad.length > 1 ? 's' : ''} ${bad.join(' and ')} ${bad.length > 1 ? 'need' : 'needs'} another look. The others are right.`
  }
  if (q.type === 'find-bug') return q.hint ?? 'That line is fine. Read each line and ask: does it do what the comment/goal says?'
  if ((q.type === 'write-code' || q.type === 'fix-code') && grade?.codeResult) {
    const cr = grade.codeResult
    if (cr.blockingError) return 'Your code doesn\'t compile yet. Check the highlighted line.'
    if (cr.missingPatterns.length) return cr.missingPatterns[0]
    const failed = cr.tests.filter((t) => !t.passed).length
    return `${failed} of ${cr.tests.length} test${cr.tests.length === 1 ? '' : 's'} failed. Compare the expected output with yours.`
  }
  return q.hint ?? null
}

export function FeedbackPanel(props: FeedbackPanelProps) {
  const { phase, question: q, grade, canCheck, checkLabel = 'Check', xp, combo, attempt, followupAdded, placement, onCheck, onContinue, onRetry, onSkip, onShowSolution, onTrace, teaching } = props
  const seed = `${q?.id ?? 'x'}-${attempt}`

  const base = 'border-t-2 pb-[max(env(safe-area-inset-bottom),1rem)]'
  const isCode = q && (q.type === 'write-code' || q.type === 'fix-code')

  if (teaching || phase === 'answering') {
    return (
      <div className={`${base} border-espresso-100 bg-cream-50`}>
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 pt-4 sm:px-6">
          {onSkip && !teaching ? (
            <Button variant="secondary" onClick={onSkip}>
              I don't know yet
            </Button>
          ) : (
            <span className="hidden text-sm font-semibold text-espresso-400 sm:block">
              Press <kbd className="rounded-md border border-espresso-200 bg-white px-1.5 py-0.5 font-mono text-xs">Enter ↵</kbd> to {teaching ? 'continue' : 'check'}
            </span>
          )}
          {teaching ? (
            <Button size="lg" onClick={onContinue} className="w-full sm:w-auto sm:min-w-[160px]" data-autofocus>
              Continue
            </Button>
          ) : (
            <Button size="lg" onClick={onCheck} disabled={!canCheck} className="w-full sm:w-auto sm:min-w-[160px]" variant={isCode ? 'success' : 'primary'}>
              {checkLabel}
            </Button>
          )}
        </div>
      </div>
    )
  }

  const correct = phase === 'correct'
  const retry = phase === 'retry'
  const tone = correct ? 'border-mint-300 bg-mint-100' : retry ? 'border-sun-300 bg-sun-100' : 'border-berry-200 bg-berry-100'
  const headingColor = correct ? 'text-mint-800' : retry ? 'text-espresso-900' : 'text-berry-800'
  const heading = placement
    ? correct
      ? 'Correct!'
      : 'Noted. Let\'s keep going.'
    : correct
      ? combo >= 3
        ? `You're on fire! 🔥 ${combo} in a row`
        : attempt > 1
          ? pick(SECOND, seed)
          : pick(CORRECT, seed)
      : retry
        ? pick(RETRY, seed)
        : pick(FAILED, seed)
  const mood = correct ? (combo >= 3 ? 'celebrating' : 'excited') : retry ? 'confused' : 'encouraging'
  const feedback = q && !correct ? wrongFeedback(q, grade, props.lastResponseText) : null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase + seed}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className={`${base} ${tone}`}
        role="status"
        aria-live="assertive"
      >
        <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="hidden shrink-0 sm:block">
              <Mascot mood={mood} size={74} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-xl font-bold sm:text-2xl ${headingColor}`}>{heading}</h3>
                {correct && xp > 0 && (
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                    className="inline-flex items-center gap-1 rounded-full bg-sun-300 px-2.5 py-0.5 font-display text-sm font-bold text-espresso-900"
                  >
                    <Zap size={14} className="fill-espresso-900" /> +{xp} XP
                  </motion.span>
                )}
              </div>
              <div className="scrollbar-thin mt-1 max-h-[34vh] overflow-y-auto pr-1 text-[15px] leading-relaxed text-espresso-800 sm:text-base">
                {retry && feedback && (
                  <p className="font-semibold">
                    <Md text={feedback} />
                  </p>
                )}
                {retry && !feedback && <p className="font-semibold">Take another look. You still have one more try.</p>}
                {!retry && !correct && feedback && (
                  <p className="mb-1 font-semibold">
                    <Md text={feedback} />
                  </p>
                )}
                {!retry && !correct && q && !isCode && (
                  <p className="mb-1">
                    <span className="font-bold">Answer: </span>
                    <span className="rounded-md bg-white/70 px-1.5 py-0.5 font-mono text-[14px] whitespace-pre-wrap">{answerSummary(q)}</span>
                  </p>
                )}
                {!retry && q && (
                  <p>
                    <span className="font-bold">{correct ? 'Why: ' : 'Why: '}</span>
                    <Md text={q.explanation} />
                  </p>
                )}
                {correct && grade?.alternative && <p className="mt-1 text-sm font-semibold text-mint-700">Your answer works too. Nice thinking!</p>}
                {!correct && !retry && followupAdded && !placement && (
                  <p className="mt-1 text-sm font-bold text-espresso-600">🪜 Byte added an easier question on this idea to help it stick.</p>
                )}
                {q?.type === 'find-bug' && !retry && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-bold text-espresso-600">Show the fixed code</summary>
                    <pre className="mt-1 overflow-x-auto rounded-xl bg-code-bg p-3 font-mono text-sm text-code-text">{q.fixedCode}</pre>
                  </details>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
            {onTrace && !retry && (
              <Button variant="secondary" size="md" onClick={onTrace} icon={<Clapperboard size={18} />}>
                Watch it run
              </Button>
            )}
            {retry ? (
              <>
                {isCode && onShowSolution && (
                  <Button variant="ghost" onClick={onShowSolution} icon={<Eye size={18} />}>
                    Show solution
                  </Button>
                )}
                <Button variant="sun" size="lg" onClick={onRetry} icon={<RotateCcw size={18} />} className="w-full sm:w-auto sm:min-w-[160px]" data-autofocus>
                  Try again
                </Button>
              </>
            ) : (
              <Button variant={correct ? 'success' : 'danger'} size="lg" onClick={onContinue} className="w-full sm:w-auto sm:min-w-[160px]" data-autofocus>
                Continue
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
