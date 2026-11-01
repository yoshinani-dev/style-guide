// @ts-check

/**
 * React 向けのルール。react-library と next で共有する。
 * oxlint の react プラグインには react-hooks のルールも含まれる。
 */
export default /** @type {const} */ ({
  plugins: ["react"],
  rules: {
    // v1 の eslint-plugin-react の recommended から引き継いだルール
    "react/display-name": "error",
    "react/jsx-key": "error",
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-target-blank": "error",
    "react/jsx-no-undef": "error",
    "react/no-children-prop": "error",
    "react/no-danger-with-children": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unknown-property": "error",
    "react/require-render-return": "error",
    // v1 の eslint-plugin-react-hooks の recommended から引き継いだルール
    "react/rules-of-hooks": "error",
    "react/exhaustive-deps": "warn",
    // コンポーネント名はPascalCaseで記載する
    "react/jsx-pascal-case": "error",
    // 空のFragmentは記載しない
    "react/jsx-no-useless-fragment": "error",
    // import React from "react"を記載しない
    "react/react-in-jsx-scope": "off",
  },
})
