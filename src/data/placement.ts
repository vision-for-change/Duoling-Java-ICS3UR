import { j } from './helpers'
import type { PlacementArea, PlacementItem } from './types'

export const PLACEMENT_AREAS: Record<PlacementArea, { label: string; unitId: string }> = {
  variables: { label: 'Variables', unitId: 'u1' },
  types: { label: 'Data types', unitId: 'u1' },
  expressions: { label: 'Expressions', unitId: 'u2' },
  conditionals: { label: 'Conditionals', unitId: 'u3' },
  loops: { label: 'Loops', unitId: 'u4' },
  input: { label: 'Input', unitId: 'u5' },
  errors: { label: 'Errors & exceptions', unitId: 'u5' },
  math: { label: 'Math', unitId: 'u6' },
  printf: { label: 'printf', unitId: 'u7' },
}

/** A short diagnostic: roughly two questions per area, easiest areas first. */
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
      explanation: '`a = a + 3` takes the old value (4), adds 3, and stores 7 back in a.',
    },
  },
  {
    area: 'types',
    question: {
      id: 'pl-02',
      topic: 'types',
      difficulty: 1,
      type: 'multiple-choice',
      prompt: 'Which type is best for storing a price like `3.75`?',
      optionStyle: 'code',
      options: [{ text: 'double' }, { text: 'int' }, { text: 'boolean' }, { text: 'char' }],
      answer: 0,
      explanation: 'Numbers with decimals are stored in a `double`.',
    },
  },
  {
    area: 'types',
    question: {
      id: 'pl-03',
      topic: 'types',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`System.out.println("A" + 1 + 2);`,
      optionStyle: 'output',
      options: [{ text: 'A12' }, { text: 'A3' }, { text: '3A' }, { text: 'Compile error' }],
      answer: 0,
      explanation: 'Left to right: "A" + 1 → "A1", then + 2 → "A12". After a String, + joins text.',
    },
  },
  {
    area: 'expressions',
    question: {
      id: 'pl-04',
      topic: 'arithmetic',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`System.out.println(17 / 5 + 17 % 5);`,
      optionStyle: 'output',
      options: [{ text: '5' }, { text: '5.4' }, { text: '3' }, { text: '6' }],
      answer: 0,
      explanation: '17 / 5 = 3 (integer division) and 17 % 5 = 2 (remainder). 3 + 2 = 5.',
    },
  },
  {
    area: 'expressions',
    question: {
      id: 'pl-05',
      topic: 'boolean-logic',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int x = 6;
System.out.println(x > 2 && x % 4 == 0);`,
      optionStyle: 'output',
      options: [{ text: 'false' }, { text: 'true' }, { text: '6' }, { text: 'Compile error' }],
      answer: 0,
      explanation: '6 > 2 is true, but 6 % 4 is 2, not 0. With &&, both must be true → false.',
    },
  },
  {
    area: 'conditionals',
    question: {
      id: 'pl-06',
      topic: 'conditionals',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int score = 75;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}`,
      optionStyle: 'output',
      options: [{ text: 'C' }, { text: 'A' }, { text: 'F' }, { text: 'C\nF' }],
      answer: 0,
      explanation: 'The chain stops at the first true condition: 75 >= 70 → "C".',
    },
  },
  {
    area: 'conditionals',
    question: {
      id: 'pl-07',
      topic: 'nested-if',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int a = 5;
boolean b = false;
if (a > 3) {
    if (b) {
        System.out.println("X");
    } else {
        System.out.println("Y");
    }
} else {
    System.out.println("Z");
}`,
      optionStyle: 'output',
      options: [{ text: 'Y' }, { text: 'X' }, { text: 'Z' }, { text: 'Y\nZ' }],
      answer: 0,
      explanation: '5 > 3 is true, so we go inside. b is false, so the inner else prints "Y".',
    },
  },
  {
    area: 'loops',
    question: {
      id: 'pl-08',
      topic: 'while-loops',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
int i = 1;
while (i < 20) {
    i *= 3;
}
System.out.println(i);`,
      optionStyle: 'output',
      options: [{ text: '27' }, { text: '9' }, { text: '20' }, { text: '81' }],
      answer: 0,
      explanation: 'i goes 1 → 3 → 9 → 27. At 27 the condition i < 20 is false, so the loop stops.',
    },
  },
  {
    area: 'loops',
    question: {
      id: 'pl-09',
      topic: 'for-loops',
      difficulty: 2,
      type: 'multiple-choice',
      prompt: 'How many times does this loop run?',
      code: j`
for (int i = 2; i <= 10; i += 2) {
    System.out.println(i);
}`,
      options: [{ text: '5' }, { text: '4' }, { text: '10' }, { text: '6' }],
      answer: 0,
      explanation: 'i takes the values 2, 4, 6, 8 and 10, so there are five passes.',
    },
  },
  {
    area: 'input',
    question: {
      id: 'pl-10',
      topic: 'input',
      difficulty: 2,
      type: 'multiple-choice',
      prompt: 'What does `in.hasNextInt()` do?',
      options: [
        { text: 'Checks whether the next input is a whole number, without reading it' },
        { text: 'Reads the next whole number' },
        { text: 'Converts the input into an int' },
        { text: 'Crashes if the input is not a number' },
      ],
      answer: 0,
      explanation: '`hasNextInt()` only peeks and returns true/false. `nextInt()` does the actual reading.',
    },
  },
  {
    area: 'errors',
    question: {
      id: 'pl-11',
      topic: 'try-catch',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`
try {
    System.out.println(10 / 0);
    System.out.println("A");
} catch (ArithmeticException e) {
    System.out.println("B");
}
System.out.println("C");`,
      optionStyle: 'output',
      options: [{ text: 'B\nC' }, { text: 'A\nB\nC' }, { text: 'B' }, { text: 'Infinity\nA\nC' }],
      answer: 0,
      explanation: 'The division throws, so Java jumps to the catch (B), skipping "A", and continues after it (C).',
    },
  },
  {
    area: 'errors',
    question: {
      id: 'pl-12',
      topic: 'errors',
      difficulty: 2,
      type: 'error-type',
      prompt: 'This should print the average of 7 and 8 (7.5). What kind of error does it have?',
      code: j`
int a = 7;
int b = 8;
double avg = (a + b) / 2;
System.out.println(avg);`,
      answer: 'logic',
      explanation: 'It compiles and runs, but prints 7.0 because `(a + b) / 2` is integer division. Wrong answer, no crash = logic error.',
    },
  },
  {
    area: 'math',
    question: {
      id: 'pl-13',
      topic: 'math',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.pow(2, 3) + Math.abs(-2));`,
      optionStyle: 'output',
      options: [{ text: '10.0' }, { text: '10' }, { text: '6.0' }, { text: '82' }],
      answer: 0,
      explanation: 'Math.pow(2, 3) is 8.0 (a double) and Math.abs(-2) is 2. 8.0 + 2 = 10.0.',
    },
  },
  {
    area: 'printf',
    question: {
      id: 'pl-14',
      topic: 'printf',
      difficulty: 2,
      type: 'predict-output',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%.1f|%3d%n", 2.345, 7);`,
      optionStyle: 'output',
      options: [{ text: '2.3|  7' }, { text: '2.345|7' }, { text: '2.3|7' }, { text: '2.4|  7' }],
      answer: 0,
      explanation: '`%.1f` rounds 2.345 to one decimal (2.3), and `%3d` pads 7 to width 3: "  7".',
    },
  },
]
