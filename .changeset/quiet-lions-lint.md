---
"@yoshinani/style-guide": major
---

feat!: replace the ESLint configs with oxlint configs

- Remove `@yoshinani/style-guide/eslint/*`. Use `@yoshinani/style-guide/oxlint/base`, `oxlint/library` or `oxlint/react-library` via `extends` in `oxlint.config.ts`. A Next.js config will follow.
- `eslint/react-internal` is renamed to `oxlint/react-library`.
- `eslint` is no longer a peer dependency; `oxlint` and `oxlint-tsgolint` are.
- `functional/immutable-data` is dropped.
- Rules beyond v1 from oxlint's `correctness` category are enabled as errors, and `import/no-duplicates` is added.
- Disable comments need a reason (`-- reason`) for both `eslint-disable` and `oxlint-disable`.
- Validation libraries such as zod now point to Effect Schema or valibot.
- The banned-library lists are exported from `@yoshinani/style-guide/oxlint/rules/restricted-imports` so projects can extend them.
