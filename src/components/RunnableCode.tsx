import { useCallback, useEffect, useRef, useState } from 'react'
import { Clapperboard, Play } from 'lucide-react'
import { runJava, type RunResult } from '../java'
import { explainRun } from '../lib/friendlyErrors'
import { store } from '../state/store'
import { CodeBlock, type LineTone } from './CodeBlock'
import { CodeEditor } from './CodeEditor'
import { Console } from './Console'
import { Md } from './Md'
import { Modal } from './Modal'
import { TraceViewer } from './TraceViewer'

interface RunnableCodeProps {
  code: string
  /** preset input lines typed "by the user" */
  stdin?: string
  editable?: boolean
  title?: string
  autoRun?: boolean
  showTrace?: boolean
  notes?: { line: number; text: string }[]
  consoleHeight?: number
  editorMaxHeight?: number
  onCodeChange?: (code: string) => void
}

function splitInput(stdin: string | undefined): string[] {
  if (!stdin) return []
  return stdin.replace(/\n$/, '').split('\n')
}

export function ErrorExplainer({ result }: { result: RunResult }) {
  const ex = explainRun(result)
  if (!ex) return null
  const color =
    ex.kind === 'compile' || ex.kind === 'runtime' ? 'border-berry-200 bg-berry-50 text-berry-900' : 'border-sun-300 bg-sun-50 text-espresso-900'
  return (
    <div className={`rounded-2xl border-2 px-4 py-3 ${color}`} role="status">
      <div className="font-display font-semibold">
        {ex.kind === 'compile' ? '🧱 ' : ex.kind === 'runtime' ? '💥 ' : ex.kind === 'timeout' ? '⏱️ ' : '🚧 '}
        {ex.title}
        {result.error?.line ? <span className="ml-2 text-sm font-normal opacity-70">line {result.error.line}</span> : null}
      </div>
      <p className="mt-0.5 text-sm leading-snug">
        <Md text={ex.body} />
      </p>
      {result.error && ex.kind !== 'timeout' && (
        <p className="mt-2 font-mono text-xs break-words opacity-70">{result.error.message.split('\n')[0]}</p>
      )}
    </div>
  )
}

/**
 * Code + Run button + console (+ optional step-by-step trace).
 * Programs that read input become interactive: the console asks the learner.
 */
export function RunnableCode({
  code: initial,
  stdin,
  editable = true,
  title,
  autoRun = false,
  showTrace = true,
  notes,
  consoleHeight = 220,
  editorMaxHeight = 420,
  onCodeChange,
}: RunnableCodeProps) {
  const [code, setCode] = useState(initial)
  const [inputs, setInputs] = useState<string[]>(splitInput(stdin))
  const [result, setResult] = useState<RunResult | null>(null)
  const [traceOpen, setTraceOpen] = useState(false)
  const [traceResult, setTraceResult] = useState<RunResult | null>(null)
  const ran = useRef(false)

  const execute = useCallback(
    (lines: string[], source = code) => {
      const r = runJava(source, { stdin: lines.length ? lines.join('\n') + '\n' : '', interactive: true })
      setResult(r)
      return r
    },
    [code],
  )

  useEffect(() => {
    if (autoRun && !ran.current) {
      ran.current = true
      execute(splitInput(stdin), initial)
    }
  }, [autoRun, execute, initial, stdin])

  const run = () => {
    const preset = splitInput(stdin)
    setInputs(preset)
    execute(preset)
    store.recordProgramRun()
  }

  const onInput = (line: string) => {
    const next = [...inputs, line]
    setInputs(next)
    execute(next)
  }

  const openTrace = () => {
    const r = runJava(code, { stdin: inputs.length ? inputs.join('\n') + '\n' : '', trace: true, maxTraceSteps: 400 })
    setTraceResult(r)
    setTraceOpen(true)
  }

  const errorTones: Record<number, LineTone> | undefined =
    result?.error?.line && (result.status === 'compile-error' || result.status === 'runtime-error') ? { [result.error.line]: 'error' } : undefined

  const runButton = (
    <button
      type="button"
      onClick={run}
      className="inline-flex items-center gap-1 rounded-lg bg-mint-500 px-2.5 py-1 font-display text-xs font-semibold tracking-wide text-white uppercase shadow-[0_2px_0_var(--color-mint-700)] transition hover:bg-mint-400 active:translate-y-[1px]"
    >
      <Play size={13} fill="currentColor" /> Run
    </button>
  )

  return (
    <div className="space-y-3">
      {editable ? (
        <CodeEditor
          value={code}
          onChange={(v) => {
            setCode(v)
            onCodeChange?.(v)
          }}
          initialValue={initial}
          title={title}
          minLines={Math.min(initial.split('\n').length, 8)}
          maxHeight={editorMaxHeight}
          lineTones={errorTones}
          onRun={run}
          actions={runButton}
        />
      ) : (
        <CodeBlock code={code} title={title} lineTones={errorTones} actions={runButton} />
      )}
      {notes && notes.length > 0 && (
        <ul className="space-y-1.5">
          {notes.map((n) => (
            <li key={n.line} className="flex items-start gap-2 text-sm text-espresso-700">
              <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-espresso-800 px-1 font-mono text-[11px] font-bold text-cream-50">
                {n.line}
              </span>
              <span>
                <Md text={n.text} />
              </span>
            </li>
          ))}
        </ul>
      )}
      <Console segments={result?.segments ?? []} status={result?.status ?? 'idle'} onInput={onInput} maxHeight={consoleHeight} />
      {result && <ErrorExplainer result={result} />}
      {showTrace && result && (result.status === 'ok' || result.status === 'runtime-error') && (
        <button
          type="button"
          onClick={openTrace}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-sky-200 bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
        >
          <Clapperboard size={16} /> Watch it run, step by step
        </button>
      )}
      <Modal open={traceOpen} onClose={() => setTraceOpen(false)} title="Step through the program" size="xl">
        {traceResult && <TraceViewer code={code} result={traceResult} />}
      </Modal>
    </div>
  )
}
