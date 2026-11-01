# @yoshinani/style-guide

## 2.0.0-beta.0

### Major Changes

- 5e4d0a7: feat!: support TypeScript 6 and 7

  - Widen the `typescript` peer dependency to `^5 || ^6 || ^7`. Type-aware lint runs through `oxlint-tsgolint`, so it no longer depends on the installed TypeScript.
  - **BREAKING**: `typescript/base.json` now sets `"types": []` (TypeScript 7's default) so TypeScript 5 / 6 / 7 behave the same. Global type definitions such as `@types/node` are no longer loaded automatically; list them in `compilerOptions.types`.
  - CI validates every shared tsconfig on TypeScript 5, 6 and 7.

- 4744174: feat!: replace the Biome config with an oxfmt config

  - Remove `@yoshinani/style-guide/biome`; use `@yoshinani/style-guide/oxfmt` instead (spread it into your `oxfmt.config.ts`).
  - `@biomejs/biome` is no longer a peer dependency; `oxfmt` is.
  - Markdown files are no longer formatted; YAML files now are.
  - Tailwind CSS classes are now sorted.

- bc565b0: feat!: stop adding `vitest/importMeta` to `typescript/next`

  `typescript/next` no longer sets `"types": ["vitest/importMeta"]` and inherits `"types": []` from the base config, so Next.js projects without vitest no longer fail with TS2688. Projects that use vitest in-source testing (`import.meta.vitest`) should add `vitest/importMeta` (or `vite-plus/test/importMeta` with Vite+) to `compilerOptions.types`.

- 00df80d: feat!: replace the ESLint configs with oxlint configs

  - Remove `@yoshinani/style-guide/eslint/*`. Use `@yoshinani/style-guide/oxlint/base`, `oxlint/library` or `oxlint/react-library` via `extends` in `oxlint.config.ts`. A Next.js config will follow.
  - `eslint/react-internal` is renamed to `oxlint/react-library`.
  - `eslint` is no longer a peer dependency; `oxlint` and `oxlint-tsgolint` are.
  - `functional/immutable-data` is dropped.
  - Rules beyond v1 from oxlint's `correctness` category are enabled as errors, and `import/no-duplicates` is added.
  - Disable comments need a reason (`-- reason`) for both `eslint-disable` and `oxlint-disable`.
  - Validation libraries such as zod now point to Effect Schema or valibot.
  - The banned-library lists are exported from `@yoshinani/style-guide/oxlint/rules/restricted-imports` so projects can extend them.

- c2ce221: feat!: add the Next.js oxlint config and rename the Next.js TypeScript config

  - Add `@yoshinani/style-guide/oxlint/next`: React rules plus every rule of oxlint's `nextjs` plugin as errors. App Router special files require a default export, and image-generation files may use `<img>`.
  - Rename `@yoshinani/style-guide/typescript/nextjs` to `@yoshinani/style-guide/typescript/next`.

- dbb25a2: feat!: require Node.js 22.18 or later

  oxfmt and oxlint load `oxfmt.config.ts` / `oxlint.config.ts` with Node.js type stripping, which is enabled by default from Node.js 22.18.

### Minor Changes

- 0c2c913: feat: add Effect-TS (v4) variants

  - Add `oxlint/base-effect`, `oxlint/library-effect`, `oxlint/react-library-effect` and `oxlint/next-effect`, which add the `recommended` preset of Effect's official oxlint integration (`@effect/tsgo`). `effecttsgo/unstable-api-usage` is off in test files.
  - Add `typescript/effect`, `typescript/react-library-effect` and `typescript/next-effect`, which add the `@effect/language-service` plugin (diagnostics off) and `exactOptionalPropertyTypes`.
  - `@effect/tsgo` is an optional peer dependency. The Effect rules require an Effect-patched oxlint (`effect-tsgo patch --oxlint --no-typescript`) or running oxlint through `effect-tsgo oxlint`.

- ae4b26a: feat: build the configs from TypeScript with Vite+ and support Vite+ projects

  - The oxfmt / oxlint / commitlint configs are now written in TypeScript and published as built files with generated type declarations. Import paths are unchanged.
  - The configs can be used from a Vite+ `vite.config.ts` (`fmt` / `lint` blocks) as well as from standalone `oxfmt.config.ts` / `oxlint.config.ts`.
  - `oxfmt`, `oxlint` and `oxlint-tsgolint` are now optional peer dependencies (not needed with Vite+), and their minimum versions follow the ones bundled with Vite+ 1.4.0 (oxlint 1.89.0, oxfmt 0.74.0, oxlint-tsgolint 7.0.2004). `vite-plus` is an optional peer dependency.

### Patch Changes

- c91cab2: fix: update restricted-import messages

  - express / `@nestjs/*`: point to Next.js Route Handlers (instead of API Routes) or Hono.
  - typeorm: point to Prisma or Drizzle ORM.

## 1.0.8

### Patch Changes

- fcb2084: chore(deps-dev): bump the dev-dependencies group across 1 directory with 2 updates
- f2297b3: chore(deps): bump @eslint-community/eslint-plugin-eslint-comments from 4.7.2 to 4.8.1

## 1.0.7

### Patch Changes

- 147f210: chore(deps): bump typescript-eslint from 8.66.0 to 8.67.0 in the eslint-dependencies group
- 938bd68: chore(release): upgrade @changesets/cli to v3 and changesets/action to v2 to fix release CI

## 1.0.6

### Patch Changes

- 147f210: chore(deps): bump typescript-eslint from 8.65.0 to 8.66.0 in the eslint-dependencies group

## 1.0.5

### Patch Changes

- 7204154: chore(deps): bump typescript-eslint from 8.64.0 to 8.65.0 in the eslint-dependencies group

## 1.0.4

### Patch Changes

- 82d4656: chore(deps): bump typescript-eslint from 8.63.0 to 8.64.0 in the eslint-dependencies group

## 1.0.3

### Patch Changes

- 8c8b830: chore(deps): bump typescript-eslint from 8.62.0 to 8.62.1 in the eslint-dependencies group
- 350d657: chore(deps): bump the eslint-dependencies group with 2 updates

## 1.0.2

### Patch Changes

- da45a47: chore(deps): bump typescript-eslint from 8.61.1 to 8.62.0 in the eslint-dependencies group

## 1.0.1

### Patch Changes

- 96c09d4: ESLint config の`tseslint.config()`を`defineConfig()`（`eslint/config`）に移行
- 96c09d4: - `eslint-plugin-no-barrel-files`を`configs.recommended`スプレッドに変更
  - `eslint/rules/react.mjs`・`react-hooks.mjs`に JSDoc 型アノテーションを追加

## 1.0.0

### Major Changes

- 530be8f: import sort を Biome に一任。ESLint から `import/order` と `sort-imports` を削除し、Biome の organizeImports を有効化した。
- c98f617: Prettier 設定を削除。フォーマッタは Biome に一本化したため、`@yoshinani/style-guide/prettier` の export と `prettier` の peerDependency を廃止した。利用側は Biome のフォーマッタへ移行が必要な破壊的変更。

## 0.18.1

### Patch Changes

- 91e6a60: chore(deps): bump @eslint-community/eslint-plugin-eslint-comments from 4.7.1 to 4.7.2
- 9ec6311: chore(deps): bump typescript-eslint from 8.60.0 to 8.60.1 in the eslint-dependencies group

## 0.18.0

### Minor Changes

- 0c57d14: remove for statement rule

## 0.17.12

### Patch Changes

- 578a1ed: chore(deps): bump the eslint-dependencies group across 1 directory with 2 updates
- 10f645a: chore(deps-dev): bump the dev-dependencies group across 1 directory with 2 updates
- 263d64d: chore(deps): bump @commitlint/config-conventional from 20.5.0 to 20.5.3 in the commitlint-dependencies group across 1 directory

## 0.17.11

### Patch Changes

- 16ae37a: Add eslint-plugin-no-barrel-files to prohibit barrel exports

## 0.17.10

### Patch Changes

- 0e4a972: chore(deps): bump typescript-eslint from 8.58.1 to 8.58.2 in the eslint-dependencies group
- e2eeec4: chore(deps): bump typescript-eslint from 8.58.0 to 8.58.1 in the eslint-dependencies group

## 0.17.9

### Patch Changes

- a3c6394: chore(deps): bump typescript-eslint from 8.57.0 to 8.57.1 in the eslint-dependencies group
- 87e2e72: chore(deps-dev): bump the dev-dependencies group with 2 updates
- 6296669: chore(deps): bump @commitlint/config-conventional from 20.4.2 to 20.4.3 in the commitlint-dependencies group
- 475e364: chore(deps): bump @commitlint/config-conventional from 20.4.3 to 20.5.0 in the commitlint-dependencies group
- 96c9b30: chore(deps): bump the eslint-dependencies group across 1 directory with 2 updates

## 0.17.8

### Patch Changes

- 9b3e716: chore(deps): bump the eslint-dependencies group across 1 directory with 3 updates
- 24b9dd6: chore(deps): bump @eslint-community/eslint-plugin-eslint-comments from 4.6.0 to 4.7.1

## 0.17.7

### Patch Changes

- 70bb2d7: chore(deps): bump typescript-eslint from 8.54.0 to 8.55.0 in the eslint-dependencies group

## 0.17.6

### Patch Changes

- 3e924a5: chore(deps-dev): bump @biomejs/biome from 2.3.13 to 2.3.14 in the dev-dependencies group
- 95f89b0: chore(deps): bump typescript-eslint from 8.53.1 to 8.54.0 in the eslint-dependencies group
- 1fd7c22: chore(deps): bump @commitlint/config-conventional from 20.3.1 to 20.4.1 in the commitlint-dependencies group

## 0.17.5

### Patch Changes

- 61c1d7a: 辞書を追加

## 0.17.4

### Patch Changes

- c4d088c: commitlint/config-conventional のアップグレード漏れを修正

## 0.17.3

### Patch Changes

- 1d01456: 辞書を追加

## 0.17.2

### Patch Changes

- cd41913: chore(deps): bump @eslint-community/eslint-plugin-eslint-comments from 4.5.0 to 4.6.0
- cac07cb: autoincrement、fkey、pkey を辞書に追加

## 0.17.1

### Patch Changes

- bcb407f: 辞書に vercel を追加

## 0.17.0

### Minor Changes

- 68319ba: upgrade @commitlint/cli 20

### Patch Changes

- 9c5c98e: chore(deps-dev): bump @biomejs/biome from 2.3.8 to 2.3.10 in the dev-dependencies group
- 20ae3c7: chore(deps): bump typescript-eslint from 8.51.0 to 8.52.0 in the eslint-dependencies group
- 8ec260d: chore(deps): bump typescript-eslint from 8.50.1 to 8.51.0 in the eslint-dependencies group

## 0.16.2

### Patch Changes

- fd01948: eslint-import-resolver-typescript の不足を修正

## 0.16.1

### Patch Changes

- ab02571: fix repository url
- bafd659: chore(deps): bump the eslint-dependencies group with 2 updates
- 656a79e: chore(deps): bump the eslint-dependencies group with 2 updates

## 0.16.0

### Minor Changes

- 0af699e: tsup を非推奨にし tsdown を推奨

## 0.15.2

### Patch Changes

- 6a4a73a: chore(deps): bump the eslint-dependencies group with 2 updates
- 3bb4907: chore(deps-dev): bump @biomejs/biome from 2.3.4 to 2.3.7 in the dev-dependencies group
- 05e16c2: chore(deps): bump typescript-eslint from 8.47.0 to 8.48.0 in the eslint-dependencies group

## 0.15.1

### Patch Changes

- fb71ec1: chore(deps): bump the eslint-dependencies group across 1 directory with 2 updates
- ce793e5: chore(deps): bump globals from 16.4.0 to 16.5.0 in the other-dependencies group

## 0.15.0

### Minor Changes

- 28d6471: tailwindDirectives を有効化

## 0.14.4

### Patch Changes

- 94c9351: chore(deps): bump typescript-eslint from 8.46.1 to 8.46.2 in the eslint-dependencies group
- aacd8c5: chore(deps-dev): bump @biomejs/biome from 2.2.6 to 2.3.1 in the dev-dependencies group

## 0.14.3

### Patch Changes

- 4fee094: npm publish 時に oidc を用いるようにした
- e0a36af: chore(deps): bump actions/setup-node from 5 to 6 in the github-actions group
- 708ecef: chore(deps): bump the eslint-dependencies group with 3 updates
- e4888a8: 辞書を追加

## 0.14.2

### Patch Changes

- 8ef00b7: cspell 設定を.vscode/配下に移動し vscode の設定と共通化
- 4bd3b6d: chore(deps-dev): bump @biomejs/biome from 2.2.5 to 2.2.6 in the dev-dependencies group

## 0.14.1

### Patch Changes

- 54842cb: chore(deps-dev): bump @biomejs/biome from 2.2.4 to 2.2.5 in the dev-dependencies group

## 0.14.0

### Minor Changes

- 1dd6a01: eslint-plugin-tailwindcss を削除し eslint-plugin-better-tailwindcss に移行

### Patch Changes

- 3e5d1dd: ドキュメントを微修正

## 0.13.3

### Patch Changes

- a7646b5: chore(deps): bump the eslint-dependencies group with 2 updates

## 0.13.2

### Patch Changes

- a8e9f25: chore(deps-dev): bump the dev-dependencies group across 1 directory with 2 updates
- 264e05f: chore(deps): bump globals from 16.3.0 to 16.4.0 in the other-dependencies group

## 0.13.1

### Patch Changes

- 03ef393: chore(deps): bump the eslint-dependencies group across 1 directory with 2 updates
- aba6fa0: chore(deps): bump actions/setup-node from 4 to 5 in the github-actions group
- 69591bf: chore(deps-dev): bump @biomejs/biome from 2.2.2 to 2.2.3 in the biome-dependencies group

## 0.13.0

### Minor Changes

- d7ae54f: biome.jsonc に vcs 設定を追加

## 0.12.3

### Patch Changes

- ccf9135: 辞書を追加
- 44edbf1: chore(deps-dev): bump @biomejs/biome from 2.1.2 to 2.1.4 in the biome-dependencies group
- 511d32c: YOSHINANI を大文字に統一

## 0.12.2

### Patch Changes

- e935d06: update dependency and fix engines

## 0.12.1

### Patch Changes

- c96c5ab: 辞書を追加

## 0.12.0

### Minor Changes

- a868bd1: biome の organizeImports の推奨設定を追加

## 0.11.0

### Minor Changes

- bc2b824: package.json に type: module を指定

### Patch Changes

- c4fdca9: 辞書を追加

## 0.10.3

### Patch Changes

- d26a49f: provenance を有効化

## 0.10.2

### Patch Changes

- 562584b: pnpm を v10 に固定、その微修正

## 0.10.1

### Patch Changes

- b93bf42: biome.jsonc が package.json の files から漏れていた問題を修正

## 0.10.0

### Minor Changes

- 2109572: Biome の設定ファイルを追加し prettier だけ Biome に移行

## 0.9.0

### Minor Changes

- aacf9fb: 辞書を追加

## 0.8.0

### Minor Changes

- b6b13eb: Stripe の用語を追加
- 87ecb4d: commit type

## 0.7.0

### Minor Changes

- 6b98adf: feat(eslint): consistent-type-imports を有効化

## 0.6.0

### Minor Changes

- 7413bf0: 辞書を追加

## 0.5.1

### Patch Changes

- 7b5b6de: 辞書を追加

## 0.5.0

### Minor Changes

- 67d7d10: 辞書を追加

## 0.4.0

### Minor Changes

- b1c0a7f: 辞書を追加しソート

## 0.3.0

### Minor Changes

- b271bd0: Cursor Rules と非推奨ライブラリの追加

## 0.2.4

### Patch Changes

- 2828014: トーストの実装方法を追記

## 0.2.3

### Patch Changes

- 9587982: Change Rule: prop-types
