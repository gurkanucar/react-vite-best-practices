import type { SportId, Team, Tournament } from '@/features/showcases/data/esports'
import type { EsportsCopy } from '@/features/showcases/data/esportsCopy'
import {
  DAY,
  HOUR,
  MINUTE,
  clockOf,
  findFate,
  liveState,
  startOfDay,
  type Fate,
  type LiveState,
  type MatchView,
  type ScriptEvent,
  type TeamSource,
} from '@/features/showcases/data/esportsSim'

export type Language = 'en' | 'tr'

const localeOf = (language: Language) => (language === 'tr' ? 'tr-TR' : 'en-GB')

export function formatTime(time: number, language: Language) {
  return new Intl.DateTimeFormat(localeOf(language), { hour: '2-digit', minute: '2-digit' }).format(
    time,
  )
}

export function formatDay(time: number, language: Language, withWeekday = false) {
  return new Intl.DateTimeFormat(localeOf(language), {
    day: 'numeric',
    month: 'short',
    ...(withWeekday ? { weekday: 'short' } : {}),
  }).format(time)
}

/** "Today 18:00", "Tomorrow 16:00" or "3 Oct 21:00". */
export function formatWhen(time: number, now: number, text: EsportsCopy, language: Language) {
  const days = Math.round((startOfDay(time) - startOfDay(now)) / DAY)
  const day =
    days === 0
      ? text.common.today
      : days === 1
        ? text.common.tomorrow
        : days === -1
          ? text.common.yesterday
          : formatDay(time, language)
  return `${day} ${formatTime(time, language)}`
}

export function formatDateRange([start, end]: [number, number], language: Language) {
  const first = formatDay(start, language)
  const last = formatDay(end, language)
  return first === last ? first : `${first} – ${last}`
}

/** "2 h 13 min", "45 min" or "3 days". */
export function formatSpan(ms: number, language: Language) {
  const tr = language === 'tr'
  if (ms >= 2 * DAY) return tr ? `${Math.floor(ms / DAY)} gün` : `${Math.floor(ms / DAY)} days`
  const hours = Math.floor(ms / HOUR)
  const minutes = Math.max(0, Math.floor((ms % HOUR) / MINUTE))
  if (hours === 0) return tr ? `${Math.max(1, minutes)} dk` : `${Math.max(1, minutes)} min`
  return tr ? `${hours} sa ${minutes} dk` : `${hours} h ${minutes} min`
}

export function formatMoney(amount: number, currency: string, language: Language) {
  return new Intl.NumberFormat(localeOf(language), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCount(count: number, language: Language) {
  return new Intl.NumberFormat(localeOf(language), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(count)
}

/** Chess scores use halves: 1½, ½. */
export function formatScore(value: number) {
  const whole = Math.floor(value)
  const half = value - whole >= 0.5
  if (!half) return String(whole)
  return whole === 0 ? '½' : `${whole}½`
}

/** A chess clock, m:ss. */
export function formatChessClock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function formatLabel(tournament: Tournament, text: EsportsCopy) {
  if (tournament.format === 'league' && tournament.sport === 'chess') return text.formats.roundRobin
  if (tournament.format === 'league' && tournament.sport === 'tennis') return text.formats.series
  return text.formats[tournament.format]
}

/** The label for a slot whose team or player is not decided yet. */
export function sourceLabel(source: TeamSource, text: EsportsCopy, now: number) {
  if ('winnerOf' in source) {
    const feeder = findFate(source.winnerOf, now)
    const label = feeder
      ? `${text.stages[feeder.def.stage]}${feeder.def.stage === 'final' ? '' : ` ${feeder.def.position + 1}`}`
      : text.common.tbd
    return text.common.winnerOf(label)
  }
  if ('swissRound' in source) return text.common.swissPending(source.swissRound)
  return text.common.tbd
}

/** The score a card shows: goals, points, sets or chess points. */
export function displayScore(view: MatchView, now: number): [string, string] | null {
  if (view.status === 'upcoming') return null
  const state = liveState(view.fate, now)
  return [formatScore(state.score[0]), formatScore(state.score[1])]
}

/** The words on the live clock: "67'", "Q3 04:21", "Set 3", "Half-time". */
export function clockText(fate: Fate, state: LiveState, text: EsportsCopy) {
  const clock = clockOf(fate, state)
  switch (clock.kind) {
    case 'pre':
      return text.clock.pre
    case 'final':
      return fate.def.sport === 'football' ? text.clock.final : text.clock.finalOther
    case 'break':
      return text.clock.breaks[clock.label]
    case 'minute':
      return text.clock.minute(clock.minute, clock.added)
    case 'countdown': {
      const minutes = Math.floor(clock.seconds / 60)
      const seconds = String(clock.seconds % 60).padStart(2, '0')
      return `${text.clock.quarter(clock.period)} · ${String(minutes).padStart(2, '0')}:${seconds}`
    }
    case 'period':
      if (clock.label === 'shootout') return text.clock.shootout
      if (fate.def.sport === 'chess') return text.clock.game(clock.period)
      return text.clock.set(clock.period)
  }
}

/** The name the feed uses for a side: the club, or the player in tennis and chess. */
const sideName = (fate: Fate, side: ScriptEvent['side']) => fate.teams[side === 'b' ? 1 : 0].name

const playerName = (fate: Fate, event: ScriptEvent, which: 'player' | 'other' = 'player') => {
  const team = fate.teams[event.side === 'b' ? 1 : 0]
  const index = event[which]
  return index === undefined ? team.name : (team.roster[index]?.name ?? team.name)
}

/** The stamp beside a feed line. */
export function eventStamp(event: ScriptEvent, fate: Fate, text: EsportsCopy): string {
  switch (fate.def.sport) {
    case 'football': {
      if (event.period === 5) return text.match.pens
      if (event.minute === undefined) return ''
      const nominal = [45, 90, 105, 120][event.period - 1] ?? 90
      return text.clock.minute(Math.min(event.minute, nominal), Math.max(0, event.minute - nominal))
    }
    case 'basketball': {
      if (event.clock === undefined) return ''
      const label = text.match.periods.basketball[event.period - 1] ?? ''
      return `${label} ${Math.floor(event.clock / 60)}:${String(event.clock % 60).padStart(2, '0')}`
    }
    case 'volleyball':
    case 'tennis':
      return event.inner ? `${event.inner[0]}–${event.inner[1]}` : ''
    case 'chess':
      return event.ply ? `${Math.ceil(event.ply / 2)}${event.ply % 2 === 1 ? '.' : '…'}` : ''
  }
}

export type Tone = 'goal' | 'yellow' | 'red' | 'period' | 'big' | 'plain' | 'muted'

export interface FeedLine {
  stamp: string
  text: string
  tone: Tone
  detail?: string
}

/** One line of play by play. */
export function eventLine(event: ScriptEvent, fate: Fate, text: EsportsCopy): FeedLine {
  const e = text.events
  const stamp = eventStamp(event, fate, text)
  const team = event.side ? sideName(fate, event.side) : ''
  const player = playerName(fate, event)
  const sport = fate.def.sport
  const periodName = text.match.periods[sport][event.period - 1] ?? ''
  const line = (value: string, tone: Tone = 'plain', detail?: string): FeedLine => ({
    stamp,
    text: value,
    tone,
    detail,
  })
  switch (event.kind) {
    case 'start':
      return line(
        event.note === 'armageddon'
          ? e.armageddon
          : sport === 'football'
            ? e.start
            : e.startGeneric,
        'period',
      )
    case 'goal':
      return line(
        event.note === 'penalty' ? e.penaltyGoal(player, team) : e.goal(player, team),
        'goal',
        event.other !== undefined ? e.assist(playerName(fate, event, 'other')) : undefined,
      )
    case 'shot':
      return line(e.shot(player, event.note === 'onTarget'), 'muted')
    case 'corner':
      return line(e.corner(team), 'muted')
    case 'foul':
      return sport === 'basketball'
        ? line(e.foulBasket(player, team, event.note === 'bonus'), 'muted')
        : line(e.foul(player, team), 'muted')
    case 'yellow':
      return line(e.yellow(player, team), 'yellow')
    case 'red':
      return line(
        event.note === 'secondYellow' ? e.secondYellow(player, team) : e.red(player, team),
        'red',
      )
    case 'sub':
      return line(e.sub(playerName(fate, event, 'other'), player, team))
    case 'penalty':
      return line(
        e.penalty(player, team, !event.missed),
        event.missed ? 'muted' : 'goal',
        event.inner ? `${event.inner[0]}–${event.inner[1]}` : undefined,
      )
    case 'score':
      return line(e.score(player, team, event.points ?? 2), event.points === 3 ? 'big' : 'plain')
    case 'foulOut':
      return line(e.foulOut(player, team), 'red')
    case 'timeout':
      return line(e.timeout(team), 'muted')
    case 'point': {
      if (sport === 'tennis') {
        if (event.note === 'ace') return line(e.tennisAce(team), 'big')
        const server = event.tennis?.server
        if (event.note === 'doubleFault' && server)
          return line(e.doubleFault(sideName(fate, server)), 'muted')
        // The point that wins a game resets the call; the game line that follows says the rest.
        const call =
          event.tennis && event.tennis.points.join('') !== '00' ? event.tennis.points.join('–') : ''
        return line(e.tennisPoint(team, call))
      }
      if (event.note === 'ace') return line(e.ace(player, team), 'big')
      if (event.note === 'attack') return line(e.attack(player, team))
      if (event.note === 'block') return line(e.block(player, team))
      return line(e.error(team), 'muted')
    }
    case 'game': {
      const games = event.inner ? `${event.inner[0]}–${event.inner[1]}` : ''
      if (event.note === 'tiebreak') return line(e.tiebreakWon(team, games), 'big')
      if (event.note === 'break') return line(e.breakOfServe(team, games), 'big')
      return line(e.game(team, games))
    }
    case 'move':
      // The stamp already carries the move number; the line is the move itself.
      return line(
        `${event.san ?? ''} · ${team}`,
        event.note === 'mate' ? 'goal' : event.note === 'check' ? 'big' : 'plain',
        event.note === 'check' ? e.check : undefined,
      )
    case 'periodEnd': {
      const score = event.inner
        ? `${event.inner[0]}–${event.inner[1]}`
        : `${event.score[0]}–${event.score[1]}`
      if (sport === 'football') {
        if (event.period === 1) return line(e.halftime, 'period', score)
        if (event.period === 2 && fate.script.periods.length > 2)
          return line(e.extraTime, 'period', score)
        return line(e.periodEnd(periodName), 'period', score)
      }
      if (sport === 'volleyball') return line(e.set(team, score), 'period')
      if (sport === 'tennis') return line(e.tennisSet(team, score), 'period')
      if (sport === 'chess') {
        if (event.note === 'mate') return line(e.mate(team), 'goal')
        if (event.note === 'resign')
          return line(e.resign(sideName(fate, event.side === 'a' ? 'b' : 'a')), 'period')
        if (event.side && (event.note === 'repetition' || event.note === 'agreed')) {
          return line(e.armageddonDraw(team), 'period')
        }
        return line(event.note === 'repetition' ? e.repetition : e.agreed, 'period')
      }
      return line(e.periodEnd(periodName), 'period', score)
    }
    case 'end':
      return line(e.fullTime, 'period', event.side ? e.wins(sideName(fate, event.side)) : e.draw)
  }
}

export interface Banner {
  title: string
  detail: string
  tone: 'goal' | 'red' | 'period' | 'point'
  side?: 'a' | 'b'
}

/** A big moment worth a banner in live mode, or null. */
export function bannerFor(event: ScriptEvent, fate: Fate, text: EsportsCopy): Banner | null {
  if (!event.big) return null
  const b = text.banners
  const team = event.side ? sideName(fate, event.side) : ''
  const score = `${fate.teams[0].tag} ${formatScore(event.score[0])}–${formatScore(event.score[1])} ${fate.teams[1].tag}`
  const sport = fate.def.sport
  if (event.situation) {
    return {
      title: b.situation[event.situation.kind],
      detail: sideName(fate, event.situation.side),
      tone: 'point',
      side: event.situation.side,
    }
  }
  switch (event.kind) {
    case 'goal':
      return {
        title: b.goal,
        detail: `${playerName(fate, event)} · ${score}`,
        tone: 'goal',
        side: event.side,
      }
    case 'red':
      return {
        title: b.red,
        detail: `${playerName(fate, event)} (${team})`,
        tone: 'red',
        side: event.side,
      }
    case 'foulOut':
      return {
        title: b.foulOut,
        detail: `${playerName(fate, event)} (${team})`,
        tone: 'red',
        side: event.side,
      }
    case 'game':
      return {
        title: b.break,
        detail: `${team} · ${event.inner?.join('–') ?? ''}`,
        tone: 'point',
        side: event.side,
      }
    case 'move':
      return { title: b.mate, detail: `${team} · ${event.san}`, tone: 'goal', side: event.side }
    case 'periodEnd': {
      if (sport === 'volleyball' || sport === 'tennis') {
        return {
          title: b.setWon,
          detail: `${team} · ${event.inner?.join('–') ?? ''}`,
          tone: 'period',
          side: event.side,
        }
      }
      if (sport === 'chess') {
        if (event.note === 'mate') return null
        return { title: event.note === 'resign' ? b.resign : b.draw, detail: score, tone: 'period' }
      }
      const title =
        event.period === 2 && sport === 'basketball'
          ? b.halftime
          : sport === 'football'
            ? b.halftime
            : b.periodEnd
      return { title, detail: score, tone: 'period' }
    }
    case 'end':
      return { title: b.fullTime, detail: score, tone: 'period', side: event.side }
  }
  return null
}

/** Whether the sport is scored by sets, so a card shows them. */
export function usesSets(sport: SportId) {
  return sport === 'volleyball' || sport === 'tennis'
}

/** A chess player's name with their title, e.g. "GM Deniz Aksoy". */
export function participantLabel(team: Team) {
  const title = team.roster[0]?.title
  return team.individual && title ? `${title} ${team.name}` : team.name
}

/** Relative luminance of a #rrggbb colour, 0 (black) to 1 (white). */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** A side's colour that shows on white: the primary, unless it is too pale to see. */
export function teamColor(team: Team) {
  const [primary, secondary] = team.colors
  return luminance(primary) > 0.8 ? secondary : primary
}
