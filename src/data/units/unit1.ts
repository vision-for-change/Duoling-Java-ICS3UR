import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Meet Variables ----------------
  ...topic('variables', [
    {
      id: 'v-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'declare',
      prompt: 'Which line declares a variable named `lives` and stores `3` in it?',
      optionStyle: 'code',
      options: [
        { text: 'int lives = 3;' },
        { text: 'lives int = 3;', feedback: 'Close! In Java the type comes first, then the name.' },
        { text: 'int 3 = lives;', feedback: 'The name goes on the left of `=` and the value on the right.' },
        { text: 'int lives == 3;', feedback: '`==` compares two values. To store a value, use a single `=`.' },
      ],
      answer: 0,
      explanation: 'The pattern is **type name = value;**, so `int lives = 3;` creates an int box called `lives` holding 3.',
    },
    {
      id: 'v-02',
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
        { text: '10', feedback: 'Line 2 stored a new value, replacing the 10.' },
        { text: '35', feedback: '`=` replaces the value, it doesn\'t add. Adding would be `coins = coins + 25;`' },
        { text: 'coins', feedback: 'Without quotes, `coins` means the variable, so Java prints the value inside it.' },
      ],
      answer: 0,
      highlightLines: [2],
      explanation: '`=` overwrites whatever was in the box. After line 2, `coins` holds 25, so 25 is printed.',
    },
    {
      id: 'v-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'declare',
      prompt: '**Declaring** a variable (like `int x;`) and **initializing** it (giving it its first value) are the same thing.',
      answer: false,
      wrongFeedback: '`int x;` only creates the box. Putting the first value in (`x = 5;`) is initializing.',
      explanation: '`int x;` declares (creates the box). `x = 5;` initializes (first value). You can do both at once: `int x = 5;`.',
    },
    {
      id: 'v-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'declare',
      prompt: 'Complete the code so it declares a variable named `price` holding `4.99`.',
      code: j`
___ price = 4.99;
System.out.println(price);`,
      blanks: [['double']],
      bank: ['double', 'int', 'String', 'boolean'],
      expectedOutput: '4.99',
      explanation: '4.99 has a decimal point, so it needs a `double`. An `int` can only hold whole numbers.',
    },
    {
      id: 'v-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'assign',
      prompt: 'What does this program print?',
      code: j`
int a = 5;
int b = a;
a = 8;
System.out.println(b);`,
      optionStyle: 'output',
      options: [
        { text: '5' },
        { text: '8', feedback: '`b` got a copy of the value 5 on line 2. Changing `a` later doesn\'t change `b`.' },
        { text: '13', feedback: 'Nothing is added here: each `=` just stores a value.' },
        { text: 'a', feedback: 'Variables store values, not names of other variables.' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: 'Line 2 copies the value 5 into `b`. Variables hold values, not links to other variables, so `b` stays 5 even after `a` becomes 8.',
    },
    {
      id: 'v-06',
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
        runtime: 'Java catches this before the program ever runs, so it can\'t be a runtime error.',
        logic: 'The program never gets to run because Java refuses to compile it.',
        none: 'Look at line 2: what value does `score` have the first time it is read?',
      },
      highlightLines: [1, 2],
      explanation: '`score` is declared but never initialized, so `score + 10` would read an empty box. javac stops with: *variable score might not have been initialized*. Fix: `int score = 0;`',
    },
    {
      id: 'v-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'assign',
      prompt: 'Type exactly what this program prints.',
      code: j`
int x = 3;
int y = 4;
x = y;
y = x + 2;
System.out.println(x + " " + y);`,
      answer: '4 6',
      highlightLines: [3, 4],
      explanation: 'Line 3 copies 4 into `x`. Line 4 uses the NEW `x`: `y = 4 + 2 = 6`. So it prints `4 6`.',
    },
    {
      id: 'v-08',
      type: 'arrange',
      difficulty: 2,
      concept: 'assign',
      prompt: 'Arrange the lines to **swap** the values of `a` and `b`, so the program prints `2 1`.',
      lines: ['int a = 1;', 'int b = 2;', 'int temp = a;', 'a = b;', 'b = temp;', 'System.out.println(a + " " + b);'],
      alternatives: [[1, 0, 2, 3, 4, 5]],
      expectedOutput: '2 1',
      explanation: 'Save `a` in `temp` first, THEN overwrite `a` with `b`, and finally give `b` the saved value. Without `temp`, the original `a` would be lost.',
    },

    // ---------------- Lesson 4: Constants & Naming ----------------
    {
      id: 'c-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'naming',
      prompt: 'Which is a **valid** Java variable name?',
      optionStyle: 'code',
      options: [
        { text: 'highScore' },
        { text: '2ndPlace', feedback: 'Names can\'t start with a digit.' },
        { text: 'high score', feedback: 'Spaces aren\'t allowed in names. Use camelCase: `highScore`.' },
        { text: 'class', feedback: '`class` is a reserved keyword in Java.' },
      ],
      answer: 0,
      explanation: 'Names start with a letter (or `_`/`$`), may contain digits after that, and can\'t contain spaces or be keywords. `highScore` follows every rule.',
    },
    {
      id: 'c-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'naming',
      prompt: 'In Java, `score` and `Score` are the same variable.',
      answer: false,
      wrongFeedback: 'Java is case-sensitive: a single capital letter makes a different name.',
      explanation: 'Java is **case-sensitive**. `score`, `Score` and `SCORE` are three different names.',
    },
    {
      id: 'c-03',
      type: 'error-type',
      difficulty: 1,
      concept: 'constants',
      prompt: 'What is wrong with this code?',
      code: j`
final int MAX_LIVES = 3;
MAX_LIVES = 5;
System.out.println(MAX_LIVES);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java spots this while compiling, before anything runs.',
        logic: 'It never runs at all because javac refuses to compile it.',
        none: '`final` means the value can never change. What does line 2 try to do?',
      },
      highlightLines: [2],
      explanation: 'A `final` variable is a constant: once set, it can\'t be reassigned. javac says: *cannot assign a value to final variable MAX_LIVES*.',
    },
    {
      id: 'c-04',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'constants',
      prompt: 'Which name follows Java conventions for a **constant** holding the maximum speed?',
      optionStyle: 'code',
      options: [
        { text: 'MAX_SPEED' },
        { text: 'maxSpeed', feedback: 'camelCase is the convention for regular variables. Constants use UPPER_SNAKE_CASE.' },
        { text: 'Max-Speed', feedback: 'Hyphens aren\'t allowed: Java would read it as `Max` minus `Speed`.' },
        { text: 'maxspeed', feedback: 'Legal, but hard to read and not the constant convention.' },
      ],
      answer: 0,
      explanation: 'Constants are written in UPPER_SNAKE_CASE: all capitals with underscores between words, like `MAX_SPEED` or `TAX_RATE`.',
    },
    {
      id: 'c-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'constants',
      prompt: 'Make `PI_ISH` a constant that can never be changed.',
      code: j`
___ double PI_ISH = 3.14;
double r = 2;
System.out.println(PI_ISH * r * r);`,
      blanks: [['final']],
      explanation: 'The keyword `final` turns a variable into a constant. Any later attempt to change `PI_ISH` would be a compile error.',
    },
    {
      id: 'c-06',
      type: 'find-bug',
      difficulty: 2,
      concept: 'naming',
      prompt: 'This program won\'t compile. Tap the line with the bug.',
      code: j`
int totalCoins = 50;
int spent = 20;
int left = totalcoins - spent;
System.out.println(left);`,
      bugLines: [3],
      bugKind: 'syntax',
      fixedCode: j`
int totalCoins = 50;
int spent = 20;
int left = totalCoins - spent;
System.out.println(left);`,
      hint: 'Compare the spelling of every name letter by letter, including capitals.',
      explanation: 'Java is case-sensitive: `totalcoins` (lowercase c) is not the variable `totalCoins`, so javac reports *cannot find symbol*.',
    },
    {
      id: 'c-07',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'naming',
      prompt: 'Which line will **NOT** compile?',
      optionStyle: 'code',
      options: [
        { text: 'int my_score = 10;', feedback: 'Underscores are allowed in names, so this compiles.' },
        { text: 'int $cash = 5;', feedback: 'Surprise: `$` is allowed in names (though rarely used). This compiles.' },
        { text: 'int score2 = 7;', feedback: 'Digits are fine after the first character, so this compiles.' },
        { text: 'int double = 3;' },
      ],
      answer: 3,
      explanation: '`double` is a keyword (a type name), so it can\'t be used as a variable name. The other three names are legal.',
    },
    {
      id: 'c-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'constants',
      prompt: 'Type exactly what this program prints.',
      code: j`
final int BONUS = 5;
int score = 10;
score = score + BONUS;
score = score * 2;
System.out.println(score);`,
      answer: '30',
      explanation: '`score` becomes 10 + 5 = 15, then 15 × 2 = 30. `BONUS` itself never changes.',
    },
  ]),

  // ---------------- Lesson 2: Primitive Types ----------------
  ...topic('types', [
    {
      id: 't-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'primitives',
      prompt: 'Which type should store the **number of students** in a class?',
      optionStyle: 'code',
      options: [
        { text: 'int' },
        { text: 'double', feedback: 'You can\'t have 27.5 students, so whole numbers fit best in an `int`.' },
        { text: 'boolean', feedback: '`boolean` only holds `true` or `false`.' },
        { text: 'char', feedback: '`char` holds a single character like `\'A\'`.' },
      ],
      answer: 0,
      explanation: 'Counting things gives whole numbers, and `int` is Java\'s type for whole numbers.',
    },
    {
      id: 't-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'char',
      prompt: 'Which value is a valid `char`?',
      optionStyle: 'code',
      options: [
        { text: "'B'" },
        { text: '"B"', feedback: 'Double quotes make a `String`, not a `char`.' },
        { text: "'Hi'", feedback: 'A `char` holds exactly ONE character.' },
        { text: 'B', feedback: 'Without quotes, Java thinks `B` is the name of a variable.' },
      ],
      answer: 0,
      explanation: 'A `char` is one character inside **single** quotes, like `\'B\'`.',
    },
    {
      id: 't-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'boolean',
      prompt: 'A `boolean` variable can hold `true`, `false`, or the numbers `1` and `0`.',
      answer: false,
      wrongFeedback: 'Some languages treat 1 and 0 as true/false, but Java doesn\'t.',
      explanation: 'Java\'s `boolean` is strictly `true` or `false`. Writing `boolean b = 1;` is a compile error.',
    },
    {
      id: 't-04',
      type: 'error-type',
      difficulty: 1,
      concept: 'type-mismatch',
      prompt: 'What is wrong with this code?',
      code: j`
int height = 5.9;
System.out.println(height);`,
      answer: 'syntax',
      feedback: {
        runtime: 'This is caught while compiling, before the program runs.',
        logic: 'It doesn\'t even compile, so it never produces a wrong answer.',
        none: 'Can an `int` hold the `.9` part of 5.9?',
      },
      highlightLines: [1],
      explanation: '5.9 is a `double`. Squeezing it into an `int` would lose the .9, so javac refuses: *possible lossy conversion from double to int*. Use `double height = 5.9;`',
    },
    {
      id: 't-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'widening',
      prompt: 'What does this program print?',
      code: j`
double price = 5;
System.out.println(price);`,
      optionStyle: 'output',
      options: [
        { text: '5.0' },
        { text: '5', feedback: 'The value is stored as a `double`, and doubles always print with a decimal part.' },
        { text: '5.00', feedback: '`println` doesn\'t add extra zeros: a double prints as 5.0.' },
        { text: 'Compile error', feedback: 'Putting an `int` into a `double` is safe (nothing is lost), so Java allows it.' },
      ],
      answer: 0,
      explanation: 'The int 5 is safely widened to the double 5.0, and doubles always print with at least one decimal digit.',
    },
    {
      id: 't-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'primitives',
      prompt: 'Pick the right type for each variable.',
      code: j`
___ isRaining = false;
___ temperature = 18.5;
___ initial = 'J';`,
      blanks: [['boolean'], ['double'], ['char']],
      bank: ['boolean', 'double', 'char', 'int', 'String'],
      explanation: '`false` is a boolean value, 18.5 has a decimal so it needs a `double`, and `\'J\'` (one character in single quotes) is a `char`.',
    },
    {
      id: 't-07',
      type: 'multiple-choice',
      difficulty: 3,
      concept: 'type-mismatch',
      prompt: 'Which of these lines will **NOT** compile?',
      optionStyle: 'code',
      options: [
        { text: 'double d = 10;', feedback: 'An int fits inside a double safely, so this compiles (d becomes 10.0).' },
        { text: "int n = 'A';", feedback: 'Surprise! A char is really a number (its Unicode code), so this compiles and n becomes 65.' },
        { text: 'char c = "A";' },
        { text: 'boolean b = 5 > 3;', feedback: '`5 > 3` evaluates to `true`, which is a boolean, so this compiles.' },
      ],
      answer: 2,
      explanation: '`"A"` uses double quotes, so it\'s a `String`, and a String can\'t be converted to a `char`. The other three are safe conversions.',
    },
    {
      id: 't-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'char',
      prompt: 'Type exactly what this program prints.',
      code: j`
char letter = 'A';
int code = letter;
System.out.println(code);`,
      answer: '65',
      explanation: 'Every `char` is stored as a number: its Unicode value. `\'A\'` is 65, so assigning it to an `int` gives 65.',
    },

    // ---------------- Lesson 3: Strings ----------------
    {
      id: 's-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'strings',
      prompt: 'Which line correctly stores the word **Java** in a variable?',
      optionStyle: 'code',
      options: [
        { text: 'String lang = "Java";' },
        { text: 'string lang = "Java";', feedback: '`String` starts with a capital S, and Java is case-sensitive.' },
        { text: "String lang = 'Java';", feedback: 'Single quotes are for one `char`. Text needs double quotes.' },
        { text: 'String lang = Java;', feedback: 'Without quotes, Java looks for a variable named `Java`.' },
      ],
      answer: 0,
      explanation: 'Text is a `String` (capital S) and String values go inside **double** quotes.',
    },
    {
      id: 's-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'concat',
      prompt: 'What does this program print?',
      code: j`
String pet = "cat";
System.out.println("My " + pet + " naps");`,
      optionStyle: 'output',
      options: [
        { text: 'My cat naps' },
        { text: 'My pet naps', feedback: '`pet` has no quotes, so it\'s the variable, and its value "cat" is used.' },
        { text: 'Mycatnaps', feedback: 'The spaces inside the quotes are kept: "My " and " naps".' },
        { text: 'My + pet + naps', feedback: 'The `+` signs are outside the quotes, so they join the pieces.' },
      ],
      answer: 0,
      explanation: '`+` glues (concatenates) Strings: "My " + "cat" + " naps" → "My cat naps". The spaces come from inside the quotes.',
    },
    {
      id: 's-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'concat-order',
      prompt: 'What does this program print?',
      code: j`System.out.println("Score: " + 4 + 5);`,
      optionStyle: 'output',
      options: [
        { text: 'Score: 45' },
        { text: 'Score: 9', feedback: 'Java reads left to right: "Score: " + 4 becomes "Score: 4" (text!), then + 5 glues on "5".' },
        { text: 'Score: 4 5', feedback: 'No space is added between the pieces.' },
        { text: 'Compile error', feedback: 'Mixing Strings and numbers with + is allowed: the numbers become text.' },
      ],
      answer: 0,
      explanation: 'Evaluation goes left to right. Once a String is involved, `+` means *join*. To add first, use parentheses: `"Score: " + (4 + 5)`.',
    },
    {
      id: 's-04',
      type: 'type-output',
      difficulty: 2,
      concept: 'strings',
      prompt: 'Type exactly what this program prints.',
      code: j`
String word = "Hello";
System.out.println(word.length());`,
      answer: '5',
      explanation: '`length()` counts the characters in a String. "Hello" has 5.',
    },
    {
      id: 's-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'concat-order',
      prompt: 'What does this program print?',
      code: j`System.out.println(4 + 5 + " points");`,
      optionStyle: 'output',
      options: [
        { text: '9 points' },
        { text: '45 points', feedback: 'Left to right: 4 + 5 are both numbers, so they\'re ADDED before the String appears.' },
        { text: '4 + 5 points', feedback: 'The `+` is outside the quotes, so it\'s an operator, not text.' },
        { text: '45points' },
      ],
      answer: 0,
      explanation: 'Java evaluates left to right. `4 + 5` is 9 (both ints), then `9 + " points"` joins them: "9 points".',
    },
    {
      id: 's-06',
      type: 'true-false',
      difficulty: 1,
      concept: 'strings',
      prompt: '`String` is one of Java\'s primitive types, just like `int` and `char`.',
      answer: false,
      wrongFeedback: 'Notice the capital S: that\'s a hint String is a class, not a primitive.',
      explanation: '`String` is a class. The primitive types are all lowercase: `int`, `double`, `boolean`, `char` (plus `long`, `float`, `short`, `byte`).',
    },
    {
      id: 's-07',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'concat',
      prompt: 'Fill in the blanks so the program prints `Hi, Sam!`',
      code: j`
String name = "Sam";
System.out.println("Hi, " ___ name ___ "!");`,
      blanks: [['+'], ['+']],
      expectedOutput: 'Hi, Sam!',
      explanation: 'The `+` operator glues Strings together: "Hi, " + "Sam" + "!" → "Hi, Sam!".',
    },
    {
      id: 's-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'concat-order',
      prompt: 'Type exactly what this program prints (two lines).',
      code: j`
String a = "3";
int b = 3;
System.out.println(a + b + b);
System.out.println(b + b + a);`,
      answer: '333\n63',
      highlightLines: [3, 4],
      explanation: 'Line 3: "3" + 3 → "33", then + 3 → "333". Line 4: 3 + 3 = 6 first (both numbers), then 6 + "3" → "63".',
    },
  ]),

  // ---------------- Unit 1 checkpoint ----------------
  ...topic('variables', [
    {
      id: 'cp1-01',
      type: 'type-output',
      topic: 'types',
      difficulty: 3,
      concept: 'concat-order',
      prompt: 'Type exactly what this program prints.',
      code: j`
String item = "Latte";
double price = 3.5;
int qty = 2;
System.out.println(qty + " x " + item + " = " + price * qty);`,
      answer: '2 x Latte = 7.0',
      explanation: '`*` happens before `+`, so `price * qty` = 7.0 is computed first. Then everything is joined left to right into one String.',
    },
    {
      id: 'cp1-02',
      type: 'error-type',
      topic: 'types',
      difficulty: 2,
      concept: 'type-mismatch',
      prompt: 'What is wrong with this code?',
      code: j`
String name = "Byte";
int length = name;`,
      answer: 'syntax',
      feedback: { runtime: 'javac catches this before running.', logic: 'It never compiles, so it never runs.', none: 'Can a String be stored in an int box?' },
      highlightLines: [2],
      explanation: 'A `String` can\'t be stored in an `int`. javac reports *incompatible types: String cannot be converted to int*. (To get the length, use `name.length()`.)',
    },
    {
      id: 'cp1-03',
      type: 'find-bug',
      difficulty: 2,
      concept: 'syntax',
      prompt: 'This program won\'t compile. Tap the line with the bug.',
      code: j`
double total = 0;
total = 19.99
System.out.println(total);`,
      bugLines: [2],
      bugKind: 'syntax',
      fixedCode: j`
double total = 0;
total = 19.99;
System.out.println(total);`,
      explanation: 'Every statement must end with a semicolon. Line 2 is missing its `;`, so javac reports *\';\' expected*.',
    },
    {
      id: 'cp1-04',
      type: 'arrange',
      difficulty: 2,
      concept: 'declare',
      prompt: 'Arrange the lines to print `Byte is 3 years old`. One line is a decoy!',
      lines: ['String name = "Byte";', 'int age = 3;', 'System.out.println(name + " is " + age + " years old");'],
      distractors: ['String age = 3;'],
      alternatives: [[1, 0, 2]],
      expectedOutput: 'Byte is 3 years old',
      explanation: 'Both variables must be declared before the line that prints them. The decoy `String age = 3;` doesn\'t compile because 3 isn\'t text.',
    },
    {
      id: 'cp1-05',
      type: 'predict-output',
      difficulty: 3,
      concept: 'assign',
      prompt: 'What does this program print?',
      code: j`
int x = 10;
int y = x;
x = x + 5;
y = y - 1;
System.out.println(x + y);`,
      optionStyle: 'output',
      options: [
        { text: '24' },
        { text: '159', feedback: '`x` and `y` are both ints, so `+` adds them. No text is involved.' },
        { text: '29', feedback: '`y` copied the OLD value of x (10), not 15.' },
        { text: '14' },
      ],
      answer: 0,
      explanation: '`y` copies 10. Then `x` becomes 15 and `y` becomes 9. `15 + 9 = 24`.',
    },
    {
      id: 'cp1-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'constants',
      prompt: 'Declare a constant `SPEED` equal to 60 and an `int` variable `hours` equal to 3. Then print the distance: `SPEED * hours`.',
      starter: j`
// 1. Declare the constant SPEED (60)

// 2. Declare the variable hours (3)

// 3. Print SPEED * hours
`,
      solution: j`
final int SPEED = 60;
int hours = 3;
System.out.println(SPEED * hours);`,
      tests: [{ label: 'prints the distance', output: '180' }],
      mustInclude: [
        { pattern: 'final\\s+int\\s+SPEED', message: 'Declare SPEED with `final int` so it\'s a constant.' },
        { pattern: '\\bhours\\b', message: 'Use a variable named `hours`.' },
      ],
      explanation: '`final int SPEED = 60;` makes a constant, `int hours = 3;` a normal variable, and `SPEED * hours` computes 180.',
    },
  ]),
]

export const unit1: UnitContent = {
  questions,
  unit: {
    id: 'u1',
    number: 1,
    title: 'Variables & Basic Java',
    tagline: 'Store values, pick the right type and name things well.',
    color: 'brew',
    icon: 'package',
    topics: ['variables', 'types'],
    checkpoint: ['cp1-01', 'cp1-02', 'cp1-03', 'cp1-04', 'cp1-05', 'cp1-06'],
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'u1',
        title: 'Meet Variables',
        summary: 'Declare, initialize and change a variable.',
        topic: 'variables',
        teach: [
          {
            kind: 'concept',
            title: 'What is a variable?',
            what: 'A **variable** is a named box that stores a value your program can use later.',
            why: 'Programs need to remember things: a score, a name, a price. Variables give each value a name so you can read it and change it.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Declare, initialize, assign',
            how: 'Write the **type**, the **name**, `=` and the **value**, then end with a semicolon. Later, `=` can store a new value in the same box.',
            code: j`
int age = 15;
System.out.println(age);
age = 16;
System.out.println(age);`,
            notes: [
              { line: 1, text: 'Declare an int called age and initialize it to 15.' },
              { line: 2, text: 'Print the value inside the box.' },
              { line: 3, text: 'Assign a new value: the old 15 is replaced.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'Reading an empty box',
            body: 'Declaring creates the box; initializing puts the first value in. Java refuses to read a variable that was never given a value.',
            wrong: j`
int score;
System.out.println(score);`,
            right: j`
int score = 0;
System.out.println(score);`,
          },
        ],
        questions: ['v-01', 'v-02', 'v-03', 'v-04', 'v-05', 'v-06', 'v-08'],
        challenge: 'v-07',
      },
      {
        id: 'u1-l2',
        unitId: 'u1',
        title: 'Primitive Types',
        summary: 'int, double, boolean and char.',
        topic: 'types',
        teach: [
          {
            kind: 'concept',
            title: 'Every variable has a type',
            what: 'A **type** tells Java what kind of value a variable holds: `int` for whole numbers, `double` for decimals, `boolean` for true/false and `char` for one character.',
            why: 'Knowing the type lets Java store values efficiently and catch mistakes early, like putting a decimal where a whole number should go.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'The four you\'ll use most',
            how: 'Each type accepts its own kind of value. Notice the single quotes around a `char`.',
            code: j`
int students = 28;
double average = 87.5;
boolean isOpen = true;
char grade = 'A';
System.out.println(students + " " + average + " " + isOpen + " " + grade);`,
            notes: [
              { line: 1, text: 'int: whole numbers (no decimal point).' },
              { line: 2, text: 'double: numbers with decimals.' },
              { line: 3, text: 'boolean: only true or false.' },
              { line: 4, text: "char: exactly one character in single quotes." },
            ],
          },
          {
            kind: 'mistake',
            title: 'A decimal in an int box',
            body: 'An `int` can\'t hold 5.9, and Java won\'t silently chop off the .9 for you. It stops with a compile error instead.',
            wrong: j`
int height = 5.9;
System.out.println(height);`,
            right: j`
double height = 5.9;
System.out.println(height);`,
          },
        ],
        questions: ['t-01', 't-02', 't-03', 't-04', 't-05', 't-06', 't-08'],
        challenge: 't-07',
      },
      {
        id: 'u1-l3',
        unitId: 'u1',
        title: 'Working with Strings',
        summary: 'Store text and join it with +.',
        topic: 'types',
        teach: [
          {
            kind: 'concept',
            title: 'Text lives in Strings',
            what: 'A `String` stores text: a sequence of characters inside **double quotes**, like `"Hello"`. `String` has a capital S because it\'s a class, not a primitive.',
            why: 'Names, messages and passwords are all text. Strings let your program store words and build new messages from them.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Joining Strings with +',
            how: 'Between Strings, `+` means *join* (concatenate). `.length()` tells you how many characters a String has, and spaces count!',
            code: j`
String first = "Ada";
String last = "Lovelace";
String full = first + " " + last;
System.out.println("Hello, " + full + "!");
System.out.println(full.length());`,
            notes: [
              { line: 3, text: 'The " " in the middle adds the space between the names.' },
              { line: 5, text: '"Ada Lovelace" has 12 characters, including the space.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'Numbers meet Strings',
            body: 'Java reads `+` from left to right. Once a String appears, every following `+` joins text instead of adding numbers.',
            wrong: j`System.out.println("Total: " + 2 + 3);`,
            right: j`System.out.println("Total: " + (2 + 3));`,
          },
        ],
        questions: ['s-01', 's-02', 's-06', 's-03', 's-04', 's-05', 's-07'],
        challenge: 's-08',
      },
      {
        id: 'u1-l4',
        unitId: 'u1',
        title: 'Constants & Naming',
        summary: 'final values and naming rules.',
        topic: 'variables',
        teach: [
          {
            kind: 'concept',
            title: 'Constants never change',
            what: 'Put `final` in front of a variable to make it a **constant**: once it has a value, it can never be changed. Constants are named in UPPER_SNAKE_CASE.',
            why: 'Some values should stay fixed while the program runs: days in a week, a tax rate, the max number of lives. `final` protects them from accidental changes.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Using constants',
            how: 'Constants are used just like variables, except you can\'t assign them a new value.',
            code: j`
final int DAYS_IN_WEEK = 7;
final double TAX_RATE = 0.08;
int weeks = 3;
System.out.println(weeks * DAYS_IN_WEEK);
System.out.println(100 * TAX_RATE);`,
            notes: [
              { line: 1, text: 'final + UPPER_SNAKE_CASE name = a constant.' },
              { line: 3, text: 'weeks is a normal variable, so it can change later.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Rules for names',
            body: 'Java is picky about names:',
            bullets: [
              'Start with a letter (or `_` / `$`), never a digit.',
              'Letters, digits and `_` only. No spaces or hyphens.',
              'Keywords like `int`, `class` or `double` are off limits.',
              'Case matters: `score` and `Score` are different.',
              'Convention: `camelCase` for variables, `UPPER_SNAKE_CASE` for constants.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Changing a constant',
            body: 'Assigning a new value to a `final` variable is a compile error. If a value needs to change, use a normal variable for it.',
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
        questions: ['c-01', 'c-02', 'c-03', 'c-04', 'c-05', 'c-06', 'c-07'],
        challenge: 'c-08',
      },
    ],
  },
}
