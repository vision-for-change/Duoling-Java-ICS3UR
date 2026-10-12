/**
 * Content model for ByteBrew's curriculum.
 *
 * Everything here is plain serialisable data so it could later be served
 * from a CMS / database instead of being bundled with the app.
 */

export type TopicId =
  | 'basics'
  | 'variables'
  | 'types'
  | 'input'
  | 'arithmetic'
  | 'errors'
  | 'printf'
  | 'expressions'
  | 'boolean-logic'
  | 'conditionals'
  | 'nested-if'
  | 'while-loops'
  | 'do-while'
  | 'loop-control'
  | 'for-loops'
  | 'switch'
  | 'try-catch'

/** 1 = Beginner (green), 2 = Intermediate (yellow), 3 = Advanced (red) */
export type Difficulty = 1 | 2 | 3

/** Names of the line icons drawn by `AppIcon` (src/components/AppIcon.tsx). */
export type IconName =
  | 'alert'
  | 'bank'
  | 'bot'
  | 'cart'
  | 'football'
  | 'gamepad'
  | 'handshake'
  | 'heart'
  | 'laugh'
  | 'megaphone'
  | 'sun'
  | 'swords'
  | 'x-circle'
  | 'bomb'
  | 'book'
  | 'brick-wall'
  | 'brain'
  | 'bug'
  | 'calculator'
  | 'check-circle'
  | 'coffee'
  | 'compass'
  | 'construction'
  | 'crown'
  | 'dice'
  | 'divide'
  | 'dumbbell'
  | 'flag'
  | 'flame'
  | 'flask'
  | 'footsteps'
  | 'git-branch'
  | 'graduation'
  | 'heart-crack'
  | 'keyboard'
  | 'layers'
  | 'lightbulb'
  | 'medal'
  | 'package'
  | 'party'
  | 'pen'
  | 'printer'
  | 'puzzle'
  | 'recycle'
  | 'refresh'
  | 'repeat'
  | 'repeat-once'
  | 'rocket'
  | 'ruler'
  | 'scale'
  | 'shield'
  | 'sparkles'
  | 'sprout'
  | 'star'
  | 'target'
  | 'thumbs-down'
  | 'thumbs-up'
  | 'timer'
  | 'trophy'
  | 'type'
  | 'zap'

export type ErrorKind = 'syntax' | 'runtime' | 'logic' | 'none'

export type MascotMood =
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'confused'
  | 'celebrating'
  | 'encouraging'
  | 'surprised'

export interface ChoiceOption {
  text: string
  /** Misconception feedback shown when the learner picks this (wrong) option. */
  feedback?: string
}

/** What running the question's code should do: used by the content validation tests. */
export interface Verify {
  status: 'ok' | 'compile-error' | 'runtime-error' | 'timeout'
  output?: string
  exception?: string
  /** random output: only check that it runs */
  random?: boolean
}

interface QuestionBase {
  id: string
  topic: TopicId
  difficulty: Difficulty
  /** fine-grained skill tag used to pick adaptive follow-ups */
  concept?: string
  /** Markdown-lite: `inline code`, **bold** */
  prompt: string
  code?: string
  /** input typed by the user while the program runs */
  stdin?: string
  /** WHY the correct answer is correct (shown after answering) */
  explanation: string
  /** a nudge shown after the first wrong attempt when no option-specific feedback exists */
  hint?: string
  /** 1-based code lines to highlight after a wrong attempt */
  highlightLines?: number[]
  verify?: Verify
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice' | 'predict-output'
  options: ChoiceOption[]
  answer: number
  /** how options are rendered */
  optionStyle?: 'text' | 'code' | 'output'
}

export interface TypeOutputQuestion extends QuestionBase {
  type: 'type-output'
  code: string
  answer: string
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true-false'
  answer: boolean
  /** shown when the learner picks the wrong side */
  wrongFeedback?: string
}

export interface FillBlankQuestion extends QuestionBase {
  type: 'fill-blank'
  /** `___` marks each blank, left to right */
  code: string
  /** accepted answers per blank (whitespace-insensitive) */
  blanks: string[][]
  /** optional word bank; when present the learner taps chips instead of typing */
  bank?: string[]
  /** if set, any answer that makes the program print this is accepted too */
  expectedOutput?: string
}

export interface ErrorTypeQuestion extends QuestionBase {
  type: 'error-type'
  code: string
  answer: ErrorKind
  feedback?: Partial<Record<ErrorKind, string>>
}

export interface ArrangeQuestion extends QuestionBase {
  type: 'arrange'
  /** lines in the correct order (indentation is added automatically) */
  lines: string[]
  /** decoy lines that don't belong in the program */
  distractors?: string[]
  /** other accepted orders, as indexes into `lines` */
  alternatives?: number[][]
  /** code shown above the arrangeable lines (not movable) */
  given?: string
  /** if set, any order whose program prints this is also accepted */
  expectedOutput?: string
}

export interface FindBugQuestion extends QuestionBase {
  type: 'find-bug'
  code: string
  /** any of these (1-based) lines counts as correct */
  bugLines: number[]
  fixedCode: string
  bugKind: ErrorKind
}

export interface CodeTest {
  label?: string
  stdin?: string
  /** override initial values of variables declared in the code, e.g. { temp: '35' } */
  set?: Record<string, string>
  output?: string
  /** regex source the whole (normalised) output must match, for random programs */
  outputPattern?: string
}

export interface CodeTaskQuestion extends QuestionBase {
  /** fix-code = debugging challenge, write-code = code completion */
  type: 'fix-code' | 'write-code'
  starter: string
  solution: string
  tests: CodeTest[]
  /** regex sources the code must contain, with a message when it doesn't */
  mustInclude?: { pattern: string; message: string }[]
}

export type Question =
  | MultipleChoiceQuestion
  | TypeOutputQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | ErrorTypeQuestion
  | ArrangeQuestion
  | FindBugQuestion
  | CodeTaskQuestion

export type QuestionType = Question['type']

// ---------------- teaching cards ----------------

export interface ConceptCard {
  kind: 'concept'
  title: string
  /** What it is */
  what: string
  /** Why it exists */
  why: string
  mood?: MascotMood
}

export interface ExampleCard {
  kind: 'example'
  title: string
  /** How it works */
  how: string
  code: string
  stdin?: string
  /** line-by-line annotations */
  notes?: { line: number; text: string }[]
  /** output changes each run (Math.random) */
  random?: boolean
  /** the example deliberately crashes to demonstrate an exception */
  crashes?: boolean
}

export interface MistakeCard {
  kind: 'mistake'
  title: string
  body: string
  wrong: string
  right: string
  stdin?: string
}

export interface TipCard {
  kind: 'tip'
  title: string
  body: string
  bullets?: string[]
  code?: string
}

export type TeachCard = ConceptCard | ExampleCard | MistakeCard | TipCard

export interface Lesson {
  id: string
  unitId: string
  title: string
  summary: string
  topic: TopicId
  teach: TeachCard[]
  /** question pool, roughly easiest first */
  questions: string[]
  /** the mini challenge at the end */
  challenge: string
}

export type UnitColor = 'brew' | 'sky' | 'grape' | 'mint' | 'berry' | 'sun' | 'teal' | 'cocoa'

export interface Unit {
  id: string
  number: number
  title: string
  tagline: string
  color: UnitColor
  icon: IconName
  topics: TopicId[]
  lessons: Lesson[]
  /** harder questions that combine the unit's concepts */
  checkpoint: string[]
}

export interface UnitContent {
  unit: Unit
  questions: Question[]
}

// ---------------- placement & final project ----------------

export type PlacementArea =
  | 'variables'
  | 'types'
  | 'input'
  | 'math'
  | 'errors'
  | 'printf'
  | 'conditionals'
  | 'loops'
  | 'exceptions'

export interface PlacementItem {
  area: PlacementArea
  question: Question
}

export interface FinalStage {
  id: string
  title: string
  concepts: string[]
  story: string
  instructions: string[]
  starter: string
  solution: string
  tests: CodeTest[]
  hints: string[]
  mustInclude?: { pattern: string; message: string }[]
  /** "I don't get it" explanations: the ideas this stage uses, explained properly */
  explain: { title: string; body: string; code?: string }[]
}

/** The four final projects a learner can choose from. */
export type ProjectId = 'cart' | 'guesser' | 'bank' | 'grades'

export interface FinalProject {
  id: ProjectId
  title: string
  tagline: string
  /** one or two sentences for the project picker */
  pitch: string
  icon: IconName
  /** the course ideas the finished program uses */
  concepts: string[]
  /** walkthrough video for the finished program */
  videoUrl: string
  stages: FinalStage[]
}
