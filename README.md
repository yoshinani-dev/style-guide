# YOSHINANI スタイルガイド

[![npm version](https://badge.fury.io/js/@yoshinani%2Fstyle-guide.svg)](https://badge.fury.io/js/@yoshinani%2Fstyle-guide)

## はじめに

このリポジトリは、株式会社YOSHINANI のスタイルガイドのホームであり、人気のあるリンティングやスタイリングツール用の設定を含んでいます。

以下の設定が利用可能で、組み合わせて使うことを想定しています。

- [oxfmt](#oxfmt)
- [oxlint](#oxlint)
- [TypeScript](#typescript)
- [commitlint](#commitlint)
- [CSpell](#CSpell)

## コントリビュートについて

プルリクエストを作成する前に、[コントリビュートガイド](./CONTRIBUTING.md)をお読みください。

## インストール

すべての設定は1つのパッケージ `@yoshinani/style-guide` に含まれています。インストール方法は以下の通りです。

```sh
# npm を使う場合
npm i --save-dev @yoshinani/style-guide

# pnpm を使う場合
pnpm i --save-dev @yoshinani/style-guide

# Yarn を使う場合
yarn add --dev @yoshinani/style-guide
```

## oxfmt

フォーマッターには [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) を使います。

まず、プロジェクトルートにoxfmtをインストールします。

```sh
pnpm add -w -D oxfmt
```

共有のoxfmt設定を利用するには、`oxfmt.config.ts` を作成して、以下のように共有設定を展開します。oxfmtには `extends` がないため、展開して使います。

```ts
import { defineConfig } from "oxfmt"
import base from "@yoshinani/style-guide/oxfmt"

export default defineConfig({
  ...base,
  // 除外したいファイルを追加する場合は、共有設定の ignorePatterns を残したうえで追加します
  ignorePatterns: [...(base.ignorePatterns ?? []), "pnpm-lock.yaml"],
})
```

- 設定ファイルは `oxfmt.config.ts` という名前にしてください。`oxfmt.config.mjs` は自動では読み込まれません。
- Markdown はフォーマットの対象外です（共有設定の `ignorePatterns` で除外しています）。
- `.gitignore` に書かれたファイルは自動で除外されます。
- Tailwind CSS のクラスは自動で並び替えられます。独自のテーマを使っている場合は、`sortTailwindcss.stylesheet` にスタイルシートのパスを指定してください。

```ts
export default defineConfig({
  ...base,
  sortTailwindcss: {
    ...base.sortTailwindcss,
    stylesheet: "./app/globals.css",
  },
})
```

`package.json` には以下のスクリプトを追加します。

```json
"scripts": {
  "format": "oxfmt .",
  "format:check": "oxfmt --check ."
}
```

VSCodeでフォーマッターとしてoxfmtを利用する場合は、まず[Oxcの拡張機能](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)をインストールしてください。

次に、`.vscode/settings.json` に以下の設定を追加します。importの並び替えもフォーマットの一部として行われるため、`editor.codeActionsOnSave` の設定は不要です。

```jsonc
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true
}
```

プロジェクトの推奨拡張機能として設定するために、`.vscode/extensions.json`を作成し、以下の内容を追加することをお勧めします。

```jsonc
{
  "recommendations": [
    "oxc.oxc-vscode"
  ]
}
```

## oxlint

リンターには [oxlint](https://oxc.rs/docs/guide/usage/linter.html) を使います。型情報を使うルールのために `oxlint-tsgolint` も必要です。

```sh
pnpm add -w -D oxlint oxlint-tsgolint
```

利用できる設定は以下の通りです。

| 用途                             | 設定                                         |
| -------------------------------- | -------------------------------------------- |
| 汎用 TypeScript                  | `@yoshinani/style-guide/oxlint/base`          |
| Node（サーバー・CLI・ライブラリ） | `@yoshinani/style-guide/oxlint/library`       |
| React ライブラリ                 | `@yoshinani/style-guide/oxlint/react-library` |
| Next.js アプリ                   | `@yoshinani/style-guide/oxlint/next`          |

プロジェクトルートに `oxlint.config.ts` を作成し、`extends` で共有設定を読み込みます。

```ts
import { defineConfig } from "oxlint"
import library from "@yoshinani/style-guide/oxlint/library"

export default defineConfig({
  extends: [library],
  options: { typeAware: true },
})
```

- 共有設定にも `options.typeAware: true` を入れていますが、oxlint のドキュメント上はルート設定でのみ有効とされているため、ルート設定にも書いてください。
- 型情報を使うルールは、依存パッケージをインストールし、`tsconfig.json` が解決できる状態で動きます。
- `oxlint-tsgolint` は oxlint を実行するディレクトリの `node_modules` から探されます。モノレポではルートにインストールしてください。

Next.js アプリでは `oxlint/next` を使います。React のルールに加えて、oxlint の `nextjs` プラグインのルールをすべて有効にしています。App Router の特殊ファイル（`page` / `layout` など）は default export が必須で、画像生成ファイル（`opengraph-image` など）では `<img>` を使えます。

```ts
import { defineConfig } from "oxlint"
import next from "@yoshinani/style-guide/oxlint/next"

export default defineConfig({
  extends: [next],
  options: { typeAware: true },
})
```

`package.json` には以下のスクリプトを追加します。

```json
"scripts": {
  "lint": "oxlint",
  "lint:fix": "oxlint --fix"
}
```

### ルールの無効化

ルールを無効化するときは、`--` の後ろに理由を書いてください。理由のない無効化コメントはエラーになります（`eslint-disable` と `oxlint-disable` のどちらも対象です）。

```ts
// eslint-disable-next-line no-console -- CLI の出力のため
console.log(result)
```

### 禁止ライブラリを追加する

oxlint のルールオプションはマージされず置き換わります。`no-restricted-imports` に禁止ライブラリを追加するときは、共有の一覧を展開してから追加してください。

```ts
import { defineConfig } from "oxlint"
import library from "@yoshinani/style-guide/oxlint/library"
import {
  restrictedImportPaths,
  restrictedImportPatterns,
} from "@yoshinani/style-guide/oxlint/rules/restricted-imports"

export default defineConfig({
  extends: [library],
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          ...restrictedImportPaths,
          { name: "pino", message: "Effect の Logger を使ってください。" },
        ],
        patterns: restrictedImportPatterns,
      },
    ],
  },
})
```

VSCodeでは、[Oxcの拡張機能](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)（oxfmtと同じ拡張機能）で lint の結果が表示されます。保存時に自動修正する場合は、`.vscode/settings.json` に以下を追加します。

```jsonc
{
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

## TypeScript

このスタイルガイドは複数の TypeScript 設定を提供しています。利用可能な設定は以下の通りです。

| 種類          | 設定パッケージ名                                  |
| ------------- | ------------------------------------------------- |
| base          | `@yoshinani/style-guide/typescript`               |
| next          | `@yoshinani/style-guide/typescript/next`          |
| react-library | `@yoshinani/style-guide/typescript/react-library` |

共有 TypeScript 設定を使うには、`tsconfig.json` に以下のように記載します。

```json
{
  "extends": "@yoshinani/style-guide/typescript"
}
```

## commitlint

1. commitlintのインストール

```sh
pnpm add -D @commitlint/cli
```

2. `commitlint.config.mjs`を作成し以下のように記載します。

```js
export { default } from "@yoshinani/style-guide/commitlint"
```

3. コミット時のリントをする場合、huskyの設定をしてください。

```sh
pnpm add -D husky
```

`package.json`へスクリプトの追加。

```json
"scripts": {
  "prepare": "husky",
}
```

`.husky/commit-msg`を作成。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint --edit "$1"
```

## CSpell

`.vscode/cspell.json`を作成し以下のように記載します。こうすることでVSCodeからCSpellの設定が読み込まれます。

```json
{
  "$schema": "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
  "dictionaries": ["yoshinani"],
  "dictionaryDefinitions": [
    {
      "name": "yoshinani",
      "path": "../node_modules/@yoshinani/style-guide/cspell/words.txt",
      "addWords": false
    }
  ]
}
```

プロジェクトの推奨拡張機能として設定するために、`.vscode/extensions.json`を作成し、以下の内容を追加することをお勧めします。

```jsonc
{
  "recommendations": [
    "oxc.oxc-vscode",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## 例外的なスペルチェックの無効化方法

固有名詞やランダムな文字列を書き込む際に、例外的にスペルチェックを無効化できます。

```js
// 指定した行のチェックを無効化
const EXAMPLE_ID = "klfhasdflhadfasfa"  // cspell: disable-line

// 直下の行のチェックを無効化
// cspell: disable-next-line
const LONG_ID = "klajdsjffadsfafkdafjajlmmxrklermanwafwncocmoc4ezdxcasf"

// 指定範囲のチェックを無効化
// cspell: disable
const MULTI_LINE_TXT = `
a;kfjas;dklfjads
aklfdj;adsjf;lka
;kajkls;dfjal;f
`
// cspell: enable
```

[詳細なドキュメント](https://cspell.org/docs/Configuration/document-settings)

## CI上の設定

CSpellをCI上で実行する際は、GitHub Actionsに以下のような設定を追加します。

```yaml
name: 'Check spelling'
on:
  pull_request:
  push:

jobs:
  spellcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: streetsidesoftware/cspell-action@v7
```

このときの設定は`.vscode/cspell.json`から暗黙的に読み込まれます。
