# Yoshinani スタイルガイドへの貢献について

## インストール方法

このプロジェクトは pnpm を使用しています。

まず、以下を実行してください:

```sh
mise install
```

次に、以下を実行します:

```sh
pnpm i
```

## 開発

設定ファイルを変更したら、以下で CI と同じ検証ができます。

```sh
pnpm check      # vp check：フォーマット・lint・型チェック（自リポジトリも配布する設定で検査する）
pnpm build      # vp pack：src/ をビルドして dist/ に出力する
pnpm test       # dist/ をビルドしてから、tests/fixtures/ に oxlint を実行し、期待どおりのルールが検出されるか確かめる
pnpm test:tsconfig  # 共有 tsconfig で tests/fixtures/typescript/ をコンパイルする
```

- CI では、共有 tsconfig を TypeScript 6 / 7 でも検証します。手元で試す場合は `pnpm --package=typescript@7 dlx node tests/tsconfig.ts` を実行してください。

- `pnpm check:fix` でフォーマットと lint の自動修正ができます。
- ルールを追加・変更したときは、`tests/fixtures/<設定名>/src/` に違反するコードと正常なコードを置き、`tests/oxlint.test.ts` に期待する検出結果を書いてください。
- Effect あり版の fixture は、`effect-tsgo oxlint` 経由で実行されます（`node_modules` の oxlint は書き換えません）。
- 設定は `src/` に TypeScript で書きます。`vp pack` で `dist/` に `.mjs` と型定義（`.d.mts`）が出力されます。`src/oxlint/` に追加したファイルは `@yoshinani/style-guide/oxlint/<ファイル名>` で公開されます。
- フォーマット・lint・ビルド・テストの設定は、すべて `vite.config.ts` にまとまっています。
- devDependencies の `oxlint` / `oxlint-tsgolint` / `@oxlint/plugins` は、`vite-plus` が同梱しているバージョン（`vp toolchain` で確認できます）と揃えてください。揃っていないとテストが失敗します。

## コミットとリリースバージョン管理

コミット規約は [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional) に基づいています。

### コミットの作成方法

コミットメッセージは以下の形式で記述してください:

```
type: メッセージ

Resolves #1
```

許可されている type の一覧は[こちらに記載されています](./src/commitlint/commitlint.config.ts)

### リリース管理

このプロジェクトは [Changesets](https://github.com/changesets/changesets) を使用してリリースを管理しています。

> [!NOTE]
> `main` は v2 の開発用です。v1 系の保守は `v1` ブランチで行います。v1 へのパッチは `v1` ブランチに向けてプルリクエストを作成してください。`v1` で公開したバージョンには npm の `v1` タグが付きます。

#### 変更の記録

変更を加えた後、以下のコマンドを実行して変更を記録します：

```sh
pnpm changeset
```

このコマンドを実行すると、以下の情報を入力するように求められます：

1. 変更の種類（major/minor/patch）
2. 変更の説明
3. 影響を受けるパッケージ

これにより、`.changeset` ディレクトリに新しいマークダウンファイルが作成されます。

#### リリースの公開

変更を記録した後、変更セットを含むプルリクエストを作成してください。GitHub Actions が自動的に以下の処理を行います：

- 変更セットに基づいてパッケージのバージョンを更新
- CHANGELOG.md の更新
- 変更セットファイルの削除
- リリース用のプルリクエストの作成

プルリクエストがマージされると、GitHub Actions が自動的に以下の処理を実行します：

- パッケージのビルド
- npm へのパッケージの公開
- リリースノートの GitHub リリースへの投稿

## 依存パッケージの更新

依存パッケージの更新状況を確認するには、以下を実行してください:

```sh
npx npm-check-updates
```

これにより、どの依存パッケージにアップデートがあるかが表示されます。`npm outdated` とは異なり、`npm-check-updates` には `-u` フラグがあり、`package.json` を便利に更新できます。

パッケージを更新する際は、マイナーアップデートも含めて、すべての更新パッケージのリリースノートを必ず確認してください。ルールや拡張設定が変更されている場合があります。
