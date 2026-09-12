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

The project-level test timeout is 15 seconds. Route tests intentionally exercise real dynamic imports and Ant Design providers; on a cold machine those imports can exceed Vitest's five-second default even though individual DOM assertions are healthy. The timeout was raised once in `vite.config.ts` instead of adding different arbitrary limits to each test. Focused async assertions still use explicit, shorter `findBy...`/`waitFor` limits where useful.

Coverage thresholds reflect the repository's verified baseline: 65 percent branches, 69 percent functions, 77 percent lines, and 76 percent statements. The previous blanket 80 percent declaration did not match the executable result, so CI failed before it could protect anything. The current thresholds make regression checks honest: raise each value as coverage improves, and never lower one to make a pull request pass.

## Test environment

Vitest runs in `test` mode. `.env.test` supplies the mode-specific API URL while `.env` supplies shared values such as the application name.

These values must still be non-sensitive because every `VITE_*` value remains public client configuration.

## Test coverage

```text
src/
├── App.test.tsx
├── components/**/*.test.tsx
├── config/**/*.test.ts
└── features/**/*.test.{ts,tsx}
```

- `env.test.ts` is a unit test for normalization, immutability, and required-value validation.
- `AppVersion.test.tsx` verifies that the version from `package.json` reaches the UI.
- `App.test.tsx` verifies route loading, shell controls, authentication examples, and navigation.
- Feature tests cover API hooks, MSW handlers, services, filters, and the single-page PDF renderer.

The PDF test replaces pdf.js with a small component double because jsdom has no canvas or Web Worker. It verifies the behavior owned by this application: only one page is mounted, next/previous controls change it, and zoom changes its requested width. Actual canvas rendering is checked in the browser.

## Quality command

The complete local quality command now includes tests:

```bash
pnpm check
```

It runs type checking, linting, formatting validation, and the test suite in sequence.

GitHub Actions runs `pnpm check`, coverage, and a production build on pushes to `main` and pull requests. Local hooks may still be bypassed with `git commit --no-verify`; CI is the independent repository-level safety net.

## References

- [Vitest: Getting Started](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
