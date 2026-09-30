import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Arithmetic Operators ----------------
  ...topic('arithmetic', [
    {
      id: 'a-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'operators',
      prompt: 'What does this program print?',
      code: j`
int x = 9;
int y = 4;
System.out.println(x * y);`,
      optionStyle: 'output',
      options: [
        { text: '36' },
        { text: '13', feedback: '`*` means multiply, not add.' },
        { text: '94', feedback: 'That would be joining text, but x and y are numbers, so they\'re multiplied.' },
        { text: '5' },
      ],
      answer: 0,
      explanation: '`*` is multiplication: 9 × 4 = 36.',
    },
    {
      id: 'a-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'modulo',
      prompt: 'What is the value of `17 % 5`?',
      optionStyle: 'code',
      options: [
        { text: '2' },
        { text: '3', feedback: '3 is `17 / 5`. The `%` operator gives the REMAINDER.' },
        { text: '3.4', feedback: '`%` gives the whole-number remainder, never a decimal like this.' },
        { text: '85', feedback: 'That\'s 17 × 5. `%` is the remainder operator.' },
      ],
      answer: 0,
      explanation: '17 = 5 × 3 + **2**, so the remainder `17 % 5` is 2.',
    },
    {
      id: 'a-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'int-division',
      prompt: 'What does this program print?',
      code: j`System.out.println(7 / 2);`,
      optionStyle: 'output',
      options: [
        { text: '3' },
        { text: '3.5', feedback: 'Both 7 and 2 are ints, so Java does integer division and throws away the .5.' },
        { text: '4', feedback: 'Integer division chops off the decimals: it never rounds up.' },
        { text: '3.0', feedback: 'The result is an int, so no decimal point is printed.' },
      ],
      answer: 0,
      explanation: 'When both sides of `/` are ints, Java does **integer division**: 7 / 2 = 3 (the .5 is discarded).',
    },
    {
      id: 'a-04',
      type: 'true-false',
      difficulty: 1,
      concept: 'int-division',
      prompt: 'In Java, `8 / 3` evaluates to `2`.',
      answer: true,
      wrongFeedback: '8 and 3 are both ints, so the decimal part of 2.66… is thrown away.',
      explanation: '8 / 3 is 2.66… in math, but with two ints Java keeps only the whole part: **2**.',
    },
    {
      id: 'a-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'modulo',
      prompt: 'Type exactly what this program prints.',
      code: j`
int minutes = 135;
int hours = minutes / 60;
int mins = minutes % 60;
System.out.println(hours + "h " + mins + "m");`,
      answer: '2h 15m',
      explanation: '`/` gives the number of whole hours (135 / 60 = 2) and `%` gives the leftover minutes (135 % 60 = 15).',
    },
    {
      id: 'a-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'int-division',
      prompt: 'Fill in the blank so `avg` becomes `3.5`.',
      code: j`
int sum = 7;
double avg = sum / ___;
System.out.println(avg);`,
      blanks: [['2.0', '2d', '2.0d', '(double) 2', '2.']],
      expectedOutput: '3.5',
      hint: 'If both sides of / are ints, the answer is an int. How can you make one side a double?',
      explanation: 'Dividing by the double `2.0` makes Java use decimal division: 7 / 2.0 = 3.5.',
    },
    {
      id: 'a-07',
      type: 'find-bug',
      difficulty: 2,
      concept: 'int-division',
      prompt: 'The average should be `47.5`, but this prints `47.0`. Tap the line that causes it.',
      code: j`
int total = 95;
int count = 2;
double average = total / count;
System.out.println(average);`,
      bugLines: [3],
      bugKind: 'logic',
      fixedCode: j`
int total = 95;
int count = 2;
double average = (double) total / count;
System.out.println(average);`,
      explanation: '`total / count` is integer division (47), and it happens BEFORE the result is stored in the double. Cast one side: `(double) total / count`.',
    },
    {
      id: 'a-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'modulo',
      prompt: 'Type exactly what this program prints.',
      code: j`
int seconds = 3725;
int h = seconds / 3600;
int m = seconds % 3600 / 60;
int s = seconds % 60;
System.out.println(h + ":" + m + ":" + s);`,
      answer: '1:2:5',
      explanation: '3725 / 3600 = 1 hour. 3725 % 3600 = 125 seconds left, and 125 / 60 = 2 minutes. 3725 % 60 = 5 seconds.',
    },

    // ---------------- Lesson 2: Order of Operations ----------------
    {
      id: 'p-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'precedence',
      prompt: 'What does this program print?',
      code: j`System.out.println(10 - 2 * 3);`,
      optionStyle: 'output',
      options: [
        { text: '4' },
        { text: '24', feedback: 'Multiplication happens BEFORE subtraction, so it\'s 10 - 6.' },
        { text: '6' },
        { text: '1' },
      ],
      answer: 0,
      explanation: '`*` has higher precedence than `-`: 2 * 3 = 6 first, then 10 - 6 = 4.',
    },
    {
      id: 'p-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'precedence',
      prompt: 'In `a + b * c - d`, which operator is evaluated **first**?',
      optionStyle: 'code',
      options: [
        { text: '*' },
        { text: '+', feedback: '`+` and `-` wait until multiplication and division are done.' },
        { text: '-', feedback: '`-` has the same (lower) level as `+`.' },
        { text: '=', feedback: 'There\'s no `=` in this expression.' },
      ],
      answer: 0,
      explanation: '`*`, `/` and `%` come before `+` and `-`. So `b * c` is computed first.',
    },
    {
      id: 'p-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'left-to-right',
      prompt: 'What does this program print?',
      code: j`System.out.println(20 / 4 * 5);`,
      optionStyle: 'output',
      options: [
        { text: '25' },
        { text: '1', feedback: '`/` and `*` have the SAME precedence, so Java goes left to right: 20 / 4 first.' },
        { text: '100' },
        { text: '0' },
      ],
      answer: 0,
      explanation: 'Same-level operators run left to right: (20 / 4) * 5 = 5 * 5 = 25.',
    },
    {
      id: 'p-04',
      type: 'type-output',
      difficulty: 2,
      concept: 'precedence',
      prompt: 'Type exactly what this program prints.',
      code: j`System.out.println((8 + 4) / 3 % 3);`,
      answer: '1',
      explanation: 'Parentheses first: 12. Then left to right: 12 / 3 = 4, and 4 % 3 = 1.',
    },
    {
      id: 'p-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'precedence',
      prompt: 'What does this program print?',
      code: j`System.out.println(5 + 3 % 2 * 4);`,
      optionStyle: 'output',
      options: [
        { text: '9' },
        { text: '16', feedback: '`(5 + 3)` would only be first with parentheses. `%` and `*` go before `+`.' },
        { text: '1' },
        { text: '4' },
      ],
      answer: 0,
      explanation: '`%` and `*` first, left to right: 3 % 2 = 1, then 1 * 4 = 4. Finally 5 + 4 = 9.',
    },
    {
      id: 'p-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'parentheses',
      prompt: 'Add parentheses so the program prints `36`.',
      code: j`System.out.println(___2 + 4___ * 6);`,
      blanks: [['('], [')']],
      expectedOutput: '36',
      explanation: 'Without parentheses it would be 2 + 24 = 26. With `(2 + 4) * 6` the addition happens first: 6 * 6 = 36.',
    },
    {
      id: 'p-07',
      type: 'true-false',
      difficulty: 2,
      concept: 'casting',
      prompt: '`(double) 7 / 2` evaluates to `3.5`.',
      answer: true,
      wrongFeedback: 'A cast applies to the value right after it (7), before the division happens.',
      explanation: 'The cast binds tightly: `(double) 7` becomes 7.0, and then 7.0 / 2 = 3.5.',
    },
    {
      id: 'p-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'casting',
      prompt: 'Type exactly what this program prints.',
      code: j`
int a = 7;
int b = 2;
double r1 = a / b;
double r2 = (double) a / b;
double r3 = (double) (a / b);
System.out.println(r1 + " " + r2 + " " + r3);`,
      answer: '3.0 3.5 3.0',
      highlightLines: [3, 4, 5],
      explanation: '`r1`: int division 3 → 3.0. `r2`: 7.0 / 2 = 3.5. `r3`: the parentheses divide first (3), THEN convert → 3.0.',
    },
  ]),

  // ---------------- Lesson 3: Comparisons ----------------
  ...topic('boolean-logic', [
    {
      id: 'cmp-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'comparison',
      prompt: 'What does this program print?',
      code: j`
int x = 7;
System.out.println(x > 5);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: '7 really is greater than 5.' },
        { text: '7' },
        { text: 'x > 5', feedback: 'There are no quotes, so Java evaluates the comparison.' },
      ],
      answer: 0,
      explanation: 'A comparison produces a boolean. 7 > 5 is **true**.',
    },
    {
      id: 'cmp-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'assign-vs-equals',
      prompt: 'Which operator checks whether two ints are **equal**?',
      optionStyle: 'code',
      options: [
        { text: '==' },
        { text: '=', feedback: '`=` assigns (stores) a value. It doesn\'t compare.' },
        { text: '===', feedback: '`===` exists in JavaScript, not in Java.' },
        { text: '!=', feedback: '`!=` means NOT equal.' },
      ],
      answer: 0,
      explanation: '`==` compares; `=` assigns. Mixing them up is one of the most common Java bugs.',
    },
    {
      id: 'cmp-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'comparison',
      prompt: 'The expression `5 <= 5` is `true`.',
      answer: true,
      wrongFeedback: '`<=` means "less than OR equal to", and 5 is equal to 5.',
      explanation: '`<=` is true when the left side is smaller than **or equal to** the right side.',
    },
    {
      id: 'cmp-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'comparison',
      prompt: 'What does this program print?',
      code: j`
int a = 4, b = 9;
System.out.println(a * 2 > b);`,
      optionStyle: 'output',
      options: [
        { text: 'false' },
        { text: 'true', feedback: '`a * 2` is computed first: 8 > 9 is false.' },
        { text: '8' },
        { text: 'Compile error', feedback: 'Arithmetic inside a comparison is fine.' },
      ],
      answer: 0,
      explanation: 'Arithmetic happens before comparison: 4 * 2 = 8, and 8 > 9 is **false**.',
    },
    {
      id: 'cmp-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'assign-vs-equals',
      prompt: 'What is wrong with this code?',
      code: j`
int lives = 3;
boolean gameOver = (lives = 0);`,
      answer: 'syntax',
      feedback: {
        runtime: 'javac catches this before the program runs.',
        logic: 'It doesn\'t compile at all.',
        none: 'Look closely at the operator inside the parentheses.',
      },
      highlightLines: [2],
      explanation: '`lives = 0` is an ASSIGNMENT whose value is the int 0, and an int can\'t be stored in a boolean. To compare, write `lives == 0`.',
    },
    {
      id: 'cmp-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'comparison',
      prompt: 'Make `passed` true when `score` is **60 or more**.',
      code: j`
int score = 72;
boolean passed = score ___ 60;
System.out.println(passed);`,
      blanks: [['>=']],
      bank: ['>=', '>', '==', '=<'],
      explanation: '"60 or more" includes 60 itself, so use `>=`. (`>` would fail a score of exactly 60, and `=<` isn\'t a Java operator.)',
    },
    {
      id: 'cmp-07',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'comparison',
      prompt: 'Given `char grade = \'B\';` which expression is **true**?',
      optionStyle: 'code',
      options: [
        { text: "grade == 'B'" },
        { text: 'grade == "B"', feedback: '"B" is a String; you can\'t compare a char with a String using ==.' },
        { text: "grade = 'B'", feedback: 'That\'s an assignment, not a comparison.' },
        { text: "grade > 'C'", feedback: 'chars compare by their codes: \'B\' (66) is less than \'C\' (67).' },
      ],
      answer: 0,
      explanation: 'chars are compared with `==` against another char in single quotes: `grade == \'B\'` is true.',
    },
    {
      id: 'cmp-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'comparison',
      prompt: 'Type exactly what this program prints.',
      code: j`
int x = 10;
int y = 3;
boolean a = x % y == 1;
boolean b = x / y >= 4;
System.out.println(a + " " + b + " " + (a != b));`,
      answer: 'true false true',
      explanation: '10 % 3 = 1, so `a` is true. 10 / 3 = 3 and 3 >= 4 is false, so `b` is false. true != false is **true**.',
    },

    // ---------------- Lesson 4: Logical Operators ----------------
    {
      id: 'l-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'and',
      prompt: 'What does this program print?',
      code: j`System.out.println(true && false);`,
      optionStyle: 'output',
      options: [
        { text: 'false' },
        { text: 'true', feedback: '`&&` needs BOTH sides to be true.' },
        { text: 'true && false' },
        { text: 'Compile error' },
      ],
      answer: 0,
      explanation: '`&&` (AND) is true only when both sides are true. One side is false, so the result is **false**.',
    },
    {
      id: 'l-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'or',
      prompt: 'What does this program print?',
      code: j`System.out.println(false || true);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: '`||` only needs ONE side to be true.' },
        { text: 'false || true' },
        { text: 'Compile error' },
      ],
      answer: 0,
      explanation: '`||` (OR) is true when at least one side is true.',
    },
    {
      id: 'l-03',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'not',
      prompt: '`!true` evaluates to…',
      optionStyle: 'code',
      options: [
        { text: 'false' },
        { text: 'true', feedback: '`!` flips a boolean to the opposite value.' },
        { text: '0', feedback: 'Java booleans are never numbers.' },
        { text: 'Compile error', feedback: '`!` works on any boolean.' },
      ],
      answer: 0,
      explanation: '`!` (NOT) flips true to false and false to true.',
    },
    {
      id: 'l-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'and',
      prompt: 'What does this program print?',
      code: j`
int temp = 25;
boolean niceDay = temp > 20 && temp < 30;
System.out.println(niceDay);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: 'Check each side: 25 > 20 is true and 25 < 30 is true.' },
        { text: '25' },
        { text: 'Compile error' },
      ],
      answer: 0,
      explanation: 'Both comparisons are true (25 > 20 and 25 < 30), so `&&` gives **true**.',
    },
    {
      id: 'l-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'range',
      prompt: 'What is wrong with this code?',
      code: j`
int x = 5;
boolean inRange = 1 <= x <= 10;`,
      answer: 'syntax',
      feedback: {
        runtime: 'This fails during compilation, not while running.',
        logic: 'It never compiles, so it can\'t produce a wrong answer.',
        none: 'Math allows `1 ≤ x ≤ 10`, but what does Java do with `1 <= x` first?',
      },
      highlightLines: [2],
      explanation: '`1 <= x` becomes a boolean (true), and Java can\'t compare `true <= 10`. Write two comparisons joined with `&&`: `1 <= x && x <= 10`.',
    },
    {
      id: 'l-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'or',
      prompt: 'Make `canEnter` true if the person is a member **OR** has a pass.',
      code: j`
boolean member = false;
boolean hasPass = true;
boolean canEnter = member ___ hasPass;
System.out.println(canEnter);`,
      blanks: [['||']],
      bank: ['||', '&&', '!', '=='],
      explanation: '`||` is true when at least one side is true, which is exactly "member OR has a pass".',
    },
    {
      id: 'l-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'logic-precedence',
      prompt: 'What does this program print?',
      code: j`
boolean a = true, b = false, c = true;
System.out.println(a || b && !c);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: '`&&` is evaluated before `||`, so this means `a || (b && !c)`.' },
        { text: 'Compile error' },
        { text: 'a || b && !c' },
      ],
      answer: 0,
      explanation: 'Order: `!` first, then `&&`, then `||`. `b && !c` = false && false = false. Then `a || false` = **true**.',
    },
    {
      id: 'l-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'logic-precedence',
      prompt: 'Type exactly what this program prints (three lines).',
      code: j`
int x = 8;
boolean p = x % 2 == 0;
boolean q = x > 10;
System.out.println(p && !q);
System.out.println(!(p || q));
System.out.println(p != q);`,
      answer: 'true\nfalse\ntrue',
      explanation: '`p` is true (8 is even) and `q` is false. `p && !q` = true. `p || q` = true, so `!(...)` = false. `p != q` = true.',
    },
  ]),

  // ---------------- Unit 2 checkpoint ----------------
  ...topic('arithmetic', [
    {
      id: 'cp2-01',
      type: 'type-output',
      difficulty: 3,
      concept: 'precedence',
      prompt: 'Type exactly what this program prints.',
      code: j`
int a = 5, b = 3;
System.out.println(a + b * 2 + "" + a % b);`,
      answer: '112',
      explanation: '`b * 2` = 6, then 5 + 6 = 11 (still numbers). `11 + ""` turns it into text "11", and then `a % b` (2) is joined: "112".',
    },
    {
      id: 'cp2-02',
      type: 'predict-output',
      topic: 'boolean-logic',
      difficulty: 2,
      concept: 'or',
      prompt: 'What does this program print?',
      code: j`
double price = 19.99;
int qty = 3;
boolean freeShipping = price * qty >= 50 || qty > 5;
System.out.println(freeShipping);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: 'Only ONE side of `||` needs to be true. Is 19.99 × 3 at least 50?' },
        { text: '59.97' },
        { text: 'Compile error' },
      ],
      answer: 0,
      explanation: '19.99 × 3 = 59.97, which is >= 50, so the left side is true, and `||` only needs one true side.',
    },
    {
      id: 'cp2-03',
      type: 'find-bug',
      topic: 'boolean-logic',
      difficulty: 3,
      concept: 'range',
      prompt: 'This should print whether `n` is between 1 and 100 **inclusive**. For n = 100 it prints `false`. Tap the buggy line.',
      code: j`
int n = 100;
boolean valid = n > 1 && n < 100;
System.out.println(valid);`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
int n = 100;
boolean valid = n >= 1 && n <= 100;
System.out.println(valid);`,
      explanation: 'An inclusive range needs `>=` and `<=`. With `>` and `<`, the edge values 1 and 100 are rejected: a classic off-by-one error.',
    },
    {
      id: 'cp2-04',
      type: 'fill-blank',
      topic: 'boolean-logic',
      difficulty: 3,
      concept: 'logic-precedence',
      prompt: 'A year is a leap year if it\'s divisible by 4 **and** not by 100, **or** if it\'s divisible by 400. Complete the check.',
      code: j`
int year = 2024;
boolean leap = (year % 4 == 0 ___ year % 100 != 0) ___ year % 400 == 0;
System.out.println(leap);`,
      blanks: [['&&'], ['||']],
      bank: ['&&', '||', '!', '=='],
      explanation: 'Inside the parentheses both parts must hold (`&&`). The divisible-by-400 rule is an alternative, so it joins with `||`.',
    },
    {
      id: 'cp2-05',
      type: 'write-code',
      difficulty: 3,
      concept: 'precedence',
      prompt: 'Convert Celsius to Fahrenheit with **f = c × 9 / 5 + 32** and print `f`.',
      starter: j`
double c = 25;
// compute f

// print f
`,
      solution: j`
double c = 25;
double f = c * 9 / 5 + 32;
System.out.println(f);`,
      tests: [
        { label: 'c = 25', output: '77.0' },
        { label: 'c = 100', set: { c: '100' }, output: '212.0' },
        { label: 'c = -40', set: { c: '-40' }, output: '-40.0' },
      ],
      explanation: 'Because `c` is a double, `c * 9 / 5` uses decimal math. For 25: 225 / 5 = 45, plus 32 = 77.0.',
    },
    {
      id: 'cp2-06',
      type: 'true-false',
      difficulty: 3,
      concept: 'int-division',
      prompt: 'In Java, `5 / 2 * 2 == 5` is `true`.',
      answer: false,
      wrongFeedback: 'Evaluate step by step with integer division: what is 5 / 2?',
      explanation: '5 / 2 is 2 (integer division), 2 * 2 = 4, and 4 == 5 is **false**. Integer division loses information!',
    },
  ]),
]

export const unit2: UnitContent = {
  questions,
  unit: {
    id: 'u2',
    number: 2,
    title: 'Expressions',
    tagline: 'Calculate with operators and ask true/false questions.',
    color: 'sky',
    icon: '🧮',
    topics: ['arithmetic', 'boolean-logic'],
    checkpoint: ['cp2-01', 'cp2-02', 'cp2-03', 'cp2-04', 'cp2-05', 'cp2-06'],
    lessons: [
      {
        id: 'u2-l1',
        unitId: 'u2',
        title: 'Arithmetic Operators',
        summary: '+, -, *, / and the mysterious %.',
        topic: 'arithmetic',
        teach: [
          {
            kind: 'concept',
            title: 'Doing math',
            what: 'Java has five arithmetic operators: `+` add, `-` subtract, `*` multiply, `/` divide and `%` **remainder** (also called modulo).',
            why: 'Totals, averages, scores, timers: almost every program calculates something. Operators build new values from old ones.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'All five operators',
            how: 'With two ints, `/` gives only the whole part, and `%` gives what\'s left over.',
            code: j`
int a = 17;
int b = 5;
System.out.println(a + b);
System.out.println(a - b);
System.out.println(a * b);
System.out.println(a / b);
System.out.println(a % b);`,
            notes: [
              { line: 6, text: '17 / 5 is 3, because integer division drops the .4' },
              { line: 7, text: '17 % 5 is 2, the remainder (17 = 5×3 + 2)' },
            ],
          },
          {
            kind: 'mistake',
            title: 'The integer division surprise',
            body: 'If BOTH sides of `/` are ints, the decimals are thrown away, even when you store the result in a double. Make one side a double to keep them.',
            wrong: j`
double avg = 7 / 2;
System.out.println(avg);`,
            right: j`
double avg = 7 / 2.0;
System.out.println(avg);`,
          },
        ],
        questions: ['a-01', 'a-02', 'a-03', 'a-04', 'a-05', 'a-06', 'a-07'],
        challenge: 'a-08',
      },
      {
        id: 'u2-l2',
        unitId: 'u2',
        title: 'Order of Operations',
        summary: 'Precedence, parentheses and casting.',
        topic: 'arithmetic',
        teach: [
          {
            kind: 'concept',
            title: 'Who goes first?',
            what: 'Java follows math rules: `*`, `/` and `%` happen before `+` and `-`. Operators on the same level go **left to right**. Parentheses always go first.',
            why: 'Without a fixed order, `2 + 3 * 4` could mean 20 or 14. Precedence gives every expression exactly one answer.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Precedence in action',
            how: 'Watch how the same numbers give different results.',
            code: j`
System.out.println(2 + 3 * 4);
System.out.println((2 + 3) * 4);
System.out.println(20 / 2 * 5);
System.out.println(10 - 4 - 3);`,
            notes: [
              { line: 1, text: '3 * 4 first → 2 + 12 = 14' },
              { line: 2, text: 'Parentheses first → 5 * 4 = 20' },
              { line: 3, text: 'Same level, left to right → 10 * 5 = 50' },
              { line: 4, text: '(10 - 4) - 3 = 3' },
            ],
          },
          {
            kind: 'tip',
            title: 'Casting',
            body: 'A cast converts a value to another type. It binds tightly to the value right after it:',
            bullets: [
              '`(double) 7 / 2` → 7.0 / 2 → 3.5',
              '`(double) (7 / 2)` → (double) 3 → 3.0',
              '`(int) 3.9` → 3 (casting chops, it doesn\'t round)',
            ],
          },
          {
            kind: 'mistake',
            title: 'Averages without parentheses',
            body: 'Division happens before addition, so you must group the sum yourself.',
            wrong: j`
double avg = 80 + 90 / 2.0;
System.out.println(avg);`,
            right: j`
double avg = (80 + 90) / 2.0;
System.out.println(avg);`,
          },
        ],
        questions: ['p-01', 'p-02', 'p-03', 'p-07', 'p-04', 'p-05', 'p-06'],
        challenge: 'p-08',
      },
      {
        id: 'u2-l3',
        unitId: 'u2',
        title: 'Comparisons',
        summary: '==, !=, <, >, <=, >= and booleans.',
        topic: 'boolean-logic',
        teach: [
          {
            kind: 'concept',
            title: 'True or false?',
            what: 'Comparison operators compare two values and produce a **boolean**: `==` equal, `!=` not equal, `<`, `>`, `<=`, `>=`.',
            why: 'Programs make decisions: Is the password right? Is the score high enough? Comparisons turn those questions into true/false answers.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Comparing values',
            how: 'A comparison can be printed or stored in a boolean variable.',
            code: j`
int age = 16;
System.out.println(age >= 16);
System.out.println(age == 18);
System.out.println(age != 18);
boolean canVote = age >= 18;
System.out.println(canVote);`,
            notes: [
              { line: 2, text: '16 >= 16 → true' },
              { line: 5, text: 'The result of a comparison can be stored in a boolean.' },
            ],
          },
          {
            kind: 'mistake',
            title: '= versus ==',
            body: '`=` STORES a value (assignment). `==` ASKS whether two values are equal (comparison). Using `=` where you meant `==` is a classic bug.',
            wrong: j`
int x = 10;
boolean isTen = (x = 10);`,
            right: j`
int x = 10;
boolean isTen = (x == 10);
System.out.println(isTen);`,
          },
        ],
        questions: ['cmp-01', 'cmp-02', 'cmp-03', 'cmp-04', 'cmp-05', 'cmp-06', 'cmp-07'],
        challenge: 'cmp-08',
      },
      {
        id: 'u2-l4',
        unitId: 'u2',
        title: 'Logical Operators',
        summary: 'Combine conditions with &&, || and !.',
        topic: 'boolean-logic',
        teach: [
          {
            kind: 'concept',
            title: 'Combining conditions',
            what: '`&&` (AND) is true only if **both** sides are true. `||` (OR) is true if **at least one** side is true. `!` (NOT) flips true and false.',
            why: 'Real decisions depend on several things: "You can ride if you\'re tall enough AND have a ticket."',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'AND, OR, NOT',
            how: 'Each side of `&&` / `||` is its own true/false question.',
            code: j`
int age = 15;
boolean hasTicket = true;
System.out.println(age >= 12 && hasTicket);
System.out.println(age < 12 || age > 65);
System.out.println(!hasTicket);`,
            notes: [
              { line: 3, text: 'true && true → true' },
              { line: 4, text: 'false || false → false' },
              { line: 5, text: '!true → false' },
            ],
          },
          {
            kind: 'tip',
            title: 'Order & shortcuts',
            body: 'Logical operators have their own precedence:',
            bullets: [
              '`!` first, then `&&`, then `||`.',
              '`a || b && c` means `a || (b && c)`. Add parentheses when in doubt.',
              'Short-circuit: if the left side of `&&` is false, Java skips the right side (the answer is already false).',
            ],
          },
          {
            kind: 'mistake',
            title: 'Chained comparisons',
            body: 'Math lets you write 1 ≤ x ≤ 10, but Java doesn\'t. Split it into two comparisons joined with `&&`.',
            wrong: j`
int x = 5;
boolean ok = 1 <= x <= 10;`,
            right: j`
int x = 5;
boolean ok = 1 <= x && x <= 10;
System.out.println(ok);`,
          },
        ],
        questions: ['l-01', 'l-02', 'l-03', 'l-04', 'l-05', 'l-06', 'l-07'],
        challenge: 'l-08',
      },
    ],
  },
}
