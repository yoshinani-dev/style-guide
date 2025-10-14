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

## コミットとリリースバージョン管理

コミット規約は [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional) に基づいています。

### コミットの作成方法

コミットメッセージは以下の形式で記述してください:

```
type: メッセージ

Resolves #1
```

許可されている type の一覧は[こちらに記載されています](./commitlint/commitlint.config.mjs)

### リリース管理

このプロジェクトは [Changesets](https://github.com/changesets/changesets) を使用してリリースを管理しています。

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
