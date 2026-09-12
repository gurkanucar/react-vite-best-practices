# 028 — Kanban and Optimistic Updates

`/board` is a drag-and-drop board. The dragging is the smaller half of it: the point of the
screen is what happens between dropping a card and the server agreeing.

## Why dnd-kit

Measured against a React-only baseline, in its own production build:

| Approach                            | Added gzip |
| ----------------------------------- | ---------- |
| Native HTML5 drag and drop          | ~0.2 kB    |
| `@atlaskit/pragmatic-drag-and-drop` | ~5.9 kB    |
| `@dnd-kit/core` + `sortable`        | ~13.9 kB   |

Native drag and drop is free and does not work on touch devices at all, and it is not
keyboard operable. For a reference implementation that is the wrong trade at any price.
dnd-kit ships pointer, touch, and keyboard sensors, so the board can be used entirely from
the keyboard — pick a card up with Space, move it with the arrow keys, drop it with Space.

Its screen-reader narration is English only, so `useBoardAnnouncements()` rebuilds it from
the locale files.

## Three states, not two

A drag has a preview that is not yet a request:

- **While dragging**, the reordered board lives in component state. The query cache is not
  touched, because nothing has been asked of the server yet.
- **On drop**, the mutation writes the move into the cache in `onMutate` and sends the
  request.
- **On failure**, `onError` restores the snapshot `onMutate` took.

```ts
onMutate: async (input) => {
  await queryClient.cancelQueries({ queryKey: BOARD_QUERY_KEYS.board() })
  const previous = queryClient.getQueryData<Board>(BOARD_QUERY_KEYS.board())
  …
  return { previous }
},
onError: (_error, _input, context) => {
  if (context?.previous) queryClient.setQueryData(BOARD_QUERY_KEYS.board(), context.previous)
},
onSettled: () => queryClient.invalidateQueries({ queryKey: BOARD_QUERY_KEYS.board() }),
```

`cancelQueries` is the line that is easy to leave out and hard to debug: a refetch already
in flight would land after the optimistic write and replace it with the state from before
the drag.

The drag preview is cleared in the mutate call's `onSettled` rather than immediately, so
the card does not flick back to its old column for a frame while `onMutate` is still being
applied.

## One move function, used twice

The optimistic update and the service apply the same `applyMove`. If they disagreed by a
single index the board would visibly jump the moment the response arrived, and only for
moves that happened to differ. Sharing the function makes that class of bug impossible
rather than rare.

## The switch is the demonstration

`Fail the next move` makes the service reject. It is how a reader sees the rollback without
unplugging anything, and it is what the test drives:

```ts
expect(track.seen).toEqual([origin, 'done', origin])
```

That test records every value the cache takes rather than polling for one, because polling
for the optimistic value is a race — under load the first poll can land after the request
has already settled, and the test would then pass or fail on timing instead of behaviour.

A second detail that test found: `onSettled` returns the invalidation, so the mutation
stays pending until the refetch after it finishes too. That is two service calls, past the
one second `waitFor` allows by default.
