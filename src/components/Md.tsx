import { Fragment, type ReactNode } from 'react'

/**
 * Tiny markdown renderer for lesson text: `code`, **bold**, *italic*,
 * paragraphs and ``` fenced blocks. Keeps content files readable.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const k = `${keyBase}-${i++}`
    if (tok.startsWith('`')) {
      out.push(
        <code key={k} className="rounded-md border border-espresso-200/70 bg-espresso-50 px-1.5 py-0.5 font-mono text-[0.88em] font-semibold text-brew-700">
          {tok.slice(1, -1)}
        </code>,
      )
    } else if (tok.startsWith('**')) {
      out.push(
        <strong key={k} className="font-extrabold text-espresso-900">
          {tok.slice(2, -2)}
        </strong>,
      )
    } else {
      out.push(<em key={k}>{tok.slice(1, -1)}</em>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Md({ text, className = '' }: { text: string; className?: string }) {
  const blocks = text.split(/```(?:java)?\n?/)
  return (
    <span className={className}>
      {blocks.map((block, bi) =>
        bi % 2 === 1 ? (
          <pre key={bi} className="my-2 overflow-x-auto rounded-xl bg-code-bg px-3 py-2 font-mono text-sm leading-relaxed text-code-text">
            {block.replace(/\n$/, '')}
          </pre>
        ) : (
          <Fragment key={bi}>
            {block.split('\n').map((line, li, arr) => (
              <Fragment key={li}>
                {inline(line, `${bi}-${li}`)}
                {li < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </Fragment>
        ),
      )}
    </span>
  )
}
