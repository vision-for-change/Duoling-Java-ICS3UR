/**
 * Turns compiler messages and exceptions into plain, friendly explanations.
 */
import type { RunResult } from '../java'

export interface Explanation {
  kind: 'compile' | 'runtime' | 'timeout' | 'unsupported'
  title: string
  body: string
}

const COMPILE: [RegExp, (m: RegExpMatchArray) => { title: string; body: string }][] = [
  [/';' expected/, () => ({ title: 'Missing semicolon', body: 'Every Java statement ends with a semicolon. Look at the end of this line, and at the line just above it.' })],
  [/':' expected/, () => ({ title: 'Missing colon', body: 'A `case` label ends with a colon, like `case 2:`. So does `default:`.' })],
  [/'\)' or ',' expected|'\)' expected/, () => ({ title: 'Missing bracket', body: 'Something that opened with `(` never got closed. Count your brackets, and check for a `"` that ends too early.' })],
  [/'\(' expected/, () => ({ title: 'Missing bracket', body: '`if`, `while`, `for` and `switch` need what they look at inside round brackets, like `if (x > 5)`.' })],
  [/reached end of file while parsing/, () => ({ title: 'Missing closing brace', body: 'Java reached the end of your code while a `{` was still open. Every `{` needs its own `}`.' })],
  [/cannot find symbol[\s\S]*symbol:\s+variable (\w+)/, (m) => ({ title: `Java doesn't know “${m[1]}”`, body: `Check the spelling and the capital letters of \`${m[1]}\`, and make sure it was created above this line. A variable made inside { } only exists inside those braces.` })],
  [/cannot find symbol[\s\S]*symbol:\s+method (\w+)/, (m) => ({ title: `Unknown method “${m[1]}”`, body: 'Check the spelling and capital letters, and what you put in the brackets. For example, it is `println`, not `printn` or `Println`.' })],
  [/cannot find symbol[\s\S]*symbol:\s+class (\w+)/, (m) => ({ title: `Unknown type “${m[1]}”`, body: m[1] === 'Scanner' || m[1].endsWith('Exception') ? `Add \`import java.util.${m[1]};\` at the top of your file.` : 'Type names are case sensitive: `String` has a capital S, and `int`, `double`, `boolean` and `char` are all lowercase.' })],
  [/package (\w+) does not exist/, (m) => ({ title: `No such thing as “${m[1]}”`, body: m[1].toLowerCase() === 'system' ? 'Java is case sensitive. It is `System.out.println`, with a capital S.' : 'Check the spelling and the capital letters.' })],
  [/variable (\w+) might not have been initialized/, (m) => ({ title: `“${m[1]}” has no value yet`, body: `\`${m[1]}\` was created, but it does not always have a value by the time you use it. Give it one when you create it, like \`int ${m[1]} = 0;\`.` })],
  [/possible lossy conversion from (\w+) to (\w+)/, (m) => ({ title: 'The value does not fit', body: `A ${m[1]} value cannot be stored in a ${m[2]} without losing something. Use a ${m[1]} variable instead, or cast on purpose: \`(${m[2]}) value\`.` })],
  [/int cannot be converted to boolean/, () => ({ title: 'A condition must be true or false', body: 'Did you write `=` (store a value) where you meant `==` (compare two values)? A condition has to work out to true or false.' })],
  [/(\S+) cannot be converted to (\w+)/, (m) => ({ title: 'The types do not match', body: `A ${m[1]} cannot be used where a ${m[2]} is needed. Check your quotes: "text" is a String, 'c' is a char, and 5 is an int.` })],
  [/cannot assign a value to final variable (\w+)/, (m) => ({ title: 'Constants cannot change', body: `\`${m[1]}\` is final, so it can never change. If it needs to change, take away \`final\` or use a different variable.` })],
  [/variable (\w+) is already defined/, (m) => ({ title: `“${m[1]}” already exists`, body: `You can only create \`${m[1]}\` once. To change its value later, leave out the type: \`${m[1]} = ...;\`.` })],
  [/not a statement/, () => ({ title: 'This line does not do anything', body: 'Java only accepts lines that actually do something, like an assignment, a method call or `++`. Maybe you meant `x = x + 1;`, or used a keyword as a name.' })],
  [/unreachable statement/, () => ({ title: 'Code that can never run', body: 'Java can see that this code is never reached, for example after a `break`, after a `return`, or after an endless `while (true)`.' })],
  [/'else' without 'if'/, () => ({ title: 'An else without its if', body: 'Check the braces just above this `else`, and make sure there is no `;` right after the `if (...)`.' })],
  [/duplicate case label/, () => ({ title: 'Two cases are the same', body: 'Every `case` in a switch needs its own value. With two of the same, Java would not know which one to run.' })],
  [/duplicate default label/, () => ({ title: 'Only one default', body: 'A switch can only have one `default`.' })],
  [/constant expression required/, () => ({ title: 'A case needs a fixed value', body: 'A `case` label has to be a fixed value, like `case 3:` or `case \'A\':`. A variable that can change is not allowed, unless it is `final`.' })],
  [/selector type \w+ is not allowed/, () => ({ title: 'A switch cannot look at that type', body: 'A switch works with whole numbers, single characters and Strings. For a decimal number or a true or false value, use an `if` instead.' })],
  [/case, default, or '}' expected/, () => ({ title: 'Code has to sit under a case', body: 'Inside a switch, every statement has to come after a `case` or `default` label.' })],
  [/orphaned (case|default)/, () => ({ title: 'A case outside a switch', body: 'A `case` or `default` only makes sense inside the braces of a `switch`.' })],
  [/exception (\w+) has already been caught/, (m) => ({ title: 'That catch can never run', body: `An earlier \`catch\` already handles ${m[1]}, so this one is never reached. Put the specific exceptions first and \`Exception\` last.` })],
  [/break outside switch or loop/, () => ({ title: 'Nothing to break out of', body: '`break` only works inside a loop or a switch.' })],
  [/continue outside of loop/, () => ({ title: 'Nothing to continue', body: '`continue` only works inside a loop.' })],
  [/bad operand type/, () => ({ title: 'This operator does not fit here', body: 'This operator does not work with these types. Remember that `!` needs a boolean, math needs numbers, and a range needs two comparisons joined with `&&`.' })],
  [/incomparable types/, () => ({ title: 'You cannot compare those', body: 'You cannot compare a boolean with a number. Check what is on each side of the `==`.' })],
  [/unclosed string literal/, () => ({ title: 'Unclosed text', body: 'A String started with `"` but never ended. Add the closing `"`.' })],
  [/unclosed character literal/, () => ({ title: 'A quotes mix-up', body: 'Single quotes hold exactly ONE character, like `\'A\'`. Text needs double quotes, like `"hello"`.' })],
  [/empty character literal/, () => ({ title: 'An empty char', body: '`\'\'` has no character inside. A char needs exactly one, like `\'x\'`.' })],
  [/integer number too large/, () => ({ title: 'Too big for an int', body: 'An int goes up to 2,147,483,647. For bigger numbers use a `long` with an L at the end, like `3000000000L`.' })],
  [/missing return statement/, () => ({ title: 'Missing return', body: 'A method that promises a value has to `return` one on every path.' })],
  [/non-static/, () => ({ title: 'Static context', body: 'In `main`, you can only use `static` methods and variables. Add `static` to its declaration.' })],
  [/no main method/, () => ({ title: 'No main method', body: 'Java starts at `public static void main(String[] args)`. Add it to your class.' })],
  [/illegal start of expression|illegal start of type/, () => ({ title: 'Java got confused here', body: 'Something is out of place: a missing value, an extra symbol, or a missing `}` before this line.' })],
  [/no suitable method found for println/, () => ({ title: 'println takes one value', body: 'Join the pieces with `+` instead of commas: `System.out.println(a + " " + b);`' })],
]

const RUNTIME: Record<string, { title: string; body: string }> = {
  ArithmeticException: { title: 'Division by zero', body: 'A whole number was divided by 0 (or `% 0`). Java cannot do that, so it throws an ArithmeticException. Check the divisor first, or catch the exception with `try` and `catch`.' },
  InputMismatchException: { title: 'Unexpected input', body: '`nextInt()` or `nextDouble()` found something that is not a number. Catch the InputMismatchException, and throw the bad word away with `next()`.' },
  NoSuchElementException: { title: 'No input left', body: 'The program tried to read input, but there was nothing left to read.' },
  StringIndexOutOfBoundsException: { title: 'That position does not exist', body: 'String positions go from 0 to `length() - 1`. This asked for one outside that range. That is often an off-by-one error, like using `<=` instead of `<`.' },
  NumberFormatException: { title: 'That is not a number', body: 'That text cannot be turned into a number, like `Integer.parseInt("12a")`.' },
  IllegalFormatConversionException: { title: 'A printf placeholder does not match', body: 'A placeholder does not match its value. `%d` needs a whole number, `%f` needs a decimal, `%s` takes anything and `%c` takes a char.' },
  MissingFormatArgumentException: { title: 'Not enough printf values', body: 'The template has more placeholders than values after it.' },
  UnknownFormatConversionException: { title: 'Unknown printf placeholder', body: 'printf only knows placeholders like `%d`, `%f`, `%s`, `%c`, `%n` and `%%`.' },
  IllegalFormatPrecisionException: { title: 'Decimals not allowed here', body: 'Only decimals (`%f`) can have a precision like `%.2f`, and `%d` cannot.' },
  MissingFormatWidthException: { title: 'Missing width', body: 'Flags like `-` or `0` need a width, like `%-10s` or `%05d`.' },
  NullPointerException: { title: 'Nothing there (null)', body: 'A variable holds null, which means no value at all, and the program tried to use it.' },
  StackOverflowError: { title: 'Too many method calls', body: 'A method kept calling itself and never stopped.' },
  IllegalStateException: { title: 'The Scanner is closed', body: 'The Scanner was closed, so it cannot read any more input.' },
  IllegalArgumentException: { title: 'Bad argument', body: 'A method was given a value it cannot work with.' },
}

export function explainRun(r: RunResult): Explanation | null {
  if (r.status === 'compile-error' && r.error) {
    for (const [re, fn] of COMPILE) {
      const m = r.error.message.match(re)
      if (m) return { kind: 'compile', ...fn(m) }
    }
    return { kind: 'compile', title: 'Java cannot compile this', body: 'Read the message, and check the highlighted line (and the one before it).' }
  }
  if (r.status === 'runtime-error' && r.error) {
    const info = RUNTIME[r.error.exception ?? ''] ?? { title: 'The program crashed', body: 'An exception was thrown while the program was running.' }
    return { kind: 'runtime', ...info }
  }
  if (r.status === 'timeout') {
    return {
      kind: 'timeout',
      title: 'Stuck in an infinite loop?',
      body: 'The program ran for a very long time without finishing. Check that your loop condition eventually becomes false (did you forget `i++`?). If you read input in a loop, also make sure a bad word is thrown away with `next()`.',
    }
  }
  if (r.status === 'unsupported') {
    return { kind: 'unsupported', title: 'Not supported in the sandbox (yet)', body: r.error?.message ?? 'This program uses a feature the sandbox does not support.' }
  }
  return null
}
