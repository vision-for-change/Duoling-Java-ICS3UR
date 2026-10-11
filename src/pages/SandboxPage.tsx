import { useState } from 'react'
import { FlaskConical, Info } from 'lucide-react'
import { MascotSays } from '../components/Mascot'
import { PageLayout, PageTitle } from '../components/Navbar'
import { RunnableCode } from '../components/RunnableCode'
import { j } from '../data/helpers'

const EXAMPLES: { id: string; title: string; code: string }[] = [
  {
    id: 'hello',
    title: 'Hello, ByteBrew',
    code: j`
public class Main {
    public static void main(String[] args) {
        String name = "Mr. Lauder";
        int cups = 3;
        System.out.println("Hello from " + name + "!");
        System.out.printf("I brewed %d cups of Java today.%n", cups);
    }
}`,
  },
  {
    id: 'guess',
    title: 'Guessing game',
    code: j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int secret = (int) (Math.random() * 10) + 1;
        int tries = 0;
        int guess = 0;
        System.out.println("I'm thinking of a number from 1 to 10.");
        while (guess != secret) {
            System.out.print("Your guess: ");
            if (!in.hasNextInt()) {
                System.out.println("Numbers only, please!");
                in.next();
                continue;
            }
            guess = in.nextInt();
            tries++;
            if (guess < secret) {
                System.out.println("Too low!");
            } else if (guess > secret) {
                System.out.println("Too high!");
            }
        }
        System.out.printf("Got it in %d tries!%n", tries);
    }
}`,
  },
  {
    id: 'table',
    title: 'Times table',
    code: j`
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 5; row++) {
            for (int col = 1; col <= 5; col++) {
                System.out.printf("%4d", row * col);
            }
            System.out.println();
        }
    }
}`,
  },
  {
    id: 'safe',
    title: 'Safe calculator',
    code: j`
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        try {
            System.out.print("a = ");
            int a = in.nextInt();
            System.out.print("b = ");
            int b = in.nextInt();
            System.out.println("a / b = " + a / b);
            System.out.printf("exact: %.3f%n", (double) a / b);
        } catch (InputMismatchException e) {
            System.out.println("Please type whole numbers.");
        } catch (ArithmeticException e) {
            System.out.println("You can't divide by zero!");
        }
    }
}`,
  },
  {
    id: 'blank',
    title: 'Blank program',
    code: j`
public class Main {
    public static void main(String[] args) {
        // write your code here

    }
}`,
  },
]

export function SandboxPage() {
  const [active, setActive] = useState(EXAMPLES[0].id)
  const example = EXAMPLES.find((e) => e.id === active)!
  return (
    <PageLayout
      aside={
        <>
          <div className="rounded-3xl border-2 border-espresso-100 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
              <Info size={20} className="text-sky-600" /> What runs here?
            </div>
            <p className="text-sm text-espresso-600">Byte's sandbox understands the Java you learn in ByteBrew:</p>
            <ul className="mt-2 space-y-1 text-sm text-espresso-700">
              {[
                'int, double, boolean, char, long, String',
                'operators, casting, Math methods',
                'if / else, while, do-while, for',
                'Scanner input, hasNextInt()',
                'try / catch and exceptions',
                'printf / String.format',
                'static methods and constants',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-mint-600">✓</span> {t}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-espresso-500">
              Arrays and objects aren't supported yet, and neither are the arrow-style switch cases. The sandbox will tell you so honestly instead of pretending. Snippets without a class are wrapped in <code className="font-mono">main</code> automatically.
            </p>
          </div>
          <MascotSays mood="thinking" size={64}>
            Press <b>Watch it run</b> after running to step through your program line by line!
          </MascotSays>
        </>
      }
    >
      <PageTitle title="Java Sandbox" subtitle="Write, run and debug Java right in your browser." icon={<FlaskConical size={36} className="text-mint-600" />} />
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Example programs">
        {EXAMPLES.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={active === e.id}
            onClick={() => setActive(e.id)}
            className={`rounded-xl border-2 px-3 py-1.5 text-sm font-bold transition ${
              active === e.id ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-espresso-100 bg-white text-espresso-600 hover:bg-cream-100'
            }`}
          >
            {e.title}
          </button>
        ))}
      </div>
      <RunnableCode key={example.id} code={example.code} title="Main.java" consoleHeight={320} editorMaxHeight={520} />
    </PageLayout>
  )
}
