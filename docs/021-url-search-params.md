# 021 — URL Search Parameters for List State

Both list pages keep their server-side list state in the URL. Other pages may use local state when their values do not need to survive navigation or sharing.

## Result

```text
/products?category=laptops&sort=price&order=desc&page=2
/posts?categories=tables,routing&minViews=1000&from=2026-03-01&sort=views&order=desc
```

Each URL fully describes the visible list state:

- `q` selects the DummyJSON search endpoint; `category` selects the category endpoint;
- `page=2` produces `skip=10` with a page size of ten;
- `sort` and `order` become the `sortBy` and `order` request parameters;
- every value contributes to the TanStack Query cache key.

Refreshing, opening the URL in another tab, or using browser back/forward therefore restores the same list state.

## Sorting and filtering are requests, not table state

Ant Design's `Table` can sort and filter rows on its own, but with server-side pagination it would only reorder the page already in memory. Both tables therefore pass the change on rather than applying it:

```ts
const updateSort: TableProps<PostDto>['onChange'] = (_pagination, _tableFilters, sorter) => {
  const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter
  const sortedField = activeSorter?.order ? String(activeSorter.columnKey) : null

  updateFilters(
    sortedField && isPostSortField(sortedField)
      ? { sort: sortedField, order: activeSorter?.order === 'descend' ? 'desc' : 'asc' }
      : { sort: undefined, order: undefined },
  )
}
```

The column's `sortOrder` is then read back from the URL, so the arrow in the header and the request that was actually sent can never disagree.

## Returning to a filtered list

A detail page opened from a row carries the list's query string in the navigation state, so the back button restores the filtered page instead of dropping the reader on page one:

```tsx
<Link to={`/products/${product.id}`} state={{ listSearch: searchParams.toString() }}>
```

## URL as the source of truth

`ProductsListPage` reads values through React Router's `useSearchParams`. It does not keep a second `page` state in `useState`:

```ts
const [searchParams, setSearchParams] = useSearchParams()
const pageParam = Number(searchParams.get('page'))
const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
const search = searchParams.get('q')?.trim() ?? ''
```

Updating a filter creates a fresh `URLSearchParams` instance and resets pagination:

```ts
const nextParams = new URLSearchParams(searchParams)
nextParams.set('q', nextSearch)
nextParams.delete('page')
setSearchParams(nextParams)
```

Page one is omitted from the URL because it is the default. Empty search text removes `q` instead of leaving `?q=`.

## Cache identity

The API filter object contains `limit`, `skip`, and every optional filter and sort value. `PRODUCT_QUERY_KEYS.list(filters)` includes the entire object, so unrelated searches, categories, sort orders, and pages never share the same cache entry.

Do not copy URL-controlled values into Zustand. The URL already provides persistence, sharing, and navigation history. Zustand remains appropriate for application preferences that should not change the route, such as language and theme.

## When not to use URL state

Use URL search parameters for values users may bookmark, share, refresh, or navigate back to. Keep temporary presentation state local for values such as an open dropdown, a hovered row, or an unfinished modal field.

`usePostFilterParams` shows the same pattern extracted into a hook once a page has more than a couple of parameters: it reads every filter out of the URL, exposes one `updateFilters` patch function, and keeps no mirrored copy in `useState`.

## Reference

- [React Router `useSearchParams`](https://reactrouter.com/api/hooks/useSearchParams)
