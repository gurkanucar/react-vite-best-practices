import {
  CONF_DAYS,
  CONF_FORMATS,
  CONF_LEVELS,
  CONF_TRACKS,
  confSessions,
  findSession,
  findSpeaker,
  ISTANBUL_OFFSET_MINUTES,
  type ConfFormat,
  type ConfHallId,
  type ConfLevel,
  type ConfSession,
  type ConfTrack,
} from '@/features/showcases/data/confData'

/** `HH:mm` → minutes after midnight. */
export function toMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function duration(session: ConfSession) {
  return toMinutes(session.end) - toMinutes(session.start)
}

/** The instant an Istanbul wall-clock time on a conference day happens, in epoch ms. */
export function instantOf(day: number, time: string) {
  const date = CONF_DAYS[day]?.date ?? CONF_DAYS[0]!.date
  const [year = 0, month = 1, dayOfMonth = 1] = date.split('-').map(Number)
  return Date.UTC(year, month - 1, dayOfMonth, 0, toMinutes(time) - ISTANBUL_OFFSET_MINUTES)
}

export const sessionStart = (session: ConfSession) => instantOf(session.day, session.start)
export const sessionEnd = (session: ConfSession) => instantOf(session.day, session.end)

/** When the doors open on the first day. */
export const CONF_STARTS_AT = instantOf(0, '09:30')
export const CONF_ENDS_AT = instantOf(CONF_DAYS.length - 1, '17:15')

/** A break is on everyone's schedule already; it is never starred or exported alone. */
export const isStarrable = (session: ConfSession) => session.format !== 'break'

/** Grid rows are five minutes each. */
export const SLOT_MINUTES = 5

export interface GridItem {
  session: ConfSession
  /** 1-based CSS grid lines, counting the header row. */
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
}

export interface DayLayout {
  halls: ConfHallId[]
  /** Minutes after midnight of the first row. */
  startsAt: number
  rows: number
  items: GridItem[]
  /** Half-hour marks for the time column. */
  marks: { label: string; row: number }[]
}

const pad = (value: number) => String(value).padStart(2, '0')
const clock = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

/**
 * Where each session of a day sits on the timetable: halls are columns after the time column,
 * five-minute rows after the header row, and a session for `all` halls spans every column.
 */
export function dayLayout(day: number, sessions: ConfSession[] = confSessions): DayLayout {
  const halls = CONF_DAYS[day]?.halls ?? []
  const ofDay = sessions.filter((session) => session.day === day)
  const first = Math.min(...ofDay.map((session) => toMinutes(session.start)))
  const last = Math.max(...ofDay.map((session) => toMinutes(session.end)))
  const startsAt = Math.floor(first / 30) * 30
  const endsAt = Math.ceil(last / 30) * 30
  const rows = (endsAt - startsAt) / SLOT_MINUTES
  const row = (time: string) => (toMinutes(time) - startsAt) / SLOT_MINUTES + 2

  const items = ofDay.map((session) => {
    const column = session.hall === 'all' ? -1 : halls.indexOf(session.hall)
    return {
      session,
      rowStart: row(session.start),
      rowEnd: row(session.end),
      columnStart: column === -1 ? 2 : column + 2,
      columnEnd: column === -1 ? halls.length + 2 : column + 3,
    }
  })

  const marks = []
  for (let minutes = startsAt; minutes < endsAt; minutes += 30) {
    marks.push({ label: clock(minutes), row: (minutes - startsAt) / SLOT_MINUTES + 2 })
  }

  return { halls, startsAt, rows, items, marks }
}

export function overlaps(a: ConfSession, b: ConfSession) {
  return (
    a.day === b.day &&
    toMinutes(a.start) < toMinutes(b.end) &&
    toMinutes(b.start) < toMinutes(a.end)
  )
}

/** Every pair of sessions in the list that happen at the same time, each pair once. */
export function findConflicts(sessions: ConfSession[]) {
  const pairs: [ConfSession, ConfSession][] = []
  sessions.forEach((a, index) => {
    sessions.slice(index + 1).forEach((b) => {
      if (overlaps(a, b)) pairs.push([a, b])
    })
  })
  return pairs
}

/** The ids in the list that clash with at least one other. */
export function conflictingIds(sessions: ConfSession[]) {
  return new Set(findConflicts(sessions).flatMap(([a, b]) => [a.id, b.id]))
}

export function sortSessions(sessions: ConfSession[]) {
  return [...sessions].sort(
    (a, b) => a.day - b.day || a.start.localeCompare(b.start) || a.end.localeCompare(b.end),
  )
}

/** Ids that name a real, starrable session, without repeats, in schedule order. */
export function cleanAgenda(ids: readonly string[]) {
  const sessions = [...new Set(ids)]
    .map((id) => findSession(id))
    .filter((session): session is ConfSession => session !== undefined && isStarrable(session))
  return sortSessions(sessions).map((session) => session.id)
}

export const agendaParam = (ids: readonly string[]) => cleanAgenda(ids).join(',')

export function parseAgendaParam(value: string | null) {
  return value ? cleanAgenda(value.split(',').map((id) => id.trim())) : []
}

export interface ScheduleFilters {
  query: string
  tracks: ConfTrack[]
  levels: ConfLevel[]
  formats: Exclude<ConfFormat, 'break'>[]
}

export const emptyFilters: ScheduleFilters = { query: '', tracks: [], levels: [], formats: [] }

const pick = <T extends string>(value: string | null, allowed: readonly T[]) =>
  (value ?? '')
    .split(',')
    .filter((item): item is T => (allowed as readonly string[]).includes(item))

export function parseFilters(params: URLSearchParams): ScheduleFilters {
  return {
    query: params.get('q') ?? '',
    tracks: pick(params.get('track'), CONF_TRACKS),
    levels: pick(params.get('level'), CONF_LEVELS),
    formats: pick(params.get('format'), CONF_FORMATS),
  }
}

export const hasFilters = (filters: ScheduleFilters) =>
  filters.query.trim() !== '' ||
  filters.tracks.length > 0 ||
  filters.levels.length > 0 ||
  filters.formats.length > 0

const fold = (text: string) =>
  text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')

/**
 * Whether a session passes the filters. Breaks always pass, so the day keeps its shape.
 * Search looks at both languages' titles and the speakers' names.
 */
export function matchesFilters(session: ConfSession, filters: ScheduleFilters) {
  if (session.format === 'break') return true
  if (filters.tracks.length > 0 && (!session.track || !filters.tracks.includes(session.track))) {
    return false
  }
  if (filters.levels.length > 0 && (!session.level || !filters.levels.includes(session.level))) {
    return false
  }
  if (filters.formats.length > 0 && !filters.formats.includes(session.format)) return false

  const words = fold(filters.query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = fold(
    [
      session.title.en,
      session.title.tr,
      ...session.speakerIds.map((id) => findSpeaker(id)?.name ?? ''),
    ].join(' '),
  )
  return words.every((word) => haystack.includes(word))
}

export type LiveState =
  | { phase: 'before'; startsIn: number }
  | { phase: 'during'; day: number; now: ConfSession[]; next: ConfSession[] }
  | { phase: 'after' }

/**
 * What is on at a moment: before the event, the time to go; during it, the sessions running
 * and the next ones to start that day; afterwards, nothing.
 */
export function liveState(now: number, sessions: ConfSession[] = confSessions): LiveState {
  if (now < CONF_STARTS_AT) return { phase: 'before', startsIn: CONF_STARTS_AT - now }
  if (now >= CONF_ENDS_AT) return { phase: 'after' }

  const running = sessions.filter((s) => sessionStart(s) <= now && now < sessionEnd(s))
  const upcoming = sortSessions(sessions.filter((s) => sessionStart(s) > now))
  const nextStart = upcoming[0] ? sessionStart(upcoming[0]) : undefined
  const next = upcoming.filter((s) => sessionStart(s) === nextStart)
  const day =
    running[0]?.day ??
    CONF_DAYS.findLast((entry) => instantOf(entry.index, '00:00') <= now)?.index ??
    0

  return { phase: 'during', day, now: sortSessions(running), next }
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function countdownParts(target: number, now: number): Countdown {
  const left = Math.max(0, Math.floor((target - now) / 1000))
  return {
    days: Math.floor(left / 86_400),
    hours: Math.floor((left % 86_400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
    done: left === 0,
  }
}

/** `?now=2026-11-19T11:30` for a demo of the live view; read as Istanbul time. */
export function parseNowOverride(value: string | null) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!match) return undefined
  const [, year, month, day, hours, minutes] = match.map(Number)
  const instant = Date.UTC(year!, month! - 1, day!, hours!, minutes! - ISTANBUL_OFFSET_MINUTES)
  return Number.isNaN(instant) ? undefined : instant
}
