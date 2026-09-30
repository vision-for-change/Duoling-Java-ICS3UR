import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDownToLine, CornerDownLeft, Lightbulb, X } from 'lucide-react'
import type { ArrangeQuestion, FillBlankQuestion, FindBugQuestion, TypeOutputQuestion } from '../../data/types'
import { CodeBlock } from '../CodeBlock'
import type { QuestionViewProps } from './types'

/** Where the learner's typed output differs, without giving the answer away. */
export function outputHint(expected: string, given: string): string {
  const e = expected.replace(/\r/g, '').replace(/\s+$/, '').split('\n')
  const g = given.replace(/\r/g, '').replace(/\s+$/, '').split('\n')
  if (e.length !== g.length) {
    return `The program prints ${e.length} line${e.length === 1 ? '' : 's'}, but your answer has ${g.length}. Each println starts a new line.`
  }
  const firstBad = e.findIndex((line, i) => line.trimEnd() !== (g[i] ?? '').trimEnd())
  if (firstBad === -1) return ''
  if (e.length === 1) return 'Trace it line by line and check every value (and every space).'
  return firstBad === 0 ? 'Check the first line again.' : `The first ${firstBad} line${firstBad === 1 ? ' is' : 's are'} right. Check line ${firstBad + 1}.`
}

export function TypeOutputQuestionView({ question: q, response, onChange, locked, phase, onSubmit }: QuestionViewProps<TypeOutputQuestion>) {
  const value = response?.type === 'text' ? response.value : ''
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!locked) ref.current?.focus({ preventScroll: true })
  }, [locked])
  const rows = Math.max(2, value.split('\n').length + (q.answer.includes('\n') ? 0 : 0))
  const border =
    phase === 'correct' ? 'border-mint-500 bg-mint-50' : phase === 'retry' || phase === 'failed' ? 'border-berry-400 bg-berry-50' : 'border-espresso-900 bg-[#1f1510]'
  const text = phase === 'correct' ? 'text-mint-800' : phase === 'retry' || phase === 'failed' ? 'text-berry-800' : 'text-code-text'
  return (
    <div>
      <label htmlFor="typed-output" className="mb-2 flex items-center gap-2 text-sm font-bold text-espresso-500">
        <ArrowDownToLine size={16} /> Type the exact output{q.answer.includes('\n') ? ' (press Enter for a new line)' : ''}
      </label>
      <textarea
        id="typed-output"
        ref={ref}
        value={value}
        disabled={locked}
        rows={rows}
        onChange={(e) => onChange({ type: 'text', value: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !q.answer.includes('\n'))) {
            e.preventDefault()
            onSubmit()
          }
        }}
        spellCheck={false}
        autoComplete="off"
        className={`w-full resize-none rounded-2xl border-2 px-4 py-3 font-mono text-[16px] leading-relaxed shadow-[0_4px_0_var(--color-espresso-900)] outline-none placeholder:text-code-muted/60 focus:border-sky-400 ${border} ${text}`}
        placeholder="Output goes here…"
      />
      {q.answer.includes('\n') && !locked && <p className="mt-1.5 text-xs text-espresso-400">Tip: Ctrl + Enter checks your answer.</p>}
    </div>
  )
}

// ---------------------------------------------------------------- fill in the blank
export function FillBlankQuestionView({ question: q, response, onChange, locked, phase, grade, onSubmit }: QuestionViewProps<FillBlankQuestion>) {
  const values = response?.type === 'blanks' ? response.values : q.blanks.map(() => '')
  const [focus, setFocus] = useState(0)
  const set = (i: number, v: string) => {
    const next = [...values]
    next[i] = v
    onChange({ type: 'blanks', values: next })
  }
  const blankState = (i: number): 'ok' | 'bad' | 'idle' => {
    if (phase === 'correct') return 'ok'
    if ((phase === 'retry' || phase === 'failed') && grade?.blankResults) return grade.blankResults[i] ? 'ok' : 'bad'
    return 'idle'
  }

  const usedChips = useMemo(() => {
    // each bank chip can be used once per occurrence in the bank
    const counts = new Map<string, number>()
    values.forEach((v) => v && counts.set(v, (counts.get(v) ?? 0) + 1))
    return counts
  }, [values])

  const renderBlank = (i: number) => {
    const st = blankState(i)
    const color =
      st === 'ok' ? 'border-mint-400 bg-mint-500/25 text-mint-100' : st === 'bad' ? 'border-berry-400 bg-berry-500/30 text-berry-100' : 'border-sun-300/70 bg-sun-300/15 text-sun-100'
    if (q.bank) {
      return (
        <button
          type="button"
          disabled={locked}
          onClick={() => {
            if (values[i]) set(i, '')
            setFocus(i)
          }}
          className={`mx-0.5 inline-flex min-w-[3.5ch] items-center justify-center rounded-md border-2 border-dashed px-1.5 align-middle font-mono leading-[1.35] ${color} ${
            focus === i && !values[i] && !locked ? 'ring-2 ring-sky-300' : ''
          }`}
          aria-label={values[i] ? `Blank ${i + 1}: ${values[i]} (tap to clear)` : `Blank ${i + 1}: empty`}
        >
          {values[i] || '  '}
        </button>
      )
    }
    const width = Math.max(3, (values[i] ?? '').length + 1)
    return (
      <input
        value={values[i] ?? ''}
        disabled={locked}
        onChange={(e) => set(i, e.target.value)}
        onFocus={() => setFocus(i)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit()
          }
        }}
        autoFocus={i === 0}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        aria-label={`Blank ${i + 1}`}
        className={`mx-0.5 rounded-md border-2 border-dashed px-1 py-0 align-middle font-mono leading-[1.35] outline-none focus:border-solid focus:border-sky-300 ${color}`}
        style={{ width: `${width + 1}ch` }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <CodeBlock code={q.code} renderBlank={renderBlank} copy={false} />
      {q.bank && (
        <div>
          <div className="mb-2 text-sm font-bold text-espresso-500">Tap to fill the {q.blanks.length > 1 ? 'next ' : ''}blank:</div>
          <div className="flex flex-wrap gap-2">
            {q.bank.map((chip, k) => {
              const occurrences = q.bank!.slice(0, k + 1).filter((c) => c === chip).length
              const used = (usedChips.get(chip) ?? 0) >= occurrences
              return (
                <motion.button
                  key={k}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  disabled={locked || used}
                  onClick={() => {
                    const target = values[focus] ? values.findIndex((v) => !v) : focus
                    const idx = target === -1 ? focus : target
                    set(idx, chip)
                    const nextEmpty = values.findIndex((v, j) => !v && j !== idx)
                    if (nextEmpty !== -1) setFocus(nextEmpty)
                  }}
                  className={`rounded-xl border-2 px-3 py-2 font-mono text-[15px] font-bold transition ${
                    used
                      ? 'border-espresso-100 bg-espresso-100 text-transparent shadow-none'
                      : 'border-espresso-200 bg-white text-espresso-800 shadow-[0_3px_0_var(--color-espresso-200)] hover:bg-cream-100 active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  {chip}
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- arrange the code
function autoIndent(lines: string[]): string[] {
  let depth = 0
  return lines.map((raw) => {
    const line = raw.trim()
    if (line.startsWith('}')) depth = Math.max(0, depth - 1)
    const out = '    '.repeat(depth) + line
    const opens = (line.match(/{/g) ?? []).length
    const closes = (line.match(/}/g) ?? []).length - (line.startsWith('}') ? 1 : 0)
    depth = Math.max(0, depth + opens - closes)
    return out
  })
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // never show the lines already in the right order
  return a
}

export function ArrangeQuestionView({ question: q, response, onChange, locked, phase }: QuestionViewProps<ArrangeQuestion>) {
  const bank = useMemo(() => {
    const all = [...q.lines, ...(q.distractors ?? [])].map((text, id) => ({ id, text: text.trim() }))
    let shuffled = seededShuffle(all, q.id)
    if (shuffled.every((c, i) => c.id === i)) shuffled = [...shuffled.slice(1), shuffled[0]]
    return shuffled
  }, [q])
  const placedIds = useMemo(() => {
    if (response?.type !== 'arrange') return [] as number[]
    // map texts back to bank ids in order (first unused match)
    const used = new Set<number>()
    return response.lines.map((t) => {
      const item = bank.find((b) => b.text === t.trim() && !used.has(b.id))
      if (item) used.add(item.id)
      return item?.id ?? -1
    })
  }, [response, bank])

  const setIds = (ids: number[]) => onChange({ type: 'arrange', lines: ids.map((id) => bank.find((b) => b.id === id)!.text) })
  const placed = placedIds.map((id) => bank.find((b) => b.id === id)!).filter(Boolean)
  const shown = autoIndent(placed.map((p) => p.text))
  const border = phase === 'correct' ? 'border-mint-400 bg-mint-50/50' : phase === 'retry' || phase === 'failed' ? 'border-berry-300 bg-berry-50/40' : 'border-espresso-200 bg-white'

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border-2 border-dashed p-3 transition ${border}`}>
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold tracking-wider text-espresso-400 uppercase">
          <span>Your program</span>
          <span>
            {placed.length}/{q.lines.length} lines
          </span>
        </div>
        {q.given && (
          <pre className="mb-2 rounded-xl bg-espresso-50 px-3 py-2 font-mono text-[14px] text-espresso-500">{q.given}</pre>
        )}
        {placed.length === 0 ? (
          <p className="px-2 py-5 text-center text-sm text-espresso-400">Tap the lines below in the right order.</p>
        ) : (
          <ol className="space-y-1.5">
            {placed.map((p, i) => (
              <motion.li key={`${p.id}`} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setIds(placedIds.filter((_, k) => k !== i))}
                  className="group flex w-full items-center gap-2 rounded-xl bg-code-bg px-3 py-2 text-left font-mono text-[14px] text-code-text transition hover:bg-[#3a2920] disabled:hover:bg-code-bg"
                  aria-label={`Remove line: ${p.text}`}
                >
                  <span className="w-5 shrink-0 text-right text-xs text-code-muted">{i + 1}</span>
                  <span className="flex-1 whitespace-pre">{shown[i]}</span>
                  {!locked && <X size={14} className="text-code-muted opacity-0 transition group-hover:opacity-100" />}
                </button>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-espresso-500">Lines{q.distractors?.length ? ' (one is a decoy!)' : ''}:</div>
        <div className="flex flex-col gap-2">
          {bank.map((b) => {
            const used = placedIds.includes(b.id)
            return (
              <motion.button
                key={b.id}
                type="button"
                layout
                whileTap={{ scale: 0.98 }}
                disabled={locked || used}
                onClick={() => setIds([...placedIds, b.id])}
                className={`rounded-xl border-2 px-3 py-2 text-left font-mono text-[14px] transition ${
                  used
                    ? 'border-espresso-100 bg-espresso-50 text-espresso-200'
                    : 'border-espresso-200 bg-white text-espresso-800 shadow-[0_3px_0_var(--color-espresso-200)] hover:bg-cream-100 active:translate-y-[2px] active:shadow-none'
                }`}
              >
                {b.text}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- find the bug
export function FindBugQuestionView({ question: q, response, onChange, locked, phase }: QuestionViewProps<FindBugQuestion>) {
  const line = response?.type === 'line' ? response.line : null
  const lineTones: Record<number, 'error' | 'success' | 'warn'> = {}
  if (line && phase === 'correct') lineTones[line] = 'success'
  if (line && (phase === 'retry' || phase === 'failed')) lineTones[line] = 'error'
  if (phase === 'failed') for (const b of q.bugLines) lineTones[b] = 'success'
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-sm font-bold text-espresso-500">
        <Lightbulb size={16} className="text-sun-500" /> Tap the line with the bug
      </p>
      <CodeBlock code={q.code} onLineClick={(n) => onChange({ type: 'line', line: n })} selectedLine={phase === 'answering' ? line : null} lineTones={lineTones} lineDisabled={locked} copy={false} />
      {line && phase === 'answering' && (
        <p className="flex items-center gap-1 text-sm text-espresso-500">
          <CornerDownLeft size={14} /> Line {line} selected. Press Check.
        </p>
      )}
    </div>
  )
}
