# 018 — Multiple API Services and Paginated Products

The `/products` route adds DummyJSON as a second public API. Its purpose is to show how one frontend can use multiple service origins without hard-coding URLs inside components or mixing cache identities between domains.

## Environment configuration

Each service receives a descriptive public base URL:

```dotenv
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_DUMMYJSON_API_BASE_URL=https://dummyjson.com
```

Both keys are declared in `src/vite-env.d.ts`, required and normalized in `src/config/env.ts`, supplied in every `.env.[mode]` file, and represented in `.env.example`.

These values are shipped to the browser. They may contain public service origins, but never private API keys or credentials.

## Selecting a base URL per feature

`apiRequest` uses the primary API by default:

```ts
apiRequest<PostDto[]>('/posts')
```

A feature that belongs to another service supplies its normalized origin:

```ts
apiRequest<ProductListResponseDto>('/products', {
  baseUrl: env.dummyJsonApiBaseUrl,
  query: { limit, skip },
})
```

Transport behavior remains shared while ownership of the service selection stays inside the feature API module. UI components never assemble origins or call `import.meta.env` directly.

## Product feature package

```text
src/features/products/
├── api/
│   ├── index.ts
│   └── productsApi.ts
├── hooks/
│   ├── index.ts
│   └── useProductsQueries.ts
├── pages/
│   ├── index.ts
│   └── ProductsListPage.tsx
├── types/index.ts
└── index.ts
```

The API request uses DummyJSON's `select` parameter to request only the fields displayed by the table. This reduces unnecessary response data while keeping the response contract explicit.

## Server-side pagination keys

DummyJSON supports `limit` and `skip`. Both values affect the response, so both must be included in the cache key:

```ts
PRODUCT_QUERY_KEYS.list({ limit: 10, skip: 20 })
// ['products', 'list', { limit: 10, skip: 20 }]
```

Page 1 and page 2 then occupy different cache entries. Returning to an already loaded page can use cached data while its freshness policy remains valid.

`keepPreviousData` is used as placeholder data. During a page change, the previous table remains available while the next page loads instead of being replaced by an empty layout.

## Invalidation scopes remain independent

The product feature owns a separate key root:

```ts
await queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
```

This invalidates all paginated product lists without touching JSONPlaceholder post queries. To invalidate only the current page:

```ts
await queryClient.invalidateQueries({
  queryKey: PRODUCT_QUERY_KEYS.list({ limit: 10, skip: 20 }),
  exact: true,
})
```

Do not create one generic key such as `['api-data']` for unrelated services. Cache roots should describe domain data, not the transport used to fetch it.

## UI states

`ProductsListPage` provides:

- translated loading, error, empty, and success states;
- an Ant Design table and server-backed pagination;
- a visible current cache key for learning and debugging;
- background refetch feedback;
- a button that invalidates all product-list cache entries.

The route is registered through `LazyPages.tsx`, so the product feature remains in a separate production chunk until `/products` is opened.

## Testing

Tests mock `fetch` and verify:

- the feature-specific DummyJSON origin;
- pagination parameters and cache keys;
- switching pages creates a request with the next `skip` value;
- API tests never depend on the public service being online.

## References

- [DummyJSON products documentation](https://dummyjson.com/docs/products)
- [DummyJSON pagination](https://dummyjson.com/docs#pagination)
- [TanStack Query paginated queries](https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries)
