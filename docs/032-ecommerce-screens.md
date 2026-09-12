# 032 — E-commerce Screens

Three related sub-pages under `/shop`: a product detail, an order, and an invoice. The
product page was built from a Material UI template screenshot; the other two follow from it
so the section holds a whole flow rather than one screen.

## What each part turned out to be

| Part of the design       | Component                                  |
| ------------------------ | ------------------------------------------ |
| Gallery with a pager     | `Image.PreviewGroup` + a `hidden` div      |
| Colour swatches          | Buttons with `aria-pressed`                |
| Size                     | `Select`                                   |
| Quantity stepper         | `Space.Compact` + `Button` + `InputNumber` |
| Rating and review count  | `Rate` + `Typography`                      |
| Specifications table     | `Descriptions bordered column={1}`         |
| Description / Reviews    | `Tabs`                                     |
| Order and invoice lines  | `Table`                                    |
| Order progress           | `Steps orientation="vertical"`             |
| Rating distribution bars | `Progress`                                 |

## One place that decides what things cost

`totalsFor()` is the only thing on these screens that adds money up, and both the order and
the invoice call it. The order it applies matters:

```ts
const taxed = Math.max(subtotal - discount, 0)
const tax = Math.round(taxed * taxRate * 100) / 100
return { subtotal, shipping, discount, tax, total: taxed + tax + shipping }
```

Tax is charged on the discounted subtotal rather than on the list price, and shipping is
added after tax rather than before it. Get either wrong and every figure under the subtotal
is quietly off. `Math.max(…, 0)` covers a discount larger than the order, which otherwise
produces negative tax.

The rendering of that block — subtotal, discount, shipping, tax, total — is one component
shared by both pages, so the two documents cannot drift apart.

## The gallery

Every frame stays mounted inside one `Image.PreviewGroup`, and all but the selected one
carry `hidden`. That is what lets the lightbox page through the whole set while the page
itself shows one. Ant Design 6's `Image` has no `wrapperClassName`, so the `hidden` goes on
a wrapper of our own.

Choosing a colour moves the gallery to that colour's frame — one piece of state, not two.

## Deprecations the browser reported

`Steps` warned twice: `direction` is now `orientation`, and an item's `description` is now
`content`. Both were caught by reading the console rather than by the types, which still
accept the old names.

## Placeholder images

Five generated SVGs of a shoe in profile, about 1.4 KB each, one per colourway. No external
URLs and no binaries. The first attempt rendered as an unreadable blob — the paths were
wrong, and only looking at it in a browser showed that.

Three of them are reused as line-item thumbnails on the order, and three more wireframe SVGs
were added to the delivery board so a few cards carry an attachment.
