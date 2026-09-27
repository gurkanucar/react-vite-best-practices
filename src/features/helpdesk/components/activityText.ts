import { agents } from '@/features/helpdesk/data'
import type { HelpdeskCopy } from '@/features/helpdesk/data/helpdeskCopy'
import type { TicketActivity } from '@/features/helpdesk/types'

type Change = Pick<TicketActivity, 'kind' | 'actorName' | 'from' | 'to'>

/** A stored value as a person reads it: the status name, the agent's name, and so on. */
function valueLabel(text: HelpdeskCopy, change: Change, value?: string): string {
  if (!value) return text.nobody
  if (change.kind === 'status') return text.statuses[value as keyof typeof text.statuses]
  if (change.kind === 'priority') return text.priorities[value as keyof typeof text.priorities]
  if (change.kind === 'category') return text.categories[value as keyof typeof text.categories]
  if (change.kind === 'assignee') {
    return agents.find((agent) => agent.id === value)?.name ?? text.nobody
  }
  return value
}

/** One sentence for a property change, shared by the sidebar and the full history. */
export function describeChange(text: HelpdeskCopy, change: Change): string {
  if (change.kind === 'created') return text.activityCreated(change.actorName)
  if (change.kind === 'tags') return text.activityTags(change.actorName)
  // "Changed assignee from nobody to Elif" is how a log talks; a person says who took it.
  if (change.kind === 'assignee' && !change.from && change.to) {
    return text.activityAssigned(change.actorName, valueLabel(text, change, change.to))
  }
  if (change.kind === 'assignee' && !change.to) return text.activityUnassigned(change.actorName)
  return text.activityChanged(
    change.actorName,
    text.fields[change.kind],
    valueLabel(text, change, change.from),
    valueLabel(text, change, change.to),
  )
}
