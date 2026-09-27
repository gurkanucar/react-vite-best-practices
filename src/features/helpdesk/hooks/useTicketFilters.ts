import { useSearchParams } from 'react-router'
import {
  NO_FILTERS,
  TICKET_CHANNELS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type StatusFilter,
  type TicketChannel,
  type TicketFilters,
  type TicketPriority,
} from '@/features/helpdesk/types'

function oneOf<T extends string>(values: readonly T[], value: string | null): T | undefined {
  return value !== null && (values as readonly string[]).includes(value) ? (value as T) : undefined
}

/**
 * The queue's filters live in the address bar, so "urgent tickets assigned to Marco" is a
 * link a teammate can open. Values that are not valid options are dropped, not trusted.
 */
export function useTicketFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: TicketFilters = {
    status: oneOf<StatusFilter>(['all', ...TICKET_STATUSES], searchParams.get('status')) ?? 'all',
    search: searchParams.get('q') ?? '',
    priority: oneOf<TicketPriority>(TICKET_PRIORITIES, searchParams.get('priority')),
    assignee: searchParams.get('assignee') ?? undefined,
    channel: oneOf<TicketChannel>(TICKET_CHANNELS, searchParams.get('channel')),
  }

  const setFilters = (changes: Partial<TicketFilters>) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        const next = { ...filters, ...changes }
        const entries: [string, string | undefined][] = [
          ['status', next.status === 'all' ? undefined : next.status],
          ['q', next.search || undefined],
          ['priority', next.priority],
          ['assignee', next.assignee],
          ['channel', next.channel],
        ]
        for (const [key, value] of entries) {
          if (value) params.set(key, value)
          else params.delete(key)
        }
        return params
      },
      { replace: true },
    )
  }

  return { filters, setFilters, clearFilters: () => setFilters(NO_FILTERS) }
}
