# v2 Phase 0 調査結果

[v2 移行計画](./v2-migration-plan.md) の Phase 0 として、実際にツールを動かして前提を確かめた結果をまとめる。

## 検証環境

| パッケージ | バージョン |
| --- | --- |
| oxlint | 1.90.0 |
| oxlint-tsgolint | 7.0.2005 |
| oxfmt | 0.75.0 |
| oxlint-plugin-eslint | 1.90.0 |
| @eslint-community/eslint-plugin-eslint-comments | 4.8.1 |
| effect | 4.1.1 |
| @effect/tsgo | 0.63.0 |
| Node.js | 24.22.1 |

- fixture を使った検証はスクラッチ環境で行った。
- 実プロジェクトでの試行は、次の 2 つに読み取り専用（`--fix` / `--write` なし）で当てた。
  - **yoshinani-cp**（`apps/web`）：Next.js 16、Effect なし
  - **yoshinani-template-saas-v1**（`apps/web`）：Next.js 16 + Effect 4.0.6

## 結論の要約

- **計画どおり進められる。** ブロッカーになる問題は見つからなかった。
- **計画の修正が必要な点が 4 つある。**
  1. oxfmt の `printWidth` の既定値は 100。80 を明示しないと差分が大量に出る。
  2. oxfmt が自動で読み込むのは `oxfmt.config.ts`（または `.oxfmtrc.json`）で、`oxfmt.config.mjs` は読み込まれなかった。利用者には `oxfmt.config.ts` を作ってもらう。
  3. Effect 連携は、oxlint / tsgolint のバージョンが `@effect/tsgo` の対応バージョンに縛られる。
  4. v1 の config ファイル用 override が `.mts` を拾っていなかった（v1 からある漏れ）。
- **社内で決める必要があった 2 点は決定済み。**（末尾の「Phase 0 を受けての決定事項」参照）

## ルール対応表（確定版）

fixture で、すべて期待どおりに検出されることを確認した。

| v1 のルール | v2 での指定 | 備考 |
| --- | --- | --- |
| `eqeqeq`（`null: "ignore"`） | `eqeqeq` | オプションもそのまま使える |
| `no-process-env` | `node/no-process-env` | `env.ts` での無効化 override も動作 |
| `no-restricted-imports`（paths / patterns） | `no-restricted-imports` | paths / patterns ともに動作 |
| `@typescript-eslint/no-explicit-any` | `typescript/no-explicit-any` | |
| `@typescript-eslint/consistent-type-imports` | `typescript/consistent-type-imports` | |
| `@typescript-eslint/no-floating-promises` | `typescript/no-floating-promises` | 型情報あり |
| `@typescript-eslint/no-misused-promises`（`checksVoidReturn.attributes: false`） | `typescript/no-misused-promises` | オプションも動作。JSX の `onClick={async () => {}}` は検出されず、関数引数のほうは検出される |
| `@typescript-eslint/no-unnecessary-condition` | `typescript/no-unnecessary-condition` | 動作するが、oxlint 上は **nursery**（開発中）扱い |
| `@typescript-eslint/restrict-template-expressions`（全 `allow*: false`） | `typescript/restrict-template-expressions` | オプションも動作 |
| `@typescript-eslint/no-confusing-void-expression`（`ignoreArrowShorthand`） | `typescript/no-confusing-void-expression` | オプションも動作 |
| `@typescript-eslint/dot-notation`（`env.ts` で off） | `typescript/dot-notation` | |
| `eslint-comments/require-description` | jsPlugins：`@eslint-community/eslint-plugin-eslint-comments` | `eslint-disable` は検出される。**`oxlint-disable` は検出されない**（後述） |
| `no-restricted-syntax`：enum 禁止 | jsPlugins：`oxlint-plugin-eslint` の `eslint-js/no-restricted-syntax`（`TSEnumDeclaration`） | oxlint 標準には `no-restricted-syntax` も enum 禁止ルールもない。JS プラグインでも TS の AST ノードを選択できる |
| `no-restricted-syntax`：label 禁止 | `no-labels` | oxlint 標準 |
| `no-restricted-syntax`：with 禁止 | `no-with` | oxlint 標準 |
| `no-barrel-files/no-barrel-files` | `oxc/no-barrel-file`（`threshold: 0`） | 既定の threshold では小さなバレルファイルを検出しない。`0` にすると再エクスポートを含むファイルを検出する。報告はファイル単位で 1 件（元のプラグインは文ごと） |
| `import/no-default-export` / `import/prefer-default-export` | 同名 | override も動作 |
| `functional/immutable-data` | 廃止 | 決定済み |
| `@typescript-eslint/no-shadow`（off） | 指定不要 | oxlint に存在しない |
| `react/prop-types`（off） | 指定不要 | oxlint に存在しない |

### 追加で有効にしたいルール

- **`import/no-duplicates`**：oxfmt は同じモジュールからの import を統合しないため、lint で検出する。`--fix` で統合できる（統合後の書式は oxfmt で整う）。
- `{ b, a }` のような名前付き import の並びは、oxfmt も並び替えない。`sort-imports`（`ignoreDeclarationSort: true`）で補えるが、見た目だけの問題なので **入れない**（「細かなズレは許容」の方針）。

### `oxlint-disable` コメントについて

- oxlint は `eslint-disable` と `oxlint-disable` の両方を解釈する。
- `require-description` が理由の書き忘れを検出できるのは `eslint-disable` だけで、`oxlint-disable` は素通りする。
- **対応案：** v2 でも無効化コメントは `eslint-disable` に統一するよう README で案内する。`oxlint-disable` を禁止する仕組みは今のところない。

## 設定の合成（extends）

| 確認項目 | 結果 |
| --- | --- |
| `.mjs` の設定オブジェクトを `oxlint.config.ts` の `extends` に渡せるか | **できる** |
| jsPlugins の解決 | 共有設定側の `specifier` で解決される |
| 共有設定のトップレベルの `env` / `globals` | **引き継がれない** |
| `overrides` に入れた `env` / `globals`（`files: ["**/*"]`） | **引き継がれる** → 実行環境ごとの globals は `overrides` で渡す |
| 共有設定の `options.typeAware: true` | **引き継がれる**（ドキュメントには「ルート設定のみ」とあるが、1.90 では効いた）。共有設定に入れたうえで、README ではルート設定にも書くよう案内する（将来の挙動変更に備える） |

## oxfmt

### 設定

- **`extends` はない。** 利用者側で共有設定を展開する方式で確定。
- `--migrate=biome` で v1 の Biome 設定を変換すると、基本項目は移るが **import のグループ設定は移らない**。
- **`printWidth` の既定値は 100。** v1（Biome）は 80。80 を明示しないと、実プロジェクトで差分が数倍になった（saas-v1：235 ファイル → 80 を明示すると 55 ファイル）。
- **自動で読み込まれる設定ファイルは `oxfmt.config.ts`（または `.oxfmtrc.json`）。** `oxfmt.config.mjs` は読み込まれなかった。
- **`ignorePatterns` は、読み込まれた設定ファイルの位置を基準に解釈される。** 共有設定の `ignorePatterns` を利用者の `oxfmt.config.ts` に展開すれば、利用者のリポジトリ基準で効く。共有設定には `.next/**` など、どのプロジェクトでも除外したいものだけを入れる。
- `sortPackageJson` は既定で有効。v1 にはない挙動なので、入れるかは Phase 1 で決める。

### import の並び替え

計画どおりの設定で、v1 のグループ順を再現できた。

```js
sortImports: {
  newlinesBetween: true,
  customGroups: [{ groupName: "monorepo", elementNamePattern: ["@repo/**"] }],
  groups: ["builtin", "external", "monorepo", ["internal", "subpath"], ["parent", "sibling", "index"], "unknown"],
},
```

- `@repo/**` は `external` より優先されて独立したグループになる。
- `@/` と `~/` は `internal` に入る。
- 重複 import は統合されない、名前付き import の中身は並び替えられない（前述）。

### 対応しているファイル

| 種類 | 結果 |
| --- | --- |
| `.ts` / `.tsx` / `.mjs` / `.json` / `.jsonc` | 対応 |
| `.css` | 対応。Tailwind の `@import "tailwindcss"` / `@theme` もそのまま扱える |
| `.html` | 対応。void 要素は既定で自己閉じになる（v1 の `selfCloseVoidElements: "always"` と同じ） |
| `.md` / `.yml` | 対応。**v1（Biome）では対象外だった**ので、新たに差分が出る |

## Effect 連携（`@effect/tsgo`）

### 確認できたこと

- **プリセットは JS から import できる。** `import { recommended } from "@effect/tsgo/oxlint-presets"` で取り込み、`extends: [next, recommended]` で合成できた。JSON（`@effect/tsgo/oxlint-presets/*.json`）も exports で公開されている。
- **プリセットの種類：** `recommended` / `strict` / `correctness` / `antipattern` / `style` / `effect-native` / `maintainers`
- **`no-floating-promises` の誤検知はなかった。** `Effect.gen` / `pipe` のコードには反応せず、`Effect.runPromise(...)` の await し忘れは検出した。Effect 値の実行し忘れは `effecttsgo/floating-effect` が検出し、役割分担は想定どおり。
- **`exactOptionalPropertyTypes`：** `Schema.optionalKey` のフィールドに `undefined` を代入するコードが、有効時だけ型エラーになることを確認した。

### 仕組みと制約

- `effecttsgo` は oxlint 標準のプラグインではない。**oxlint と tsgolint のネイティブバイナリを Effect 版に差し替えて**初めて使える。
- 差し替えの方法は 2 つある。
  - `effect-tsgo patch --oxlint --no-typescript`：`node_modules` 内のバイナリを書き換える。エディター拡張も Effect 版で動く。`--no-typescript` を付けないと TypeScript ネイティブ版（tsgo）も探しに行き、見つからなければ失敗する。
  - `effect-tsgo oxlint --type-aware`：`node_modules` を書き換えずに Effect 版で実行するラッパー。CI ではこちらでもよい。
- **パッチを当てずに実行すると、設定の読み込みで失敗する**（`Unknown plugin: 'effecttsgo'`）。ルールが黙って無効になることはない。
- **対応バージョンが固定されている。** `@effect/tsgo` 0.63.0 が差し替えに対応しているのは oxlint 1.88.0〜1.90.0、oxlint-tsgolint 7.0.2004〜7.0.2005 のみ。oxlint を先に上げると Effect 版が使えなくなる。
- Linux の musl（Alpine など）は非対応。

## 実プロジェクトでの試行

### yoshinani-cp（Next.js、Effect なし）

- 検出 12 件。v1 で使っていなかった `nextjs` プラグインのルールが大半。
  - `nextjs/no-img-element`：6 件（埋め込みコンポーネントと spec ファイル）
  - `nextjs/no-html-link-for-pages`：2 件。1 件は意図的にフルリロードさせる `<a>` なので、理由付きの無効化コメントで対応すべきもの。App Router でも正しく動く
  - `react/set-state-in-effect`：1 件（React Compiler 系のルールで、`correctness` カテゴリに含まれる）
  - `vitest.config.mts` の `import/no-default-export` と `node/no-process-env`：v1 の config ファイル用 override が `**/*.config.{mjs,ts}` で `.mts` を拾っていなかった。v2 では `**/*.config.{js,mjs,cjs,ts,mts,cts}` に広げる
- このリポジトリは依存パッケージが未インストールで、tsconfig の `extends` が解決できず**型情報を使うルールは動かなかった**（`typescript/tsconfig-error`）。型情報を使うルールは、依存パッケージのインストールが前提になる。
- oxfmt（`printWidth: 80`）の差分：226 ファイル。うち 202 が `.md` で、ほとんどは `.claude/skills` と `.agents/skills` にある外部から取り込んだドキュメント。コードの差分は 13 ファイル。

### yoshinani-template-saas-v1（Next.js + Effect 4.0.6）

- 検出 124 件、型情報ありで 2 秒程度。
  - `effecttsgo/unstable-api-usage`：99 件。ほぼすべて `@effect/vitest` の `it` が unstable API である、という警告
  - `effecttsgo/schema-class-missing-brand`：21 件
  - その他の Effect ルール：3 件、config ファイルの default export：1 件
- `typescript/*` の型情報ありルールでの検出は 0 件。v1 の ESLint で同じルールを通している状態と整合する。
- oxfmt（`printWidth: 80`）の差分：55 ファイル（`.ts` 30、`.md` 18 など）。`.ts` の差分は、80 文字に収まる export を 1 行にまとめるといった軽微なもの。

### 運用面で気づいたこと

- oxlint は `.gitignore` を見て `node_modules` を除外する。git 管理外のディレクトリで実行すると `node_modules` まで検査する。
- `oxlint-tsgolint` は実行したディレクトリの `node_modules` から探される。モノレポでは、ルートにインストールしておく必要がある。

## 計画への反映

- **Phase 1：** `printWidth: 80` を明示する。README では `oxfmt.config.ts` を作るよう案内する。共有設定の `ignorePatterns` は共通して除外したいものに限る。`sortPackageJson` を入れるか決める。
- **Phase 2：**
  - globals は `overrides`（`files: ["**/*"]`）で渡す。
  - `options.typeAware: true` は共有設定に入れ、README でもルート設定への記載を案内する。
  - 移行先は「ルール対応表（確定版）」のとおり。`import/no-duplicates` を追加し、`oxc/no-barrel-file` は `threshold: 0` にする。
  - config ファイル用 override のパターンを `.mts` / `.cts` まで広げる。
  - カテゴリの扱いを決める。v1 は `recommended` と `recommendedTypeChecked` を使っていたが、v2 では oxlint の `correctness` カテゴリを基本にするか。
- **Phase 3：** `nextjs` プラグインは 21 ルールで確定（すべて `correctness` カテゴリ）。実プロジェクトで誤検知と言えるものはなかった。
- **Phase 4：**
  - `@effect/tsgo` の対応範囲に合わせて oxlint / oxlint-tsgolint の peer の範囲を決める。dependabot で oxlint だけが先に上がらないよう、`@effect/tsgo` と同じグループで更新する。
  - `unstable-api-usage` はテストファイルでだけ無効にする（決定済み）。`schema-class-missing-brand` などほかのルールは、プリセットの設定から変えない。
  - README で `prepare` に `effect-tsgo patch --oxlint --no-typescript` を書くよう案内する。

## Phase 0 を受けての決定事項

1. **Markdown はフォーマットの対象外、YAML は対象にする。** 共有の oxfmt 設定の `ignorePatterns` に `**/*.md` を入れる（利用者の `oxfmt.config.ts` に展開すれば効くことを確認済み）。
2. **Effect のプリセットの `effecttsgo/unstable-api-usage` は、テストファイルでだけ無効にする。** `@effect/vitest` の `it` に対する警告がテストファイルに集中していたため。対象は `**/*.{test,spec}.{ts,tsx,mts,cts}`。
