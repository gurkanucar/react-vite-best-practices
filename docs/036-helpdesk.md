# 036 — Helpdesk

`/helpdesk` is a customer support queue: tickets with SLA clocks, one thread for customer
messages, agent replies and internal notes, and an activity log of every property change.
It has no API behind it; the queue lives in a persisted zustand store, like the task list.

## Routes

| Route                 | Page                    | What it shows                                                |
| --------------------- | ----------------------- | ------------------------------------------------------------ |
| `/helpdesk`           | `HelpdeskListPage`      | Stats, status tabs with counts, filters, bulk actions, list  |
| `/helpdesk/new`       | `HelpdeskNewTicketPage` | The intake form, with the SLA its priority will set          |
| `/helpdesk/:ticketId` | `HelpdeskTicketPage`    | Thread, reply composer, properties, requester, SLA, activity |

The queue's filters — status, search, priority, assignee, channel — are search params, so
"urgent tickets assigned to Marco" is a link. Values that are not valid options are dropped.

On a wide screen the queue is a table with row selection; below the `lg` breakpoint each
ticket becomes a card, because seven columns do not fit a phone.

## Data model

`src/features/helpdesk/types` holds the model and every rule that is not rendering:

- A **ticket** has a running number (`#1042`), status (`open`, `pending`, `onHold`,
  `resolved`, `closed`), priority, channel, category, assignee, tags, both SLA deadlines,
  a thread and an activity log.
- A **message** is `customer`, `reply` or `note`. A note is written by an agent like a reply
  but only the team sees it, so it is its own kind, drawn dashed and amber in the thread and
  in the composer before it is sent.
- An **activity** entry keeps raw values (`open` → `resolved`, an agent id) rather than text,
  so the timeline reads in whichever language is active.

## SLA rules

| Priority | First response | Resolution |
| -------- | -------------- | ---------- |
| Urgent   | 1 hour         | 4 hours    |
| High     | 4 hours        | 1 day      |
| Normal   | 8 hours        | 3 days     |
| Low      | 1 day          | 5 days     |

Deadlines are set when the ticket is opened, in calendar time rather than business hours, so
the countdowns are easy to check by eye.

- The first-response clock stops at the first **reply**. A note does not stop it: the
  customer has still heard nothing.
- The resolution clock stops when the ticket is resolved or closed, and starts again if it
  is reopened.
- A ticket **on hold** is waiting on someone outside the team, so a running clock shows as
  paused.
- The queue shows one clock per ticket, whichever the team is working against now, and sorts
  by it: the nearest deadline first, finished tickets last.

`useNow` re-renders the countdowns once a minute; they are shown in minutes, so a finer tick
would only redraw the queue for nothing.

## History

A ticket stores its thread (`messages`) and its property changes (`activity`) separately, because different actions write them. The **History** tab on the detail page puts them back on one line with `ticketHistory()` in `types/history.ts`, adding the SLA milestones in between:

- A deadline met is recorded when its clock stopped: the first reply, or the resolution.
- A deadline missed is recorded **at the deadline**, because that is when it went wrong, whether the clock stopped late or is still running.
- A ticket on hold has its clocks paused, so it records no misses.

Entries are grouped by local day ("Today", "Yesterday", then the date) and can be filtered by kind (messages, changes, service level) and read in either direction. Each entry shows its time and how long after opening it happened, and a message entry jumps back to that message in the conversation, which flashes once.

The sidebar keeps only the five latest changes, with a link to the full history. The list page has a **Recent activity** drawer: `queueHistory()` runs over every ticket, newest first, with a link to the ticket each entry belongs to.

The seed gives every ticket the changes its state implies (routed to its agent, escalated if urgent, moved to its current status), so a fresh queue's history reads like work that happened. The persisted store is at version 2: a queue saved before the history existed is replaced by the new seed.

## Store

`useHelpdeskStore` (persisted as `rvbp-helpdesk`) exposes `createTicket`, `addMessage`,
`updateTicket`, `bulkUpdate` and `reset`. Every change goes through one function that writes
an activity entry per field that actually changed, so the log never says "changed status from
Open to Open".

A new requester is matched by email before being added, so someone who writes in twice is
one contact. The seed data is dated relative to the moment it is created, so a fresh queue
always shows every SLA state at once: time left, nearly out, breached, paused and met.

All text is in `data/helpdeskCopy.ts`, in English and Turkish.

## Testing

- `types/index.test.ts` covers the SLA clocks, duration formatting, search and filters,
  status counts, queue order, ticket numbering and the summary stats, against a fixed clock.
- `pages/HelpdeskPages.test.tsx` covers filtering from the address bar, search by number,
  creating a ticket for a new contact, validation, replies and notes landing in the thread
  with their own look, the first-response clock stopping, the activity log and the
  not-found page.

The page tests find controls by text and label rather than by role: role queries compute
styles for every candidate, which is slow over a tree this size in jsdom.
