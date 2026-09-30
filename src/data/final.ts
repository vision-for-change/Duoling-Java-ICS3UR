import { j } from './helpers'
import type { FinalStage } from './types'

/**
 * Java Final Challenge: "Byte's Café Kiosk".
 * Each stage builds on the previous one. The starter code of a stage is the
 * reference solution of the stage before, plus TODO comments.
 * Tests without an explicit `output` are compared against the reference
 * solution's output for the same input.
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
        Scanner in = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            if (in.hasNextInt()) {
                choice = in.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } else {
                in.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        if (choice == 1) {
            drink = "Latte";
            price = LATTE;
        } else if (choice == 2) {
            drink = "Mocha";
            price = MOCHA;
        } else {
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
        Scanner in = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            if (in.hasNextInt()) {
                choice = in.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } else {
                in.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        if (choice == 1) {
            drink = "Latte";
            price = LATTE;
        } else if (choice == 2) {
            drink = "Mocha";
            price = MOCHA;
        } else {
            drink = "Tea";
            price = TEA;
        }
        System.out.println("You picked " + drink);

        int qty = 0;
        while (qty < 1 || qty > 10) {
            System.out.print("How many? ");
            try {
                qty = in.nextInt();
                if (qty < 1 || qty > 10) {
                    System.out.println("We can make 1 to 10.");
                }
            } catch (InputMismatchException e) {
                in.next();
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
        Scanner in = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            if (in.hasNextInt()) {
                choice = in.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } else {
                in.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        if (choice == 1) {
            drink = "Latte";
            price = LATTE;
        } else if (choice == 2) {
            drink = "Mocha";
            price = MOCHA;
        } else {
            drink = "Tea";
            price = TEA;
        }
        System.out.println("You picked " + drink);

        int qty = 0;
        while (qty < 1 || qty > 10) {
            System.out.print("How many? ");
            try {
                qty = in.nextInt();
                if (qty < 1 || qty > 10) {
                    System.out.println("We can make 1 to 10.");
                }
            } catch (InputMismatchException e) {
                in.next();
                System.out.println("Whole numbers please.");
            }
        }
        System.out.println("Order: " + qty + " x " + drink);

        System.out.print("Member? (y/n): ");
        String answer = in.next();
        boolean member = answer.equals("y") || answer.equals("Y");
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
        Scanner in = new Scanner(System.in);

        System.out.println("=== Byte's Cafe ===");
        System.out.printf("1. %-6s $%.2f%n", "Latte", LATTE);
        System.out.printf("2. %-6s $%.2f%n", "Mocha", MOCHA);
        System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);

        int choice = 0;
        while (choice < 1 || choice > 3) {
            System.out.print("Choose a drink (1-3): ");
            if (in.hasNextInt()) {
                choice = in.nextInt();
                if (choice < 1 || choice > 3) {
                    System.out.println("Pick 1, 2 or 3.");
                }
            } else {
                in.next();
                System.out.println("Numbers only!");
            }
        }

        String drink;
        double price;
        if (choice == 1) {
            drink = "Latte";
            price = LATTE;
        } else if (choice == 2) {
            drink = "Mocha";
            price = MOCHA;
        } else {
            drink = "Tea";
            price = TEA;
        }
        System.out.println("You picked " + drink);

        int qty = 0;
        while (qty < 1 || qty > 10) {
            System.out.print("How many? ");
            try {
                qty = in.nextInt();
                if (qty < 1 || qty > 10) {
                    System.out.println("We can make 1 to 10.");
                }
            } catch (InputMismatchException e) {
                in.next();
                System.out.println("Whole numbers please.");
            }
        }
        System.out.println("Order: " + qty + " x " + drink);

        System.out.print("Member? (y/n): ");
        String answer = in.next();
        boolean member = answer.equals("y") || answer.equals("Y");
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
    concepts: ['Variables', 'Constants', 'printf'],
    story: 'Byte just opened a tiny café for lions and humans! First, the kiosk needs a menu board. Prices never change during the day, so they should be constants.',
    instructions: [
      'Declare three `final double` constants: `LATTE` = 3.75, `MOCHA` = 4.25 and `TEA` = 2.50.',
      'After the title line, print one menu line per drink with `printf("1. %-6s $%.2f%n", "Latte", LATTE)` (and 2 / 3 for the others).',
      '`%-6s` left-aligns the name in 6 characters so the prices line up.',
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
      'A constant looks like: `final double LATTE = 3.75;`',
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
    concepts: ['Scanner', 'hasNextInt()', 'while loops', 'Logical operators', 'if / else if'],
    story: 'Customers type the number of the drink they want. But people make typos, so the kiosk must never crash, and it must only accept 1, 2 or 3.',
    instructions: [
      'Add `import java.util.Scanner;` at the top and create a Scanner after the constants.',
      'Loop while `choice < 1 || choice > 3`. Each time, print the prompt `Choose a drink (1-3): ` (use print, not println).',
      'If the input is not a whole number (`hasNextInt()` is false), discard it with `next()` and print `Numbers only!`.',
      'If it is a number outside 1 to 3, print `Pick 1, 2 or 3.`',
      'After the loop, use an if / else if / else chain to set `drink` and `price`, then print `You picked ` + drink.',
    ],
    starter: starterFrom(
      STAGE1.replace('public class Kiosk', '// TODO 1: import the Scanner class\n\npublic class Kiosk'),
      'System.out.printf("3. %-6s $%.2f%n", "Tea", TEA);',
      '\n        // TODO 2: create a Scanner (you can do this near the top of main)\n        // TODO 3: loop until choice is 1, 2 or 3 (use hasNextInt to reject words)\n        // TODO 4: set drink and price with if / else if / else, then print "You picked " + drink\n',
    ),
    solution: STAGE2,
    tests: [
      { label: 'coffee, 7, then 2', stdin: 'coffee\n7\n2\n' },
      { label: 'straight to 3', stdin: '3\n' },
      { label: '0, then 1', stdin: '0\n1\n' },
    ],
    hints: [
      'Start with `int choice = 0;`. Because 0 is invalid, the loop runs at least once.',
      'Inside the loop: `if (in.hasNextInt()) { choice = in.nextInt(); ... } else { in.next(); System.out.println("Numbers only!"); }`',
      'Declare `String drink;` and `double price;` before the if / else if chain that sets them.',
    ],
    mustInclude: [
      { pattern: 'hasNextInt', message: 'Use hasNextInt() so words don\'t crash the kiosk.' },
      { pattern: '(while|do)\\b', message: 'Use a loop to keep asking until the choice is valid.' },
    ],
  },
  {
    id: 'final-3',
    title: 'How Many?',
    concepts: ['try / catch', 'InputMismatchException', 'Loops', 'Range checks'],
    story: 'Now the kiosk asks how many drinks to make. This time, handle bad input with try/catch. Byte can make between 1 and 10 drinks at once.',
    instructions: [
      'Import `java.util.InputMismatchException`.',
      'Loop while `qty < 1 || qty > 10`, printing the prompt `How many? ` each time.',
      'Read the quantity with `nextInt()` inside a `try` block. If it\'s out of range, print `We can make 1 to 10.`',
      'In the `catch (InputMismatchException e)` block, discard the bad token and print `Whole numbers please.`',
      'After the loop, print `Order: ` + qty + ` x ` + drink.',
    ],
    starter: starterFrom(
      STAGE2.replace('import java.util.Scanner;', '// TODO 1: also import java.util.InputMismatchException\nimport java.util.Scanner;'),
      'System.out.println("You picked " + drink);',
      '\n        // TODO 2: ask "How many? " until qty is 1 to 10 (use try/catch for words)\n        // TODO 3: print "Order: " + qty + " x " + drink\n',
    ),
    solution: STAGE3,
    tests: [
      { label: 'lots, 12, then 3', stdin: '1\nlots\n12\n3\n' },
      { label: 'straight to 10', stdin: '2\n10\n' },
      { label: 'zero, then 1', stdin: '3\n0\n1\n' },
    ],
    hints: [
      'Remember: a failed nextInt() leaves the word in the input, so call `in.next()` inside catch.',
      'Structure: `while (qty < 1 || qty > 10) { System.out.print("How many? "); try { ... } catch (InputMismatchException e) { ... } }`',
    ],
    mustInclude: [
      { pattern: '\\btry\\b', message: 'Read the quantity inside a try block.' },
      { pattern: 'catch\\s*\\(\\s*InputMismatchException', message: 'Catch InputMismatchException.' },
    ],
  },
  {
    id: 'final-4',
    title: 'Member Deals',
    concepts: ['Nested if', 'Logical operators', 'String.equals'],
    story: 'Byte\'s Café rewards loyal customers. Members get 10% off, or 20% off when they order 5 or more drinks. Non-members get 5% off for big orders of 5 or more.',
    instructions: [
      'Print `Member? (y/n): ` and read one word with `next()`.',
      'A customer is a member if the answer equals `"y"` or `"Y"` (use `.equals` and `||`).',
      'Use a **nested if** to pick `discountPct`: member → 20 if qty >= 5, else 10. Not a member → 5 if qty >= 5, else 0.',
      'Print `Discount: ` + discountPct + `%`.',
    ],
    starter: starterFrom(
      STAGE3,
      'System.out.println("Order: " + qty + " x " + drink);',
      '\n        // TODO 1: ask "Member? (y/n): " and read the answer with next()\n        // TODO 2: work out discountPct (20, 10, 5 or 0) with a nested if\n        // TODO 3: print "Discount: " + discountPct + "%"\n',
    ),
    solution: STAGE4,
    tests: [
      { label: 'member, 3 drinks', stdin: '2\n3\ny\n' },
      { label: 'member, 6 drinks', stdin: '1\n6\nY\n' },
      { label: 'not a member, 5 drinks', stdin: '3\n5\nn\n' },
      { label: 'not a member, 2 drinks', stdin: '3\n2\nn\n' },
    ],
    hints: [
      'Compare Strings with `.equals`: `answer.equals("y") || answer.equals("Y")`.',
      'The nested if: `if (member) { if (qty >= 5) {...} else {...} } else if (qty >= 5) {...}`',
    ],
    mustInclude: [{ pattern: '\\.equals\\s*\\(', message: 'Compare the answer with .equals, not ==.' }],
  },
  {
    id: 'final-5',
    title: 'The Receipt',
    concepts: ['Math.round', 'Arithmetic', 'printf width & precision'],
    story: 'Last step: calculate the bill and print a beautiful receipt! Money is tricky with doubles, so round every amount to whole cents with Math.round.',
    instructions: [
      'Add the constant `TAX_RATE` = 0.08. **Replace** the `Discount:` line from stage 4 with the receipt.',
      '`subtotal = price * qty`. The discount in dollars is `Math.round(subtotal * discountPct) / 100.0` (subtotal × pct is the discount in cents!).',
      '`afterDiscount = subtotal - discount`, `tax = Math.round(afterDiscount * TAX_RATE * 100) / 100.0`, `total = afterDiscount + tax`.',
      'Print `------ Receipt ------`, then each line with `printf("%-15s %6.2f%n", label, amount)`: `qty + " x " + drink` with the subtotal, the discount line (only if discountPct > 0) as `"Discount " + discountPct + "%"` with `-discount`, then `Tax` and `TOTAL`.',
      'Finish with `Thanks for visiting Byte\'s Cafe!`',
    ],
    starter: starterFrom(
      STAGE4.replace('final double TEA = 2.50;', 'final double TEA = 2.50;\n        // TODO 1: add the constant TAX_RATE (0.08)'),
      'System.out.println("Discount: " + discountPct + "%");',
      '\n        // TODO 2: remove the "Discount:" line above and compute subtotal, discount, tax and total\n        // TODO 3: print the receipt with printf("%-15s %6.2f%n", ...)\n',
    ),
    solution: STAGE5,
    tests: [
      { label: '3 Mochas, member', stdin: '2\n3\ny\n' },
      { label: '6 Lattes, not a member', stdin: '1\n6\nn\n' },
      { label: '2 Teas, no discount', stdin: '3\n2\nn\n' },
      { label: 'typos everywhere, 5 Mochas, member', stdin: 'x\n9\n2\nten\n0\n5\ny\n' },
    ],
    hints: [
      'Example for 3 Mochas as a member: subtotal 12.75, discount round(127.5) / 100.0 = 1.28, tax 0.92, total 12.39.',
      'Only print the discount line inside `if (discountPct > 0) { ... }`.',
      'Build the first label with `qty + " x " + drink` and pass it to `%-15s`.',
    ],
    mustInclude: [
      { pattern: 'Math\\.round', message: 'Round money to cents with Math.round.' },
      { pattern: '%-15s', message: 'Use the %-15s %6.2f format for receipt lines.' },
      { pattern: 'TAX_RATE', message: 'Use the TAX_RATE constant.' },
    ],
  },
]

export const FINAL_PROJECT = {
  title: "Byte's Café Kiosk",
  tagline: 'Build a real, crash-proof ordering program from scratch.',
  className: 'Kiosk',
}
