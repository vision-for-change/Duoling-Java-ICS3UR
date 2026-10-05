import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { MascotSays } from '../components/Mascot'
import { ProjectPicker } from '../components/ProjectPicker'
import { getProject } from '../data/projects'
import type { ProjectId } from '../data/types'
import { useProgress } from '../state/hooks'
import { store } from '../state/store'

/** Choose the final project (learners from before projects existed land here once), or switch to another one. */
export function ProjectPage() {
  const p = useProgress()
  const navigate = useNavigate()
  const [choice, setChoice] = useState<ProjectId | null>(p.project)
  const current = getProject(p.project)
  const startedOther = choice !== p.project && p.final.stagesDone.some((id) => current?.stages.some((s) => s.id === id))

  return (
    <div className="mx-auto max-w-3xl">
      <MascotSays mood={current ? 'thinking' : 'excited'} size={96}>
        <span className="text-lg">
          {current ? (
            <>
              Your final project is the <b>{current.title}</b>. Want to build a different one instead? Every project uses the same Java from the course.
            </>
          ) : (
            <>Before we keep going: which project do you want to build at the end of the course? You will build it yourself, step by step, once the units are done.</>
          )}
        </span>
      </MascotSays>
      <div className="mt-8">
        <ProjectPicker value={choice} onChange={setChoice} />
      </div>
      {startedOther && (
        <p className="mt-4 rounded-2xl bg-sun-50 px-4 py-3 text-sm font-semibold text-sun-800">
          Your {current!.title} code is saved, so you can switch back later and carry on where you left off.
        </p>
      )}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {current && (
          <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
            Keep {current.title}
          </Button>
        )}
        <Button
          size="lg"
          disabled={!choice || choice === p.project}
          onClick={() => {
            if (!choice) return
            store.chooseProject(choice)
            navigate(current ? '/final' : '/home', { replace: true })
          }}
        >
          {current ? 'Switch project' : 'Choose this project'}
        </Button>
      </div>
    </div>
  )
}
