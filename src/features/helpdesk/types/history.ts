import type { ActivityField, Ticket, TicketAttachment } from './index'

export type HistoryGroup = 'message' | 'change' | 'sla'
export const HISTORY_FILTERS = ['all', 'message', 'change', 'sla'] as const
export type HistoryFilter = (typeof HISTORY_FILTERS)[number]

export type SlaMilestone =
  | 'firstResponseMet'
  | 'firstResponseBreached'
  | 'resolutionMet'
  | 'resolutionBreached'

/**
 * One moment in a ticket's life. The thread and the activity log are stored apart, because
 * they are written by different actions; the history puts them back on one line together
 * with the SLA deadlines that were met or missed in between.
 */
export interface HistoryEntry {
  id: string
  at: string
  group: HistoryGroup
  kind: 'created' | 'customer' | 'reply' | 'note' | ActivityField | SlaMilestone
  actorName?: string
  from?: string
  to?: string
  /** The message behind a message entry, so the history can point back into the thread. */
  messageId?: string
  body?: string
  attachments?: TicketAttachment[]
  ticketId: number
}

function milestone(
  ticket: Ticket,
  due: string,
  stoppedAt: string | undefined,
  now: number,
  met: SlaMilestone,
  breached: SlaMilestone,
): HistoryEntry | null {
  const base = { group: 'sla' as const, ticketId: ticket.id }
  // Stopped in time is a success at the moment it stopped; late or still running past the
  // deadline is a miss at the deadline itself, which is when it actually went wrong.
  if (stoppedAt && Date.parse(stoppedAt) <= Date.parse(due)) {
    return { ...base, id: `${ticket.id}:${met}`, at: stoppedAt, kind: met }
  }
  if (stoppedAt || Date.parse(due) < now) {
    return { ...base, id: `${ticket.id}:${breached}`, at: due, kind: breached }
  }
  return null
}

/** Everything that happened to a ticket, oldest first. */
export function ticketHistory(ticket: Ticket, now = Date.now()): HistoryEntry[] {
  const messages: HistoryEntry[] = ticket.messages.map((message) => ({
    id: `${ticket.id}:message:${message.id}`,
    at: message.createdAt,
    group: 'message',
    kind: message.kind,
    actorName: message.authorName,
    messageId: message.id,
    body: message.body,
    attachments: message.attachments,
    ticketId: ticket.id,
  }))

  const changes: HistoryEntry[] = ticket.activity.map((activity) => ({
    id: `${ticket.id}:activity:${activity.id}`,
    at: activity.at,
    group: 'change',
    kind: activity.kind,
    actorName: activity.actorName,
    from: activity.from,
    to: activity.to,
    ticketId: ticket.id,
  }))

  // A ticket on hold has its clocks paused, so it has missed nothing yet.
  const paused = ticket.status === 'onHold'
  const sla = [
    milestone(
      ticket,
      ticket.firstResponseDue,
      ticket.firstResponseAt,
      paused ? 0 : now,
      'firstResponseMet',
      'firstResponseBreached',
    ),
    milestone(
      ticket,
      ticket.resolutionDue,
      ticket.resolvedAt,
      paused ? 0 : now,
      'resolutionMet',
      'resolutionBreached',
    ),
  ].filter((entry): entry is HistoryEntry => entry !== null)

  // "Opened" before the first message it came with, when both carry the same instant.
  const order = (entry: HistoryEntry) => (entry.kind === 'created' ? 0 : 1)

  return [...changes, ...messages, ...sla].sort(
    (left, right) => left.at.localeCompare(right.at) || order(left) - order(right),
  )
}

/** The whole queue's history, newest first: what the team has been doing lately. */
export function queueHistory(tickets: Ticket[], now = Date.now(), limit = 30): HistoryEntry[] {
  return tickets
    .flatMap((ticket) => ticketHistory(ticket, now))
    .sort((left, right) => right.at.localeCompare(left.at))
    .slice(0, limit)
}

export function filterHistory(entries: HistoryEntry[], filter: HistoryFilter): HistoryEntry[] {
  return filter === 'all' ? entries : entries.filter((entry) => entry.group === filter)
}

export function historyCounts(entries: HistoryEntry[]): Record<HistoryFilter, number> {
  const counts: Record<HistoryFilter, number> = {
    all: entries.length,
    message: 0,
    change: 0,
    sla: 0,
  }
  for (const entry of entries) counts[entry.group] += 1
  return counts
}

/**
 * Runs of entries that share a local calendar day, in the order given. Keyed by the local
 * date, because "Yesterday" is about the reader's day, not UTC's.
 */
export function groupByDay(entries: HistoryEntry[]): { day: string; entries: HistoryEntry[] }[] {
  const groups: { day: string; entries: HistoryEntry[] }[] = []
  for (const entry of entries) {
    const date = new Date(entry.at)
    const pad = (value: number) => String(value).padStart(2, '0')
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    const last = groups.at(-1)
    if (last?.day === day) last.entries.push(entry)
    else groups.push({ day, entries: [entry] })
  }
  return groups
}
