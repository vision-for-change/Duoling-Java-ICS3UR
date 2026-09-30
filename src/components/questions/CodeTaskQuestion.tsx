import { useState } from 'react'
import { CheckCircle2, CircleDashed, Lightbulb, Play, XCircle } from 'lucide-react'
import type { CodeTaskQuestion } from '../../data/types'
import { runJava, type RunResult } from '../../java'
import type { CodeTaskResult } from '../../engine/codeRunner'
import { store } from '../../state/store'
import { CodeBlock, type LineTone } from '../CodeBlock'
import { CodeEditor } from '../CodeEditor'
import { Console } from '../Console'
import { ErrorExplainer } from '../RunnableCode'
import { Md } from '../Md'
import type { QuestionViewProps } from './types'

function showText(s: string) {
  return s.length ? s : '(no output)'
}

export function TestResults({ result, tests }: { result: CodeTaskResult | null; tests: CodeTaskQuestion['tests'] }) {
  return (
    <div className="rounded-2xl border-2 border-espresso-100 bg-white p-3">
      <div className="mb-2 text-xs font-extrabold tracking-wider text-espresso-400 uppercase">Tests</div>
      {result?.missingPatterns.length ? (
        <ul className="mb-2 space-y-1">
          {result.missingPatterns.map((m) => (
            <li key={m} className="flex items-start gap-2 rounded-xl bg-sun-50 px-3 py-2 text-sm font-semibold text-sun-800">
              <Lightbulb size={16} className="mt-0.5 shrink-0" /> <Md text={m} />
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="space-y-2">
        {tests.map((t, i) => {
          const r = result?.tests[i]
          const status = !result ? 'pending' : r ? (r.passed ? 'pass' : 'fail') : 'skipped'
          return (
            <li key={i} className="rounded-xl border border-espresso-100 px-3 py-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                {status === 'pass' ? (
                  <CheckCircle2 size={18} className="text-mint-500" />
                ) : status === 'fail' ? (
                  <XCircle size={18} className="text-berry-500" />
                ) : (
                  <CircleDashed size={18} className="text-espresso-300" />
                )}
                <span className="text-espresso-700">{t.label ?? `Test ${i + 1}`}</span>
                {t.stdin && <span className="ml-auto truncate font-mono text-xs text-espresso-400">input: {t.stdin.trim().replace(/\n/g, ' ⏎ ')}</span>}
              </div>
              {r && !r.passed && (
                <div className="mt-2 space-y-2">
                  {r.reason && <p className="text-sm text-berry-700">{r.reason}</p>}
                  {!r.test.outputPattern && r.result.status !== 'compile-error' && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <div className="text-[11px] font-extrabold tracking-wider text-espresso-400 uppercase">Expected</div>
                        <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-mint-50 px-2 py-1.5 font-mono text-[13px] whitespace-pre-wrap text-mint-900">{showText(r.expected)}</pre>
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold tracking-wider text-espresso-400 uppercase">Your program</div>
                        <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-berry-50 px-2 py-1.5 font-mono text-[13px] whitespace-pre-wrap text-berry-900">{showText(r.actual)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function CodeTaskQuestionView({ question: q, response, onChange, locked, phase, grade }: QuestionViewProps<CodeTaskQuestion>) {
  const code = response?.type === 'code' ? response.code : q.starter
  const [run, setRun] = useState<RunResult | null>(null)
  const [inputs, setInputs] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const execute = (lines: string[]) => {
    setRun(runJava(code, { stdin: lines.length ? lines.join('\n') + '\n' : '', interactive: true }))
  }
  const blocking = grade?.codeResult?.blockingError
  const tones: Record<number, LineTone> | undefined =
    blocking?.error?.line ? { [blocking.error.line]: 'error' } : run?.status === 'compile-error' && run.error?.line ? { [run.error.line]: 'error' } : undefined

  return (
    <div className="space-y-3">
      <CodeEditor
        value={code}
        onChange={(v) => onChange({ type: 'code', code: v })}
        initialValue={q.starter}
        readOnly={locked}
        lineTones={tones}
        onRun={() => {
          setInputs([])
          execute([])
        }}
        actions={
          <button
            type="button"
            onClick={() => {
              setInputs([])
              execute([])
              store.recordProgramRun()
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-mint-500 px-2.5 py-1 font-display text-xs font-semibold tracking-wide text-white uppercase shadow-[0_2px_0_var(--color-mint-700)] hover:bg-mint-400"
          >
            <Play size={13} fill="currentColor" /> Run
          </button>
        }
      />
      {run && (
        <div className="space-y-2">
          <Console
            segments={run.segments}
            status={run.status}
            onInput={(line) => {
              const next = [...inputs, line]
              setInputs(next)
              execute(next)
            }}
            maxHeight={200}
          />
          <ErrorExplainer result={run} />
        </div>
      )}
      {blocking && <ErrorExplainer result={blocking} />}
      <TestResults result={grade?.codeResult ?? null} tests={q.tests} />
      {q.hint && phase !== 'correct' && (
        <div>
          {showHint ? (
            <p className="flex items-start gap-2 rounded-2xl border-2 border-sun-200 bg-sun-50 px-4 py-3 text-sm font-semibold text-espresso-800">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-sun-600" /> <Md text={q.hint} />
            </p>
          ) : (
            <button type="button" onClick={() => setShowHint(true)} className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-bold text-sun-700 hover:bg-sun-50">
              <Lightbulb size={16} /> Need a hint?
            </button>
          )}
        </div>
      )}
      {phase === 'failed' && (
        <div>
          <div className="mb-2 text-sm font-bold text-mint-700">One possible solution:</div>
          <CodeBlock code={q.solution} title="Solution.java" />
        </div>
      )}
    </div>
  )
}
