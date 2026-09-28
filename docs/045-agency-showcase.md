# 045 — Creative agency portfolio

`/showcases/agency` is the site of **Oda Studio**, an invented brand and digital studio in
Istanbul and Berlin. It is the most art-directed of the showcases: an agency is judged on
craft, so the site leans on editorial type, a restrained palette and motion rather than on
stock components. Every page has a standalone twin under `/preview/agency`.

## Routes

| Route                            | Page                  | What it shows                                                   |
| -------------------------------- | --------------------- | --------------------------------------------------------------- |
| `/showcases/agency`              | `AgencyHomePage`      | Hero, reel, client marquee, work, services, process, team, CTA  |
| `/showcases/agency/work`         | `AgencyWorkPage`      | The portfolio, filtered by discipline from the address          |
| `/showcases/agency/work/:caseId` | `AgencyCaseStudyPage` | One case study: story, gallery, before/after slider, results    |
| `/showcases/agency/contact`      | `AgencyContactPage`   | A project brief form, the studios and an intro-call slot picker |

`AgencySiteShell` wraps every page: the admin preview frame (unless standalone), the shared
`PublicSiteShell` header and a dark footer with the studio wordmark. Its "open in a new tab"
link keeps the page's address, so a filtered portfolio opens filtered. It is imported by path,
not from `components/index.ts`.

## Look

- **Type.** Headings are set in the system serif (`ui-serif`, which is New York on Apple
  devices) against the sans body, with one italic word in the accent colour. The repository
  loads no web fonts, so the stack falls back to Georgia-like serifs elsewhere.
- **Colour.** Warm paper, near-black ink and one vermilion accent. Sections alternate between
  paper, a darker tint and ink.
- **Sizing from the container.** Big type is sized in `cqi` against the site's own width
  (`main` is a size container), not the window's, because the site also sits beside the
  admin sidebar. Headings never break inside a word; the sizes are chosen so the longest
  Turkish word ("tasarlıyoruz.") fits a 320px phone.
- **Pictures are drawn.** `AgencyArtwork` renders one of eight SVG compositions (orbit, grid,
  wave, type, stack, sun, bars, petal) in a project's palette. It uses
  `preserveAspectRatio="xMidYMid slice"`, so one artwork fills a portrait card, a wide cover
  and the comparison slider alike. There are no photographs and no real brands or people.

## Motion

- `useAgencyReveal` adds `is-revealed` the first time an element scrolls into view, and
  `agency.css` fades and lifts it in. Content is hidden **only** under
  `prefers-reduced-motion: no-preference`, so nothing depends on the observer firing.
- The client marquee runs two copies of the list (the second `aria-hidden`) for a seamless
  loop, pauses on hover and is clipped by its own viewport so it never widens the page.
- On a pointer device a work card eases its artwork in and a round "View" badge follows the
  cursor through two CSS variables. On touch the card is a plain link.
- Filtering the portfolio re-keys the grid, so the new set plays a staggered entrance.
- Under reduced motion every animation and transition is off, and the marquee becomes a
  wrapped list.

## Work grid

The grid is twelve columns alternating **7 / 5** and **5 / 7**, with the second card of each
row set lower. Wide columns take landscape artwork and narrow ones portrait, decided by
position rather than by project, so any filtered subset still interlocks. Below 760px of
site width it is one column of square cards.

The filter is `?discipline=`: `parseDiscipline` drops anything that is not one of the five,
and changing it replaces the history entry without scrolling.

## Case study

- Meta row, full-bleed cover, then challenge / approach / result as a two-column story.
- **Before and after.** `AgencyCompare` stacks the old identity over the new one and clips it
  with `clip-path`. The control is a native `<input type="range">` stretched over the whole
  frame and made invisible, so dragging anywhere, clicking and the arrow keys all come from
  the browser; the round handle only shows the position. `aria-valuetext` reads both halves.
- Results in the project's accent colour, the client quote, credits, and a full-width link
  to the next project (`nextCase` wraps from the last to the first).
- An unknown id shows a not-found page with a link back to the work.

A new page starts at its top, and a nav link like "Services" lands on its section. In the
admin preview the layout scrolls rather than the window, so the shell scrolls an element into
view, and repeats it for a section once the page has settled.

## Contact

- The brief form asks for services (checkbox chips, at least one), a budget band (radio
  chips), a start date, details of at least 30 characters, optional files and consent. Files
  go through `Upload` with `beforeUpload={() => false}`: only their names are kept.
- Sending shows a summary of what was asked for, with a way to start another brief.
- **Intro call.** `callSlots(now)` offers five weekdays starting tomorrow, at five fixed
  times. Whether a slot is already booked is derived from its date and time
  (`isSlotTaken`), so the same slots are taken on every visit.

All text is in `data/agencyCopy.ts`, in English and Turkish; the portfolio itself is in
`data/agency.ts` and the rules in `data/agencyLogic.ts`.

## Testing

- `data/agency.test.ts` covers the discipline filter and counts, next-project wrapping, and
  the call slots: weekends skipped, never today, and the same slots taken on every visit.
- `pages/AgencyPages.test.tsx` covers the home page, testimonials and reel, the admin frame,
  filtering from a click and from the address, the case study and its slider, the not-found
  page, the brief's validation and summary, and booking a call.

jsdom's `IntersectionObserver` never fires; the reveal only fades content, so it is all in
the document for the tests.
