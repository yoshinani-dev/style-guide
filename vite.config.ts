import { defineConfig } from "vite-plus"

import fmt from "./src/oxfmt/base"
import library from "./src/oxlint/library"

// このリポジトリ自身も、配布する設定（src/）でフォーマット・lint する
export default defineConfig({
  fmt: {
    ...fmt,
    ignorePatterns: [
      ...(fmt.ignorePatterns ?? []),
      "pnpm-lock.yaml",
      "dist/**",
    ],
  },
  lint: {
    extends: [library],
    // テスト用の fixture は、わざと違反を含むため除外する
    ignorePatterns: ["dist/**", "tests/fixtures/**"],
    options: { typeAware: true, typeCheck: true },
  },
  pack: {
    entry: ["src/**/*.ts"],
    // 利用者が `@yoshinani/style-guide/oxlint/next` のようにファイル単位で読み込むため、
    // バンドルせずにファイル構成を保ったまま出力する
    unbundle: true,
    format: ["esm"],
    dts: true,
    // 依存パッケージ（型定義を含む）は取り込まず、利用者側で解決させる
    deps: { neverBundle: true },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
})
