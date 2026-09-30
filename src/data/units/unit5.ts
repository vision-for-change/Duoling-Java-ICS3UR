import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  ...topic('input', [
    // ---------------- Lesson 1: Scanner ----------------
    {
      id: 'sc-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'scanner',
      prompt: 'Which line creates a Scanner that reads what the user types?',
      optionStyle: 'code',
      options: [
        { text: 'Scanner in = new Scanner(System.in);' },
        { text: 'Scanner in = new Scanner(System.out);', feedback: '`System.out` is for printing. Input comes from `System.in`.' },
        { text: 'Scanner in = Scanner();', feedback: 'Creating an object needs the keyword `new`.' },
        { text: 'Scanner in = new Scanner();', feedback: 'You must tell the Scanner WHERE to read from: `System.in`.' },
      ],
      answer: 0,
      explanation: '`new Scanner(System.in)` creates a Scanner connected to the keyboard (standard input).',
    },
    {
      id: 'sc-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'import',
      prompt: 'Which import do you need at the top of your file to use `Scanner`?',
      optionStyle: 'code',
      options: [
        { text: 'import java.util.Scanner;' },
        { text: 'import java.io.Scanner;', feedback: 'Scanner lives in the `java.util` package.' },
        { text: 'import Scanner;', feedback: 'Imports need the full package name.' },
        { text: 'No import is needed', feedback: 'Classes like String and Math are automatic, but Scanner lives in java.util and must be imported.' },
      ],
      answer: 0,
      explanation: 'Scanner is in the `java.util` package: `import java.util.Scanner;` (or `import java.util.*;`).',
    },
    {
      id: 'sc-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'next-int',
      prompt: 'The user types `7`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
System.out.println(n * n);`,
      stdin: '7\n',
      optionStyle: 'output',
      options: [
        { text: '49' },
        { text: '7', feedback: 'The program prints n * n, not n.' },
        { text: '77', feedback: 'n is an int, so * multiplies.' },
        { text: '14' },
      ],
      answer: 0,
      explanation: '`nextInt()` reads 7 as an int, and 7 * 7 = 49.',
    },
    {
      id: 'sc-04',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'next-vs-nextline',
      prompt: 'The user types `Ada Lovelace` and presses Enter. What does `in.next()` return?',
      optionStyle: 'code',
      options: [
        { text: '"Ada"' },
        { text: '"Ada Lovelace"', feedback: '`next()` reads ONE word (up to a space). `nextLine()` reads the whole line.' },
        { text: '"Lovelace"' },
        { text: '"A"', feedback: 'next() reads a whole word, not a single character.' },
      ],
      answer: 0,
      explanation: '`next()` reads a single token: characters up to the next space. The rest ("Lovelace") stays waiting in the input.',
    },
    {
      id: 'sc-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'nextline-pitfall',
      prompt: 'The user types `15`, presses Enter, types `Byte`, presses Enter. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int age = in.nextInt();
String name = in.nextLine();
System.out.println("Hi " + name + "!");`,
      stdin: '15\nByte\n',
      optionStyle: 'output',
      options: [
        { text: 'Hi !' },
        { text: 'Hi Byte!', feedback: 'nextInt() left the Enter (newline) after 15 behind. nextLine() reads that empty leftover.' },
        { text: 'Hi 15!' },
        { text: 'The program crashes' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: '`nextInt()` reads "15" but leaves the newline. `nextLine()` then returns the rest of that line: an empty String. Fix: call `in.nextLine();` once after nextInt() to skip it.',
    },
    {
      id: 'sc-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'next-double',
      prompt: 'The user types `2.5`. Pick the method that reads it correctly.',
      code: j`
Scanner in = new Scanner(System.in);
double miles = in.___();
System.out.println(miles * 1.6);`,
      stdin: '2.5\n',
      blanks: [['nextDouble']],
      bank: ['nextDouble', 'nextInt', 'nextLine', 'next'],
      explanation: '2.5 is a decimal, so use `nextDouble()`. `nextInt()` would crash on "2.5", and `next()`/`nextLine()` return Strings.',
    },
    {
      id: 'sc-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'next-int',
      prompt: 'The user types `3 4` and presses Enter. Type exactly what is printed.',
      code: j`
Scanner in = new Scanner(System.in);
int w = in.nextInt();
int h = in.nextInt();
System.out.println("Area: " + w * h);`,
      stdin: '3 4\n',
      answer: 'Area: 12',
      explanation: 'Each `nextInt()` reads one number, and spaces separate them: w = 3, h = 4, so the area is 12.',
    },
    {
      id: 'sc-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'next-int',
      prompt: 'Read two whole numbers. Print `Sum: ` followed by their sum, then `Average: ` followed by their average as a decimal.',
      starter: j`
Scanner in = new Scanner(System.in);
// read two ints, then print the sum and the average
`,
      solution: j`
Scanner in = new Scanner(System.in);
int a = in.nextInt();
int b = in.nextInt();
System.out.println("Sum: " + (a + b));
System.out.println("Average: " + (a + b) / 2.0);`,
      tests: [
        { label: 'input: 3 4', stdin: '3 4\n', output: 'Sum: 7\nAverage: 3.5' },
        { label: 'input: 10 20', stdin: '10 20\n', output: 'Sum: 30\nAverage: 15.0' },
      ],
      hint: 'Put the sum in parentheses inside the String, and divide by 2.0 (not 2) for a decimal average.',
      explanation: '`(a + b)` needs parentheses so it\'s added before joining text, and dividing by `2.0` keeps the decimal part.',
    },

    // ---------------- Lesson 2: hasNextInt() ----------------
    {
      id: 'hn-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'has-next-int',
      prompt: 'The user typed `hello`. What does `in.hasNextInt()` return?',
      optionStyle: 'code',
      options: [
        { text: 'false' },
        { text: 'true', feedback: '"hello" isn\'t a whole number.' },
        { text: '"hello"', feedback: 'hasNextInt() only answers yes/no: it returns a boolean.' },
        { text: 'It crashes', feedback: 'hasNextInt() never crashes on bad input; it just answers false. That\'s the point!' },
      ],
      answer: 0,
      explanation: '`hasNextInt()` peeks at the next input and returns true only if it\'s a whole number.',
    },
    {
      id: 'hn-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'has-next-int',
      prompt: '`hasNextInt()` removes the number from the input, so you can\'t read it afterwards.',
      answer: false,
      wrongFeedback: 'It only PEEKS. The input stays there for nextInt() to read.',
      explanation: '`hasNextInt()` just looks. Nothing is consumed until you call `nextInt()` (or `next()`).',
    },
    {
      id: 'hn-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'has-next-int',
      prompt: 'The user types `abc`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
if (in.hasNextInt()) {
    System.out.println("Number: " + in.nextInt());
} else {
    System.out.println("Not a number: " + in.next());
}`,
      stdin: 'abc\n',
      optionStyle: 'output',
      options: [
        { text: 'Not a number: abc' },
        { text: 'Number: abc' },
        { text: 'The program crashes', feedback: 'We check with hasNextInt() first, so nextInt() is never called on "abc".' },
        { text: 'Not a number: ' },
      ],
      answer: 0,
      explanation: '"abc" isn\'t an int, so the else branch runs and `next()` reads the word "abc".',
    },
    {
      id: 'hn-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'validation-loop',
      prompt: 'The user types `x y 5`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int skipped = 0;
while (!in.hasNextInt()) {
    in.next();
    skipped++;
}
int n = in.nextInt();
System.out.println(n + " after " + skipped + " bad inputs");`,
      stdin: 'x y 5\n',
      optionStyle: 'output',
      options: [
        { text: '5 after 2 bad inputs' },
        { text: '5 after 0 bad inputs' },
        { text: '5 after 3 bad inputs', feedback: 'When the loop sees 5, hasNextInt() is true, so it stops without skipping it.' },
        { text: 'The program loops forever', feedback: '`in.next()` removes each bad word, so the loop makes progress.' },
      ],
      answer: 0,
      explanation: '"x" and "y" are skipped with `next()` (skipped = 2). Then hasNextInt() sees 5, the loop ends and nextInt() reads it.',
    },
    {
      id: 'hn-05',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'consume-bad-token',
      prompt: 'If the user types `fifteen`, this loop prints "Numbers only:" forever. What should be added inside the loop?',
      code: j`
Scanner in = new Scanner(System.in);
System.out.print("Age: ");
while (!in.hasNextInt()) {
    System.out.print("Numbers only: ");
}
int age = in.nextInt();`,
      optionStyle: 'code',
      options: [
        { text: 'in.next();' },
        { text: 'in.nextInt();', feedback: 'That would crash: the waiting input is "fifteen", not a number!' },
        { text: 'break;', feedback: 'That leaves the loop, but then nextInt() crashes on "fifteen".' },
        { text: 'in.hasNextInt();', feedback: 'It only peeks again: "fifteen" is still waiting.' },
      ],
      answer: 0,
      highlightLines: [3, 4],
      explanation: '`in.next()` throws away the bad word so hasNextInt() can look at the NEXT input. Without it, the loop sees "fifteen" forever.',
    },
    {
      id: 'hn-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'range-validation',
      prompt: 'Keep asking until the user enters a **positive** number. The user types `-3` then `8`.',
      code: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
while (n ___ 0) {
    System.out.println("Must be positive!");
    n = in.nextInt();
}
System.out.println("OK: " + n);`,
      stdin: '-3\n8\n',
      blanks: [['<=']],
      bank: ['<=', '>', '>=', '=='],
      expectedOutput: 'Must be positive!\nOK: 8',
      explanation: 'Repeat while the number is NOT positive: `n <= 0` (0 isn\'t positive either).',
    },
    {
      id: 'hn-07',
      type: 'write-code',
      difficulty: 3,
      concept: 'has-next-int',
      prompt: 'If the next input is a whole number, read it and print `You ordered N`. Otherwise print `Invalid`.',
      starter: j`
Scanner in = new Scanner(System.in);
// check the input with hasNextInt()
`,
      solution: j`
Scanner in = new Scanner(System.in);
if (in.hasNextInt()) {
    int n = in.nextInt();
    System.out.println("You ordered " + n);
} else {
    System.out.println("Invalid");
}`,
      tests: [
        { label: 'input: 3', stdin: '3\n', output: 'You ordered 3' },
        { label: 'input: three', stdin: 'three\n', output: 'Invalid' },
        { label: 'input: 2.5', stdin: '2.5\n', output: 'Invalid' },
      ],
      mustInclude: [{ pattern: 'hasNextInt\\s*\\(', message: 'Use hasNextInt() to check before reading.' }],
      explanation: 'Check first with `hasNextInt()`, and only call `nextInt()` when it\'s safe.',
    },
    {
      id: 'hn-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'validation-loop',
      prompt: 'Keep reading until the user enters a whole number from 1 to 10. Print `Not a number` for words (and skip them) and `Out of range` for other numbers. The last line is already written for you.',
      starter: j`
Scanner in = new Scanner(System.in);
int n = 0;
boolean valid = false;
while (!valid) {
    // your checks here
}
System.out.println("Got " + n);`,
      solution: j`
Scanner in = new Scanner(System.in);
int n = 0;
boolean valid = false;
while (!valid) {
    if (in.hasNextInt()) {
        n = in.nextInt();
        if (n >= 1 && n <= 10) {
            valid = true;
        } else {
            System.out.println("Out of range");
        }
    } else {
        in.next();
        System.out.println("Not a number");
    }
}
System.out.println("Got " + n);`,
      tests: [
        { label: 'abc 15 7', stdin: 'abc 15 7\n', output: 'Not a number\nOut of range\nGot 7' },
        { label: '5', stdin: '5\n', output: 'Got 5' },
        { label: '0 x 10', stdin: '0 x 10\n', output: 'Out of range\nNot a number\nGot 10' },
      ],
      mustInclude: [{ pattern: 'hasNextInt', message: 'Use hasNextInt() to detect words.' }],
      hint: 'Inside the loop: if hasNextInt(), read the number and check the range; else throw the word away with next().',
      explanation: 'Two layers of validation: first the TYPE (hasNextInt), then the RANGE (1 to 10). Only a number that passes both ends the loop.',
    },
  ]),

  ...topic('errors', [
    // ---------------- Lesson 3: Types of Errors ----------------
    {
      id: 'er-01',
      type: 'error-type',
      difficulty: 1,
      concept: 'syntax-error',
      prompt: 'What is wrong with this code?',
      code: j`System.out.println("Hello")`,
      answer: 'syntax',
      feedback: { runtime: 'The program can\'t even start, so it can\'t crash while running.', logic: 'It never compiles.', none: 'What does every Java statement end with?' },
      explanation: 'The statement is missing its semicolon. javac refuses to compile: *\';\' expected*.',
    },
    {
      id: 'er-02',
      type: 'error-type',
      difficulty: 1,
      concept: 'runtime-error',
      prompt: 'What is wrong with this code?',
      code: j`
int a = 5;
int b = 0;
System.out.println(a / b);`,
      answer: 'runtime',
      feedback: { syntax: 'Every line is valid Java, so it compiles.', logic: 'It doesn\'t finish with a wrong answer; it stops with an exception.', none: 'What happens when you divide an int by zero?' },
      highlightLines: [3],
      explanation: 'It compiles, but dividing an int by zero throws an **ArithmeticException** while running, which is a runtime error.',
    },
    {
      id: 'er-03',
      type: 'error-type',
      difficulty: 1,
      concept: 'logic-error',
      prompt: 'This should print the area of a 4 × 3 rectangle. What is wrong?',
      code: j`
int width = 4;
int height = 3;
System.out.println(width + height);`,
      answer: 'logic',
      feedback: { syntax: 'It compiles fine.', runtime: 'It runs to the end without crashing.', none: 'The area of 4 × 3 is 12. What does this print?' },
      highlightLines: [3],
      explanation: 'It runs perfectly but prints 7 instead of 12. Area needs `*`, not `+`. Wrong answer, no crash = **logic error**.',
    },
    {
      id: 'er-04',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'error-kinds',
      prompt: 'Which kind of error does the compiler (javac) catch **before** the program runs?',
      options: [
        { text: 'Syntax / compile errors' },
        { text: 'Runtime errors', feedback: 'Runtime errors only appear while the program runs.' },
        { text: 'Logic errors', feedback: 'The compiler can\'t know what you MEANT to compute.' },
        { text: 'All three kinds' },
      ],
      answer: 0,
      explanation: 'The compiler checks grammar and types. Runtime errors appear while running, and logic errors only show up when you test the results.',
    },
    {
      id: 'er-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'runtime-error',
      prompt: 'What is wrong with this code?',
      code: j`
String s = "Java";
System.out.println(s.charAt(4));`,
      answer: 'runtime',
      feedback: { syntax: 'It compiles: charAt(4) is valid syntax.', logic: 'It doesn\'t produce output; it crashes.', none: '"Java" has positions 0, 1, 2 and 3. Is there a position 4?' },
      highlightLines: [2],
      explanation: 'Positions in "Java" are 0 to 3. Asking for position 4 throws a **StringIndexOutOfBoundsException** at runtime.',
    },
    {
      id: 'er-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'syntax-error',
      prompt: 'What is wrong with this code?',
      code: j`
double price = 9.99;
int cents = price * 100;`,
      answer: 'syntax',
      feedback: { runtime: 'javac rejects it before it runs.', logic: 'It never compiles.', none: 'What type is `price * 100`? Can it go into an int?' },
      highlightLines: [2],
      explanation: '`price * 100` is a double, and storing a double in an int could lose information. javac: *possible lossy conversion from double to int*.',
    },
    {
      id: 'er-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'logic-error',
      prompt: 'This should print the sum of 1, 2 and 3. What is wrong?',
      code: j`
int total = 0;
for (int i = 1; i <= 3; i++) {
    total = i;
}
System.out.println("Sum of 1..3 = " + total);`,
      answer: 'logic',
      feedback: { syntax: 'It compiles fine.', runtime: 'It runs to completion.', none: 'Trace total: what is it after the loop?' },
      highlightLines: [3],
      explanation: 'It prints 3 instead of 6. `total = i` replaces the total each time; it should be `total += i`. Wrong answer without a crash = logic error.',
    },
    {
      id: 'er-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'error-kinds',
      prompt: 'This should print the remainder of 7 ÷ 2. What is wrong?',
      code: j`
int x = 7;
int y = 2;
System.out.println(x % y);`,
      answer: 'none',
      feedback: { syntax: 'Every line is valid.', runtime: 'Nothing here can crash: y isn\'t 0.', logic: '7 % 2 is indeed the remainder, 1.' },
      explanation: 'Nothing is wrong! `7 % 2` gives the remainder, 1, which is exactly what we wanted.',
    },
    {
      id: 'er-09',
      type: 'multiple-choice',
      difficulty: 3,
      concept: 'runtime-error',
      prompt: 'A program asks for your age with `nextInt()` and crashes when you type `twelve`. What kind of error is it?',
      options: [
        { text: 'A runtime error: InputMismatchException' },
        { text: 'A syntax error', feedback: 'The program compiled and started: it crashed while running.' },
        { text: 'A logic error', feedback: 'Logic errors don\'t crash; they give wrong answers.' },
        { text: 'A runtime error: ArithmeticException', feedback: 'ArithmeticException is for things like dividing by zero.' },
      ],
      answer: 0,
      explanation: '`nextInt()` expected digits and got a word, so it threw an **InputMismatchException** while running.',
    },
    {
      id: 'er-10',
      type: 'true-false',
      difficulty: 2,
      concept: 'logic-error',
      prompt: 'A program with a logic error always crashes.',
      answer: false,
      wrongFeedback: 'Crashes are runtime errors. Logic errors are quieter…',
      explanation: 'Logic errors usually run to the end and simply give the wrong result. That\'s why testing matters!',
    },
  ]),

  ...topic('try-catch', [
    // ---------------- Lesson 4: try / catch ----------------
    {
      id: 'tc-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'try-catch-flow',
      prompt: 'What does this program print?',
      code: j`
try {
    int x = 10 / 0;
    System.out.println("A");
} catch (ArithmeticException e) {
    System.out.println("B");
}
System.out.println("C");`,
      optionStyle: 'output',
      options: [
        { text: 'B\nC' },
        { text: 'A\nB\nC', feedback: 'Line 2 throws, so the rest of the try block (printing A) is skipped.' },
        { text: 'A\nC' },
        { text: 'B', feedback: 'After the catch finishes, the program continues normally.' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: '10 / 0 throws an ArithmeticException. Java jumps straight to the catch (prints B), skipping line 3, then continues after it (prints C).',
    },
    {
      id: 'tc-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'try-catch-flow',
      prompt: 'When does the code in a `catch` block run?',
      options: [
        { text: 'Only when a matching exception is thrown in the try block' },
        { text: 'Always, after the try block', feedback: 'If nothing goes wrong, the catch block is skipped.' },
        { text: 'When there is a syntax error', feedback: 'Syntax errors stop the program from compiling at all.' },
        { text: 'Before the try block' },
      ],
      answer: 0,
      explanation: 'catch is Plan B: it only runs if the try block throws an exception of that type.',
    },
    {
      id: 'tc-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'error-kinds',
      prompt: 'try/catch can fix syntax errors, like a missing semicolon.',
      answer: false,
      wrongFeedback: 'A program with a syntax error never compiles, so its try block never runs.',
      explanation: 'try/catch handles RUNTIME exceptions. Syntax errors must be fixed in the code itself.',
    },
    {
      id: 'tc-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'try-catch-flow',
      prompt: 'What does this program print?',
      code: j`
try {
    System.out.println("start");
    int n = Integer.parseInt("42");
    System.out.println(n + 1);
} catch (NumberFormatException e) {
    System.out.println("bad number");
}`,
      optionStyle: 'output',
      options: [
        { text: 'start\n43' },
        { text: 'start\nbad number', feedback: '"42" is a valid number, so no exception is thrown.' },
        { text: 'start\n421', feedback: 'After parsing, n is the int 42, so n + 1 is arithmetic.' },
        { text: '43' },
      ],
      answer: 0,
      explanation: '`Integer.parseInt("42")` succeeds, so the whole try block runs and the catch is skipped.',
    },
    {
      id: 'tc-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'input-mismatch',
      prompt: 'The user types `4.5`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
try {
    int n = in.nextInt();
    System.out.println("You typed " + n);
} catch (InputMismatchException e) {
    System.out.println("Whole numbers only");
}`,
      stdin: '4.5\n',
      optionStyle: 'output',
      options: [
        { text: 'Whole numbers only' },
        { text: 'You typed 4', feedback: 'nextInt() doesn\'t round or chop: "4.5" isn\'t an int at all.' },
        { text: 'You typed 4.5' },
        { text: 'The program crashes', feedback: 'The exception is caught, so there\'s no crash.' },
      ],
      answer: 0,
      explanation: '"4.5" isn\'t a whole number, so `nextInt()` throws InputMismatchException, which the catch block handles.',
    },
    {
      id: 'tc-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'exception-types',
      prompt: 'Catch the exception that dividing by zero throws.',
      code: j`
int a = 8;
int b = 0;
try {
    System.out.println(a / b);
} catch (___ e) {
    System.out.println("Can't divide by zero");
}`,
      blanks: [['ArithmeticException']],
      bank: ['ArithmeticException', 'InputMismatchException', 'NumberFormatException', 'StringIndexOutOfBoundsException'],
      expectedOutput: "Can't divide by zero",
      explanation: 'Integer division by zero throws an **ArithmeticException** ("/ by zero").',
    },
    {
      id: 'tc-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'exception-types',
      prompt: 'What happens when this runs?',
      code: j`
try {
    String s = "hi";
    System.out.println(s.charAt(5));
} catch (ArithmeticException e) {
    System.out.println("caught");
}
System.out.println("end");`,
      options: [
        { text: 'It crashes with StringIndexOutOfBoundsException' },
        { text: 'It prints "caught" then "end"', feedback: 'This catch only handles ArithmeticException. A different exception is thrown here.' },
        { text: 'It prints "end"', feedback: 'An uncaught exception stops the program: "end" is never reached.' },
        { text: 'It prints "hi" then "end"' },
      ],
      answer: 0,
      verify: { status: 'runtime-error', exception: 'StringIndexOutOfBoundsException' },
      highlightLines: [3, 4],
      explanation: '`charAt(5)` throws StringIndexOutOfBoundsException, but the catch only matches ArithmeticException. Nothing catches it, so the program crashes.',
    },
    {
      id: 'tc-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'try-catch-flow',
      prompt: 'Type exactly what this program prints.',
      code: j`
int total = 0;
for (int i = 2; i >= -1; i--) {
    try {
        total += 12 / i;
    } catch (ArithmeticException e) {
        total += 100;
    }
}
System.out.println(total);`,
      answer: '106',
      explanation: 'i = 2: +6 → 6. i = 1: +12 → 18. i = 0: 12 / 0 throws, catch adds 100 → 118. i = -1: +(-12) → 106.',
    },

    // ---------------- Lesson 5: Handling Invalid Input ----------------
    {
      id: 'hi-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'consume-bad-token',
      prompt: 'Why do we call `in.next()` inside the catch block of an input loop?',
      options: [
        { text: 'To throw away the bad input, so the next nextInt() sees new input' },
        { text: 'To print the error message', feedback: 'next() reads input; it doesn\'t print anything.' },
        { text: 'To close the Scanner' },
        { text: 'Java requires it in every catch block', feedback: 'It\'s not required by Java, but without it, the loop gets stuck.' },
      ],
      answer: 0,
      explanation: 'A failed `nextInt()` leaves the bad token in the input. `next()` removes it; otherwise the loop fails on the same token forever.',
    },
    {
      id: 'hi-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'retry-loop',
      prompt: 'The user types `x` then `5`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int n = -1;
while (n < 0) {
    try {
        n = in.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Invalid: " + in.next());
    }
}
System.out.println("n = " + n);`,
      stdin: 'x\n5\n',
      optionStyle: 'output',
      options: [
        { text: 'Invalid: x\nn = 5' },
        { text: 'n = 5' },
        { text: 'Invalid: x', feedback: 'After the bad input is skipped, the loop tries again and reads 5.' },
        { text: 'The program loops forever', feedback: 'in.next() removes "x", so the next attempt reads 5.' },
      ],
      answer: 0,
      explanation: 'First try: "x" throws, the catch prints it and removes it. Second try: reads 5, which ends the loop.',
    },
    {
      id: 'hi-03',
      type: 'true-false',
      difficulty: 2,
      concept: 'consume-bad-token',
      prompt: 'If a catch block doesn\'t consume the bad token, a loop that calls `nextInt()` again will fail again immediately.',
      answer: true,
      wrongFeedback: 'Where is the bad token after nextInt() fails? Still right at the front of the input.',
      explanation: 'A failed nextInt() does NOT remove the token. The next call sees the same bad token, forever.',
    },
    {
      id: 'hi-04',
      type: 'error-type',
      difficulty: 2,
      concept: 'input-mismatch',
      prompt: 'The user types `hello`. What kind of problem happens?',
      code: j`
Scanner in = new Scanner(System.in);
int n = in.nextInt();
System.out.println(n + 1);`,
      stdin: 'hello\n',
      answer: 'runtime',
      feedback: { syntax: 'The code compiles fine.', logic: 'It doesn\'t finish with a wrong answer: it stops with an exception.', none: 'Can nextInt() read the word "hello"?' },
      highlightLines: [2],
      explanation: '`nextInt()` can\'t turn "hello" into an int, so it throws an InputMismatchException, which is a runtime error.',
    },
    {
      id: 'hi-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'retry-loop',
      prompt: 'Complete the retry loop. The user types `oops` then `3`.',
      code: j`
Scanner in = new Scanner(System.in);
int qty = 0;
boolean ok = false;
while (!ok) {
    try {
        qty = in.nextInt();
        ok = ___;
    } catch (InputMismatchException e) {
        in.___();
    }
}
System.out.println(qty);`,
      stdin: 'oops\n3\n',
      blanks: [['true'], ['next', 'nextLine']],
      expectedOutput: '3',
      explanation: 'Mark success with `ok = true;` after a good read. In the catch, `in.next()` discards the bad token.',
    },
    {
      id: 'hi-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'exception-types',
      prompt: 'The user types `10` and then `0`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int a = in.nextInt();
int b = in.nextInt();
try {
    System.out.println(a / b);
} catch (ArithmeticException e) {
    System.out.println("b can't be 0");
}`,
      stdin: '10\n0\n',
      optionStyle: 'output',
      options: [
        { text: "b can't be 0" },
        { text: '0', feedback: 'Dividing an int by 0 doesn\'t give 0: it throws an exception.' },
        { text: 'Infinity', feedback: 'Only DOUBLE division by zero gives Infinity. These are ints.' },
        { text: 'The program crashes', feedback: 'The ArithmeticException is caught.' },
      ],
      answer: 0,
      explanation: '10 / 0 with ints throws ArithmeticException, which the catch block handles.',
    },
    {
      id: 'hi-07',
      type: 'fix-code',
      difficulty: 3,
      concept: 'consume-bad-token',
      prompt: 'Debugging challenge: this loops forever when the user types a word. Fix it so it prints `Try again` once per bad word.',
      starter: j`
Scanner in = new Scanner(System.in);
int n = 0;
boolean valid = false;
while (!valid) {
    try {
        n = in.nextInt();
        valid = true;
    } catch (InputMismatchException e) {
        System.out.println("Try again");
    }
}
System.out.println("Got " + n);`,
      solution: j`
Scanner in = new Scanner(System.in);
int n = 0;
boolean valid = false;
while (!valid) {
    try {
        n = in.nextInt();
        valid = true;
    } catch (InputMismatchException e) {
        System.out.println("Try again");
        in.next();
    }
}
System.out.println("Got " + n);`,
      tests: [
        { label: 'input: abc 4', stdin: 'abc 4\n', output: 'Try again\nGot 4' },
        { label: 'input: 7', stdin: '7\n', output: 'Got 7' },
        { label: 'input: a b 1', stdin: 'a b 1\n', output: 'Try again\nTry again\nGot 1' },
      ],
      hint: 'After a failed nextInt(), the word is still waiting in the input. Remove it inside the catch.',
      explanation: 'Adding `in.next();` in the catch block discards the bad word, so the next `nextInt()` sees fresh input.',
    },
    {
      id: 'hi-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'exception-types',
      prompt: 'Safe division: read two ints `a` and `b` and print `a / b`. If `b` is 0, print `Cannot divide by zero`. If an input isn\'t a whole number, print `Invalid input`. Use try/catch.',
      starter: j`
Scanner in = new Scanner(System.in);
// read a and b and print a / b
// handle InputMismatchException and ArithmeticException
`,
      solution: j`
Scanner in = new Scanner(System.in);
try {
    int a = in.nextInt();
    int b = in.nextInt();
    System.out.println(a / b);
} catch (InputMismatchException e) {
    System.out.println("Invalid input");
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
      tests: [
        { label: '7 2', stdin: '7 2\n', output: '3' },
        { label: '5 0', stdin: '5 0\n', output: 'Cannot divide by zero' },
        { label: 'x 2', stdin: 'x 2\n', output: 'Invalid input' },
        { label: '9 y', stdin: '9 y\n', output: 'Invalid input' },
      ],
      mustInclude: [
        { pattern: '\\btry\\b', message: 'Use a try block.' },
        { pattern: 'catch\\s*\\(', message: 'Use catch blocks for the two exceptions.' },
      ],
      hint: 'A try block can have several catch blocks, one per exception type.',
      explanation: 'Put the risky reads and the division in `try`, then add one `catch` per exception type.',
    },
  ]),

  // ---------------- Unit 5 checkpoint ----------------
  ...topic('input', [
    {
      id: 'cp5-01',
      type: 'predict-output',
      difficulty: 3,
      concept: 'has-next-int',
      prompt: 'The user types `3` and then `abc`. What is printed?',
      code: j`
Scanner in = new Scanner(System.in);
int sum = 0;
while (in.hasNextInt()) {
    sum += in.nextInt();
}
System.out.println("Sum: " + sum);`,
      stdin: '3\nabc\n',
      optionStyle: 'output',
      options: [
        { text: 'Sum: 3' },
        { text: 'The program crashes', feedback: 'hasNextInt() never crashes: it just returns false for "abc".' },
        { text: 'Sum: 0' },
        { text: 'The program loops forever', feedback: 'The loop condition becomes false at "abc", so it ends.' },
      ],
      answer: 0,
      explanation: 'The loop adds 3, then hasNextInt() sees "abc" and returns false, ending the loop.',
    },
    {
      id: 'cp5-02',
      type: 'error-type',
      topic: 'errors',
      difficulty: 3,
      concept: 'runtime-error',
      prompt: 'What is wrong with this code?',
      code: j`
String input = "12a";
int n = Integer.parseInt(input);
System.out.println(n);`,
      answer: 'runtime',
      feedback: { syntax: 'It compiles: parseInt takes a String.', logic: 'It never prints a wrong number: it crashes first.', none: 'Can "12a" be turned into a whole number?' },
      highlightLines: [2],
      explanation: '"12a" isn\'t a valid number, so `Integer.parseInt` throws a **NumberFormatException** while running.',
    },
    {
      id: 'cp5-03',
      type: 'multiple-choice',
      topic: 'try-catch',
      difficulty: 2,
      concept: 'exception-types',
      prompt: 'Which exception does `nextInt()` throw when the user types `hello`?',
      optionStyle: 'code',
      options: [
        { text: 'InputMismatchException' },
        { text: 'NumberFormatException', feedback: 'That one comes from Integer.parseInt(), not from Scanner.' },
        { text: 'ArithmeticException', feedback: 'That\'s for math problems like dividing by zero.' },
        { text: 'NullPointerException' },
      ],
      answer: 0,
      explanation: 'Scanner\'s `nextInt()` throws **InputMismatchException** when the next token isn\'t a whole number.',
    },
    {
      id: 'cp5-04',
      type: 'find-bug',
      topic: 'try-catch',
      difficulty: 3,
      concept: 'exception-types',
      prompt: 'When the user types `0`, this crashes instead of printing a friendly message. Tap the line that needs to change (or be extended).',
      code: j`
Scanner in = new Scanner(System.in);
try {
    int n = in.nextInt();
    System.out.println(100 / n);
} catch (InputMismatchException e) {
    System.out.println("Not a number");
}`,
      stdin: '0\n',
      bugLines: [5],
      bugKind: 'runtime',
      fixedCode: j`
Scanner in = new Scanner(System.in);
try {
    int n = in.nextInt();
    System.out.println(100 / n);
} catch (InputMismatchException e) {
    System.out.println("Not a number");
} catch (ArithmeticException e) {
    System.out.println("Can't divide by zero");
}`,
      explanation: 'Only InputMismatchException is caught. `100 / 0` throws ArithmeticException, which nothing catches. Add a second catch block.',
    },
    {
      id: 'cp5-05',
      type: 'write-code',
      difficulty: 3,
      concept: 'validation-loop',
      prompt: 'Read a whole number `n`. While the input isn\'t a whole number, print `Enter a whole number` and skip it. Then count down from n to 1 on one line (numbers followed by a space) and finish with `Go!`. For 3: `3 2 1 Go!`',
      starter: j`
Scanner in = new Scanner(System.in);
// 1. validate with hasNextInt()
// 2. count down, then print Go!
`,
      solution: j`
Scanner in = new Scanner(System.in);
while (!in.hasNextInt()) {
    System.out.println("Enter a whole number");
    in.next();
}
int n = in.nextInt();
for (int i = n; i >= 1; i--) {
    System.out.print(i + " ");
}
System.out.println("Go!");`,
      tests: [
        { label: 'x 3', stdin: 'x 3\n', output: 'Enter a whole number\n3 2 1 Go!' },
        { label: '2', stdin: '2\n', output: '2 1 Go!' },
        { label: 'hi there 1', stdin: 'hi there 1\n', output: 'Enter a whole number\nEnter a whole number\n1 Go!' },
      ],
      mustInclude: [{ pattern: 'hasNextInt', message: 'Validate with hasNextInt().' }],
      explanation: 'A validation loop with hasNextInt() + next(), then a counting-down for loop printing `i + " "`, and finally "Go!".',
    },
    {
      id: 'cp5-06',
      type: 'true-false',
      topic: 'try-catch',
      difficulty: 2,
      concept: 'try-catch-flow',
      prompt: 'After an uncaught exception, the rest of the program still runs.',
      answer: false,
      wrongFeedback: 'An uncaught exception crashes the program right there.',
      explanation: 'If no catch block handles an exception, the program stops immediately and prints the error.',
    },
  ]),
]

export const unit5: UnitContent = {
  questions,
  unit: {
    id: 'u5',
    number: 5,
    title: 'Input & Error Handling',
    tagline: 'Read user input and survive their typos.',
    color: 'berry',
    icon: 'keyboard',
    topics: ['input', 'errors', 'try-catch'],
    checkpoint: ['cp5-01', 'cp5-02', 'cp5-03', 'cp5-04', 'cp5-05', 'cp5-06'],
    lessons: [
      {
        id: 'u5-l1',
        unitId: 'u5',
        title: 'Reading Input with Scanner',
        summary: 'nextInt, nextDouble, next and nextLine.',
        topic: 'input',
        teach: [
          {
            kind: 'concept',
            title: 'Talking to the user',
            what: 'A `Scanner` reads what the user types. Create one with `new Scanner(System.in)`, then call `nextInt()`, `nextDouble()`, `next()` (one word) or `nextLine()` (a whole line).',
            why: 'Interactive programs (games, calculators, quizzes) need input from the person using them.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'A tiny conversation',
            how: 'Press Run: the console will ask you for input, just like a real terminal.',
            code: j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.print("Name: ");
        String name = in.nextLine();
        System.out.print("Age: ");
        int age = in.nextInt();
        System.out.println(name + " will be " + (age + 1) + " next year.");
    }
}`,
            stdin: 'Byte\n15\n',
            notes: [
              { line: 1, text: 'Scanner lives in java.util, so import it.' },
              { line: 5, text: 'Connect a Scanner to the keyboard (System.in).' },
              { line: 7, text: 'nextLine() reads everything typed on the line.' },
              { line: 9, text: 'nextInt() reads a whole number.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Snippets in ByteBrew',
            body: 'To keep things short, most exercises show only the code inside `main`. Behind the scenes Byte adds the class, the main method and `import java.util.*;` for you.',
          },
          {
            kind: 'mistake',
            title: 'nextInt() then nextLine()',
            body: '`nextInt()` reads the number but leaves the Enter (newline) behind. A `nextLine()` right after it grabs that empty leftover!',
            stdin: '15\nByte\n',
            wrong: j`
Scanner in = new Scanner(System.in);
int age = in.nextInt();
String name = in.nextLine();
System.out.println("[" + name + "]");`,
            right: j`
Scanner in = new Scanner(System.in);
int age = in.nextInt();
in.nextLine(); // skip the leftover newline
String name = in.nextLine();
System.out.println("[" + name + "]");`,
          },
        ],
        questions: ['sc-01', 'sc-02', 'sc-03', 'sc-04', 'sc-06', 'sc-07', 'sc-05'],
        challenge: 'sc-08',
      },
      {
        id: 'u5-l2',
        unitId: 'u5',
        title: 'Validating with hasNextInt()',
        summary: 'Check input before you read it.',
        topic: 'input',
        teach: [
          {
            kind: 'concept',
            title: 'Check before you read',
            what: '`hasNextInt()` peeks at the next input and returns true if it\'s a whole number, **without reading it**. Check first, then call `nextInt()` safely.',
            why: 'Users make typos. If they type "ten" and you call nextInt(), the program crashes. Checking first lets you respond politely instead.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Asking until it\'s a number',
            how: 'While the next input is NOT an int, throw it away with `next()` and ask again.',
            code: j`
Scanner in = new Scanner(System.in);
System.out.print("How many cookies? ");
while (!in.hasNextInt()) {
    String bad = in.next();
    System.out.print(bad + " isn't a number. Try again: ");
}
int cookies = in.nextInt();
System.out.println("Baking " + cookies + " cookies!");`,
            stdin: 'ten\n10\n',
            notes: [
              { line: 3, text: 'hasNextInt() only peeks: nothing is consumed.' },
              { line: 4, text: 'next() removes the bad word. Required!' },
              { line: 7, text: 'Now nextInt() is guaranteed to work.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Two layers of validation',
            body: 'Good input checks usually test two things:',
            bullets: [
              '**Type**: is it a number at all? → `hasNextInt()`',
              '**Range**: is it a sensible number? → `n >= 1 && n <= 10`',
            ],
          },
          {
            kind: 'mistake',
            title: 'Not throwing away bad input',
            body: 'If you never call `next()` on the bad word, `hasNextInt()` keeps looking at the same word forever: an infinite loop.',
            stdin: 'ten\n10\n',
            wrong: j`
Scanner in = new Scanner(System.in);
while (!in.hasNextInt()) {
    System.out.println("Numbers only!");
}`,
            right: j`
Scanner in = new Scanner(System.in);
while (!in.hasNextInt()) {
    System.out.println("Numbers only!");
    in.next();
}
System.out.println("Got " + in.nextInt());`,
          },
        ],
        questions: ['hn-01', 'hn-02', 'hn-03', 'hn-04', 'hn-05', 'hn-06', 'hn-07'],
        challenge: 'hn-08',
      },
      {
        id: 'u5-l3',
        unitId: 'u5',
        title: 'Types of Errors',
        summary: 'Syntax, runtime and logic errors.',
        topic: 'errors',
        teach: [
          {
            kind: 'concept',
            title: 'Three kinds of bugs',
            what: '**Syntax (compile) errors**: Java can\'t understand the code, so it won\'t run at all. **Runtime errors**: it runs, then crashes with an exception. **Logic errors**: it runs to the end but gives the wrong answer.',
            why: 'Each kind is found differently: the compiler reports syntax errors, crashes reveal runtime errors, and only testing uncovers logic errors.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'A runtime error in action',
            how: 'Run it: the first line prints fine, then the division by zero crashes the program. The last line never runs.',
            crashes: true,
            code: j`
int apples = 10;
int friends = 0;
System.out.println("Sharing apples...");
System.out.println(apples / friends);
System.out.println("Done");`,
            notes: [
              { line: 3, text: 'Runs fine.' },
              { line: 4, text: 'ArithmeticException: / by zero. Crash!' },
              { line: 5, text: 'Never reached.' },
            ],
          },
          {
            kind: 'tip',
            title: 'How to tell them apart',
            body: 'Ask what happened when you pressed Run:',
            bullets: [
              'Won\'t start, error points at a line → **syntax / compile error**',
              'Starts, then stops with an Exception → **runtime error**',
              'Finishes, but the answer is wrong → **logic error**',
            ],
          },
          {
            kind: 'mistake',
            title: 'Logic errors stay quiet',
            body: 'This rectangle program runs perfectly but prints the wrong area. No error message will ever warn you.',
            wrong: j`
int width = 4;
int height = 3;
System.out.println("Area: " + (width + height));`,
            right: j`
int width = 4;
int height = 3;
System.out.println("Area: " + (width * height));`,
          },
        ],
        questions: ['er-01', 'er-02', 'er-03', 'er-04', 'er-10', 'er-05', 'er-06', 'er-07', 'er-08'],
        challenge: 'er-09',
      },
      {
        id: 'u5-l4',
        unitId: 'u5',
        title: 'try / catch',
        summary: 'Catch exceptions instead of crashing.',
        topic: 'try-catch',
        teach: [
          {
            kind: 'concept',
            title: 'Catching exceptions',
            what: 'When something goes wrong at runtime, Java **throws an exception**. Put risky code in a `try` block; a `catch` block runs only if that exception is thrown, instead of crashing.',
            why: 'Crashing is a terrible experience for users. try/catch lets your program recover: show a friendly message, use a default, or ask again.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Surviving a typo',
            how: 'When `nextInt()` fails, the rest of the try block is skipped and the catch block runs. Then the program simply continues.',
            code: j`
Scanner in = new Scanner(System.in);
try {
    System.out.print("Enter a number: ");
    int n = in.nextInt();
    System.out.println("Double: " + n * 2);
} catch (InputMismatchException e) {
    System.out.println("That wasn't a whole number!");
}
System.out.println("Program keeps running.");`,
            stdin: 'abc\n',
            notes: [
              { line: 4, text: 'Throws InputMismatchException for "abc".' },
              { line: 5, text: 'Skipped when line 4 throws.' },
              { line: 7, text: 'Runs instead of crashing.' },
              { line: 9, text: 'The program continues normally.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Exceptions you\'ll meet',
            body: 'Each problem has its own exception type:',
            bullets: [
              '`ArithmeticException`: dividing an int by zero',
              '`InputMismatchException`: nextInt() got something that isn\'t a whole number',
              '`NumberFormatException`: `Integer.parseInt("abc")`',
              '`StringIndexOutOfBoundsException`: a position that doesn\'t exist in a String',
              '`Exception`: catches (almost) anything, but be specific when you can',
            ],
          },
          {
            kind: 'mistake',
            title: 'Catching the wrong exception',
            body: 'A catch block only handles its own type. Catching ArithmeticException won\'t save you from bad input!',
            stdin: 'abc\n',
            wrong: j`
Scanner in = new Scanner(System.in);
try {
    int n = in.nextInt();
} catch (ArithmeticException e) {
    System.out.println("Oops");
}`,
            right: j`
Scanner in = new Scanner(System.in);
try {
    int n = in.nextInt();
} catch (InputMismatchException e) {
    System.out.println("Oops");
}`,
          },
        ],
        questions: ['tc-01', 'tc-02', 'tc-03', 'tc-04', 'tc-05', 'tc-06', 'tc-07'],
        challenge: 'tc-08',
      },
      {
        id: 'u5-l5',
        unitId: 'u5',
        title: 'Handling Invalid Input',
        summary: 'Loops + try/catch = robust programs.',
        topic: 'try-catch',
        teach: [
          {
            kind: 'concept',
            title: 'Retry until it works',
            what: 'Combine a loop with try/catch to keep asking until the input is valid. In the catch block, throw away the bad token with `next()`.',
            why: 'Robust programs never crash on a typo. They explain the problem and ask again.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'A bullet-proof age reader',
            how: 'The loop repeats until a read succeeds and sets `valid` to true.',
            code: j`
Scanner in = new Scanner(System.in);
int age = 0;
boolean valid = false;
while (!valid) {
    System.out.print("Age: ");
    try {
        age = in.nextInt();
        valid = true;
    } catch (InputMismatchException e) {
        System.out.println("Please type digits, like 12.");
        in.next();
    }
}
System.out.println("Age saved: " + age);`,
            stdin: 'twelve\n12\n',
            notes: [
              { line: 8, text: 'Only reached if nextInt() succeeded.' },
              { line: 11, text: 'Discard the bad word. This is essential!' },
            ],
          },
          {
            kind: 'tip',
            title: 'hasNextInt() or try/catch?',
            body: 'Both work for input:',
            bullets: [
              '`hasNextInt()` checks BEFORE reading: simple and clear for input.',
              'try/catch reacts AFTER the problem, and also handles other exceptions, like division by zero.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The endless catch loop',
            body: 'Without `in.next()` in the catch block, the same bad word fails again and again, forever.',
            stdin: 'twelve\n12\n',
            wrong: j`
Scanner in = new Scanner(System.in);
int age = 0;
boolean valid = false;
while (!valid) {
    try {
        age = in.nextInt();
        valid = true;
    } catch (InputMismatchException e) {
        System.out.println("Digits please!");
    }
}`,
            right: j`
Scanner in = new Scanner(System.in);
int age = 0;
boolean valid = false;
while (!valid) {
    try {
        age = in.nextInt();
        valid = true;
    } catch (InputMismatchException e) {
        System.out.println("Digits please!");
        in.next();
    }
}
System.out.println(age);`,
          },
        ],
        questions: ['hi-01', 'hi-03', 'hi-02', 'hi-04', 'hi-05', 'hi-06', 'hi-07'],
        challenge: 'hi-08',
      },
    ],
  },
}
