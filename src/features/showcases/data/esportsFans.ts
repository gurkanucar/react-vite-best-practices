import type { Reaction } from '@/features/showcases/data/esportsCopy'
import {
  crowdSplit,
  type Fate,
  type LiveState,
  type ScriptEvent,
  type Side,
} from '@/features/showcases/data/esportsSim'

export const REACTIONS: { key: Reaction; emoji: string }[] = [
  { key: 'heart', emoji: '❤️' },
  { key: 'fire', emoji: '🔥' },
  { key: 'clap', emoji: '👏' },
  { key: 'party', emoji: '🎉' },
]

/** Scoring moments that set the stands off. */
export const cheers = (event: ScriptEvent) =>
  event.kind === 'goal' ||
  event.kind === 'score' ||
  event.kind === 'point' ||
  event.kind === 'game' ||
  (event.kind === 'penalty' && !event.missed) ||
  (event.kind === 'periodEnd' && event.side !== undefined) ||
  (event.kind === 'move' && event.note === 'mate')

/**
 * The crowd's running count for a side: steady chatter by the minute, weighted by how many
 * fans each side has, plus a burst for every scoring moment and a bigger one for the big
 * moments. Worked out from the match alone, so everyone watching sees the same numbers.
 */
export function crowdCount(fate: Fate, state: LiveState, side: Side) {
  const [shareA] = crowdSplit(fate)
  const share = side === 'a' ? shareA / 100 : 1 - shareA / 100
  const minutes = state.elapsed / 60_000
  const moments = state.events.filter((event) => event.side === side && cheers(event))
  const big = moments.filter((event) => event.big).length
  return Math.round(minutes * (40 + 90 * share) + moments.length * 6 + big * 180)
}
