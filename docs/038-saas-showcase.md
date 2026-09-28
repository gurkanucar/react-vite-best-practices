# 038 — SaaS product site and pricing

`/showcases/saas` is the marketing site of **Pulseboard**, an invented observability and
on-call product, and `/showcases/saas/pricing` is its pricing page. Both have a standalone
twin under `/preview/saas`, like the other showcases.

## Routes

| Route                     | Page              | What it shows                                                     |
| ------------------------- | ----------------- | ----------------------------------------------------------------- |
| `/showcases/saas`         | `SaasLandingPage` | Hero with a product mock, logos, features, steps, proof, FAQ, CTA |
| `/showcases/saas/pricing` | `SaasPricingPage` | Billing, team size and currency controls, plans, comparison, FAQ  |

`SaasSiteShell` wraps both in `PublicSiteShell` with the site's navigation and a footer of
link columns. It is imported by path, not from `components/index.ts`.

## The landing page

- The hero's product mock is drawn with CSS and antd `Tag`s: KPI tiles, a bar chart and an
  incident list. It is `aria-hidden`, because it is decoration that repeats nothing the copy
  does not say.
- "How it works" is `Steps`, horizontal from `lg` and vertical below it.
- The pricing teaser reads its prices from the same `quote()` as the pricing page, so the two
  pages can never disagree.

## Pricing

All the money is in `data/saas.ts`:

- `quote(plan, { cycle, seats, currency })` prices one plan. The per-seat price is converted
  and rounded **first**, and every total is multiplied from it, so a card never shows a seat
  price and a total that do not match.
- Yearly billing charges ten months for twelve (`YEARLY_MONTHS_CHARGED`), which is where the
  "2 months free" badge and the "You save" line come from.
- A plan can bill a minimum number of seats (Business bills at least 5) and cap them (Free
  holds 3, Team 50). Above the cap the card says so and its button is disabled.
- `recommendedPlan(seats)` is the cheapest plan that holds the team; its card is marked "Fits
  your team" unless it is already the highlighted one.
- Currencies use fixed demo rates, so a price reads the same on every visit.

The controls are search params (`?billing=monthly&seats=25&currency=EUR`), so a quote is a
link. `parsePricingSettings()` drops any value that is not a valid choice.

The feature comparison is an antd `Table` with a sticky header and group rows that span every
column. Below `lg` four plan columns do not fit a phone, so it becomes one plan at a time,
picked with a `Segmented`, in the same groups.

## Testing

- `data/saas.test.ts` covers monthly and yearly totals, the savings, the seat minimum and cap,
  the recommendation, currency conversion and formatting, and reading the address.
- `pages/SaasPages.test.tsx` covers the landing page, the link to pricing, switching the
  billing cycle, changing the team size, currency from the address, the phone comparison list
  and the Turkish copy.
