import { useMemo, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { highlightJava } from '../lib/highlight'

export type LineTone = 'error' | 'success' | 'info' | 'warn'

const TONE_BG: Record<LineTone, string> = {
  error: 'bg-berry-500/20 shadow-[inset_4px_0_0_var(--color-berry-400)]',
  success: 'bg-mint-500/20 shadow-[inset_4px_0_0_var(--color-mint-400)]',
  info: 'bg-sky-400/20 shadow-[inset_4px_0_0_var(--color-sky-300)]',
  warn: 'bg-sun-400/20 shadow-[inset_4px_0_0_var(--color-sun-300)]',
}

export interface CodeBlockProps {
  code: string
  title?: string
  /** 1-based line numbers to highlight */
  highlight?: number[]
  tone?: LineTone
  /** per-line tones (take precedence over `highlight`) */
  lineTones?: Record<number, LineTone>
  /** render a blank (fill-in-the-blank) */
  renderBlank?: (index: number) => ReactNode
  /** make lines selectable (find-the-bug) */
  onLineClick?: (line: number) => void
  selectedLine?: number | null
  lineDisabled?: boolean
  copy?: boolean
  maxHeight?: number
  className?: string
  size?: 'sm' | 'md'
  footer?: ReactNode
  /** extra controls in the header bar */
  actions?: ReactNode
}

export function CodeHeader({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/5 bg-[#33241d] px-3 py-2">
      <span className="flex gap-1.5" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-berry-400" />
        <span className="h-3 w-3 rounded-full bg-sun-400" />
        <span className="h-3 w-3 rounded-full bg-mint-400" />
      </span>
      <span className="ml-1 truncate font-mono text-xs text-code-muted">{title ?? 'Main.java'}</span>
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // clipboard unavailable
        }
      }}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-sans text-xs font-bold text-code-muted transition hover:bg-white/10 hover:text-code-text"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

/** Read-only, syntax-highlighted Java with line numbers. */
export function CodeBlock({
  code,
  title,
  highlight = [],
  tone = 'error',
  lineTones,
  renderBlank,
  onLineClick,
  selectedLine,
  lineDisabled,
  copy = true,
  maxHeight,
  className = '',
  size = 'md',
  footer,
  actions,
}: CodeBlockProps) {
  const lines = useMemo(() => highlightJava(code), [code])
  const text = size === 'sm' ? 'text-[13px] leading-[1.7]' : 'text-[14px] sm:text-[15px] leading-[1.75]'
  const selectable = !!onLineClick

  return (
    <div className={`overflow-hidden rounded-2xl border-2 border-espresso-900 bg-code-bg shadow-[0_4px_0_var(--color-espresso-900)] ${className}`}>
      <CodeHeader title={title}>
        {actions}
        {copy && <CopyButton text={code.replace(/___/g, '____')} />}
      </CodeHeader>
      <div className="code-scroll overflow-auto" style={{ maxHeight }}>
        <div className={`min-w-full w-max py-3 font-mono ${text}`} role={selectable ? 'listbox' : undefined} aria-label={selectable ? 'Code lines' : undefined}>
          {lines.map((tokens, i) => {
            const n = i + 1
            const lineTone = lineTones?.[n] ?? (highlight.includes(n) ? tone : undefined)
            const selected = selectedLine === n
            const content = (
              <>
                <span className="w-10 shrink-0 select-none pr-3 text-right text-code-muted/70 sm:w-12">{n}</span>
                <span className="whitespace-pre pr-6 text-code-text">
                  {tokens.length === 0 ? ' ' : null}
                  {tokens.map((t, k) =>
                    t.cls === 'blank' && renderBlank ? (
                      <span key={k}>{renderBlank(t.blank!)}</span>
                    ) : (
                      <span key={k} className={t.cls === 'plain' ? '' : `tok-${t.cls}`}>
                        {t.text}
                      </span>
                    ),
                  )}
                </span>
              </>
            )
            const base = `flex min-w-full items-center ${lineTone ? TONE_BG[lineTone] : ''}`
            if (selectable) {
              return (
                <button
                  type="button"
                  key={i}
                  role="option"
                  data-answer-option
                  aria-selected={selected}
                  disabled={lineDisabled}
                  onClick={() => onLineClick!(n)}
                  className={`${base} w-full text-left transition ${
                    selected ? 'bg-sky-400/25 shadow-[inset_4px_0_0_var(--color-sky-300)]' : 'hover:bg-white/5'
                  } disabled:cursor-default`}
                >
                  {content}
                </button>
              )
            }
            return (
              <div key={i} className={base}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
      {footer}
    </div>
  )
}
