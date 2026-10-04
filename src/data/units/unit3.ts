import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: Arithmetic operators ----------------
  ...topic('arithmetic', [
    {
      id: 'u3l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'int-division',
      prompt: 'What does `17 / 5` give in Java?',
      optionStyle: 'code',
      options: [
        { text: '3' },
        { text: '3.4', feedback: 'That is what your calculator says. But when both numbers are ints, Java throws the decimal part away.' },
        { text: '4', feedback: 'Java does not round. It simply chops the decimal part off.' },
        { text: '2', feedback: 'That is the remainder, and Java uses a different symbol for it, the percent sign.' },
      ],
      answer: 0,
      explanation: 'Both 17 and 5 are ints, so this is **integer division**. 5 goes into 17 three whole times, and the leftover .4 is thrown away.',
    },
    {
      id: 'u3l1-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'modulus',
      prompt: 'Which operator gives you the **remainder** after a division?',
      optionStyle: 'code',
      options: [
        { text: '%' },
        { text: '/', feedback: 'That one gives the quotient, the whole number of times it fits.' },
        { text: '*', feedback: 'The star multiplies.' },
        { text: 'mod', feedback: 'Some languages spell it out, but Java uses the percent sign.' },
      ],
      answer: 0,
      explanation: 'The percent sign is called **modulus**. `17 % 5` is 2, because 5 fits into 17 three times with 2 left over.',
    },
    {
      id: 'u3l1-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'order',
      prompt: 'What does this program print?',
      code: j`System.out.println(7 + 3 * 2);`,
      optionStyle: 'output',
      options: [
        { text: '13' },
        { text: '20', feedback: 'That would be right if Java went strictly left to right. But multiplication always goes before addition.' },
        { text: '16', feedback: 'You are close to the idea, but check which operation comes first.' },
        { text: '10', feedback: 'Both operations still have to happen. Nothing is skipped.' },
      ],
      answer: 0,
      explanation: 'Java follows the same order of operations you learned in math class. Multiplication comes first, so 3 times 2 is 6, and then 7 plus 6 is 13.',
    },
    {
      id: 'u3l1-04',
      type: 'true-false',
      difficulty: 1,
      concept: 'int-division',
      prompt: '`10 / 4` equals `2.5` in Java.',
      answer: false,
      wrongFeedback: 'Both numbers are ints, so Java does integer division and drops the .5. The answer is 2.',
      explanation: 'To get 2.5 at least one side has to be a decimal, like `10 / 4.0` or `10.0 / 4`. That is float division.',
    },
    {
      id: 'u3l1-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'modulus',
      prompt: 'We have 17 cookies to share among 5 friends. Fill in the blank to find how many are left over.',
      code: j`
int leftover = 17 ___ 5;
System.out.println(leftover);`,
      blanks: [['%']],
      bank: ['%', '/', '*', '-'],
      expectedOutput: '2',
      explanation: 'Each friend gets 3 cookies, which uses up 15, so 2 are left. The remainder operator `%` finds that for you.',
    },
    {
      id: 'u3l1-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'modulus',
      prompt: 'What does this program print?',
      code: j`
int total = 47;
int people = 5;
System.out.println(total / people);
System.out.println(total % people);`,
      optionStyle: 'output',
      options: [
        { text: '9\n2' },
        { text: '9.4\n2', feedback: 'Both numbers are ints, so the division drops the decimal part. Only 9 is left.' },
        { text: '2\n9', feedback: 'You have them in the wrong order. The first line is the division and the second is the remainder.' },
        { text: '10\n2', feedback: 'Java does not round up. It just takes the whole number of times 5 fits into 47.' },
      ],
      answer: 0,
      explanation: '5 fits into 47 nine whole times (that is 45), and 2 is left over. So `/` gives 9 and `%` gives 2. These two operators always work as a team.',
    },
    {
      id: 'u3l1-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'int-division',
      prompt: 'This program should print the average of 3 and 4, which is 3.5. What kind of problem does it have?',
      code: j`
int a = 3;
int b = 4;
double average = (a + b) / 2;
System.out.println(average);`,
      answer: 'logic',
      feedback: {
        syntax: 'The code compiles without any complaints.',
        runtime: 'Nothing crashes. The program runs to the end.',
        none: 'Look at the output. Is 3.0 really the average of 3 and 4?',
      },
      highlightLines: [3],
      explanation: '`(a + b) / 2` is int divided by int, so Java throws away the .5 before it ever reaches the `double`. The program runs and prints 3.0, which is wrong. Dividing by `2.0` fixes it.',
    },
    {
      id: 'u3l1-08',
      type: 'type-output',
      difficulty: 2,
      concept: 'modulus',
      prompt: 'Type exactly what this program prints.',
      code: j`
int minutes = 135;
int hours = minutes / 60;
int left = minutes % 60;
System.out.println(hours + "h " + left + "m");`,
      answer: '2h 15m',
      explanation: '60 goes into 135 twice, so `hours` is 2. The remainder is 135 minus 120, which is 15. That is the classic way to turn minutes into hours and minutes.',
    },
    {
      id: 'u3l1-09',
      type: 'write-code',
      difficulty: 3,
      concept: 'modulus',
      prompt: 'Read a number of seconds as an `int`. Print how many full minutes it holds and how many seconds are left, like `2 min 15 sec`.',
      starter: j`
// 1. create a Scanner and read the seconds

// 2. work out the minutes and the leftover seconds

// 3. print: <minutes> min <seconds> sec
`,
      solution: j`
Scanner console = new Scanner(System.in);
int seconds = console.nextInt();
int minutes = seconds / 60;
int left = seconds % 60;
System.out.println(minutes + " min " + left + " sec");`,
      tests: [
        { label: '135 seconds', stdin: '135\n', output: '2 min 15 sec' },
        { label: 'less than a minute', stdin: '59\n', output: '0 min 59 sec' },
      ],
      mustInclude: [
        { pattern: '/\\s*60', message: 'Divide by 60 to get the whole minutes.' },
        { pattern: '%\\s*60', message: 'Use `% 60` to get the seconds that are left over.' },
      ],
      explanation: 'Division gives the whole minutes and the remainder gives what is left. The same trick works for turning cents into dollars or days into weeks.',
    },
  ]),

  // ---------------- Lesson 2: Assignment operators ----------------
  ...topic('arithmetic', [
    {
      id: 'u3l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'plus-equals',
      prompt: 'Which line adds 5 to `score`?',
      optionStyle: 'code',
      options: [
        { text: 'score += 5;' },
        { text: 'score =+ 5;', feedback: 'The order matters. This one means "set score to positive 5", which wipes out the old value.' },
        { text: 'score + 5;', feedback: 'This works out a number but never stores it, so Java will not even compile it.' },
        { text: 'score ++ 5;', feedback: 'The double plus only goes up by one, and it never takes a number after it.' },
      ],
      answer: 0,
      explanation: '`score += 5;` is shorthand for `score = score + 5;`. The operator goes first and the equals sign second.',
    },
    {
      id: 'u3l2-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'plus-equals',
      prompt: 'What does this program print?',
      code: j`
int a = 4;
a += 6;
System.out.println(a);`,
      optionStyle: 'output',
      options: [
        { text: '10' },
        { text: '6', feedback: 'The `+=` adds to what is already in the box. It does not replace it.' },
        { text: '46', feedback: 'These are ints, so the plus adds them. It does not glue the digits together.' },
        { text: '4', feedback: 'Line 2 changes `a`, so by the time we print, it has grown.' },
      ],
      answer: 0,
      explanation: '`a += 6` means `a = a + 6`, so 4 plus 6 gives 10.',
    },
    {
      id: 'u3l2-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'increment',
      prompt: '`count++;` does the same thing as `count = count + 1;`.',
      answer: true,
      wrongFeedback: 'It really is the same. The double plus is just a shortcut for adding one.',
      explanation: '`++` is called the **increment** operator. Its partner `--` is the **decrement** operator, which subtracts one.',
    },
    {
      id: 'u3l2-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'minus-equals',
      prompt: 'A player loses one life. Fill in the blank so `lives` goes from 3 down to 2.',
      code: j`
int lives = 3;
lives ___ 1;
System.out.println(lives);`,
      blanks: [['-=']],
      bank: ['-=', '+=', '*=', '=-'],
      expectedOutput: '2',
      explanation: '`lives -= 1;` means `lives = lives - 1;`. You could also write `lives--;` to get the same result.',
    },
    {
      id: 'u3l2-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'compound',
      prompt: 'What does this program print?',
      code: j`
int x = 20;
x /= 3;
x *= 2;
System.out.println(x);`,
      optionStyle: 'output',
      options: [
        { text: '12' },
        { text: '13.33', feedback: '`x` is an int, so it can never hold a decimal part. The division drops it.' },
        { text: '14', feedback: 'Check the first step. 20 divided by 3 as ints is 6, and not 7. Java never rounds up.' },
        { text: '6', feedback: 'You stopped one step early. There is still a `*= 2` to do.' },
      ],
      answer: 0,
      highlightLines: [2, 3],
      explanation: '`x /= 3` makes x equal to 20 / 3 = 6 (integer division). Then `x *= 2` doubles it to 12.',
    },
    {
      id: 'u3l2-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'compound',
      prompt: 'What does this program print?',
      code: j`
int n = 17;
n %= 5;
n++;
System.out.println(n);`,
      optionStyle: 'output',
      options: [
        { text: '3' },
        { text: '2', feedback: 'That is what is left after `%=`, but there is still the `n++` to run.' },
        { text: '4', feedback: 'Check what `n %= 5` does first. It stores the remainder, not the quotient.' },
        { text: '18', feedback: 'The `%=` replaces n with a remainder, so n is a small number by the time of `n++`.' },
      ],
      answer: 0,
      explanation: '`n %= 5` stores the remainder of 17 divided by 5, which is 2. Then `n++` makes it 3.',
    },
    {
      id: 'u3l2-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'plus-equals',
      prompt: 'The programmer wants `total` to grow from 10 to 15. What kind of problem does this code have?',
      code: j`
int total = 10;
total =+ 5;
System.out.println(total);`,
      answer: 'logic',
      feedback: {
        syntax: 'Java is happy with this line. It is valid code, just not the code the programmer meant.',
        runtime: 'Nothing crashes. The program finishes normally.',
        none: 'The program is supposed to print 15. Is that what it prints?',
      },
      highlightLines: [2],
      explanation: 'The equals and plus are in the wrong order. `=+ 5` means "assign positive 5", so total becomes 5. Java sees nothing wrong, which makes this a sneaky logic error. The correct operator is `+=`.',
    },
    {
      id: 'u3l2-08',
      type: 'find-bug',
      difficulty: 3,
      concept: 'plus-equals',
      prompt: 'This program will not compile. Tap the line with the problem.',
      code: j`
int points = 10;
points + = 5;
System.out.println(points);`,
      bugLines: [2],
      fixedCode: j`
int points = 10;
points += 5;
System.out.println(points);`,
      bugKind: 'syntax',
      explanation: 'The two characters of `+=` have to be written together with no space between them. With a space, Java reads a plus followed by a lonely equals sign.',
    },
    {
      id: 'u3l2-09',
      type: 'write-code',
      difficulty: 3,
      concept: 'compound',
      prompt: 'Start with `int stock = 50;`. Use assignment operators to add 20, then subtract 8, then double it. Print `stock`.',
      starter: j`
int stock = 50;
// add 20 with +=

// subtract 8 with -=

// double it with *=

System.out.println(stock);`,
      solution: j`
int stock = 50;
stock += 20;
stock -= 8;
stock *= 2;
System.out.println(stock);`,
      tests: [{ label: 'prints 124', output: '124' }],
      mustInclude: [
        { pattern: '\\+=', message: 'Use `+=` to add.' },
        { pattern: '-=', message: 'Use `-=` to subtract.' },
        { pattern: '\\*=', message: 'Use `*=` to double.' },
      ],
      explanation: '50 plus 20 is 70, minus 8 is 62, and doubled is 124. Each shortcut changes the same box one step at a time.',
    },
  ]),

  // ---------------- Lesson 3: Casting ----------------
  ...topic('arithmetic', [
    {
      id: 'u3l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'cast-int',
      prompt: 'What value does `(int) 7.9` give?',
      optionStyle: 'code',
      options: [
        { text: '7' },
        { text: '8', feedback: 'A cast does not round. It chops the decimal part off.' },
        { text: '7.9', feedback: 'After the cast, the value is an int, and an int has no decimal part.' },
        { text: 'It will not compile', feedback: 'It compiles fine. Writing the cast is exactly how you tell Java you accept losing the decimal.' },
      ],
      answer: 0,
      explanation: 'Casting a decimal to an int **truncates** it, which means it chops off everything after the point. Java never rounds when you cast.',
    },
    {
      id: 'u3l3-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'widening',
      prompt: 'What does this program print?',
      code: j`
double d = 5;
System.out.println(d);`,
      optionStyle: 'output',
      options: [
        { text: '5.0' },
        { text: '5', feedback: '`d` is a `double`, so it always prints with a decimal point.' },
        { text: 'Compile error', feedback: 'Going from int to double is safe, because nothing can be lost. Java does it automatically.' },
        { text: '0.5', feedback: 'There is no division here. The 5 just goes into the box as 5.0.' },
      ],
      answer: 0,
      explanation: 'An int fits into a double with no loss, so Java converts it for you without a cast. That is called **widening**.',
    },
    {
      id: 'u3l3-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'cast-int',
      prompt: 'Casting a `double` to an `int` rounds the number to the nearest whole number.',
      answer: false,
      wrongFeedback: 'Not quite. The cast only chops the decimal part off, so 9.99 becomes 9, not 10. If you want rounding, you use `Math.round`, which is coming up soon.',
      explanation: '`(int) 3.99` is 3. Casting truncates, and the part after the decimal point is simply dropped.',
    },
    {
      id: 'u3l3-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'cast-division',
      prompt: 'Fill in the blank so the division keeps its decimal part.',
      code: j`
int a = 7;
int b = 2;
double result = (___) a / b;
System.out.println(result);`,
      blanks: [['double']],
      bank: ['double', 'int', 'String', 'char'],
      expectedOutput: '3.5',
      explanation: '`(double) a` turns the 7 into 7.0 first. A double divided by an int is a decimal division, so we get 3.5.',
    },
    {
      id: 'u3l3-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'cast-division',
      prompt: 'What does this program print?',
      code: j`
int a = 7;
int b = 2;
System.out.println((double) a / b);
System.out.println((double) (a / b));`,
      optionStyle: 'output',
      options: [
        { text: '3.5\n3.0' },
        { text: '3.5\n3.5', feedback: 'Look at where the second cast sits. The brackets make the division happen first, as ints, and only afterwards is the 3 turned into a double.' },
        { text: '3.0\n3.0', feedback: 'The cast in the first line is placed before the division, so it does keep the decimal part.' },
        { text: '3\n3', feedback: 'Both lines involve a cast to double, so both answers print with a decimal point.' },
      ],
      answer: 0,
      highlightLines: [3, 4],
      explanation: 'A cast applies to whatever comes right after it. In line 3 it hits `a` alone, so the division is a decimal one. In line 4 the brackets force 7 / 2 = 3 first, and the cast then turns that 3 into 3.0, which is too late.',
    },
    {
      id: 'u3l3-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'narrowing',
      prompt: 'What happens when we try to run this code?',
      code: j`
double price = 3.7;
int dollars = price;
System.out.println(dollars);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java spots this before the program starts. That makes it a compile-time problem.',
        logic: 'The program never runs, so there is no wrong answer to print.',
        none: 'Is it safe to squeeze a double into an int box? What would happen to the .7?',
      },
      highlightLines: [2],
      explanation: 'Going from `double` to `int` could lose information, so Java insists that you say so on purpose. `int dollars = (int) price;` is accepted.',
    },
    {
      id: 'u3l3-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'cast-char',
      prompt: 'What does this program print?',
      code: j`
System.out.println((char) 66);
System.out.println((int) 'A');`,
      optionStyle: 'output',
      options: [
        { text: 'B\n65' },
        { text: '66\n65', feedback: 'The first cast turns the number 66 into a character, so it prints as a letter.' },
        { text: 'B\nA', feedback: 'The second cast turns the character into its number, so it prints as a number.' },
        { text: 'b\n97', feedback: 'Capital letters have smaller numbers than lowercase ones. 65 is a capital A.' },
      ],
      answer: 0,
      explanation: 'Every character has a number code. 65 is A, so 66 is B. Casting lets you go back and forth between the character and its number.',
    },
    {
      id: 'u3l3-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'cast-division',
      prompt: 'Type exactly what this program prints.',
      code: j`
int score = 17;
int total = 20;
double percent = (double) score / total * 100;
System.out.println(percent);`,
      answer: '85.0',
      explanation: 'The cast makes `score` a double first, so 17.0 / 20 is 0.85, and 0.85 times 100 is 85.0. Without the cast, 17 / 20 would have been 0.',
    },
    {
      id: 'u3l3-09',
      type: 'write-code',
      difficulty: 3,
      concept: 'cast-division',
      prompt: 'Read two whole numbers: a total of points and the number of tests. Print the **average** as a `double`.',
      starter: j`
// 1. read the points and the number of tests (both ints)

// 2. print the average, keeping the decimal part
`,
      solution: j`
Scanner console = new Scanner(System.in);
int points = console.nextInt();
int tests = console.nextInt();
System.out.println((double) points / tests);`,
      tests: [
        { label: '17 points over 2 tests', stdin: '17 2\n', output: '8.5' },
        { label: 'an exact average', stdin: '9\n3\n', output: '3.0' },
      ],
      mustInclude: [{ pattern: '\\(\\s*double\\s*\\)', message: 'Cast one of the numbers to `double` before dividing.' }],
      explanation: 'The cast goes before the division, right on one of the numbers. Then Java treats the whole thing as decimal division.',
    },
  ]),

  // ---------------- Lesson 4: The two jobs of + ----------------
  ...topic('arithmetic', [
    {
      id: 'u3l4-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'add-vs-join',
      prompt: 'What does `System.out.println(1 + 2);` print?',
      optionStyle: 'code',
      options: [
        { text: '3' },
        { text: '12', feedback: 'There are no quotes here, so both are numbers, and the plus adds them.' },
        { text: '1 + 2', feedback: 'Java works out the sum before printing. It does not print the math itself.' },
        { text: 'It will not compile', feedback: 'This is perfectly valid Java.' },
      ],
      answer: 0,
      explanation: 'With two numbers, `+` means addition. 1 plus 2 is 3.',
    },
    {
      id: 'u3l4-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'add-vs-join',
      prompt: 'What does this program print?',
      code: j`System.out.println("1" + "2");`,
      optionStyle: 'output',
      options: [
        { text: '12' },
        { text: '3', feedback: 'The numbers are inside quotes, which makes them text. And with text, the plus joins things instead of adding.' },
        { text: '1 + 2', feedback: 'The plus is an instruction. It does not show up in the output.' },
        { text: '"1""2"', feedback: 'The quotes only mark the text in the code. They are not part of what gets printed.' },
      ],
      answer: 0,
      explanation: 'Quotes turn the digits into text. With text on both sides, `+` is **concatenation**, which means joining, so the result is the String `12`.',
    },
    {
      id: 'u3l4-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'add-vs-join',
      prompt: 'The `+` sign always adds numbers together.',
      answer: false,
      wrongFeedback: 'Not always. The moment a String is involved, `+` joins pieces of text instead.',
      explanation: 'The plus sign has two jobs. It adds numbers, and it joins text (concatenation). Which one it does depends on the types on each side.',
    },
    {
      id: 'u3l4-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'left-to-right',
      prompt: 'What does this program print?',
      code: j`System.out.println("Total: " + 4 + 5);`,
      optionStyle: 'output',
      options: [
        { text: 'Total: 45' },
        { text: 'Total: 9', feedback: 'That would be right if there were brackets around the 4 + 5. Without them Java works from left to right.' },
        { text: 'Total: 4 + 5', feedback: 'The plus signs do work, and they are never printed as characters.' },
        { text: 'Total:45', feedback: 'The space is part of the text in quotes, so it stays.' },
      ],
      answer: 0,
      explanation: 'Java reads left to right. First `"Total: " + 4` becomes the text `Total: 4`, and then that text is joined with 5. Since a String is already involved, nothing gets added.',
    },
    {
      id: 'u3l4-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'left-to-right',
      prompt: 'What does this program print?',
      code: j`System.out.println(4 + 5 + " total");`,
      optionStyle: 'output',
      options: [
        { text: '9 total' },
        { text: '45 total', feedback: 'Left to right again. The first plus has two numbers on either side, so it adds before any text shows up.' },
        { text: '4 + 5 total', feedback: 'The plus signs do the work. They are not printed.' },
        { text: '9total', feedback: 'The space inside the quotes is kept.' },
      ],
      answer: 0,
      explanation: 'The first plus sees two numbers, so it adds them and gets 9. Only then does the String arrive, and that plus joins `9` with ` total`.',
    },
    {
      id: 'u3l4-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'brackets',
      prompt: 'Add the brackets so Java adds the numbers before joining them to the text.',
      code: j`System.out.println("Sum: " + ___ 4 + 5 ___);`,
      blanks: [['('], [')']],
      bank: ['(', ')', '[', '{'],
      expectedOutput: 'Sum: 9',
      explanation: 'Brackets make Java work out `4 + 5` first. The result 9 is then joined to the text. Brackets are the fix for almost every surprise with `+`.',
    },
    {
      id: 'u3l4-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'char-math',
      prompt: 'What does this program print?',
      code: j`
System.out.println('a' + 'b');
System.out.println("" + 'a' + 'b');`,
      optionStyle: 'output',
      options: [
        { text: '195\nab' },
        { text: 'ab\nab', feedback: 'Two chars with a plus between them are treated as numbers, and numbers are added.' },
        { text: '195\n195', feedback: 'The second line starts with an empty String, so everything after it gets joined as text.' },
        { text: 'ab\n195', feedback: 'You have the lines the wrong way around. Look at which one starts with the empty String.' },
      ],
      answer: 0,
      explanation: 'A `char` behaves like a number in math. 97 plus 98 is 195. Starting with `""` forces every later plus to join, so the second line gives `ab`.',
    },
    {
      id: 'u3l4-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'left-to-right',
      prompt: 'Trace it carefully from left to right, then type exactly what this program prints.',
      code: j`
int x = 3;
int y = 4;
System.out.println(x + y + "" + x + y);`,
      answer: '734',
      explanation: 'Left to right: `x + y` is 7 because both are numbers. Then `7 + ""` makes the text `7`. After that, each plus joins, so we add `3` and then `4`. The result is `734`.',
    },
    {
      id: 'u3l4-09',
      type: 'find-bug',
      difficulty: 2,
      concept: 'brackets',
      prompt: 'This program should print `Fruit: 9`, but it prints `Fruit: 45`. Tap the line with the bug.',
      code: j`
int apples = 4;
int pears = 5;
System.out.println("Fruit: " + apples + pears);`,
      bugLines: [3],
      fixedCode: j`
int apples = 4;
int pears = 5;
System.out.println("Fruit: " + (apples + pears));`,
      bugKind: 'logic',
      explanation: 'Once the text `Fruit: ` is in play, each plus joins instead of adding. Put the sum in brackets so it is worked out first.',
    },
    {
      id: 'u3l4-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'brackets',
      prompt: 'Read two whole numbers `a` and `b`. Print them in the form `3 + 4 = 7`.',
      starter: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
// print: a + b = sum
`,
      solution: j`
Scanner console = new Scanner(System.in);
int a = console.nextInt();
int b = console.nextInt();
System.out.println(a + " + " + b + " = " + (a + b));`,
      tests: [
        { label: '3 and 4', stdin: '3 4\n', output: '3 + 4 = 7' },
        { label: '10 and 25', stdin: '10 25\n', output: '10 + 25 = 35' },
      ],
      explanation: 'The `" + "` and `" = "` are pieces of text, and `(a + b)` is the real addition. The brackets are the part that matter, because without them you would print 34.',
    },
  ]),

  // ---------------- Lesson 5: The Math class ----------------
  ...topic('math', [
    {
      id: 'u3l5-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'sqrt',
      prompt: 'Which line gives the square root of 49?',
      optionStyle: 'code',
      options: [
        { text: 'Math.sqrt(49)' },
        { text: 'sqrt(49)', feedback: 'These tools live inside the Math class, so you have to start with `Math.`' },
        { text: 'Math.root(49)', feedback: 'Nice guess, but the method is called `sqrt`, short for square root.' },
        { text: '49 ^ 0.5', feedback: 'The caret is not a power sign in Java. It does something completely different, and it will not even compile with a decimal.' },
      ],
      answer: 0,
      explanation: 'Java gives you a toolbox called `Math`. You call a tool by writing `Math.` and then its name, and `Math.sqrt(49)` gives 7.0.',
    },
    {
      id: 'u3l5-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'pow',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.pow(3, 2));`,
      optionStyle: 'output',
      options: [
        { text: '9.0' },
        { text: '9', feedback: '`Math.pow` always gives back a `double`, so it prints with a decimal point.' },
        { text: '6.0', feedback: 'That would be 3 times 2. `pow` raises 3 to the power of 2, which is 3 times 3.' },
        { text: '8.0', feedback: 'That is 2 to the power of 3. The base comes first, then the exponent.' },
      ],
      answer: 0,
      explanation: '`Math.pow(base, exponent)` gives base to the power of the exponent. 3 squared is 9, and the answer comes back as a `double`, so you see 9.0.',
    },
    {
      id: 'u3l5-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'round',
      prompt: '`Math.round(2.5)` gives `3`.',
      answer: true,
      wrongFeedback: 'It does. Java rounds halves up, so 2.5 becomes 3.',
      explanation: '`Math.round` goes to the nearest whole number, and a .5 goes up.',
    },
    {
      id: 'u3l5-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'abs',
      prompt: 'Fill in the blank to print the distance from zero, without the minus sign.',
      code: j`System.out.println(Math.___(-7));`,
      blanks: [['abs']],
      bank: ['abs', 'sqrt', 'round', 'max'],
      expectedOutput: '7',
      explanation: '`Math.abs` gives the **absolute value**, which is how far a number is from zero. It drops the minus sign.',
    },
    {
      id: 'u3l5-05',
      type: 'predict-output',
      difficulty: 2,
      concept: 'max-min',
      prompt: 'What does this program print?',
      code: j`System.out.println(Math.max(3, 9) + Math.min(3, 9));`,
      optionStyle: 'output',
      options: [
        { text: '12' },
        { text: '9', feedback: 'Both calls run, and then their results are added together.' },
        { text: '6', feedback: 'That is the difference. The program adds the two results.' },
        { text: '39', feedback: 'Both results are numbers, so the plus adds them. It does not join digits.' },
      ],
      answer: 0,
      explanation: '`max` picks the bigger one, which is 9, and `min` picks the smaller one, which is 3. Then 9 + 3 is 12.',
    },
    {
      id: 'u3l5-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'rounding',
      prompt: 'What does this program print?',
      code: j`
System.out.println(Math.round(7.4));
System.out.println(Math.ceil(7.4));
System.out.println(Math.floor(7.4));`,
      optionStyle: 'output',
      options: [
        { text: '7\n8.0\n7.0' },
        { text: '7.0\n8.0\n7.0', feedback: 'The first one is `Math.round`, and it hands back a whole number.' },
        { text: '7\n8\n7', feedback: '`ceil` and `floor` return doubles, so they print with a decimal point.' },
        { text: '8\n8.0\n7.0', feedback: 'The nearest whole number to 7.4 is 7, not 8.' },
      ],
      answer: 0,
      explanation: '`round` goes to the nearest whole number (7). `ceil` goes up to the next whole number, like a ceiling (8.0). `floor` goes down, like a floor (7.0). The last two come back as doubles.',
    },
    {
      id: 'u3l5-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'return-types',
      prompt: 'What happens when we try to run this code?',
      code: j`
int p = Math.pow(2, 3);
System.out.println(p);`,
      answer: 'syntax',
      feedback: {
        runtime: 'Java catches this before the program starts.',
        logic: 'The program does not run at all, so it cannot give a wrong answer.',
        none: 'What type does `Math.pow` hand back, and can that go in an int?',
      },
      highlightLines: [1],
      explanation: '`Math.pow` always returns a `double`, and a `double` will not squeeze into an `int` box without a cast. Write `int p = (int) Math.pow(2, 3);`.',
    },
    {
      id: 'u3l5-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'return-types',
      prompt: 'Type exactly what this program prints.',
      code: j`
int r = (int) Math.round(2.6);
System.out.println(r + Math.sqrt(16));`,
      answer: '7.0',
      explanation: '`Math.round(2.6)` is 3, and the cast makes it an int. `Math.sqrt(16)` is 4.0. An int plus a double is a double, so 3 + 4.0 is 7.0.',
    },
    {
      id: 'u3l5-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'pow',
      prompt: 'This program should find the longest side of a right triangle, but it will not compile. Tap the buggy line.',
      code: j`
double a = 3;
double b = 4;
double c = Math.sqrt(a ^ 2 + b ^ 2);
System.out.println(c);`,
      bugLines: [3],
      fixedCode: j`
double a = 3;
double b = 4;
double c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
System.out.println(c);`,
      bugKind: 'syntax',
      explanation: 'The caret `^` is not the power sign in Java, so it will not work on doubles. Use `Math.pow(a, 2)` for a squared.',
    },
    {
      id: 'u3l5-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'rounding',
      prompt: 'Read a radius as a `double`. Print the area of the circle (`Math.PI * radius * radius`) rounded to the nearest whole number.',
      starter: j`
// 1. read the radius

// 2. print the rounded area
`,
      solution: j`
Scanner console = new Scanner(System.in);
double radius = console.nextDouble();
System.out.println(Math.round(Math.PI * radius * radius));`,
      tests: [
        { label: 'radius 2', stdin: '2\n', output: '13' },
        { label: 'radius 1', stdin: '1\n', output: '3' },
        { label: 'radius 10', stdin: '10\n', output: '314' },
      ],
      mustInclude: [
        { pattern: 'Math\\.PI', message: 'Use `Math.PI` for pi.' },
        { pattern: 'Math\\.round', message: 'Round the area with `Math.round`.' },
      ],
      explanation: '`Math.PI` is a ready-made constant. Multiply it by the radius twice, and wrap the whole thing in `Math.round` to get a whole number.',
    },
  ]),

  // ---------------- Lesson 6: Random numbers ----------------
  ...topic('math', [
    {
      id: 'u3l6-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'random',
      prompt: 'Which values can `Math.random()` give back?',
      options: [
        { text: 'Any decimal from 0.0 up to, but not including, 1.0' },
        { text: 'Whole numbers from 0 to 10', feedback: 'It gives decimals, not whole numbers, and always less than 1.' },
        { text: 'Any decimal from 0.0 to 1.0, including 1.0', feedback: 'It gets very close to 1.0 but never actually reaches it.' },
        { text: 'Any number at all', feedback: 'It is always between 0.0 and 1.0.' },
      ],
      answer: 0,
      explanation: '`Math.random()` returns a `double` that is at least 0.0 and always less than 1.0. To get dice, cards or coin flips, we scale and shift that number.',
    },
    {
      id: 'u3l6-02',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'Which expression gives a random whole number from 1 to 6, like rolling a die?',
      optionStyle: 'code',
      options: [
        { text: '(int) (Math.random() * 6) + 1' },
        { text: '(int) (Math.random() * 6)', feedback: 'This gives 0 to 5. Add 1 to move it up to 1 to 6.' },
        { text: '(int) Math.random() * 6 + 1', feedback: 'The cast only touches `Math.random()`, and that is always 0, so this is always 1. Put the multiplication in brackets first.' },
        { text: '(int) (Math.random() * 7)', feedback: 'This gives 0 to 6, and a die does not have a zero.' },
      ],
      answer: 0,
      explanation: '`Math.random() * 6` is a decimal from 0.0 to just under 6.0. The cast chops it to 0 through 5, and the `+ 1` shifts that to 1 through 6.',
    },
    {
      id: 'u3l6-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'random-range',
      prompt: '`(int) (Math.random() * 10)` can produce the number 10.',
      answer: false,
      wrongFeedback: '`Math.random()` is always smaller than 1.0, so times 10 it is always smaller than 10. The biggest value the cast can give is 9.',
      explanation: 'The range of `(int) (Math.random() * 10)` is 0 to 9. That is ten possible values, and 10 itself is never one of them.',
    },
    {
      id: 'u3l6-04',
      type: 'predict-output',
      difficulty: 3,
      concept: 'random-cast',
      prompt: 'What does this program print? (Careful, this one has a trap.)',
      code: j`System.out.println((int) Math.random() * 100);`,
      optionStyle: 'output',
      options: [
        { text: '0' },
        { text: 'A random number from 0 to 99', feedback: 'The cast is applied to `Math.random()` alone, before the multiplication.' },
        { text: 'A random number from 1 to 100', feedback: 'There is no plus one, and the cast already ruins the randomness.' },
        { text: '100', feedback: 'The cast turns the random decimal into 0 before anything gets multiplied.' },
      ],
      answer: 0,
      explanation: '`(int) Math.random()` happens first. Any decimal below 1.0 gets chopped to 0, and 0 times 100 is 0. Put brackets around `Math.random() * 100` so the cast comes last.',
    },
    {
      id: 'u3l6-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'Make `card` a random number from 1 to 13.',
      code: j`
int card = (int) (Math.random() * ___) + ___;
System.out.println(card);`,
      blanks: [['13'], ['1']],
      verify: { status: 'ok', random: true },
      explanation: 'There are 13 possible values, so we multiply by 13. They start at 1, so we add 1 to shift the range.',
    },
    {
      id: 'u3l6-06',
      type: 'multiple-choice',
      difficulty: 3,
      concept: 'random-range',
      prompt: 'Which expression gives a random whole number from 10 to 20, **including** both ends?',
      optionStyle: 'code',
      options: [
        { text: '(int) (Math.random() * 11) + 10' },
        { text: '(int) (Math.random() * 10) + 10', feedback: 'That gives 10 to 19, which is only ten values and never reaches 20.' },
        { text: '(int) (Math.random() * 20) + 10', feedback: 'That gives 10 to 29, which is far too big.' },
        { text: '(int) (Math.random() * 21)', feedback: 'That gives 0 to 20, so it can be smaller than 10.' },
      ],
      answer: 0,
      explanation: 'The formula is `(int) (Math.random() * count) + min`, where `count = max - min + 1`. Here that is 20 - 10 + 1 = 11 values, starting at 10.',
    },
    {
      id: 'u3l6-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'Pretend `Math.random()` happened to return 0.75. Type exactly what this program prints.',
      code: j`
double r = 0.75;
int roll = (int) (r * 6) + 1;
System.out.println(roll);`,
      answer: '5',
      explanation: '0.75 times 6 is 4.5, and the cast chops it to 4. Then adding 1 gives 5. So 0.75 lands on a 5.',
    },
    {
      id: 'u3l6-08',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'random-range',
      prompt: 'A game needs a random month number from 1 to 12. Which expression is right?',
      optionStyle: 'code',
      options: [
        { text: '(int) (Math.random() * 12) + 1' },
        { text: '(int) (Math.random() * 12)', feedback: 'That gives 0 to 11, and there is no month 0.' },
        { text: '(int) (Math.random() * 13)', feedback: 'That gives 0 to 12. Month 0 does not exist.' },
        { text: '(int) (Math.random() * 11) + 1', feedback: 'That gives 1 to 11, so December can never come up.' },
      ],
      answer: 0,
      explanation: 'There are 12 values, so multiply by 12. They start at 1, so add 1. That gives 1 through 12.',
    },
    {
      id: 'u3l6-09',
      type: 'write-code',
      difficulty: 3,
      concept: 'random-range',
      prompt: 'Print a random whole number from 1 to 6, like rolling a die.',
      starter: j`
// roll the die and print the result
`,
      solution: j`
int die = (int) (Math.random() * 6) + 1;
System.out.println(die);`,
      tests: [{ label: 'prints a number from 1 to 6', outputPattern: '^[1-6]$' }],
      mustInclude: [{ pattern: 'Math\\.random\\s*\\(', message: 'Use `Math.random()` to roll the die.' }],
      explanation: 'Scale with `* 6`, chop with `(int)`, and shift with `+ 1`. Run it a few times and you will see the number change.',
    },
  ]),

  // ---------------- Unit 3 checkpoint ----------------
  ...topic('arithmetic', [
    {
      id: 'u3cp-01',
      type: 'predict-output',
      difficulty: 2,
      concept: 'int-division',
      prompt: 'What does this program print?',
      code: j`
int a = 17;
int b = 5;
System.out.println(a / b + " " + a % b + " " + (double) a / b);`,
      optionStyle: 'output',
      options: [
        { text: '3 2 3.4' },
        { text: '3.4 2 3.4', feedback: 'The first piece is an int divided by an int, so the decimal is dropped.' },
        { text: '3 2 3', feedback: 'The last piece has a cast to `double`, so it keeps its decimal part.' },
        { text: '3 3 3.4', feedback: 'The middle piece is the remainder, which is 17 minus 15.' },
      ],
      answer: 0,
      explanation: '`17 / 5` is 3, `17 % 5` is 2, and `(double) 17 / 5` is 3.4. Because the first part is a number, they are joined with spaces in between.',
    },
    {
      id: 'u3cp-02',
      type: 'error-type',
      difficulty: 2,
      concept: 'int-division',
      prompt: 'This program should print the average of three marks, which is about 86.33. What kind of problem does it have?',
      code: j`
int a = 80;
int b = 91;
int c = 88;
double average = (a + b + c) / 3;
System.out.println(average);`,
      answer: 'logic',
      feedback: {
        syntax: 'The program compiles without a single complaint.',
        runtime: 'Nothing crashes. It runs from start to finish.',
        none: 'Look at what it prints. Is 86.0 really the average?',
      },
      highlightLines: [4],
      explanation: 'The brackets add up three ints, and then an int is divided by an int, so the decimal part disappears before it gets to the `double`. Dividing by `3.0` would fix it.',
    },
    {
      id: 'u3cp-03',
      type: 'predict-output',
      difficulty: 3,
      concept: 'compound',
      prompt: 'What does this program print?',
      code: j`
int x = 10;
x += 5 * 2;
x -= 4;
x++;
System.out.println(x);`,
      optionStyle: 'output',
      options: [
        { text: '17' },
        { text: '27', feedback: 'The right side of `+=` is worked out first: 5 times 2 is 10, not 15 or anything bigger.' },
        { text: '16', feedback: 'You missed the `x++` on line 4.' },
        { text: '21', feedback: 'Check the multiplication. `x += 5 * 2` adds 10, not 15.' },
      ],
      answer: 0,
      explanation: 'Step by step: x starts at 10, then `x += 10` makes 20, `x -= 4` makes 16, and `x++` makes 17.',
    },
    {
      id: 'u3cp-04',
      type: 'find-bug',
      difficulty: 3,
      concept: 'return-types',
      topic: 'math',
      prompt: 'This program will not compile. Tap the line with the bug.',
      code: j`
double price = 8.6;
int rounded = Math.round(price);
System.out.println(rounded);`,
      bugLines: [2],
      fixedCode: j`
double price = 8.6;
int rounded = (int) Math.round(price);
System.out.println(rounded);`,
      bugKind: 'syntax',
      explanation: 'When you give `Math.round` a `double`, it hands back a `long`, which is a bigger kind of whole number, and a `long` does not fit in an `int` without a cast.',
    },
    {
      id: 'u3cp-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'pow',
      topic: 'math',
      prompt: 'Fill in the blank to work out 2 to the power of 10.',
      code: j`System.out.println(Math.___(2, 10));`,
      blanks: [['pow']],
      bank: ['pow', 'sqrt', 'abs', 'max'],
      expectedOutput: '1024.0',
      explanation: '`Math.pow(2, 10)` multiplies 2 by itself ten times. The answer is a `double`, so it prints as 1024.0.',
    },
    {
      id: 'u3cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'modulus',
      prompt: 'Read a number of days. Print how many full weeks it makes and how many days are left over, like `6 weeks and 3 days`.',
      starter: j`
// read the days, then print the weeks and the leftover days
`,
      solution: j`
Scanner console = new Scanner(System.in);
int days = console.nextInt();
System.out.println(days / 7 + " weeks and " + days % 7 + " days");`,
      tests: [
        { label: '45 days', stdin: '45\n', output: '6 weeks and 3 days' },
        { label: 'exactly two weeks', stdin: '14\n', output: '2 weeks and 0 days' },
      ],
      mustInclude: [
        { pattern: '/\\s*7', message: 'Divide by 7 for the weeks.' },
        { pattern: '%\\s*7', message: 'Use `% 7` for the leftover days.' },
      ],
      explanation: 'Integer division gives the whole weeks, and modulus gives what is left. Both operators come together again.',
    },
  ]),
]

export const unit3: UnitContent = {
  questions,
  unit: {
    id: 'u3',
    number: 3,
    title: 'Math in Java',
    tagline: 'Operators, shortcuts, casting and the handy Math class.',
    color: 'grape',
    icon: 'calculator',
    topics: ['arithmetic', 'math'],
    checkpoint: ['u3cp-01', 'u3cp-02', 'u3cp-03', 'u3cp-04', 'u3cp-05', 'u3cp-06'],
    lessons: [
      {
        id: 'u3-l1',
        unitId: 'u3',
        title: 'Arithmetic Operators',
        summary: 'Add, subtract, multiply, divide and find remainders.',
        topic: 'arithmetic',
        teach: [
          {
            kind: 'concept',
            title: 'Java as a calculator',
            what: 'Java has five math operators: `+` `-` `*` `/` and `%`. Three of them behave exactly like your calculator. The other two, division and modulus, need a little more care. When **both** numbers are ints, `/` is **integer division** and the decimal part is thrown away. When at least one number is a double, it is **float division** and the decimal part is kept. The `%` operator gives the **remainder**.',
            why: 'Almost every program you write will do some math: totals, averages, scores, time. If you do not know that `7 / 2` is 3, your programs will quietly give wrong answers, and that is the hardest kind of bug to spot.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'All five operators at work',
            how: 'Watch what happens with division. The first division has two ints. The last has a decimal on the right.',
            code: j`
int a = 17;
int b = 5;
System.out.println(a + b);
System.out.println(a - b);
System.out.println(a * b);
System.out.println(a / b);
System.out.println(a % b);
System.out.println(17 / 5.0);`,
            notes: [
              { line: 3, text: 'Addition: 22.' },
              { line: 5, text: 'Multiplication: 85.' },
              { line: 6, text: 'Integer division: 5 fits into 17 three times, so 3. The .4 is gone.' },
              { line: 7, text: 'Modulus: 17 minus 15 leaves 2.' },
              { line: 8, text: 'Float division, because one side is a double: 3.4.' },
            ],
          },
          {
            kind: 'tip',
            title: 'What is modulus good for?',
            body: 'The remainder operator looks odd at first, but you will use it all the time.',
            bullets: [
              'Even or odd: `n % 2` is 0 for even numbers and 1 for odd ones.',
              'The last digit of a number: `n % 10`.',
              'Splitting up amounts: minutes into hours and minutes, cents into dollars and cents.',
              'Order of operations works like math class: `*`, `/` and `%` go before `+` and `-`.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Dividing two ints',
            body: 'This is the number one surprise in Java math. Both numbers are ints, so Java drops the .5 before it reaches the double.',
            wrong: j`
double average = (80 + 91) / 2;
System.out.println(average);`,
            right: j`
double average = (80 + 91) / 2.0;
System.out.println(average);`,
          },
        ],
        questions: ['u3l1-01', 'u3l1-02', 'u3l1-03', 'u3l1-04', 'u3l1-05', 'u3l1-06', 'u3l1-07', 'u3l1-08'],
        challenge: 'u3l1-09',
      },
      {
        id: 'u3-l2',
        unitId: 'u3',
        title: 'Assignment Operators',
        summary: 'Shortcuts like += and ++.',
        topic: 'arithmetic',
        teach: [
          {
            kind: 'concept',
            title: 'Update a variable in one step',
            what: 'Programmers change a variable based on its own value all the time, so Java gives us shortcuts. `a += 5;` means `a = a + 5;`. There is one for each operator: `+=`, `-=`, `*=`, `/=` and `%=`. And `a++` adds one, while `a--` takes one away.',
            why: 'Think of counting points, tracking lives, or adding up a bill. Every one of those is "take the box, change it, put it back". The shortcuts make that short and easy to read.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'Changing one variable step by step',
            how: 'The variable `a` changes a little bit at a time. Follow the value after each line.',
            code: j`
int a = 10;
a += 5;
System.out.println(a);
a -= 3;
System.out.println(a);
a *= 2;
System.out.println(a);
a /= 4;
System.out.println(a);
a %= 4;
System.out.println(a);
a++;
System.out.println(a);`,
            notes: [
              { line: 2, text: 'a = a + 5, so a is now 15.' },
              { line: 4, text: 'a = a - 3, so 12.' },
              { line: 6, text: 'a = a * 2, so 24.' },
              { line: 8, text: 'a = a / 4, so 6.' },
              { line: 10, text: 'a = a % 4, so the remainder is 2.' },
              { line: 12, text: 'a++ is a = a + 1, so 3.' },
            ],
          },
          {
            kind: 'tip',
            title: 'A cheat sheet to keep',
            body: 'Here is the whole family. Each one reads as "take the old value, do this to it, store it back".',
            bullets: [
              '`a += 5;` is the same as `a = a + 5;`',
              '`a -= 5;` is the same as `a = a - 5;`',
              '`a *= 2;` is the same as `a = a * 2;`',
              '`a /= 3;` is the same as `a = a / 3;`',
              '`a %= 5;` is the same as `a = a % 5;`',
              '`a++;` is the same as `a = a + 1;`',
            ],
          },
          {
            kind: 'mistake',
            title: 'Writing the symbols in the wrong order',
            body: 'The operator goes before the equals sign. Flip them and Java reads something totally different, with no error message to warn you.',
            wrong: j`
int total = 10;
total =+ 5;
System.out.println(total);`,
            right: j`
int total = 10;
total += 5;
System.out.println(total);`,
          },
        ],
        questions: ['u3l2-01', 'u3l2-02', 'u3l2-03', 'u3l2-04', 'u3l2-05', 'u3l2-06', 'u3l2-07', 'u3l2-08'],
        challenge: 'u3l2-09',
      },
      {
        id: 'u3-l3',
        unitId: 'u3',
        title: 'Casting',
        summary: 'Turn one type into another.',
        topic: 'arithmetic',
        teach: [
          {
            kind: 'concept',
            title: 'Changing a value\'s type',
            what: '**Casting** means telling Java to treat a value as a different type. You write the new type in brackets right before the value, like `(double) total` or `(int) 9.99`. Going from a smaller type to a bigger one (`int` to `double`) is safe, so Java does it automatically. Going the other way can lose information, so Java makes you cast on purpose, and the cast **chops off** the decimal part.',
            why: 'Casting is how you fix integer division. It is also how you turn decimals into whole numbers, or characters into their number codes. Without it, a lot of everyday calculations come out wrong.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Fixing integer division with a cast',
            how: 'The first division is two ints, so the decimal part is lost. In the second one, the cast turns `total` into a double first.',
            code: j`
int total = 47;
int people = 5;
double wrong = total / people;
double right = (double) total / people;
int chopped = (int) 9.99;
System.out.println(wrong);
System.out.println(right);
System.out.println(chopped);`,
            notes: [
              { line: 3, text: '47 / 5 as ints is 9, and then 9 is stored as 9.0. Too late.' },
              { line: 4, text: 'The cast comes first, so this is 47.0 / 5, which is 9.4.' },
              { line: 5, text: 'The cast chops the .99 off. It does not round.' },
            ],
          },
          {
            kind: 'tip',
            title: 'The cast only touches what comes right after it',
            body: 'This is the part that trips people up. A cast belongs to the value directly after it, so where you put it matters.',
            bullets: [
              '`(double) a / b` casts `a` first, so you get a decimal division.',
              '`(double) (a / b)` divides as ints first, and then casts the already-chopped answer.',
              '`(char) 66` is `B`, and `(int) \'A\'` is 65.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Casting too late',
            body: 'The brackets force the integer division to happen first, so the decimal is already gone when the cast arrives.',
            wrong: j`
int a = 7;
int b = 2;
double result = (double) (a / b);
System.out.println(result);`,
            right: j`
int a = 7;
int b = 2;
double result = (double) a / b;
System.out.println(result);`,
          },
        ],
        questions: ['u3l3-01', 'u3l3-02', 'u3l3-03', 'u3l3-04', 'u3l3-05', 'u3l3-06', 'u3l3-07', 'u3l3-08'],
        challenge: 'u3l3-09',
      },
      {
        id: 'u3-l4',
        unitId: 'u3',
        title: 'Two Jobs for the + Sign',
        summary: 'Adding numbers versus joining text.',
        topic: 'arithmetic',
        teach: [
          {
            kind: 'concept',
            title: 'The plus sign wears two hats',
            what: 'With two numbers, `+` **adds**. As soon as one side is a String, `+` **joins** the pieces together, and that is called **concatenation**. Java reads from left to right and decides at each plus sign which job to do.',
            why: 'You will build messages out of numbers and text all the time, like "Total: 25" or "Score: 8 out of 10". If you do not know which hat the plus is wearing, your totals will turn into strange strings of digits.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Same sign, different jobs',
            how: 'Compare each line to the one before it, and watch what the brackets do.',
            code: j`
System.out.println(2 + 3);
System.out.println("2" + "3");
System.out.println("Total: " + 2 + 3);
System.out.println("Total: " + (2 + 3));
System.out.println(2 + 3 + " is the total");`,
            notes: [
              { line: 1, text: 'Two numbers, so it adds: 5.' },
              { line: 2, text: 'Two Strings, so it joins: 23.' },
              { line: 3, text: 'The text comes first, so each plus joins: Total: 23.' },
              { line: 4, text: 'The brackets make the addition happen first: Total: 5.' },
              { line: 5, text: 'The numbers come first, so 2 + 3 is added, and then the text is joined.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Your best friend is the bracket',
            body: 'Whenever you want math inside a message, put the math in brackets. Java will do it first and then join the answer.',
            bullets: [
              '`"Sum: " + (a + b)` is the safe way to print a sum.',
              'A `char` acts like a number in math, so `\'a\' + \'b\'` is 195, not "ab".',
              '`"" + a + b` starts with an empty String, so everything after it is joined as text.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Forgetting the brackets',
            body: 'The text comes first, so Java joins everything that follows it. Four and five get glued together instead of added.',
            wrong: j`System.out.println("Sum: " + 4 + 5);`,
            right: j`System.out.println("Sum: " + (4 + 5));`,
          },
        ],
        questions: ['u3l4-01', 'u3l4-02', 'u3l4-03', 'u3l4-04', 'u3l4-05', 'u3l4-06', 'u3l4-07', 'u3l4-08', 'u3l4-09'],
        challenge: 'u3l4-10',
      },
      {
        id: 'u3-l5',
        unitId: 'u3',
        title: 'The Math Class',
        summary: 'pow, sqrt, abs, max, min and the rounding family.',
        topic: 'math',
        teach: [
          {
            kind: 'concept',
            title: 'A toolbox that is already built',
            what: 'Java comes with a toolbox called **Math**. It has ready-made tools for powers, square roots, rounding and more. You do not import anything. You just write `Math.` followed by the name of the tool, like `Math.sqrt(81)`.',
            why: 'Nobody wants to write their own square root. These tools are fast, tested and always available, and you will use them in almost every program that involves numbers.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'The tools you will use most',
            how: 'Read each line, guess the answer, and then run it. Pay attention to which results have a decimal point.',
            code: j`
System.out.println(Math.pow(2, 5));
System.out.println(Math.sqrt(81));
System.out.println(Math.abs(-12));
System.out.println(Math.max(8, 15));
System.out.println(Math.min(8, 15));
System.out.println(Math.round(7.5));
System.out.println(Math.ceil(7.1));
System.out.println(Math.floor(7.9));
System.out.println(Math.PI);`,
            notes: [
              { line: 1, text: '2 to the power of 5. It always comes back as a double: 32.0.' },
              { line: 2, text: 'Square root of 81: 9.0.' },
              { line: 3, text: 'Absolute value drops the minus sign: 12.' },
              { line: 6, text: 'round goes to the nearest whole number, and a .5 goes up: 8.' },
              { line: 7, text: 'ceil always goes up: 8.0.' },
              { line: 8, text: 'floor always goes down: 7.0.' },
              { line: 9, text: 'Math.PI is a ready-made constant.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Watch the return types',
            body: 'Each tool hands back a particular type, and that decides whether you need a cast.',
            bullets: [
              '`pow`, `sqrt`, `ceil` and `floor` always give back a `double`.',
              '`abs`, `max` and `min` give back the same type that you gave them.',
              '`Math.round` of a `double` gives back a `long`. Write `(int) Math.round(x)` if you need an `int`.',
            ],
          },
          {
            kind: 'mistake',
            title: 'A double that will not fit',
            body: '`Math.pow` hands back a double. Trying to store that in an int is the same problem as `int x = 5.9;`, and Java stops you.',
            wrong: j`
int p = Math.pow(2, 3);
System.out.println(p);`,
            right: j`
int p = (int) Math.pow(2, 3);
System.out.println(p);`,
          },
        ],
        questions: ['u3l5-01', 'u3l5-02', 'u3l5-03', 'u3l5-04', 'u3l5-05', 'u3l5-06', 'u3l5-07', 'u3l5-08', 'u3l5-09'],
        challenge: 'u3l5-10',
      },
      {
        id: 'u3-l6',
        unitId: 'u3',
        title: 'Random Numbers',
        summary: 'Dice, cards and coin flips.',
        topic: 'math',
        teach: [
          {
            kind: 'concept',
            title: 'Letting chance into your program',
            what: '`Math.random()` gives back a random decimal that is at least 0.0 and always less than 1.0. On its own that is not very useful, but a little math turns it into dice rolls, card draws and coin flips. You **scale** it by multiplying, **chop** it with a cast, and **shift** it by adding.',
            why: 'Games, simulations and quizzes all need a bit of randomness to stay interesting. Once you know the pattern, you can make any range you want.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Rolling a die',
            how: 'Run this a few times and watch the number change. Multiply by 6 for six possible values, cast to chop, and add 1 so the range starts at 1.',
            code: j`
int die = (int) (Math.random() * 6) + 1;
System.out.println("You rolled a " + die);`,
            random: true,
            notes: [
              { line: 1, text: 'random() * 6 gives 0.0 up to just under 6.0. The cast chops that to 0 through 5. The + 1 shifts it to 1 through 6.' },
            ],
          },
          {
            kind: 'tip',
            title: 'The formula to remember',
            body: 'To get a random whole number from `min` to `max`, both included, use this:',
            code: '(int) (Math.random() * (max - min + 1)) + min',
            bullets: [
              'A die from 1 to 6 uses `* 6` and `+ 1`.',
              'A coin flip, 0 or 1, uses `* 2` and nothing added.',
              'A number from 10 to 20 uses `* 11` and `+ 10`.',
            ],
          },
          {
            kind: 'mistake',
            title: 'Casting too early',
            body: 'The cast sits right next to `Math.random()`, so it chops the random decimal to 0 before anything is multiplied. The result is the same number every time.',
            wrong: j`
int roll = (int) Math.random() * 100 + 1;
System.out.println(roll);`,
            right: j`
int roll = (int) (Math.random() * 100) + 1;
System.out.println(roll);`,
          },
        ],
        questions: ['u3l6-01', 'u3l6-02', 'u3l6-03', 'u3l6-04', 'u3l6-05', 'u3l6-06', 'u3l6-07', 'u3l6-08'],
        challenge: 'u3l6-09',
      },
    ],
  },
}
