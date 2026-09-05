# 011 — React Router and the Admin Demo

The application uses React Router `8.3.1` and its data-router API to provide a realistic, responsive administration console.

## Installation

```bash
pnpm add react-router@latest
```

## Route structure

The router is created outside the React tree in `src/router/router.tsx`, as recommended by React Router. `RouterProvider` is mounted in `src/main.tsx`.

```text
/
├── /             Standalone product landing page
├── /login        Sign-in example
├── /register     Account registration example
├── /otp          One-time-code verification example
├── /dashboard    Operational metrics, chart, health, and activity
├── /components   Interactive Ant Design component examples
├── /survey       Survey form with several question types
├── /settings     Language, theme, and density preferences
└── *             Friendly not-found page
```

`LandingPage.tsx` owns `/` and remains separate from the administration shell. The authentication examples are standalone routes and share `AuthPageLayout`. Their cards are centered independently of the document flow, with no application navbar or footer; only language and color-mode controls remain in the top corner. `App.tsx` is the shared layout for the administration routes. Its `<Outlet />` renders the active child route while the navigation, header, and footer remain mounted. Route failures have a dedicated recovery screen.

Every page module is loaded on demand with React `lazy`. A route-level `Suspense` boundary renders a centered Ant Design spinner while its chunk loads. See document 016 for the implementation and extension checklist.

Unknown URLs render an Ant Design `Result` with status `404` and a router-powered return action. This keeps the recovery experience consistent with the rest of the component system without forcing a full page reload.

Use `Link` for normal links and `useNavigate` for navigation initiated by component behavior. Tests use `createMemoryRouter`, which keeps routing deterministic without changing the browser URL.

## Adding a page

1. Create the page under `src/pages`.
2. Declare a top-level lazy import and add the page to the exported `routes` array.
3. Add its label and title to both language dictionaries in `src/i18n/messages.ts`.
4. Add a matching navigation item in `App.tsx`.
5. Add a route-level test.

In production, the web server must rewrite unknown application paths such as `/settings` to `index.html`; otherwise refreshing a nested route can return a server 404.

## References

- [React Router: Data mode installation](https://reactrouter.com/start/data/installation)
- [React Router: RouterProvider](https://reactrouter.com/api/data-routers/RouterProvider)
- [React: lazy](https://react.dev/reference/react/lazy)
- [React: Suspense](https://react.dev/reference/react/Suspense)
