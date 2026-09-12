# 017 — TanStack Query, API Access, and Cache Keys

This project uses TanStack Query v5 for remote server state and keeps each API domain in a feature-based package. The `/posts` page uses JSONPlaceholder for queries, mutations, and invalidation; `/products` uses DummyJSON to demonstrate a second API origin and paginated cache entries.

## What belongs where

```text
src/
├── app/providers/
│   └── QueryProvider.tsx
├── lib/
│   ├── api/api-client.ts
│   └── query/query-client.ts
└── features/
    ├── posts/
    │   ├── api/posts-api.ts
    │   ├── model/post.ts
    │   ├── mutations/use-create-post-mutation.ts
    │   ├── pages/PostsPage.tsx
    │   └── queries/
    └── products/
        ├── api/products-api.ts
        ├── model/product.ts
        ├── pages/ProductsPage.tsx
        └── queries/
```

- `lib/api` owns transport concerns shared by every feature: base URL, query strings, JSON bodies, response parsing, and HTTP errors.
- `lib/query` owns application-wide TanStack Query defaults.
- `app/providers` connects one stable `QueryClient` to React.
- Each package under `features` owns its domain contract, endpoints, cache identities, operations, and UI.
- A feature may import shared `lib` code. Shared code must not import a feature.

## Installation and provider

Install the current package with pnpm:

```bash
pnpm add @tanstack/react-query
```

`QueryProvider` wraps the router near the application root. The `QueryClient` is created outside render, so rerenders do not discard the cache:

```tsx
<QueryProvider>
  <AppThemeProvider>
    <RouterProvider router={router} />
  </AppThemeProvider>
</QueryProvider>
```

The project sets a one-minute `staleTime`, retries failed queries once, and does not retry mutations. These are application defaults; a specific query can override them when its domain needs different behavior.

## Shared API client

Feature code calls `apiRequest` instead of repeating `fetch` setup:

```ts
return apiRequest<Post[]>('/posts', {
  query: { _limit: filters.limit },
  signal,
})
```

The client defaults to `env.apiBaseUrl`, accepts a feature-specific `baseUrl`, omits empty query parameters, serializes JSON bodies, and throws `ApiError` for non-successful HTTP responses. Throwing is important because TanStack Query treats a rejected promise as an error. The `AbortSignal` supplied by a query function is passed through to `fetch`, allowing obsolete requests to be cancelled.

`VITE_API_BASE_URL` is public browser configuration, not a secret. The demo environment files point to:

```dotenv
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_DUMMYJSON_API_BASE_URL=https://dummyjson.com
```

Replace this value for a real backend without changing feature code.

## Query keys are feature constants

Do not scatter string arrays such as `['posts']` across components. The post feature exposes a hierarchical key factory:

```ts
export const postQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...postQueryKeys.all, 'list'] as const,
  list: (filters: PostListFilters) => [...postQueryKeys.lists(), filters] as const,
  details: () => [...postQueryKeys.all, 'detail'] as const,
  detail: (postId: number) => [...postQueryKeys.details(), postId] as const,
}
```

The hierarchy creates useful invalidation scopes:

```ts
// Every post query, including lists and details
await queryClient.invalidateQueries({ queryKey: postQueryKeys.all })

// Every filtered post list, but no post details
await queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })

// Only the list with these filters
await queryClient.invalidateQueries({
  queryKey: postQueryKeys.list({ limit: 10 }),
  exact: true,
})

// Only one post detail
await queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) })
```

Any feature that changes post data can import this factory. It does not need to know which pages currently consume the data.

## Reusable query options

`queryOptions` keeps the key and function together with end-to-end type inference:

```ts
export function postsQueryOptions(filters: PostListFilters) {
  return queryOptions({
    queryKey: postQueryKeys.list(filters),
    queryFn: ({ signal }) => getPosts(filters, signal),
  })
}
```

The same options can be used by `useQuery`, route prefetching, tests, or direct `QueryClient` operations:

```ts
const postsQuery = useQuery(postsQueryOptions({ limit: 10 }))

await queryClient.prefetchQuery(postsQueryOptions({ limit: 10 }))
```

Every variable used by the request must be represented in the query key. Two different filters must not accidentally share one cache entry.

## Mutation-driven invalidation

The create mutation owns the rule that creating a post makes every cached post list stale:

```ts
export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: postMutationKeys.create,
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
    },
  })
}
```

This is the “one place changes another place” case: the mutation can run in a form, modal, or another route, while every active post list using the matching key is refreshed automatically. Put domain-wide invalidation in the mutation hook rather than duplicating it in button handlers.

For a mutation that returns the complete updated entity, update that detail cache directly and invalidate only affected collections:

```ts
queryClient.setQueryData(postQueryKeys.detail(updated.id), updated)
await queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
```

## JSONPlaceholder limitation

JSONPlaceholder accepts `POST`, `PUT`, `PATCH`, and `DELETE` requests but simulates them. The response looks successful, yet the server does not persist the change. Therefore, the demo create button proves the mutation and cache-invalidation flow, but the refetched public list will not contain the created post.

## TanStack Query versus Zustand

Use TanStack Query for server-owned asynchronous data:

- API responses and request status
- caching, deduplication, retries, refetching, and invalidation
- mutations that synchronize remote resources

Use Zustand for client-owned application state:

- language and theme preferences
- local workflow state shared between routes
- values that are not fetched from a server

Do not copy successful query results into Zustand. That creates two sources of truth and bypasses TanStack Query's cache lifecycle.

## Adding another API feature

1. Create `src/features/<feature>/model` types.
2. Add endpoint functions under `api` using `apiRequest`.
3. Add one query-key factory for the domain.
4. Co-locate reusable `queryOptions` with that factory.
5. Put invalidation rules in mutation hooks.
6. Build loading, error, empty, success, and background-refresh states in the page or component.
7. Add API-client, key-factory, and user-flow tests.
8. Add the page through `LazyPages.tsx` so route code remains lazy-loaded.

## Verification

```bash
pnpm check
pnpm build
```

Tests mock `fetch`; they must not depend on public internet availability or modify either demo service.

## References

- [TanStack Query installation](https://tanstack.com/query/latest/docs/framework/react/installation)
- [QueryClientProvider](https://tanstack.com/query/latest/docs/framework/react/reference/functions/QueryClientProvider)
- [Query options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Query invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [Query functions and cancellation signals](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
- [JSONPlaceholder guide](https://jsonplaceholder.typicode.com/guide/)
- [DummyJSON products](https://dummyjson.com/docs/products)
