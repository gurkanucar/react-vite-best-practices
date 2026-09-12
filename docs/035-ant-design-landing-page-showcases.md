# Ant Design landing page showcases

This feature demonstrates that a product can keep Ant Design as its interaction layer while presenting very different public-facing brands. The examples are deliberately complete enough to show page hierarchy, responsive behavior, navigation, calls to action, forms, and editorial content—not just a hero mockup.

## Routes

Each example has two route families:

| Admin preview                              | Standalone website                       |
| ------------------------------------------ | ---------------------------------------- |
| `/showcases/technopark`                    | `/preview/technopark`                    |
| `/showcases/dental-clinic`                 | `/preview/dental-clinic`                 |
| `/showcases/corporate`                     | `/preview/corporate`                     |
| `/showcases/corporate/news`                | `/preview/corporate/news`                |
| `/showcases/corporate/news/:slug`          | `/preview/corporate/news/:slug`          |
| `/showcases/corporate/announcements`       | `/preview/corporate/announcements`       |
| `/showcases/corporate/announcements/:slug` | `/preview/corporate/announcements/:slug` |

The admin route renders a normal `PageHeader` with an **Open in a new tab** action. The `/preview` route skips `App.tsx` entirely, so the admin sidebar, header, and footer are never mounted. The public website keeps only its own site header and content.

## Feature structure

The implementation is isolated under `src/features/showcases`:

```text
showcases/
├── components/   # Preview frame and shared public-site shells
├── data/         # News and announcement content
├── pages/        # Landing, listing, and detail route components
├── showcases.css # Public-site layout and responsive identities
├── types.ts
└── index.ts
```

Publications share one typed `Publication` model and route machinery, but intentionally use two different visual examples:

- **News** keeps Northstar's warm, editorial corporate design. Its first item is presented as the lead story.
- **Announcements** use Aurora Tech Park's modern navy, cobalt, and cyan identity with a campus status summary and denser card grid.

This is enough reuse to prevent duplicate data and routing logic without forcing unrelated brands into the same visual template.

## Publication content and pagination

Both collections contain ten bilingual records and show six records per page. Ant Design's `Pagination` component synchronizes the selected page with the URL:

```text
/preview/corporate/news?page=2
/preview/corporate/announcements?page=2
```

Keeping `page` in the URL makes a result page bookmarkable, shareable, and compatible with browser back/forward navigation. Page `1` removes the parameter to keep the canonical URL clean. Invalid or out-of-range values fall back to the nearest valid page in the UI.

The shared `Publication` type supports these optional fields:

```ts
interface Publication {
  coverImage?: PublicationImage
  tags?: LocalizedText[]
  attachments?: PublicationAttachment[]
  gallery?: PublicationImage[]
}
```

Optional means the list and detail pages must never assume that a cover, gallery, or attachment exists. A missing news cover leaves the editorial card text-only; a missing announcement cover uses a restrained Aurora placeholder. Galleries use Ant Design `Image.PreviewGroup`, so selecting an image opens the built-in preview. Attachment buttons point to real static files and use the browser's download behavior.

Small, local SVG illustrations live in `src/features/showcases/assets`. Example downloadable files live in `public/showcase-attachments`. Production content would normally replace both with asset URLs returned by an API or CMS.

## The tech park: a landing page with three routes behind it

`/preview/technopark` grew past a single page, and the three additions are each worth a note.

### News first, and not every item has a picture

The updates section sits directly under the hero, ahead of the metrics band. A visitor to a
campus site is usually there to find out what is happening, and asking them to scroll past
four statistics to reach it gets that backwards.

`CampusUpdate.image` is optional, because a real newsroom has a photograph for the building
opening and nothing at all for the maintenance notice. Four of the six entries carry one and
two do not. A card with no image renders a stand-in rather than simply losing its top: in a
three-column row, a shorter card reads as a mistake, and the stand-in also says plainly that
there is no picture instead of pretending to be one.

### A marquee whose halves are identical

The company strip on the landing page is decoration with a job: it says the campus is full
without asking anyone to read forty-two names. It is a CSS marquee, and the one detail that
matters is that the track holds two groups of the same width. The animation travels exactly
`-50%`, so the jump back to `0` has to land on an identical frame. An earlier version put the
list and one copy directly in a flexbox with `gap`, and the gap between the two halves
belonged to neither of them — the loop drifted by half a gap every cycle. Each group now
carries its own trailing space and the track itself has no gap.

Hovering pauses it, which is what makes the names inside it clickable at all. Under
`prefers-reduced-motion: reduce` the animation is dropped and the strip becomes an ordinary
horizontal scroller, so it is never a dead end.

### Paging by scroll position

The full directory is its own route, `/companies`, because forty-two cards do not belong on a
landing page. `useInfiniteList` reveals nine at a time.

Two decisions in that hook are deliberate:

```ts
if (renderedItems !== items) {
  setRenderedItems(items)
  setVisibleCount(pageSize)
}
```

Narrowing by sector hands the hook a different array, and the reader expects the top of a
fresh result rather than nine rows into it. Adjusting during render rather than in an effect
means the first paint already shows the right slice — the same pattern the admin sider uses
for its open sections.

The sentinel is a real `Button`, not an empty `div`. An observer alone would strand anyone
navigating by keyboard or screen reader at the ninth row with no way forward, and it also
means the list still works under jsdom, where `IntersectionObserver` does not exist — which
is how the paging is tested. The observer is rebuilt after each page on purpose: an observer
reports a crossing, not a state, so one that stayed mounted would go quiet after the first
page on a screen tall enough that the sentinel never leaves the viewport.

### Sector prose, company facts

Every company has a detail route. The description on it is written per sector, not per
company: forty-two hand-written biographies would go stale the day the directory grows, and a
demo that invents a paragraph per row teaches the wrong lesson. What makes each page its own
is the company's facts — stage, size, year founded, year it moved onto the campus, building,
open roles — and the list of its neighbours in the same sector, which is navigation the data
already supports.

## Ant Design boundaries

Buttons, cards, typography, grid, forms, tags, avatars, statistics, breadcrumbs, empty states, and spacing primitives come from Ant Design. Scoped CSS is responsible only for brand composition: page layout, art direction, section backgrounds, and responsive changes. It does not replace Ant Design's control behavior.

Each public site has a nested `ConfigProvider`. This keeps its brand color and light editorial canvas stable even when the surrounding admin preview uses another visual theme or dark mode. It also prevents a showcase from leaking tokens back into the application shell.

## Adding another showcase

1. Add a lazy page export in `src/router/LazyPages.tsx`.
2. Add its admin and `/preview` routes in `src/router/router.tsx`.
3. Add an entry to the `showcases` section in `src/router/navigation.tsx`.
4. Wrap the page in `ShowcasePreviewFrame`; pass the clean `/preview` URL as `standalonePath`.
5. Keep data local to the feature, and add a service only if real business rules or API orchestration appear.
6. Test both URL families so internal links cannot accidentally jump from a standalone site back into the admin shell.

All showcase pages are imported with `React.lazy`, and both route families use the existing `RouteSuspense` loading fallback.
