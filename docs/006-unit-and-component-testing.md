# 006 — Unit and Component Testing

This project uses Vitest, jsdom, and React Testing Library for automated tests.

## Testing principles

- Unit tests verify isolated business logic and transformations.
- Component tests verify behavior through the DOM that a user can observe.
- Tests prefer accessible queries such as roles and labels over implementation details.
- Every test runs independently and the rendered DOM is cleaned after each test.

## Commands

Run the complete test suite once:

```bash
pnpm test
```

Run tests in watch mode during development:

```bash
pnpm test:watch
```

Generate text and HTML coverage reports:

```bash
pnpm test:coverage
```

The HTML report is created in `coverage/` and is ignored by Git.

## Configuration

Vitest uses the existing `vite.config.ts`, including the React plugin, path aliases, environment handling, and compile-time version constant.

The test environment is `jsdom`, which provides browser-like DOM APIs without opening a real browser. Global DOM matchers and cleanup are configured in `src/test/setup.ts`.

Coverage thresholds are set to 80 percent for branches, functions, lines, and statements. The command fails if the project drops below one of these values.

## Test environment

Vitest runs in `test` mode. `.env.test` supplies the mode-specific API URL while `.env` supplies shared values such as the application name.

These values must still be non-sensitive because every `VITE_*` value remains public client configuration.

## Current tests

```text
src/
├── App.test.tsx
├── components/AppVersion/AppVersion.test.tsx
└── config/env.test.ts
```

- `env.test.ts` is a unit test for normalization, immutability, and required-value validation.
- `AppVersion.test.tsx` verifies that the version from `package.json` reaches the UI.
- `App.test.tsx` verifies application rendering and a user interaction.

## Quality command

The complete local quality command now includes tests:

```bash
pnpm check
```

It runs type checking, linting, formatting validation, and the test suite in sequence.

## References

- [Vitest: Getting Started](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
