import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  ...topic('while-loops', [
    // ---------------- Lesson 1: while Loops ----------------
    {
      id: 'w-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'while',
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
        { text: '1\n2\n3', feedback: 'i starts at 0, and it\'s printed BEFORE it is increased.' },
        { text: '0\n1\n2\n3', feedback: 'When i becomes 3, `3 < 3` is false, so the loop stops before printing it.' },
        { text: '0', feedback: 'The loop repeats while i < 3, so it runs more than once.' },
      ],
      answer: 0,
      explanation: 'i = 0, 1, 2 pass the test `i < 3` and get printed. When i reaches 3 the condition is false and the loop ends.',
    },
    {
      id: 'w-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'while',
      prompt: 'A while loop\'s body might run **zero** times.',
      answer: true,
      wrongFeedback: 'The condition is checked BEFORE the first pass. If it starts out false…',
      explanation: 'while checks its condition first. If it\'s false from the start, the body never runs.',
    },
    {
      id: 'w-03',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'loop-exit',
      prompt: 'What eventually stops the loop `while (n > 0) { ... }`?',
      options: [
        { text: 'Code inside the loop must make `n > 0` false, like `n--`' },
        { text: 'Java stops every loop after 100 passes', feedback: 'Java has no automatic limit: a loop runs as long as its condition is true.' },
        { text: 'The closing brace `}`', feedback: 'The `}` just sends Java back to check the condition again.' },
        { text: 'Nothing, because while loops always stop by themselves', feedback: 'That\'s how infinite loops happen!' },
      ],
      answer: 0,
      explanation: 'A while loop only stops when its condition becomes false, so something in the body must move toward that, like decreasing n.',
    },
    {
      id: 'w-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'while',
      prompt: 'What does this program print?',
      code: j`
int n = 10;
while (n > 0) {
    System.out.print(n + " ");
    n = n - 3;
}`,
      optionStyle: 'output',
      options: [
        { text: '10 7 4 1' },
        { text: '10 7 4 1 -2', feedback: 'After 1, n becomes -2, and -2 > 0 is false, so -2 is never printed.' },
        { text: '10 7 4', feedback: '1 > 0 is still true, so 1 is printed too.' },
        { text: '7 4 1', feedback: 'n is printed before it is decreased.' },
      ],
      answer: 0,
      explanation: 'n goes 10 → 7 → 4 → 1 → -2. Every value > 0 is printed; -2 fails the test.',
    },
    {
      id: 'w-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'while',
      prompt: 'Type exactly what this program prints.',
      code: j`
int count = 0;
int n = 1;
while (n < 50) {
    n = n * 2;
    count++;
}
System.out.println(count + " " + n);`,
      answer: '6 64',
      explanation: 'n doubles: 2, 4, 8, 16, 32, 64. That\'s 6 passes. 64 < 50 is false, so the loop stops with n = 64.',
    },
    {
      id: 'w-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'while',
      prompt: 'Complete the loop so it prints the numbers 1 to 5.',
      code: j`
int i = 1;
while (i ___ 5) {
    System.out.println(i);
    ___;
}`,
      blanks: [['<='], ['i++', '++i', 'i += 1', 'i = i + 1']],
      expectedOutput: '1\n2\n3\n4\n5',
      explanation: '`i <= 5` includes 5, and `i++` moves i forward each pass so the loop can finish.',
    },
    {
      id: 'w-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'infinite-loop',
      prompt: 'This countdown should print 10 down to 1. What kind of problem does it have?',
      code: j`
int i = 10;
while (i > 0) {
    System.out.println(i);
    i++;
}`,
      answer: 'logic',
      feedback: {
        syntax: 'Every line is valid Java, so it compiles fine.',
        runtime: 'It doesn\'t crash with an exception; it just never reaches the end.',
        none: 'Trace i: 10, 11, 12… will `i > 0` ever be false?',
      },
      highlightLines: [4],
      verify: { status: 'timeout' },
      explanation: 'i goes UP (`i++`) while the loop needs it to go down. `i > 0` stays true, so it loops (practically) forever: a logic error. Fix: `i--`.',
    },
    {
      id: 'w-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'while',
      prompt: 'Type exactly what this program prints.',
      code: j`
int x = 6;
int steps = 0;
while (x != 1) {
    if (x % 2 == 0) {
        x = x / 2;
    } else {
        x = 3 * x + 1;
    }
    steps++;
}
System.out.println(steps);`,
      answer: '8',
      explanation: 'x goes 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1. That\'s 8 steps.',
    },

    // ---------------- Lesson 2: Counters & Accumulators ----------------
    {
      id: 'ca-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'increment',
      prompt: 'Which statement adds 1 to `count`?',
      optionStyle: 'code',
      options: [
        { text: 'count++;' },
        { text: 'count + 1;', feedback: 'This calculates a value but never stores it, so Java won\'t even compile it ("not a statement").' },
        { text: 'count =+ 1;', feedback: '`=+ 1` means `= +1`, which SETS count to 1!' },
        { text: '++count++;', feedback: 'You can\'t increment twice like this, so it doesn\'t compile.' },
      ],
      answer: 0,
      explanation: '`count++` is shorthand for `count = count + 1`.',
    },
    {
      id: 'ca-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'compound',
      prompt: 'What does this program print?',
      code: j`
int x = 5;
x += 3;
x -= 1;
System.out.println(x);`,
      optionStyle: 'output',
      options: [
        { text: '7' },
        { text: '5', feedback: '`+=` and `-=` change x and store the result.' },
        { text: '9' },
        { text: '8', feedback: 'Don\'t forget `x -= 1` on line 3.' },
      ],
      answer: 0,
      explanation: '`x += 3` → 8, then `x -= 1` → 7.',
    },
    {
      id: 'ca-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'accumulator',
      prompt: 'What does this program print?',
      code: j`
int total = 0;
int n = 1;
while (n <= 3) {
    total += n * n;
    n++;
}
System.out.println(total);`,
      optionStyle: 'output',
      options: [
        { text: '14' },
        { text: '6', feedback: 'We add n * n (the square), not just n.' },
        { text: '9', feedback: 'That\'s only the last square: total keeps a running sum.' },
        { text: '36' },
      ],
      answer: 0,
      explanation: 'total = 1 + 4 + 9 = 14.',
    },
    {
      id: 'ca-04',
      type: 'true-false',
      difficulty: 2,
      concept: 'compound',
      prompt: '`x =+ 2;` adds 2 to x.',
      answer: false,
      wrongFeedback: 'Read it carefully: `=+` is `=` followed by `+2`.',
      explanation: '`x =+ 2` means `x = +2`, which sets x to 2. The add-and-store operator is `+=`.',
    },
    {
      id: 'ca-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'counter',
      prompt: 'Type exactly what this program prints.',
      code: j`
int lives = 3;
int round = 0;
while (lives > 0) {
    round++;
    if (round % 2 == 0) {
        lives--;
    }
}
System.out.println(round);`,
      answer: '6',
      explanation: 'A life is lost on every even round: rounds 2, 4 and 6. After round 6, lives is 0 and the loop stops.',
    },
    {
      id: 'ca-06',
      type: 'find-bug',
      difficulty: 2,
      concept: 'accumulator',
      prompt: 'This should print 15 (1+2+3+4+5), but it prints 5. Tap the buggy line.',
      code: j`
int i = 1;
int sum = 0;
while (i <= 5) {
    sum = 0;
    sum += i;
    i++;
}
System.out.println(sum);`,
      bugLines: [4],
      bugKind: 'logic',
      fixedCode: j`
int i = 1;
int sum = 0;
while (i <= 5) {
    sum += i;
    i++;
}
System.out.println(sum);`,
      explanation: '`sum = 0` inside the loop wipes the total on every pass. Accumulators are reset once, BEFORE the loop.',
    },
    {
      id: 'ca-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'counter',
      prompt: 'What does this program print?',
      code: j`
int x = 20;
while (x > 5) {
    x -= 4;
}
System.out.println(x);`,
      optionStyle: 'output',
      options: [
        { text: '4' },
        { text: '5', feedback: 'x jumps by 4: it never lands exactly on 5.' },
        { text: '8', feedback: '8 > 5 is still true, so the loop runs one more time.' },
        { text: '0' },
      ],
      answer: 0,
      explanation: 'x: 20 → 16 → 12 → 8 → 4. Now 4 > 5 is false, so the loop stops at 4.',
    },
    {
      id: 'ca-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'accumulator',
      prompt: 'Use a **while** loop to add up the even numbers from 2 to 20 and print the total.',
      starter: j`
int sum = 0;
int n = 2;
// loop while n <= 20: add n to sum, then move to the next even number

System.out.println(sum);`,
      solution: j`
int sum = 0;
int n = 2;
while (n <= 20) {
    sum += n;
    n += 2;
}
System.out.println(sum);`,
      tests: [{ label: 'sum of 2..20 evens', output: '110' }],
      mustInclude: [{ pattern: 'while\\s*\\(', message: 'Use a while loop.' }],
      explanation: 'Add n, then jump by 2: 2 + 4 + … + 20 = 110.',
    },
  ]),

  ...topic('for-loops', [
    // ---------------- Lesson 3: for Loops ----------------
    {
      id: 'f-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'for-count',
      prompt: 'How many times does this loop print "Hi"?',
      code: j`
for (int i = 0; i < 4; i++) {
    System.out.println("Hi");
}`,
      options: [
        { text: '4' },
        { text: '3', feedback: 'Count the values: 0, 1, 2, 3.' },
        { text: '5', feedback: 'i = 4 fails the test `4 < 4`, so there\'s no 5th pass.' },
        { text: 'Forever', feedback: '`i++` moves i toward 4, so it stops.' },
      ],
      answer: 0,
      explanation: 'i takes the values 0, 1, 2 and 3, so there are four passes. Starting at 0 with `< 4` means exactly 4 times.',
    },
    {
      id: 'f-02',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'for-count',
      prompt: 'Fill in the blank so the loop prints the numbers 0 to 4.',
      code: j`
for (int i = 0; i < ___; i++) {
    System.out.println(i);
}`,
      blanks: [['5']],
      expectedOutput: '0\n1\n2\n3\n4',
      explanation: 'The loop must stop before 5: `i < 5` allows 0, 1, 2, 3, 4.',
    },
    {
      id: 'f-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'for',
      prompt: 'What does this program print?',
      code: j`
for (int i = 3; i > 0; i--) {
    System.out.println(i);
}
System.out.println("Liftoff!");`,
      optionStyle: 'output',
      options: [
        { text: '3\n2\n1\nLiftoff!' },
        { text: '3\n2\n1\n0\nLiftoff!', feedback: '0 > 0 is false, so 0 isn\'t printed.' },
        { text: '1\n2\n3\nLiftoff!', feedback: 'i starts at 3 and counts DOWN with i--.' },
        { text: 'Liftoff!' },
      ],
      answer: 0,
      explanation: 'i = 3, 2, 1 pass `i > 0`. Then the loop ends and "Liftoff!" prints.',
    },
    {
      id: 'f-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'for',
      prompt: 'What does this program print?',
      code: j`
for (int i = 0; i <= 10; i += 5) {
    System.out.print(i + " ");
}`,
      optionStyle: 'output',
      options: [
        { text: '0 5 10' },
        { text: '0 5', feedback: '10 <= 10 is true, so 10 is printed too.' },
        { text: '5 10' },
        { text: '0 1 2 3 4 5 6 7 8 9 10', feedback: 'The update is `i += 5`, not `i++`.' },
      ],
      answer: 0,
      explanation: 'i jumps by 5: 0, 5, 10. Then 15 <= 10 is false.',
    },
    {
      id: 'f-05',
      type: 'arrange',
      difficulty: 2,
      concept: 'for',
      prompt: 'Arrange the lines to print the 5 times table: 5, 10, … 50. One line is a decoy!',
      lines: ['for (int i = 1; i <= 10; i++) {', 'int result = 5 * i;', 'System.out.println(result);', '}'],
      distractors: ['for (int i = 1; i < 10; i++) {'],
      expectedOutput: '5\n10\n15\n20\n25\n30\n35\n40\n45\n50',
      explanation: 'i must run from 1 to 10 inclusive (`<=`). The decoy with `< 10` would stop at 45, which is an off-by-one error.',
    },
    {
      id: 'f-06',
      type: 'find-bug',
      difficulty: 2,
      concept: 'off-by-one',
      prompt: 'This should print `1 2 3 4 5` but stops at 4. Tap the buggy line.',
      code: j`
// Print 1 2 3 4 5
for (int i = 1; i < 5; i++) {
    System.out.print(i + " ");
}`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
// Print 1 2 3 4 5
for (int i = 1; i <= 5; i++) {
    System.out.print(i + " ");
}`,
      explanation: '`i < 5` stops before 5. To include 5, use `i <= 5`. This is the famous off-by-one error.',
    },
    {
      id: 'f-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'accumulator',
      prompt: 'Type exactly what this program prints.',
      code: j`
int product = 1;
for (int i = 1; i <= 5; i++) {
    product *= i;
}
System.out.println(product);`,
      answer: '120',
      explanation: 'product = 1 × 2 × 3 × 4 × 5 = 120 (that\'s 5 factorial). Note it starts at 1, not 0!',
    },
    {
      id: 'f-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'for',
      prompt: 'Type exactly what this program prints.',
      code: j`
int count = 0;
for (int i = 1; i <= 20; i++) {
    if (i % 3 == 0) {
        count++;
    }
}
System.out.println("Count: " + count);`,
      answer: 'Count: 6',
      explanation: 'The multiples of 3 from 1 to 20 are 3, 6, 9, 12, 15 and 18. That makes six.',
    },

    // ---------------- Lesson 5: Nested Loops ----------------
    {
      id: 'nl-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'nested-count',
      prompt: 'How many `#` characters does this print?',
      code: j`
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 5; j++) {
        System.out.print("#");
    }
}`,
      options: [
        { text: '15' },
        { text: '8', feedback: 'Nested loops MULTIPLY: the inner loop runs completely for each outer pass.' },
        { text: '5' },
        { text: '3' },
      ],
      answer: 0,
      explanation: 'For each of the 3 outer passes, the inner loop prints 5 times: 3 × 5 = 15.',
    },
    {
      id: 'nl-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'nested',
      prompt: 'What does this program print?',
      code: j`
for (int r = 1; r <= 3; r++) {
    for (int c = 1; c <= r; c++) {
        System.out.print(c);
    }
    System.out.println();
}`,
      optionStyle: 'output',
      options: [
        { text: '1\n12\n123' },
        { text: '1\n22\n333', feedback: 'The inner loop prints `c` (1, 2, 3…), not `r`.' },
        { text: '123\n123\n123', feedback: 'The inner loop stops at `r`, so each row gets longer.' },
        { text: '111\n222\n333' },
      ],
      answer: 0,
      explanation: 'Row r prints the numbers 1 to r, then `println()` starts a new line.',
    },
    {
      id: 'nl-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'nested',
      prompt: 'In a nested loop, the inner loop finishes all its passes before the outer loop moves on.',
      answer: true,
      wrongFeedback: 'Think of a clock: the minute hand goes all the way around for each hour.',
      explanation: 'Each outer pass runs the whole inner loop from start to finish, like minutes within each hour.',
    },
    {
      id: 'nl-04',
      type: 'type-output',
      difficulty: 2,
      concept: 'nested',
      prompt: 'Type exactly what this program prints (two lines).',
      code: j`
for (int i = 1; i <= 2; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print(i * j + " ");
    }
    System.out.println();
}`,
      answer: '1 2 3\n2 4 6',
      explanation: 'Row i = 1 prints 1 2 3; row i = 2 prints 2 4 6. It\'s a mini multiplication table.',
    },
    {
      id: 'nl-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'nested',
      prompt: 'Print a 4 × 4 square of dots.',
      code: j`
for (int row = 0; row < 4; row++) {
    for (int col = 0; col < ___; col++) {
        System.out.print(".");
    }
    System.out.___();
}`,
      blanks: [['4'], ['println']],
      expectedOutput: '....\n....\n....\n....',
      explanation: 'The inner loop prints 4 dots per row, and `println()` ends each row.',
    },
    {
      id: 'nl-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'nested',
      prompt: 'What is wrong with this code?',
      code: j`
for (int i = 0; i < 3; i++) {
    for (int i = 0; i < 3; i++) {
        System.out.print(i);
    }
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'javac stops this before it runs.',
        logic: 'It doesn\'t compile, so it can\'t give wrong output.',
        none: 'Look at the names of the two loop counters.',
      },
      highlightLines: [2],
      explanation: 'The inner loop declares a second `i` while the outer `i` still exists. javac: *variable i is already defined*. Use a different name, like `j`.',
    },
    {
      id: 'nl-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'nested-count',
      prompt: 'What does this program print?',
      code: j`
int count = 0;
for (int i = 0; i < 4; i++) {
    for (int j = i; j < 4; j++) {
        count++;
    }
}
System.out.println(count);`,
      optionStyle: 'output',
      options: [
        { text: '10' },
        { text: '16', feedback: 'The inner loop starts at `j = i`, so it gets shorter each time.' },
        { text: '6' },
        { text: '4' },
      ],
      answer: 0,
      explanation: 'The inner loop runs 4, 3, 2, then 1 times: 4 + 3 + 2 + 1 = 10.',
    },
    {
      id: 'nl-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'nested',
      prompt: 'Use nested for loops to print a right triangle of stars with `rows` rows. For rows = 4:\n```\n*\n**\n***\n****\n```',
      starter: j`
int rows = 4;
// use nested for loops
`,
      solution: j`
int rows = 4;
for (int r = 1; r <= rows; r++) {
    for (int c = 1; c <= r; c++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      tests: [
        { label: 'rows = 4', output: '*\n**\n***\n****' },
        { label: 'rows = 2', set: { rows: '2' }, output: '*\n**' },
      ],
      mustInclude: [{ pattern: 'for[\\s\\S]*for', message: 'Use two for loops, one inside the other.' }],
      explanation: 'The outer loop picks the row; the inner loop prints r stars; `println()` ends the row.',
    },
  ]),

  ...topic('do-while', [
    // ---------------- Lesson 4: do-while & Choosing a Loop ----------------
    {
      id: 'd-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'do-while',
      prompt: 'What does this program print?',
      code: j`
int x = 10;
do {
    System.out.println(x);
    x++;
} while (x < 5);`,
      optionStyle: 'output',
      options: [
        { text: '10' },
        { text: '(nothing)', feedback: 'A do-while runs its body ONCE before checking the condition.' },
        { text: '10\n11' },
        { text: '5' },
      ],
      answer: 0,
      explanation: 'The body runs first (printing 10), THEN the condition `11 < 5` is checked. It\'s false, so it stops.',
    },
    {
      id: 'd-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'do-while',
      prompt: 'A do-while loop always runs its body at least once.',
      answer: true,
      wrongFeedback: 'Look where the condition is written: after the body.',
      explanation: 'The condition is checked at the END of each pass, so the first pass always happens.',
    },
    {
      id: 'd-03',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'choose-loop',
      prompt: 'Which loop fits best: "Show the menu, then repeat while the user hasn\'t chosen Quit"?',
      options: [
        { text: 'do-while' },
        { text: 'for', feedback: 'We don\'t know in advance how many times the menu will be shown.' },
        { text: 'while', feedback: 'It works, but you\'d need to show the menu before the loop as well. do-while fits naturally.' },
        { text: 'No loop needed', feedback: 'The menu repeats, so we need a loop.' },
      ],
      answer: 0,
      explanation: 'The menu must be shown at least once before we know whether to repeat: the exact shape of a do-while.',
    },
    {
      id: 'd-04',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'choose-loop',
      prompt: 'Which loop fits best: "Print the numbers 1 to 100"?',
      options: [
        { text: 'for' },
        { text: 'do-while', feedback: 'It could work, but a counting loop with a known range is what `for` is made for.' },
        { text: 'while', feedback: 'Possible, but `for` keeps the start, test and update in one line.' },
        { text: 'No loop needed', feedback: '100 println statements? No thanks!' },
      ],
      answer: 0,
      explanation: 'When you know exactly how many times to repeat, `for` is the clearest choice.',
    },
    {
      id: 'd-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'do-while',
      prompt: 'What is wrong with this code?',
      code: j`
int n = 0;
do {
    n++;
} while (n < 3)
System.out.println(n);`,
      answer: 'syntax',
      feedback: { runtime: 'It doesn\'t get that far because javac rejects it.', logic: 'It never compiles.', none: 'Look at the end of line 4.' },
      highlightLines: [4],
      explanation: 'A do-while must end with a semicolon after the condition: `} while (n < 3);`',
    },
    {
      id: 'd-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'do-while',
      prompt: 'What does this program print?',
      code: j`
int total = 0;
int k = 5;
do {
    total += k;
    k -= 2;
} while (k > 0);
System.out.println(total);`,
      optionStyle: 'output',
      options: [
        { text: '9' },
        { text: '8', feedback: 'When k is 1, 1 > 0 is true, so there\'s one more pass.' },
        { text: '5' },
        { text: '15' },
      ],
      answer: 0,
      explanation: 'k = 5 → total 5; k = 3 → total 8; k = 1 → total 9; then k = -1 fails the test.',
    },
    {
      id: 'd-07',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'do-while',
      prompt: 'Complete the do-while loop so it prints "Attempt 1" to "Attempt 3".',
      code: j`
int tries = 0;
___ {
    tries++;
    System.out.println("Attempt " + tries);
} ___ (tries < 3);`,
      blanks: [['do'], ['while']],
      expectedOutput: 'Attempt 1\nAttempt 2\nAttempt 3',
      explanation: 'A do-while starts with `do {` and ends with `} while (condition);`.',
    },
    {
      id: 'd-08',
      type: 'predict-output',
      difficulty: 2,
      concept: 'do-while',
      prompt: 'What does this program print?',
      code: j`
int a = 5;
while (a < 5) {
    a++;
}
int b = 5;
do {
    b++;
} while (b < 5);
System.out.println(a + " " + b);`,
      optionStyle: 'output',
      options: [
        { text: '5 6' },
        { text: '5 5', feedback: 'The do-while body runs once before checking, so b becomes 6.' },
        { text: '6 6', feedback: 'The while loop checks first: 5 < 5 is false, so a never changes.' },
        { text: '6 5' },
      ],
      answer: 0,
      explanation: 'The while loop never runs (5 < 5 is false). The do-while runs once, so b becomes 6.',
    },
    {
      id: 'd-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'do-while',
      prompt: 'Type exactly what this program prints.',
      code: j`
int n = 1234;
int digits = 0;
do {
    n = n / 10;
    digits++;
} while (n > 0);
System.out.println(digits);`,
      answer: '4',
      explanation: 'Dividing by 10 removes one digit: 1234 → 123 → 12 → 1 → 0. Four passes = 4 digits. (A do-while also correctly counts 0 as 1 digit!)',
    },
    {
      id: 'd-10',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'choose-loop',
      prompt: 'Which loop can run its body **zero** times?',
      options: [
        { text: 'A while loop whose condition is false at the start' },
        { text: 'A do-while loop whose condition is false at the start', feedback: 'do-while always runs once before it checks.' },
        { text: 'Neither, because every loop runs at least once', feedback: 'while and for check their condition before the first pass.' },
        { text: 'Only an infinite loop' },
      ],
      answer: 0,
      explanation: 'while (and for) check the condition first, so they can skip the body entirely. do-while can\'t.',
    },
  ]),

  // ---------------- Unit 4 checkpoint ----------------
  ...topic('while-loops', [
    {
      id: 'cp4-01',
      type: 'type-output',
      difficulty: 3,
      concept: 'accumulator',
      prompt: 'Type exactly what this program prints.',
      code: j`
int sum = 0;
int i = 10;
while (i > 0) {
    if (i % 3 == 0) {
        sum += i;
    }
    i--;
}
System.out.println(sum);`,
      answer: '18',
      explanation: 'Counting down from 10, the multiples of 3 are 9, 6 and 3. 9 + 6 + 3 = 18.',
    },
    {
      id: 'cp4-02',
      type: 'multiple-choice',
      topic: 'do-while',
      difficulty: 2,
      concept: 'choose-loop',
      prompt: 'A guessing game keeps asking for a guess until the player is right. The player must guess at least once. Which loop fits best?',
      options: [
        { text: 'do-while' },
        { text: 'for', feedback: 'We don\'t know how many guesses it will take.' },
        { text: 'while', feedback: 'It can work, but you\'d have to ask for a first guess before the loop too.' },
        { text: 'No loop', feedback: 'Players rarely guess right on the first try!' },
      ],
      answer: 0,
      explanation: 'Unknown number of repeats + at least one pass = do-while.',
    },
    {
      id: 'cp4-03',
      type: 'find-bug',
      difficulty: 3,
      concept: 'infinite-loop',
      prompt: 'This loop never ends. Tap the line that causes it.',
      code: j`
int n = 1;
while (n != 10) {
    System.out.println(n);
    n += 2;
}`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
int n = 1;
while (n < 10) {
    System.out.println(n);
    n += 2;
}`,
      explanation: 'n takes the odd values 1, 3, 5, 7, 9, 11… and is never exactly 10, so `n != 10` stays true forever. Use `n < 10`.',
    },
    {
      id: 'cp4-04',
      type: 'predict-output',
      topic: 'for-loops',
      difficulty: 3,
      concept: 'nested',
      prompt: 'What does this program print?',
      code: j`
for (int i = 3; i >= 1; i--) {
    for (int j = 0; j < i; j++) {
        System.out.print(i);
    }
    System.out.println();
}`,
      optionStyle: 'output',
      options: [
        { text: '333\n22\n1' },
        { text: '123\n12\n1' },
        { text: '1\n22\n333', feedback: 'The outer loop counts DOWN from 3.' },
        { text: '333\n333\n333' },
      ],
      answer: 0,
      explanation: 'Row i prints the digit i, i times: "333", then "22", then "1".',
    },
    {
      id: 'cp4-05',
      type: 'write-code',
      topic: 'for-loops',
      difficulty: 3,
      concept: 'for',
      prompt: 'Print the multiplication table for `n` from n × 1 to n × 5, one per line, like `3 x 1 = 3`.',
      starter: j`
int n = 3;
// your loop here
`,
      solution: j`
int n = 3;
for (int i = 1; i <= 5; i++) {
    System.out.println(n + " x " + i + " = " + n * i);
}`,
      tests: [
        { label: 'n = 3', output: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15' },
        { label: 'n = 7', set: { n: '7' }, output: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35' },
      ],
      mustInclude: [{ pattern: '(for|while)\\s*\\(', message: 'Use a loop instead of five println lines.' }],
      explanation: 'Loop i from 1 to 5 and build each line: `n + " x " + i + " = " + n * i` (the multiplication happens before the joining).',
    },
    {
      id: 'cp4-06',
      type: 'arrange',
      topic: 'for-loops',
      difficulty: 2,
      concept: 'accumulator',
      prompt: 'Arrange the lines to print the sum of 1 to 5. One line is a decoy!',
      lines: ['int sum = 0;', 'for (int i = 1; i <= 5; i++) {', 'sum += i;', '}', 'System.out.println(sum);'],
      distractors: ['sum = 0;'],
      expectedOutput: '15',
      explanation: 'Create the accumulator BEFORE the loop, add inside, and print after. Resetting `sum = 0` inside would break it.',
    },
  ]),
]

export const unit4: UnitContent = {
  questions,
  unit: {
    id: 'u4',
    number: 4,
    title: 'Loops',
    tagline: 'Repeat work with while, for and do-while.',
    color: 'mint',
    icon: '🔁',
    topics: ['while-loops', 'for-loops', 'do-while'],
    checkpoint: ['cp4-01', 'cp4-02', 'cp4-03', 'cp4-04', 'cp4-05', 'cp4-06'],
    lessons: [
      {
        id: 'u4-l1',
        unitId: 'u4',
        title: 'while Loops',
        summary: 'Repeat while a condition is true.',
        topic: 'while-loops',
        teach: [
          {
            kind: 'concept',
            title: 'Repeat while true',
            what: 'A `while` loop repeats its block **as long as its condition stays true**. Java checks the condition before every pass.',
            why: 'Computers are great at repetition: counting, retrying, processing lists. Loops save you from copying the same line 100 times.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Counting from 0 to 4',
            how: 'Three ingredients: a starting value, a condition, and an update that moves toward the end.',
            code: j`
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}`,
            notes: [
              { line: 1, text: 'Start: i is 0.' },
              { line: 2, text: 'Check i < 5 before every pass.' },
              { line: 3, text: 'Print the current value.' },
              { line: 4, text: 'i++ adds 1. Without it, the loop never ends!' },
            ],
          },
          {
            kind: 'mistake',
            title: 'The infinite loop',
            body: 'If nothing inside the loop changes the condition, it stays true forever. Byte\'s sandbox will stop it for you, but a real program would freeze.',
            wrong: j`
int i = 0;
while (i < 5) {
    System.out.println(i);
}`,
            right: j`
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}`,
          },
        ],
        questions: ['w-01', 'w-02', 'w-03', 'w-04', 'w-06', 'w-05', 'w-07'],
        challenge: 'w-08',
      },
      {
        id: 'u4-l2',
        unitId: 'u4',
        title: 'Counters & Totals',
        summary: 'Count things and add them up.',
        topic: 'while-loops',
        teach: [
          {
            kind: 'concept',
            title: 'Counting and adding up',
            what: 'A **counter** tracks how many times something happens (`count++`). An **accumulator** builds a running total (`sum += x`).',
            why: 'Totals, averages, scores and "how many tries?" all use counters and accumulators.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Adding 1 + 2 + 3 + 4',
            how: 'Start the total at 0 BEFORE the loop, then add to it on every pass.',
            code: j`
int sum = 0;
int i = 1;
while (i <= 4) {
    sum += i;
    i++;
}
System.out.println("Sum: " + sum);`,
            notes: [
              { line: 1, text: 'The accumulator starts at 0.' },
              { line: 4, text: 'sum += i means sum = sum + i.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Shortcut operators',
            body: 'These all change a variable and store the result:',
            bullets: [
              '`x++` → x = x + 1   |   `x--` → x = x - 1',
              '`x += 3` → x = x + 3   |   `x -= 2` → x = x - 2',
              '`x *= 2` → x = x * 2   |   `x /= 2` → x = x / 2',
              'Careful: `x =+ 2` is NOT `+=`. It sets x to 2!',
            ],
          },
          {
            kind: 'mistake',
            title: 'Resetting inside the loop',
            body: 'If the accumulator is reset inside the loop, every pass wipes out the total so far.',
            wrong: j`
int sum = 0;
int i = 1;
while (i <= 3) {
    sum = 0;
    sum += i;
    i++;
}
System.out.println(sum);`,
            right: j`
int sum = 0;
int i = 1;
while (i <= 3) {
    sum += i;
    i++;
}
System.out.println(sum);`,
          },
        ],
        questions: ['ca-01', 'ca-02', 'ca-04', 'ca-03', 'ca-07', 'ca-05', 'ca-06'],
        challenge: 'ca-08',
      },
      {
        id: 'u4-l3',
        unitId: 'u4',
        title: 'for Loops',
        summary: 'Start, condition and update in one line.',
        topic: 'for-loops',
        teach: [
          {
            kind: 'concept',
            title: 'Counting loops',
            what: 'A `for` loop packs a counting loop into one line: **start; condition; update**.',
            why: 'When you know how many times to repeat, a for loop keeps all the counter logic in one place, so it\'s harder to forget the update.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Five laps',
            how: 'The start runs once, the condition is checked before each lap, and the update runs after each lap.',
            code: j`
for (int i = 1; i <= 5; i++) {
    System.out.println("Lap " + i);
}`,
            notes: [{ line: 1, text: 'int i = 1 (once) → check i <= 5 → body → i++ → check again…' }],
          },
          {
            kind: 'mistake',
            title: 'Off-by-one errors',
            body: '`<` versus `<=` changes how many times a loop runs. `for (int i = 1; i < 5; i++)` stops at 4!',
            wrong: j`
for (int i = 1; i < 5; i++) {
    System.out.print(i + " ");
}`,
            right: j`
for (int i = 1; i <= 5; i++) {
    System.out.print(i + " ");
}`,
          },
        ],
        questions: ['f-01', 'f-02', 'f-03', 'f-04', 'f-06', 'f-07', 'f-05'],
        challenge: 'f-08',
      },
      {
        id: 'u4-l4',
        unitId: 'u4',
        title: 'do-while & Choosing a Loop',
        summary: 'Run at least once, and pick the right loop.',
        topic: 'do-while',
        teach: [
          {
            kind: 'concept',
            title: 'Run first, check later',
            what: 'A `do-while` loop runs its body FIRST and checks the condition AFTER. So it always runs **at least once**.',
            why: 'Perfect for menus and "try again?" prompts: you must ask at least once before you know whether to repeat.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Tripling until 20',
            how: 'Notice the condition at the bottom, and the semicolon after it.',
            code: j`
int n = 1;
do {
    System.out.println("n = " + n);
    n *= 3;
} while (n < 20);`,
            notes: [
              { line: 2, text: 'No condition here: the body just starts.' },
              { line: 5, text: 'Checked after each pass. Don\'t forget the ;' },
            ],
          },
          {
            kind: 'tip',
            title: 'Choosing the right loop',
            body: 'Ask yourself how the repetition is controlled:',
            bullets: [
              '**for**: you know how many times (count 1 to 10, 5 laps…).',
              '**while**: repeat until something happens; might be zero times.',
              '**do-while**: must happen at least once (menus, "play again?").',
            ],
          },
          {
            kind: 'mistake',
            title: 'Forgetting the semicolon',
            body: 'A do-while is the only loop that ends with `;` after the condition. Leaving it out is a compile error.',
            wrong: j`
int n = 0;
do {
    n++;
} while (n < 3)`,
            right: j`
int n = 0;
do {
    n++;
} while (n < 3);
System.out.println(n);`,
          },
        ],
        questions: ['d-01', 'd-02', 'd-03', 'd-04', 'd-05', 'd-06', 'd-07', 'd-08', 'd-10'],
        challenge: 'd-09',
      },
      {
        id: 'u4-l5',
        unitId: 'u4',
        title: 'Nested Loops',
        summary: 'Loops inside loops for rows and columns.',
        topic: 'for-loops',
        teach: [
          {
            kind: 'concept',
            title: 'Loops inside loops',
            what: 'A **nested loop** is a loop inside another loop. For every single pass of the outer loop, the inner loop runs **completely**.',
            why: 'Grids, tables, patterns and game boards have rows AND columns. Two loops handle both.',
            mood: 'surprised',
          },
          {
            kind: 'example',
            title: 'A 3 × 4 block of stars',
            how: 'The outer loop picks the row; the inner loop fills that row; `println()` ends it.',
            code: j`
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 4; col++) {
        System.out.print("*");
    }
    System.out.println();
}`,
            notes: [
              { line: 2, text: 'Runs 4 times for EACH row.' },
              { line: 5, text: 'After each row, move to a new line.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Counting passes',
            body: 'Total inner passes = outer passes × inner passes. 3 rows × 4 columns = 12 stars.',
          },
          {
            kind: 'mistake',
            title: 'Reusing the same counter',
            body: 'The inner loop needs its own counter name. Declaring `i` twice doesn\'t compile.',
            wrong: j`
for (int i = 0; i < 3; i++) {
    for (int i = 0; i < 3; i++) {
        System.out.print("*");
    }
}`,
            right: j`
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        System.out.print("*");
    }
}`,
          },
        ],
        questions: ['nl-01', 'nl-03', 'nl-02', 'nl-04', 'nl-05', 'nl-06', 'nl-07'],
        challenge: 'nl-08',
      },
    ],
  },
}
