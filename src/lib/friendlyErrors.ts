/**
 * Turns compiler messages and exceptions into beginner-friendly explanations.
 */
import type { RunResult } from '../java'

export interface Explanation {
  kind: 'compile' | 'runtime' | 'timeout' | 'unsupported'
  title: string
  body: string
}

const COMPILE: [RegExp, (m: RegExpMatchArray) => { title: string; body: string }][] = [
  [/';' expected/, () => ({ title: 'Missing semicolon', body: 'Every Java statement ends with `;`. Look at the end of this line (or the line just before it).' })],
  [/'\)' or ',' expected|'\)' expected/, () => ({ title: 'Missing parenthesis', body: 'Something opened with `(` was never closed. Count your parentheses, and also check for a `"` that ends too early.' })],
  [/'\(' expected/, () => ({ title: 'Missing parenthesis', body: '`if`, `while` and `for` need their condition in parentheses: `if (x > 5)`.' })],
  [/reached end of file while parsing/, () => ({ title: 'Missing closing brace', body: 'Java reached the end of the code while a `{` was still open. Every `{` needs a matching `}`.' })],
  [/cannot find symbol[\s\S]*symbol:\s+variable (\w+)/, (m) => ({ title: `Java doesn't know “${m[1]}”`, body: `Check the spelling and capital letters of \`${m[1]}\`, and make sure it was declared before this line. A variable declared inside { } only exists inside those braces.` })],
  [/cannot find symbol[\s\S]*symbol:\s+method (\w+)/, (m) => ({ title: `Unknown method “${m[1]}”`, body: 'Check the spelling and capital letters, and the arguments you pass. For example: `println`, not `printn` or `Println`.' })],
  [/cannot find symbol[\s\S]*symbol:\s+class (\w+)/, (m) => ({ title: `Unknown type “${m[1]}”`, body: m[1] === 'Scanner' || m[1].endsWith('Exception') ? `Add \`import java.util.${m[1]};\` at the top of your file.` : 'Type names are case-sensitive: `String` (capital S), `int`, `double`, `boolean`, `char`.' })],
  [/package (\w+) does not exist/, (m) => ({ title: `No such thing as “${m[1]}”`, body: m[1].toLowerCase() === 'system' ? 'Java is case-sensitive: it\'s `System.out.println` with a capital S.' : 'Check the spelling and capital letters.' })],
  [/variable (\w+) might not have been initialized/, (m) => ({ title: `“${m[1]}” has no value yet`, body: `\`${m[1]}\` was declared but not given a value on every path before it is used. Initialize it, e.g. \`int ${m[1]} = 0;\`.` })],
  [/possible lossy conversion from (\w+) to (\w+)/, (m) => ({ title: 'Value doesn\'t fit the type', body: `A ${m[1]} value can't be stored in a ${m[2]} without losing information. Use a ${m[1]} variable, or cast on purpose: \`(${m[2]}) value\`.` })],
  [/int cannot be converted to boolean/, () => ({ title: 'A condition must be true or false', body: 'Did you write `=` (assign) where you meant `==` (compare)? Conditions need a boolean.' })],
  [/(\S+) cannot be converted to (\w+)/, (m) => ({ title: 'Type mismatch', body: `A ${m[1]} can't be used where a ${m[2]} is needed. Check quotes: "text" is a String, 'c' is a char, 5 is an int.` })],
  [/cannot assign a value to final variable (\w+)/, (m) => ({ title: 'Constants can\'t change', body: `\`${m[1]}\` is final. If it needs to change, remove \`final\` or use a separate variable.` })],
  [/variable (\w+) is already defined/, (m) => ({ title: `“${m[1]}” already exists`, body: `You can only declare \`${m[1]}\` once in the same method. To change it, leave out the type: \`${m[1]} = …;\`.` })],
  [/not a statement/, () => ({ title: 'This line doesn\'t do anything', body: 'Java only allows statements that DO something: assignments, method calls or ++/--. Maybe you meant `x = x + 1;` or used a keyword as a name.' })],
  [/unreachable statement/, () => ({ title: 'Code that can never run', body: 'Java noticed this code can never be reached, for example after an infinite `while (true)` without `break`, or inside `while (false)`.' })],
  [/'else' without 'if'/, () => ({ title: 'An else without its if', body: 'Check the braces right before this `else`, and make sure there is no `;` right after the `if (...)`.' })],
  [/bad operand type/, () => ({ title: 'Operator can\'t be used here', body: 'This operator doesn\'t work with these types. Remember: `!` needs a boolean, math needs numbers, and ranges need two comparisons joined with `&&`.' })],
  [/incomparable types/, () => ({ title: 'Can\'t compare these', body: 'You can\'t compare a boolean with a number. Check what each side of `==` is.' })],
  [/unclosed string literal/, () => ({ title: 'Unclosed text', body: 'A String started with `"` but never ended. Add the closing `"`.' })],
  [/unclosed character literal/, () => ({ title: 'Quotes mix-up', body: 'Single quotes hold exactly ONE char, like `\'A\'`. Text needs double quotes: `"hello"`.' })],
  [/empty character literal/, () => ({ title: 'Empty char', body: '`\'\'` has no character inside. A char needs exactly one, like `\'x\'`.' })],
  [/integer number too large/, () => ({ title: 'Number too big for an int', body: 'ints go up to 2,147,483,647. For bigger numbers use a `long` with an L: `3000000000L`.' })],
  [/missing return statement/, () => ({ title: 'Missing return', body: 'A method that promises a value must `return` one on every path.' })],
  [/non-static/, () => ({ title: 'Static context', body: 'In `main`, you can only use `static` methods and variables. Add `static` to its declaration.' })],
  [/no main method/, () => ({ title: 'No main method', body: 'Java starts at `public static void main(String[] args)`. Add it to your class.' })],
  [/illegal start of expression|illegal start of type/, () => ({ title: 'Java got confused here', body: 'Something is out of place: a missing operand, an extra symbol, or a missing `}` before this line.' })],
  [/no suitable method found for println/, () => ({ title: 'println takes one value', body: 'Join values with `+` instead of commas: `System.out.println(a + " " + b);`' })],
]

const RUNTIME: Record<string, { title: string; body: string }> = {
  ArithmeticException: { title: 'Division by zero', body: 'An int was divided by 0 (or % 0). Java can\'t do that, so it throws an ArithmeticException. Check the divisor first, or catch the exception.' },
  InputMismatchException: { title: 'Unexpected input', body: 'nextInt() / nextDouble() found something that isn\'t a number. Check with hasNextInt() first, or catch InputMismatchException, and skip the bad input with next().' },
  NoSuchElementException: { title: 'No input left', body: 'The program tried to read input, but there was nothing left to read.' },
  StringIndexOutOfBoundsException: { title: 'Position doesn\'t exist', body: 'String positions go from 0 to length() - 1. This asked for one outside that range, often an off-by-one error (<= instead of <).' },
  NumberFormatException: { title: 'Not a number', body: 'That text can\'t be turned into a number, e.g. Integer.parseInt("12a").' },
  IllegalFormatConversionException: { title: 'printf placeholder mismatch', body: 'A placeholder doesn\'t match its value: %d needs a whole number, %f needs a decimal, %s takes anything, %c a char.' },
  MissingFormatArgumentException: { title: 'Not enough printf values', body: 'The template has more placeholders than values after it.' },
  UnknownFormatConversionException: { title: 'Unknown printf placeholder', body: 'printf only knows placeholders like %d, %f, %s, %c, %n and %%.' },
  IllegalFormatPrecisionException: { title: 'Precision not allowed here', body: 'Only decimals (%f) can have a precision like %.2f, not %d.' },
  MissingFormatWidthException: { title: 'Missing width', body: 'Flags like - or 0 need a width: %-10s or %05d.' },
  NullPointerException: { title: 'Nothing there (null)', body: 'A variable holds null (no object), and the program tried to use it.' },
  StackOverflowError: { title: 'Too many method calls', body: 'A method kept calling itself without stopping.' },
  IllegalStateException: { title: 'Scanner is closed', body: 'The Scanner was closed, so it can\'t read any more input.' },
  IllegalArgumentException: { title: 'Bad argument', body: 'A method received a value it can\'t work with.' },
}

export function explainRun(r: RunResult): Explanation | null {
  if (r.status === 'compile-error' && r.error) {
    for (const [re, fn] of COMPILE) {
      const m = r.error.message.match(re)
      if (m) return { kind: 'compile', ...fn(m) }
    }
    return { kind: 'compile', title: 'Java can\'t compile this', body: 'Read the message and check the highlighted line (and the one before it).' }
  }
  if (r.status === 'runtime-error' && r.error) {
    const info = RUNTIME[r.error.exception ?? ''] ?? { title: 'The program crashed', body: 'An exception was thrown while the program was running.' }
    return { kind: 'runtime', ...info }
  }
  if (r.status === 'timeout') {
    return {
      kind: 'timeout',
      title: 'Stuck in an infinite loop?',
      body: 'The program ran for a very long time without finishing. Check that your loop condition eventually becomes false (did you forget i++?), and that bad input is skipped with next().',
    }
  }
  if (r.status === 'unsupported') {
    return { kind: 'unsupported', title: 'Not supported in the sandbox (yet)', body: r.error?.message ?? 'This program uses a feature the sandbox doesn\'t support.' }
  }
  return null
}
