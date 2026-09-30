import type { Question, TopicId } from './types'

/**
 * Tag for Java code blocks inside content files.
 * Uses String.raw so escapes like "\n" inside Java strings stay literal,
 * and trims the first/last newline so code can be written flush-left.
 */
export function j(strings: TemplateStringsArray, ...values: unknown[]): string {
  return String.raw({ raw: strings.raw }, ...values)
    .replace(/^\r?\n/, '')
    .replace(/\r?\n[ \t]*$/, '')
    .replace(/\r\n/g, '\n')
}

/** Question without a topic: the lesson helper fills it in. */
export type Q = Question extends infer T ? (T extends Question ? Omit<T, 'topic'> & { topic?: TopicId } : never) : never

/** Attach a topic to every question that doesn't declare its own. */
export function topic(t: TopicId, questions: Q[]): Question[] {
  return questions.map((q) => ({ ...q, topic: q.topic ?? t }) as Question)
}
