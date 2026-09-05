# 004 — Project Structure and Path Aliases

This project uses the `@/` alias for imports that start from the `src` directory.

## Why use an alias?

Relative imports become harder to read and maintain as files move deeper into the project:

```ts
import { env } from '../../../config/env'
```

The source alias keeps the same import independent of the importing file's depth:

```ts
import { env } from '@/config/env'
```

Use relative imports for files that belong closely together, such as a component and its stylesheet. Use `@/` when importing from another source module or directory.

## TypeScript configuration

The alias is declared in `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

This provides TypeScript type checking and editor autocomplete for aliased imports.

## Vite configuration

Vite 8 can resolve the `paths` mapping directly from the matching TypeScript configuration:

```ts
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
})
```

Keeping the mapping in TypeScript avoids maintaining separate alias definitions for the editor and bundler.

## Current source structure

```text
src/
├── assets/       # Images and other imported static assets
├── components/   # Reusable UI components
├── config/       # Validated application configuration
├── App.tsx       # Current application shell
├── index.css     # Global styles and design tokens
├── main.tsx      # Browser entry point
└── vite-env.d.ts # Vite and application global types
```

Add directories such as `features`, `pages`, `hooks`, or `services` only when the application has code that belongs in them. Empty architecture folders add ceremony without improving structure.

## Reference

- [Vite: `resolve.tsconfigPaths`](https://vite.dev/config/shared-options.html#resolve-tsconfigpaths)
