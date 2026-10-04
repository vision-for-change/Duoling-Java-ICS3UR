import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Every Program Starts with class Main ----------------
  ...topic('basics', [
    {
      id: 'u1l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'main',
      prompt: 'Which method does Java look for when it starts running your program?',
      optionStyle: 'code',
      options: [
        { text: 'main' },
        { text: 'start', feedback: 'That is a very reasonable guess, but Java only ever looks for one specific name. Look back at the shell we wrote.' },
        { text: 'run', feedback: 'It sounds right, but Java is not listening for that word. Check the shell from the lesson again.' },
        { text: 'begin', feedback: 'Nice try. Java is stricter than that, though. It wants one exact name.' },
      ],
      answer: 0,
      explanation: 'Java always starts at `main`. Think of the class as the building and `main` as the front door. No door, no way in.',
    },
    {
      id: 'u1l1-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'case',
      prompt: 'Java does not care about capital letters, so `system.out.println("Hi");` works exactly like `System.out.println("Hi");`.',
      answer: false,
      wrongFeedback: 'Careful, this one catches everybody at first. Java is case sensitive, so `system` with a small s is a different word than `System`.',
      explanation: 'Capital letters matter everywhere in Java. `System` and `String` start with a capital, and `main` is all lowercase. When something "does not exist" and you swear it does, check your capitals first.',
    },
    {
      id: 'u1l1-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'print',
      prompt: 'What does this program print?',
      code: j`
System.out.print("Go");
System.out.print("Go");
System.out.println("Go");`,
      optionStyle: 'output',
      options: [
        { text: 'GoGoGo' },
        { text: 'Go\nGo\nGo', feedback: 'Only `println` moves to a new line. The first two lines used `print`, which stays put.' },
        { text: 'Go Go Go', feedback: 'Java does not add spaces for you. If you want a space, you have to type one inside the quotes.' },
        { text: 'GoGo', feedback: 'Count the print statements. There are three of them, and all three run.' },
      ],
      answer: 0,
      highlightLines: [1, 2],
      explanation: '`print` keeps the cursor on the same line, so the first two "Go"s stick together. `println` prints and then jumps to the next line. Everything lands on one line: GoGoGo.',
    },
    {
      id: 'u1l1-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'main',
      prompt: 'Fill in the blank so Java knows where to start.',
      code: j`
public class Main {
    public static void ___(String[] args) {
        System.out.println("Ready!");
    }
}`,
      blanks: [['main']],
      bank: ['main', 'Main', 'start', 'run'],
      expectedOutput: 'Ready!',
      explanation: 'The method has to be called `main`, all lowercase. `Main` with a capital M is the name of our class, which is a different thing.',
    },
    {
      id: 'u1l1-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'semicolon',
      prompt: 'What kind of problem is in this code?',
      code: j`
System.out.println("Hello")
System.out.println("World");`,
      answer: 'syntax',
      feedback: {
        runtime: 'A runtime problem only shows up once the program is running. Java stops this one before it even starts.',
        logic: 'The program never gets a chance to run, so it cannot give a wrong answer yet.',
        none: 'Look at the end of line 1. What is missing?',
      },
      highlightLines: [1],
      explanation: 'Every statement ends with a semicolon, and line 1 is missing its one. Java reports *\';\' expected* and refuses to run anything. This is the single most common mistake in your first month of coding.',
    },
    {
      id: 'u1l1-06',
      type: 'find-bug',
      difficulty: 2,
      concept: 'spelling',
      prompt: 'One line has a typo that stops the program from compiling. Tap it.',
      code: j`
System.out.println("Welcome to Java!");
System.out.printn("Let's get started.");
System.out.println("See you in class.");`,
      bugLines: [2],
      fixedCode: j`
System.out.println("Welcome to Java!");
System.out.println("Let's get started.");
System.out.println("See you in class.");`,
      bugKind: 'syntax',
      explanation: 'Line 2 says `printn` instead of `println`. Java cannot find a method with that name, so it refuses to compile. Typos in names are a classic.',
    },
    {
      id: 'u1l1-07',
      type: 'arrange',
      difficulty: 2,
      concept: 'shell',
      prompt: 'Put the lines in order to build a complete program. One line is a decoy that does not belong.',
      lines: ['public class Main {', 'public static void main(String[] args) {', 'System.out.println("Hello, class!");', '}', '}'],
      distractors: ['System.out.println("Hello, class!")'],
      expectedOutput: 'Hello, class!',
      explanation: 'The class comes first, then `main` inside it, then your statement inside `main`, and finally the two closing braces. The decoy was missing its semicolon.',
    },
    {
      id: 'u1l1-08',
      type: 'write-code',
      difficulty: 2,
      concept: 'print',
      prompt: 'Use one `print` and one `println` so the program shows `Hello, World!` on a single line.',
      starter: j`
// 1. print the first part, and stay on the same line

// 2. println the second part
`,
      solution: j`
System.out.print("Hello, ");
System.out.println("World!");`,
      tests: [{ label: 'one line of output', output: 'Hello, World!' }],
      mustInclude: [
        { pattern: 'System\\.out\\.print\\(', message: 'Use `System.out.print(...)` for the first part.' },
        { pattern: 'System\\.out\\.println\\(', message: 'Use `System.out.println(...)` for the second part.' },
      ],
      explanation: '`print` does not move to a new line, so the second statement continues right after it. Notice the space inside "Hello, " because Java will not add one for you.',
    },
  ]),

  // ---------------- Lesson 2: Variables ----------------
  ...topic('variables', [
    {
      id: 'u1l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'declare',
      prompt: 'Which line creates an `int` variable called `lives` that holds 3?',
      optionStyle: 'code',
      options: [
        { text: 'int lives = 3;' },
        { text: 'lives int = 3;', feedback: 'You are close. In Java the type comes first, and then the name.' },
        { text: 'int 3 = lives;', feedback: 'Flip it around. The name goes on the left of the equals sign and the value goes on the right, like pouring 3 into a box labelled lives.' },
        { text: 'int lives == 3;', feedback: 'Two equals signs ask a question ("are these equal?"). To store a value you only need one.' },
      ],
      answer: 0,
      explanation: 'The pattern is **type, name, equals, value, semicolon**. So `int lives = 3;` creates a whole-number box called `lives` with 3 inside.',
    },
    {
      id: 'u1l2-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'assign',
      prompt: 'What does this program print?',
      code: j`
int coins = 10;
coins = 25;
System.out.println(coins);`,
      optionStyle: 'output',
      options: [
        { text: '25' },
        { text: '10', feedback: 'Line 2 stored a new value on top of the old one. The 10 is gone.' },
        { text: '35', feedback: 'The equals sign replaces what is in the box, it does not add to it. Adding would be `coins = coins + 25;`' },
        { text: 'coins', feedback: 'There are no quotes around `coins`, so Java uses the variable and prints whatever is inside it.' },
      ],
      answer: 0,
      highlightLines: [2],
      explanation: 'Assigning a new value empties the box and refills it. After line 2, `coins` holds 25, so 25 is what we see.',
    },
    {
      id: 'u1l2-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'declare',
      prompt: '**Declaring** a variable (like `int x;`) and **initializing** it (giving it its first value) mean the same thing.',
      answer: false,
      wrongFeedback: 'They are two different steps. `int x;` only builds the box. Putting the first value in is initializing.',
      explanation: '`int x;` declares the variable, and `x = 5;` initializes it. Most of the time we do both at once with `int x = 5;`.',
    },
    {
      id: 'u1l2-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'declare',
      prompt: 'Fill in the blank so the program stores the price `4.99`.',
      code: j`
___ price = 4.99;
System.out.println(price);`,
      blanks: [['double']],
      bank: ['double', 'int', 'String', 'boolean'],
      expectedOutput: '4.99',
      explanation: '4.99 has a decimal point, so it needs a `double`. An `int` can only hold whole numbers.',
    },
    {
      id: 'u1l2-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'copy',
      prompt: 'What does this program print?',
      code: j`
int a = 5;
int b = a;
a = 8;
System.out.println(b);`,
      optionStyle: 'output',
      options: [
        { text: '5' },
        { text: '8', feedback: 'On line 2, `b` got its own copy of 5. Changing `a` afterwards does not reach back and change `b`.' },
        { text: '13', feedback: 'Nothing is being added here. Each equals sign just stores a value.' },
        { text: 'a', feedback: 'A variable stores a value, never the name of another variable.' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: 'Line 2 copies the value 5 into `b`. After that the two boxes are completely separate, so `b` stays 5 even when `a` becomes 8.',
    },
    {
      id: 'u1l2-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'initialize',
      prompt: 'What is wrong with this code?',
      code: j`
int score;
score = score + 10;
System.out.println(score);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java spots this before the program ever starts, so it cannot be a runtime error.',
        logic: 'The program never gets to run, because Java refuses to compile it.',
        none: 'Look closely at line 2. What is inside `score` the first time we read it?',
      },
      highlightLines: [1, 2],
      explanation: '`score` was declared but never given a value, so `score + 10` would be reading an empty box. Java stops with *variable score might not have been initialized*. The fix is `int score = 0;`.',
    },
    {
      id: 'u1l2-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'assign',
      prompt: 'Trace it line by line, then type exactly what this program prints.',
      code: j`
int x = 3;
int y = 4;
x = y;
y = x + 2;
System.out.println(x + " " + y);`,
      answer: '4 6',
      highlightLines: [3, 4],
      explanation: 'Line 3 copies 4 into `x`. Line 4 then uses the NEW `x`, so `y = 4 + 2 = 6`. The output is `4 6`.',
    },
    {
      id: 'u1l2-08',
      type: 'arrange',
      difficulty: 2,
      concept: 'swap',
      prompt: 'Arrange the lines so the program **swaps** `a` and `b` and prints `2 1`.',
      lines: ['int a = 1;', 'int b = 2;', 'int temp = a;', 'a = b;', 'b = temp;', 'System.out.println(a + " " + b);'],
      alternatives: [[1, 0, 2, 3, 4, 5]],
      expectedOutput: '2 1',
      explanation: 'Think of two cups of juice you want to swap. You need a third empty cup. Save `a` in `temp`, copy `b` into `a`, then pour the saved value into `b`.',
    },
    {
      id: 'u1l2-09',
      type: 'write-code',
      difficulty: 2,
      concept: 'assign',
      prompt: 'Create an `int` called `score` equal to 10. Then give `score` 5 more points by assigning `score = score + 5;` and print `score`.',
      starter: j`
// 1. create the variable score and give it 10

// 2. add 5 to it

// 3. print it
`,
      solution: j`
int score = 10;
score = score + 5;
System.out.println(score);`,
      tests: [{ label: 'prints 15', output: '15' }],
      mustInclude: [
        { pattern: 'int\\s+score', message: 'Declare an `int` called `score`.' },
        { pattern: 'score\\s*=\\s*score\\s*\\+\\s*5', message: 'Use `score = score + 5;` to add the points.' },
      ],
      explanation: 'The right side runs first. Java reads the old `score` (10), adds 5, and then stores the answer back into the same box.',
    },
  ]),

  // ---------------- Lesson 3: The 8 primitive data types ----------------
  ...topic('types', [
    {
      id: 'u1l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'primitive',
      prompt: 'Which of these is **not** one of Java\'s primitive types?',
      optionStyle: 'code',
      options: [
        { text: 'String' },
        { text: 'int', feedback: '`int` is one of the eight primitives. It is probably the one you will use most.' },
        { text: 'boolean', feedback: '`boolean` is a primitive. It holds only `true` or `false`.' },
        { text: 'char', feedback: '`char` is a primitive that holds a single character.' },
      ],
      answer: 0,
      explanation: '`String` is not a primitive. It is a class, which is why it starts with a capital letter. The next lesson is all about why.',
    },
    {
      id: 'u1l3-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'choose-type',
      prompt: 'Which type is the best fit for the number of students in a class?',
      optionStyle: 'code',
      options: [
        { text: 'int' },
        { text: 'double', feedback: 'You cannot have 27.5 students, so whole numbers are a better fit. Save `double` for decimals.' },
        { text: 'boolean', feedback: '`boolean` only holds `true` or `false`, not a count.' },
        { text: 'char', feedback: '`char` holds one single character, not a number you want to count with.' },
      ],
      answer: 0,
      explanation: 'A count of whole things goes in an `int`. There is no such thing as half a student.',
    },
    {
      id: 'u1l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'primitive',
      prompt: 'Java has exactly 8 primitive data types.',
      answer: true,
      wrongFeedback: 'It really is eight: byte, short, int, long, float, double, char and boolean. Count them on your fingers.',
      explanation: 'Four of them are for whole numbers or characters (`byte`, `short`, `int`, `long`), two are for decimals (`float`, `double`), plus `char` and `boolean`. That makes eight.',
    },
    {
      id: 'u1l3-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'choose-type',
      prompt: 'Fill in the blank so the variable can store a single letter.',
      code: j`
___ initial = 'J';
System.out.println(initial);`,
      blanks: [['char']],
      bank: ['char', 'String', 'boolean', 'int'],
      expectedOutput: 'J',
      explanation: 'One character in single quotes is a `char`. We use a `String` when there is more than one character.',
    },
    {
      id: 'u1l3-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'char-number',
      prompt: 'What does this program print?',
      code: j`
int code = 'A';
System.out.println(code);`,
      optionStyle: 'output',
      options: [
        { text: '65' },
        { text: 'A', feedback: 'Good thinking, but the variable is an `int`. A `char` is really stored as a number, so the int ends up holding that number.' },
        { text: 'a', feedback: 'Java would never lowercase it for you. Capital A and lowercase a are different characters with different numbers.' },
        { text: 'Compile error', feedback: 'This one is allowed. A `char` fits inside an `int` without any trouble.' },
      ],
      answer: 0,
      explanation: 'Every `char` is stored as a number (its Unicode value). `\'A\'` is 65, so the `int` ends up holding 65.',
    },
    {
      id: 'u1l3-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'decimal-in-int',
      prompt: 'What happens when we try to run this code?',
      code: j`
int height = 5.9;
System.out.println(height);`,
      answer: 'syntax',
      feedback: {
        runtime: 'The program does not even start. Java refuses to compile it first.',
        logic: 'It never runs, so it cannot print a wrong answer. Java stops it earlier than that.',
        none: 'Look at the value on the right. Does 5.9 fit in a whole-number box?',
      },
      highlightLines: [1],
      explanation: 'An `int` cannot hold 5.9, and Java will not quietly chop off the .9 for you. It stops with *possible lossy conversion from double to int*. Use a `double` instead.',
    },
    {
      id: 'u1l3-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'float-f',
      prompt: 'What happens when we try to run this code?',
      code: j`
float price = 4.99;
System.out.println(price);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program starts, so it cannot be a runtime error.',
        logic: 'The program never runs, so there is no wrong answer to print.',
        none: 'Java treats a plain decimal like 4.99 as a double. Is a double allowed inside a float?',
      },
      highlightLines: [1],
      explanation: 'A plain decimal is a `double` in Java, and a `double` does not fit in a `float` box. Add an `f` to say you really mean a float: `4.99f`. Most of the time you will simply use `double`.',
    },
    {
      id: 'u1l3-08',
      type: 'predict-output',
      difficulty: 3,
      concept: 'overflow',
      prompt: 'The biggest `int` is 2147483647. What does this program print?',
      code: j`
int big = 2147483647;
big = big + 1;
System.out.println(big);`,
      optionStyle: 'output',
      options: [
        { text: '-2147483648' },
        { text: '2147483648', feedback: 'That is what a calculator would say. An `int` only has room for numbers up to 2147483647, so it cannot hold that.' },
        { text: '0', feedback: 'It does not stop at zero. The number wraps around to the other end of the `int` range.' },
        { text: 'Compile error', feedback: 'Java compiles this happily and does not warn you, which is exactly what makes overflow sneaky.' },
      ],
      answer: 0,
      highlightLines: [2],
      explanation: 'When an `int` runs out of room it wraps around, like a car odometer rolling over. One past the maximum becomes the smallest value. If you need bigger numbers, switch to `long`.',
    },
    {
      id: 'u1l3-09',
      type: 'write-code',
      difficulty: 2,
      concept: 'declare-types',
      prompt: 'Declare an `int` called `age` (16), a `double` called `gpa` (3.5), a `char` called `initial` (\'A\') and a `boolean` called `honourRoll` (true). Print them on one line, separated by spaces.',
      starter: j`
// declare the four variables

// print them like: 16 3.5 A true
`,
      solution: j`
int age = 16;
double gpa = 3.5;
char initial = 'A';
boolean honourRoll = true;
System.out.println(age + " " + gpa + " " + initial + " " + honourRoll);`,
      tests: [{ label: 'prints all four values', output: '16 3.5 A true' }],
      mustInclude: [
        { pattern: 'int\\s+age', message: 'Declare an `int` called `age`.' },
        { pattern: 'double\\s+gpa', message: 'Declare a `double` called `gpa`.' },
        { pattern: 'char\\s+initial', message: 'Declare a `char` called `initial`.' },
        { pattern: 'boolean\\s+honourRoll', message: 'Declare a `boolean` called `honourRoll`.' },
      ],
      explanation: 'Each value goes into the type that suits it. The `" "` between them adds the spaces, since Java will not put any in for you.',
    },
  ]),

  // ---------------- Lesson 4: Strings ----------------
  ...topic('types', [
    {
      id: 'u1l4-01',
      type: 'true-false',
      difficulty: 1,
      concept: 'string-class',
      prompt: '`String` is one of the 8 primitive data types.',
      answer: false,
      wrongFeedback: 'Not quite. The eight primitives all start with a small letter. `String` has a capital S because it is a class.',
      explanation: 'A `String` is an object, not a primitive. That is the reason it begins with a capital letter, and it is also why it comes with extra tools like `length()`.',
    },
    {
      id: 'u1l4-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'string-vs-char',
      prompt: 'Which line correctly stores the word Java in a variable?',
      optionStyle: 'code',
      options: [
        { text: 'String lang = "Java";' },
        { text: 'string lang = "Java";', feedback: 'Java is case sensitive. The type is `String` with a capital S.' },
        { text: 'String lang = \'Java\';', feedback: 'Single quotes are only for one character. Words need double quotes.' },
        { text: 'String lang = Java;', feedback: 'Without quotes, Java thinks `Java` is the name of a variable, and it cannot find one.' },
      ],
      answer: 0,
      explanation: 'Text goes in a `String` and sits inside **double quotes**. Single quotes are for a single `char`.',
    },
    {
      id: 'u1l4-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'length',
      prompt: 'What does this program print?',
      code: j`
String message = "Hi there";
System.out.println(message.length());`,
      optionStyle: 'output',
      options: [
        { text: '8' },
        { text: '7', feedback: 'You counted the letters but skipped the space. Spaces are characters too.' },
        { text: '2', feedback: '`length()` counts every character in the String, not just the words.' },
        { text: 'Hi there', feedback: '`length()` gives back a count, not the text itself.' },
      ],
      answer: 0,
      explanation: '`Hi there` has 2 letters, a space, and 5 more letters. That is 8 characters in total, and `length()` counts the space.',
    },
    {
      id: 'u1l4-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'string-class',
      prompt: 'Fill in the blank to store a greeting.',
      code: j`
___ greeting = "Good morning";
System.out.println(greeting);`,
      blanks: [['String']],
      bank: ['String', 'char', 'string', 'text'],
      expectedOutput: 'Good morning',
      explanation: 'It has to be `String` with a capital S. There is no `text` type, and `char` only holds a single character.',
    },
    {
      id: 'u1l4-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'quotes',
      prompt: 'What kind of problem is in this code?',
      code: j`
String name = 'Sam';
System.out.println(name);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java never gets far enough to run it. The problem is found while compiling.',
        logic: 'The program does not run at all, so it cannot be a wrong answer.',
        none: 'Look at the quotes around Sam. Are they the right kind?',
      },
      highlightLines: [1],
      explanation: 'Single quotes mean one `char`, and `Sam` is three characters, so Java complains about an unclosed character literal. Use double quotes: `"Sam"`.',
    },
    {
      id: 'u1l4-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'string-methods',
      prompt: 'What does this program print?',
      code: j`
String word = "coffee";
System.out.println(word.toUpperCase());
System.out.println(word.charAt(0));`,
      optionStyle: 'output',
      options: [
        { text: 'COFFEE\nc' },
        { text: 'COFFEE\nC', feedback: '`toUpperCase()` returns a new String. The original `word` is still lowercase, so `charAt(0)` gives a small c.' },
        { text: 'coffee\nc', feedback: 'The first line calls `toUpperCase()`, so that line is printed in capitals.' },
        { text: 'COFFEE\no', feedback: 'Positions start counting at 0, not at 1. The character at position 0 is the very first one.' },
      ],
      answer: 0,
      explanation: '`toUpperCase()` gives back an uppercase copy but does not change `word`. And `charAt(0)` grabs the first character, because Java counts positions from 0.',
    },
    {
      id: 'u1l4-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'concat',
      prompt: 'What does this program print?',
      code: j`
String first = "Ada";
String last = "Lovelace";
System.out.println(first + " " + last);`,
      optionStyle: 'output',
      options: [
        { text: 'Ada Lovelace' },
        { text: 'AdaLovelace', feedback: 'Java does not add a space on its own. We put one in the middle, the `" "`.' },
        { text: 'first last', feedback: 'There are no quotes around `first` and `last`, so Java uses the values stored in them.' },
        { text: 'Ada + Lovelace', feedback: 'The plus signs are instructions to join the pieces together, not text to print.' },
      ],
      answer: 0,
      explanation: 'Between Strings, `+` glues the pieces together. The `" "` in the middle is a String holding one space, which is why the names do not touch.',
    },
    {
      id: 'u1l4-08',
      type: 'find-bug',
      difficulty: 3,
      concept: 'string-class',
      prompt: 'This program should greet the student, but it will not compile. Tap the line with the bug.',
      code: j`
public class Main {
    public static void main(String[] args) {
        String name = "Sam";
        int age = "16";
        System.out.println(name + " is " + age);
    }
}`,
      bugLines: [4],
      fixedCode: j`
public class Main {
    public static void main(String[] args) {
        String name = "Sam";
        int age = 16;
        System.out.println(name + " is " + age);
    }
}`,
      bugKind: 'syntax',
      explanation: 'Quotes turn 16 into text, and text does not fit in an `int` box. Take the quotes away and `16` is a real number again.',
    },
    {
      id: 'u1l4-09',
      type: 'write-code',
      difficulty: 2,
      concept: 'string-methods',
      prompt: 'Store the word `programming` in a `String` called `word`. Print its length on one line and the word in capital letters on the next line.',
      starter: j`
// 1. create the String called word

// 2. print its length

// 3. print it in capital letters
`,
      solution: j`
String word = "programming";
System.out.println(word.length());
System.out.println(word.toUpperCase());`,
      tests: [{ label: 'length then capitals', output: '11\nPROGRAMMING' }],
      mustInclude: [
        { pattern: 'String\\s+word', message: 'Declare a `String` called `word`.' },
        { pattern: '\\.length\\(\\)', message: 'Use `length()` to count the characters.' },
        { pattern: '\\.toUpperCase\\(\\)', message: 'Use `toUpperCase()` for the capital letters.' },
      ],
      explanation: 'A String comes with built-in tools. You call them with a dot after the variable name, like `word.length()`.',
    },
  ]),

  // ---------------- Lesson 5: Constants ----------------
  ...topic('variables', [
    {
      id: 'u1l5-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'final',
      prompt: 'Which keyword makes a variable a constant that can never change?',
      optionStyle: 'code',
      options: [
        { text: 'final' },
        { text: 'static', feedback: '`static` does something different, and we will meet it later. The word we want here means "this is the last word on this value".' },
        { text: 'const', feedback: 'Other languages use `const`, and Java even keeps the word reserved, but it does nothing here.' },
        { text: 'fixed', feedback: 'That is a good descriptive name, but Java does not use it.' },
      ],
      answer: 0,
      explanation: 'Put `final` in front of a variable and Java will not allow anyone to assign to it again. It becomes a constant.',
    },
    {
      id: 'u1l5-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'use-constant',
      prompt: 'What does this program print?',
      code: j`
final int DAYS_IN_WEEK = 7;
int weeks = 3;
System.out.println(weeks * DAYS_IN_WEEK);`,
      optionStyle: 'output',
      options: [
        { text: '21' },
        { text: '10', feedback: 'That would be 3 plus 7. The star means multiply.' },
        { text: '37', feedback: 'Nothing is being joined as text. Both values are numbers, so Java multiplies them.' },
        { text: 'weeks * DAYS_IN_WEEK', feedback: 'There are no quotes, so Java works out the values instead of printing the names.' },
      ],
      answer: 0,
      explanation: 'A constant is read like any other variable. 3 weeks times 7 days gives 21.',
    },
    {
      id: 'u1l5-03',
      type: 'error-type',
      difficulty: 2,
      concept: 'change-final',
      prompt: 'What happens when we try to run this code?',
      code: j`
final int MAX_LIVES = 3;
MAX_LIVES = 5;
System.out.println(MAX_LIVES);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java notices this before the program starts. That makes it a compile-time problem.',
        logic: 'The program never runs, so it cannot print a wrong answer.',
        none: 'Look at line 2. What does `final` promise?',
      },
      highlightLines: [2],
      explanation: 'Line 2 tries to change something we promised would never change. Java stops with *cannot assign a value to final variable MAX_LIVES*.',
    },
    {
      id: 'u1l5-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'final',
      prompt: 'Fill in the blank to make `TAX_RATE` a constant.',
      code: j`
___ double TAX_RATE = 0.13;
System.out.println(100 * TAX_RATE);`,
      blanks: [['final']],
      bank: ['final', 'static', 'const', 'public'],
      expectedOutput: '13.0',
      explanation: '`final double TAX_RATE = 0.13;` locks the value in. The name is in capitals with underscores, which is the habit everyone follows for constants.',
    },
    {
      id: 'u1l5-05',
      type: 'true-false',
      difficulty: 1,
      concept: 'naming',
      prompt: 'By convention, constants are written in UPPER_SNAKE_CASE, like `MAX_SCORE`.',
      answer: true,
      wrongFeedback: 'It is true. It is not a rule Java enforces, but every programmer follows it so constants are easy to spot.',
      explanation: 'Capitals with underscores between words tell anyone reading your code, "this one never changes".',
    },
    {
      id: 'u1l5-06',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'why-constant',
      prompt: 'Your program uses the tax rate 0.13 in twelve different places. Why is a constant like `TAX_RATE` better than typing 0.13 each time?',
      options: [
        { text: 'If the rate ever changes, you fix it in one place instead of twelve.' },
        { text: 'Constants run faster than numbers.', feedback: 'The speed difference is too small to matter. The real benefit is for the people reading and changing the code.' },
        { text: 'Java refuses to compile numbers that are typed directly.', feedback: 'Typing numbers directly is allowed. It is just harder to maintain.' },
        { text: 'Constants use less memory.', feedback: 'Memory is not the point. The point is that the code is easier to read and to change.' },
      ],
      answer: 0,
      explanation: 'A named constant means one change fixes everything. It also tells the reader what the number means, because `TAX_RATE` explains itself and a lone 0.13 does not.',
    },
    {
      id: 'u1l5-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'use-constant',
      prompt: 'What does this program print?',
      code: j`
final double PI = 3.14;
double radius = 2;
System.out.println(PI * radius * radius);`,
      optionStyle: 'output',
      options: [
        { text: '12.56' },
        { text: '6.28', feedback: 'That would be PI times radius once. There are two radius factors, so multiply again.' },
        { text: '3.14', feedback: 'That is just the value of PI. It is multiplied by the radius twice before printing.' },
        { text: '12.0', feedback: 'Do not drop the PI part. 3.14 times 2 times 2 is more than 12.' },
      ],
      answer: 0,
      explanation: '3.14 times 2 is 6.28, and 6.28 times 2 is 12.56. That is the area of a circle with radius 2.',
    },
    {
      id: 'u1l5-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'use-constant',
      prompt: 'Declare a constant `SPEED` equal to 60 and an `int` variable `hours` equal to 3. Then print the distance, which is `SPEED * hours`.',
      starter: j`
// 1. declare the constant SPEED (60)

// 2. declare the variable hours (3)

// 3. print SPEED * hours
`,
      solution: j`
final int SPEED = 60;
int hours = 3;
System.out.println(SPEED * hours);`,
      tests: [{ label: 'prints the distance', output: '180' }],
      mustInclude: [
        { pattern: 'final\\s+int\\s+SPEED', message: 'Declare `SPEED` with `final int` so it is a constant.' },
        { pattern: '\\bhours\\b', message: 'Use a variable called `hours`.' },
      ],
      explanation: '`final int SPEED = 60;` is the constant, `int hours = 3;` is a regular variable, and `SPEED * hours` works out the 180.',
    },
  ]),

  // ---------------- Unit 1 checkpoint ----------------
  ...topic('variables', [
    {
      id: 'u1cp-01',
      type: 'predict-output',
      difficulty: 2,
      concept: 'use-constant',
      prompt: 'What does this program print?',
      code: j`
final int PLAYERS = 4;
int cards = 3;
cards = cards + PLAYERS;
System.out.println("Cards: " + cards);`,
      optionStyle: 'output',
      options: [
        { text: 'Cards: 7' },
        { text: 'Cards: 3', feedback: 'Line 3 updates `cards` before it is printed, so it is no longer 3.' },
        { text: 'Cards: 34', feedback: 'Both values are numbers, so the plus adds them. It only joins text when a String is involved.' },
        { text: 'Cards: cards', feedback: 'The second `cards` has no quotes, so Java prints the number stored in it.' },
      ],
      answer: 0,
      explanation: '`cards` starts at 3, then line 3 stores 3 + 4 = 7 back into it. The text "Cards: " is joined to the 7 when it is printed.',
    },
    {
      id: 'u1cp-02',
      type: 'error-type',
      difficulty: 2,
      concept: 'change-final',
      prompt: 'What happens when we run this code?',
      code: j`
final int MAX = 10;
MAX = 20;
System.out.println(MAX);`,
      answer: 'syntax',
      feedback: {
        runtime: 'It never gets as far as running. Java catches it while compiling.',
        logic: 'The program does not run, so it cannot be a wrong answer.',
        none: 'Look again at line 2 and think about what `final` means.',
      },
      highlightLines: [2],
      explanation: 'A `final` variable can only be given a value once. Java stops with *cannot assign a value to final variable MAX*.',
    },
    {
      id: 'u1cp-03',
      type: 'multiple-choice',
      difficulty: 3,
      concept: 'choose-type',
      prompt: 'Which declaration is valid Java?',
      optionStyle: 'code',
      options: [
        { text: 'float temp = 36.6f;' },
        { text: 'float temp = 36.6;', feedback: 'A plain decimal is a double, and a double will not fit into a float. The f at the end fixes it.' },
        { text: 'long big = 3000000000;', feedback: 'Java reads a plain whole number as an int, and this one is too big for an int. A long needs an L at the end.' },
        { text: 'char letter = "A";', feedback: 'Double quotes make a String. A char needs single quotes.' },
      ],
      answer: 0,
      explanation: 'The little `f` tells Java the number is a float. The other three each break a rule: a missing f, a missing L, and the wrong kind of quote.',
    },
    {
      id: 'u1cp-04',
      type: 'find-bug',
      difficulty: 3,
      concept: 'shell',
      topic: 'basics',
      prompt: 'This program should print a welcome message, but it will not compile. Tap the buggy line.',
      code: j`
public class Main {
    public static void main(String[] args) {
        String club = "Robotics";
        System.out.println("Welcome to the " + club + " club!")
    }
}`,
      bugLines: [4],
      fixedCode: j`
public class Main {
    public static void main(String[] args) {
        String club = "Robotics";
        System.out.println("Welcome to the " + club + " club!");
    }
}`,
      bugKind: 'syntax',
      explanation: 'Line 4 is missing its semicolon at the end. When your code looks perfect and still will not compile, read the line above the one Java complains about too.',
    },
    {
      id: 'u1cp-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'shell',
      topic: 'basics',
      prompt: 'Complete the shell of the program.',
      code: j`
public class Main {
    public ___ void main(String[] args) {
        System.out.println("All set!");
    }
}`,
      blanks: [['static']],
      bank: ['static', 'final', 'class', 'int'],
      expectedOutput: 'All set!',
      explanation: 'The full line is `public static void main(String[] args)`. It is the same every single time, so make it muscle memory.',
    },
    {
      id: 'u1cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'declare-types',
      topic: 'types',
      prompt: 'Make a `String` called `club` holding `Robotics` and an `int` called `members` holding `24`. Print them in the form `Robotics has 24 members`.',
      starter: j`
// 1. declare club and members

// 2. print: Robotics has 24 members
`,
      solution: j`
String club = "Robotics";
int members = 24;
System.out.println(club + " has " + members + " members");`,
      tests: [{ label: 'prints the sentence', output: 'Robotics has 24 members' }],
      mustInclude: [
        { pattern: 'String\\s+club', message: 'Declare a `String` called `club`.' },
        { pattern: 'int\\s+members', message: 'Declare an `int` called `members`.' },
        { pattern: 'club\\s*\\+', message: 'Join the pieces with `+`, using the `club` variable rather than typing the word again.' },
      ],
      explanation: 'The text pieces sit in quotes and the variables do not. Joining them with `+` builds the whole sentence.',
    },
  ]),
]

export const unit1: UnitContent = {
  questions,
  unit: {
    id: 'u1',
    number: 1,
    title: 'Getting Started',
    tagline: 'The shell of a program, boxes for your data, and the types that fit inside them.',
    color: 'brew',
    icon: 'package',
    topics: ['basics', 'variables', 'types'],
    checkpoint: ['u1cp-01', 'u1cp-02', 'u1cp-03', 'u1cp-04', 'u1cp-05', 'u1cp-06'],
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'u1',
        title: 'Every Program Starts with class Main',
        summary: 'The shell every Java program needs.',
        topic: 'basics',
        teach: [
          {
            kind: 'concept',
            title: 'Before anything else, the shell',
            what: 'Every Java program lives inside a **class**, and it starts running at a method called **main**. Think of the class as a building and `main` as the front door. Java walks through the door and runs everything inside the curly braces, from top to bottom.',
            why: 'If the class or the `main` line is missing or spelled wrong, Java has nowhere to begin and you will get an error before anything runs. When a brand new program will not work, check this shell first.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Your very first program',
            how: 'Everything between the inner braces runs when you press Run. `println` prints and then moves to the next line, and `print` stays on the same line.',
            code: j`
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from my first program!");
        System.out.print("No new line here. ");
        System.out.println("But this one adds one.");
    }
}`,
            notes: [
              { line: 1, text: 'The class. Its name starts with a capital letter.' },
              { line: 2, text: 'The main method. Java starts here, every single time.' },
              { line: 3, text: 'println prints the text and then moves to a new line.' },
              { line: 4, text: 'print stays on the same line.' },
            ],
          },
          {
            kind: 'tip',
            title: 'A few habits to start today',
            body: 'To save space, most examples from here on show only the lines that go inside `main`. When you write a real program, wrap them in the shell yourself. And keep these habits:',
            bullets: [
              'Every statement ends with a semicolon.',
              'Curly braces always come in pairs, so every `{` needs its `}`.',
              'Java is case sensitive. `System` and `String` have a capital letter, and `main` is all lowercase.',
              'Text goes inside double quotes.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The missing semicolon',
            body: 'I see this one in every class, every year. Forget the semicolon and Java will not run the program at all.',
            wrong: j`System.out.println("Hello")`,
            right: j`System.out.println("Hello");`,
          },
        ],
        questions: ['u1l1-01', 'u1l1-02', 'u1l1-03', 'u1l1-04', 'u1l1-05', 'u1l1-06', 'u1l1-07'],
        challenge: 'u1l1-08',
      },
      {
        id: 'u1-l2',
        unitId: 'u1',
        title: 'Variables: Boxes for Values',
        summary: 'Declare, initialize and change a variable.',
        topic: 'variables',
        teach: [
          {
            kind: 'concept',
            title: 'A variable is a labelled box',
            what: 'A **variable** reserves a little space in the computer\'s memory and gives it a name. Picture a box with a label on the front. You can put a value inside, look at it later, or swap it for a new one.',
            why: 'Programs have to remember things: a score, a name, a price. Without variables every value would disappear the moment you used it.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Declare it, fill it, change it',
            how: 'Write the **type**, then the **name**, then `=` and the **value**. Later on you can use `=` again to put a different value in the same box.',
            code: j`
int a = 4;
System.out.println(a);
a = 9;
System.out.println(a);`,
            notes: [
              { line: 1, text: 'Declare an int box called a and put 4 inside.' },
              { line: 2, text: 'Print what is inside the box.' },
              { line: 3, text: 'Assign a new value. The 4 is replaced by 9.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Naming your boxes',
            body: 'Java has a few rules for names, and a few habits that make your code easier to read:',
            bullets: [
              'Start with a letter (or `_` or `$`), never with a digit.',
              'Use letters, digits and underscores only. No spaces and no hyphens.',
              'You cannot use words Java already owns, like `int` or `class`.',
              'Capitals matter. `score` and `Score` are two different variables.',
              'By habit we write `camelCase`, like `highScore`, so names are easy to read.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Reading an empty box',
            body: 'Declaring a variable builds the box, but it does not put anything inside. Java will not let you use a box that has never been filled.',
            wrong: j`
int score;
System.out.println(score);`,
            right: j`
int score = 0;
System.out.println(score);`,
          },
        ],
        questions: ['u1l2-01', 'u1l2-02', 'u1l2-03', 'u1l2-04', 'u1l2-05', 'u1l2-06', 'u1l2-07', 'u1l2-08'],
        challenge: 'u1l2-09',
      },
      {
        id: 'u1-l3',
        unitId: 'u1',
        title: 'The 8 Primitive Data Types',
        summary: 'byte, short, int, long, float, double, char and boolean.',
        topic: 'types',
        teach: [
          {
            kind: 'concept',
            title: 'Every box has a type',
            what: 'The **type** tells Java what kind of thing goes in the box. Java has exactly **8 primitive types**. Four hold whole numbers (`byte`, `short`, `int`, `long`), two hold decimals (`float`, `double`), one holds a single character (`char`), and one holds `true` or `false` (`boolean`).',
            why: 'Different values need different amounts of room, and the type lets Java reserve the right amount. It also lets Java catch silly mistakes early, like trying to squeeze 5.9 into a whole-number box.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'All eight in one program',
            how: 'Look at how each value is written. A `long` ends in `L`, a `float` ends in `f`, and a `char` lives inside single quotes.',
            code: j`
byte tiny = 100;
short small = 20000;
int students = 28;
long population = 8000000000L;
float temp = 36.6f;
double average = 87.5;
char grade = 'A';
boolean isOpen = true;
System.out.println(students + " " + average + " " + grade + " " + isOpen);`,
            notes: [
              { line: 1, text: 'byte: whole numbers from -128 to 127.' },
              { line: 3, text: 'int: whole numbers up to about 2 billion. This is your everyday choice.' },
              { line: 4, text: 'long: really big whole numbers, and the L is required.' },
              { line: 5, text: 'float: decimals, and the f is required.' },
              { line: 6, text: 'double: decimals. This is the one you will use most.' },
              { line: 7, text: 'char: exactly one character in single quotes.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Which one should I pick?',
            body: 'You do not have to agonize over this. In this course the answer is almost always one of these:',
            bullets: [
              '`int` for whole numbers, like ages, counts and scores.',
              '`double` for anything with a decimal point, like prices and averages.',
              '`char` for one character, `boolean` for a yes or no.',
              '`long` only when an `int` is too small, and `byte`, `short` and `float` almost never.',
            ],
          },
          {
            kind: 'mistake',
            title: 'A decimal in a whole-number box',
            body: 'An `int` cannot hold 5.9, and Java will not quietly chop off the .9 for you. It stops and makes you decide.',
            wrong: j`
int height = 5.9;
System.out.println(height);`,
            right: j`
double height = 5.9;
System.out.println(height);`,
          },
        ],
        questions: ['u1l3-01', 'u1l3-02', 'u1l3-03', 'u1l3-04', 'u1l3-05', 'u1l3-06', 'u1l3-07', 'u1l3-08'],
        challenge: 'u1l3-09',
      },
      {
        id: 'u1-l4',
        unitId: 'u1',
        title: 'Strings: Why Are They Not Primitive?',
        summary: 'Text, quotes and a few handy tools.',
        topic: 'types',
        teach: [
          {
            kind: 'concept',
            title: 'String is a class, not a primitive',
            what: 'A `String` holds text, which is a whole chain of characters inside **double quotes**. It is not one of the 8 primitives. It is a **class**, and that is why it starts with a capital S. A primitive holds one simple value. A String is an object that holds many characters and comes with its own tools.',
            why: 'Names, messages and passwords are all text, so you will use Strings constantly. Because a String is an object, it can do useful things for you, like tell you its own length or shout in capital letters.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'A String and its tools',
            how: 'You call a tool by putting a dot after the String and then the tool name. And remember that Java counts positions from 0, not from 1.',
            code: j`
String name = "Ada Lovelace";
System.out.println(name.length());
System.out.println(name.toUpperCase());
System.out.println(name.charAt(0));
System.out.println("Hello, " + name + "!");`,
            notes: [
              { line: 2, text: 'length() counts every character, including the space. That is 12.' },
              { line: 3, text: 'toUpperCase() gives back a capital-letter copy.' },
              { line: 4, text: 'charAt(0) is the very first character, because we start counting at 0.' },
              { line: 5, text: 'Plus joins Strings together. We will come back to that in the math unit.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Double quotes or single quotes?',
            body: 'This catches everyone once, so let us get it out of the way. Double quotes make a **String**, and single quotes make a single **char**.',
            bullets: [
              '`"A"` is a String with one letter in it.',
              '`\'A\'` is a char. It is a primitive, and it is stored as a number.',
              '`"Java"` needs double quotes, because it has more than one character.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Single quotes around a word',
            body: 'Single quotes only have room for one character. Put a whole word in them and Java gets confused.',
            wrong: j`
String name = 'Sam';
System.out.println(name);`,
            right: j`
String name = "Sam";
System.out.println(name);`,
          },
        ],
        questions: ['u1l4-01', 'u1l4-02', 'u1l4-03', 'u1l4-04', 'u1l4-05', 'u1l4-06', 'u1l4-07', 'u1l4-08'],
        challenge: 'u1l4-09',
      },
      {
        id: 'u1-l5',
        unitId: 'u1',
        title: 'Constants with final',
        summary: 'Values that never change.',
        topic: 'variables',
        teach: [
          {
            kind: 'concept',
            title: 'A box with a lock on it',
            what: 'Put the word `final` in front of a variable and it becomes a **constant**. Once it has its value, nobody can change it, not even you. We write constant names in CAPITAL_LETTERS with underscores so they stand out.',
            why: 'Some values should never change while a program runs: the days in a week, a tax rate, the number of lives in a game. A constant protects them from accidents, and it gives the number a name that explains itself.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Using a constant',
            how: 'You read a constant exactly like any other variable. You just cannot assign to it again.',
            code: j`
final int DAYS_IN_WEEK = 7;
final double TAX_RATE = 0.13;
int weeks = 3;
System.out.println(weeks * DAYS_IN_WEEK);
System.out.println(100 * TAX_RATE);`,
            notes: [
              { line: 1, text: 'final plus a capital-letters name makes a constant.' },
              { line: 3, text: 'weeks is an ordinary variable, so it is free to change later.' },
              { line: 5, text: 'If the tax rate changes, you fix it in this one place only.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'Trying to change a constant',
            body: 'Assigning a new value to a `final` variable is a compile error. If the value needs to change, it should not be a constant in the first place.',
            wrong: j`
final int MAX_LIVES = 3;
MAX_LIVES = 5;`,
            right: j`
final int MAX_LIVES = 3;
int lives = MAX_LIVES;
lives = lives - 1;
System.out.println(lives);`,
          },
        ],
        questions: ['u1l5-01', 'u1l5-02', 'u1l5-03', 'u1l5-04', 'u1l5-05', 'u1l5-06', 'u1l5-07'],
        challenge: 'u1l5-08',
      },
    ],
  },
}
