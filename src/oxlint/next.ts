import type { OxlintConfig } from "oxlint"

import base from "./base"
import react from "./rules/react"

/**
 * oxlint の nextjs プラグインのルールは原則すべて有効にする。
 *
 * oxlint にはプラグインごとのプリセットがなく、カテゴリで有効にする。nextjs のルールは
 * すべて correctness カテゴリに属しており、base の `categories.correctness: "error"` で
 * プラグインを追加するだけで error になる。correctness 以外のカテゴリでルールが増えた場合は
 * tests/oxlint.test.ts が失敗するので、ここの rules に追加する。
 *
 * 無効化や warn への引き下げは、理由をコメントで残した場合に限る。
 * Pages Router 専用のルールも有効のままにする（App Router では反応しないだけで害はない）。
 */
const config: OxlintConfig = {
  ...base,
  plugins: [...(base.plugins ?? []), ...react.plugins, "nextjs"],
  rules: {
    ...base.rules,
    ...react.rules,
  },
  overrides: [
    ...(base.overrides ?? []),
    {
      // App Router の特殊ファイルは default export が必須
      files: [
        "**/app/**/{page,layout,template,loading,default,not-found,*error}.{js,jsx,ts,tsx}",
        "**/app/**/{opengraph-image,twitter-image,icon,apple-icon}.{js,jsx,ts,tsx}",
        "**/app/**/{sitemap,robots,manifest}.{js,ts}",
      ],
      rules: {
        "import/prefer-default-export": ["error", { target: "any" }],
      },
    },
    {
      // 画像生成ファイルでは ImageResponse の JSX で <img> を使うため
      files: [
        "**/app/**/{opengraph-image,twitter-image,icon,apple-icon}.{js,jsx,ts,tsx}",
      ],
      rules: {
        "nextjs/no-img-element": "off",
      },
    },
    // extends で引き継がれるのは rules / plugins / overrides だけなので、globals は overrides で渡す
    { files: ["**/*"], env: { browser: true, node: true, es2021: true } },
  ],
}

export default config
