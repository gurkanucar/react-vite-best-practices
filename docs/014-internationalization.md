# 014 — Internationalization

The admin shell ships in English and Turkish. Translations live as plain JSON files under `src/assets/locales/`, one file per language, and a tiny hook in `src/i18n/messages.ts` returns the active dictionary. No third-party i18n library is needed at this size.

## Folder layout

```
src/
├── assets/
│   └── locales/
│       ├── en.json   # reference locale
│       └── tr.json
└── i18n/
    ├── messages.ts
    └── messages.test.ts
```

Keeping translations in JSON instead of TypeScript objects has three benefits:

- Translators and content editors can update copy without touching application code.
- The files can be exported to, or imported from, translation tooling without a build step.
- Vite treats JSON as a first-class module, so the files are bundled, tree-shaken, and cached like any other import.

## Loading the JSON files

Vite imports JSON natively. TypeScript needs `resolveJsonModule` to infer the file shape, which is enabled in `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

`src/i18n/messages.ts` imports every locale and exposes the dictionary that matches the language stored in the Zustand preferences store:

```ts
import en from '@/assets/locales/en.json'
import tr from '@/assets/locales/tr.json'
import { usePreferencesStore, type Language } from '@/store/preferences-store'

export type Messages = typeof en

export const messages = {
  en,
  tr: tr satisfies Messages,
} as const satisfies Record<Language, Messages>

export function useMessages(): Messages {
  const language = usePreferencesStore((state) => state.language)

  return messages[language]
}
```

English is the reference locale. `Messages` is derived from `en.json`, and every other locale is checked against it with `satisfies`. A missing or misspelled key in `tr.json` fails `pnpm check` before it reaches the browser. The outer `satisfies Record<Language, Messages>` guarantees that every value of the `Language` union has a dictionary.

## Using messages in components

Call the hook once per component and read nested keys directly:

```tsx
const messages = useMessages()

<Typography.Title>{messages.dashboard.title}</Typography.Title>
```

The dictionary is a plain object, so keys are autocompleted and type-checked. Prefer grouping keys by feature (`navigation`, `dashboard`, `settings`) rather than by component so copy survives UI refactors.

## Switching language

`LanguageSelect` writes the selected language to the preferences store. Because `useMessages` subscribes to that store, every component re-renders with the new dictionary immediately, and the choice persists across browser sessions. See [012 — Zustand State Management](./012-zustand-state-management.md).

English and Turkish options include locally bundled SVG flags from `country-flag-icons`. The package has no runtime dependencies, includes TypeScript declarations, and allows direct imports so only the `GB` and `TR` assets enter the application bundle:

```tsx
import GB from 'country-flag-icons/react/3x2/GB'
import TR from 'country-flag-icons/react/3x2/TR'
```

The flags are presentational; the translated language name remains the accessible option label. No flag asset is loaded from a CDN at runtime.

## Adding a new key

1. Add the key to `src/assets/locales/en.json`.
2. Add the same key to every other locale file.
3. Use it through `messages.<group>.<key>`.

If a locale is missing the key, TypeScript reports the error at the `satisfies` check in `messages.ts`.

## Adding a new language

1. Create `src/assets/locales/<code>.json` by copying `en.json` and translating every value.
2. Extend the `Language` union in `src/store/preferences-store.ts` and its `isLanguage` guard.
3. Import the file in `messages.ts` and add it to the `messages` map.
4. Add an option to `LanguageSelect` and a display name under `common`.

## Tests

`src/i18n/messages.test.ts` guards the JSON files and the hook:

- Every locale has exactly the same key structure as `en.json`.
- No translation is an empty string.
- `useMessages` returns the dictionary for the active language and updates when the language changes.

## When to reach for a library

The current approach covers static copy. Adopt `react-i18next` or FormatJS when the product needs interpolation with plurals, date and number formatting per locale, lazy-loaded locale bundles, or translation management integrations.

## Reference

- [country-flag-icons](https://www.npmjs.com/package/country-flag-icons)
- [Vite: JSON imports](https://vite.dev/guide/features.html#json)
- [TypeScript: resolveJsonModule](https://www.typescriptlang.org/tsconfig/#resolveJsonModule)
