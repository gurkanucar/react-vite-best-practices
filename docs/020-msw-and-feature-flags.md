# 020 — MSW and Feature Flags

This project deliberately runs mocked and real APIs side by side in development:

- post requests are handled by Mock Service Worker;
- product requests continue to the real DummyJSON API;
- production builds use the real configured services and do not start MSW.

## Why MSW

MSW intercepts requests at the network boundary instead of replacing the application's API client. Pages, TanStack Query hooks, services, and API modules therefore run unchanged. The same handlers can be used by the browser and Node-based integration tests.

## Structure

```text
public/
└── mockServiceWorker.js
src/
├── config/
│   ├── env.ts
│   └── featureFlags.ts
├── features/posts/mocks/
│   ├── index.ts
│   └── postsHandlers.ts
└── mocks/
    ├── browser.ts
    ├── handlers.ts
    └── server.ts
```

Feature-owned handlers stay with the feature. `src/mocks/handlers.ts` is the application-level composition point. `browser.ts` starts those handlers through a Service Worker; `server.ts` exposes the same behavior to Vitest through MSW's Node integration.

The generated `public/mockServiceWorker.js` file must be committed because every developer's browser needs it. Regenerate it after an MSW upgrade with:

```bash
pnpm exec msw init public
```

Because the file lives in `public/`, Vite copies it into every build output. The worker only
ever starts in the dev server, so the `exclude-mock-service-worker` plugin in `vite.config.ts`
removes it after the build and no mocking code reaches production.

## Mixed real and mocked requests

The worker starts with:

```ts
await worker.start({ onUnhandledRequest: 'bypass' })
```

Only registered post routes are intercepted. An unmatched request, such as `https://dummyjson.com/products`, bypasses MSW and reaches the real network. This makes the boundary explicit: adding MSW does not mean every request must be mocked.

The post handlers keep an in-memory list and behave like a real list endpoint: `GET /posts`
narrows by search text, categories, authors, and view-count and date ranges, then sorts, then
applies the limit. `GET /posts/categories` serves the filter options. `POST`, `PUT`, and
`DELETE` mutate the same list, so a created or edited post appears in the following mocked list
request. Reloading the browser resets this temporary data.

Because the mock API implements filters the real ones do not, the flag gates the list page's
filter panel as well as the worker. See [023](023-table-actions-and-filters.md).

Ant Design ships its own strings — date picker placeholders, empty-table text, pagination —
which the locale files do not cover. `AppThemeProvider` passes the matching component locale to
`ConfigProvider` and sets the dayjs locale, so those follow the selected language too.

## What a feature flag is

A feature flag is a named switch around optional application behavior. It lets environments enable a capability independently from the source code:

```ts
export const FEATURE_FLAGS = Object.freeze({
  assistant: env.assistantEnabled,
  mockPostsApi: env.mockPostsApi,
  mockAssistantApi: env.mockAssistantApi,
})
```

The posts mock flag is supplied through:

```dotenv
VITE_FEATURE_MOCK_POSTS_API=true
```

`src/main.tsx` checks both development mode and this flag before dynamically importing the browser worker:

```ts
if (import.meta.env.DEV && isFeatureEnabled('mockPostsApi')) {
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

This flag answers “should this build use the mocked posts backend?” It is not a user setting like language or theme, so it must not be stored in Zustand.

The assistant demonstrates why a product capability and a transport choice must be separate:

```dotenv
VITE_FEATURE_ASSISTANT=true
VITE_FEATURE_MOCK_ASSISTANT_API=true
```

`VITE_FEATURE_ASSISTANT` controls whether the route and navigation entry exist. `VITE_FEATURE_MOCK_ASSISTANT_API` controls whether MSW supplies its endpoint. The same assistant can therefore be enabled against a real production API without pretending that “mock enabled” means “feature enabled.” The worker starts for the assistant only when both switches are on.

## Build-time versus runtime flags

Vite environment flags are build-time flags. Their values are embedded into the generated JavaScript. Changing a deployed value requires a new build.

Use this approach for environment capabilities, gradual development integration, and optional modules whose value is known at build time. If product managers must change a flag without rebuilding, load a runtime flag document from a backend and cache it with TanStack Query instead.

Feature flags are not authorization. Hiding a button cannot protect a backend operation; the server must still enforce permissions.

## Adding another flag

1. Add a `VITE_FEATURE_*` value to every relevant environment file and `.env.example`.
2. Declare the raw string in `src/vite-env.d.ts`.
3. Parse and validate it in `src/config/env.ts`.
4. Expose the named boolean from `src/config/featureFlags.ts`.
5. Gate the smallest meaningful behavior, not an entire unrelated application tree.
6. Test both enabled and disabled decisions.
7. Document when the temporary flag should be removed.

## Testing

`postsApi.msw.test.ts` proves that the actual API and service modules work against reusable MSW handlers without replacing `fetch`. Other focused component tests may continue to use small direct mocks when that is simpler.

## References

- [Mock Service Worker](https://mswjs.io/)
- [Vite environment variables and modes](https://vite.dev/guide/env-and-mode)
