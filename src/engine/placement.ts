/**
 * Placement test scoring and starting-point recommendation.
 */
import { UNITS } from '../data/curriculum'
import { PLACEMENT_AREAS } from '../data/placement'
import type { PlacementArea } from '../data/types'
import type { PlacementResult } from '../state/types'

export interface PlacementAnswer {
  area: PlacementArea
  correct: boolean
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1]
}

export function evaluatePlacement(answers: PlacementAnswer[], now = Date.now()): PlacementResult {
  const scores: PlacementResult['scores'] = {}
  for (const a of answers) {
    const s = (scores[a.area] ??= { correct: 0, total: 0 })
    s.total++
    if (a.correct) s.correct++
  }
  const areaOk = (area: PlacementArea) => {
    const s = scores[area]
    return !!s && s.correct === s.total
  }

  // Start at the first unit that contains an area with a mistake.
  let startUnitId = UNITS[UNITS.length - 1].id
  for (const unit of UNITS.slice(0, -1)) {
    const areas = (Object.keys(PLACEMENT_AREAS) as PlacementArea[]).filter((a) => PLACEMENT_AREAS[a].unitId === unit.id)
    if (areas.some((a) => !areaOk(a))) {
      startUnitId = unit.id
      break
    }
  }

  const tested = (Object.keys(PLACEMENT_AREAS) as PlacementArea[]).filter((a) => scores[a])
  const comfortable = tested.filter(areaOk).map((a) => PLACEMENT_AREAS[a].label.toLowerCase())
  const needsWork = tested.filter((a) => !areaOk(a)).map((a) => PLACEMENT_AREAS[a].label.toLowerCase())

  let message: string
  if (comfortable.length === 0) {
    message = "Let's start from the very beginning. Byte will guide you one small step at a time."
  } else if (needsWork.length === 0) {
    message = 'Impressive! You already know the fundamentals. Jump into the Mixed Problems and aim for the Final Challenge.'
  } else {
    message = `You seem comfortable with ${joinList(comfortable.slice(0, 3))}, but ${joinList(needsWork.slice(0, 2))} could use some practice.`
  }

  return { completedAt: now, skipped: false, scores, startUnitId, message }
}

export function skippedPlacement(now = Date.now()): PlacementResult {
  return {
    completedAt: now,
    skipped: true,
    scores: {},
    startUnitId: UNITS[0].id,
    message: "You're starting from the beginning. Every Java expert started with their first variable!",
  }
}
