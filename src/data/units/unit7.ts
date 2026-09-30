import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  ...topic('printf', [
    // ---------------- Lesson 1: printf Basics ----------------
    {
      id: 'pf-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'printf-d',
      prompt: 'What does this program print?',
      code: j`System.out.printf("I have %d cats%n", 3);`,
      optionStyle: 'output',
      options: [
        { text: 'I have 3 cats' },
        { text: 'I have %d cats', feedback: '`%d` is a placeholder: it gets replaced by the value 3.' },
        { text: 'I have 3 cats%n', feedback: '`%n` isn\'t printed; it means "new line".' },
        { text: 'I have d cats' },
      ],
      answer: 0,
      explanation: '`%d` is replaced by the first value (3), and `%n` ends the line.',
    },
    {
      id: 'pf-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'printf-s',
      prompt: 'Which placeholder is used for a **String**?',
      optionStyle: 'code',
      options: [
        { text: '%s' },
        { text: '%d', feedback: '`%d` is for whole numbers (d = decimal integer).' },
        { text: '%c', feedback: '`%c` is for a single char.' },
        { text: '%f', feedback: '`%f` is for decimal numbers (doubles).' },
      ],
      answer: 0,
      explanation: '`%s` = String, `%d` = int, `%f` = double, `%c` = char.',
    },
    {
      id: 'pf-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'printf-newline',
      prompt: 'What does this program print?',
      code: j`
System.out.printf("%s is %d years old", "Byte", 2);
System.out.printf("!");`,
      optionStyle: 'output',
      options: [
        { text: 'Byte is 2 years old!' },
        { text: 'Byte is 2 years old\n!', feedback: 'printf never adds a new line by itself: there\'s no `%n` here.' },
        { text: '%s is %d years old!' },
        { text: 'Byte is 2 years old' },
      ],
      answer: 0,
      explanation: 'printf only prints exactly what the template says. Without `%n`, the "!" continues on the same line.',
    },
    {
      id: 'pf-04',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'printf-d',
      prompt: 'Choose the placeholder for the int `score`.',
      code: j`
int score = 950;
System.out.printf("Score: ___%n", score);`,
      blanks: [['%d']],
      bank: ['%d', '%f', '%c', '%b'],
      expectedOutput: 'Score: 950',
      explanation: '`%d` formats a whole number. (`%f` would crash here, because 950 is an int, not a double.)',
    },
    {
      id: 'pf-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'printf-mismatch',
      prompt: 'What is wrong with this code?',
      code: j`System.out.printf("Total: %d%n", 9.99);`,
      answer: 'runtime',
      feedback: {
        syntax: 'javac doesn\'t check format strings, so this compiles.',
        logic: 'It doesn\'t print a wrong value; it crashes.',
        none: '`%d` expects a whole number. What is 9.99?',
      },
      explanation: 'It compiles, but at runtime printf throws **IllegalFormatConversionException** (d != java.lang.Double). Use `%.2f` for doubles.',
    },
    {
      id: 'pf-06',
      type: 'type-output',
      difficulty: 2,
      concept: 'printf-s',
      prompt: 'Type exactly what this program prints (two lines).',
      code: j`
String item = "tea";
int cups = 2;
System.out.printf("%d cups of %s%n", cups, item);
System.out.printf("%s%s%n", item, "!");`,
      answer: '2 cups of tea\ntea!',
      explanation: 'Placeholders are filled in order: `%d` ← cups, `%s` ← item. The second line glues "tea" and "!" together.',
    },
    {
      id: 'pf-07',
      type: 'predict-output',
      difficulty: 2,
      concept: 'printf-s',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%s + %s%n", 1 + 2, "3" + 4);`,
      optionStyle: 'output',
      options: [
        { text: '3 + 34' },
        { text: '1 + 2 + 34', feedback: 'Each argument is evaluated first: `1 + 2` is 3.' },
        { text: '3 + 7', feedback: '"3" + 4 joins text: "34".' },
        { text: '12 + 34' },
      ],
      answer: 0,
      explanation: 'Arguments are computed before formatting: `1 + 2` → 3 and `"3" + 4` → "34". `%s` can print any value.',
    },
    {
      id: 'pf-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'printf-d',
      prompt: 'Predict the output, and think about WHY.',
      code: j`
int count = 0;

for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        count++;
    }
}

System.out.printf("Count: %d", count);`,
      answer: 'Count: 5',
      explanation: 'The loop checks 1 to 10 and counts the even numbers (2, 4, 6, 8 and 10). That makes five. `%d` is replaced by count.',
    },

    // ---------------- Lesson 2: Decimals with %f ----------------
    {
      id: 'f2-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'printf-f',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%.2f%n", 3.14159);`,
      optionStyle: 'output',
      options: [
        { text: '3.14' },
        { text: '3.14159', feedback: '`.2` limits the output to 2 decimal places.' },
        { text: '3.1', feedback: '`.2` means TWO digits after the point.' },
        { text: '3.15' },
      ],
      answer: 0,
      explanation: '`%.2f` prints exactly 2 decimals, rounding: 3.14159 → 3.14.',
    },
    {
      id: 'f2-02',
      type: 'predict-output',
      difficulty: 1,
      concept: 'printf-f',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%f%n", 2.5);`,
      optionStyle: 'output',
      options: [
        { text: '2.500000' },
        { text: '2.5', feedback: 'Plain `%f` always shows 6 decimal places.' },
        { text: '2.50' },
        { text: '3' },
      ],
      answer: 0,
      explanation: 'Without a precision, `%f` shows 6 decimal places: 2.500000.',
    },
    {
      id: 'f2-03',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'printf-f',
      prompt: 'Which statement prints `$7.50`?',
      optionStyle: 'code',
      options: [
        { text: 'System.out.printf("$%.2f", 7.5);' },
        { text: 'System.out.printf("$%d", 7.5);', feedback: '`%d` with a double crashes (IllegalFormatConversionException).' },
        { text: 'System.out.printf("$%.1f", 7.5);', feedback: 'That prints $7.5, with only one decimal.' },
        { text: 'System.out.printf("$%f", 7.5);', feedback: 'That prints $7.500000.' },
      ],
      answer: 0,
      explanation: '`%.2f` gives exactly two decimals, perfect for money.',
    },
    {
      id: 'f2-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'printf-f',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%.1f%n", 9.87);`,
      optionStyle: 'output',
      options: [
        { text: '9.9' },
        { text: '9.8', feedback: 'printf rounds (it doesn\'t chop): 9.87 is closer to 9.9.' },
        { text: '9.87' },
        { text: '10.0' },
      ],
      answer: 0,
      explanation: '`%.1f` rounds to one decimal place: 9.87 → 9.9.',
    },
    {
      id: 'f2-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'printf-mismatch',
      prompt: 'What is wrong with this code?',
      code: j`
double avg = 88.5;
System.out.printf("Average: %d%n", avg);`,
      answer: 'runtime',
      feedback: { syntax: 'It compiles: javac doesn\'t check printf templates.', logic: 'It crashes instead of printing.', none: 'Does `%d` match a double?' },
      highlightLines: [2],
      explanation: '`%d` needs a whole number, but avg is a double. printf throws IllegalFormatConversionException at runtime. Use `%.1f`.',
    },
    {
      id: 'f2-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'printf-f',
      prompt: 'Print the total with exactly 2 decimal places.',
      code: j`
double total = 12.3456;
System.out.printf("Total: ___%n", total);`,
      blanks: [['%.2f']],
      expectedOutput: 'Total: 12.35',
      explanation: '`%.2f` rounds to 2 decimals: 12.3456 → 12.35.',
    },
    {
      id: 'f2-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'printf-f',
      prompt: 'Type exactly what this program prints.',
      code: j`
double a = 10, b = 4;
System.out.printf("%.1f / %.1f = %.3f%n", a, b, a / b);`,
      answer: '10.0 / 4.0 = 2.500',
      explanation: 'Each value gets its own precision: 10.0, 4.0, and 2.5 shown with 3 decimals as 2.500.',
    },
    {
      id: 'f2-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'printf-f',
      prompt: 'Type exactly what this program prints (two lines).',
      code: j`
int items = 3;
double price = 2.99;
double total = items * price;
System.out.printf("%d x $%.2f = $%.2f%n", items, price, total);
System.out.printf("Tax: $%.2f%n", total * 0.1);`,
      answer: '3 x $2.99 = $8.97\nTax: $0.90',
      explanation: '3 × 2.99 = 8.97. Tax is 8.97 × 0.1 = 0.897, which `%.2f` rounds to 0.90.',
    },

    // ---------------- Lesson 3: %c, Width & Alignment ----------------
    {
      id: 'f3-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'printf-width',
      prompt: 'What does this program print?',
      code: j`System.out.printf("[%5d]%n", 42);`,
      optionStyle: 'output',
      options: [
        { text: '[   42]' },
        { text: '[42   ]', feedback: 'Without a `-` flag, the padding goes on the LEFT (right-aligned).' },
        { text: '[42]', feedback: 'The 5 is a minimum width, so spaces are added.' },
        { text: '[00042]', feedback: 'Zeros only appear with the `0` flag: `%05d`.' },
      ],
      answer: 0,
      explanation: '`%5d` makes the number at least 5 characters wide, padding with spaces on the left: "   42".',
    },
    {
      id: 'f3-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'printf-c',
      prompt: 'Which placeholder prints a single character (a `char`)?',
      optionStyle: 'code',
      options: [
        { text: '%c' },
        { text: '%s', feedback: '`%s` also works for a char, but `%c` is the char placeholder.' },
        { text: '%d' },
        { text: '%ch', feedback: 'There\'s no `%ch`, so Java would print `%c` followed by an "h".' },
      ],
      answer: 0,
      explanation: '`%c` is for characters: `printf("%c", \'A\')` prints A.',
    },
    {
      id: 'f3-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'printf-align',
      prompt: 'What does this program print?',
      code: j`System.out.printf("[%-6s]%n", "cat");`,
      optionStyle: 'output',
      options: [
        { text: '[cat   ]' },
        { text: '[   cat]', feedback: 'The `-` flag means LEFT-align, so the spaces go after.' },
        { text: '[cat]' },
        { text: '[-6cat]' },
      ],
      answer: 0,
      explanation: '`%-6s` left-aligns "cat" in a 6-character field: "cat" + 3 spaces.',
    },
    {
      id: 'f3-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'printf-flags',
      prompt: 'What does this program print?',
      code: j`System.out.printf("%05d%n", 42);`,
      optionStyle: 'output',
      options: [
        { text: '00042' },
        { text: '   42', feedback: 'The `0` flag pads with zeros instead of spaces.' },
        { text: '42000' },
        { text: '0.42' },
      ],
      answer: 0,
      explanation: 'The `0` flag pads the number with zeros up to the width of 5: 00042.',
    },
    {
      id: 'f3-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'printf-c',
      prompt: 'Type exactly what this program prints.',
      code: j`
char first = 'B';
String rest = "yte";
System.out.printf("%c%s has %d letters%n", first, rest, 1 + rest.length());`,
      answer: 'Byte has 4 letters',
      explanation: '`%c` ← \'B\', `%s` ← "yte", and `%d` ← 1 + 3 = 4.',
    },
    {
      id: 'f3-06',
      type: 'error-type',
      difficulty: 2,
      concept: 'printf-mismatch',
      prompt: 'What is wrong with this code?',
      code: j`System.out.printf("%s scored %d%n", 95, "Ada");`,
      answer: 'runtime',
      feedback: { syntax: 'It compiles fine.', logic: 'It doesn\'t get to print the wrong thing: it crashes.', none: 'Match each placeholder with its value, in order.' },
      explanation: 'The values are in the wrong order. `%s` accepts 95, but `%d` gets the String "Ada" and throws IllegalFormatConversionException.',
    },
    {
      id: 'f3-07',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'printf-width',
      prompt: 'Make the price 8 characters wide, right-aligned, with 2 decimals.',
      code: j`
double price = 3.5;
System.out.printf("[___]%n", price);`,
      blanks: [['%8.2f']],
      expectedOutput: '[    3.50]',
      explanation: '`%8.2f` = width 8, precision 2: "3.50" padded with 4 spaces on the left.',
    },
    {
      id: 'f3-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'printf-align',
      prompt: 'Print a mini receipt. Use `%-10s%6.2f%n` for each line: the two items, then `Total` with their sum.',
      starter: j`
String item1 = "Coffee";
double price1 = 3.5;
String item2 = "Muffin";
double price2 = 2.25;
// print three lines with printf("%-10s%6.2f%n", ...)
`,
      solution: j`
String item1 = "Coffee";
double price1 = 3.5;
String item2 = "Muffin";
double price2 = 2.25;
System.out.printf("%-10s%6.2f%n", item1, price1);
System.out.printf("%-10s%6.2f%n", item2, price2);
System.out.printf("%-10s%6.2f%n", "Total", price1 + price2);`,
      tests: [{ label: 'receipt', output: 'Coffee      3.50\nMuffin      2.25\nTotal       5.75' }],
      mustInclude: [{ pattern: 'printf', message: 'Use printf to line up the columns.' }],
      explanation: '`%-10s` left-aligns the name in 10 characters, and `%6.2f` right-aligns the price in 6, so the columns line up.',
    },
  ]),

  // ---------------- Unit 7 checkpoint ----------------
  ...topic('printf', [
    {
      id: 'cp7-01',
      type: 'type-output',
      difficulty: 3,
      concept: 'printf-width',
      prompt: 'Type exactly what this program prints.',
      code: j`
String name = "Ada";
double gpa = 3.856;
int rank = 2;
System.out.printf("%-5s|%4.1f|#%02d%n", name, gpa, rank);`,
      answer: 'Ada  | 3.9|#02',
      explanation: '`%-5s` → "Ada  ", `%4.1f` → " 3.9" (rounded, width 4), `%02d` → "02".',
    },
    {
      id: 'cp7-02',
      type: 'error-type',
      difficulty: 3,
      concept: 'printf-mismatch',
      prompt: 'What is wrong with this code?',
      code: j`
int apples = 5;
System.out.printf("Apples: %d, Pears: %d%n", apples);`,
      answer: 'runtime',
      feedback: { syntax: 'javac doesn\'t count placeholders, so it compiles.', logic: 'It crashes before finishing the line.', none: 'Count the placeholders and the values.' },
      explanation: 'Two `%d` placeholders but only one value. printf throws **MissingFormatArgumentException** at runtime.',
    },
    {
      id: 'cp7-03',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'printf-newline',
      prompt: 'What does `%n` do in a printf template?',
      options: [
        { text: 'Starts a new line' },
        { text: 'Prints the letter n', feedback: 'The `%` makes it special.' },
        { text: 'Inserts a number', feedback: 'Numbers use `%d` or `%f`.' },
        { text: 'Nothing (it\'s ignored)' },
      ],
      answer: 0,
      explanation: '`%n` is printf\'s line break (like pressing Enter). printf never adds one automatically.',
    },
    {
      id: 'cp7-04',
      type: 'predict-output',
      difficulty: 3,
      concept: 'printf-flags',
      prompt: 'What does this program print?',
      code: j`
double v = 1234567.891;
System.out.printf("%,.2f%n", v);`,
      optionStyle: 'output',
      options: [
        { text: '1,234,567.89' },
        { text: '1234567.89', feedback: 'The `,` flag adds thousands separators.' },
        { text: '1,234,567.891' },
        { text: '1.23E6' },
      ],
      answer: 0,
      explanation: 'The `,` flag groups thousands, and `.2` rounds to 2 decimals: 1,234,567.89.',
    },
    {
      id: 'cp7-05',
      type: 'write-code',
      difficulty: 3,
      concept: 'printf-width',
      prompt: 'Print a table of squares for n = 1 to `rows`, one line each, using `%2d squared = %3d%n`.',
      starter: j`
int rows = 3;
// loop and printf each line
`,
      solution: j`
int rows = 3;
for (int n = 1; n <= rows; n++) {
    System.out.printf("%2d squared = %3d%n", n, n * n);
}`,
      tests: [
        { label: 'rows = 3', output: ' 1 squared =   1\n 2 squared =   4\n 3 squared =   9' },
        { label: 'rows = 5', set: { rows: '5' }, output: ' 1 squared =   1\n 2 squared =   4\n 3 squared =   9\n 4 squared =  16\n 5 squared =  25' },
      ],
      mustInclude: [{ pattern: 'printf', message: 'Use printf with the widths from the instructions.' }],
      explanation: 'A for loop from 1 to rows, printing `n` in width 2 and `n * n` in width 3 so the columns line up.',
    },
    {
      id: 'cp7-06',
      type: 'fill-blank',
      difficulty: 3,
      concept: 'printf-f',
      prompt: 'Show the progress with one decimal, followed by a percent sign. (Hint: a real `%` sign is written `%%`.)',
      code: j`
double pct = 0.8567;
System.out.printf("Progress: ___%%%n", pct * 100);`,
      blanks: [['%.1f']],
      expectedOutput: 'Progress: 85.7%',
      explanation: '`%.1f` shows 85.67 as 85.7, and `%%` prints a literal percent sign.',
    },
  ]),
]

export const unit7: UnitContent = {
  questions,
  unit: {
    id: 'u7',
    number: 7,
    title: 'printf',
    tagline: 'Format output like a pro.',
    color: 'teal',
    icon: 'printer',
    topics: ['printf'],
    checkpoint: ['cp7-01', 'cp7-02', 'cp7-03', 'cp7-04', 'cp7-05', 'cp7-06'],
    lessons: [
      {
        id: 'u7-l1',
        unitId: 'u7',
        title: 'printf Basics',
        summary: 'Templates with %d, %s and %n.',
        topic: 'printf',
        teach: [
          {
            kind: 'concept',
            title: 'Formatted printing',
            what: '`System.out.printf` prints a **template** with placeholders. Each placeholder is replaced by the next value: `%d` for whole numbers, `%s` for Strings, and `%n` means new line.',
            why: 'Gluing many values together with `+` gets messy. printf keeps the text readable and gives you precise control over how values look.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'Filling in the blanks',
            how: 'Values after the template fill the placeholders in order, left to right.',
            code: j`
String name = "Ada";
int level = 7;
System.out.printf("%s reached level %d!%n", name, level);
System.out.printf("%d + %d = %d%n", 2, 3, 2 + 3);`,
            notes: [
              { line: 3, text: '%s ← name, %d ← level' },
              { line: 4, text: 'Arguments are computed first: 2 + 3 → 5' },
            ],
          },
          {
            kind: 'mistake',
            title: 'printf doesn\'t add a new line',
            body: 'Unlike println, printf prints exactly the template. Without `%n`, the next output continues on the same line.',
            wrong: j`
System.out.printf("Hello");
System.out.printf("World");`,
            right: j`
System.out.printf("Hello%n");
System.out.printf("World%n");`,
          },
        ],
        questions: ['pf-01', 'pf-02', 'pf-04', 'pf-03', 'pf-06', 'pf-05', 'pf-07'],
        challenge: 'pf-08',
      },
      {
        id: 'u7-l2',
        unitId: 'u7',
        title: 'Decimals with %f',
        summary: 'Control decimal places with precision.',
        topic: 'printf',
        teach: [
          {
            kind: 'concept',
            title: 'Controlling decimals',
            what: '`%f` prints a double. By default it shows 6 decimal places; `%.2f` shows exactly 2 (rounded). The number after the dot is the **precision**.',
            why: 'Money needs 2 decimals, science might need 3. Precision turns 4.5 into a clean $4.50.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'Precision in action',
            how: 'The value is rounded to the precision you ask for.',
            code: j`
double price = 4.5;
System.out.printf("%f%n", price);
System.out.printf("$%.2f%n", price);
System.out.printf("%.3f%n", Math.PI);
System.out.printf("%.0f%n", 2.7);`,
            notes: [
              { line: 2, text: 'default: 6 decimals → 4.500000' },
              { line: 3, text: 'money style → $4.50' },
              { line: 5, text: '0 decimals rounds to a whole number → 3' },
            ],
          },
          {
            kind: 'mistake',
            title: '%d for a double',
            body: 'Each placeholder expects a specific type. `%d` with a double compiles, but crashes when it runs.',
            wrong: j`System.out.printf("%d%n", 4.5);`,
            right: j`System.out.printf("%.1f%n", 4.5);`,
          },
        ],
        questions: ['f2-01', 'f2-02', 'f2-03', 'f2-04', 'f2-06', 'f2-05', 'f2-07'],
        challenge: 'f2-08',
      },
      {
        id: 'u7-l3',
        unitId: 'u7',
        title: 'Width & Alignment',
        summary: '%c, field widths and tidy tables.',
        topic: 'printf',
        teach: [
          {
            kind: 'concept',
            title: 'Lining things up',
            what: 'A number between `%` and the letter sets a minimum **width**: `%5d` pads to 5 characters. A minus sign left-aligns: `%-10s`. Combine width and precision: `%8.2f`. And `%c` prints a single char.',
            why: 'Receipts, scoreboards and tables look professional when the columns line up.',
            mood: 'happy',
          },
          {
            kind: 'example',
            title: 'A tidy table',
            how: 'Names are left-aligned in 8 characters; numbers right-aligned in 5.',
            code: j`
System.out.printf("%-8s|%5s%n", "Item", "Qty");
System.out.printf("%-8s|%5d%n", "Apples", 12);
System.out.printf("%-8s|%5d%n", "Kiwi", 3);
System.out.printf("Grade: %c%n", 'A');`,
            notes: [
              { line: 2, text: '%-8s → "Apples  "  |  %5d → "   12"' },
              { line: 4, text: '%c prints one character' },
            ],
          },
          {
            kind: 'tip',
            title: 'Anatomy of a placeholder',
            body: '`%[flags][width][.precision]type`, for example `%-10.2f`.',
            bullets: [
              '`-` left-align: `%-6s` → "cat   "',
              '`0` pad with zeros: `%05d` → 00042',
              '`,` thousands separator: `%,d` → 1,234,567',
              '`%%` prints a real percent sign',
            ],
          },
          {
            kind: 'mistake',
            title: 'Values in the wrong order',
            body: 'Values fill placeholders strictly in order. Swap them and a `%d` may receive a String and crash!',
            wrong: j`System.out.printf("%s scored %d%n", 95, "Ada");`,
            right: j`System.out.printf("%s scored %d%n", "Ada", 95);`,
          },
        ],
        questions: ['f3-01', 'f3-02', 'f3-03', 'f3-04', 'f3-05', 'f3-06', 'f3-07'],
        challenge: 'f3-08',
      },
    ],
  },
}
