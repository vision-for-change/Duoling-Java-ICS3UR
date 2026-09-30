import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import type { MultipleChoiceQuestion, TrueFalseQuestion, ErrorTypeQuestion, ErrorKind } from '../../data/types'
import { ERROR_KIND_LABELS } from '../../engine/grading'
import { Md } from '../Md'
import type { QuestionViewProps } from './types'
import { AppIcon } from '../AppIcon'

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled' | 'reveal'

function optionClasses(state: OptionState) {
  switch (state) {
    case 'selected':
      return 'border-sky-400 bg-sky-50 text-sky-800 shadow-[0_4px_0_var(--color-sky-400)]'
    case 'correct':
      return 'border-mint-500 bg-mint-50 text-mint-800 shadow-[0_4px_0_var(--color-mint-500)]'
    case 'wrong':
      return 'border-berry-400 bg-berry-50 text-berry-800 shadow-[0_4px_0_var(--color-berry-400)] animate-shake'
    case 'disabled':
      return 'border-espresso-100 bg-espresso-50 text-espresso-300 line-through shadow-none'
    case 'reveal':
      return 'border-mint-400 border-dashed bg-mint-50/60 text-mint-800 shadow-none'
    default:
      return 'border-espresso-200 bg-white text-espresso-800 shadow-[0_4px_0_var(--color-espresso-200)] hover:bg-cream-100'
  }
}

interface OptionButtonProps {
  index: number
  state: OptionState
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
  style?: 'text' | 'code' | 'output'
}

export function OptionButton({ index, state, onClick, disabled, children, style = 'text' }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      data-answer-option
      aria-pressed={state === 'selected'}
      className={`group flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${optionClasses(state)} disabled:cursor-default`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 font-display text-sm font-bold ${
          state === 'selected'
            ? 'border-sky-400 text-sky-600'
            : state === 'correct' || state === 'reveal'
              ? 'border-mint-500 bg-mint-500 text-white'
              : state === 'wrong'
                ? 'border-berry-400 bg-berry-400 text-white'
                : 'border-espresso-200 text-espresso-400'
        }`}
        aria-hidden
      >
        {state === 'correct' || state === 'reveal' ? <Check size={16} strokeWidth={3} /> : state === 'wrong' ? <X size={16} strokeWidth={3} /> : index + 1}
      </span>
      <span
        className={`min-w-0 flex-1 ${
          style === 'output'
            ? 'rounded-lg bg-espresso-900/[0.04] px-2 py-1 font-mono text-[15px] whitespace-pre-wrap'
            : style === 'code'
              ? 'font-mono text-[15px] break-words'
              : 'font-semibold'
        }`}
      >
        {children}
      </span>
    </motion.button>
  )
}

function stateFor(i: number, props: QuestionViewProps, correctIndex: number): OptionState {
  const { response, phase, disabledOptions } = props
  const selected = response?.type === 'choice' && response.index === i
  if (disabledOptions.includes(i) && !(phase === 'retry' && selected)) return 'disabled'
  if (phase === 'correct' && selected) return 'correct'
  if ((phase === 'retry' || phase === 'failed') && selected) return 'wrong'
  if (phase === 'failed' && i === correctIndex) return 'reveal'
  if (selected) return 'selected'
  return 'idle'
}

export function ChoiceQuestion(props: QuestionViewProps<MultipleChoiceQuestion>) {
  const { question: q, onChange, locked, disabledOptions, optionOrder } = props
  const style = q.optionStyle ?? (q.type === 'predict-output' ? 'output' : 'text')
  const order = optionOrder && optionOrder.length === q.options.length ? optionOrder : q.options.map((_, i) => i)
  return (
    <div className="grid gap-3" role="group" aria-label="Answer choices">
      {order.map((i, position) => (
        <OptionButton
          key={i}
          index={position}
          style={style}
          state={stateFor(i, props, q.answer)}
          disabled={locked || disabledOptions.includes(i)}
          onClick={() => onChange({ type: 'choice', index: i })}
        >
          {style === 'text' ? <Md text={q.options[i].text} /> : q.options[i].text}
        </OptionButton>
      ))}
    </div>
  )
}

export function TrueFalseQuestion(props: QuestionViewProps<TrueFalseQuestion>) {
  const { question: q, response, onChange, locked, phase } = props
  const choice = response?.type === 'bool' ? response.value : null
  const btn = (value: boolean) => {
    const selected = choice === value
    let state: OptionState = selected ? 'selected' : 'idle'
    if (phase === 'correct' && selected) state = 'correct'
    if (phase === 'failed' && selected) state = 'wrong'
    if (phase === 'failed' && q.answer === value) state = 'reveal'
    return (
      <motion.button
        key={String(value)}
        type="button"
        whileTap={locked ? undefined : { scale: 0.97 }}
        disabled={locked}
        onClick={() => onChange({ type: 'bool', value })}
        data-answer-option
        aria-pressed={selected}
        className={`flex flex-1 flex-col items-center gap-1 rounded-3xl border-2 px-4 py-6 font-display text-2xl font-semibold transition-colors ${optionClasses(state)}`}
      >
        <AppIcon name={value ? 'thumbs-up' : 'thumbs-down'} size={38} />
        {value ? 'True' : 'False'}
        <span className="text-xs font-bold text-espresso-400">press {value ? '1' : '2'}</span>
      </motion.button>
    )
  }
  return <div className="flex gap-3 sm:gap-4">{[btn(true), btn(false)]}</div>
}

const KINDS: ErrorKind[] = ['syntax', 'runtime', 'logic', 'none']

export function ErrorTypeQuestion(props: QuestionViewProps<ErrorTypeQuestion>) {
  const { question: q, response, onChange, locked, phase, disabledOptions } = props
  const chosen = response?.type === 'error-kind' ? response.value : null
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Kinds of error">
      {KINDS.map((k, i) => {
        const selected = chosen === k
        let state: OptionState = selected ? 'selected' : 'idle'
        if (disabledOptions.includes(i) && !(phase === 'retry' && selected)) state = 'disabled'
        if (phase === 'correct' && selected) state = 'correct'
        if ((phase === 'retry' || phase === 'failed') && selected) state = 'wrong'
        if (phase === 'failed' && q.answer === k) state = 'reveal'
        const info = ERROR_KIND_LABELS[k]
        return (
          <motion.button
            key={k}
            type="button"
            whileTap={locked ? undefined : { scale: 0.98 }}
            disabled={locked || disabledOptions.includes(i)}
            onClick={() => onChange({ type: 'error-kind', value: k })}
            data-answer-option
            aria-pressed={selected}
            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${optionClasses(state)}`}
          >
            <AppIcon name={info.icon} size={26} />
            <span>
              <span className="block font-display text-[17px] font-semibold">{info.label}</span>
              <span className="block text-sm opacity-75">{info.hint}</span>
            </span>
            <span className="ml-auto hidden rounded-md border border-espresso-200 px-1.5 text-xs font-bold text-espresso-400 sm:inline">{i + 1}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
