import confetti from 'canvas-confetti'
import { store } from '../state/store'

export function prefersReducedMotion(): boolean {
  const pref = store.getSnapshot().settings.motion
  if (pref === 'reduced') return true
  if (pref === 'full') return false
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

const COLORS = ['#f76f22', '#ffc21f', '#37c68e', '#45a5f8', '#fa5d80', '#9b74f7']

export function celebrate(size: 'small' | 'big' = 'small') {
  if (prefersReducedMotion()) return
  if (size === 'small') {
    void confetti({ particleCount: 60, spread: 70, startVelocity: 38, origin: { y: 0.75 }, colors: COLORS, scalar: 0.9, disableForReducedMotion: true })
    return
  }
  const end = Date.now() + 900
  const frame = () => {
    void confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS, disableForReducedMotion: true })
    void confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS, disableForReducedMotion: true })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  void confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.6 }, colors: COLORS, disableForReducedMotion: true })
}

/** While a lesson/practice session is on screen it shows rewards itself. */
export const sessionFlag = {
  active: false,
}
