# 042 — Cinema tickets showcase

Lumen Cinemas is an invented chain with three cinemas (Moda and Levent in Istanbul, Kızılay in
Ankara). The showcase is a box office: pick a day and a showing, choose seats on a map of the
hall, add tickets and snacks while the seats are held, pay, and get a QR e-ticket. The films,
posters and cinemas are made up, and the payment only checks the card format.

## Routes

Every page exists twice, inside the admin (`/showcases/cinema…`) and standalone
(`/preview/cinema…`).

| Route                      | Page                | What it shows                                                      |
| -------------------------- | ------------------- | ------------------------------------------------------------------ |
| `/cinema`                  | `CinemaHomePage`    | Featured film, the week's days, filters, showtimes per film, soon  |
| `/cinema/movies/:movieId`  | `CinemaMoviePage`   | Poster, story, cast, trailer placeholder, showings by day and hall |
| `/cinema/book/:showtimeId` | `CinemaBookingPage` | Steps: seats, tickets and snacks, payment, e-ticket                |
| `/cinema/tickets`          | `CinemaTicketsPage` | Upcoming and past bookings, the e-ticket again, cancellation       |

The home page keeps its filters in the address: `?date=2026-10-02&cinema=moda&format=IMAX,3D&audio=subtitled`.
Values that are not options are dropped, and today is the default day.

## The programme

`data/cinema.ts` holds the films, cinemas and halls, and builds the schedule:

- A hall shows only films made in its format. IMAX and 3D halls show their own format; 2D halls
  and the recliner **lounges** show 2D.
- `scheduleFor(date)` gives each hall two or three films for the day and plays them back to back
  from the hall's opening time until 23:15. A showing takes the film's runtime plus half an hour
  of trailers and cleaning, rounded up to the quarter hour.
- Foreign films are subtitled or dubbed (family films are dubbed more often; IMAX is always
  subtitled). Turkish films are "Turkish". The language filter's "Turkish audio" includes
  dubbed and Turkish films; "Subtitled" only foreign films in their own language.
- Sales run seven days ahead. A coming-soon film opens a set number of days after today and
  has showings from that day, so one of them is always about to open inside the week.
- Online sales close when the showing starts.

Nothing is stored for a showing. Its id is the hall, the date and the time
(`moda-1-20261002-1945`), and `findShowtime()` rebuilds that day's schedule to find it. The
schedule comes from a seeded generator (mulberry32 over the hall and the date), so a showing
never moves and every visitor sees the same programme.

## Seat map

A hall's plan is a few lines of text in `data/cinemaBooking.ts`: `s` standard, `v` VIP
recliner, `w` wheelchair space, `c` couple seat (always in pairs), `_` an aisle, `.` an empty
spot. `buildSeatMap()` numbers the seats across each row, skipping the gaps, and gives both
halves of a couple seat the same `pairId`.

- Sold seats are seeded from the showing's id. Evenings, weekends and nearer days sell more,
  and a showing is never more than about 94% full. A couple seat sells as a pair.
- Seats this visitor has booked for the showing are drawn as **theirs**, in green.
- `toggleSeat()` picks or drops a seat, or both halves of a couple seat, refuses sold seats and
  stops at ten.
- `singleSeatGaps()` warns when the selection leaves one free seat between it and a sold seat
  or the end of a block. It only warns: nobody is stopped from booking.

The map is keyboard-friendly: the whole map is one tab stop, the arrow keys move between seats
(up and down go to the nearest seat in the next row), and Enter or Space picks one. Every seat
is a button whose name reads "Row F, seat 7, VIP recliner, ₺350", with "taken" added for a sold
seat. Sold seats use `aria-disabled` rather than `disabled`, so they stay focusable and a
screen reader can hear that they are taken. A line above the map repeats the seat under the
pointer or the focus.

Seats size themselves to the frame with container units, between 18 and 30 pixels. On a phone
the hall is wider than the screen: it scrolls sideways inside its own box, starts at the
middle, and the row letters stay pinned at both edges. The zoom buttons scale the seats.

## Prices

| Format | Full ticket |
| ------ | ----------- |
| 2D     | ₺260        |
| 3D     | ₺310        |
| IMAX   | ₺390        |

- A showing before 13:00 is a matinee: 20% off.
- A VIP recliner adds ₺90 and a couple seat ₺40 per seat.
- A student ticket is 80% of the full price and a child ticket (under 12) 70%. Child tickets are
  only offered for films rated "All ages" or 7+.
- Each ticket is rounded to ₺5, and the booking adds a ₺10 service fee per ticket.
- Snacks are priced per item.

`quoteBooking()` is the only place that adds money up, for the summary, the pay button and the
saved booking. Prices are in lira in both languages (`₺1,340` and `₺1.340`).

## Holding seats

Moving on from the map starts a ten-minute hold, which counts down in the summary and turns red
in its last minute. When it runs out on the tickets or payment step, the page says the seats
were released and sends the visitor back to the map. The hold is only in the page: it does not
reserve anything, because there is no server.

## My tickets

`useCinemaTickets` is persisted as `rvbp-cinema` (version 1). A booking keeps a copy of the
showing (film, hall, date, time, format, language) and its lines, so it still reads correctly
after the schedule has moved on. The store starts with two examples: tomorrow evening's
Northern Drift and a film watched nine days ago.

- Upcoming bookings are listed soonest first, and past or cancelled ones newest first.
- A booking can be cancelled until two hours before the showing; after that the button is
  disabled and says why.
- The e-ticket shows the film, date, time, cinema, hall, seats and snacks, and a QR code whose
  contents are `LUMEN|code|showtime|seats`, enough for a door scanner to look it up.

## Pictures

There are no image files. `CinemaPoster` draws each film's poster as an SVG motif (waves, a
crescent moon, a ferry, radio rings…) over a gradient in the film's colours, with the title set
on top. Posters are decoration: the title is always printed beside them or in a heading.

## Testing

- `data/cinema.test.ts` covers the schedule (the same every time, formats, opening times, audio,
  coming-soon films), the seat map (numbering, couple pairs, seeded occupancy), selection rules,
  the single-seat warning, prices, the hold countdown, cancellation and saved bookings. It uses
  a fixed "today".
- `pages/CinemaPages.test.tsx` runs against tomorrow's real schedule: filtering the programme
  from the address, the film page and its trailer, picking seats (and not picking sold ones), a
  couple seat selecting both halves, the whole booking through to the QR e-ticket, card
  validation, a started or unknown showing, and cancelling a booking.

The page tests find seats by their `data-seat` id and everything else by text or label: the map
has up to 330 buttons, and role queries over a tree that size are slow in jsdom.
