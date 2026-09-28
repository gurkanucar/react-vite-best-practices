# 049 — City guide showcase

Şehirname is an invented city guide that covers İstanbul and Edirne for now. It has each
city's story, landmarks, local dishes and traditions, and a searchable map of places. It
also lists events for the coming months and lets visitors build a plan. There is no API:
the content lives in `data/cityGuide.ts`, and saved places and the plan are kept in a
persisted zustand store.

## Routes

Every page is under `/showcases/city` inside the admin and under `/preview/city` on its own.

| Route                           | Page               | What it shows                                                                        |
| ------------------------------- | ------------------ | ------------------------------------------------------------------------------------ |
| `/city`                         | `CityHomePage`     | Search across both cities, city cards, featured dishes, next events, a two-city trip |
| `/city/:cityId`                 | `CityOverviewPage` | Hero, quick facts, must-sees, history timeline, food, culture, neighbourhoods, tips  |
| `/city/:cityId/explore`         | `CityExplorePage`  | Category tabs, search, district, sort, saved only, results beside a map              |
| `/city/:cityId/places/:placeId` | `CityPlacePage`    | Details, facts or hours, map and directions, what is nearby, where to try a dish     |
| `/city/:cityId/events`          | `CityEventsPage`   | Category chips, month, list or calendar view, "My plan" with an .ics download        |

An unknown city (`/city/ankara`) or place shows a friendly not-found page with a link back.

## Real and invented content

The guide separates the two, and says so in the footer and on every demo page.

- **Real:** landmarks, dishes and traditions (`kind: 'real'`). These are described from
  well-established facts: build dates, architects, UNESCO listings (Historic Areas of
  İstanbul 1985; Selimiye 2011; Kırkpınar 2010, Turkish coffee 2013, ebru 2014 and Hıdrellez
  2017 on the intangible list). Where sources disagree, the text says so; for example, the
  year the Ottomans took Edirne is given as "the 1360s".
- **Hours for real places are never guessed.** They say to check the official site.
- **Real places get no ratings or prices.** A test enforces this.
- **Map pins for landmarks** use their real coordinates, which are approximate.
- **Invented:** restaurants, shops, workshops, stays and events (`kind: 'demo'`). They have
  made-up names, ratings, hours and prices, and are tagged "Demo business".
- **Events** are dated October to December 2026. Real recurring festivals such as Kırkpınar
  (late June or early July) and Kakava/Hıdrellez (5–6 May) appear as culture entries, never
  as dated events.
- **No photographs.** `CityArt` stands in for them: the city's two colours, a tile pattern
  and the category icon. `Skyline` draws a simple silhouette of each city (domes, minarets,
  the Galata Tower or the Meriç bridge) for the heroes and city cards.

## Data and logic

- `data/cityGuide.ts` holds the cities, places, events and path helpers.
  - Every piece of text is a `Loc` (`{ en, tr }`).
  - A city keeps the Turkish forms its headings need (`İstanbul'u`, `Edirne'de`), because no
    rule gets these right.
  - Restaurants list the dishes they are known for, and `servedAt` answers "where to try it".
- `data/citySearch.ts` holds the pure functions:
  - **Explore filters** are read from and written to the address. Defaults are left out, and
    anything that is not an option is dropped.
  - **Folding** makes Turkish letters and accents match both ways, so "suleymaniye" finds
    Süleymaniye.
  - **Search** covers both languages, so "Hagia Sophia" works on the Turkish site.
  - **Sorting** is by recommended, rating or name.
  - **Distances** use the haversine formula, with a walking time for nearby places.
  - **Event filters** cover category, month and "my plan only". A month matches any event
    that runs on a day in it, so a show from 28 November to 6 December is in both months.
  - **Past events** drop off using the visitor's local "today" (`useCityToday`).
  - **Dates** are formatted as "Sat 3 Oct", "17–18 Oct" or "28 Nov – 6 Dec".
  - **Prices** show in lira, or as "Free".
  - **Calendar files:** `planToIcs` writes one. Multi-day events are all-day, and the others
    are timed in `Europe/Istanbul`.
- `data/cityCopy.ts` holds the site's own words in English and Turkish, and
  `useCityCopy()` returns them for the current language.

## Map

`components/CityMap.tsx` uses react-leaflet with OpenStreetMap tiles, as the estate site
does.

- **Pins** are fixed 22×22 circles coloured by category, drawn from a zero-size `divIcon` so
  Leaflet never squeezes them. A legend below the map names the colours.
- **On a wide screen** the map sits beside the explore results and the cards become rows.
  Hovering a card lights up its pin, and hovering a pin lights up its card.
- **On a phone** the map opens with "Show map", which also keeps Leaflet out of the list
  tests.
- **Dishes and customs** that have no one address are counted under the map rather than
  pinned.

## Store

`useCityStore` is persisted as `rvbp-city`, version 1. It holds `saved` (place ids) and
`plan` (event ids). A stored version it does not know starts empty.

## Testing

- `data/cityGuide.test.ts` covers the data:
  - unique ids and dish references;
  - real places without ratings;
  - every pin within its city;
  - every event inside the demo quarter.

  It also covers the logic:
  - the explore address round trip and folding;
  - search in both languages;
  - filters and sorts, counts and districts;
  - distances and nearby places;
  - event filters, months and grouping;
  - date and price formatting;
  - the `.ics` output.

- `pages/CityPages.test.tsx` runs with a fixed "today" and covers:
  - the home page;
  - the city overview and the unknown-city page;
  - explore filters kept in the address;
  - a landmark page, with its facts and what is nearby;
  - a dish with where to try it, and saving it;
  - a demo business;
  - filtering events and building and clearing a plan;
  - the Turkish copy.
