# 040 — Online store showcase

`/showcases/store` is a customer-facing shop for **Kiln & Linen**, an invented brand of
slow-made home goods. It is a separate thing from `/shop` (doc 032), which shows the admin
side of one product, an order and an invoice. Like the other showcases it also runs full
screen under `/preview/store`.

## Routes

| Route                                  | Page                | What it shows                                                   |
| -------------------------------------- | ------------------- | --------------------------------------------------------------- |
| `/showcases/store`                     | `StoreHomePage`     | Hero, perks, category tiles, the catalog with filters           |
| `/showcases/store/products/:productId` | `StoreProductPage`  | Gallery, colour and size, stock, quantity, tabs, related pieces |
| `/showcases/store/checkout`            | `StoreCheckoutPage` | Four steps with a live order summary, then a confirmation       |

`StoreSiteShell` wraps every page: the shared `PublicSiteShell` header, a sticky bar with the
delivery promise and the **Cart** button (with a count badge), and the cart drawer, so the
cart opens from any page.

## Files

| File                    | Holds                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| `data/store.ts`         | The catalog: 14 products, 5 categories, colours, variants, reviews |
| `data/storeCart.ts`     | Every money rule: prices, coupons, delivery, VAT, card checks      |
| `data/storeFilters.ts`  | Reading and writing filters in the URL, filtering and sorting      |
| `data/storeArt.ts`      | The product pictures, drawn as SVG                                 |
| `data/storeCopy.ts`     | All text in English and Turkish                                    |
| `hooks/useStoreCart.ts` | The cart, persisted as `rvbp-store-cart`                           |
| `components/Store*.tsx` | Shell, cart drawer and lines, product card, filter panel           |
| `store.css`             | The shop's styles, all under `store-`                              |

## Catalog and variants

A product has a base price and a list of **variants**, one per colour and size. Each variant
has its own stock and may have its own price, because a 200 × 300 rug does not cost what a
120 × 180 one does. The compare-at price scales with it, so the "You save" line stays true.

Stock reads as a level: none is **sold out**, five or fewer is **low**, more is in stock. A
sold-out colour is struck through but can still be picked, to see it; the add button then
says why it is disabled. Quick add on a card takes the first variant that is in stock.

## Filters live in the address bar

Search, category, price range, colours, sizes, "in stock", "on sale", minimum rating and sort
are search params (`?category=textiles&colour=sage&sale=1`), so a filtered view is a link.
`parseFilters` drops anything that is not a real option; `filtersToParams` leaves defaults
out, so the unfiltered shop has a clean URL.

- A colour or size matches through a **variant** that has it, and with "in stock only" that
  variant also has to be in stock: "clay, 50 × 50, in stock" finds nothing, because that
  cushion is sold out even though other clay pieces are not.
- The size filter offers the sizes of the chosen category only.
- The price filter uses the base price.
- Search ignores case and accents in both languages, and folds the Turkish dotless ı, so
  "yastik" finds "yastık".

On a wide screen the filters are a sticky sidebar; below `lg` they are a drawer with a
"Show N products" button. Active filters also show above the grid as chips that remove them.
The grid shows twelve products at a time with **Load more**; a new filter starts from the
first page again.

## Money

Prices are in Turkish lira, **VAT included**, as Turkish shops show them; an English visitor
sees the same amounts with English number formatting (`₺1,290` / `₺1.290`). `cartTotals()`
is the only function that adds money up, and the order matters:

1. Subtotal: unit price × quantity per line.
2. The coupon comes off.
3. Delivery is judged on what is left: standard is free from ₺1,500, otherwise ₺89; express
   is always ₺179; picking up in store is free.
4. VAT is read out of the total (20 / 120 of it), not added.

| Code        | Effect                 | Condition                    |
| ----------- | ---------------------- | ---------------------------- |
| `WELCOME10` | 10% off the subtotal   | —                            |
| `FREESHIP`  | Free standard delivery | —                            |
| `SAVE250`   | ₺250 off               | A subtotal of ₺2,000 or more |

Codes ignore case and spaces. A code that stops applying because the cart shrank stays on
the cart, greyed, with a note saying what it needs. The drawer does not know the delivery
method yet, so it shows its totals without delivery, unless standard delivery is already free.

## Checkout

One antd `Form` across four steps (details, delivery, payment, review). Only the step on
screen has its fields mounted, so submitting validates just those; the others keep their
values. Steps already done can be revisited from the step bar or the review's edit buttons.

Payment is clearly a demo: the card number is formatted in groups of four while typing and
checked with the Luhn algorithm, the expiry becomes `MM/YY` on its own and must not be in the
past. Nothing is sent anywhere. Placing the order shows a confirmation with an order number
(`KL-` and six digits) and empties the cart.

## Pictures

There are no photos. `productArt()` draws each product shape as an SVG in the chosen colour
and returns it as a data URL, in three views (front, close-up, in a room) for the gallery.
The shop depends on no image host, and choosing "Sage" really shows a sage cushion.

## Testing

- `data/storeCart.test.ts`: variant prices, delivery thresholds, the discount-before-delivery
  order, VAT, coupon rules, stock levels, card checks, URL filters and variant matching.
- `pages/StorePages.test.tsx`: filtering from the URL, the filter drawer and chips, adding a
  variant to the cart, a sold-out variant, coupon errors and discounts, the whole checkout,
  the empty and not-found states, and Turkish formatting.
