import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, ChevronDown, ChevronRight, Eye, FlaskConical, HelpCircle, Lightbulb, PartyPopper, Play, Shuffle } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { CodeEditor } from '../components/CodeEditor'
import { Console } from '../components/Console'
import { Mascot, MascotSays } from '../components/Mascot'
import { Md } from '../components/Md'
import { Modal } from '../components/Modal'
import { VideoLink } from '../components/ProjectPicker'
import { WarmupQuiz } from '../components/WarmupQuiz'
import { TestResults } from '../components/questions/CodeTaskQuestion'
import { ErrorExplainer, RunnableCode } from '../components/RunnableCode'
import { getProject } from '../data/projects'
import type { FinalProject, FinalStage } from '../data/types'
import { runCodeTask, type CodeTaskResult } from '../engine/codeRunner'
import { isFinalUnlocked } from '../engine/progression'
import { runJava, type RunResult } from '../java'
import { celebrate } from '../lib/motion'
import { sfx } from '../lib/sound'
import { useProgress } from '../state/hooks'
import { store, type Reward } from '../state/store'
import { AppIcon } from '../components/AppIcon'

/** The next stage after `from` that isn't done yet (wrapping around), or -1 when every stage is done. */
function nextOpenStage(stages: FinalStage[], done: string[], from: number): number {
  for (let k = 1; k <= stages.length; k++) {
    const i = (from + k) % stages.length
    if (!done.includes(stages[i].id)) return i
  }
  return -1
}

export function FinalPage() {
  const p = useProgress()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const project = getProject(p.project)
  // the final project opens after the last lesson, or when the learner chooses to skip ahead to it
  if (!project) return <Navigate to="/project" replace />
  if (!isFinalUnlocked(p)) return <Navigate to="/learn#final" replace />
  // a short classroom warm-up comes before each project (and can be replayed with ?warmup=1)
  if (!p.warmups[project.id] || params.get('warmup') === '1') {
    return (
      <WarmupQuiz
        key={project.id}
        project={project}
        onDone={() => {
          store.completeWarmup(project.id)
          navigate('/final', { replace: true })
        }}
      />
    )
  }
  return <ProjectBuilder key={project.id} project={project} />
}

/** "I don't get it": the ideas behind the stage, explained properly, plus the video. */
function ExplainPanel({ stage, project, open, onToggle }: { stage: FinalStage; project: FinalProject; open: boolean; onToggle: () => void }) {
  return (
    <div id="explain" className="scroll-mt-24 rounded-3xl border-2 border-sky-200 bg-sky-50">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="flex items-center gap-2 font-display font-semibold text-sky-800">
          <HelpCircle size={18} /> I don't get it. Explain it to me
        </span>
        <ChevronDown size={18} className={`text-sky-700 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4">
          {stage.explain.map((e) => (
            <div key={e.title} className="rounded-2xl bg-white p-4">
              <h3 className="font-bold text-espresso-900">{e.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-espresso-700">
                <Md text={e.body} />
              </p>
              {e.code && <CodeBlock code={e.code} size="sm" className="mt-3" copy={false} />}
            </div>
          ))}
          <p className="text-sm font-semibold text-sky-900">Still fuzzy? That is completely normal. The video walks through the whole program, so watching it can help it click.</p>
          <VideoLink project={project} />
        </div>
      )}
    </div>
  )
}

function ProjectBuilder({ project }: { project: FinalProject }) {
  const p = useProgress()
  const stages = project.stages
  const firstOpen = stages.findIndex((s) => !p.final.stagesDone.includes(s.id))
  const [index, setIndex] = useState(firstOpen === -1 ? stages.length - 1 : firstOpen)
  const stage = stages[index]
  const [code, setCode] = useState(p.final.code[stage.id] ?? stage.starter)
  const [result, setResult] = useState<CodeTaskResult | null>(null)
  const [run, setRun] = useState<RunResult | null>(null)
  const [inputs, setInputs] = useState<string[]>([])
  const [hints, setHints] = useState(0)
  const [failures, setFailures] = useState(0)
  const [explainOpen, setExplainOpen] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [reward, setReward] = useState<Reward | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const done = p.final.stagesDone.includes(stage.id)
  const allDone = stages.every((s) => p.final.stagesDone.includes(s.id))

  useEffect(() => {
    setCode(store.getSnapshot().final.code[stage.id] ?? stage.starter)
    setResult(null)
    setRun(null)
    setInputs([])
    setHints(0)
    setFailures(0)
    setExplainOpen(false)
    setReward(null)
  }, [stage.id, stage.starter])

  const onCode = (v: string) => {
    setCode(v)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => store.saveFinalCode(stage.id, v), 400)
  }

  const execute = (lines: string[]) => setRun(runJava(code, { stdin: lines.length ? lines.join('\n') + '\n' : '', interactive: true }))

  const runTests = () => {
    store.saveFinalCode(stage.id, code)
    const r = runCodeTask(code, stage.tests, stage.solution, stage.mustInclude)
    setResult(r)
    if (r.passed) {
      sfx.complete()
      celebrate(nextOpenStage(stages, [...p.final.stagesDone, stage.id], index) === -1 ? 'big' : 'small')
      setReward(store.completeFinalStage(stage.id, stage.title))
    } else {
      sfx.wrong()
      setFailures((f) => f + 1)
    }
  }

  const tests = useMemo(() => stage.tests.map((t) => ({ ...t })), [stage])
  const upcoming = nextOpenStage(stages, p.final.stagesDone, index)
  const lastIndex = stages.length - 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-4">
          <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brew-100 text-brew-600 sm:flex">
            <AppIcon name={project.icon} size={36} />
          </span>
          <div>
            <div className="text-sm font-extrabold tracking-widest text-brew-600 uppercase">Your final project</div>
            <h1 className="text-3xl font-bold sm:text-4xl">{project.title}</h1>
            <p className="text-espresso-600">{project.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {allDone && (
            <div className="rounded-2xl border-2 border-mint-400 bg-mint-50 px-4 py-2 font-display font-semibold text-mint-700">
              <AppIcon name="trophy" size={20} className="mr-1.5 inline-block align-[-4px]" />
              Completed!
            </div>
          )}
          <Link to="/final?warmup=1" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-espresso-500 hover:bg-espresso-100">
            <PartyPopper size={16} /> Replay the warm-up
          </Link>
          <Link to="/project" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-espresso-500 hover:bg-espresso-100">
            <Shuffle size={16} /> Change project
          </Link>
        </div>
      </div>

      <VideoLink project={project} className="max-w-xl" />

      {/* stepper: every stage can be opened in any order */}
      <div>
        <ol className="flex gap-2 overflow-x-auto pb-1" aria-label="Stages">
          {stages.map((s, i) => {
            const sDone = p.final.stagesDone.includes(s.id)
            return (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-left text-sm font-bold transition ${
                    i === index
                      ? 'border-brew-500 bg-brew-50 text-brew-700'
                      : sDone
                        ? 'border-mint-300 bg-mint-50 text-mint-700 hover:bg-mint-100'
                        : 'border-espresso-100 bg-white text-espresso-600 hover:bg-cream-100'
                  }`}
                >
                  {sDone ? <CheckCircle2 size={18} /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-espresso-800 text-[11px] text-white">{i + 1}</span>}
                  <span className="whitespace-nowrap">{s.title}</span>
                </button>
              </li>
            )
          })}
        </ol>
        <p className="mt-1 text-xs font-semibold text-espresso-400">Each stage starts with the earlier parts already written for you, so you can open any of them.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          <MascotSays mood={done ? 'celebrating' : 'excited'} size={72}>
            <span className="text-[15px]">
              <Md text={stage.story} />
            </span>
          </MascotSays>
          <div className="flex flex-wrap gap-1.5">
            {stage.concepts.map((c) => (
              <span key={c} className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">
                {c}
              </span>
            ))}
          </div>
          <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">
              Stage {index + 1}: {stage.title}
            </h2>
            <ol className="space-y-2.5">
              {stage.instructions.map((ins, i) => (
                <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-espresso-800">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brew-500 text-xs font-bold text-white">{i + 1}</span>
                  <span>
                    <Md text={ins} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <ExplainPanel stage={stage} project={project} open={explainOpen} onToggle={() => setExplainOpen((o) => !o)} />
          <div className="rounded-3xl border-2 border-sun-200 bg-sun-50 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-display font-semibold text-sun-800">
                <Lightbulb size={18} /> Hints ({hints}/{stage.hints.length})
              </span>
              {hints < stage.hints.length && (
                <button type="button" onClick={() => setHints((h) => h + 1)} className="rounded-lg px-2 py-1 text-sm font-bold text-sun-800 hover:bg-sun-100">
                  Show a hint
                </button>
              )}
            </div>
            {hints > 0 && (
              <ul className="mt-2 space-y-2">
                {stage.hints.slice(0, hints).map((h, i) => (
                  <motion.li key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-white px-3 py-2 text-sm text-espresso-800">
                    <Md text={h} />
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <CodeEditor
            value={code}
            onChange={onCode}
            initialValue={stage.starter}
            title="Main.java"
            minLines={16}
            maxHeight={560}
            onRun={() => {
              setInputs([])
              execute([])
            }}
            lineTones={result?.blockingError?.error?.line ? { [result.blockingError.error.line]: 'error' } : undefined}
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
            <>
              <Console
                segments={run.segments}
                status={run.status}
                maxHeight={260}
                onInput={(line) => {
                  const next = [...inputs, line]
                  setInputs(next)
                  execute(next)
                }}
              />
              <ErrorExplainer result={run} />
            </>
          )}
          {result?.blockingError && <ErrorExplainer result={result.blockingError} />}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="success" size="lg" onClick={runTests} icon={<FlaskConical size={20} />}>
              Run tests
            </Button>
            {failures >= 2 && (
              <Button variant="ghost" onClick={() => setSolutionOpen(true)} icon={<Eye size={18} />}>
                Peek at a solution
              </Button>
            )}
          </div>
          {failures > 0 && !reward && (
            <div className="flex items-start gap-3 rounded-2xl border-2 border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
              <HelpCircle size={18} className="mt-0.5 shrink-0 text-sky-600" />
              <p>
                Not quite yet, and that is fine. Compare your output with the expected output below, then{' '}
                <button
                  type="button"
                  className="font-bold underline decoration-2 underline-offset-2 hover:text-sky-700"
                  onClick={() => {
                    setExplainOpen(true)
                    setTimeout(() => document.getElementById('explain')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                  }}
                >
                  read the explanation
                </button>{' '}
                for this stage. You can also{' '}
                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-2 underline-offset-2 hover:text-sky-700">
                  watch the video walkthrough
                </a>{' '}
                for more help.
              </p>
            </div>
          )}
          <TestResults result={result} tests={tests} />
          {reward && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 rounded-3xl border-2 border-mint-400 bg-mint-50 p-5 text-center sm:flex-row sm:text-left">
              <Mascot mood="celebrating" size={80} />
              <div className="flex-1">
                <div className="font-display text-2xl font-bold text-mint-800">{upcoming === -1 ? `You built the whole ${project.title}!` : `Stage ${index + 1} complete!`}</div>
                <div className="font-bold text-sun-700">+{reward.xp} XP</div>
              </div>
              {upcoming !== -1 && (
                <Button onClick={() => setIndex(upcoming)} icon={<ChevronRight size={20} />}>
                  Next: Stage {upcoming + 1}
                </Button>
              )}
            </motion.div>
          )}
          {allDone && (index === lastIndex || reward) && (
            <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
              <h3 className="mb-2 text-xl font-bold">Try your {project.title}</h3>
              <p className="mb-3 text-sm text-espresso-600">Run it and use it for real. Type your answers in the console, and try a typo or two to see your try / catch at work.</p>
              {/* the last stage holds the whole program */}
              <RunnableCode
                key={index}
                code={index === lastIndex ? code : (p.final.code[stages[lastIndex].id] ?? stages[lastIndex].solution)}
                title="Main.java"
                editable={false}
                showTrace={false}
                consoleHeight={320}
              />
            </div>
          )}
        </div>
      </div>

      <Modal open={solutionOpen} onClose={() => setSolutionOpen(false)} title={`A solution for stage ${index + 1}`} size="lg">
        <p className="mb-3 text-espresso-600">Compare it with your code, then try to fix yours instead of copying! If a line does not make sense, the video goes through the whole program.</p>
        <CodeBlock code={stage.solution} title="Main.java" maxHeight={520} />
      </Modal>
    </div>
  )
}
