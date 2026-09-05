# 005 — Code Quality and Formatting

This project uses Oxlint for static analysis, Oxfmt for deterministic formatting, and TypeScript for project-level type checking.

## Responsibilities

Each tool has one primary responsibility:

- TypeScript checks types and project references.
- Oxlint detects correctness, React, import, and accessibility problems.
- Oxfmt controls whitespace and source formatting.

Keeping these responsibilities separate makes failures easier to understand and avoids conflicting formatting rules in the linter.

## Commands

Run TypeScript without producing output:

```bash
pnpm typecheck
```

Run static analysis and fail on warnings:

```bash
pnpm lint
```

Apply safe lint fixes:

```bash
pnpm lint:fix
```

Format the project:

```bash
pnpm format
```

Check formatting without modifying files:

```bash
pnpm format:check
```

Run all non-test quality checks:

```bash
pnpm check
```

## Oxlint configuration

`.oxlintrc.json` enables focused rule groups for:

- React and the Rules of Hooks.
- TypeScript correctness.
- Import cycles.
- JSX accessibility.
- General JavaScript correctness.

Warnings are denied in the `lint` script so local and CI behavior stays consistent.

## Oxfmt configuration

`.oxfmtrc.json` defines the project's formatting contract:

```json
{
  "printWidth": 100,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all"
}
```

Oxfmt reads `.gitignore`, so generated output and installed dependencies are not formatted.

## Editor defaults

`.editorconfig` provides baseline settings for editors that do not run Oxfmt automatically:

- UTF-8 encoding.
- LF line endings.
- Two-space indentation.
- A final newline.
- No trailing whitespace in source files.

The formatter remains the final authority for supported source formats.

## References

- [Oxlint documentation](https://oxc.rs/docs/guide/usage/linter)
- [Oxfmt documentation](https://oxc.rs/docs/guide/usage/formatter.html)
