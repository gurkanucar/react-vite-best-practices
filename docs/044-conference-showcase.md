# 044 — Conference site

`/showcases/event` is the site of **Relay Summit 2026**, an invented frontend and product
conference in Karaköy, İstanbul, on 18–20 November 2026: a workshop day, then two days of
talks on three stages. Every page has a standalone twin under `/preview/event`. The speakers,
companies, sponsors and venue are made up; the speakers have initials on a gradient instead of
photos.

## Routes

| Route                                  | Page                | What it shows                                                        |
| -------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| `/showcases/event`                     | `EventHomePage`     | Hero with a live countdown, speakers, tracks, days, venue, sponsors  |
| `/showcases/event/schedule`            | `EventSchedulePage` | Timetable or list per day, filters, session drawer, "My agenda"      |
| `/showcases/event/speakers`            | `EventSpeakersPage` | Speaker grid with search and a track filter                          |
| `/showcases/event/speakers/:speakerId` | `EventSpeakerPage`  | Bio and every session the speaker is in                              |
| `/showcases/event/tickets`             | `EventTicketsPage`  | Tiers, workshop add-ons, promo code, attendees, demo payment, badges |

`ConfSiteShell` wraps each page in `PublicSiteShell` and, outside the standalone site, the
admin's preview frame. Its "Open in a new tab" link keeps the search, so a filtered program
or a shared agenda opens as it is. The components, data and hooks use the `Conf` prefix, so
they are not confused with the calendar feature's `Event*` components.

## Data and rules

Everything that is not rendering lives in `src/features/showcases/data`:

- `confData.ts` — days, halls, tracks, 16 speakers, 51 schedule entries (42 sessions and 9
  breaks) and sponsors. Times are Istanbul wall-clock `HH:mm`. Istanbul keeps GMT+3 all
  year, so a fixed offset turns them into instants.
- `confSchedule.ts` — the timetable layout, overlap detection, filters, the shared-agenda
  parameter, the live "now and next" state and the countdown.
- `confIcs.ts` — the calendar file.
- `confTickets.ts` — tiers, stock, promo codes, the quote, and card checks.
- `confCopy.ts` — every string in English and Turkish.

### Timetable

`dayLayout(day)` places each session on a CSS grid: halls are columns after the time column,
rows are five minutes each after the header row, and a session for `all` halls (a keynote, a
meal) spans every column. A 40-minute talk is eight rows, a 20-minute lightning talk four, so
the grid shows at a glance what runs long. It is drawn only from `lg` up; a phone gets the
same day as a list grouped by start time.

Filters (track, level, format and a search over both languages' titles and the speakers'
names) live in the address. In the timetable a session that does not match is faded rather
than removed, so the day keeps its shape; in the list it is left out. Breaks always stay.

### My agenda

Starring a session adds it to `useConfAgenda`, persisted as `rvbp-event` (version 1). The
store keeps only ids that name a real, non-break session, in schedule order, whatever was
saved before.

- `findConflicts()` pairs starred sessions that overlap on the same day. Sessions that only
  touch (10:15–10:35, then 10:35–10:55) do not clash. The agenda shows a warning with the
  number of pairs and marks each clashing card with the session it clashes with; the
  timetable marks them with an icon.
- **Export** writes one `.ics` file with a `VEVENT` per session, or one session from the
  drawer. Timestamps are UTC (`20261119T071500Z`), text is escaped (`\`, `;`, `,`, newlines),
  lines end in CRLF and are folded at 75 bytes without cutting a multi-byte letter in two.
- **Share** copies `…/schedule?view=agenda&agenda=id,id`. Opening that link shows the shared
  sessions and offers to add the ones you do not have yet.

### Live state

Before the event the program says how many days are left; during it, a banner lists what is
running and what starts next, and live sessions are ringed in the timetable. For a demo,
`?now=2026-11-19T10:30` (read as Istanbul time) fixes the clock.

### Tickets

| Tier       | Price  | Rule                                                  |
| ---------- | ------ | ----------------------------------------------------- |
| Early bird | ₺2,900 | Until 15 October 2026, 23:59; 37 seats left; up to 4  |
| Regular    | ₺3,900 | Up to 10                                              |
| Student    | ₺1,450 | Up to 2; each student attendee must name a university |
| Team pack  | ₺3,315 | 15% off Regular per seat, 5 to 30 seats               |
| Supporter  | ₺7,500 | Sold out                                              |

Workshops on the first day are ₺1,200 add-ons with their own seat counts (one is full), and
an order cannot take more workshop seats than tickets. Prices include 20% VAT, which the
summary works backwards from the total.

Promo codes: `RELAY10` takes 10% off everything but team seats, which are already
discounted; `COMMUNITY` takes ₺500 off each Regular ticket; `EARLY2025` has expired, and
says so.

`quoteSelection()` returns the lines, totals and a list of issues (`empty`, `teamMinimum`,
`overLimit`, `unavailable`, `workshopsExceedTickets`); the summary shows the issues and keeps
Continue disabled until there are none.

The checkout has four steps. The attendee step is a `Form.List` with one card per seat, and a
button fills it with sample people. The payment step is a demo: the card number formats
itself and must pass the Luhn check (`4242 4242 4242 4242` does), the expiry becomes `MM/YY`
and cannot be in the past, and nothing is stored. The confirmation shows an order reference
and one badge per attendee with a QR code; "Print badges" prints only the badges.

## Testing

- `data/conf.test.ts` checks that no hall is double-booked and every speaker has a session,
  the Istanbul-to-UTC conversion, the grid layout, overlaps, shared-agenda parsing, filters,
  the live state, the countdown, `.ics` escaping, folding and output, and the ticket rules.
- `pages/EventPages.test.tsx` covers the countdown ticking under fake timers, the preview
  frame, starring two overlapping sessions, the `.ics` export, filters and a session from the
  address, a shared agenda, the live banner, the speaker search and pages, and a full ticket
  purchase from promo code to badges.
