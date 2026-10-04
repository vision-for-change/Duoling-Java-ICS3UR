import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Syntax errors ----------------
  ...topic('errors', [
    {
      id: 'u4l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'compile-time',
      prompt: 'When does Java find a **syntax error**?',
      options: [
        { text: 'Before the program runs, while it is being compiled' },
        { text: 'While the program is running', feedback: 'Syntax errors are caught earlier than that. Java reads the whole program before running any of it.' },
        { text: 'After the program prints its first line', feedback: 'Nothing gets printed at all. If the code has a syntax error, the program never starts.' },
        { text: 'Only when the user types something wrong', feedback: 'That is a different kind of trouble, and it shows up while the program runs.' },
      ],
      answer: 0,
      explanation: 'Syntax errors are found at **compile time**, which is before the program runs. Java checks the grammar of your whole program first and refuses to start if it finds a mistake.',
    },
    {
      id: 'u4l1-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'compile-time',
      prompt: 'If line 5 of a program has a syntax error, lines 1 to 4 will still run and print their output.',
      answer: false,
      wrongFeedback: 'It does not work that way. Java checks the whole program first, so nothing runs until every syntax error is fixed.',
      explanation: 'The compiler reads everything before anything runs. One syntax error anywhere means no output at all.',
    },
    {
      id: 'u4l1-03',
      type: 'error-type',
      difficulty: 1,
      concept: 'semicolon',
      prompt: 'What kind of error is this?',
      code: j`
int lives = 3
System.out.println(lives);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this one before the program runs, so it cannot be a runtime error.',
        logic: 'The program does not run at all, so it cannot give a wrong answer.',
        none: 'Look at the end of line 1.',
      },
      highlightLines: [1],
      explanation: 'The first line is missing its semicolon. Java reports *\';\' expected* and stops. A forgotten semicolon is probably the most common error you will ever meet.',
    },
    {
      id: 'u4l1-04',
      type: 'error-type',
      difficulty: 2,
      concept: 'spelling',
      prompt: 'What kind of error is this?',
      code: j`
Sytem.out.println("Hello");`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java never gets as far as running this.',
        logic: 'The program cannot run, so it cannot be a wrong answer.',
        none: 'Read the first word out loud, one letter at a time.',
      },
      highlightLines: [1],
      explanation: '`Sytem` is missing an s, so Java has no idea what it means and reports that the package does not exist. Spelling and capital letters have to be perfect.',
    },
    {
      id: 'u4l1-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'brackets',
      prompt: 'What kind of error is this?',
      code: j`
System.out.println("Welcome";`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java never starts running it. The problem is found earlier.',
        logic: 'The program cannot run, so it cannot give a wrong answer.',
        none: 'Count the opening and closing brackets in that line.',
      },
      highlightLines: [1],
      explanation: 'The opening bracket after `println` never gets closed. Brackets, braces and quotes always come in matching pairs.',
    },
    {
      id: 'u4l1-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'semicolon',
      prompt: 'Fill in the blank to fix the syntax error.',
      code: j`
int total = 5___
System.out.println(total);`,
      blanks: [[';']],
      bank: [';', ',', ':', '.'],
      expectedOutput: '5',
      explanation: 'A statement is finished with a semicolon, the same way a sentence ends with a full stop.',
    },
    {
      id: 'u4l1-07',
      type: 'find-bug',
      difficulty: 2,
      concept: 'type-mismatch',
      prompt: 'This program will not compile. Tap the line with the syntax error.',
      code: j`
String name = "Maya";
String grade = 85;
System.out.println(name + " got " + grade);`,
      bugLines: [2],
      fixedCode: j`
String name = "Maya";
int grade = 85;
System.out.println(name + " got " + grade);`,
      bugKind: 'syntax',
      explanation: '85 is a number and cannot be stored in a `String` box. Java reports *incompatible types*. Make the variable an `int`, or put the 85 in quotes if you really want text.',
    },
    {
      id: 'u4l1-08',
      type: 'find-bug',
      difficulty: 3,
      concept: 'declare-first',
      prompt: 'This program will not compile. Tap the line with the syntax error.',
      code: j`
System.out.println(score);
int score = 5;
System.out.println("Done");`,
      bugLines: [1],
      fixedCode: j`
int score = 5;
System.out.println(score);
System.out.println("Done");`,
      bugKind: 'syntax',
      explanation: 'Java reads from the top down, so a variable has to be created before you use it. On line 1, `score` does not exist yet, and Java reports *cannot find symbol*.',
    },
    {
      id: 'u4l1-09',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'reading-messages',
      prompt: 'Java reports an error on line 7, plus two more below it. What should you do first?',
      options: [
        { text: 'Read the first message, fix line 7 (and glance at the line above it), then compile again' },
        { text: 'Start with the last error because it is the newest', feedback: 'The errors are in the order Java found them, and later ones are often side effects of the first one.' },
        { text: 'Delete line 7 and see what happens', feedback: 'Deleting code is not a fix. Read what the message says first.' },
        { text: 'Rewrite the whole program from scratch', feedback: 'That is a big job for what is often a single missing character.' },
      ],
      answer: 0,
      explanation: 'Start at the top. One mistake, like a missing brace, can make Java report several errors, and fixing the first one often makes the others vanish.',
    },
    {
      id: 'u4l1-10',
      type: 'fix-code',
      difficulty: 3,
      concept: 'semicolon',
      prompt: 'This program has three syntax errors, and it should print two lines. Fix them so the program works.',
      starter: j`
int lives = 3
System.out.println("Lives left: " + lives);
Sytem.out.println("Game on!");`,
      solution: j`
int lives = 3;
System.out.println("Lives left: " + lives);
System.out.println("Game on!");`,
      tests: [{ label: 'prints both lines', output: 'Lives left: 3\nGame on!' }],
      explanation: 'There was a missing semicolon on line 1 and a misspelled `System` on line 3. Fix them one at a time and compile again, so you can see which message goes away.',
    },
  ]),

  // ---------------- Lesson 2: Logic and run-time errors ----------------
  ...topic('errors', [
    {
      id: 'u4l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'kinds',
      prompt: 'Which kind of mistake does Java usually **not** warn you about before the program runs?',
      options: [
        { text: 'A logic error, where the code is valid but does the wrong thing' },
        { text: 'A missing semicolon', feedback: 'Java catches that one before anything runs.' },
        { text: 'A misspelled variable name', feedback: 'Java notices that at compile time and reports it.' },
        { text: 'A missing closing bracket', feedback: 'Java spots that straight away.' },
      ],
      answer: 0,
      explanation: 'A logic error is perfectly good Java, so the compiler is happy. Only you can notice that the answer is wrong, and the way to do that is to test.',
    },
    {
      id: 'u4l2-02',
      type: 'error-type',
      difficulty: 1,
      concept: 'wrong-answer',
      prompt: 'This program should print the area of a 4 by 3 rectangle, which is 12. What kind of error does it have?',
      code: j`
int width = 4;
int height = 3;
int area = width + height;
System.out.println(area);`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it with no complaints.',
        runtime: 'Nothing crashes. It runs from start to finish.',
        none: 'Look at what it prints. Is that the area of the rectangle?',
      },
      highlightLines: [3],
      explanation: 'The program runs fine and prints 7, but area is width times height, so it should be 12. That is a logic error, and Java cannot see it.',
    },
    {
      id: 'u4l2-03',
      type: 'error-type',
      difficulty: 2,
      concept: 'crash',
      prompt: 'What happens when we run this code?',
      code: j`
int total = 10;
int people = 0;
System.out.println(total / people);`,
      answer: 'runtime',
      feedback: {
        syntax: 'The code is valid Java, and it compiles without a problem.',
        logic: 'It does not finish and print the wrong number. It crashes before that.',
        none: 'What happens in math class when you divide by zero?',
      },
      highlightLines: [3],
      explanation: 'The code compiles, but dividing an int by zero is impossible. Java stops the program with an ArithmeticException while it is running. That is a run-time error.',
    },
    {
      id: 'u4l2-04',
      type: 'true-false',
      difficulty: 1,
      concept: 'wrong-answer',
      prompt: 'When a program has a logic error, Java shows an error message so you know where to look.',
      answer: false,
      wrongFeedback: 'That is exactly what makes logic errors sneaky. The program runs to the end with no message at all, and it just gives the wrong answer.',
      explanation: 'There is no red text and no line number for a logic error. You have to spot the wrong output yourself, and then track down the cause.',
    },
    {
      id: 'u4l2-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'trace',
      prompt: 'The programmer wanted the average of 6 and 4, which is 5. What does this program actually print?',
      code: j`
int a = 6;
int b = 4;
System.out.println(a + b / 2);`,
      optionStyle: 'output',
      options: [
        { text: '8' },
        { text: '5', feedback: 'That is what the programmer wanted, but the program does not do it. Division goes before addition.' },
        { text: '10', feedback: 'That is the sum, but the division still happens to the 4 first.' },
        { text: '3', feedback: 'Division happens before addition, but the 6 is still added afterwards.' },
      ],
      answer: 0,
      explanation: 'Division goes first, so `b / 2` is 2, and then 6 + 2 is 8. The fix is brackets: `(a + b) / 2`. Brackets are the tool for fixing this kind of logic error.',
    },
    {
      id: 'u4l2-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'wrong-answer',
      prompt: 'This program should convert 100 degrees Celsius to Fahrenheit, which is 212. What kind of error does it have?',
      code: j`
int c = 100;
int f = c * (9 / 5) + 32;
System.out.println(f);`,
      answer: 'logic',
      feedback: {
        syntax: 'The code compiles without any trouble.',
        runtime: 'It does not crash. It runs all the way through.',
        none: 'The correct answer is 212. Check what the program really prints.',
      },
      highlightLines: [2],
      explanation: 'The brackets hold `9 / 5`, which is integer division, so it becomes 1. The program prints 132 instead of 212. Writing `c * 9 / 5 + 32` fixes it.',
    },
    {
      id: 'u4l2-07',
      type: 'find-bug',
      difficulty: 3,
      concept: 'wrong-answer',
      prompt: 'This program should print the perimeter of a rectangle, which is 14 for these sides, but it prints something else. Tap the line with the logic error.',
      code: j`
int width = 4;
int height = 3;
int perimeter = 2 * width + height;
System.out.println(perimeter);`,
      bugLines: [3],
      fixedCode: j`
int width = 4;
int height = 3;
int perimeter = 2 * (width + height);
System.out.println(perimeter);`,
      bugKind: 'logic',
      explanation: 'The multiplication only reaches `width`, so the program gives 11. The perimeter is double the sum of the sides, so the brackets belong around `width + height`.',
    },
    {
      id: 'u4l2-08',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'first-move',
      prompt: 'Your program prints 7 but you expected 12. What is the best first move?',
      options: [
        { text: 'Work through the program by hand with the real values, or print the variables as it goes' },
        { text: 'Retype the whole program', feedback: 'You would probably just type the same mistake again.' },
        { text: 'Change things at random until it works', feedback: 'Random changes usually add new bugs on top of the old one.' },
        { text: 'Assume Java made a mistake', feedback: 'Java does exactly what you tell it to. The mistake is nearly always in the code.' },
      ],
      answer: 0,
      explanation: 'Tracing tells you where the values stop matching what you expect. Once you find the first line where something goes wrong, the cause is usually right there.',
    },
    {
      id: 'u4l2-09',
      type: 'error-type',
      difficulty: 3,
      concept: 'crash',
      prompt: 'What happens when we run this code?',
      code: j`
String word = "Java";
System.out.println(word.charAt(4));`,
      answer: 'runtime',
      feedback: {
        syntax: 'The code is valid, so it compiles.',
        logic: 'It does not print anything wrong. It stops before that.',
        none: 'Count the letters in Java, starting from position 0.',
      },
      highlightLines: [2],
      explanation: 'The letters of Java sit at positions 0, 1, 2 and 3, so position 4 does not exist. The program compiles, then crashes with a StringIndexOutOfBoundsException.',
    },
    {
      id: 'u4l2-10',
      type: 'fix-code',
      difficulty: 3,
      concept: 'wrong-answer',
      prompt: 'This program should print the average of three marks (70, 80 and 90), which is 80.0, but it prints something else. Fix the logic error.',
      starter: j`
int a = 70;
int b = 80;
int c = 90;
double average = a + b + c / 3;
System.out.println(average);`,
      solution: j`
int a = 70;
int b = 80;
int c = 90;
double average = (a + b + c) / 3;
System.out.println(average);`,
      tests: [{ label: 'average is 80.0', output: '80.0' }],
      explanation: 'Without brackets, only `c` is divided by 3 before the others are added on. Putting the sum in brackets makes Java divide the whole total.',
    },
  ]),

  // ---------------- Lesson 3: Debugging ----------------
  ...topic('errors', [
    {
      id: 'u4l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'meaning',
      prompt: 'What is **debugging**?',
      options: [
        { text: 'Finding and correcting mistakes in your code' },
        { text: 'Writing code as fast as you can', feedback: 'Speed has nothing to do with it. Debugging is about hunting down mistakes.' },
        { text: 'Deleting your program and starting again', feedback: 'That is rarely needed. Debugging means fixing what is wrong.' },
        { text: 'Adding comments to every line', feedback: 'Comments help people read your code, but that is a different job.' },
      ],
      answer: 0,
      explanation: 'A bug is a mistake in a program, and debugging is the detective work of finding it and correcting it. Every programmer does it every day.',
    },
    {
      id: 'u4l3-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'print-debugging',
      prompt: 'Which is a quick way to see what a variable holds while your program runs?',
      optionStyle: 'code',
      options: [
        { text: 'System.out.println("x = " + x);' },
        { text: 'int x;', feedback: 'That creates a variable. It does not show what is inside it.' },
        { text: 'final x;', feedback: 'That is not even valid Java, and it would not show the value either.' },
        { text: 'x = x;', feedback: 'That assigns the variable to itself, which changes nothing.' },
      ],
      answer: 0,
      explanation: 'A print statement in the middle of your program is the oldest debugging trick in the book. It lets you watch the values change line by line.',
    },
    {
      id: 'u4l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'one-change',
      prompt: 'To fix a bug quickly, you should change several things at once.',
      answer: false,
      wrongFeedback: 'That feels fast, but then you cannot tell which change fixed it, and you may add new bugs. Change one thing at a time.',
      explanation: 'Make one change, run the program, and look at what happened. That way you always know what made the difference.',
    },
    {
      id: 'u4l3-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'trace',
      prompt: 'Trace this program line by line. What does it print?',
      code: j`
int x = 5;
int y = x * 2;
x = y - 3;
System.out.println(x + " " + y);`,
      optionStyle: 'output',
      options: [
        { text: '7 10' },
        { text: '2 10', feedback: 'Line 3 uses the new `y`, which is 10, and not the old `x`.' },
        { text: '5 10', feedback: 'Line 3 changes `x`, so it is no longer 5 by the time we print it.' },
        { text: '7 7', feedback: '`y` was only set once, on line 2, so it stays at 10.' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: 'Start with x = 5. Line 2 makes y = 10. Line 3 sets x to 10 - 3 = 7. So the output is `7 10`.',
    },
    {
      id: 'u4l3-05',
      type: 'find-bug',
      difficulty: 2,
      concept: 'swap',
      prompt: 'This program should swap the two values and print `2 1`, but it prints `2 2`. Tap the line where the first value gets lost.',
      code: j`
int a = 1;
int b = 2;
a = b;
b = a;
System.out.println(a + " " + b);`,
      bugLines: [3, 4],
      fixedCode: j`
int a = 1;
int b = 2;
int temp = a;
a = b;
b = temp;
System.out.println(a + " " + b);`,
      bugKind: 'logic',
      explanation: 'Line 3 overwrites `a` with 2, so the original 1 is gone for good. Then line 4 copies that 2 into `b`. You need a third variable to hold the 1 safely while you swap.',
    },
    {
      id: 'u4l3-06',
      type: 'type-output',
      difficulty: 3,
      concept: 'trace',
      prompt: 'Trace the changes to `total` and type exactly what this program prints.',
      code: j`
int total = 0;
total += 4;
total *= 3;
total -= 5;
System.out.println(total);`,
      answer: '7',
      explanation: 'A trace table helps here: 0, then 4, then 12, then 7.',
    },
    {
      id: 'u4l3-07',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'reading-messages',
      prompt: 'Java reports three errors, and they all look unrelated. Which one should you fix first?',
      options: [
        { text: 'The first one in the list, and then compile again' },
        { text: 'The last one in the list', feedback: 'Later errors are often caused by earlier ones, so starting at the end can send you on a wild goose chase.' },
        { text: 'The one that looks easiest', feedback: 'It is fine to fix an easy one, but the first error is the most reliable place to start.' },
        { text: 'None of them. Wait for them to go away', feedback: 'They will not go away on their own.' },
      ],
      answer: 0,
      explanation: 'Fix the first error, recompile, and see what is left. A single missing brace can make Java complain about five lines at once.',
    },
    {
      id: 'u4l3-08',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'print-debugging',
      prompt: 'Add a debugging print so the program shows the value of `result`.',
      code: j`
int a = 8;
int b = 3;
int result = a / b;
System.out.println("result = " + ___);`,
      blanks: [['result']],
      bank: ['result', 'a', 'b', '"result"'],
      expectedOutput: 'result = 2',
      explanation: 'Putting the variable name outside quotes prints the value it holds. Inside quotes it would just print the word.',
    },
    {
      id: 'u4l3-09',
      type: 'error-type',
      difficulty: 3,
      concept: 'crash',
      prompt: 'What happens when we run this code?',
      code: j`
int n = Integer.parseInt("12a");
System.out.println(n);`,
      answer: 'runtime',
      feedback: {
        syntax: 'The code is valid Java. It compiles without a problem.',
        logic: 'It does not finish with a wrong answer. It crashes first.',
        none: 'Can the text `12a` be turned into a whole number?',
      },
      highlightLines: [1],
      explanation: '`Integer.parseInt` turns text into a whole number, but `12a` has a letter in it. The program compiles, then stops with a NumberFormatException while it is running.',
    },
    {
      id: 'u4l3-10',
      type: 'fix-code',
      difficulty: 3,
      concept: 'multiple-bugs',
      prompt: 'This program should print `Total: 15.5`. It has one syntax error and one logic error. Fix both.',
      starter: j`
double price = 4.50;
int items = 3;
double delivery = 2.00;
double total = price * items + delivery
System.out.println("Total: " + price * items + delivery);`,
      solution: j`
double price = 4.50;
int items = 3;
double delivery = 2.00;
double total = price * items + delivery;
System.out.println("Total: " + total);`,
      tests: [{ label: 'prints the total', output: 'Total: 15.5' }],
      explanation: 'Fix the syntax error first (the missing semicolon), because Java will not run anything until it is gone. Then the printed message was joining pieces as text, so print the finished `total` instead.',
    },
  ]),

  // ---------------- Unit 4 checkpoint ----------------
  ...topic('errors', [
    {
      id: 'u4cp-01',
      type: 'error-type',
      difficulty: 2,
      concept: 'type-mismatch',
      prompt: 'What kind of error is this?',
      code: j`
int count = "five";
System.out.println(count);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java stops this before the program runs.',
        logic: 'The program cannot run, so there is no answer to be wrong.',
        none: 'Can a word go into an int box?',
      },
      highlightLines: [1],
      explanation: 'The quotes make `"five"` a String, and a String cannot be stored in an `int`. Java reports incompatible types at compile time.',
    },
    {
      id: 'u4cp-02',
      type: 'error-type',
      difficulty: 2,
      concept: 'wrong-answer',
      prompt: 'This program should print 75, which is three quarters as a percent. What kind of error does it have?',
      code: j`
int percent = 3 / 4 * 100;
System.out.println(percent);`,
      answer: 'logic',
      feedback: {
        syntax: 'Java compiles it without complaint.',
        runtime: 'Nothing crashes. It runs and prints a number.',
        none: 'It should print 75. What does it really print?',
      },
      highlightLines: [1],
      explanation: '`3 / 4` is integer division, so it is 0, and 0 times 100 is 0. The program prints 0 and never complains. Multiplying first, `3 * 100 / 4`, gives 75.',
    },
    {
      id: 'u4cp-03',
      type: 'error-type',
      difficulty: 3,
      concept: 'crash',
      prompt: 'What happens when we run this code?',
      code: j`
int a = 10;
int b = a - 10;
System.out.println(a / b);`,
      answer: 'runtime',
      feedback: {
        syntax: 'The code is valid Java, so it compiles.',
        logic: 'It never gets to print a wrong number. It crashes first.',
        none: 'Work out what `b` holds before the division.',
      },
      highlightLines: [3],
      explanation: '`b` ends up as 0, and dividing by zero throws an ArithmeticException. Java could not know that when it compiled, because the zero only appears while running.',
    },
    {
      id: 'u4cp-04',
      type: 'find-bug',
      difficulty: 3,
      concept: 'spelling',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
String name = "Alex";
Int age = 15;
System.out.println(name + " is " + age);`,
      bugLines: [2],
      fixedCode: j`
String name = "Alex";
int age = 15;
System.out.println(name + " is " + age);`,
      bugKind: 'syntax',
      explanation: 'The type `int` is all lowercase. `Int` is a word Java does not know, so it reports *cannot find symbol*. Capital letters matter.',
    },
    {
      id: 'u4cp-05',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'kinds',
      prompt: 'Which statement about errors is true?',
      options: [
        { text: 'A syntax error stops the program before it runs, but a logic error lets it run and give a wrong answer' },
        { text: 'A logic error always shows a red error message', feedback: 'Logic errors are silent. That is why they are so hard to find.' },
        { text: 'A syntax error only shows up after the program has printed something', feedback: 'Syntax errors are found before anything runs.' },
        { text: 'If a program compiles, it is guaranteed to be correct', feedback: 'Compiling only proves the grammar is right. The logic can still be wrong.' },
      ],
      answer: 0,
      explanation: 'Compiling only checks the grammar. Whether the program does the right thing is something you have to test yourself.',
    },
    {
      id: 'u4cp-06',
      type: 'fix-code',
      difficulty: 3,
      concept: 'multiple-bugs',
      prompt: 'This program should print `Area: 40`. It has a syntax error and a logic error. Fix both.',
      starter: j`
int length = 8;
int width = 5;
int area = length + width;
System.out.println("Area: " + area)`,
      solution: j`
int length = 8;
int width = 5;
int area = length * width;
System.out.println("Area: " + area);`,
      tests: [{ label: 'prints the area', output: 'Area: 40' }],
      explanation: 'The last line needs its semicolon, and the area has to multiply. The first problem is stopped by Java, but the second one you only find by checking the answer.',
    },
  ]),
]

export const unit4: UnitContent = {
  questions,
  unit: {
    id: 'u4',
    number: 4,
    title: 'Errors and Debugging',
    tagline: 'Understand what goes wrong and learn to hunt it down.',
    color: 'berry',
    icon: 'bug',
    topics: ['errors'],
    checkpoint: ['u4cp-01', 'u4cp-02', 'u4cp-03', 'u4cp-04', 'u4cp-05', 'u4cp-06'],
    lessons: [
      {
        id: 'u4-l1',
        unitId: 'u4',
        title: 'Syntax Errors',
        summary: 'Mistakes Java catches before the program runs.',
        topic: 'errors',
        teach: [
          {
            kind: 'concept',
            title: 'Grammar mistakes in your code',
            what: 'A **syntax error** is a mistake in the grammar of your code, like a missing semicolon or a misspelled word. Java finds these at **compile time**, which means before the program runs. It shows you the line number and a message, and it refuses to run anything until you fix it.',
            why: 'Everybody makes syntax errors, including me, every single day. The good news is that they are the friendliest kind of bug, because Java tells you roughly where the problem is. Learning to read those messages will save you hours.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'What the compiler checks',
            how: 'This program passes the compiler. Every note points at something Java would complain about if it were wrong.',
            code: j`
int lives = 3;
String name = "Sam";
System.out.println(name + " has " + lives + " lives");
System.out.println("Good luck!");`,
            notes: [
              { line: 1, text: 'Semicolon at the end. Without it, Java reports ";" expected.' },
              { line: 2, text: 'The types must match. A String in quotes goes in a String box.' },
              { line: 3, text: 'Every name must be spelled exactly, including the capital letters.' },
              { line: 4, text: 'Brackets and quotes must come in pairs.' },
            ],
          },
          {
            kind: 'tip',
            title: 'How to read an error message',
            body: 'A compiler message looks scary, but it is a short list of clues. Here is how I read one:',
            bullets: [
              'Find the **line number**. That is where Java noticed the problem.',
              'Read the **message** itself, such as *cannot find symbol* or *incompatible types*.',
              'If the line looks fine, check the line above it. A missing semicolon is often reported on the next line.',
              'Always fix the **first** error first. The rest are often caused by it.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The unclosed bracket',
            body: 'Brackets, braces and quotes always come in pairs. If you open one and forget to close it, Java cannot make sense of the line.',
            wrong: j`System.out.println("Welcome";`,
            right: j`System.out.println("Welcome");`,
          },
        ],
        questions: ['u4l1-01', 'u4l1-02', 'u4l1-03', 'u4l1-04', 'u4l1-05', 'u4l1-06', 'u4l1-07', 'u4l1-08', 'u4l1-09'],
        challenge: 'u4l1-10',
      },
      {
        id: 'u4-l2',
        unitId: 'u4',
        title: 'Logic and Run-Time Errors',
        summary: 'Programs that run, but go wrong.',
        topic: 'errors',
        teach: [
          {
            kind: 'concept',
            title: 'When the code is valid but wrong',
            what: 'Once a program starts running, two things can go wrong. It can **crash**, like when you divide by zero, or it can run happily to the end and give a **wrong answer**. That second kind is a **logic error**. Both of them happen at **run time**, while the program is running, and Java cannot warn you about them ahead of time.',
            why: 'A logic error is the hardest bug to catch, because there is no error message to point at. The program looks like it worked. The only protection is to test your program with numbers where you already know the answer.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'A logic error: runs, but wrong',
            how: 'This program has no problem as far as Java is concerned. It is up to us to notice that the area of a 4 by 3 rectangle is not 7.',
            code: j`
int width = 4;
int height = 3;
int area = width + height;
System.out.println("Area: " + area);`,
            notes: [
              { line: 3, text: 'The mistake. Area needs multiplication, but there is a plus here.' },
              { line: 4, text: 'It prints 7, and not 12. No warning, no error.' },
            ],
          },
          {
            kind: 'example',
            title: 'A run-time error: it crashes',
            how: 'This compiles fine. The trouble only appears when Java reaches line 4 and tries to divide by zero. Notice that the first line still gets printed.',
            code: j`
int total = 10;
int people = 0;
System.out.println("Sharing " + total + " among " + people);
System.out.println(total / people);`,
            crashes: true,
            notes: [
              { line: 3, text: 'This line runs normally.' },
              { line: 4, text: 'Java stops here with an ArithmeticException.' },
            ],
          },
          {
            kind: 'tip',
            title: 'How to catch a logic error',
            body: 'Because Java is silent about these, you have to be the detective.',
            bullets: [
              'Test with values where **you** know the answer, like a 4 by 3 rectangle.',
              'Compare what you expected with what you got.',
              'Check the order of operations. Brackets fix a lot of problems.',
              'Try odd cases, like zero, a negative number, or a very large one.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Forgetting the brackets',
            body: 'Division goes before addition. The programmer wanted the average of two numbers but only divided the second one by 2.',
            wrong: j`
int a = 6;
int b = 4;
System.out.println(a + b / 2);`,
            right: j`
int a = 6;
int b = 4;
System.out.println((a + b) / 2);`,
          },
        ],
        questions: ['u4l2-01', 'u4l2-02', 'u4l2-03', 'u4l2-04', 'u4l2-05', 'u4l2-06', 'u4l2-07', 'u4l2-08', 'u4l2-09'],
        challenge: 'u4l2-10',
      },
      {
        id: 'u4-l3',
        unitId: 'u4',
        title: 'Debugging Like a Detective',
        summary: 'A calm, step by step way to fix code.',
        topic: 'errors',
        teach: [
          {
            kind: 'concept',
            title: 'Debugging is correcting your code',
            what: '**Debugging** is the process of finding the cause of a bug and fixing it. The secret is to stay calm and work like a detective: gather clues, form a theory, test it, and then change just one thing.',
            why: 'Professional programmers spend more time debugging than writing new code. If you learn a method now, you will fix problems in minutes instead of hours, and you will not feel stuck.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Print statements as clues',
            how: 'When you are not sure where things go wrong, print the variables along the way. The output tells you the story of your program.',
            code: j`
int a = 6;
int b = 4;
System.out.println("a = " + a + ", b = " + b);
int sum = a + b;
System.out.println("sum = " + sum);
int average = sum / 2;
System.out.println("average = " + average);`,
            notes: [
              { line: 3, text: 'Check that the inputs are what you expect.' },
              { line: 5, text: 'Check the middle step.' },
              { line: 7, text: 'Check the final answer. If it is wrong, you know which step to blame.' },
            ],
          },
          {
            kind: 'tip',
            title: 'A debugging checklist',
            body: 'When your program misbehaves, go through these steps in order:',
            bullets: [
              'Read the error message and find the line number.',
              'Check the usual suspects: semicolons, brackets, quotes, spelling and capital letters.',
              'Trace the program by hand, one line at a time, writing down each variable.',
              'Add print statements to see the real values.',
              'Change **one** thing at a time, and then run it again.',
              'Still stuck? Explain the code out loud, line by line. You will be surprised how often that reveals the bug.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The swap that does not swap',
            body: 'This one looks right at first glance. Trace it and you will see that the first value is lost before it can be copied.',
            wrong: j`
int a = 1;
int b = 2;
a = b;
b = a;
System.out.println(a + " " + b);`,
            right: j`
int a = 1;
int b = 2;
int temp = a;
a = b;
b = temp;
System.out.println(a + " " + b);`,
          },
        ],
        questions: ['u4l3-01', 'u4l3-02', 'u4l3-03', 'u4l3-04', 'u4l3-05', 'u4l3-06', 'u4l3-07', 'u4l3-08', 'u4l3-09'],
        challenge: 'u4l3-10',
      },
    ],
  },
}
