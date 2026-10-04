import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Meet the Scanner ----------------
  ...topic('input', [
    {
      id: 'u2l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'import',
      prompt: 'Which line goes at the top of your file so you can use `Scanner`?',
      optionStyle: 'code',
      options: [
        { text: 'import java.util.Scanner;' },
        { text: 'import Scanner;', feedback: 'Java needs to know which package Scanner lives in, so the full name is required. It is in `java.util`.' },
        { text: 'include java.util.Scanner;', feedback: '`include` belongs to other languages. In Java the word is `import`.' },
        { text: 'using java.util.Scanner;', feedback: '`using` is from C#. Java says `import`.' },
      ],
      answer: 0,
      explanation: 'Scanner lives in a package called `java.util`, and we have to import it before Java will recognize the name.',
    },
    {
      id: 'u2l1-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'create',
      prompt: 'Which line creates a Scanner that reads from the keyboard?',
      optionStyle: 'code',
      options: [
        { text: 'Scanner console = new Scanner(System.in);' },
        { text: 'Scanner console = new Scanner(System.out);', feedback: '`System.out` is for printing to the screen. Input comes in through `System.in`.' },
        { text: 'Scanner console = Scanner(System.in);', feedback: 'To build a new Scanner you need the word `new`.' },
        { text: 'Scanner console = new Scanner();', feedback: 'The Scanner has to be told where to read from, and that is `System.in`.' },
      ],
      answer: 0,
      explanation: '`System.in` is the keyboard. When we hand it to a new Scanner, the Scanner is ready to read whatever the user types.',
    },
    {
      id: 'u2l1-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'create',
      prompt: 'The Scanner variable has to be called `console`, or the program will not compile.',
      answer: false,
      wrongFeedback: 'I like the name `console`, but it is only a variable name. Anything legal works, like `in`, `keyboard` or `sc`.',
      explanation: 'The name is entirely up to you, so pick something that makes sense when you read it. The important parts are `new Scanner(System.in)` and the import.',
    },
    {
      id: 'u2l1-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'next',
      prompt: 'Fill in the blank so the program reads one word from the user.',
      code: j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        String name = console.___();
        System.out.println("Hello, " + name);
    }
}`,
      stdin: 'Maya\n',
      blanks: [['next']],
      bank: ['next', 'nextInt', 'nextDouble', 'read'],
      expectedOutput: 'Hello, Maya',
      explanation: '`next()` reads one word and hands it back as a String. `nextInt` would be looking for a number, and there is no `read` method.',
    },
    {
      id: 'u2l1-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'next',
      prompt: 'The user types `Ada Lovelace`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
String first = console.next();
String last = console.next();
System.out.println(last + ", " + first);`,
      stdin: 'Ada Lovelace\n',
      optionStyle: 'output',
      options: [
        { text: 'Lovelace, Ada' },
        { text: 'Ada, Lovelace', feedback: 'Look at the order in the last line. `last` goes first.' },
        { text: 'Ada Lovelace', feedback: 'That is what was typed, but the program rearranges the two words and adds a comma.' },
        { text: 'last, first', feedback: 'There are no quotes around `last` and `first`, so Java prints the words stored in them.' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: 'The first `next()` grabs Ada, and the second one grabs Lovelace. Each call picks up where the last one stopped, and then the print statement flips them around.',
    },
    {
      id: 'u2l1-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'import',
      prompt: 'What happens when we try to run this program?',
      code: j`
public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        String word = console.next();
        System.out.println(word);
    }
}`,
      stdin: 'hello\n',
      answer: 'syntax',
      feedback: {
        runtime: 'The program never starts running. Java is confused before that point.',
        logic: 'It never runs, so there is no wrong answer yet.',
        none: 'Look at the very top of the file. Is anything missing?',
      },
      highlightLines: [3],
      explanation: 'There is no import, so Java has no idea what a `Scanner` is. It reports *cannot find symbol* on line 3. Add `import java.util.Scanner;` above the class.',
    },
    {
      id: 'u2l1-07',
      type: 'find-bug',
      difficulty: 2,
      concept: 'next',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
Scanner console = new Scanner(System.in);
System.out.print("Your name: ");
String name = console.nextString();
System.out.println("Hi " + name);`,
      stdin: 'Sam\n',
      bugLines: [3],
      fixedCode: j`
Scanner console = new Scanner(System.in);
System.out.print("Your name: ");
String name = console.next();
System.out.println("Hi " + name);`,
      bugKind: 'syntax',
      explanation: 'There is no `nextString` in Scanner. To read a word you use `next()`. Method names have to match exactly, so a made-up one means *cannot find symbol*.',
    },
    {
      id: 'u2l1-08',
      type: 'type-output',
      difficulty: 2,
      concept: 'next',
      prompt: 'The user types `one two three`. Type exactly what this program prints.',
      code: j`
Scanner console = new Scanner(System.in);
String a = console.next();
String b = console.next();
System.out.println(b + a);`,
      stdin: 'one two three\n',
      answer: 'twoone',
      highlightLines: [2, 3],
      explanation: '`a` gets `one`, `b` gets `two`, and `three` is never read. We print `b` first and then `a` with no space between, so it comes out as `twoone`.',
    },
    {
      id: 'u2l1-09',
      type: 'write-code',
      difficulty: 2,
      concept: 'create',
      prompt: 'Create a Scanner, read the user\'s first name with `next()`, and print `Welcome, ` followed by the name and an exclamation mark.',
      starter: j`
// 1. create a Scanner called console

// 2. read the name with next()

// 3. print: Welcome, <name>!
`,
      solution: j`
Scanner console = new Scanner(System.in);
String name = console.next();
System.out.println("Welcome, " + name + "!");`,
      tests: [
        { label: 'Priya', stdin: 'Priya\n', output: 'Welcome, Priya!' },
        { label: 'Omar', stdin: 'Omar\n', output: 'Welcome, Omar!' },
      ],
      mustInclude: [
        { pattern: 'new\\s+Scanner\\s*\\(\\s*System\\.in\\s*\\)', message: 'Create the Scanner with `new Scanner(System.in)`.' },
        { pattern: '\\.next\\(\\)', message: 'Read the name with `next()`.' },
      ],
      explanation: 'Make the Scanner, read one word into a String, and join it into the message. The program works for any name because it prints what was typed, not a name you wrote yourself.',
    },
  ]),

  // ---------------- Lesson 2: nextInt and nextDouble ----------------
  ...topic('input', [
    {
      id: 'u2l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'next-int',
      prompt: 'The user is going to type `42`. Which line reads it into a variable?',
      optionStyle: 'code',
      options: [
        { text: 'int n = console.nextInt();' },
        { text: 'int n = console.next();', feedback: '`next()` hands back a String, and a String will not fit inside an `int` box.' },
        { text: 'String n = console.nextInt();', feedback: '`nextInt()` gives back a number, and a number will not fit inside a String box.' },
        { text: 'int n = console.readInt();', feedback: 'There is no `readInt`. The name is `nextInt`.' },
      ],
      answer: 0,
      explanation: 'Match the method to the type. `nextInt()` reads a whole number and gives back an `int`.',
    },
    {
      id: 'u2l2-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'next-double',
      prompt: 'The user is going to type `3.75`. Which method should read it?',
      optionStyle: 'code',
      options: [
        { text: 'nextDouble()' },
        { text: 'nextInt()', feedback: 'A whole-number reader cannot handle a decimal point. It would stop the program with an error.' },
        { text: 'next()', feedback: '`next()` gives back a String, and you cannot do math with text.' },
        { text: 'nextDecimal()', feedback: 'Nice guess, but Java calls decimals doubles, so the method is `nextDouble`.' },
      ],
      answer: 0,
      explanation: 'Decimal numbers are `double`s in Java, so the method that reads them is `nextDouble()`.',
    },
    {
      id: 'u2l2-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'next-int',
      prompt: 'The user types `7`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
int n = console.nextInt();
System.out.println(n * n);`,
      stdin: '7\n',
      optionStyle: 'output',
      options: [
        { text: '49' },
        { text: '7', feedback: 'The program prints `n * n`, not `n`.' },
        { text: '77', feedback: '`n` is an `int`, so the star multiplies. It does not repeat the digit.' },
        { text: '14', feedback: 'That is 7 plus 7. The star means multiply.' },
      ],
      answer: 0,
      explanation: '`nextInt()` reads the 7 as a real number, so Java can multiply it: 7 times 7 is 49.',
    },
    {
      id: 'u2l2-04',
      type: 'true-false',
      difficulty: 1,
      concept: 'type-match',
      prompt: '`nextInt()` can read the input `3.5`.',
      answer: false,
      wrongFeedback: 'An `int` cannot have a decimal part. When `nextInt()` sees 3.5 the program stops with an InputMismatchException.',
      explanation: 'The method has to match what the user types. Whole numbers go with `nextInt()`, and decimals need `nextDouble()`.',
    },
    {
      id: 'u2l2-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'next-double',
      prompt: 'Fill in the blank so the program doubles a price.',
      code: j`
Scanner console = new Scanner(System.in);
double price = console.___();
System.out.println(price * 2);`,
      stdin: '4.50\n',
      blanks: [['nextDouble']],
      bank: ['nextDouble', 'nextInt', 'next', 'nextLine'],
      expectedOutput: '9.0',
      explanation: 'A price has a decimal point, so `nextDouble()` is the right reader. Then 4.5 times 2 gives 9.0.',
    },
    {
      id: 'u2l2-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'next-int',
      prompt: 'The user types `12 30` on one line. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
System.out.println(a + b);`,
      stdin: '12 30\n',
      optionStyle: 'output',
      options: [
        { text: '42' },
        { text: '1230', feedback: 'Both values are `int`s, so the plus adds them. It only joins things when text is involved.' },
        { text: '12', feedback: 'There are two `nextInt()` calls, and both values get used.' },
        { text: '12 30', feedback: 'The program prints the sum, not the input.' },
      ],
      answer: 0,
      explanation: 'The two numbers can be on the same line, because the Scanner splits the input at spaces. 12 plus 30 is 42.',
    },
    {
      id: 'u2l2-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'type-match',
      prompt: 'The user types the word `seven`. What happens?',
      code: j`
Scanner console = new Scanner(System.in);
System.out.print("How many? ");
int count = console.nextInt();
System.out.println("You asked for " + count);`,
      stdin: 'seven\n',
      answer: 'runtime',
      feedback: {
        syntax: 'The code is perfectly valid Java. Nothing is wrong until someone types the wrong thing.',
        logic: 'It does not finish and print a wrong answer. It crashes before that.',
        none: 'Think about what `nextInt()` does when it finds a word instead of a number.',
      },
      highlightLines: [3],
      explanation: 'The code compiles fine, but `nextInt()` cannot turn the word `seven` into a number. The program crashes with an InputMismatchException while it is running.',
    },
    {
      id: 'u2l2-08',
      type: 'predict-output',
      difficulty: 3,
      concept: 'mixing',
      prompt: 'The user types `5` and then `2.5`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
int boxes = console.nextInt();
double weight = console.nextDouble();
System.out.println(boxes * weight);`,
      stdin: '5\n2.5\n',
      optionStyle: 'output',
      options: [
        { text: '12.5' },
        { text: '12', feedback: 'One of the values is a `double`, so the answer keeps its decimal part.' },
        { text: '7.5', feedback: 'That is 5 plus 2.5. The star multiplies.' },
        { text: '52.5', feedback: 'The star does math. It does not glue the digits together.' },
      ],
      answer: 0,
      explanation: '`nextInt()` reads the 5 and `nextDouble()` reads the 2.5. An int times a double gives a double, so 5 times 2.5 is 12.5.',
    },
    {
      id: 'u2l2-09',
      type: 'write-code',
      difficulty: 2,
      concept: 'next-int',
      prompt: 'Read two whole numbers from the user and print their sum.',
      starter: j`
// 1. create a Scanner

// 2. read two ints

// 3. print their sum
`,
      solution: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
System.out.println(a + b);`,
      tests: [
        { label: 'positive numbers', stdin: '3 4\n', output: '7' },
        { label: 'one is negative', stdin: '10\n-4\n', output: '6' },
      ],
      mustInclude: [{ pattern: 'nextInt\\s*\\(', message: 'Use `nextInt()` to read the whole numbers.' }],
      explanation: 'Two `nextInt()` calls read two numbers, and it does not matter whether the user types them on one line or two.',
    },
  ]),

  // ---------------- Lesson 3: Putting input to work ----------------
  ...topic('input', [
    {
      id: 'u2l3-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'mixing',
      prompt: 'The user types `Sam 16`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
String name = console.next();
int age = console.nextInt();
System.out.println(name + " is " + age);`,
      stdin: 'Sam 16\n',
      optionStyle: 'output',
      options: [
        { text: 'Sam is 16' },
        { text: '16 is Sam', feedback: 'The Scanner reads in the order the user typed, and the first word is Sam.' },
        { text: 'name is age', feedback: 'There are no quotes around `name` and `age`, so Java prints what they hold.' },
        { text: 'Sam is age', feedback: 'Look closely at the last piece. `age` has no quotes, so Java prints the number inside it.' },
      ],
      answer: 0,
      explanation: 'The first read gets the word Sam and the second gets the number 16. Then we join them with the text in the middle.',
    },
    {
      id: 'u2l3-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'order',
      prompt: 'Your program asks for a name and then an age. The user types `Ria 15`. Which pair of calls matches?',
      optionStyle: 'code',
      options: [
        { text: 'console.next(); then console.nextInt();' },
        { text: 'console.nextInt(); then console.next();', feedback: 'The first thing the user typed is Ria, and that is not a number, so `nextInt()` would crash.' },
        { text: 'console.nextInt(); then console.nextInt();', feedback: 'Ria is not a number, so the first `nextInt()` would crash.' },
        { text: 'console.nextDouble(); then console.next();', feedback: 'Ria is not a decimal either. The order has to follow what was typed.' },
      ],
      answer: 0,
      explanation: 'The Scanner reads values from left to right, in the order they were typed. Ria is text, so it comes first, and 15 is a whole number, so it comes second.',
    },
    {
      id: 'u2l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'prompt',
      prompt: 'The line `System.out.print("Enter a number: ");` is what makes the program stop and wait for the user to type.',
      answer: false,
      wrongFeedback: 'That line only shows some text. The program waits when it reaches a Scanner call, like `nextInt()`.',
      explanation: 'A prompt is just a polite message so the user knows what to type. The pause happens at the `console.next...()` call, and it ends when the user hits Enter.',
    },
    {
      id: 'u2l3-04',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'mixing',
      prompt: 'The user types `3` and then `12.5`. Fill in the blanks so the program works out the pay.',
      code: j`
Scanner console = new Scanner(System.in);
int hours = console.___();
double rate = console.___();
System.out.println(hours * rate);`,
      stdin: '3\n12.5\n',
      blanks: [['nextInt'], ['nextDouble']],
      bank: ['nextInt', 'nextDouble', 'next', 'nextLine'],
      expectedOutput: '37.5',
      explanation: 'Hours are whole, so `nextInt()`. The rate has a decimal point, so `nextDouble()`. Then 3 times 12.5 gives 37.5.',
    },
    {
      id: 'u2l3-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'calculate',
      prompt: 'The user types `40` and then `15`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
double cost = console.nextDouble();
int percent = console.nextInt();
double tip = cost * percent / 100;
System.out.println(cost + tip);`,
      stdin: '40\n15\n',
      optionStyle: 'output',
      options: [
        { text: '46.0' },
        { text: '6.0', feedback: 'That is only the tip. The last line adds the tip to the cost.' },
        { text: '40.0', feedback: 'The tip is added on top before printing.' },
        { text: '55.0', feedback: 'That would be 40 plus 15. We work out 15 percent of 40 first.' },
      ],
      answer: 0,
      explanation: '15 percent of 40 is 6.0, so the tip is 6.0. Then 40.0 plus 6.0 gives 46.0.',
    },
    {
      id: 'u2l3-06',
      type: 'type-output',
      difficulty: 2,
      concept: 'calculate',
      prompt: 'The user types `6 7`. Type exactly what this program prints.',
      code: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
System.out.println(a + " x " + b + " = " + (a * b));`,
      stdin: '6 7\n',
      answer: '6 x 7 = 42',
      explanation: 'The pieces of text are joined with the numbers, and the multiplication sits in brackets so Java does the math first. That gives `6 x 7 = 42`.',
    },
    {
      id: 'u2l3-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'order',
      prompt: 'The user types `Sam 16`. What happens when we run this code?',
      code: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
String name = console.next();
System.out.println(name + " is " + age);`,
      stdin: 'Sam 16\n',
      answer: 'runtime',
      feedback: {
        syntax: 'The code compiles without a problem. The trouble only appears when the program meets the input.',
        logic: 'It does not finish and print something wrong. It crashes on the way.',
        none: 'Compare the order of the reads with the order the user typed things in.',
      },
      highlightLines: [2],
      explanation: 'The first thing typed is Sam, but line 2 is asking for a number. `nextInt()` cannot turn Sam into an int, so the program crashes with an InputMismatchException.',
    },
    {
      id: 'u2l3-08',
      type: 'find-bug',
      difficulty: 3,
      concept: 'nextline',
      prompt: 'The user types `16`, presses Enter, and then types `Sam`. The program should print `Sam is 16`, but it prints ` is 16`. Tap the line where the name is read.',
      code: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
String name = console.nextLine();
System.out.println(name + " is " + age);`,
      stdin: '16\nSam\n',
      bugLines: [3],
      fixedCode: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
console.nextLine();
String name = console.nextLine();
System.out.println(name + " is " + age);`,
      bugKind: 'logic',
      explanation: '`nextInt()` reads the 16 but leaves the Enter key sitting in the input. Then `nextLine()` happily reads the rest of that first line, which is empty. Use an extra `console.nextLine();` to throw the leftover away, or read words with `next()` instead.',
    },
    {
      id: 'u2l3-09',
      type: 'write-code',
      difficulty: 3,
      concept: 'calculate',
      prompt: 'Read a price (a `double`) and then a quantity (an `int`). Print the total cost, which is price times quantity.',
      starter: j`
// 1. create a Scanner

// 2. read the price, then the quantity

// 3. print price * quantity
`,
      solution: j`
Scanner console = new Scanner(System.in);
double price = console.nextDouble();
int quantity = console.nextInt();
System.out.println(price * quantity);`,
      tests: [
        { label: '2.5 each, 4 items', stdin: '2.5\n4\n', output: '10.0' },
        { label: '1.25 each, 3 items', stdin: '1.25 3\n', output: '3.75' },
      ],
      mustInclude: [
        { pattern: 'nextDouble\\s*\\(', message: 'The price has a decimal, so read it with `nextDouble()`.' },
        { pattern: 'nextInt\\s*\\(', message: 'The quantity is a whole number, so read it with `nextInt()`.' },
      ],
      explanation: 'Read in the order the user types, using the method that matches each type, and then print the product.',
    },
  ]),

  // ---------------- Unit 2 checkpoint ----------------
  ...topic('input', [
    {
      id: 'u2cp-01',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'setup',
      prompt: 'Which pair of lines gets a program ready to read from the keyboard?',
      options: [
        { text: 'import java.util.Scanner; at the top, then Scanner console = new Scanner(System.in); inside main' },
        { text: 'Only Scanner console = new Scanner(System.in); inside main', feedback: 'Without the import at the top, Java does not know what a Scanner is.' },
        { text: 'import java.util.Scanner; at the top, then Scanner console = new Scanner(System.out); inside main', feedback: 'The import is right, but `System.out` is for printing. Input comes from `System.in`.' },
        { text: 'import Scanner; at the top, then Scanner console = new Scanner(System.in); inside main', feedback: 'The import needs the whole package name, `java.util.Scanner`.' },
      ],
      answer: 0,
      explanation: 'Two jobs: tell Java where Scanner lives with the import, and connect a new Scanner to the keyboard with `System.in`.',
    },
    {
      id: 'u2cp-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'mixing',
      prompt: 'The user types `Mia 4 2.5`. What does this program print?',
      code: j`
Scanner console = new Scanner(System.in);
String name = console.next();
int cups = console.nextInt();
double price = console.nextDouble();
System.out.println(name + " owes " + cups * price);`,
      stdin: 'Mia 4 2.5\n',
      optionStyle: 'output',
      options: [
        { text: 'Mia owes 10.0' },
        { text: 'Mia owes 6.5', feedback: 'That is 4 plus 2.5. The star multiplies them.' },
        { text: 'Mia owes 42.5', feedback: 'The star does math. It does not put digits side by side.' },
        { text: 'Mia owes 10', feedback: 'One of the numbers is a `double`, so the answer is a `double` too, and it prints with the decimal.' },
      ],
      answer: 0,
      explanation: 'The three reads pick up Mia, 4 and 2.5 in order. Then 4 times 2.5 is 10.0, which is joined onto the text.',
    },
    {
      id: 'u2cp-03',
      type: 'error-type',
      difficulty: 3,
      concept: 'type-match',
      prompt: 'The user types `4.5`. What happens when we run this code?',
      code: j`
Scanner console = new Scanner(System.in);
System.out.print("How many pizzas? ");
int pizzas = console.nextInt();
System.out.println(pizzas * 10);`,
      stdin: '4.5\n',
      answer: 'runtime',
      feedback: {
        syntax: 'The code is valid. Nothing breaks until the user types something unexpected.',
        logic: 'It does not finish with a wrong number. It stops before that.',
        none: 'Is 4.5 a whole number?',
      },
      highlightLines: [3],
      explanation: '4.5 is not a whole number, so `nextInt()` stops the program with an InputMismatchException. Later in the course you will learn to catch problems like this.',
    },
    {
      id: 'u2cp-04',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'mixing',
      prompt: 'The user types a word, then a whole number. Fill in the blanks.',
      code: j`
Scanner console = new Scanner(System.in);
String pet = console.___();
int years = console.___();
System.out.println(pet + " is " + years);`,
      stdin: 'Rex 5\n',
      blanks: [['next'], ['nextInt']],
      bank: ['next', 'nextInt', 'nextDouble', 'nextLine'],
      expectedOutput: 'Rex is 5',
      explanation: 'A word is read with `next()`, and a whole number with `nextInt()`. The calls follow the same order the user typed things.',
    },
    {
      id: 'u2cp-05',
      type: 'find-bug',
      difficulty: 3,
      concept: 'type-match',
      prompt: 'This program should read a whole number of players, but it will not compile. Tap the buggy line.',
      code: j`
Scanner console = new Scanner(System.in);
System.out.print("Players: ");
int players = console.nextDouble();
System.out.println("Teams of 5: " + players / 5);`,
      stdin: '20\n',
      bugLines: [3],
      fixedCode: j`
Scanner console = new Scanner(System.in);
System.out.print("Players: ");
int players = console.nextInt();
System.out.println("Teams of 5: " + players / 5);`,
      bugKind: 'syntax',
      explanation: '`nextDouble()` hands back a `double`, and a `double` cannot be stored in an `int` box. Use `nextInt()` to read a whole number.',
    },
    {
      id: 'u2cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'calculate',
      prompt: 'Read three test marks (as `double`s) and print their total.',
      starter: j`
// read three marks and print the total
`,
      solution: j`
Scanner console = new Scanner(System.in);
double a = console.nextDouble();
double b = console.nextDouble();
double c = console.nextDouble();
System.out.println(a + b + c);`,
      tests: [
        { label: 'whole marks', stdin: '80 90 85\n', output: '255.0' },
        { label: 'decimal marks', stdin: '72.5\n88.5\n90\n', output: '251.0' },
      ],
      mustInclude: [{ pattern: 'nextDouble\\s*\\(', message: 'Marks can have decimals, so read them with `nextDouble()`.' }],
      explanation: 'Three `nextDouble()` calls read three numbers in a row, and then we add them together.',
    },
  ]),
]

export const unit2: UnitContent = {
  questions,
  unit: {
    id: 'u2',
    number: 2,
    title: 'Reading Input',
    tagline: 'Let your programs listen to the person using them.',
    color: 'sky',
    icon: 'keyboard',
    topics: ['input'],
    checkpoint: ['u2cp-01', 'u2cp-02', 'u2cp-03', 'u2cp-04', 'u2cp-05', 'u2cp-06'],
    lessons: [
      {
        id: 'u2-l1',
        unitId: 'u2',
        title: 'Meet the Scanner',
        summary: 'Import it, create it, and read a word.',
        topic: 'input',
        teach: [
          {
            kind: 'concept',
            title: 'Time to let your program listen',
            what: 'A **Scanner** is a tool that reads whatever the user types on the keyboard. Using it takes two steps. First you import it, and then you create one connected to the keyboard with `System.in`. I like to name mine `console`, because that is what it is.',
            why: 'A program that only talks gets boring quickly. Quizzes, calculators and games all need to ask the user something and use the answer.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Asking for a name',
            how: 'The `import` goes at the very top, above the class. Then `console.next()` reads one word and hands it back as a String.',
            code: j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        System.out.print("What is your name? ");
        String name = console.next();
        System.out.println("Nice to meet you, " + name + "!");
    }
}`,
            stdin: 'Maya\n',
            notes: [
              { line: 1, text: 'Tell Java where Scanner lives. This line goes above the class.' },
              { line: 5, text: 'Create a Scanner connected to the keyboard (System.in).' },
              { line: 6, text: 'print, not println, so the user types on the same line as the question.' },
              { line: 7, text: 'next() waits for the user, then reads one word.' },
            ],
          },
          {
            kind: 'tip',
            title: 'What next() really does',
            body: '`next()` reads one **word**. It stops at the first space or Enter. If the user types two words, the second one just waits in line for the next call.',
            bullets: [
              'Always show a prompt with `print` first, so the user knows what to type.',
              'In the lessons I show only the lines inside `main`, but you must still type the import yourself.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Forgetting the import',
            body: 'Without the import, Java has never heard of Scanner. You will see *cannot find symbol* even though the rest of the code is fine.',
            wrong: j`
public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        String word = console.next();
        System.out.println(word);
    }
}`,
            right: j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        String word = console.next();
        System.out.println(word);
    }
}`,
            stdin: 'hello\n',
          },
        ],
        questions: ['u2l1-01', 'u2l1-02', 'u2l1-03', 'u2l1-04', 'u2l1-05', 'u2l1-06', 'u2l1-07', 'u2l1-08'],
        challenge: 'u2l1-09',
      },
      {
        id: 'u2-l2',
        unitId: 'u2',
        title: 'nextInt and nextDouble',
        summary: 'Read whole numbers and decimals.',
        topic: 'input',
        teach: [
          {
            kind: 'concept',
            title: 'Match the reader to the value',
            what: 'The Scanner has a different reader for each kind of value. `next()` reads a word, `nextInt()` reads a whole number, and `nextDouble()` reads a decimal number. The method you pick has to match the type of the variable you store it in.',
            why: 'You cannot do math with text. If you want to add up prices or work out an average, the input has to arrive as a real number, and that is what these two methods give you.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'One int and one double',
            how: 'Each reader takes the next piece of input and turns it into the right type. The prompts are there so the user knows what is coming.',
            code: j`
Scanner console = new Scanner(System.in);
System.out.print("How old are you? ");
int age = console.nextInt();
System.out.print("How tall are you in metres? ");
double height = console.nextDouble();
System.out.println("Next year you will be " + (age + 1) + " and about " + height + " m tall.");`,
            stdin: '15\n1.7\n',
            notes: [
              { line: 3, text: 'nextInt() gives back a whole number we can do math with.' },
              { line: 5, text: 'nextDouble() gives back a decimal number.' },
              { line: 6, text: 'The brackets make Java add 1 before joining it to the text.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Spaces and Enter both work',
            body: 'The Scanner treats spaces and new lines the same way, as gaps between values. So `12 30` on one line and `12` Enter `30` on two lines give exactly the same result.',
          },
          {
            kind: 'mistake',
            title: 'The wrong reader for the value',
            body: '`nextInt()` only understands whole numbers. Hand it a decimal and the program crashes in the middle of running.',
            wrong: j`
Scanner console = new Scanner(System.in);
int price = console.nextInt();
System.out.println(price);`,
            right: j`
Scanner console = new Scanner(System.in);
double price = console.nextDouble();
System.out.println(price);`,
            stdin: '3.5\n',
          },
        ],
        questions: ['u2l2-01', 'u2l2-02', 'u2l2-03', 'u2l2-04', 'u2l2-05', 'u2l2-06', 'u2l2-07', 'u2l2-08'],
        challenge: 'u2l2-09',
      },
      {
        id: 'u2-l3',
        unitId: 'u2',
        title: 'Putting Input to Work',
        summary: 'Read, calculate, print.',
        topic: 'input',
        teach: [
          {
            kind: 'concept',
            title: 'Read, calculate, print',
            what: 'Most programs follow the same three-step rhythm. They **read** some input, they **calculate** something with it, and they **print** the answer. The only rule is to read the values in the same order the user types them.',
            why: 'Once you can do this, you can build things that feel real: a tip calculator, a unit converter, a grade averager. This pattern shows up in almost every program you will write this year.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'A tip calculator',
            how: 'The program reads a bill and a tip percentage, works out the tip, and prints the total. Notice that each read picks the method that matches the type.',
            code: j`
Scanner console = new Scanner(System.in);
System.out.print("Meal cost: ");
double cost = console.nextDouble();
System.out.print("Tip percent: ");
int percent = console.nextInt();
double tip = cost * percent / 100;
System.out.println("Tip: " + tip);
System.out.println("Total: " + (cost + tip));`,
            stdin: '40\n15\n',
            notes: [
              { line: 3, text: 'Read the cost first, because that is what the prompt asked for first.' },
              { line: 6, text: 'Calculate the tip. 15 percent of 40 is 6.0.' },
              { line: 8, text: 'Brackets so the numbers are added before they are joined to the text.' },
            ],
          },
          {
            kind: 'tip',
            title: 'A trick for reading whole lines',
            body: '`console.nextLine()` reads an entire line, spaces included, which is handy for a full name. The catch is that `nextInt()` and `nextDouble()` leave the Enter key behind, so a `nextLine()` right after them reads an empty line.',
            bullets: [
              'After a number, call `console.nextLine();` once on its own to throw the leftover away.',
              'Or just use `next()` for single words and skip the problem.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The nextLine surprise',
            body: 'Here the program asks for an age and then a name. The name comes out empty, because `nextLine()` reads what is left over from the age line.',
            wrong: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
String name = console.nextLine();
System.out.println(name + " is " + age);`,
            right: j`
Scanner console = new Scanner(System.in);
int age = console.nextInt();
console.nextLine();
String name = console.nextLine();
System.out.println(name + " is " + age);`,
            stdin: '16\nSam\n',
          },
        ],
        questions: ['u2l3-01', 'u2l3-02', 'u2l3-03', 'u2l3-04', 'u2l3-05', 'u2l3-06', 'u2l3-07', 'u2l3-08'],
        challenge: 'u2l3-09',
      },
    ],
  },
}
