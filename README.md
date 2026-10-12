# ByteBrew: learn Java one byte at a time

ByteBrew is a gamified, beginner-friendly Java course for high-school students, built around the ICS3UR topic
outline. Learners follow a path of short lessons written the way a teacher would explain them, with **Mr. Lauder**
as their guide (a cartoon mascot drawn from a photo of Mr. Lauder), answer interactive questions with instant feedback, earn XP, keep a daily streak, collect badges and
finish with a real multi-stage project.

Everything runs in the browser, including a **Java sandbox** that compiles and runs beginner Java programs,
so examples are runnable, coding exercises are graded by actually executing the learner's code, and any
program can be stepped through line by line.

---

## Quick start

Requirements: **Node.js 20.19+** (22+ recommended) and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build a production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run all unit tests (Java sandbox, whole question bank, game engine) |
| `npm run typecheck` | TypeScript only |
| `npm run validate:java` | *Optional:* cross-check every program in the course against a real JDK (needs `javac`/`java` on the PATH) |

Progress is stored in the browser (`localStorage`), so no account or server is needed. Use
**Profile → Your data** to export, import or reset progress.

---

## What's inside

**Learning experience**
- **Landing page → onboarding → placement test.** New learners first choose the **final project** they want to
  build (Shopping Cart, Number Guesser, Mini Banking or Grade Analyzer), then pick a daily goal and their experience level.
  The 14-question placement test walks through the course in order, then recommends a starting unit
  ("You seem comfortable with X, but Y could use a little practice"). Earlier units are *placed out* but stay
  open for review.
- **The course**, in the order of the teacher's outline:
  1. **Getting Started**: `class Main`, variables, the 8 primitive types, Strings (and why they are not primitive),
     constants with `final`
  2. **Reading Input**: `Scanner` with `next`, `nextInt` and `nextDouble`
  3. **Math in Java**: the arithmetic operators (integer vs float division, modulus), assignment operators,
     casting and the two jobs of `+`
  4. **Errors and Debugging**: syntax errors, logic and run-time errors, how to debug
  5. **Formatting with printf**: placeholders, decimals, width and alignment
  6. **Making Decisions**: statements and expressions, relational operators, `if`/`else`, `else if`, nested ifs,
     logical operators and truth tables (AND, OR, NOT, XOR)
  7. **Loops**: `while`, `do-while`, `break` and `continue`, `for`, nested `for`
  8. **Switch and Exceptions**: `switch` (with fall-through), `try`/`catch`, `ArithmeticException`,
     `InputMismatchException` and `Exception e`
- **Learning path** with 8 units and 34 lessons (+ a checkpoint per unit and the final project), drawn as a
  winding path of nodes with Mr. Lauder standing next to the current lesson. **Learning is sequential by default:** a new
  learner starts at Unit 1, Lesson 1 and sees only Unit 1. Finishing a lesson unlocks the next one, and finishing the
  last lesson of a unit reveals the next unit. Each lesson shows one of five states: *completed*, *current*, *unlocked*,
  *skipped* or *locked*.
- **Skipping ahead is allowed, but never by accident.** Tapping a locked lesson (or choosing one in the **Course
  outline**) asks "Are you sure you want to skip ahead?" first. On "Yes, Skip Ahead" the chosen lesson opens, and the
  lessons that were passed over are marked *skipped*. Skipping never marks anything as completed, and a skipped
  lesson can be finished at any time. Locked lessons cannot be opened by typing their address either.
  Each unit has a **Guidebook** page.
- **Lesson rhythm:** very short explanation (*what / why*) → runnable example (*how*, with line notes) →
  question → instant feedback → another question → common-mistake card (wrong vs right, both runnable) →
  more questions → **mini challenge** → completion screen.
- **9 question types:** multiple choice, predict the output (pick or type it), true/false, fill in the blank
  (typed or word bank), error identification (syntax / runtime / logic / none), arrange the code, find the bug,
  fix the broken program, and write code (code completion). Every question has a difficulty
  (green Beginner / yellow Intermediate / red Advanced) and an explanation of *why* the answer is right.
- **Adaptive difficulty.** Correct first tries raise the target difficulty; mistakes lower it. A wrong answer
  never reveals the solution immediately: Mr. Lauder gives targeted feedback for the specific wrong choice, highlights
  the relevant code and offers a second try. After a mistake an **easier follow-up on the same concept** is
  inserted, and a question failed twice comes back later in the lesson.
- **Watch it run:** step through any program with the current line highlighted, a variable table (changed
  values glow) and the output so far.
- **Practice is the Stadium Challenge**, a football game built on the stadium image. Mr. Lauder dribbles from his own
  box toward the far goal while 7 superpowered defenders and a goalkeeper block the way: Bryan (The Firewall) and
  Avik (The Speed Demon), with their own dialogue, plus Frostbyte (ice), Glitch (teleport), Graviton (gravity),
  Polarity (magnet), Tremor (earthquake) and The Null in goal (energy shield). Each defender blocks him with one
  multiple-choice question: a right answer is a skill move past them (stepover chip, Cruyff turn, nutmeg, roulette,
  rainbow flick, elastico, a leap over the shockwave, and a top-corner screamer past the keeper); a wrong answer
  triggers their superpower, shows the explanation and costs one of 3 possessions. Lose all 3 and it is a turnover.
  - **Every unit, evenly:** questions come only from lessons the learner has finished, rotate so every studied unit
    gets a turn before any unit repeats (and favour units practised least overall), and get harder near the goal. A
    perfect match covers all 8 units. The HUD shows the current unit, the question number, possessions, the score and
    the defenders left.
  - **The stadium:** parallax stands, a crowd that bobs, cheers, groans and does the wave, floodlights, scrolling LED
    boards, goals with rippling nets, pitch lighting and shadows, a camera that follows the play and cuts to cinematic
    close-ups (with letterbox bars) for each duel, running animations, a dribbled ball with real arcs and spin, and
    synthesized sound (crowd, kicks, footsteps, the whistle and every superpower), with a working mute button.
  - **Results:** final score, a rating, accuracy, defenders beaten, the goal, correct and incorrect answers, best
    streak, units covered, XP, and the questions worth another look, with Retry and Play again (a new lineup order and
    a new mix of questions every time). Lessons and the dashboard still link to quiet adaptive review sessions at
    `/practice/session`.
- **Java Sandbox page** for free experimentation, with interactive console input.
- **Final project, chosen at the start.** After the 8 units, the learner builds the project they picked, guided
  stage by stage (4 or 5 stages each). The finished program is the code from the teacher's handout, and each project
  links its YouTube walkthrough video:
  - **Shopping Cart**: menu loop with `switch`, `nextDouble` prices, a running total, 13% tax at checkout
  - **Number Guesser**: two player game with 10 attempts, too high / too low, `while (true)` + `InputMismatchException`
  - **Mini Banking**: balance, deposits and withdrawals with an `else if` chain for bad amounts and insufficient funds
  - **Grade Analyzer**: a `for` loop with `i--` to re-ask bad grades, the average with `printf("%.2f%%")`, letter grades

  Every stage is checked by automated tests and has progressive hints, plus an **"I don't get it"** panel that explains
  the ideas properly and points to the video. After a failed test run, Mr. Lauder suggests the explanation and the video.
  Stages can be done in any order (each one starts with the earlier parts already written), and the project can be
  switched later on the **/project** page without losing saved code.
- **Project warm-up.** Before a project starts, a short, silly 4-question quiz built from the six class sayings
  ("The key to success is consistency.", "Never suffer in silence.", "Everything counts.", "Collaboration, not
  competition.", "Remember to have a wonderful or fantastic weekend.", "If someone is laughing, someone is crying.").
  The saying is always the right answer, word for word, with funny reactions for every choice. It shows once per
  project, can be replayed, and is kept separate from the project and every assessment.

**Gamification**
- XP: +10 per correct answer (+20 for advanced), +5 on a second try, +50 per lesson (+10 if perfect),
  +100 for a unit checkpoint, +20 per practice session, +50 per final stage (+200 on completion).
- 6 levels: Java Rookie → Code Explorer → Loop Learner → Java Builder → Debugger → Java Master.
- Daily streak with a weekly calendar, and a configurable daily XP goal.
- Hearts (optional, 3/5/8 per lesson). Running out never blocks learning: keep going without hearts or restart.
- 18 achievements (First Lesson, 7 Day Streak, First Bug Fixed, Loop Master, Logic Master, Java Apprentice,
  Perfect Lesson, Project Champion…), with progress bars for locked ones.
- Animations for correct/incorrect answers, XP, combos, level-ups, achievements and
  lesson completion; synthesized sound effects (toggleable); reduced-motion support.

**Dashboard & profile**: level and XP progress, streak, lessons done, accuracy, unit progress, topic mastery
bars, strongest/weakest topics, recommended practice, up-next lessons, recent activity, badges, settings
(hearts, daily goal, sound, animations), placement results, keyboard shortcuts, export/import/reset.

---

## Architecture

```
src/
├── java/            In-browser Java sandbox (no dependencies)
│   ├── lexer.ts         tokens, literals, escapes
│   ├── parser.ts        recursive-descent parser → AST (snippets are wrapped in main)
│   ├── checker.ts       static types, javac-style compile errors, definite assignment, reachability
│   ├── interpreter.ts   tree-walking interpreter, exceptions, step-by-step trace recording
│   ├── scanner.ts       faithful java.util.Scanner (nextInt/nextLine pitfalls, hasNextInt…)
│   ├── format.ts        Double.toString + printf/String.format exactly like the JDK
│   └── index.ts         runJava(source, { stdin, interactive, trace }) → RunResult
├── data/            Course content as plain, serialisable data
│   ├── types.ts         content model (units, lessons, teaching cards, 9 question types)
│   ├── units/unit1-8.ts 34 lessons + ~390 questions, written with the j`…` code tag
│   ├── placement.ts     placement test
│   ├── projects.ts      the four final projects (stages, tests, explanations, video links)
│   └── curriculum.ts    indexes and lookups
├── engine/          Pure game & learning logic (no React)
│   ├── session.ts       adaptive session state machine (lessons, checkpoints, practice, placement)
│   ├── grading.ts       grading for every question type
│   ├── codeRunner.ts    runs learner code against tests
│   ├── practice.ts      weak-topic / mistake-driven practice selection
│   ├── stadium.ts       the Practice stadium match: lineup, unit rotation, possessions and scoring
│   ├── progression.ts   lesson states (completed, current, unlocked, skipped, locked), unlock and skip rules, the "next step"
│   ├── stats.ts         accuracy, mastery, weakest / strongest topics
│   ├── achievements.ts  achievement definitions (pure checks over progress)
│   ├── gamification.ts  XP table and levels
│   ├── placement.ts     placement scoring & recommendation
│   └── dates.ts         streak and calendar helpers
├── state/           Persistence and app state
│   ├── types.ts         the Progress document (the one thing a backend would store per user)
│   ├── repository.ts    ProgressRepository interface + LocalStorageRepository (+ cross-tab sync)
│   ├── store.ts         ProgressStore: actions, reward pipeline, events (XP, level-up, achievements)
│   └── hooks.ts         useProgress / useDerived (useSyncExternalStore)
├── components/      Reusable UI
│   ├── Mascot, LearningPath, LessonCard, QuestionCard, questions/*, FeedbackPanel,
│   ├── CodeBlock, CodeEditor, Console, RunnableCode, TraceViewer, ProgressBar,
│   ├── Stats (XPDisplay, StreakDisplay, HeartsDisplay, LevelBadge), AchievementBadge,
│   └── Navbar (AppShell), Modal, Celebrations, SessionPlayer, SessionComplete, TeachCardView
├── pages/           Landing, Onboarding, Placement, Dashboard, Learn, Lesson/Checkpoint,
│                    Practice, Sandbox, Achievements, Profile, Guide, Final, Project
└── lib/             highlighter, friendly error explanations, sound, confetti, unit colours
```

**Data flow.** Content (`data/`) is static. The `engine/` turns content + the learner's `Progress` into
decisions (what to suggest next, which question comes next, what to practice). `state/store.ts` owns the
`Progress` document, applies the reward rules and persists through a `ProgressRepository`. Pages read state
with `useProgress()` and call store actions; the store emits events that drive celebrations.

**Adding a backend.** Implement `ProgressRepository` (`load`, `save`, `clear`, optional `watch`) with
`fetch` calls and pass it to `new ProgressStore(...)` in `state/store.ts`. The whole learner state is one
versioned JSON document (`state/types.ts`) and `migrate()` upgrades older saves. Content could be served the
same way since it is plain data.

### The Java sandbox

The sandbox implements the Java subset taught in the course: all 8 primitive types and `String`,
all operators with Java precedence and integer-overflow semantics, casts, `final`, `if/else`, `switch`
(with fall-through, on `int`, `char` and `String`), `while`, `do-while`, `for`, `break/continue`, `Scanner` (with input simulated exactly like the real class),
`try/catch/finally`, exceptions (`ArithmeticException`, `InputMismatchException`, …), `Math`, `String`
methods, `printf`/`String.format`, and static methods. It reports **real javac-style compile errors**
("variable x might not have been initialized", "possible lossy conversion from double to int",
"unreachable statement"…) and explains them in beginner language.

It is honest about its limits: arrays, objects, generics, arrow-style `switch` cases and switch expressions produce
a clear "not supported in the sandbox yet" message instead of pretending to run. Infinite loops are stopped after 100,000 steps with an
explanation. Programs that read input become interactive: the console asks the learner for each line and the
deterministic program is re-run with the input so far.

### Content quality

`src/data/content.test.ts` runs every question through the sandbox: each "predict the output" answer is
checked by executing the code (and no other option may match), each error-type answer by compiling/running it,
every word-bank decoy must be graded wrong, every coding task's reference solution must pass its tests while the
starter code must fail, and every teaching example must run. `npm run validate:java` goes further and compiles
and runs every program in the course with a real JDK, asserting the sandbox produces identical compile errors,
exceptions and output.

---

## Authoring content

Questions live next to their lessons in `src/data/units/`. A minimal example:

```ts
{
  id: 'u7l1-02',
  type: 'predict-output',
  difficulty: 1,               // 1 beginner, 2 intermediate, 3 advanced
  concept: 'counting',         // used to pick easier follow-ups
  prompt: 'What does this program print?',
  code: j`
int i = 0;
while (i < 3) {
    System.out.println(i);
    i++;
}`,
  optionStyle: 'output',
  options: [
    { text: '0\n1\n2' },
    { text: '1\n2\n3', feedback: 'The counter starts at 0, and it is printed BEFORE it is increased.' },
  ],
  answer: 0,
  explanation: 'i = 0, 1, 2 pass the test i < 3 …',
}
```

Write in a teacher's voice (plain words, "we" and "you", no em dashes and no emojis). Add the id to a lesson's `questions` (or `challenge`), run `npm test`, and the validator will tell you if the
answer doesn't match what Java really does.

---

## Accessibility & UX notes

- Fully keyboard operable: `Enter` checks / continues, `1` to `4` pick answers, `Esc` leaves a lesson,
  `Ctrl+Enter` runs code; the code editor traps `Tab` for indentation until `Esc` is pressed.
- Focus-visible outlines, ARIA roles for progress bars, dialogs, answer groups and live feedback.
- Respects `prefers-reduced-motion`, with an in-app override. Code fonts disable ligatures so `!=` and `==`
  always look like what students type.
- Responsive from 320px phones (bottom tab bar) to wide desktops (sidebar + right rail).

ByteBrew is an original design: its name, mascot, visuals and content are its own, inspired only by the general
idea of gamified language learning.
