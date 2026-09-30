import { ArrowLeft, BookOpenText } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'
import { ButtonLink } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { Md } from '../components/Md'
import { getUnit } from '../data/curriculum'
import { lessonStatus } from '../engine/progression'
import { UNIT_STYLES } from '../lib/unitStyles'
import { useProgress } from '../state/hooks'

/** Unit guidebook: every concept, example and common mistake on one page. */
export function GuidePage() {
  const { unitId = '' } = useParams()
  const p = useProgress()
  const unit = getUnit(unitId)
  if (!unit) return <Navigate to="/learn" replace />
  const style = UNIT_STYLES[unit.color]
  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/learn#${unit.id}`} className="mb-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-espresso-500 hover:bg-espresso-100">
        <ArrowLeft size={16} /> Back to the path
      </Link>
      <div className={`rounded-3xl border-2 ${style.border} bg-gradient-to-br ${style.gradient} p-6 text-white`}>
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-white/80 uppercase">
          <BookOpenText size={16} /> Unit {unit.number} guidebook
        </div>
        <h1 className="mt-1 text-3xl font-bold">{unit.title}</h1>
        <p className="mt-1 text-white/90">{unit.tagline}</p>
      </div>

      <div className="mt-6 space-y-8">
        {unit.lessons.map((l, i) => {
          const concept = l.teach.find((c) => c.kind === 'concept')
          const example = l.teach.find((c) => c.kind === 'example')
          const mistake = l.teach.find((c) => c.kind === 'mistake')
          const tip = l.teach.find((c) => c.kind === 'tip')
          const status = lessonStatus(p, l)
          return (
            <article key={l.id} className="rounded-3xl border-2 border-espresso-100 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs font-extrabold tracking-wider uppercase ${style.text}`}>Lesson {i + 1}</div>
                  <h2 className="text-2xl font-bold">{l.title}</h2>
                </div>
                <ButtonLink to={`/lesson/${l.id}`} size="sm" variant={status === 'completed' ? 'secondary' : 'primary'}>
                  {status === 'completed' ? 'Review' : 'Start'}
                </ButtonLink>
              </div>
              {concept?.kind === 'concept' && (
                <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-espresso-800">
                  <p>
                    <span className="font-bold text-sky-700">What: </span>
                    <Md text={concept.what} />
                  </p>
                  <p>
                    <span className="font-bold text-brew-700">Why: </span>
                    <Md text={concept.why} />
                  </p>
                </div>
              )}
              {example?.kind === 'example' && (
                <div className="mt-4">
                  <p className="mb-2 text-[15px] text-espresso-700">
                    <span className="font-bold text-mint-700">How: </span>
                    <Md text={example.how} />
                  </p>
                  <CodeBlock code={example.code} size="sm" />
                </div>
              )}
              {tip?.kind === 'tip' && (
                <div className="mt-4 rounded-2xl bg-sun-50 p-4 text-[15px] text-espresso-800">
                  <div className="font-bold">💡 {tip.title}</div>
                  <Md text={tip.body} />
                  {tip.bullets && (
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {tip.bullets.map((b, k) => (
                        <li key={k}>
                          <Md text={b} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {mistake?.kind === 'mistake' && (
                <div className="mt-4">
                  <div className="mb-2 font-bold text-berry-600">⚠️ Common mistake: {mistake.title}</div>
                  <p className="mb-2 text-[15px] text-espresso-700">
                    <Md text={mistake.body} />
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <CodeBlock code={mistake.wrong} title="✗ Wrong" size="sm" copy={false} />
                    <CodeBlock code={mistake.right} title="✓ Right" size="sm" copy={false} />
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
