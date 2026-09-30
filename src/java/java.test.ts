import { describe, expect, it } from 'vitest'
import { runJava } from './index'

/** Expected stdout for programs that should run successfully. */
const OK_CASES: [string, string, string?][] = [
  ['System.out.println("Hello, World!");', 'Hello, World!\n'],
  ['int x = 5; int y = 3; System.out.println(x + y);', '8\n'],
  ['int a = 7, b = 2; System.out.println(a / b); System.out.println(a % b); System.out.println(a / 2.0);', '3\n1\n3.5\n'],
  ['System.out.println(-7 / 2); System.out.println(-7 % 3); System.out.println(7 % -3);', '-3\n-1\n1\n'],
  ['double d = 10 / 4; System.out.println(d);', '2.0\n'],
  ['System.out.println(1 + 2 + "3" + 4 + 5);', '3345\n'],
  ["System.out.println('a' + 'b' + \"c\");", '195c\n'],
  ["System.out.println(\"c\" + 'a' + 'b');", 'cab\n'],
  ['System.out.println(0.1 + 0.2);', '0.30000000000000004\n'],
  ['System.out.println(100.0 / 3);', '33.333333333333336\n'],
  ['System.out.println(1.0E7); System.out.println(1234567.0); System.out.println(0.001); System.out.println(0.0001);', '1.0E7\n1234567.0\n0.001\n1.0E-4\n'],
  ['System.out.println(Math.pow(2, 10)); System.out.println(Math.sqrt(16)); System.out.println(Math.abs(-5)); System.out.println(Math.abs(-5.5));', '1024.0\n4.0\n5\n5.5\n'],
  ['System.out.println(Math.round(2.5)); System.out.println(Math.round(-2.5)); System.out.println(Math.round(2.4));', '3\n-2\n2\n'],
  ['System.out.println(Math.max(3, 7.0)); System.out.println(Math.min(3, 7));', '7.0\n3\n'],
  ['System.out.println((int) 3.99); System.out.println((int) -3.99); System.out.println((char) 66); System.out.println((char) (\'a\' + 1));', '3\n-3\nB\nb\n'],
  ['System.out.println(Integer.MAX_VALUE + 1);', '-2147483648\n'],
  ['char ch = \'A\'; ch += 2; ch++; System.out.println(ch);', 'D\n'],
  ['int x = 5; x += 2.7; System.out.println(x);', '7\n'],
  ['int i = 0; while (i < 5) { System.out.println(i); i++; }', '0\n1\n2\n3\n4\n'],
  ['for (int i = 1; i <= 3; i++) { System.out.print(i + " "); } System.out.println();', '1 2 3 \n'],
  ['int n = 10; do { System.out.println(n); n++; } while (n < 3);', '10\n'],
  ['for (int r = 1; r <= 3; r++) { for (int c = 1; c <= r; c++) { System.out.print("*"); } System.out.println(); }', '*\n**\n***\n'],
  ['int count = 0; for (int i = 1; i <= 10; i++) { if (i % 2 == 0) { count++; } } System.out.printf("Count: %d", count);', 'Count: 5'],
  ['int s = 85; if (s >= 90) System.out.println("A"); else if (s >= 80) System.out.println("B"); else System.out.println("C");', 'B\n'],
  ['boolean a = true, b = false; System.out.println(a && b); System.out.println(a || b); System.out.println(!a);', 'false\ntrue\nfalse\n'],
  ['int x = 5; System.out.println(x > 3 && x < 10);', 'true\n'],
  ['System.out.printf("%.2f%n", 3.14159); System.out.printf("%5d|%-5d|%n", 42, 42); System.out.printf("%s has %d apples%n", "Ana", 3);', '3.14\n   42|42   |\nAna has 3 apples\n'],
  ['System.out.printf("%.2f %.2f %.1f%n", 1.005, 0.125, 0.25);', '1.01 0.13 0.3\n'],
  ['System.out.printf("%8.2f|%-8.2f|%08.2f%n", 3.14159, 2.5, -1.5);', '    3.14|2.50    |-0001.50\n'],
  ['System.out.printf("%,d %,.2f %+d%n", 1234567, 9876543.219, 5);', '1,234,567 9,876,543.22 +5\n'],
  ['System.out.printf("%c%c%n", \'J\', 65);', 'JA\n'],
  ['System.out.printf("%10s|%-10s|%n", "right", "left");', '     right|left      |\n'],
  ['System.out.printf("%.3e%n", 12345.678);', '1.235e+04\n'],
  ['System.out.printf("%s %s%n", 2.50, true);', '2.5 true\n'],
  ['System.out.printf("100%%%n");', '100%\n'],
  ['String s = String.format("%03d", 7); System.out.println(s);', '007\n'],
  ['String name = "Byte"; System.out.println(name.length()); System.out.println(name.charAt(0)); System.out.println(name.toUpperCase()); System.out.println(name.substring(1, 3));', '4\nB\nBYTE\nyt\n'],
  ['String a = "hi"; String b = "hi"; String c = new String("hi"); System.out.println(a == b); System.out.println(a == c); System.out.println(a.equals(c));', 'true\nfalse\ntrue\n'],
  ['String h = "h"; String e = h + "i"; System.out.println(e == "hi"); System.out.println("h" + "i" == "hi");', 'false\ntrue\n'],
  ['final int MAX = 10; System.out.println(MAX * 2);', '20\n'],
  ['int x = 7; String r = x % 2 == 0 ? "even" : "odd"; System.out.println(r);', 'odd\n'],
  ['System.out.println(true ? \'x\' : 0);', 'x\n'],
  ['long big = 3000000000L; System.out.println(big * 2);', '6000000000\n'],
  ['int x = 10; x -= 3; x *= 2; x /= 4; x %= 3; System.out.println(x);', '0\n'],
  ['int i = 5; int j = i++ + ++i; System.out.println(i + " " + j);', '7 12\n'],
  ['double avg = (90 + 85 + 77) / 3; System.out.println(avg);', '84.0\n'],
  ['double avg = (90 + 85 + 77) / 3.0; System.out.printf("%.1f%n", avg);', '84.0\n'],
  ['int total = 0; for (int i = 1; i <= 100; i++) total += i; System.out.println(total);', '5050\n'],
  ['int n = 0; while (true) { n++; if (n == 3) break; } System.out.println(n);', '3\n'],
  ['for (int i = 0; i < 5; i++) { if (i == 2) continue; System.out.print(i); } System.out.println();', '0134\n'],
  ['try { int z = 0; System.out.println(5 / z); } catch (ArithmeticException e) { System.out.println("Error: " + e.getMessage()); }', 'Error: / by zero\n'],
  ['try { System.out.println("abc".charAt(5)); } catch (Exception e) { System.out.println(e); }', 'java.lang.StringIndexOutOfBoundsException: Index 5 out of bounds for length 3\n'],
  ['try { int n = Integer.parseInt("12a"); } catch (NumberFormatException e) { System.out.println(e.getMessage()); } finally { System.out.println("done"); }', 'For input string: "12a"\ndone\n'],
  ['System.out.println(5.0 / 0); System.out.println(-5.0 / 0); System.out.println(0.0 / 0);', 'Infinity\n-Infinity\nNaN\n'],
  ['int x = 3; if (x > 5); { System.out.println("big"); }', 'big\n'],
  ['int x = 010; System.out.println(x);', '8\n'],
  ['System.out.println(Math.floor(-2.5) + " " + Math.ceil(2.1));', '-3.0 3.0\n'],
  ['System.out.println((5 > 3) + "" + (2 == 2.0) + (\'a\' == 97));', 'truetruetrue\n'],
  ['int x = 17; System.out.println(x / 5 * 5 + x % 5);', '17\n'],
  ['System.out.println(10 - 2 * 3 + 4 / 2);', '6\n'],
  ['double c = 5; double f = c * 9 / 5 + 32; System.out.println(f);', '41.0\n'],
  ['System.out.println(Math.round(3.14159 * 100) / 100.0);', '3.14\n'],
  ['System.out.println((int) (7.9 + 0.5));', '8\n'],
  ['int score = 72; boolean pass = score >= 60; System.out.println("Passed: " + pass);', 'Passed: true\n'],
]

const STDIN_CASES: [string, string, string][] = [
  [
    'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    System.out.print("Age? ");\n    int age = in.nextInt();\n    System.out.println("Next year you will be " + (age + 1));\n  }\n}',
    '15\n',
    'Age? Next year you will be 16\n',
  ],
  [
    'Scanner sc = new Scanner(System.in); int n = sc.nextInt(); String rest = sc.nextLine(); String name = sc.nextLine(); System.out.println("[" + rest + "][" + name + "]");',
    '5\nByte\n',
    '[][Byte]\n',
  ],
  [
    'Scanner sc = new Scanner(System.in); while (!sc.hasNextInt()) { System.out.println("Not a number: " + sc.next()); } int n = sc.nextInt(); System.out.println("Got " + n);',
    'abc hello\n42\n',
    'Not a number: abc\nNot a number: hello\nGot 42\n',
  ],
  [
    'import java.util.*;\npublic class Main {\n public static void main(String[] args) {\n  Scanner sc = new Scanner(System.in);\n  int n = 0;\n  boolean ok = false;\n  while (!ok) {\n   try {\n    n = sc.nextInt();\n    ok = true;\n   } catch (InputMismatchException e) {\n    System.out.println("Try again");\n    sc.next();\n   }\n  }\n  System.out.println(n * 2);\n }\n}',
    'x y 21\n',
    'Try again\nTry again\n42\n',
  ],
  ['Scanner sc = new Scanner(System.in); double d = sc.nextDouble(); System.out.printf("%.2f%n", d * 2);', '2.5\n', '5.00\n'],
]

const COMPILE_ERRORS: [string, RegExp][] = [
  ['int x = 5', /';' expected/],
  ['int x = 3.5;', /possible lossy conversion from double to int/],
  ['int x = "5";', /String cannot be converted to int/],
  ["String s = 'hello';", /unclosed character literal/],
  ['char c = "a";', /String cannot be converted to char/],
  ["char c = '';", /empty character literal/],
  ['boolean b = 1;', /int cannot be converted to boolean/],
  ['int x; System.out.println(x);', /might not have been initialized/],
  ['System.out.println(y);', /cannot find symbol/],
  ['system.out.println("hi");', /package system does not exist/],
  ['System.out.printn("hi");', /cannot find symbol/],
  ['Int x = 5;', /cannot find symbol/],
  ['string s = "hi";', /cannot find symbol/],
  ['int x = 5; if (x = 5) { System.out.println("five"); }', /int cannot be converted to boolean/],
  ['final int MAX = 10; MAX = 20;', /cannot assign a value to final variable MAX/],
  ['int x = 5; int x = 6;', /already defined/],
  ['int x = 5; x + 1;', /not a statement/],
  ['int x = 5; if (1 <= x <= 10) { }', /bad operand types/],
  ['System.out.println("hi";', /'\)' or ',' expected/],
  ['int class = 5;', /not a statement/],
  ['for (int i = 0; i < 3; i++) { } System.out.println(i);', /cannot find symbol/],
  ['int q = Math.round(2.5);', /possible lossy conversion from long to int/],
  ['int x = 5; boolean ok = !x;', /bad operand type int for unary operator '!'/],
  ['int x = 3000000000;', /integer number too large/],
  ['if (true) { int y = 1; } System.out.println(y);', /cannot find symbol/],
  ['int x = 5; String s = x;', /int cannot be converted to String/],
  ['char c = 65; char e = c + 1;', /possible lossy conversion from int to char/],
  ['int x = 5; { int x = 6; }', /already defined/],
  ['while (false) { System.out.println("x"); }', /unreachable statement/],
  ['while (true) { System.out.println("x"); } System.out.println("done");', /unreachable statement/],
  ['int p = Math.pow(2, 3);', /possible lossy conversion from double to int/],
  ['int x = 5 System.out.println(x);', /';' expected/],
  ['System.out.println("a" - "b");', /bad operand types/],
  ['int x = 5; if (x > 3) System.out.println("a"); else System.out.println("b"); else System.out.println("c");', /'else' without 'if'/],
  ['public class Main {\n public static void main(String[] args) {\n  Scanner in = new Scanner(System.in);\n }\n}', /cannot find symbol/],
  ['int x = 5; if (x > 3) { System.out.println("big");', /reached end of file/],
  ['System.out.println("sum: " + 5, 6);', /no suitable method/],
  ['String s = "abc"; int n = s.length;', /cannot find symbol/],
]

const RUNTIME_ERRORS: [string, string, string?][] = [
  ['int a = 10; int b = 0; System.out.println(a / b);', 'ArithmeticException'],
  ['Scanner sc = new Scanner(System.in); int n = sc.nextInt();', 'InputMismatchException', 'hello\n'],
  ['Scanner sc = new Scanner(System.in); int n = sc.nextInt();', 'NoSuchElementException', ''],
  ['System.out.printf("%d%n", 5.0);', 'IllegalFormatConversionException'],
  ['System.out.printf("%f%n", 5);', 'IllegalFormatConversionException'],
  ['System.out.printf("%d %d%n", 5);', 'MissingFormatArgumentException'],
  ['String s = "Java"; System.out.println(s.charAt(4));', 'StringIndexOutOfBoundsException'],
  ['int n = Integer.parseInt("seven");', 'NumberFormatException'],
]

describe('Java sandbox: programs that run', () => {
  for (const [src, expected, stdin] of OK_CASES) {
    it(src.slice(0, 70), () => {
      const r = runJava(src, { stdin })
      expect(r.error?.message ?? '').toBe('')
      expect(r.status).toBe('ok')
      expect(r.stdout).toBe(expected)
    })
  }
})

describe('Java sandbox: programs with input', () => {
  for (const [src, stdin, expected] of STDIN_CASES) {
    it(src.slice(0, 70).replace(/\n/g, ' '), () => {
      const r = runJava(src, { stdin })
      expect(r.error?.message ?? '').toBe('')
      expect(r.stdout).toBe(expected)
    })
  }
})

describe('Java sandbox: compile errors', () => {
  for (const [src, re] of COMPILE_ERRORS) {
    it(src.slice(0, 70).replace(/\n/g, ' '), () => {
      const r = runJava(src)
      expect(r.status).toBe('compile-error')
      expect(r.error?.message).toMatch(re)
    })
  }
})

describe('Java sandbox: runtime errors', () => {
  for (const [src, exc, stdin] of RUNTIME_ERRORS) {
    it(src.slice(0, 70), () => {
      const r = runJava(src, { stdin })
      expect(r.status).toBe('runtime-error')
      expect(r.error?.exception).toBe(exc)
    })
  }
})

describe('Java sandbox: special behaviours', () => {
  it('detects infinite loops', () => {
    const r = runJava('int i = 0; while (i < 5) { System.out.println(i); }')
    expect(r.status).toBe('timeout')
  })

  it('asks for input in interactive mode and echoes it', () => {
    const src = 'Scanner sc = new Scanner(System.in); System.out.print("Name: "); String n = sc.nextLine(); System.out.println("Hi " + n);'
    const first = runJava(src, { interactive: true })
    expect(first.status).toBe('needs-input')
    expect(first.stdout).toBe('Name: ')
    const second = runJava(src, { interactive: true, stdin: 'Ada\n' })
    expect(second.status).toBe('ok')
    expect(second.stdout).toBe('Name: Hi Ada\n')
    expect(second.segments.map((s) => s.kind)).toEqual(['out', 'in', 'out'])
  })

  it('classic bug: forgetting to consume a bad token loops forever', () => {
    const src = 'Scanner sc = new Scanner(System.in); int n = 0; boolean ok = false; while (!ok) { try { n = sc.nextInt(); ok = true; } catch (InputMismatchException e) { System.out.println("bad"); } }'
    expect(runJava(src, { stdin: 'abc\n' }).status).toBe('timeout')
  })

  it('records a trace with conditions and variable values', () => {
    const r = runJava('int i = 0;\nwhile (i < 2) {\n  i++;\n}\nSystem.out.println(i);', { trace: true })
    expect(r.status).toBe('ok')
    const notes = r.trace.map((t) => t.note).filter(Boolean)
    expect(notes).toContain('while i < 2 → true')
    expect(notes).toContain('while i < 2 → false')
    const last = r.trace[r.trace.length - 1]
    expect(last.vars.find((v) => v.name === 'i')?.value).toBe('2')
  })

  it('supports static methods and constants in a full class', () => {
    const src = `public class Main {
  static final double TAX = 0.08;
  static double withTax(double price) {
    return price * (1 + TAX);
  }
  public static void main(String[] args) {
    System.out.printf("%.2f%n", withTax(10));
  }
}`
    const r = runJava(src)
    expect(r.stdout).toBe('10.80\n')
  })

  it('Math.random is deterministic per seed and in range', () => {
    const src = 'for (int i = 0; i < 20; i++) { int d = (int) (Math.random() * 6) + 1; if (d < 1 || d > 6) System.out.println("bad"); } System.out.println("ok");'
    expect(runJava(src).stdout).toBe('ok\n')
    const a = runJava('System.out.println(Math.random());', { seed: 7 }).stdout
    const b = runJava('System.out.println(Math.random());', { seed: 7 }).stdout
    expect(a).toBe(b)
  })

  it('reports unsupported features honestly', () => {
    expect(runJava('int[] a = new int[3];').status).toBe('unsupported')
    expect(runJava('int x = 1; switch (x) { case 1: break; }').status).toBe('unsupported')
  })
})
