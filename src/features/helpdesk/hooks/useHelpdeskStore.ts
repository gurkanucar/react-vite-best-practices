import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { agents, createSeedTickets, CURRENT_AGENT_ID, seedContacts } from '@/features/helpdesk/data'
import {
  isUnresolved,
  nextTicketId,
  slaDeadlines,
  type ActivityField,
  type Contact,
  type Ticket,
  type TicketActivity,
  type TicketAttachment,
  type TicketCategory,
  type TicketChannel,
  type TicketPriority,
  type TicketStatus,
} from '@/features/helpdesk/types'
import { usePreferencesStore } from '@/store/preferences-store'

export type TicketChanges = Partial<
  Pick<Ticket, 'status' | 'priority' | 'assigneeId' | 'category' | 'tags'>
>

export interface NewTicketInput {
  /** An existing contact's id, or the details of someone writing in for the first time. */
  requester: { id: string } | Omit<Contact, 'id'>
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  channel: TicketChannel
  assigneeId?: string
  tags: string[]
  attachments: TicketAttachment[]
}

interface HelpdeskState {
  tickets: Ticket[]
  contacts: Contact[]
}

interface HelpdeskStore extends HelpdeskState {
  createTicket: (input: NewTicketInput) => Ticket
  /** A reply the customer sees, or a note only the team sees; either may move the status. */
  addMessage: (id: number, kind: 'reply' | 'note', body: string, status?: TicketStatus) => void
  updateTicket: (id: number, changes: TicketChanges) => void
  bulkUpdate: (ids: number[], changes: TicketChanges) => void
  reset: () => void
}

export const helpdeskStorageKey = 'rvbp-helpdesk'

let sequence = 0
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(sequence += 1)}`

const currentAgentName = () => agents.find((agent) => agent.id === CURRENT_AGENT_ID)!.name

export function createInitialHelpdeskState(): HelpdeskState {
  return {
    tickets: createSeedTickets(usePreferencesStore.getState().language),
    contacts: seedContacts,
  }
}

/**
 * Applies property changes and writes one activity entry per field that actually changed,
 * so the timeline never shows "changed status from Open to Open". Resolving stamps the
 * resolution clock; reopening clears the stamp so the clock runs again.
 */
function applyChanges(ticket: Ticket, changes: TicketChanges, now: string): Ticket {
  const activity: TicketActivity[] = []
  const fields: ActivityField[] = ['status', 'priority', 'assignee', 'category', 'tags']

  for (const field of fields) {
    const key = field === 'assignee' ? 'assigneeId' : field
    if (!(key in changes)) continue
    const before = ticket[key]
    const after = changes[key]
    const same = Array.isArray(before)
      ? JSON.stringify(before) === JSON.stringify(after)
      : before === after
    if (same) continue

    activity.push({
      id: newId('a'),
      at: now,
      actorName: currentAgentName(),
      kind: field,
      from: Array.isArray(before) ? undefined : (before ?? ''),
      to: Array.isArray(after) ? undefined : ((after as string | undefined) ?? ''),
    })
  }

  if (activity.length === 0) return ticket

  const next: Ticket = {
    ...ticket,
    ...changes,
    updatedAt: now,
    activity: [...ticket.activity, ...activity],
  }
  if (changes.status && changes.status !== ticket.status) {
    next.resolvedAt = isUnresolved(changes.status) ? undefined : (ticket.resolvedAt ?? now)
  }
  return next
}

/**
 * The helpdesk has no API behind it, so the queue lives in the browser like the task list
 * does: persisted to local storage, so a reply written before a reload is still there after.
 */
export const useHelpdeskStore = create<HelpdeskStore>()(
  persist(
    (set, get) => ({
      ...createInitialHelpdeskState(),
      createTicket: (input) => {
        const now = new Date().toISOString()
        const { tickets, contacts } = get()
        let requester: Contact | undefined
        let nextContacts = contacts

        if ('id' in input.requester) {
          requester = contacts.find(
            (contact) => contact.id === (input.requester as { id: string }).id,
          )
        } else {
          // Someone who has written before is matched by address rather than added twice.
          const email = input.requester.email.trim().toLocaleLowerCase()
          requester = contacts.find((contact) => contact.email.toLocaleLowerCase() === email)
          if (!requester) {
            requester = { ...input.requester, email, id: newId('c') }
            nextContacts = [...contacts, requester]
          }
        }

        const ticket: Ticket = {
          id: nextTicketId(tickets),
          subject: input.subject.trim(),
          requesterId: requester!.id,
          status: 'open',
          priority: input.priority,
          channel: input.channel,
          category: input.category,
          assigneeId: input.assigneeId,
          tags: input.tags,
          createdAt: now,
          updatedAt: now,
          ...slaDeadlines(now, input.priority),
          messages: [
            {
              id: newId('m'),
              kind: 'customer',
              authorName: requester!.name,
              body: input.description.trim(),
              createdAt: now,
              attachments: input.attachments.length > 0 ? input.attachments : undefined,
            },
          ],
          activity: [{ id: newId('a'), at: now, actorName: currentAgentName(), kind: 'created' }],
        }

        set({ tickets: [ticket, ...tickets], contacts: nextContacts })
        return ticket
      },
      addMessage: (id, kind, body, status) => {
        const now = new Date().toISOString()
        set({
          tickets: get().tickets.map((ticket) => {
            if (ticket.id !== id) return ticket
            const withMessage: Ticket = {
              ...ticket,
              updatedAt: now,
              // Only an answer the customer can see stops the first-response clock.
              firstResponseAt: ticket.firstResponseAt ?? (kind === 'reply' ? now : undefined),
              messages: [
                ...ticket.messages,
                {
                  id: newId('m'),
                  kind,
                  authorName: currentAgentName(),
                  body: body.trim(),
                  createdAt: now,
                },
              ],
            }
            return status ? applyChanges(withMessage, { status }, now) : withMessage
          }),
        })
      },
      updateTicket: (id, changes) => {
        const now = new Date().toISOString()
        set({
          tickets: get().tickets.map((ticket) =>
            ticket.id === id ? applyChanges(ticket, changes, now) : ticket,
          ),
        })
      },
      bulkUpdate: (ids, changes) => {
        const now = new Date().toISOString()
        const selected = new Set(ids)
        set({
          tickets: get().tickets.map((ticket) =>
            selected.has(ticket.id) ? applyChanges(ticket, changes, now) : ticket,
          ),
        })
      },
      reset: () => set(createInitialHelpdeskState()),
    }),
    {
      name: helpdeskStorageKey,
      // Version 2 seeds each ticket's change history. A queue saved by version 1 is demo data
      // with none, so it is replaced by the new seed rather than migrated.
      version: 2,
      migrate: (persisted, version) =>
        version < 2 ? createInitialHelpdeskState() : (persisted as HelpdeskState),
      storage: createJSONStorage(() => localStorage),
      partialize: ({ tickets, contacts }) => ({ tickets, contacts }),
    },
  ),
)
