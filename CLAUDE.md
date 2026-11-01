# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`@yoshinani/style-guide` is a **shared linting/formatting configuration package**, not an application. There is no source to compile and no build step — each directory ships its config files (plus hand-written `.d.mts` type declarations) verbatim to npm. The test suite runs oxlint against fixtures to check the shipped configs. Changes here are config edits that downstream consumers `extends`. The package documentation (README.md, CONTRIBUTING.md) is written in Japanese; rule rationales link to an internal Notion.

## Commands

```sh
mise install        # install Node 24 + pnpm 10 (versions pinned in mise.toml)
pnpm install
pnpm check          # oxfmt --check . && oxlint — format + lint check (CI)
pnpm check:fix      # oxfmt . && oxlint --fix
pnpm typecheck      # tsc --noEmit over the config sources (CI)
pnpm test           # vitest — runs oxlint against tests/fixtures/* and checks the diagnostics (CI)
pnpm test:tsconfig  # compile tests/fixtures/typescript/* with the shared tsconfigs (CI also runs it on TS 6 and 7)
pnpm changeset      # record a version bump; required for any user-facing change
```

There is no separate `lint` or `build` script — `pnpm check`, `pnpm typecheck` and `pnpm test` together match CI (`.github/workflows/check.yml`). Commits are validated by a husky `commit-msg` hook running commitlint.

## How configs are exposed

`package.json` `exports` maps subpaths to raw config files; `files` whitelists which directories get published. Adding a new config means: create the file, add an `exports` entry, and (if a new top-level dir) add it to `files`. Consumers reference them as e.g. `@yoshinani/style-guide/oxlint/library`, `@yoshinani/style-guide/oxfmt`, `@yoshinani/style-guide/typescript/next`.

## oxlint architecture (the core of this package)

`oxlint/base.mjs` holds all the opinionated rules and is the single source of truth. Configs are plain config objects that consumers pass to `extends` in their own `oxlint.config.ts` (`.oxlintrc.json` cannot import packages). The other entry points spread `base` and layer on environment globals / framework rules:

- `base.mjs` — `categories.correctness: "error"` plus the rules carried over from v1 (eslint:recommended, typescript-eslint recommendedTypeChecked, org rules), `options.typeAware: true`, `no-process-env`, enum ban, `no-restricted-imports`, `import/no-duplicates`.
- `library.mjs` — `base` + node globals.
- `react-library.mjs` — `base` + `rules/react.mjs` + browser/service-worker globals.
- `next.mjs` — `base` + `rules/react.mjs` + every rule of oxlint's `nextjs` plugin as `error` (a test fails when oxlint adds a `nextjs` rule that isn't listed), App Router overrides (special files need a default export; image-generation files may use `<img>`), browser + node globals.
- `*-effect.mjs` (`base-effect`, `library-effect`, `react-library-effect`, `next-effect`) — the matching entry point + `rules/effect.mjs`, which pulls in `@effect/tsgo`'s `recommended` oxlint preset (Effect v4 only) and turns off `effecttsgo/unstable-api-usage` in test files. `effecttsgo` is not a stock oxlint plugin: it only loads under an Effect-patched oxlint (`effect-tsgo patch --oxlint --no-typescript`) or via `effect-tsgo oxlint`, so the tests run the Effect fixtures through that wrapper. `@effect/tsgo` pins the oxlint / oxlint-tsgolint versions it supports — keep them in step (dependabot groups them).
- `rules/react.mjs` — React rule block (oxlint's `react` plugin includes the react-hooks rules), shared by `react-library.mjs` and `next.mjs`.
- `rules/restricted-imports.mjs` — the banned-library lists, exported so consumers can extend them (oxlint replaces rule options instead of merging).
- `plugins/yoshinani.mjs` — a local JS plugin for rules oxlint lacks: `yoshinani/require-description` (covers both `eslint-disable` and `oxlint-disable`) and `yoshinani/no-enum`. `base.mjs` references it by absolute path so it resolves when extended from a consumer's config.

Composition gotchas (verified against oxlint 1.90): `extends` only carries `rules`, `plugins`, `overrides` (and `categories` / `options` in practice) — top-level `env` / `globals` are dropped, so environment globals go in an `overrides` entry with `files: ["**/*"]`. Nested `oxlint.config.ts` files are auto-discovered; the repo's `pnpm check` uses `--disable-nested-config` so the fixtures under `tests/fixtures/` (which have their own configs and intentionally violate rules) stay ignored.

`no-restricted-imports` encodes the org's **opinionated tech-stack choices**: e.g. zod/yup/joi → Effect Schema or valibot, lodash → remeda, axios → fetch, moment/dayjs → date-fns, MUI/emotion → shadcn+Tailwind, jest → vitest, redux/recoil → zustand/jotai. When adding library bans, follow this existing pattern in `rules/restricted-imports.mjs` (name with a Japanese `message` pointing to the preferred alternative).

Type-aware rules run through `oxlint-tsgolint` (typescript-go), so consumers need dependencies installed and a resolvable `tsconfig.json`.

## Other configs

- **oxfmt** (`oxfmt/base.mjs`) — formatter config object: no semicolons, double quotes, printWidth 80, import sorting (`sortImports` groups: builtin → external → `@repo/**` → alias → relative), Tailwind class sorting, Markdown excluded. oxfmt has no `extends`, so consumers spread it into their own `oxfmt.config.ts` (only `.ts` / `.oxfmtrc.json` are auto-discovered). The repo's own root `oxfmt.config.ts` spreads this file unchanged except for repo-specific `ignorePatterns`, so the repo is always formatted by the config it ships.
- **TypeScript** (`typescript/base.json` + `next.json`, `react-library.json`, and `effect.json` / `next-effect.json` / `react-library-effect.json`) — strict, `noUncheckedIndexedAccess`, NodeNext base, `"types": []` (TypeScript 7's default, made explicit so TS 5 / 6 / 7 behave the same; `next.json` sets its own `types`); variants override module/jsx. Supported on TypeScript 5 / 6 / 7: `tests/tsconfig.mjs` compiles `tests/fixtures/typescript/*` (with `@ts-expect-error` lines proving `types: []` and `exactOptionalPropertyTypes` take effect) and CI runs it on each major via `pnpm --package=typescript@N dlx node tests/tsconfig.mjs`. The `-effect` variants add the `@effect/language-service` plugin (diagnostics off; oxlint reports them) and `exactOptionalPropertyTypes`. `compilerOptions.plugins` is replaced, not merged, on `extends`, so `next-effect.json` re-lists the `next` plugin.
- **commitlint** (`commitlint/commitlint.config.mjs`) — conventional commits with a **restricted** `type-enum`: only `build`, `docs`, `feat`, `fix`, `refactor`, `test`, `release` (`release` is reserved for automated releases).

## Release flow

Versioning is via **Changesets**. Any change affecting consumers needs `pnpm changeset` committed in the PR; merging to `main` triggers the release GitHub Action which version-bumps, updates CHANGELOG, and publishes. Do not hand-edit `version` in `package.json` or `CHANGELOG.md`.
