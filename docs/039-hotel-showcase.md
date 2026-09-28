# 039 — Hotel booking showcase

Kaia Bay is an invented boutique hotel on the Bodrum peninsula. The showcase is a whole
booking flow rather than one landing page: search for a stay, compare rooms, pick a rate and
book it in four steps. Nothing is sent anywhere; the "payment" only checks the card format.

## Routes

Every page exists twice, inside the admin (`/showcases/hotel…`) and standalone
(`/preview/hotel…`). The stay travels in the search params, so each step is a link:
`?checkIn=2027-05-13&checkOut=2027-05-16&adults=2&children=0&rooms=1`.

| Route                  | Page               | What it shows                                                     |
| ---------------------- | ------------------ | ----------------------------------------------------------------- |
| `/hotel`               | `HotelLandingPage` | Hero with the search bar, rooms, amenities, gallery, reviews, map |
| `/hotel/rooms`         | `HotelRoomsPage`   | Results for the stay: filters, sort, price per night and in total |
| `/hotel/rooms/:roomId` | `HotelRoomPage`    | Gallery, amenities, rate plans, night-by-night price, summary     |
| `/hotel/book`          | `HotelBookingPage` | Steps: extras, guest details, demo payment, confirmation          |

The booking link also carries `room` and `plan`. A link with no dates, or dates that cannot be
booked (in the past, check-out before check-in, longer than 21 nights), falls back to the
default stay — three nights, three weeks from today — and says why in an alert. A booking link
without a room shows a "start with a room" page instead of an empty form.

## One place for the rules

`data/hotelBooking.ts` holds everything that is not rendering, and every page prices through
`quoteStay()`:

- A night costs the room's base rate × the season (July–August 1.3, June and September 1.15,
  May and October 1, the rest 0.8) × 1.2 on Friday and Saturday nights.
- The non-refundable rate takes 12% off the room, not the extras.
- Extras: breakfast per guest per night, the airport transfer per booking, late checkout per
  room.
- VAT (10%) is charged on the discounted room and the extras; the city tax is a flat €2 per
  room per night and is never discounted.
- A flexible booking can be cancelled for free until the end of the day three days before
  arrival. When that moment has passed, the page says there is no free cancellation.

Availability is seeded, not random: `roomsLeft()` hashes the room and the date, so a room that
is full on 14 May is full for every visitor and on every render. A room cannot be booked when
any night of the stay has fewer rooms left than were asked for, or when the party does not fit;
the results page says which of the two it is. Rooms that can be booked always sort first.

## Components

| Part                       | Component                                                    |
| -------------------------- | ------------------------------------------------------------ |
| Dates                      | `DatePicker.RangePicker`, past dates and stays > 21 off      |
| Guests                     | `Popover` with steppers and their limits                     |
| Price filter               | `Slider range`                                               |
| Bed, view, amenity filters | `Checkbox.Group`; on a phone they move into a `Drawer`       |
| Galleries                  | `Image.PreviewGroup`                                         |
| Rate plans and extras      | `Radio.Group` / `Checkbox.Group` rendered as cards           |
| Night-by-night price       | `Collapse`                                                   |
| Booking steps              | `Steps`; on a phone only the current step keeps its name     |
| Guest and card details     | One `Form`, validated a step at a time with `validateFields` |
| Confirmation               | `Result` + `Descriptions`                                    |

The card number is grouped in fours as it is typed and checked with the Luhn sum; the expiry
is `MM/YY` and not in the past. `4242 4242 4242 4242` passes.

The layout reads the site's own width through the `showcase` container query, not the
viewport's, because inside the admin the site sits next to the sidebar.

Photos are Unsplash URLs; the map is a drawn SVG. All copy, English and Turkish, is in
`data/hotelCopy.ts`.

## Testing

- `data/hotelBooking.test.ts` covers nights, weekend and seasonal rates, the quote with and
  without extras and discounts, reading a stay from a link, availability and its reasons, the
  cancellation deadline and the card checks.
- `pages/HotelPages.test.tsx` searches from the landing page, checks every result card against
  the pricing rules, filters by view, handles unusable dates and unknown rooms, switches rate
  plans, and books a room end to end, including a refused card number.
