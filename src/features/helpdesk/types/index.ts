import type { Language } from '@/store/preferences-store'

export const TICKET_STATUSES = ['open', 'pending', 'onHold', 'resolved', 'closed'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const TICKET_PRIORITIES = ['urgent', 'high', 'normal', 'low'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export const TICKET_CHANNELS = ['email', 'phone', 'chat', 'portal'] as const
export type TicketChannel = (typeof TICKET_CHANNELS)[number]

export const TICKET_CATEGORIES = [
  'technical',
  'billing',
  'account',
  'featureRequest',
  'other',
] as const
export type TicketCategory = (typeof TICKET_CATEGORIES)[number]

export interface Contact {
  id: string
  name: string
  /** On the reserved `.example` domain, so nothing here reaches a real inbox. */
  email: string
  company: string
}

export interface Agent {
  id: string
  name: string
  color: string
}

export interface TicketAttachment {
  name: string
  size: string
}

/**
 * One entry in a ticket's thread. A note is written by an agent like a reply, but only the
 * team sees it, which is why it is its own kind rather than a flag on a reply.
 */
export interface TicketMessage {
  id: string
  kind: 'customer' | 'reply' | 'note'
  authorName: string
  body: string
  createdAt: string
  attachments?: TicketAttachment[]
}

export type ActivityField = 'status' | 'priority' | 'assignee' | 'category' | 'tags'

/** A change to a ticket's properties, kept as raw values so it reads in either language. */
export interface TicketActivity {
  id: string
  at: string
  actorName: string
  kind: 'created' | ActivityField
  from?: string
  to?: string
}

export interface Ticket {
  /** A running number, shown as `#1042`: what a customer quotes on the phone. */
  id: number
  subject: string
  requesterId: string
  status: TicketStatus
  priority: TicketPriority
  channel: TicketChannel
  category: TicketCategory
  assigneeId?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  /** When an agent first answered; the first-response clock stops here. */
  firstResponseAt?: string
  resolvedAt?: string
  firstResponseDue: string
  resolutionDue: string
  messages: TicketMessage[]
  activity: TicketActivity[]
}

const MINUTE = 60_000
const HOUR = 60
const DAY = 24 * HOUR

/**
 * How long each priority may wait, in minutes: a first answer, then a resolution. Calendar
 * time rather than business hours, which keeps the demo's countdowns easy to check.
 */
export const SLA_TARGETS: Record<TicketPriority, { firstResponse: number; resolution: number }> = {
  urgent: { firstResponse: 1 * HOUR, resolution: 4 * HOUR },
  high: { firstResponse: 4 * HOUR, resolution: 1 * DAY },
  normal: { firstResponse: 8 * HOUR, resolution: 3 * DAY },
  low: { firstResponse: 1 * DAY, resolution: 5 * DAY },
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(Date.parse(iso) + minutes * MINUTE).toISOString()
}

export function slaDeadlines(
  createdAt: string,
  priority: TicketPriority,
): Pick<Ticket, 'firstResponseDue' | 'resolutionDue'> {
  const target = SLA_TARGETS[priority]
  return {
    firstResponseDue: addMinutes(createdAt, target.firstResponse),
    resolutionDue: addMinutes(createdAt, target.resolution),
  }
}

export function isUnresolved(status: TicketStatus): boolean {
  return status !== 'resolved' && status !== 'closed'
}

export interface SlaClock {
  due: string
  /** Minutes until the deadline; negative once it has passed. */
  remaining: number
  /** Share of the allowed time used, 0–100, for a progress bar. */
  used: number
  state: 'met' | 'running' | 'breached' | 'paused'
}

function clock(start: string, due: string, stoppedAt: string | undefined, now: number): SlaClock {
  const end = stoppedAt ? Date.parse(stoppedAt) : now
  const total = Math.max(Date.parse(due) - Date.parse(start), 1)
  const remaining = Math.round((Date.parse(due) - end) / MINUTE)
  const used = Math.min(Math.max(((end - Date.parse(start)) / total) * 100, 0), 100)
  const state = stoppedAt
    ? remaining >= 0
      ? 'met'
      : 'breached'
    : remaining < 0
      ? 'breached'
      : 'running'

  return { due, remaining, used, state }
}

/**
 * Both clocks of a ticket. The first-response clock stops at the first agent reply, the
 * resolution clock when the ticket is resolved. A ticket on hold is waiting on someone
 * outside the team, so its running clock is shown as paused rather than counting down.
 */
export function slaClocks(ticket: Ticket, now = Date.now()) {
  const firstResponse = clock(
    ticket.createdAt,
    ticket.firstResponseDue,
    ticket.firstResponseAt,
    now,
  )
  const resolution = clock(ticket.createdAt, ticket.resolutionDue, ticket.resolvedAt, now)
  const pause = (value: SlaClock): SlaClock =>
    ticket.status === 'onHold' && value.state === 'running' ? { ...value, state: 'paused' } : value

  return { firstResponse: pause(firstResponse), resolution: pause(resolution) }
}

/** The one clock the list shows: whichever deadline the team is working against now. */
export function activeSla(ticket: Ticket, now = Date.now()): SlaClock | null {
  if (!isUnresolved(ticket.status)) return null
  const { firstResponse, resolution } = slaClocks(ticket, now)
  return ticket.firstResponseAt ? resolution : firstResponse
}

export function isBreached(ticket: Ticket, now = Date.now()): boolean {
  return activeSla(ticket, now)?.state === 'breached'
}

const units = {
  en: { d: 'd', h: 'h', m: 'm' },
  tr: { d: 'g', h: 'sa', m: 'dk' },
}

/** `2h 10m`, `3d 4h`, `45m`: the two largest units, which is all a countdown needs. */
export function formatDuration(minutes: number, language: Language): string {
  const unit = units[language]
  const total = Math.abs(Math.round(minutes))
  const days = Math.floor(total / DAY)
  const hours = Math.floor((total % DAY) / HOUR)
  const rest = total % HOUR

  if (days > 0) return hours > 0 ? `${days}${unit.d} ${hours}${unit.h}` : `${days}${unit.d}`
  if (hours > 0) return rest > 0 ? `${hours}${unit.h} ${rest}${unit.m}` : `${hours}${unit.h}`
  return `${rest}${unit.m}`
}

export function minutesSince(iso: string, now = Date.now()): number {
  return Math.max(Math.round((now - Date.parse(iso)) / MINUTE), 0)
}

export type StatusFilter = 'all' | TicketStatus

export interface TicketFilters {
  status: StatusFilter
  search: string
  priority?: TicketPriority
  /** An agent id, or `unassigned`. */
  assignee?: string
  channel?: TicketChannel
}

export const NO_FILTERS: TicketFilters = { status: 'all', search: '' }

/**
 * Search reads the number, the subject and the requester, because those are the three
 * things a person has in hand when they go looking for a ticket.
 */
export function matchesFilters(
  ticket: Ticket,
  filters: TicketFilters,
  contacts: Record<string, Contact>,
): boolean {
  if (filters.status !== 'all' && ticket.status !== filters.status) return false
  if (filters.priority && ticket.priority !== filters.priority) return false
  if (filters.channel && ticket.channel !== filters.channel) return false
  if (filters.assignee === 'unassigned' && ticket.assigneeId) return false
  if (
    filters.assignee &&
    filters.assignee !== 'unassigned' &&
    ticket.assigneeId !== filters.assignee
  )
    return false

  const query = filters.search.trim().toLocaleLowerCase()
  if (!query) return true

  const requester = contacts[ticket.requesterId]
  return [
    `#${ticket.id}`,
    String(ticket.id),
    ticket.subject,
    requester?.name ?? '',
    requester?.email ?? '',
    requester?.company ?? '',
  ].some((value) => value.toLocaleLowerCase().includes(query))
}

/** Counts per status for the tabs, computed before the status filter so every tab has one. */
export function statusCounts(tickets: Ticket[]): Record<StatusFilter, number> {
  const counts = { all: tickets.length } as Record<StatusFilter, number>
  for (const status of TICKET_STATUSES) counts[status] = 0
  for (const ticket of tickets) counts[ticket.status] += 1
  return counts
}

const priorityRank: Record<TicketPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 }

export function comparePriority(left: TicketPriority, right: TicketPriority): number {
  return priorityRank[left] - priorityRank[right]
}

/**
 * The queue's default order: unresolved work first, the most urgent deadline on top, and
 * finished tickets after, newest first.
 */
export function sortQueue(tickets: Ticket[], now = Date.now()): Ticket[] {
  return [...tickets].sort((left, right) => {
    const leftSla = activeSla(left, now)
    const rightSla = activeSla(right, now)
    if (leftSla && !rightSla) return -1
    if (!leftSla && rightSla) return 1
    if (leftSla && rightSla && leftSla.remaining !== rightSla.remaining) {
      return leftSla.remaining - rightSla.remaining
    }
    return right.updatedAt.localeCompare(left.updatedAt)
  })
}

export function nextTicketId(tickets: Ticket[]): number {
  return tickets.reduce((max, ticket) => Math.max(max, ticket.id), 1000) + 1
}

export interface QueueStats {
  open: number
  pending: number
  breached: number
  resolvedThisWeek: number
  /** Minutes, over tickets that have been answered; `null` when none has. */
  averageFirstResponse: number | null
}

export function queueStats(tickets: Ticket[], now = Date.now()): QueueStats {
  const weekAgo = now - 7 * DAY * MINUTE
  const answered = tickets.filter((ticket) => ticket.firstResponseAt)
  const waits = answered.map(
    (ticket) => (Date.parse(ticket.firstResponseAt!) - Date.parse(ticket.createdAt)) / MINUTE,
  )

  return {
    open: tickets.filter((ticket) => ticket.status === 'open').length,
    pending: tickets.filter((ticket) => ticket.status === 'pending').length,
    breached: tickets.filter((ticket) => isBreached(ticket, now)).length,
    resolvedThisWeek: tickets.filter(
      (ticket) => ticket.resolvedAt && Date.parse(ticket.resolvedAt) >= weekAgo,
    ).length,
    averageFirstResponse:
      waits.length > 0
        ? Math.round(waits.reduce((sum, wait) => sum + wait, 0) / waits.length)
        : null,
  }
}

/** Initials for an avatar: the first letter of the first and last names. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''
  return `${first}${last}`.toLocaleUpperCase()
}

export * from './history'
