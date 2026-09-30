import { CircleCheck, CircleX, Compass, Lightbulb, Sparkles } from 'lucide-react'
import type { TeachCard } from '../data/types'
import { CodeBlock } from './CodeBlock'
import { MascotSays } from './Mascot'
import { Md } from './Md'
import { RunnableCode } from './RunnableCode'

/** One teaching step inside a lesson: concept, example, tip or common mistake. */
export function TeachCardView({ card }: { card: TeachCard }) {
  switch (card.kind) {
    case 'concept':
      return (
        <div className="space-y-5">
          <MascotSays mood={card.mood ?? 'happy'} size={96}>
            <span className="font-display text-xl">{card.title}</span>
          </MascotSays>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border-2 border-sky-200 bg-sky-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold tracking-wider text-sky-700 uppercase">
                <Sparkles size={18} /> What it is
              </div>
              <p className="text-[17px] leading-relaxed text-espresso-800">
                <Md text={card.what} />
              </p>
            </div>
            <div className="rounded-3xl border-2 border-brew-200 bg-brew-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold tracking-wider text-brew-700 uppercase">
                <Compass size={18} /> Why it matters
              </div>
              <p className="text-[17px] leading-relaxed text-espresso-800">
                <Md text={card.why} />
              </p>
            </div>
          </div>
        </div>
      )
    case 'example':
      return (
        <div className="space-y-4">
          <div>
            <div className="text-sm font-extrabold tracking-wider text-mint-700 uppercase">Example · How it works</div>
            <h2 className="mt-1 text-2xl font-bold">{card.title}</h2>
            <p className="mt-2 text-[17px] leading-relaxed text-espresso-700">
              <Md text={card.how} />
            </p>
          </div>
          <RunnableCode code={card.code} stdin={card.stdin} autoRun notes={card.notes} />
          {card.random && <p className="text-sm text-espresso-500">🎲 This program uses randomness. Press Run again for new numbers.</p>}
        </div>
      )
    case 'mistake':
      return (
        <div className="space-y-4">
          <div>
            <div className="text-sm font-extrabold tracking-wider text-berry-600 uppercase">Common mistake</div>
            <h2 className="mt-1 text-2xl font-bold">{card.title}</h2>
            <p className="mt-2 text-[17px] leading-relaxed text-espresso-700">
              <Md text={card.body} />
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-display font-semibold text-berry-600">
                <CircleX size={20} /> Wrong
              </div>
              <RunnableCode code={card.wrong} stdin={card.stdin} autoRun showTrace={false} consoleHeight={140} editorMaxHeight={260} title="Mistake.java" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-display font-semibold text-mint-600">
                <CircleCheck size={20} /> Right
              </div>
              <RunnableCode code={card.right} stdin={card.stdin} autoRun showTrace={false} consoleHeight={140} editorMaxHeight={260} title="Fixed.java" />
            </div>
          </div>
        </div>
      )
    case 'tip':
      return (
        <div className="space-y-4">
          <MascotSays mood="encouraging" size={88}>
            <span className="font-display text-xl">{card.title}</span>
          </MascotSays>
          <div className="rounded-3xl border-2 border-sun-200 bg-sun-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-extrabold tracking-wider text-sun-800 uppercase">
              <Lightbulb size={18} /> Byte's tip
            </div>
            <p className="text-[17px] leading-relaxed text-espresso-800">
              <Md text={card.body} />
            </p>
            {card.bullets && (
              <ul className="mt-3 space-y-2">
                {card.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[16px] text-espresso-800">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sun-500" />
                    <span>
                      <Md text={b} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {card.code && <CodeBlock className="mt-4" code={card.code} size="sm" />}
          </div>
        </div>
      )
  }
}
