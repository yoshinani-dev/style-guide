# Yoshinani スタイルガイドへの貢献について

## インストール方法

このプロジェクトは pnpm を使用しています。

まず、以下を実行してください:

```sh
corepack enable
```

次に、以下を実行します:

```sh
pnpm i
```

## プルリクエストを作成する前に

プルリクエストを作成する前に、まず issue を作成してください。

issue が作成された後、通常は2〜4週間ほど変更を実装する前に待機します。これは提案された変更についてエンジニアがフィードバックを共有する十分な時間を確保するためです。

### マイルストーンとプレリリース

このリポジトリのデフォルトブランチは `canary` です。`canary` への関連するコミットごとにプレリリースがトリガーされます。`canary` を `main` にマージするとリリースがトリガーされます。

可能な限り、変更は月ごとの[マイルストーン](https://github.com/yoshinani-dev/style-guide/milestones)としてまとめるようにしています。これにより、すべてのコミットを直接 `main` にマージする場合よりもメジャーバージョンの変更が少なくなります。

## コミットとリリースバージョン管理

このリポジトリは [Standard Release](https://semantic-release.gitbook.io/semantic-release/) を使用してリリースを自動化しています（バージョン管理やリリースノートの生成を含む）。

コミット規約は [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional) に基づいています。

### コミットの作成方法

コミットメッセージは以下の形式で記述してください:

```
type: メッセージ

Resolves #1
```

許可されている type の一覧は以下に記載されています:

- https://github.com/yoshinani-dev/style-guide/blob/main/.commitlintrc.js

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
