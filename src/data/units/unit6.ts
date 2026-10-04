import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Statements and expressions ----------------
  ...topic('expressions', [
    {
      id: 'u6l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'statement',
      prompt: 'Which of these is a complete **statement**?',
      optionStyle: 'code',
      options: [
        { text: 'int x = 5;' },
        { text: 'x + 5', feedback: 'That is an expression. It works out to a value, but on its own it is not a finished instruction.' },
        { text: 'age > 16', feedback: 'That is an expression too. It works out to true or false, but it has no semicolon and does not do anything by itself.' },
        { text: '3 * 4', feedback: 'That is an expression that works out to 12. A statement is a complete instruction that ends in a semicolon.' },
      ],
      answer: 0,
      explanation: 'A **statement** is a complete instruction for the computer, and it ends with a semicolon. An **expression** is a smaller piece that works out to a single value, and it usually sits inside a statement.',
    },
    {
      id: 'u6l1-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'logical-expression',
      prompt: 'Which of these is a **logical** expression, meaning one that works out to `true` or `false`?',
      optionStyle: 'code',
      options: [
        { text: 'age > 16' },
        { text: 'age + 16', feedback: 'That is a numerical expression. It works out to a number.' },
        { text: 'age = 16', feedback: 'A single equals sign stores a value. It is an assignment, not a question.' },
        { text: '"age"', feedback: 'That is just a piece of text.' },
      ],
      answer: 0,
      explanation: 'Anything with a comparison like `>` or `==` works out to true or false. That is what makes it a logical, or **boolean**, expression.',
    },
    {
      id: 'u6l1-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'numerical-expression',
      prompt: 'A numerical expression like `3 + 4` works out to a number, and a logical expression like `3 < 4` works out to `true` or `false`.',
      answer: true,
      wrongFeedback: 'It is true. That is the whole difference between the two kinds of expression.',
      explanation: 'Numerical expressions give back numbers. Logical expressions give back a boolean, which is either true or false.',
    },
    {
      id: 'u6l1-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'numerical-expression',
      prompt: 'What does this program print?',
      code: j`System.out.println(5 + 3 * 2);`,
      optionStyle: 'output',
      options: [
        { text: '11' },
        { text: '16', feedback: 'Multiplication goes before addition, so 3 times 2 happens first.' },
        { text: '10', feedback: 'Every operator in the expression still gets used.' },
        { text: '5 + 3 * 2', feedback: 'Java works the expression out and prints the answer. It does not print the math itself.' },
      ],
      answer: 0,
      explanation: 'Just like in math class, `*` goes first. 3 times 2 is 6, and 5 plus 6 is 11.',
    },
    {
      id: 'u6l1-05',
      type: 'predict-output',
      difficulty: 1,
      concept: 'logical-expression',
      prompt: 'What does this program print?',
      code: j`System.out.println(10 > 3);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: 'Is 10 really not bigger than 3?' },
        { text: '10', feedback: 'The comparison itself is what gets printed, and it works out to true or false.' },
        { text: '7', feedback: 'There is no subtraction here. The `>` asks a yes or no question.' },
      ],
      answer: 0,
      explanation: '`10 > 3` asks "is 10 greater than 3?" The answer is true, and that is what gets printed.',
    },
    {
      id: 'u6l1-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'boolean-variable',
      prompt: 'Fill in the type so the variable can store the answer to the question.',
      code: j`
int age = 20;
___ isAdult = age >= 18;
System.out.println(isAdult);`,
      blanks: [['boolean']],
      bank: ['boolean', 'int', 'String', 'double'],
      expectedOutput: 'true',
      explanation: 'The expression `age >= 18` works out to true or false, and the only type that can hold that is `boolean`.',
    },
    {
      id: 'u6l1-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'mixed-expressions',
      prompt: 'What does this program print?',
      code: j`
int a = 8;
int b = 3;
System.out.println(a - b);
System.out.println(a - b > 4);`,
      optionStyle: 'output',
      options: [
        { text: '5\ntrue' },
        { text: '5\nfalse', feedback: 'Subtraction happens first, so the second line asks whether 5 is greater than 4.' },
        { text: '5\n5', feedback: 'The second line has a comparison in it, which works out to true or false.' },
        { text: 'true\ntrue', feedback: 'The first line is just a subtraction, and so it prints a number.' },
      ],
      answer: 0,
      explanation: 'The first line is a numerical expression, so we get 5. The second does the subtraction first and then compares the result, so it asks "is 5 greater than 4?" and gets true.',
    },
    {
      id: 'u6l1-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'boolean-variable',
      prompt: 'What happens when we try to run this code?',
      code: j`
int result = 7 > 3;
System.out.println(result);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this while compiling, before the program runs.',
        logic: 'The program never runs, so it cannot print a wrong answer.',
        none: 'What kind of value does `7 > 3` work out to? And what can an int hold?',
      },
      highlightLines: [1],
      explanation: 'A comparison works out to a boolean, and a boolean will not fit in an `int` box. Java reports *incompatible types*. Use `boolean result = 7 > 3;`.',
    },
    {
      id: 'u6l1-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'mixed-expressions',
      prompt: 'Type exactly what this program prints.',
      code: j`
int x = 6;
boolean big = x * 2 > 10;
System.out.println(big);`,
      answer: 'true',
      explanation: 'The multiplication goes first, so `x * 2` is 12. Then 12 > 10 is true, and the boolean variable stores it.',
    },
    {
      id: 'u6l1-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'logical-expression',
      prompt: 'Read a person\'s age as an `int`. Print `true` if they are old enough to vote (18 or over), and `false` otherwise. You do not need an `if` for this. Print the expression itself.',
      starter: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
// print true or false
`,
      solution: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
System.out.println(age >= 18);`,
      tests: [
        { label: 'too young', stdin: '17\n', output: 'false' },
        { label: 'exactly 18', stdin: '18\n', output: 'true' },
        { label: 'older', stdin: '40\n', output: 'true' },
      ],
      mustInclude: [{ pattern: '>=', message: 'Use `>=` so that 18 itself counts.' }],
      explanation: 'A comparison already works out to true or false, so you can print it directly. The `>=` makes sure an 18 year old gets a true.',
    },
  ]),

  // ---------------- Lesson 2: Relational operators ----------------
  ...topic('expressions', [
    {
      id: 'u6l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'equals',
      prompt: 'Which operator checks whether two values are **equal**?',
      optionStyle: 'code',
      options: [
        { text: '==' },
        { text: '=', feedback: 'A single equals sign stores a value in a variable. It does not ask a question.' },
        { text: '===', feedback: 'Other languages have this one. Java does not.' },
        { text: 'equals', feedback: 'That is the name of a method we use on Strings, not an operator.' },
      ],
      answer: 0,
      explanation: 'Two equals signs ask "are these the same?" and give back true or false. One equals sign puts a value into a variable.',
    },
    {
      id: 'u6l2-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'not-equals',
      prompt: 'Which operator checks whether two values are **not equal**?',
      optionStyle: 'code',
      options: [
        { text: '!=' },
        { text: '<>', feedback: 'Some languages use that, but Java does not.' },
        { text: '=/=', feedback: 'That is not valid in Java.' },
        { text: '!==', feedback: 'That one belongs to JavaScript. Java uses a shorter version.' },
      ],
      answer: 0,
      explanation: 'The exclamation mark means "not". `odd != 2` is true whenever `odd` is anything except 2.',
    },
    {
      id: 'u6l2-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'equals',
      prompt: 'What does this program print?',
      code: j`
int decade = 10;
System.out.println(decade == 10);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: '`decade` holds 10, and it is being compared with 10.' },
        { text: '10', feedback: 'A comparison gives back true or false, not the number.' },
        { text: 'decade == 10', feedback: 'Java works out the comparison and prints the result.' },
      ],
      answer: 0,
      explanation: '`decade` holds 10, so asking "is it equal to 10?" gives true.',
    },
    {
      id: 'u6l2-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'not-equals',
      prompt: 'What does this program print?',
      code: j`System.out.println(7 != 7);`,
      optionStyle: 'output',
      options: [
        { text: 'false' },
        { text: 'true', feedback: 'Seven is exactly equal to seven, so "not equal" is the wrong answer.' },
        { text: '0', feedback: 'A comparison gives true or false, never a number.' },
        { text: 'Compile error', feedback: 'This is perfectly valid. It just happens to be false.' },
      ],
      answer: 0,
      explanation: '`7 != 7` asks "is 7 different from 7?" It is not, so the answer is false.',
    },
    {
      id: 'u6l2-05',
      type: 'true-false',
      difficulty: 1,
      concept: 'less-equal',
      prompt: '`5 <= 5` is `true`.',
      answer: true,
      wrongFeedback: 'It is true. The `<=` means "less than **or equal to**", and 5 is equal to 5.',
      explanation: 'The `=` in `<=` and `>=` lets the two values be equal. A senior might be `>= 65`, which includes a 65 year old.',
    },
    {
      id: 'u6l2-06',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'greater-equal',
      prompt: 'Seniors are 65 or older. Fill in the operator so a 65 year old counts as a senior.',
      code: j`
int age = 65;
boolean senior = age ___ 65;
System.out.println(senior);`,
      blanks: [['>=']],
      bank: ['>=', '>', '<', '!='],
      expectedOutput: 'true',
      explanation: 'A 65 year old is a senior, so the comparison has to include 65 itself. That needs `>=`. A plain `>` would leave 65 out.',
    },
    {
      id: 'u6l2-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'mixed',
      prompt: 'What does this program print?',
      code: j`
int a = 4;
int b = 9;
System.out.println(a < b);
System.out.println(a == b - 5);
System.out.println(a + 5 != b);`,
      optionStyle: 'output',
      options: [
        { text: 'true\ntrue\nfalse' },
        { text: 'true\nfalse\nfalse', feedback: 'Check line 2. The subtraction happens first, so `b - 5` is 4, which is equal to `a`.' },
        { text: 'true\ntrue\ntrue', feedback: 'Check line 3. `a + 5` is 9, which is equal to `b`, so "not equal" is false.' },
        { text: 'false\ntrue\nfalse', feedback: 'Line 1 asks whether 4 is less than 9, and it is.' },
      ],
      answer: 0,
      explanation: 'Arithmetic is done before comparing. Line 1: 4 < 9 is true. Line 2: 4 == 4 is true. Line 3: 9 != 9 is false.',
    },
    {
      id: 'u6l2-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'assign-vs-compare',
      prompt: 'What happens when we try to run this code?',
      code: j`
int x = 5;
boolean same = x = 5;
System.out.println(same);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'The program does not run at all, so there is nothing to print.',
        none: 'Look at line 2. How many equals signs are there, and what does a single one do?',
      },
      highlightLines: [2],
      explanation: 'A single `=` stores the value, so `x = 5` gives back a number, not a true or false. A boolean box cannot hold that. The comparison needs two equals signs: `x == 5`.',
    },
    {
      id: 'u6l2-09',
      type: 'error-type',
      difficulty: 3,
      concept: 'chained',
      prompt: 'What happens when we try to run this code?',
      code: j`
int x = 5;
System.out.println(1 < x < 10);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'It never runs, so it cannot print the wrong thing.',
        none: 'In math class you can write 1 < x < 10, but Java reads comparisons one at a time.',
      },
      highlightLines: [2],
      explanation: 'Java works out `1 < x` first, and that gives true or false. Then it tries to ask whether true is less than 10, which makes no sense. We fix it with the logical operators in a couple of lessons.',
    },
    {
      id: 'u6l2-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'greater-equal',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
int age = 70;
boolean senior = age => 65;
System.out.println(senior);`,
      bugLines: [2],
      fixedCode: j`
int age = 70;
boolean senior = age >= 65;
System.out.println(senior);`,
      bugKind: 'syntax',
      explanation: 'The two characters have to be in the order `>=` ("greater than, or equal"). Written as `=>`, Java does not recognize it.',
    },
    {
      id: 'u6l2-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'mixed',
      prompt: 'Read a whole number and print `true` if it is even and `false` if it is odd. Use `%` and `==`.',
      starter: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
// print true if n is even
`,
      solution: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
System.out.println(n % 2 == 0);`,
      tests: [
        { label: 'even', stdin: '4\n', output: 'true' },
        { label: 'odd', stdin: '7\n', output: 'false' },
        { label: 'zero', stdin: '0\n', output: 'true' },
      ],
      mustInclude: [
        { pattern: '%\\s*2', message: 'Use `% 2` to get the remainder after dividing by 2.' },
        { pattern: '==', message: 'Compare the remainder with `==`.' },
      ],
      explanation: 'An even number leaves a remainder of 0 when you divide by 2. So `n % 2 == 0` asks exactly the question we want.',
    },
  ]),

  // ---------------- Lesson 3: if and else ----------------
  ...topic('conditionals', [
    {
      id: 'u6l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'syntax',
      prompt: 'Which line is the correct way to start an `if` statement?',
      optionStyle: 'code',
      options: [
        { text: 'if (age >= 16) {' },
        { text: 'if age >= 16 {', feedback: 'The condition has to sit inside brackets.' },
        { text: 'if (age >= 16); {', feedback: 'A semicolon right after the brackets ends the `if` before it does anything. That one is a classic bug.' },
        { text: 'if [age >= 16] {', feedback: 'Java wants round brackets here, not square ones.' },
      ],
      answer: 0,
      explanation: 'An `if` is followed by a condition in round brackets, and then a block in curly braces. There is no semicolon after the brackets.',
    },
    {
      id: 'u6l3-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'if-else',
      prompt: 'What does this program print?',
      code: j`
int age = 20;
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Adult' },
        { text: 'Minor', feedback: 'Is 20 greater than or equal to 18?' },
        { text: 'Adult\nMinor', feedback: 'Only one of the two blocks runs. It is either the `if` or the `else`.' },
        { text: '(nothing)', feedback: 'One of the two branches always runs when there is an `else`.' },
      ],
      answer: 0,
      explanation: 'The condition `20 >= 18` is true, so Java runs the `if` block and skips the `else` block completely.',
    },
    {
      id: 'u6l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'if-else',
      prompt: 'The `else` block runs when the `if` condition is **true**.',
      answer: false,
      wrongFeedback: 'It is the other way around. The `else` block is for when the condition is false.',
      explanation: 'Think of it as "if this is true, do that, otherwise do something else." Exactly one of the two blocks runs.',
    },
    {
      id: 'u6l3-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'if-only',
      prompt: 'What does this program print?',
      code: j`
int temp = 5;
if (temp < 0) {
    System.out.println("Freezing");
}
System.out.println("Done");`,
      optionStyle: 'output',
      options: [
        { text: 'Done' },
        { text: 'Freezing\nDone', feedback: 'Is 5 less than 0? The block only runs when the condition is true.' },
        { text: 'Freezing', feedback: 'The condition is false, and the last line is outside the `if`, so it always runs.' },
        { text: '(nothing)', feedback: 'The last line is not inside the braces, so it runs no matter what.' },
      ],
      answer: 0,
      explanation: 'The condition is false, so the block is skipped. The last `println` is after the closing brace, so it runs every time.',
    },
    {
      id: 'u6l3-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'conditions',
      prompt: 'Fill in the operator so a score of 75 prints `pass`.',
      code: j`
int score = 75;
if (score ___ 50) {
    System.out.println("pass");
} else {
    System.out.println("fail");
}`,
      blanks: [['>=']],
      bank: ['>=', '<', '==', '<='],
      expectedOutput: 'pass',
      explanation: '75 is greater than or equal to 50, so the condition is true and we see `pass`. The other operators would send us to the `else`.',
    },
    {
      id: 'u6l3-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'if-else',
      prompt: 'What does this program print?',
      code: j`
int x = 7;
if (x % 2 == 0) {
    System.out.println("even");
} else {
    System.out.println("odd");
}`,
      optionStyle: 'output',
      options: [
        { text: 'odd' },
        { text: 'even', feedback: 'Seven divided by 2 leaves a remainder of 1, and not 0.' },
        { text: 'even\nodd', feedback: 'Only one branch runs.' },
        { text: '1', feedback: 'The remainder is used inside the condition. It is never printed.' },
      ],
      answer: 0,
      explanation: '`7 % 2` is 1, so `7 % 2 == 0` is false. Java skips the `if` block and runs the `else`.',
    },
    {
      id: 'u6l3-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'semicolon',
      prompt: 'The programmer wants `You can drive` to print only when `age` is 16 or more. What kind of problem does this code have?',
      code: j`
int age = 10;
if (age >= 16);
{
    System.out.println("You can drive");
}`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it without a complaint. It is valid code.',
        runtime: 'Nothing crashes. The program runs to the end.',
        none: 'The age is 10. Should it print `You can drive`?',
      },
      highlightLines: [2],
      explanation: 'The semicolon after the brackets is an empty statement, which becomes the whole body of the `if`. The block below is then just a normal block that always runs. Java does not warn you, so it is a sneaky logic error.',
    },
    {
      id: 'u6l3-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'syntax',
      prompt: 'What happens when we try to run this code?',
      code: j`
int age = 20;
if age >= 16 {
    System.out.println("Adult");
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this one before the program runs.',
        logic: 'The program does not run, so it cannot print the wrong thing.',
        none: 'Look at line 2, right after the word `if`.',
      },
      highlightLines: [2],
      explanation: 'The condition has to be in round brackets, so Java expects an opening bracket after `if`. It reports *\'(\' expected*.',
    },
    {
      id: 'u6l3-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'boundaries',
      prompt: 'This program should print `Adult` for someone who is exactly 18, but it prints `Minor`. Tap the line with the bug.',
      code: j`
int age = 18;
if (age > 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}`,
      bugLines: [2],
      fixedCode: j`
int age = 18;
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}`,
      bugKind: 'logic',
      explanation: 'A plain `>` leaves 18 out. An 18 year old falls through to `Minor`. When the boundary value counts, you need `>=`. These off-by-one bugs are everywhere, so always test the edge.',
    },
    {
      id: 'u6l3-10',
      type: 'type-output',
      difficulty: 3,
      concept: 'if-only',
      prompt: 'Type exactly what this program prints.',
      code: j`
int score = 40;
if (score >= 50) {
    System.out.println("Pass");
}
if (score < 50) {
    System.out.println("Retry");
}
System.out.println("Next");`,
      answer: 'Retry\nNext',
      explanation: 'These are two separate `if` statements, and both are checked. The first is false and the second is true, so we see `Retry`. Then `Next` is printed, because it is outside both of them.',
    },
    {
      id: 'u6l3-11',
      type: 'write-code',
      difficulty: 2,
      concept: 'if-else',
      prompt: 'Read an age. If it is 16 or more, print `You can get a licence.` Otherwise print `Not yet.`',
      starter: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
// decide which message to print
`,
      solution: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
if (age >= 16) {
    System.out.println("You can get a licence.");
} else {
    System.out.println("Not yet.");
}`,
      tests: [
        { label: 'exactly 16', stdin: '16\n', output: 'You can get a licence.' },
        { label: 'too young', stdin: '15\n', output: 'Not yet.' },
        { label: 'older', stdin: '45\n', output: 'You can get a licence.' },
      ],
      mustInclude: [
        { pattern: 'if\\s*\\(', message: 'Use an `if` statement.' },
        { pattern: 'else', message: 'Add an `else` for the other case.' },
      ],
      explanation: 'The condition `age >= 16` decides which of the two messages runs. Test the boundary: 16 should get the licence, and 15 should not.',
    },
  ]),

  // ---------------- Lesson 4: else if chains ----------------
  ...topic('conditionals', [
    {
      id: 'u6l4-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'chain',
      prompt: 'In an `if` / `else if` / `else` chain, how many of the blocks can run?',
      options: [
        { text: 'Only the first one whose condition is true' },
        { text: 'All of the ones whose conditions are true', feedback: 'That would be several separate `if` statements. In a chain, Java stops after the first match.' },
        { text: 'Always at least two', feedback: 'It is never more than one.' },
        { text: 'It depends on how many `else if` lines you write', feedback: 'You can write as many as you like, and still only one block runs.' },
      ],
      answer: 0,
      explanation: 'Java checks the conditions from the top. The moment one is true, it runs that block and skips the rest of the chain.',
    },
    {
      id: 'u6l4-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'chain',
      prompt: 'What does this program print?',
      code: j`
int mark = 83;
if (mark >= 90) {
    System.out.println("A");
} else if (mark >= 80) {
    System.out.println("B");
} else if (mark >= 70) {
    System.out.println("C");
} else {
    System.out.println("Keep practising");
}`,
      optionStyle: 'output',
      options: [
        { text: 'B' },
        { text: 'A', feedback: 'Is 83 greater than or equal to 90?' },
        { text: 'B\nC', feedback: 'Once the B condition is true, the rest of the chain is skipped.' },
        { text: 'C', feedback: '83 is also at least 70, but Java stops at the first condition that is true, and that is the B one.' },
      ],
      answer: 0,
      explanation: '83 is not at least 90, so the first condition is false. 83 is at least 80, so that block runs, and the rest of the chain is skipped.',
    },
    {
      id: 'u6l4-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'chain',
      prompt: 'In an `if` / `else if` chain, Java keeps checking the rest of the conditions even after it finds one that is true.',
      answer: false,
      wrongFeedback: 'It stops. After one branch runs, Java jumps to the end of the chain.',
      explanation: 'That is what makes a chain different from separate `if` statements. Only one branch can run.',
    },
    {
      id: 'u6l4-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'order',
      prompt: 'This program is supposed to give 95 an `A`. What does it actually print?',
      code: j`
int mark = 95;
if (mark >= 70) {
    System.out.println("C");
} else if (mark >= 90) {
    System.out.println("A");
}`,
      optionStyle: 'output',
      options: [
        { text: 'C' },
        { text: 'A', feedback: 'That is what the programmer wanted, but the order of the conditions gets in the way.' },
        { text: 'C\nA', feedback: 'Only one branch of a chain can run.' },
        { text: '(nothing)', feedback: 'The first condition is true for 95.' },
      ],
      answer: 0,
      explanation: '95 is at least 70, so the first condition is true and Java never gets to the `A` check. With chains, the order matters. Put the strictest condition first.',
    },
    {
      id: 'u6l4-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'syntax',
      prompt: 'Fill in the missing word so the second condition is part of the chain.',
      code: j`
int n = 4;
if (n > 10) {
    System.out.println("big");
} else ___ (n > 3) {
    System.out.println("medium");
} else {
    System.out.println("small");
}`,
      blanks: [['if']],
      bank: ['if', 'while', 'for', 'when'],
      expectedOutput: 'medium',
      explanation: '`else if` gives you another condition to test when the first one was false. It reads naturally: "otherwise, if this is true instead".',
    },
    {
      id: 'u6l4-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'separate-ifs',
      prompt: 'These are two **separate** `if` statements. What does this program print?',
      code: j`
int n = 10;
if (n > 5) {
    System.out.println("big");
}
if (n > 8) {
    System.out.println("huge");
}`,
      optionStyle: 'output',
      options: [
        { text: 'big\nhuge' },
        { text: 'big', feedback: 'These are two separate `if` statements. Each one is checked on its own.' },
        { text: 'huge', feedback: 'The first condition is true too, so it runs as well.' },
        { text: '(nothing)', feedback: '10 is bigger than both 5 and 8.' },
      ],
      answer: 0,
      explanation: 'Each `if` is independent. 10 is bigger than 5 and bigger than 8, so both blocks run.',
    },
    {
      id: 'u6l4-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'chain',
      prompt: 'Now the second condition is joined with `else`. What does this program print?',
      code: j`
int n = 10;
if (n > 5) {
    System.out.println("big");
} else if (n > 8) {
    System.out.println("huge");
}`,
      optionStyle: 'output',
      options: [
        { text: 'big' },
        { text: 'big\nhuge', feedback: 'The `else` makes it a chain, so Java stops after the first true condition.' },
        { text: 'huge', feedback: 'The first condition is true, so that block runs and the chain ends.' },
        { text: '(nothing)', feedback: 'The first condition, `n > 5`, is true.' },
      ],
      answer: 0,
      explanation: 'Compare this with the last question. Adding `else` turns the two checks into a chain, so after `big` is printed, the second condition is never looked at.',
    },
    {
      id: 'u6l4-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'syntax',
      prompt: 'What happens when we try to run this code?',
      code: j`
int x = 5;
if (x > 3) {
    System.out.println("a");
}
System.out.println("b");
else {
    System.out.println("c");
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'The program never runs, so it cannot print the wrong thing.',
        none: 'An `else` has to follow directly after the closing brace of its `if`.',
      },
      highlightLines: [6],
      explanation: 'The `println` on line 5 breaks the link between the `if` and the `else`. By the time Java reaches the `else`, it has no `if` to connect it to, and it reports *\'else\' without \'if\'*.',
    },
    {
      id: 'u6l4-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'order',
      prompt: 'This program should print `A` for a mark of 95, but it prints `C`. Tap the line that needs to change.',
      code: j`
int mark = 95;
if (mark >= 70) {
    System.out.println("C");
} else if (mark >= 80) {
    System.out.println("B");
} else if (mark >= 90) {
    System.out.println("A");
}`,
      bugLines: [2],
      fixedCode: j`
int mark = 95;
if (mark >= 90) {
    System.out.println("A");
} else if (mark >= 80) {
    System.out.println("B");
} else if (mark >= 70) {
    System.out.println("C");
}`,
      bugKind: 'logic',
      explanation: 'The conditions are in the wrong order, so the loosest one catches everything first. Always start with the strictest condition, then work down.',
    },
    {
      id: 'u6l4-10',
      type: 'type-output',
      difficulty: 3,
      concept: 'chain',
      prompt: 'Type exactly what this program prints.',
      code: j`
int age = 12;
double price;
if (age < 5) {
    price = 0;
} else if (age < 13) {
    price = 5.5;
} else if (age < 65) {
    price = 9;
} else {
    price = 6;
}
System.out.println(price);`,
      answer: '5.5',
      explanation: '12 is not less than 5, but it is less than 13, so the second branch runs. And because `price` is a `double`, it prints as 5.5.',
    },
    {
      id: 'u6l4-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'chain',
      prompt: 'Read a mark. Print `A` for 80 or more, `B` for 70 or more, `C` for 60 or more, `D` for 50 or more, and `F` for anything lower.',
      starter: j`
Scanner console = new Scanner(System.in);
int mark = console.nextInt();
// print the letter grade
`,
      solution: j`
Scanner console = new Scanner(System.in);
int mark = console.nextInt();
if (mark >= 80) {
    System.out.println("A");
} else if (mark >= 70) {
    System.out.println("B");
} else if (mark >= 60) {
    System.out.println("C");
} else if (mark >= 50) {
    System.out.println("D");
} else {
    System.out.println("F");
}`,
      tests: [
        { label: 'an A', stdin: '85\n', output: 'A' },
        { label: 'a B', stdin: '72\n', output: 'B' },
        { label: 'a C', stdin: '61\n', output: 'C' },
        { label: 'a D on the boundary', stdin: '50\n', output: 'D' },
        { label: 'an F', stdin: '12\n', output: 'F' },
      ],
      mustInclude: [{ pattern: 'else\\s+if', message: 'Use `else if` for the middle cases.' }],
      explanation: 'Start with the highest grade and work down. Each `else if` only runs when everything above it was false, so you do not need to write both ends of each range.',
    },
  ]),

  // ---------------- Lesson 5: Nested ifs ----------------
  ...topic('nested-if', [
    {
      id: 'u6l5-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'nesting',
      prompt: 'In a nested `if`, when is the **inner** condition checked?',
      options: [
        { text: 'Only when the outer condition is true' },
        { text: 'Always, before the outer one', feedback: 'The outer condition is the gatekeeper. It is checked first.' },
        { text: 'Always, right after the outer one', feedback: 'If the outer condition is false, Java skips the whole block, including the inner `if`.' },
        { text: 'Only when the outer condition is false', feedback: 'It is the other way around.' },
      ],
      answer: 0,
      explanation: 'Think of the outer `if` as a door. Java only walks into the block, and sees the inner `if`, when the door opens.',
    },
    {
      id: 'u6l5-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'nesting',
      prompt: 'What does this program print?',
      code: j`
int x = 10;
int y = 3;
if (x > 5) {
    if (y > 5) {
        System.out.println("both big");
    } else {
        System.out.println("only x is big");
    }
}`,
      optionStyle: 'output',
      options: [
        { text: 'only x is big' },
        { text: 'both big', feedback: 'Is `y` greater than 5?' },
        { text: '(nothing)', feedback: 'The outer condition is true, so Java gets in, and the inner `if` has an `else` branch.' },
        { text: 'both big\nonly x is big', feedback: 'Only one branch of the inner `if` can run.' },
      ],
      answer: 0,
      explanation: '`x > 5` is true, so we go inside. Then `y > 5` is false, so the inner `else` runs.',
    },
    {
      id: 'u6l5-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'nesting',
      prompt: 'If the outer `if` condition is false, the inner `if` is never even checked.',
      answer: true,
      wrongFeedback: 'It is true. The inner `if` lives inside the outer block, and Java skips the whole block.',
      explanation: 'That is the main idea of nesting. The inner question only matters once the outer one has passed.',
    },
    {
      id: 'u6l5-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'nesting',
      prompt: 'Someone is 17 and has **no** learner\'s permit. What does this program print?',
      code: j`
int age = 17;
boolean hasPermit = false;
if (age >= 16) {
    if (hasPermit) {
        System.out.println("You can take the road test.");
    } else {
        System.out.println("Get a permit first.");
    }
} else {
    System.out.println("Too young to drive.");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Get a permit first.' },
        { text: 'You can take the road test.', feedback: '`hasPermit` is false, so the inner `if` does not pass.' },
        { text: 'Too young to drive.', feedback: 'At 17 the person passes the age check, so the outer condition is true.' },
        { text: '(nothing)', feedback: 'Every path through this code ends in a message.' },
      ],
      answer: 0,
      explanation: 'The age check passes, so we go inside. Then `hasPermit` is false, so the inner `else` runs.',
    },
    {
      id: 'u6l5-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'nesting',
      prompt: 'Now the person is 15 and **does** have a permit. What does this program print?',
      code: j`
int age = 15;
boolean hasPermit = true;
if (age >= 16) {
    if (hasPermit) {
        System.out.println("You can take the road test.");
    } else {
        System.out.println("Get a permit first.");
    }
} else {
    System.out.println("Too young to drive.");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Too young to drive.' },
        { text: 'You can take the road test.', feedback: 'The permit never gets looked at, because 15 fails the age check first.' },
        { text: 'Get a permit first.', feedback: 'That is inside the age check, and 15 does not get in.' },
        { text: 'You can take the road test.\nToo young to drive.', feedback: 'Only one branch of the outer `if` runs.' },
      ],
      answer: 0,
      explanation: 'The outer condition `age >= 16` is false, so Java jumps straight to the outer `else`. The permit does not matter, since the inner `if` is never reached.',
    },
    {
      id: 'u6l5-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'braces',
      prompt: 'Fill in the missing symbol so the braces match up.',
      code: j`
int x = 4;
if (x > 0) {
    if (x % 2 == 0) {
        System.out.println("positive even");
    ___
}`,
      blanks: [['}']],
      bank: ['}', '{', ')', ';'],
      expectedOutput: 'positive even',
      explanation: 'Every opening brace needs its own closing brace. The inner `if` needs one before the outer `if` can be closed. Good indentation makes it easy to see which one is missing.',
    },
    {
      id: 'u6l5-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'nesting',
      prompt: 'What does this program print?',
      code: j`
int score = 85;
boolean late = true;
if (score >= 50) {
    if (late) {
        score -= 10;
    }
    System.out.println("Final: " + score);
} else {
    System.out.println("Retake");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Final: 75' },
        { text: 'Final: 85', feedback: 'The student handed it in late, so a penalty applies.' },
        { text: 'Retake', feedback: '85 is well above 50, so the outer condition is true.' },
        { text: 'Final: 95', feedback: 'The `-=` takes points away.' },
      ],
      answer: 0,
      explanation: '85 passes the outer check, and `late` is true, so 10 points are taken off. The `println` is inside the outer block but outside the inner one, so it always runs after the inner check. It prints 75.',
    },
    {
      id: 'u6l5-08',
      type: 'error-type',
      difficulty: 3,
      concept: 'dangling-else',
      prompt: 'The programmer wants the message `b is not positive` to print here. What kind of problem does this code have?',
      code: j`
int a = 5;
int b = -1;
if (a > 0)
    if (b > 0)
        System.out.println("both positive");
else
    System.out.println("a is not positive");`,
      answer: 'logic',
      feedback: {
        syntax: 'The code compiles fine. Java can read it.',
        runtime: 'Nothing crashes, and the program runs to the end.',
        none: 'The program prints something misleading. Read the output carefully.',
      },
      highlightLines: [6],
      explanation: 'Without braces, an `else` always belongs to the **nearest** `if`, no matter how you indent it. So this `else` is paired with `if (b > 0)`, and the program prints `a is not positive`, which is false. Always use braces!',
    },
    {
      id: 'u6l5-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'nesting',
      prompt: 'This program should print `Get a permit first`, but it prints `Road test booked`. Tap the line with the bug.',
      code: j`
int age = 17;
boolean hasPermit = false;
if (age >= 16) {
    if (age >= 16) {
        System.out.println("Road test booked");
    } else {
        System.out.println("Get a permit first");
    }
}`,
      bugLines: [4],
      fixedCode: j`
int age = 17;
boolean hasPermit = false;
if (age >= 16) {
    if (hasPermit) {
        System.out.println("Road test booked");
    } else {
        System.out.println("Get a permit first");
    }
}`,
      bugKind: 'logic',
      explanation: 'The inner `if` repeats the age check instead of checking the permit, so it can never fail. Remember that the inner question should ask something new.',
    },
    {
      id: 'u6l5-10',
      type: 'type-output',
      difficulty: 3,
      concept: 'nesting',
      prompt: 'Type exactly what this program prints.',
      code: j`
int n = 15;
if (n % 3 == 0) {
    if (n % 5 == 0) {
        System.out.println("FizzBuzz");
    } else {
        System.out.println("Fizz");
    }
} else {
    System.out.println(n);
}`,
      answer: 'FizzBuzz',
      explanation: '15 divides evenly by 3, so we go into the outer block. It also divides evenly by 5, so the inner `if` is true and we print `FizzBuzz`.',
    },
    {
      id: 'u6l5-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'nesting',
      prompt: 'Read a mark and an attendance percentage. If the mark is at least 50, check the attendance: at least 80 prints `Credit earned`, otherwise `Attendance too low`. If the mark is below 50, print `Mark too low`. Use a nested `if`.',
      starter: j`
Scanner console = new Scanner(System.in);
int mark = console.nextInt();
int attendance = console.nextInt();
// decide what to print
`,
      solution: j`
Scanner console = new Scanner(System.in);
int mark = console.nextInt();
int attendance = console.nextInt();
if (mark >= 50) {
    if (attendance >= 80) {
        System.out.println("Credit earned");
    } else {
        System.out.println("Attendance too low");
    }
} else {
    System.out.println("Mark too low");
}`,
      tests: [
        { label: 'credit', stdin: '75 90\n', output: 'Credit earned' },
        { label: 'low attendance', stdin: '75 60\n', output: 'Attendance too low' },
        { label: 'low mark', stdin: '40 95\n', output: 'Mark too low' },
      ],
      mustInclude: [{ pattern: 'if\\s*\\([^]*if\\s*\\(', message: 'Put one `if` inside the other.' }],
      explanation: 'The outer `if` checks the mark. Only when it passes do we look at the attendance, which is the inner `if`.',
    },
  ]),

  // ---------------- Lesson 6: Logical operators ----------------
  ...topic('boolean-logic', [
    {
      id: 'u6l6-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'operators',
      prompt: 'Which operator means **AND**, where both sides have to be true?',
      optionStyle: 'code',
      options: [
        { text: '&&' },
        { text: '||', feedback: 'That is OR. It needs just one side to be true.' },
        { text: '!', feedback: 'That is NOT. It flips true to false and false to true.' },
        { text: '^', feedback: 'That is XOR. It is true when exactly one side is true.' },
      ],
      answer: 0,
      explanation: 'Remember it this way: two ampersands for AND, two bars for OR, an exclamation mark for NOT, and a caret for XOR.',
    },
    {
      id: 'u6l6-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'and',
      prompt: '`true && false` works out to `true`.',
      answer: false,
      wrongFeedback: 'AND needs both sides to be true. One of them is false, so the answer is false.',
      explanation: 'With `&&`, one false is enough to make the whole thing false. It is like needing both a ticket and a seat.',
    },
    {
      id: 'u6l6-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'or',
      prompt: 'What does this program print?',
      code: j`System.out.println(true || false);`,
      optionStyle: 'output',
      options: [
        { text: 'true' },
        { text: 'false', feedback: 'OR only needs one side to be true, and the left side is.' },
        { text: 'truefalse', feedback: 'The `||` is an operator that combines the two sides. It does not join them as text.' },
        { text: 'Compile error', feedback: 'This is valid Java.' },
      ],
      answer: 0,
      explanation: '`||` is OR. It is true as long as at least one side is true. It is only false when both sides are false.',
    },
    {
      id: 'u6l6-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'not',
      prompt: 'What does this program print?',
      code: j`System.out.println(!(5 > 3));`,
      optionStyle: 'output',
      options: [
        { text: 'false' },
        { text: 'true', feedback: '`5 > 3` is true, and the `!` flips it.' },
        { text: '-2', feedback: 'There is no subtraction here. The `!` operator only flips a boolean.' },
        { text: '5 > 3', feedback: 'Java works out the comparison, flips it, and prints the result.' },
      ],
      answer: 0,
      explanation: '`5 > 3` is true, and `!` means NOT, so it flips the answer to false.',
    },
    {
      id: 'u6l6-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'truth-table',
      prompt: 'What does this program print?',
      code: j`
boolean a = true;
boolean b = true;
System.out.println(a && b);
System.out.println(a ^ b);
System.out.println(!a || b);`,
      optionStyle: 'output',
      options: [
        { text: 'true\nfalse\ntrue' },
        { text: 'true\ntrue\ntrue', feedback: 'XOR is only true when exactly one side is true. Here both are true.' },
        { text: 'true\nfalse\nfalse', feedback: 'In the last line, `!a` is false, but `b` is true, and OR only needs one true side.' },
        { text: 'false\nfalse\ntrue', feedback: 'AND is true when both sides are true, and here both are.' },
      ],
      answer: 0,
      explanation: '`true && true` is true. XOR needs exactly one true side, so `true ^ true` is false. Then `!a` is false and `b` is true, and `false || true` is true.',
    },
    {
      id: 'u6l6-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'and',
      prompt: 'It is 5 degrees. Fill in the operator so the program asks whether the temperature is between -10 and 0.',
      code: j`
int temperature = 5;
System.out.println(temperature > -10 ___ temperature < 0);`,
      blanks: [['&&']],
      bank: ['&&', '||', '^', '>'],
      expectedOutput: 'false',
      explanation: 'It has to be above -10 **and** below 0, so `&&`. At 5 degrees the second part is false, and that makes the whole thing false. With `||`, it would wrongly come out as true.',
    },
    {
      id: 'u6l6-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'xor',
      prompt: 'What does this program print?',
      code: j`
boolean rain = true;
boolean sun = true;
System.out.println(rain ^ sun);
System.out.println(rain || sun);
System.out.println(rain && !sun);`,
      optionStyle: 'output',
      options: [
        { text: 'false\ntrue\nfalse' },
        { text: 'true\ntrue\nfalse', feedback: 'XOR is only true when exactly one of them is true. Here both are.' },
        { text: 'false\ntrue\ntrue', feedback: 'In the last line, `!sun` is false, so the AND cannot be true.' },
        { text: 'false\nfalse\nfalse', feedback: 'OR is true as soon as one side is true, and both are here.' },
      ],
      answer: 0,
      explanation: 'XOR means "one or the other, but not both", so it is false when both are true. OR is true. And `rain && !sun` is `true && false`, which is false.',
    },
    {
      id: 'u6l6-08',
      type: 'error-type',
      difficulty: 3,
      concept: 'and',
      prompt: 'What happens when we try to run this code?',
      code: j`
int x = 5;
boolean inRange = 1 < x < 10;
System.out.println(inRange);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'The program does not run, so it cannot give a wrong answer.',
        none: 'Java does not allow a comparison chain like in math class.',
      },
      highlightLines: [2],
      explanation: 'You cannot chain comparisons. Write it as two separate questions joined with AND: `1 < x && x < 10`.',
    },
    {
      id: 'u6l6-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'or-vs-and',
      prompt: 'This program should print `Out of range` for 25, but it prints `In range`. Tap the line with the bug.',
      code: j`
int x = 25;
if (x >= 1 || x <= 10) {
    System.out.println("In range");
} else {
    System.out.println("Out of range");
}`,
      bugLines: [2],
      fixedCode: j`
int x = 25;
if (x >= 1 && x <= 10) {
    System.out.println("In range");
} else {
    System.out.println("Out of range");
}`,
      bugKind: 'logic',
      explanation: 'Being in range means **both** things must be true, so it needs `&&`. With `||`, almost every number passes, because it is either above 1 or below 10.',
    },
    {
      id: 'u6l6-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'or',
      prompt: 'Read an age. Children under 13 and seniors 65 or older get a discount. Print `Discount` for them and `Full price` for everyone else.',
      starter: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
// decide which message to print
`,
      solution: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
if (age < 13 || age >= 65) {
    System.out.println("Discount");
} else {
    System.out.println("Full price");
}`,
      tests: [
        { label: 'a child', stdin: '10\n', output: 'Discount' },
        { label: 'a senior', stdin: '70\n', output: 'Discount' },
        { label: 'an adult', stdin: '30\n', output: 'Full price' },
        { label: 'exactly 13', stdin: '13\n', output: 'Full price' },
        { label: 'exactly 65', stdin: '65\n', output: 'Discount' },
      ],
      mustInclude: [{ pattern: '\\|\\|', message: 'Use `||` to join the two conditions.' }],
      explanation: 'Either condition is enough to earn the discount, so we join them with OR. Test the edges, 13 and 65, to be sure that you used `<` and `>=` correctly.',
    },
  ]),

  // ---------------- Unit 6 checkpoint ----------------
  ...topic('expressions', [
    {
      id: 'u6cp-01',
      type: 'predict-output',
      difficulty: 2,
      concept: 'mixed',
      prompt: 'What does this program print?',
      code: j`
int a = 8;
int b = 12;
System.out.println(a < b);
System.out.println(b - a == 5);
System.out.println(a * 2 >= b);`,
      optionStyle: 'output',
      options: [
        { text: 'true\nfalse\ntrue' },
        { text: 'true\ntrue\ntrue', feedback: 'On line 2, `b - a` is 4, and 4 is not equal to 5.' },
        { text: 'true\nfalse\nfalse', feedback: 'On line 3, `a * 2` is 16, and 16 is at least 12.' },
        { text: 'false\nfalse\ntrue', feedback: 'On line 1, 8 is less than 12.' },
      ],
      answer: 0,
      explanation: 'The arithmetic is done first, and then the comparison. 8 < 12 is true, 4 == 5 is false, and 16 >= 12 is true.',
    },
  ]),
  ...topic('conditionals', [
    {
      id: 'u6cp-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'chain',
      prompt: 'What does this program print?',
      code: j`
int age = 15;
if (age < 13) {
    System.out.println("child");
} else if (age < 18) {
    System.out.println("teen");
} else {
    System.out.println("adult");
}
System.out.println("done");`,
      optionStyle: 'output',
      options: [
        { text: 'teen\ndone' },
        { text: 'child\nteen\ndone', feedback: 'The chain stops at the first true condition, and 15 is not under 13.' },
        { text: 'teen', feedback: 'The last line is outside the chain, so it always runs.' },
        { text: 'adult\ndone', feedback: '15 is under 18, so the second branch is chosen before the `else`.' },
      ],
      answer: 0,
      explanation: '15 is not under 13, but it is under 18, so `teen` is printed. The chain ends there, and `done` runs because it sits outside it.',
    },
    {
      id: 'u6cp-03',
      type: 'error-type',
      difficulty: 2,
      concept: 'semicolon',
      prompt: '`Warm up!` should only print when `temp` is above 20. What kind of problem does this code have?',
      code: j`
int temp = 12;
if (temp > 20);
    System.out.println("Warm up!");`,
      answer: 'logic',
      feedback: {
        syntax: 'It compiles without complaint.',
        runtime: 'Nothing crashes.',
        none: 'The temperature is 12, so should it print `Warm up!`?',
      },
      highlightLines: [2],
      explanation: 'The semicolon right after the condition is an empty statement, which becomes the body of the `if`. The `println` below is no longer controlled by it, so it always runs.',
    },
  ]),
  ...topic('nested-if', [
    {
      id: 'u6cp-04',
      type: 'predict-output',
      difficulty: 3,
      concept: 'nesting',
      prompt: 'What does this program print?',
      code: j`
int a = 12;
int b = 7;
if (a > 10) {
    if (b > 10) {
        System.out.println("A");
    } else if (b > 5) {
        System.out.println("B");
    } else {
        System.out.println("C");
    }
} else {
    System.out.println("D");
}`,
      optionStyle: 'output',
      options: [
        { text: 'B' },
        { text: 'A', feedback: 'The inner check `b > 10` is false, since `b` is 7.' },
        { text: 'C', feedback: '7 is greater than 5, so the `else if` runs before the `else`.' },
        { text: 'D', feedback: '`a` is 12, which is greater than 10, so we go into the outer block.' },
      ],
      answer: 0,
      explanation: '`a > 10` is true, so we go inside. Then `b > 10` is false, but `b > 5` is true, so `B` is printed.',
    },
  ]),
  ...topic('boolean-logic', [
    {
      id: 'u6cp-05',
      type: 'find-bug',
      difficulty: 3,
      concept: 'or-vs-and',
      prompt: 'A person can take the road test only if they are 16 or older **and** have a permit. This program says yes for a 20 year old with no permit. Tap the line with the bug.',
      code: j`
int age = 20;
boolean hasPermit = false;
if (age >= 16 || hasPermit) {
    System.out.println("Book the test");
} else {
    System.out.println("Not yet");
}`,
      bugLines: [3],
      fixedCode: j`
int age = 20;
boolean hasPermit = false;
if (age >= 16 && hasPermit) {
    System.out.println("Book the test");
} else {
    System.out.println("Not yet");
}`,
      bugKind: 'logic',
      explanation: 'When both things are required, the operator is `&&`. With `||` one true side is enough, so the age alone lets them through.',
    },
  ]),
  ...topic('conditionals', [
    {
      id: 'u6cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'chain',
      prompt: 'Read a whole number. Print `positive` if it is above zero, `negative` if it is below zero, and `zero` if it is exactly zero.',
      starter: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
// decide which word to print
`,
      solution: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
if (n > 0) {
    System.out.println("positive");
} else if (n < 0) {
    System.out.println("negative");
} else {
    System.out.println("zero");
}`,
      tests: [
        { label: 'positive', stdin: '5\n', output: 'positive' },
        { label: 'negative', stdin: '-3\n', output: 'negative' },
        { label: 'zero', stdin: '0\n', output: 'zero' },
      ],
      mustInclude: [{ pattern: 'else\\s+if', message: 'Use an `else if` for the middle case.' }],
      explanation: 'Three outcomes need a chain: check one, then the other, and let the `else` catch whatever is left, which is zero.',
    },
  ]),
]

export const unit6: UnitContent = {
  questions,
  unit: {
    id: 'u6',
    number: 6,
    title: 'Making Decisions',
    tagline: 'Expressions, if and else, and combining conditions with logic.',
    color: 'mint',
    icon: 'git-branch',
    topics: ['expressions', 'conditionals', 'nested-if', 'boolean-logic'],
    checkpoint: ['u6cp-01', 'u6cp-02', 'u6cp-03', 'u6cp-04', 'u6cp-05', 'u6cp-06'],
    lessons: [
      {
        id: 'u6-l1',
        unitId: 'u6',
        title: 'Statements and Expressions',
        summary: 'Numerical and logical expressions.',
        topic: 'expressions',
        teach: [
          {
            kind: 'concept',
            title: 'Two words you will hear all year',
            what: 'A **statement** is a complete instruction, like `int x = 5;` or `System.out.println(x);`, and it ends with a semicolon. An **expression** is a piece of code that works out to a single value. A **numerical expression**, like `3 + 4 * 2`, works out to a number. A **logical expression**, like `age > 16`, works out to `true` or `false`.',
            why: 'Decisions in a program are always based on a logical expression. Before you can write an `if` statement, you need to be comfortable with the question inside the brackets, and know that its answer is always true or false.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Numbers in, true or false out',
            how: 'Each line is a statement. Inside the statements are expressions, some numerical and some logical. The boolean variables store the answers to yes or no questions.',
            code: j`
int age = 17;
int next = age + 1;
boolean canDrive = age > 16;
boolean isTeen = age >= 13 && age <= 19;
System.out.println(next);
System.out.println(canDrive);
System.out.println(isTeen);`,
            notes: [
              { line: 2, text: 'A numerical expression: age + 1 works out to 18.' },
              { line: 3, text: 'A logical expression: is age greater than 16? True.' },
              { line: 4, text: 'Two questions joined with AND. We will study that soon.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Ask yourself one question',
            body: 'Whenever you see an expression, ask: what does this work out to? If the answer is a number, it is numerical. If it is true or false, it is logical.',
            bullets: [
              'Arithmetic is done first, and then the comparison, like in `a - b > 4`.',
              'A logical expression is stored in a `boolean` variable, and never in an `int`.',
              'Brackets can always make the order clear.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Storing a comparison in an int',
            body: 'A comparison works out to true or false, and an `int` has no room for that. You need a `boolean`.',
            wrong: j`
int result = 7 > 3;
System.out.println(result);`,
            right: j`
boolean result = 7 > 3;
System.out.println(result);`,
          },
        ],
        questions: ['u6l1-01', 'u6l1-02', 'u6l1-03', 'u6l1-04', 'u6l1-05', 'u6l1-06', 'u6l1-07', 'u6l1-08', 'u6l1-09'],
        challenge: 'u6l1-10',
      },
      {
        id: 'u6-l2',
        unitId: 'u6',
        title: 'Relational Operators',
        summary: '==, !=, <, >, <= and >=.',
        topic: 'expressions',
        teach: [
          {
            kind: 'concept',
            title: 'Six ways to compare',
            what: '**Relational operators** compare two values and give back `true` or `false`. There are six of them: `==` is equal to, `!=` is not equal to, `<` is less than, `>` is greater than, `<=` is less than or equal to, and `>=` is greater than or equal to.',
            why: 'These are the questions your program asks before it decides anything: is the score high enough, is the password right, is it older than 65. Every `if` and every loop is built on one of these six.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Asking six questions about a grade',
            how: 'The variable `grade` holds 11. Every line asks a different question, and the answer is always true or false.',
            code: j`
int grade = 11;
System.out.println(grade == 10);
System.out.println(grade != 12);
System.out.println(grade < 12);
System.out.println(grade > 11);
System.out.println(grade <= 11);
System.out.println(grade >= 12);`,
            notes: [
              { line: 2, text: 'Is it equal to 10? No, so false.' },
              { line: 3, text: 'Is it different from 12? Yes, so true.' },
              { line: 5, text: 'Is it greater than 11? No. It is 11, and that is not more than 11, so false.' },
              { line: 6, text: '<= includes the case where they are equal, so true.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Three things to remember',
            body: 'These are the mistakes I see most often, so I will say them once now.',
            bullets: [
              '`=` stores a value. `==` asks a question. Mixing them up is the number one bug.',
              'In `<=` and `>=`, the equals sign always comes second.',
              'You cannot chain comparisons like `1 < x < 10`. We will fix that with logical operators.',
              'To compare Strings, use `.equals()` and not `==`. We will see that when we need it.',
            ],
          },
          {
            kind: 'mistake',
            title: 'One equals sign instead of two',
            body: 'A single equals sign stores a value, so the result is a number, and not a true or false.',
            wrong: j`
int x = 5;
boolean same = x = 5;
System.out.println(same);`,
            right: j`
int x = 5;
boolean same = x == 5;
System.out.println(same);`,
          },
        ],
        questions: ['u6l2-01', 'u6l2-02', 'u6l2-03', 'u6l2-04', 'u6l2-05', 'u6l2-06', 'u6l2-07', 'u6l2-08', 'u6l2-09', 'u6l2-10'],
        challenge: 'u6l2-11',
      },
      {
        id: 'u6-l3',
        unitId: 'u6',
        title: 'if and else',
        summary: 'Run code only when a condition is true.',
        topic: 'conditionals',
        teach: [
          {
            kind: 'concept',
            title: 'Teaching your program to choose',
            what: 'An `if` statement runs a block of code **only when its condition is true**. Think of the rule for getting a driver\'s licence. If you are 16 or older, you can get one. Otherwise, you cannot yet. An `else` block holds what happens when the condition is false.',
            why: 'Without `if`, a program does the same thing every time. With it, your program can react to the user, to the data, and to whatever else is going on, which is what makes it feel smart.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'The licence rule',
            how: 'The condition sits in round brackets, and each block sits in curly braces. Exactly one of the two blocks will run. The last line is outside both, so it always runs.',
            code: j`
int age = 15;
if (age >= 16) {
    System.out.println("You can get a licence.");
} else {
    System.out.println("Not yet. Come back in " + (16 - age) + " year(s).");
}
System.out.println("Thanks for asking!");`,
            notes: [
              { line: 2, text: 'The condition. Is age at least 16?' },
              { line: 3, text: 'Runs only when the condition is true.' },
              { line: 5, text: 'Runs only when the condition is false.' },
              { line: 7, text: 'Outside the braces, so it runs no matter what.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Habits that prevent bugs',
            body: 'These are all things I mark down for on every test, so get used to them early.',
            bullets: [
              'Always use curly braces, even for a single line.',
              'Indent the code inside each block so you can see its shape.',
              'Never put a semicolon right after the brackets of an `if`.',
              'Test the boundaries. If the rule says 16, try 15, 16 and 17.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The sneaky semicolon',
            body: 'A semicolon after the condition ends the `if` right there. The block below it then runs every single time, and Java will not warn you.',
            wrong: j`
int age = 10;
if (age >= 16);
{
    System.out.println("You can get a licence.");
}`,
            right: j`
int age = 10;
if (age >= 16) {
    System.out.println("You can get a licence.");
} else {
    System.out.println("Not old enough yet.");
}`,
          },
        ],
        questions: ['u6l3-01', 'u6l3-02', 'u6l3-03', 'u6l3-04', 'u6l3-05', 'u6l3-06', 'u6l3-07', 'u6l3-08', 'u6l3-09', 'u6l3-10'],
        challenge: 'u6l3-11',
      },
      {
        id: 'u6-l4',
        unitId: 'u6',
        title: 'else if Chains',
        summary: 'Choosing between more than two options.',
        topic: 'conditionals',
        teach: [
          {
            kind: 'concept',
            title: 'When two options are not enough',
            what: 'Sometimes there are more than two outcomes, like the letter grades A, B, C and D. An `else if` chain checks the conditions **from the top down** and runs only the first block whose condition is true. Everything below it is skipped.',
            why: 'Real decisions rarely come in just two flavours. Chains let you handle grades, ticket prices and menu choices without having to write a pile of separate `if` statements that can all fire at once.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Turning a mark into a letter',
            how: 'The mark is 83. Java checks the first condition and it is false, so it moves on. The second is true, so it prints B and ignores everything after that.',
            code: j`
int mark = 83;
if (mark >= 90) {
    System.out.println("A");
} else if (mark >= 80) {
    System.out.println("B");
} else if (mark >= 70) {
    System.out.println("C");
} else {
    System.out.println("Keep practising");
}`,
            notes: [
              { line: 2, text: 'Checked first. 83 is not at least 90.' },
              { line: 4, text: 'Checked second. 83 is at least 80, so this block runs.' },
              { line: 6, text: 'Never even looked at, because a block above already ran.' },
              { line: 8, text: 'The else catches everything that did not match.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Order is everything',
            body: 'Because Java stops at the first true condition, the order of your chain really matters.',
            bullets: [
              'Put the strictest condition first and work down. Check 90 before 80.',
              'The final `else` is optional, and it catches whatever is left over.',
              'Separate `if` statements are independent, and every one of them is checked.',
              'An `else if` chain is one decision with many options, and only one block runs.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The conditions in the wrong order',
            body: 'The loosest condition is at the top, so it catches everything first. A 95 should get an A, but it gets a C.',
            wrong: j`
int mark = 95;
if (mark >= 70) {
    System.out.println("C");
} else if (mark >= 90) {
    System.out.println("A");
}`,
            right: j`
int mark = 95;
if (mark >= 90) {
    System.out.println("A");
} else if (mark >= 70) {
    System.out.println("C");
}`,
          },
        ],
        questions: ['u6l4-01', 'u6l4-02', 'u6l4-03', 'u6l4-04', 'u6l4-05', 'u6l4-06', 'u6l4-07', 'u6l4-08', 'u6l4-09', 'u6l4-10'],
        challenge: 'u6l4-11',
      },
      {
        id: 'u6-l5',
        unitId: 'u6',
        title: 'Nested ifs',
        summary: 'An if inside another if.',
        topic: 'nested-if',
        teach: [
          {
            kind: 'concept',
            title: 'A decision inside a decision',
            what: 'A **nested if** is an `if` placed inside another `if`. If the outer condition is true, Java goes inside and checks the other condition. If the outer one is false, the whole inner block is skipped, so the inner question is never even asked.',
            why: 'Real rules often have steps. To get your road test, you must be 16 **and then** you must also have a permit. Nesting lets your program ask the second question only once the first one has been answered.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'The road test, one step at a time',
            how: 'The outer `if` checks the age. Only if that passes do we look at the permit, with the inner `if`.',
            code: j`
int age = 17;
boolean hasPermit = true;
if (age >= 16) {
    if (hasPermit) {
        System.out.println("You can take the road test.");
    } else {
        System.out.println("Get a permit first.");
    }
} else {
    System.out.println("Too young to drive.");
}`,
            notes: [
              { line: 3, text: 'The outer question comes first. Is the person 16 or older?' },
              { line: 4, text: 'Only asked when age passed. Does the person have a permit?' },
              { line: 9, text: 'The outer else. This is for people who are too young.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Keeping nested code readable',
            body: 'Nesting gets confusing fast, so I want you to build good habits right from the start.',
            bullets: [
              'Indent every level a bit more, so you can see which block is which.',
              'Always use braces, so the `else` goes with the `if` you meant.',
              'Count your braces. Every `{` needs a matching `}`.',
              'Often a nested `if` can be written as one `if` with `&&`, and we will do that in the next lesson.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The else that belongs to the wrong if',
            body: 'Without braces, an `else` joins the **nearest** `if`, no matter how you indent it. This program prints something that is not true.',
            wrong: j`
int a = 5;
int b = -1;
if (a > 0)
    if (b > 0)
        System.out.println("both positive");
else
    System.out.println("a is not positive");`,
            right: j`
int a = 5;
int b = -1;
if (a > 0) {
    if (b > 0) {
        System.out.println("both positive");
    } else {
        System.out.println("b is not positive");
    }
} else {
    System.out.println("a is not positive");
}`,
          },
        ],
        questions: ['u6l5-01', 'u6l5-02', 'u6l5-03', 'u6l5-04', 'u6l5-05', 'u6l5-06', 'u6l5-07', 'u6l5-08', 'u6l5-09', 'u6l5-10'],
        challenge: 'u6l5-11',
      },
      {
        id: 'u6-l6',
        unitId: 'u6',
        title: 'Logical Operators and Truth Tables',
        summary: 'AND, OR, NOT and XOR.',
        topic: 'boolean-logic',
        teach: [
          {
            kind: 'concept',
            title: 'Combining questions',
            what: 'Logical operators join true-or-false answers together. `&&` is **AND**, which needs both sides to be true. `||` is **OR**, which needs at least one side to be true. `!` is **NOT**, which flips true to false and false to true. And `^` is **XOR**, which is true only when exactly one side is true.',
            why: 'Most real rules combine several conditions. "Between -10 and 0 degrees" is two questions joined with AND. "Under 13 or over 65" is two questions joined with OR. These four operators let you write rules the way you would say them out loud.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Trying out all four',
            how: 'One variable is true and the other is false. See how each operator treats them, and then check the temperature rule below.',
            code: j`
boolean a = true;
boolean b = false;
System.out.println("a && b = " + (a && b));
System.out.println("a || b = " + (a || b));
System.out.println("!a = " + (!a));
System.out.println("a ^ b = " + (a ^ b));
int temperature = -5;
System.out.println(temperature > -10 && temperature < 0);`,
            notes: [
              { line: 3, text: 'AND needs both to be true. One is false, so false.' },
              { line: 4, text: 'OR needs just one. One is true, so true.' },
              { line: 5, text: 'NOT flips a. It was true, so now it is false.' },
              { line: 6, text: 'XOR wants exactly one true. That is the case here, so true.' },
              { line: 8, text: 'Two questions, one answer. Is it above -10 and also below 0? Yes.' },
            ],
          },
          {
            kind: 'tip',
            title: 'The truth table',
            body: 'A truth table lists every possible combination, so there are no surprises. Keep this one handy for the test.',
            code: `  a      b      a && b   a || b   a ^ b
  true   true   true     true     false
  true   false  false    true     true
  false  true   false    true     true
  false  false  false    false    false`,
            bullets: [
              'AND is true only when **both** are true.',
              'OR is false only when **both** are false.',
              'XOR is true when the two are **different**.',
              '`!(grade == 12)` means the same thing as `grade != 12`.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Chaining comparisons like in math class',
            body: 'In math class you can write `1 < x < 10`, but Java reads one comparison at a time. Break it into two questions and join them with AND.',
            wrong: j`
int x = 5;
boolean ok = 1 < x < 10;
System.out.println(ok);`,
            right: j`
int x = 5;
boolean ok = 1 < x && x < 10;
System.out.println(ok);`,
          },
        ],
        questions: ['u6l6-01', 'u6l6-02', 'u6l6-03', 'u6l6-04', 'u6l6-05', 'u6l6-06', 'u6l6-07', 'u6l6-08', 'u6l6-09'],
        challenge: 'u6l6-10',
      },
    ],
  },
}
