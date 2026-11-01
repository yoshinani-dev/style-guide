// @ts-check

import base from "./base.mjs"
import react from "./rules/react.mjs"

/**
 * oxlint の nextjs プラグインのルールは原則すべて有効にする。
 * 無効化や warn への引き下げは、理由をコメントで残した場合に限る。
 * Pages Router 専用のルールも有効にしておく（App Router では反応しないだけで害はない）。
 *
 * oxlint の更新でルールが増えた場合は tests/oxlint.test.mjs が失敗するので、ここに追加する。
 *
 * @type {import("oxlint").OxlintConfig["rules"]}
 */
const nextjsRules = {
  "nextjs/google-font-display": "error",
  "nextjs/google-font-preconnect": "error",
  "nextjs/inline-script-id": "error",
  "nextjs/next-script-for-ga": "error",
  "nextjs/no-assign-module-variable": "error",
  "nextjs/no-async-client-component": "error",
  "nextjs/no-before-interactive-script-outside-document": "error",
  "nextjs/no-css-tags": "error",
  "nextjs/no-document-import-in-page": "error",
  "nextjs/no-duplicate-head": "error",
  "nextjs/no-head-element": "error",
  "nextjs/no-head-import-in-document": "error",
  "nextjs/no-html-link-for-pages": "error",
  "nextjs/no-img-element": "error",
  "nextjs/no-page-custom-font": "error",
  "nextjs/no-script-component-in-head": "error",
  "nextjs/no-styled-jsx-in-document": "error",
  "nextjs/no-sync-scripts": "error",
  "nextjs/no-title-in-document-head": "error",
  "nextjs/no-typos": "error",
  "nextjs/no-unwanted-polyfillio": "error",
}

/** @type {import("oxlint").OxlintConfig} */
export default {
  ...base,
  plugins: [...(base.plugins ?? []), ...react.plugins, "nextjs"],
  rules: {
    ...base.rules,
    ...react.rules,
    ...nextjsRules,
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
