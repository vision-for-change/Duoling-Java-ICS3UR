import type { VillainId } from '../components/Villains'

/** The moments a villain says something during a battle. */
export type BattleMoment =
  /** the lobby and the first question */
  | 'intro'
  /** now and then, as a new question appears */
  | 'taunt'
  /** the player answered correctly, so this villain just took a hit */
  | 'hit'
  /** the player answered wrong, so this villain attacks */
  | 'attack'
  /** the timer ran out */
  | 'timeout'
  /** this villain's health hit zero */
  | 'defeated'
  /** Avik stepping in after Bryan goes down */
  | 'stepIn'
  /** the player lost: the villains celebrate */
  | 'victory'
  /** the player won: the villains react on the results screen */
  | 'playerWon'

/**
 * Bryan: loud, competitive and far too confident. Fortnite, football, and a game called "holy moly" he built in a day.
 * Avik: calm, logical and deadpan. His robotic arm is his biggest flex, and he admits he is the worst footy player.
 * The teasing stays friendly: it pokes at the answer, never at the person.
 */
export const DIALOGUE: Record<VillainId, Record<BattleMoment, string[]>> = {
  bryan: {
    intro: [
      'I make Fortnite in one day!',
      "I've already won. I just haven't finished celebrating yet.",
      "One wrong answer and you're getting fried by me in holy moly java battle!",
      "You think you can out-code me? That's adorable.",
    ],
    taunt: [
      "My code doesn't have bugs because I made holy moly in 1 day.",
      'Tick tock! I answer these faster than I score free kicks.',
      'Easy one. I could do this mid-match with my eyes closed.',
      'Hurry up, I have a Fortnite match in five minutes!',
      "I'm the best footy player! And the best coder. Obviously.",
    ],
    hit: [
      'Ow! Lucky shot! That was a total fluke!',
      "Hey! I wasn't ready! Rematch! REMATCH!",
      'Fine. Even the best footy player gets tackled sometimes.',
      "Okay, you got one. I'm still the GOAT.",
      "That didn't hurt. My health bar is just being dramatic.",
    ],
    attack: [
      'GOOOAL! Top corner, right into your health bar!',
      'Fried! Holy moly, that was too easy!',
      "I'm the best footy player! Watch this kick!",
      'Wrong answer! I practiced for one whole day, you know.',
    ],
    timeout: ['Too slow! I built a whole game in that time!', 'Time! I scored three goals while you were thinking.'],
    defeated: ['No way... I demand a replay review!', 'I lagged! That totally does not count!', 'My controller died! Avik, help!'],
    stepIn: [],
    victory: ["VICTORY! I told you I'd already won!", 'Fried in holy moly java battle! Come back after one day of practice.'],
    playerWon: ["Fine, you won. But I'm still the best footy player.", 'That was a warm-up. Next time I go full holy moly.'],
  },
  avik: {
    intro: [
      'My biggest flex is making a robotic arm.',
      'I have calculated 47 reasons why you will lose.',
      'Bryan is the warm-up. I am the final exam.',
    ],
    taunt: [
      'Take your time. Statistically, rushing raises your error rate.',
      'My robotic arm is already typing the correct answer.',
      'This question has exactly one right answer. I checked.',
      'I am the worst footy player. I am not the worst at Java.',
    ],
    hit: [
      'That attack was inefficient. Try again.',
      'Damage detected. Recalibrating.',
      'Correct. I will allow it.',
      'Well reasoned. I am mildly impressed.',
    ],
    attack: [
      'Statistically, you have made a questionable decision.',
      'Your answer is incorrect. I expected better computational reasoning.',
      'Robotic arm: engage.',
      'Error located. It was in your answer.',
    ],
    timeout: ['You ran out of time. I did not.', 'The timer reached zero. As I predicted.'],
    defeated: ['Impossible. My calculations had a rounding error.', 'I am the worst footy player, and apparently the worst villain too.'],
    stepIn: ['Bryan has been defeated. As predicted. My turn.', 'Step aside, Bryan. I will handle this with logic.'],
    victory: ['As calculated. Reason number 48: you did not review.', 'I am the worst footy player, but a very good villain.'],
    playerWon: ['Well played. I will update my 47 reasons.', 'Your computational reasoning was... acceptable. Very acceptable.'],
  },
}

/** Pick a line, avoiding the one said last time when there is a choice. */
export function pickLine(who: VillainId, moment: BattleMoment, last?: string, rand: () => number = Math.random): string {
  const lines = DIALOGUE[who][moment]
  if (!lines.length) return ''
  const options = lines.length > 1 ? lines.filter((l) => l !== last) : lines
  return options[Math.floor(rand() * options.length)]
}

