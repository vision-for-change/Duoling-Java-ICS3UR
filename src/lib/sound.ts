/**
 * Tiny synthesized sound effects (no audio files needed).
 */
import { store } from '../state/store'

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (!store.getSnapshot().settings.sound) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.12) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g).connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export const sfx = {
  correct() {
    tone(784, 0, 0.14, 'triangle')
    tone(1175, 0.09, 0.22, 'triangle')
  },
  wrong() {
    tone(220, 0, 0.18, 'square', 0.05)
    tone(185, 0.12, 0.22, 'square', 0.05)
  },
  click() {
    tone(660, 0, 0.05, 'triangle', 0.05)
  },
  complete() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.28, 'triangle', 0.1))
  },
  levelUp() {
    ;[392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.08, 0.3, 'triangle', 0.09))
  },
  achievement() {
    tone(880, 0, 0.12, 'sine', 0.1)
    tone(1320, 0.1, 0.3, 'sine', 0.1)
  },
}
