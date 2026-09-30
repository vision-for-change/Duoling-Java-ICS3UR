import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  ...topic('math', [
    // ---------------- Lesson 1: abs, pow, sqrt ----------------
    {
      id: 'm1-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'abs',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.abs(-12));`,
      optionStyle: 'output',
      options: [
        { text: '12' },
        { text: '-12', feedback: '`abs` gives the distance from zero, which is never negative.' },
        { text: '12.0', feedback: 'abs of an int is an int, so there\'s no decimal point.' },
        { text: '0' },
      ],
      answer: 0,
      explanation: '`Math.abs` returns the absolute value (distance from zero): |-12| = 12.',
    },
    {
      id: 'm1-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'pow',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.pow(3, 2));`,
      optionStyle: 'output',
      options: [
        { text: '9.0' },
        { text: '9', feedback: '`Math.pow` always returns a double, so it prints 9.0.' },
        { text: '6', feedback: 'pow means "to the power of": 3² = 3 × 3.' },
        { text: '8.0', feedback: 'That would be 2³. Here it\'s 3².' },
      ],
      answer: 0,
      explanation: '`Math.pow(3, 2)` is 3² = 9, returned as the double 9.0.',
    },
    {
      id: 'm1-03',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'sqrt',
      prompt: 'Which expression computes the square root of 81?',
      optionStyle: 'code',
      options: [
        { text: 'Math.sqrt(81)' },
        { text: 'Math.pow(81, 2)', feedback: 'That\'s 81 squared (6561).' },
        { text: '81 ^ 0.5', feedback: '`^` isn\'t "power" in Java (it\'s XOR), and this doesn\'t even compile with a double.' },
        { text: 'Math.root(81)', feedback: 'There\'s no Math.root method.' },
      ],
      answer: 0,
      explanation: '`Math.sqrt(x)` returns the square root as a double: `Math.sqrt(81)` is 9.0.',
    },
    {
      id: 'm1-04',
      type: 'true-false',
      difficulty: 2,
      concept: 'pow',
      prompt: 'In Java, `2 ^ 3` equals 8.',
      answer: false,
      wrongFeedback: 'In Java, `^` is the XOR operator, not "to the power of".',
      explanation: '`^` is a bitwise XOR: `2 ^ 3` is 1! For powers, use `Math.pow(2, 3)` (8.0).',
    },
    {
      id: 'm1-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'pow',
      prompt: 'What is wrong with this code?',
      code: j`
int side = 4;
int area = Math.pow(side, 2);`,
      answer: 'syntax',
      feedback: { runtime: 'javac rejects this before it runs.', logic: 'It never compiles.', none: 'What type does Math.pow return?' },
      highlightLines: [2],
      explanation: '`Math.pow` returns a double, which can\'t go into an int without a cast. Use `double area = ...` or `(int) Math.pow(side, 2)`.',
    },
    {
      id: 'm1-06',
      type: 'type-output',
      difficulty: 2,
      concept: 'abs',
      prompt: 'Type exactly what this program prints.',
      code: j`
int a = -5, b = 3;
System.out.println(Math.abs(a) + Math.max(a, b));`,
      answer: '8',
      explanation: '`Math.abs(-5)` = 5 and `Math.max(-5, 3)` = 3. Both are ints, so 5 + 3 = 8.',
    },
    {
      id: 'm1-07',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'sqrt',
      prompt: 'Compute the hypotenuse of a right triangle with legs 3 and 4: c = √(a² + b²).',
      code: j`
double a = 3, b = 4;
double c = Math.___(a * a + b * b);
System.out.println(c);`,
      blanks: [['sqrt']],
      bank: ['sqrt', 'pow', 'abs', 'max'],
      expectedOutput: '5.0',
      explanation: 'a² + b² = 25, and `Math.sqrt(25)` = 5.0.',
    },
    {
      id: 'm1-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'sqrt',
      prompt: 'Type exactly what this program prints (two lines).',
      code: j`
double r = Math.sqrt(Math.pow(6, 2) + Math.pow(8, 2));
System.out.println(r);
System.out.println(Math.max(Math.abs(-3), 2) * r);`,
      answer: '10.0\n30.0',
      explanation: '√(36 + 64) = √100 = 10.0. Then `Math.max(3, 2)` = 3, and 3 × 10.0 = 30.0.',
    },

    // ---------------- Lesson 2: Rounding ----------------
    {
      id: 'r-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'round',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.round(4.5));`,
      optionStyle: 'output',
      options: [
        { text: '5' },
        { text: '4', feedback: '`Math.round` rounds .5 UP.' },
        { text: '5.0', feedback: 'Math.round returns a whole number type (long), so no decimal point.' },
        { text: '4.5' },
      ],
      answer: 0,
      explanation: '`Math.round` rounds to the nearest whole number, and exactly .5 rounds up: 5.',
    },
    {
      id: 'r-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'cast-truncate',
      prompt: 'What does this program print?',
      code: j`System.out.println((int) 9.99);`,
      optionStyle: 'output',
      options: [
        { text: '9' },
        { text: '10', feedback: 'Casting chops off the decimals: it never rounds.' },
        { text: '9.0' },
        { text: '9.99' },
      ],
      answer: 0,
      explanation: 'Casting to `int` simply drops everything after the decimal point: 9.99 → 9.',
    },
    {
      id: 'r-03',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'floor-ceil',
      prompt: 'Which expression gives `3.0` for the value `3.7`?',
      optionStyle: 'code',
      options: [
        { text: 'Math.floor(3.7)' },
        { text: 'Math.ceil(3.7)', feedback: 'ceil rounds UP: 4.0.' },
        { text: 'Math.round(3.7)', feedback: 'round goes to the nearest: 4.' },
        { text: '(int) 3.7', feedback: 'That gives the int 3, not the double 3.0.' },
      ],
      answer: 0,
      explanation: '`Math.floor` rounds DOWN and returns a double: 3.0.',
    },
    {
      id: 'r-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'floor-ceil',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.ceil(2.01));`,
      optionStyle: 'output',
      options: [
        { text: '3.0' },
        { text: '2.0', feedback: 'ceil ("ceiling") always rounds UP, even for 2.01.' },
        { text: '3' },
        { text: '2' },
      ],
      answer: 0,
      explanation: '`Math.ceil` rounds up to the next whole number and returns a double: 3.0.',
    },
    {
      id: 'r-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'round-decimals',
      prompt: 'Type exactly what this program prints.',
      code: j`
double price = 19.987;
System.out.println(Math.round(price * 100) / 100.0);`,
      answer: '19.99',
      explanation: '19.987 × 100 = 1998.7, which rounds to 1999. Then 1999 / 100.0 = 19.99.',
    },
    {
      id: 'r-06',
      type: 'true-false',
      difficulty: 2,
      concept: 'round',
      prompt: '`Math.round(-2.5)` returns `-3`.',
      answer: false,
      wrongFeedback: 'Java rounds .5 toward POSITIVE infinity: up, even for negatives.',
      explanation: 'Math.round rounds halves UP (toward positive infinity), so -2.5 becomes **-2**.',
    },
    {
      id: 'r-07',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'round',
      prompt: 'Round the average to the nearest whole number.',
      code: j`
double avg = 86.6666;
long rounded = Math.___(avg);
System.out.println(rounded);`,
      blanks: [['round']],
      bank: ['round', 'floor', 'ceil', 'abs'],
      expectedOutput: '87',
      explanation: '`Math.round` goes to the nearest whole number (87). For a double it returns a `long`, so use `(int)` if you need an int.',
    },
    {
      id: 'r-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'round',
      prompt: 'Type exactly what this program prints (three lines).',
      code: j`
double a = 2.5;
double b = 3.5;
System.out.println(Math.round(a) + Math.round(b));
System.out.println((int) a + (int) b);
System.out.println(Math.floor(a) + Math.ceil(a));`,
      answer: '7\n5\n5.0',
      explanation: 'round: 3 + 4 = 7. Casting chops: 2 + 3 = 5. floor(2.5) + ceil(2.5) = 2.0 + 3.0 = 5.0 (doubles).',
    },

    // ---------------- Lesson 3: Random Numbers ----------------
    {
      id: 'rn-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'random',
      prompt: 'Which values can `Math.random()` return?',
      options: [
        { text: 'Any double from 0.0 up to, but not including, 1.0' },
        { text: 'Whole numbers from 0 to 10' },
        { text: 'Doubles from 0.0 to 1.0, including 1.0', feedback: '1.0 itself is never returned.' },
        { text: 'Any number at all' },
      ],
      answer: 0,
      explanation: '`Math.random()` returns a double in the range [0.0, 1.0). 0.0 is possible, but 1.0 is not.',
    },
    {
      id: 'rn-02',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'Which expression gives a random whole number from 1 to 6 (a die roll)?',
      optionStyle: 'code',
      options: [
        { text: '(int) (Math.random() * 6) + 1' },
        { text: '(int) (Math.random() * 6)', feedback: 'This gives 0 to 5. Add 1 to shift it.' },
        { text: '(int) Math.random() * 6 + 1', feedback: 'The cast happens first: (int) Math.random() is always 0, so this is always 1!' },
        { text: '(int) (Math.random() * 7)', feedback: 'This gives 0 to 6, but 0 isn\'t a die face.' },
      ],
      answer: 0,
      explanation: '`Math.random() * 6` gives 0.0 to 5.99…, `(int)` makes it 0 to 5, and `+ 1` shifts it to the range 1 to 6.',
    },
    {
      id: 'rn-03',
      type: 'true-false',
      difficulty: 2,
      concept: 'random-range',
      prompt: '`(int) (Math.random() * 10)` can produce the value 10.',
      answer: false,
      wrongFeedback: 'Math.random() is always less than 1.0, so × 10 is always less than 10.',
      explanation: 'The largest possible value is 9.99…, which the cast chops to 9. The range is 0 to 9.',
    },
    {
      id: 'rn-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'cast-precedence',
      prompt: 'What does this program print?',
      code: j`
int x = (int) Math.random() * 100;
System.out.println(x);`,
      optionStyle: 'output',
      options: [
        { text: '0' },
        { text: 'A random number from 0 to 99', feedback: 'The cast applies to Math.random() alone, before the multiplication.' },
        { text: '100' },
        { text: 'A random number from 1 to 100' },
      ],
      answer: 0,
      highlightLines: [1],
      explanation: '`(int) Math.random()` is always 0 (the cast chops 0.xxx to 0), and 0 × 100 = 0. Put the multiplication in parentheses first!',
    },
    {
      id: 'rn-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'Make `card` a random number from 1 to 13.',
      code: j`
int card = (int) (Math.random() * ___) + ___;
System.out.println(card);`,
      blanks: [['13'], ['1']],
      verify: { status: 'ok', random: true },
      explanation: 'There are 13 possible values, starting at 1: `(int) (Math.random() * 13) + 1`.',
    },
    {
      id: 'rn-06',
      type: 'multiple-choice',
      difficulty: 3,
      concept: 'random-range',
      prompt: 'Which expression gives a random whole number from 10 to 20 **inclusive**?',
      optionStyle: 'code',
      options: [
        { text: '(int) (Math.random() * 11) + 10' },
        { text: '(int) (Math.random() * 10) + 10', feedback: 'That gives 10 to 19, which is only 10 possible values.' },
        { text: '(int) (Math.random() * 20) + 10', feedback: 'That gives 10 to 29.' },
        { text: '(int) (Math.random() * 21)', feedback: 'That gives 0 to 20.' },
      ],
      answer: 0,
      explanation: '10 to 20 inclusive is 11 values (count = max - min + 1), starting at 10: `(int) (Math.random() * 11) + 10`.',
    },
    {
      id: 'rn-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'Pretend `Math.random()` returned 0.75. Type exactly what is printed.',
      code: j`
double r = 0.75; // pretend Math.random() returned this
int roll = (int) (r * 6) + 1;
System.out.println(roll);`,
      answer: '5',
      explanation: '0.75 × 6 = 4.5, the cast chops it to 4, and + 1 gives 5.',
    },
    {
      id: 'rn-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'random',
      prompt: 'Simulate 10 coin flips. A flip is heads when `Math.random() < 0.5`. Count the heads and print `Heads: N`.',
      starter: j`
int heads = 0;
// flip a coin 10 times

System.out.println("Heads: " + heads);`,
      solution: j`
int heads = 0;
for (int i = 0; i < 10; i++) {
    if (Math.random() < 0.5) {
        heads++;
    }
}
System.out.println("Heads: " + heads);`,
      tests: [{ label: 'prints a head count from 0 to 10', outputPattern: '^Heads: ([0-9]|10)$' }],
      mustInclude: [
        { pattern: 'Math\\.random\\s*\\(', message: 'Use Math.random() to flip the coin.' },
        { pattern: '(for|while)\\s*\\(', message: 'Use a loop to flip 10 times.' },
      ],
      explanation: 'A loop runs 10 flips; each flip compares `Math.random()` with 0.5 and counts heads. Run it a few times: the count changes!',
    },
  ]),

  // ---------------- Unit 6 checkpoint ----------------
  ...topic('math', [
    {
      id: 'cp6-01',
      type: 'type-output',
      difficulty: 3,
      concept: 'pow',
      prompt: 'Type exactly what this program prints.',
      code: j`
int a = -8;
int b = 3;
System.out.println(Math.abs(a) / b + Math.pow(b, 2));`,
      answer: '11.0',
      explanation: '`Math.abs(-8) / 3` is int division: 8 / 3 = 2. `Math.pow(3, 2)` = 9.0. 2 + 9.0 = 11.0 (a double).',
    },
    {
      id: 'cp6-02',
      type: 'predict-output',
      difficulty: 3,
      concept: 'round',
      prompt: 'What does this program print?',
      code: j`
double x = 2.49;
System.out.println(Math.round(x) + " " + Math.ceil(x) + " " + (int) (x + 0.5));`,
      optionStyle: 'output',
      options: [
        { text: '2 3.0 2' },
        { text: '3 3.0 3', feedback: '2.49 is closer to 2 than to 3.' },
        { text: '2 3 2', feedback: 'Math.ceil returns a double, so it prints 3.0.' },
        { text: '2.0 3.0 2.0' },
      ],
      answer: 0,
      explanation: 'round(2.49) = 2, ceil(2.49) = 3.0, and (int) 2.99 = 2. The "+ 0.5 then cast" trick is another way to round positive numbers.',
    },
    {
      id: 'cp6-03',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'A game needs a random month number from 1 to 12. Which is correct?',
      optionStyle: 'code',
      options: [
        { text: '(int) (Math.random() * 12) + 1' },
        { text: '(int) (Math.random() * 12)', feedback: 'That gives 0 to 11.' },
        { text: '(int) (Math.random() * 13)', feedback: 'That gives 0 to 12, but month 0 doesn\'t exist.' },
        { text: 'Math.random() * 12 + 1', feedback: 'Without the cast you get decimals like 7.42.' },
      ],
      answer: 0,
      explanation: '12 possible values starting at 1: `(int) (Math.random() * 12) + 1`.',
    },
    {
      id: 'cp6-04',
      type: 'write-code',
      difficulty: 3,
      concept: 'sqrt',
      prompt: 'Print the distance between (x1, y1) and (x2, y2), which is √((x2-x1)² + (y2-y1)²), rounded to 2 decimal places with `Math.round`.',
      starter: j`
double x1 = 1, y1 = 2;
double x2 = 4, y2 = 6;
// compute the distance, round it to 2 decimals and print it
`,
      solution: j`
double x1 = 1, y1 = 2;
double x2 = 4, y2 = 6;
double d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
System.out.println(Math.round(d * 100) / 100.0);`,
      tests: [
        { label: '(1,2) to (4,6)', output: '5.0' },
        { label: '(1,2) to (2,3)', set: { x2: '2', y2: '3' }, output: '1.41' },
        { label: '(1,2) to (1,2)', set: { x2: '1', y2: '2' }, output: '0.0' },
      ],
      mustInclude: [{ pattern: 'Math\\.sqrt', message: 'Use Math.sqrt for the square root.' }],
      explanation: '`Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))`, then round to 2 decimals with `Math.round(d * 100) / 100.0`.',
    },
    {
      id: 'cp6-05',
      type: 'find-bug',
      difficulty: 3,
      concept: 'cast-precedence',
      prompt: 'This should print a random number from 1 to 100, but it always prints 1. Tap the buggy line.',
      code: j`
// Random number from 1 to 100
int n = (int) Math.random() * 100 + 1;
System.out.println(n);`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
// Random number from 1 to 100
int n = (int) (Math.random() * 100) + 1;
System.out.println(n);`,
      explanation: 'The cast grabs `Math.random()` alone, turning it into 0. Wrap the multiplication: `(int) (Math.random() * 100) + 1`.',
    },
  ]),
]

export const unit6: UnitContent = {
  questions,
  unit: {
    id: 'u6',
    number: 6,
    title: 'Math in Java',
    tagline: 'Powers, roots, rounding and randomness.',
    color: 'sun',
    icon: 'ruler',
    topics: ['math'],
    checkpoint: ['cp6-01', 'cp6-02', 'cp6-03', 'cp6-04', 'cp6-05'],
    lessons: [
      {
        id: 'u6-l1',
        unitId: 'u6',
        title: 'abs, pow & sqrt',
        summary: 'Java\'s built-in calculator.',
        topic: 'math',
        teach: [
          {
            kind: 'concept',
            title: 'Java\'s calculator',
            what: 'The `Math` class has ready-made methods: `Math.abs(x)` (distance from zero), `Math.pow(a, b)` (a to the power b), `Math.sqrt(x)` (square root), `Math.max(a, b)` and `Math.min(a, b)`.',
            why: 'No need to write your own square root! These methods are tested, fast and always available, with no import needed.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Math methods in action',
            how: 'Notice that `pow` and `sqrt` always give back a double.',
            code: j`
System.out.println(Math.abs(-7));
System.out.println(Math.pow(2, 5));
System.out.println(Math.sqrt(49));
System.out.println(Math.max(3, 9));`,
            notes: [
              { line: 1, text: '|-7| = 7 (an int stays an int)' },
              { line: 2, text: '2⁵ = 32.0 (pow returns a double)' },
              { line: 3, text: '√49 = 7.0' },
              { line: 4, text: 'the bigger of the two: 9' },
            ],
          },
          {
            kind: 'mistake',
            title: 'pow returns a double',
            body: 'Storing `Math.pow(...)` in an int is a compile error. Use a double, or cast if you really want an int.',
            wrong: j`
int side = 4;
int area = Math.pow(side, 2);`,
            right: j`
int side = 4;
double area = Math.pow(side, 2);
System.out.println(area);`,
          },
        ],
        questions: ['m1-01', 'm1-02', 'm1-03', 'm1-04', 'm1-05', 'm1-06', 'm1-07'],
        challenge: 'm1-08',
      },
      {
        id: 'u6-l2',
        unitId: 'u6',
        title: 'Rounding',
        summary: 'round, floor, ceil and casting.',
        topic: 'math',
        teach: [
          {
            kind: 'concept',
            title: 'Four ways to lose decimals',
            what: '`Math.round(x)` goes to the nearest whole number (.5 rounds up). `Math.floor(x)` rounds down, `Math.ceil(x)` rounds up. A cast like `(int) x` simply chops the decimals off.',
            why: 'Money, grades and measurements often need rounding, but each method rounds differently, so pick the right one.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Same number, four results',
            how: 'Compare how each method treats 7.6.',
            code: j`
double x = 7.6;
System.out.println(Math.round(x));
System.out.println(Math.floor(x));
System.out.println(Math.ceil(x));
System.out.println((int) x);`,
            notes: [
              { line: 2, text: 'nearest → 8' },
              { line: 3, text: 'down → 7.0 (a double)' },
              { line: 4, text: 'up → 8.0 (a double)' },
              { line: 5, text: 'chop → 7' },
            ],
          },
          {
            kind: 'tip',
            title: 'Rounding to 2 decimals',
            body: 'Multiply, round, divide: `Math.round(x * 100) / 100.0`. For 3.14159 that gives 3.14. (In Unit 7 you\'ll learn an even easier way with printf.)',
          },
          {
            kind: 'mistake',
            title: 'Dividing by 100 instead of 100.0',
            body: '`Math.round` gives a whole number, so dividing by the int 100 does integer division and loses the decimals again.',
            wrong: j`System.out.println(Math.round(3.14159 * 100) / 100);`,
            right: j`System.out.println(Math.round(3.14159 * 100) / 100.0);`,
          },
        ],
        questions: ['r-01', 'r-02', 'r-03', 'r-04', 'r-06', 'r-05', 'r-07'],
        challenge: 'r-08',
      },
      {
        id: 'u6-l3',
        unitId: 'u6',
        title: 'Random Numbers',
        summary: 'Dice rolls with Math.random().',
        topic: 'math',
        teach: [
          {
            kind: 'concept',
            title: 'Rolling dice in code',
            what: '`Math.random()` returns a random double from 0.0 up to (but not including) 1.0. Multiply, cast and shift it to get the range you need.',
            why: 'Games, simulations and quizzes need unpredictability: dice rolls, shuffled cards, random enemies.',
            mood: 'surprised',
          },
          {
            kind: 'example',
            title: 'A die roll',
            how: 'Run it several times: the numbers change, but always stay in range.',
            code: j`
double r = Math.random();
System.out.println("Raw: " + r);
int die = (int) (Math.random() * 6) + 1;
System.out.println("You rolled " + die);`,
            random: true,
            notes: [
              { line: 1, text: 'Something like 0.4172… (never 1.0)' },
              { line: 3, text: '× 6 → 0.0 to 5.99, (int) → 0 to 5, + 1 → 1 to 6' },
            ],
          },
          {
            kind: 'tip',
            title: 'The range formula',
            body: 'For a whole number from MIN to MAX (inclusive):',
            code: j`int n = (int) (Math.random() * (MAX - MIN + 1)) + MIN;`,
            bullets: ['Die (1 to 6): `(int) (Math.random() * 6) + 1`', 'Coin (0 or 1): `(int) (Math.random() * 2)`'],
          },
          {
            kind: 'mistake',
            title: 'Casting too early',
            body: 'A cast binds to the value right after it. `(int) Math.random()` is always 0!',
            wrong: j`
int die = (int) Math.random() * 6 + 1;
System.out.println(die);`,
            right: j`
int die = (int) (Math.random() * 6) + 1;
System.out.println(die);`,
          },
        ],
        questions: ['rn-01', 'rn-02', 'rn-03', 'rn-07', 'rn-04', 'rn-05', 'rn-06'],
        challenge: 'rn-08',
      },
    ],
  },
}
