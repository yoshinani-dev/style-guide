import { defineConfig } from "oxlint"

import library from "./oxlint/library.mjs"

export default defineConfig({
  extends: [library],
  // テスト用の fixture は、わざと違反を含むため除外する
  ignorePatterns: ["tests/fixtures/**"],
  options: { typeAware: true },
})
