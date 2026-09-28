import { describe, expect, it } from 'vitest'
import {
  anonymousSplit,
  contestants,
  maskName,
  findScenario,
  liveStats,
  poisson,
  recentVoters,
  rollingRate,
  votersBetween,
  ROUND_MS,
  roundAt,
  scenarios,
  teamName,
  turkishGenitive,
  upper,
  votesInSecond,
  votesPerMinute,
  votesUntil,
  VOTING_MS,
} from '@/features/showcases/data/songContest'
import {
  rankEntries,
  revealSteps,
  shareTenths,
  totalVotes,
  type VoteEntry,
} from '@/features/showcases/data/songContestRanking'

const sumShares = (entries: VoteEntry[]) =>
  rankEntries(entries).reduce((sum, entry) => sum + entry.shareTenths, 0)
const ranks = (entries: VoteEntry[]) => rankEntries(entries).map((entry) => [entry.id, entry.rank])
const order = (entries: VoteEntry[]) =>
  revealSteps(entries).map((step) => step.entries.map((entry) => entry.id))

describe('ranking a final', () => {
  it('handles a single contestant: one step, and it is the winner', () => {
    const steps = revealSteps([{ id: 'a', votes: 10 }])
    expect(steps).toHaveLength(1)
    expect(steps[0]).toMatchObject({ rank: 1, winners: true, tied: false })
    expect(steps[0].entries[0].shareTenths).toBe(1000)
  })

  it('reveals two contestants runner-up first', () => {
    expect(
      order([
        { id: 'a', votes: 40 },
        { id: 'b', votes: 60 },
      ]),
    ).toEqual([['a'], ['b']])
  })

  it('reveals three, four and five contestants from last place to first', () => {
    const three = [
      { id: 'a', votes: 5 },
      { id: 'b', votes: 9 },
      { id: 'c', votes: 7 },
    ]
    expect(order(three)).toEqual([['a'], ['c'], ['b']])

    const four = [
      { id: 'a', votes: 58_412 },
      { id: 'b', votes: 51_907 },
      { id: 'c', votes: 44_385 },
      { id: 'd', votes: 38_190 },
    ]
    expect(order(four)).toEqual([['d'], ['c'], ['b'], ['a']])
    expect(revealSteps(four).map((step) => step.rank)).toEqual([4, 3, 2, 1])

    const five = [...four, { id: 'e', votes: 1 }]
    expect(order(five)[0]).toEqual(['e'])
    expect(revealSteps(five)).toHaveLength(5)
  })

  it('shares a place on equal votes and skips the next one (1, 2, 2, 4)', () => {
    const entries = [
      { id: 'a', votes: 50 },
      { id: 'b', votes: 30 },
      { id: 'c', votes: 30 },
      { id: 'd', votes: 10 },
    ]
    expect(ranks(entries)).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 2],
      ['d', 4],
    ])
    const steps = revealSteps(entries)
    expect(steps.map((step) => step.rank)).toEqual([4, 2, 1])
    expect(steps[1]).toMatchObject({ tied: true })
    expect(steps[1].entries.map((entry) => entry.id)).toEqual(['b', 'c'])
    expect(steps[1].entries.every((entry) => entry.tied)).toBe(true)
  })

  it('names joint winners on a tie at the top', () => {
    const steps = revealSteps([
      { id: 'a', votes: 20 },
      { id: 'b', votes: 20 },
      { id: 'c', votes: 5 },
    ])
    expect(steps.map((step) => step.rank)).toEqual([3, 1])
    expect(steps[1]).toMatchObject({ winners: true, tied: true })
    expect(steps[1].entries).toHaveLength(2)
  })

  it('handles a tie for last place', () => {
    const steps = revealSteps([
      { id: 'a', votes: 9 },
      { id: 'b', votes: 2 },
      { id: 'c', votes: 2 },
    ])
    expect(steps[0]).toMatchObject({ rank: 2, tied: true })
    expect(steps[1]).toMatchObject({ rank: 1, winners: true, tied: false })
  })

  it('puts everyone in first when all votes are equal', () => {
    const entries = ['a', 'b', 'c', 'd'].map((id) => ({ id, votes: 25 }))
    const steps = revealSteps(entries)
    expect(steps).toHaveLength(1)
    expect(steps[0]).toMatchObject({ rank: 1, winners: true, tied: true })
    expect(steps[0].entries.map((entry) => entry.shareTenths)).toEqual([250, 250, 250, 250])
  })

  it('copes with nobody voting', () => {
    const entries = [
      { id: 'a', votes: 0 },
      { id: 'b', votes: 0 },
    ]
    expect(totalVotes(entries)).toBe(0)
    expect(rankEntries(entries).map((entry) => entry.shareTenths)).toEqual([0, 0])
    expect(revealSteps(entries)).toHaveLength(1)
  })

  it('keeps shares adding up to exactly 100.0%', () => {
    expect(
      sumShares([
        { id: 'a', votes: 1 },
        { id: 'b', votes: 1 },
        { id: 'c', votes: 1 },
        { id: 'd', votes: 4 },
      ]),
    ).toBe(1000)
    expect(
      sumShares([
        { id: 'a', votes: 58_412 },
        { id: 'b', votes: 51_907 },
        { id: 'c', votes: 44_385 },
        { id: 'd', votes: 38_190 },
      ]),
    ).toBe(1000)
    for (const scenario of scenarios) expect(sumShares(scenario.votes)).toBe(1000)
  })

  it('gives tied contestants the same share', () => {
    const ranked = rankEntries([
      { id: 'a', votes: 1 },
      { id: 'b', votes: 1 },
      { id: 'c', votes: 1 },
      { id: 'd', votes: 4 },
    ])
    const tied = ranked.filter((entry) => entry.tied).map((entry) => entry.shareTenths)
    expect(new Set(tied).size).toBe(1)
    expect(ranked.reduce((sum, entry) => sum + entry.shareTenths, 0)).toBe(1000)
  })

  it('rounds by largest remainder', () => {
    // 1/3, 1/3, 1/3 of 1000 tenths: 333.3 each, one spare tenth to the first.
    const shares = shareTenths([
      { id: 'a', votes: 1 },
      { id: 'b', votes: 1 },
      { id: 'c', votes: 1 },
    ])
    expect([...shares.values()].reduce((sum, value) => sum + value, 0)).toBe(1000)
  })
})

describe('the demo results', () => {
  it('covers one to five contestants, a tie and joint winners', () => {
    const sizes = scenarios.map((scenario) => scenario.votes.length)
    expect(new Set(sizes)).toEqual(new Set([1, 2, 4, 5]))
    expect(revealSteps(findScenario('tie').votes).some((step) => step.tied && !step.winners)).toBe(
      true,
    )
    expect(revealSteps(findScenario('joint').votes).at(-1)).toMatchObject({ tied: true })
    expect(findScenario('nope').id).toBe('final')
  })

  it('only names singers who exist', () => {
    const ids = new Set(contestants.map((contestant) => contestant.id))
    for (const scenario of scenarios)
      for (const entry of scenario.votes) expect(ids.has(entry.id)).toBe(true)
  })
})

describe('the live round', () => {
  const start = 1_790_000_000_000 - (1_790_000_000_000 % ROUND_MS)

  it('opens for 27 minutes and closes for 3', () => {
    expect(roundAt(start + 60_000)).toMatchObject({ open: true, elapsed: 60 })
    expect(roundAt(start + VOTING_MS - 1).open).toBe(true)
    const closed = roundAt(start + VOTING_MS + 1_000)
    expect(closed.open).toBe(false)
    expect(closed.elapsed).toBe(VOTING_MS / 1000)
    expect(roundAt(start + ROUND_MS).id).toBe(closed.id + 1)
  })

  it('is the same numbers every time', () => {
    const round = roundAt(start + 5 * 60_000)
    expect(liveStats(round.id, round.elapsed)).toEqual(liveStats(round.id, round.elapsed))
    expect(recentVoters(round.id, round.elapsed)).toEqual(recentVoters(round.id, round.elapsed))
  })

  it('only grows while lines are open and stops when they close', () => {
    const { id } = roundAt(start)
    const early = votesUntil(id, 60)
    const later = votesUntil(id, 600)
    expect(early).toBeGreaterThan(0)
    expect(later).toBeGreaterThan(early)
    expect(votesInSecond(id, VOTING_MS / 1000)).toBe(0)
    expect(votesUntil(id, 99_999)).toBe(votesUntil(id, VOTING_MS / 1000))
  })

  it('arrives in uneven clumps of about one to eight a second', () => {
    const { id } = roundAt(start)
    const seconds = Array.from({ length: 1620 }, (_, second) => votesInSecond(id, second))
    const busy = seconds.slice(120)
    const average = busy.reduce((sum, value) => sum + value, 0) / busy.length
    expect(average).toBeGreaterThan(2)
    expect(average).toBeLessThan(7)
    // Spikes happen, but almost every second stays within what reads as a trickle.
    const sorted = [...busy].sort((a, b) => a - b)
    expect(sorted[Math.floor(sorted.length * 0.95)]).toBeLessThanOrEqual(10)
    expect(busy.filter((value) => value >= 1 && value <= 8).length / busy.length).toBeGreaterThan(
      0.8,
    )
    // Not a steady drip: plenty of different counts.
    expect(new Set(busy).size).toBeGreaterThan(6)
  })

  it('draws Poisson counts', () => {
    expect(poisson(3, 0)).toBe(0)
    expect(poisson(3, 0.5)).toBe(3)
    expect(poisson(3, 0.999)).toBeGreaterThan(6)
  })

  it('keeps a rolling window of the vote rate that scrolls on', () => {
    const { id } = roundAt(start)
    const early = rollingRate(id, 400)
    const later = rollingRate(id, 415)
    // Six minutes of 15-second slices, plus the one still filling.
    expect(early.length).toBeGreaterThanOrEqual(24)
    expect(early.length).toBeLessThanOrEqual(25)
    expect(later[0].second).toBe(early[1].second)
    // Finished slices keep their shape as the window moves.
    expect(later[0]).toEqual(early[1])
  })

  it('adds voters in order without the same name twice in a row', () => {
    const { id } = roundAt(start)
    const voters = votersBetween(id, 100, 400)
    expect(voters.length).toBeGreaterThan(50)
    voters.forEach((voter, index) => {
      if (index === 0) return
      expect(voter.second).toBeGreaterThan(voters[index - 1].second)
      expect(voter.name).not.toBe(voters[index - 1].name)
    })
  })

  it('adds up per minute to the running total', () => {
    const { id } = roundAt(start)
    const minutes = votesPerMinute(id, 330)
    expect(minutes).toHaveLength(6)
    expect(minutes.reduce((sum, point) => sum + point.votes, 0)).toBe(votesUntil(id, 330))
  })

  it('splits the vote into unnamed slices, largest first, without losing a vote', () => {
    const { id } = roundAt(start)
    const total = votesUntil(id, 900)
    const split = anonymousSplit(id, 900, total)
    expect(split).toHaveLength(4)
    expect(split.reduce((sum, value) => sum + value, 0)).toBe(total)
    expect([...split].sort((a, b) => b - a)).toEqual(split)
    expect(anonymousSplit(id, 0, 0)).toEqual([0, 0, 0, 0])
  })

  it('shows who voted, newest first, with masked names and nothing else about them', () => {
    const { id } = roundAt(start)
    const feed = recentVoters(id, 400, 8)
    expect(feed).toHaveLength(8)
    expect(feed[0].second).toBeGreaterThan(feed[7].second)
    for (const item of feed) {
      expect(Object.keys(item).sort()).toEqual(
        ['count', 'hue', 'id', 'initials', 'name', 'second'].sort(),
      )
      expect(item.name).toMatch(/^\S{1,2}\*{2,} \S\.$/u)
    }
  })
})

describe('team names', () => {
  it('follows Turkish vowel harmony and the buffer n', () => {
    expect(turkishGenitive('Selin Tan')).toBe('Selin Tan’ın')
    expect(turkishGenitive('Barış Er')).toBe('Barış Er’in')
    expect(turkishGenitive('Nur Ada')).toBe('Nur Ada’nın')
    expect(turkishGenitive('Kaan Demir')).toBe('Kaan Demir’in')
    expect(turkishGenitive('Ece Koru')).toBe('Ece Koru’nun')
    expect(turkishGenitive('Oya Ünlü')).toBe('Oya Ünlü’nün')
    expect(turkishGenitive('Deniz Öztürk')).toBe('Deniz Öztürk’ün')
    expect(turkishGenitive('Ali Dolu')).toBe('Ali Dolu’nun')
    expect(turkishGenitive('Can Işık')).toBe('Can Işık’ın')
    expect(turkishGenitive('Selim Bolu')).toBe('Selim Bolu’nun')
  })

  it('names every finalist’s team in both languages', () => {
    expect(teamName('Selin Tan', 'tr')).toBe('Selin Tan’ın takımı')
    expect(teamName('Selin Tan', 'en')).toBe('Team Selin Tan')
    expect(upper(teamName('Kaan Demir', 'tr'), 'tr')).toBe('KAAN DEMİR’İN TAKIMI')
    for (const contestant of contestants) expect(contestant.coach).toMatch(/\S+ \S+/)
  })
})

describe('masking a voter’s name', () => {
  it('keeps one or two letters and the surname initial', () => {
    expect(maskName('Ayşe Yılmaz')).toBe('Ay** Y.')
    expect(maskName('Mehmet Öztürk')).toBe('Me**** Ö.')
    expect(maskName('Ali Kaya')).toBe('A** K.')
    expect(maskName('Nur Şahin')).toBe('N** Ş.')
    expect(maskName('İrem Çelik')).toBe('İr** Ç.')
    expect(maskName('Efe')).toBe('E**')
  })

  it('never shows a whole name', () => {
    for (const name of ['Ece Koç', 'Cem Kurt', 'Ozan Uçar', 'Gizem İnce', 'Ali Can Demir']) {
      const masked = maskName(name)
      const parts = name.split(' ').filter((part) => part.length > 1)
      for (const part of parts) expect(masked).not.toContain(part)
      expect(masked).toContain('**')
    }
  })
})
