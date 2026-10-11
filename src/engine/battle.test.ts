import { describe, expect, it } from 'vitest'
import { DIALOGUE, pickLine } from '../data/battleDialogue'
import { getQuestion, UNITS } from '../data/curriculum'
import { pickWarmup, SAYINGS, WARMUP, WARMUP_LENGTH, warmupRank } from '../data/warmup'
import { createEmptyProgress } from '../state/types'
import { MemoryRepository } from '../state/repository'
import { ProgressStore } from '../state/store'
import { answer, battlePool, buildDeck, CRIT, FOE_HIT, HIT, pointsFor, startBattle, targetDifficulty, timeFor } from './battle'

const seq = (...xs: number[]) => {
  let i = 0
  return () => xs[i++ % xs.length]
}

describe('practice battle', () => {
  const done = (ids: string[]) => {
    const p = createEmptyProgress()
    for (const id of ids) p.lessons[id] = { firstCompletedAt: 1, lastCompletedAt: 1, bestAccuracy: 1, timesCompleted: 1, perfect: true }
    return p
  }

  it('only uses four-option questions from finished lessons', () => {
    expect(battlePool(createEmptyProgress())).toEqual([])
    const p = done(['u1-l1', 'u1-l2'])
    const pool = battlePool(p)
    expect(pool.length).toBeGreaterThan(0)
    const allowed = new Set(UNITS[0].lessons.slice(0, 2).flatMap((l) => [...l.questions, l.challenge]))
    for (const id of pool) {
      expect(allowed.has(id)).toBe(true)
      const q = getQuestion(id)
      expect(['multiple-choice', 'predict-output']).toContain(q.type)
      if (q.type === 'multiple-choice' || q.type === 'predict-output') expect(q.options).toHaveLength(4)
    }
  })

  it('builds a deck that gets harder, reusing a small pool', () => {
    const p = done(UNITS.flatMap((u) => u.lessons.map((l) => l.id)))
    const deck = buildDeck(battlePool(p), seq(0.3, 0.7, 0.1))
    expect(deck).toHaveLength(20)
    const diffs = deck.map((id) => getQuestion(id).difficulty)
    expect(diffs.slice(0, 4)).toEqual([1, 1, 1, 1])
    expect(diffs.slice(4, 8)).toEqual([2, 2, 2, 2])
    expect(diffs.slice(8, 12)).toEqual([3, 3, 3, 3])
    expect(new Set(deck).size).toBe(deck.length)
    // only easy questions so far: still a full deck
    const early = buildDeck(battlePool(done(['u1-l1', 'u1-l2'])))
    expect(early).toHaveLength(20)
    const small = buildDeck(battlePool(done(['u1-l1'])), Math.random, 20)
    expect(small).toHaveLength(20)
    for (let i = 1; i < small.length; i++) if (new Set(small).size > 1) expect(small[i]).not.toBe(small[i - 1])
  })

  it('aims for harder questions as the battle goes on', () => {
    expect([0, 3, 4, 7, 8, 19].map(targetDifficulty)).toEqual([1, 1, 2, 2, 3, 3])
  })

  it('beats Bryan first, then Avik, with critical hits on a streak', () => {
    let s = startBattle(['a'])
    const turns = []
    while (s.status === 'fighting') {
      const r = answer(s, true, 10)
      turns.push(r.turn)
      s = r.state
    }
    expect(s.status).toBe('won')
    expect(turns.map((t) => t.damage).slice(0, 3)).toEqual([HIT, HIT, CRIT])
    expect(turns.find((t) => t.knockedOut === 'bryan')).toBeTruthy()
    expect(turns[turns.length - 1].knockedOut).toBe('avik')
    expect(s.foeHp).toEqual({ bryan: 0, avik: 0 })
    expect(s.correct).toBe(s.answered)
    expect(s.bestStreak).toBe(s.answered)
  })

  it('wrong answers and timeouts let the villain hit back and break the streak', () => {
    let s = startBattle(['a'])
    s = answer(s, true, 5).state
    const r = answer(s, false, 0, true)
    expect(r.turn).toMatchObject({ correct: false, timedOut: true, target: 'player', damage: FOE_HIT.bryan })
    expect(r.state.streak).toBe(0)
    expect(r.state.playerHp).toBe(100 - FOE_HIT.bryan)
    s = r.state
    while (s.status === 'fighting') s = answer(s, false, 0).state
    expect(s.status).toBe('lost')
    expect(s.playerHp).toBe(0)
    expect(() => answer(s, true, 1)).toThrow()
  })

  it('gives more time for code and hard questions, and more points for speed and streaks', () => {
    expect(timeFor({ difficulty: 1 })).toBe(20)
    expect(timeFor({ difficulty: 3, code: 'a\nb\nc' })).toBeGreaterThan(timeFor({ difficulty: 1, code: 'a\nb\nc' }))
    expect(pointsFor(10, 1)).toBe(150)
    expect(pointsFor(10, 3)).toBeGreaterThan(pointsFor(10, 1))
    expect(pointsFor(0, 1)).toBe(100)
  })

  it('records a finished battle as a practice session with XP', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    const r = store.finishBattle({ won: true, score: 900, correct: 7, answered: 8, bestStreak: 5, xp: 70 })
    expect(r.xp).toBeGreaterThanOrEqual(70)
    const p = store.getSnapshot()
    expect(p.battle).toEqual({ played: 1, wins: 1, bestScore: 900 })
    expect(p.stats.practiceSessions).toBe(1)
    store.finishBattle({ won: false, score: 300, correct: 2, answered: 6, bestStreak: 1, xp: 20 })
    expect(store.getSnapshot().battle).toEqual({ played: 2, wins: 1, bestScore: 900 })
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
