import { j, topic } from '../helpers'
import type { UnitContent } from '../types'

const questions = [
  ...topic('conditionals', [
    // ---------------- Lesson 1: if Statements ----------------
    {
      id: 'i-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'if',
      prompt: 'What does this program print?',
      code: j`
int x = 3;
if (x > 5) {
    System.out.println("big");
}
System.out.println("done");`,
      optionStyle: 'output',
      options: [
        { text: 'done' },
        { text: 'big\ndone', feedback: '3 > 5 is false, so the block inside the if is skipped.' },
        { text: 'big', feedback: 'The last line is outside the if, so it always runs.' },
        { text: '(nothing)', feedback: 'The last println is after the closing brace, so it runs no matter what.' },
      ],
      answer: 0,
      highlightLines: [2],
      explanation: '3 > 5 is false, so Java skips the if block. The final `println` is outside the braces and always runs.',
    },
    {
      id: 'i-02',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'if',
      prompt: 'What must go inside the parentheses of an `if` statement?',
      options: [
        { text: 'An expression that is true or false (a boolean)' },
        { text: 'Any number', feedback: 'Some languages treat 1 as true, but Java requires a real boolean.' },
        { text: 'A String', feedback: 'A String isn\'t true or false.' },
        { text: 'A variable declaration', feedback: 'Declarations can\'t go there: the if needs a condition to test.' },
      ],
      answer: 0,
      explanation: 'The condition must evaluate to a `boolean`, like `score > 50` or `isOpen`.',
    },
    {
      id: 'i-03',
      type: 'true-false',
      difficulty: 1,
      concept: 'if',
      prompt: 'Code after the closing brace `}` of an if block runs whether the condition was true or false.',
      answer: true,
      wrongFeedback: 'Only the code INSIDE the braces depends on the condition.',
      explanation: 'The braces mark what the `if` controls. Everything after `}` runs normally.',
    },
    {
      id: 'i-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'if',
      prompt: 'What does this program print?',
      code: j`
int score = 100;
if (score >= 100) {
    System.out.println("Perfect!");
}
if (score > 50) {
    System.out.println("Passed");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Perfect!\nPassed' },
        { text: 'Perfect!', feedback: 'These are two SEPARATE if statements, so both conditions get checked.' },
        { text: 'Passed' },
        { text: '(nothing)' },
      ],
      answer: 0,
      explanation: 'Two independent ifs: 100 >= 100 is true AND 100 > 50 is true, so both lines print.',
    },
    {
      id: 'i-05',
      type: 'find-bug',
      difficulty: 2,
      concept: 'semicolon-if',
      prompt: 'This prints "Low battery!" even at 80%. Tap the buggy line.',
      code: j`
int battery = 80;
if (battery < 20); {
    System.out.println("Low battery!");
}`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
int battery = 80;
if (battery < 20) {
    System.out.println("Low battery!");
}`,
      hint: 'Look very closely at the end of the if line.',
      explanation: 'The `;` right after `if (...)` IS the if\'s body (an empty statement). The block below then runs every time. Remove the semicolon.',
    },
    {
      id: 'i-06',
      type: 'fill-blank',
      difficulty: 1,
      concept: 'if',
      prompt: 'Complete the condition so "Game over" prints only when `lives` is 0.',
      code: j`
int lives = 0;
if (___) {
    System.out.println("Game over");
}`,
      blanks: [['lives == 0', '0 == lives', 'lives <= 0', 'lives < 1']],
      explanation: '`lives == 0` asks "is lives equal to 0?" Use `==` to compare, not `=`.',
    },
    {
      id: 'i-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'if',
      prompt: 'Type exactly what this program prints.',
      code: j`
int coins = 7;
if (coins % 2 == 1) {
    coins = coins + 1;
}
System.out.println(coins);`,
      answer: '8',
      explanation: '7 % 2 is 1 (7 is odd), so the condition is true and coins becomes 8.',
    },
    {
      id: 'i-08',
      type: 'type-output',
      difficulty: 3,
      concept: 'if',
      prompt: 'Type exactly what this program prints.',
      code: j`
int a = 4;
int b = 9;
if (a > b) {
    a = a + b;
}
if (b > a) {
    b = b - a;
}
if (a == b) {
    System.out.println("same");
}
System.out.println(a + " " + b);`,
      answer: '4 5',
      explanation: '4 > 9 is false (skip). 9 > 4 is true, so b = 9 - 4 = 5. 4 == 5 is false (skip). Output: `4 5`.',
    },

    // ---------------- Lesson 2: if / else & else if ----------------
    {
      id: 'e-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'else',
      prompt: 'What does this program print?',
      code: j`
int t = 15;
if (t > 20) {
    System.out.println("warm");
} else {
    System.out.println("cool");
}`,
      optionStyle: 'output',
      options: [
        { text: 'cool' },
        { text: 'warm', feedback: '15 > 20 is false, so the else branch runs.' },
        { text: 'warm\ncool', feedback: 'if/else always runs exactly ONE of the two branches.' },
        { text: '(nothing)' },
      ],
      answer: 0,
      explanation: 'The condition is false, so the `else` block runs instead.',
    },
    {
      id: 'e-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'else-if',
      prompt: 'In an if / else if / else chain, more than one branch can run.',
      answer: false,
      wrongFeedback: 'Java stops at the FIRST true condition and skips the rest of the chain.',
      explanation: 'A chain picks exactly one branch: the first whose condition is true (or the `else` if none are).',
    },
    {
      id: 'e-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'else-if',
      prompt: 'What does this program print?',
      code: j`
int score = 70;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 70) {
    System.out.println("C");
} else if (score >= 60) {
    System.out.println("D");
} else {
    System.out.println("F");
}`,
      optionStyle: 'output',
      options: [
        { text: 'C' },
        { text: 'C\nD', feedback: '70 >= 60 is also true, but the chain already chose a branch and skips the rest.' },
        { text: 'D' },
        { text: 'F' },
      ],
      answer: 0,
      explanation: '70 >= 90? No. 70 >= 70? Yes → print C and skip everything else in the chain.',
    },
    {
      id: 'e-04',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'else',
      prompt: 'When does the final `else` block of a chain run?',
      options: [
        { text: 'When every condition above it is false' },
        { text: 'Always, after the if block', feedback: 'else is an alternative, not an "afterwards".' },
        { text: 'When the first condition is true' },
        { text: 'Only when there is no else if', feedback: 'An else can end any chain.' },
      ],
      answer: 0,
      explanation: '`else` is the "none of the above" branch: it runs only if no condition in the chain was true.',
    },
    {
      id: 'e-05',
      type: 'find-bug',
      difficulty: 2,
      concept: 'else-if-order',
      prompt: 'At speed 130 this should print "Way too fast!", but it prints "Fast". Tap the condition that causes the problem.',
      code: j`
int speed = 130;
if (speed > 60) {
    System.out.println("Fast");
} else if (speed > 120) {
    System.out.println("Way too fast!");
}`,
      bugLines: [2, 4],
      bugKind: 'logic',
      fixedCode: j`
int speed = 130;
if (speed > 120) {
    System.out.println("Way too fast!");
} else if (speed > 60) {
    System.out.println("Fast");
}`,
      explanation: '130 > 60 is true, so the first branch wins and the chain stops. Check the most specific (biggest) condition FIRST.',
    },
    {
      id: 'e-06',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'else-if',
      prompt: 'Complete the chain so it prints "negative".',
      code: j`
int n = -4;
if (n > 0) {
    System.out.println("positive");
} ___ (n < 0) {
    System.out.println("negative");
} ___ {
    System.out.println("zero");
}`,
      blanks: [['else if'], ['else']],
      bank: ['else if', 'else', 'if', 'elif'],
      explanation: '`else if` adds another condition to the chain, and `else` catches everything left. (`elif` is Python, not Java!)',
    },
    {
      id: 'e-07',
      type: 'type-output',
      difficulty: 2,
      concept: 'else-if',
      prompt: 'Type exactly what this program prints.',
      code: j`
int hour = 14;
String greeting;
if (hour < 12) {
    greeting = "Good morning";
} else if (hour < 18) {
    greeting = "Good afternoon";
} else {
    greeting = "Good evening";
}
System.out.println(greeting);`,
      answer: 'Good afternoon',
      explanation: '14 < 12 is false; 14 < 18 is true → "Good afternoon". Every branch sets `greeting`, so Java knows it has a value.',
    },
    {
      id: 'e-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'else-if',
      prompt: 'Print `hot` if `temp` is above 30, `nice` if it is from 15 to 30, and `cold` otherwise. Use if / else if / else.',
      starter: j`
int temp = 22;
// your if / else if / else here
`,
      solution: j`
int temp = 22;
if (temp > 30) {
    System.out.println("hot");
} else if (temp >= 15) {
    System.out.println("nice");
} else {
    System.out.println("cold");
}`,
      tests: [
        { label: 'temp = 22', output: 'nice' },
        { label: 'temp = 35', set: { temp: '35' }, output: 'hot' },
        { label: 'temp = 30', set: { temp: '30' }, output: 'nice' },
        { label: 'temp = 15', set: { temp: '15' }, output: 'nice' },
        { label: 'temp = 5', set: { temp: '5' }, output: 'cold' },
      ],
      mustInclude: [{ pattern: 'else', message: 'Use else if / else so only one message prints.' }],
      explanation: 'Check the highest range first: `temp > 30`, then `temp >= 15`, and let `else` catch everything colder.',
    },

    // ---------------- Lesson 5: Common Conditional Mistakes ----------------
    {
      id: 'm-01',
      type: 'error-type',
      difficulty: 1,
      concept: 'assign-vs-equals',
      prompt: 'What is wrong with this code?',
      code: j`
int x = 5;
if (x = 5) {
    System.out.println("five");
}`,
      answer: 'syntax',
      feedback: {
        runtime: 'javac rejects it before it can run.',
        logic: 'In some languages this would be a logic bug, but Java refuses to compile it.',
        none: 'Is `x = 5` a question or a command?',
      },
      highlightLines: [2],
      explanation: '`x = 5` assigns; its value is an int, not a boolean. javac: *incompatible types: int cannot be converted to boolean*. Use `x == 5`.',
    },
    {
      id: 'm-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'braces',
      prompt: 'What does this program print?',
      code: j`
int lives = 3;
if (lives == 0)
    System.out.println("Game over");
    System.out.println("Try again?");`,
      optionStyle: 'output',
      options: [
        { text: 'Try again?' },
        { text: '(nothing)', feedback: 'Without braces, only the FIRST statement belongs to the if. The second one always runs.' },
        { text: 'Game over\nTry again?' },
        { text: 'Game over' },
      ],
      answer: 0,
      highlightLines: [3, 4],
      explanation: 'Without braces, an `if` controls only ONE statement. Indentation is just for humans: line 4 always runs. Always use braces!',
    },
    {
      id: 'm-03',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'string-equals',
      prompt: 'Which is the correct way to check if the String `cmd` holds "quit"?',
      optionStyle: 'code',
      options: [
        { text: 'cmd.equals("quit")' },
        { text: 'cmd == "quit"', feedback: '`==` checks if two Strings are the same OBJECT, not the same text. It can be false even when the text matches.' },
        { text: 'cmd = "quit"', feedback: 'That assigns a new value instead of comparing.' },
        { text: 'cmd.equals(quit)', feedback: 'Without quotes, `quit` would be a variable name.' },
      ],
      answer: 0,
      explanation: 'Always compare String contents with `.equals(...)`. `==` compares whether they are the very same object in memory.',
    },
    {
      id: 'm-04',
      type: 'find-bug',
      difficulty: 2,
      concept: 'semicolon-if',
      prompt: 'This prints "Adult" for a 10-year-old. Tap the buggy line.',
      code: j`
int age = 10;
if (age >= 18); {
    System.out.println("Adult");
}`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
int age = 10;
if (age >= 18) {
    System.out.println("Adult");
}`,
      explanation: 'The semicolon ends the if statement immediately, so the block below always runs. Delete the `;`.',
    },
    {
      id: 'm-05',
      type: 'error-type',
      difficulty: 2,
      concept: 'else',
      prompt: 'What is wrong with this code?',
      code: j`
int score = 85;
if (score > 90) {
    System.out.println("A");
} else {
    System.out.println("Not A");
} else {
    System.out.println("???");
}`,
      answer: 'syntax',
      feedback: { runtime: 'It never runs because javac rejects it.', logic: 'It doesn\'t compile, so there\'s no output to be wrong.', none: 'How many `else` blocks can one if have?' },
      highlightLines: [6],
      explanation: 'An if can have only ONE final `else`. The second one has no `if` to belong to: javac reports *\'else\' without \'if\'*.',
    },
    {
      id: 'm-06',
      type: 'true-false',
      difficulty: 2,
      concept: 'semicolon-if',
      prompt: '`if (x > 5);` (with a semicolon at the end) is a syntax error that Java refuses to compile.',
      answer: false,
      wrongFeedback: 'It actually compiles! That\'s what makes it dangerous.',
      explanation: 'It compiles: the `;` is an empty statement that becomes the if\'s body. The block after it always runs: a sneaky LOGIC error.',
    },
    {
      id: 'm-07',
      type: 'fix-code',
      difficulty: 3,
      concept: 'braces',
      prompt: 'Debugging challenge: fix the bugs so a score of 72 prints only `Pass`, and a score of 40 prints `Fail` then `Study more!`.',
      starter: j`
int score = 72;
if (score >= 60); {
    System.out.println("Pass");
}
if (score < 60)
    System.out.println("Fail");
    System.out.println("Study more!");`,
      solution: j`
int score = 72;
if (score >= 60) {
    System.out.println("Pass");
}
if (score < 60) {
    System.out.println("Fail");
    System.out.println("Study more!");
}`,
      tests: [
        { label: 'score = 72', output: 'Pass' },
        { label: 'score = 40', set: { score: '40' }, output: 'Fail\nStudy more!' },
      ],
      hint: 'There are two bugs: one character on line 2, and missing braces for the second if.',
      explanation: 'Remove the stray `;` after the first if, and wrap BOTH statements of the second if in braces.',
    },
    {
      id: 'm-08',
      type: 'predict-output',
      difficulty: 3,
      concept: 'string-equals',
      prompt: 'What does this program print?',
      code: j`
String a = "java";
String b = "ja";
String c = b + "va";
System.out.println(a.equals(c));
System.out.println(a == c);`,
      optionStyle: 'output',
      options: [
        { text: 'true\nfalse' },
        { text: 'true\ntrue', feedback: '`c` is built while the program runs, so it\'s a different String object. `==` compares objects; `.equals` compares text.' },
        { text: 'false\nfalse' },
        { text: 'false\ntrue' },
      ],
      answer: 0,
      explanation: 'The text matches, so `.equals` is true. But `c` is a new object created at runtime, so `a == c` (same object?) is false. Use `.equals` for Strings!',
    },
  ]),

  ...topic('nested-if', [
    // ---------------- Lesson 3: Nested if ----------------
    {
      id: 'n-01',
      type: 'predict-output',
      difficulty: 1,
      concept: 'nested',
      prompt: 'What does this program print?',
      code: j`
int x = 8;
if (x > 5) {
    if (x > 10) {
        System.out.println("A");
    } else {
        System.out.println("B");
    }
}`,
      optionStyle: 'output',
      options: [
        { text: 'B' },
        { text: 'A', feedback: '8 > 10 is false, so the inner else runs.' },
        { text: '(nothing)', feedback: 'The outer condition 8 > 5 is true, so we go inside.' },
        { text: 'A\nB' },
      ],
      answer: 0,
      explanation: 'Outer: 8 > 5 is true, so we enter. Inner: 8 > 10 is false, so its else prints **B**.',
    },
    {
      id: 'n-02',
      type: 'true-false',
      difficulty: 1,
      concept: 'nested',
      prompt: 'The inner if of a nested if is only checked when the outer condition is true.',
      answer: true,
      wrongFeedback: 'The inner if lives inside the outer block: if that block is skipped, so is everything in it.',
      explanation: 'The inner `if` is just a statement inside the outer block. If the outer condition is false, Java never reaches it.',
    },
    {
      id: 'n-03',
      type: 'predict-output',
      difficulty: 2,
      concept: 'nested',
      prompt: 'What does this program print?',
      code: j`
boolean raining = false;
boolean cold = true;
if (raining) {
    System.out.println("Umbrella");
} else {
    if (cold) {
        System.out.println("Jacket");
    } else {
        System.out.println("T-shirt");
    }
}`,
      optionStyle: 'output',
      options: [
        { text: 'Jacket' },
        { text: 'Umbrella', feedback: '`raining` is false, so we go to the outer else.' },
        { text: 'T-shirt', feedback: '`cold` is true, so the inner if runs.' },
        { text: 'Umbrella\nJacket' },
      ],
      answer: 0,
      explanation: 'Not raining → outer else. Cold is true → "Jacket".',
    },
    {
      id: 'n-04',
      type: 'multiple-choice',
      difficulty: 2,
      concept: 'nested-vs-and',
      prompt: 'Which single `if` does the same job as this nested if?',
      code: j`
if (a > 0) {
    if (b > 0) {
        System.out.println("both");
    }
}`,
      optionStyle: 'code',
      options: [
        { text: 'if (a > 0 && b > 0)' },
        { text: 'if (a > 0 || b > 0)', feedback: '`||` would print even when only ONE of them is positive.' },
        { text: 'if (a > 0 && b)', feedback: '`b` is a number, not a boolean, so this doesn\'t compile.' },
        { text: 'if (!(a > 0) && b > 0)', feedback: '`!` flips the first condition: the opposite of what we want.' },
      ],
      answer: 0,
      explanation: 'The message prints only when BOTH conditions are true: that\'s exactly `&&`.',
    },
    {
      id: 'n-05',
      type: 'type-output',
      difficulty: 2,
      concept: 'nested',
      prompt: 'Type exactly what this program prints.',
      code: j`
int age = 16;
boolean hasPermit = false;
if (age >= 16) {
    if (hasPermit) {
        System.out.println("Drive!");
    } else {
        System.out.println("Get a permit");
    }
} else {
    System.out.println("Too young");
}`,
      answer: 'Get a permit',
      explanation: '16 >= 16 is true, so we go inside. `hasPermit` is false, so the inner else prints "Get a permit".',
    },
    {
      id: 'n-06',
      type: 'predict-output',
      difficulty: 3,
      concept: 'dangling-else',
      prompt: 'Careful! What does this program print?',
      code: j`
int x = 5;
if (x > 10)
    if (x > 20)
        System.out.println("huge");
else
    System.out.println("small");
System.out.println("end");`,
      optionStyle: 'output',
      options: [
        { text: 'end' },
        { text: 'small\nend', feedback: 'The else belongs to the NEAREST if (`x > 20`), not to `x > 10`. Indentation doesn\'t matter to Java!' },
        { text: 'huge\nend' },
        { text: 'small' },
      ],
      answer: 0,
      highlightLines: [3, 5],
      explanation: 'Without braces, `else` pairs with the nearest `if` (x > 20). The outer `if (x > 10)` is false, so the whole thing is skipped. Only "end" prints. Use braces!',
    },
    {
      id: 'n-07',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'nested',
      prompt: 'On school nights, print "Homework time" before 9 pm (hour 21) and "Bedtime" after.',
      code: j`
int hour = 20;
boolean weekend = false;
if (weekend) {
    System.out.println("Sleep in");
} else {
    if (hour ___ 21) {
        System.out.println("Homework time");
    } else {
        System.out.println("Bedtime");
    }
}`,
      blanks: [['<']],
      bank: ['<', '>', '>=', '=='],
      expectedOutput: 'Homework time',
      explanation: '"Before 21" means hour < 21. At hour 20, that\'s true → "Homework time".',
    },
    {
      id: 'n-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'nested',
      prompt: 'Movie tickets: kids under 12 pay `5`. Everyone else pays `8` if they\'re a student, otherwise `12`. Print the price. Use an if / else with a **nested** if inside the else.',
      starter: j`
int age = 15;
boolean isStudent = true;
// print 5, 8 or 12
`,
      solution: j`
int age = 15;
boolean isStudent = true;
if (age < 12) {
    System.out.println(5);
} else {
    if (isStudent) {
        System.out.println(8);
    } else {
        System.out.println(12);
    }
}`,
      tests: [
        { label: 'age 15, student', output: '8' },
        { label: 'age 8', set: { age: '8' }, output: '5' },
        { label: 'age 30, not a student', set: { age: '30', isStudent: 'false' }, output: '12' },
        { label: 'age 11, not a student', set: { age: '11', isStudent: 'false' }, output: '5' },
      ],
      mustInclude: [{ pattern: 'if[\\s\\S]*else[\\s\\S]*if', message: 'Put a nested if inside the else block.' }],
      explanation: 'The outer if handles kids. Only for everyone else does the inner if check whether they\'re a student.',
    },

    // ---------------- Lesson 4: Combining Conditions ----------------
    {
      id: 'cc-01',
      type: 'multiple-choice',
      difficulty: 1,
      concept: 'range',
      prompt: 'Which condition is true only when `x` is between 1 and 10 (inclusive)?',
      optionStyle: 'code',
      options: [
        { text: 'x >= 1 && x <= 10' },
        { text: 'x >= 1 || x <= 10', feedback: 'With `||`, EVERY number passes (any number is >= 1 or <= 10).' },
        { text: '1 <= x <= 10', feedback: 'Java can\'t chain comparisons, so this doesn\'t compile.' },
        { text: 'x > 1 && x < 10', feedback: 'This leaves out the edges 1 and 10.' },
      ],
      answer: 0,
      explanation: 'Inside a range: bigger than the low end **AND** smaller than the high end. Use `>=`/`<=` to include the edges.',
    },
    {
      id: 'cc-02',
      type: 'predict-output',
      difficulty: 2,
      concept: 'range',
      prompt: 'What does this program print?',
      code: j`
int age = 40;
if (age >= 13 || age <= 19) {
    System.out.println("Teenager!");
} else {
    System.out.println("Not a teen");
}`,
      optionStyle: 'output',
      options: [
        { text: 'Teenager!' },
        { text: 'Not a teen', feedback: '`age >= 13` is true, and with `||` one true side is enough.' },
        { text: 'Teenager!\nNot a teen' },
        { text: 'Compile error' },
      ],
      answer: 0,
      highlightLines: [2],
      explanation: '40 >= 13 is true, so `||` makes the whole condition true. The range check should use `&&`.',
    },
    {
      id: 'cc-03',
      type: 'true-false',
      difficulty: 2,
      concept: 'de-morgan',
      prompt: '`!(a && b)` means the same thing as `!a || !b`.',
      answer: true,
      wrongFeedback: '"Not both" is the same as "at least one is not".',
      explanation: 'This is De Morgan\'s law: "not (A and B)" = "(not A) or (not B)". Flipping `&&` gives `||`.',
    },
    {
      id: 'cc-04',
      type: 'predict-output',
      difficulty: 2,
      concept: 'combined',
      prompt: 'What does this program print?',
      code: j`
int x = 15;
if (x % 3 == 0 && x % 5 == 0) {
    System.out.println("FizzBuzz");
} else if (x % 3 == 0) {
    System.out.println("Fizz");
} else if (x % 5 == 0) {
    System.out.println("Buzz");
} else {
    System.out.println(x);
}`,
      optionStyle: 'output',
      options: [
        { text: 'FizzBuzz' },
        { text: 'Fizz', feedback: 'The first condition (divisible by both) is checked first, and it\'s true.' },
        { text: 'Fizz\nBuzz' },
        { text: '15' },
      ],
      answer: 0,
      explanation: '15 is divisible by both 3 and 5, so the first condition is true and "FizzBuzz" prints.',
    },
    {
      id: 'cc-05',
      type: 'fill-blank',
      difficulty: 2,
      concept: 'combined',
      prompt: 'The ride allows people at least 120 cm tall who are **not** afraid of heights.',
      code: j`
int height = 130;
boolean afraid = false;
if (height >= 120 ___ ___afraid) {
    System.out.println("Enjoy the ride!");
}`,
      blanks: [['&&'], ['!']],
      bank: ['&&', '||', '!', '=='],
      explanation: 'Both requirements must hold (`&&`), and "not afraid" is `!afraid`.',
    },
    {
      id: 'cc-06',
      type: 'type-output',
      difficulty: 3,
      concept: 'combined',
      prompt: 'Type exactly what this program prints.',
      code: j`
int a = 5, b = 10, c = 15;
if (a < b && b < c) {
    System.out.println("ascending");
}
if (!(a > b) || c < a) {
    System.out.println("check 2");
}
if (a + b == c && c % a != 0) {
    System.out.println("check 3");
}`,
      answer: 'ascending\ncheck 2',
      explanation: '5 < 10 && 10 < 15 → true. `!(5 > 10)` is true, so `||` is true. 5 + 10 == 15 is true, but 15 % 5 is 0, so `c % a != 0` is false → no "check 3".',
    },
    {
      id: 'cc-07',
      type: 'find-bug',
      difficulty: 2,
      concept: 'range',
      prompt: 'This should print "Comfortable" only for temperatures from 1 to 39, but it prints it for 50 too. Tap the buggy line.',
      code: j`
int temp = 50;
if (temp > 0 || temp < 40) {
    System.out.println("Comfortable");
}`,
      bugLines: [2],
      bugKind: 'logic',
      fixedCode: j`
int temp = 50;
if (temp > 0 && temp < 40) {
    System.out.println("Comfortable");
}`,
      explanation: 'With `||`, every temperature passes (50 > 0 is true). A range needs both conditions: `&&`.',
    },
    {
      id: 'cc-08',
      type: 'write-code',
      difficulty: 3,
      concept: 'combined',
      prompt: 'Print `true` if `year` is a leap year, otherwise `false`. Leap years are divisible by 4 and not by 100, or divisible by 400.',
      starter: j`
int year = 2024;
// print true or false
`,
      solution: j`
int year = 2024;
System.out.println((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);`,
      tests: [
        { label: '2024', output: 'true' },
        { label: '1900', set: { year: '1900' }, output: 'false' },
        { label: '2000', set: { year: '2000' }, output: 'true' },
        { label: '2023', set: { year: '2023' }, output: 'false' },
      ],
      explanation: '`(year % 4 == 0 && year % 100 != 0) || year % 400 == 0`. 1900 is divisible by 100 but not 400, so it is NOT a leap year.',
    },
  ]),

  // ---------------- Unit 3 checkpoint ----------------
  ...topic('conditionals', [
    {
      id: 'cp3-01',
      type: 'type-output',
      topic: 'nested-if',
      difficulty: 3,
      concept: 'nested',
      prompt: 'Type exactly what this program prints.',
      code: j`
int x = 12;
if (x % 2 == 0) {
    if (x % 3 == 0) {
        System.out.println("div by 6");
    } else {
        System.out.println("even");
    }
} else if (x > 10) {
    System.out.println("big odd");
} else {
    System.out.println("small odd");
}`,
      answer: 'div by 6',
      explanation: '12 is even, so we go inside. 12 % 3 == 0 is true → "div by 6".',
    },
    {
      id: 'cp3-02',
      type: 'predict-output',
      difficulty: 3,
      concept: 'combined',
      prompt: 'What does this program print?',
      code: j`
int a = 3, b = 7;
if (a > b || a * 3 > b) {
    a = a + b;
} else {
    b = b - a;
}
System.out.println(a + "," + b);`,
      optionStyle: 'output',
      options: [
        { text: '10,7' },
        { text: '3,4', feedback: '`a > b` is false, but `a * 3 > b` is 9 > 7, which is true.' },
        { text: '10,4' },
        { text: '3,7' },
      ],
      answer: 0,
      explanation: '3 > 7 is false, but 9 > 7 is true, so `||` is true and `a` becomes 10. `b` is unchanged.',
    },
    {
      id: 'cp3-03',
      type: 'find-bug',
      difficulty: 3,
      concept: 'assign-vs-equals',
      prompt: 'This program won\'t compile. Tap the buggy line.',
      code: j`
int n = 7;
String kind = "";
if (n % 2 = 0) {
    kind = "even";
} else {
    kind = "odd";
}
System.out.println(kind);`,
      bugLines: [3],
      bugKind: 'syntax',
      fixedCode: j`
int n = 7;
String kind = "";
if (n % 2 == 0) {
    kind = "even";
} else {
    kind = "odd";
}
System.out.println(kind);`,
      explanation: '`n % 2 = 0` tries to ASSIGN 0 to a calculation, which is impossible. Comparisons use `==`.',
    },
    {
      id: 'cp3-04',
      type: 'error-type',
      difficulty: 2,
      concept: 'string-equals',
      prompt: 'What is wrong with this code?',
      code: j`
String pw = "abc";
if (pw.equals("abc")) {
    System.out.println("Welcome");
}`,
      answer: 'none',
      feedback: {
        syntax: 'Every line is valid Java.',
        runtime: 'Nothing here can crash.',
        logic: '`.equals` is exactly the right way to compare Strings.',
      },
      explanation: 'Nothing! `.equals` correctly compares the text, so this prints "Welcome".',
    },
    {
      id: 'cp3-05',
      type: 'write-code',
      topic: 'nested-if',
      difficulty: 3,
      concept: 'nested',
      prompt: 'Shipping: orders of 50 or more ship free (`0`). Otherwise members pay `2` and everyone else pays `5`. Print the shipping cost.',
      starter: j`
double total = 42.5;
boolean member = true;
// print 0, 2 or 5
`,
      solution: j`
double total = 42.5;
boolean member = true;
if (total >= 50) {
    System.out.println(0);
} else if (member) {
    System.out.println(2);
} else {
    System.out.println(5);
}`,
      tests: [
        { label: '$42.50, member', output: '2' },
        { label: '$60, not a member', set: { total: '60', member: 'false' }, output: '0' },
        { label: '$42.50, not a member', set: { member: 'false' }, output: '5' },
        { label: '$50 exactly', set: { total: '50', member: 'false' }, output: '0' },
      ],
      explanation: 'Check the free-shipping rule first. Only if it fails do we look at membership.',
    },
    {
      id: 'cp3-06',
      type: 'arrange',
      difficulty: 3,
      concept: 'else-if',
      prompt: 'Arrange the lines so a score of 85 prints `B`.',
      given: 'int score = 85;',
      lines: [
        'if (score >= 90) {',
        'System.out.println("A");',
        '} else if (score >= 80) {',
        'System.out.println("B");',
        '} else {',
        'System.out.println("C");',
        '}',
      ],
      expectedOutput: 'B',
      explanation: 'Start with the highest grade, then `else if` for the next range, and `else` for everything below.',
    },
  ]),
]

export const unit3: UnitContent = {
  questions,
  unit: {
    id: 'u3',
    number: 3,
    title: 'Conditional Statements',
    tagline: 'Teach your programs to make decisions.',
    color: 'grape',
    icon: 'git-branch',
    topics: ['conditionals', 'nested-if'],
    checkpoint: ['cp3-01', 'cp3-02', 'cp3-03', 'cp3-04', 'cp3-05', 'cp3-06'],
    lessons: [
      {
        id: 'u3-l1',
        unitId: 'u3',
        title: 'if Statements',
        summary: 'Run code only when a condition is true.',
        topic: 'conditionals',
        teach: [
          {
            kind: 'concept',
            title: 'Making decisions',
            what: 'An `if` statement runs a block of code **only when its condition is true**. The condition goes in parentheses; the block goes in braces.',
            why: 'Without `if`, a program does exactly the same thing every time. With it, programs can react: show a warning, award a badge, end the game.',
            mood: 'excited',
          },
          {
            kind: 'example',
            title: 'A simple if',
            how: 'Java checks the condition. True → run the block. False → skip it. Either way, it continues after the `}`.',
            code: j`
int temperature = 32;
if (temperature > 30) {
    System.out.println("It's hot! Drink water.");
}
System.out.println("Have a nice day.");`,
            notes: [
              { line: 2, text: 'The condition must be true or false.' },
              { line: 3, text: 'Only runs when the condition is true.' },
              { line: 5, text: 'Outside the braces, so it always runs.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'The sneaky semicolon',
            body: 'A `;` right after `if (...)` ends the if statement. The block below then runs **every time**, and Java won\'t warn you.',
            wrong: j`
int t = 10;
if (t > 30); {
    System.out.println("Hot!");
}`,
            right: j`
int t = 10;
if (t > 30) {
    System.out.println("Hot!");
}`,
          },
        ],
        questions: ['i-01', 'i-02', 'i-03', 'i-06', 'i-04', 'i-07', 'i-05'],
        challenge: 'i-08',
      },
      {
        id: 'u3-l2',
        unitId: 'u3',
        title: 'else & else if',
        summary: 'Choose exactly one path from many.',
        topic: 'conditionals',
        teach: [
          {
            kind: 'concept',
            title: 'Two paths (or more)',
            what: '`else` runs when the if condition is false. `else if` adds more conditions, checked in order: Java runs **only the first** branch whose condition is true.',
            why: 'Many decisions have several outcomes: a grade can be A, B or C. An else-if chain picks exactly one.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'A grade chain',
            how: 'Java tests each condition from the top and stops at the first true one.',
            code: j`
int score = 83;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("Keep practicing!");
}`,
            notes: [
              { line: 2, text: '83 >= 90? No, so move on.' },
              { line: 4, text: '83 >= 80? Yes → print B and skip the rest.' },
              { line: 8, text: 'else = none of the above.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'Conditions in the wrong order',
            body: 'Put the most specific (highest) condition first. Otherwise a broader condition earlier in the chain steals the match.',
            wrong: j`
int score = 95;
if (score >= 70) {
    System.out.println("C");
} else if (score >= 90) {
    System.out.println("A");
}`,
            right: j`
int score = 95;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 70) {
    System.out.println("C");
}`,
          },
        ],
        questions: ['e-01', 'e-02', 'e-04', 'e-03', 'e-06', 'e-07', 'e-05'],
        challenge: 'e-08',
      },
      {
        id: 'u3-l3',
        unitId: 'u3',
        title: 'Nested if',
        summary: 'Decisions inside decisions.',
        topic: 'nested-if',
        teach: [
          {
            kind: 'concept',
            title: 'Decisions inside decisions',
            what: 'A **nested if** is an if statement inside another if (or else) block. The inner check only happens when the outer block runs.',
            why: 'Some questions only make sense after another answer: only check the discount if the customer is a member; only check the password if the username exists.',
            mood: 'thinking',
          },
          {
            kind: 'example',
            title: 'Member discounts',
            how: 'Follow the braces: the inner if/else is completely inside the outer if block.',
            code: j`
boolean member = true;
int total = 60;
if (member) {
    if (total >= 50) {
        System.out.println("20% off!");
    } else {
        System.out.println("5% off");
    }
} else {
    System.out.println("Join to save!");
}`,
            notes: [
              { line: 3, text: 'Outer decision: is this a member?' },
              { line: 4, text: 'Inner decision, only reached by members.' },
              { line: 9, text: 'This else pairs with the OUTER if.' },
            ],
          },
          {
            kind: 'mistake',
            title: 'Which if owns this else?',
            body: 'Without braces, an `else` belongs to the NEAREST `if`, no matter how you indent it. Always use braces with nested ifs.',
            wrong: j`
int x = 5;
if (x > 10)
    if (x > 20)
        System.out.println("huge");
else
    System.out.println("small");`,
            right: j`
int x = 5;
if (x > 10) {
    if (x > 20) {
        System.out.println("huge");
    }
} else {
    System.out.println("small");
}`,
          },
        ],
        questions: ['n-01', 'n-02', 'n-03', 'n-05', 'n-04', 'n-07', 'n-06'],
        challenge: 'n-08',
      },
      {
        id: 'u3-l4',
        unitId: 'u3',
        title: 'Combining Conditions',
        summary: 'Complex logic with &&, || and !.',
        topic: 'nested-if',
        teach: [
          {
            kind: 'concept',
            title: 'Nested if or &&?',
            what: 'Nested ifs can often be flattened with `&&`, and alternatives joined with `||`. Complex conditions mix comparisons with `&&`, `||` and `!`. Use parentheses to make the grouping clear.',
            why: 'Flat conditions are easier to read. Nesting is still useful when each level needs its own `else`.',
            mood: 'encouraging',
          },
          {
            kind: 'example',
            title: 'One condition, several rules',
            how: 'Parentheses group the "16 or older with a parent" rule into one piece.',
            code: j`
int age = 17;
boolean hasID = true;
boolean withParent = false;
if (age >= 18 || (age >= 16 && withParent)) {
    System.out.println("Can watch");
} else if (hasID) {
    System.out.println("ID checked: too young");
}`,
            notes: [
              { line: 4, text: 'false || (true && false) → false' },
              { line: 6, text: 'Next branch: hasID is true.' },
            ],
          },
          {
            kind: 'tip',
            title: 'Range checks',
            body: 'Two patterns cover most range questions:',
            bullets: [
              'Inside a range: `x >= low && x <= high`',
              'Outside a range: `x < low || x > high`',
              'Flip a condition with De Morgan: `!(a && b)` is `!a || !b`',
            ],
          },
          {
            kind: 'mistake',
            title: 'Using || for a range',
            body: 'A range needs BOTH ends to hold. With `||`, every number passes.',
            wrong: j`
int age = 40;
if (age >= 13 || age <= 19) {
    System.out.println("Teenager!");
}`,
            right: j`
int age = 40;
if (age >= 13 && age <= 19) {
    System.out.println("Teenager!");
}`,
          },
        ],
        questions: ['cc-01', 'cc-03', 'cc-02', 'cc-04', 'cc-05', 'cc-07', 'cc-06'],
        challenge: 'cc-08',
      },
      {
        id: 'u3-l5',
        unitId: 'u3',
        title: 'Conditional Mistakes',
        summary: 'Spot the classic bugs before they bite.',
        topic: 'conditionals',
        teach: [
          {
            kind: 'concept',
            title: 'The usual suspects',
            what: 'A handful of mistakes cause most conditional bugs: `=` instead of `==`, a stray `;` after `if`, missing braces, comparing Strings with `==`, and conditions in the wrong order.',
            why: 'Knowing the usual suspects turns hours of confusion into seconds of "aha!".',
            mood: 'surprised',
          },
          {
            kind: 'example',
            title: 'Comparing Strings the right way',
            how: 'Use `.equals(...)` to compare the text inside two Strings.',
            code: j`
String answer = "yes";
if (answer.equals("yes")) {
    System.out.println("Great!");
}`,
            notes: [{ line: 2, text: '.equals compares the characters, not the objects.' }],
          },
          {
            kind: 'mistake',
            title: 'Missing braces',
            body: 'Without braces, an `if` controls only the very next statement. Indentation doesn\'t change that.',
            wrong: j`
int lives = 3;
if (lives == 0)
    System.out.println("Game over");
    System.out.println("Try again?");`,
            right: j`
int lives = 3;
if (lives == 0) {
    System.out.println("Game over");
    System.out.println("Try again?");
}`,
          },
        ],
        questions: ['m-01', 'm-03', 'm-02', 'm-04', 'm-06', 'm-05', 'm-07'],
        challenge: 'm-08',
      },
    ],
  },
}
