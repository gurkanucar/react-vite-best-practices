# 016 — Route Lazy Loading and Suspense

The application keeps route definitions lightweight and downloads each page implementation only when that route is first rendered. React `lazy`, dynamic `import()`, and route-level `Suspense` boundaries provide this behavior without changing the React Router data-router architecture.

## Why pages are split

A static page import places that page and its dependencies in the initial application graph. This becomes expensive as dashboards, charts, forms, and component catalogs grow. A dynamic import gives Vite a code-splitting boundary, so production builds emit separate page chunks that the browser can request on demand.

The shared shell, active page, and loading state have different jobs:

```text
RouterProvider
├── standalone route Suspense → full-page spinner → landing or auth page
└── admin layout Suspense      → full-page spinner → App + persistent shell
    └── child route Suspense   → content spinner   → dashboard/components/survey/settings/404
```

Keeping a second boundary around each admin child lets the sidebar, header, and footer remain mounted while a newly selected page chunk loads.

## Declaring a lazy page

Declare lazy components at module scope. Do not create them inside a component because that creates a new component type during rendering and can reset state.

Pages in this project use named exports, so the dynamic module is adapted to the default shape expected by `lazy`:

```tsx
import { lazy } from 'react'

const SurveyPage = lazy(async () => ({
  default: (await import('@/pages/SurveyPage')).SurveyPage,
}))
```

Import the concrete page module, not a feature barrel:

```tsx
const PostDetailPage = lazy(async () => ({
  default: (await import('@/features/posts/pages/PostDetailPage')).PostDetailPage,
}))
```

Importing `@/features/posts/pages` makes the barrel load every page it re-exports. The list, detail, and edit routes then collapse into the same chunk even though each call uses `lazy`. Barrels remain useful to expose a feature API to normal consumers; route boundaries must point at the leaf page file.

If a page uses a default export, the shorter form is enough:

```tsx
const AdminLayout = lazy(() => import('@/App'))
```

## Adding the Suspense boundary

`RouteSuspense` wraps each lazy element with a shared loading experience:

```tsx
export function RouteSuspense({ children, fullPage = false }: RouteSuspenseProps) {
  return <Suspense fallback={<RouteLoading fullPage={fullPage} />}>{children}</Suspense>
}
```

Standalone routes use the full-page variant:

```tsx
{
  path: '/login',
  element: (
    <RouteSuspense fullPage>
      <LoginPage />
    </RouteSuspense>
  ),
}
```

Admin child routes use the content-area variant:

```tsx
{
  path: 'survey',
  element: (
    <RouteSuspense>
      <SurveyPage />
    </RouteSuspense>
  ),
}
```

`RouteLoading` uses Ant Design `Spin`, reads its status text from the active locale, has a live-region status for assistive technology, and is centered by application layout CSS. It contains no artificial delay: on a fast connection the fallback may appear only briefly or not be perceptible.

## What Suspense covers

This setup activates when React waits for lazy component code. It does not automatically track arbitrary requests started in an effect or click handler. Data loading needs a Suspense-enabled data source or an explicit loading state appropriate to that request.

Rejected dynamic imports propagate to the nearest error boundary. The route tree therefore keeps `errorElement` recovery screens alongside its Suspense loading states.

## Testing lazy routes

Dynamic imports resolve asynchronously, so route tests use React Testing Library's asynchronous queries:

```tsx
expect(await screen.findByRole('heading', { name: 'Product feedback survey' })).toBeInTheDocument()
```

Use `findBy...` for the first assertion after initial rendering or navigation. Once that page is visible, synchronous `getBy...` queries are suitable for elements already on the page.

## Adding another lazy route

1. Create the page in `src/pages`.
2. Add its top-level `lazy` declaration in `src/router/LazyPages.tsx` and import the concrete page file.
3. Add the route and wrap its element with `RouteSuspense`.
4. Choose `fullPage: true` for standalone pages and the default for admin children.
5. Add navigation and both locale entries when the route is user-facing.
6. Add a route test using an asynchronous first query.
7. Run `pnpm check` and `pnpm build`.
8. Inspect `dist/assets` or the browser Network panel to confirm that Vite emitted and requested a separate page chunk.

## References

- [React: lazy](https://react.dev/reference/react/lazy)
- [React: Suspense](https://react.dev/reference/react/Suspense)
- [React Router: createBrowserRouter](https://api.reactrouter.com/v8/functions/react-router.createBrowserRouter.html)
- [Vite: Dynamic import](https://vite.dev/guide/features.html#dynamic-import)
