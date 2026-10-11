/**
 * The project warm-up quiz: a short, silly tradition before every final project.
 * The six classroom sayings below are the ONLY sayings used, always word for word, and each one is the
 * correct answer to its question. They appear here and nowhere else in the course.
 */

export const SAYINGS = [
  'The key to success is consistency.',
  'Never suffer in silence.',
  'Everything counts.',
  'Collaboration, not competition.',
  'Remember to have a wonderful or fantastic weekend.',
  'If someone is laughing, someone is crying.',
] as const

export interface WarmupQuestion {
  id: string
  prompt: string
  /** the exact saying, which is always the correct option */
  saying: (typeof SAYINGS)[number]
  /** wrong options, each with its own funny reaction */
  decoys: { text: string; reaction: string }[]
  /** what Byte says when you get it right */
  correctReaction: string
}

export const WARMUP: WarmupQuestion[] = [
  {
    id: 'consistency',
    prompt: 'Complete the classroom wisdom: "The key to success is..."',
    saying: 'The key to success is consistency.',
    decoys: [
      { text: 'The key to success is a really expensive keyboard.', reaction: 'Nice try, but RGB lights have never fixed a single bug.' },
      { text: 'The key to success is eight hours of sleep, starting next week.', reaction: 'Next week never comes. That is kind of the whole point.' },
      { text: 'The key to success is under the doormat.', reaction: 'That is the key to the house. Different key, same lesson: show up every day.' },
    ],
    correctReaction: 'Correct! A little bit every day beats a panicked all-nighter every time.',
  },
  {
    id: 'silence',
    prompt: 'You have been stuck on the same bug for 40 minutes. What is the rule?',
    saying: 'Never suffer in silence.',
    decoys: [
      { text: 'Suffer quietly. It builds character.', reaction: 'It builds frustration, mostly. Put your hand up!' },
      { text: 'Never suffer in silence. Suffer loudly, in the group chat, at 2 a.m.', reaction: 'Close, but the real saying stops after "silence". Your group chat thanks you.' },
      { text: 'Delete the whole project and move to the woods.', reaction: 'The woods have no Wi-Fi. Asking for help is much easier.' },
    ],
    correctReaction: 'Exactly! Asking for help is a skill, not a weakness.',
  },
  {
    id: 'counts',
    prompt: 'You fixed one tiny missing semicolon. What does your teacher say?',
    saying: 'Everything counts.',
    decoys: [
      { text: 'Only the semicolons count.', reaction: 'Semicolons are important, but they are not the only thing that counts.' },
      { text: 'Nothing counts until Friday.', reaction: 'Bold strategy. Sadly, Monday counts too.' },
      { text: 'Everything counts, except my homework.', reaction: 'Your homework counts. It counts a lot, actually.' },
    ],
    correctReaction: 'Yes! Every small fix and every finished lesson adds up.',
  },
  {
    id: 'collaboration',
    prompt: 'Your friend is stuck on a loop and you know the answer. Which motto applies?',
    saying: 'Collaboration, not competition.',
    decoys: [
      { text: 'Competition, not collaboration.', reaction: 'You flipped it! Bryan would love that answer, though.' },
      { text: 'Collaboration, but only if they share their snacks.', reaction: 'Snacks help, but they are not required. Help anyway.' },
      { text: 'Every coder for themselves!', reaction: 'This is a classroom, not a battle royale.' },
    ],
    correctReaction: 'Right on! We get further when we help each other.',
  },
  {
    id: 'weekend',
    prompt: 'It is Friday afternoon. How does class end?',
    saying: 'Remember to have a wonderful or fantastic weekend.',
    decoys: [
      { text: 'Remember to have a wonderful and fantastic weekend.', reaction: 'So close! It is "wonderful OR fantastic". You only have to pick one.' },
      { text: 'Remember to do 400 practice questions this weekend.', reaction: 'Absolutely not. Rest is part of learning.' },
      { text: 'See you Monday. Bring snacks.', reaction: 'Snacks are always welcome, but that is not the saying.' },
    ],
    correctReaction: 'Perfect! Wonderful or fantastic: both are allowed, and you get to choose.',
  },
  {
    id: 'laughing',
    prompt: 'Finish the saying: "If someone is laughing..."',
    saying: 'If someone is laughing, someone is crying.',
    decoys: [
      { text: 'If someone is laughing, someone forgot a semicolon.', reaction: 'Probably true, but not the saying.' },
      { text: 'If someone is laughing, they just saw my code.', reaction: 'Your code is lovely. That is not the saying, though.' },
      { text: 'If someone is laughing, someone is laughing too.', reaction: 'That is just two people laughing. The real one has a twist.' },
    ],
    correctReaction: 'You know it! Have fun, but keep an eye on how everyone else is doing.',
  },
]

/** How many questions one warm-up asks. Short on purpose. */
export const WARMUP_LENGTH = 4

/** Pick the questions for one warm-up, in a random order. */
export function pickWarmup(rand: () => number = Math.random, count = WARMUP_LENGTH): WarmupQuestion[] {
  const a = [...WARMUP]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, count)
}

/** A title for the completion screen, from the score. */
export function warmupRank(score: number, total: number): string {
  if (score === total) return 'Certified Classroom Legend'
  if (score >= total - 1) return 'Honorary Teacher\'s Assistant'
  if (score >= total / 2) return 'Promising Listener'
  return 'Fresh Ears (that is okay, now you know them!)'
}
