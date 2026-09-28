# 047 — Special days showcase

Anlar is a personal app for the days that matter: birthdays, anniversaries, memorial days,
Türkiye's public and religious holidays, and bills and renewals. It counts down to each one and
rings alarms while the app is open. Everything is stored in the browser.

## Routes

Every page exists twice, inside the admin (`/showcases/reminders…`) and standalone
(`/preview/reminders…`).

| Route                    | Page                    | What it shows                                                      |
| ------------------------ | ----------------------- | ------------------------------------------------------------------ |
| `/reminders`             | `RemindersHomePage`     | Next day and next alarm, alarm settings, search, upcoming by group |
| `/reminders/calendar`    | `RemindersCalendarPage` | Month grid with every day marked, the selected day's reminders     |
| `/reminders/:reminderId` | `ReminderDetailPage`    | Live countdown, details, alarms, gift ideas checklist, past years  |

The calendar keeps the selected day in the address (`?date=2026-12-24`); an invalid date falls
back to today. Reminder ids never collide with `calendar`.

## Dates

`data/reminders.ts` works on `YYYY-MM-DD` strings and epoch milliseconds in the viewer's time
zone, so every function takes "now" or "today" as an argument and the tests pin it.

- **Yearly** days repeat on the same month and day. A 29 February birthday falls on 28 February
  outside leap years. With "count the years" on, the list shows the age turned or the
  anniversary number ("64 yaşına giriyor", "7. yıl dönümü", Cumhuriyet'in 103. yılı).
- **Monthly** days fall on the same day of the month, or the last day of a shorter month (a bill
  on the 31st is paid on 30 September). They start from their first date.
- **Once** days end after their date.
- **Rules** cover days that move: Mother's Day (second Sunday of May) and Father's Day (third
  Sunday of June) use `nthWeekday`; the religious holidays list their dates. Ramazan Bayramı is
  20 March 2026 and 9 March 2027, Kurban Bayramı 27 May 2026 and 16 May 2027 (the first day of
  each, per the Diyanet calendar). Add later years to `remindersSeed.ts` when they are announced.

The seed is one family's days (with bilingual titles, notes and gift ideas), three bills and
renewals, a passport expiry, and 14 public and religious holidays. Holidays ship without alarms,
except Republic Day, Mother's and Father's Day and the bayrams. "Show public holidays" hides
the built-in days from the lists, the calendar and the alarms. Editing a seeded title in either
language keeps its translation; any other title replaces it.

## Alarms

Each reminder has offsets (on the day, 1, 3, 7, 14 or 30 days before) and one alarm time.
`RemindersAlarmHost` sits in the site shell and checks every second:

- An alert is due when its time has passed by less than 15 minutes (`ALARM_GRACE_MS`) and it has
  not rung before. An app opened the next morning does not ring yesterday's alarms.
- A due alert shows an antd notification that stays until it is dismissed or snoozed (5 or 10
  minutes), plays a short Web Audio chime unless the sound is muted, and shows a system
  notification when the viewer allowed browser notifications.
- It is marked as rung the moment it shows, so a reload does not ring it again. Snoozed alerts
  are stored and ring when their time comes, even after a reload.
- "Try an alarm" queues a test alarm in 10 seconds.

Browsers only play sound after an interaction, so the chime unlocks on the first click in the
alarm settings; a page opened and never clicked stays silent. The notifications button shows
"not supported" or "blocked" when the browser says so. Alarms only ring while a page of the app
is open: there is no service worker or push server.

## Calendar export

"Add to calendar" and "Export all" download an `.ics` file (`data/remindersIcs.ts`): all-day
events with RRULEs that match the app (a 29 February birthday uses `BYMONTHDAY=-1`, a monthly
day after the 28th uses `BYSETPOS=-1`, the weekday rules use `BYDAY=2SU`), one event per listed
religious holiday date, and a `VALARM` per offset whose trigger is relative to midnight
(`-PT15H` is 09:00 the day before).

## Storage

`useRemindersStore` persists to `rvbp-reminders` (version 1): the reminders, the keys of alerts
that rang (the last 400), the snoozes, the mute switch and the holidays switch. Whatever is
stored is cleaned on load; a broken reminder is dropped. "Reset demo data" puts the seed back.

## Tests

- `data/reminders.test.ts`: yearly, leap-day, monthly and rule-based dates; years counted; past
  years; grouping; alert times, the grace window and the next alarm; countdowns; form checks and
  edits; stored-state cleaning; `.ics` triggers, rules and output.
- `pages/RemindersPages.test.tsx`: the list and its filters, hiding holidays, adding a reminder on
  a calendar day, the detail page's countdown and gift ideas, a missing reminder, and an alarm
  that rings and is snoozed.
