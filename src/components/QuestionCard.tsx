import { Keyboard } from 'lucide-react'
import type { IconName, Question } from '../data/types'
import { DIFFICULTY_LABEL } from '../engine/gamification'
import type { QuestionRole } from '../engine/session'
import { CodeBlock } from './CodeBlock'
import { Mascot } from './Mascot'
import { Md } from './Md'
import { ChoiceQuestion, ErrorTypeQuestion, TrueFalseQuestion } from './questions/ChoiceQuestion'
import { ArrangeQuestionView, FillBlankQuestionView, FindBugQuestionView, TypeOutputQuestionView } from './questions/CodeQuestions'
import { CodeTaskQuestionView } from './questions/CodeTaskQuestion'
import { TYPE_LABEL, type QuestionViewProps } from './questions/types'
import { AppIcon, DifficultyDot } from './AppIcon'

const ROLE_BADGE: Partial<Record<QuestionRole, { icon: IconName; text: string; className: string }>> = {
  challenge: { icon: 'zap', text: 'Mini challenge', className: 'bg-grape-100 text-grape-700' },
  followup: { icon: 'footsteps', text: 'Easier follow-up', className: 'bg-sky-100 text-sky-700' },
  retry: { icon: 'refresh', text: 'Let\'s try that again', className: 'bg-brew-100 text-brew-700' },
}

function StdinNote({ stdin }: { stdin: string }) {
  const lines = stdin.replace(/\n$/, '').split('\n')
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50 px-3 py-2 text-sm">
      <Keyboard size={16} className="text-sky-600" />
      <span className="font-bold text-sky-800">The user types:</span>
      {lines.map((l, i) => (
        <kbd key={i} className="rounded-lg border border-sky-300 bg-white px-2 py-0.5 font-mono text-sky-900 shadow-[0_2px_0_var(--color-sky-200)]">
          {l || '(empty)'} ⏎
        </kbd>
      ))}
    </div>
  )
}

/** Shows the code that belongs to a question (for types that don't render it themselves). */
function QuestionCode({ q, highlight }: { q: Question; highlight: number[] }) {
  if (q.type === 'fill-blank' || q.type === 'find-bug' || q.type === 'fix-code' || q.type === 'write-code' || q.type === 'arrange') return null
  if (!q.code) return null
  return <CodeBlock code={q.code} highlight={highlight} tone="warn" />
}

interface QuestionCardProps extends QuestionViewProps {
  role: QuestionRole
  showMascot?: boolean
}

export function QuestionCard(props: QuestionCardProps) {
  const { question: q, role, phase, showMascot = true } = props
  const diff = DIFFICULTY_LABEL[q.difficulty]
  const badge = ROLE_BADGE[role]
  const highlight = phase === 'retry' || phase === 'failed' ? (q.highlightLines ?? []) : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-espresso-800 px-3 py-1 text-xs font-extrabold tracking-wider text-cream-50 uppercase">{TYPE_LABEL[q.type]}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${diff.className}`}>
          <DifficultyDot level={q.difficulty} /> {diff.label}
        </span>
        {badge && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${badge.className}`}>
            <AppIcon name={badge.icon} size={13} /> {badge.text}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        {showMascot && (
          <div className="hidden sm:block">
            <Mascot mood={phase === 'answering' ? 'thinking' : phase === 'correct' ? 'happy' : 'confused'} size={70} />
          </div>
        )}
        <h2 className="flex-1 pt-1 font-sans text-xl leading-snug font-extrabold text-espresso-900 sm:text-2xl">
          <Md text={q.prompt} />
        </h2>
      </div>

      {q.stdin && q.type !== 'fix-code' && q.type !== 'write-code' && <StdinNote stdin={q.stdin} />}
      <QuestionCode q={q} highlight={highlight} />
      <QuestionBody {...props} />
    </div>
  )
}

function QuestionBody(props: QuestionViewProps) {
  const q = props.question
  switch (q.type) {
    case 'multiple-choice':
    case 'predict-output':
      return <ChoiceQuestion {...(props as QuestionViewProps<typeof q>)} />
    case 'true-false':
      return <TrueFalseQuestion {...(props as QuestionViewProps<typeof q>)} />
    case 'error-type':
      return <ErrorTypeQuestion {...(props as QuestionViewProps<typeof q>)} />
    case 'type-output':
      return <TypeOutputQuestionView {...(props as QuestionViewProps<typeof q>)} />
    case 'fill-blank':
      return <FillBlankQuestionView {...(props as QuestionViewProps<typeof q>)} />
    case 'arrange':
      return <ArrangeQuestionView {...(props as QuestionViewProps<typeof q>)} />
    case 'find-bug':
      return <FindBugQuestionView {...(props as QuestionViewProps<typeof q>)} />
    case 'fix-code':
    case 'write-code':
      return <CodeTaskQuestionView {...(props as QuestionViewProps<typeof q>)} />
  }
}
