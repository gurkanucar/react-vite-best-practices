# 019 — Practical Feature Package Architecture

Feature packages should make ownership obvious without splitting every concept into its own file. This project uses a compact structure that can grow from one list page to multiple pages and modal workflows.

## Recommended shape

```text
src/features/posts/
├── api/
│   └── postsApi.ts
├── components/
│   └── QuickCreatePostModal.tsx
├── hooks/
│   ├── index.ts
│   ├── usePostsMutations.ts
│   └── usePostsQueries.ts
├── pages/
│   └── PostsListPage.tsx
└── types.ts
```

Only create directories that contain real code. For example, the products feature currently has queries but no product mutation, so it does not contain an empty `useProductsMutations.ts` file.

## `pages`: route-level screens

Files under `pages` are complete route destinations. As the feature grows, it can contain:

```text
pages/
├── PostsListPage.tsx
├── PostDetailPage.tsx
└── PostCreatePage.tsx
```

A page composes feature hooks and feature components. It owns route parameters, page-level loading and error presentation, and the arrangement of the screen. Pages are registered through `src/router/LazyPages.tsx` so every route remains lazy-loaded.

Do not put a modal under `pages` merely because it contains a form. If it opens over the current screen without route navigation, it is a component.

## `components`: feature-owned UI

Files under `components` are reusable only inside the feature unless a genuine cross-feature use case appears. Typical examples are:

- quick create or quick update modals;
- filter toolbars;
- feature-specific tables and cards;
- confirmation dialogs;
- form sections shared by create and detail pages.

`QuickCreatePostModal` is the reference example. It opens from `PostsListPage`, submits through `usePostsMutations`, closes after success, and does not change the route.

Move a component to `src/components` only when multiple unrelated features use the same UI contract. Similar-looking components are not automatically shared components.

## `api`: HTTP boundary

The API module should remain easy to read. It owns operations such as:

- choosing the correct service base URL;
- endpoint paths and HTTP methods;
- query-string and request-body mapping;
- forwarding cancellation signals;
- mapping or validating the raw response at the network boundary.

```ts
export function createPost(input: CreatePostInput): Promise<Post> {
  return apiRequest<Post>('/posts', {
    body: input,
    method: 'POST',
  })
}
```

API functions should not know about React, notifications, modal state, navigation, or TanStack Query invalidation.

## `hooks`: two cohesive files

Avoid separate files for every key, option, and hook. Group the read side in one file:

```text
hooks/usePostsQueries.ts
```

This file contains:

- query-key factories;
- shared filter defaults;
- `queryOptions` factories;
- query hooks such as `usePostsQuery`.

Group the write side in another file:

```text
hooks/usePostsMutations.ts
```

This file contains:

- mutation keys;
- mutation hooks;
- cache updates and invalidation rules.

An optional `hooks/index.ts` exposes the public hook API to pages and components. Keep the barrel local to the feature; do not build a global barrel that imports every feature.

## Should there be a `services` directory?

Not by default. A `services` directory is useful when a feature gains real business or use-case logic that is independent of React and HTTP transport. Add it when at least one of these appears:

- the same business rule is needed by a page, modal, and background process;
- one user action coordinates multiple API calls;
- a calculation or state transition needs focused unit tests;
- domain validation is more complex than required fields or input formatting;
- raw API data must be combined into a business result.

Example future structure:

```text
services/
├── calculateOrderTotal.ts
├── validatePostPublication.ts
└── publishPost.ts
```

The boundaries would be:

```text
page/component → hook → service/use case → api
```

The service must stay framework-independent. It should accept values and dependencies, return a value or promise, and avoid importing React hooks or Ant Design.

Do not create `services` merely to rename an API call:

```ts
// Unnecessary pass-through abstraction
export const fetchPostsService = () => getPosts()
```

Until business logic exists, calling the feature API from the query or mutation hook is clearer.

## Where validation belongs

Different validation types belong at different boundaries:

| Validation type           | Location                         | Example                                       |
| ------------------------- | -------------------------------- | --------------------------------------------- |
| Immediate form feedback   | Page or feature component        | Required title, minimum input length          |
| API response shape        | API boundary or a feature schema | Ensure `products` is an array                 |
| Reusable business rule    | Feature service                  | A published post must have an approved author |
| Environment configuration | `src/config/env.ts`              | Required API origin                           |

Client-side business validation improves UX but does not replace backend authorization or validation.

## Dependency direction

Keep dependencies moving inward toward stable logic:

```text
router
  └── feature page
      ├── feature component
      └── feature hooks
          ├── feature service (only when needed)
          └── feature API
              └── shared API client
```

- `lib` must not import a feature.
- One feature should not reach into another feature's private components.
- Cross-feature cache invalidation may import the other feature's exported query keys.
- API modules must not import pages or hooks.
- Services must not import React or presentation components.

## When to split further

The two-hook-file approach is the default, not an absolute limit. Split only when a file becomes difficult to navigate because the domain itself has several independent subdomains. File length alone is weaker evidence than mixed responsibilities.

Start compact, measure the pain, and split around business concepts rather than technical nouns.
