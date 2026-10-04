import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: The switch statement ----------------
  ...topic('switch', [
    {
      id: 'u8l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'selector',
      prompt: 'What kind of value can a `switch` statement look at in this course?',
      options: [
        { text: 'An int, a char or a String' },
        { text: 'A double, like 3.5', feedback: 'A switch compares exact values, and decimals are too slippery for that. Java does not allow a double here.' },
        { text: 'A condition, like `age > 18`', feedback: 'A switch matches exact values, not ranges. For a condition like that, you want an `if`.' },
        { text: 'A boolean', feedback: 'A boolean only has two values, so Java expects an `if` for that.' },
      ],
      answer: 0,
      explanation: 'A `switch` compares one value against a list of exact choices. It works with whole numbers, single characters and Strings.',
    },
    {
      id: 'u8l1-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'match',
      prompt: 'What does this program print?',
      code: j`
int day = 2;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
}`,
      optionStyle: 'output',
      options: [
        { text: 'Tuesday' },
        { text: 'Monday', feedback: 'The switch jumps to the case that matches the value, and `day` is 2.' },
        { text: 'Tuesday\nWednesday', feedback: 'The `break` after Tuesday stops it, so Wednesday is never reached.' },
        { text: '(nothing)', feedback: 'There is a case for 2, so it matches.' },
      ],
      answer: 0,
      explanation: 'Java compares `day` with each case. It finds `case 2`, runs the code underneath it, and then the `break` jumps out of the whole switch.',
    },
    {
      id: 'u8l1-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'default',
      prompt: 'The `default` case runs when none of the other cases match.',
      answer: true,
      wrongFeedback: 'It does. `default` is the safety net at the end, a bit like the final `else` in an `if` chain.',
      explanation: 'The `default` is optional, but it is a good habit. It catches every value that you did not write a case for.',
    },
    {
      id: 'u8l1-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'default',
      prompt: 'What does this program print?',
      code: j`
int n = 9;
switch (n) {
    case 1:
        System.out.println("one");
        break;
    case 2:
        System.out.println("two");
        break;
    default:
        System.out.println("other");
}`,
      optionStyle: 'output',
      options: [
        { text: 'other' },
        { text: 'one', feedback: 'The value is 9, so the case for 1 does not match.' },
        { text: '(nothing)', feedback: 'There is a `default`, so something always prints.' },
        { text: 'one\ntwo\nother', feedback: 'Only the matching case, or the `default`, can run.' },
      ],
      answer: 0,
      explanation: '9 does not match case 1 or case 2, so Java runs the `default` block.',
    },
    {
      id: 'u8l1-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'char-cases',
      prompt: 'Fill in the case label so that a grade of `B` prints `good`.',
      code: j`
char grade = 'B';
switch (grade) {
    case 'A':
        System.out.println("excellent");
        break;
    case ___:
        System.out.println("good");
        break;
    default:
        System.out.println("keep going");
}`,
      blanks: [["'B'"]],
      bank: ["'B'", '"B"', 'B', "'b'"],
      expectedOutput: 'good',
      explanation: 'A `char` goes in **single quotes**. Double quotes would make it a String, and a missing quote makes Java think it is a variable. And remember that `\'b\'` and `\'B\'` are different characters.',
    },
    {
      id: 'u8l1-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'string-switch',
      prompt: 'What does this program print?',
      code: j`
String cmd = "stop";
switch (cmd) {
    case "go":
        System.out.println("going");
        break;
    case "stop":
        System.out.println("stopping");
        break;
    default:
        System.out.println("unknown command");
}`,
      optionStyle: 'output',
      options: [
        { text: 'stopping' },
        { text: 'going', feedback: 'The Strings have to match exactly, and `stop` is not `go`.' },
        { text: 'unknown command', feedback: 'There is a case for `"stop"`, so that one matches.' },
        { text: 'stopping\nunknown command', feedback: 'The `break` ends the switch after the matching case.' },
      ],
      answer: 0,
      explanation: 'A switch works with Strings too. The text has to match exactly, including capital letters. `"stop"` matches the second case.',
    },
    {
      id: 'u8l1-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'case-types',
      prompt: 'What happens when we try to run this code?',
      code: j`
char grade = 'A';
switch (grade) {
    case "A":
        System.out.println("excellent");
        break;
    default:
        System.out.println("other");
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this before the program runs.',
        logic: 'The program never runs, so it cannot print the wrong thing.',
        none: 'Look at the quotes around the A in the case label.',
      },
      highlightLines: [3],
      explanation: 'The switch looks at a `char`, but `"A"` in double quotes is a String. The case labels have to be the same kind as the value you are switching on, so we need `\'A\'`.',
    },
    {
      id: 'u8l1-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'selector',
      prompt: 'What happens when we try to run this code?',
      code: j`
double price = 4.5;
switch (price) {
    case 4.5:
        System.out.println("cheap");
        break;
    default:
        System.out.println("other");
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this before the program runs.',
        logic: 'The program never runs, so there is no answer to be wrong.',
        none: 'Think about which types a switch is allowed to look at.',
      },
      highlightLines: [2],
      explanation: 'A switch is not allowed to look at a `double`. Decimals are not stored exactly, so matching them against a case would be unreliable. Use an `if` for those.',
    },
    {
      id: 'u8l1-09',
      type: 'predict-output',
      difficulty: 3,
      concept: 'match',
      prompt: 'What does this program print?',
      code: j`
int total = 0;
for (int i = 1; i <= 4; i++) {
    switch (i) {
        case 1:
            total += 10;
            break;
        case 3:
            total += 30;
            break;
        default:
            total += 1;
    }
}
System.out.println(total);`,
      optionStyle: 'output',
      options: [
        { text: '42' },
        { text: '40', feedback: 'You have the 10 and the 30, but the `default` runs for i = 2 and i = 4 as well.' },
        { text: '44', feedback: 'The values 1 and 3 are taken by their own cases, so the `default` only runs twice.' },
        { text: '4', feedback: 'That is the number of passes. The total adds up the amounts instead.' },
      ],
      answer: 0,
      explanation: 'Pass by pass: i = 1 adds 10, i = 2 uses the default and adds 1, i = 3 adds 30, and i = 4 uses the default and adds 1. That is 10 + 1 + 30 + 1, which is 42.',
    },
    {
      id: 'u8l1-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'syntax',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
int n = 2;
switch (n) {
    case 1:
        System.out.println("one");
        break;
    case 2
        System.out.println("two");
        break;
}`,
      bugLines: [6],
      fixedCode: j`
int n = 2;
switch (n) {
    case 1:
        System.out.println("one");
        break;
    case 2:
        System.out.println("two");
        break;
}`,
      bugKind: 'syntax',
      explanation: 'Every `case` label ends with a colon. Without it, Java does not know where the label ends and the code begins.',
    },
    {
      id: 'u8l1-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'match',
      prompt: 'Read a number from 1 to 7 and use a `switch` to print the day of the week (1 is Monday and 7 is Sunday). For any other number, print `Invalid day`.',
      starter: j`
Scanner console = new Scanner(System.in);
int day = console.nextInt();
// use a switch to print the day name
`,
      solution: j`
Scanner console = new Scanner(System.in);
int day = console.nextInt();
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    case 4:
        System.out.println("Thursday");
        break;
    case 5:
        System.out.println("Friday");
        break;
    case 6:
        System.out.println("Saturday");
        break;
    case 7:
        System.out.println("Sunday");
        break;
    default:
        System.out.println("Invalid day");
}`,
      tests: [
        { label: 'Monday', stdin: '1\n', output: 'Monday' },
        { label: 'Thursday', stdin: '4\n', output: 'Thursday' },
        { label: 'Sunday', stdin: '7\n', output: 'Sunday' },
        { label: 'too big', stdin: '9\n', output: 'Invalid day' },
        { label: 'zero', stdin: '0\n', output: 'Invalid day' },
      ],
      mustInclude: [{ pattern: 'switch\\s*\\(', message: 'Use a `switch` statement.' }],
      explanation: 'One case per day, a `break` at the end of each, and a `default` to catch anything that is not 1 to 7.',
    },
  ]),

  // ---------------- Lesson 2: break, default and fall-through ----------------
  ...topic('switch', [
    {
      id: 'u8l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'fall-through',
      prompt: 'What happens if you forget the `break` at the end of a case?',
      options: [
        { text: 'The program carries on into the next case, and runs its code too' },
        { text: 'The program crashes with an error', feedback: 'Java does not complain, and that is exactly what makes it dangerous.' },
        { text: 'The program stops at that case', feedback: 'Only a `break` stops it. Without one, the program keeps going.' },
        { text: 'The switch starts over from the top', feedback: 'It never goes back. It just keeps running downwards.' },
      ],
      answer: 0,
      explanation: 'This is called **fall-through**. Once a case matches, Java runs everything below it until it meets a `break`, even the code under other cases.',
    },
    {
      id: 'u8l2-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'grouping',
      prompt: 'Writing two `case` labels one after another, with no code between them, lets both of them share the same code.',
      answer: true,
      wrongFeedback: 'It does. The first label falls through into the second, so they end up sharing the code below.',
      explanation: 'That is a handy use of fall-through. It is perfect for things like grouping the days of a weekend, or both an uppercase and a lowercase letter.',
    },
    {
      id: 'u8l2-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'fall-through',
      prompt: 'What does this program print?',
      code: j`
int n = 1;
switch (n) {
    case 1:
        System.out.println("one");
    case 2:
        System.out.println("two");
    case 3:
        System.out.println("three");
}`,
      optionStyle: 'output',
      options: [
        { text: 'one\ntwo\nthree' },
        { text: 'one', feedback: 'There is no `break`, so the program does not stop after the first case.' },
        { text: 'two\nthree', feedback: 'The matching case is the first one, and it is the one that starts things off.' },
        { text: 'three', feedback: 'The matching case is the first one, and then it falls all the way down.' },
      ],
      answer: 0,
      explanation: 'The value 1 matches the first case. With no `break` anywhere, Java falls through every case below it, so all three lines are printed.',
    },
    {
      id: 'u8l2-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'grouping',
      prompt: 'What does this program print?',
      code: j`
char c = 'A';
switch (c) {
    case 'A':
    case 'B':
        System.out.println("pass");
        break;
    default:
        System.out.println("retry");
}`,
      optionStyle: 'output',
      options: [
        { text: 'pass' },
        { text: 'retry', feedback: 'The `A` case has no code of its own, so it falls through to the `B` code.' },
        { text: 'pass\nretry', feedback: 'The `break` after the pass line stops the switch.' },
        { text: '(nothing)', feedback: 'A matches, and falls through to the code under B.' },
      ],
      answer: 0,
      explanation: '`A` matches, it has nothing to run, and so it falls through to the next label and shares its code. Then the `break` ends the switch.',
    },
    {
      id: 'u8l2-05',
      type: 'predict-output',
      difficulty: 3,
      concept: 'default-placement',
      prompt: 'This one is tricky. What does this program print?',
      code: j`
int n = 5;
switch (n) {
    default:
        System.out.println("d");
    case 6:
        System.out.println("six");
}`,
      optionStyle: 'output',
      options: [
        { text: 'd\nsix' },
        { text: 'd', feedback: 'There is no `break` after the default, so the program falls through into the next case.' },
        { text: 'six', feedback: 'The value is 5, so it does not match case 6. It goes to the default and then falls through.' },
        { text: '(nothing)', feedback: 'The default catches the 5.' },
      ],
      answer: 0,
      explanation: '5 matches no case, so Java jumps to `default`. Even though `default` is first here, the code under it still falls through into `case 6`. That is why we usually put `default` last, with a `break` where it matters.',
    },
    {
      id: 'u8l2-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'break',
      prompt: 'Fill in the keyword so only `Tue` is printed.',
      code: j`
int day = 2;
switch (day) {
    case 1:
        System.out.println("Mon");
        break;
    case 2:
        System.out.println("Tue");
        ___;
    case 3:
        System.out.println("Wed");
        break;
}`,
      blanks: [['break']],
      bank: ['break', 'continue', 'stop', 'end'],
      expectedOutput: 'Tue',
      explanation: 'The `break` ends the switch right after `Tue`. Without it, the program would fall through and print `Wed` too.',
    },
    {
      id: 'u8l2-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'fall-through',
      prompt: 'Trace the switch carefully and type exactly what this program prints.',
      code: j`
int n = 1;
switch (n) {
    case 1:
        System.out.print("a");
    case 2:
        System.out.print("b");
        break;
    case 3:
        System.out.print("c");
}
System.out.println("!");`,
      answer: 'ab!',
      explanation: 'Case 1 prints `a`, and then it falls through into case 2, which prints `b` and hits the `break`. Case 3 is never reached. Then the line after the switch prints `!`.',
    },
    {
      id: 'u8l2-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'fall-through',
      prompt: 'This program should print only `Beginner` for level 1. What kind of error does it have?',
      code: j`
int level = 1;
switch (level) {
    case 1:
        System.out.println("Beginner");
    case 2:
        System.out.println("Intermediate");
        break;
    default:
        System.out.println("Expert");
}`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it with no complaints.',
        runtime: 'It does not crash. It runs to the end.',
        none: 'Look at the output. Does it print only `Beginner`?',
      },
      highlightLines: [3, 4],
      explanation: 'Level 1 prints `Beginner`, and then, because there is no `break`, it falls through and prints `Intermediate` as well. Java never warns you about this, so it is a logic error.',
    },
    {
      id: 'u8l2-09',
      type: 'error-type',
      difficulty: 3,
      concept: 'duplicate',
      prompt: 'What happens when we try to run this code?',
      code: j`
int n = 2;
switch (n) {
    case 1:
        System.out.println("one");
        break;
    case 1:
        System.out.println("uno");
        break;
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'The program never runs, so it cannot print the wrong thing.',
        none: 'Compare the case labels.',
      },
      highlightLines: [6],
      explanation: 'Two cases have the same value, and Java would not know which one to run. It reports *duplicate case label*.',
    },
    {
      id: 'u8l2-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'break',
      prompt: 'For size `M` this program should print only `Medium`, but it prints two lines. Tap a line that is part of the bug.',
      code: j`
String size = "M";
switch (size) {
    case "S":
        System.out.println("Small");
        break;
    case "M":
        System.out.println("Medium");
    case "L":
        System.out.println("Large");
        break;
    default:
        System.out.println("Unknown");
}`,
      bugLines: [7, 8],
      fixedCode: j`
String size = "M";
switch (size) {
    case "S":
        System.out.println("Small");
        break;
    case "M":
        System.out.println("Medium");
        break;
    case "L":
        System.out.println("Large");
        break;
    default:
        System.out.println("Unknown");
}`,
      bugKind: 'logic',
      explanation: 'The `Medium` case has no `break`, so it falls through and also prints `Large`. A `break` after line 7 fixes it.',
    },
    {
      id: 'u8l2-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'grouping',
      prompt: 'Read a month number from 1 to 12 and print how many days it has: 31 for months 1, 3, 5, 7, 8, 10 and 12, 30 for months 4, 6, 9 and 11, and 28 for month 2. For anything else, print `Invalid month`. Use stacked case labels.',
      starter: j`
Scanner console = new Scanner(System.in);
int month = console.nextInt();
// use a switch with stacked cases
`,
      solution: j`
Scanner console = new Scanner(System.in);
int month = console.nextInt();
switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        System.out.println(31);
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        System.out.println(30);
        break;
    case 2:
        System.out.println(28);
        break;
    default:
        System.out.println("Invalid month");
}`,
      tests: [
        { label: 'January', stdin: '1\n', output: '31' },
        { label: 'April', stdin: '4\n', output: '30' },
        { label: 'February', stdin: '2\n', output: '28' },
        { label: 'December', stdin: '12\n', output: '31' },
        { label: 'not a month', stdin: '13\n', output: 'Invalid month' },
      ],
      mustInclude: [{ pattern: 'switch\\s*\\(', message: 'Use a `switch` statement.' }],
      explanation: 'Stacking the labels means that all the months with the same length share one block of code. This is the one time when leaving out a `break` is exactly what you want.',
    },
  ]),

  // ---------------- Lesson 3: try and catch ----------------
  ...topic('try-catch', [
    {
      id: 'u8l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'exception',
      prompt: 'What happens to a program when an exception is thrown and nothing catches it?',
      options: [
        { text: 'The program stops with an error message' },
        { text: 'The program ignores it and keeps going', feedback: 'Java never ignores a problem on its own. Without a catch, the program stops.' },
        { text: 'The program restarts from the top', feedback: 'It does not restart. It just ends, with a message about what went wrong.' },
        { text: 'Java fixes the problem automatically', feedback: 'Java cannot guess what you meant. Handling it is the programmer\'s job.' },
      ],
      answer: 0,
      explanation: 'An uncaught exception ends the program on the spot and prints an error message. That is exactly what `try` and `catch` are here to prevent.',
    },
    {
      id: 'u8l3-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'structure',
      prompt: 'Which block holds the risky code that might throw an exception?',
      optionStyle: 'code',
      options: [
        { text: 'try' },
        { text: 'catch', feedback: 'The `catch` block holds the code that deals with the problem. The risky code goes in the `try`.' },
        { text: 'else', feedback: '`else` belongs to an `if` statement.' },
        { text: 'default', feedback: '`default` belongs to a `switch` statement.' },
      ],
      answer: 0,
      explanation: 'The `try` block is where you put the code that might go wrong. If it does, Java jumps straight to the matching `catch` block.',
    },
    {
      id: 'u8l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'structure',
      prompt: 'The code inside a `catch` block runs every time the program runs.',
      answer: false,
      wrongFeedback: 'It only runs when an exception is thrown inside the matching `try` block. Most of the time, it is skipped.',
      explanation: 'Think of `catch` as a safety net. It is only used when somebody falls.',
    },
    {
      id: 'u8l3-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'no-exception',
      prompt: 'What does this program print?',
      code: j`
try {
    System.out.println("A");
} catch (ArithmeticException e) {
    System.out.println("B");
}
System.out.println("C");`,
      optionStyle: 'output',
      options: [
        { text: 'A\nC' },
        { text: 'A\nB\nC', feedback: 'The `catch` block only runs if something goes wrong in the `try`, and nothing does.' },
        { text: 'B\nC', feedback: 'The `try` block runs normally, and so `A` is printed.' },
        { text: 'A', feedback: 'The last line is outside the `try`, so it always runs.' },
      ],
      answer: 0,
      explanation: 'Nothing goes wrong in the `try`, so the `catch` is skipped. The program prints `A`, and then carries on to print `C`.',
    },
    {
      id: 'u8l3-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'flow',
      prompt: 'What does this program print?',
      code: j`
int zero = 0;
try {
    System.out.println("start");
    System.out.println(10 / zero);
    System.out.println("never printed");
} catch (ArithmeticException e) {
    System.out.println("caught");
}
System.out.println("end");`,
      optionStyle: 'output',
      options: [
        { text: 'start\ncaught\nend' },
        { text: 'start\nnever printed\ncaught\nend', feedback: 'As soon as the exception happens, Java jumps out of the `try`, and the rest of it is skipped.' },
        { text: 'start\nend', feedback: 'The exception is caught, and so the `catch` block runs.' },
        { text: 'start', feedback: 'Because the exception is caught, the program carries on after the `catch`.' },
      ],
      answer: 0,
      explanation: '`start` is printed. Then `10 / zero` throws an ArithmeticException, and Java leaps straight to the `catch`, skipping the rest of the `try`. After the `catch`, the program carries on and prints `end`.',
    },
    {
      id: 'u8l3-06',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'exception-type',
      prompt: 'Fill in the exception type so the division by zero is caught.',
      code: j`
int zero = 0;
try {
    System.out.println(5 / zero);
} catch (___ e) {
    System.out.println("oops");
}`,
      blanks: [['ArithmeticException']],
      bank: ['ArithmeticException', 'InputMismatchException', 'StringException', 'IOException'],
      expectedOutput: 'oops',
      explanation: 'Dividing an int by zero throws an `ArithmeticException`, so that is the type the `catch` has to name. A catch for a different kind of exception would let this one go straight past it.',
    },
    {
      id: 'u8l3-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'message',
      prompt: 'What does this program print?',
      code: j`
int zero = 0;
try {
    System.out.println(5 / zero);
} catch (ArithmeticException e) {
    System.out.println(e.getMessage());
}`,
      optionStyle: 'output',
      options: [
        { text: '/ by zero' },
        { text: 'ArithmeticException', feedback: '`getMessage()` gives the explanation, and not the name of the exception.' },
        { text: '0', feedback: 'The division failed, so no number was ever produced.' },
        { text: '(nothing)', feedback: 'The `catch` block runs, and it prints the message.' },
      ],
      answer: 0,
      explanation: 'The variable `e` holds the details of what went wrong. `e.getMessage()` is a short explanation, and for a division by zero it says `/ by zero`.',
    },
    {
      id: 'u8l3-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'uncaught',
      prompt: 'What happens when we run this code?',
      code: j`
int people = 0;
System.out.println("Sharing the pizza...");
System.out.println(12 / people);
System.out.println("Enjoy!");`,
      answer: 'runtime',
      feedback: {
        syntax: 'The code is valid Java, so it compiles.',
        logic: 'It does not finish with a wrong answer. It stops in the middle.',
        none: 'What happens when you divide by zero?',
      },
      highlightLines: [3],
      explanation: 'The first line prints, and then the division by zero throws an ArithmeticException. Nothing catches it, so the program stops and `Enjoy!` is never printed.',
    },
    {
      id: 'u8l3-09',
      type: 'predict-output',
      difficulty: 3,
      concept: 'flow',
      prompt: 'What does this program print?',
      code: j`
String s = "Java";
try {
    System.out.println("Length: " + s.length());
    System.out.println(s.charAt(10));
    System.out.println("Done reading");
} catch (StringIndexOutOfBoundsException e) {
    System.out.println("No such position");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Length: 4\nNo such position' },
        { text: 'Length: 4\nDone reading', feedback: 'There is no position 10 in a 4 letter word, so `charAt(10)` throws an exception.' },
        { text: 'No such position', feedback: 'The line before the problem runs normally, so `Length: 4` is printed first.' },
        { text: 'Length: 4\nNo such position\nDone reading', feedback: 'Once the exception happens, the rest of the `try` is skipped.' },
      ],
      answer: 0,
      explanation: 'The first `println` works. Then `charAt(10)` throws a StringIndexOutOfBoundsException, because the word only has positions 0 to 3. Java skips `Done reading` and runs the `catch`.',
    },
    {
      id: 'u8l3-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'syntax',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
int zero = 0;
try {
    System.out.println(8 / zero);
} catch (ArithmeticException) {
    System.out.println("Cannot divide by zero");
}`,
      bugLines: [4],
      fixedCode: j`
int zero = 0;
try {
    System.out.println(8 / zero);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
      bugKind: 'syntax',
      explanation: 'A `catch` needs a variable name after the exception type, even if you never use it. That is the `e` in `catch (ArithmeticException e)`.',
    },
    {
      id: 'u8l3-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'structure',
      prompt: 'Read two whole numbers `a` and `b`. Print `a / b`. If `b` is zero, catch the exception and print `Cannot divide by zero` instead.',
      starter: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
// divide safely
`,
      solution: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
try {
    System.out.println(a / b);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
      tests: [
        { label: 'a normal division', stdin: '10 2\n', output: '5' },
        { label: 'dividing by zero', stdin: '7 0\n', output: 'Cannot divide by zero' },
        { label: 'integer division', stdin: '9 3\n', output: '3' },
      ],
      mustInclude: [
        { pattern: 'try\\s*\\{', message: 'Put the division inside a `try` block.' },
        { pattern: 'catch\\s*\\(', message: 'Add a `catch` block for the problem.' },
      ],
      explanation: 'The risky division goes in the `try`. If `b` is zero, the `catch` prints a friendly message, and the program ends normally instead of crashing.',
    },
  ]),

  // ---------------- Lesson 4: ArithmeticException and InputMismatchException ----------------
  ...topic('try-catch', [
    {
      id: 'u8l4-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'input-mismatch',
      prompt: 'Which exception is thrown when `nextInt()` finds the word `hello` instead of a number?',
      optionStyle: 'code',
      options: [
        { text: 'InputMismatchException' },
        { text: 'ArithmeticException', feedback: 'That one is about math problems, like dividing by zero.' },
        { text: 'NumberFormatException', feedback: 'That one belongs to `Integer.parseInt`. The Scanner has its own exception.' },
        { text: 'StringIndexOutOfBoundsException', feedback: 'That one is about asking for a position that does not exist in a String.' },
      ],
      answer: 0,
      explanation: 'The Scanner expected one kind of input and found another, a mismatch between what it wanted and what it got. That is the `InputMismatchException`.',
    },
    {
      id: 'u8l4-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'arithmetic',
      prompt: 'Which exception is thrown when you divide an `int` by zero?',
      optionStyle: 'code',
      options: [
        { text: 'ArithmeticException' },
        { text: 'InputMismatchException', feedback: 'That one is for the Scanner finding the wrong kind of input.' },
        { text: 'MathException', feedback: 'There is no such exception, although the name makes sense. Java calls this a problem with arithmetic.' },
        { text: 'ZeroException', feedback: 'There is no such exception in Java.' },
      ],
      answer: 0,
      explanation: 'Division by zero is an impossible piece of arithmetic, so Java throws an `ArithmeticException`.',
    },
    {
      id: 'u8l4-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'arithmetic',
      prompt: 'Dividing a **double** by zero, like `5.0 / 0`, throws an ArithmeticException.',
      answer: false,
      wrongFeedback: 'Only whole-number division by zero throws an exception. With decimals, Java gives back a special value called Infinity.',
      explanation: '`5 / 0` crashes, but `5.0 / 0` quietly gives `Infinity`. It is one of the odd little corners of Java that is worth knowing.',
    },
    {
      id: 'u8l4-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'input-mismatch',
      prompt: 'The user types `abc`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
try {
    int n = console.nextInt();
    System.out.println("Got " + n);
} catch (InputMismatchException e) {
    System.out.println("Not a number");
}`,
      stdin: 'abc\n',
      optionStyle: 'output',
      options: [
        { text: 'Not a number' },
        { text: 'Got abc', feedback: '`nextInt()` can only read whole numbers, so `abc` causes an exception.' },
        { text: 'Got 0', feedback: 'Java never makes up a number. It throws an exception instead.' },
        { text: '(the program crashes)', feedback: 'The exception is thrown inside a `try`, and there is a matching `catch`.' },
      ],
      answer: 0,
      explanation: '`nextInt()` cannot read `abc`, so it throws an InputMismatchException. The `catch` block catches it, and prints `Not a number`.',
    },
    {
      id: 'u8l4-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'arithmetic',
      prompt: 'The user types `0`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
try {
    System.out.println(100 / n);
} catch (ArithmeticException e) {
    System.out.println("zero!");
}`,
      stdin: '0\n',
      optionStyle: 'output',
      options: [
        { text: 'zero!' },
        { text: '0', feedback: 'You cannot divide 100 by zero. It throws an exception.' },
        { text: '100', feedback: 'Dividing by zero is not allowed, and it does not give back the number itself.' },
        { text: '(the program crashes)', feedback: 'The exception is caught by the `catch` below.' },
      ],
      answer: 0,
      explanation: '`nextInt()` reads the 0 without any trouble. Then `100 / n` throws an ArithmeticException, and the `catch` prints `zero!`.',
    },
    {
      id: 'u8l4-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'input-mismatch',
      prompt: 'The user types `oops`. Fill in the exception type so the program survives.',
      code: j`
Scanner console = new Scanner(System.in);
try {
    int n = console.nextInt();
    System.out.println(n);
} catch (___ e) {
    System.out.println("Please type a number");
}`,
      stdin: 'oops\n',
      blanks: [['InputMismatchException']],
      bank: ['InputMismatchException', 'ArithmeticException', 'NumberFormatException', 'IOException'],
      expectedOutput: 'Please type a number',
      explanation: 'The Scanner is the one that complains here, with an `InputMismatchException`. Naming the wrong exception means the `catch` does not match, and the program would still crash.',
    },
    {
      id: 'u8l4-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'multiple-catch',
      prompt: 'The user types `0`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
try {
    int n = console.nextInt();
    System.out.println(10 / n);
} catch (InputMismatchException e) {
    System.out.println("A");
} catch (ArithmeticException e) {
    System.out.println("B");
}
System.out.println("C");`,
      stdin: '0\n',
      optionStyle: 'output',
      options: [
        { text: 'B\nC' },
        { text: 'A\nC', feedback: '`0` is a perfectly good whole number, so there is no input mismatch.' },
        { text: 'A\nB\nC', feedback: 'Only one `catch` block can run. Java picks the one that matches.' },
        { text: 'C', feedback: 'There is an exception, and one of the `catch` blocks prints before `C`.' },
      ],
      answer: 0,
      explanation: 'The input is a valid whole number, so there is no mismatch. The division by zero throws an ArithmeticException, so the second `catch` runs, and then `C` is printed.',
    },
    {
      id: 'u8l4-08',
      type: 'error-type',
      difficulty: 3,
      concept: 'consume',
      prompt: 'The user types `abc` and then `5`. The program should say `Try again` once and then accept the 5. What kind of error does it have?',
      code: j`
Scanner console = new Scanner(System.in);
int n = 0;
while (n == 0) {
    try {
        n = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Try again");
    }
}`,
      stdin: 'abc\n5\n',
      answer: 'logic',
      feedback: {
        syntax: 'The code compiles fine.',
        runtime: 'It does not crash. It keeps running.',
        none: 'Think about what happens to the word `abc` after `nextInt()` rejects it.',
      },
      highlightLines: [6, 7],
      explanation: 'When `nextInt()` fails, the bad word is **still waiting** in the input. So the next loop reads the same word again, fails again, and so on, for ever. The `catch` has to throw the bad word away with `console.next();`.',
    },
    {
      id: 'u8l4-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'consume',
      prompt: 'This program loops forever when the user types `abc`. Tap the line inside the `catch` that needs one more statement after it.',
      code: j`
Scanner console = new Scanner(System.in);
int n = 0;
while (n == 0) {
    try {
        n = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Try again");
    }
}
System.out.println("Got " + n);`,
      stdin: 'abc\n5\n',
      bugLines: [7],
      fixedCode: j`
Scanner console = new Scanner(System.in);
int n = 0;
while (n == 0) {
    try {
        n = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Try again");
        console.next();
    }
}
System.out.println("Got " + n);`,
      bugKind: 'logic',
      explanation: 'Add `console.next();` inside the `catch`. It reads and discards the bad word, so that the next `nextInt()` gets a fresh start.',
    },
    {
      id: 'u8l4-10',
      type: 'type-output',
      difficulty: 3,
      concept: 'consume',
      prompt: 'The user types `ten` and then `7`. Type exactly what this program prints.',
      code: j`
Scanner console = new Scanner(System.in);
int age = -1;
while (age < 0) {
    try {
        age = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Numbers only");
        console.next();
    }
}
System.out.println(age);`,
      stdin: 'ten 7\n',
      answer: 'Numbers only\n7',
      explanation: '`ten` fails, so `Numbers only` is printed and the bad word is thrown away. The loop goes round again, `nextInt()` reads the 7, and `age` is no longer negative. So the loop ends and 7 is printed.',
    },
    {
      id: 'u8l4-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'input-mismatch',
      prompt: 'Read a whole number with `nextInt()` inside a `try`. If the user types a whole number, print it doubled. If it is not a number, print `Invalid`.',
      starter: j`
Scanner console = new Scanner(System.in);
// read inside a try block
`,
      solution: j`
Scanner console = new Scanner(System.in);
try {
    int n = console.nextInt();
    System.out.println(n * 2);
} catch (InputMismatchException e) {
    System.out.println("Invalid");
}`,
      tests: [
        { label: 'a good number', stdin: '21\n', output: '42' },
        { label: 'a negative number', stdin: '-4\n', output: '-8' },
        { label: 'not a number', stdin: 'abc\n', output: 'Invalid' },
      ],
      mustInclude: [
        { pattern: 'try\\s*\\{', message: 'Use a `try` block.' },
        { pattern: 'InputMismatchException', message: 'Catch an `InputMismatchException`.' },
      ],
      explanation: 'The risky `nextInt()` goes inside the `try`. If the user types something that is not a number, the `catch` handles it with a friendly message.',
    },
  ]),

  // ---------------- Lesson 5: Exception e ----------------
  ...topic('try-catch', [
    {
      id: 'u8l5-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'exception-class',
      prompt: 'Which `catch` block can catch **any** kind of exception?',
      optionStyle: 'code',
      options: [
        { text: 'catch (Exception e)' },
        { text: 'catch (ArithmeticException e)', feedback: 'That one only catches arithmetic problems, like dividing by zero.' },
        { text: 'catch (InputMismatchException e)', feedback: 'That one is only for a Scanner finding the wrong kind of input.' },
        { text: 'catch (e)', feedback: 'A catch always needs a type, and then a variable name.' },
      ],
      answer: 0,
      explanation: '`Exception` is the parent of all the others, so a `catch (Exception e)` matches everything. It is a safety net for problems you did not plan for.',
    },
    {
      id: 'u8l5-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'the-variable',
      prompt: 'In `catch (Exception e)`, the `e` is a variable that holds details about what went wrong.',
      answer: true,
      wrongFeedback: 'It does. You can use `e` inside the catch block, for example to print `e.getMessage()`.',
      explanation: 'The `e` is just a name, and you could call it anything. Programmers nearly always use `e`, which stands for exception.',
    },
    {
      id: 'u8l5-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'message',
      prompt: 'What does this program print?',
      code: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (Exception e) {
    System.out.println("Problem: " + e.getMessage());
}`,
      optionStyle: 'output',
      options: [
        { text: 'Problem: / by zero' },
        { text: 'Problem: Exception', feedback: '`getMessage()` gives the explanation, and not the name of the class.' },
        { text: 'Problem: e', feedback: 'There are no quotes around `e.getMessage()`, so Java runs it and prints what it gives back.' },
        { text: '(the program crashes)', feedback: '`Exception` catches every kind of exception, so this one is caught too.' },
      ],
      answer: 0,
      explanation: 'The division by zero throws an ArithmeticException, and that is a kind of Exception, so the catch block runs. `e.getMessage()` gives `/ by zero`.',
    },
    {
      id: 'u8l5-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'catch-all',
      prompt: 'What does this program print?',
      code: j`
try {
    int n = Integer.parseInt("12a");
    System.out.println(n);
} catch (Exception e) {
    System.out.println("bad number");
}
System.out.println("after");`,
      optionStyle: 'output',
      options: [
        { text: 'bad number\nafter' },
        { text: '12\nafter', feedback: 'The text `12a` has a letter in it, so it cannot be turned into a whole number.' },
        { text: 'bad number', feedback: 'The last line is outside the `try` and `catch`, so it always runs.' },
        { text: 'after', feedback: 'The exception is thrown inside the `try`, so the `catch` prints before `after`.' },
      ],
      answer: 0,
      explanation: '`Integer.parseInt` throws a NumberFormatException for `12a`. We did not name that exception, but `Exception` catches everything, so the message is printed. Then the program carries on.',
    },
    {
      id: 'u8l5-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'the-variable',
      prompt: 'Fill in the method that gives back the explanation of the problem.',
      code: j`
int zero = 0;
try {
    System.out.println(5 / zero);
} catch (Exception e) {
    System.out.println(e.___());
}`,
      blanks: [['getMessage']],
      bank: ['getMessage', 'getText', 'message', 'print'],
      expectedOutput: '/ by zero',
      explanation: '`getMessage()` is the method that every exception has. It returns a short description of what went wrong.',
    },
    {
      id: 'u8l5-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'order',
      prompt: 'What does this program print?',
      code: j`
int zero = 0;
try {
    System.out.println(5 / zero);
} catch (ArithmeticException e) {
    System.out.println("math");
} catch (Exception e) {
    System.out.println("other");
}`,
      optionStyle: 'output',
      options: [
        { text: 'math' },
        { text: 'other', feedback: 'Both catches could match, but Java uses the first one that fits, and that is the specific one.' },
        { text: 'math\nother', feedback: 'Only one `catch` block ever runs.' },
        { text: '(the program crashes)', feedback: 'The exception is caught by the first `catch`.' },
      ],
      answer: 0,
      explanation: 'Java goes through the `catch` blocks from the top and uses the first one that fits. The ArithmeticException fits the first block, so it prints `math`.',
    },
    {
      id: 'u8l5-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'order',
      prompt: 'What does this program print?',
      code: j`
try {
    int n = Integer.parseInt("x");
    System.out.println(n);
} catch (ArithmeticException e) {
    System.out.println("math");
} catch (Exception e) {
    System.out.println("other");
}`,
      optionStyle: 'output',
      options: [
        { text: 'other' },
        { text: 'math', feedback: 'Parsing a bad number is not an arithmetic problem, so the first block does not match.' },
        { text: 'math\nother', feedback: 'Only one `catch` block can run.' },
        { text: '(the program crashes)', feedback: 'The general `Exception` block catches everything that is left over.' },
      ],
      answer: 0,
      explanation: 'A bad number throws a NumberFormatException, which is not an ArithmeticException, so the first block is skipped. But it is an Exception, so the second block catches it.',
    },
    {
      id: 'u8l5-08',
      type: 'error-type',
      difficulty: 3,
      concept: 'order',
      prompt: 'What happens when we try to run this code?',
      code: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (Exception e) {
    System.out.println("Something broke");
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program runs.',
        logic: 'The program never runs, so it cannot print a wrong answer.',
        none: 'Look at the order of the two `catch` blocks.',
      },
      highlightLines: [6],
      explanation: 'The first `catch` already catches everything, so the second one could never run. Java refuses to compile it, and says that *ArithmeticException has already been caught*. The specific one has to come first.',
    },
    {
      id: 'u8l5-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'flow',
      prompt: 'Trace it carefully and type exactly what this program prints.',
      code: j`
String text = "Java";
int zero = 0;
try {
    System.out.println(text.length());
    System.out.println(text.charAt(9));
    System.out.println(10 / zero);
} catch (Exception e) {
    System.out.println("Caught");
}
System.out.println("End");`,
      answer: '4\nCaught\nEnd',
      explanation: 'The first line prints 4. Then `charAt(9)` throws an exception, and Java jumps to the `catch` straight away. The division line is never reached. After the `catch`, `End` is printed.',
    },
    {
      id: 'u8l5-10',
      type: 'find-bug',
      difficulty: 3,
      concept: 'order',
      prompt: 'This program will not compile. Tap the line where Java complains.',
      code: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (Exception e) {
    System.out.println("Something broke");
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
      bugLines: [4, 6],
      fixedCode: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} catch (Exception e) {
    System.out.println("Something broke");
}`,
      bugKind: 'syntax',
      explanation: 'Put the specific catch blocks first, and the general `Exception` last. Otherwise the general one swallows everything and the specific one is unreachable.',
    },
    {
      id: 'u8l5-11',
      type: 'write-code',
      difficulty: 3,
      concept: 'catch-all',
      prompt: 'Read two whole numbers `a` and `b`. Inside a `try`, print `a / b`. Use `catch (Exception e)` to print `Error: ` followed by `e.getMessage()` if anything goes wrong.',
      starter: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
// divide inside a try
`,
      solution: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
try {
    System.out.println(a / b);
} catch (Exception e) {
    System.out.println("Error: " + e.getMessage());
}`,
      tests: [
        { label: 'dividing by zero', stdin: '8 0\n', output: 'Error: / by zero' },
        { label: 'a normal division', stdin: '8 2\n', output: '4' },
      ],
      mustInclude: [
        { pattern: 'catch\\s*\\(\\s*Exception\\s+e\\s*\\)', message: 'Use `catch (Exception e)`.' },
        { pattern: 'getMessage\\s*\\(\\s*\\)', message: 'Print the message with `e.getMessage()`.' },
      ],
      explanation: 'A general `catch (Exception e)` handles any problem, and `e.getMessage()` lets you show what went wrong. It makes a good last line of defence.',
    },
  ]),

  // ---------------- Unit 8 checkpoint ----------------
  ...topic('switch', [
    {
      id: 'u8cp-01',
      type: 'predict-output',
      difficulty: 2,
      concept: 'fall-through',
      prompt: 'What does this program print?',
      code: j`
int n = 2;
switch (n) {
    case 1:
        System.out.print("a");
    case 2:
        System.out.print("b");
    case 3:
        System.out.print("c");
        break;
    default:
        System.out.print("d");
}
System.out.println();`,
      optionStyle: 'output',
      options: [
        { text: 'bc' },
        { text: 'b', feedback: 'There is no `break` after case 2, so it falls through into case 3.' },
        { text: 'abc', feedback: 'The value is 2, so the switch jumps in at case 2 and skips case 1.' },
        { text: 'bcd', feedback: 'The `break` after case 3 ends the switch, so the `default` is skipped.' },
      ],
      answer: 0,
      explanation: 'It jumps in at case 2 and prints `b`. With no `break`, it falls through into case 3 and prints `c`, where the `break` finally stops it.',
    },
    {
      id: 'u8cp-02',
      type: 'write-code',
      difficulty: 3,
      concept: 'match',
      prompt: 'Read a whole number, then an operator character (`+`, `-`, `*` or `/`), then another whole number, like `6 + 2`. Use a `switch` on the operator to print the answer. For any other operator, print `Unknown operator`. (Read the operator with `console.next().charAt(0)`.)',
      starter: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
char op = console.next().charAt(0);
int b = console.nextInt();
// switch on op
`,
      solution: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
char op = console.next().charAt(0);
int b = console.nextInt();
switch (op) {
    case '+':
        System.out.println(a + b);
        break;
    case '-':
        System.out.println(a - b);
        break;
    case '*':
        System.out.println(a * b);
        break;
    case '/':
        System.out.println(a / b);
        break;
    default:
        System.out.println("Unknown operator");
}`,
      tests: [
        { label: 'add', stdin: '6 + 2\n', output: '8' },
        { label: 'subtract', stdin: '9 - 4\n', output: '5' },
        { label: 'multiply', stdin: '3 * 5\n', output: '15' },
        { label: 'divide', stdin: '8 / 2\n', output: '4' },
        { label: 'something else', stdin: '5 ? 1\n', output: 'Unknown operator' },
      ],
      mustInclude: [{ pattern: 'switch\\s*\\(', message: 'Use a `switch` on the operator.' }],
      explanation: 'A `char` switch with a case for each operator, and a `break` after each. The `default` handles anything unexpected.',
    },
    {
      id: 'u8cp-03',
      type: 'error-type',
      difficulty: 3,
      concept: 'fall-through',
      prompt: 'This program should print only `Medium` for level 2. What kind of error does it have?',
      code: j`
int level = 2;
switch (level) {
    case 1:
        System.out.println("Easy");
        break;
    case 2:
        System.out.println("Medium");
    case 3:
        System.out.println("Hard");
        break;
}`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it without a problem.',
        runtime: 'Nothing crashes.',
        none: 'Look at what it prints for level 2.',
      },
      highlightLines: [6, 7],
      explanation: 'There is no `break` after `Medium`, so the program falls through and prints `Hard` as well. That is a classic logic error.',
    },
  ]),
  ...topic('try-catch', [
    {
      id: 'u8cp-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'flow',
      prompt: 'What does this program print?',
      code: j`
int zero = 0;
try {
    System.out.println("A");
    System.out.println(4 / zero);
    System.out.println("B");
} catch (ArithmeticException e) {
    System.out.println("C");
}
System.out.println("D");`,
      optionStyle: 'output',
      options: [
        { text: 'A\nC\nD' },
        { text: 'A\nB\nC\nD', feedback: 'As soon as the exception is thrown, the rest of the `try` is skipped.' },
        { text: 'A\nD', feedback: 'The exception is caught, so the `catch` block runs.' },
        { text: 'C\nD', feedback: '`A` is printed before the problem happens.' },
      ],
      answer: 0,
      explanation: '`A` is printed. Then the division throws an exception, so `B` is skipped, and the `catch` prints `C`. After that, the program carries on with `D`.',
    },
    {
      id: 'u8cp-05',
      type: 'find-bug',
      difficulty: 3,
      concept: 'input-mismatch',
      prompt: 'This program will not compile. Tap the line where Java first complains.',
      code: j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        try {
            int n = console.nextInt();
            System.out.println(n * 2);
        } catch (InputMismatchException e) {
            System.out.println("Not a number");
        }
    }
}`,
      stdin: '5\n',
      bugLines: [9],
      fixedCode: j`
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        try {
            int n = console.nextInt();
            System.out.println(n * 2);
        } catch (InputMismatchException e) {
            System.out.println("Not a number");
        }
    }
}`,
      bugKind: 'syntax',
      explanation: 'The program imports `Scanner`, but not `InputMismatchException`, which also lives in `java.util`. Java reports *cannot find symbol* at the `catch`. Add `import java.util.InputMismatchException;` at the top.',
    },
    {
      id: 'u8cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'multiple-catch',
      prompt: 'Read a whole number with `nextInt()`, and print `100` divided by it. If the user types something that is not a number, print `Not a number`. If they type `0`, print `Cannot divide by zero`. Use two `catch` blocks.',
      starter: j`
Scanner console = new Scanner(System.in);
// read and divide, with two catch blocks
`,
      solution: j`
Scanner console = new Scanner(System.in);
try {
    int n = console.nextInt();
    System.out.println(100 / n);
} catch (InputMismatchException e) {
    System.out.println("Not a number");
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
      tests: [
        { label: 'a good number', stdin: '4\n', output: '25' },
        { label: 'zero', stdin: '0\n', output: 'Cannot divide by zero' },
        { label: 'not a number', stdin: 'abc\n', output: 'Not a number' },
      ],
      mustInclude: [
        { pattern: 'catch\\s*\\(\\s*InputMismatchException', message: 'Add a `catch` for `InputMismatchException`.' },
        { pattern: 'catch\\s*\\(\\s*ArithmeticException', message: 'Add a `catch` for `ArithmeticException`.' },
      ],
      explanation: 'Each kind of problem gets its own `catch` block with its own friendly message. Java runs only the one that matches the exception that was thrown.',
    },
  ]),
]

export const unit8: UnitContent = {
  questions,
  unit: {
    id: 'u8',
    number: 8,
    title: 'Switch and Exceptions',
    tagline: 'Choose between many options, and keep your programs alive when things go wrong.',
    color: 'cocoa',
    icon: 'shield',
    topics: ['switch', 'try-catch'],
    checkpoint: ['u8cp-01', 'u8cp-02', 'u8cp-03', 'u8cp-04', 'u8cp-05', 'u8cp-06'],
    lessons: [
      {
        id: 'u8-l1',
        unitId: 'u8',
        title: 'The switch Statement',
        summary: 'Match one value against a list of cases.',
        topic: 'switch',
        teach: [
          {
            kind: 'concept',
            title: 'A tidier way to choose',
            what: 'A `switch` statement looks at **one value** and jumps to the case that matches it. It is a neater way to write a long `else if` chain when you are only comparing one variable against exact values. It works with whole numbers, single characters and Strings.',
            why: 'Menus, days of the week, grade letters and commands are all full of "if it is this, do that; if it is that, do something else". A switch lays all of those choices out in a tidy list, so your code is much easier to read.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Naming the day',
            how: 'The value of `day` is 3, so Java jumps to `case 3`. The `break` then jumps out of the switch. If nothing matched, the `default` would run.',
            code: j`
int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Some other day");
}
System.out.println("Done");`,
            notes: [
              { line: 2, text: 'The value in the brackets is compared with each case.' },
              { line: 3, text: 'Every case label ends with a colon.' },
              { line: 5, text: 'break jumps out of the switch.' },
              { line: 12, text: 'default runs when no case matches. It is like the final else.' },
              { line: 15, text: 'After the switch, the program carries on as normal.' },
            ],
          },
          {
            kind: 'tip',
            title: 'The rules of a switch',
            body: 'A switch is stricter than an `if`, so here are the rules you need.',
            bullets: [
              'The value can be an `int`, a `char` or a `String`, but not a `double` or a `boolean`.',
              'Each case compares for an **exact** match. You cannot write `case > 5`. Use an `if` for ranges.',
              'A `char` case uses single quotes (`case \'A\':`) and a String case uses double quotes (`case "go":`).',
              'End each case with a `break`. We will see why in the next lesson.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The wrong kind of quotes in a case',
            body: 'The switch is looking at a `char`, so every case has to be a `char` in single quotes. Double quotes make a String, and Java does not accept that here.',
            wrong: j`
char grade = 'A';
switch (grade) {
    case "A":
        System.out.println("excellent");
        break;
    default:
        System.out.println("keep going");
}`,
            right: j`
char grade = 'A';
switch (grade) {
    case 'A':
        System.out.println("excellent");
        break;
    default:
        System.out.println("keep going");
}`,
          },
        ],
        questions: ['u8l1-01', 'u8l1-02', 'u8l1-03', 'u8l1-04', 'u8l1-05', 'u8l1-06', 'u8l1-07', 'u8l1-08', 'u8l1-09', 'u8l1-10'],
        challenge: 'u8l1-11',
      },
      {
        id: 'u8-l2',
        unitId: 'u8',
        title: 'break, default and Fall-Through',
        summary: 'What happens when you leave out a break.',
        topic: 'switch',
        teach: [
          {
            kind: 'concept',
            title: 'Why the break matters',
            what: 'Once a case matches, Java runs the code below it **and keeps going**, straight into the next case, until it meets a `break`. This is called **fall-through**. It is the number one switch bug, but when you do it on purpose, it lets several cases share the same code.',
            why: 'Forgetting a `break` does not cause an error message. Your program just prints extra things. Knowing about fall-through means you can spot it, and use it when it helps.',
            mood: 'surprised',
          },
          {
            kind: 'example',
            title: 'Sharing code, and falling through',
            how: 'In the first switch, `A` and `B` share one block of code, because `A` is empty and falls through. In the second switch, there are no breaks at all. Run it and watch how many lines appear.',
            code: j`
char grade = 'B';
switch (grade) {
    case 'A':
    case 'B':
        System.out.println("Great work!");
        break;
    case 'C':
        System.out.println("Solid.");
        break;
    default:
        System.out.println("See me after class.");
}
int n = 2;
switch (n) {
    case 1:
        System.out.println("one");
    case 2:
        System.out.println("two");
    case 3:
        System.out.println("three");
}`,
            notes: [
              { line: 3, text: 'A has no code of its own. It falls through to B and shares its message.' },
              { line: 5, text: 'This is where A and B end up.' },
              { line: 16, text: 'The value is 2, so we jump in here, and there is no break.' },
              { line: 18, text: 'So it falls through, and case 3 runs too.' },
            ],
          },
          {
            kind: 'tip',
            title: 'switch or if?',
            body: 'Both can make a choice, so how do you pick one?',
            bullets: [
              'Use a `switch` when you compare **one** value against exact choices, like a menu number or a letter grade.',
              'Use `if` and `else if` for ranges (`mark >= 80`) and for conditions that combine several variables.',
              'Put the `default` last, and give every case a `break` unless you are sharing code on purpose.',
              'If you do fall through on purpose, a short comment saying so will help the next reader.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The forgotten break',
            body: 'The programmer only wanted `two`, but without a `break` the program carries on into the next case, and prints `three` as well.',
            wrong: j`
int n = 2;
switch (n) {
    case 1:
        System.out.println("one");
        break;
    case 2:
        System.out.println("two");
    case 3:
        System.out.println("three");
        break;
}`,
            right: j`
int n = 2;
switch (n) {
    case 1:
        System.out.println("one");
        break;
    case 2:
        System.out.println("two");
        break;
    case 3:
        System.out.println("three");
        break;
}`,
          },
        ],
        questions: ['u8l2-01', 'u8l2-02', 'u8l2-03', 'u8l2-04', 'u8l2-05', 'u8l2-06', 'u8l2-07', 'u8l2-08', 'u8l2-09', 'u8l2-10'],
        challenge: 'u8l2-11',
      },
      {
        id: 'u8-l3',
        unitId: 'u8',
        title: 'try and catch',
        summary: 'Stop your program from crashing.',
        topic: 'try-catch',
        teach: [
          {
            kind: 'concept',
            title: 'Catching a problem before it crashes you',
            what: 'When something goes wrong while a program is running, Java **throws an exception**. If nothing catches it, the program stops with an error message. You put risky code inside a `try` block, and a `catch` block says what to do if there is a problem, so the program can keep going.',
            why: 'Users type the wrong thing, files go missing, and numbers turn out to be zero. A good program expects that. With `try` and `catch`, you replace a scary crash with a friendly message.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Dividing by zero, safely',
            how: 'The division is in the `try`. When it fails, Java leaps to the `catch`, skipping the rest of the `try`. The last line is outside both, so it always runs.',
            code: j`
int people = 0;
try {
    System.out.println(12 / people);
    System.out.println("This line is skipped.");
} catch (ArithmeticException e) {
    System.out.println("You cannot divide by zero!");
}
System.out.println("The program keeps going.");`,
            notes: [
              { line: 2, text: 'The risky code goes inside the try block.' },
              { line: 3, text: 'This throws an ArithmeticException, so Java jumps straight to the catch.' },
              { line: 4, text: 'Skipped. Nothing after the problem inside the try runs.' },
              { line: 5, text: 'The catch names the kind of exception it handles, and e holds the details.' },
              { line: 8, text: 'Outside the try and catch, so it always runs. The program survived.' },
            ],
          },
          {
            kind: 'tip',
            title: 'How to think about try and catch',
            body: 'The pattern is the same every time, so let me spell it out.',
            bullets: [
              'Put only the risky lines inside the `try`.',
              'The `catch` is a safety net, and it only runs when the matching exception is thrown.',
              'After an exception, the rest of the `try` is skipped, and the program carries on after the `catch`.',
              'A `catch` needs a type and a variable name, like `ArithmeticException e`.',
            ],
          },
          {
            kind: 'mistake',
            title: 'No safety net',
            body: 'Without a `try` and `catch`, the exception crashes the program, and the last line never gets a chance to run.',
            wrong: j`
int people = 0;
System.out.println("Sharing the pizza...");
System.out.println(12 / people);
System.out.println("Enjoy!");`,
            right: j`
int people = 0;
System.out.println("Sharing the pizza...");
try {
    System.out.println(12 / people);
} catch (ArithmeticException e) {
    System.out.println("Nobody to share with!");
}
System.out.println("Enjoy!");`,
          },
        ],
        questions: ['u8l3-01', 'u8l3-02', 'u8l3-03', 'u8l3-04', 'u8l3-05', 'u8l3-06', 'u8l3-07', 'u8l3-08', 'u8l3-09', 'u8l3-10'],
        challenge: 'u8l3-11',
      },
      {
        id: 'u8-l4',
        unitId: 'u8',
        title: 'ArithmeticException and InputMismatchException',
        summary: 'The two exceptions you will meet the most.',
        topic: 'try-catch',
        teach: [
          {
            kind: 'concept',
            title: 'Two familiar troublemakers',
            what: 'Two exceptions come up again and again in this course. An **ArithmeticException** happens when you divide a whole number by zero. An **InputMismatchException** happens when the Scanner expects one kind of input and gets another, like `nextInt()` finding the word `hello`. You can have more than one `catch` block, and Java uses the one that matches.',
            why: 'Between them, these two cause most of the crashes in beginner programs. Once you can handle them, your programs can cope with a user who types the wrong thing, and that is a big step towards writing real software.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'One try, two catches',
            how: 'The user types a number, and the program divides 100 by it. A bad word is caught by the first `catch`, and a zero by the second. Try changing the input in the editor.',
            code: j`
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        try {
            System.out.print("Enter a number: ");
            int n = console.nextInt();
            System.out.println(100 / n);
        } catch (InputMismatchException e) {
            System.out.println("That was not a whole number.");
        } catch (ArithmeticException e) {
            System.out.println("You cannot divide by zero.");
        }
        System.out.println("Goodbye!");
    }
}`,
            stdin: 'abc\n',
            notes: [
              { line: 1, text: 'InputMismatchException lives in java.util, so it needs its own import.' },
              { line: 9, text: 'nextInt() throws an InputMismatchException if the input is not a whole number.' },
              { line: 10, text: 'This line throws an ArithmeticException if n is zero.' },
              { line: 11, text: 'Handles the bad input.' },
              { line: 13, text: 'Handles the zero. Only the matching catch runs.' },
            ],
          },
          {
            kind: 'example',
            title: 'Asking again until the answer is valid',
            how: 'This is the pattern you will use the most. After a failed `nextInt()`, the bad word is still waiting in the input, so the `catch` has to throw it away with `console.next()`. If it does not, the loop reads the same word forever.',
            code: j`
Scanner console = new Scanner(System.in);
int age = -1;
while (age < 0) {
    try {
        System.out.print("Your age: ");
        age = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Numbers only, please.");
        console.next();
    }
}
System.out.println("Age: " + age);`,
            stdin: 'abc\nten\n15\n',
            notes: [
              { line: 3, text: 'Keep asking while we do not have a good age yet.' },
              { line: 6, text: 'If the user types a word, this throws an exception and age stays at -1.' },
              { line: 9, text: 'Throw away the bad word. Without this line, the loop never ends.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'The bad word that never leaves',
            body: 'A failed `nextInt()` does not remove the word it choked on. Without `console.next()` in the `catch`, the same word is read again and again, and the loop never ends.',
            wrong: j`
Scanner console = new Scanner(System.in);
int n = 0;
while (n == 0) {
    try {
        n = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Try again");
    }
}`,
            right: j`
Scanner console = new Scanner(System.in);
int n = 0;
while (n == 0) {
    try {
        n = console.nextInt();
    } catch (InputMismatchException e) {
        System.out.println("Try again");
        console.next();
    }
}`,
            stdin: 'abc\n5\n',
          },
        ],
        questions: ['u8l4-01', 'u8l4-02', 'u8l4-03', 'u8l4-04', 'u8l4-05', 'u8l4-06', 'u8l4-07', 'u8l4-08', 'u8l4-09', 'u8l4-10'],
        challenge: 'u8l4-11',
      },
      {
        id: 'u8-l5',
        unitId: 'u8',
        title: 'Catching Any Exception: Exception e',
        summary: 'A safety net for everything, and what e can tell you.',
        topic: 'try-catch',
        teach: [
          {
            kind: 'concept',
            title: 'The parent of all exceptions',
            what: '`Exception` is the parent of every other exception, so `catch (Exception e)` catches **anything** that goes wrong. The letter `e` is a variable that holds the details, and `e.getMessage()` gives you a short explanation. When you write several `catch` blocks, put the specific ones first and the general `Exception` last.',
            why: 'You will not always know exactly what could go wrong. A general `catch` is a safety net for the surprises. But it hides which problem happened, so use specific catches whenever you can, and keep `Exception` as the final backup.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'A catch-all in action',
            how: 'Two different problems are caught by the very same kind of `catch`. The first one prints the message that Java provides. The second one prints a message of our own.',
            code: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (Exception e) {
    System.out.println("Something went wrong: " + e.getMessage());
}
String text = "Java";
try {
    System.out.println(text.charAt(9));
} catch (Exception e) {
    System.out.println("That position does not exist.");
}`,
            notes: [
              { line: 4, text: 'Exception matches any kind of problem, including ArithmeticException.' },
              { line: 5, text: 'e.getMessage() describes what went wrong. Here it says / by zero.' },
              { line: 10, text: 'A different problem, but the same kind of catch handles it.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Order matters in a list of catches',
            body: 'Java tries the `catch` blocks from the top, and uses the first one that fits.',
            bullets: [
              'Write the specific exceptions first, like `ArithmeticException` and `InputMismatchException`.',
              'Write `catch (Exception e)` last, to pick up whatever is left over.',
              'If the general one comes first, the specific ones can never run, and Java will not compile it.',
              'A specific catch tells you exactly what went wrong, and that makes your code easier to fix.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The general catch comes first',
            body: 'The first block catches everything, so the second one is unreachable. Java spots that and refuses to compile it.',
            wrong: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (Exception e) {
    System.out.println("Something broke");
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
            right: j`
int zero = 0;
try {
    System.out.println(10 / zero);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} catch (Exception e) {
    System.out.println("Something broke");
}`,
          },
        ],
        questions: ['u8l5-01', 'u8l5-02', 'u8l5-03', 'u8l5-04', 'u8l5-05', 'u8l5-06', 'u8l5-07', 'u8l5-08', 'u8l5-09', 'u8l5-10'],
        challenge: 'u8l5-11',
      },
    ],
  },
}
