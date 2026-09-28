# 043 — Real estate showcase

Mesken is an invented agency with homes to buy and rent in İstanbul, İzmir and Ankara: a
search with price pins on a map, a listing page with a mortgage calculator, and a side-by-side
comparison. It has no API; the listings are generated, and saved homes and the compare list
live in a persisted zustand store.

## Routes

Every page is under `/showcases/estate` inside the admin and `/preview/estate` on its own.

| Route                         | Page                 | What it shows                                                         |
| ----------------------------- | -------------------- | --------------------------------------------------------------------- |
| `/estate`                     | `EstateHomePage`     | Hero search, featured homes, neighbourhoods, what a budget buys, team |
| `/estate/listings`            | `EstateListingsPage` | Filters, results beside a map, saved homes, compare tray              |
| `/estate/listings/:listingId` | `EstateListingPage`  | Gallery, facts, features, location, mortgage, price history, contact  |
| `/estate/compare?ids=a,b,c`   | `EstateComparePage`  | Up to three homes side by side, the best value in each row marked     |

## The catalogue

`data/estate.ts` builds 168 listings from 18 real neighbourhoods with a seeded PRNG
(Mulberry32), so every visitor, every test and every reload sees the same homes. Each
neighbourhood has a centre, a spread, a price per m² and the kinds of home it has: villas
in Tarabya, Urla and İncek, residences in Levent and Ataşehir, flats almost everywhere.

A listing's price follows from its size, the neighbourhood and what it has (a sea view, a
pool, a new building, a garden floor). Rents are the sale value over about 265 months. The
price history is written backwards from today's price, mostly downwards, so some homes carry
a "Price down 5%" tag. Dates are kept as days ago, so a listing is always "new" for its
first week, whatever the date.

Rooms are written the Turkish way, bedrooms + living rooms, with a studio as `1+0`. Turkish
titles need the locative each neighbourhood takes ("Levent'te", "Çayyolu'nda"), which no
rule gets right, so it is stored with the neighbourhood.

Photos are Unsplash images, each checked by eye to match what it is used for (a villa, a
kitchen). The footer credits Unsplash as a whole.

## Search

The filters live in the address, so a search is a link: deal, city, neighbourhood, free
text, type, rooms, price and size ranges, floor, building age, maximum dues, must-haves,
saved homes only, a map area and the sort. `parseFilters` drops anything that is not an
option, and `filtersToParams` leaves every default out.

Free text is folded before it is compared, so "kadikoy" finds Kadıköy and "IZMIR" İzmir.

On a wide screen the most used filters sit in one row and the rest are in a drawer; on a
phone every filter is in a bottom drawer whose button shows how many homes it will show.
Each active filter is also a chip above the results that removes it.

## The map

`components/EstateMap.tsx` uses react-leaflet with OpenStreetMap tiles, as the tech park
does.

- **Pins** are `divIcon`s with the price in short form (₺12.5M, ₺45 B). The marker is a
  zero-size point and the pill hangs above it in CSS, so Leaflet's fixed icon size never
  squeezes it.
- **Clusters**: pins that would overlap at the current zoom merge into one bubble with a
  count, and merging repeats until no two bubbles are closer than the radius. Clicking a
  bubble zooms to its homes. `clusterPoints` is a pure function over a projection, so it is
  tested without a map.
- **Hover** works both ways. A pin lights up its card, and a card, by pointer or keyboard
  focus, lights up its pin. The page listens once on the grid rather than on every card.
- **Search this area** appears once the visitor moves the map, and puts the visible bounds
  in the address. The list then shows the homes inside the dashed rectangle, while the map
  keeps the pins around it.
- The map frames the results whenever the search changes, and not when only the page or
  the sort does.

On a phone the map opens full screen from a floating button. It is only mounted while open,
which also keeps Leaflet out of the list tests.

## Listing page

- The gallery opens `Image.PreviewGroup` at the photo that was clicked.
- The location is a circle, not a pin: the exact address is shared when a viewing is booked.
- The mortgage calculator takes the price, down payment, term and a **monthly** rate,
  because Turkish banks quote housing loans per month. It shows the yearly equivalent, the
  instalment, total interest, a principal/interest bar and a year-by-year table.
- A home to rent shows what moving in costs instead: the first rent, a two-month deposit
  and one month's agency fee plus VAT.
- The contact form checks the name, a phone number and consent, and says it is a demo.

## Compare

Up to three homes, from the tray on the search page or from a shared `?ids=` link. A link
wins over the homes this browser picked. Each comparable row (price, price per m², size,
bedrooms, age, dues, number of features) marks its best value, and a tie marks nothing. On a
phone the table scrolls sideways with the labels pinned.

## Store

`useEstateStore` (persisted as `rvbp-estate`, version 1) holds `favourites` and `compare`.
`toggleCompare` returns `'full'` when three homes are already picked, and the page says so.

## Testing

- `data/estate.test.ts` covers the catalogue (deterministic, every home inside its
  neighbourhood, histories ending at today's price), filters in and out of the address,
  folding, the map area, sorting, similar homes, the best values in a comparison, clustering
  and the mortgage, affordability and move-in maths.
- `pages/EstatePages.test.tsx` covers searching from the home page, filters from the address
  and their chips, ignoring bad parameters, saving, the compare limit, the listing page with
  its calculator and contact form, a home to rent, a missing listing, compare links and the
  Turkish copy.
