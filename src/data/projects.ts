import { j } from './helpers'
import type { FinalProject, FinalStage, ProjectId } from './types'

/**
 * The four final projects. The learner picks one when they start, and builds it in guided stages
 * once the units are done. The last stage of every project is the finished program from the
 * teacher's handout ("3 codes.pdf"), so the end result matches the walkthrough video.
 * Each stage's starter is the stage before it plus TODO comments. Tests without an `output` are
 * compared with the reference solution's output for the same input.
 */

/** Add TODO comment lines before or after the line that contains `anchor`, at that line's indent. */
function withTodo(code: string, anchor: string, todo: string[], where: 'before' | 'after' = 'before'): string {
  const lines = code.split('\n')
  const i = lines.findIndex((l) => l.includes(anchor))
  if (i === -1) throw new Error('anchor not found: ' + anchor)
  const indent = lines[i].match(/^\s*/)![0]
  lines.splice(where === 'after' ? i + 1 : i, 0, ...todo.map((t) => indent + t))
  return lines.join('\n')
}

const CRASH_EXPLAIN = {
  tryCatch: {
    title: 'What try and catch do',
    body: 'Code inside `try` runs normally. If something goes wrong in there, Java jumps straight to the `catch` block instead of crashing. Once the catch is done, the program carries on with whatever comes after it, so our loop simply goes around again.',
    code: j`
try {
    int choice = console.nextInt();   // the user types abc...
    System.out.println("never printed");
} catch (Exception e) {
    System.out.println("Please enter a number.");   // ...so we land here
}`,
  },
  next: {
    title: 'Why we call console.next()',
    body: 'When `nextInt()` finds `abc`, it throws an `InputMismatchException` but leaves `abc` sitting in the input. If we leave it there, the next `nextInt()` trips over the very same word, and the loop fails forever. `console.next()` reads that word and throws it away, so the next read gets a fresh start.',
  },
  exception: {
    title: 'Exception or InputMismatchException?',
    body: 'In Unit 8 we caught `InputMismatchException`, which only means "the input was the wrong type". `catch (Exception e)` is wider: it catches every kind of exception. This program uses `Exception`, so one catch block covers every number we read inside the menu.',
  },
}

const MENU_EXPLAIN = {
  flag: (name: string) => ({
    title: 'Why a boolean controls the loop',
    body: `\`${name}\` is a flag: a true or false value the loop checks every time around. \`while (${name})\` means "keep showing the menu as long as this is still true". The moment a case sets it to \`false\`, the loop finishes its current trip and stops. It is the same while loop from Unit 7, with a boolean as the condition.`,
    code: j`
boolean ${name} = true;
while (${name}) {
    // show the menu and read a choice
    // the Exit option sets ${name} = false
}`,
  }),
  switch: {
    title: 'How the switch picks a case',
    body: 'Remember from Unit 8: `switch (choice)` jumps straight to the `case` that matches the value of `choice`. If nothing matches, it goes to `default`. Every case ends with `break;` so Java leaves the switch instead of falling into the next case.',
  },
  print: {
    title: 'print versus println for the prompt',
    body: '`println` moves to a new line after printing, but `print` stays on the same line. We use `print` for `Choose an option: ` so the user types their answer right after the colon.',
  },
}

// ------------------------------------------------------------------ Shopping Cart

const CART1 = j`
// Shoping Cart Game
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        double total = 0;
        boolean shopping = true;

        System.out.println("=== SHOPPING CART ===");

        while (shopping) {
            System.out.println("\n1. Add Item");
            System.out.println("2. View Total");
            System.out.println("3. Checkout");
            System.out.println("4. Exit");

            System.out.print("Choose an option: ");
            int choice = console.nextInt();

            switch (choice) {
                case 4:
                    shopping = false;
                    System.out.println("Shopping cancelled.");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
        console.close();
    }
}`

const CART_ADD = j`
                case 1:
                    System.out.print("Enter item price: ");
                    double price = console.nextDouble();
                    System.out.print("Enter quantity: ");
                    int quantity = console.nextInt();
                    if (price > 0 && quantity > 0) {
                        double itemTotal = price * quantity;
                        total += itemTotal;
                        System.out.printf("Added! Item total: $%.2f%n", itemTotal);
                    } else {
                        System.out.println("Price and quantity must be positive.");
                    }
                    break;
                case 2:
                    System.out.printf("Current total: $%.2f%n", total);
                    break;`

const CART2 = CART1.replace('                case 4:', CART_ADD + '\n                case 4:')

const CART_CHECKOUT = j`
                case 3:
                    double tax = total * 0.13;
                    double finalTotal = total + tax;
                    System.out.printf("Subtotal: $%.2f%n", total);
                    System.out.printf("Tax: $%.2f%n", tax);
                    System.out.printf("Final Total: $%.2f%n", finalTotal);
                    shopping = false;
                    break;`

const CART3 = CART2.replace('                case 4:', CART_CHECKOUT + '\n                case 4:')

const CART4 = j`
// Shoping Cart Game
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        double total = 0;
        boolean shopping = true;

        System.out.println("=== SHOPPING CART ===");

        while (shopping) {
            System.out.println("\n1. Add Item");
            System.out.println("2. View Total");
            System.out.println("3. Checkout");
            System.out.println("4. Exit");

            try {
                System.out.print("Choose an option: ");
                int choice = console.nextInt();

                switch (choice) {
                    case 1:
                        System.out.print("Enter item price: ");
                        double price = console.nextDouble();
                        System.out.print("Enter quantity: ");
                        int quantity = console.nextInt();
                        if (price > 0 && quantity > 0) {
                            double itemTotal = price * quantity;
                            total += itemTotal;
                            System.out.printf("Added! Item total: $%.2f%n", itemTotal);
                        } else {
                            System.out.println("Price and quantity must be positive.");
                        }
                        break;
                    case 2:
                        System.out.printf("Current total: $%.2f%n", total);
                        break;
                    case 3:
                        double tax = total * 0.13;
                        double finalTotal = total + tax;
                        System.out.printf("Subtotal: $%.2f%n", total);
                        System.out.printf("Tax: $%.2f%n", tax);
                        System.out.printf("Final Total: $%.2f%n", finalTotal);
                        shopping = false;
                        break;
                    case 4:
                        shopping = false;
                        System.out.println("Shopping cancelled.");
                        break;
                    default:
                        System.out.println("Invalid option.");
                }
            } catch (Exception e) {
                System.out.println("Please enter valid input.");
                console.next();
            }
        }
        console.close();
    }
}`

const CART_STAGES: FinalStage[] = [
  {
    id: 'cart-1',
    title: 'The Menu Loop',
    concepts: ['Scanner', 'while loop', 'boolean flag', 'switch'],
    story: 'Welcome to your final project! We are building a shopping cart program, like the screen at a self checkout. Programs like this always start the same way: show a menu, read a choice, and keep going until the user wants to stop.',
    instructions: [
      'Make a `double` called `total` that starts at `0`, and a `boolean` called `shopping` that starts at `true`.',
      'Write a `while (shopping)` loop. Inside it, print the menu with four `println` lines: `"\\n1. Add Item"`, `"2. View Total"`, `"3. Checkout"` and `"4. Exit"`.',
      'Print `Choose an option: ` with `print` (not `println`), then read the choice with `int choice = console.nextInt();`',
      'Use a `switch` on `choice`. In `case 4`, set `shopping` to `false`, print `Shopping cancelled.` and `break;`. The `default` prints `Invalid option.`',
      'After the loop, close the Scanner with `console.close();`',
    ],
    starter: j`
// Shoping Cart Game
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        // TODO 1: make a double called total (0) and a boolean called shopping (true)

        System.out.println("=== SHOPPING CART ===");

        // TODO 2: while shopping is true, print the menu and read the choice with console.nextInt()
        // TODO 3: switch on choice. Case 4 sets shopping to false and prints "Shopping cancelled."
        //         The default prints "Invalid option."

        console.close();
    }
}`,
    solution: CART1,
    tests: [
      { label: 'exit straight away', stdin: '4\n' },
      { label: 'a wrong option, then exit', stdin: '9\n4\n' },
      { label: 'options we have not built yet', stdin: '1\n2\n4\n' },
    ],
    hints: [
      'The loop keeps running while `shopping` is `true`. Setting it to `false` in case 4 is what lets the loop end.',
      'Starting the first menu line with `\\n` prints a blank line first, so every menu gets a little space above it.',
      'Do not forget `break;` at the end of case 4. Without it, Java falls through into the default and prints `Invalid option.` as well.',
    ],
    mustInclude: [
      { pattern: 'while\\s*\\(\\s*shopping\\s*\\)', message: 'Use a `while (shopping)` loop for the menu.' },
      { pattern: 'switch\\s*\\(\\s*choice\\s*\\)', message: 'Use a `switch` on `choice`.' },
      { pattern: 'nextInt\\s*\\(', message: 'Read the choice with `console.nextInt()`.' },
    ],
    explain: [MENU_EXPLAIN.flag('shopping'), MENU_EXPLAIN.switch, MENU_EXPLAIN.print],
  },
  {
    id: 'cart-2',
    title: 'Add Items',
    concepts: ['nextDouble', 'Logical operators', 'Compound assignment', 'printf'],
    story: 'A cart is not much use if you cannot put anything in it. Let us make option 1 add an item and option 2 show the running total.',
    instructions: [
      'Add `case 1` above case 4. Print `Enter item price: ` and read `double price = console.nextDouble();`. Then print `Enter quantity: ` and read `int quantity = console.nextInt();`',
      'Only add the item if `price > 0 && quantity > 0`. Work out `double itemTotal = price * quantity;` and add it to the cart with `total += itemTotal;`',
      'Then print `System.out.printf("Added! Item total: $%.2f%n", itemTotal);`',
      'If the price or the quantity is not positive, print `Price and quantity must be positive.` instead. End the case with `break;`',
      'Add `case 2`, which prints `System.out.printf("Current total: $%.2f%n", total);` and breaks.',
    ],
    starter: withTodo(CART1, 'case 4:', [
      '// TODO 1: case 1 reads a price (nextDouble) and a quantity (nextInt)',
      '//         and adds price * quantity to total if both are positive',
      '// TODO 2: case 2 prints the current total with printf',
    ]),
    solution: CART2,
    tests: [
      { label: '4 items at $2.50, then view the total', stdin: '1\n2.50\n4\n2\n4\n' },
      { label: 'a negative price', stdin: '1\n-5\n2\n2\n4\n' },
      { label: 'two different items', stdin: '1\n1.99\n3\n1\n0.5\n2\n2\n4\n' },
    ],
    hints: [
      '`&&` means both checks have to be true. `price > 0 && quantity > 0` is false as soon as either one is 0 or negative.',
      '`total += itemTotal;` is a short way to write `total = total + itemTotal;`',
      'In `%.2f`, the `.2` means two decimal places, so 10 prints as `10.00`. The `%n` ends the line.',
    ],
    mustInclude: [
      { pattern: 'nextDouble\\s*\\(', message: 'Read the price with `console.nextDouble()`.' },
      { pattern: '&&', message: 'Check that the price and the quantity are both positive with `&&`.' },
      { pattern: 'total\\s*\\+=', message: 'Add to the running total with `total += itemTotal;`' },
    ],
    explain: [
      {
        title: 'Reading a price and a quantity',
        body: 'A price can have cents, so we read it with `nextDouble()`. A quantity is a whole number, so we read it with `nextInt()`. Picking the right type matters: `nextInt()` cannot read `2.50`.',
      },
      {
        title: 'Keeping a running total',
        body: '`total` is declared before the loop, so it remembers its value between menu choices. Each time we add an item, `total += itemTotal;` adds to what is already there instead of starting over.',
        code: j`
double total = 0;
total += 10.00;   // total is now 10.0
total += 1.50;    // total is now 11.5`,
      },
      {
        title: 'Money with printf',
        body: '`printf` lets us format numbers, which you saw in Unit 5. `%.2f` prints a double with exactly 2 decimal places, which is what money needs. The `$` in front of it is just an ordinary character that gets printed.',
      },
    ],
  },
  {
    id: 'cart-3',
    title: 'Checkout',
    concepts: ['Arithmetic', 'printf', 'Ending a loop'],
    story: 'Time to pay! Checkout adds 13% tax (that is the HST here in Ontario), prints the bill, and ends the program.',
    instructions: [
      'Add `case 3` above case 4. Work out `double tax = total * 0.13;` and `double finalTotal = total + tax;`',
      'Print three lines with printf: `"Subtotal: $%.2f%n"` with `total`, `"Tax: $%.2f%n"` with `tax`, and `"Final Total: $%.2f%n"` with `finalTotal`.',
      'Set `shopping = false;` so the loop ends after checkout, then `break;`',
    ],
    starter: withTodo(CART2, 'case 4:', [
      '// TODO: case 3 works out 13% tax and the final total, prints the bill,',
      '//       and sets shopping to false',
    ]),
    solution: CART3,
    tests: [
      { label: '2 items at $10, then checkout', stdin: '1\n10\n2\n3\n' },
      { label: 'checkout with an empty cart', stdin: '3\n' },
      { label: 'add, view, then checkout', stdin: '1\n4.99\n3\n2\n3\n' },
    ],
    hints: [
      '13% as a decimal is `0.13`, so the tax is `total * 0.13`.',
      'Checkout ends the shopping trip, so it sets `shopping = false;` just like case 4 does.',
    ],
    mustInclude: [
      { pattern: '0\\.13', message: 'Work out the tax as `total * 0.13`.' },
      { pattern: 'Final Total', message: 'Print the `Final Total:` line.' },
    ],
    explain: [
      {
        title: 'Percentages in code',
        body: 'Java does not read `%` as "percent". To take 13% of something, turn the percentage into a decimal (13 divided by 100 is 0.13) and multiply.',
        code: j`
double total = 20.00;
double tax = total * 0.13;         // 2.6
double finalTotal = total + tax;   // 22.6`,
      },
      {
        title: 'Why the program stops after checkout',
        body: 'The loop only keeps going while `shopping` is `true`. Setting it to `false` inside case 3 means: finish this trip around the loop, then stop. No more menu.',
      },
    ],
  },
  {
    id: 'cart-4',
    title: 'Crash-Proof Input',
    concepts: ['try / catch', 'Exception', 'console.next()'],
    story: 'Try typing `abc` when the menu asks for an option. It crashes! A real store would never do that to a customer. Let us wrap the menu in try and catch so a typo just gets a friendly message.',
    instructions: [
      'Put everything from `System.out.print("Choose an option: ");` to the end of the switch inside a `try { ... }` block.',
      'Right after it, add `catch (Exception e) { ... }`. Inside, print `Please enter valid input.` and then call `console.next();` to throw away the bad input.',
      'Leave `console.close();` after the loop, outside the try.',
    ],
    starter: withTodo(CART3, 'System.out.print("Choose an option: ");', [
      '// TODO: put the prompt, the nextInt() and the whole switch inside try { }',
      '//       then catch (Exception e): print "Please enter valid input." and call console.next();',
    ]),
    solution: CART4,
    tests: [
      { label: 'a word instead of an option', stdin: 'abc\n4\n' },
      { label: 'a word instead of a price', stdin: '1\nfive\n1\n5\n2\n3\n' },
      { label: 'the full trip, with a typo', stdin: '1\n2.25\n2\n2\nx\n3\n' },
    ],
    hints: [
      'The shape is `try { ...menu code... } catch (Exception e) { ... }`. The catch starts right where the try block closes.',
      'Without `console.next();`, the bad word stays in the input, so the next `nextInt()` reads it again and fails again, forever.',
      '`Exception` catches every kind of exception, including the `InputMismatchException` that `nextInt()` and `nextDouble()` throw.',
    ],
    mustInclude: [
      { pattern: '\\btry\\b', message: 'Put the menu code inside a `try` block.' },
      { pattern: 'catch\\s*\\(\\s*Exception\\s+\\w+\\s*\\)', message: 'Catch the problem with `catch (Exception e)`.' },
      { pattern: 'console\\.next\\s*\\(\\s*\\)', message: 'Throw the bad input away with `console.next();`' },
    ],
    explain: [CRASH_EXPLAIN.tryCatch, CRASH_EXPLAIN.next, CRASH_EXPLAIN.exception],
  },
]

// ------------------------------------------------------------------ Number Guesser

const GUESS1 = j`
// Java Number Guessing Game
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        int secretNumber;
        int guess = 0;
        int attempts = 0;
        int maxAttempts = 10;

        System.out.println("================================");
        System.out.println(" NUMBER GUESSING GAME");
        System.out.println("================================");

        // Get Player 1 Secret Number
        System.out.print("Player 1, Please enter a Secret Number: ");
        secretNumber = console.nextInt();

        // Telling Player two their goal
        System.out.println("\nPlayer 2, your goal is to guess the number!");
        System.out.println("You have " + maxAttempts + " attempts.");
        System.out.println("I'll tell you if your guess is too high or too low.\n");
    }
}`

const GUESS_LOOP = j`

        while (attempts < maxAttempts) {
            System.out.print("Enter your guess: ");
            guess = console.nextInt();
            attempts++;

            if (guess > secretNumber) {
                System.out.println("Too high ");
            }
            else if (guess < secretNumber) {
                System.out.println("Too low");
            }
            else {
                System.out.println("\nCorrect! ");
                System.out.println("You guessed the number in " + attempts + " attempts! ");
                break;
            }
            System.out.println("Attempts Remaining: " + (maxAttempts - attempts));
            System.out.println();
        }

        if (guess != secretNumber) {
            System.out.println("\n You lost the game");
            System.out.println("You are out of attempts");
            System.out.println("The secret number was " + secretNumber);
        }`

const GOAL_LINE = '        System.out.println("I\'ll tell you if your guess is too high or too low.\\n");'

const GUESS2 = GUESS1.replace(GOAL_LINE, GOAL_LINE + GUESS_LOOP)

const GUESS_RATING = j`
                if (attempts <= 3) {
                    System.out.println("Amazing! You barely needed any attempts.");
                }
                else if (attempts <= 6) {
                    System.out.println("Great job!");
                }
                else {
                    System.out.println("You got it just in time!");
                }`

const GUESS_WIN_LINE = '                System.out.println("You guessed the number in " + attempts + " attempts! ");'

const GUESS3 = GUESS2.replace(GUESS_WIN_LINE, GUESS_WIN_LINE + '\n' + GUESS_RATING)

const GUESS4 = j`
// Java Number Guessing Game
import java.util.Scanner;
import java.util.InputMismatchException;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        int secretNumber;
        int guess = 0;
        int attempts = 0;
        int maxAttempts = 10;

        System.out.println("================================");
        System.out.println(" NUMBER GUESSING GAME");
        System.out.println("================================");

        // Get Player 1 Secret Number
        while (true) {
            try {
                System.out.print("Player 1, Please enter a Secret Number: ");
                secretNumber = console.nextInt();
                break;
            }
            catch (InputMismatchException e) {
                System.out.print("Please enter an integer: ");
                console.next();
            }
        }

        // Telling Player two their goal
        System.out.println("\nPlayer 2, your goal is to guess the number!");
        System.out.println("You have " + maxAttempts + " attempts.");
        System.out.println("I'll tell you if your guess is too high or too low.\n");

        while (attempts < maxAttempts) {
            while (true) {
                try {
                    System.out.print("Enter your guess: ");
                    guess = console.nextInt();
                    break;
                }
                catch (InputMismatchException e) {
                    System.out.print("Please enter a valid integer: ");
                    console.next();
                }
            }
            attempts++;

            if (guess > secretNumber) {
                System.out.println("Too high ");
            }
            else if (guess < secretNumber) {
                System.out.println("Too low");
            }
            else {
                System.out.println("\nCorrect! ");
                System.out.println("You guessed the number in " + attempts + " attempts! ");
                if (attempts <= 3) {
                    System.out.println("Amazing! You barely needed any attempts.");
                }
                else if (attempts <= 6) {
                    System.out.println("Great job!");
                }
                else {
                    System.out.println("You got it just in time!");
                }
                break;
            }
            System.out.println("Attempts Remaining: " + (maxAttempts - attempts));
            System.out.println();
        }

        if (guess != secretNumber) {
            System.out.println("\n You lost the game");
            System.out.println("You are out of attempts");
            System.out.println("The secret number was " + secretNumber);
        }
    }
}`

const GUESSER_STAGES: FinalStage[] = [
  {
    id: 'guesser-1',
    title: 'The Secret Number',
    concepts: ['Variables', 'Scanner', 'Joining text with +'],
    story: 'Welcome to your final project! This one is a two player game. Player 1 secretly types a number, then Player 2 gets 10 tries to guess it. First we set up the game and get the secret number.',
    instructions: [
      'Declare `int secretNumber;` without a value. Then declare `int guess = 0;`, `int attempts = 0;` and `int maxAttempts = 10;`',
      'After the title, print `Player 1, Please enter a Secret Number: ` with `print`, then read the number with `secretNumber = console.nextInt();`',
      'Tell Player 2 their goal with three `println` lines: `"\\nPlayer 2, your goal is to guess the number!"`, then `"You have " + maxAttempts + " attempts."`, then `"I\'ll tell you if your guess is too high or too low.\\n"`',
    ],
    starter: j`
// Java Number Guessing Game
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        // TODO 1: declare int secretNumber (no value yet), guess = 0, attempts = 0 and maxAttempts = 10

        System.out.println("================================");
        System.out.println(" NUMBER GUESSING GAME");
        System.out.println("================================");

        // TODO 2: ask Player 1 for the secret number and read it with console.nextInt()
        // TODO 3: tell Player 2 their goal (three println lines)
    }
}`,
    solution: GUESS1,
    tests: [
      { label: 'secret number 42', stdin: '42\n' },
      { label: 'secret number -7', stdin: '-7\n' },
    ],
    hints: [
      '`int secretNumber;` creates the variable without a value. That is allowed, as long as we give it a value before we use it.',
      '`"You have " + maxAttempts + " attempts."` joins the text and the number into one String: `You have 10 attempts.`',
      'The `\\n` at the start and end of the goal lines prints the blank lines around them.',
    ],
    mustInclude: [
      { pattern: 'int\\s+secretNumber', message: 'Declare `int secretNumber`.' },
      { pattern: 'maxAttempts\\s*=\\s*10', message: 'Set `maxAttempts` to 10.' },
      { pattern: 'nextInt\\s*\\(', message: 'Read the secret number with `console.nextInt()`.' },
    ],
    explain: [
      {
        title: 'Declaring a variable without a value',
        body: 'We do not know the secret number when the program starts, so we write `int secretNumber;` with no value. Java is fine with that, but it will not let us *use* the variable until we have stored something in it. Here, `console.nextInt()` gives it a value straight away.',
      },
      {
        title: 'Gluing text and numbers together',
        body: 'From Unit 3, `+` has two jobs. Between two numbers it adds. As soon as a String is involved, it joins things together. So `"You have " + maxAttempts + " attempts."` becomes `You have 10 attempts.`',
      },
      {
        title: 'Why maxAttempts is a variable',
        body: 'We could type `10` everywhere, but if we ever want 5 attempts instead, we would have to hunt down every 10. With `maxAttempts`, we change one line and the whole game follows.',
      },
    ],
  },
  {
    id: 'guesser-2',
    title: 'The Guessing Loop',
    concepts: ['while loop', 'if / else if / else', 'break', 'Increment'],
    story: 'Now Player 2 gets to guess. After each guess we say "Too high" or "Too low", until they get it right or run out of attempts.',
    instructions: [
      'Write `while (attempts < maxAttempts)`. Inside it, print `Enter your guess: `, read `guess = console.nextInt();` and count the attempt with `attempts++;`',
      'If `guess > secretNumber`, print `Too high `. Else if `guess < secretNumber`, print `Too low`.',
      'Otherwise the guess is right: print `"\\nCorrect! "` and then `"You guessed the number in " + attempts + " attempts! "`, then `break;` out of the loop.',
      'After the if (still inside the loop), print `"Attempts Remaining: " + (maxAttempts - attempts)` and then an empty `System.out.println();`',
      'After the loop, if `guess != secretNumber`, Player 2 ran out of tries. Print `"\\n You lost the game"`, then `You are out of attempts`, then `"The secret number was " + secretNumber`.',
    ],
    starter: withTodo(
      GUESS1,
      GOAL_LINE.trim(),
      ['', '// TODO 1: while attempts < maxAttempts, read a guess and count it with attempts++', '//         say "Too high " or "Too low", or "Correct!" and break', '// TODO 2: after the loop, if the last guess was wrong, print the "You lost" lines'],
      'after',
    ),
    solution: GUESS2,
    tests: [
      { label: 'secret 50, found on the third guess', stdin: '50\n25\n75\n50\n' },
      { label: 'ten wrong guesses', stdin: '5\n1\n2\n3\n4\n6\n7\n8\n9\n10\n11\n' },
      { label: 'right on the first try', stdin: '-3\n-3\n' },
    ],
    hints: [
      'The brackets in `(maxAttempts - attempts)` matter. Without them Java would join `maxAttempts` onto the text first, and then try to subtract a number from a String, which is an error.',
      '`break;` jumps out of the loop straight away, so a correct guess skips the `Attempts Remaining` line.',
      'After the loop, `guess != secretNumber` can only be true if the last guess was wrong, which means every attempt was used up.',
    ],
    mustInclude: [
      { pattern: 'while\\s*\\(\\s*attempts\\s*<\\s*maxAttempts\\s*\\)', message: 'Loop with `while (attempts < maxAttempts)`.' },
      { pattern: 'else\\s+if', message: 'Use `else if` for the "Too low" check.' },
      { pattern: '\\bbreak\\s*;', message: 'Use `break;` to leave the loop on a correct guess.' },
    ],
    explain: [
      {
        title: 'Counting attempts',
        body: '`attempts` starts at 0 and `attempts++;` adds 1 after every guess. The loop condition `attempts < maxAttempts` is checked before each guess, so once 10 guesses have been made, the loop stops on its own.',
      },
      {
        title: 'Leaving a loop early with break',
        body: 'Sometimes we want out of a loop before its condition says so. A correct guess is one of those times. `break;` jumps straight past the end of the loop, skipping everything left in it.',
        code: j`
while (attempts < maxAttempts) {
    // ...
    else {
        System.out.println("Correct!");
        break;   // jump out, the game is won
    }
    System.out.println("Attempts Remaining: " + (maxAttempts - attempts));
}`,
      },
      {
        title: 'Why the last if knows they lost',
        body: 'The loop ends in one of two ways: a correct guess (with `break`) or running out of attempts. If it was a correct guess, `guess` equals `secretNumber`. So `if (guess != secretNumber)` is only true when they ran out of attempts.',
      },
    ],
  },
  {
    id: 'guesser-3',
    title: 'Rate the Win',
    concepts: ['Nested if', 'Relational operators'],
    story: 'Winning in 2 guesses deserves more praise than winning in 10. Let us add a message that depends on how many attempts it took.',
    instructions: [
      'Inside the `else` (the correct guess), after the two lines that are already there and before `break;`, add another if statement.',
      'If `attempts <= 3`, print `Amazing! You barely needed any attempts.`',
      'Else if `attempts <= 6`, print `Great job!`. Otherwise print `You got it just in time!`',
    ],
    starter: withTodo(GUESS2, GUESS_WIN_LINE.trim(), ['// TODO: 3 or fewer attempts is "Amazing! ...", 6 or fewer is "Great job!",', '//       anything else is "You got it just in time!"'], 'after'),
    solution: GUESS3,
    tests: [
      { label: 'won on the first guess', stdin: '10\n10\n' },
      { label: 'won on the fifth guess', stdin: '10\n1\n2\n3\n4\n10\n' },
      { label: 'won on the ninth guess', stdin: '10\n1\n2\n3\n4\n5\n6\n7\n8\n10\n' },
    ],
    hints: [
      'Order matters. Check `attempts <= 3` first. If you checked `<= 6` first, a win in 2 would get "Great job!" instead of "Amazing!".',
      'This if goes inside the `else` block, so it only runs when the guess was right. An if inside another if (or else) is a nested if.',
    ],
    mustInclude: [
      { pattern: 'attempts\\s*<=\\s*3', message: 'Check `attempts <= 3` for the best message.' },
      { pattern: 'attempts\\s*<=\\s*6', message: 'Check `attempts <= 6` for "Great job!".' },
    ],
    explain: [
      {
        title: 'Nested if',
        body: 'A nested if is just an if statement inside another one. The outer if/else decides "was the guess right?". Only when the answer is yes do we reach the inner if, which decides how good the win was.',
      },
      {
        title: 'Why the order of else if matters',
        body: 'Java checks the conditions from top to bottom and stops at the first true one. A win in 2 attempts makes both `attempts <= 3` and `attempts <= 6` true, so the smaller check has to come first.',
        code: j`
int attempts = 2;
if (attempts <= 3) {
    System.out.println("Amazing!");      // this one runs
} else if (attempts <= 6) {
    System.out.println("Great job!");    // skipped, we already matched
}`,
      },
    ],
  },
  {
    id: 'guesser-4',
    title: 'Crash-Proof Input',
    concepts: ['try / catch', 'InputMismatchException', 'while (true)', 'break'],
    story: 'Type `abc` as the secret number and the game crashes. Let us make every number we read crash-proof, so a typo just asks again and does not even use up an attempt.',
    instructions: [
      'Add `import java.util.InputMismatchException;` under the Scanner import.',
      'Wrap the secret number question in `while (true) { try { ... } catch (InputMismatchException e) { ... } }`. Put `break;` right after `secretNumber = console.nextInt();`',
      'In that catch, print `Please enter an integer: ` (with `print`) and throw the bad input away with `console.next();`',
      'Do the same for the guess inside the game loop. This time the catch prints `Please enter a valid integer: `. Keep `attempts++;` after this inner loop.',
    ],
    starter: withTodo(
      withTodo(GUESS3, 'import java.util.Scanner;', ['// TODO 1: import java.util.InputMismatchException'], 'after'),
      'System.out.print("Player 1, Please enter a Secret Number: ");',
      [
        '// TODO 2: wrap this question in while (true) { try { ... break; } catch (InputMismatchException e) { ... } }',
        '// TODO 3: do the same for "Enter your guess: " further down',
      ],
    ),
    solution: GUESS4,
    tests: [
      { label: 'a word as the secret number', stdin: 'abc\n42\n10\n42\n' },
      { label: 'typos while guessing', stdin: '5\nfive\n4.5\n5\n' },
      { label: 'typos and a loss', stdin: '1\nx\n2\n3\n4\n5\n6\ny\n7\n8\n9\n10\n11\n' },
    ],
    hints: [
      '`while (true)` would loop forever on its own. The `break;` after a good read is the way out. If `nextInt()` fails, Java skips the break and jumps to the catch, so the loop asks again.',
      'Keep `attempts++;` after the inner `while (true)` loop, so a typo does not use up an attempt.',
      'Remember `console.next();` in each catch, or the bad word stays in the input forever.',
    ],
    mustInclude: [
      { pattern: 'import\\s+java\\.util\\.InputMismatchException', message: 'Import `java.util.InputMismatchException`.' },
      { pattern: 'while\\s*\\(\\s*true\\s*\\)', message: 'Use `while (true)` loops to keep asking until the number is good.' },
      { pattern: 'catch\\s*\\(\\s*InputMismatchException\\s+\\w+\\s*\\)', message: 'Catch `InputMismatchException`.' },
    ],
    explain: [
      {
        title: 'The while (true) and break pattern',
        body: 'This is a handy way to say "keep asking until the answer is good". The loop has no exit of its own. The only way out is the `break;`, and we only reach it when `nextInt()` worked. If `nextInt()` throws, Java jumps over the break into the catch, then the loop starts again.',
        code: j`
while (true) {
    try {
        guess = console.nextInt();   // abc? jump to catch
        break;                       // a real number: we are done
    }
    catch (InputMismatchException e) {
        System.out.print("Please enter a valid integer: ");
        console.next();
    }
}`,
      },
      {
        title: 'What InputMismatchException means',
        body: 'It is the exception `nextInt()` throws when the input is not a whole number, like `abc` or `4.5`. It lives in `java.util`, so we import it just like the Scanner.',
      },
      CRASH_EXPLAIN.next,
    ],
  },
]

// ------------------------------------------------------------------ Mini Banking

const BANK1 = j`
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        double balance = 1000.00;
        boolean running = true;

        System.out.println("=== MINI BANK ===");

        while (running) {
            System.out.println("\n1. Check Balance");
            System.out.println("2. Deposit");
            System.out.println("3. Withdraw");
            System.out.println("4. Exit");

            System.out.print("Choose an option: ");
            int choice = console.nextInt();

            switch (choice) {
                case 1:
                    System.out.printf("Your balance is $%.2f%n", balance);
                    break;
                case 4:
                    running = false;
                    System.out.println("Thank you for banking with us!");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
        console.close();
    }
}`

const BANK_DEPOSIT = j`
                case 2:
                    System.out.print("Enter deposit amount: ");
                    double deposit = console.nextDouble();
                    if (deposit > 0) {
                        balance += deposit;
                        System.out.printf("New balance: $%.2f%n", balance);
                    } else {
                        System.out.println("Amount must be positive.");
                    }
                    break;`

const BANK2 = BANK1.replace('                case 4:', BANK_DEPOSIT + '\n                case 4:')

const BANK_WITHDRAW = j`
                case 3:
                    System.out.print("Enter withdrawal amount: ");
                    double withdrawal = console.nextDouble();
                    if (withdrawal <= 0) {
                        System.out.println("Amount must be positive.");
                    }
                    else if (withdrawal > balance) {
                        System.out.println("Insufficient funds.");
                    }
                    else {
                        balance -= withdrawal;
                        System.out.printf("New balance: $%.2f%n", balance);
                    }
                    break;`

const BANK3 = BANK2.replace('                case 4:', BANK_WITHDRAW + '\n                case 4:')

const BANK4 = j`
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        double balance = 1000.00;
        boolean running = true;

        System.out.println("=== MINI BANK ===");

        while (running) {
            System.out.println("\n1. Check Balance");
            System.out.println("2. Deposit");
            System.out.println("3. Withdraw");
            System.out.println("4. Exit");

            try {
                System.out.print("Choose an option: ");
                int choice = console.nextInt();

                switch (choice) {
                    case 1:
                        System.out.printf("Your balance is $%.2f%n", balance);
                        break;
                    case 2:
                        System.out.print("Enter deposit amount: ");
                        double deposit = console.nextDouble();
                        if (deposit > 0) {
                            balance += deposit;
                            System.out.printf("New balance: $%.2f%n", balance);
                        } else {
                            System.out.println("Amount must be positive.");
                        }
                        break;
                    case 3:
                        System.out.print("Enter withdrawal amount: ");
                        double withdrawal = console.nextDouble();
                        if (withdrawal <= 0) {
                            System.out.println("Amount must be positive.");
                        }
                        else if (withdrawal > balance) {
                            System.out.println("Insufficient funds.");
                        }
                        else {
                            balance -= withdrawal;
                            System.out.printf("New balance: $%.2f%n", balance);
                        }
                        break;
                    case 4:
                        running = false;
                        System.out.println("Thank you for banking with us!");
                        break;
                    default:
                        System.out.println("Invalid option.");
                }
            } catch (Exception e) {
                System.out.println("Invalid input.");
                console.next();
            }
        }
        console.close();
    }
}`

const BANK_STAGES: FinalStage[] = [
  {
    id: 'bank-1',
    title: 'The Bank Menu',
    concepts: ['Scanner', 'while loop', 'boolean flag', 'switch', 'printf'],
    story: 'Welcome to your final project! We are building a little bank machine. Every account starts with $1000. First we need the menu, a way to check the balance, and a way to leave.',
    instructions: [
      'Make a `double` called `balance` that starts at `1000.00`, and a `boolean` called `running` that starts at `true`.',
      'Write a `while (running)` loop. Inside it, print the menu with four `println` lines: `"\\n1. Check Balance"`, `"2. Deposit"`, `"3. Withdraw"` and `"4. Exit"`.',
      'Print `Choose an option: ` with `print`, then read `int choice = console.nextInt();`',
      'Use a `switch` on `choice`. `case 1` prints `System.out.printf("Your balance is $%.2f%n", balance);` and breaks.',
      '`case 4` sets `running` to `false` and prints `Thank you for banking with us!`. The `default` prints `Invalid option.`. After the loop, call `console.close();`',
    ],
    starter: j`
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        // TODO 1: make a double called balance (1000.00) and a boolean called running (true)

        System.out.println("=== MINI BANK ===");

        // TODO 2: while running is true, print the menu and read the choice with console.nextInt()
        // TODO 3: switch on choice. Case 1 prints the balance, case 4 says goodbye and stops the loop,
        //         and the default prints "Invalid option."

        console.close();
    }
}`,
    solution: BANK1,
    tests: [
      { label: 'check the balance, then exit', stdin: '1\n4\n' },
      { label: 'a wrong option first', stdin: '6\n1\n4\n' },
      { label: 'exit straight away', stdin: '4\n' },
    ],
    hints: [
      'The loop keeps running while `running` is `true`. Setting it to `false` in case 4 is what lets the program end.',
      '`%.2f` prints the balance with two decimal places, so 1000 shows as `1000.00`.',
      'Each case ends with `break;` so Java does not fall through into the next one.',
    ],
    mustInclude: [
      { pattern: 'while\\s*\\(\\s*running\\s*\\)', message: 'Use a `while (running)` loop for the menu.' },
      { pattern: 'switch\\s*\\(\\s*choice\\s*\\)', message: 'Use a `switch` on `choice`.' },
      { pattern: 'printf', message: 'Print the balance with printf.' },
    ],
    explain: [MENU_EXPLAIN.flag('running'), MENU_EXPLAIN.switch, MENU_EXPLAIN.print],
  },
  {
    id: 'bank-2',
    title: 'Deposits',
    concepts: ['nextDouble', 'if / else', 'Compound assignment'],
    story: 'Payday! Option 2 lets the user put money in. We should only accept positive amounts, because depositing -50 dollars makes no sense.',
    instructions: [
      'Add `case 2` above case 4. Print `Enter deposit amount: ` and read `double deposit = console.nextDouble();`',
      'If `deposit > 0`, add it with `balance += deposit;` and print `System.out.printf("New balance: $%.2f%n", balance);`',
      'Otherwise print `Amount must be positive.`. End the case with `break;`',
    ],
    starter: withTodo(BANK1, 'case 4:', ['// TODO: case 2 reads a deposit with nextDouble() and adds it to balance if it is positive']),
    solution: BANK2,
    tests: [
      { label: 'deposit $250.50, then check', stdin: '2\n250.50\n1\n4\n' },
      { label: 'a negative deposit', stdin: '2\n-20\n4\n' },
      { label: 'zero, then $100', stdin: '2\n0\n2\n100\n4\n' },
    ],
    hints: [
      '`balance += deposit;` is the short way to write `balance = balance + deposit;`',
      'Zero is not positive, so `deposit > 0` turns it away too.',
    ],
    mustInclude: [
      { pattern: 'nextDouble\\s*\\(', message: 'Read the amount with `console.nextDouble()`.' },
      { pattern: 'balance\\s*\\+=', message: 'Add the deposit with `balance += deposit;`' },
    ],
    explain: [
      {
        title: 'Why balance remembers deposits',
        body: '`balance` is declared before the loop, so it keeps its value every time the menu comes around again. `balance += deposit;` adds to the money that is already there.',
        code: j`
double balance = 1000.00;
balance += 250.50;   // balance is now 1250.5`,
      },
      {
        title: 'Checking the amount first',
        body: 'We test `deposit > 0` before touching the balance. This is called validating input: never trust a number until you have checked it makes sense.',
      },
    ],
  },
  {
    id: 'bank-3',
    title: 'Withdrawals',
    concepts: ['else if', 'Relational operators', 'Compound assignment'],
    story: 'Taking money out needs two checks: the amount has to be positive, and you cannot take out more than you have.',
    instructions: [
      'Add `case 3` above case 4. Print `Enter withdrawal amount: ` and read `double withdrawal = console.nextDouble();`',
      'If `withdrawal <= 0`, print `Amount must be positive.`',
      'Else if `withdrawal > balance`, print `Insufficient funds.`',
      'Otherwise take the money out with `balance -= withdrawal;` and print the new balance the same way case 2 does. End with `break;`',
    ],
    starter: withTodo(BANK2, 'case 4:', ['// TODO: case 3 reads a withdrawal. Too small? "Amount must be positive."', '//       More than the balance? "Insufficient funds."  Otherwise subtract it.']),
    solution: BANK3,
    tests: [
      { label: 'withdraw $200', stdin: '3\n200\n4\n' },
      { label: 'too much, then a negative amount', stdin: '3\n5000\n3\n-1\n4\n' },
      { label: 'deposit, then withdraw it all', stdin: '2\n50\n3\n1050\n1\n4\n' },
    ],
    hints: [
      '`balance -= withdrawal;` is the short way to write `balance = balance - withdrawal;`',
      'Withdrawing exactly the whole balance is allowed, so the check is `withdrawal > balance`, not `>=`.',
    ],
    mustInclude: [
      { pattern: 'else\\s+if', message: 'Use `else if` for the "Insufficient funds." check.' },
      { pattern: 'balance\\s*-=', message: 'Take the money out with `balance -= withdrawal;`' },
    ],
    explain: [
      {
        title: 'An if / else if / else chain',
        body: 'There are three possible outcomes, so we use a chain. Java checks each condition in order and runs only the first one that is true. If neither problem applies, the `else` does the actual withdrawal.',
        code: j`
if (withdrawal <= 0) {
    // problem 1: not a real amount
}
else if (withdrawal > balance) {
    // problem 2: not enough money
}
else {
    balance -= withdrawal;   // all good
}`,
      },
      {
        title: '> or >=?',
        body: 'With $1000 in the bank, taking out exactly $1000 should work and leave $0. `1000 > 1000` is false, so it gets through. If we used `>=`, it would wrongly say "Insufficient funds."',
      },
    ],
  },
  {
    id: 'bank-4',
    title: 'Crash-Proof Input',
    concepts: ['try / catch', 'Exception', 'console.next()'],
    story: 'Type `abc` at the menu and the bank machine crashes. A real bank could never get away with that! Let us wrap the menu in try and catch so a typo just gets a friendly message.',
    instructions: [
      'Put everything from `System.out.print("Choose an option: ");` to the end of the switch inside a `try { ... }` block.',
      'Right after it, add `catch (Exception e) { ... }`. Inside, print `Invalid input.` and then call `console.next();` to throw away the bad input.',
      'Leave `console.close();` after the loop, outside the try.',
    ],
    starter: withTodo(BANK3, 'System.out.print("Choose an option: ");', [
      '// TODO: put the prompt, the nextInt() and the whole switch inside try { }',
      '//       then catch (Exception e): print "Invalid input." and call console.next();',
    ]),
    solution: BANK4,
    tests: [
      { label: 'a word at the menu', stdin: 'abc\n1\n4\n' },
      { label: 'a word as the deposit', stdin: '2\nlots\n2\n10\n4\n' },
      { label: 'a full visit with a typo', stdin: '3\n100\nx\n1\n4\n' },
    ],
    hints: [
      'The shape is `try { ...menu code... } catch (Exception e) { ... }`. The catch starts right where the try block closes.',
      'Without `console.next();`, the bad word stays in the input, so the next `nextInt()` reads it again and fails again, forever.',
    ],
    mustInclude: [
      { pattern: '\\btry\\b', message: 'Put the menu code inside a `try` block.' },
      { pattern: 'catch\\s*\\(\\s*Exception\\s+\\w+\\s*\\)', message: 'Catch the problem with `catch (Exception e)`.' },
      { pattern: 'console\\.next\\s*\\(\\s*\\)', message: 'Throw the bad input away with `console.next();`' },
    ],
    explain: [CRASH_EXPLAIN.tryCatch, CRASH_EXPLAIN.next, CRASH_EXPLAIN.exception],
  },
]

// ------------------------------------------------------------------ Grade Analyzer

const GRADES1 = j`
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        double total = 0;
        int numberOfGrades = 0;
        boolean running = true;

        System.out.println("================================");
        System.out.println(" STUDENT GRADE ANALYZER");
        System.out.println("================================");

        while (running) {
            System.out.println("\n1. Enter Grades");
            System.out.println("2. View Average");
            System.out.println("3. Check Result");
            System.out.println("4. Exit");

            System.out.print("Choose an option: ");
            int choice = console.nextInt();

            switch (choice) {
                case 4:
                    running = false;
                    System.out.println("Thanks for using Grade Analyzer!");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
        console.close();
    }
}`

const GRADES_ENTER = j`
                case 1:
                    System.out.print("How many grades do you want to enter? ");
                    numberOfGrades = console.nextInt();
                    if (numberOfGrades <= 0) {
                        System.out.println("You must enter at least one grade.");
                        break;
                    }
                    total = 0;
                    for (int i = 1; i <= numberOfGrades; i++) {
                        System.out.print("Enter grade " + i + " (0-100): ");
                        double grade = console.nextDouble();
                        if (grade >= 0 && grade <= 100) {
                            total += grade;
                        } else {
                            System.out.println("Invalid grade. Please enter a number from 0 to 100.");
                            i--;
                        }
                    }
                    System.out.printf(
                        "All grades entered successfully!%n"
                    );
                    break;`

const GRADES2 = GRADES1.replace('                case 4:', GRADES_ENTER + '\n                case 4:')

const GRADES_AVERAGE = j`
                case 2:
                    if (numberOfGrades == 0) {
                        System.out.println("You haven't entered any grades yet.");
                    }
                    else {
                        double average = total / numberOfGrades;
                        System.out.printf("Your average is: %.2f%%%n", average);
                    }
                    break;`

const GRADES3 = GRADES2.replace('                case 4:', GRADES_AVERAGE + '\n                case 4:')

const GRADES_RESULT = j`
                case 3:
                    if (numberOfGrades == 0) {
                        System.out.println("You haven't entered any grades yet.");
                    } else {
                        double average = total / numberOfGrades;
                        System.out.printf("Your average is: %.2f%%%n", average);
                        if (average >= 90) {
                            System.out.println("Excellent! A");
                        } else if (average >= 80) {
                            System.out.println("Great job! B");
                        } else if (average >= 70) {
                            System.out.println("Good work! C");
                        } else if (average >= 60) {
                            System.out.println("You passed! D");
                        } else {
                            System.out.println("You need to improve.");
                        }
                    }
                    break;`

const GRADES4 = GRADES3.replace('                case 4:', GRADES_RESULT + '\n                case 4:')

const GRADES5 = j`
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        double total = 0;
        int numberOfGrades = 0;
        boolean running = true;

        System.out.println("================================");
        System.out.println(" STUDENT GRADE ANALYZER");
        System.out.println("================================");

        while (running) {
            System.out.println("\n1. Enter Grades");
            System.out.println("2. View Average");
            System.out.println("3. Check Result");
            System.out.println("4. Exit");

            try {
                System.out.print("Choose an option: ");
                int choice = console.nextInt();

                switch (choice) {
                    case 1:
                        System.out.print("How many grades do you want to enter? ");
                        numberOfGrades = console.nextInt();
                        if (numberOfGrades <= 0) {
                            System.out.println("You must enter at least one grade.");
                            break;
                        }
                        total = 0;
                        for (int i = 1; i <= numberOfGrades; i++) {
                            System.out.print("Enter grade " + i + " (0-100): ");
                            double grade = console.nextDouble();
                            if (grade >= 0 && grade <= 100) {
                                total += grade;
                            } else {
                                System.out.println("Invalid grade. Please enter a number from 0 to 100.");
                                i--;
                            }
                        }
                        System.out.printf(
                            "All grades entered successfully!%n"
                        );
                        break;
                    case 2:
                        if (numberOfGrades == 0) {
                            System.out.println("You haven't entered any grades yet.");
                        }
                        else {
                            double average = total / numberOfGrades;
                            System.out.printf("Your average is: %.2f%%%n", average);
                        }
                        break;
                    case 3:
                        if (numberOfGrades == 0) {
                            System.out.println("You haven't entered any grades yet.");
                        } else {
                            double average = total / numberOfGrades;
                            System.out.printf("Your average is: %.2f%%%n", average);
                            if (average >= 90) {
                                System.out.println("Excellent! A");
                            } else if (average >= 80) {
                                System.out.println("Great job! B");
                            } else if (average >= 70) {
                                System.out.println("Good work! C");
                            } else if (average >= 60) {
                                System.out.println("You passed! D");
                            } else {
                                System.out.println("You need to improve.");
                            }
                        }
                        break;
                    case 4:
                        running = false;
                        System.out.println("Thanks for using Grade Analyzer!");
                        break;
                    default:
                        System.out.println("Invalid option.");
                }
            } catch (Exception e) {
                System.out.println("Invalid input. Please enter a number.");
                console.next();
            }
        }
        console.close();
    }
}`

const GRADES_STAGES: FinalStage[] = [
  {
    id: 'grades-1',
    title: 'The Menu',
    concepts: ['Scanner', 'while loop', 'boolean flag', 'switch'],
    story: 'Welcome to your final project! We are building a grade analyzer: type in your marks, and it works out your average and your letter grade. First, the menu.',
    instructions: [
      'Make a `double` called `total` (0), an `int` called `numberOfGrades` (0) and a `boolean` called `running` (`true`).',
      'Write a `while (running)` loop. Inside it, print the menu with four `println` lines: `"\\n1. Enter Grades"`, `"2. View Average"`, `"3. Check Result"` and `"4. Exit"`.',
      'Print `Choose an option: ` with `print`, then read `int choice = console.nextInt();`',
      'Use a `switch` on `choice`. `case 4` sets `running` to `false` and prints `Thanks for using Grade Analyzer!`. The `default` prints `Invalid option.`. After the loop, call `console.close();`',
    ],
    starter: j`
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        // TODO 1: make total (double, 0), numberOfGrades (int, 0) and running (boolean, true)

        System.out.println("================================");
        System.out.println(" STUDENT GRADE ANALYZER");
        System.out.println("================================");

        // TODO 2: while running is true, print the menu and read the choice with console.nextInt()
        // TODO 3: switch on choice. Case 4 says goodbye and stops the loop. The default prints "Invalid option."

        console.close();
    }
}`,
    solution: GRADES1,
    tests: [
      { label: 'exit straight away', stdin: '4\n' },
      { label: 'a wrong option, then exit', stdin: '8\n4\n' },
      { label: 'options we have not built yet', stdin: '1\n3\n4\n' },
    ],
    hints: [
      'The loop keeps running while `running` is `true`. Setting it to `false` in case 4 is what lets the program end.',
      'Do not forget `break;` at the end of case 4, or Java falls through into the default.',
    ],
    mustInclude: [
      { pattern: 'while\\s*\\(\\s*running\\s*\\)', message: 'Use a `while (running)` loop for the menu.' },
      { pattern: 'switch\\s*\\(\\s*choice\\s*\\)', message: 'Use a `switch` on `choice`.' },
    ],
    explain: [MENU_EXPLAIN.flag('running'), MENU_EXPLAIN.switch, MENU_EXPLAIN.print],
  },
  {
    id: 'grades-2',
    title: 'Enter Grades',
    concepts: ['for loop', 'Logical operators', 'Input validation', 'printf'],
    story: 'Option 1 asks how many grades you have, then reads them one by one. Any grade outside 0 to 100 is a typo, so we ask for that one again.',
    instructions: [
      'Add `case 1` above case 4. Print `How many grades do you want to enter? ` and read `numberOfGrades = console.nextInt();`',
      'If `numberOfGrades <= 0`, print `You must enter at least one grade.` and `break;` straight away.',
      'Otherwise set `total = 0;` and write `for (int i = 1; i <= numberOfGrades; i++)`. Inside, print `"Enter grade " + i + " (0-100): "` and read `double grade = console.nextDouble();`',
      'If `grade >= 0 && grade <= 100`, add it with `total += grade;`. Otherwise print `Invalid grade. Please enter a number from 0 to 100.` and do `i--;` so the same grade number is asked again.',
      'After the loop, print `All grades entered successfully!` with `System.out.printf("All grades entered successfully!%n");` and `break;`',
    ],
    starter: withTodo(GRADES1, 'case 4:', [
      '// TODO: case 1 asks how many grades, then uses a for loop to read each one.',
      '//       Only grades from 0 to 100 count. For a bad one, print the message and do i--',
    ]),
    solution: GRADES2,
    tests: [
      { label: 'three good grades', stdin: '1\n3\n90\n80\n70\n4\n' },
      { label: 'zero grades', stdin: '1\n0\n4\n' },
      { label: 'two bad grades along the way', stdin: '1\n2\n150\n95\n-5\n60\n4\n' },
    ],
    hints: [
      '`i--;` undoes the `i++` that is about to happen, so the loop asks for the same grade number again.',
      '`grade >= 0 && grade <= 100` is true only when the grade is inside the range: not below 0 and not above 100.',
      'We set `total = 0;` before the loop so entering a new set of grades starts fresh.',
    ],
    mustInclude: [
      { pattern: 'for\\s*\\(\\s*int\\s+i\\s*=\\s*1', message: 'Use a `for (int i = 1; ...)` loop to read the grades.' },
      { pattern: 'i\\s*--', message: 'Use `i--;` to ask for a bad grade again.' },
      { pattern: '&&', message: 'Check the range with `grade >= 0 && grade <= 100`.' },
    ],
    explain: [
      {
        title: 'A for loop that counts the grades',
        body: 'We know how many grades there are, so a for loop fits perfectly. `i` starts at 1 and goes up to `numberOfGrades`, and we use it in the prompt so the user sees "Enter grade 1", "Enter grade 2", and so on.',
      },
      {
        title: 'The i-- trick',
        body: 'When a grade is invalid, we do not want to move on to the next one. `i--;` takes 1 away from `i`, and then the loop\'s `i++` adds it straight back. The result: `i` stays the same, and we ask for that grade again.',
        code: j`
// i is 2 and the user typed 150
i--;   // i is now 1
// the loop runs i++, so i is 2 again
// "Enter grade 2 (0-100): " is asked again`,
      },
      {
        title: 'break inside an if',
        body: 'The `break;` inside `if (numberOfGrades <= 0)` leaves the whole switch case early, so we never reach the for loop. It is a quick way to say "nothing to do here".',
      },
    ],
  },
  {
    id: 'grades-3',
    title: 'The Average',
    concepts: ['Division', 'printf with %%', 'if / else'],
    story: 'Now option 2 can work out the average. We just have to be careful not to divide by zero if no grades were entered yet.',
    instructions: [
      'Add `case 2` above case 4.',
      'If `numberOfGrades == 0`, print `You haven\'t entered any grades yet.`',
      'Otherwise work out `double average = total / numberOfGrades;` and print it with `System.out.printf("Your average is: %.2f%%%n", average);`. End the case with `break;`',
    ],
    starter: withTodo(GRADES2, 'case 4:', ['// TODO: case 2 prints the average with printf, or a message if there are no grades yet']),
    solution: GRADES3,
    tests: [
      { label: 'no grades yet, then two grades', stdin: '2\n1\n2\n85\n90\n2\n4\n' },
      { label: 'one grade', stdin: '1\n1\n73.5\n2\n4\n' },
      { label: 'three grades', stdin: '1\n3\n100\n90\n81\n2\n4\n' },
    ],
    hints: [
      'In printf, `%%` prints a real percent sign. So `%.2f%%%n` is: the number with 2 decimals, then `%`, then a new line.',
      '`total` is a double, so `total / numberOfGrades` is real division and keeps the decimals.',
    ],
    mustInclude: [
      { pattern: 'total\\s*/\\s*numberOfGrades', message: 'Work out the average as `total / numberOfGrades`.' },
      { pattern: '%%', message: 'Print the percent sign with `%%` in printf.' },
    ],
    explain: [
      {
        title: 'Printing a percent sign with printf',
        body: 'In printf, `%` starts a placeholder, like `%.2f` or `%n`. So how do we print an actual percent sign? We write it twice: `%%`.',
        code: j`
double average = 87.5;
System.out.printf("Your average is: %.2f%%%n", average);
// Your average is: 87.50%`,
      },
      {
        title: 'Why we check for zero first',
        body: 'An average divides by the number of grades. If there are no grades, that would be dividing by zero, which does not make sense. So we check `numberOfGrades == 0` first and print a friendly message instead.',
      },
    ],
  },
  {
    id: 'grades-4',
    title: 'Letter Results',
    concepts: ['else if chains', 'Relational operators'],
    story: 'Option 3 shows the average again and turns it into a letter grade, from an A all the way down to "You need to improve."',
    instructions: [
      'Add `case 3` above case 4. Start it just like case 2: the same "no grades yet" check, the same `average`, and the same printf line.',
      'Then, still inside the else, add an if / else if chain: `average >= 90` prints `Excellent! A`, `>= 80` prints `Great job! B`, `>= 70` prints `Good work! C`, `>= 60` prints `You passed! D`.',
      'The final `else` prints `You need to improve.`. End the case with `break;`',
    ],
    starter: withTodo(GRADES3, 'case 4:', ['// TODO: case 3 prints the average like case 2 does, then the letter result (A, B, C, D or "improve")']),
    solution: GRADES4,
    tests: [
      { label: 'an A', stdin: '1\n3\n95\n92\n90\n3\n4\n' },
      { label: 'below 60', stdin: '1\n2\n50\n55\n3\n4\n' },
      { label: 'no grades, then a C', stdin: '3\n1\n1\n75\n3\n4\n' },
      { label: 'a D, right on the line', stdin: '1\n2\n60\n60\n3\n4\n' },
    ],
    hints: [
      'Start with the highest grade. An average of 95 is also `>= 80`, so `>= 90` has to be checked first.',
      'Each `else if` only runs if every check above it was false, so `>= 80` really means "80 up to 89.99".',
    ],
    mustInclude: [
      { pattern: 'average\\s*>=\\s*90', message: 'Check `average >= 90` for an A.' },
      { pattern: 'average\\s*>=\\s*60', message: 'Check `average >= 60` for a D.' },
    ],
    explain: [
      {
        title: 'Reading an else if chain from the top',
        body: 'Java goes down the chain and runs the first block whose condition is true, then skips the rest. That is why we start with 90. An average of 85 fails `>= 90`, passes `>= 80`, prints `Great job! B` and stops there.',
      },
      {
        title: 'Why case 3 repeats the average',
        body: 'Case 2 and case 3 are separate paths through the switch, so each one works out `average` for itself. A variable declared inside one case\'s braces is not visible in another.',
      },
    ],
  },
  {
    id: 'grades-5',
    title: 'Crash-Proof Input',
    concepts: ['try / catch', 'Exception', 'console.next()'],
    story: 'Type `abc` at the menu and the analyzer crashes. Let us wrap the menu in try and catch so a typo just gets a friendly message.',
    instructions: [
      'Put everything from `System.out.print("Choose an option: ");` to the end of the switch inside a `try { ... }` block.',
      'Right after it, add `catch (Exception e) { ... }`. Inside, print `Invalid input. Please enter a number.` and then call `console.next();` to throw away the bad input.',
      'Leave `console.close();` after the loop, outside the try.',
    ],
    starter: withTodo(GRADES4, 'System.out.print("Choose an option: ");', [
      '// TODO: put the prompt, the nextInt() and the whole switch inside try { }',
      '//       then catch (Exception e): print "Invalid input. Please enter a number." and call console.next();',
    ]),
    solution: GRADES5,
    tests: [
      { label: 'a word at the menu', stdin: 'abc\n4\n' },
      { label: 'a word for how many grades', stdin: '1\ntwo\n1\n1\n88\n3\n4\n' },
      { label: 'typo, then a full analysis', stdin: 'x\n1\n2\n70\n90\n3\n4\n' },
    ],
    hints: [
      'The shape is `try { ...menu code... } catch (Exception e) { ... }`. The catch starts right where the try block closes.',
      'Without `console.next();`, the bad word stays in the input, so the next `nextInt()` reads it again and fails again, forever.',
    ],
    mustInclude: [
      { pattern: '\\btry\\b', message: 'Put the menu code inside a `try` block.' },
      { pattern: 'catch\\s*\\(\\s*Exception\\s+\\w+\\s*\\)', message: 'Catch the problem with `catch (Exception e)`.' },
      { pattern: 'console\\.next\\s*\\(\\s*\\)', message: 'Throw the bad input away with `console.next();`' },
    ],
    explain: [CRASH_EXPLAIN.tryCatch, CRASH_EXPLAIN.next, CRASH_EXPLAIN.exception],
  },
]

// ------------------------------------------------------------------ the list

export const PROJECTS: FinalProject[] = [
  {
    id: 'cart',
    title: 'Shopping Cart',
    tagline: 'Add items, see your total, and check out with tax.',
    pitch: 'A self checkout for your terminal. Add items with a price and quantity, check the running total, and pay with 13% tax.',
    icon: 'cart',
    concepts: ['while loop', 'switch', 'nextInt and nextDouble', 'printf', 'try / catch'],
    videoUrl: 'https://www.youtube.com/watch?v=7E6E7pmqgWk',
    stages: CART_STAGES,
  },
  {
    id: 'guesser',
    title: 'Number Guesser',
    tagline: 'A two player guessing game with 10 tries.',
    pitch: 'Player 1 hides a number and Player 2 has 10 tries to find it, with "too high" and "too low" clues along the way.',
    icon: 'target',
    concepts: ['while loop', 'if / else if', 'break', 'InputMismatchException', 'try / catch'],
    videoUrl: 'https://www.youtube.com/watch?v=MfOfl0AHAEs',
    stages: GUESSER_STAGES,
  },
  {
    id: 'bank',
    title: 'Mini Banking',
    tagline: 'Check your balance, deposit and withdraw.',
    pitch: 'A little bank machine. Start with $1000, then deposit and withdraw money, with checks for bad amounts and insufficient funds.',
    icon: 'bank',
    concepts: ['while loop', 'switch', 'else if', 'printf', 'try / catch'],
    videoUrl: 'https://www.youtube.com/watch?v=8xzfRMdSKVs',
    stages: BANK_STAGES,
  },
  {
    id: 'grades',
    title: 'Grade Analyzer',
    tagline: 'Enter your marks and get your average and letter grade.',
    pitch: 'Type in your grades, and it works out your average and your letter grade. Bad marks like 150 get caught and asked again.',
    icon: 'graduation',
    concepts: ['for loop', 'switch', 'else if chains', 'printf', 'try / catch'],
    videoUrl: 'https://www.youtube.com/watch?v=_WpZFcm-4Zg',
    stages: GRADES_STAGES,
  },
]

export const PROJECT_IDS = PROJECTS.map((p) => p.id)

export function getProject(id: ProjectId | null | undefined): FinalProject | undefined {
  return PROJECTS.find((p) => p.id === id)
}

/** How many stages of `project` are done. */
export function stagesDoneIn(project: FinalProject, stagesDone: string[]): number {
  return project.stages.filter((s) => stagesDone.includes(s.id)).length
}

/** Every stage of every project, for tests and lookups. */
export const ALL_PROJECT_STAGES: FinalStage[] = PROJECTS.flatMap((p) => p.stages)
