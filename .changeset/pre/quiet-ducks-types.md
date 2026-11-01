---
"@yoshinani/style-guide": major
---

feat!: stop adding `vitest/importMeta` to `typescript/next`

`typescript/next` no longer sets `"types": ["vitest/importMeta"]` and inherits `"types": []` from the base config, so Next.js projects without vitest no longer fail with TS2688. Projects that use vitest in-source testing (`import.meta.vitest`) should add `vitest/importMeta` (or `vite-plus/test/importMeta` with Vite+) to `compilerOptions.types`.
