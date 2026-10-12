import { DIALOGUE } from './battleDialogue'
import type { IconName } from './types'

/**
 * The Practice stadium: Mr. Lauder dribbles past a team of superpowered defenders, one question each,
 * then takes on the goalkeeper. Bryan and Avik keep their personalities (and their lines from the
 * battle); the rest of the team is made up of original, fictional villains.
 */

export type DefenderId = 'bryan' | 'avik' | 'frostbyte' | 'glitch' | 'graviton' | 'polarity' | 'tremor' | 'null'

/** What a defender's superpower looks like on the pitch. */
export type PowerKind = 'firewall' | 'speed' | 'ice' | 'teleport' | 'gravity' | 'magnet' | 'quake' | 'shield'

/** The moments a defender says something. */
export type StadiumMoment = 'intro' | 'taunt' | 'power' | 'beaten' | 'victory' | 'playerWon'

export interface DefenderDef {
  id: DefenderId
  name: string
  /** the villain title, like "The Firewall" */
  title: string
  power: PowerKind
  /** the power, in one short line for the team sheet */
  powerName: string
  powerText: string
  /** the move Mr. Lauder uses to get past them */
  skill: string
  icon: IconName
  /** shirt number shown on their kit and the team sheet */
  number: string
  lines: Record<StadiumMoment, string[]>
}

export const DEFENDERS: Record<DefenderId, DefenderDef> = {
  bryan: {
    id: 'bryan',
    name: 'Bryan',
    title: 'The Firewall',
    power: 'firewall',
    powerName: 'Firewall',
    powerText: 'Throws up a blazing force field that blocks the way.',
    skill: 'Stepover chip',
    icon: 'flame',
    number: '1',
    lines: {
      intro: DIALOGUE.bryan.intro,
      taunt: [...DIALOGUE.bryan.taunt, "Nobody dribbles past me. I'm the best footy player!"],
      power: ['FIREWALL UP! Not even a Fortnite pro gets through this!', 'Blocked! I built this wall in one day, obviously.', ...DIALOGUE.bryan.attack],
      beaten: [...DIALOGUE.bryan.defeated, ...DIALOGUE.bryan.hit],
      victory: DIALOGUE.bryan.victory,
      playerWon: DIALOGUE.bryan.playerWon,
    },
  },
  avik: {
    id: 'avik',
    name: 'Avik',
    title: 'The Speed Demon',
    power: 'speed',
    powerName: 'Speed Demon',
    powerText: 'Moves at superhuman speed to intercept the ball.',
    skill: 'Cruyff turn',
    icon: 'zap',
    number: '2',
    lines: {
      intro: DIALOGUE.avik.intro,
      taunt: [...DIALOGUE.avik.taunt, 'I am the worst footy player. I am, however, the fastest.'],
      power: ['Speed calculated: 300 kilometres per hour. Ball acquired.', 'Interception complete. Efficiency: 100 percent.', ...DIALOGUE.avik.attack],
      beaten: [...DIALOGUE.avik.defeated, ...DIALOGUE.avik.hit],
      victory: DIALOGUE.avik.victory,
      playerWon: DIALOGUE.avik.playerWon,
    },
  },
  frostbyte: {
    id: 'frostbyte',
    name: 'Frostbyte',
    title: 'The Ice Wall',
    power: 'ice',
    powerName: 'Ice Barrier',
    powerText: 'Raises a wall of ice and freezes anyone who runs into it.',
    skill: 'Nutmeg',
    icon: 'shield',
    number: '0',
    lines: {
      intro: ['Ice to meet you. Now freeze.'],
      taunt: ['Chill. This question is about to give you brain freeze.', 'Cold logic only. No warm guesses.', 'Stay frosty, teacher.'],
      power: ['ICE BARRIER! Your dribble just froze over.', 'Brrr. That answer left you out in the cold.'],
      beaten: ['You cracked my ice. Not cool. Actually, very cool.', 'Melted. I need a moment.'],
      victory: ['The ball is on ice. Permanently.'],
      playerWon: ['Okay, that goal was ice cold. Respect.'],
    },
  },
  glitch: {
    id: 'glitch',
    name: 'Glitch',
    title: 'The Teleporter',
    power: 'teleport',
    powerName: 'Teleport',
    powerText: 'Blinks out of sight and reappears right where you are going.',
    skill: 'Roulette spin',
    icon: 'sparkles',
    number: '404',
    lines: {
      intro: ['N-n-now you see me...'],
      taunt: ['Error 404: path to goal not found.', "I-I-I'm everywhere at o-once.", 'Blink and you m-m-miss me.'],
      power: ['*bzzt* TELEPORT! Ball st-st-stolen.', "Now you d-don't see me. Now you do. Behind you."],
      beaten: ['W-wait, I teleported to the wrong c-coordinates!', 'Fatal error. Rebooting... rebooting...'],
      victory: ['G-g-game over. Insert coin to try again.'],
      playerWon: ['That g-goal broke my code. Nice.'],
    },
  },
  graviton: {
    id: 'graviton',
    name: 'Graviton',
    title: 'The Gravity Well',
    power: 'gravity',
    powerName: 'Gravity Well',
    powerText: 'Bends gravity so the ball (and you) float away.',
    skill: 'Rainbow flick',
    icon: 'target',
    number: '9.8',
    lines: {
      intro: ['Everything... falls... to Graviton.'],
      taunt: ['Feel the weight of this question.', 'Gravity always wins. Always.', 'You are about to feel very, very heavy.'],
      power: ['GRAVITY WELL! Up you go... and down you come.', 'The ball weighs a thousand tonnes now. Good luck.'],
      beaten: ['Impossible. You defied gravity.', 'My gravity... has let me down.'],
      victory: ['Everything falls to Graviton. Including your score.'],
      playerWon: ['That goal had real weight to it. Well played.'],
    },
  },
  polarity: {
    id: 'polarity',
    name: 'Polarity',
    title: 'The Magnet',
    power: 'magnet',
    powerName: 'Magnet Pull',
    powerText: 'Pulls the ball straight off your foot with a magnetic field.',
    skill: 'Elastico',
    icon: 'refresh',
    number: '+-',
    lines: {
      intro: ['Opposites attract. The ball is attracted to me.'],
      taunt: ['The ball and I share a special bond. A magnetic one.', 'Positive you know this one? I am negative you do.'],
      power: ['MAGNET PULL! Come to me, little ball.', 'Repelled! You and the ball are on opposite poles.'],
      beaten: ['My poles... they are reversed!', 'You broke my magnetic field. Rude.'],
      victory: ['The ball stuck to me. Like it was always meant to.'],
      playerWon: ['I am strangely attracted to that goal. Nice one.'],
    },
  },
  tremor: {
    id: 'tremor',
    name: 'Tremor',
    title: 'The Earthquake',
    power: 'quake',
    powerName: 'Earthquake Stomp',
    powerText: 'Stomps so hard the whole pitch shakes.',
    skill: 'Jump and burst',
    icon: 'bomb',
    number: '8.0',
    lines: {
      intro: ['TREMOR. STOMP. DEFEND.'],
      taunt: ['THE GROUND SHAKES WHEN I THINK. THINK FAST.', 'ONE STOMP. THAT IS ALL IT TAKES.'],
      power: ['EARTHQUAKE STOMP! Hold on to something!', 'The whole pitch is shaking. So is that answer.'],
      beaten: ['TREMOR... FALL... DOWN.', 'How did you dribble through an earthquake?!'],
      victory: ['TREMOR. WINS. STOMP OF VICTORY.'],
      playerWon: ['THAT GOAL. SHOOK. TREMOR.'],
    },
  },
  null: {
    id: 'null',
    name: 'The Null',
    title: 'The Goalkeeper',
    power: 'shield',
    powerName: 'Energy Shield',
    powerText: 'Covers the whole goal with a crackling energy shield.',
    skill: 'Top-corner screamer',
    icon: 'shield',
    number: '1',
    lines: {
      intro: ['Nothing gets past null.'],
      taunt: ['Your shot will point to nothing.', 'Shield charged. Probability of a goal: zero.'],
      power: ['ENERGY SHIELD! NullPointerException: your shot points nowhere.', 'Saved. That goal is null and void.'],
      beaten: ['Shield... failing... GOAL detected.', 'Unexpected value: a goal.'],
      victory: ['Clean sheet. Return null.'],
      playerWon: ['Goal accepted. I will update my shield. Or ask Bryan for a firewall.'],
    },
  },
}

/** Bryan and Avik always start; the other outfield villains are shuffled each match; the keeper is last. */
export const FIRST_DEFENDERS: DefenderId[] = ['bryan', 'avik']
export const OTHER_DEFENDERS: DefenderId[] = ['frostbyte', 'glitch', 'graviton', 'polarity', 'tremor']
export const KEEPER: DefenderId = 'null'

/** What Mr. Lauder says at the big moments. Short, warm, and teacherly. */
export const LAUDER_LINES = {
  kickoff: ["Right, class. Ball at my feet, Java in my head. Let's go!", 'Watch and learn. Every right answer gets us closer to that goal.'],
  beat: ['Read it, reasoned it, beat them.', 'That is how we do it!', 'Clean. Next!'],
  stopped: ["Ooh. Let's look at why, then go again.", 'No problem. Mistakes are how we learn.', 'Shake it off. We go again.'],
  goal: ['GOAL! What a team effort!', 'Top corner! That one was for the whole class!'],
  lost: ['They got the ball this time. We will be back.', 'Good effort. Review those answers and we go again.'],
}

/** Pick a line, avoiding the last one said when there is a choice. */
export function pickFrom(lines: string[], last?: string, rand: () => number = Math.random): string {
  if (!lines.length) return ''
  const options = lines.length > 1 ? lines.filter((l) => l !== last) : lines
  return options[Math.floor(rand() * options.length)]
}
