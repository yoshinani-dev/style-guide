# v2 移行計画

## 目的

1. Biome + ESLint から oxfmt + oxlint へ移行する
2. Next.js ルールを適用する
3. Effect-TS ルールを適用する

## 決定事項

- **ESLint・Biome は完全に削除する。** 併用構成にはしない。`./eslint/*` と `./biome` の exports を削除する。v1 を使い続けたい利用者は v1 に留まる。
- **「Effect ルール」は Effect-TS（`effect` ライブラリ）向けのルールを指す。** React の `useEffect` 系ルールではない。
- **eslint-plugin-functional は廃止する。** v1 で有効だった `functional/immutable-data` も移植しない。採用プロジェクトでは厳しすぎて結局オフにされていたため。
- **ツールの違いによるフォーマットの細かなズレは許容する。** Biome との完全一致は目指さない。引き継ぐのは方針レベルの設定（セミコロン不要、ダブルクォート、インデント、import のグループ順と空行）のみ。
- **Next.js 向けの設定では、oxlint の `nextjs` プラグインのルールを可能な限りすべて有効にする。**（Phase 3 参照）追加するプラグインは同梱の `nextjs` プラグインだけで、`jsx-a11y` と `react-perf` は使わない。
- **Effect は必要なプロジェクトだけが使えるよう、Effect あり版と無し版を用意する。**（「設定のバリエーション」参照）
- **Effect あり版の対象は Effect v4 のみ。** v3 は対象外とする。公式の oxlint 連携（`@effect/tsgo`）が v4 向けのため。
- **エントリ名を揃える。** `react-internal` → `react-library`、`typescript/nextjs` → `typescript/next`（「v2 での名前の整理」参照）
- **バリデーションライブラリは Effect Schema と valibot を許容する。** 基本は Effect Schema とし、Effect を使わないプロジェクトやバンドルサイズを気にする場合は valibot を使う。
  - `no-restricted-imports` で zod / yup / joi / ajv / superstruct / class-validator を禁止する点は v1 と同じ。メッセージは「Effect Schema または valibot を使用してください」に変える。
- **`no-floating-promises` は Effect あり版でもそのまま有効にする。** Effect の値は Promise ではないので反応せず、`Effect.runPromise` の await し忘れなど Promise 側のバグを引き続き検出できる。Effect 値の実行し忘れは `@effect/tsgo` のプリセット（`floatingEffect`）が担当する。
- **`exactOptionalPropertyTypes` は Effect あり版の tsconfig だけで有効にする。**
  - Effect Schema の型が正確になる。Effect あり版を使うのは v4 の新規プロジェクトだけなので、既存コードに大量の型エラーが出ることもない。
  - Effect 無し版では、v1 から移行するプロジェクトの障壁になるため有効にしない。
- **Markdown はフォーマットの対象外、YAML は対象にする。** 共有の oxfmt 設定の `ignorePatterns` に `**/*.md` を入れる。
- **Effect のプリセットの `effecttsgo/unstable-api-usage` はテストファイルでだけ無効にする。**
- **このリポジトリ自身も、配布する oxfmt 設定でフォーマットする。** ルートの設定は `./oxfmt/base.mjs` を読み込むだけにし、独自の上書きはしない。配布物と自リポジトリで方針がずれないようにするため。

## 全体方針

- v2 はメジャーリリース（破壊的変更）とする。現在の main から `v1` ブランチを切り、v1 のパッチはそこで対応する。
- 配布形式は `.mjs` の config オブジェクトとする（JSDoc で型付け）。
  - oxlint は `oxlint.config.ts` で import した設定オブジェクトを `extends` する方式。`.oxlintrc.json` からはパッケージを参照できない。
  - Node は `node_modules` 配下の `.ts` の型を剥がさないため、`.ts` では配布しない。
- oxfmt には `extends` がない見込み。利用者側で `defineConfig({ ...yoshinani, ignorePatterns })` のように展開してもらう（Phase 0 で確認）。
- peerDependencies：`oxlint`、`oxlint-tsgolint`（型情報を使うルール用）、`oxfmt`、`typescript`。Effect 版を使う場合のみ `@effect/tsgo` も必要（optional peer にする）。

## 設定のバリエーション

Effect は全プロジェクトで使うわけではないため、**「実行環境」と「Effect の有無」の 2 軸**で設定を用意する。

### 軸

| 軸 | 値 |
| --- | --- |
| 実行環境 | `base`（汎用 TS）/ `library`（Node）/ `react-library`（React ライブラリ）/ `next`（Next.js アプリ） |
| Effect | なし / あり（`-effect` サフィックス） |

### 一覧

| 用途 | oxlint | oxlint（Effect あり） | TypeScript | TypeScript（Effect あり） |
| --- | --- | --- | --- | --- |
| 汎用 TS | `oxlint/base` | `oxlint/base-effect` | `typescript` | `typescript/effect` |
| Node（サーバー・CLI・ライブラリ） | `oxlint/library` | `oxlint/library-effect` | `typescript` | `typescript/effect` |
| React ライブラリ | `oxlint/react-library` | `oxlint/react-library-effect` | `typescript/react-library` | `typescript/react-library-effect` |
| Next.js アプリ | `oxlint/next` | `oxlint/next-effect` | `typescript/next` | `typescript/next-effect` |

- **oxfmt は 1 種類のみ**（`./oxfmt`）。Effect の有無や実行環境でフォーマット方針は変えない。
- commitlint と cspell も従来通り 1 種類。
- exports は `"./oxlint/*": "./oxlint/*.mjs"` のワイルドカード 1 行で全バリエーションをカバーする。

### Effect あり版を「完成品」として用意する理由

- **oxlint：** 利用者が `extends: [next, effect]` のように自分で組み合わせる方式も可能だが、組み合わせ方を利用者に委ねず、1 行 import すれば済む形にする。内部実装は Effect 用のルールを `oxlint/rules/effect.mjs` にまとめ、各 `-effect` エントリはそれを重ねるだけの薄いラッパーにする。
- **TypeScript：** tsconfig の `extends` は配列で複数指定できるが、`compilerOptions.plugins` はマージされず後勝ちで置き換わる。`typescript/next` は `{ "name": "next" }` プラグインを持つため、Effect の `@effect/language-service` プラグインと両立させるには、両方を並べた `next-effect` を別途用意する必要がある。

### Effect あり版で追加するもの

- **oxlint：** Effect 公式の oxlint 連携（`@effect/tsgo` の `oxlint-presets/recommended.json`、`effecttsgo` プラグイン、型情報を使うモードが前提）を取り込む。
- **TypeScript：** `plugins` に `{ "name": "@effect/language-service", "diagnostics": false }` を追加する。診断は oxlint 側で出すため、エディター上で二重に表示されないよう LSP 側の診断は切る（Effect 公式の推奨）。また `exactOptionalPropertyTypes: true` にする（Effect 公式の推奨）。

### v2 での名前の整理

v2 は破壊的変更を含むので、ESLint と TypeScript でばらばらだった名前を揃える（決定済み）。MIGRATION.md に旧名から新名への対応を載せる。

- `eslint/react-internal` → `oxlint/react-library`（TypeScript 側の `react-library` に合わせる）
- `typescript/nextjs` → `typescript/next`（oxlint 側の `next` に合わせる）

## Phase 0：調査と試行

> **実施済み。** 結果は [v2 Phase 0 調査結果](./v2-phase0-findings.md) を参照。以下は実施前に立てた確認項目。

ここで実現可否を確定させる。

### ルール対応表

`eslint/base.mjs` のルールを移行先ごとに振り分ける。現時点の見立ては次の通り。

| 移行先 | ルール |
| --- | --- |
| oxlint 標準ルール | `eqeqeq`、`no-process-env`、`no-restricted-imports`（禁止ライブラリ一覧）、`no-explicit-any`、`consistent-type-imports`、`no-labels` / `no-with`、`import/no-default-export` |
| tsgolint（型情報あり） | `no-floating-promises`、`no-misused-promises`、`no-unnecessary-condition`、`restrict-template-expressions`、`no-confusing-void-expression`、`dot-notation`。いずれも対応済みだが、`checksVoidReturn.attributes` などのオプションが同じように使えるかは要確認 |
| jsPlugins（ESLint プラグインをそのまま使う仕組み、alpha） | `eslint-comments/require-description` |
| 要検討 | enum 禁止（`no-restricted-syntax` → `oxlint-plugin-eslint` か自作の小さなプラグイン）、`no-barrel-files`（oxlint 標準の `oxc/no-barrel-file` で足りるか）、`import/prefer-default-export` |
| 廃止 | `functional/immutable-data`、`eslint-config-prettier`、`eslint-plugin-better-tailwindcss`（未使用。oxfmt の `sortTailwindcss` に置き換え） |

### フォーマット

- 方針レベルの設定が oxfmt で表現できるかだけを確認する。Biome との出力比較はしない。
- import の並び替えについて確認すること：
  - `@repo/**` を `customGroups` で独立したグループにでき、`external` より優先されるか
  - 同じモジュールからの import を統合しない場合に、oxlint の `import/no-duplicates` で補うか

### Effect 公式の oxlint 連携の確認

Effect v4 の公式ドキュメントで、oxlint 向けの連携（`@effect/tsgo`）が案内されている。これを採用する前提で次を確認する。

- `@effect/tsgo/oxlint-presets/recommended.json` を `.mjs` から import して `extends` に渡せるか（package の exports で公開されているか）
- プリセットが指定する `options.typeAware` はルート設定でしか効かないため、`extends` 経由で取り込んだ場合に無視されないか
- 利用者側で `"prepare": "effect-tsgo patch --oxlint"` が必要になる（oxlint 本体にパッチを当てる）。CI やモノレポで問題なく動くか
- 対象は Effect v4 のみ（v3 は対象外。決定事項を参照）

### バリエーション構成の確認

- oxlint の `extends` で引き継がれるのは `rules` / `plugins` / `overrides` だけ。実行環境ごとの globals（browser / node / serviceworker）は `overrides` 経由で渡せるかを確認する。

### 実プロジェクトでの試行

社内の Next.js リポジトリと Effect リポジトリを 1 つずつ選び、v1 と v2 の差分（検出件数、フォーマット差分の量）を比べる。

## Phase 1：oxfmt

- `oxfmt/base.mjs` を作る。Biome の設定を移植するのではなく、oxfmt の既定値を基準に方針に関わる項目だけを上書きする。
- import の並び替えは `sortImports` で行う。v1 の Biome のグループ順を次のように再現する。

  | Biome のグループ | oxfmt |
  | --- | --- |
  | `:NODE:`, `:BUN:`, `:URL:` | `builtin` |
  | `:PACKAGE:`（`@repo/**` を除く） | `external` |
  | `@repo/**` | `customGroups` の `monorepo` |
  | `:ALIAS:` | `internal`（`internalPattern` の既定値が `~/`, `@/`, `#`） |
  | `:PATH:` | `parent` / `sibling` / `index` |
  | `:BLANK_LINE:` | `newlinesBetween: true` |

  ```js
  sortImports: {
    newlinesBetween: true,
    customGroups: [{ groupName: "monorepo", elementNamePattern: ["@repo/**"] }],
    groups: [
      "builtin",
      "external",
      "monorepo",
      ["internal", "subpath"],
      ["parent", "sibling", "index"],
      "unknown",
    ],
  },
  ```

- import の並び替えはフォーマットの一部になるので、保存時のフォーマットと `oxfmt --check` で揃う。`editor.codeActionsOnSave` の設定は不要になる。
- このリポジトリ自身も oxfmt に切り替え、`biome.jsonc`、`biome/`、`@biomejs/biome` を削除する。
  - ルートに `oxfmt.config.ts` を置き、`./oxfmt/base.mjs` を展開するだけにする。リポジトリ固有の項目は `ignorePatterns`（`CHANGELOG.md`、`pnpm-lock.yaml` など）に限る。

    ```ts
    import { defineConfig } from "oxfmt"

    import base from "./oxfmt/base.mjs"

    export default defineConfig({
      ...base,
      // 共有設定の ignorePatterns（`**/*.md` など）を消さないよう、展開してから追加する
      ignorePatterns: [...base.ignorePatterns, "pnpm-lock.yaml"],
    })
    ```

  - 配布する設定を変えると、同じ PR の中で自リポジトリのファイルにもその変更が反映される。その結果を見れば、設定変更の影響を確かめられる。
  - 対象は `.mjs` / `.ts` / `.json` / `.jsonc` / `.yml`。`.md` は共有設定で除外される（決定事項を参照）。

## Phase 2：oxlint base / library / react-library

- `oxlint/base.mjs` を作る。`options.typeAware: true` は共有設定に入れる（Phase 0 で `extends` 経由でも効くことを確認）。ドキュメント上は「ルート設定のみ」とされているため、README ではルート設定にも書くよう案内する。
- React 系は oxlint 標準の `react` プラグインに移す（react-hooks と React Compiler のルールも含まれる）。`jsx-pascal-case` と `jsx-no-useless-fragment` が使えるかは要確認。

### 実施結果

- **ルールの範囲：** v1 で実際に有効だったルール（eslint:recommended、typescript-eslint の recommendedTypeChecked、eslint-plugin-react / react-hooks の recommended、独自ルール）を ESLint の設定から算出し、oxlint にあるものはすべて明示的に引き継いだ。そのうえで oxlint の `correctness` カテゴリを `error` で有効にした（React Compiler 系のルールなど、v1 にない明らかな誤りの検出も入る）。
- **v1 で実は有効でなかったルール：** `no-barrel-files` と `import/no-default-export` は、v1 ではプラグインを登録しているだけで有効になっていなかった。v1 と同じく有効にしていない。
- **自前の JS プラグイン（`oxlint/plugins/yoshinani.mjs`）：** `@eslint-community/eslint-plugin-eslint-comments` の `require-description` は、oxlint 上ではファイル先頭のコメントでクラッシュし、それ以外でも報告位置が 1 行ずれた（`column: -1` での報告が oxlint と互換でない）。そのため、無効化コメントの理由チェックと enum 禁止を自前のプラグインで実装した。`oxlint-disable` コメントも検出できるようになり、`oxlint-plugin-eslint` も不要になった。
- **型定義：** 利用者の `oxlint.config.ts` / `oxfmt.config.ts` が型エラーや `no-unsafe-*` に引っかからないよう、公開する設定に `.d.mts` を同梱した。
- **自リポジトリの lint：** ルートの `oxlint.config.ts` で `oxlint/library.mjs` を使う。`tests/fixtures/` は fixture ごとに `oxlint.config.ts` を持つため、`pnpm check` は `--disable-nested-config` で実行する。

## Phase 3：Next.js ルール

- 今の `eslint/next` には `@next/eslint-plugin-next` が入っていないので、実質的に新しいルールの追加になる。
- 対象は `next` / `next-effect` のみ。

### 方針：oxlint の `nextjs` プラグインのルールは原則すべて有効にする

- **すべてのルールを `rules` に明示的に列挙し、`error` にする。** カテゴリ（`correctness` など）で有効にするとほかのプラグインにも影響が出るため、ルール単位で指定する。
- **無効化や `warn` への引き下げは、理由をコメントで残した場合に限る。** 除外するのは、App Router の正しいコードで誤検知が出るものだけにする。
- **Pages Router 専用のルール**（`_document` まわりなど）も有効にしておく。App Router のプロジェクトでは単に反応しないだけで害はなく、Pages Router のプロジェクトでは役に立つ。
- **ファイル単位の例外は `overrides` で最小限にする。** 現時点での候補：
  - `opengraph-image` / `icon` / `apple-icon` などの画像生成ファイル：`ImageResponse` の JSX では `<img>` を使うため、`nextjs/no-img-element` を無効にする。
- App Router の特殊ファイル（`page` / `layout` / `*error` / `sitemap` など）では default export を許可する override を v1 から引き継ぐ。

### 新しいルールの追従

- ルールを明示的に列挙するため、oxlint の更新で `nextjs` プラグインに増えたルールは自動では有効にならない。
- `oxlint --rules` の出力にある `nextjs/*` のルールが、すべて設定で有効または理由付きで除外されていることを確かめるテストを置く。dependabot で oxlint を上げたときに新しいルールがあればテストが落ち、検討の機会になる。

### Phase 0 で確認すること

- 使っている oxlint のバージョンで `oxlint --rules` を実行し、`nextjs` プラグインのルール一覧を確定する。
- 実在の Next.js（App Router）プロジェクトに全ルールを当て、誤検知が出るルールを洗い出す。

### 実施結果

- `oxlint/next.mjs` を追加した。`nextjs` プラグインの 21 ルールをすべて `error` で列挙し、除外したルールはない。
- `oxlint --rules` に出る `nextjs/*` がすべて設定されていることを確かめるテストを追加した（1 ルールを外すと失敗することを確認済み）。
- App Router の特殊ファイル（`page` / `layout` / `template` / `loading` / `default` / `not-found` / `*error` / 画像生成ファイル / `sitemap` / `robots` / `manifest`）では default export を必須にした（v1 の override を引き継ぎ、対象を広げた）。`route.ts` や `middleware.ts` は名前付き export を使うので対象外。
- 画像生成ファイル（`opengraph-image` / `twitter-image` / `icon` / `apple-icon`）では `nextjs/no-img-element` を無効にした。
- `typescript/nextjs` を `typescript/next` に改名した。
- Next.js 向けに追加するプラグインは、oxlint に同梱されている `nextjs` プラグインだけとする（決定事項を参照）。

## Phase 4：Effect-TS ルール（`-effect` バリエーション）

- `oxlint/rules/effect.mjs` に Effect 公式プリセットの取り込みと社内向けの調整をまとめ、`base-effect` / `library-effect` / `react-library-effect` / `next-effect` を薄いラッパーとして作る。
- `typescript/effect` / `typescript/react-library-effect` / `typescript/next-effect` を作る。
- README に Effect あり版の導入手順（`@effect/tsgo` の追加、`prepare` スクリプト）を書く。
- `no-floating-promises` は Effect あり版でもそのまま有効にする（決定事項を参照）。Effect のコードで誤検知が出ないことを fixture で確かめる。
- `typescript/effect` / `typescript/react-library-effect` / `typescript/next-effect` では `exactOptionalPropertyTypes: true` にする（決定事項を参照）。ライブラリの型と相性が悪い場合にプロジェクト側で `false` に上書きする方法を README に書く。
- バリデーションライブラリは Effect Schema と valibot の両方を許容する（決定事項を参照）。lint で使い分けを強制することはできないので、`no-restricted-imports` は Effect あり版と無し版で同じ内容にする。

### 実施結果

- `oxlint/rules/effect.mjs` に `@effect/tsgo` の `recommended` プリセットと、テストファイルで `effecttsgo/unstable-api-usage` を無効にする override をまとめた。`base-effect` / `library-effect` / `react-library-effect` / `next-effect` は、Effect 無し版にこれを重ねるだけの薄いラッパーにした。
- `typescript/effect` / `typescript/react-library-effect` / `typescript/next-effect` を追加した。`next-effect` は `plugins` が置き換わるため、`next` プラグインも並べている。
- `@effect/tsgo` は optional peer にした。Effect 無し版だけを使うプロジェクトでは、インストールしなくても動くことを確認した。
- テストでは、Effect あり版の fixture を `effect-tsgo oxlint` 経由で実行する（`node_modules` のバイナリを書き換えずに済むため）。Effect の実行し忘れ（`floating-effect`）、`Effect.runPromise` の await し忘れ（`no-floating-promises`）、`Effect.gen` で誤検知が出ないことを確かめている。
- dependabot では `@effect/tsgo` と `effect` を oxc のグループに入れ、oxlint と揃えて更新されるようにした。`@effect/tsgo` が未対応の oxlint に上がった場合は、Effect の fixture のテストが失敗する。

## Phase 5：リポジトリ内部の整備

- CI は `pnpm check` を `oxfmt --check . && oxlint` に変更する。自リポジトリが配布設定どおりにフォーマットされていなければ CI が失敗する。
- `pnpm check:fix` は `oxfmt .` に置き換える。
- `tests/eslint.test.mjs` は、fixtures に対して `oxlint --format json` を実行して確かめるテストに書き直す。全バリエーション（oxlint 8 種）が読み込めること、Effect あり版でだけ Effect のルールが効くことを確かめる。
- `README.md`、`CONTRIBUTING.md`、`CLAUDE.md`、`.vscode/extensions.json`（`oxc.oxc-vscode`）、`dependabot.yml` を更新する。

## Phase 6：リリース

- `changeset pre enter beta` で v2 のベータ版を公開し、Phase 0 で使ったプロジェクトで実際に使ってから正式版にする。
- `MIGRATION.md` を用意する。
  - v1 から v2 への手順、ESLint/Biome の各設定との対応、アンインストールすべきパッケージ
  - functional ルールは廃止（利用者側の対応は不要）
  - v1 と v2 でフォーマット結果は完全には一致しないこと。初回フォーマットを 1 コミットにまとめて `.git-blame-ignore-revs` に登録する手順

## 進め方

- PR はフェーズごとに 1 本ずつに分ける。
- Phase 3 と Phase 4 は Phase 2 が終われば並行して進められる。

## リスク

- **jsPlugins は alpha 版で semver の対象外。** バージョンを固定し、jsPlugins に頼るルールは最小限にする。
- **無効化コメントの扱いが不明。** `eslint-disable` と `oxlint-disable` のどちらを使うことになるか、`require-description` がそれを検出できるかを確認する。
- **tsgolint は typescript-go ベース。** 利用者の tsconfig が非推奨のオプション（`baseUrl` など）に依存していると動かない恐れがある。
- **Effect あり版は oxlint 本体へのパッチ（`effect-tsgo patch --oxlint`）が前提。** oxlint の更新でパッチが当たらなくなる可能性があるため、Effect あり版の利用者には oxlint と `@effect/tsgo` のバージョンを揃えて上げるよう案内する。
- **Node の要件が上がる。** `oxlint.config.ts` を読み込むには Node 22.18 以上が必要なので、`engines` を引き上げる必要がある。
