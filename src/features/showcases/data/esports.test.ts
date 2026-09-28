import { beforeEach, describe, expect, it } from 'vitest'
import {
  sportIds,
  teamById,
  teams,
  teamsOf,
  tournamentById,
  tournaments,
  tournamentTeams,
  type SwissTournament,
} from '@/features/showcases/data/esports'
import { applySan, chessGames, positionsOf, START } from '@/features/showcases/data/esportsChess'
import { crowdCount } from '@/features/showcases/data/esportsFans'
import { formatScore } from '@/features/showcases/data/esportsFormat'
import {
  MINUTE,
  clockOf,
  leagueFate,
  leagues,
  liveFates,
  liveState,
  placements,
  simulateMatch,
  startOfDay,
  swissTable,
  tableFrom,
  tennisCall,
  tournamentFates,
  tournamentStatus,
  viewMatch,
  winnerOf,
  worldAt,
  type Fate,
  type MatchScript,
} from '@/features/showcases/data/esportsSim'
import { migrateEsports, useEsportsStore } from '@/features/showcases/hooks/useEsportsStore'

// A Monday afternoon: the cup semi-finals and the tennis semi-finals are today.
const now = new Date(2026, 8, 28, 16, 20).getTime()

const pair = (first: string, second: string): [(typeof teams)[number], (typeof teams)[number]] => [
  teamById.get(first)!,
  teamById.get(second)!,
]
const many = (count: number, run: (seed: number) => MatchScript) =>
  Array.from({ length: count }, (_, seed) => run(seed))

describe('people and events', () => {
  it('has unique ids, tags and player names', () => {
    expect(new Set(teams.map((team) => team.id)).size).toBe(teams.length)
    expect(new Set(teams.map((team) => team.tag)).size).toBe(teams.length)
    const names = teams.flatMap((team) => team.roster.map((player) => player.name))
    expect(new Set(names).size).toBe(names.length)
    for (const sport of sportIds) expect(teamsOf(sport)).toHaveLength(8)
  })

  it('only enters sides that play the tournament’s sport', () => {
    for (const tournament of tournaments) {
      expect(
        tournamentTeams(tournament).every((id) => teamById.get(id)?.sport === tournament.sport),
      ).toBe(true)
    }
  })

  it('plays the same match every time', () => {
    const teamsAB = pair('bogaz-fk', 'ege-firtinasi')
    expect(simulateMatch('x', 'football', teamsAB, { knockout: false })).toEqual(
      simulateMatch('x', 'football', teamsAB, { knockout: false }),
    )
  })
})

describe('football rules', () => {
  const sides = pair('bogaz-fk', 'toros-spor')

  it('never ends a knockout tie level, but allows draws in the league', () => {
    const cup = many(80, (seed) => simulateMatch(`k${seed}`, 'football', sides, { knockout: true }))
    expect(cup.every((script) => script.winner !== null)).toBe(true)
    expect(
      cup.some((script) => script.decidedBy === 'extraTime' || script.decidedBy === 'shootout'),
    ).toBe(true)
    const league = many(80, (seed) =>
      simulateMatch(`l${seed}`, 'football', sides, { knockout: false }),
    )
    expect(league.some((script) => script.winner === null)).toBe(true)
  })

  it('sends a player off on a second yellow, and he plays no more', () => {
    const scripts = many(300, (seed) =>
      simulateMatch(`c${seed}`, 'football', sides, { knockout: false }),
    )
    const reds = scripts.flatMap((script) =>
      script.events.filter((event) => event.kind === 'red').map((red) => ({ script, red })),
    )
    expect(reds.some(({ red }) => red.note === 'secondYellow')).toBe(true)
    for (const { script, red } of reds) {
      const later = script.events.filter(
        (event) => event.at > red.at && event.side === red.side && event.player === red.player,
      )
      expect(later.filter((event) => event.kind !== 'penalty')).toEqual([])
    }
    for (const { script, red } of reds.filter((item) => item.red.note === 'secondYellow')) {
      const yellows = script.events.filter(
        (event) =>
          event.kind === 'yellow' && event.side === red.side && event.player === red.player,
      )
      expect(yellows).toHaveLength(1)
    }
  })

  it('keeps the score in step with the goals and splits it by half', () => {
    for (const script of many(30, (seed) =>
      simulateMatch(`g${seed}`, 'football', sides, { knockout: false }),
    )) {
      const goals = script.events.filter((event) => event.kind === 'goal')
      expect(goals.filter((goal) => goal.side === 'a')).toHaveLength(script.score[0])
      expect(script.periods).toHaveLength(2)
      expect(script.periods[0][0] + script.periods[1][0]).toBe(script.score[0])
      for (const goal of goals) {
        expect(goal.minute).toBeGreaterThan(goal.period === 1 ? 0 : 45)
      }
    }
  })
})

describe('basketball rules', () => {
  const sides = pair('baskent-devleri', 'van-kedileri')

  it('has no ties, adds overtime when level after four quarters, and fouls players out on five', () => {
    const scripts = many(120, (seed) =>
      simulateMatch(`b${seed}`, 'basketball', sides, { knockout: false }),
    )
    for (const script of scripts) {
      expect(script.score[0]).not.toBe(script.score[1])
      const points = script.events.filter((event) => event.kind === 'score')
      expect(
        points
          .filter((event) => event.side === 'a')
          .reduce((sum, event) => sum + (event.points ?? 0), 0),
      ).toBe(script.score[0])
      for (const out of script.events.filter((event) => event.kind === 'foulOut')) {
        const fouls = script.events.filter(
          (event) =>
            event.kind === 'foul' && event.side === out.side && event.player === out.player,
        )
        expect(fouls).toHaveLength(5)
        expect(
          script.events.some(
            (event) =>
              event.at > out.at + 1 && event.side === out.side && event.player === out.player,
          ),
        ).toBe(false)
      }
    }
    const overtime = scripts.filter((script) => script.periods.length > 4)
    expect(overtime.length).toBeGreaterThan(0)
    for (const script of overtime) {
      const regulation = script.periods.slice(0, 4)
      expect(regulation.reduce((sum, period) => sum + period[0], 0)).toBe(
        regulation.reduce((sum, period) => sum + period[1], 0),
      )
    }
  })
})

describe('volleyball rules', () => {
  it('plays sets to 25, the fifth to 15, always won by two, first to three sets', () => {
    const sides = pair('kuzey-ruzgari', 'mavi-dalga')
    for (const script of many(40, (seed) =>
      simulateMatch(`v${seed}`, 'volleyball', sides, { knockout: false }),
    )) {
      expect(Math.max(...script.score)).toBe(3)
      script.periods.forEach(([a, b], index) => {
        const target = index === 4 ? 15 : 25
        expect(Math.max(a, b)).toBeGreaterThanOrEqual(target)
        expect(Math.abs(a - b)).toBeGreaterThanOrEqual(2)
        // Past the target, a set only ends on a two-point lead.
        expect(Math.max(a, b) === target || Math.abs(a - b) === 2).toBe(true)
      })
    }
  })

  it('gives 3–0 and 3–1 wins three points, a 3–2 win two and the loser one', () => {
    const fates = leagues
      .filter((league) => league.sport === 'volleyball')
      .flatMap((league) => Array.from({ length: 40 }, (_, slot) => leagueFate(league, 1000 + slot)))
    const five = fates.find((fate) => fate.script.periods.length === 5)!
    const winner = five.script.winner === 'a' ? 0 : 1
    const table = tableFrom(
      'volleyball',
      five.teams.map((team) => team.id),
      [five],
    )
    expect(table.find((row) => row.team.id === five.teams[winner].id)!.points).toBe(2)
    expect(table.find((row) => row.team.id === five.teams[1 - winner].id)!.points).toBe(1)
  })
})

describe('tennis rules', () => {
  it('calls points 15, 30, 40, deuce and advantage', () => {
    expect(tennisCall([0, 0])).toEqual(['0', '0'])
    expect(tennisCall([2, 1])).toEqual(['30', '15'])
    expect(tennisCall([3, 3])).toEqual(['40', '40'])
    expect(tennisCall([5, 4])).toEqual(['AD', '40'])
  })

  it('wins sets 6–x by two, or 7–5, or 7–6 on a tie-break, in best of three and five', () => {
    const sides = pair('can-demirel', 'tomas-varga')
    for (const setsToWin of [2, 3]) {
      for (const script of many(30, (seed) =>
        simulateMatch(`t${seed}`, 'tennis', sides, { knockout: true, setsToWin }),
      )) {
        expect(Math.max(...script.score)).toBe(setsToWin)
        for (const [a, b] of script.periods) {
          const [high, low] = a > b ? [a, b] : [b, a]
          expect(high === 6 ? low <= 4 : high === 7 && (low === 5 || low === 6)).toBe(true)
        }
        const tiebreaks = script.events.filter(
          (event) => event.kind === 'game' && event.note === 'tiebreak',
        )
        for (const game of tiebreaks) expect(game.inner!.sort().join()).toBe('6,7')
      }
    }
  })

  it('flags break, set and match points', () => {
    const script = simulateMatch('flags', 'tennis', pair('emir-tekin', 'kerem-aydin'), {
      knockout: false,
    })
    const kinds = new Set(script.events.map((event) => event.situation?.kind).filter(Boolean))
    expect(kinds.has('breakPoint')).toBe(true)
    expect(kinds.has('matchPoint')).toBe(true)
  })
})

describe('chess', () => {
  it('replays every scripted game on the board', () => {
    for (const game of chessGames) expect(positionsOf(game)).toHaveLength(game.moves.length)
    expect(() => applySan(START, 'Nf6', true)).toThrow('fits 0 pieces')
  })

  it('settles a drawn knockout game with Armageddon', () => {
    const sides = pair('deniz-aksoy', 'zeynep-ilgaz')
    const scripts = many(40, (seed) =>
      simulateMatch(`a${seed}`, 'chess', sides, { knockout: true }),
    )
    expect(scripts.every((script) => script.winner !== null)).toBe(true)
    const armageddon = scripts.find((script) => script.decidedBy === 'armageddon')!
    expect(armageddon.chess).toHaveLength(2)
    expect(armageddon.chess![1].white).toBe('b')
  })

  it('shows half points', () => {
    expect(formatScore(0.5)).toBe('½')
    expect(formatScore(1.5)).toBe('1½')
    expect(formatScore(2)).toBe('2')
  })

  it('pairs Swiss rounds without rematches', () => {
    const swiss = tournamentById.get('bogazici-acik') as SwissTournament
    const fates = worldAt(now)
      .defs.filter((def) => def.tournamentId === swiss.id)
      .map((def) => worldAt(now).fates.get(def.id)!)
    const games = fates.map((fate) =>
      fate.teams
        .map((team) => team.id)
        .sort()
        .join('|'),
    )
    expect(new Set(games).size).toBe(games.length)
    for (let round = 0; round < swiss.rounds.length; round += 1) {
      const players = fates
        .filter((fate) => fate.def.round === round)
        .flatMap((fate) => fate.teams.map((team) => team.id))
      expect(new Set(players).size).toBe(8)
    }
    const table = swissTable(swiss, now)
    expect(table[0].points).toBeGreaterThanOrEqual(table[1].points)
  })
})

describe('the clock', () => {
  const fate: Fate = worldAt(now).fates.get('anadolu-kupasi-r0-0')!

  it('shows nothing before the start, part of the script while live, all of it after', () => {
    expect(liveState(fate, fate.def.startAt - MINUTE).events).toHaveLength(0)
    const middle = liveState(fate, fate.def.startAt + 20 * MINUTE)
    expect(middle.finished).toBe(false)
    expect(middle.events.length).toBeGreaterThan(0)
    expect(middle.events.length).toBeLessThan(fate.script.events.length)
    const after = liveState(fate, fate.def.startAt + fate.script.duration)
    expect(after.finished).toBe(true)
    expect(after.score).toEqual(fate.script.score)
  })

  it('reads the football minute and the basketball countdown from the phases', () => {
    const minute = clockOf(fate, liveState(fate, fate.def.startAt + 60_000 + 10 * 20_000 + 5_000))
    expect(minute).toMatchObject({ kind: 'minute', minute: 11, added: 0 })
    const basket = leagueFate(
      leagues.find((league) => league.sport === 'basketball')!,
      5000,
    )
    const start = basket.script.phases.find((phase) => phase.kind === 'play')!
    expect(clockOf(basket, liveState(basket, basket.def.startAt + start.start + 1))).toMatchObject({
      kind: 'countdown',
      period: 1,
      seconds: 600,
    })
  })

  it('always has a live match in every sport, whatever the time of day', () => {
    const dayStart = startOfDay(now)
    for (let minute = 0; minute < 24 * 60; minute += 7) {
      const live = liveFates(dayStart + minute * MINUTE)
      for (const sport of sportIds) expect(live.some((item) => item.def.sport === sport)).toBe(true)
    }
  })

  it('dates events from today', () => {
    const status = (id: string) => tournamentStatus(tournamentById.get(id)!, now)
    expect(status('anadolu-kupasi')).toBe('live')
    expect(status('zirve-open')).toBe('live')
    expect(status('bogazici-acik')).toBe('live')
    expect(status('pota-kupasi')).toBe('finished')
    expect(status('kis-masters')).toBe('finished')
    expect(status('file-kupasi')).toBe('upcoming')
  })
})

describe('brackets', () => {
  it('sends each winner on and hides undecided slots', () => {
    const world = worldAt(now)
    for (const def of world.defs.filter(
      (item) => item.tournamentId === 'zirve-open' && item.round > 0,
    )) {
      const next = world.fates.get(def.id)!
      def.sources.forEach((source, side) => {
        if (!('winnerOf' in source)) throw new Error('expected a feeder')
        expect(next.teams[side].id).toBe(winnerOf(world.fates.get(source.winnerOf)!).id)
      })
    }
    const final = world.fates.get('anadolu-kupasi-r2-0')!
    expect(viewMatch(final, now).teams).toEqual([null, null])
  })

  it('places all eight in a finished knockout', () => {
    const places = placements(tournamentById.get('pota-kupasi')!, now)
    expect(places.map((item) => item.places[0])).toEqual([1, 2, 3, 3, 5, 5, 5, 5])
    expect(tournamentFates('pota-kupasi', now)).toHaveLength(7)
  })
})

describe('fans and the store', () => {
  beforeEach(() => useEsportsStore.getState().reset())

  it('counts the crowd the same way for everyone, louder after big moments', () => {
    const fate = worldAt(now).fates.get('anadolu-kupasi-r0-0')!
    const early = liveState(fate, fate.def.startAt + 5 * MINUTE)
    const late = liveState(fate, fate.def.startAt + fate.script.duration)
    expect(crowdCount(fate, early, 'a')).toBe(crowdCount(fate, early, 'a'))
    expect(crowdCount(fate, late, 'a')).toBeGreaterThan(crowdCount(fate, early, 'a'))
  })

  it('follows, predicts and remembers your side in the stands', () => {
    const store = useEsportsStore.getState()
    store.toggleFollow('bogaz-fk')
    store.predict('m1', 'a')
    store.predict('m1', 'b')
    store.setFanSide('m1', 'b')
    const state = useEsportsStore.getState()
    expect(state.follows).toEqual(['bogaz-fk'])
    expect(state.predictions).toEqual({ m1: 'b' })
    expect(state.fanSides).toEqual({ m1: 'b' })
  })

  it('carries follows and picks over from version 1', () => {
    expect(migrateEsports({ follows: ['x'], predictions: { m: 'x' } }, 1)).toEqual({
      follows: ['x'],
      predictions: { m: 'x' },
      fanSides: {},
    })
    expect(migrateEsports({ junk: true }, 0)).toEqual({
      follows: [],
      predictions: {},
      fanSides: {},
    })
  })
})
