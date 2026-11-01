# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`@yoshinani/style-guide` is a **shared linting/formatting configuration package**, not an application. There is no source to compile, no test suite, and no build step — each directory ships its config files verbatim to npm. Changes here are config edits that downstream consumers `extends`. The package documentation (README.md, CONTRIBUTING.md) is written in Japanese; rule rationales link to an internal Notion.

## Commands

```sh
mise install        # install Node 24 + pnpm 10 (versions pinned in mise.toml)
pnpm install
pnpm check          # oxfmt --check . — formatting check (CI)
pnpm check:fix      # oxfmt . — format files, including import sorting
pnpm typecheck      # tsc --noEmit over the config sources (CI)
pnpm test           # vitest — ESLint config shape/behavior tests (CI)
pnpm changeset      # record a version bump; required for any user-facing change
```

There is no `lint` or `build` script — `pnpm check`, `pnpm typecheck` and `pnpm test` together match CI (`.github/workflows/check.yml`). Commits are validated by a husky `commit-msg` hook running commitlint.

## How configs are exposed

`package.json` `exports` maps subpaths to raw config files; `files` whitelists which directories get published. Adding a new config means: create the file, add an `exports` entry, and (if a new top-level dir) add it to `files`. Consumers reference them as e.g. `@yoshinani/style-guide/eslint/next`, `@yoshinani/style-guide/oxfmt`, `@yoshinani/style-guide/typescript/nextjs`.

## ESLint architecture (the core of this package)

`eslint/base.mjs` holds all the opinionated rules and is the single source of truth. The other entry points are thin wrappers that spread `base` and layer on environment globals / framework rules:

- `base.mjs` — flat config; type-checked rules (`recommendedTypeChecked` + `projectService`), `functional/immutable-data`, no-barrel-files, enum/`for` banned via `no-restricted-syntax`, `no-process-env`, import ordering.
- `next.mjs`, `react-internal.mjs` — `base` + `rules/react.mjs` + `rules/react-hooks.mjs` + browser/service-worker globals.
- `library.mjs` — `base` + node globals, ignores `*.js`.
- `rules/react.mjs`, `rules/react-hooks.mjs` — extracted React rule blocks shared by the React-aware entry points.

`base.mjs` encodes the org's **opinionated tech-stack choices** through `no-restricted-imports`: e.g. zod/yup/joi → valibot, lodash → remeda, axios → fetch, moment/dayjs → date-fns, MUI/emotion → shadcn+Tailwind, jest → vitest, redux/recoil → zustand/jotai. When adding library bans, follow this existing pattern (name with a Japanese `message` pointing to the preferred alternative).

Because rules use `recommendedTypeChecked`, `base.mjs` sets `tsconfigRootDir: import.meta.dirname` and relies on `projectService` — consumers need a tsconfig for type-aware rules to run.

## Other configs

- **oxfmt** (`oxfmt/base.mjs`) — formatter config object: no semicolons, double quotes, printWidth 80, import sorting (`sortImports` groups: builtin → external → `@repo/**` → alias → relative), Tailwind class sorting, Markdown excluded. oxfmt has no `extends`, so consumers spread it into their own `oxfmt.config.ts` (only `.ts` / `.oxfmtrc.json` are auto-discovered). The repo's own root `oxfmt.config.ts` spreads this file unchanged except for repo-specific `ignorePatterns`, so the repo is always formatted by the config it ships.
- **TypeScript** (`typescript/base.json` + `nextjs.json`, `react-library.json`) — strict, `noUncheckedIndexedAccess`, NodeNext base; variants override module/jsx.
- **commitlint** (`commitlint/commitlint.config.mjs`) — conventional commits with a **restricted** `type-enum`: only `build`, `docs`, `feat`, `fix`, `refactor`, `test`, `release` (`release` is reserved for automated releases).

## Release flow

Versioning is via **Changesets**. Any change affecting consumers needs `pnpm changeset` committed in the PR; merging to `main` triggers the release GitHub Action which version-bumps, updates CHANGELOG, and publishes. Do not hand-edit `version` in `package.json` or `CHANGELOG.md`.
