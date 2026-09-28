/*
 * The tournament world behind Zirve Arena. Every match has a fixed script (see
 * `esportsSports.ts`), worked out from the match id and the two sides alone, so a result
 * never changes. The clock only decides how much of a script is shown: nothing before the
 * start, the events so far while it is live, all of it once it is over.
 *
 * Knockout and Swiss dates are counted in days from the start of today, so there is always
 * a tournament running. Each sport also has a league that never stops: a new fixture every
 * few minutes of every day, so every sport always has a live match.
 */
import {
  sports,
  teamById,
  tournamentById,
  tournaments,
  tournamentTeams,
  type KnockoutTournament,
  type LeagueTournament,
  type Slot,
  type SportId,
  type SwissTournament,
  type Team,
  type Tournament,
} from '@/features/showcases/data/esports'
import {
  DAY,
  HOUR,
  MINUTE,
  other,
  seededRandom,
  shuffled,
  simulateMatch,
  winChance,
  type MatchScript,
  type Phase,
  type ScriptEvent,
  type Side,
} from '@/features/showcases/data/esportsSports'

export {
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  seededRandom,
  simulateMatch,
  tennisCall,
  winChance,
} from '@/features/showcases/data/esportsSports'
export type {
  EventKind,
  EventNote,
  MatchScript,
  Phase,
  PhaseLabel,
  ScriptEvent,
  Side,
  Situation,
} from '@/features/showcases/data/esportsSports'

/* ---------- Structure ---------- */

export type StageKey = 'qf' | 'sf' | 'final' | 'league' | 'swiss'

export type TeamSource =
  | { team: string }
  | { winnerOf: string }
  | { swissRound: number; team: string }

export interface MatchDef {
  id: string
  tournamentId: string
  sport: SportId
  stage: StageKey
  /** Bracket column or Swiss round, from 0. */
  round: number
  /** Position in its column, or the board number. */
  position: number
  startAt: number
  sources: [TeamSource, TeamSource]
  knockout: boolean
  setsToWin?: number
}

export interface Fate {
  def: MatchDef
  teams: [Team, Team]
  script: MatchScript
}

export function startOfDay(now: number) {
  const date = new Date(now)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

const clockAt = (dayStart: number, [day, time]: Slot) => {
  const [hours, minutes] = time.split(':').map(Number)
  return dayStart + day * DAY + hours * HOUR + minutes * MINUTE
}

function stageFor(teamsLeft: number): StageKey {
  if (teamsLeft === 2) return 'final'
  if (teamsLeft === 4) return 'sf'
  return 'qf'
}

function knockoutDefs(tournament: KnockoutTournament, dayStart: number): MatchDef[] {
  const defs: MatchDef[] = []
  let size = tournament.seeds.length
  tournament.schedule.forEach((slots, round) => {
    slots.forEach((slot, position) => {
      defs.push({
        id: `${tournament.id}-r${round}-${position}`,
        tournamentId: tournament.id,
        sport: tournament.sport,
        stage: stageFor(size),
        round,
        position,
        startAt: clockAt(dayStart, slot),
        knockout: true,
        setsToWin: tournament.setsToWin,
        sources:
          round === 0
            ? [
                { team: tournament.seeds[position * 2] },
                { team: tournament.seeds[position * 2 + 1] },
              ]
            : [
                { winnerOf: `${tournament.id}-r${round - 1}-${position * 2}` },
                { winnerOf: `${tournament.id}-r${round - 1}-${position * 2 + 1}` },
              ],
      })
    })
    size /= 2
  })
  return defs
}

/* ---------- Tables ---------- */

export interface TableRow {
  team: Team
  played: number
  wins: number
  draws: number
  losses: number
  /** Goals, points, sets or chess points for and against. */
  scored: number
  conceded: number
  /** Volleyball rally points and tennis games, for and against. */
  innerFor: number
  innerAgainst: number
  /** League points under the sport's rules. */
  points: number
  /** Chess: the sum of the opponents' points. */
  buchholz: number
}

export function resultFor(fate: Fate, teamId: string): 'W' | 'D' | 'L' | null {
  const side = sideOf(fate, teamId)
  if (!side) return null
  if (fate.script.winner === null) return 'D'
  return fate.script.winner === side ? 'W' : 'L'
}

/** League points for one result under each sport's rules. */
function pointsFor(sport: SportId, fate: Fate, side: Side): number {
  const own = fate.script.score[side === 'a' ? 0 : 1]
  const theirs = fate.script.score[side === 'a' ? 1 : 0]
  switch (sport) {
    case 'football':
      return own > theirs ? 3 : own === theirs ? 1 : 0
    case 'basketball':
      // FIBA: two for a win, one for a loss.
      return own > theirs ? 2 : 1
    case 'volleyball':
      // 3–0 and 3–1 are worth 3–0; 3–2 is worth 2–1.
      if (own === 3) return theirs === 2 ? 2 : 3
      return own === 2 ? 1 : 0
    case 'tennis':
      return own > theirs ? 1 : 0
    case 'chess':
      return own
  }
}

export function tableFrom(sport: SportId, teamIds: string[], results: Fate[]): TableRow[] {
  const rows = new Map(
    teamIds.map((id) => [
      id,
      {
        team: teamById.get(id)!,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        scored: 0,
        conceded: 0,
        innerFor: 0,
        innerAgainst: 0,
        points: 0,
        buchholz: 0,
      } satisfies TableRow,
    ]),
  )
  const opponents = new Map<string, string[]>()
  for (const fate of results) {
    ;(['a', 'b'] as const).forEach((side, sideIndex) => {
      const row = rows.get(fate.teams[sideIndex].id)
      if (!row) return
      const rival = fate.teams[1 - sideIndex]
      opponents.set(row.team.id, [...(opponents.get(row.team.id) ?? []), rival.id])
      row.played += 1
      row.scored += fate.script.score[sideIndex]
      row.conceded += fate.script.score[1 - sideIndex]
      for (const period of fate.script.periods) {
        row.innerFor += period[sideIndex]
        row.innerAgainst += period[1 - sideIndex]
      }
      const result = fate.script.winner === null ? 'D' : fate.script.winner === side ? 'W' : 'L'
      if (result === 'W') row.wins += 1
      else if (result === 'L') row.losses += 1
      else row.draws += 1
      row.points += pointsFor(sport, fate, side)
    })
  }
  for (const row of rows.values()) {
    row.buchholz = (opponents.get(row.team.id) ?? []).reduce(
      (sum, id) => sum + (rows.get(id)?.points ?? 0),
      0,
    )
  }
  const winRate = (row: TableRow) => (row.played ? row.wins / row.played : 0)
  const ratio = (a: number, b: number) => (b === 0 ? (a === 0 ? 0 : Infinity) : a / b)
  return [...rows.values()].sort((first, second) => {
    switch (sport) {
      case 'football':
        return (
          second.points - first.points ||
          second.scored - second.conceded - (first.scored - first.conceded) ||
          second.scored - first.scored ||
          second.team.rating - first.team.rating
        )
      case 'basketball':
        return (
          winRate(second) - winRate(first) ||
          second.scored - second.conceded - (first.scored - first.conceded) ||
          second.team.rating - first.team.rating
        )
      case 'volleyball':
        return (
          second.points - first.points ||
          second.wins - first.wins ||
          ratio(second.scored, second.conceded) - ratio(first.scored, first.conceded) ||
          ratio(second.innerFor, second.innerAgainst) - ratio(first.innerFor, first.innerAgainst) ||
          second.team.rating - first.team.rating
        )
      case 'tennis':
        return (
          second.wins - first.wins ||
          second.scored - second.conceded - (first.scored - first.conceded) ||
          second.innerFor - second.innerAgainst - (first.innerFor - first.innerAgainst) ||
          second.team.rating - first.team.rating
        )
      case 'chess':
        return (
          second.points - first.points ||
          second.buchholz - first.buchholz ||
          second.team.rating - first.team.rating
        )
    }
  })
}

/* ---------- Swiss pairing ---------- */

/**
 * Pairs a Swiss round: players sorted by score then rating, each paired with the next one
 * they have not met. Colours go to whoever has had White less often.
 */
function swissPairs(players: string[], played: Fate[], round: number): [string, string][] {
  const table = tableFrom('chess', players, played)
  const met = new Set(played.map((fate) => [fate.teams[0].id, fate.teams[1].id].sort().join('|')))
  const whites = new Map<string, number>()
  for (const fate of played) whites.set(fate.teams[0].id, (whites.get(fate.teams[0].id) ?? 0) + 1)
  const order =
    round === 0
      ? [...players].sort(
          (first, second) => teamById.get(second)!.rating - teamById.get(first)!.rating,
        )
      : table.map((row) => row.team.id)
  const pairs: [string, string][] = []
  const left = [...order]
  if (round === 0) {
    // Top half against bottom half.
    const half = left.length / 2
    for (let board = 0; board < half; board += 1) pairs.push([left[board], left[board + half]])
  } else {
    // The top unpaired player takes the next one they have not met; backtrack if that
    // leaves someone further down with nobody new to play.
    const search = (pool: string[]): [string, string][] | null => {
      if (!pool.length) return []
      const [first, ...others] = pool
      for (const candidate of others) {
        if (met.has([first, candidate].sort().join('|'))) continue
        const rest = search(others.filter((id) => id !== candidate))
        if (rest) return [[first, candidate], ...rest]
      }
      return null
    }
    pairs.push(...(search(left) ?? []))
  }
  return pairs.map(([first, second]) => {
    const firstWhites = whites.get(first) ?? 0
    const secondWhites = whites.get(second) ?? 0
    const firstWhite = firstWhites === secondWhites ? round % 2 === 0 : firstWhites < secondWhites
    return firstWhite ? [first, second] : [second, first]
  })
}

/* ---------- The world ---------- */

export interface World {
  dayStart: number
  defs: MatchDef[]
  fates: Map<string, Fate>
}

function simulate(def: MatchDef, teams: [Team, Team], fit?: [number, number]): Fate {
  return {
    def,
    teams,
    script: simulateMatch(def.id, def.sport, teams, {
      knockout: def.knockout,
      setsToWin: def.setsToWin,
      fit,
    }),
  }
}

export function winnerOf(fate: Fate): Team {
  return fate.script.winner === 'b' ? fate.teams[1] : fate.teams[0]
}

export function loserOf(fate: Fate): Team {
  return fate.script.winner === 'b' ? fate.teams[0] : fate.teams[1]
}

/** Classic miniatures are short; a rapid game on stage still takes its time. */
const CHESS_FIT: [number, number] = [22 * MINUTE, 45 * MINUTE]

function buildWorld(dayStart: number): World {
  const defs: MatchDef[] = []
  const fates = new Map<string, Fate>()
  for (const tournament of tournaments) {
    if (tournament.format === 'knockout') {
      for (const def of knockoutDefs(tournament, dayStart)) {
        const teams = def.sources.map((source) =>
          'winnerOf' in source ? winnerOf(fates.get(source.winnerOf)!) : teamById.get(source.team)!,
        ) as [Team, Team]
        defs.push(def)
        fates.set(def.id, simulate(def, teams, def.sport === 'chess' ? CHESS_FIT : undefined))
      }
    } else if (tournament.format === 'swiss') {
      const played: Fate[] = []
      tournament.rounds.forEach((slot, round) => {
        const pairs = swissPairs(tournament.players, played, round)
        const roundFates = pairs.map(([white, black], board) => {
          const def: MatchDef = {
            id: `${tournament.id}-r${round}-${board}`,
            tournamentId: tournament.id,
            sport: 'chess',
            stage: 'swiss',
            round,
            position: board,
            startAt: clockAt(dayStart, slot),
            knockout: false,
            sources: [
              { swissRound: round, team: white },
              { swissRound: round, team: black },
            ],
          }
          defs.push(def)
          const fate = simulate(def, [teamById.get(white)!, teamById.get(black)!], CHESS_FIT)
          fates.set(def.id, fate)
          return fate
        })
        played.push(...roundFates)
      })
    }
  }
  return { dayStart, defs, fates }
}

let cachedWorld: World | undefined

export function worldAt(now: number): World {
  const dayStart = startOfDay(now)
  if (cachedWorld?.dayStart !== dayStart) cachedWorld = buildWorld(dayStart)
  return cachedWorld
}

/* ---------- Leagues that never stop ---------- */

/**
 * All 28 pairings of eight sides, ordered so neighbouring fixtures never share a side: a
 * new match starts before the previous one ends, and nobody plays two at once.
 */
export const ladderPairs: [number, number][] = (() => {
  const all: [number, number][] = []
  for (let first = 0; first < 8; first += 1) {
    for (let second = first + 1; second < 8; second += 1) all.push([first, second])
  }
  const clash = (one: [number, number], two: [number, number]) =>
    one.includes(two[0]) || one.includes(two[1])
  for (let attempt = 0; ; attempt += 1) {
    const left = shuffled(all, seededRandom(`ladder-order-${attempt}`))
    const ordered: [number, number][] = [left.shift()!]
    while (left.length) {
      const nextIndex = left.findIndex((pair) => !clash(pair, ordered[ordered.length - 1]))
      if (nextIndex < 0) break
      ordered.push(left.splice(nextIndex, 1)[0])
    }
    if (ordered.length === all.length && !clash(ordered[0], ordered[ordered.length - 1]))
      return ordered
  }
})()

export const leagues = tournaments.filter(
  (tournament): tournament is LeagueTournament => tournament.format === 'league',
)

const leagueCache = new Map<string, Fate>()

export function leagueFate(league: LeagueTournament, slot: number): Fate {
  const id = `${league.id}-${slot}`
  const cached = leagueCache.get(id)
  if (cached) return cached
  const [first, second] = ladderPairs[((slot % 28) + 28) % 28]
  // Home and away swap each time the cycle comes round.
  const flip = Math.floor(slot / 28) % 2 === 1
  const ids = flip
    ? [league.teams[second], league.teams[first]]
    : [league.teams[first], league.teams[second]]
  const teams: [Team, Team] = [teamById.get(ids[0])!, teamById.get(ids[1])!]
  const def: MatchDef = {
    id,
    tournamentId: league.id,
    sport: league.sport,
    stage: 'league',
    round: 0,
    position: slot,
    startAt: slot * league.every * MINUTE,
    knockout: false,
    sources: [{ team: ids[0] }, { team: ids[1] }],
  }
  // Longer than the gap to the next fixture, shorter than two gaps: always one match live.
  const fate = simulate(def, teams, [(league.every + 2) * MINUTE, (2 * league.every - 2) * MINUTE])
  leagueCache.set(id, fate)
  return fate
}

/** League fixtures kicking off between two times. */
export function leagueSlots(league: LeagueTournament, from: number, to: number): number[] {
  const every = league.every * MINUTE
  const slots: number[] = []
  for (let slot = Math.ceil(from / every); slot <= Math.floor(to / every); slot += 1)
    slots.push(slot)
  return slots
}

/* ---------- What the clock lets you see ---------- */

export type MatchStatus = 'upcoming' | 'live' | 'finished'

export function statusAt(fate: Fate, now: number): MatchStatus {
  const elapsed = now - fate.def.startAt
  if (elapsed < 0) return 'upcoming'
  if (elapsed >= fate.script.duration) return 'finished'
  return 'live'
}

export function findFate(matchId: string, now: number): Fate | undefined {
  for (const league of leagues) {
    const prefix = `${league.id}-`
    if (matchId.startsWith(prefix) && /^\d+$/.test(matchId.slice(prefix.length))) {
      return leagueFate(league, Number(matchId.slice(prefix.length)))
    }
  }
  return worldAt(now).fates.get(matchId)
}

function sourceKnown(fate: Fate, source: TeamSource, now: number): boolean {
  if ('winnerOf' in source)
    return statusAt(worldAt(now).fates.get(source.winnerOf)!, now) === 'finished'
  if ('swissRound' in source && source.swissRound > 0) {
    const world = worldAt(now)
    return world.defs
      .filter(
        (def) => def.tournamentId === fate.def.tournamentId && def.round === source.swissRound - 1,
      )
      .every((def) => statusAt(world.fates.get(def.id)!, now) === 'finished')
  }
  return true
}

export interface MatchView {
  fate: Fate
  status: MatchStatus
  /** A side is null until it is decided; `sources` says where it will come from. */
  teams: [Team | null, Team | null]
  sources: [TeamSource, TeamSource]
}

export function viewMatch(fate: Fate, now: number): MatchView {
  const teams = fate.def.sources.map((source, sideIndex) =>
    sourceKnown(fate, source, now) ? fate.teams[sideIndex] : null,
  ) as [Team | null, Team | null]
  return { fate, status: statusAt(fate, now), teams, sources: fate.def.sources }
}

export interface LiveState {
  started: boolean
  finished: boolean
  elapsed: number
  events: ScriptEvent[]
  /** Goals, points, sets or chess points so far. */
  score: [number, number]
  /** Completed periods, then the current one so far. */
  periods: [number, number][]
  /** The period being played (or just finished), from 1. */
  period: number
  phase: Phase | undefined
  last: ScriptEvent | undefined
  winner: Side | null
}

/** The part of a script that has happened by `now`. */
export function liveState(fate: Fate, now: number): LiveState {
  const { script, def } = fate
  if (now < def.startAt) {
    return {
      started: false,
      finished: false,
      elapsed: 0,
      events: [],
      score: [0, 0],
      periods: [],
      period: 1,
      phase: script.phases[0],
      last: undefined,
      winner: null,
    }
  }
  const elapsed = Math.min(now - def.startAt, script.duration)
  const events = script.events.filter((event) => event.at <= elapsed)
  const last = events[events.length - 1]
  const finished = elapsed >= script.duration
  const phase = script.phases.find((item) => elapsed >= item.start && elapsed < item.end)
  const ended = events.filter((event) => event.kind === 'periodEnd').length
  const periods = script.periods.slice(0, ended)
  const period = Math.max(1, phase?.kind === 'play' ? phase.period : (last?.period ?? 1))
  if (!finished && phase?.kind === 'play' && ended < period) {
    // The period in progress, from its own events.
    const own = events.filter((event) => event.period === period)
    if (def.sport === 'volleyball' || def.sport === 'tennis') {
      const withInner = [...own].reverse().find((event) => event.inner)
      periods.push(withInner?.inner ? [withInner.inner[0], withInner.inner[1]] : [0, 0])
    } else if (def.sport !== 'chess') {
      const tally: [number, number] = [0, 0]
      for (const event of own) {
        if (event.kind === 'goal') tally[event.side === 'a' ? 0 : 1] += 1
        if (event.kind === 'score') tally[event.side === 'a' ? 0 : 1] += event.points ?? 0
      }
      periods.push(tally)
    }
  }
  return {
    started: true,
    finished,
    elapsed,
    events,
    score: last ? [last.score[0], last.score[1]] : [0, 0],
    periods,
    period,
    phase,
    last,
    winner: finished ? script.winner : null,
  }
}

/** What the clock shows. The labels are turned into words by `esportsFormat.ts`. */
export type ClockInfo =
  | { kind: 'pre' }
  | { kind: 'final' }
  | { kind: 'break'; label: Phase['label']; period: number }
  | { kind: 'minute'; period: number; minute: number; added: number }
  | { kind: 'countdown'; period: number; seconds: number }
  | { kind: 'period'; period: number; label: Phase['label'] }

export function clockOf(fate: Fate, state: LiveState): ClockInfo {
  if (!state.started) return { kind: 'pre' }
  if (state.finished) return { kind: 'final' }
  const phase = state.phase
  if (!phase) return { kind: 'period', period: state.period, label: 'set' }
  if (phase.kind === 'break')
    return phase.label === 'pre'
      ? { kind: 'pre' }
      : { kind: 'break', label: phase.label, period: phase.period }
  if (fate.def.sport === 'football' && phase.label !== 'shootout') {
    const minute =
      (phase.base ?? 0) + Math.floor((state.elapsed - phase.start) / (phase.unit ?? MINUTE)) + 1
    const nominal = (phase.base ?? 0) + (phase.length ?? 45)
    return {
      kind: 'minute',
      period: phase.period,
      minute: Math.min(minute, nominal),
      added: Math.max(0, minute - nominal),
    }
  }
  if (fate.def.sport === 'basketball') {
    const seconds = Math.max(
      0,
      (phase.base ?? 600) - Math.floor((state.elapsed - phase.start) / (phase.unit ?? 1000)),
    )
    return { kind: 'countdown', period: phase.period, seconds }
  }
  return { kind: 'period', period: phase.period, label: phase.label }
}

/* ---------- Stats ---------- */

export type StatKey =
  | 'goals'
  | 'shots'
  | 'onTarget'
  | 'possession'
  | 'corners'
  | 'fouls'
  | 'yellow'
  | 'red'
  | 'points'
  | 'twos'
  | 'threes'
  | 'freeThrows'
  | 'timeouts'
  | 'lead'
  | 'sets'
  | 'attack'
  | 'block'
  | 'ace'
  | 'errors'
  | 'games'
  | 'doubleFaults'
  | 'breaks'
  | 'breakPoints'
  | 'pointsWon'

export interface StatRow {
  key: StatKey
  values: [number, number]
}

const sideIndex = (side: Side | undefined) => (side === 'b' ? 1 : 0)

export function statsFrom(fate: Fate, state: LiveState): StatRow[] {
  const count = (
    test: (event: ScriptEvent) => boolean,
    by: (event: ScriptEvent) => Side | undefined = (event) => event.side,
  ) => {
    const values: [number, number] = [0, 0]
    for (const event of state.events) if (test(event)) values[sideIndex(by(event))] += 1
    return values
  }
  const events = state.events
  switch (fate.def.sport) {
    case 'football': {
      const goals = count((event) => event.kind === 'goal')
      const shots = count((event) => event.kind === 'shot')
      const onTarget = count((event) => event.kind === 'shot' && event.note === 'onTarget')
      const pA = winChance(fate.teams[0].rating, fate.teams[1].rating)
      // Possession leans towards the stronger side and drifts with the flow of play.
      const drift = Math.sin(state.elapsed / (4 * MINUTE)) * 4
      const possession = state.started
        ? Math.round(Math.min(68, Math.max(32, 50 + (pA - 0.5) * 30 + drift)))
        : 50
      return [
        { key: 'goals', values: goals },
        { key: 'shots', values: [shots[0] + goals[0], shots[1] + goals[1]] },
        { key: 'onTarget', values: [onTarget[0] + goals[0], onTarget[1] + goals[1]] },
        { key: 'possession', values: [possession, 100 - possession] },
        { key: 'corners', values: count((event) => event.kind === 'corner') },
        { key: 'fouls', values: count((event) => event.kind === 'foul') },
        { key: 'yellow', values: count((event) => event.kind === 'yellow') },
        { key: 'red', values: count((event) => event.kind === 'red') },
      ]
    }
    case 'basketball': {
      let lead: [number, number] = [0, 0]
      for (const event of events) {
        const margin = event.score[0] - event.score[1]
        lead = [Math.max(lead[0], margin), Math.max(lead[1], -margin)]
      }
      const made = (points: number) =>
        count((event) => event.kind === 'score' && event.points === points)
      return [
        { key: 'points', values: state.score },
        { key: 'twos', values: made(2) },
        { key: 'threes', values: made(3) },
        { key: 'freeThrows', values: made(1) },
        { key: 'fouls', values: count((event) => event.kind === 'foul') },
        { key: 'timeouts', values: count((event) => event.kind === 'timeout') },
        { key: 'lead', values: lead },
      ]
    }
    case 'volleyball':
      return [
        { key: 'sets', values: state.score },
        { key: 'pointsWon', values: count((event) => event.kind === 'point') },
        {
          key: 'attack',
          values: count((event) => event.kind === 'point' && event.note === 'attack'),
        },
        {
          key: 'block',
          values: count((event) => event.kind === 'point' && event.note === 'block'),
        },
        { key: 'ace', values: count((event) => event.kind === 'point' && event.note === 'ace') },
        // Points given away: the rival's errors.
        {
          key: 'errors',
          values: count(
            (event) => event.kind === 'point' && event.note === 'error',
            (event) => (event.side ? other(event.side) : undefined),
          ),
        },
        { key: 'timeouts', values: count((event) => event.kind === 'timeout') },
      ]
    case 'tennis': {
      const games: [number, number] = [0, 0]
      for (const period of state.periods) {
        games[0] += period[0]
        games[1] += period[1]
      }
      const chances: [number, number] = [0, 0]
      let previous: ScriptEvent | undefined
      for (const event of events) {
        // Count each break-point chance once, when it first appears.
        if (event.situation?.kind === 'breakPoint' && previous?.situation?.kind !== 'breakPoint') {
          chances[sideIndex(event.situation.side)] += 1
        }
        if (event.kind === 'point') previous = event
      }
      return [
        { key: 'sets', values: state.score },
        { key: 'games', values: games },
        { key: 'ace', values: count((event) => event.kind === 'point' && event.note === 'ace') },
        {
          key: 'doubleFaults',
          values: count(
            (event) => event.kind === 'point' && event.note === 'doubleFault',
            (event) => (event.side ? other(event.side) : undefined),
          ),
        },
        {
          key: 'breaks',
          values: count((event) => event.kind === 'game' && event.note === 'break'),
        },
        { key: 'breakPoints', values: chances },
        { key: 'pointsWon', values: count((event) => event.kind === 'point') },
      ]
    }
    case 'chess':
      return []
  }
}

export interface PlayerLine {
  player: number
  /** Football goals, basketball points, volleyball points. */
  main: number
  /** Football assists, basketball threes, volleyball blocks. */
  second: number
  /** Football cards, basketball fouls, volleyball aces. */
  third: number
  flag?: 'yellow' | 'red' | 'foulOut' | 'subIn' | 'subOut'
}

/** Box-score lines for each side, from the events so far. */
export function playerLines(fate: Fate, state: LiveState): [PlayerLine[], PlayerLine[]] {
  const size = fate.teams[0].roster.length
  const make = () =>
    Array.from(
      { length: size },
      (_, player) => ({ player, main: 0, second: 0, third: 0 }) as PlayerLine,
    )
  const lines = [make(), make()]
  for (const event of state.events) {
    if (event.player === undefined || !event.side) continue
    const own = lines[sideIndex(event.side)]
    const line = own[event.player]
    switch (event.kind) {
      case 'goal':
        line.main += 1
        if (event.other !== undefined) own[event.other].second += 1
        break
      case 'yellow':
        line.third += 1
        line.flag = 'yellow'
        break
      case 'red':
        line.third += 1
        line.flag = 'red'
        break
      case 'sub':
        line.flag = line.flag ?? 'subOut'
        if (event.other !== undefined) own[event.other].flag = 'subIn'
        break
      case 'score':
        line.main += event.points ?? 0
        if (event.points === 3) line.second += 1
        break
      case 'foul':
        if (fate.def.sport === 'basketball') line.third += 1
        break
      case 'foulOut':
        line.flag = 'foulOut'
        break
      case 'point':
        line.main += 1
        if (event.note === 'block') line.second += 1
        if (event.note === 'ace') line.third += 1
        break
    }
  }
  return [lines[0], lines[1]]
}

/* ---------- Tournament-level questions ---------- */

export function tournamentFates(tournamentId: string, now: number): Fate[] {
  const tournament = tournamentById.get(tournamentId)
  if (tournament?.format === 'league') {
    const dayStart = startOfDay(now)
    return leagueSlots(tournament, dayStart, dayStart + DAY - 1).map((slot) =>
      leagueFate(tournament, slot),
    )
  }
  const world = worldAt(now)
  return world.defs
    .filter((def) => def.tournamentId === tournamentId)
    .map((def) => world.fates.get(def.id)!)
}

export function tournamentStatus(tournament: Tournament, now: number): MatchStatus {
  if (tournament.format === 'league') return 'live'
  const [start, end] = tournamentDates(tournament, now)
  if (now < start) return 'upcoming'
  if (now >= end) return 'finished'
  return 'live'
}

export function tournamentDates(tournament: Tournament, now: number): [number, number] {
  if (tournament.format === 'league') {
    const dayStart = startOfDay(now)
    return [dayStart, dayStart + DAY - 1]
  }
  const fates = tournamentFates(tournament.id, now)
  return [
    Math.min(...fates.map((fate) => fate.def.startAt)),
    Math.max(...fates.map((fate) => fate.def.startAt + fate.script.duration)),
  ]
}

/** Today's league table, from the matches finished so far. */
export function leagueTable(league: LeagueTournament, now: number): TableRow[] {
  const finished = tournamentFates(league.id, now).filter(
    (fate) => statusAt(fate, now) === 'finished',
  )
  return tableFrom(league.sport, league.teams, finished)
}

export function swissTable(tournament: SwissTournament, now: number): TableRow[] {
  const finished = tournamentFates(tournament.id, now).filter(
    (fate) => statusAt(fate, now) === 'finished',
  )
  return tableFrom('chess', tournament.players, finished)
}

export interface Placement {
  team: Team
  /** Best and worst place: [3, 4] for a losing semi-finalist. */
  places: [number, number]
  /** Still in the running. */
  alive: boolean
}

const knockedOut: Partial<Record<StageKey, [number, number]>> = {
  final: [2, 2],
  sf: [3, 4],
  qf: [5, 8],
}

/** Final or current placings, best first. */
export function placements(tournament: Tournament, now: number): Placement[] {
  if (tournament.format !== 'knockout') {
    const status = tournamentStatus(tournament, now)
    const table =
      tournament.format === 'league' ? leagueTable(tournament, now) : swissTable(tournament, now)
    return table.map((row, place) => ({
      team: row.team,
      places: [place + 1, place + 1],
      alive: status !== 'finished',
    }))
  }
  const placed = new Map<string, Placement>()
  for (const fate of tournamentFates(tournament.id, now).filter(
    (item) => statusAt(item, now) === 'finished',
  )) {
    if (fate.def.stage === 'final')
      placed.set(winnerOf(fate).id, { team: winnerOf(fate), places: [1, 1], alive: false })
    const places = knockedOut[fate.def.stage]
    if (places) placed.set(loserOf(fate).id, { team: loserOf(fate), places, alive: false })
  }
  for (const id of tournamentTeams(tournament)) {
    if (!placed.has(id)) placed.set(id, { team: teamById.get(id)!, places: [1, 8], alive: true })
  }
  return [...placed.values()].sort(
    (first, second) =>
      Number(second.alive) - Number(first.alive) ||
      first.places[0] - second.places[0] ||
      second.team.rating - first.team.rating,
  )
}

/** Every match on the site, the leagues for a window around now. */
export function allFates(now: number, window: [number, number] = [-6 * HOUR, 6 * HOUR]): Fate[] {
  const world = worldAt(now)
  const league = leagues.flatMap((item) =>
    leagueSlots(item, now + window[0], now + window[1]).map((slot) => leagueFate(item, slot)),
  )
  return [...world.defs.map((def) => world.fates.get(def.id)!), ...league]
}

export function liveFates(now: number, sport?: SportId): Fate[] {
  return allFates(now, [-2 * HOUR, 0])
    .filter((fate) => statusAt(fate, now) === 'live' && (!sport || fate.def.sport === sport))
    .sort((first, second) => first.def.startAt - second.def.startAt)
}

export function upcomingFates(now: number, limit: number, includeLeagues = false): Fate[] {
  return allFates(now, includeLeagues ? [0, 2 * HOUR] : [0, -1])
    .filter((fate) => statusAt(fate, now) === 'upcoming')
    .sort((first, second) => first.def.startAt - second.def.startAt)
    .slice(0, limit)
}

export function sideOf(fate: Fate, teamId: string): Side | null {
  if (fate.teams[0].id === teamId) return 'a'
  if (fate.teams[1].id === teamId) return 'b'
  return null
}

/** The team's matches that can be shown: known opponents only, oldest first. */
export function teamFates(team: Team, now: number): Fate[] {
  const world = worldAt(now)
  const fromEvents = world.defs
    .map((def) => world.fates.get(def.id)!)
    .filter((fate) => viewMatch(fate, now).teams.some((item) => item?.id === team.id))
  const league = leagues
    .filter((item) => item.sport === team.sport)
    .flatMap((item) => tournamentFates(item.id, now))
    .filter((fate) => sideOf(fate, team.id))
  return [...fromEvents, ...league].sort((first, second) => first.def.startAt - second.def.startAt)
}

export type FormResult = 'W' | 'D' | 'L'

export function recentForm(
  team: Team,
  now: number,
  count = 5,
): { fate: Fate; result: FormResult }[] {
  return teamFates(team, now)
    .filter((fate) => statusAt(fate, now) === 'finished')
    .slice(-count)
    .map((fate) => ({ fate, result: resultFor(fate, team.id)! }))
}

export function teamRecord(team: Team, now: number) {
  const results = teamFates(team, now)
    .filter((fate) => statusAt(fate, now) === 'finished')
    .map((fate) => resultFor(fate, team.id))
  return {
    played: results.length,
    wins: results.filter((result) => result === 'W').length,
    draws: results.filter((result) => result === 'D').length,
    losses: results.filter((result) => result === 'L').length,
  }
}

/** The fans' pick split for an upcoming match, shown next to your own prediction. */
export function crowdSplit(fate: Fate): [number, number] {
  const chance = winChance(fate.teams[0].rating, fate.teams[1].rating)
  const random = seededRandom(`${fate.def.id}-crowd`)
  const a = Math.round(Math.min(88, Math.max(12, chance * 100 + (random() - 0.5) * 16)))
  return [a, 100 - a]
}

export function winnerTeam(fate: Fate): Team | null {
  return fate.script.winner === null ? null : winnerOf(fate)
}

export function isIndividual(fate: Fate) {
  return sports[fate.def.sport].individual
}
