# 027 — File Browser

`/files` is a folder tree beside a listing, with the actions that change both. It exists
for one problem in particular: a single action can invalidate several different views of
the same data, and getting that wrong is invisible until a user notices a stale tree.

## The service is part of the feature

There is no file API behind this screen, so `services/filesService.ts` is one. It keeps an
array in memory and answers after 320ms.

That is deliberate rather than lazy. MSW only runs in development and only when a mock
flag is on (see [020](020-msw-and-feature-flags.md)), so a feature built on it is broken in
the production build. A service module works everywhere, and the latency is what makes the
loading states visible at all — without it there is nothing to design around.

## A rename is not a rename

Renaming `/design/brand` to `/design/identity` has to move everything under it, because
descendants store their parent path:

```ts
nodes = nodes.map((entry) => {
  if (entry.id === id) return renamed
  if (entry.parentPath === previousPath) return { ...entry, parentPath: nextPath }
  if (entry.parentPath.startsWith(`${previousPath}/`)) {
    return { ...entry, parentPath: entry.parentPath.replace(previousPath, nextPath) }
  }
  return entry
})
```

Deleting a folder has the same shape — remove the node, then everything whose path sits
beneath it. Both are pinned by tests, because both are the kind of thing that looks correct
until a folder three levels down quietly disappears from its parent.

## One invalidation key, on purpose

A rename changes the listing and the tree. A delete can empty the folder the reader is
standing in. Rather than predict which queries went stale, every mutation invalidates the
feature's root key:

```ts
queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.all })
```

Narrower invalidation is worth it when a key is expensive. These two are not, and a missed
key would show as a tree that disagrees with the table — a bug a reader will report long
after they stop trusting the screen.

## An async function that throws is a broken contract

`createFolder` rejects a duplicate name. It is declared `async` so that arrives as a
rejected promise:

```ts
export async function createFolder(parentPath: string, name: string): Promise<FileNode> {
  assertNameIsFree(parentPath, name)
  …
}
```

Without `async`, a function typed `Promise<FileNode>` throws synchronously, and every
caller needs both a `try`/`catch` and a `.catch`. A test caught this: `rejects.toThrow`
failed against a value that was never a rejected promise.

## The open folder is in the URL

`?path=/design/brand` is the state. A folder can be linked, and the back button walks the
folders the reader actually opened. Deep links survive a rename too: `resolveExistingPath`
falls back to the deepest folder on the way that still exists rather than showing an empty
listing for a path that is gone.

## Breadcrumbs are buttons

An `<a>` with an `onClick` and no `href` is not reachable by keyboard, which defeats the
point of a breadcrumb for anyone not using a mouse. The linter caught every one of them;
they are `Button type="link"` now, and so are the folder names in the listing.
