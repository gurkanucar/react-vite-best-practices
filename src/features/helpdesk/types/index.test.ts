import { describe, expect, it } from 'vitest'
import {
  activeSla,
  filterHistory,
  formatDuration,
  groupByDay,
  historyCounts,
  matchesFilters,
  nextTicketId,
  queueHistory,
  queueStats,
  slaClocks,
  slaDeadlines,
  sortQueue,
  statusCounts,
  ticketHistory,
  type Contact,
  type Ticket,
} from '@/features/helpdesk/types'

const NOW = Date.parse('2026-09-27T12:00:00.000Z')
const minutesAgo = (minutes: number) => new Date(NOW - minutes * 60_000).toISOString()

function ticket(overrides: Partial<Ticket> & { openedAgo?: number } = {}): Ticket {
  const { openedAgo = 30, ...rest } = overrides
  const createdAt = minutesAgo(openedAgo)
  const priority = rest.priority ?? 'normal'
  return {
    id: 1001,
    subject: 'Printer on fire',
    requesterId: 'c-1',
    status: 'open',
    priority,
    channel: 'email',
    category: 'technical',
    tags: [],
    createdAt,
    updatedAt: createdAt,
    ...slaDeadlines(createdAt, priority),
    messages: [],
    activity: [],
    ...rest,
  }
}

const contacts: Record<string, Contact> = {
  'c-1': { id: 'c-1', name: 'Ada Lovelace', email: 'ada@engines.example', company: 'Engines' },
}

describe('SLA clocks', () => {
  it('sets deadlines from the priority', () => {
    const due = slaDeadlines('2026-09-27T10:00:00.000Z', 'urgent')
    expect(due.firstResponseDue).toBe('2026-09-27T11:00:00.000Z')
    expect(due.resolutionDue).toBe('2026-09-27T14:00:00.000Z')
  })

  it('counts down the first response until an agent replies, then the resolution', () => {
    const waiting = ticket({ priority: 'urgent', openedAgo: 20 })
    expect(activeSla(waiting, NOW)).toMatchObject({ state: 'running', remaining: 40 })

    const answered = ticket({ priority: 'urgent', openedAgo: 90, firstResponseAt: minutesAgo(80) })
    expect(slaClocks(answered, NOW).firstResponse.state).toBe('met')
    expect(activeSla(answered, NOW)).toMatchObject({ state: 'running', remaining: 150 })
  })

  it('reports a breach by how far over it is, and pauses a ticket on hold', () => {
    expect(activeSla(ticket({ priority: 'urgent', openedAgo: 75 }), NOW)).toMatchObject({
      state: 'breached',
      remaining: -15,
    })
    expect(activeSla(ticket({ status: 'onHold', openedAgo: 10 }), NOW)?.state).toBe('paused')
  })

  it('has no running clock once a ticket is resolved', () => {
    expect(activeSla(ticket({ status: 'resolved', resolvedAt: minutesAgo(1) }), NOW)).toBeNull()
  })
})

describe('formatDuration', () => {
  it('shows the two largest units in either language', () => {
    expect(formatDuration(130, 'en')).toBe('2h 10m')
    expect(formatDuration(-35, 'en')).toBe('35m')
    expect(formatDuration(3 * 1440 + 240, 'tr')).toBe('3g 4sa')
    expect(formatDuration(60, 'tr')).toBe('1sa')
  })
})

describe('queue helpers', () => {
  it('searches the number, the subject and the requester', () => {
    const one = ticket()
    const filters = { status: 'all' as const, search: '' }
    expect(matchesFilters(one, { ...filters, search: '#1001' }, contacts)).toBe(true)
    expect(matchesFilters(one, { ...filters, search: 'printer' }, contacts)).toBe(true)
    expect(matchesFilters(one, { ...filters, search: 'engines' }, contacts)).toBe(true)
    expect(matchesFilters(one, { ...filters, search: 'scanner' }, contacts)).toBe(false)
    expect(matchesFilters(one, { ...filters, assignee: 'unassigned' }, contacts)).toBe(true)
    expect(matchesFilters(one, { ...filters, assignee: 'agent-x' }, contacts)).toBe(false)
  })

  it('counts every status, including the ones with nothing in them', () => {
    const counts = statusCounts([ticket(), ticket({ status: 'pending' }), ticket()])
    expect(counts).toMatchObject({ all: 3, open: 2, pending: 1, closed: 0 })
  })

  it('puts the nearest deadline first and finished work last', () => {
    const relaxed = ticket({ id: 1, priority: 'low', openedAgo: 10 })
    const urgent = ticket({ id: 2, priority: 'urgent', openedAgo: 50 })
    const done = ticket({ id: 3, status: 'closed', resolvedAt: minutesAgo(1) })
    expect(sortQueue([done, relaxed, urgent], NOW).map((entry) => entry.id)).toEqual([2, 1, 3])
  })

  it('numbers a new ticket after the highest one', () => {
    expect(nextTicketId([ticket({ id: 1040 }), ticket({ id: 1033 })])).toBe(1041)
    expect(nextTicketId([])).toBe(1001)
  })

  it('summarises the queue', () => {
    const stats = queueStats(
      [
        ticket({ priority: 'urgent', openedAgo: 75 }),
        ticket({ status: 'pending', openedAgo: 60, firstResponseAt: minutesAgo(30) }),
        ticket({ status: 'resolved', resolvedAt: minutesAgo(5) }),
      ],
      NOW,
    )
    expect(stats).toEqual({
      open: 1,
      pending: 1,
      breached: 1,
      resolvedThisWeek: 1,
      averageFirstResponse: 30,
    })
  })
})

describe('ticket history', () => {
  const answered = ticket({
    priority: 'urgent',
    openedAgo: 300,
    firstResponseAt: minutesAgo(270),
    messages: [
      { id: 'm1', kind: 'customer', authorName: 'Ada', body: 'Hot', createdAt: minutesAgo(300) },
      { id: 'm2', kind: 'reply', authorName: 'Elif', body: 'On it', createdAt: minutesAgo(270) },
      {
        id: 'm3',
        kind: 'note',
        authorName: 'Elif',
        body: 'Call facilities',
        createdAt: minutesAgo(260),
      },
    ],
    activity: [
      { id: 'a1', at: minutesAgo(300), actorName: 'Ada', kind: 'created' },
      {
        id: 'a2',
        at: minutesAgo(265),
        actorName: 'Elif',
        kind: 'status',
        from: 'open',
        to: 'pending',
      },
    ],
  })

  it('puts messages, changes and deadlines on one line, oldest first', () => {
    const kinds = ticketHistory(answered, NOW).map((entry) => entry.kind)

    // Opened before the message it came with, although both carry the same instant.
    expect(kinds).toEqual([
      'created',
      'customer',
      'reply',
      'firstResponseMet',
      'status',
      'note',
      'resolutionBreached',
    ])
  })

  it('dates a missed deadline at the deadline, not at whenever it was noticed', () => {
    const late = ticketHistory(answered, NOW).find((entry) => entry.kind === 'resolutionBreached')
    expect(late?.at).toBe(answered.resolutionDue)
  })

  it('records nothing for a deadline that is still ahead, or paused on hold', () => {
    const fresh = ticket({ priority: 'low', openedAgo: 10 })
    expect(ticketHistory(fresh, NOW).filter((entry) => entry.group === 'sla')).toEqual([])

    const onHold = ticket({ priority: 'urgent', openedAgo: 600, status: 'onHold' })
    expect(ticketHistory(onHold, NOW).filter((entry) => entry.group === 'sla')).toEqual([])
  })

  it('counts and filters entries by kind', () => {
    const history = ticketHistory(answered, NOW)
    expect(historyCounts(history)).toEqual({ all: 7, message: 3, change: 2, sla: 2 })
    expect(filterHistory(history, 'message').map((entry) => entry.messageId)).toEqual([
      'm1',
      'm2',
      'm3',
    ])
  })

  it('groups entries by local day, keeping their order', () => {
    const days = groupByDay([
      { ...ticketHistory(answered, NOW)[0]!, at: '2026-09-25T09:00:00' },
      { ...ticketHistory(answered, NOW)[1]!, at: '2026-09-25T17:00:00' },
      { ...ticketHistory(answered, NOW)[2]!, at: '2026-09-26T08:00:00' },
    ])
    expect(days.map((group) => [group.day, group.entries.length])).toEqual([
      ['2026-09-25', 2],
      ['2026-09-26', 1],
    ])
  })

  it('lists the whole queue newest first, up to a limit', () => {
    const other = ticket({
      id: 1002,
      openedAgo: 5,
      activity: [{ id: 'b1', at: minutesAgo(5), actorName: 'Ada', kind: 'created' }],
    })
    const feed = queueHistory([answered, other], NOW, 3)
    expect(feed).toHaveLength(3)
    expect(feed[0]?.ticketId).toBe(1002)
    expect(feed.map((entry) => entry.at)).toEqual(
      [...feed.map((entry) => entry.at)].sort().reverse(),
    )
  })
})
