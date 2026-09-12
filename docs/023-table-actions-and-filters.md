# 023 — Table Actions and Filters

The two list pages deliberately solve the same problems differently, so each trade-off has a
working example to compare against rather than a rule to memorize.

|                       | Posts                                      | Products               |
| --------------------- | ------------------------------------------ | ---------------------- |
| API                   | MSW handlers                               | Real DummyJSON service |
| Row actions           | Five, in an overflow menu                  | Two, inline            |
| Filter options        | Categories fetched, authors hardcoded      | Categories fetched     |
| Filtering and sorting | Server-side                                | Server-side            |
| Detail route          | `/posts/:postId` and `/posts/:postId/edit` | `/products/:productId` |

## Row actions

Five actions do not fit a table row, so the posts table collapses them behind a single
three-dot button and keeps the column 96 pixels wide:

```tsx
<Dropdown trigger={['click']} menu={{ items: actionItems(post) }}>
  <Button aria-label={messages.posts.actions} icon={<MoreOutlined aria-hidden="true" />} />
</Dropdown>
```

The products table has two actions, which fit, so hiding them behind a menu would only add a
click. They stay inline.

Destructive actions ask first. `modal.confirm` from `App.useApp()` is used rather than the
browser's `confirm`, so the dialog is themed, translated, and does not block the page.

### Show versus quick show

"Show" and "Edit" navigate to a route, so the address bar can be copied, bookmarked, and
reloaded. "Quick show" and "Quick edit" open a modal and a drawer over the list, so the reader
keeps their filters and scroll position. Both read the same detail query, so whichever is
opened first warms the cache for the other.

## Where filter options come from

Options belong to whoever owns the values:

```ts
// The server owns categories, so they are fetched and cached on their own key.
export function postCategoriesQueryOptions() {
  return queryOptions({
    queryFn: ({ signal }) => getPostCategories(signal),
    queryKey: POST_QUERY_KEYS.categories(),
    staleTime: 60 * 60 * 1000,
  })
}

// Authors are a closed set the client already knows, so they stay constants.
export const POST_AUTHOR_OPTIONS = [1, 2, 3, 4] as const
```

Deriving options from the rows currently on screen is the tempting third option and the wrong
one under server-side pagination: the reader would only ever be offered the values that happen
to be on the current page.

## Two places, one state

The posts table offers its category filter twice: in the panel above the table and in the
column header. Neither holds a copy of the selection — both read and write the same `categories`
search parameter through `usePostFilterParams`, so they cannot drift apart:

```tsx
filters: (categoriesQuery.data ?? []).map((category: string) => ({ text: category, value: category })),
filteredValue: values.categories.length > 0 ? values.categories : null,
```

Selecting a category in the header immediately shows up as a tag in the panel, and clearing it
in the panel clears the header. This is the practical argument for keeping list state in the
URL rather than in component state: a second control is free.

A range does not fit the checkbox list Ant Design renders by default, so the views column
supplies its own `filterDropdown` with two number inputs — again writing the same parameters the
panel writes.

## Typing should not be a request per keystroke

A filter control bound straight to the URL fires a request on every keystroke: typing `500`
into the view-count filter asked the server for `5`, then `50`, then `500`, and threw the first
two answers away. Every typed filter therefore goes through one shared hook:

```ts
const minViews = useDebouncedFilter(values.minViews, (value) =>
  onChange({ minViews: value?.toString() }),
)
```

`useDebouncedFilter` keeps the typed value locally so the input stays responsive, and delays
only the commit that changes the URL. It also watches the committed value, so the control still
follows the back button and "Clear filters", which change the URL from outside the control.

Discrete filters — a select, a date range — commit immediately, because there is no partially
typed state to wait for. `FILTER_DEBOUNCE_MS` is defined once, so every typed filter in the
application waits the same amount of time.

## StrictMode does not duplicate mutations

Queries run from effects, which StrictMode deliberately runs twice in development. Mutations
run from event handlers, which it does not, so a create or delete is sent once. A test holds
that line rather than leaving it to trust:

```ts
expect(requests.filter((entry) => entry === 'POST /posts')).toHaveLength(1)
```

## Why some requests show as cancelled

Requests marked `(cancelled)` in the network panel, immediately followed by an identical
request that succeeds, are expected and not a bug. Every query passes the `AbortSignal`
TanStack Query provides:

```ts
queryFn: ({ signal }) => getPosts(filters, signal),
```

so a request that is no longer needed is actually aborted instead of being left to finish and
discarded. Two things trigger that:

- **React StrictMode in development.** It mounts, unmounts, and remounts every component to
  surface effects that are not idempotent. The first mount's request is aborted and the second
  mount refetches. This does not happen in a production build.
- **A filter changing while a request is in flight.** The superseded request is aborted, which
  is the correct outcome — its answer is for a filter the reader has already moved past.

Debouncing the typed filters removes most of the second kind.

## Hiding columns

Column visibility is a personal preference, not shareable list state, so it goes to the
persisted store rather than the URL:

```ts
const { hiddenKeys, resetColumns, toggleColumn, visibleColumns } = useColumnVisibility<PostDto>(
  'posts',
  ['id'],
)
```

A table with no stored entry falls back to the defaults its page passes in, which is how the ID
column ships hidden on both tables while staying one click away. Once the reader changes
anything, their choice is stored per table and survives a reload.

This completes the three-way split the project uses for state: the URL for what a list is
showing, the persisted store for how a reader prefers to see it, and `useState` for what
disappears when the page does.

## Filter types

The posts panel covers the four shapes most list screens need:

- free text, matched against the title;
- a multi-select whose options come from the API;
- a multi-select whose options are static;
- numeric and date ranges.

All four are applied by the handler in `postsHandlers.ts`, which narrows, then sorts, then
limits — the order a real list endpoint would use.

## Why the panel is behind a feature flag

DummyJSON supports sorting, a text search, and a single-category endpoint, but silently ignores
anything else; `minPrice` and `maxPrice`, for example, come back unfiltered. JSONPlaceholder
does not implement the post filters at all.

Rather than shipping controls that appear to work and do not, the rich panel renders only when
`mockPostsApi` is on:

```tsx
const filteringEnabled = FEATURE_FLAGS.mockPostsApi
```

This is what a feature flag is for: the same code ships everywhere, and the environment decides
which capability is available. The fields the panel depends on — `category`, `views`,
`publishedAt` — are optional on `PostDto` for the same reason, because the real API does not
return them.

## Reference

- [Ant Design `Table`](https://ant.design/components/table)
