import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { highlightJava } from '../lib/highlight'
import { CodeHeader, CopyButton, type LineTone } from './CodeBlock'

const INDENT = '    '

interface CodeEditorProps {
  value: string
  onChange: (v: string) => void
  /** value restored by the Reset button */
  initialValue?: string
  title?: string
  minLines?: number
  maxHeight?: number
  lineTones?: Record<number, LineTone>
  /** Ctrl/Cmd + Enter */
  onRun?: () => void
  actions?: ReactNode
  ariaLabel?: string
  readOnly?: boolean
}

/** Insert text at the cursor, keeping the browser's undo history when possible. */
function insertText(el: HTMLTextAreaElement, text: string) {
  el.focus()
  const ok = typeof document.execCommand === 'function' && document.execCommand('insertText', false, text)
  if (!ok) el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end')
}

/**
 * A lightweight code editor: a transparent textarea layered over highlighted code.
 * Tab indents, Shift+Tab outdents, Enter keeps indentation, Esc releases the Tab key
 * so keyboard users can move on.
 */
export function CodeEditor({
  value,
  onChange,
  initialValue,
  title,
  minLines = 6,
  maxHeight = 460,
  lineTones,
  onRun,
  actions,
  ariaLabel = 'Java code editor',
  readOnly = false,
}: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [tabTrapped, setTabTrapped] = useState(true)
  const lines = useMemo(() => highlightJava(value), [value])
  const lineCount = Math.max(value.split('\n').length, minLines)

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun?.()
      return
    }
    if (e.key === 'Escape') {
      setTabTrapped(false)
      return
    }
    if (e.key === 'Tab' && tabTrapped) {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: end } = el
      const v = el.value
      if (s !== end && v.slice(s, end).includes('\n')) {
        // indent / outdent every selected line
        const lineStart = v.lastIndexOf('\n', s - 1) + 1
        const block = v.slice(lineStart, end)
        const changed = e.shiftKey
          ? block.replace(/^( {1,4}|\t)/gm, '')
          : block.replace(/^/gm, INDENT)
        el.setSelectionRange(lineStart, end)
        insertText(el, changed)
        el.setSelectionRange(lineStart, lineStart + changed.length)
      } else if (e.shiftKey) {
        const lineStart = v.lastIndexOf('\n', s - 1) + 1
        const m = /^( {1,4}|\t)/.exec(v.slice(lineStart))
        if (m) {
          el.setSelectionRange(lineStart, lineStart + m[0].length)
          insertText(el, '')
          el.setSelectionRange(Math.max(lineStart, s - m[0].length), Math.max(lineStart, s - m[0].length))
        }
      } else {
        insertText(el, INDENT)
      }
      onChange(el.value)
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const v = el.value
      const s = el.selectionStart
      const lineStart = v.lastIndexOf('\n', s - 1) + 1
      const currentLine = v.slice(lineStart, s)
      const indent = /^\s*/.exec(currentLine)![0]
      const extra = /[{(]\s*$/.test(currentLine) ? INDENT : ''
      insertText(el, '\n' + indent + extra)
      onChange(el.value)
      return
    }
    if (e.key === '}') {
      const v = el.value
      const s = el.selectionStart
      const lineStart = v.lastIndexOf('\n', s - 1) + 1
      const before = v.slice(lineStart, s)
      if (/^\s+$/.test(before) && before.length >= INDENT.length && el.selectionStart === el.selectionEnd) {
        e.preventDefault()
        el.setSelectionRange(s - INDENT.length, s)
        insertText(el, '}')
        onChange(el.value)
      }
    }
  }

  const reset = () => {
    if (initialValue === undefined) return
    onChange(initialValue)
    ref.current?.focus()
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-espresso-900 bg-code-bg shadow-[0_4px_0_var(--color-espresso-900)]">
      <CodeHeader title={title}>
        {actions}
        {initialValue !== undefined && !readOnly && (
          <button
            type="button"
            onClick={reset}
            aria-label="Reset code"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-sans text-xs font-bold text-code-muted transition hover:bg-white/10 hover:text-code-text"
          >
            <RotateCcw size={14} /> <span className="hidden sm:inline">Reset</span>
          </button>
        )}
        <CopyButton text={value} />
      </CodeHeader>
      <div className="code-scroll overflow-auto" style={{ maxHeight }} onClick={() => ref.current?.focus()}>
        <div className="flex w-max min-w-full font-mono text-[14px] leading-[1.75] sm:text-[15px]">
          <div className="sticky left-0 z-10 shrink-0 select-none bg-code-bg py-3 text-right text-code-muted/70" aria-hidden>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className={`w-10 pr-3 sm:w-12 ${lineTones?.[i + 1] === 'error' ? 'bg-berry-500/30 text-berry-200' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="relative flex-1">
            <pre aria-hidden className="m-0 whitespace-pre py-3 pr-8 pl-1 text-code-text" style={{ minHeight: `calc(${lineCount} * 1.75em + 1.5rem)` }}>
              {lines.map((tokens, i) => (
                <div key={i} className={lineTones?.[i + 1] === 'error' ? 'bg-berry-500/15' : ''}>
                  {tokens.length === 0 ? ' ' : tokens.map((t, k) => (
                    <span key={k} className={t.cls === 'plain' || t.cls === 'blank' ? '' : `tok-${t.cls}`}>
                      {t.text}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
            <textarea
              ref={ref}
              value={value}
              readOnly={readOnly}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setTabTrapped(true)}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label={ariaLabel}
              aria-describedby="editor-help"
              wrap="off"
              className="absolute inset-0 m-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent py-3 pr-8 pl-1 font-mono text-[14px] leading-[1.75] whitespace-pre text-transparent caret-sun-300 outline-none selection:bg-sky-400/35 sm:text-[15px]"
            />
          </div>
        </div>
      </div>
      <p id="editor-help" className="border-t border-white/5 px-3 py-1.5 text-[11px] text-code-muted">
        Tab indents · Esc then Tab leaves the editor{onRun ? ' · Ctrl + Enter runs' : ''}
      </p>
    </div>
  )
}
