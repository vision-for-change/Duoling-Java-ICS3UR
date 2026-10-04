# ByteBrew: learn Java one byte at a time

ByteBrew is a gamified, beginner-friendly Java course for high-school students, built around the ICS3UR topic
outline. Learners follow a path of short lessons written the way a teacher would explain them, with **Byte**, a
lion mascot, answer interactive questions with instant feedback, earn XP, keep a daily streak, collect badges and
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
- **Landing page → onboarding → placement test.** New learners pick a daily goal and their experience level.
  The 14-question placement test walks through the course in order, then recommends a starting unit
  ("You seem comfortable with X, but Y could use a little practice"). Earlier units are *placed out* but stay
  open for review.
- **The course**, in the order of the teacher's outline:
  1. **Getting Started**: `class Main`, variables, the 8 primitive types, Strings (and why they are not primitive),
     constants with `final`
  2. **Reading Input**: `Scanner` with `next`, `nextInt` and `nextDouble`
  3. **Math in Java**: the arithmetic operators (integer vs float division, modulus), assignment operators,
     casting, the two jobs of `+`, the Math class and random numbers
  4. **Errors and Debugging**: syntax errors, logic and run-time errors, how to debug
  5. **Formatting with printf**: placeholders, decimals, width and alignment
  6. **Making Decisions**: statements and expressions, relational operators, `if`/`else`, `else if`, nested ifs,
     logical operators and truth tables (AND, OR, NOT, XOR)
  7. **Loops**: `while`, `do-while`, `break` and `continue`, `for`, nested `for`
  8. **Switch and Exceptions**: `switch` (with fall-through), `try`/`catch`, `ArithmeticException`,
     `InputMismatchException` and `Exception e`
- **Learning path** with 8 units and 36 lessons (+ a checkpoint per unit and the Final Challenge), drawn as a
  winding path of nodes with Byte standing next to the current lesson. **Learning is sequential by default:** a new
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
  never reveals the solution immediately: Byte gives targeted feedback for the specific wrong choice, highlights
  the relevant code and offers a second try. After a mistake an **easier follow-up on the same concept** is
  inserted, and a question failed twice comes back later in the lesson.
- **Watch it run:** step through any program with the current line highlighted, a variable table (changed
  values glow) and the output so far.
- **Practice:** smart sessions built from weak topics (accuracy under 80%) and recently missed questions,
  per-topic practice with mastery bars, "fix your mistakes", and unit reviews.
- **Java Sandbox page** for free experimentation, with interactive console input.
- **Final Challenge (Byte's Café Kiosk):** 5 guided stages (constants + printf menu, a do-while order loop with
  `switch`, crash-proof input with `try/catch`, nested-if member discounts, `Math.round` money maths and a formatted receipt),
  each checked by automated tests, with progressive hints. Stages can be done in any order: each one starts
  with the earlier parts already written.

**Gamification**
- XP: +10 per correct answer (+20 for advanced), +5 on a second try, +50 per lesson (+10 if perfect),
  +100 for a unit checkpoint, +20 per practice session, +50 per final stage (+200 on completion).
- 6 levels: Java Rookie → Code Explorer → Loop Learner → Java Builder → Debugger → Java Master.
- Daily streak with a weekly calendar, and a configurable daily XP goal.
- Hearts (optional, 3/5/8 per lesson). Running out never blocks learning: keep going without hearts or restart.
- 18 achievements (First Lesson, 7 Day Streak, First Bug Fixed, Loop Master, Logic Master, Java Apprentice,
  Perfect Lesson, Café Champion…), with progress bars for locked ones.
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
│   ├── units/unit1-8.ts 36 lessons + ~400 questions, written with the j`…` code tag
│   ├── placement.ts     placement test
│   ├── final.ts         Final Challenge stages
│   └── curriculum.ts    indexes and lookups
├── engine/          Pure game & learning logic (no React)
│   ├── session.ts       adaptive session state machine (lessons, checkpoints, practice, placement)
│   ├── grading.ts       grading for every question type
│   ├── codeRunner.ts    runs learner code against tests
│   ├── practice.ts      weak-topic / mistake-driven practice selection
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
│                    Practice, Sandbox, Achievements, Profile, Guide, Final
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
