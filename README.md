# Yoshinani スタイルガイド

[![npm version](https://badge.fury.io/js/@yoshinani%2Fstyle-guide.svg)](https://badge.fury.io/js/@yoshinani%2Fstyle-guide)

## はじめに

このリポジトリは、Yoshinani のスタイルガイドのホームであり、人気のあるリンティングやスタイリングツール用の設定を含んでいます。

以下の設定が利用可能で、組み合わせて使うことを想定しています。

- [Prettier](#prettier)
- [ESLint](#eslint)
- [TypeScript](#typescript)
- [commitlint](#commitlint)
- [cspell](#cspell)

## コントリビュートについて

プルリクエストを作成する前に、[コントリビュートガイド](https://github.com/yoshinani-dev/style-guide/blob/main/CONTRIBUTING.md)をお読みください。

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

## Prettier

共有 Prettier 設定を使うには、`package.json` に以下を追加してください。

```json
{
  "prettier": "@yoshinani/style-guide/prettier"
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

```bash
pnpm add -D @commitlint/cli
```

2. `commitlint.config.mjs`を作成し以下のように記載します。

```js
export { default } from "@yoshinani/style-guide/commitlint"
```

3. コミット時のリントをする場合、huskyの設定をしてください。

```bash
pnpm add -D husky
```

`package.json`へスクリプトの追加。

```json:package.json
"scripts": {
  "prepare": "husky",
}
```

`.husky/commit-msg`を作成。

```bash:.husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint --edit "$1"
```

## cspell

1. `cspell.config.mjs`を作成し以下のように記載します。

```js
const dictPath =
  import.meta.dirname + "/node_modules/@yoshinani/style-guide/cspell/words.txt"

export default {
  dictionaries: ["yoshinani-style-guide"],
  dictionaryDefinitions: [
    {
      name: "yoshinani-style-guide",
      path: dictPath,
      addWords: true,
    },
  ],
}
```

1. vscode拡張での設定

```json
{
  "cSpell.customDictionaries": {
    "yoshinani": {
      "name": "yoshinani",
      "path": "${workspaceFolder}/node_modules/@yoshinani/style-guide/cspell/words.txt",
      "addWords": false
    }
  }
}
```
