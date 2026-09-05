# 003 — Application Version Component

The `AppVersion` component displays the version declared in `package.json` without shipping the complete package manifest to the browser.

## How it works

`vite.config.ts` reads `package.json` while Vite starts and exposes only its `version` field as a compile-time constant:

```ts
define: {
  __APP_VERSION__: JSON.stringify(packageJson.version),
}
```

The constant is typed in `src/vite-env.d.ts`:

```ts
declare const __APP_VERSION__: string
```

The component can then render it safely:

```tsx
import { AppVersion } from './components/AppVersion/AppVersion'

<AppVersion />
```

## Source files

```text
src/components/AppVersion/
├── AppVersion.css
└── AppVersion.tsx
```

The value is replaced during development and production builds. Restart the development server after changing the version in `package.json`.

## Updating the version

Update the `version` field in `package.json`, for example:

```json
{
  "version": "0.1.0"
}
```

The component will display `v0.1.0` after the next development-server start or production build.

## Reference

- [Vite: Shared Options — define](https://vite.dev/config/shared-options.html#define)
