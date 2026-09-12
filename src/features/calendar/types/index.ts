export type CalendarView = 'month' | 'week' | 'day'

export const CALENDAR_VIEWS: CalendarView[] = ['month', 'week', 'day']

export type EventCategory = 'meeting' | 'focus' | 'review' | 'release' | 'personal'

export interface CalendarEvent {
  id: string
  /** A translation key under `calendar.events`. */
  titleId: string
  category: EventCategory
  /** Local ISO instants, `YYYY-MM-DDTHH:mm`. */
  start: string
  end: string
  location?: string
  attendees: string[]
  allDay?: boolean
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
