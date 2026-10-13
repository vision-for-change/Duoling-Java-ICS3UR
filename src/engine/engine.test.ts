import { describe, expect, it } from 'vitest'
import { getLesson, getQuestion, getUnit, LESSONS, UNITS } from '../data/curriculum'
import { getProject, PROJECTS } from '../data/projects'
import { MemoryRepository, migrate } from '../state/repository'
import { ProgressStore } from '../state/store'
import { createEmptyProgress, PROGRESS_VERSION, type Progress } from '../state/types'
import { addDays, dayKey, liveStreak, registerActivity } from './dates'
import { levelFor, levelProgress, XP } from './gamification'
import { grade, normalizeCode } from './grading'
import { evaluatePlacement } from './placement'
import { buildPractice } from './practice'
import { checkpointStatus, isFinalUnlocked, isUnitRevealed, lessonStatus, nextStep, skipPlan, upcomingLessons } from './progression'
import { advance, createCheckpointSession, createLessonSession, currentStep, isFinished, outOfHearts, recordAttempt, summarize, type SessionState } from './session'

const fresh = (): Progress => ({ ...createEmptyProgress(), onboarded: true })

describe('streaks', () => {
  it('grows on consecutive days, resets after a gap, ignores repeats', () => {
    const d1 = '2026-09-01'
    let s = registerActivity({ current: 0, longest: 0, lastActiveDay: null }, d1).streak
    expect(s.current).toBe(1)
    expect(registerActivity(s, d1).extended).toBe(false)
    s = registerActivity(s, addDays(d1, 1)).streak
    expect(s.current).toBe(2)
    s = registerActivity(s, addDays(d1, 5)).streak
    expect(s).toMatchObject({ current: 1, longest: 2 })
  })

  it('shows 0 once a day has been missed', () => {
    const today = dayKey()
    expect(liveStreak({ current: 4, longest: 4, lastActiveDay: addDays(today, -1) }, today)).toBe(4)
    expect(liveStreak({ current: 4, longest: 4, lastActiveDay: addDays(today, -2) }, today)).toBe(0)
  })
})

describe('levels', () => {
  it('maps XP to the six named levels', () => {
    expect(levelFor(0).title).toBe('Java Rookie')
    expect(levelFor(300).title).toBe('Code Explorer')
    expect(levelFor(999).level).toBe(2)
    expect(levelFor(1000).title).toBe('Loop Learner')
    expect(levelFor(99999).title).toBe('Java Master')
    const lp = levelProgress(650)
    expect(lp.next?.level).toBe(3)
    expect(lp.fraction).toBeCloseTo(0.5)
  })
})

describe('placement', () => {
  const all = (correct: boolean) =>
    (['variables', 'types', 'input', 'input', 'math', 'math', 'errors', 'printf', 'conditionals', 'conditionals', 'loops', 'loops', 'exceptions', 'exceptions'] as const).map((area) => ({ area, correct }))

  it('recommends the last unit when everything is right', () => {
    expect(evaluatePlacement(all(true)).startUnitId).toBe('u8')
  })

  it('starts at the first unit with a mistake and explains why', () => {
    const answers = all(true).map((a) => (a.area === 'loops' ? { ...a, correct: false } : a))
    const r = evaluatePlacement(answers)
    expect(r.startUnitId).toBe('u7')
    expect(r.message).toMatch(/You seem comfortable with .* but loops could use a little practice/)
  })

  it('starts beginners at unit 1', () => {
    expect(evaluatePlacement(all(false)).startUnitId).toBe('u1')
  })
})

describe('progression', () => {
  const finish = (p: Progress, id: string, at = 1) => {
    p.lessons[id] = { firstCompletedAt: at, lastCompletedAt: at, bestAccuracy: 1, timesCompleted: 1, perfect: true }
  }
  const finishUnit = (p: Progress, unitId: string) => getUnit(unitId)!.lessons.forEach((l) => finish(p, l.id))
  const status = (p: Progress, id: string) => lessonStatus(p, getLesson(id)!)
  const revealed = (p: Progress) => UNITS.filter((u) => isUnitRevealed(p, u)).map((u) => u.id)

  it('starts a new learner at Unit 1, Lesson 1 with everything else locked', () => {
    const p = fresh()
    expect(status(p, 'u1-l1')).toBe('current')
    expect(status(p, 'u1-l2')).toBe('locked')
    expect(status(p, 'u2-l1')).toBe('locked')
    expect(checkpointStatus(p, UNITS[0])).toBe('locked')
    expect(nextStep(p)).toMatchObject({ kind: 'lesson', id: 'u1-l1' })
    expect(revealed(p)).toEqual(['u1'])
    expect(isFinalUnlocked(p)).toBe(false)
  })

  it('unlocks one lesson at a time as lessons are completed', () => {
    const p = fresh()
    finish(p, 'u1-l1')
    expect(status(p, 'u1-l1')).toBe('completed')
    expect(status(p, 'u1-l2')).toBe('current')
    expect(status(p, 'u1-l3')).toBe('locked')
    expect(upcomingLessons(p, 3).map((l) => l.id)).toEqual(['u1-l2'])
    finish(p, 'u1-l2')
    expect(status(p, 'u1-l3')).toBe('current')
  })

  it('opens the checkpoint and the next unit when the last lesson of a unit is finished', () => {
    const p = fresh()
    finishUnit(p, 'u1')
    expect(checkpointStatus(p, UNITS[0])).toBe('current')
    expect(status(p, 'u2-l1')).toBe('unlocked')
    expect(status(p, 'u2-l2')).toBe('locked')
    expect(revealed(p)).toEqual(['u1', 'u2'])
    p.units.u1 = { checkpointPassedAt: 2 }
    expect(status(p, 'u2-l1')).toBe('current')
  })

  it('keeps skipped lessons separate from completed ones, and they can still be finished', () => {
    const p = fresh()
    p.skipped = { 'u1-l1': 1, 'u1-l2': 1, 'u1-l3': 1 }
    p.unlocked = { 'u1-l4': 1 }
    expect(['u1-l1', 'u1-l2', 'u1-l3'].map((id) => status(p, id))).toEqual(['skipped', 'skipped', 'skipped'])
    expect(status(p, 'u1-l4')).toBe('current')
    expect(status(p, 'u1-l5')).toBe('locked')
    expect(nextStep(p)).toMatchObject({ id: 'u1-l4' })
    expect(p.lessons['u1-l1']).toBeUndefined()
    finish(p, 'u1-l4')
    expect(status(p, 'u1-l5')).toBe('current')
    finish(p, 'u1-l1')
    delete p.skipped['u1-l1']
    expect(status(p, 'u1-l1')).toBe('completed')
  })

  it('plans a skip: everything before the target that is not finished is passed over', () => {
    const p = fresh()
    finish(p, 'u1-l1')
    const plan = skipPlan(p, 'u1-l4')!
    expect(plan.skipped).toEqual(['u1-l2', 'u1-l3'])
    expect(skipPlan(p, 'nope')).toBeNull()
    const toFinal = skipPlan(p, 'final')!
    expect(toFinal.skipped).toContain('u8-checkpoint')
    expect(toFinal.skipped).not.toContain('u1-l1')
  })

  it('placement keeps earlier units open for review and starts at the chosen unit', () => {
    const p = fresh()
    p.placement = { completedAt: 1, skipped: false, scores: {}, startUnitId: 'u3', message: '' }
    p.units.u1 = { placedOut: true }
    p.units.u2 = { placedOut: true }
    expect(status(p, 'u1-l4')).toBe('unlocked')
    expect(status(p, 'u2-l3')).toBe('unlocked')
    expect(status(p, 'u3-l1')).toBe('current')
    expect(status(p, 'u3-l2')).toBe('locked')
    expect(nextStep(p)).toMatchObject({ id: 'u3-l1' })
    expect(revealed(p)).toEqual(['u1', 'u2', 'u3'])
  })

  it('unlocks the final challenge after the last lesson and recommends it once the units are done', () => {
    const p = fresh()
    for (const u of UNITS) finishUnit(p, u.id)
    expect(isFinalUnlocked(p)).toBe(true)
    expect(nextStep(p)).toMatchObject({ kind: 'checkpoint', unitId: 'u1' })
    for (const u of UNITS) p.units[u.id] = { checkpointPassedAt: 2 }
    expect(nextStep(p)).toMatchObject({ kind: 'final' })
  })

  it('suggests a skipped lesson when nothing new is waiting', () => {
    const p = fresh()
    for (const u of UNITS) {
      finishUnit(p, u.id)
      p.units[u.id] = { checkpointPassedAt: 2 }
    }
    delete p.lessons['u2-l2']
    p.skipped['u2-l2'] = 1
    p.final.completedAt = 3
    expect(nextStep(p)).toMatchObject({ id: 'u2-l2' })
  })
})

describe('adaptive lesson sessions', () => {
  const lesson = getLesson('u1-l1')!
  const unit = getUnit('u1')

  const toFirstQuestion = (s: SessionState) => {
    while (currentStep(s)?.kind === 'teach') s = advance(s)
    return s
  }

  it('follows explanation → example → questions → mini challenge', () => {
    const s = createLessonSession(lesson, unit, { hearts: 5 })
    expect(s.steps[0]).toMatchObject({ kind: 'teach', card: { kind: 'concept' } })
    expect(s.steps[1]).toMatchObject({ kind: 'teach', card: { kind: 'example' } })
    const last = s.steps[s.steps.length - 1]
    expect(last).toMatchObject({ kind: 'question', qid: lesson.challenge, role: 'challenge' })
    const first = toFirstQuestion(s)
    expect(getQuestion((currentStep(first) as { qid: string }).qid).difficulty).toBe(1)
  })

  it('gives a second try before revealing, then an easier follow-up and a later retry', () => {
    let s = toFirstQuestion(createLessonSession(lesson, unit, { hearts: 5 }))
    const q = getQuestion((currentStep(s) as { qid: string }).qid)
    const lengthBefore = s.steps.length
    let r = recordAttempt(s, q, false)
    expect(r.outcome).toBe('retry')
    expect(r.state.hearts).toBe(4)
    r = recordAttempt(r.state, q, false)
    expect(r.outcome).toBe('failed')
    s = r.state
    expect(s.hearts).toBe(4) // only the first wrong attempt costs a heart
    expect(s.steps.length).toBeGreaterThan(lengthBefore)
    const followup = s.steps[s.index + 1]
    expect(followup).toMatchObject({ kind: 'question', role: 'followup' })
    const retryIdx = s.steps.findIndex((st) => st.kind === 'question' && st.role === 'retry')
    const challengeIdx = s.steps.findIndex((st) => st.kind === 'question' && st.role === 'challenge')
    expect(retryIdx).toBeGreaterThan(s.index)
    expect(retryIdx).toBeLessThan(challengeIdx)
  })

  it('awards XP by difficulty and attempt, and raises difficulty after successes', () => {
    const s = toFirstQuestion(createLessonSession(lesson, unit, { hearts: null }))
    const q = getQuestion((currentStep(s) as { qid: string }).qid)
    const r = recordAttempt(s, q, true)
    expect(r.xp).toBe(XP.correct)
    expect(r.state.level).toBeGreaterThan(s.level)
    const retry = recordAttempt(s, q, false).state
    expect(recordAttempt(retry, q, true).xp).toBe(XP.secondTry)
  })

  it('runs out of hearts and summarises without counting retries', () => {
    let s = toFirstQuestion(createLessonSession(lesson, unit, { hearts: 1 }))
    const q = getQuestion((currentStep(s) as { qid: string }).qid)
    s = recordAttempt(s, q, false).state
    expect(outOfHearts(s)).toBe(true)
    s = recordAttempt(s, q, false).state
    const sum = summarize(s)
    expect(sum).toMatchObject({ total: 1, firstTry: 0, perfect: false })
  })

  it('checkpoints contain every checkpoint question and finish', () => {
    let s = createCheckpointSession(UNITS[0], { hearts: null })
    expect(s.steps).toHaveLength(UNITS[0].checkpoint.length)
    for (let i = 0; i < 20 && !isFinished(s); i++) {
      const st = currentStep(s)!
      if (st.kind === 'question') s = recordAttempt(s, getQuestion(st.qid), true).state
      s = advance(s)
    }
    expect(isFinished(s)).toBe(true)
    expect(summarize(s).perfect).toBe(true)
  })
})

describe('practice', () => {
  it('is empty until something has been taught', () => {
    expect(buildPractice(fresh(), 'smart').qids).toEqual([])
  })

  it('prioritises missed questions and weak topics from taught lessons only', () => {
    const p = fresh()
    const l1 = getLesson('u1-l1')!
    p.lessons[l1.id] = { firstCompletedAt: 1, lastCompletedAt: 1, bestAccuracy: 0.5, timesCompleted: 1, perfect: false }
    p.history = ['u1l1-01', 'u1l1-02', 'u1l1-05', 'u1l1-06'].map((qid, i) => ({ qid, topic: 'basics' as const, difficulty: 1 as const, correct: i % 2 === 0, solved: true, at: i, source: 'lesson' as const }))
    const plan = buildPractice(p, 'smart', undefined, 8, () => 0.5)
    const taught = new Set([...l1.questions, l1.challenge])
    expect(plan.qids.length).toBeGreaterThan(0)
    expect(plan.qids.every((id) => taught.has(id))).toBe(true)
    expect(plan.qids).toContain('u1l1-02')
    expect(plan.qids).toContain('u1l1-06')
    const mistakes = buildPractice(p, 'mistakes')
    expect(new Set(mistakes.qids)).toEqual(new Set(['u1l1-02', 'u1l1-06']))
  })
})

describe('grading', () => {
  it('ignores whitespace in code answers but not inside strings', () => {
    expect(normalizeCode('i < 5')).toBe(normalizeCode('i<5'))
    expect(normalizeCode('"a b"')).not.toBe(normalizeCode('"ab"'))
  })

  it('accepts equivalent fill-in answers by running them', () => {
    // the listed answer is >=, but > also makes the program print pass for a score of 75
    const q = getQuestion('u6l3-05')
    expect(grade(q, { type: 'blanks', values: ['>='] }).correct).toBe(true)
    expect(grade(q, { type: 'blanks', values: ['>'] }).correct).toBe(true)
    expect(grade(q, { type: 'blanks', values: ['<'] }).correct).toBe(false)
  })

  it('rejects decoy lines in arrange questions', () => {
    const q = getQuestion('u1l1-07')
    if (q.type !== 'arrange') throw new Error('expected arrange')
    const withDecoy = [q.lines[0], q.lines[1], q.distractors![0], q.lines[2], q.lines[3], q.lines[4]]
    expect(grade(q, { type: 'arrange', lines: withDecoy }).correct).toBe(false)
    expect(grade(q, { type: 'arrange', lines: q.lines }).correct).toBe(true)
  })

  it('grades typed output leniently about trailing spaces only', () => {
    const q = getQuestion('u5l3-09')
    expect(grade(q, { type: 'text', value: 'Ann      7 \nBob     12 \n' }).correct).toBe(true)
    expect(grade(q, { type: 'text', value: 'Ann      7\nBob     13' }).correct).toBe(false)
  })
})

describe('progress store', () => {
  it('rewards a finished lesson with XP, a streak, activity and achievements', async () => {
    const repo = new MemoryRepository()
    const store = new ProgressStore(repo)
    await store.hydrate()
    const reward = store.finishLesson('u1-l1', 'Meet Variables', { total: 5, firstTry: 5, accuracy: 1, mistakes: 0, perfect: true, xp: 60, bestCombo: 5 })
    expect(reward.xp).toBe(60 + XP.lessonComplete + XP.perfectBonus)
    expect(reward.streak).toBe(1)
    expect(reward.achievements).toEqual(expect.arrayContaining(['first-lesson', 'perfect-lesson']))
    const p = store.getSnapshot()
    expect(p.lessons['u1-l1'].perfect).toBe(true)
    expect(p.activity[0].kind).toBe('achievement')
    store.flush()
    await new Promise((r) => setTimeout(r, 0))
    expect(repo.data?.xp).toBe(reward.xp)
  })

  it('only unit completion on the first pass gives the unit bonus', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    const sum = { total: 6, firstTry: 5, accuracy: 5 / 6, mistakes: 1, perfect: false, xp: 50, bestCombo: 4 }
    expect(store.finishCheckpoint('u1', sum, true).xp).toBe(50 + XP.unitComplete)
    expect(store.finishCheckpoint('u1', sum, true).xp).toBe(50)
  })

  it('completes the chosen project once every stage is done, in any order', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    store.chooseProject('bank')
    expect(store.getSnapshot().project).toBe('bank')
    const order = [...getProject('bank')!.stages].reverse()
    for (const s of order.slice(0, -1)) {
      expect(store.completeFinalStage(s.id, s.title)?.xp).toBe(XP.finalStage)
      expect(store.getSnapshot().final.completedAt).toBeUndefined()
    }
    const last = order[order.length - 1]
    expect(store.completeFinalStage(last.id, last.title)?.xp).toBe(XP.finalStage + XP.finalComplete)
    expect(store.getSnapshot().final.completedAt).toBeTypeOf('number')
    expect(store.completeFinalStage(last.id, last.title)).toBeNull()
  })

  it('only counts stages of the chosen project towards finishing it', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    store.chooseProject('cart')
    for (const s of getProject('guesser')!.stages) store.completeFinalStage(s.id, s.title)
    expect(store.getSnapshot().final.completedAt).toBeUndefined()
    store.chooseProject('guesser')
    store.chooseProject('nope' as never)
    expect(store.getSnapshot().project).toBe('guesser')
  })

  it('offers six projects, each with its own stage ids and a video', () => {
    expect(PROJECTS.map((p) => p.id)).toEqual(['cart', 'guesser', 'bank', 'grades', 'stats', 'quiz'])
    const ids = PROJECTS.flatMap((p) => p.stages.map((s) => s.id))
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PROJECTS) for (const s of p.stages) expect(s.id.startsWith(p.id + '-')).toBe(true)
  })

  it('round-trips through export / import', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    store.setProfileName('Ada')
    const json = store.exportJson()
    const other = new ProgressStore(new MemoryRepository())
    await other.hydrate()
    expect(other.importJson(json)).toBe(true)
    expect(other.getSnapshot().profile.name).toBe('Ada')
    expect(other.importJson('{"nope": true}')).toBe(false)
  })
})

describe('saved progress', () => {
  const rec = { firstCompletedAt: 1, lastCompletedAt: 1, bestAccuracy: 1, timesCompleted: 1, perfect: true }

  it('keeps the learner but starts the rewritten course fresh', () => {
    const old = {
      ...createEmptyProgress(),
      version: 1,
      onboarded: true,
      xp: 400,
      profile: { name: 'Sam', createdAt: 5, avatar: 'robot' },
      achievements: { 'first-lesson': 9 },
      lessons: { 'u1-l1': rec },
      units: { u1: { checkpointPassedAt: 3 } },
      final: { stagesDone: ['final-1'], code: {} },
    }
    const p = migrate(old)!
    expect(p.version).toBe(PROGRESS_VERSION)
    expect(p.profile).toMatchObject({ name: 'Sam', createdAt: 5, avatar: 'lauder' })
    expect(p).toMatchObject({ onboarded: true, xp: 400, achievements: { 'first-lesson': 9 } })
    expect(p.lessons).toEqual({})
    expect(p.units).toEqual({})
    expect(p.final.stagesDone).toEqual([])
  })

  it('leaves a current save untouched', () => {
    const current = { ...createEmptyProgress(), onboarded: true, project: 'grades' as const, lessons: { 'u1-l1': rec }, final: { stagesDone: ['grades-2'], code: {} } }
    const p = migrate(JSON.parse(JSON.stringify(current)))!
    expect(Object.keys(p.lessons)).toEqual(['u1-l1'])
    expect(p.final.stagesDone).toEqual(['grades-2'])
    expect(p.project).toBe('grades')
  })

  it('forgets the removed Math class and random numbers lessons', () => {
    const at = { topic: 'arithmetic' as const, difficulty: 1 as const, correct: true, solved: true, at: 1, source: 'lesson' as const }
    const v4 = {
      ...createEmptyProgress(),
      version: 4,
      onboarded: true,
      lessons: { 'u3-l4': rec, 'u3-l5': rec, 'u3-l6': rec },
      skipped: { 'u3-l5': 1 },
      unlocked: { 'u3-l6': 1, 'u4-l1': 2 },
      history: [
        { ...at, qid: 'u3l4-01' },
        { ...at, qid: 'u3l5-02', topic: 'math' },
        { ...at, qid: 'u3l6-03', topic: 'math' },
      ],
    } as unknown as Progress
    const p = migrate(v4)!
    expect(Object.keys(p.lessons)).toEqual(['u3-l4'])
    expect(p.history.map((a) => a.qid)).toEqual(['u3l4-01'])
    expect(p.skipped).toEqual({})
    expect(p.unlocked).toEqual({ 'u4-l1': 2 })
  })

  it('drops the old café kiosk progress and asks for a project', () => {
    const v3 = { ...createEmptyProgress(), version: 3, onboarded: true, lessons: { 'u1-l1': rec }, final: { stagesDone: ['final-1', 'final-2'], completedAt: 4, code: { 'final-1': 'x' } } } as Partial<Progress>
    delete v3.project
    const p = migrate(v3)!
    expect(Object.keys(p.lessons)).toEqual(['u1-l1'])
    expect(p.final).toEqual({ stagesDone: [], code: {} })
    expect(p.project).toBeNull()
  })

  it('rejects a save from a newer version', () => {
    expect(migrate({ ...createEmptyProgress(), version: PROGRESS_VERSION + 1 })).toBeNull()
  })
})

describe('skipping ahead', () => {
  const summary = { total: 5, firstTry: 5, accuracy: 1, mistakes: 0, perfect: true, xp: 60, bestCombo: 5 }

  it('marks what was passed over as skipped, opens the target, and completes nothing', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    const count = store.skipAhead('u1-l4')
    expect(count).toBe(3)
    const p = store.getSnapshot()
    expect(Object.keys(p.skipped).sort()).toEqual(['u1-l1', 'u1-l2', 'u1-l3'])
    expect(Object.keys(p.unlocked)).toEqual(['u1-l4'])
    expect(p.lessons).toEqual({})
    expect(lessonStatus(p, getLesson('u1-l4')!)).toBe('current')
    expect(lessonStatus(p, getLesson('u1-l1')!)).toBe('skipped')
    expect(lessonStatus(p, getLesson('u1-l5')!)).toBe('locked')
  })

  it('does not re-skip lessons that are already finished or skipped', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    store.finishLesson('u1-l1', 'Every Program Starts with class Main', summary)
    expect(store.skipAhead('u1-l3')).toBe(1)
    expect(store.skipAhead('u1-l5')).toBe(2)
    expect(Object.keys(store.getSnapshot().skipped).sort()).toEqual(['u1-l2', 'u1-l3', 'u1-l4'])
  })

  it('finishing a skipped lesson clears its skipped mark', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    store.skipAhead('u1-l3')
    expect(store.getSnapshot().skipped['u1-l1']).toBeTypeOf('number')
    store.finishLesson('u1-l1', 'x', summary)
    const p = store.getSnapshot()
    expect(p.skipped['u1-l1']).toBeUndefined()
    expect(lessonStatus(p, getLesson('u1-l1')!)).toBe('completed')
    expect(lessonStatus(p, getLesson('u1-l2')!)).toBe('skipped')
  })

  it('skipping to the final challenge opens it without completing anything', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    expect(isFinalUnlocked(store.getSnapshot())).toBe(false)
    store.skipAhead('final')
    const p = store.getSnapshot()
    expect(isFinalUnlocked(p)).toBe(true)
    expect(p.lessons).toEqual({})
    expect(p.final.completedAt).toBeUndefined()
  })

  it('ignores a target that does not exist', async () => {
    const store = new ProgressStore(new MemoryRepository())
    await store.hydrate()
    expect(store.skipAhead('nope')).toBe(0)
    expect(store.getSnapshot().skipped).toEqual({})
  })

  it('older saves load with empty skipped and unlocked records', () => {
    const old = { ...createEmptyProgress(), version: 2, onboarded: true } as Partial<Progress>
    delete old.skipped
    delete old.unlocked
    const p = migrate(old)!
    expect(p.skipped).toEqual({})
    expect(p.unlocked).toEqual({})
    expect(p.version).toBe(PROGRESS_VERSION)
  })
})
