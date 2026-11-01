// @ts-check

import { recommended } from "@effect/tsgo/oxlint-presets"

/**
 * Effect-TS（v4）向けのルール。-effect の各設定で共有する。
 *
 * Effect 公式の oxlint 連携（@effect/tsgo）の recommended プリセットをそのまま使う。
 * effecttsgo プラグインは oxlint 標準ではないため、利用者側で
 * `effect-tsgo patch --oxlint --no-typescript` を実行するか、
 * `effect-tsgo oxlint` 経由で oxlint を実行する必要がある。
 */
export default {
  plugins: recommended.plugins ?? [],
  rules: recommended.rules ?? {},
  overrides: [
    {
      // @effect/vitest の it などが unstable API として大量に警告されるため、テストファイルでは無効にする
      files: ["**/*.{test,spec}.{ts,tsx,mts,cts}"],
      rules: {
        "effecttsgo/unstable-api-usage": "off",
      },
    },
  ],
}
