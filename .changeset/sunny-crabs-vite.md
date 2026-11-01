---
"@yoshinani/style-guide": minor
---

feat: build the configs from TypeScript with Vite+ and support Vite+ projects

- The oxfmt / oxlint / commitlint configs are now written in TypeScript and published as built files with generated type declarations. Import paths are unchanged.
- The configs can be used from a Vite+ `vite.config.ts` (`fmt` / `lint` blocks) as well as from standalone `oxfmt.config.ts` / `oxlint.config.ts`.
- `oxfmt`, `oxlint` and `oxlint-tsgolint` are now optional peer dependencies (not needed with Vite+), and their minimum versions follow the ones bundled with Vite+ 1.4.0 (oxlint 1.89.0, oxfmt 0.74.0, oxlint-tsgolint 7.0.2004). `vite-plus` is an optional peer dependency.
