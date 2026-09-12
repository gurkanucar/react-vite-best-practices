# 019 — Practical Feature Package Architecture

Feature packages should make ownership obvious without splitting every concept into its own file. This project uses a compact structure that can grow from one list page to multiple pages and modal workflows.

## Recommended shape

```text
src/features/posts/
├── api/
│   ├── index.ts
│   └── postsApi.ts
├── components/
│   ├── index.ts
│   └── QuickCreatePostModal.tsx
├── hooks/
│   ├── index.ts
│   ├── usePostsMutations.ts
│   └── usePostsQueries.ts
├── pages/
│   ├── index.ts
│   └── PostsListPage.tsx
├── services/
│   ├── index.ts
│   └── postsService.ts
├── types/
│   └── index.ts
└── index.ts
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
export function createPostRequest(input: CreatePostRequest): Promise<PostDto> {
  return apiRequest<PostDto>('/posts', {
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

- `queryOptions` factories;
- query hooks such as `usePostsQuery`.

Group the write side in another file:

```text
hooks/usePostsMutations.ts
```

This file contains:

- mutation hooks;
- cache updates and invalidation rules.

Query keys, mutation keys, and shared filter defaults live with the feature contracts under `types/index.ts`. This makes stable cache identities importable without importing a React hook module.

`hooks/index.ts` exposes the public hook API to pages and components. Keep the barrel local to the feature; do not build a global barrel that imports every feature.

## `types`: contracts and stable constants

The types package keeps DTOs, request types, filter types, and stable feature constants together. Use visible sections so a single compact file remains easy to scan:

```ts
// ─── Query and mutation keys ───────────────────────────
export const POST_QUERY_KEYS = {
  all: ['posts'] as const,
  lists: () => [...POST_QUERY_KEYS.all, 'list'] as const,
  list: (params: PostFilterParams) => [...POST_QUERY_KEYS.lists(), params] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.all, 'detail', id] as const,
}

export const POST_MUTATION_KEYS = {
  create: [...POST_QUERY_KEYS.all, 'create'] as const,
}

// ─── DTOs ──────────────────────────────────────────────
export interface PostDto {
  id: number
  title: string
  body: string
  userId: number
}

// ─── Request types ─────────────────────────────────────
export type CreatePostRequest = Omit<PostDto, 'id'>

// ─── Filter types ──────────────────────────────────────
export interface PostFilterParams {
  limit: number
}
```

Use suffixes consistently:

- `Dto` describes data returned by an API;
- `Request` describes an API command body;
- `Params` describes query-string, filter, or pagination input.

Constants that are purely private implementation details may stay near their consumer. For example, the DummyJSON `select` field list remains inside `productsApi.ts`; callers do not need it.

## Barrel exports

Every populated feature directory has an `index.ts`, and the feature root exposes the package's public surface:

```ts
// src/features/posts/index.ts
export * from './api'
export * from './components'
export * from './hooks'
export * from './pages'
export * from './services'
export * from './types'
```

Inside a feature, import from the closest directory barrel, such as `@/features/posts/services`. Code outside the feature may import from `@/features/posts`. Do not create empty directories or empty barrels for capabilities the feature does not have yet.

## Should there be a `services` directory?

Not by default. A `services` directory is useful when a feature gains real business or use-case logic that is independent of React and HTTP transport. Add it when at least one of these appears:

- the same business rule is needed by a page, modal, and background process;
- one user action coordinates multiple API calls;
- a calculation or state transition needs focused unit tests;
- domain validation is more complex than required fields or input formatting;
- raw API data must be combined into a business result.

The posts feature now provides a concrete example:

```text
services/
├── index.ts
└── postsService.ts
```

The quick-create form provides immediate required-field feedback. The service independently trims the submitted strings, rejects whitespace-only content, verifies that the user ID is a positive integer, and only then calls the API:

```ts
export function preparePostForCreation(input: CreatePostRequest): CreatePostRequest {
  const title = input.title.trim()
  const body = input.body.trim()

  if (!title) {
    throw new PostValidationError('Post title cannot be empty.')
  }

  if (!body) {
    throw new PostValidationError('Post body cannot be empty.')
  }

  if (!Number.isInteger(input.userId) || input.userId <= 0) {
    throw new PostValidationError('User ID must be a positive integer.')
  }

  return { body, title, userId: input.userId }
}

export function createPost(input: CreatePostRequest): Promise<PostDto> {
  return createPostRequest(preparePostForCreation(input))
}
```

`usePostsMutations` calls this service rather than calling `createPostRequest` directly. The service has no React or Ant Design dependency, so its business rules can also be used by a full create page, another modal, an import flow, or focused unit tests.

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

When business logic does not exist, calling the feature API from the query or mutation hook remains clearer. That is why the products feature has no `services` directory.

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
