# 029 — A Calendar Without a Calendar Library

`/calendar` has month, week, and day views. It is a CSS grid over dayjs — no calendar
package.

## Why nothing was installed

The two obvious candidates, measured against a React-only baseline in their own production
builds:

| Library              | Added gzip | Own CSS |
| -------------------- | ---------- | ------- |
| `react-big-calendar` | ~54 kB     | 10.6 kB |
| `@schedule-x`        | ~46 kB     | 28 kB   |

The size is the smaller objection. Both ship their own stylesheet, and neither follows Ant
Design's tokens or the colour mode. Using one means either a calendar that looks foreign on
every theme, or a pile of override CSS — which is the thing this project says it does not
do. Written by hand it costs **15 kB** for the whole page, and it inherits the theme, the
locale, and the dark mode for free.

That trade only works because the hard part is small. The rest of this document is the hard
part.

## Overlapping events

Two events at the same hour have to share the column. The rule:

1. Sort by start time.
2. Group events into clusters that overlap **transitively** — A overlaps B and B overlaps C
   puts all three in one cluster even when A and C never touch, because otherwise B has
   nowhere to go.
3. Inside a cluster, put each event in the first lane whose previous event has already
   ended.
4. The number of lanes the cluster needed is what every event in it divides its width by.

`layoutDay()` is a pure function, which is why the awkward cases are pinned by tests rather
than by looking at the screen: a lane is reused once its event ends, back-to-back events
stay full width, and an event shorter than 30 minutes is lifted to a readable height.

## All-day events, including the ones that span days

An all-day event has no place on an hour axis, so it lives in its own row above the grid.
It may also end on a later date than it starts on, which is the difference between a public
holiday, a three-day conference, and a week of leave.

Membership is a string comparison rather than a date-library call, because `YYYY-MM-DD` is
already ordered:

```ts
export function occursOn(event: CalendarEvent, day: string): boolean {
  if (!event.allDay) return isoDate(event.start) === day

  return day >= isoDate(event.start) && day <= isoDate(event.end)
}
```

A multi-day event is stored as **one** event with a later end date, not as one event per
day. That is what lets the week view draw it as a single band: `layoutAllDay()` finds the
first and last visible day it covers and returns a grid span, so the markup is one element
across three columns rather than three chips with seams between them.

It also clips. An event that started before the first visible day keeps the part of it that
is in view instead of disappearing — which is why `eventsInRange` generates the week before
the range and filters on overlap rather than on where an event starts.

Bands that overlap take their own lane, by the same greedy rule the timed events use.

The month grid does not span; a chip appears on each day the event covers. Spanning there
would mean breaking out of the cell each chip lives in, for a row that is already dense.

## Minutes to pixels

One constant does the conversion:

```ts
top: (startMinutes / 60) * HOUR_HEIGHT
height: ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT - 2
```

The same arithmetic places the current-time line, which is drawn only on the column that is
actually today.

## One grid for the week and the day

The week view and the day view are the same markup. `--day-count` drives the track count:

```css
grid-template-columns: 64px repeat(var(--day-count), minmax(0, 1fr));
```

The day view passes 1, the week view 7. Below 768px the same rule switches to a minimum
column width and scrolls sideways, because seven columns on a phone are not readable — and
the day view, with its single column, needs no scrolling at all.

## The locale decides where the week starts

`date.startOf('week')` follows the active dayjs locale: Sunday for English, Monday for
Turkish. The views never learn about it.

That makes _where events fall_ a real question. Storing them as offsets from the start of
the week put the daily standup on Sunday for English readers. Events are anchored to
weekdays instead:

```ts
const offset = (weekday - weekStart.day() + 7) % 7
```

A test asserts the standup lands on Monday through Friday from both week starts.

## Strict date parsing is a plugin

`?date=` is read with `dayjs(value, 'YYYY-MM-DD', true)`, which needs `customParseFormat`.
Without it dayjs treats the format as a hint:

| `?date=`     | no plugin | with plugin |
| ------------ | --------- | ----------- |
| `2026-09-14` | valid     | valid       |
| `09/14/2026` | valid     | invalid     |
| `2026-13-45` | valid     | invalid     |

The middle column renders a grid around a date nobody asked for. A test covers the
fallback to today.

## Events are rules, not rows

`data/calendarEvents.ts` holds weekly rules — a weekday, a time, and optionally "every N
weeks" — rather than fixed dates. The calendar therefore always opens on a populated week
however long after this was written it runs, and a month does not read as one week copied
six times. A real application would fetch a date range and delete this file.

## Two details the browser decided

The grid opens scrolled to 08:00 rather than midnight, minus 8px, because the hour label
sits _on_ its line and would otherwise be clipped by the header.

That scroll is set with `element.scrollTop = …` rather than `scrollTo()`. jsdom does not
implement `scrollTo`, and a test crashed on it — a reminder that a method missing in one
environment is a method that can be missing in others.
