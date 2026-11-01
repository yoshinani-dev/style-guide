---
"@yoshinani/style-guide": minor
---

feat: add Effect-TS (v4) variants

- Add `oxlint/base-effect`, `oxlint/library-effect`, `oxlint/react-library-effect` and `oxlint/next-effect`, which add the `recommended` preset of Effect's official oxlint integration (`@effect/tsgo`). `effecttsgo/unstable-api-usage` is off in test files.
- Add `typescript/effect`, `typescript/react-library-effect` and `typescript/next-effect`, which add the `@effect/language-service` plugin (diagnostics off) and `exactOptionalPropertyTypes`.
- `@effect/tsgo` is an optional peer dependency. The Effect rules require an Effect-patched oxlint (`effect-tsgo patch --oxlint --no-typescript`) or running oxlint through `effect-tsgo oxlint`.
