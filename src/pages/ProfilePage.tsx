import { useRef, useState } from 'react'
import { Download, Keyboard, Pencil, RotateCcw, Settings, Upload } from 'lucide-react'
import { Button, ButtonLink } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { Modal } from '../components/Modal'
import { StatTile, LevelBadge } from '../components/Stats'
import { TOTAL_LESSONS } from '../data/curriculum'
import { completedLessonCount } from '../engine/progression'
import { overallAccuracy } from '../engine/stats'
import { useDerived } from '../state/hooks'
import { store } from '../state/store'
import type { Settings as SettingsT } from '../state/types'
import { Card } from './DashboardPage'
import { PlacementResults } from './PlacementPage'
import { AppIcon } from '../components/AppIcon'

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block font-bold text-espresso-800">{label}</span>
        {description && <span className="block text-sm text-espresso-500">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full border-2 transition ${checked ? 'border-mint-600 bg-mint-500' : 'border-espresso-200 bg-espresso-100'}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? 'left-[26px]' : 'left-0.5'}`} />
        <span className="sr-only">{label}</span>
      </button>
    </label>
  )
}

function Segmented<T extends string | number>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="py-3">
      <div className="mb-2 font-bold text-espresso-800">{label}</div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-xl border-2 px-3 py-1.5 text-sm font-bold transition ${
              value === o.value ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-espresso-100 bg-white text-espresso-600 hover:bg-cream-100'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { progress: p, level, streak } = useDerived()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(p.profile.name)
  const [resetOpen, setResetOpen] = useState(false)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (patch: Partial<SettingsT>) => store.updateSettings(patch)

  const exportData = () => {
    const blob = new Blob([store.exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bytebrew-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col items-center gap-5 rounded-3xl border-2 border-espresso-100 bg-white p-6 sm:flex-row">
        <div className="rounded-full bg-gradient-to-br from-brew-100 to-sun-100 p-2">
          <Mascot mood="happy" size={96} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          {editing ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                store.setProfileName(name)
                setEditing(false)
              }}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                autoFocus
                aria-label="Your name"
                className="w-full max-w-xs rounded-xl border-2 border-sky-300 px-3 py-2 font-display text-2xl font-semibold outline-none"
              />
              <Button type="submit" size="sm">
                Save
              </Button>
            </form>
          ) : (
            <h1 className="flex items-center justify-center gap-2 text-3xl font-bold sm:justify-start">
              {p.profile.name || 'Java learner'}
              <button type="button" onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-espresso-400 hover:bg-espresso-100" aria-label="Edit name">
                <Pencil size={18} />
              </button>
            </h1>
          )}
          <p className="text-espresso-500">Learning Java since {new Date(p.profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <LevelBadge level={level.current} size={56} />
          <div>
            <div className="font-display text-lg font-semibold">Level {level.current.level}</div>
            <div className="text-sm text-espresso-500">{level.current.title}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={<AppIcon name="zap" size={22} />} tone="sun" label="Total XP" value={p.xp.toLocaleString()} />
        <StatTile icon={<AppIcon name="flame" size={22} />} tone="brew" label="Current streak" value={`${streak} day${streak === 1 ? '' : 's'}`} sub={`Longest: ${p.streak.longest}`} />
        <StatTile icon={<AppIcon name="book" size={22} />} tone="sky" label="Lessons" value={`${completedLessonCount(p)}/${TOTAL_LESSONS}`} />
        <StatTile icon={<AppIcon name="target" size={22} />} tone="mint" label="Accuracy" value={p.stats.answered ? `${Math.round(overallAccuracy(p) * 100)}%` : 'N/A'} />
        <StatTile icon={<AppIcon name="pen" size={22} />} tone="grape" label="Questions answered" value={p.stats.answered} />
        <StatTile icon={<AppIcon name="dumbbell" size={22} />} tone="berry" label="Practice sessions" value={p.stats.practiceSessions} />
        <StatTile icon={<AppIcon name="bug" size={22} />} tone="mint" label="Bugs fixed" value={p.stats.bugsFixed} />
        <StatTile icon={<AppIcon name="target" size={22} />} tone="sky" label="Best combo" value={p.stats.bestCombo} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Settings" icon={<Settings size={22} className="text-espresso-500" />}>
          <div className="divide-y-2 divide-espresso-50">
            <Toggle
              checked={p.settings.heartsEnabled}
              onChange={(v) => set({ heartsEnabled: v })}
              label="Hearts"
              description="Limit mistakes per lesson. Turn off for unlimited, stress-free practice."
            />
            {p.settings.heartsEnabled && (
              <Segmented
                label="Hearts per lesson"
                value={p.settings.maxHearts}
                onChange={(v) => set({ maxHearts: v })}
                options={[
                  { value: 3, label: '3 · challenge' },
                  { value: 5, label: '5 · relaxed' },
                  { value: 8, label: '8 · easy going' },
                ]}
              />
            )}
            <Segmented
              label="Daily goal"
              value={p.settings.dailyGoal}
              onChange={(v) => set({ dailyGoal: v })}
              options={[
                { value: 20, label: 'Casual · 20 XP' },
                { value: 50, label: 'Regular · 50 XP' },
                { value: 100, label: 'Serious · 100 XP' },
                { value: 150, label: 'Intense · 150 XP' },
              ]}
            />
            <Toggle checked={p.settings.sound} onChange={(v) => set({ sound: v })} label="Sound effects" description="Little chimes for right and wrong answers." />
            <Segmented
              label="Animations"
              value={p.settings.motion}
              onChange={(v) => set({ motion: v })}
              options={[
                { value: 'system', label: 'Match my device' },
                { value: 'reduced', label: 'Reduced' },
                { value: 'full', label: 'Full' },
              ]}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Placement" icon={<AppIcon name="compass" size={22} className="text-brew-500" />} action={<ButtonLink to="/placement" size="sm" variant="secondary">Retake</ButtonLink>}>
            {p.placement && !p.placement.skipped ? (
              <PlacementResults result={p.placement} />
            ) : (
              <p className="text-espresso-600">You started from the beginning. Take the placement test any time to skip ahead.</p>
            )}
          </Card>

          <Card title="Keyboard shortcuts" icon={<Keyboard size={22} className="text-sky-600" />}>
            <ul className="space-y-2 text-sm text-espresso-700">
              {[
                ['Enter', 'Check answer / continue'],
                ['1 to 4', 'Pick an answer choice'],
                ['Esc', 'Leave a lesson (or release Tab in the code editor)'],
                ['Ctrl + Enter', 'Run code / check a typed output'],
                ['← →', 'Step backwards / forwards in "Watch it run"'],
              ].map(([k, d]) => (
                <li key={k} className="flex items-center justify-between gap-3">
                  <kbd className="rounded-lg border border-espresso-200 bg-cream-100 px-2 py-0.5 font-mono text-xs font-bold">{k}</kbd>
                  <span className="text-right">{d}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Your data" icon={<Download size={22} className="text-mint-600" />}>
            <p className="text-sm text-espresso-600">Progress is saved automatically in this browser. Export it to back it up or move it to another device.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" icon={<Download size={16} />} onClick={exportData}>
                Export
              </Button>
              <Button variant="secondary" size="sm" icon={<Upload size={16} />} onClick={() => fileRef.current?.click()}>
                Import
              </Button>
              <Button variant="danger" size="sm" icon={<RotateCcw size={16} />} onClick={() => setResetOpen(true)}>
                Reset progress
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const ok = store.importJson(await file.text())
                  setImportMsg(ok ? 'Progress imported!' : 'That file doesn\'t look like ByteBrew progress.')
                  e.target.value = ''
                }}
              />
            </div>
            {importMsg && <p className="mt-2 text-sm font-bold text-espresso-600">{importMsg}</p>}
          </Card>
        </div>
      </div>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} size="sm">
        <div className="flex flex-col items-center text-center">
          <Mascot mood="surprised" size={110} />
          <h2 className="mt-2 text-2xl font-bold">Reset all progress?</h2>
          <p className="mt-1 text-espresso-600">XP, streak, lessons and badges will be erased. This can't be undone.</p>
          <div className="mt-5 flex w-full flex-col gap-2">
            <Button full variant="secondary" onClick={() => setResetOpen(false)} data-autofocus>
              Keep my progress
            </Button>
            <Button
              full
              variant="danger"
              onClick={() => {
                store.resetProgress()
                setResetOpen(false)
              }}
            >
              Reset everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
