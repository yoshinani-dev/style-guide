---
"@yoshinani/style-guide": major
---

feat!: replace the Biome config with an oxfmt config

- Remove `@yoshinani/style-guide/biome`; use `@yoshinani/style-guide/oxfmt` instead (spread it into your `oxfmt.config.ts`).
- `@biomejs/biome` is no longer a peer dependency; `oxfmt` is.
- Markdown files are no longer formatted; YAML files now are.
- Tailwind CSS classes are now sorted.
