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

The checked-in demo modes currently use JSONPlaceholder as `apiBaseUrl`. API features consume the normalized value through `src/lib/api/api-client.ts`, so switching to a real service only requires changing environment configuration rather than endpoint components.

`src/config/env.ts` validates required values immediately. A missing value therefore produces a clear startup error instead of failing later in an unrelated feature.

## Adding a new environment variable

Use the following flow whenever the application needs another environment value. The example adds a required public support address named `VITE_SUPPORT_EMAIL`.

### 1. Decide whether the value may be public

The `VITE_` prefix means the value will be readable in the generated browser files. A support email, public API origin, analytics measurement ID, or feature flag can be appropriate. A private API key, database password, or signing secret cannot.

If the browser does not need the value, do not add it to this frontend environment structure. Keep it in the backend or deployment platform instead.

### 2. Add the value to the correct `.env` files

If the value is shared by every environment, add it to `.env`:

```dotenv
VITE_SUPPORT_EMAIL=support@example.com
```

If it changes by environment, add it to every mode file instead:

```dotenv
# .env.development
VITE_SUPPORT_EMAIL=dev-support@example.com

# .env.production
VITE_SUPPORT_EMAIL=support@example.com

# .env.test
VITE_SUPPORT_EMAIL=test-support@example.com
```

Also add a safe example value to `.env.example` so a new developer and the deployment configuration know that the variable exists:

```dotenv
VITE_SUPPORT_EMAIL=support@example.com
```

Do not duplicate a shared value in every mode file. Use `.env` as the common default and override it only where necessary.

### 3. Declare the browser-side TypeScript type

Add the raw variable to `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_SUPPORT_EMAIL: string
}
```

This catches misspelled environment keys during development. It does not validate that a runtime value is present, so the central config layer is still required.

### 4. Add it to the required-key list

Extend `RequiredEnvKey` in `src/config/env.ts`:

```ts
type RequiredEnvKey = 'VITE_APP_NAME' | 'VITE_API_BASE_URL' | 'VITE_SUPPORT_EMAIL'
```

`EnvironmentSource` is derived from this union, so TypeScript now requires the new raw value when `createEnvironment` is called.

### 5. Expose a normalized application property

Map the raw uppercase key to an application-friendly property in `createEnvironment`:

```ts
export function createEnvironment(source: EnvironmentSource) {
  return Object.freeze({
    appName: getRequiredEnv(source, 'VITE_APP_NAME'),
    apiBaseUrl: getRequiredEnv(source, 'VITE_API_BASE_URL'),
    supportEmail: getRequiredEnv(source, 'VITE_SUPPORT_EMAIL'),
    mode: source.MODE,
    isDevelopment: source.DEV,
    isProduction: source.PROD,
  })
}
```

Trimming, parsing, fallback behavior, and validation belong here. Components should not repeat those rules.

### 6. Update the environment tests

Add the new required raw value to `validSource` in `src/config/env.test.ts`:

```ts
const validSource: EnvironmentSource = {
  VITE_APP_NAME: 'React Vite Best Practices',
  VITE_API_BASE_URL: 'https://api.example.com',
  VITE_SUPPORT_EMAIL: 'support@example.com',
  MODE: 'test',
  DEV: true,
  PROD: false,
}
```

Add `supportEmail` to the expected normalized object. When the variable has special parsing or validation rules, add focused success and failure cases for those rules as well.

### 7. Use the normalized value

Application code imports the central `env` object through the source alias:

```tsx
import { env } from '@/config/env'

export function SupportLink() {
  return <a href={`mailto:${env.supportEmail}`}>Contact support</a>
}
```

Do not read `import.meta.env.VITE_SUPPORT_EMAIL` directly inside components. Keeping raw environment access inside `src/config/env.ts` makes validation consistent and makes components easier to test.

### 8. Restart and verify every relevant mode

Vite reads environment files when the process starts. Restart the development server after adding or changing a value:

```bash
pnpm dev
```

Then run the quality and build checks:

```bash
pnpm check
pnpm build:development
pnpm build:production
```

For a deployed application, define the same variable in the hosting or CI environment. Shell and platform-provided values take priority over committed `.env` files.

### Change checklist

| Location                 | Responsibility                                       |
| ------------------------ | ---------------------------------------------------- |
| `.env` or `.env.[mode]`  | Supplies the actual value for each environment       |
| `.env.example`           | Documents the key with a safe example                |
| `src/vite-env.d.ts`      | Declares the raw `import.meta.env` type              |
| `src/config/env.ts`      | Validates, parses, and exposes the normalized value  |
| `src/config/env.test.ts` | Covers required values and transformation rules      |
| Feature/component file   | Reads only the normalized `env` property             |
| CI or hosting settings   | Supplies the deployed value when it is not committed |

The only intentional exception is HTML metadata. Vite supports `%VITE_VARIABLE_NAME%` replacement directly in `index.html`, as used by `%VITE_APP_NAME%` for this project's page title. JavaScript and TypeScript application code should continue using the central `env` object.

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
