import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: while loops ----------------
  ...topic('while-loops', [
    {
      id: 'u7l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'condition-first',
      prompt: 'When does a `while` loop check its condition?',
      options: [
        { text: 'Before every pass, including the first one' },
        { text: 'After every pass', feedback: 'That is how the do-while loop works, and we will meet it in the next lesson.' },
        { text: 'Only once, at the very start', feedback: 'It checks again before every single pass.' },
        { text: 'Only when the loop body asks it to', feedback: 'The check is automatic and it happens before every pass.' },
      ],
      answer: 0,
      explanation: 'A `while` loop asks "is the condition still true?" before each pass. If the answer is no, even on the very first check, the body never runs.',
    },
    {
      id: 'u7l1-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'counting',
      prompt: 'What does this program print?',
      code: j`
int i = 1;
while (i <= 3) {
    System.out.println(i);
    i++;
}`,
      optionStyle: 'output',
      options: [
        { text: '1\n2\n3' },
        { text: '1\n2', feedback: 'The condition is `i <= 3`, so when `i` is 3 the loop still runs.' },
        { text: '0\n1\n2', feedback: '`i` starts at 1, and not at 0.' },
        { text: '1\n2\n3\n4', feedback: 'When `i` becomes 4, the condition is false and the loop stops before printing it.' },
      ],
      answer: 0,
      explanation: 'The loop runs while `i` is at most 3. It prints 1, 2 and 3, and then `i` becomes 4, the condition fails, and the loop ends.',
    },
    {
      id: 'u7l1-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'zero-times',
      prompt: 'A `while` loop can run its body zero times.',
      answer: true,
      wrongFeedback: 'It can. The condition is checked first, so if it is false from the start, the body never runs.',
      explanation: 'That is the key difference from the do-while loop. If you start with `int x = 10;` and loop `while (x < 5)`, nothing ever happens.',
    },
    {
      id: 'u7l1-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'trace',
      prompt: 'What does this program print?',
      code: j`
int n = 10;
while (n > 5) {
    n -= 3;
}
System.out.println(n);`,
      optionStyle: 'output',
      options: [
        { text: '4' },
        { text: '7', feedback: 'That is the value after one pass. 7 is still above 5, so the loop goes again.' },
        { text: '5', feedback: 'The loop does not stop at exactly 5. It subtracts 3 each time and checks.' },
        { text: '1', feedback: 'The loop stops as soon as `n` is no longer above 5. That happens earlier.' },
      ],
      answer: 0,
      highlightLines: [3],
      explanation: 'Trace it: n is 10, then 7 (still above 5), then 4 (no longer above 5), so the loop stops and prints 4.',
    },
    {
      id: 'u7l1-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'update',
      prompt: 'Fill in the line that makes the loop count up and eventually stop.',
      code: j`
int i = 0;
while (i < 4) {
    System.out.println(i);
    ___
}`,
      blanks: [['i++;']],
      bank: ['i++;', 'i--;', 'i = 0;', 'break;'],
      expectedOutput: '0\n1\n2\n3',
      explanation: 'Something inside the loop has to move `i` toward the point where the condition becomes false. `i++;` does that by adding one each time.',
    },
    {
      id: 'u7l1-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'zero-times',
      prompt: 'What does this program print?',
      code: j`
int x = 10;
while (x < 5) {
    System.out.println("loop");
}
System.out.println("after");`,
      optionStyle: 'output',
      options: [
        { text: 'after' },
        { text: 'loop\nafter', feedback: 'The condition is checked before the first pass, and 10 is not less than 5.' },
        { text: 'loop', feedback: 'The loop body never runs, and the last line is outside the loop.' },
        { text: '(it runs forever)', feedback: 'The condition is false from the start, so the loop is skipped at once.' },
      ],
      answer: 0,
      explanation: '`x < 5` is false from the very beginning, so the body is skipped entirely and we go straight to the last line.',
    },
    {
      id: 'u7l1-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'infinite',
      prompt: 'This program should count down from 3 and stop. What kind of error does it have?',
      code: j`
int n = 3;
while (n > 0) {
    System.out.println("n is " + n);
}`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it without any complaints.',
        runtime: 'It does not crash. It just never finishes.',
        none: 'Will the loop ever stop? What changes `n`?',
      },
      highlightLines: [2, 3],
      explanation: 'Nothing inside the loop changes `n`, so `n > 0` stays true forever. That is an **infinite loop**, and the sandbox has to stop it. A line like `n--;` is what is missing.',
    },
    {
      id: 'u7l1-08',
      type: 'type-output',
      difficulty: 2,
      concept: 'accumulate',
      prompt: 'Trace the loop and type exactly what this program prints.',
      code: j`
int total = 0;
int i = 1;
while (i <= 4) {
    total += i;
    i++;
}
System.out.println(total);`,
      answer: '10',
      explanation: 'The loop adds 1, then 2, then 3, then 4 into `total`. That makes 10. This running-total pattern shows up everywhere.',
    },
    {
      id: 'u7l1-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'off-by-one',
      prompt: 'This program should print the numbers from 1 to 5, but it stops early. Tap the line with the bug.',
      code: j`
int i = 1;
while (i < 5) {
    System.out.println(i);
    i++;
}`,
      bugLines: [2],
      fixedCode: j`
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}`,
      bugKind: 'logic',
      explanation: 'With `i < 5` the loop stops as soon as `i` reaches 5, so the 5 is never printed. Use `<=`. This kind of mistake is called an **off-by-one error**.',
    },
    {
      id: 'u7l1-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'counting',
      prompt: 'Use a `while` loop to print the numbers from 10 down to 1, each on its own line. Then print `Liftoff!`.',
      starter: j`
int count = 10;
// loop while count is at least 1

System.out.println("Liftoff!");`,
      solution: j`
int count = 10;
while (count >= 1) {
    System.out.println(count);
    count--;
}
System.out.println("Liftoff!");`,
      tests: [{ label: 'countdown', output: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nLiftoff!' }],
      mustInclude: [{ pattern: 'while\\s*\\(', message: 'Use a `while` loop.' }],
      explanation: 'The three parts of a counting loop are: set up the counter, test it in the condition, and change it inside the loop. Here we count down, so the update is `count--`.',
    },
  ]),

  // ---------------- Lesson 2: do-while loops ----------------
  ...topic('do-while', [
    {
      id: 'u7l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'difference',
      prompt: 'How is a `do-while` loop different from a `while` loop?',
      options: [
        { text: 'The body runs first, and the condition is checked afterwards' },
        { text: 'The condition is checked first, and the body runs afterwards', feedback: 'That describes the ordinary `while` loop.' },
        { text: 'It never checks a condition', feedback: 'It does check one. It just does so at the end of each pass.' },
        { text: 'It can only count up', feedback: 'It can do anything a `while` loop can do.' },
      ],
      answer: 0,
      explanation: 'The word `do` comes first, which is a good clue. The body runs, and then Java asks "should I go around again?"',
    },
    {
      id: 'u7l2-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'at-least-once',
      prompt: 'A `do-while` loop always runs its body at least once.',
      answer: true,
      wrongFeedback: 'It does. The condition is only checked after the first pass has finished.',
      explanation: 'That guarantee is the whole point of the `do-while` loop. A menu, for example, has to be shown at least once.',
    },
    {
      id: 'u7l2-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'at-least-once',
      prompt: 'What does this program print?',
      code: j`
int n = 10;
do {
    System.out.println(n);
    n++;
} while (n < 5);`,
      optionStyle: 'output',
      options: [
        { text: '10' },
        { text: '(nothing)', feedback: 'The body runs once before the condition is ever checked.' },
        { text: '10\n11', feedback: 'After the first pass, `n` is 11 and the condition `n < 5` is false.' },
        { text: '(it runs forever)', feedback: '`n` only grows, and the condition is already false after the first pass.' },
      ],
      answer: 0,
      explanation: 'The body prints 10 first. Only then does Java check `11 < 5`, which is false, so the loop stops after a single pass.',
    },
    {
      id: 'u7l2-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'counting',
      prompt: 'What does this program print?',
      code: j`
int i = 1;
do {
    System.out.println(i);
    i++;
} while (i <= 3);`,
      optionStyle: 'output',
      options: [
        { text: '1\n2\n3' },
        { text: '1\n2', feedback: 'When `i` is 3, the condition `i <= 3` is still true, so that pass runs too.' },
        { text: '2\n3', feedback: '`i` is printed before it is increased, so the first thing printed is 1.' },
        { text: '1\n2\n3\n4', feedback: 'After 3 is printed, `i` becomes 4 and the condition is false.' },
      ],
      answer: 0,
      explanation: 'It counts the same way a `while` loop would here. The difference only shows up when the condition is false from the start.',
    },
    {
      id: 'u7l2-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'syntax',
      prompt: 'Fill in the missing symbol that every `do-while` needs at the very end.',
      code: j`
int n = 1;
do {
    System.out.println(n);
    n++;
} while (n <= 3)___`,
      blanks: [[';']],
      bank: [';', '.', ':', ','],
      expectedOutput: '1\n2\n3',
      explanation: 'A `do-while` is one statement, and it ends with a semicolon after the closing bracket of the condition. The ordinary `while` loop does not need one.',
    },
    {
      id: 'u7l2-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'difference',
      prompt: 'What does this program print?',
      code: j`
int x = 10;
while (x < 5) {
    System.out.println("while");
}
do {
    System.out.println("do");
} while (x < 5);`,
      optionStyle: 'output',
      options: [
        { text: 'do' },
        { text: 'while\ndo', feedback: 'The `while` loop checks first, and 10 is not less than 5, so it never runs.' },
        { text: 'while', feedback: 'The `while` loop is skipped, and the `do-while` still gets one pass.' },
        { text: '(nothing)', feedback: 'The `do-while` always gets one pass before it checks.' },
      ],
      answer: 0,
      explanation: 'Same condition, different result. The `while` loop is skipped, but the `do-while` loop still runs its body once.',
    },
    {
      id: 'u7l2-07',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'when-to-use',
      prompt: 'Which situation is the best fit for a `do-while` loop?',
      options: [
        { text: 'Showing a menu, which must appear at least once, and repeating until the user quits' },
        { text: 'Printing the numbers from 1 to 10', feedback: 'A `for` loop is the natural choice for counting a known number of times.' },
        { text: 'Doing something only if a number is positive', feedback: 'That is a plain `if` statement, and no loop is needed.' },
        { text: 'Checking whether a number is even', feedback: 'One `if` does that, and nothing needs to repeat.' },
      ],
      answer: 0,
      explanation: 'When you need to do something once before you can even decide whether to repeat it, `do-while` is perfect. Menus, input checks and "play again?" questions all fit.',
    },
    {
      id: 'u7l2-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'syntax',
      prompt: 'What happens when we try to run this code?',
      code: j`
int n = 1;
do {
    System.out.println(n);
    n++;
} while (n <= 3)`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this before the program runs.',
        logic: 'The program never runs, so it cannot print the wrong thing.',
        none: 'Look at the very last line.',
      },
      highlightLines: [5],
      explanation: 'The `while (...)` at the end of a `do-while` needs a semicolon. Java reports *\';\' expected*.',
    },
    {
      id: 'u7l2-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'Trace the loop and type exactly what this program prints.',
      code: j`
int count = 0;
do {
    count += 2;
} while (count < 7);
System.out.println(count);`,
      answer: '8',
      explanation: 'After each pass `count` is 2, 4, 6, then 8. After the pass that makes it 6, the check `6 < 7` is true, so there is one more pass. After 8, the check fails and the loop ends.',
    },
    {
      id: 'u7l2-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'validation',
      prompt: 'The user types `5` and then `15`. The program should keep asking until the number is **between 1 and 10**, and print `Got 5`. Tap the line with the bug.',
      code: j`
Scanner console = new Scanner(System.in);
int n;
do {
    n = console.nextInt();
} while (n >= 1 && n <= 10);
System.out.println("Got " + n);`,
      stdin: '5\n15\n',
      bugLines: [5],
      fixedCode: j`
Scanner console = new Scanner(System.in);
int n;
do {
    n = console.nextInt();
} while (n < 1 || n > 10);
System.out.println("Got " + n);`,
      bugKind: 'logic',
      explanation: 'The condition says when to **repeat**. The program should repeat while the number is **out** of range, so the condition is `n < 1 || n > 10`. As written, it keeps going for good numbers and stops on a bad one, which is backwards.',
    },
    {
      id: 'u7l2-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'validation',
      prompt: 'Use a `do-while` loop to keep reading whole numbers until the user enters one greater than 0. Then print `Thanks, ` followed by that number.',
      starter: j`
Scanner console = new Scanner(System.in);
int n;
// keep reading until n is greater than 0

System.out.println("Thanks, " + n);`,
      solution: j`
Scanner console = new Scanner(System.in);
int n;
do {
    n = console.nextInt();
} while (n <= 0);
System.out.println("Thanks, " + n);`,
      tests: [
        { label: 'two bad numbers first', stdin: '-5\n0\n8\n', output: 'Thanks, 8' },
        { label: 'good on the first try', stdin: '3\n', output: 'Thanks, 3' },
      ],
      mustInclude: [{ pattern: 'do\\s*\\{', message: 'Use a `do { ... } while (...);` loop.' }],
      explanation: 'The body reads a number, and then the condition says "go again while it is not positive". Since you have to read a number before you can check it, `do-while` is the perfect fit.',
    },
  ]),

  // ---------------- Lesson 3: break and continue ----------------
  ...topic('loop-control', [
    {
      id: 'u7l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'break',
      prompt: 'What does `break` do inside a loop?',
      options: [
        { text: 'It leaves the loop immediately' },
        { text: 'It skips to the next pass of the loop', feedback: 'That is `continue`.' },
        { text: 'It pauses the loop for a moment', feedback: 'There is no pause. The loop is over.' },
        { text: 'It restarts the loop from the beginning', feedback: 'It does not restart. It ends the loop for good.' },
      ],
      answer: 0,
      explanation: '`break` jumps out of the loop at once. The program carries on with whatever comes after the closing brace.',
    },
    {
      id: 'u7l3-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'continue',
      prompt: 'What does `continue` do inside a loop?',
      options: [
        { text: 'It skips the rest of this pass and goes on to the next one' },
        { text: 'It leaves the loop immediately', feedback: 'That is `break`.' },
        { text: 'It stops the whole program', feedback: 'The program keeps running, and so does the loop.' },
        { text: 'It does nothing at all', feedback: 'It really does something. It jumps over the rest of the loop body for this pass.' },
      ],
      answer: 0,
      explanation: '`continue` means "skip the rest of this pass", and the loop moves on to its next pass, where the condition is checked again.',
    },
    {
      id: 'u7l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'break',
      prompt: 'After a `break` runs, the program carries on with the next pass of the loop.',
      answer: false,
      wrongFeedback: 'There is no next pass. `break` ends the loop completely, and the program continues after it.',
      explanation: 'Only `continue` goes on to the next pass. `break` leaves the loop for good.',
    },
    {
      id: 'u7l3-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'break',
      prompt: 'What does this program print?',
      code: j`
int i = 1;
while (i <= 5) {
    if (i == 3) {
        break;
    }
    System.out.println(i);
    i++;
}`,
      optionStyle: 'output',
      options: [
        { text: '1\n2' },
        { text: '1\n2\n3', feedback: 'When `i` is 3, the `break` runs before the `println`, so 3 is never printed.' },
        { text: '1\n2\n4\n5', feedback: 'That would be `continue`. A `break` ends the whole loop.' },
        { text: '1\n2\n3\n4\n5', feedback: 'The `break` stops the loop early.' },
      ],
      answer: 0,
      explanation: 'It prints 1 and 2. When `i` reaches 3, the `if` is true, and `break` ends the loop before anything more is printed.',
    },
    {
      id: 'u7l3-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'continue',
      prompt: 'What does this program print?',
      code: j`
int i = 0;
while (i < 5) {
    i++;
    if (i % 2 == 0) {
        continue;
    }
    System.out.println(i);
}`,
      optionStyle: 'output',
      options: [
        { text: '1\n3\n5' },
        { text: '2\n4', feedback: 'It is the even numbers that get skipped.' },
        { text: '1\n2\n3\n4\n5', feedback: 'The `continue` skips the `println` for the even numbers.' },
        { text: '1\n3', feedback: 'The loop does not stop at 3. It only skips the even ones, so 5 is printed too.' },
      ],
      answer: 0,
      explanation: 'On the passes where `i` is 2 or 4, the `continue` skips the `println`. The odd numbers 1, 3 and 5 are printed as usual.',
    },
    {
      id: 'u7l3-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'break',
      prompt: 'Fill in the keyword so the loop stops when `i` reaches 3.',
      code: j`
int i = 1;
while (i <= 5) {
    if (i == 3) {
        ___;
    }
    System.out.println(i);
    i++;
}`,
      blanks: [['break']],
      bank: ['break', 'continue', 'stop', 'exit'],
      expectedOutput: '1\n2',
      explanation: '`break` ends the loop at once. With `continue`, `i` would never be increased, and the loop would get stuck at 3 forever.',
    },
    {
      id: 'u7l3-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'continue',
      prompt: 'What does this program print?',
      code: j`
int i = 0;
int total = 0;
while (i < 6) {
    i++;
    if (i == 4) {
        continue;
    }
    total += i;
}
System.out.println(total);`,
      optionStyle: 'output',
      options: [
        { text: '17' },
        { text: '21', feedback: 'That would be 1 plus 2 plus 3 plus 4 plus 5 plus 6, but the 4 is skipped.' },
        { text: '6', feedback: 'The loop does not stop at 4. It only skips that one value.' },
        { text: '10', feedback: 'It is not a break, so the loop keeps going after the 4.' },
      ],
      answer: 0,
      explanation: 'The loop adds every value of `i` from 1 to 6 except 4, so that is 1 + 2 + 3 + 5 + 6, which is 17.',
    },
    {
      id: 'u7l3-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'continue-trap',
      prompt: 'This program should print 0, 1, 3 and 4. What kind of error does it have?',
      code: j`
int i = 0;
while (i < 5) {
    if (i == 2) {
        continue;
    }
    System.out.println(i);
    i++;
}`,
      answer: 'logic',
      feedback: {
        syntax: 'The code compiles fine.',
        runtime: 'It does not crash. It just never ends.',
        none: 'What happens when `i` is 2? Does `i++` ever run?',
      },
      highlightLines: [3, 4],
      explanation: 'When `i` is 2, `continue` jumps back to the top, before `i++` can run. So `i` stays 2 forever and the loop never ends. Put the update before the `continue`, or use a `for` loop, which updates for you.',
    },
    {
      id: 'u7l3-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'break',
      prompt: 'Trace the loop and type exactly what this program prints.',
      code: j`
int n = 1;
int sum = 0;
while (true) {
    sum += n;
    if (sum > 10) {
        break;
    }
    n++;
}
System.out.println(n + " " + sum);`,
      answer: '5 15',
      explanation: 'The sum goes 1, 3, 6, 10, and then 15. At 15 the `if` is true, so `break` leaves the loop before `n++` runs again. `n` is 5 and `sum` is 15.',
    },
    {
      id: 'u7l3-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'break-vs-continue',
      prompt: 'This program should print every number from 1 to 10 **except** the multiples of 3. It stops too early. Tap the line with the bug.',
      code: j`
int i = 0;
while (i < 10) {
    i++;
    if (i % 3 == 0) {
        break;
    }
    System.out.println(i);
}`,
      bugLines: [5],
      fixedCode: j`
int i = 0;
while (i < 10) {
    i++;
    if (i % 3 == 0) {
        continue;
    }
    System.out.println(i);
}`,
      bugKind: 'logic',
      explanation: 'The `break` ends the whole loop at the first multiple of 3. To only **skip** those numbers and carry on, we want `continue`.',
    },
    {
      id: 'u7l3-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'break',
      prompt: 'Read whole numbers until the user types `0`. Then print the sum of all the numbers typed (not counting the zero). Use `while (true)` and `break`.',
      starter: j`
Scanner console = new Scanner(System.in);
int sum = 0;
// keep reading until the user types 0

System.out.println(sum);`,
      solution: j`
Scanner console = new Scanner(System.in);
int sum = 0;
while (true) {
    int n = console.nextInt();
    if (n == 0) {
        break;
    }
    sum += n;
}
System.out.println(sum);`,
      tests: [
        { label: 'a few numbers', stdin: '5 3 2 0\n', output: '10' },
        { label: 'zero straight away', stdin: '0\n', output: '0' },
        { label: 'a negative number', stdin: '7 -2 0\n', output: '5' },
      ],
      mustInclude: [{ pattern: 'break\\s*;', message: 'Use `break;` to leave the loop when you read the 0.' }],
      explanation: 'A special value that ends the input, like the 0 here, is called a **sentinel**. `while (true)` loops forever until the `break` stops it.',
    },
  ]),

  // ---------------- Lesson 4: for loops ----------------
  ...topic('for-loops', [
    {
      id: 'u7l4-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'parts',
      prompt: 'What are the three parts inside the brackets of a `for` loop?',
      options: [
        { text: 'The start, the condition and the update' },
        { text: 'The condition, the body and the end', feedback: 'The body goes in the curly braces, not in the brackets.' },
        { text: 'The variable, the type and the name', feedback: 'That describes declaring a variable.' },
        { text: 'The start, the middle and the finish', feedback: 'It is close, but each part has a specific job. One sets up, one tests, and one updates.' },
      ],
      answer: 0,
      explanation: '`for (int i = 0; i < 5; i++)` has the **start** (`int i = 0`), the **condition** (`i < 5`) and the **update** (`i++`). The semicolons separate them.',
    },
    {
      id: 'u7l4-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'counting',
      prompt: 'What does this program print?',
      code: j`
for (int i = 0; i < 3; i++) {
    System.out.println(i);
}`,
      optionStyle: 'output',
      options: [
        { text: '0\n1\n2' },
        { text: '1\n2\n3', feedback: 'The counter starts at 0, not at 1.' },
        { text: '0\n1\n2\n3', feedback: 'The condition is `i < 3`, so when `i` is 3 the loop stops.' },
        { text: '1\n2', feedback: 'The counter starts at 0, and the 0 is printed.' },
      ],
      answer: 0,
      explanation: '`i` starts at 0 and the loop continues while `i < 3`. That means it prints 0, 1 and 2. That is three passes, and the 3 itself is never printed.',
    },
    {
      id: 'u7l4-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'counting',
      prompt: 'In `for (int i = 0; i < 4; i++)`, the loop body runs exactly 4 times.',
      answer: true,
      wrongFeedback: 'It does. `i` takes the values 0, 1, 2 and 3, which makes four passes.',
      explanation: 'Starting at 0 and using `<` with the number of passes is the most common pattern in programming. Count the values: 0, 1, 2, 3.',
    },
    {
      id: 'u7l4-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'condition',
      prompt: 'Fill in the operator so the loop prints the numbers from 1 to 5, including the 5.',
      code: j`
for (int i = 1; i ___ 5; i++) {
    System.out.println(i);
}`,
      blanks: [['<=']],
      bank: ['<=', '<', '>', '=='],
      expectedOutput: '1\n2\n3\n4\n5',
      explanation: 'We need the loop to keep going while `i` is 5 as well, so the condition is `<=`. With a plain `<`, the loop would stop at 4.',
    },
    {
      id: 'u7l4-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'counting-down',
      prompt: 'What does this program print?',
      code: j`
for (int i = 3; i >= 1; i--) {
    System.out.println(i);
}`,
      optionStyle: 'output',
      options: [
        { text: '3\n2\n1' },
        { text: '1\n2\n3', feedback: 'The counter starts at 3 and goes down.' },
        { text: '3\n2', feedback: 'The condition is `i >= 1`, so 1 is printed too.' },
        { text: '3\n2\n1\n0', feedback: 'When `i` becomes 0, the condition is false and the loop stops.' },
      ],
      answer: 0,
      explanation: 'A `for` loop can count down just as well. It starts at 3, subtracts one each time with `i--`, and stops when `i` is no longer at least 1.',
    },
    {
      id: 'u7l4-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'step',
      prompt: 'What does this program print?',
      code: j`
for (int i = 0; i <= 10; i += 5) {
    System.out.println(i);
}`,
      optionStyle: 'output',
      options: [
        { text: '0\n5\n10' },
        { text: '5\n10', feedback: 'The start value is 0, and it is printed first.' },
        { text: '0\n5', feedback: 'The condition is `i <= 10`, so when `i` is 10 the loop still runs.' },
        { text: '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10', feedback: 'The update is `i += 5`, so it jumps by five each time.' },
      ],
      answer: 0,
      explanation: 'The update step is yours to choose. Here `i += 5` jumps in fives, so `i` goes 0, 5 and 10.',
    },
    {
      id: 'u7l4-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'accumulate',
      prompt: 'Type exactly what this program prints.',
      code: j`
int total = 0;
for (int i = 1; i <= 4; i++) {
    total += i;
}
System.out.println(total);`,
      answer: '10',
      explanation: 'The loop adds 1, 2, 3 and 4 into `total`, which makes 10.',
    },
    {
      id: 'u7l4-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'syntax',
      prompt: 'What happens when we try to run this code?',
      code: j`
for (int i = 0, i < 3, i++) {
    System.out.println(i);
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this before the program runs.',
        logic: 'The program never runs, so it cannot print the wrong thing.',
        none: 'Look at the punctuation between the three parts inside the brackets.',
      },
      highlightLines: [1],
      explanation: 'The three parts of a `for` loop are separated by **semicolons**, not commas. Java cannot make sense of the line, and reports an error.',
    },
    {
      id: 'u7l4-09',
      type: 'error-type',
      difficulty: 3,
      concept: 'scope',
      prompt: 'What happens when we try to run this code?',
      code: j`
for (int i = 0; i < 3; i++) {
    System.out.println(i);
}
System.out.println("Last: " + i);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'The program never runs, so it cannot give a wrong answer.',
        none: 'Where was `i` created, and where is it being used?',
      },
      highlightLines: [4],
      explanation: 'The counter `i` only exists inside the `for` loop. After the closing brace, it is gone, and Java reports *cannot find symbol*. Declare the variable before the loop if you need it afterwards.',
    },
    {
      id: 'u7l4-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'off-by-one',
      prompt: 'This program should add up the numbers from 1 to 10, which is 55, but it prints something else. Tap the line with the bug.',
      code: j`
int total = 0;
for (int i = 1; i < 10; i++) {
    total += i;
}
System.out.println(total);`,
      bugLines: [2],
      fixedCode: j`
int total = 0;
for (int i = 1; i <= 10; i++) {
    total += i;
}
System.out.println(total);`,
      bugKind: 'logic',
      explanation: 'With `i < 10`, the loop stops before 10 is added, so the total is 45. Use `i <= 10` when the last value needs to be included.',
    },
    {
      id: 'u7l4-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'accumulate',
      prompt: 'Read a whole number `n`. Use a `for` loop to add up all the numbers from 1 to `n`, and print the total.',
      starter: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
int total = 0;
// add up 1 to n

System.out.println(total);`,
      solution: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
int total = 0;
for (int i = 1; i <= n; i++) {
    total += i;
}
System.out.println(total);`,
      tests: [
        { label: 'n is 10', stdin: '10\n', output: '55' },
        { label: 'n is 1', stdin: '1\n', output: '1' },
        { label: 'n is 100', stdin: '100\n', output: '5050' },
      ],
      mustInclude: [{ pattern: 'for\\s*\\(', message: 'Use a `for` loop.' }],
      explanation: 'The running total starts at 0 before the loop. Each pass adds the current number to it, and `i <= n` makes sure that `n` itself is included.',
    },
  ]),

  // ---------------- Lesson 5: nested for loops ----------------
  ...topic('for-loops', [
    {
      id: 'u7l5-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'passes',
      prompt: 'How many times does the inner body run in total?',
      code: j`
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        System.out.print("x");
    }
}`,
      options: [
        { text: '12' },
        { text: '7', feedback: 'That is 3 plus 4. For each of the 3 outer passes, the inner loop runs all 4 times.' },
        { text: '3', feedback: 'That is only the outer loop. The inner loop runs 4 times on every one of those passes.' },
        { text: '4', feedback: 'That is only the inner loop. It happens again on every outer pass.' },
      ],
      answer: 0,
      explanation: 'Multiply the two counts. The outer loop runs 3 times, and each time the inner loop runs 4 times, so we get 3 times 4, which is 12.',
    },
    {
      id: 'u7l5-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'rows',
      prompt: 'What does this program print?',
      code: j`
for (int r = 1; r <= 2; r++) {
    for (int c = 1; c <= 3; c++) {
        System.out.print("x");
    }
    System.out.println();
}`,
      optionStyle: 'output',
      options: [
        { text: 'xxx\nxxx' },
        { text: 'xxxxxx', feedback: 'The empty `println` after the inner loop moves to a new line after every row.' },
        { text: 'xx\nxx\nxx', feedback: 'It is 2 rows of 3, not 3 rows of 2. The outer loop counts rows, and the inner loop counts the columns.' },
        { text: 'x\nx\nx\nx\nx\nx', feedback: 'The inner loop uses `print`, which keeps the stars on one line.' },
      ],
      answer: 0,
      explanation: 'The outer loop makes two rows. For each row, the inner loop prints three stars on one line, and then `println()` ends that row.',
    },
    {
      id: 'u7l5-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'passes',
      prompt: 'In nested loops, the inner loop runs all the way through on every single pass of the outer loop.',
      answer: true,
      wrongFeedback: 'It does. Think of a clock. The minute hand goes all the way round for every single step of the hour hand.',
      explanation: 'That is why the total number of passes is the outer count times the inner count.',
    },
    {
      id: 'u7l5-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'triangle',
      prompt: 'What does this program print?',
      code: j`
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      optionStyle: 'output',
      options: [
        { text: '*\n**\n***' },
        { text: '***\n***\n***', feedback: 'The inner loop depends on `row`, so each row gets longer.' },
        { text: '***\n**\n*', feedback: 'The rows get longer as `row` grows. They do not get shorter.' },
        { text: '*\n*\n*', feedback: 'The inner loop runs `row` times, so the later rows have more stars.' },
      ],
      answer: 0,
      explanation: 'The inner loop runs as many times as the current `row` number. Row 1 gets one star, row 2 gets two, and row 3 gets three.',
    },
    {
      id: 'u7l5-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'rows',
      prompt: 'Fill in the method that ends each row, so there are two lines of two stars.',
      code: j`
for (int r = 1; r <= 2; r++) {
    for (int c = 1; c <= 2; c++) {
        System.out.print("*");
    }
    System.out.___();
}`,
      blanks: [['println']],
      bank: ['println', 'print', 'printf', 'printn'],
      expectedOutput: '**\n**',
      explanation: 'An empty `println()` just moves to the next line. It runs after the inner loop finishes, once for each row.',
    },
    {
      id: 'u7l5-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'table',
      prompt: 'What does this program print?',
      code: j`
for (int i = 1; i <= 2; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print(i * j);
    }
    System.out.println();
}`,
      optionStyle: 'output',
      options: [
        { text: '123\n246' },
        { text: '123\n123', feedback: 'The numbers are `i * j`, so the second row is multiplied by 2.' },
        { text: '12\n24\n36', feedback: 'There are two rows of three, and not three rows of two.' },
        { text: '6\n12', feedback: 'Nothing is added up. Each product is printed on its own, side by side.' },
      ],
      answer: 0,
      explanation: 'Row 1 prints 1 times 1, 2 and 3, which makes 123. Row 2 prints 2 times 1, 2 and 3, which makes 246. This is the beginning of a multiplication table.',
    },
    {
      id: 'u7l5-07',
      type: 'type-output',
      difficulty: 3,
      concept: 'passes',
      prompt: 'Type exactly what this program prints.',
      code: j`
int count = 0;
for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 3; j++) {
        count++;
    }
}
System.out.println(count);`,
      answer: '12',
      explanation: 'The inner `count++` runs 3 times for each of the 4 outer passes, so `count` ends at 12.',
    },
    {
      id: 'u7l5-08',
      type: 'predict-output',
      difficulty: 3,
      concept: 'triangle',
      prompt: 'What does this program print?',
      code: j`
for (int row = 3; row >= 1; row--) {
    for (int col = 1; col <= row; col++) {
        System.out.print(col);
    }
    System.out.println();
}`,
      optionStyle: 'output',
      options: [
        { text: '123\n12\n1' },
        { text: '1\n12\n123', feedback: 'The outer loop counts down from 3, so the long row comes first.' },
        { text: '333\n22\n1', feedback: 'The inner loop prints `col`, the column number, and not the row number.' },
        { text: '321\n21\n1', feedback: 'The columns count up from 1, so each row starts with 1.' },
      ],
      answer: 0,
      explanation: 'The outer loop starts at row 3, so the first row has three columns. Then `row` becomes 2 and then 1. Each row prints the column numbers 1, 2, 3 and so on.',
    },
    {
      id: 'u7l5-09',
      type: 'error-type',
      difficulty: 2,
      concept: 'rows',
      prompt: 'This program should print 2 rows of 3 stars. What kind of error does it have?',
      code: j`
for (int r = 1; r <= 2; r++) {
    for (int c = 1; c <= 3; c++) {
        System.out.println("*");
    }
}`,
      answer: 'logic',
      feedback: {
        syntax: 'It compiles fine.',
        runtime: 'It does not crash. It runs to the end.',
        none: 'Look at what it prints. Are the stars in rows?',
      },
      highlightLines: [3],
      explanation: 'The `println` inside the inner loop moves to a new line after every star, so all 6 stars end up in a single column. We want `print` inside the inner loop, and a `println()` after it.',
    },
    {
      id: 'u7l5-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'variables',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
for (int i = 1; i <= 3; i++) {
    for (int i = 1; i <= 3; i++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      bugLines: [2],
      fixedCode: j`
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      bugKind: 'syntax',
      explanation: 'The inner loop reuses the name `i`, but that name is already in use by the outer loop. Each loop needs its own counter, and programmers usually pick `i` and then `j`.',
    },
    {
      id: 'u7l5-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'rows',
      prompt: 'Use nested `for` loops to print a rectangle of `#` characters with 4 rows and 5 columns.',
      starter: j`
// print 4 rows of 5 # characters
`,
      solution: j`
for (int row = 1; row <= 4; row++) {
    for (int col = 1; col <= 5; col++) {
        System.out.print("#");
    }
    System.out.println();
}`,
      tests: [{ label: 'a 4 by 5 rectangle', output: '#####\n#####\n#####\n#####' }],
      mustInclude: [{ pattern: 'for\\s*\\([^]*for\\s*\\(', message: 'Put one `for` loop inside another.' }],
      explanation: 'The outer loop makes the rows, and the inner loop makes the columns in each row. The `println()` at the end of each row is what turns it into a rectangle.',
    },
  ]),

  // ---------------- Unit 7 checkpoint ----------------
  ...topic('while-loops', [
    {
      id: 'u7cp-01',
      type: 'predict-output',
      difficulty: 2,
      concept: 'trace',
      prompt: 'What does this program print?',
      code: j`
int n = 20;
int steps = 0;
while (n > 1) {
    n /= 2;
    steps++;
}
System.out.println(steps);`,
      optionStyle: 'output',
      options: [
        { text: '4' },
        { text: '5', feedback: 'Trace it carefully. 20, 10, 5, 2, 1. That is four halvings, because integer division drops the remainder.' },
        { text: '10', feedback: 'That is the value after the first halving, and not the number of steps.' },
        { text: '3', feedback: 'Count again. The loop runs until `n` reaches 1, and there are four halvings.' },
      ],
      answer: 0,
      explanation: 'The values of `n` go 20, 10, 5, 2, 1. That takes four passes, so `steps` ends up as 4. Remember that integer division throws away the remainder, so 5 / 2 is 2.',
    },
  ]),
  ...topic('do-while', [
    {
      id: 'u7cp-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'at-least-once',
      prompt: 'What does this program print?',
      code: j`
int k = 5;
do {
    k *= 2;
} while (k < 5);
System.out.println(k);`,
      optionStyle: 'output',
      options: [
        { text: '10' },
        { text: '5', feedback: 'The body runs once before the condition is checked.' },
        { text: '20', feedback: 'After the first pass `k` is 10, and 10 is not less than 5, so there is no second pass.' },
        { text: '(it runs forever)', feedback: 'The condition is false after the first pass.' },
      ],
      answer: 0,
      explanation: 'A `do-while` always runs once, so `k` becomes 10. Then the condition `10 < 5` is false and the loop stops.',
    },
  ]),
  ...topic('loop-control', [
    {
      id: 'u7cp-03',
      type: 'predict-output',
      difficulty: 3,
      concept: 'break-and-continue',
      prompt: 'What does this program print?',
      code: j`
int total = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;
    }
    if (i > 7) {
        break;
    }
    total += i;
}
System.out.println(total);`,
      optionStyle: 'output',
      options: [
        { text: '16' },
        { text: '25', feedback: 'That would be all the odd numbers up to 9. The `break` stops the loop before 9 is added.' },
        { text: '28', feedback: 'That is every number up to 7. The even numbers are skipped.' },
        { text: '9', feedback: 'The loop keeps going past 5, until it reaches a number larger than 7.' },
      ],
      answer: 0,
      explanation: 'The even numbers are skipped with `continue`. That leaves 1, 3, 5 and 7, which are added. At 9 the `break` ends the loop. So the total is 1 + 3 + 5 + 7, which is 16.',
    },
  ]),
  ...topic('for-loops', [
    {
      id: 'u7cp-04',
      type: 'error-type',
      difficulty: 2,
      concept: 'off-by-one',
      prompt: 'This program should print 55, the sum of 1 to 10. What kind of error does it have?',
      code: j`
int sum = 0;
for (int i = 1; i < 10; i++) {
    sum += i;
}
System.out.println(sum);`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it without any complaints.',
        runtime: 'Nothing crashes. It runs to the end.',
        none: 'It should print 55. What does it really print?',
      },
      highlightLines: [2],
      explanation: 'The loop stops before it adds 10, so it prints 45. It is an off-by-one error, and the condition should be `i <= 10`.',
    },
  ]),
  ...topic('while-loops', [
    {
      id: 'u7cp-05',
      type: 'find-bug',
      difficulty: 3,
      concept: 'infinite',
      prompt: 'This program should print 5, 4, 3, 2, 1 and then stop, but it never ends. Tap the line that is missing something.',
      code: j`
int n = 5;
while (n > 0) {
    System.out.println(n);
}`,
      bugLines: [2, 3],
      fixedCode: j`
int n = 5;
while (n > 0) {
    System.out.println(n);
    n--;
}`,
      bugKind: 'logic',
      explanation: 'Nothing in the loop changes `n`, so the condition `n > 0` is always true. We need `n--;` inside the loop so it moves toward stopping.',
    },
  ]),
  ...topic('for-loops', [
    {
      id: 'u7cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'counting',
      prompt: 'Read a whole number `n`. Print the numbers from 1 to `n` on one line, separated by commas, like `1,2,3,4,5`. There must be no comma after the last number.',
      starter: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
// print 1,2,3,... up to n
System.out.println();`,
      solution: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
for (int i = 1; i <= n; i++) {
    System.out.print(i);
    if (i < n) {
        System.out.print(",");
    }
}
System.out.println();`,
      tests: [
        { label: 'n is 5', stdin: '5\n', output: '1,2,3,4,5' },
        { label: 'n is 1', stdin: '1\n', output: '1' },
      ],
      mustInclude: [{ pattern: 'for\\s*\\(', message: 'Use a `for` loop.' }],
      explanation: 'Print the number every time, but only print the comma when this is not the last number. That is a loop and an `if` working together.',
    },
  ]),
]

export const unit7: UnitContent = {
  questions,
  unit: {
    id: 'u7',
    number: 7,
    title: 'Loops',
    tagline: 'Make the computer repeat things, so you do not have to.',
    color: 'sun',
    icon: 'repeat',
    topics: ['while-loops', 'do-while', 'loop-control', 'for-loops'],
    checkpoint: ['u7cp-01', 'u7cp-02', 'u7cp-03', 'u7cp-04', 'u7cp-05', 'u7cp-06'],
    lessons: [
      {
        id: 'u7-l1',
        unitId: 'u7',
        title: 'while Loops',
        summary: 'Repeat while a condition is true.',
        topic: 'while-loops',
        teach: [
          {
            kind: 'concept',
            title: 'Doing something again and again',
            what: 'A **loop** repeats a block of code. A `while` loop checks its condition **before every pass**. While the condition is true, the body runs again. When the condition turns false, the loop ends and the program moves on. Something inside the loop has to push the condition toward false, or the loop will never end.',
            why: 'Computers are brilliant at repetition. Counting, adding up a list, asking again until the answer is valid: loops let you write the instruction once and have it done a hundred times.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Counting to five',
            how: 'A counting loop has three parts. We set up the counter before the loop, we test it in the condition, and we change it inside the body.',
            code: j`
int count = 1;
while (count <= 5) {
    System.out.println("Pass number " + count);
    count++;
}
System.out.println("Done!");`,
            notes: [
              { line: 1, text: 'Set up the counter before the loop.' },
              { line: 2, text: 'Test the condition. Is count still 5 or less?' },
              { line: 4, text: 'Update the counter, or the loop would never stop.' },
              { line: 6, text: 'After the loop. This runs once, when the condition has become false.' },
            ],
          },
          {
            kind: 'tip',
            title: 'The three parts of a counting loop',
            body: 'When you write a `while` loop, I want you to check for three things every time:',
            bullets: [
              '**Set up:** is the variable created and given a starting value before the loop?',
              '**Test:** will the condition be false at some point?',
              '**Update:** does something inside the body move the variable toward that point?',
              'If a loop never ends, nine times out of ten the update is missing.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The loop that never ends',
            body: 'This loop never changes `n`, so `n > 0` stays true forever. That is called an **infinite loop**, and Mr. Lauder\'s sandbox stops it for you. A real program would just freeze.',
            wrong: j`
int n = 3;
while (n > 0) {
    System.out.println("n is " + n);
}`,
            right: j`
int n = 3;
while (n > 0) {
    System.out.println("n is " + n);
    n--;
}`,
          },
        ],
        questions: ['u7l1-01', 'u7l1-02', 'u7l1-03', 'u7l1-04', 'u7l1-05', 'u7l1-06', 'u7l1-07', 'u7l1-08', 'u7l1-09'],
        challenge: 'u7l1-10',
      },
      {
        id: 'u7-l2',
        unitId: 'u7',
        title: 'do-while Loops',
        summary: 'Run first, then check.',
        topic: 'do-while',
        teach: [
          {
            kind: 'concept',
            title: 'Do it first, ask questions later',
            what: 'A `do-while` loop is a `while` loop turned upside down. The body runs **first**, and the condition is checked **afterwards**. That means the body always runs at least once, even if the condition is false from the start.',
            why: 'Some jobs have to happen once before you can even decide whether to repeat them. Showing a menu, reading a number to check it, and asking "play again?" all work this way.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Asking until the answer is good',
            how: 'The user has to type a number before we can judge it. So the body reads the number, and the condition at the bottom decides whether to ask again.',
            code: j`
Scanner console = new Scanner(System.in);
int number;
do {
    System.out.print("Enter a number from 1 to 10: ");
    number = console.nextInt();
} while (number < 1 || number > 10);
System.out.println("You entered " + number);`,
            stdin: '15\n0\n7\n',
            notes: [
              { line: 3, text: 'The word do starts the loop. There is no condition yet.' },
              { line: 5, text: 'This runs at least once, before anything is checked.' },
              { line: 6, text: 'The condition says when to repeat: while the number is out of range.' },
              { line: 6, text: 'Notice the semicolon after the closing bracket. A do-while needs it.' },
            ],
          },
          {
            kind: 'tip',
            title: 'while or do-while?',
            body: 'The difference is small, but it matters, so here is how I decide.',
            bullets: [
              'Use `while` when the loop might need to run **zero** times.',
              'Use `do-while` when it must run **at least once**.',
              'Never forget the semicolon after the `while (...)` of a `do-while`.',
              'Input checks are the classic use for a `do-while`.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The missing semicolon',
            body: 'The `do-while` is one long statement, and it has to end with a semicolon. Java reports an error if you forget it.',
            wrong: j`
int n = 1;
do {
    System.out.println(n);
    n++;
} while (n <= 3)`,
            right: j`
int n = 1;
do {
    System.out.println(n);
    n++;
} while (n <= 3);`,
          },
        ],
        questions: ['u7l2-01', 'u7l2-02', 'u7l2-03', 'u7l2-04', 'u7l2-05', 'u7l2-06', 'u7l2-07', 'u7l2-08', 'u7l2-09', 'u7l2-10'],
        challenge: 'u7l2-11',
      },
      {
        id: 'u7-l3',
        unitId: 'u7',
        title: 'break and continue',
        summary: 'Leave a loop early or skip one pass.',
        topic: 'loop-control',
        teach: [
          {
            kind: 'concept',
            title: 'Taking control of a loop',
            what: '`break` **leaves the loop immediately**, and the program carries on with whatever comes after the loop. `continue` **skips the rest of the current pass** and moves on to the next one, where the condition is checked again.',
            why: 'Sometimes a loop should stop early, like when you have found what you were looking for. Other times you want to skip over a few bad values without stopping everything. These two keywords give you that control.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Skip the 3, stop at the 6',
            how: 'When `i` is 3, `continue` skips the print. When `i` reaches 6, `break` ends the loop. Look at the last line to see where `i` ended up.',
            code: j`
int i = 0;
while (i < 10) {
    i++;
    if (i == 3) {
        continue;
    }
    if (i == 6) {
        break;
    }
    System.out.println("i = " + i);
}
System.out.println("Loop over at i = " + i);`,
            notes: [
              { line: 3, text: 'We update i at the top, so that continue cannot skip it.' },
              { line: 5, text: 'Skips the print for 3, and goes straight back to the condition.' },
              { line: 8, text: 'Ends the whole loop as soon as i is 6.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Two warnings from me',
            body: 'These are the two traps I see every term.',
            bullets: [
              '`break` only leaves the **innermost** loop that it is in.',
              'In a `while` loop, a `continue` that jumps over your `i++` creates an infinite loop. Update first, or use a `for` loop.',
              '`while (true)` with a `break` inside is a handy way to loop until something specific happens.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Continuing past the update',
            body: 'When `i` is 2, the `continue` jumps back to the top before `i++` ever runs. So `i` stays at 2 forever.',
            wrong: j`
int i = 0;
while (i < 5) {
    if (i == 2) {
        continue;
    }
    System.out.println(i);
    i++;
}`,
            right: j`
int i = 0;
while (i < 5) {
    i++;
    if (i == 2) {
        continue;
    }
    System.out.println(i);
}`,
          },
        ],
        questions: ['u7l3-01', 'u7l3-02', 'u7l3-03', 'u7l3-04', 'u7l3-05', 'u7l3-06', 'u7l3-07', 'u7l3-08', 'u7l3-09', 'u7l3-10'],
        challenge: 'u7l3-11',
      },
      {
        id: 'u7-l4',
        unitId: 'u7',
        title: 'for Loops',
        summary: 'Count with all three parts in one line.',
        topic: 'for-loops',
        teach: [
          {
            kind: 'concept',
            title: 'A counting loop in one line',
            what: 'A `for` loop packs the three parts of a counting loop into one line: `for (start; condition; update)`. The **start** runs once, the **condition** is checked before every pass, and the **update** runs after every pass. You still get exactly what a `while` loop would give, but it is shorter and easier to read.',
            why: 'When you know how many times to repeat, a `for` loop keeps everything about the counting in one place. It is much harder to forget the update.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Laps and totals',
            how: 'The first loop counts laps. The second one adds up the numbers from 1 to 10, using a running total.',
            code: j`
for (int i = 1; i <= 5; i++) {
    System.out.println("Lap " + i);
}
int total = 0;
for (int n = 1; n <= 10; n++) {
    total += n;
}
System.out.println("Sum of 1 to 10 = " + total);`,
            notes: [
              { line: 1, text: 'Start at 1, keep going while i is at most 5, add 1 each pass.' },
              { line: 4, text: 'The running total starts at zero, before the loop.' },
              { line: 6, text: 'Each pass adds the current number to the total.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Variations on a theme',
            body: 'The same pattern can count in a lot of ways. Only the three parts change.',
            bullets: [
              'Count up from 0: `for (int i = 0; i < 5; i++)`. That gives you five passes.',
              'Count down: `for (int i = 5; i >= 1; i--)`.',
              'Jump by steps: `for (int i = 0; i <= 10; i += 5)`.',
              'The counter variable only exists **inside** the loop.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Off by one',
            body: 'The programmer wanted 1 to 5, but a plain `<` stops before the 5. Off-by-one errors are the most common loop bug of all.',
            wrong: j`
for (int i = 1; i < 5; i++) {
    System.out.println(i);
}`,
            right: j`
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}`,
          },
        ],
        questions: ['u7l4-01', 'u7l4-02', 'u7l4-03', 'u7l4-04', 'u7l4-05', 'u7l4-06', 'u7l4-07', 'u7l4-08', 'u7l4-09', 'u7l4-10'],
        challenge: 'u7l4-11',
      },
      {
        id: 'u7-l5',
        unitId: 'u7',
        title: 'Nested for Loops',
        summary: 'Loops inside loops: rows and columns.',
        topic: 'for-loops',
        teach: [
          {
            kind: 'concept',
            title: 'A loop inside a loop',
            what: 'A **nested loop** is a loop placed inside another loop. For every single pass of the outer loop, the inner loop runs **all the way through**. Think of a clock: the minute hand goes right round the dial for every step of the hour hand.',
            why: 'Nested loops are how we handle anything with rows and columns: tables, grids, patterns, seating charts. They are also the idea behind a lot of games.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'A triangle of stars',
            how: 'The outer loop counts the rows. The inner loop prints the stars for one row, and it runs as many times as the row number. The `println()` at the end moves to the next row.',
            code: j`
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.print("*");
    }
    System.out.println();
}`,
            notes: [
              { line: 1, text: 'Outer loop: one pass for each row.' },
              { line: 2, text: 'Inner loop: runs row times, so row 3 gets three stars.' },
              { line: 3, text: 'print keeps the stars on the same line.' },
              { line: 5, text: 'println() ends the row, so the next row starts on a new line.' },
            ],
          },
          {
            kind: 'tip',
            title: 'How to think about nested loops',
            body: 'These ideas make nested loops a lot less scary.',
            bullets: [
              'Total passes of the inner body = outer passes times inner passes.',
              'Use `print` inside the inner loop, and `println()` after it to end the row.',
              'Give each loop its own counter, usually `i` and then `j`, or `row` and `col`.',
              'The inner loop can depend on the outer counter, which is how triangles are made.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Using println inside the inner loop',
            body: 'The programmer wanted rows of stars, but `println` inside the inner loop puts every single star on its own line.',
            wrong: j`
for (int r = 1; r <= 2; r++) {
    for (int c = 1; c <= 3; c++) {
        System.out.println("*");
    }
}`,
            right: j`
for (int r = 1; r <= 2; r++) {
    for (int c = 1; c <= 3; c++) {
        System.out.print("*");
    }
    System.out.println();
}`,
          },
        ],
        questions: ['u7l5-01', 'u7l5-02', 'u7l5-03', 'u7l5-04', 'u7l5-05', 'u7l5-06', 'u7l5-07', 'u7l5-08', 'u7l5-09', 'u7l5-10'],
        challenge: 'u7l5-11',
      },
    ],
  },
}
