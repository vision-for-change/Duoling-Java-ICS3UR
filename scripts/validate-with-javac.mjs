// Cross-checks every program in the curriculum against a real JDK (javac + java).
// Usage: npm run validate:java   (requires `javac` and `java` on the PATH)
import { spawnSync } from 'node:child_process'

const check = spawnSync('javac', ['-version'], { encoding: 'utf8', shell: true })
if (check.status !== 0) {
  console.error('javac was not found on your PATH. Install a JDK (17+) to run this check.')
  process.exit(1)
}

const result = spawnSync('npx', ['vitest', 'run', 'src/data/javac.test.ts'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, JAVAC_VALIDATE: '1' },
})
process.exit(result.status ?? 1)
