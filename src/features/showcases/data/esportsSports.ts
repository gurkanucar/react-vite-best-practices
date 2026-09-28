/*
 * One simulator per sport. Each turns a seeded random generator and the two sides'
 * strength into a complete match script: every event with its real-time offset, plus the
 * play and break phases the live clock is read from. Rules follow the real sports:
 *
 * - Football: two 45-minute halves plus stoppage time, cards (a second yellow is a red, and
 *   the team plays a man down), substitutions; knockout ties go to extra time and penalties.
 * - Basketball (FIBA): four 10-minute quarters, 2- and 3-pointers and free throws, team
 *   fouls with the bonus from the fifth, fouling out on five, timeouts, overtime on a tie.
 * - Volleyball: best of five sets, rally scoring to 25 (fifth set to 15), win by two.
 * - Tennis: 15/30/40, deuce and advantage, sets to six with a tie-break at 6–6.
 * - Chess: replays a pre-scripted game with both clocks (25 minutes + 10 seconds a move).
 *
 * Broadcasts run faster than real life; `pace` stretches or squeezes a whole script so a
 * league match fits its slot. Pace never changes a random draw, so results stay fixed.
 */
import type { SportId, Team } from '@/features/showcases/data/esports'
import { chessGames, type ChessGame } from '@/features/showcases/data/esportsChess'

export type Side = 'a' | 'b'

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

/* ---------- Random numbers that repeat ---------- */

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function seededRandom(seed: string) {
  let state = hashString(seed) || 1
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let next = Math.imul(state ^ (state >>> 15), 1 | state)
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

export type Random = ReturnType<typeof seededRandom>

/** Fisher–Yates with the seeded generator, so the order is the same every time. */
export function shuffled<T>(items: T[], random: Random): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[copy[index], copy[other]] = [copy[other], copy[index]]
  }
  return copy
}

export const between = (random: Random, min: number, max: number) =>
  Math.floor(min + random() * (max - min + 1))

function weighted<T>(random: Random, items: T[], weight: (item: T) => number): T {
  const total = items.reduce((sum, item) => sum + weight(item), 0)
  let roll = random() * total
  for (const item of items) {
    roll -= weight(item)
    if (roll <= 0) return item
  }
  return items[items.length - 1]
}

/** Chance that A beats B, from their ratings (the usual Elo curve). */
export function winChance(ratingA: number, ratingB: number) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400))
}

export const other = (side: Side): Side => (side === 'a' ? 'b' : 'a')
const index = (side: Side) => (side === 'a' ? 0 : 1)

/* ---------- Script shapes ---------- */

export type EventKind =
  | 'start'
  | 'periodEnd'
  | 'end'
  | 'goal'
  | 'shot'
  | 'corner'
  | 'foul'
  | 'yellow'
  | 'red'
  | 'sub'
  | 'penalty'
  | 'score'
  | 'timeout'
  | 'foulOut'
  | 'point'
  | 'game'
  | 'move'

export type EventNote =
  | 'penalty'
  | 'secondYellow'
  | 'onTarget'
  | 'ace'
  | 'block'
  | 'attack'
  | 'error'
  | 'doubleFault'
  | 'break'
  | 'tiebreak'
  | 'bonus'
  | 'check'
  | 'mate'
  | 'resign'
  | 'repetition'
  | 'agreed'
  | 'armageddon'
  | 'extraTime'
  | 'shootout'
  | 'overtime'

export type Situation = 'breakPoint' | 'setPoint' | 'matchPoint'

export interface ScriptEvent {
  /** Milliseconds from the scheduled start. */
  at: number
  kind: EventKind
  side?: Side
  /** Roster index of the player involved. */
  player?: number
  /** A second player: the assist, or the player coming on. */
  other?: number
  /** Half, quarter, set or chess game, from 1. Football extra time is 3 and 4. */
  period: number
  /** Football: the minute on the clock, counting on through stoppage (47 is 45+2). */
  minute?: number
  /** Basketball: seconds left in the period. */
  clock?: number
  /** Basketball: 1, 2 or 3. */
  points?: number
  note?: EventNote
  /** A missed penalty in a shoot-out. */
  missed?: boolean
  /** The match score after this event: goals, points, sets or chess points. */
  score: [number, number]
  /** Inside the period: rally points in a volleyball set, games in a tennis set, a shoot-out. */
  inner?: [number, number]
  /** Tennis: the point score shown after this event, and who serves. */
  tennis?: { points: [string, string]; server: Side }
  /** Who is one point from the game, set or match after this one. */
  situation?: { side: Side; kind: Situation }
  /** Chess. */
  san?: string
  ply?: number
  clocks?: [number, number]
  /** Worth a banner in live mode. */
  big?: boolean
}

export type PhaseLabel =
  | 'pre'
  | 'half'
  | 'halftime'
  | 'extra'
  | 'extraBreak'
  | 'shootout'
  | 'quarter'
  | 'quarterBreak'
  | 'overtime'
  | 'set'
  | 'setBreak'
  | 'game'
  | 'gameBreak'

export interface Phase {
  start: number
  end: number
  kind: 'play' | 'break'
  label: PhaseLabel
  period: number
  /** Football: the minute the period starts from. Basketball: its length in seconds. */
  base?: number
  /** Football: nominal minutes (45 or 15). */
  length?: number
  /** Real milliseconds per game minute (football) or game second (basketball). */
  unit?: number
}

export interface ChessBoardRef {
  id: string
  /** The side playing White in this game. */
  white: Side
}

export interface MatchScript {
  sport: SportId
  events: ScriptEvent[]
  phases: Phase[]
  duration: number
  winner: Side | null
  score: [number, number]
  /** The score of each half, quarter or set (games per set in tennis). */
  periods: [number, number][]
  shootout?: [number, number]
  decidedBy?: 'extraTime' | 'shootout' | 'overtime' | 'armageddon'
  chess?: ChessBoardRef[]
}

export interface SimOptions {
  knockout: boolean
  /** Tennis: sets needed to win. */
  setsToWin?: number
  /** Real-time multiplier for every duration. */
  pace: number
}

type Snapshot = Omit<ScriptEvent, 'score'>

/** Collects events and phases, stamping each event with the current score. */
function recorder() {
  const events: ScriptEvent[] = []
  const phases: Phase[] = []
  const score: [number, number] = [0, 0]
  return {
    events,
    phases,
    score,
    add: (event: Snapshot) => {
      events.push({ ...event, score: [score[0], score[1]] })
    },
  }
}

const PRE = 60 * SECOND

/* ---------- Football ---------- */

const goalWeight: Record<string, number> = {
  gk: 0.02,
  rb: 0.5,
  lb: 0.5,
  cb: 0.45,
  dm: 0.8,
  cm: 1.3,
  am: 2.4,
  rw: 2.6,
  lw: 2.6,
  st: 4.5,
}
const assistWeight: Record<string, number> = {
  gk: 0.05,
  rb: 1,
  lb: 1,
  cb: 0.4,
  dm: 0.9,
  cm: 1.6,
  am: 2.6,
  rw: 2.2,
  lw: 2.2,
  st: 1.4,
}
const foulWeight: Record<string, number> = {
  gk: 0.1,
  rb: 1.4,
  lb: 1.4,
  cb: 1.6,
  dm: 1.8,
  cm: 1.2,
  am: 0.7,
  rw: 0.7,
  lw: 0.7,
  st: 0.9,
}

function football(
  random: Random,
  pA: number,
  teams: [Team, Team],
  options: SimOptions,
): MatchScript {
  const unit = 20 * SECOND * options.pace
  const rec = recorder()
  const { add, phases, score } = rec
  const strength = (side: Side) => (side === 'a' ? pA : 1 - pA)
  const onPitch = { a: [...Array(11).keys()], b: [...Array(11).keys()] }
  const yellow = { a: new Set<number>(), b: new Set<number>() }
  const bench = { a: [12, 13], b: [12, 13] }
  const subMinutes = {
    a: [between(random, 56, 70), between(random, 71, 86)],
    b: [between(random, 58, 72), between(random, 73, 87)],
  }
  const periods: [number, number][] = []
  const position = (side: Side, player: number) => teams[index(side)].roster[player].position

  phases.push({ start: 0, end: PRE * options.pace, kind: 'break', label: 'pre', period: 0 })
  let t = PRE * options.pace
  add({ at: t, kind: 'start', period: 1, minute: 0 })

  const playPeriod = (period: number, base: number, length: number, stoppage: number) => {
    const start = t
    const before: [number, number] = [score[0], score[1]]
    phases.push({
      start,
      end: start + (length + stoppage) * unit,
      kind: 'play',
      label: period <= 2 ? 'half' : 'extra',
      period,
      base,
      length,
      unit,
    })
    for (let step = 0; step < length + stoppage; step += 1) {
      const minute = base + step + 1
      const moments: { at: number; run: () => void }[] = []
      const at = () => start + step * unit + Math.floor(random() * unit)
      for (const side of ['a', 'b'] as const) {
        const rival = other(side)
        const s = strength(side)
        const manAdvantage = onPitch[side].length - onPitch[rival].length
        const edge = 1 + manAdvantage * 0.22
        const roll = random()
        const goalRate = ((0.5 + 2 * s) / 90) * edge
        const shotRate = ((6 + 10 * s) / 90) * edge
        if (roll < goalRate) {
          const when = at()
          const penalty = random() < 0.09
          const scorer = weighted(
            random,
            onPitch[side],
            (player) => goalWeight[position(side, player)] ?? 1,
          )
          const helpers = onPitch[side].filter((player) => player !== scorer)
          const assist =
            !penalty && random() < 0.72
              ? weighted(random, helpers, (player) => assistWeight[position(side, player)] ?? 1)
              : undefined
          moments.push({
            at: when,
            run: () => {
              score[index(side)] += 1
              add({
                at: when,
                kind: 'goal',
                side,
                player: scorer,
                other: assist,
                period,
                minute,
                note: penalty ? 'penalty' : undefined,
                big: true,
              })
            },
          })
        } else if (roll < goalRate + shotRate) {
          const when = at()
          const shooter = weighted(
            random,
            onPitch[side],
            (player) => goalWeight[position(side, player)] ?? 1,
          )
          const onTarget = random() < 0.34
          moments.push({
            at: when,
            run: () =>
              add({
                at: when,
                kind: 'shot',
                side,
                player: shooter,
                period,
                minute,
                note: onTarget ? 'onTarget' : undefined,
              }),
          })
        }
        if (random() < (4 + 3 * s) / 90) {
          const when = at()
          moments.push({
            at: when,
            run: () => add({ at: when, kind: 'corner', side, period, minute }),
          })
        }
        if (random() < 12 / 90) {
          const when = at()
          const fouler = weighted(
            random,
            onPitch[side],
            (player) => foulWeight[position(side, player)] ?? 1,
          )
          const card = random()
          moments.push({
            at: when,
            run: () => {
              if (!onPitch[side].includes(fouler)) return
              add({ at: when, kind: 'foul', side, player: fouler, period, minute })
              if (card < 0.004) {
                onPitch[side] = onPitch[side].filter((player) => player !== fouler)
                add({ at: when + 1, kind: 'red', side, player: fouler, period, minute, big: true })
              } else if (card < 0.16) {
                if (yellow[side].has(fouler)) {
                  onPitch[side] = onPitch[side].filter((player) => player !== fouler)
                  add({
                    at: when + 1,
                    kind: 'red',
                    side,
                    player: fouler,
                    period,
                    minute,
                    note: 'secondYellow',
                    big: true,
                  })
                } else {
                  yellow[side].add(fouler)
                  add({ at: when + 1, kind: 'yellow', side, player: fouler, period, minute })
                }
              }
            },
          })
        }
        if (period === 2 && subMinutes[side].includes(minute) && bench[side].length) {
          const when = at()
          const playerIn = bench[side].shift()!
          moments.push({
            at: when,
            run: () => {
              const outfield = onPitch[side].filter((player) => position(side, player) !== 'gk')
              if (!outfield.length) return
              const playerOut = outfield[Math.floor(random() * outfield.length)]
              onPitch[side] = onPitch[side].map((player) =>
                player === playerOut ? playerIn : player,
              )
              add({
                at: when,
                kind: 'sub',
                side,
                player: playerOut,
                other: playerIn,
                period,
                minute,
              })
            },
          })
        }
      }
      // A minute's events run in time order, so a red card counts from the next minute.
      moments.sort((first, second) => first.at - second.at).forEach((moment) => moment.run())
    }
    t = start + (length + stoppage) * unit
    periods.push([score[0] - before[0], score[1] - before[1]])
    add({ at: t, kind: 'periodEnd', period, minute: base + length + stoppage, big: period === 1 })
  }

  playPeriod(1, 0, 45, between(random, 1, 3))
  phases.push({
    start: t,
    end: t + 3 * MINUTE * options.pace,
    kind: 'break',
    label: 'halftime',
    period: 1,
  })
  t += 3 * MINUTE * options.pace
  playPeriod(2, 45, 45, between(random, 2, 6))

  let decidedBy: MatchScript['decidedBy']
  let shootout: [number, number] | undefined
  if (options.knockout && score[0] === score[1]) {
    decidedBy = 'extraTime'
    phases.push({
      start: t,
      end: t + MINUTE * options.pace,
      kind: 'break',
      label: 'extraBreak',
      period: 2,
    })
    t += MINUTE * options.pace
    playPeriod(3, 90, 15, between(random, 0, 2))
    phases.push({
      start: t,
      end: t + 30 * SECOND * options.pace,
      kind: 'break',
      label: 'extraBreak',
      period: 3,
    })
    t += 30 * SECOND * options.pace
    playPeriod(4, 105, 15, between(random, 0, 2))
    if (score[0] === score[1]) {
      decidedBy = 'shootout'
      phases.push({
        start: t,
        end: t + MINUTE * options.pace,
        kind: 'break',
        label: 'extraBreak',
        period: 4,
      })
      t += MINUTE * options.pace
      const start = t
      const kicks: [number, number] = [0, 0]
      const taken: [number, number] = [0, 0]
      const takers = {
        a: shuffled(
          onPitch.a.filter((p) => position('a', p) !== 'gk'),
          random,
        ),
        b: shuffled(
          onPitch.b.filter((p) => position('b', p) !== 'gk'),
          random,
        ),
      }
      for (let kick = 0; ; kick += 1) {
        const side: Side = kick % 2 === 0 ? 'a' : 'b'
        const rival = other(side)
        t += 25 * SECOND * options.pace
        const scored = random() < 0.72 + (strength(side) - 0.5) * 0.1
        if (scored) kicks[index(side)] += 1
        taken[index(side)] += 1
        const player = takers[side][(taken[index(side)] - 1) % takers[side].length]
        add({
          at: t,
          kind: 'penalty',
          side,
          player,
          period: 5,
          missed: !scored,
          inner: [kicks[0], kicks[1]],
          note: 'shootout',
        })
        // Stop once one side cannot catch up, in the first five or in sudden death.
        const regulation = taken[0] <= 5 && taken[1] <= 5
        if (regulation) {
          const leftA = 5 - taken[0]
          const leftB = 5 - taken[1]
          if (kicks[0] > kicks[1] + leftB || kicks[1] > kicks[0] + leftA) break
          if (taken[0] === 5 && taken[1] === 5 && kicks[0] !== kicks[1]) break
        } else if (taken[index(side)] === taken[index(rival)] && kicks[0] !== kicks[1]) break
      }
      phases.push({ start, end: t, kind: 'play', label: 'shootout', period: 5 })
      shootout = kicks
    }
  }
  const winner: Side | null =
    score[0] !== score[1]
      ? score[0] > score[1]
        ? 'a'
        : 'b'
      : shootout
        ? shootout[0] > shootout[1]
          ? 'a'
          : 'b'
        : null
  t += 5 * SECOND
  add({
    at: t,
    kind: 'end',
    period: periods.length,
    side: winner ?? undefined,
    note: decidedBy,
    big: true,
  })
  return {
    sport: 'football',
    events: rec.events.sort((first, second) => first.at - second.at),
    phases,
    duration: t,
    winner,
    score: [score[0], score[1]],
    periods,
    shootout,
    decidedBy,
  }
}

/* ---------- Basketball ---------- */

const scorerWeight: Record<string, number> = { pg: 1.1, sg: 1.35, sf: 1.25, pf: 1.05, c: 1 }
const threeWeight: Record<string, number> = { pg: 1.5, sg: 2, sf: 1.4, pf: 0.6, c: 0.2 }

function basketball(
  random: Random,
  pA: number,
  teams: [Team, Team],
  options: SimOptions,
): MatchScript {
  const unit = 450 * options.pace
  const rec = recorder()
  const { add, phases, score } = rec
  const strength = (side: Side) => (side === 'a' ? pA : 1 - pA)
  const fouls = { a: Array(10).fill(0) as number[], b: Array(10).fill(0) as number[] }
  const out = { a: new Set<number>(), b: new Set<number>() }
  const periods: [number, number][] = []
  const position = (side: Side, player: number) => teams[index(side)].roster[player].position
  const available = (side: Side) => [...Array(10).keys()].filter((player) => !out[side].has(player))
  const pickPlayer = (side: Side, weights: Record<string, number>) =>
    weighted(
      random,
      available(side),
      (player) => (weights[position(side, player)] ?? 1) * (player < 5 ? 2.6 : 1),
    )

  phases.push({ start: 0, end: PRE * options.pace, kind: 'break', label: 'pre', period: 0 })
  let t = PRE * options.pace
  add({ at: t, kind: 'start', period: 1, clock: 600 })
  let offense: Side = random() < 0.5 ? 'a' : 'b'
  const run = { side: 'a' as Side, points: 0 }

  for (let period = 1; ; period += 1) {
    const length = period <= 4 ? 600 : 300
    const start = t
    const before: [number, number] = [score[0], score[1]]
    const teamFouls = { a: 0, b: 0 }
    const timeouts = {
      a: period <= 2 ? 1 : period <= 4 ? 2 : 1,
      b: period <= 2 ? 1 : period <= 4 ? 2 : 1,
    }
    phases.push({
      start,
      end: start + length * unit,
      kind: 'play',
      label: period <= 4 ? 'quarter' : 'overtime',
      period,
      base: length,
      unit,
    })
    let elapsed = 0
    const scoreFor = (side: Side, points: number, player: number, at: number, clock: number) => {
      score[index(side)] += points
      if (run.side === side) run.points += points
      else {
        run.side = side
        run.points = points
      }
      add({ at, kind: 'score', side, player, points, period, clock })
    }
    while (true) {
      const duration = between(random, 9, 22)
      if (elapsed + duration >= length) break
      elapsed += duration
      const at = start + elapsed * unit
      const clock = length - elapsed
      const defense = other(offense)
      const s = strength(offense)
      if (random() < 0.18) {
        const fouler = pickPlayer(defense, { pg: 1, sg: 1, sf: 1, pf: 1.4, c: 1.6 })
        fouls[defense][fouler] += 1
        teamFouls[defense] += 1
        const bonus = teamFouls[defense] > 4
        const shooting = random() < 0.45
        add({
          at,
          kind: 'foul',
          side: defense,
          player: fouler,
          period,
          clock,
          note: bonus ? 'bonus' : undefined,
        })
        if (fouls[defense][fouler] === 5) {
          out[defense].add(fouler)
          add({
            at: at + 1,
            kind: 'foulOut',
            side: defense,
            player: fouler,
            period,
            clock,
            big: true,
          })
        }
        if (shooting || bonus) {
          const shooter = pickPlayer(offense, scorerWeight)
          for (let shot = 0; shot < 2; shot += 1) {
            if (random() < 0.7 + (s - 0.5) * 0.2)
              scoreFor(offense, 1, shooter, at + (shot + 1) * 1500 * options.pace, clock)
          }
        }
      } else {
        const three = random() < 0.38
        const chance = (three ? 0.34 : 0.5) + (s - 0.5) * 0.26
        if (random() < chance) {
          scoreFor(
            offense,
            three ? 3 : 2,
            pickPlayer(offense, three ? threeWeight : scorerWeight),
            at,
            clock,
          )
        }
      }
      // A coach stops an 8–0 run with a timeout, if one is left.
      const hurting = other(run.side)
      if (run.points >= 8 && timeouts[hurting] > 0 && random() < 0.65) {
        timeouts[hurting] -= 1
        run.points = 0
        add({ at: at + 2000 * options.pace, kind: 'timeout', side: hurting, period, clock })
      }
      offense = defense
    }
    t = start + length * unit
    periods.push([score[0] - before[0], score[1] - before[1]])
    const level = score[0] === score[1]
    if (period >= 4 && level && period === 7) {
      // Three overtimes are plenty for a broadcast: the stronger side hits a last free throw.
      const side: Side = pA >= 0.5 ? 'a' : 'b'
      scoreFor(side, 1, pickPlayer(side, scorerWeight), t - 1000 * options.pace, 1)
      periods[periods.length - 1][index(side)] += 1
    }
    const over = period >= 4 && score[0] !== score[1]
    add({
      at: t,
      kind: 'periodEnd',
      period,
      clock: 0,
      big: period === 2 || period >= 4,
      note: period > 4 ? 'overtime' : undefined,
    })
    if (over) break
    const breakLength = period === 2 ? 150 * SECOND : 60 * SECOND
    phases.push({
      start: t,
      end: t + breakLength * options.pace,
      kind: 'break',
      label: period === 2 ? 'halftime' : 'quarterBreak',
      period,
    })
    t += breakLength * options.pace
  }
  t += 5 * SECOND
  const winner: Side = score[0] > score[1] ? 'a' : 'b'
  add({
    at: t,
    kind: 'end',
    period: periods.length,
    side: winner,
    big: true,
    note: periods.length > 4 ? 'overtime' : undefined,
  })
  return {
    sport: 'basketball',
    events: rec.events.sort((first, second) => first.at - second.at),
    phases,
    duration: t,
    winner,
    score: [score[0], score[1]],
    periods,
    decidedBy: periods.length > 4 ? 'overtime' : undefined,
  }
}

/* ---------- Volleyball ---------- */

const attackWeight: Record<string, number> = { oh: 3, opp: 3, mb: 1.6, s: 0.3, l: 0 }
const blockWeight: Record<string, number> = { mb: 3, opp: 1.6, oh: 1, s: 0.5, l: 0 }

function volleyball(
  random: Random,
  pA: number,
  teams: [Team, Team],
  options: SimOptions,
): MatchScript {
  const rec = recorder()
  const { add, phases, score } = rec
  const periods: [number, number][] = []
  const starters = [0, 1, 2, 3, 4, 5]
  const position = (side: Side, player: number) => teams[index(side)].roster[player].position
  const rotation = { a: 0, b: 0 }
  phases.push({ start: 0, end: PRE * options.pace, kind: 'break', label: 'pre', period: 0 })
  let t = PRE * options.pace
  add({ at: t, kind: 'start', period: 1, inner: [0, 0] })
  let firstServer: Side = random() < 0.5 ? 'a' : 'b'

  for (let set = 1; set <= 5; set += 1) {
    const target = set === 5 ? 15 : 25
    const points: [number, number] = [0, 0]
    const timeouts = { a: 2, b: 2 }
    const streak = { side: 'a' as Side, length: 0 }
    let server: Side = set === 5 ? (random() < 0.5 ? 'a' : 'b') : firstServer
    firstServer = other(firstServer)
    const start = t
    const setOver = () => Math.max(...points) >= target && Math.abs(points[0] - points[1]) >= 2
    while (!setOver()) {
      t += between(random, 9, 13) * SECOND * options.pace
      const chanceA = 0.5 + (pA - 0.5) * 0.3 + (server === 'a' ? -0.04 : 0.04)
      const winner: Side = random() < chanceA ? 'a' : 'b'
      let note: EventNote
      let player: number | undefined
      if (winner === server) {
        const roll = random()
        note = roll < 0.12 ? 'ace' : roll < 0.7 ? 'attack' : roll < 0.87 ? 'block' : 'error'
      } else {
        const roll = random()
        note = roll < 0.62 ? 'attack' : roll < 0.78 ? 'block' : 'error'
      }
      if (note === 'ace') player = starters[rotation[winner]]
      else if (note === 'attack')
        player = weighted(random, starters, (p) => attackWeight[position(winner, p)] ?? 1)
      else if (note === 'block')
        player = weighted(random, starters, (p) => blockWeight[position(winner, p)] ?? 1)
      points[index(winner)] += 1
      if (winner !== server) {
        // Side-out: the team that wins back the serve rotates.
        rotation[winner] = (rotation[winner] + 1) % 6
        server = winner
      }
      if (streak.side === winner) streak.length += 1
      else {
        streak.side = winner
        streak.length = 1
      }
      const situation = (() => {
        for (const side of ['a', 'b'] as const) {
          const own = points[index(side)] + 1
          const theirs = points[index(other(side))]
          if (own >= target && own - theirs >= 2) {
            return {
              side,
              kind: (score[index(side)] === 2 ? 'matchPoint' : 'setPoint') as Situation,
            }
          }
        }
        return undefined
      })()
      add({
        at: t,
        kind: 'point',
        side: winner,
        player,
        note,
        period: set,
        inner: [points[0], points[1]],
        situation,
        big: situation !== undefined,
      })
      const loser = other(winner)
      if (!setOver() && streak.length >= 3 && timeouts[loser] > 0 && random() < 0.5) {
        timeouts[loser] -= 1
        t += 4 * SECOND * options.pace
        add({ at: t, kind: 'timeout', side: loser, period: set, inner: [points[0], points[1]] })
        t += 30 * SECOND * options.pace
        streak.length = 0
      }
    }
    const setWinner: Side = points[0] > points[1] ? 'a' : 'b'
    score[index(setWinner)] += 1
    phases.push({ start, end: t, kind: 'play', label: 'set', period: set })
    periods.push([points[0], points[1]])
    t += 3 * SECOND * options.pace
    add({
      at: t,
      kind: 'periodEnd',
      side: setWinner,
      period: set,
      inner: [points[0], points[1]],
      big: true,
    })
    if (Math.max(...score) === 3) break
    phases.push({
      start: t,
      end: t + 90 * SECOND * options.pace,
      kind: 'break',
      label: 'setBreak',
      period: set,
    })
    t += 90 * SECOND * options.pace
  }
  t += 5 * SECOND
  const winner: Side = score[0] > score[1] ? 'a' : 'b'
  add({ at: t, kind: 'end', side: winner, period: periods.length, big: true })
  return {
    sport: 'volleyball',
    events: rec.events,
    phases,
    duration: t,
    winner,
    score: [score[0], score[1]],
    periods,
  }
}

/* ---------- Tennis ---------- */

const CALLS = ['0', '15', '30', '40']

/** The points shown in a regular game: 0/15/30/40, deuce 40–40 and advantage. */
export function tennisCall(points: [number, number]): [string, string] {
  const [a, b] = points
  if (a >= 3 && b >= 3) {
    if (a === b) return ['40', '40']
    return a > b ? ['AD', '40'] : ['40', 'AD']
  }
  return [CALLS[Math.min(a, 3)], CALLS[Math.min(b, 3)]]
}

function tennis(
  random: Random,
  pA: number,
  _teams: [Team, Team],
  options: SimOptions,
): MatchScript {
  const setsToWin = options.setsToWin ?? 2
  const rec = recorder()
  const { add, phases, score } = rec
  const periods: [number, number][] = []
  const strength = (side: Side) => (side === 'a' ? pA : 1 - pA)
  phases.push({ start: 0, end: PRE * options.pace, kind: 'break', label: 'pre', period: 0 })
  let t = PRE * options.pace
  let server: Side = random() < 0.5 ? 'a' : 'b'
  add({ at: t, kind: 'start', period: 1, inner: [0, 0], tennis: { points: ['0', '0'], server } })

  for (let set = 1; ; set += 1) {
    const games: [number, number] = [0, 0]
    const start = t
    let tiebreakPlayed = false
    while (true) {
      const tiebreak = games[0] === 6 && games[1] === 6
      const points: [number, number] = [0, 0]
      const gameServer = server
      let pointServer = server
      const gameWon = () => {
        const need = tiebreak ? 7 : 4
        return Math.max(...points) >= need && Math.abs(points[0] - points[1]) >= 2
      }
      /** Would `side` win the game, then the set, then the match, with one more point? */
      const situationFor = (side: Side): Situation | undefined => {
        const next: [number, number] = [points[0], points[1]]
        next[index(side)] += 1
        const need = tiebreak ? 7 : 4
        if (!(Math.max(...next) >= need && next[index(side)] - next[index(other(side))] >= 2))
          return undefined
        const nextGames: [number, number] = [games[0], games[1]]
        nextGames[index(side)] += 1
        const own = nextGames[index(side)]
        const theirs = nextGames[index(other(side))]
        const setWon = tiebreak || (own >= 6 && own - theirs >= 2) || own === 7
        if (setWon && score[index(side)] + 1 === setsToWin) return 'matchPoint'
        if (setWon) return 'setPoint'
        return side !== gameServer ? 'breakPoint' : undefined
      }
      while (!gameWon()) {
        t += between(random, 8, 14) * SECOND * options.pace
        const serve = 0.63 + (strength(pointServer) - 0.5) * 0.3
        const winner: Side = random() < serve ? pointServer : other(pointServer)
        const note: EventNote | undefined =
          winner === pointServer
            ? random() < 0.09
              ? 'ace'
              : undefined
            : random() < 0.07
              ? 'doubleFault'
              : undefined
        points[index(winner)] += 1
        const done = gameWon()
        const call: [string, string] = tiebreak
          ? [String(points[0]), String(points[1])]
          : tennisCall(points)
        let situation: ScriptEvent['situation']
        if (!done) {
          for (const side of ['a', 'b'] as const) {
            const kind = situationFor(side)
            if (kind) situation = { side, kind }
          }
        }
        add({
          at: t,
          kind: 'point',
          side: winner,
          note,
          period: set,
          inner: [games[0], games[1]],
          tennis: { points: done ? ['0', '0'] : call, server: pointServer },
          situation,
          big: situation !== undefined,
        })
        if (tiebreak && (points[0] + points[1]) % 2 === 1) pointServer = other(pointServer)
      }
      const gameWinner: Side = points[0] > points[1] ? 'a' : 'b'
      games[index(gameWinner)] += 1
      const broke = !tiebreak && gameWinner !== gameServer
      server = other(gameServer)
      add({
        at: t + 1,
        kind: 'game',
        side: gameWinner,
        period: set,
        inner: [games[0], games[1]],
        note: tiebreak ? 'tiebreak' : broke ? 'break' : undefined,
        tennis: { points: ['0', '0'], server },
        big: broke,
      })
      const [own, theirs] = gameWinner === 'a' ? games : [games[1], games[0]]
      if (tiebreak) {
        tiebreakPlayed = true
        break
      }
      if ((own >= 6 && own - theirs >= 2) || own === 7) break
      // Players change ends after every odd game.
      if ((games[0] + games[1]) % 2 === 1) t += 40 * SECOND * options.pace
    }
    const setWinner: Side = games[0] > games[1] ? 'a' : 'b'
    score[index(setWinner)] += 1
    periods.push([games[0], games[1]])
    phases.push({ start, end: t, kind: 'play', label: 'set', period: set })
    t += 3 * SECOND * options.pace
    add({
      at: t,
      kind: 'periodEnd',
      side: setWinner,
      period: set,
      inner: [games[0], games[1]],
      note: tiebreakPlayed ? 'tiebreak' : undefined,
      tennis: { points: ['0', '0'], server },
      big: true,
    })
    if (score[index(setWinner)] === setsToWin) break
    phases.push({
      start: t,
      end: t + 90 * SECOND * options.pace,
      kind: 'break',
      label: 'setBreak',
      period: set,
    })
    t += 90 * SECOND * options.pace
  }
  t += 5 * SECOND
  const winner: Side = score[0] > score[1] ? 'a' : 'b'
  add({ at: t, kind: 'end', side: winner, period: periods.length, big: true })
  return {
    sport: 'tennis',
    events: rec.events,
    phases,
    duration: t,
    winner,
    score: [score[0], score[1]],
    periods,
  }
}

/* ---------- Chess ---------- */

const CHESS_BASE = 25 * MINUTE
const CHESS_INCREMENT = 10 * SECOND

function pickGame(random: Random, result: ChessGame['result'] | 'decisive') {
  const pool = chessGames.filter((game) =>
    result === 'decisive' ? game.result !== '1/2-1/2' : game.result === result,
  )
  return pool[Math.floor(random() * pool.length)]
}

function chess(random: Random, pA: number, _teams: [Team, Team], options: SimOptions): MatchScript {
  const rec = recorder()
  const { add, phases, score } = rec
  const boards: ChessBoardRef[] = []
  const periods: [number, number][] = []
  phases.push({ start: 0, end: PRE * options.pace, kind: 'break', label: 'pre', period: 0 })
  let t = PRE * options.pace

  const playGame = (period: number, white: Side, game: ChessGame, armageddon: boolean) => {
    boards.push({ id: game.id, white })
    const start = t
    const clocks: [number, number] = [CHESS_BASE, CHESS_BASE]
    add({
      at: t,
      kind: 'start',
      period,
      clocks: [clocks[0], clocks[1]],
      note: armageddon ? 'armageddon' : undefined,
    })
    game.moves.forEach((san, ply) => {
      const mover: Side = ply % 2 === 0 ? white : other(white)
      const think =
        (ply < 8 ? between(random, 4, 14) : between(random, 25, 110)) * SECOND * options.pace
      t += think
      clocks[index(mover)] = Math.max(1000, clocks[index(mover)] - think + CHESS_INCREMENT)
      const last = ply === game.moves.length - 1
      add({
        at: t,
        kind: 'move',
        side: mover,
        san,
        ply: ply + 1,
        period,
        clocks: [clocks[0], clocks[1]],
        note: san.endsWith('#') ? 'mate' : san.endsWith('+') ? 'check' : undefined,
        big: last && game.ending === 'mate',
      })
    })
    t +=
      (game.ending === 'resign'
        ? between(random, 20, 45)
        : game.ending === 'mate'
          ? 2
          : between(random, 8, 20)) *
      SECOND *
      options.pace
    let result: [number, number]
    if (game.result === '1/2-1/2')
      result = armageddon ? (white === 'a' ? [0, 1] : [1, 0]) : [0.5, 0.5]
    else {
      const whiteWon = game.result === '1-0'
      const winnerSide = whiteWon ? white : other(white)
      result = winnerSide === 'a' ? [1, 0] : [0, 1]
    }
    score[0] += result[0]
    score[1] += result[1]
    periods.push(result)
    const decided = result[0] !== result[1]
    add({
      at: t,
      kind: 'periodEnd',
      period,
      side: decided ? (result[0] > result[1] ? 'a' : 'b') : undefined,
      note: game.ending,
      clocks: [clocks[0], clocks[1]],
      big: true,
    })
    phases.push({ start, end: t, kind: 'play', label: 'game', period })
    return decided
  }

  // Outcome by rating first, then a scripted game with that result.
  const roll = random()
  const whiteWins = 0.3 + (pA - 0.5) * 0.6
  const draws = 0.35
  const first = roll < whiteWins ? '1-0' : roll < whiteWins + draws ? '1/2-1/2' : '0-1'
  const decided = playGame(1, 'a', pickGame(random, first), false)
  let decidedBy: MatchScript['decidedBy']
  if (!decided && options.knockout) {
    decidedBy = 'armageddon'
    phases.push({
      start: t,
      end: t + 2 * MINUTE * options.pace,
      kind: 'break',
      label: 'gameBreak',
      period: 1,
    })
    t += 2 * MINUTE * options.pace
    playGame(2, 'b', pickGame(random, 'decisive'), true)
  }
  t += 5 * SECOND
  const winner: Side | null = score[0] === score[1] ? null : score[0] > score[1] ? 'a' : 'b'
  add({ at: t, kind: 'end', side: winner ?? undefined, period: periods.length, big: false })
  return {
    sport: 'chess',
    events: rec.events,
    phases,
    duration: t,
    winner,
    score: [score[0], score[1]],
    periods,
    decidedBy,
    chess: boards,
  }
}

/* ---------- Entry point ---------- */

const simulators: Record<
  SportId,
  (random: Random, pA: number, teams: [Team, Team], options: SimOptions) => MatchScript
> = {
  football,
  basketball,
  volleyball,
  tennis,
  chess,
}

/**
 * The full script of a match. With `fit`, the broadcast pace is stretched or squeezed so
 * the whole match lasts between the two limits; the result is the same either way.
 */
export function simulateMatch(
  matchId: string,
  sport: SportId,
  teams: [Team, Team],
  options: { knockout: boolean; setsToWin?: number; fit?: [number, number] },
): MatchScript {
  const pA = winChance(teams[0].rating, teams[1].rating)
  const run = (pace: number) =>
    simulators[sport](seededRandom(`${matchId}|${teams[0].id}|${teams[1].id}`), pA, teams, {
      ...options,
      pace,
    })
  const first = run(1)
  if (!options.fit) return first
  const [min, max] = options.fit
  if (first.duration >= min && first.duration <= max) return first
  const target = first.duration < min ? min + (max - min) * 0.25 : max - (max - min) * 0.25
  return run(target / first.duration)
}
