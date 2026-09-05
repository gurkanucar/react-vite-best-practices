# 001 — Creating a React + Vite Project

This document records how this project was created with React, Vite, TypeScript, and pnpm.

## Prerequisites

- Node.js `20.19+` or `22.12+`
- pnpm installed and available in the terminal

Verify the installed tools:

```bash
node --version
pnpm --version
```

This project was created with Node.js `22.22.2` and pnpm `11.5.0`.

## 1. Create the project directory

```bash
mkdir react-vite-best-practices
cd react-vite-best-practices
```

## 2. Scaffold React with TypeScript

Run the official Vite project generator in the current directory:

```bash
pnpm create vite@latest . --template react-ts --no-interactive
```

The options mean:

- `vite@latest` uses the latest published Vite project generator.
- `.` creates the project in the current directory.
- `--template react-ts` selects React with TypeScript.
- `--no-interactive` makes the command reproducible without prompts.

## 3. Install dependencies

```bash
pnpm install
```

This creates `pnpm-lock.yaml`. Commit this file so every environment resolves the same dependency versions.

## 4. Start the development server

```bash
pnpm dev
```

Vite prints the local development URL in the terminal. It is usually `http://localhost:5173`.

## 5. Verify the project

Run the linter:

```bash
pnpm lint
```

Create a production build:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Generated project structure

```text
.
├── docs/
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Versions at creation time

The Vite template generated the following main version ranges on September 5, 2026:

- React `^19.2.8`
- React DOM `^19.2.8`
- TypeScript `~6.0.2`
- Vite `^8.2.2`
- `@vitejs/plugin-react` `^6.1.0`

The lockfile contains the exact installed versions. Use it as the source of truth for reproducible installations.

## References

- [Vite: Getting Started](https://vite.dev/guide/)
- [React: Using TypeScript](https://react.dev/learn/typescript)
- [pnpm documentation](https://pnpm.io/)
