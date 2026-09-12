# 008 — Git Hooks and Commit Quality

This project uses simple-git-hooks, lint-staged, and Commitlint to keep commits fast, focused, and consistently named.

## Hook flow

```text
git commit
    │
    ├── pre-commit ──► lint-staged
    │                    ├── Oxlint fixes and validates staged code
    │                    └── Oxfmt formats staged files
    │
    └── commit-msg ──► Commitlint validates the commit subject
```

A failing command stops the commit so the problem can be fixed before it enters project history.

## Hook configuration

`.simple-git-hooks.json` defines two hooks:

```json
{
  "pre-commit": "pnpm lint:staged",
  "commit-msg": "pnpm commitlint --edit \"$1\""
}
```

The root `prepare` script installs these hooks after `pnpm install`:

```bash
pnpm prepare
```

Run this command manually after changing the hook configuration.

`pnpm-workspace.yaml` explicitly blocks the dependency's own install script. Hook installation belongs to the project's visible `prepare` script instead of an implicit dependency lifecycle script.

The pnpm content-addressable store is local tooling state and is ignored by Git.

## Staged-file checks

`lint-staged.config.mjs` sends staged source files through Oxlint and Oxfmt. Documentation, configuration, and style files are formatted with Oxfmt.

Only staged files are processed. The complete project suite remains available through:

```bash
pnpm check
```

## Commit message format

Commit messages follow Conventional Commits:

```text
type(optional-scope): short description
```

Examples:

```text
feat(auth): add email sign-in
fix(api): handle an expired session
test: cover the error fallback
docs: explain production builds
chore: update development tooling
```

The subject line is limited to 100 characters.

Validate the latest commit manually:

```bash
pnpm commitlint --from HEAD~1 --to HEAD --verbose
```

## Skipping hooks

Git supports `--no-verify`, but bypassing checks should be reserved for exceptional recovery situations. Normal development should fix the reported problem instead.

## CI responsibility

Local Git hooks improve feedback time but can be skipped and are not a security boundary. The committed `.github/workflows/ci.yml` runs `pnpm check`, coverage, and `pnpm build:production` independently on pull requests and pushes to `main`.

This does not disable `--no-verify`. It keeps emergency/local bypasses available while making the remote merge decision depend on the same reproducible checks.

## References

- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Commitlint local setup](https://commitlint.js.org/guides/local-setup)
