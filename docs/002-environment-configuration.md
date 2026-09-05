# 002 — Environment Configuration

This project uses Vite modes and a small typed configuration layer so application code has one consistent place to read environment values.

## File structure

```text
.
├── .env
├── .env.development
├── .env.example
├── .env.production
├── .env.test
└── src/
    ├── config/
    │   └── env.ts
    └── vite-env.d.ts
```

## Environment files

Vite loads the files in this order:

1. `.env` for values shared by every mode.
2. `.env.local` for local overrides in every mode.
3. `.env.[mode]` for mode-specific values.
4. `.env.[mode].local` for local overrides in a specific mode.

Mode-specific values take priority over shared values. Variables already present in the shell have the highest priority.

The committed files in this project are:

- `.env`: shared, non-sensitive application values.
- `.env.development`: development defaults.
- `.env.production`: production defaults.
- `.env.test`: automated-test defaults.
- `.env.example`: a reference for developers and deployment configuration.

Files ending in `.local` are ignored by Git through the existing `*.local` rule.

## Public variables and secrets

Only variables prefixed with `VITE_` are available in browser code. These values are embedded in the client bundle and are public.

Never store passwords, private API keys, signing secrets, or database credentials in a `VITE_*` variable. Sensitive values must remain on a trusted backend.

## Typed access

Custom environment variable types are declared in `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
}
```

Application code should import the normalized configuration object instead of reading `import.meta.env` throughout the codebase:

```ts
import { env } from './config/env'

console.log(env.appName)
console.log(env.apiBaseUrl)
console.log(env.mode)
```

`src/config/env.ts` validates required values immediately. A missing value therefore produces a clear startup error instead of failing later in an unrelated feature.

## Local overrides

Create an untracked `.env.local` file when a developer needs a machine-specific value:

```dotenv
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart the Vite development server after changing an environment file.

## Development server

The development server uses development mode:

```bash
pnpm dev
```

## Environment-specific builds

Create a build with values from `.env.development`:

```bash
pnpm build:development
```

Create a build with values from `.env.production`:

```bash
pnpm build:production
```

The default build command is an alias for the production build:

```bash
pnpm build
```

Each build runs TypeScript project checks before Vite creates the output in `dist/`.

Vite mode and `NODE_ENV` are separate concepts. `vite build --mode development` creates an optimized build while loading development-mode environment values.

## Adding another mode

A custom mode can be selected explicitly:

```bash
pnpm vite build --mode staging
```

This command can use a matching `.env.staging` file.

## Reference

- [Vite: Env Variables and Modes](https://vite.dev/guide/env-and-mode)
