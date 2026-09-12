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

Publications share one typed `Publication` model. News and announcements use the same list/detail machinery but keep separate data sets and route namespaces. This is enough reuse to prevent duplicate templates without creating a generic page-builder abstraction.

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
