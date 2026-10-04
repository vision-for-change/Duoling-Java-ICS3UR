import { describe, expect, it } from 'vitest'
import { runJava } from '../java'
import { explainRun } from './friendlyErrors'

const title = (code: string, stdin = '') => explainRun(runJava(code, { stdin }))?.title

describe('friendly error explanations', () => {
  it('explains the common compile errors', () => {
    expect(title('System.out.println("Hi")')).toBe('Missing semicolon')
    expect(title('Sytem.out.println("Hi");')).toBe('No such thing as “Sytem”')
    expect(title('int x = 5.5;')).toBe('The value does not fit')
  })

  it('explains the switch and catch mistakes', () => {
    expect(title('int n = 1; switch (n) { case 1: break; case 1: break; }')).toBe('Two cases are the same')
    expect(title('int n = 1; int k = 2; switch (n) { case k: break; }')).toBe('A case needs a fixed value')
    expect(title('double d = 1.5; switch (d) { case 1: break; }')).toBe('A switch cannot look at that type')
    expect(title('int n = 2; switch (n) { case 1: break; case 2 System.out.println("two"); }')).toBe('Missing colon')
    expect(title('int z = 0; try { System.out.println(5 / z); } catch (Exception e) { } catch (ArithmeticException e) { }')).toBe('That catch can never run')
  })

  it('explains run-time problems', () => {
    expect(title('int z = 0; System.out.println(5 / z);')).toBe('Division by zero')
    expect(title('Scanner console = new Scanner(System.in); int n = console.nextInt();', 'abc\n')).toBe('Unexpected input')
    expect(title('int n = 3; while (n > 0) { n = 3; }')).toBe('Stuck in an infinite loop?')
  })
})
