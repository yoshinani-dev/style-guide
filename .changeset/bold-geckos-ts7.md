---
"@yoshinani/style-guide": major
---

feat!: support TypeScript 6 and 7

- Widen the `typescript` peer dependency to `^5 || ^6 || ^7`. Type-aware lint runs through `oxlint-tsgolint`, so it no longer depends on the installed TypeScript.
- **BREAKING**: `typescript/base.json` now sets `"types": []` (TypeScript 7's default) so TypeScript 5 / 6 / 7 behave the same. Global type definitions such as `@types/node` are no longer loaded automatically; list them in `compilerOptions.types`.
- CI validates every shared tsconfig on TypeScript 5, 6 and 7.
