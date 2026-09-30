import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  ...topic('mixed', [
    // ---------------- Lesson 1: Trace the Code ----------------
    {
      id: 'x-01',
      type: 'predict-output',
      difficulty: 2,
      concept: 'trace',
      prompt: 'Trace the variables. What is printed?',
      code: j`
int x = 3;
int y = 0;
while (x > 0) {
    y += x;
    x--;
}
System.out.println(x + " " + y);`,
      optionStyle: 'output',
      options: [
        { text: '0 6' },
        { text: '1 6', feedback: 'The loop runs until x > 0 is false, so x ends at 0.' },
        { text: '0 3' },
        { text: '3 6', feedback: 'x changes inside the loop (x--).' },
      ],
      answer: 0,
      explanation: 'y collects 3 + 2 + 1 = 6 while x counts down to 0.',
    },
    {
      id: 'x-02',
      type: 'type-output',
      difficulty: 2,
      concept: 'trace',
      prompt: 'Type exactly what this program prints.',
      code: j`
String s = "";
for (int i = 1; i <= 4; i++) {
    if (i % 2 == 0) {
        s += "E";
    } else {
        s += "O";
    }
}
System.out.println(s);`,
      answer: 'OEOE',
      explanation: 'i = 1 (odd) → "O", 2 → "E", 3 → "O", 4 → "E". The String grows to "OEOE".',
    },
    {
      id: 'x-03',
      type: 'predict-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'What does this program print?',
      code: j`
int a = 10;
int b = 4;
if (a % b > 1 && a / b == 2) {
    a -= b;
} else {
    b -= a;
}
System.out.printf("%d %d%n", a, b);`,
      optionStyle: 'output',
      options: [
        { text: '6 4' },
        { text: '10 -6', feedback: 'Check both sides: 10 % 4 = 2 > 1 (true) and 10 / 4 = 2 (true).' },
        { text: '6 -6' },
        { text: '10 4' },
      ],
      answer: 0,
      explanation: '10 % 4 = 2 > 1 is true, and 10 / 4 = 2 (integer division) == 2 is true. So `a -= b` → a = 6.',
    },
    {
      id: 'x-04',
      type: 'type-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'Type exactly what this program prints.',
      code: j`
int n = 5;
int result = 1;
do {
    result *= n;
    n -= 2;
} while (n > 0);
System.out.println(result);`,
      answer: '15',
      explanation: 'result = 1 × 5 = 5 (n → 3), × 3 = 15 (n → 1), × 1 = 15 (n → -1, stop).',
    },
    {
      id: 'x-05',
      type: 'predict-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'What does this program print?',
      code: j`
double total = 0;
for (int i = 1; i <= 4; i++) {
    total += Math.pow(i, 2);
}
System.out.printf("%.1f%n", total / 4);`,
      optionStyle: 'output',
      options: [
        { text: '7.5' },
        { text: '2.5', feedback: 'We add the SQUARES: 1 + 4 + 9 + 16.' },
        { text: '7.0', feedback: 'total is a double, so the division keeps the .5.' },
        { text: '30.0' },
      ],
      answer: 0,
      explanation: '1 + 4 + 9 + 16 = 30.0, and 30.0 / 4 = 7.5.',
    },
    {
      id: 'x-06',
      type: 'type-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'The user types `4`. Type exactly what is printed.',
      code: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
for (int i = 1; i <= n; i++) {
    if (i % 2 == 0) {
        System.out.print(i * i + " ");
    }
}
System.out.println();`,
      stdin: '4\n',
      answer: '4 16',
      explanation: 'Only even i values print their square: 2 → 4 and 4 → 16.',
    },
    {
      id: 'x-07',
      type: 'type-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'Type exactly what this program prints.',
      code: j`
int count = 0;
int sum = 0;
for (int i = 1; i <= 20; i++) {
    if (i % 3 == 0 || i % 5 == 0) {
        count++;
        sum += i;
    }
}
System.out.printf("%d numbers, sum %d%n", count, sum);`,
      answer: '9 numbers, sum 98',
      explanation: 'Multiples of 3 or 5 up to 20: 3, 5, 6, 9, 10, 12, 15, 18, 20 → 9 numbers adding up to 98.',
    },

    // ---------------- Lesson 2: Debug Detective ----------------
    {
      id: 'x-08',
      type: 'find-bug',
      difficulty: 2,
      concept: 'debug',
      prompt: 'This should count the even numbers from 1 to 9 (there are 4), but it prints 5. Tap the buggy line.',
      code: j`
int evens = 0;
for (int i = 1; i <= 9; i++) {
    if (i % 2 == 1) {
        evens++;
    }
}
System.out.println("Evens: " + evens);`,
      bugLines: [3],
      bugKind: 'logic',
      fixedCode: j`
int evens = 0;
for (int i = 1; i <= 9; i++) {
    if (i % 2 == 0) {
        evens++;
    }
}
System.out.println("Evens: " + evens);`,
      explanation: '`i % 2 == 1` is true for ODD numbers. Even numbers have remainder 0: `i % 2 == 0`.',
    },
    {
      id: 'x-09',
      type: 'fix-code',
      difficulty: 3,
      concept: 'debug',
      prompt: 'Debugging challenge: the average of 90, 85 and 82 should print as `Average: 85.7`. Fix the bugs.',
      starter: j`
int a = 90;
int b = 85;
int c = 82;
double avg = (a + b + c) / 3;
System.out.printf("Average: %d%n", avg);`,
      solution: j`
int a = 90;
int b = 85;
int c = 82;
double avg = (a + b + c) / 3.0;
System.out.printf("Average: %.1f%n", avg);`,
      tests: [
        { label: '90, 85, 82', output: 'Average: 85.7' },
        { label: '100, 100, 99', set: { a: '100', b: '100', c: '99' }, output: 'Average: 99.7' },
      ],
      hint: 'Two bugs: one is integer division, the other is a printf placeholder that doesn\'t match a double.',
      explanation: 'Divide by `3.0` so the decimals survive, and use `%.1f` (not `%d`) to print a double with one decimal.',
    },
    {
      id: 'x-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'debug',
      prompt: 'This crashes with StringIndexOutOfBoundsException. Tap the line that causes it.',
      code: j`
String word = "loop";
int i = 0;
while (i <= word.length()) {
    System.out.print(word.charAt(i));
    i++;
}`,
      bugLines: [3],
      bugKind: 'runtime',
      fixedCode: j`
String word = "loop";
int i = 0;
while (i < word.length()) {
    System.out.print(word.charAt(i));
    i++;
}`,
      explanation: 'Positions go from 0 to length() - 1 (0 to 3 for "loop"). With `<=`, the loop asks for charAt(4), which doesn\'t exist. Use `<`.',
    },
    {
      id: 'x-11',
      type: 'error-type',
      difficulty: 3,
      concept: 'debug',
      prompt: 'Does this loop have a problem?',
      code: j`
int n = 10;
while (n > 0) {
    System.out.println(n);
    n = n / 2;
}`,
      answer: 'none',
      feedback: {
        syntax: 'It compiles fine.',
        runtime: 'Nothing here can crash.',
        logic: 'Trace it: 10, 5, 2, 1, then 1 / 2 = 0, so the loop ends.',
      },
      explanation: 'No problem! n goes 10 → 5 → 2 → 1 → 0 (integer division), so the loop prints 10, 5, 2, 1 and stops.',
    },
    {
      id: 'x-12',
      type: 'fix-code',
      difficulty: 3,
      concept: 'debug',
      prompt: 'Debugging challenge: print the average of all the numbers typed, as a decimal (for `2 3` → `Average: 2.5`). Fix the two bugs.',
      starter: j`
Scanner in = new Scanner(System.in);
int total = 0;
int count = 0;
while (in.hasNextInt()) {
    int n = in.nextInt();
    total =+ n;
    count++;
}
System.out.println("Average: " + total / count);`,
      solution: j`
Scanner in = new Scanner(System.in);
int total = 0;
int count = 0;
while (in.hasNextInt()) {
    int n = in.nextInt();
    total += n;
    count++;
}
System.out.println("Average: " + (double) total / count);`,
      tests: [
        { label: 'input: 2 3', stdin: '2 3\n', output: 'Average: 2.5' },
        { label: 'input: 4 4 5', stdin: '4 4 5\n', output: 'Average: 4.333333333333333' },
        { label: 'input: 10', stdin: '10\n', output: 'Average: 10.0' },
      ],
      hint: 'Look very carefully at the operator on line 6. Then think about integer division on line 9.',
      explanation: '`total =+ n` sets total to n instead of adding (use `+=`). And `total / count` is integer division, so cast to double first.',
    },
    {
      id: 'x-13',
      type: 'find-bug',
      difficulty: 2,
      concept: 'debug',
      prompt: 'This program won\'t compile. Tap the line with the bug.',
      code: j`
int score = 7;
if (score > 5) {
    System.out.println("Great!");
else {
    System.out.println("Keep going!");
}`,
      bugLines: [4],
      bugKind: 'syntax',
      fixedCode: j`
int score = 7;
if (score > 5) {
    System.out.println("Great!");
} else {
    System.out.println("Keep going!");
}`,
      explanation: 'The if block is never closed: `else` needs a `}` before it. javac reports *\'else\' without \'if\'*.',
    },
    {
      id: 'x-14',
      type: 'find-bug',
      difficulty: 3,
      concept: 'debug',
      prompt: 'Seniors aged **65 and over** should pay $6.00, but a 65-year-old pays $10.00. Tap the buggy line.',
      code: j`
int age = 65;
double price;
if (age < 12) {
    price = 5.0;
} else if (age > 65) {
    price = 6.0;
} else {
    price = 10.0;
}
System.out.printf("$%.2f%n", price);`,
      bugLines: [5],
      bugKind: 'logic',
      fixedCode: j`
int age = 65;
double price;
if (age < 12) {
    price = 5.0;
} else if (age >= 65) {
    price = 6.0;
} else {
    price = 10.0;
}
System.out.printf("$%.2f%n", price);`,
      explanation: '"65 and over" includes 65, so the condition must be `age >= 65`. Boundary values are where off-by-one bugs hide.',
    },

    // ---------------- Lesson 3: Build It ----------------
    {
      id: 'x-15',
      type: 'arrange',
      difficulty: 2,
      concept: 'build',
      prompt: 'Arrange the lines to add up numbers until the user types 0. The user types `3 4 0`.',
      stdin: '3 4 0\n',
      lines: [
        'Scanner in = new Scanner(System.in);',
        'int sum = 0;',
        'int n = in.nextInt();',
        'while (n != 0) {',
        'sum += n;',
        'n = in.nextInt();',
        '}',
        'System.out.println("Sum: " + sum);',
      ],
      alternatives: [
        [1, 0, 2, 3, 4, 5, 6, 7],
        [0, 2, 1, 3, 4, 5, 6, 7],
      ],
      expectedOutput: 'Sum: 7',
      explanation: 'Read the first number BEFORE the loop, so the condition has something to check. Inside, add it and read the next one.',
    },
    {
      id: 'x-16',
      type: 'write-code',
      difficulty: 3,
      concept: 'build',
      prompt: 'FizzBuzz! For i from 1 to 15 print `FizzBuzz` for multiples of both 3 and 5, `Fizz` for multiples of 3, `Buzz` for multiples of 5, and the number otherwise.',
      starter: j`
for (int i = 1; i <= 15; i++) {
    // your if / else if chain
}`,
      solution: j`
for (int i = 1; i <= 15; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
        System.out.println("FizzBuzz");
    } else if (i % 3 == 0) {
        System.out.println("Fizz");
    } else if (i % 5 == 0) {
        System.out.println("Buzz");
    } else {
        System.out.println(i);
    }
}`,
      tests: [{ label: '1 to 15', output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }],
      hint: 'Check the "both" case FIRST. Otherwise 15 would stop at the Fizz branch.',
      explanation: 'The most specific case (divisible by both) must come first in the chain.',
    },
    {
      id: 'x-17',
      type: 'write-code',
      difficulty: 3,
      concept: 'build',
      prompt: 'Read a positive whole number and print `Prime` if it is prime (exactly two divisors: 1 and itself), otherwise `Not prime`.',
      starter: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
// count the divisors of n with a loop
`,
      solution: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
int divisors = 0;
for (int d = 1; d <= n; d++) {
    if (n % d == 0) {
        divisors++;
    }
}
if (divisors == 2) {
    System.out.println("Prime");
} else {
    System.out.println("Not prime");
}`,
      tests: [
        { label: '7', stdin: '7\n', output: 'Prime' },
        { label: '9', stdin: '9\n', output: 'Not prime' },
        { label: '2', stdin: '2\n', output: 'Prime' },
        { label: '1', stdin: '1\n', output: 'Not prime' },
        { label: '97', stdin: '97\n', output: 'Prime' },
      ],
      hint: 'Loop d from 1 to n and count how many times n % d == 0. A prime has exactly 2 divisors.',
      explanation: 'Count divisors with a loop and `%`. Exactly 2 divisors means prime (1 has only one, so it isn\'t prime).',
    },
    {
      id: 'x-18',
      type: 'fill-blank',
      difficulty: 3,
      concept: 'build',
      prompt: 'Complete the program that counts how many digits of `n` are 7s.',
      code: j`
int n = 7471;
int sevens = 0;
while (n > 0) {
    if (n % 10 == ___) {
        sevens++;
    }
    n = n ___ 10;
}
System.out.println(sevens);`,
      blanks: [['7'], ['/']],
      expectedOutput: '2',
      explanation: '`n % 10` is the last digit; compare it with 7. `n / 10` removes the last digit, so the loop walks through every digit.',
    },
    {
      id: 'x-19',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'build',
      prompt: 'Ask for a password until the user types the right one. They always get at least one attempt. Which plan fits best?',
      options: [
        { text: 'A do-while loop that compares with `.equals()`' },
        { text: 'A for loop that compares with `==`', feedback: 'We don\'t know how many attempts it will take, and Strings need .equals().' },
        { text: 'An if statement only', feedback: 'An if only checks once; we need to repeat.' },
        { text: 'A while (true) loop with no way out', feedback: 'That would never end, even with the right password!' },
      ],
      answer: 0,
      explanation: 'At least one attempt + unknown repeats = do-while. Comparing Strings needs `.equals()`.',
    },
    {
      id: 'x-20',
      type: 'write-code',
      difficulty: 3,
      concept: 'build',
      prompt: 'Read 5 temperatures (doubles). Print the highest as `Max: %.1f` and the average as `Avg: %.1f`, each on its own line.',
      starter: j`
Scanner in = new Scanner(System.in);
// read 5 doubles, track the max and the total
`,
      solution: j`
Scanner in = new Scanner(System.in);
double max = in.nextDouble();
double total = max;
for (int i = 2; i <= 5; i++) {
    double t = in.nextDouble();
    max = Math.max(max, t);
    total += t;
}
System.out.printf("Max: %.1f%n", max);
System.out.printf("Avg: %.1f%n", total / 5);`,
      tests: [
        { label: '20 25.5 18 30 22', stdin: '20 25.5 18 30 22\n', output: 'Max: 30.0\nAvg: 23.1' },
        { label: '1 2 3 4 5', stdin: '1 2 3 4 5\n', output: 'Max: 5.0\nAvg: 3.0' },
        { label: '-5 -2 -9 -1 -3', stdin: '-5 -2 -9 -1 -3\n', output: 'Max: -1.0\nAvg: -4.0' },
      ],
      hint: 'Start max at the FIRST temperature (not 0) so negative temperatures work too.',
      explanation: 'Keep a running total and update the max with `Math.max`. Starting max at the first value handles negative temperatures.',
    },
    {
      id: 'x-21',
      type: 'write-code',
      difficulty: 3,
      concept: 'build',
      prompt: 'Guess the number! The secret is 42. Read guesses until correct. Print `Too high` / `Too low` for wrong guesses, `Numbers only` for words (skip them). When correct, print `Got it in N tries` (count only number guesses).',
      starter: j`
Scanner in = new Scanner(System.in);
int secret = 42;
int tries = 0;
// loop until the guess is correct
`,
      solution: j`
Scanner in = new Scanner(System.in);
int secret = 42;
int tries = 0;
int guess = -1;
while (guess != secret) {
    if (!in.hasNextInt()) {
        in.next();
        System.out.println("Numbers only");
    } else {
        guess = in.nextInt();
        tries++;
        if (guess > secret) {
            System.out.println("Too high");
        } else if (guess < secret) {
            System.out.println("Too low");
        }
    }
}
System.out.println("Got it in " + tries + " tries");`,
      tests: [
        { label: '50 abc 30 42', stdin: '50 abc 30 42\n', output: 'Too high\nNumbers only\nToo low\nGot it in 3 tries' },
        { label: '42', stdin: '42\n', output: 'Got it in 1 tries' },
        { label: '1 2 99 42', stdin: '1 2 99 42\n', output: 'Too low\nToo low\nToo high\nGot it in 4 tries' },
      ],
      hint: 'Use a while loop that runs while guess != secret. Inside, validate with hasNextInt() before reading.',
      explanation: 'Validation (hasNextInt + next), a counter (tries++) and an if / else-if chain, all inside one loop.',
    },
  ]),

  // ---------------- Unit 8 checkpoint ----------------
  ...topic('mixed', [
    {
      id: 'cp8-01',
      type: 'type-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'Type exactly what this program prints.',
      code: j`
int total = 0;
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        if ((i + j) % 2 == 0) {
            total++;
        }
    }
}
System.out.printf("Total: %d%n", total);`,
      answer: 'Total: 9',
      explanation: 'Count pairs with j ≤ i where i + j is even: i=1 → 1, i=2 → 1, i=3 → 2, i=4 → 2, i=5 → 3. Total 9.',
    },
    {
      id: 'cp8-02',
      type: 'predict-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'The user types `5`, `x`, then `3`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int sum = 0;
int reads = 0;
while (reads < 2) {
    try {
        sum += in.nextInt();
        reads++;
    } catch (InputMismatchException e) {
        in.next();
    }
}
System.out.printf("%d from %d numbers%n", sum, reads);`,
      stdin: '5\nx\n3\n',
      optionStyle: 'output',
      options: [
        { text: '8 from 2 numbers' },
        { text: '5 from 1 numbers', feedback: 'The loop keeps going until TWO numbers are read.' },
        { text: '8 from 3 numbers', feedback: '"x" throws before reads++ runs, so it isn\'t counted.' },
        { text: 'The program crashes', feedback: 'The InputMismatchException is caught.' },
      ],
      answer: 0,
      explanation: '5 is added (reads = 1). "x" throws and is skipped. 3 is added (reads = 2). The loop ends: 8 from 2 numbers.',
    },
    {
      id: 'cp8-03',
      type: 'error-type',
      difficulty: 3,
      concept: 'trace',
      prompt: 'This finds how many years it takes to double $100 at 7% interest. Is anything wrong?',
      code: j`
double balance = 100;
int years = 0;
while (balance < 200) {
    balance = balance * 1.07;
    years++;
}
System.out.printf("%d years%n", years);`,
      answer: 'none',
      feedback: {
        syntax: 'Everything compiles.',
        runtime: 'Nothing crashes: years is an int, so %d is correct.',
        logic: 'The balance grows every year, so the loop does end, and the count is right.',
      },
      verify: { status: 'ok', output: '11 years' },
      explanation: 'It\'s correct! The balance grows 7% per year and passes 200 after 11 years. `%d` matches the int `years`.',
    },
    {
      id: 'cp8-04',
      type: 'find-bug',
      difficulty: 3,
      concept: 'debug',
      prompt: 'This should print `5! = 120` but prints `5! = 3125`. Tap the buggy line.',
      code: j`
int n = 5;
long factorial = 1;
for (int i = 1; i <= n; i++) {
    factorial = factorial * n;
}
System.out.println(n + "! = " + factorial);`,
      bugLines: [4],
      bugKind: 'logic',
      fixedCode: j`
int n = 5;
long factorial = 1;
for (int i = 1; i <= n; i++) {
    factorial = factorial * i;
}
System.out.println(n + "! = " + factorial);`,
      explanation: 'It multiplies by `n` (5) every time: 5⁵ = 3125. It should multiply by the loop counter `i`: 1 × 2 × 3 × 4 × 5 = 120.',
    },
    {
      id: 'cp8-05',
      type: 'write-code',
      difficulty: 3,
      concept: 'build',
      prompt: 'Read an int. If the input isn\'t a whole number, print `Invalid`. Otherwise print the sum of its digits. Treat negative numbers by their absolute value (so `-405` → `9`).',
      starter: j`
Scanner in = new Scanner(System.in);
// validate, then add up the digits with a loop
`,
      solution: j`
Scanner in = new Scanner(System.in);
if (!in.hasNextInt()) {
    System.out.println("Invalid");
} else {
    int n = Math.abs(in.nextInt());
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    System.out.println(sum);
}`,
      tests: [
        { label: '123', stdin: '123\n', output: '6' },
        { label: '-405', stdin: '-405\n', output: '9' },
        { label: 'abc', stdin: 'abc\n', output: 'Invalid' },
        { label: '0', stdin: '0\n', output: '0' },
      ],
      mustInclude: [{ pattern: 'Math\\.abs', message: 'Use Math.abs to handle negative numbers.' }],
      explanation: 'Validate with hasNextInt, take `Math.abs`, then peel digits off with `% 10` and `/ 10` in a loop.',
    },
    {
      id: 'cp8-06',
      type: 'predict-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'What does this program print?',
      code: j`
double r = 2;
double area = Math.PI * Math.pow(r, 2);
System.out.printf("Area: %.2f%n", area);
System.out.printf("Rounded: %d%n", Math.round(area));`,
      optionStyle: 'output',
      options: [
        { text: 'Area: 12.57\nRounded: 13' },
        { text: 'Area: 12.56\nRounded: 12', feedback: 'π × 4 = 12.566…, which rounds UP in both places.' },
        { text: 'Area: 12.57\nThen a crash', feedback: 'Math.round returns a long, which `%d` accepts.' },
        { text: 'Area: 12.57\nRounded: 13.0' },
      ],
      answer: 0,
      explanation: 'π × 2² = 12.566…: `%.2f` shows 12.57. `Math.round` gives the long 13, and `%d` works with long.',
    },
  ]),
]

export const unit8: UnitContent = {
  questions,
  unit: {
    id: 'u8',
    number: 8,
    title: 'Mixed Problems',
    tagline: 'Put everything together.',
    color: 'cocoa',
    icon: '🧩',
    topics: ['mixed'],
    checkpoint: ['cp8-01', 'cp8-02', 'cp8-03', 'cp8-04', 'cp8-05', 'cp8-06'],
    lessons: [
      {
        id: 'u8-l1',
        unitId: 'u8',
        title: 'Trace the Code',
        summary: 'Predict output like a computer.',
        topic: 'mixed',
        teach: [
          {
            kind: 'concept',
            title: 'Tracing like a computer',
            what: 'To predict a program\'s output, **trace** it line by line while keeping a table of every variable\'s value. Update the table each time a variable changes.',
            why: 'Tracing is the #1 skill for understanding and debugging code: it shows what the program REALLY does, not what you hoped it does.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'A trace table',
            how: 'Use the "Watch it run" button below the output to step through it with Byte.',
            code: j`
int total = 0;
for (int i = 1; i <= 3; i++) {
    total += i * 2;
}
System.out.println(total);`,
            notes: [
              { line: 3, text: 'i = 1 → total 2 · i = 2 → total 6 · i = 3 → total 12' },
              { line: 5, text: 'Prints 12.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Tracing checklist',
            body: 'When a question asks "what does this print?":',
            bullets: [
              'Write down every variable\'s starting value.',
              'For loops, write the condition\'s result on every check.',
              'For if statements, decide true/false BEFORE reading the block.',
              'Keep the printed output in a separate list.',
            ],
          },
        ],
        questions: ['x-01', 'x-02', 'x-03', 'x-04', 'x-05', 'x-06'],
        challenge: 'x-07',
      },
      {
        id: 'u8-l2',
        unitId: 'u8',
        title: 'Debug Detective',
        summary: 'Find and fix bugs systematically.',
        topic: 'mixed',
        teach: [
          {
            kind: 'concept',
            title: 'A debugging strategy',
            what: '1) Read the error message and its line number. 2) Reproduce the bug with a small input. 3) Trace to find where reality differs from what you expected. 4) Fix ONE thing, then test again.',
            why: 'Every programmer writes bugs. Great programmers find them systematically instead of guessing.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Hunting an off-by-one',
            how: 'The goal is 15 (1 + 2 + 3 + 4 + 5), but it prints 10. Tracing i shows the loop stops at 4!',
            code: j`
// Goal: print the sum of 1 to 5
int sum = 0;
for (int i = 1; i < 5; i++) {
    sum += i;
}
System.out.println(sum);`,
            notes: [{ line: 3, text: 'i < 5 stops at 4. The fix is i <= 5.' }],
          },
          {
            kind: 'tip',
            title: 'The bug checklist',
            body: 'Most beginner bugs are one of these:',
            bullets: [
              '`=` vs `==`, and `;` right after `if (...)`',
              '`<` vs `<=` (off-by-one)',
              'Integer division: `7 / 2` is 3',
              'Forgetting `i++` (infinite loop) or `in.next()` after bad input',
              '`%d` with a double in printf',
              'Comparing Strings with `==` instead of `.equals()`',
            ],
          },
        ],
        questions: ['x-08', 'x-13', 'x-11', 'x-10', 'x-14', 'x-09'],
        challenge: 'x-12',
      },
      {
        id: 'u8-l3',
        unitId: 'u8',
        title: 'Build It',
        summary: 'From problem to working program.',
        topic: 'mixed',
        teach: [
          {
            kind: 'concept',
            title: 'From problem to program',
            what: 'Break every problem into four questions: What **input** do I need? What do I **calculate**? What **decisions or repetition** are involved? How should the **output** look?',
            why: 'Big programs are small steps glued together. A two-minute plan beats twenty minutes of staring at an empty editor.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Grade calculator',
            how: 'Input → loop to total → calculate the average → decide the message → print with printf.',
            code: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
int total = 0;
for (int i = 1; i <= n; i++) {
    total += in.nextInt();
}
double avg = (double) total / n;
if (avg >= 80) {
    System.out.printf("Average %.1f: Great job!%n", avg);
} else {
    System.out.printf("Average %.1f: Keep practicing!%n", avg);
}`,
            stdin: '3\n90\n80\n75\n',
            notes: [
              { line: 2, text: 'Input: how many scores?' },
              { line: 4, text: 'Repetition: read and add each score.' },
              { line: 7, text: 'Calculate: cast to avoid integer division.' },
              { line: 8, text: 'Decision + formatted output.' },
            ],
          },
        ],
        questions: ['x-15', 'x-18', 'x-19', 'x-16', 'x-17', 'x-20'],
        challenge: 'x-21',
      },
    ],
  },
}
