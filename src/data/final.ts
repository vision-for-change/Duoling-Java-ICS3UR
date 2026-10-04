import { j } from './helpers'
import type { FinalStage } from './types'

/**
 * Java Final Challenge: "Byte's Café Kiosk".
 * Each stage builds on the previous one, and every stage can be opened in any order.
 * The starter code of a stage is the reference solution of the stage before, plus TODO comments.
 * Tests without an explicit `output` are compared against the reference solution's output
 * for the same input, so the prompts and messages in the instructions have to match exactly.
 */

const STAGE1 = j`
public class Kiosk {
    public static void main(String[] args) {
        final double LATTE = 3.75;
        final double MOCHA = 4.25;
        final double TEA = 2.50;

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);
    }
}`

const STAGE2 = j`
import java.util.Scanner;

public class Kiosk {
    public static void main(String[] args) {
        final double LATTE = 3.75;
        final double MOCHA = 4.25;
        final double TEA = 2.50;
        Scanner console = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice;
        do {
            System.out.print("Choose a drink (1-3): ");
            choice = console.nextInt();
            if (choice < 1 || choice > 3) {
                System.out.println("Pick 1, 2 or 3.");
            }
        } while (choice < 1 || choice > 3);

        String drink;
        double price;
        switch (choice) {
            case 1:
                drink = "Latte";
                price = LATTE;
                break;
            case 2:
                drink = "Mocha";
                price = MOCHA;
                break;
            default:
                drink = "Tea";
                price = TEA;
        }
        System.out.println("You picked " + drink);
    }
}`

const STAGE3 = j`
import java.util.InputMismatchException;
import java.util.Scanner;

public class Kiosk {
    public static void main(String[] args) {
        final double LATTE = 3.75;
        final double MOCHA = 4.25;
        final double TEA = 2.50;
        Scanner console = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            try {
                choice = console.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } catch (InputMismatchException e) {
                console.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        switch (choice) {
            case 1:
                drink = "Latte";
                price = LATTE;
                break;
            case 2:
                drink = "Mocha";
                price = MOCHA;
                break;
            default:
                drink = "Tea";
                price = TEA;
        }
        System.out.println("You picked " + drink);

        int qty = 0;
        while (qty < 1 || qty > 10) {
            System.out.print("How many? ");
            try {
                qty = console.nextInt();
                if (qty < 1 || qty > 10) {
                    System.out.println("We can make 1 to 10.");
                }
            } catch (InputMismatchException e) {
                console.next();
                System.out.println("Whole numbers please.");
            }
        }
        System.out.println("Order: " + qty + " x " + drink);
    }
}`

const STAGE4 = j`
import java.util.InputMismatchException;
import java.util.Scanner;

public class Kiosk {
    public static void main(String[] args) {
        final double LATTE = 3.75;
        final double MOCHA = 4.25;
        final double TEA = 2.50;
        Scanner console = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            try {
                choice = console.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } catch (InputMismatchException e) {
                console.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        switch (choice) {
            case 1:
                drink = "Latte";
                price = LATTE;
                break;
            case 2:
                drink = "Mocha";
                price = MOCHA;
                break;
            default:
                drink = "Tea";
                price = TEA;
        }
        System.out.println("You picked " + drink);

        int qty = 0;
        while (qty < 1 || qty > 10) {
            System.out.print("How many? ");
            try {
                qty = console.nextInt();
                if (qty < 1 || qty > 10) {
                    System.out.println("We can make 1 to 10.");
                }
            } catch (InputMismatchException e) {
                console.next();
                System.out.println("Whole numbers please.");
            }
        }
        System.out.println("Order: " + qty + " x " + drink);

        System.out.print("Member? (y/n): ");
        char answer = console.next().charAt(0);
        boolean member = answer == 'y' || answer == 'Y';
        int discountPct = 0;
        if (member) {
            if (qty >= 5) {
                discountPct = 20;
            } else {
                discountPct = 10;
            }
        } else if (qty >= 5) {
            discountPct = 5;
        }
        System.out.println("Discount: " + discountPct + "%");
    }
}`

const STAGE5 = j`
import java.util.InputMismatchException;
import java.util.Scanner;

public class Kiosk {
    public static void main(String[] args) {
        final double LATTE = 3.75;
        final double MOCHA = 4.25;
        final double TEA = 2.50;
        final double TAX_RATE = 0.08;
        Scanner console = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            try {
                choice = console.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } catch (InputMismatchException e) {
                console.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        switch (choice) {
            case 1:
                drink = "Latte";
                price = LATTE;
                break;
            case 2:
                drink = "Mocha";
                price = MOCHA;
                break;
            default:
                drink = "Tea";
                price = TEA;
        }
        System.out.println("You picked " + drink);

        int qty = 0;
        while (qty < 1 || qty > 10) {
            System.out.print("How many? ");
            try {
                qty = console.nextInt();
                if (qty < 1 || qty > 10) {
                    System.out.println("We can make 1 to 10.");
                }
            } catch (InputMismatchException e) {
                console.next();
                System.out.println("Whole numbers please.");
            }
        }
        System.out.println("Order: " + qty + " x " + drink);

        System.out.print("Member? (y/n): ");
        char answer = console.next().charAt(0);
        boolean member = answer == 'y' || answer == 'Y';
        int discountPct = 0;
        if (member) {
            if (qty >= 5) {
                discountPct = 20;
            } else {
                discountPct = 10;
            }
        } else if (qty >= 5) {
            discountPct = 5;
        }

        double subtotal = price * qty;
        double discount = Math.round(subtotal * discountPct) / 100.0;
        double afterDiscount = subtotal - discount;
        double tax = Math.round(afterDiscount * TAX_RATE * 100) / 100.0;
        double total = afterDiscount + tax;

        System.out.println("------ Receipt ------");
        System.out.printf("%-15s %6.2f%n", qty + " x " + drink, subtotal);
        if (discountPct > 0) {
            System.out.printf("%-15s %6.2f%n", "Discount " + discountPct + "%", -discount);
        }
        System.out.printf("%-15s %6.2f%n", "Tax", tax);
        System.out.printf("%-15s %6.2f%n", "TOTAL", total);
        System.out.println("Thanks for visiting Byte's Cafe!");
    }
}`

/** Replace a chunk of the previous stage's code with TODO comments to form the next starter. */
function starterFrom(previous: string, anchor: string, todo: string): string {
  const idx = previous.lastIndexOf(anchor)
  if (idx === -1) throw new Error('anchor not found: ' + anchor)
  const end = idx + anchor.length
  return previous.slice(0, end) + '\n' + todo + previous.slice(end)
}

export const finalStages: FinalStage[] = [
  {
    id: 'final-1',
    title: 'The Menu Board',
    concepts: ['Constants', 'printf', 'class Main shell'],
    story: 'Welcome to your final project! Byte has just opened a little café, and the kiosk needs a menu board. Drink prices do not change during the day, so they belong in constants.',
    instructions: [
      'Declare three `final double` constants: `LATTE` is 3.75, `MOCHA` is 4.25 and `TEA` is 2.50.',
      'After the title line, print one menu line for each drink with `printf("1. %-6s $%.2f%n", "Latte", LATTE)`. Then do the same for 2 and 3.',
      'The `%-6s` left-aligns each name in 6 characters, so all the prices line up in a neat column.',
    ],
    starter: j`
public class Kiosk {
    public static void main(String[] args) {
        // TODO 1: declare the constants LATTE (3.75), MOCHA (4.25) and TEA (2.50)

        System.out.println("=== Byte's Cafe ===");
        // TODO 2: print the three menu lines with printf
    }
}`,
    solution: STAGE1,
    tests: [{ label: 'menu board' }],
    hints: [
      'A constant looks like this: `final double LATTE = 3.75;`',
      'The first menu line is `System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);`',
    ],
    mustInclude: [
      { pattern: 'final\\s+double\\s+LATTE', message: 'Declare LATTE as a final double constant.' },
      { pattern: 'final\\s+double\\s+MOCHA', message: 'Declare MOCHA as a final double constant.' },
      { pattern: 'final\\s+double\\s+TEA', message: 'Declare TEA as a final double constant.' },
      { pattern: 'printf', message: 'Use printf for the menu lines.' },
    ],
  },
  {
    id: 'final-2',
    title: 'Take the Order',
    concepts: ['Scanner', 'do-while', 'Logical operators', 'switch'],
    story: 'Now the kiosk has to listen. A customer types the number of the drink they want, and it only makes sense if the number is 1, 2 or 3. If it is not, we ask again.',
    instructions: [
      'Add `import java.util.Scanner;` at the top, and create a Scanner called `console` near the start of `main`.',
      'Use a `do-while` loop. Inside it, print the prompt `Choose a drink (1-3): ` (with `print`, not `println`) and read `choice` with `nextInt()`.',
      'If the number is outside 1 to 3, print `Pick 1, 2 or 3.` The loop repeats while `choice < 1 || choice > 3`.',
      'After the loop, use a `switch` on `choice` to set `drink` and `price`. Case 1 is the Latte, case 2 is the Mocha, and the `default` is the Tea.',
      'Finally, print `You picked ` followed by the drink name.',
    ],
    starter: starterFrom(
      STAGE1.replace('public class Kiosk', '// TODO 1: import the Scanner class\n\npublic class Kiosk'),
      'System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);',
      '\n        // TODO 2: create a Scanner called console (you can do this near the top of main)\n        // TODO 3: use a do-while loop to keep asking until choice is 1, 2 or 3\n        // TODO 4: use a switch to set drink and price, then print "You picked " + drink\n',
    ),
    solution: STAGE2,
    tests: [
      { label: 'a valid choice straight away', stdin: '3\n' },
      { label: '0, then 1', stdin: '0\n1\n' },
      { label: '7, 5, then 2', stdin: '7\n5\n2\n' },
    ],
    hints: [
      'Declare `int choice;` before the loop, so it is still around when the loop is finished.',
      'The condition at the bottom says when to repeat: `} while (choice < 1 || choice > 3);`',
      'Declare `String drink;` and `double price;` before the switch, and give both of them a value in every case.',
    ],
    mustInclude: [
      { pattern: '(while|do)\\b', message: 'Use a loop to keep asking until the choice is valid.' },
      { pattern: 'new\\s+Scanner', message: 'Create a Scanner to read what the customer types.' },
    ],
  },
  {
    id: 'final-3',
    title: 'Crash-Proof Orders',
    concepts: ['try / catch', 'InputMismatchException', 'Loops', 'Range checks'],
    story: 'Here is the problem with stage 2: if a customer types a word instead of a number, the kiosk crashes. Real programs do not do that. Let us fix it with try and catch, and then ask how many drinks they want too.',
    instructions: [
      'Import `java.util.InputMismatchException`.',
      'Change the drink question so the `nextInt()` is inside a `try` block. In the `catch (InputMismatchException e)` block, throw the bad word away with `console.next();` and print `Numbers only!`',
      'After the drink is chosen, ask `How many? ` in a loop that repeats while `qty < 1 || qty > 10`. Read the quantity inside a `try` block.',
      'If the quantity is out of range, print `We can make 1 to 10.` If the customer types a word, throw it away and print `Whole numbers please.`',
      'When you have a good quantity, print `Order: ` followed by the quantity, then ` x ` and the drink name.',
    ],
    starter: starterFrom(
      STAGE2.replace('import java.util.Scanner;', '// TODO 1: also import java.util.InputMismatchException\nimport java.util.Scanner;'),
      'System.out.println("You picked " + drink);',
      '\n        // TODO 2: go back and make the drink question crash-proof with try / catch\n        // TODO 3: ask "How many? " until qty is 1 to 10 (use try / catch for words)\n        // TODO 4: print "Order: " + qty + " x " + drink\n',
    ),
    solution: STAGE3,
    tests: [
      { label: 'a word, then a good drink and quantity', stdin: 'coffee\n2\n3\n' },
      { label: 'bad quantities, then a good one', stdin: '1\nlots\n12\n3\n' },
      { label: 'zero, then 1', stdin: '3\n0\n1\n' },
      { label: 'typos everywhere', stdin: 'x\n9\n2\nten\n0\n10\n' },
    ],
    hints: [
      'Remember that a failed `nextInt()` leaves the bad word in the input. Call `console.next()` inside the `catch`, or the loop will read it again forever.',
      'The shape is: `while (qty < 1 || qty > 10) { System.out.print("How many? "); try { ... } catch (InputMismatchException e) { ... } }`',
      'Start both numbers at 0. Zero is not valid, so each loop is guaranteed to run at least once.',
    ],
    mustInclude: [
      { pattern: '\\btry\\b', message: 'Read the numbers inside a try block.' },
      { pattern: 'catch\\s*\\(\\s*InputMismatchException', message: 'Catch InputMismatchException.' },
    ],
  },
  {
    id: 'final-4',
    title: 'Member Deals',
    concepts: ['Nested if', 'Logical operators', 'char comparisons'],
    story: 'Byte\'s Café likes to reward its regulars. Members get 10% off, or 20% off when they order 5 or more drinks. Customers who are not members still get 5% off for big orders of 5 or more.',
    instructions: [
      'Print `Member? (y/n): ` and read the answer with `char answer = console.next().charAt(0);`',
      'The customer is a member if the answer is `\'y\'` or `\'Y\'`. Compare with `==` and join the two checks with `||`.',
      'Use a **nested if** to choose `discountPct`. A member gets 20 when `qty >= 5` and 10 otherwise. Someone who is not a member gets 5 when `qty >= 5`, and 0 otherwise.',
      'Print `Discount: ` followed by the percentage and a `%` sign.',
    ],
    starter: starterFrom(
      STAGE3,
      'System.out.println("Order: " + qty + " x " + drink);',
      '\n        // TODO 1: ask "Member? (y/n): " and read the answer as a char\n        // TODO 2: work out discountPct (20, 10, 5 or 0) with a nested if\n        // TODO 3: print "Discount: " + discountPct + "%"\n',
    ),
    solution: STAGE4,
    tests: [
      { label: 'member, 3 drinks', stdin: '2\n3\ny\n' },
      { label: 'member, 6 drinks', stdin: '1\n6\nY\n' },
      { label: 'not a member, 5 drinks', stdin: '3\n5\nn\n' },
      { label: 'not a member, 2 drinks', stdin: '3\n2\nn\n' },
    ],
    hints: [
      'A char uses single quotes, like `\'y\'`. The check is `answer == \'y\' || answer == \'Y\'`.',
      'The nested if looks like this: `if (member) { if (qty >= 5) {...} else {...} } else if (qty >= 5) {...}`',
    ],
    mustInclude: [{ pattern: 'charAt\\s*\\(\\s*0\\s*\\)', message: 'Read the answer as a char with `next().charAt(0)`.' }],
  },
  {
    id: 'final-5',
    title: 'The Receipt',
    concepts: ['Math.round', 'Arithmetic', 'printf width and precision'],
    story: 'Last step, and it is a fun one. Work out the bill and print a proper receipt. Money is awkward with doubles, so we round every amount to whole cents with Math.round.',
    instructions: [
      'Add the constant `TAX_RATE` with the value 0.08. Then **replace** the `Discount:` line from stage 4 with the receipt.',
      'The `subtotal` is `price * qty`. The discount in dollars is `Math.round(subtotal * discountPct) / 100.0`. (The subtotal times the percentage is the discount in cents.)',
      'Then `afterDiscount = subtotal - discount`, `tax = Math.round(afterDiscount * TAX_RATE * 100) / 100.0`, and `total = afterDiscount + tax`.',
      'Print `------ Receipt ------`. Then print each line with `printf("%-15s %6.2f%n", label, amount)`. First the line `qty + " x " + drink` with the subtotal. Then the discount line as `"Discount " + discountPct + "%"` with `-discount`, but only if `discountPct > 0`. Then `Tax`, and finally `TOTAL`.',
      'End with the line `Thanks for visiting Byte\'s Cafe!`',
    ],
    starter: starterFrom(
      STAGE4.replace('final double TEA = 2.50;', 'final double TEA = 2.50;\n        // TODO 1: add the constant TAX_RATE (0.08)'),
      'System.out.println("Discount: " + discountPct + "%");',
      '\n        // TODO 2: remove the "Discount:" line above, and work out the subtotal, discount, tax and total\n        // TODO 3: print the receipt with printf("%-15s %6.2f%n", ...)\n',
    ),
    solution: STAGE5,
    tests: [
      { label: '3 Mochas, member', stdin: '2\n3\ny\n' },
      { label: '6 Lattes, not a member', stdin: '1\n6\nn\n' },
      { label: '2 Teas, no discount', stdin: '3\n2\nn\n' },
      { label: 'typos everywhere, 5 Mochas, member', stdin: 'x\n9\n2\nten\n0\n5\ny\n' },
    ],
    hints: [
      'Check your math with this one. 3 Mochas as a member: subtotal 12.75, discount round(127.5) / 100.0 = 1.28, tax 0.92, total 12.39.',
      'Only print the discount line inside `if (discountPct > 0) { ... }`.',
      'Build the first label with `qty + " x " + drink`, and hand it to the `%-15s` placeholder.',
    ],
    mustInclude: [
      { pattern: 'Math\\.round', message: 'Round money to cents with Math.round.' },
      { pattern: '%-15s', message: 'Use the %-15s %6.2f format for the receipt lines.' },
      { pattern: 'TAX_RATE', message: 'Use the TAX_RATE constant.' },
    ],
  },
]

export const FINAL_PROJECT = {
  title: "Byte's Café Kiosk",
  tagline: 'Build a real, crash-proof ordering program from scratch.',
  className: 'Kiosk',
}
