/**
 * Cross-checks the Java sandbox against a real JDK.
 * Every program in the curriculum is compiled with javac and run with java,
 * and the result (compile error / exception / exact output) must match the sandbox.
 *
 * Opt-in because it needs a JDK:   JAVAC_VALIDATE=1 npx vitest run src/data/javac.test.ts
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { runJava } from '../java'
import { applySet } from '../engine/codeRunner'
import { arrangeProgram, fillBlanks } from '../engine/grading'
import { LESSONS, QUESTIONS } from './curriculum'
import { finalStages } from './final'
import { placementItems } from './placement'

interface Program {
  label: string
  code: string
  stdin: string
  random?: boolean
}

function collect(): Program[] {
  const out: Program[] = []
  const add = (label: string, code: string, stdin = '', random = false) =>
    out.push({ label, code, stdin, random: random || /Math\.random|new Random/.test(code) })
  for (const q of [...QUESTIONS, ...placementItems.map((p) => p.question)]) {
    const stdin = q.stdin ?? ''
    switch (q.type) {
      case 'predict-output':
      case 'type-output':
      case 'error-type':
        if (q.code) add(q.id, q.code, stdin)
        break
      case 'multiple-choice':
        if (q.code && q.verify) add(q.id, q.code, stdin)
        break
      case 'fill-blank':
        q.blanks.forEach((accepted, i) =>
          accepted.forEach((a, k) => {
            const values = q.blanks.map((b) => b[0])
            values[i] = a
            if (i === 0 || k > 0) add(`${q.id}[${i}:${a}]`, fillBlanks(q.code, values), stdin, q.verify?.random)
          }),
        )
        break
      case 'arrange':
        add(q.id, arrangeProgram(q, q.lines), stdin)
        break
      case 'find-bug':
        add(`${q.id}:buggy`, q.code, stdin)
        add(`${q.id}:fixed`, q.fixedCode, stdin)
        break
      case 'fix-code':
      case 'write-code':
        q.tests.forEach((t, i) => {
          add(`${q.id}:solution#${i}`, applySet(q.solution, t.set).code, t.stdin ?? '', !!t.outputPattern)
          add(`${q.id}:starter#${i}`, applySet(q.starter, t.set).code, t.stdin ?? '', !!t.outputPattern)
        })
        break
    }
  }
  for (const l of LESSONS) {
    l.teach.forEach((c, i) => {
      if (c.kind === 'example') add(`${l.id}:example${i}`, c.code, c.stdin ?? '', c.random)
      if (c.kind === 'mistake') {
        add(`${l.id}:wrong${i}`, c.wrong, c.stdin ?? '')
        add(`${l.id}:right${i}`, c.right, c.stdin ?? '')
      }
    })
  }
  for (const s of finalStages) {
    s.tests.forEach((t, i) => add(`${s.id}:solution#${i}`, s.solution, t.stdin ?? ''))
    add(`${s.id}:starter`, s.starter, s.tests[0].stdin ?? '')
  }
  return out
}

/** Turn a sandbox snippet or program into a compilable Java file with class name `cls`. */
function toJavaFile(code: string, cls: string): string {
  const isProgram = /^\s*(import\s|package\s|(public\s+|final\s+|abstract\s+)*class\s)/m.test(code) && /\bclass\s+\w+/.test(code)
  if (isProgram) return code.replace(/\bclass\s+(\w+)(\s*\{)/, `class ${cls}$2`)
  return `import java.util.*;\n\npublic class ${cls} {\n    public static void main(String[] args) throws Exception {\n${code}\n    }\n}\n`
}

const RUNNER = `
import java.io.*;
import java.lang.reflect.*;
import java.nio.file.*;
import java.util.*;

public class Runner {
    static class Limited extends OutputStream {
        final ByteArrayOutputStream buf = new ByteArrayOutputStream();
        public void write(int b) throws IOException {
            if (buf.size() > 200000) throw new IOException("output limit");
            buf.write(b);
        }
    }
    static String esc(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '"' || c == '\\\\') sb.append('\\\\').append(c);
            else if (c == '\\n') sb.append("\\\\n");
            else if (c == '\\r') sb.append("\\\\r");
            else if (c == '\\t') sb.append("\\\\t");
            else if (c < 32) sb.append(String.format("\\\\u%04x", (int) c));
            else sb.append(c);
        }
        return sb.toString();
    }
    public static void main(String[] args) throws Exception {
        List<String> names = Files.readAllLines(Paths.get(args[0]));
        PrintStream realOut = System.out;
        StringBuilder json = new StringBuilder("[");
        for (int n = 0; n < names.size(); n++) {
            String name = names.get(n);
            byte[] input = Files.readAllBytes(Paths.get(name + ".in"));
            System.setIn(new ByteArrayInputStream(input));
            Limited lim = new Limited();
            PrintStream ps = new PrintStream(lim, true);
            System.setOut(ps);
            final String[] status = {"ok", "", ""};
            Thread t = new Thread(() -> {
                try {
                    Class<?> c = Class.forName(name);
                    c.getMethod("main", String[].class).invoke(null, (Object) new String[0]);
                } catch (InvocationTargetException e) {
                    Throwable cause = e.getCause();
                    if (cause instanceof UncheckedIOException || (cause != null && String.valueOf(cause.getMessage()).contains("output limit"))) {
                        status[0] = "timeout";
                    } else {
                        status[0] = "runtime-error";
                        status[1] = cause.getClass().getSimpleName();
                        status[2] = String.valueOf(cause.getMessage());
                    }
                } catch (Throwable e) {
                    status[0] = "harness-error";
                    status[2] = e.toString();
                }
            });
            t.setDaemon(true);
            t.start();
            t.join(4000);
            if (t.isAlive()) status[0] = "timeout";
            ps.flush();
            String outText = lim.buf.toString("UTF-8");
            if (ps.checkError() && status[0].equals("ok")) status[0] = "timeout";
            if (n > 0) json.append(",");
            json.append("{\\"name\\":\\"").append(name).append("\\",\\"status\\":\\"").append(status[0])
                .append("\\",\\"exception\\":\\"").append(esc(status[1]))
                .append("\\",\\"message\\":\\"").append(esc(status[2]))
                .append("\\",\\"stdout\\":\\"").append(esc(outText)).append("\\"}");
        }
        json.append("]");
        System.setOut(realOut);
        Files.writeString(Paths.get(args[1]), json.toString());
        System.exit(0);
    }
}
`

const ENABLED = !!process.env.JAVAC_VALIDATE

describe.skipIf(!ENABLED)('sandbox matches the real JDK', () => {
  it('every curriculum program behaves identically under javac + java', { timeout: 900_000 }, () => {
    const dir = join(process.cwd(), '.javac-validate')
    if (existsSync(dir)) {
      for (const f of readdirSync(dir)) rmSync(join(dir, f), { recursive: true, force: true })
    }
    mkdirSync(dir, { recursive: true })

    const programs = collect()
    const sandbox = programs.map((p) => runJava(p.code, { stdin: p.stdin }))
    const okNames: string[] = []
    const compileErrNames: { name: string; idx: number }[] = []

    programs.forEach((p, i) => {
      const name = `P${i}`
      writeFileSync(join(dir, `${name}.java`), toJavaFile(p.code, name))
      writeFileSync(join(dir, `${name}.in`), p.stdin)
      const s = sandbox[i]
      if (s.status === 'compile-error') compileErrNames.push({ name, idx: i })
      else okNames.push(name)
    })
    writeFileSync(join(dir, 'Runner.java'), RUNNER)

    const problems: string[] = []

    // 1. everything the sandbox accepts must compile with javac (batch; retry without the offenders)
    // an @argfile avoids Windows' command-line length limit
    const compileBatch = (names: string[]) => {
      writeFileSync(join(dir, 'sources.txt'), ['Runner.java', ...names.map((n) => `${n}.java`)].join('\n'))
      return execFileSync('javac', ['-nowarn', '-encoding', 'UTF-8', '-d', '.', '@sources.txt'], { cwd: dir, stdio: 'pipe' })
    }
    try {
      compileBatch(okNames)
    } catch (e) {
      const msg = String((e as { stderr?: Buffer }).stderr ?? e)
      const bad = new Set([...msg.matchAll(/P(\d+)\.java:\d+: error/g)].map((m) => Number(m[1])))
      for (const i of bad) {
        const details = [...msg.matchAll(new RegExp(`P${i}\\.java:(\\d+): error: ([^\\r\\n]*)`, 'g'))].map((m) => `line ${m[1]}: ${m[2]}`)
        problems.push(`${programs[i].label}: sandbox runs it but javac rejects it: ${details.join('; ')}`)
      }
      const remaining = okNames.filter((n) => !bad.has(Number(n.slice(1))))
      okNames.length = 0
      okNames.push(...remaining)
      compileBatch(okNames)
    }

    // 2. everything the sandbox rejects must be rejected by javac too
    for (const { name, idx } of compileErrNames) {
      try {
        execFileSync('javac', ['-nowarn', '-d', join(dir, 'ce'), join(dir, `${name}.java`)], { stdio: 'pipe' })
        problems.push(`${programs[idx].label}: sandbox says compile error (${sandbox[idx].error?.message}) but javac compiles it`)
      } catch {
        // expected
      }
    }

    // 3. run everything that compiled, skipping programs the sandbox says loop forever
    const runnable = okNames.filter((n) => {
      const s = sandbox[Number(n.slice(1))]
      return s.status !== 'timeout'
    })
    writeFileSync(join(dir, 'names.txt'), runnable.join('\n'))
    execFileSync('java', ['-cp', dir, 'Runner', join(dir, 'names.txt'), join(dir, 'results.json')], { cwd: dir, stdio: 'pipe', timeout: 600_000 })
    const results: { name: string; status: string; exception: string; message: string; stdout: string }[] = JSON.parse(
      readFileSync(join(dir, 'results.json'), 'utf8'),
    )
    for (const r of results) {
      const i = Number(r.name.slice(1))
      const p = programs[i]
      const s = sandbox[i]
      const javaOut = r.stdout.replace(/\r\n/g, '\n')
      if (r.status !== s.status) {
        problems.push(`${p.label}: java=${r.status} ${r.exception} ${r.message} | sandbox=${s.status} ${s.error?.message ?? ''}`)
        continue
      }
      if (r.status === 'runtime-error' && r.exception !== s.error?.exception) {
        problems.push(`${p.label}: java threw ${r.exception}, sandbox threw ${s.error?.exception}`)
      }
      if (!p.random && javaOut !== s.stdout) {
        problems.push(`${p.label}: output differs\n  java:    ${JSON.stringify(javaOut)}\n  sandbox: ${JSON.stringify(s.stdout)}`)
      }
    }
    console.log(`checked ${programs.length} programs (${results.length} executed, ${compileErrNames.length} compile errors)`)
    expect(problems).toEqual([])
  })
})
