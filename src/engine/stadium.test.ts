import { describe, expect, it } from 'vitest'
import { DIALOGUE, pickLine } from '../data/battleDialogue'
import { UNITS } from '../data/curriculum'
import { DEFENDERS, FIRST_DEFENDERS, KEEPER, OTHER_DEFENDERS, pickFrom } from '../data/stadium'
import { pickWarmup, SAYINGS, WARMUP, WARMUP_LENGTH, warmupRank } from '../data/warmup'
import { createEmptyProgress } from '../state/types'
import { MemoryRepository } from '../state/repository'
import { ProgressStore } from '../state/store'
import {
  accuracy,
  answer,
  currentDefender,
  DEFENDER_COUNT,
  defendersBeaten,
  finalScore,
  isKeeper,
  pickQuestion,
  POSSESSIONS,
  rating,
  stadiumPool,
  startMatch,
  targetDifficulty,
  unitOf,
  unitsCovered,
  type PoolQuestion,
} from './stadium'

const seq = (...xs: number[]) => {
  let i = 0
  return () => xs[i++ % xs.length]
}

const done = (ids: string[]) => {
  const p = createEmptyProgress()
  for (const id of ids) p.lessons[id] = { firstCompletedAt: 1, lastCompletedAt: 1, bestAccuracy: 1, timesCompleted: 1, perfect: true }
  return p
}
const allLessons = UNITS.flatMap((u) => u.lessons.map((l) => l.id))

describe('stadium challenge', () => {
  it('only uses four-option questions from lessons the learner has finished, tagged with their unit', () => {
    expect(stadiumPool(createEmptyProgress())).toEqual([])
    const pool = stadiumPool(done(['u1-l1', 'u2-l1']))
    expect(new Set(pool.map((q) => q.unitId))).toEqual(new Set(['u1', 'u2']))
    for (const q of pool) expect(unitOf(q.id)).toBe(q.unitId)
  })

  it('lines up Bryan and Avik first, five shuffled villains, then the keeper', () => {
    const m = startMatch(seq(0.9, 0.1, 0.5, 0.3))
    expect(m.lineup.slice(0, 2)).toEqual(FIRST_DEFENDERS)
    expect([...m.lineup.slice(2, 7)].sort()).toEqual([...OTHER_DEFENDERS].sort())
    expect(m.lineup[7]).toBe(KEEPER)
    expect(m.lineup).toHaveLength(DEFENDER_COUNT + 1)
    expect(m.possessions).toBe(POSSESSIONS)
    // a different shuffle on another match
    const others = new Set(Array.from({ length: 12 }, () => startMatch().lineup.slice(2, 7).join()))
    expect(others.size).toBeGreaterThan(1)
  })

  it('rotates evenly through every studied unit: one question per unit before any unit repeats', () => {
    const pool = stadiumPool(done(allLessons))
    let m = startMatch()
    const seen: string[] = []
    for (let i = 0; i < 8; i++) {
      const q = pickQuestion(m, pool)!
      seen.push(q.unitId)
      m = answer(m, q, i % 3 !== 0 || m.possessions === 1 ? true : false).state
      if (m.status !== 'playing') m = { ...m, status: 'playing' }
    }
    expect(new Set(seen).size).toBe(8)
  })

  it('prefers the units practised least overall when choosing between them', () => {
    const pool = stadiumPool(done(allLessons))
    const lifetime = Object.fromEntries(UNITS.map((u) => [u.id, u.id === 'u5' ? 0 : 10]))
    const q = pickQuestion(startMatch(), pool, lifetime)!
    expect(q.unitId).toBe('u5')
  })

  it('asks easier questions early and harder ones near the goal', () => {
    expect([0, 1, 2, 4, 5, 7].map(targetDifficulty)).toEqual([1, 1, 2, 2, 3, 3])
    const pool = stadiumPool(done(allLessons))
    const first = pickQuestion(startMatch(), pool)!
    expect(first.difficulty).toBe(1)
    const late = pickQuestion({ ...startMatch(), encounter: 7 }, pool)!
    expect(late.difficulty).toBeGreaterThanOrEqual(2)
  })

  it('never repeats a question within a match while the unit has fresh ones', () => {
    const pool = stadiumPool(done(['u1-l1', 'u1-l2', 'u1-l3']))
    let m = startMatch()
    const ids = new Set<string>()
    for (let i = 0; i < 6; i++) {
      const q = pickQuestion(m, pool)!
      expect(ids.has(q.id)).toBe(false)
      ids.add(q.id)
      m = answer(m, q, true).state
    }
  })

  it('a right answer beats the defender; beating the keeper scores', () => {
    const q: PoolQuestion = { id: 'x', unitId: 'u1', difficulty: 1 }
    let m = startMatch()
    expect(currentDefender(m)).toBe('bryan')
    for (let i = 0; i < DEFENDER_COUNT; i++) {
      const r = answer(m, q, true)
      expect(r.play).toMatchObject({ correct: true, goal: false })
      m = r.state
    }
    expect(isKeeper(m)).toBe(true)
    expect(defendersBeaten(m)).toBe(DEFENDER_COUNT)
    const r = answer(m, q, true)
    expect(r.play.goal).toBe(true)
    expect(r.state.status).toBe('scored')
    expect(rating(r.state).title).toBe('World Class')
    expect(finalScore(r.state)).toBeGreaterThan(r.state.score)
  })

  it('a wrong answer costs a possession and keeps the same defender; the third one is a turnover', () => {
    const q: PoolQuestion = { id: 'x', unitId: 'u2', difficulty: 2 }
    let m = startMatch()
    m = answer(m, q, true).state
    const r1 = answer(m, q, false)
    expect(r1.state.possessions).toBe(POSSESSIONS - 1)
    expect(currentDefender(r1.state)).toBe('avik')
    expect(r1.state.streak).toBe(0)
    const r2 = answer(r1.state, q, false)
    const r3 = answer(r2.state, q, false)
    expect(r3.play.turnover).toBe(true)
    expect(r3.state.status).toBe('lost')
    expect(accuracy(r3.state)).toBe(0.25)
    expect(unitsCovered(r3.state)).toEqual(['u2'])
    expect(() => answer(r3.state, q, true)).toThrow()
  })

  it('records a finished match as a practice session with XP', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    const r = store.finishBattle({ won: true, score: 2400, correct: 8, answered: 9, bestStreak: 6, xp: 80 })
    expect(r.xp).toBeGreaterThanOrEqual(80)
    expect(store.getSnapshot().battle).toEqual({ played: 1, wins: 1, bestScore: 2400 })
    expect(store.getSnapshot().stats.practiceSessions).toBe(1)
  })
})

describe('stadium defenders', () => {
  it('every defender has a power, a skill move and lines for every moment, in plain text', () => {
    for (const d of Object.values(DEFENDERS)) {
      expect(d.skill.length).toBeGreaterThan(0)
      for (const [moment, lines] of Object.entries(d.lines)) {
        expect(lines.length, `${d.id} ${moment}`).toBeGreaterThan(0)
        for (const l of lines) expect(l).not.toMatch(/[\u2013\u2014]|\p{Extended_Pictographic}/u)
      }
    }
    expect(new Set(Object.values(DEFENDERS).map((d) => d.power)).size).toBe(8)
  })

  it('Bryan and Avik keep their own dialogue', () => {
    for (const l of DIALOGUE.bryan.taunt) expect(DEFENDERS.bryan.lines.taunt).toContain(l)
    for (const l of DIALOGUE.avik.intro) expect(DEFENDERS.avik.lines.intro).toContain(l)
    expect(DEFENDERS.bryan.title).toBe('The Firewall')
    expect(DEFENDERS.avik.title).toBe('The Speed Demon')
  })

  it('does not repeat the last line when it has a choice', () => {
    const lines = DEFENDERS.glitch.lines.taunt
    for (let i = 0; i < 20; i++) expect(pickFrom(lines, lines[0])).not.toBe(lines[0])
  })
})

describe('villain dialogue', () => {
  it('has lines for every moment, in plain school-friendly text', () => {
    for (const who of ['bryan', 'avik'] as const) {
      for (const [moment, lines] of Object.entries(DIALOGUE[who])) {
        if (moment !== 'stepIn' || who === 'avik') expect(lines.length, `${who} ${moment}`).toBeGreaterThan(0)
        for (const l of lines) expect(l).not.toMatch(/[\u2013\u2014]|\p{Extended_Pictographic}/u)
      }
    }
    expect(DIALOGUE.bryan.intro).toContain('I make Fortnite in one day!')
    expect(DIALOGUE.avik.intro).toContain('My biggest flex is making a robotic arm.')
  })

  it('does not repeat the last line when it has a choice', () => {
    const last = DIALOGUE.bryan.hit[0]
    for (let i = 0; i < 20; i++) expect(pickLine('bryan', 'hit', last)).not.toBe(last)
  })
})

describe('project warm-up', () => {
  it('uses exactly the six class sayings, word for word, as the correct answers', () => {
    expect([...SAYINGS]).toEqual([
      'The key to success is consistency.',
      'Never suffer in silence.',
      'Everything counts.',
      'Collaboration, not competition.',
      'Remember to have a wonderful or fantastic weekend.',
      'If someone is laughing, someone is crying.',
    ])
    expect(WARMUP.map((q) => q.saying).sort()).toEqual([...SAYINGS].sort())
    for (const q of WARMUP) {
      expect(q.decoys).toHaveLength(3)
      for (const d of q.decoys) expect(d.text).not.toBe(q.saying)
      for (const text of [q.prompt, q.correctReaction, ...q.decoys.flatMap((d) => [d.text, d.reaction])]) expect(text).not.toMatch(/[\u2013\u2014]|\p{Extended_Pictographic}/u)
    }
  })

  it('gives every saying its own custom icon, and every rank a badge', () => {
    expect(new Set(WARMUP.map((q) => q.icon)).size).toBe(WARMUP.length)
    expect([4, 3, 2, 0].map((s) => warmupRank(s, 4).icon)).toEqual(['crown', 'medal', 'star', 'sprout'])
  })

  it('keeps each warm-up short and never repeats a question', () => {
    const qs = pickWarmup()
    expect(qs).toHaveLength(WARMUP_LENGTH)
    expect(new Set(qs.map((q) => q.id)).size).toBe(WARMUP_LENGTH)
  })

  it('remembers that a project warm-up is done', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    store.completeWarmup('cart')
    const at = store.getSnapshot().warmups.cart
    expect(at).toBeTypeOf('number')
    store.completeWarmup('cart')
    expect(store.getSnapshot().warmups.cart).toBe(at)
  })
})
