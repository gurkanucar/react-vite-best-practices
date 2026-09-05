# 012 — Zustand State Management

The application uses Zustand `5.0.15` for small, shared client-side preferences. Language, color mode, visual theme, and density live in one typed store. Temporary component values, such as the Components page slider, remain local React state.

## Installation

```bash
pnpm add zustand@latest
```

## Store design

`src/store/preferences-store.ts` combines state and explicit actions with `create<PreferencesStore>()`. Components subscribe with narrow selectors:

```ts
const language = usePreferencesStore((state) => state.language)
const setLanguage = usePreferencesStore((state) => state.setLanguage)
```

This avoids making a component re-render for unrelated store fields. `AppThemeProvider` consumes appearance selectors and converts them to Ant Design tokens. `LanguageSelect` and `useMessages` consume the same source of truth.

## Persistence

The official `persist` middleware writes selected fields to `localStorage` under `rvbp-preferences`. Actions are excluded with `partialize`. A version number supports future migrations, and a custom merge validates stored values before hydration.

Never put secrets, access tokens, or server-only configuration in this browser store. The stored JSON is visible and editable by the user.

## Adding a persisted preference

1. Add its type and field to `PreferencesState`.
2. Add its default to `initialPreferences`.
3. Add an action to `PreferencesActions` and the store initializer.
4. Include the field in `partialize`.
5. Validate or migrate it in `mergePersistedPreferences`.
6. Select only that field in the consuming component.
7. Cover update, persistence, reset, and invalid stored data in tests.

Use Zustand for state shared across distant components or routes. Prefer props, URL search parameters, form state, or local `useState` when those more accurately describe ownership.

## Reference

- [Zustand: Persisting store data](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
