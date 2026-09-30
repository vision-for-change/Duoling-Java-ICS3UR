import { useEffect, useRef, useState } from 'react'
import { CornerDownLeft, Terminal } from 'lucide-react'
import type { ConsoleSegment, RunStatus } from '../java'

interface ConsoleProps {
  segments: ConsoleSegment[]
  status: RunStatus | 'idle'
  onInput?: (line: string) => void
  maxHeight?: number
  emptyText?: string
}

const STATUS_BADGE: Record<RunStatus | 'idle', { text: string; className: string }> = {
  idle: { text: 'Ready', className: 'bg-white/10 text-code-muted' },
  ok: { text: 'Finished', className: 'bg-mint-500/20 text-mint-200' },
  'compile-error': { text: 'Compile error', className: 'bg-berry-500/25 text-berry-200' },
  'runtime-error': { text: 'Crashed', className: 'bg-berry-500/25 text-berry-200' },
  timeout: { text: 'Stopped', className: 'bg-sun-500/25 text-sun-200' },
  'needs-input': { text: 'Waiting for input', className: 'bg-sky-500/25 text-sky-200' },
  unsupported: { text: 'Not supported', className: 'bg-sun-500/25 text-sun-200' },
}

/** Program output, including typed input (echoed like a real terminal). */
export function Console({ segments, status, onInput, maxHeight = 260, emptyText = 'Press Run to see the output.' }: ConsoleProps) {
  const [line, setLine] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const waiting = status === 'needs-input' && !!onInput

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
    if (waiting) inputRef.current?.focus({ preventScroll: true })
  }, [segments, waiting])

  const badge = STATUS_BADGE[status]
  const empty = segments.length === 0 && !waiting
  const placeholder =
    status === 'compile-error'
      ? 'Nothing ran because Java couldn\'t compile this program.'
      : status === 'unsupported'
        ? 'Nothing ran because this uses a feature the sandbox doesn\'t support yet.'
        : status === 'ok'
          ? '(the program finished without printing anything)'
          : emptyText

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-espresso-900 bg-[#1f1510]" aria-label="Program output">
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-1.5 text-xs text-code-muted">
        <Terminal size={14} />
        <span className="font-bold tracking-wide uppercase">Console</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 font-bold ${badge.className}`}>{badge.text}</span>
      </div>
      <div ref={scroller} className="code-scroll overflow-auto px-4 py-3 font-mono text-[14px] leading-relaxed" style={{ maxHeight }} aria-live="polite">
        {empty ? (
          <span className="text-code-muted italic">{placeholder}</span>
        ) : (
          <pre className="m-0 whitespace-pre-wrap break-words">
            {segments.map((s, i) => (
              <span
                key={i}
                className={
                  s.kind === 'err' ? 'text-berry-300' : s.kind === 'in' ? 'rounded bg-sky-500/20 text-sky-200' : 'text-code-text'
                }
              >
                {s.text}
              </span>
            ))}
            {waiting && (
              <form
                className="inline-flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  onInput!(line)
                  setLine('')
                }}
              >
                <input
                  ref={inputRef}
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="min-w-[8ch] rounded-md border border-sky-400/50 bg-sky-500/15 px-2 py-0.5 font-mono text-sky-100 caret-sun-300 outline-none placeholder:text-sky-200/40 focus:border-sky-300"
                  placeholder="type here…"
                  aria-label="Program input"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className="inline-flex items-center gap-1 rounded-md bg-sky-500 px-2 py-0.5 font-sans text-xs font-bold text-white">
                  Enter <CornerDownLeft size={12} />
                </button>
              </form>
            )}
          </pre>
        )}
      </div>
    </div>
  )
}
