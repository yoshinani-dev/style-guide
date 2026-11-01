# v1 から v2 への移行ガイド

v2 では、フォーマッターを Biome から [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) に、リンターを ESLint から [oxlint](https://oxc.rs/docs/guide/usage/linter.html) に置き換えました。あわせて、Next.js 向けのルールと Effect-TS 向けの設定を追加しています。

各設定の詳しい使い方は [README](./README.md) を参照してください。

## 必要な環境

- **Node.js 22.18 以上**（`oxfmt.config.ts` / `oxlint.config.ts` を Node.js の型の除去機能で読み込むため）

## 設定の対応表

| v1                                                | v2                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `@yoshinani/style-guide/biome`                    | `@yoshinani/style-guide/oxfmt`                                     |
| `@yoshinani/style-guide/eslint/base`              | `@yoshinani/style-guide/oxlint/base`                               |
| `@yoshinani/style-guide/eslint/library`           | `@yoshinani/style-guide/oxlint/library`                            |
| `@yoshinani/style-guide/eslint/react-internal`    | `@yoshinani/style-guide/oxlint/react-library`（改名）               |
| `@yoshinani/style-guide/eslint/next`              | `@yoshinani/style-guide/oxlint/next`                               |
| `@yoshinani/style-guide/typescript`               | `@yoshinani/style-guide/typescript`（変更なし）                     |
| `@yoshinani/style-guide/typescript/nextjs`        | `@yoshinani/style-guide/typescript/next`（改名）                    |
| `@yoshinani/style-guide/typescript/react-library` | `@yoshinani/style-guide/typescript/react-library`（変更なし）       |
| `@yoshinani/style-guide/commitlint`               | `@yoshinani/style-guide/commitlint`（変更なし）                     |

Effect-TS（v4）を使うプロジェクトでは、oxlint と TypeScript の設定にそれぞれ Effect あり版（`oxlint/next-effect`、`typescript/next-effect` など）があります。[Effect を使う場合](#effect-を使う場合)を参照してください。

## 移行手順

### 1. パッケージを入れ替える

```sh
pnpm remove @biomejs/biome eslint

# oxfmt / oxlint を単体で使う場合
pnpm add -D @yoshinani/style-guide@beta oxfmt oxlint oxlint-tsgolint

# Vite+ を使う場合（oxfmt / oxlint / oxlint-tsgolint は Vite+ に同梱されています）
pnpm add -D @yoshinani/style-guide@beta vite-plus
```

Vite+ を使う場合は、手順 2・3 の `oxfmt.config.ts` / `oxlint.config.ts` の代わりに、`vite.config.ts` の `fmt` / `lint` ブロックで共有設定を読み込みます。書き方は [README の「Vite+ で使う場合」](./README.md#vite-で使う場合) を参照してください。

v1 のために ESLint のプラグインを個別に入れていた場合は、それも削除してください。

### 2. フォーマッターを oxfmt に切り替える

`biome.jsonc` を削除し、`oxfmt.config.ts` を作成します。設定ファイルは `.ts` で作ってください（`oxfmt.config.mjs` は自動では読み込まれません）。

```ts
import { defineConfig } from "oxfmt"
import base from "@yoshinani/style-guide/oxfmt"

export default defineConfig({
  ...base,
  // 除外したいファイルがある場合は、共有設定の ignorePatterns を残したうえで追加する
  ignorePatterns: [...(base.ignorePatterns ?? []), "pnpm-lock.yaml"],
})
```

v1 で `biome.jsonc` の `files.includes` に `!**/.next` などの除外を書いていた場合、`.gitignore` に書かれていれば oxfmt でも自動で除外されます。

### 3. リンターを oxlint に切り替える

`eslint.config.mjs` を削除し、`oxlint.config.ts` を作成します。

```ts
import { defineConfig } from "oxlint"
import next from "@yoshinani/style-guide/oxlint/next"

export default defineConfig({
  extends: [next],
  options: { typeAware: true },
})
```

v1 で `no-restricted-imports` の禁止ライブラリを追加していた場合は、共有の一覧を展開してから追加してください（oxlint のルールオプションはマージされず置き換わるため）。書き方は [README](./README.md#禁止ライブラリを追加する) を参照してください。

### 4. tsconfig を更新する

`typescript/nextjs` を使っていた場合は、`typescript/next` に書き換えます。

```json
{
  "extends": "@yoshinani/style-guide/typescript/next"
}
```

v2 の base 設定は `"types": []` を明示しています（TypeScript 7 の既定値に合わせるため）。`@types/node` などのグローバルな型定義を使っている場合は、`types` で指定してください。

```json
{
  "extends": "@yoshinani/style-guide/typescript",
  "compilerOptions": {
    "types": ["node"]
  }
}
```

### 5. スクリプト・CI・エディターの設定を更新する

`package.json` のスクリプトを書き換えます。

```json
"scripts": {
  "format": "oxfmt .",
  "format:check": "oxfmt --check .",
  "lint": "oxlint",
  "lint:fix": "oxlint --fix"
}
```

VSCode では、Biome と ESLint の拡張機能の代わりに [Oxc の拡張機能](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) を使います。`.vscode/settings.json` と `.vscode/extensions.json` を次のように更新してください。import の並び替えはフォーマットの一部として行われるため、`source.organizeImports.biome` の設定は不要です。

```jsonc
// .vscode/settings.json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

```jsonc
// .vscode/extensions.json
{
  "recommendations": ["oxc.oxc-vscode"]
}
```

### 6. フォーマットを 1 コミットにまとめる

v1（Biome）と v2（oxfmt）では、フォーマット結果が完全には一致しません（細かな差は許容する方針です）。初回のフォーマットによる差分は、ほかの変更と混ぜずに 1 コミットにまとめてください。

```sh
pnpm format
git commit -am "style: format with oxfmt"
```

そのうえで、このコミットを `.git-blame-ignore-revs` に登録すると、`git blame` や GitHub の blame 表示でフォーマットだけの変更を飛ばせます。

```sh
git rev-parse HEAD >> .git-blame-ignore-revs
git add .git-blame-ignore-revs
git commit -m "chore: ignore oxfmt formatting commit in git blame"
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

### 7. lint の結果を確認する

```sh
pnpm lint
```

v1 で検出されなかったものが新たに検出されることがあります（次の節を参照）。

## 挙動の違い

### フォーマット

- **Markdown はフォーマットしません。**（Biome でも対象外でした）
- **YAML をフォーマットするようになりました。**
- **Tailwind CSS のクラスを並び替えるようになりました。** 独自のテーマを使っている場合は、`sortTailwindcss.stylesheet` にスタイルシートのパスを指定してください。
- `printWidth`（80）、セミコロンなし、ダブルクォート、import のグループ順は v1 と同じです。
- 同じモジュールからの import は統合されません。代わりに lint（`import/no-duplicates`）で検出し、`oxlint --fix` で統合できます。

### lint

- **`functional/immutable-data` は廃止しました。** 利用者側の対応は不要です（検出されなくなるだけです）。
- **oxlint の `correctness` カテゴリのルールを `error` で有効にしています。** 明らかな誤りを検出するルールで、React Compiler 系のルール（`react/set-state-in-effect` など）も含まれます。v1 では検出されなかったものが出ることがあります。
- **`import/no-duplicates` を追加しました。**
- **zod などを禁止するメッセージが「Effect Schema または valibot を使用してください」に変わりました。**
- **Next.js 向けの設定では、oxlint の `nextjs` プラグインのルールをすべて有効にしています。** v1 の `eslint/next` には Next.js 専用のルールは入っていませんでした。App Router の特殊ファイル（`page` / `layout` など）は default export が必須で、画像生成ファイル（`opengraph-image` など）では `<img>` を使えます。
- **無効化コメントには理由が必要です。** v1 と同じく `eslint-disable` で理由のないものはエラーになり、v2 では `oxlint-disable` も対象になりました。

  ```ts
  // eslint-disable-next-line no-console -- CLI の出力のため
  console.log(result)
  ```

- **v1 のルール名で書いた無効化コメントはそのまま使えます。** `@typescript-eslint/no-explicit-any`、`react-hooks/exhaustive-deps`、`no-process-env` などは、oxlint の対応するルールにも効きます。
- 型情報を使うルールは、依存パッケージをインストールし、`tsconfig.json` が解決できる状態で動きます。`oxlint-tsgolint` はモノレポのルートにインストールしてください。

### TypeScript

- **TypeScript 7 に対応しました。** TypeScript 5 / 6 / 7 をサポートしています。v1 では typescript-eslint が TypeScript 7 に未対応だったため使えませんでしたが、v2 の型情報を使う lint は `oxlint-tsgolint` で動くため、TypeScript のバージョンに依存しません。
- **base 設定で `"types": []` を明示しました。** `@types/node` などのグローバルな型定義が自動で読み込まれなくなるため、必要な場合は `types` で指定してください（[手順 4](#4-tsconfig-を更新する)）。

## Effect を使う場合

Effect v4 を使うプロジェクトでは、Effect あり版の設定を使います。Effect v3 は対象外です。

```sh
pnpm add -D @effect/tsgo
```

```ts
// oxlint.config.ts
import { defineConfig } from "oxlint"
import nextEffect from "@yoshinani/style-guide/oxlint/next-effect"

export default defineConfig({
  extends: [nextEffect],
  options: { typeAware: true },
})
```

```json
// tsconfig.json
{
  "extends": "@yoshinani/style-guide/typescript/next-effect"
}
```

Effect のルールは Effect 版の oxlint でしか動かないため、`prepare` スクリプトでパッチを当てるか、`effect-tsgo oxlint` 経由で実行してください。また、TypeScript の Effect あり版では `exactOptionalPropertyTypes` が有効になります。詳しくは [README の Effect-TS の節](./README.md#effect-ts) を参照してください。

v1 で `@effect/language-service` を tsconfig の `plugins` に自分で追加していた場合は、Effect あり版の tsconfig に含まれているので削除できます。
