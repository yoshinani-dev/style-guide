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

### コミットがバージョンに与える影響

デフォルトでは、`feat` タイプのコミットはマイナーバージョンのアップ、`fix` や `perf` タイプのコミットはパッチバージョンのアップになります。

もしコミットが破壊的変更（メジャーバージョンアップ）となる場合は、フッターに `BREAKING CHANGE: [メッセージ]` を追加してください。

```
feat(eslint): ESLint 8 へ移行

Resolves #1

BREAKING CHANGE: ESLint 8 のリリースノートを参照してください
```

この例では、リリースノートは以下のようになります:

> # 1.0.0 (2021-01-01)
>
> ### 機能追加
>
> - eslint: ESLint 8 へ移行 ([commit-hash])
>
> ### 破壊的変更
>
> - eslint: ESLint 8 のリリースノートを参照してください

## 依存パッケージの更新

依存パッケージの更新状況を確認するには、以下を実行してください:

```sh
npx npm-check-updates
```

これにより、どの依存パッケージにアップデートがあるかが表示されます。`npm outdated` とは異なり、`npm-check-updates` には `-u` フラグがあり、`package.json` を便利に更新できます。

パッケージを更新する際は、マイナーアップデートも含めて、すべての更新パッケージのリリースノートを必ず確認してください。ルールや拡張設定が変更されている場合があります。