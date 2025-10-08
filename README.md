# YOSHINANI スタイルガイド

[![npm version](https://badge.fury.io/js/@yoshinani%2Fstyle-guide.svg)](https://badge.fury.io/js/@yoshinani%2Fstyle-guide)

## はじめに

このリポジトリは、株式会社YOSHINANI のスタイルガイドのホームであり、人気のあるリンティングやスタイリングツール用の設定を含んでいます。

以下の設定が利用可能で、組み合わせて使うことを想定しています。

- [Prettier](#prettier) または [Biome](#biome)
- [ESLint](#eslint)
- [TypeScript](#typescript)
- [commitlint](#commitlint)
- [cspell](#cspell)

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

## Prettier

共有 Prettier 設定を使うには、`package.json` に以下を追加してください。

```json
{
  "prettier": "@yoshinani/style-guide/prettier"
}
```

## Biome

現在、この設定ではBiomeのフォーマッター機能のみを有効にしています。リンターとしては、別途 [ESLint](#eslint) を設定してください。

まず、プロジェクトルートにBiomeをインストールします。

```sh
pnpm add -w -D @biomejs/biome
```

共有のBiome設定を利用するには、`biome.jsonc` を作成して、以下のように `extends` を設定します。

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@yoshinani/style-guide/biome"],
  "files": {
    "includes": ["**", "!**/.next", "!**/.turbo"]
  }
}
```

VSCodeでフォーマッターとしてBiomeを利用する場合は、まず[Biomeの拡張機能](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)をインストールしてください。

次に、`.vscode/settings.json` に以下の設定を追加します。

```json
{
  "biome.enabled": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

プロジェクトの推奨拡張機能として設定するために、`.vscode/extensions.json`を作成し、以下の内容を追加することをお勧めします。

```json
{
  "recommendations": [
    "biomejs.biome"
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

`.vscode/cspell.json`を作成し以下のように記載します。

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
