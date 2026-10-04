import { j } from './helpers'
import type { PlacementArea, PlacementItem } from './types'

/** Each area maps to the unit that teaches it, so a mistake tells us where to start. */
export const PLACEMENT_AREAS: Record<PlacementArea, { label: string; unitId: string }> = {
  variables: { label: 'Variables', unitId: 'u1' },
  types: { label: 'Data types', unitId: 'u1' },
  input: { label: 'Scanner input', unitId: 'u2' },
  math: { label: 'Math and operators', unitId: 'u3' },
  errors: { label: 'Errors and debugging', unitId: 'u4' },
  printf: { label: 'printf', unitId: 'u5' },
  conditionals: { label: 'Decisions', unitId: 'u6' },
  loops: { label: 'Loops', unitId: 'u7' },
  exceptions: { label: 'Switch and exceptions', unitId: 'u8' },
}

/** A short diagnostic that follows the order of the course, easiest areas first. */
export const placementItems: PlacementItem[] = [
  {
    area: 'variables',
    question: {
      id: 'pl-01',
      topic: 'variables',
      difficulty: 1,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int a = 4;
a = a + 3;
System.out.println(a);`,
      optionStyle: 'output',
      options: [{ text: '7' }, { text: '4' }, { text: '43' }, { text: 'a + 3' }],
      answer: 0,
      explanation: 'Java works out the right side first. It takes the old value of `a` (4), adds 3, and stores the 7 back into the same box.',
    },
  },
  {
    area: 'types',
    question: {
      id: 'pl-02',
      topic: 'types',
      difficulty: 1,
      type: 'multiple-choice',
      prompt: 'Which type is the best fit for a price like `3.75`?',
      optionStyle: 'code',
      options: [{ text: 'double' }, { text: 'int' }, { text: 'boolean' }, { text: 'char' }],
      answer: 0,
      explanation: 'Anything with a decimal point belongs in a `double`. An `int` only holds whole numbers.',
    },
  },
  {
    area: 'input',
    question: {
      id: 'pl-03',
      topic: 'input',
      difficulty: 1,
      type: 'multiple-choice',
      prompt: 'Which Scanner method reads a whole number that the user types?',
      optionStyle: 'code',
      options: [{ text: 'console.nextInt()' }, { text: 'console.next()' }, { text: 'console.nextDouble()' }, { text: 'console.readInt()' }],
      answer: 0,
      explanation: '`nextInt()` reads a whole number. `next()` reads a word, and `nextDouble()` reads a decimal.',
    },
  },
  {
    area: 'input',
    question: {
      id: 'pl-04',
      topic: 'input',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'The user types `3 4`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
System.out.println(a + b);`,
      stdin: '3 4\n',
      optionStyle: 'output',
      options: [{ text: '7' }, { text: '34' }, { text: '3' }, { text: '12' }],
      answer: 0,
      explanation: 'Each `nextInt()` reads one number, and the plus adds the two numbers together, so 3 plus 4 gives 7.',
    },
  },
  {
    area: 'math',
    question: {
      id: 'pl-05',
      topic: 'arithmetic',
      difficulty: 1,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`System.out.println(17 / 5 + " " + 17 % 5);`,
      optionStyle: 'output',
      options: [{ text: '3 2' }, { text: '3.4 2' }, { text: '2 3' }, { text: '4 2' }],
      answer: 0,
      explanation: 'With two ints, `/` drops the decimal part, so 17 / 5 is 3. And `%` gives the remainder, which is 2.',
    },
  },
  {
    area: 'math',
    question: {
      id: 'pl-06',
      topic: 'arithmetic',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
System.out.println((double) 7 / 2);
System.out.println((double) (7 / 2));`,
      optionStyle: 'output',
      options: [{ text: '3.5\n3.0' }, { text: '3.5\n3.5' }, { text: '3.0\n3.0' }, { text: '3\n3' }],
      answer: 0,
      explanation: 'A cast only applies to the value right after it. In the first line it hits the 7, so we get a decimal division. In the second, the brackets divide the ints first, so the 3 is turned into 3.0 too late.',
    },
  },
  {
    area: 'errors',
    question: {
      id: 'pl-07',
      topic: 'errors',
      difficulty: 2,
      type: 'error-type',
      prompt: 'This should print the area of a 4 by 3 rectangle (12). What kind of error does it have?',
      code: j`
int width = 4;
int height = 3;
System.out.println(width + height);`,
      answer: 'logic',
      feedback: {
        syntax: 'It compiles fine, and Java has no complaints.',
        runtime: 'Nothing crashes. It runs to the end.',
        none: 'Is the answer it prints the area?',
      },
      explanation: 'The program runs and prints 7, but the area needs multiplication. It is a logic error, and Java cannot see it. Only testing will.',
    },
  },
  {
    area: 'printf',
    question: {
      id: 'pl-08',
      topic: 'printf',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%s costs $%.2f%n", "Tea", 2.5);`,
      optionStyle: 'output',
      options: [{ text: 'Tea costs $2.50' }, { text: 'Tea costs $2.5' }, { text: '%s costs $%.2f' }, { text: 'Tea costs $2.500000' }],
      answer: 0,
      explanation: 'The `%s` becomes `Tea`, and the `%.2f` shows the 2.5 with exactly two decimals.',
    },
  },
  {
    area: 'conditionals',
    question: {
      id: 'pl-09',
      topic: 'conditionals',
      difficulty: 1,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int age = 20;
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}`,
      optionStyle: 'output',
      options: [{ text: 'Adult' }, { text: 'Minor' }, { text: 'Adult\nMinor' }, { text: '(nothing)' }],
      answer: 0,
      explanation: '20 is at least 18, so the condition is true. The `if` block runs, and the `else` block is skipped.',
    },
  },
  {
    area: 'conditionals',
    question: {
      id: 'pl-10',
      topic: 'boolean-logic',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int age = 15;
if (age >= 13 && age <= 19) {
    System.out.println("teen");
} else {
    System.out.println("not a teen");
}`,
      optionStyle: 'output',
      options: [{ text: 'teen' }, { text: 'not a teen' }, { text: 'teen\nnot a teen' }, { text: '(nothing)' }],
      answer: 0,
      explanation: 'The `&&` needs both sides to be true. 15 is at least 13 and at most 19, so both are, and the program prints `teen`.',
    },
  },
  {
    area: 'loops',
    question: {
      id: 'pl-11',
      topic: 'for-loops',
      difficulty: 1,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int total = 0;
for (int i = 1; i <= 3; i++) {
    total += i;
}
System.out.println(total);`,
      optionStyle: 'output',
      options: [{ text: '6' }, { text: '3' }, { text: '123' }, { text: '9' }],
      answer: 0,
      explanation: 'The loop adds 1, then 2, then 3 into `total`. That makes 6.',
    },
  },
  {
    area: 'loops',
    question: {
      id: 'pl-12',
      topic: 'while-loops',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int n = 1;
while (n < 100) {
    n *= 2;
}
System.out.println(n);`,
      optionStyle: 'output',
      options: [{ text: '128' }, { text: '100' }, { text: '64' }, { text: '256' }],
      answer: 0,
      explanation: 'The value doubles each time: 1, 2, 4, 8, 16, 32, 64 and then 128. After 64 the condition is still true (64 is under 100), so it doubles one last time. 128 is not under 100, so the loop stops.',
    },
  },
  {
    area: 'exceptions',
    question: {
      id: 'pl-13',
      topic: 'switch',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int n = 2;
switch (n) {
    case 1:
        System.out.print("a");
        break;
    case 2:
        System.out.print("b");
    case 3:
        System.out.print("c");
        break;
}`,
      optionStyle: 'output',
      options: [{ text: 'bc' }, { text: 'b' }, { text: 'abc' }, { text: 'c' }],
      answer: 0,
      explanation: 'The switch jumps in at case 2 and prints `b`. There is no `break`, so it falls through into case 3 and prints `c`, where the `break` stops it.',
    },
  },
  {
    area: 'exceptions',
    question: {
      id: 'pl-14',
      topic: 'try-catch',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int zero = 0;
try {
    System.out.println("A");
    System.out.println(5 / zero);
    System.out.println("B");
} catch (ArithmeticException e) {
    System.out.println("C");
}
System.out.println("D");`,
      optionStyle: 'output',
      options: [{ text: 'A\nC\nD' }, { text: 'A\nB\nD' }, { text: 'A\nB\nC\nD' }, { text: 'A\nD' }],
      answer: 0,
      explanation: '`A` prints. Then the division by zero throws an exception, so `B` is skipped and the `catch` prints `C`. After that the program carries on with `D`.',
    },
  },
]
