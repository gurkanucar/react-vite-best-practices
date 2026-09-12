export type CalendarView = 'month' | 'week' | 'day'

export const CALENDAR_VIEWS: CalendarView[] = ['month', 'week', 'day']

export type EventCategory = 'meeting' | 'focus' | 'review' | 'release' | 'personal'

export interface CalendarEvent {
  id: string
  /** A translation key under `calendar.events`. */
  titleId: string
  category: EventCategory
  /**
   * Local ISO instants, `YYYY-MM-DDTHH:mm`. An all-day event may end on a later date than
   * it starts on; a timed one may not.
   */
  start: string
  end: string
  location?: string
  attendees: string[]
  allDay?: boolean
}

/** The date part of a local ISO stamp, which is also a sortable, comparable string. */
export function isoDate(stamp: string): string {
  return stamp.slice(0, 10)
}

/**
 * Whether an event belongs on a given day. A timed event belongs to the one day it starts
 * on; an all-day event belongs to every day from its start date through its end date, which
 * is what lets one span a week. Comparing `YYYY-MM-DD` strings is exact and ordered, so no
 * date library is needed to answer it.
 */
export function occursOn(event: CalendarEvent, day: string): boolean {
  if (!event.allDay) return isoDate(event.start) === day

  return day >= isoDate(event.start) && day <= isoDate(event.end)
}

export interface AllDayBand {
  event: CalendarEvent
  /** Index into the visible days where the band starts, and how many it covers. */
  from: number
  span: number
  /** Row within the all-day area; bands that overlap get their own. */
  lane: number
}

/**
 * Places all-day events across a set of visible days. An event that started before the
 * first visible day is clipped to it rather than dropped, which is what keeps the middle
 * of a week-long event visible in a week that does not contain its start.
 */
export function layoutAllDay(events: CalendarEvent[], days: string[]): AllDayBand[] {
  const laneEnds: number[] = []

  return events
    .filter((event) => event.allDay && days.some((day) => occursOn(event, day)))
    .sort((left, right) => left.start.localeCompare(right.start))
    .map((event) => {
      const from = days.findIndex((day) => occursOn(event, day))
      const lastIndex = days.findLastIndex((day) => occursOn(event, day))
      const span = lastIndex - from + 1
      const lane = laneEnds.findIndex((end) => end <= from)
      const index = lane === -1 ? laneEnds.length : lane

      laneEnds[index] = from + span

      return { event, from, span, lane: index }
    })
}

/** How many days an all-day event covers, used to size it across a week. */
export function spanInDays(event: CalendarEvent): number {
  const start = Date.parse(`${isoDate(event.start)}T00:00:00`)
  const end = Date.parse(`${isoDate(event.end)}T00:00:00`)

  return Math.round((end - start) / 86_400_000) + 1
}

/** An event placed in a day column: where it sits and how wide it is when it overlaps. */
export interface PositionedEvent {
  event: CalendarEvent
  /** Minutes from midnight. */
  startMinutes: number
  endMinutes: number
  /** 0-based lane within its overlapping cluster, and how many lanes that cluster needs. */
  lane: number
  lanes: number
}

/** The shortest block still readable; a 15-minute event would otherwise be a hairline. */
export const MIN_EVENT_MINUTES = 30

/** Hour rows are this tall, which is what turns minutes into pixels. */
export const HOUR_HEIGHT = 52

export const categoryTokens: Record<EventCategory, string> = {
  meeting: 'var(--ant-color-primary)',
  focus: 'var(--ant-purple-6)',
  review: 'var(--ant-cyan-6)',
  release: 'var(--ant-gold-6)',
  personal: 'var(--ant-magenta-6)',
}

export function minutesFromMidnight(isoLocal: string): number {
  const [, time = '00:00'] = isoLocal.split('T')
  const [hours = '0', minutes = '0'] = time.split(':')

  return Number(hours) * 60 + Number(minutes)
}

/**
 * Two events at the same hour have to share the column's width. The rule is the one every
 * calendar uses:
 *
 * 1. Sort by start time.
 * 2. Collect events into clusters, where a cluster is a run that overlaps transitively —
 *    A overlaps B and B overlaps C puts all three in one cluster even if A and C do not
 *    touch, because otherwise B would have nowhere to go.
 * 3. Inside a cluster, place each event in the first lane whose previous event has already
 *    ended. The number of lanes a cluster needs is what each event divides its width by.
 */
export function layoutDay(events: CalendarEvent[]): PositionedEvent[] {
  const timed = events
    .filter((event) => !event.allDay)
    .map((event) => {
      const startMinutes = minutesFromMidnight(event.start)
      const endMinutes = Math.max(minutesFromMidnight(event.end), startMinutes + MIN_EVENT_MINUTES)

      return { event, startMinutes, endMinutes }
    })
    .sort((left, right) => left.startMinutes - right.startMinutes)

  const positioned: PositionedEvent[] = []
  let cluster: typeof timed = []
  let clusterEnd = -1

  const flush = () => {
    if (cluster.length === 0) return

    const laneEnds: number[] = []
    const placed = cluster.map((entry) => {
      const lane = laneEnds.findIndex((end) => end <= entry.startMinutes)
      const index = lane === -1 ? laneEnds.length : lane

      laneEnds[index] = entry.endMinutes

      return { ...entry, lane: index }
    })

    for (const entry of placed) {
      positioned.push({ ...entry, lanes: laneEnds.length })
    }

    cluster = []
    clusterEnd = -1
  }

  for (const entry of timed) {
    if (cluster.length > 0 && entry.startMinutes >= clusterEnd) {
      flush()
    }

    cluster.push(entry)
    clusterEnd = Math.max(clusterEnd, entry.endMinutes)
  }

  flush()

  return positioned
}
