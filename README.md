# YOSHINANI スタイルガイド

[![npm version](https://badge.fury.io/js/@yoshinani%2Fstyle-guide.svg)](https://badge.fury.io/js/@yoshinani%2Fstyle-guide)

## はじめに

このリポジトリは、株式会社YOSHINANI のスタイルガイドのホームであり、人気のあるリンティングやスタイリングツール用の設定を含んでいます。

以下の設定が利用可能で、組み合わせて使うことを想定しています。

- [oxfmt](#oxfmt)
- [ESLint](#eslint)
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

## ESLint

利用できる設定は以下の通りです。

- `@yoshinani/style-guide/eslint/base`
- `@yoshinani/style-guide/eslint/next`
- `@yoshinani/style-guide/eslint/library`
- `@yoshinani/style-guide/eslint/react-internal`

例として、Next.js プロジェクトで共有 ESLint 設定を使う場合、`eslint.config.mjs` に以下のように記載します。

```js
import next from "@yoshinani/style-guide/eslint/next"

const eslintConfig = [...next]

export default eslintConfig
```

プロジェクトの推奨拡張機能として設定するために、`.vscode/extensions.json`を作成し、以下の内容を追加することをお勧めします。

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint"
  ]
}
```

## TypeScript

このスタイルガイドは複数の TypeScript 設定を提供しています。利用可能な設定は以下の通りです。

| 種類          | 設定パッケージ名                                  |
| ------------- | ------------------------------------------------- |
| base          | `@yoshinani/style-guide/typescript`               |
| nextjs        | `@yoshinani/style-guide/typescript/nextjs`        |
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
