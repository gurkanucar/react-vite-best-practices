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
