# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`@yoshinani/style-guide` is a **shared linting/formatting configuration package**, not an application. There is no source to compile, no test suite, and no build step — each directory ships its config files verbatim to npm. Changes here are config edits that downstream consumers `extends`. The package documentation (README.md, CONTRIBUTING.md) is written in Japanese; rule rationales link to an internal Notion.

## Commands

```sh
mise install        # install Node 24 + pnpm 10 (versions pinned in mise.toml)
pnpm install
pnpm check          # biome check . — the only CI gate (.github/workflows/check.yml)
pnpm check:fix      # biome check --write . — autofix formatting/imports
pnpm changeset      # record a version bump; required for any user-facing change
```

There is no `lint`, `test`, or `build` script — `pnpm check` (Biome) is the full local validation. Commits are validated by a husky `commit-msg` hook running commitlint.

## How configs are exposed

`package.json` `exports` maps subpaths to raw config files; `files` whitelists which directories get published. Adding a new config means: create the file, add an `exports` entry, and (if a new top-level dir) add it to `files`. Consumers reference them as e.g. `@yoshinani/style-guide/eslint/next`, `@yoshinani/style-guide/biome`, `@yoshinani/style-guide/typescript/nextjs`.

## ESLint architecture (the core of this package)

`eslint/base.mjs` holds all the opinionated rules and is the single source of truth. The other entry points are thin wrappers that spread `base` and layer on environment globals / framework rules:

- `base.mjs` — flat config; type-checked rules (`recommendedTypeChecked` + `projectService`), `functional/immutable-data`, no-barrel-files, enum/`for` banned via `no-restricted-syntax`, `no-process-env`, import ordering.
- `next.mjs`, `react-internal.mjs` — `base` + `rules/react.mjs` + `rules/react-hooks.mjs` + browser/service-worker globals.
- `library.mjs` — `base` + node globals, ignores `*.js`.
- `rules/react.mjs`, `rules/react-hooks.mjs` — extracted React rule blocks shared by the React-aware entry points.

`base.mjs` encodes the org's **opinionated tech-stack choices** through `no-restricted-imports`: e.g. zod/yup/joi → valibot, lodash → remeda, axios → fetch, moment/dayjs → date-fns, MUI/emotion → shadcn+Tailwind, jest → vitest, redux/recoil → zustand/jotai. When adding library bans, follow this existing pattern (name with a Japanese `message` pointing to the preferred alternative).

Because rules use `recommendedTypeChecked`, `base.mjs` sets `tsconfigRootDir: import.meta.dirname` and relies on `projectService` — consumers need a tsconfig for type-aware rules to run.

## Other configs

- **Biome** (`biome/base.jsonc`) — formatter + import-assist only; **linter is disabled** (`linter.enabled: false`) by design, since ESLint handles linting. Formatting is double-quote, semicolons-as-needed. The repo's own root `biome.jsonc` extends this.
- **Prettier** (`prettier/prettier.config.cjs`) — the alternative to Biome for formatting; no semicolons, double quotes, trailing-comma all, printWidth 80. Keep it consistent with Biome's formatter settings.
- **TypeScript** (`typescript/base.json` + `nextjs.json`, `react-library.json`) — strict, `noUncheckedIndexedAccess`, NodeNext base; variants override module/jsx.
- **commitlint** (`commitlint/commitlint.config.mjs`) — conventional commits with a **restricted** `type-enum`: only `build`, `docs`, `feat`, `fix`, `refactor`, `test`, `release` (`release` is reserved for automated releases).

## Release flow

Versioning is via **Changesets**. Any change affecting consumers needs `pnpm changeset` committed in the PR; merging to `main` triggers the release GitHub Action which version-bumps, updates CHANGELOG, and publishes. Do not hand-edit `version` in `package.json` or `CHANGELOG.md`.
