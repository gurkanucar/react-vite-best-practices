/**
 * Turning vote counts into a result: places, shares and the order they are revealed in.
 * Kept free of React and of the show's data so every shape of final can be tested, from a
 * lone contestant to a field where everyone ties.
 */

export interface VoteEntry {
  id: string
  votes: number
}

export interface RankedEntry extends VoteEntry {
  /** Standard competition ranking: two contestants sharing second are followed by fourth. */
  rank: number
  /** Share of the vote in tenths of a percent, so 523 reads as 52.3%. */
  shareTenths: number
  /** Whether someone else holds the same place. */
  tied: boolean
}

/** One tap on the results stage: everyone who shares a place is revealed together. */
export interface RevealStep {
  rank: number
  entries: RankedEntry[]
  tied: boolean
  /** The last step of the night: whoever is in it won. */
  winners: boolean
}

/**
 * Shares in tenths of a percent that always add up to exactly 100.0%. Each contestant gets
 * the whole tenths their votes earn; the tenths left over go to the largest remainders, so
 * rounding never produces 99.9% or 100.1%. With no votes at all everyone shows 0.0%.
 */
export function shareTenths(entries: VoteEntry[]): Map<string, number> {
  const total = entries.reduce((sum, entry) => sum + Math.max(0, entry.votes), 0)
  const shares = new Map<string, number>()
  if (total === 0) {
    for (const entry of entries) shares.set(entry.id, 0)
    return shares
  }

  const parts = entries.map((entry, index) => {
    const exact = (Math.max(0, entry.votes) * 1000) / total
    return { id: entry.id, index, votes: entry.votes, whole: Math.floor(exact), rest: exact % 1 }
  })
  let left = 1000 - parts.reduce((sum, part) => sum + part.whole, 0)
  const byRemainder = [...parts].sort(
    (a, b) => b.rest - a.rest || b.votes - a.votes || a.index - b.index,
  )
  for (const part of byRemainder) {
    if (left <= 0) break
    part.whole += 1
    left -= 1
  }
  for (const part of parts) shares.set(part.id, part.whole)
  return shares
}

/** Contestants from first to last, with shared places for equal votes. */
export function rankEntries(entries: VoteEntry[]): RankedEntry[] {
  const shares = shareTenths(entries)
  const sorted = entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.votes - a.entry.votes || a.index - b.index)

  const ranked: RankedEntry[] = []
  sorted.forEach(({ entry }, position) => {
    const previous = ranked[position - 1]
    const rank = previous && previous.votes === entry.votes ? previous.rank : position + 1
    ranked.push({ ...entry, rank, shareTenths: shares.get(entry.id) ?? 0, tied: false })
  })

  const perRank = new Map<number, number>()
  for (const entry of ranked) perRank.set(entry.rank, (perRank.get(entry.rank) ?? 0) + 1)
  const result = ranked.map((entry) => ({ ...entry, tied: (perRank.get(entry.rank) ?? 0) > 1 }))

  // Largest-remainder rounding can split a tie by a tenth; equal votes must read the same.
  return evenOutTies(result)
}

/**
 * Rounding hands out spare tenths one contestant at a time, which can leave two tied
 * contestants a tenth apart. Give every member of a tie the group's average and push any
 * leftover tenth to the untied contestant with the largest share, keeping the total at 100.0%.
 */
function evenOutTies(entries: RankedEntry[]): RankedEntry[] {
  const total = entries.reduce((sum, entry) => sum + entry.shareTenths, 0)
  if (total === 0) return entries

  const groups = new Map<number, RankedEntry[]>()
  for (const entry of entries) groups.set(entry.rank, [...(groups.get(entry.rank) ?? []), entry])

  let drift = 0
  const evened = entries.map((entry) => {
    const group = groups.get(entry.rank) ?? [entry]
    if (group.length < 2) return entry
    const sum = group.reduce((acc, member) => acc + member.shareTenths, 0)
    const even = Math.floor(sum / group.length)
    drift += entry.shareTenths - even
    return { ...entry, shareTenths: even }
  })
  if (drift === 0) return evened

  // The leftover goes to whoever is not tied, largest share first; if everyone is tied the
  // shares simply cannot be equal and exact at once, so the tie keeps equal numbers.
  const untied = evened
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => !entry.tied)
    .sort((a, b) => b.entry.shareTenths - a.entry.shareTenths)
  if (untied.length === 0) return evened
  const target = untied[0].index
  return evened.map((entry, index) =>
    index === target ? { ...entry, shareTenths: entry.shareTenths + drift } : entry,
  )
}

/**
 * The order the stage reveals places in: last place first, the winners last. Contestants
 * who share a place are one step, so a tie is announced as a tie rather than as an order.
 */
export function revealSteps(entries: VoteEntry[]): RevealStep[] {
  const ranked = rankEntries(entries)
  const groups: RankedEntry[][] = []
  for (const entry of ranked) {
    const last = groups.at(-1)
    if (last && last[0].rank === entry.rank) last.push(entry)
    else groups.push([entry])
  }
  return groups.reverse().map((group, index, all) => ({
    rank: group[0].rank,
    entries: group,
    tied: group.length > 1,
    winners: index === all.length - 1,
  }))
}

/** Votes added up. */
export function totalVotes(entries: VoteEntry[]): number {
  return entries.reduce((sum, entry) => sum + Math.max(0, entry.votes), 0)
}

/** "52.3" from 523 tenths, in the reader's number format. */
export function formatShare(tenths: number, language: 'en' | 'tr'): string {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(tenths / 10)
}
