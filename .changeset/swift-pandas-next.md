---
"@yoshinani/style-guide": major
---

feat!: add the Next.js oxlint config and rename the Next.js TypeScript config

- Add `@yoshinani/style-guide/oxlint/next`: React rules plus every rule of oxlint's `nextjs` plugin as errors. App Router special files require a default export, and image-generation files may use `<img>`.
- Rename `@yoshinani/style-guide/typescript/nextjs` to `@yoshinani/style-guide/typescript/next`.
