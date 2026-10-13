import { Check, PlayCircle } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import type { FinalProject, ProjectId } from '../data/types'
import { AppIcon } from './AppIcon'

/** The final projects as radio cards. Used in onboarding and on the "change project" page. */
export function ProjectPicker({ value, onChange }: { value: ProjectId | null; onChange: (id: ProjectId) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Final project">
      {PROJECTS.map((pr) => {
        const on = value === pr.id
        return (
          <button
            key={pr.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(pr.id)}
            className={`relative flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition ${
              on ? 'border-sky-400 bg-sky-50 shadow-[0_4px_0_var(--color-sky-400)]' : 'border-espresso-200 bg-white shadow-[0_4px_0_var(--color-espresso-200)] hover:bg-cream-100'
            }`}
          >
            {on && (
              <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white" aria-hidden>
                <Check size={16} strokeWidth={3} />
              </span>
            )}
            <span className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brew-100 text-brew-600">
                <AppIcon name={pr.icon} size={26} />
              </span>
              <span className="font-display text-xl font-semibold">{pr.title}</span>
            </span>
            <span className="text-sm text-espresso-600">{pr.pitch}</span>
            <span className="flex flex-wrap gap-1">
              {pr.concepts.map((c) => (
                <span key={c} className="rounded-full bg-espresso-50 px-2 py-0.5 text-[11px] font-bold text-espresso-500">
                  {c}
                </span>
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** A link to the project's walkthrough video on YouTube. */
export function VideoLink({ project, className = '' }: { project: FinalProject; className?: string }) {
  return (
    <a
      href={project.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 rounded-2xl border-2 border-berry-200 bg-white px-4 py-3 transition hover:bg-berry-50 ${className}`}
    >
      <PlayCircle size={32} className="shrink-0 text-berry-500" aria-hidden />
      <span className="min-w-0">
        <span className="block font-display font-semibold text-espresso-900">Watch the video walkthrough</span>
        <span className="block text-sm text-espresso-500">The whole {project.title} program, explained step by step (opens YouTube)</span>
      </span>
    </a>
  )
}
