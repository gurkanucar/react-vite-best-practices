import dayjs from 'dayjs'
import type { CalendarEvent } from '@/features/calendar/types'
import type { Messages } from '@/i18n/messages'

export function eventTitle(messages: Messages, event: CalendarEvent): string {
  return messages.calendar.events[event.titleId as keyof Messages['calendar']['events']]
}

export function eventTimeRange(event: CalendarEvent): string {
  return `${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')}`
}
