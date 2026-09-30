import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, SkipBack } from 'lucide-react'
import type { RunResult } from '../java'
import { CodeBlock } from './CodeBlock'

/**
 * Step-by-step visualisation of a program run: current line, variable table
 * (changed values glow) and the output so far. Great for tracing loops.
 */
export function TraceViewer({ code, result }: { code: string; result: RunResult }) {
  const steps = result.trace
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = steps[Math.min(i, steps.length - 1)]

  useEffect(() => {
    if (!playing) return
    if (i >= steps.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setI((x) => x + 1), 650)
    return () => clearTimeout(t)
  }, [playing, i, steps.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') setI((x) => Math.min(steps.length - 1, x + 1))
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [steps.length])

  const output = useMemo(() => (step ? result.stdout.slice(0, step.out) : ''), [step, result.stdout])

  if (!steps.length) {
    return <p className="text-espresso-600">There are no steps to show for this program.</p>
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3">
        <CodeBlock code={code} highlight={[step.line]} tone={step.kind === 'cond' ? 'warn' : 'info'} copy={false} maxHeight={360} size="sm" />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setI(0)
              setPlaying(false)
            }}
            className="rounded-xl border-2 border-espresso-200 bg-white p-2 text-espresso-700 hover:bg-cream-100"
            aria-label="Restart"
          >
            <SkipBack size={18} />
          </button>
          <button
            type="button"
            onClick={() => setI((x) => Math.max(0, x - 1))}
            className="rounded-xl border-2 border-espresso-200 bg-white p-2 text-espresso-700 hover:bg-cream-100"
            aria-label="Previous step"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (i >= steps.length - 1) setI(0)
              setPlaying((p) => !p)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-sky-700 bg-sky-500 px-3 py-2 font-display text-sm font-semibold text-white shadow-[0_3px_0_var(--color-sky-700)] active:translate-y-[2px]"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => setI((x) => Math.min(steps.length - 1, x + 1))}
            className="rounded-xl border-2 border-espresso-200 bg-white p-2 text-espresso-700 hover:bg-cream-100"
            aria-label="Next step"
          >
            <ChevronRight size={18} />
          </button>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            className="min-w-[120px] flex-1 accent-brew-500"
            aria-label="Step"
          />
          <span className="font-mono text-sm text-espresso-600">
            {i + 1}/{steps.length}
            {result.traceTruncated ? '+' : ''}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border-2 border-espresso-100 bg-white p-3">
          <div className="mb-1 text-xs font-extrabold tracking-wider text-espresso-400 uppercase">Step {i + 1} · line {step.line}</div>
          <p className="min-h-[1.5rem] font-mono text-sm font-bold text-espresso-800">{step.note ?? (step.kind === 'stmt' ? 'ran this line' : step.kind)}</p>
        </div>
        <div className="rounded-2xl border-2 border-espresso-100 bg-white p-3">
          <div className="mb-2 text-xs font-extrabold tracking-wider text-espresso-400 uppercase">Variables</div>
          {step.vars.length === 0 ? (
            <p className="text-sm text-espresso-500 italic">No variables yet</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {step.vars.map((v) => (
                  <tr key={v.name + v.type} className="border-t border-espresso-50 first:border-0">
                    <td className="py-1 pr-2 font-mono text-xs text-espresso-400">{v.type}</td>
                    <td className="py-1 pr-2 font-mono font-bold text-espresso-800">{v.name}</td>
                    <td className="py-1 text-right">
                      <span
                        className={`inline-block rounded-lg px-2 py-0.5 font-mono font-bold transition ${
                          v.changed ? 'bg-sun-200 text-espresso-900 ring-2 ring-sun-400' : 'bg-espresso-50 text-espresso-700'
                        }`}
                      >
                        {v.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="rounded-2xl border-2 border-espresso-900 bg-[#1f1510] p-3">
          <div className="mb-1 text-xs font-extrabold tracking-wider text-code-muted uppercase">Output so far</div>
          <pre className="m-0 min-h-[2rem] font-mono text-sm whitespace-pre-wrap text-code-text">{output || ' '}</pre>
        </div>
      </div>
    </div>
  )
}
