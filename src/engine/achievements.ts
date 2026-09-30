/**
 * Achievement definitions. Every check is a pure function of the progress
 * document, so achievements can be re-evaluated at any time (or on a server).
 */
import { UNITS } from '../data/curriculum'
import type { Progress } from '../state/types'
import { liveStreak, dayKey } from './dates'
import { levelFor } from './gamification'
import { isUnitComplete } from './progression'

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  /** tailwind color family for the badge */
  color: 'brew' | 'sky' | 'grape' | 'mint' | 'berry' | 'sun' | 'teal' | 'cocoa'
  check: (p: Progress) => boolean
  /** optional progress towards the goal, for locked badges */
  progress?: (p: Progress) => { value: number; goal: number }
}

const unit = (id: string) => UNITS.find((u) => u.id === id)!

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-lesson',
    title: 'First Lesson',
    description: 'Complete your very first lesson.',
    icon: '🏆',
    color: 'sun',
    check: (p) => Object.keys(p.lessons).length >= 1,
  },
  {
    id: 'placement',
    title: 'Know Your Level',
    description: 'Finish the placement test.',
    icon: '🧭',
    color: 'sky',
    check: (p) => !!p.placement && !p.placement.skipped,
  },
  {
    id: 'streak-3',
    title: 'Warming Up',
    description: 'Reach a 3-day streak.',
    icon: '🔥',
    color: 'brew',
    check: (p) => p.streak.longest >= 3,
    progress: (p) => ({ value: Math.max(liveStreak(p.streak, dayKey()), 0), goal: 3 }),
  },
  {
    id: 'streak-7',
    title: '7 Day Streak',
    description: 'Practice Java 7 days in a row.',
    icon: '🔥',
    color: 'berry',
    check: (p) => p.streak.longest >= 7,
    progress: (p) => ({ value: liveStreak(p.streak, dayKey()), goal: 7 }),
  },
  {
    id: 'first-bug',
    title: 'First Bug Fixed',
    description: 'Solve your first debugging question.',
    icon: '🐛',
    color: 'mint',
    check: (p) => p.stats.bugsFixed >= 1,
  },
  {
    id: 'perfect-lesson',
    title: 'Perfect Lesson',
    description: 'Finish a lesson without a single mistake.',
    icon: '💯',
    color: 'berry',
    check: (p) => Object.values(p.lessons).some((l) => l.perfect),
  },
  {
    id: 'java-apprentice',
    title: 'Java Apprentice',
    description: 'Complete 10 lessons.',
    icon: '☕',
    color: 'cocoa',
    check: (p) => Object.keys(p.lessons).length >= 10,
    progress: (p) => ({ value: Object.keys(p.lessons).length, goal: 10 }),
  },
  {
    id: 'first-unit',
    title: 'Checkpoint Cleared',
    description: 'Pass your first unit checkpoint.',
    icon: '🎓',
    color: 'grape',
    check: (p) => UNITS.some((u) => isUnitComplete(p, u)),
  },
  {
    id: 'logic-master',
    title: 'Logic Master',
    description: 'Complete the Expressions and Conditionals units.',
    icon: '🧠',
    color: 'grape',
    check: (p) => isUnitComplete(p, unit('u2')) && isUnitComplete(p, unit('u3')),
  },
  {
    id: 'loop-master',
    title: 'Loop Master',
    description: 'Complete the Loops unit.',
    icon: '🔁',
    color: 'mint',
    check: (p) => isUnitComplete(p, unit('u4')),
  },
  {
    id: 'exception-handler',
    title: 'Exception Handler',
    description: 'Complete the Input & Error Handling unit.',
    icon: '🛡️',
    color: 'berry',
    check: (p) => isUnitComplete(p, unit('u5')),
  },
  {
    id: 'format-wizard',
    title: 'Format Wizard',
    description: 'Complete the printf unit.',
    icon: '🖨️',
    color: 'teal',
    check: (p) => isUnitComplete(p, unit('u7')),
  },
  {
    id: 'sharpshooter',
    title: 'Sharpshooter',
    description: 'Answer 10 questions in a row correctly.',
    icon: '🎯',
    color: 'sky',
    check: (p) => p.stats.bestCombo >= 10,
    progress: (p) => ({ value: p.stats.bestCombo, goal: 10 }),
  },
  {
    id: 'practice-5',
    title: 'Practice Makes Perfect',
    description: 'Complete 5 practice sessions.',
    icon: '🏋️',
    color: 'teal',
    check: (p) => p.stats.practiceSessions >= 5,
    progress: (p) => ({ value: p.stats.practiceSessions, goal: 5 }),
  },
  {
    id: 'sandbox-10',
    title: 'Sandbox Scientist',
    description: 'Run 10 Java programs.',
    icon: '🧪',
    color: 'sky',
    check: (p) => p.stats.programsRun >= 10,
    progress: (p) => ({ value: p.stats.programsRun, goal: 10 }),
  },
  {
    id: 'xp-1000',
    title: 'Power Surge',
    description: 'Earn 1,000 XP.',
    icon: '⚡',
    color: 'sun',
    check: (p) => p.xp >= 1000,
    progress: (p) => ({ value: p.xp, goal: 1000 }),
  },
  {
    id: 'java-master',
    title: 'Java Master',
    description: 'Reach Level 6.',
    icon: '👑',
    color: 'sun',
    check: (p) => levelFor(p.xp).level >= 6,
  },
  {
    id: 'cafe-champion',
    title: 'Café Champion',
    description: 'Complete the Java Final Challenge.',
    icon: '🏁',
    color: 'brew',
    check: (p) => !!p.final.completedAt,
  },
]

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

/** ids of achievements that are earned but not yet recorded */
export function newlyEarned(p: Progress): string[] {
  return ACHIEVEMENTS.filter((a) => !p.achievements[a.id] && a.check(p)).map((a) => a.id)
}
