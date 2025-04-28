# Yoshinani スタイルガイド

## はじめに

このリポジトリは、Yoshinani のスタイルガイドのホームであり、人気のあるリンティングやスタイリングツール用の設定を含んでいます。

以下の設定が利用可能で、組み合わせて使うことを想定しています。

- [Prettier](#prettier)
- [ESLint](#eslint)
- [TypeScript](#typescript)

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

一部の ESLint 設定にはピア依存関係が必要です。必要な場合は [ESLint](#eslint) セクションで記載しています。

## Prettier

> 注意: Prettier はこのパッケージのピア依存関係であり、プロジェクトのルートにインストールする必要があります。
>
> 参考: https://prettier.io/docs/en/install.html

共有 Prettier 設定を使うには、`package.json` に以下を追加してください。

```json
{
  "prettier": "@yoshinani/style-guide/prettier"
}
```

## ESLint

> 注意: ESLint はこのパッケージのピア依存関係であり、プロジェクトのルートにインストールする必要があります。
>
> 参考: https://eslint.org/docs/user-guide/getting-started#installation-and-usage

利用できる設定は以下の通りです。

- `@yoshinani/style-guide/eslint/base`
- `@yoshinani/style-guide/eslint/next`
- `@yoshinani/style-guide/eslint/library`
- `@yoshinani/style-guide/eslint/react-internal`

> ESLint の設定解決の問題（[eslint/eslint#9188](https://github.com/eslint/eslint/issues/9188)）のため、`require.resolve` を使って絶対パスを指定してください。

例として、Next.js プロジェクトで共有 ESLint 設定を使う場合、`.eslintrc.js` に以下のように記載します。

```js
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("@yoshinani/style-guide/eslint/next")],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
}
```

### `overrides` を使ったスコープ設定

ESLint 設定は特定のパスにスコープできます。これにより、ルールが不要な場所に適用されるのを防げます。

例として、Jest のルールをテストファイルのみに適用する場合は以下のようにします。

```js
module.exports = {
  extends: [require.resolve('@yoshinani/style-guide/eslint/node')],
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: [require.resolve('@yoshinani/style-guide/eslint/jest')],
    },
  ],
};
```

## TypeScript

このスタイルガイドは複数の TypeScript 設定を提供しています。これらの設定は LTS の Node.js バージョンに対応しており、それぞれに適した `lib`、`module`、`target`、`moduleResolution` 設定が含まれています。利用可能な設定は以下の通りです。

| 種類           | 設定パッケージ名                                      |
| -------------- | --------------------------------------------------- |
| base           | `@yoshinani/style-guide/typescript/base`            |
| nextjs         | `@yoshinani/style-guide/typescript/nextjs`          |
| react-library  | `@yoshinani/style-guide/typescript/react-library`   |

共有 TypeScript 設定を使うには、`tsconfig.json` に以下のように記載します。

```json
{
  "extends": "@yoshinani/style-guide/typescript"
}
```

ベースとなる TypeScript 設定は [`@yoshinani/style-guide/typescript`](./typescript/tsconfig.base.json) としても利用可能で、一般的なルールのみを指定しています。`lib`、`module`、`target`、`moduleResolution` 設定をカスタマイズする場合はこのファイルを継承してください。

## commitlint

1. 各プロジェクトで、`@commitlint/cli`、`husty`をインストールしてください。

2. ルートに`commitlint.config.mjs`を作成してください。

```js:commitlint.config.mjs
export { default } from "@yoshinani/style-guide/commitlint"
```

3. huskyの設定をしてください。

```bash:.husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint --edit "$1"
```

```json:package.json
"scripts": {
  "prepare": "husky",
}
```