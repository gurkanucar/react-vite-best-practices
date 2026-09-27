import dayjs from 'dayjs'
import type { GlobalToken } from 'antd'
import type { TodoPriority } from '@/features/todos/types'
import type { Messages } from '@/i18n/messages'

/** A due day as a person says it: "Today", "Tomorrow", or the date, with the year only when it differs. */
export function dueLabel(dueDate: string, today: string, messages: Messages): string {
  const days = dayjs(dueDate).diff(dayjs(today), 'day')
  if (days === 0) return messages.todos.dueLabels.today
  if (days === 1) return messages.todos.dueLabels.tomorrow
  if (days === -1) return messages.todos.dueLabels.yesterday

  const date = dayjs(dueDate)
  return date.format(date.year() === dayjs(today).year() ? 'D MMM' : 'D MMM YYYY')
}

export function priorityColor(priority: TodoPriority, token: GlobalToken): string {
  return {
    urgent: token.colorError,
    high: token.colorWarning,
    medium: token.colorPrimary,
    low: token.colorTextQuaternary,
  }[priority]
}

/** The antd preset a priority tag uses, so the row and the flag agree on the colour. */
export const PRIORITY_TAG_COLOR: Record<TodoPriority, string> = {
  urgent: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'default',
}
