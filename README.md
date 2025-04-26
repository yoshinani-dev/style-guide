> [!CAUTION]
> このリポジトリはアーカイブされ、サンセットされました。既存の設定は参考のために公開されたままです。

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

この ESLint 設定は合成可能（composable）です。

以下のベース設定が利用可能です。これらの設定は `extends` の最初に記載してください（どちらか一方または両方を使用可能）。

- `@yoshinani/style-guide/eslint/browser`
- `@yoshinani/style-guide/eslint/node`

設定をスコープして、特定のファイルのみに適用することもできます。詳細は [Scoped configuration with `overrides`](#scoped-configuration-with-overrides) を参照してください。

追加で利用できる設定は以下の通りです。

- `@yoshinani/style-guide/eslint/jest`
- `@yoshinani/style-guide/eslint/jest-react`（`@testing-library/react` のルールを含む）
- `@yoshinani/style-guide/eslint/next`（`@next/eslint-plugin-next` を `next` と同じバージョンでインストールする必要あり）
- `@yoshinani/style-guide/eslint/playwright-test`
- `@yoshinani/style-guide/eslint/react`
- `@yoshinani/style-guide/eslint/typescript`（`typescript` のインストールと[追加設定](#configuring-eslint-for-typescript)が必要）
- `@yoshinani/style-guide/eslint/vitest`

> ESLint の設定解決の問題（[eslint/eslint#9188](https://github.com/eslint/eslint/issues/9188)）のため、`require.resolve` を使って絶対パスを指定してください。

例として、Next.js プロジェクトで共有 ESLint 設定を使う場合、`.eslintrc.js` に以下のように記載します。

```js
module.exports = {
  extends: [
    require.resolve('@yoshinani/style-guide/eslint/browser'),
    require.resolve('@yoshinani/style-guide/eslint/react'),
    require.resolve('@yoshinani/style-guide/eslint/next'),
  ],
};
```

### TypeScript 用 ESLint 設定

TypeScript 設定で有効になっている一部のルールは追加の型情報が必要です。`tsconfig.json` へのパスを指定してください。

詳細は https://typescript-eslint.io/docs/linting/type-linting を参照してください。

```js
const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  extends: [
    require.resolve('@yoshinani/style-guide/eslint/node'),
    require.resolve('@yoshinani/style-guide/eslint/typescript'),
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
};
```

### `jsx-a11y` のカスタムコンポーネント設定

React アプリでは、`Button` などの共通コンポーネントでネイティブ要素をラップすることが一般的です。`jsx-a11y` の `components` 設定でこの情報を渡せます。

以下は一例です。

```js
module.exports = {
  root: true,
  extends: [require.resolve('@yoshinani/style-guide/eslint/react')],
  settings: {
    'jsx-a11y': {
      components: {
        Article: 'article',
        Button: 'button',
        Image: 'img',
        Input: 'input',
        Link: 'a',
        Video: 'video',
      },
    },
  },
};
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

#### ファイル拡張子について

デフォルトでは、すべての TypeScript ルールは `.ts` および `.tsx` ファイルにスコープされています。

ただし、`overrides` を使う場合はファイル拡張子を明示的に含める必要があります。そうしないと ESLint は `.js` ファイルのみを対象にします。

```js
module.exports = {
  overrides: [
    { files: [`directory/**/*.[jt]s?(x)`], rules: { 'my-rule': 'off' } },
  ],
};
```

## TypeScript

このスタイルガイドは複数の TypeScript 設定を提供しています。これらの設定は LTS の Node.js バージョンに対応しており、それぞれに適した `lib`、`module`、`target`、`moduleResolution` 設定が含まれています。利用可能な設定は以下の通りです。

| Node.js バージョン | TypeScript 設定                           |
| ------------------ | ----------------------------------------- |
| v16                | `@yoshinani/style-guide/typescript/node16`   |
| v18                | `@yoshinani/style-guide/typescript/node18`   |
| v20                | `@yoshinani/style-guide/typescript/node20`   |

共有 TypeScript 設定を使うには、`tsconfig.json` に以下のように記載します。

```json
{
  "extends": "@yoshinani/style-guide/typescript/node16"
}
```

ベースとなる TypeScript 設定は [`@yoshinani/style-guide/typescript`](./typescript/tsconfig.base.json) としても利用可能で、一般的なルールのみを指定しています。`lib`、`module`、`target`、`moduleResolution` 設定をカスタマイズする場合はこのファイルを継承してください。