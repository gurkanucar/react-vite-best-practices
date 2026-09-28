# 041 — Auto parts store showcase

`/showcases/parts` is **Torkline**, an invented spare-parts shop:

- a garage of the shopper's cars;
- a catalogue of about 540 generated parts, matched to those cars;
- a four-step checkout;
- an order history with shipment tracking that moves on by itself.

There is no API behind it. The catalogue is generated in the browser, and the garage, cart and orders live in a persisted zustand store.

Each page is also served full screen under `/preview/parts/…`. The preview frame's "open in a new tab" button keeps the current page and query.

## Routes

| Route                               | Page                | What it shows                                               |
| ----------------------------------- | ------------------- | ----------------------------------------------------------- |
| `/showcases/parts`                  | `PartsHomePage`     | Hero with the vehicle picker, categories, deals, brands     |
| `/showcases/parts/catalog`          | `PartsCatalogPage`  | Filters, sort, grid or list, pagination                     |
| `/showcases/parts/products/:partId` | `PartsProductPage`  | Specs, compatible cars, OEM numbers, stock, bought together |
| `/showcases/parts/checkout`         | `PartsCheckoutPage` | Address → delivery → payment → review → confirmation        |
| `/showcases/parts/orders`           | `PartsOrdersPage`   | Order history with each parcel's progress                   |
| `/showcases/parts/orders/:orderId`  | `PartsOrderPage`    | Tracking timeline, items, totals, cancel or return          |

Every page renders inside `PartsSiteShell`, which provides:

- a sticky bar under the header with the garage button, the search and the cart;
- the garage modal and the cart drawer;
- the footer.

## The catalogue

`data/partsCatalog.ts` builds the catalogue once, when the module loads. It uses a seeded PRNG (mulberry32), so the same parts, with the same ids, prices and stock, come out in the browser and in the tests.

Randomness is always drawn a fixed number of times. Brand order uses a Fisher–Yates shuffle, not a random `sort` comparator: the number of comparator calls differs between engines, and with a random comparator Chrome and Node built different catalogues.

The catalogue is built from three tables:

- **Vehicles** (`data/partsVehicles.ts`): 14 generations common in Türkiye, from Clio IV to Civic X, each with its engines. Every engine has a **family** code, for example `K9K` for Renault's 1.5 dCi.
- **Brands**: 13 invented brands, each with a price tier and a part-number shape.
- **Part types**: 42 of them across 12 categories. Each type sets how it is fitted, its price range, specs, warranty and which fuels it applies to.

How a type is fitted decides which parts get generated:

| Fitted by   | Generated as                                           | Example                         |
| ----------- | ------------------------------------------------------ | ------------------------------- |
| `model`     | One part group per car generation (and per side)       | Pads, shocks, headlamps, wipers |
| `engine`    | One group per engine family, fitting every car with it | Oil filter, timing kit, DPF     |
| `universal` | A few fixed sizes that fit any car                     | Engine oil, batteries, bulbs    |

- A **group** is one original part. It has its own OEM numbers in the car maker's format, and one or two brands make it. Parts in the same group are listed as "Same part from other brands".
- An engine group lists every car that uses that engine family. A Clio IV oil filter for the 1.5 dCi therefore also fits a Duster 1.5 Blue dCi.
- Everyday service parts (pads, discs, filters, plugs, wipers) exist for every car. The rest are thinned out, the way a real shop stocks most parts but not all.

`fitFor(part, vehicle)` returns one of four results, and every card shows it as a badge:

- `fits`
- `doesNotFit`
- `universal`
- `unknown` (no car chosen yet)

## Search

- **Part numbers.** The manufacturer's number and every OEM number are compared with spaces, dots and dashes removed. `4106 0157 0R`, `41-06-015-70r` and `410601570R` all find the same part, and the suggestion says which number matched.
- **Words.** Each query word has to _start_ a word of the name (English or Turkish), the brand, the category or the compatible cars. "fren bal" finds brake pads, but "on" does not match "Honda".
- **Turkish letters.** Text is folded before matching, so `balatasi` finds `balatası`.
- **Suggestions.** They rank the parts that fit the selected car first and leave out parts that cannot fit it. Enter searches the catalogue.

## Catalogue filters

Every filter lives in the address, so a filtered list can be bookmarked or sent on:

- `q` — search text
- `category`
- `brand` — comma separated
- `min`, `max` — price range
- `stock=1` — in stock only
- `pos` — `front` / `rear` / `left` / `right`
- `sort`
- `view=list`
- `page`

With a car selected, the catalogue shows its parts plus universal ones. `fit=all` switches back to every part. The price slider's range follows the other filters. The results are memoised and paged 24 at a time, so the grid never renders hundreds of cards.

From `lg` up the filters are a sticky sidebar; below that they are a drawer.

## Checkout, money and delivery

- **Prices.** Prices are Turkish shelf prices with 20% VAT included. Totals show the VAT as a share of the total, and both languages use lira.
- **Delivery.** Standard delivery is ₺69,90, or free over ₺1.500. The other options:
  - Next-day express.
  - Same-day courier, only in Istanbul, before the cut-off, with every part in the Istanbul warehouse.
  - Collection from the Hadımköy warehouse.

  The carriers (Kargovia, Menzil Express) are invented.

- **Payment.**
  - A card is checked with a Luhn test and an expiry in the future (test card `4242 4242 4242 4242`); nothing is charged.
  - Bank transfer gives 3% off.
  - Paying at the door adds ₺39,90 and is capped at ₺15.000.
- **Cut-off.** Warehouses dispatch until 16:00 on weekdays and 13:00 on Saturdays; Sunday never counts as a delivery day. The product page counts down to the cut-off ("order within 2 h 14 min and it leaves today").
- **Validation.** Each step validates only its own fields before moving on. The review step needs the terms accepted.

All of this is pure functions in `data/partsCommerce.ts`.

## Orders and tracking

A tracking timeline is not stored; it is computed from the time the order was placed, the delivery method and the current time. Each method has a plan in hours:

- standard: received → preparing → handed to carrier → in transit (a hub chosen by the destination city) → out for delivery → delivered;
- pickup: received → preparing → ready to collect.

Timing depends on the order:

- An order placed in the demo uses `pace: 'demo'`, which plays the hours back as minutes. A standard delivery arrives in about 15 minutes, and an open order page refreshes every few seconds, so a new order visibly moves along.
- The seeded history uses the real pace. It is dated from the moment the store is created, so there is always one order in each state: preparing, in transit, cancelled and delivered.

Cancelling and returning:

- An order can be cancelled until it is handed to the carrier; the timeline then ends in "Cancelled".
- It can be returned for 14 days after delivery.

## Store

`usePartsStore` is persisted as `rvbp-parts` at version 1. Anything saved under a different version is replaced by the seed.

- **Saved:** the garage (starting with one saved Clio), the selected car, the cart, the orders and the next order number.
- **Not saved:** whether the cart drawer and the garage modal are open.

Quantities are clamped between one and the part's stock, with at most 20 per line.

## Testing

- `data/parts.test.ts` covers:
  - the catalogue's size and uniqueness, and that every car has its service parts;
  - fitment across engine families;
  - search by OEM number and in Turkish;
  - filters, and "bought together";
  - totals, the cut-off and delivery windows, same-day availability;
  - card, expiry and phone checks;
  - demo tracking, cancel and return rules, and the seeded history.
- `pages/PartsPages.test.tsx` covers:
  - the home page;
  - the catalogue filtered to the selected car and back;
  - filters read from the address;
  - adding to the cart from the product page;
  - the fit badge;
  - the whole checkout with its validation errors;
  - the empty checkout;
  - the order list, tracking and cancelling;
  - both not-found pages.
