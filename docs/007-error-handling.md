# 007 — Error Handling

This project uses a root React Error Boundary, a focused fallback screen, and one normalization and reporting module.

## Error-handling layers

```text
Unknown thrown value
        │
        ▼
normalizeError()
        │
        ├── reportError() ──► development console / future monitoring service
        │
        └── ErrorBoundary ──► accessible ErrorFallback UI
```

## Root element validation

The browser entry point validates the root element before creating the React root:

```ts
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Application root element was not found')
}
```

This avoids hiding a missing DOM contract behind a non-null assertion.

## React root callbacks

React 19 root callbacks send caught, uncaught, and recoverable render errors through the same reporter:

- `onCaughtError`
- `onUncaughtError`
- `onRecoverableError`

The reporter currently writes development diagnostics. Its API is the integration point for a production observability service later.

## Error Boundary

`ErrorBoundary` catches errors thrown while descendants render and replaces the failed tree with `ErrorFallback`.

The boundary supports:

- A default full-application fallback.
- A custom fallback render function for feature-level boundaries.
- An `onError` callback for boundary-specific reporting.
- A reset function for retryable feature boundaries.

Place boundaries around meaningful recovery areas rather than wrapping every individual component.

## Accessible fallback

The default fallback:

- Uses `role="alert"`.
- Moves focus to the error heading.
- Gives the user a concrete reload action.
- Shows technical error details only during development.
- Supports light, dark, desktop, and mobile layouts.

The `frontend-design` guidance shaped this screen as a precise diagnostic panel that fits the project's existing visual language, rather than a generic error card.

## What Error Boundaries do not catch

React Error Boundaries do not catch errors from regular event handlers, arbitrary asynchronous callbacks, server-side rendering, or the boundary itself.

Handle expected async and event errors where they occur:

```ts
try {
  await saveChanges()
} catch (error) {
  reportError(error, { kind: 'caught' })
}
```

Expected failures should normally be represented as UI state. Reserve Error Boundaries for unexpected rendering failures.

## Tests

The test suite verifies:

- Unknown thrown values are normalized.
- Development errors reach the reporter.
- Healthy children render normally.
- A render error displays a fallback.
- A custom boundary can recover through its reset callback.
- The default fallback is focused and its action works.

## Reference

- [React: Catching rendering errors with an Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
