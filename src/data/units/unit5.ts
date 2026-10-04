import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  // ---------------- Lesson 1: printf basics ----------------
  ...topic('printf', [
    {
      id: 'u5l1-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'placeholders',
      prompt: 'Which placeholder in a `printf` template stands for a whole number (an `int`)?',
      optionStyle: 'code',
      options: [
        { text: '%d' },
        { text: '%s', feedback: '`%s` is for Strings, meaning text.' },
        { text: '%f', feedback: '`%f` is for decimal numbers, which Java calls floating point.' },
        { text: '%i', feedback: 'Some other languages use `%i`, but Java uses `%d`. Think "d" for digit.' },
      ],
      answer: 0,
      explanation: '`%d` is the placeholder for whole numbers. Remember: `%d` for ints, `%s` for Strings, `%f` for decimals and `%c` for a single char.',
    },
    {
      id: 'u5l1-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'newline',
      prompt: 'What is the job of `%n` inside a `printf` template?',
      options: [
        { text: 'It starts a new line' },
        { text: 'It prints the letter n', feedback: 'The percent sign makes it special, so it is not printed as plain text.' },
        { text: 'It prints a number', feedback: 'Numbers use `%d` or `%f`.' },
        { text: 'It does nothing', feedback: 'It really does something. Without it, the next output would continue on the same line.' },
      ],
      answer: 0,
      explanation: '`%n` is a line break, like pressing Enter. Unlike `println`, `printf` never moves to a new line by itself, so we add `%n` when we want one.',
    },
    {
      id: 'u5l1-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'newline',
      prompt: '`printf` moves to a new line after printing, just like `println` does.',
      answer: false,
      wrongFeedback: 'It does not. You have to ask for the new line yourself, by ending the template with `%n`.',
      explanation: '`printf` behaves like `print`. It prints exactly what the template says and stops, so `%n` is how we end the line.',
    },
    {
      id: 'u5l1-04',
      type: 'predict-output',
      difficulty: 1,
      concept: 'placeholders',
      prompt: 'What does this program print?',
      code: j`System.out.printf("I have %d cats", 3);`,
      optionStyle: 'output',
      options: [
        { text: 'I have 3 cats' },
        { text: 'I have %d cats', feedback: 'The `%d` is a placeholder, so it gets replaced by the value 3.' },
        { text: 'I have 3', feedback: 'The text after the placeholder is part of the template, so it is printed too.' },
        { text: 'I have cats 3', feedback: 'The value drops into the spot where the placeholder is, and the order of the text does not change.' },
      ],
      answer: 0,
      explanation: 'Java copies the template and swaps the `%d` for the 3. Everything else in the quotes stays as it is.',
    },
    {
      id: 'u5l1-05',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'placeholders',
      prompt: 'Fill in the placeholder so the program greets the person by name.',
      code: j`
String name = "Maya";
System.out.printf("Hello, ___!%n", name);`,
      blanks: [['%s']],
      bank: ['%s', '%d', '%f', '%c'],
      expectedOutput: 'Hello, Maya!',
      explanation: '`name` is a String, so the placeholder is `%s`. The value is slotted in where the placeholder sits.',
    },
    {
      id: 'u5l1-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'percent',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%s scored %d%%%n", "Ana", 90);`,
      optionStyle: 'output',
      options: [
        { text: 'Ana scored 90%' },
        { text: 'Ana scored 90%%', feedback: 'Two percent signs in a row are an instruction for printf. They print as just one.' },
        { text: 'Ana scored 90', feedback: 'The `%%` prints a real percent sign, and it was not forgotten.' },
        { text: 'Ana scored %d%', feedback: 'The `%d` gets replaced by the 90, so it does not appear in the output.' },
      ],
      answer: 0,
      explanation: 'Because `%` is a special character in a template, you type `%%` when you want a real percent sign. The `%n` at the end moves to a new line.',
    },
    {
      id: 'u5l1-07',
      type: 'error-type',
      difficulty: 2,
      concept: 'type-match',
      prompt: 'What happens when we run this code?',
      code: j`System.out.printf("%d%n", 5.5);`,
      answer: 'runtime',
      feedback: {
        syntax: 'Java does not check the template while compiling. The code compiles fine.',
        logic: 'It does not print a wrong answer. It stops with an error.',
        none: 'Is 5.5 a whole number?',
      },
      highlightLines: [1],
      explanation: 'Java only notices the mismatch while the program is running. `%d` wants a whole number, and 5.5 is a double, so it throws an IllegalFormatConversionException.',
    },
    {
      id: 'u5l1-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'argument-count',
      prompt: 'What happens when we run this code?',
      code: j`System.out.printf("%d and %d%n", 5);`,
      answer: 'runtime',
      feedback: {
        syntax: 'Java does not count the placeholders at compile time, so this compiles fine.',
        logic: 'It does not print a wrong answer. It stops before that.',
        none: 'Count the placeholders, and then count the values.',
      },
      highlightLines: [1],
      explanation: 'There are two placeholders but only one value, so the second one has nothing to show. The program stops with a MissingFormatArgumentException while running.',
    },
    {
      id: 'u5l1-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'order',
      prompt: 'Type exactly what this program prints.',
      code: j`
String item = "tea";
int cups = 2;
System.out.printf("%d cups of %s%n", cups, item);`,
      answer: '2 cups of tea',
      explanation: 'Values fill the placeholders in order. The first `%d` takes `cups`, and the `%s` takes `item`. Swap them around and the program would crash.',
    },
    {
      id: 'u5l1-10',
      type: 'write-code',
      difficulty: 2,
      concept: 'placeholders',
      prompt: 'Read a name with `next()` and an age with `nextInt()`. Use `printf` to print `Maya is 15 years old.`',
      starter: j`
Scanner console = new Scanner(System.in);
String name = console.next();
int age = console.nextInt();
// use printf to print: <name> is <age> years old.
`,
      solution: j`
Scanner console = new Scanner(System.in);
String name = console.next();
int age = console.nextInt();
System.out.printf("%s is %d years old.%n", name, age);`,
      tests: [
        { label: 'Maya', stdin: 'Maya 15\n', output: 'Maya is 15 years old.' },
        { label: 'Leo', stdin: 'Leo 17\n', output: 'Leo is 17 years old.' },
      ],
      mustInclude: [{ pattern: 'printf\\s*\\(', message: 'Use `System.out.printf(...)` for this one.' }],
      explanation: 'The template has a `%s` for the String and a `%d` for the int, and the values come after it, in the same order.',
    },
  ]),

  // ---------------- Lesson 2: decimals and rounding ----------------
  ...topic('printf', [
    {
      id: 'u5l2-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'two-decimals',
      prompt: 'Which placeholder prints `3.14159` as `3.14`?',
      optionStyle: 'code',
      options: [
        { text: '%.2f' },
        { text: '%2f', feedback: 'The 2 without a dot means "at least 2 characters wide". It does not limit the decimals.' },
        { text: '%.2d', feedback: '`d` is for whole numbers, so this would crash with a decimal value.' },
        { text: '%f.2', feedback: 'The number of decimals has to go between the percent sign and the `f`, after a dot.' },
      ],
      answer: 0,
      explanation: 'The pattern is `%.` then the number of decimal places, then `f`. So `%.2f` means "show two decimals".',
    },
    {
      id: 'u5l2-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'two-decimals',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%.1f%n", 3.14159);`,
      optionStyle: 'output',
      options: [
        { text: '3.1' },
        { text: '3.14159', feedback: 'The `.1` limits how many decimals show up.' },
        { text: '3.2', feedback: 'The next digit is 4, which is small, so the 1 stays as it is.' },
        { text: '3', feedback: 'There is still one decimal place to show.' },
      ],
      answer: 0,
      explanation: '`%.1f` keeps one digit after the decimal point. The next digit is 4, so it rounds down and we get 3.1.',
    },
    {
      id: 'u5l2-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'rounding',
      prompt: '`%.2f` simply chops off the extra digits without rounding, so 2.678 prints as 2.67.',
      answer: false,
      wrongFeedback: 'It does round. 2.678 has an 8 after the second decimal, so it rounds up and prints 2.68.',
      explanation: 'printf rounds to the number of places you ask for. The variable itself is not changed, though, only what gets displayed.',
    },
    {
      id: 'u5l2-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'two-decimals',
      prompt: 'Fill in the blank so the price shows with two decimals, like a real price tag.',
      code: j`System.out.printf("$%___%n", 4.5);`,
      blanks: [['.2f']],
      bank: ['.2f', '2f', '.2d', 'f.2'],
      expectedOutput: '$4.50',
      explanation: 'Money always uses two decimals. `%.2f` turns 4.5 into 4.50. Notice that the dollar sign is normal text and the `%` starts the placeholder.',
    },
    {
      id: 'u5l2-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'two-decimals',
      prompt: 'Type exactly what this program prints.',
      code: j`System.out.printf("Total: $%.2f%n", 3 * 4.99);`,
      answer: 'Total: $14.97',
      explanation: 'The math is done first, 3 times 4.99 is about 14.97, and then `%.2f` formats the result with two decimals.',
    },
    {
      id: 'u5l2-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'rounding',
      prompt: 'What does this program print?',
      code: j`
double total = 0.1 + 0.2;
System.out.println(total);
System.out.printf("%.2f%n", total);`,
      optionStyle: 'output',
      options: [
        { text: '0.30000000000000004\n0.30' },
        { text: '0.3\n0.30', feedback: 'Computers store decimals in binary, so 0.1 plus 0.2 is a tiny bit off. `println` shows every digit it has.' },
        { text: '0.30000000000000004\n0.30000000000000004', feedback: 'The `%.2f` in line 3 rounds it for us.' },
        { text: '0.3\n0.3', feedback: 'Neither line prints exactly that. `println` shows the long version and `%.2f` always shows two decimals.' },
      ],
      answer: 0,
      explanation: 'This is why `printf` is so useful. The sum is not exactly 0.3 inside the computer, so `println` shows the ugly tail. `%.2f` tidies it up into 0.30.',
    },
    {
      id: 'u5l2-07',
      type: 'predict-output',
      difficulty: 3,
      concept: 'rounding',
      prompt: 'What does this program print?',
      code: j`
System.out.printf("%.1f%n", 2.25);
System.out.printf("%.0f%n", 2.5);`,
      optionStyle: 'output',
      options: [
        { text: '2.3\n3' },
        { text: '2.2\n2', feedback: 'Java rounds a trailing 5 upwards, so there is no rounding down to the even number.' },
        { text: '2.3\n2', feedback: 'Both lines round halves up, so the second line should be 3.' },
        { text: '2.25\n2.5', feedback: 'The `.1` and `.0` tell printf exactly how many decimals to show, and it rounds to fit.' },
      ],
      answer: 0,
      explanation: 'When the digit being cut off is a 5, printf rounds up. So 2.25 becomes 2.3, and 2.5 with no decimals becomes 3.',
    },
    {
      id: 'u5l2-08',
      type: 'error-type',
      difficulty: 2,
      concept: 'type-match',
      prompt: 'What happens when we run this code?',
      code: j`System.out.printf("%.2d%n", 5);`,
      answer: 'runtime',
      feedback: {
        syntax: 'Java does not check the template while compiling, so the code compiles.',
        logic: 'It does not print a wrong answer. It stops with an error.',
        none: 'Is it okay to ask for decimals on a `d` placeholder?',
      },
      highlightLines: [1],
      explanation: 'Whole numbers have no decimal places, so `%d` cannot have a precision. Java throws an IllegalFormatPrecisionException while the program runs.',
    },
    {
      id: 'u5l2-09',
      type: 'find-bug',
      difficulty: 3,
      concept: 'type-match',
      prompt: 'This program crashes when it runs. Tap the line with the bug.',
      code: j`
double price = 4.5;
int cups = 3;
System.out.printf("%d cups cost %d%n", cups, price * cups);`,
      bugLines: [3],
      fixedCode: j`
double price = 4.5;
int cups = 3;
System.out.printf("%d cups cost %.2f%n", cups, price * cups);`,
      bugKind: 'runtime',
      explanation: '`price * cups` is a decimal number, but the second `%d` expects a whole number. Switch it to `%.2f` and the money prints properly.',
    },
    {
      id: 'u5l2-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'two-decimals',
      prompt: 'Read a price as a `double` and print it as money with a dollar sign and two decimals, like `$4.50`.',
      starter: j`
Scanner console = new Scanner(System.in);
double price = console.nextDouble();
// print it as money
`,
      solution: j`
Scanner console = new Scanner(System.in);
double price = console.nextDouble();
System.out.printf("$%.2f%n", price);`,
      tests: [
        { label: '4.5', stdin: '4.5\n', output: '$4.50' },
        { label: 'a whole number', stdin: '12\n', output: '$12.00' },
        { label: 'ten cents', stdin: '0.1\n', output: '$0.10' },
      ],
      mustInclude: [{ pattern: '%\\.2f', message: 'Use `%.2f` for two decimals.' }],
      explanation: '`%.2f` always shows exactly two decimals, so 12 becomes 12.00 and 0.1 becomes 0.10. That is exactly what money needs.',
    },
  ]),

  // ---------------- Lesson 3: width and alignment ----------------
  ...topic('printf', [
    {
      id: 'u5l3-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'width',
      prompt: 'In `%6d`, what does the 6 mean?',
      options: [
        { text: 'Use at least 6 characters, padding with spaces on the left' },
        { text: 'Print the number 6 times', feedback: 'The number is only printed once. The 6 controls how much room it takes.' },
        { text: 'Only show 6 digits', feedback: 'It sets a minimum width. It does not cut anything off.' },
        { text: 'Add 6 to the number', feedback: 'Placeholders only decide how a value looks. They never do math.' },
      ],
      answer: 0,
      explanation: 'The number after the percent sign is the **width**, the minimum space the value takes up. Shorter values are padded with spaces so columns line up.',
    },
    {
      id: 'u5l3-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'width',
      prompt: 'What does this program print? (The brackets show the edges.)',
      code: j`System.out.printf("[%5d]%n", 42);`,
      optionStyle: 'output',
      options: [
        { text: '[   42]' },
        { text: '[42   ]', feedback: 'Numbers line up on the right by default. To put them on the left you need a minus sign.' },
        { text: '[42]', feedback: 'The 5 asks for a width of at least 5 characters.' },
        { text: '[00042]', feedback: 'Zeros only appear if you ask for them with a 0 flag. The padding is spaces by default.' },
      ],
      answer: 0,
      explanation: '`42` takes two characters, so three spaces are added on the left to fill the width of 5.',
    },
    {
      id: 'u5l3-03',
      type: 'predict-output',
      difficulty: 1,
      concept: 'left-align',
      prompt: 'What does this program print? (The brackets show the edges.)',
      code: j`System.out.printf("[%-5d]%n", 42);`,
      optionStyle: 'output',
      options: [
        { text: '[42   ]' },
        { text: '[   42]', feedback: 'Look at the minus sign. It moves the value to the left side.' },
        { text: '[-42  ]', feedback: 'The minus is an instruction for printf, not a negative sign.' },
        { text: '[42]', feedback: 'The width of 5 still holds, so spaces are added to fill it.' },
      ],
      answer: 0,
      explanation: 'The minus flag means **left-align**. The value sits at the left edge and the extra spaces go on the right.',
    },
    {
      id: 'u5l3-04',
      type: 'true-false',
      difficulty: 1,
      concept: 'left-align',
      prompt: 'A placeholder like `%-10s` lines the text up on the left side of a 10 character column.',
      answer: true,
      wrongFeedback: 'It does. The minus sign means left-aligned, and the 10 is the column width.',
      explanation: 'Left-aligned text with a minus flag is how names are lined up in a table or on a receipt.',
    },
    {
      id: 'u5l3-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'left-align',
      prompt: 'Fill in the blank so `hi` is left-aligned in a column 5 characters wide.',
      code: j`System.out.printf("[%___s]%n", "hi");`,
      blanks: [['-5']],
      bank: ['-5', '5', '05', '5-'],
      expectedOutput: '[hi   ]',
      explanation: 'The minus comes first, then the width. `%-5s` gives `hi` followed by three spaces.',
    },
    {
      id: 'u5l3-06',
      type: 'predict-output',
      difficulty: 2,
      concept: 'zero-pad',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%05d%n", 42);`,
      optionStyle: 'output',
      options: [
        { text: '00042' },
        { text: '   42', feedback: 'The 0 flag asks for zeros instead of spaces.' },
        { text: '42000', feedback: 'Zeros are added on the left of a number, never on the right.' },
        { text: '05d', feedback: 'The whole thing is a placeholder, so it is not printed as text.' },
      ],
      answer: 0,
      explanation: 'A 0 in front of the width pads with zeros. It is handy for things like `007` or a clock reading such as `07`.',
    },
    {
      id: 'u5l3-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'commas',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%,d%n", 1234567);`,
      optionStyle: 'output',
      options: [
        { text: '1,234,567' },
        { text: '1234567', feedback: 'The comma flag adds thousands separators.' },
        { text: '1,234.567', feedback: 'The separators go between groups of three digits, and no decimal point is added.' },
        { text: '1 234 567', feedback: 'The separator is a comma, not a space.' },
      ],
      answer: 0,
      explanation: 'Putting a comma right after the percent sign adds thousands separators, which makes big numbers easier to read.',
    },
    {
      id: 'u5l3-08',
      type: 'predict-output',
      difficulty: 3,
      concept: 'table',
      prompt: 'What does this program print? (The bars show the edges.)',
      code: j`System.out.printf("%-8s|%6.2f|%n", "Tea", 2.5);`,
      optionStyle: 'output',
      options: [
        { text: 'Tea     |  2.50|' },
        { text: '     Tea|  2.50|', feedback: 'The minus flag puts the name at the left, so the spaces go after it.' },
        { text: 'Tea     |2.50  |', feedback: 'The price has no minus, so it lines up on the right side of its column.' },
        { text: 'Tea|2.5|', feedback: 'Both columns have widths, and the price asks for two decimals.' },
      ],
      answer: 0,
      explanation: '`Tea` takes 3 of the 8 characters, so 5 spaces follow it. Then `2.50` takes 4 of the 6 characters, so 2 spaces go before it. The bars show that each column keeps its width.',
    },
    {
      id: 'u5l3-09',
      type: 'type-output',
      difficulty: 3,
      concept: 'table',
      prompt: 'Type exactly what this program prints, counting the spaces carefully.',
      code: j`
System.out.printf("%-6s%4d%n", "Ann", 7);
System.out.printf("%-6s%4d%n", "Bob", 12);`,
      answer: 'Ann      7\nBob     12',
      explanation: 'Each name is padded to 6 characters on the right, and each number is padded to 4 characters on the left. That is how the numbers end up neatly lined up in a column.',
    },
    {
      id: 'u5l3-10',
      type: 'write-code',
      difficulty: 3,
      concept: 'table',
      prompt: 'Print two receipt lines with `printf`. Each line shows the item left-aligned in 10 columns, then the price right-aligned in 6 columns with two decimals. Coffee costs 3.5 and Muffin costs 2.25.',
      starter: j`
// print the Coffee line

// print the Muffin line
`,
      solution: j`
System.out.printf("%-10s%6.2f%n", "Coffee", 3.5);
System.out.printf("%-10s%6.2f%n", "Muffin", 2.25);`,
      tests: [{ label: 'two aligned lines', output: 'Coffee      3.50\nMuffin      2.25' }],
      mustInclude: [
        { pattern: '%-10s', message: 'Use `%-10s` for the left-aligned item name.' },
        { pattern: '%6\\.2f', message: 'Use `%6.2f` for the price.' },
      ],
      explanation: 'Use the same template for every row, and the columns line up automatically. That is what makes `printf` perfect for receipts and tables.',
    },
  ]),

  // ---------------- Unit 5 checkpoint ----------------
  ...topic('printf', [
    {
      id: 'u5cp-01',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'placeholders',
      prompt: 'Given `String name = "Maya"; int pets = 3;`, which line prints `Maya has 3 pets` and then starts a new line?',
      optionStyle: 'code',
      options: [
        { text: 'System.out.printf("%s has %d pets%n", name, pets);' },
        { text: 'System.out.printf("%d has %s pets%n", name, pets);', feedback: 'The placeholders are swapped. A `%d` cannot show a String, so this would crash.' },
        { text: 'System.out.printf("%s has %d pets", name, pets);', feedback: 'It prints the right words, but without `%n` there is no new line at the end.' },
        { text: 'System.out.printf("name has pets%n", name, pets);', feedback: 'There are no placeholders in the template, so the values would never show up.' },
      ],
      answer: 0,
      explanation: 'The `%s` is for the String and the `%d` is for the int, in the same order as the values. The `%n` at the end starts a new line.',
    },
    {
      id: 'u5cp-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'two-decimals',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%s: %d items, $%.2f%n", "Cart", 3, 29.5);`,
      optionStyle: 'output',
      options: [
        { text: 'Cart: 3 items, $29.50' },
        { text: 'Cart: 3 items, $29.5', feedback: 'The `.2` forces exactly two decimals, so a zero gets added.' },
        { text: 'Cart: 3 items, $29.50000', feedback: '`%f` alone shows six decimals, but this one has `.2`, so it shows two.' },
        { text: '%s: %d items, $%.2f', feedback: 'Every placeholder is replaced by one of the values that follow.' },
      ],
      answer: 0,
      explanation: 'The three placeholders take `Cart`, `3` and `29.5` in order. The `%.2f` pads the 29.5 out to two decimals.',
    },
    {
      id: 'u5cp-03',
      type: 'error-type',
      difficulty: 3,
      concept: 'type-match',
      prompt: 'What happens when we run this code?',
      code: j`System.out.printf("%d%n", "five");`,
      answer: 'runtime',
      feedback: {
        syntax: 'Java does not look inside the template at compile time, so the code compiles.',
        logic: 'It does not print something wrong. It crashes.',
        none: 'Can a `%d` placeholder show the word five?',
      },
      highlightLines: [1],
      explanation: 'A `%d` placeholder needs a whole number, and `"five"` is text. The program compiles, then stops with an IllegalFormatConversionException while running.',
    },
    {
      id: 'u5cp-04',
      type: 'predict-output',
      difficulty: 3,
      concept: 'width',
      prompt: 'What does this program print? (The brackets show the edges.)',
      code: j`System.out.printf("[%6.1f]%n", 3.14159);`,
      optionStyle: 'output',
      options: [
        { text: '[   3.1]' },
        { text: '[3.1   ]', feedback: 'Without a minus sign, the value is right-aligned.' },
        { text: '[3.14159]', feedback: 'The `.1` rounds it to a single decimal place.' },
        { text: '[  3.14]', feedback: 'The `.1` means one decimal, and not two.' },
      ],
      answer: 0,
      explanation: '`3.1` takes 3 characters, and the width is 6, so three spaces go on the left. The decimal part is rounded to one place first.',
    },
    {
      id: 'u5cp-05',
      type: 'fill-blank',
      difficulty: 3,
      concept: 'two-decimals',
      prompt: 'Fill in the blank so the price shows two decimals.',
      code: j`System.out.printf("%-8s$%___%n", "Tea", 2.5);`,
      blanks: [['.2f']],
      bank: ['.2f', '2f', 'd', 's'],
      expectedOutput: 'Tea     $2.50',
      explanation: 'The first placeholder pads the name to 8 characters on the left side. The second one, `%.2f`, shows the price with two decimals.',
    },
    {
      id: 'u5cp-06',
      type: 'write-code',
      difficulty: 3,
      concept: 'table',
      prompt: 'Read an item name (`next()`), a quantity (`nextInt()`) and a price (`nextDouble()`). Use `printf` to print the line in the form `Latte x2 = $7.00`, where the amount is quantity times price.',
      starter: j`
Scanner console = new Scanner(System.in);
String item = console.next();
int qty = console.nextInt();
double price = console.nextDouble();
// print: <item> x<qty> = $<total>
`,
      solution: j`
Scanner console = new Scanner(System.in);
String item = console.next();
int qty = console.nextInt();
double price = console.nextDouble();
System.out.printf("%s x%d = $%.2f%n", item, qty, qty * price);`,
      tests: [
        { label: 'two lattes', stdin: 'Latte 2 3.5\n', output: 'Latte x2 = $7.00' },
        { label: 'three teas', stdin: 'Tea 3 2.25\n', output: 'Tea x3 = $6.75' },
      ],
      mustInclude: [{ pattern: 'printf\\s*\\(', message: 'Use `System.out.printf(...)`.' }],
      explanation: 'The template has a `%s`, a `%d` and a `%.2f`, and the values follow in that order, with the math done right inside the call.',
    },
  ]),
]

export const unit5: UnitContent = {
  questions,
  unit: {
    id: 'u5',
    number: 5,
    title: 'Formatting with printf',
    tagline: 'Make your output look clean, from prices to tidy tables.',
    color: 'teal',
    icon: 'printer',
    topics: ['printf'],
    checkpoint: ['u5cp-01', 'u5cp-02', 'u5cp-03', 'u5cp-04', 'u5cp-05', 'u5cp-06'],
    lessons: [
      {
        id: 'u5-l1',
        unitId: 'u5',
        title: 'printf Basics',
        summary: 'Templates, placeholders and %n.',
        topic: 'printf',
        teach: [
          {
            kind: 'concept',
            title: 'A template with holes in it',
            what: '`printf` prints a **template**, which is a piece of text with placeholders in it, and then fills those placeholders with the values you give it. Use `%d` for an int, `%s` for a String, `%f` for a decimal and `%c` for a single char. The values come after the template, in the same order as the placeholders.',
            why: 'Joining text and variables with `+` gets messy quickly. A template reads like the sentence you are trying to print, which makes your code easier to read and to fix.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Filling in the placeholders',
            how: 'Each placeholder takes the next value from the list. And since `printf` never starts a new line by itself, each template ends with `%n`.',
            code: j`
String name = "Maya";
int age = 15;
double gpa = 3.8;
System.out.printf("%s is %d years old.%n", name, age);
System.out.printf("Her GPA is %f%n", gpa);
System.out.printf("Her grade is %c%n", 'A');
System.out.printf("On the honour roll: %b%n", true);
System.out.printf("She got 95%% on the quiz.%n");`,
            notes: [
              { line: 4, text: '%s takes name and %d takes age, in that order.' },
              { line: 5, text: '%f alone shows six decimals: 3.800000. We will fix that next lesson.' },
              { line: 6, text: '%c is for a single character.' },
              { line: 7, text: '%b is for true or false.' },
              { line: 8, text: 'Write %% when you want a real percent sign.' },
            ],
          },
          {
            kind: 'tip',
            title: 'A few rules of thumb',
            body: 'These will save you from most printf headaches.',
            bullets: [
              'Count your placeholders, and count your values. They must match.',
              'Each placeholder must suit its value: `%d` for ints, `%s` for text, `%f` for decimals.',
              'End with `%n` for a new line. `printf` will not add one for you.',
              'You can use `%s` with almost anything, because every value can be shown as text.',
            ],
          },
          {
            kind: 'mistake',
            title: 'The wrong placeholder for the value',
            body: 'This compiles fine, because Java does not check the template until the program runs. And then it crashes, because `%d` cannot show a decimal.',
            wrong: j`System.out.printf("%d%n", 4.5);`,
            right: j`System.out.printf("%.1f%n", 4.5);`,
          },
        ],
        questions: ['u5l1-01', 'u5l1-02', 'u5l1-03', 'u5l1-04', 'u5l1-05', 'u5l1-06', 'u5l1-07', 'u5l1-08', 'u5l1-09'],
        challenge: 'u5l1-10',
      },
      {
        id: 'u5-l2',
        unitId: 'u5',
        title: 'Decimals and Rounding',
        summary: 'Show exactly the number of decimals you want.',
        topic: 'printf',
        teach: [
          {
            kind: 'concept',
            title: 'You decide how many decimals show',
            what: 'A bare `%f` prints six decimals, which is almost never what you want. Put a dot and a number in front of the `f` to choose. `%.2f` shows two decimals, `%.1f` shows one, and `%.0f` shows none. The number is **rounded**, not chopped, and the variable itself does not change.',
            why: 'Prices, grades and measurements all need a sensible number of decimals. It is also how you hide the tiny errors that computers make with decimals, like 0.1 plus 0.2.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Money, pi and rounding',
            how: 'Notice how each result is rounded to the number of places that we asked for.',
            code: j`
double price = 4.5;
double total = 3 * 4.99;
System.out.printf("Price: $%.2f%n", price);
System.out.printf("Total: $%.2f%n", total);
System.out.printf("Pi to 3 places: %.3f%n", Math.PI);
System.out.printf("Rounded to a whole number: %.0f%n", 2.5);`,
            notes: [
              { line: 3, text: '4.5 becomes 4.50, which is how prices look.' },
              { line: 4, text: 'The total is rounded to the nearest cent.' },
              { line: 5, text: 'Three decimals of pi: 3.142.' },
              { line: 6, text: 'No decimals at all. A trailing 5 rounds up, so 2.5 becomes 3.' },
            ],
          },
          {
            kind: 'tip',
            title: 'The rule for money',
            body: 'Any time you print an amount of money, use `%.2f`. Two decimals, every time, even when the cents are zero. You see 12.00, and not 12.',
          },
          {
            kind: 'mistake',
            title: 'Printing decimals with println',
            body: 'Computers store decimals in binary, so some sums are a tiny bit off. `println` shows every digit, and the result looks silly.',
            wrong: j`
double total = 0.1 + 0.2;
System.out.println("Total: " + total);`,
            right: j`
double total = 0.1 + 0.2;
System.out.printf("Total: %.2f%n", total);`,
          },
        ],
        questions: ['u5l2-01', 'u5l2-02', 'u5l2-03', 'u5l2-04', 'u5l2-05', 'u5l2-06', 'u5l2-07', 'u5l2-08', 'u5l2-09'],
        challenge: 'u5l2-10',
      },
      {
        id: 'u5-l3',
        unitId: 'u5',
        title: 'Width and Alignment',
        summary: 'Neat columns, receipts and tables.',
        topic: 'printf',
        teach: [
          {
            kind: 'concept',
            title: 'Giving each value its own column',
            what: 'A number between the percent sign and the letter sets a **width**. `%6d` means "use at least 6 characters", and shorter values are padded with spaces on the left. A minus sign flips that, so `%-10s` left-aligns text in a 10 character column. A `0` pads with zeros, like `%05d`, and a comma adds thousands separators, like `%,d`.',
            why: 'Receipts, scoreboards and tables only look right when everything lines up. With widths, each column takes the same amount of room on every row, and the output looks professional.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'A little receipt',
            how: 'Every row uses the same template, so the columns line up automatically.',
            code: j`
System.out.printf("%-10s%6s%n", "Item", "Price");
System.out.printf("%-10s%6.2f%n", "Coffee", 3.5);
System.out.printf("%-10s%6.2f%n", "Muffin", 2.25);
System.out.printf("%-10s%6.2f%n", "Total", 3.5 + 2.25);
System.out.printf("Seats sold: %,d%n", 1234567);
System.out.printf("Order #%05d%n", 42);`,
            notes: [
              { line: 1, text: 'The names are left-aligned in 10 columns, and the prices are right-aligned in 6.' },
              { line: 2, text: '%6.2f means width 6 with two decimals.' },
              { line: 5, text: 'The comma adds thousands separators.' },
              { line: 6, text: 'Padding with zeros: 00042.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Reading a placeholder from left to right',
            body: 'A full placeholder has a few optional parts, and they always come in the same order:',
            code: '%  -  0  ,  10  .2  f',
            bullets: [
              '`%` starts the placeholder.',
              'Flags come next: `-` for left-aligned, `0` for zero padding, `,` for thousands.',
              'The width is the minimum number of characters.',
              'A dot and a number is the number of decimals, and then the type letter finishes it.',
            ],
          },
          {
            kind: 'mistake',
            title: 'No widths, no columns',
            body: 'Without widths the values are printed one after the other, and the columns wobble all over the place.',
            wrong: j`
System.out.printf("%s %s%n", "Coffee", 3.5);
System.out.printf("%s %s%n", "Muffin", 2.25);`,
            right: j`
System.out.printf("%-8s%6.2f%n", "Coffee", 3.5);
System.out.printf("%-8s%6.2f%n", "Muffin", 2.25);`,
          },
        ],
        questions: ['u5l3-01', 'u5l3-02', 'u5l3-03', 'u5l3-04', 'u5l3-05', 'u5l3-06', 'u5l3-07', 'u5l3-08', 'u5l3-09'],
        challenge: 'u5l3-10',
      },
    ],
  },
}
