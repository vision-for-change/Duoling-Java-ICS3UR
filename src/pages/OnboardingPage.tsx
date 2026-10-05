import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { MascotSays } from '../components/Mascot'
import { ProjectPicker } from '../components/ProjectPicker'
import type { ProjectId } from '../data/types'
import { skippedPlacement } from '../engine/placement'
import { useProgress } from '../state/hooks'
import { store } from '../state/store'
import { AppIcon } from '../components/AppIcon'

const LEVELS = [
  { id: 'new', icon: 'sprout', title: "I'm brand new to Java", body: 'Start from the very first lesson, and we will go step by step.' },
  { id: 'little', icon: 'compass', title: 'I know a little', body: 'Take a quick placement test (14 questions, about 5 minutes).' },
  { id: 'lot', icon: 'rocket', title: 'I know quite a bit', body: 'Take the placement test and skip the units you already know.' },
] as const

const GOALS = [
  { xp: 20, label: 'Casual', time: '~5 min / day' },
  { xp: 50, label: 'Regular', time: '~10 min / day' },
  { xp: 100, label: 'Serious', time: '~20 min / day' },
  { xp: 150, label: 'Intense', time: '~30 min / day' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const p = useProgress()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(p.profile.name)
  const [goal, setGoal] = useState(p.settings.dailyGoal)
  const [level, setLevel] = useState<(typeof LEVELS)[number]['id'] | null>(params.get('mode') === 'placement' ? 'little' : null)
  const [project, setProject] = useState<ProjectId | null>(p.project)

  const finish = () => {
    store.setProfileName(name)
    store.updateSettings({ dailyGoal: goal })
    if (project) store.chooseProject(project)
    if (level === 'new') {
      store.completeOnboarding(name, skippedPlacement())
      navigate('/learn')
    } else {
      navigate('/placement')
    }
  }

  const greeting = name.trim() ? `Nice to meet you, ${name.trim()}!` : 'Nice to meet you!'

  return (
    <div className="flex min-h-dvh flex-col bg-cream-50">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5">
        <Logo />
        <span className="text-sm font-bold text-espresso-400">Step {step + 1} of 4</span>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-10">
          {step === 0 && (
            <motion.form
              key="name"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
             
              onSubmit={(e) => {
                e.preventDefault()
                setStep(1)
              }}
              className="flex flex-1 flex-col"
            >
              <MascotSays mood="excited" size={120} className="mt-6">
                <span className="text-lg">Hi! I'm <b>Byte</b>. I'll be your guide through Java, one small step at a time.</span>
              </MascotSays>
              <label htmlFor="name" className="mt-10 block font-display text-2xl font-semibold">
                What should I call you?
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                autoFocus
                placeholder="Your first name or a nickname"
                className="mt-3 w-full rounded-2xl border-2 border-espresso-200 bg-white px-4 py-4 text-lg font-semibold shadow-[0_4px_0_var(--color-espresso-200)] outline-none placeholder:text-espresso-300 focus:border-sky-400"
              />
              <p className="mt-2 text-sm text-espresso-400">Optional. It stays in this browser.</p>
              <div className="mt-auto pt-10">
                <Button type="submit" size="lg" full>
                  Continue
                </Button>
              </div>
            </motion.form>
          )}

          {step === 1 && (
            <motion.div key="project" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col">
              <MascotSays mood="happy" size={110} className="mt-6">
                <span className="text-lg">
                  {greeting} Which project do you want to build? We will learn Java together unit by unit, and at the end you will build this program yourself, step by step.
                </span>
              </MascotSays>
              <div className="mt-8">
                <ProjectPicker value={project} onChange={setProject} />
              </div>
              <p className="mt-3 text-sm text-espresso-400">Every project uses the same Java you learn in the course. You can switch later if you change your mind.</p>
              <div className="mt-auto flex gap-3 pt-10">
                <Button variant="secondary" size="lg" onClick={() => setStep(0)} icon={<ArrowLeft size={20} />} aria-label="Back" />
                <Button size="lg" full disabled={!project} onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="goal" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col">
              <MascotSays mood="happy" size={110} className="mt-6">
                <span className="text-lg">Great choice! How much time do you want to spend each day?</span>
              </MascotSays>
              <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Daily goal">
                {GOALS.map((g) => (
                  <button
                    key={g.xp}
                    type="button"
                    role="radio"
                    aria-checked={goal === g.xp}
                    onClick={() => setGoal(g.xp)}
                    className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition ${
                      goal === g.xp ? 'border-sky-400 bg-sky-50 shadow-[0_4px_0_var(--color-sky-400)]' : 'border-espresso-200 bg-white shadow-[0_4px_0_var(--color-espresso-200)] hover:bg-cream-100'
                    }`}
                  >
                    <span className="font-display text-xl font-semibold">{g.label}</span>
                    <span className="text-right">
                      <span className="block font-bold text-espresso-700">{g.xp} XP a day</span>
                      <span className="text-sm text-espresso-400">{g.time}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-auto flex gap-3 pt-10">
                <Button variant="secondary" size="lg" onClick={() => setStep(1)} icon={<ArrowLeft size={20} />} aria-label="Back" />
                <Button size="lg" full onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="level" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col">
              <MascotSays mood="thinking" size={110} className="mt-6">
                <span className="text-lg">How much Java do you already know?</span>
              </MascotSays>
              <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Experience">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={level === l.id}
                    onClick={() => setLevel(l.id)}
                    className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition ${
                      level === l.id ? 'border-sky-400 bg-sky-50 shadow-[0_4px_0_var(--color-sky-400)]' : 'border-espresso-200 bg-white shadow-[0_4px_0_var(--color-espresso-200)] hover:bg-cream-100'
                    }`}
                  >
                    <AppIcon name={l.icon} size={38} className="shrink-0 text-brew-500" />
                    <span>
                      <span className="block font-display text-xl font-semibold">{l.title}</span>
                      <span className="block text-espresso-500">{l.body}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-auto flex gap-3 pt-10">
                <Button variant="secondary" size="lg" onClick={() => setStep(2)} icon={<ArrowLeft size={20} />} aria-label="Back" />
                <Button size="lg" full disabled={!level} onClick={finish}>
                  {level === 'new' ? 'Start learning' : 'Start placement test'}
                </Button>
              </div>
            </motion.div>
          )}
      </main>
    </div>
  )
}
