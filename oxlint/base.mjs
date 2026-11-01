// @ts-check

import { fileURLToPath } from "node:url"

import {
  restrictedImportPaths,
  restrictedImportPatterns,
} from "./rules/restricted-imports.mjs"

/** @type {import("oxlint").OxlintConfig} */
export default {
  plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "node"],
  jsPlugins: [
    // oxlint 本体にないルールを補う自前のプラグイン。
    // 利用者の設定ファイルから extends されても解決できるよう、絶対パスで指定する
    {
      name: "yoshinani",
      specifier: fileURLToPath(
        new URL("./plugins/yoshinani.mjs", import.meta.url),
      ),
    },
  ],
  // 明らかな誤りを検出するルールは、oxlint の correctness カテゴリでまとめて有効にする
  categories: {
    correctness: "error",
  },
  rules: {
    // v1 の eslint:recommended / typescript-eslint の recommendedTypeChecked から引き継いだルール
    "for-direction": "error",
    "no-array-constructor": "error",
    "no-async-promise-executor": "error",
    "no-case-declarations": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "error",
    "no-constant-binary-expression": "error",
    "no-constant-condition": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-else-if": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-empty-static-block": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-fallthrough": "error",
    "no-global-assign": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-loss-of-precision": "error",
    "no-misleading-character-class": "error",
    "no-nonoctal-decimal-escape": "error",
    "no-prototype-builtins": "error",
    "no-regex-spaces": "error",
    "no-self-assign": "error",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-optional-chaining": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "no-unused-private-class-members": "error",
    "no-unused-vars": "error",
    "no-useless-backreference": "error",
    "no-useless-catch": "error",
    "no-useless-escape": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "require-yield": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    "typescript/await-thenable": "error",
    "typescript/ban-ts-comment": "error",
    "typescript/no-array-delete": "error",
    "typescript/no-base-to-string": "error",
    "typescript/no-duplicate-enum-values": "error",
    "typescript/no-duplicate-type-constituents": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-extra-non-null-assertion": "error",
    "typescript/no-for-in-array": "error",
    "typescript/no-implied-eval": "error",
    "typescript/no-misused-new": "error",
    "typescript/no-namespace": "error",
    "typescript/no-non-null-asserted-optional-chain": "error",
    "typescript/no-redundant-type-constituents": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-this-alias": "error",
    "typescript/no-unnecessary-type-assertion": "error",
    "typescript/no-unnecessary-type-constraint": "error",
    "typescript/no-unsafe-argument": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-declaration-merging": "error",
    "typescript/no-unsafe-enum-comparison": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
    "typescript/no-unsafe-unary-minus": "error",
    "typescript/no-wrapper-object-types": "error",
    "typescript/only-throw-error": "error",
    "typescript/prefer-as-const": "error",
    "typescript/prefer-namespace-keyword": "error",
    "typescript/prefer-promise-reject-errors": "error",
    "typescript/require-await": "error",
    "typescript/restrict-plus-operands": "error",
    "typescript/triple-slash-reference": "error",
    "typescript/unbound-method": "error",

    // [比較演算子禁止](https://www.notion.so/yoshinani-note/1dff5577f5838145acfcca9176913b79)
    eqeqeq: ["error", "always", { null: "ignore" }],
    // [any禁止](https://www.notion.so/yoshinani-note/any-1dff5577f5838174907ae6b2cfaf72ea)
    "typescript/no-explicit-any": "error",
    // [型しか使用しない場合はimport typeでそれを明示する](https://www.notion.so/yoshinani-note/import-type-20df5577f583807d928ec2cdb9dce9bd)
    "typescript/consistent-type-imports": "warn",
    // [混乱を招くvoidの使用禁止](https://www.notion.so/yoshinani-note/void-1dff5577f5838144bf0dc90e4bdffcb3)
    "typescript/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: true },
    ],
    // [awaitつけ忘れ防止](https://www.notion.so/yoshinani-note/await-1dff5577f58381e5ab40f29d8d3f0be4)
    "typescript/no-floating-promises": "error",
    // [誤ったpromiseの使用禁止](https://www.notion.so/yoshinani-note/promise-1dff5577f58381ae86c0d8c5b83f052a)
    "typescript/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
    // [不要なオプショナルチェーン禁止](https://www.notion.so/yoshinani-note/1dff5577f583816e8b5eec9963add23d)
    "typescript/no-unnecessary-condition": "error",
    // [nullなどをそのまま文字列にするのを禁止](https://www.notion.so/yoshinani-note/null-1dff5577f5838104b3b9db6eee64f106)
    "typescript/restrict-template-expressions": [
      "error",
      {
        allowAny: false,
        allowBoolean: false,
        allowNullish: false,
        allowRegExp: false,
        allowNever: false,
      },
    ],
    // [ルール無効化の際に理由を添える](https://www.notion.so/yoshinani-note/1dff5577f583818b913fec991d5e8b46)
    "yoshinani/require-description": "error",
    // [enum禁止](https://www.notion.so/yoshinani-note/enum-1dff5577f58381a2b809d81ddc486701)
    "yoshinani/no-enum": "error",
    // Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.
    "no-labels": "error",
    // `with` is disallowed in strict mode because it makes code impossible to predict and optimize.
    "no-with": "error",
    // [process.envの乱用禁止](https://www.notion.so/yoshinani-note/process-env-1dff5577f58381f4ba04f06cac13d334)
    "node/no-process-env": "error",
    // [インポートを制限](https://www.notion.so/yoshinani-note/1dff5577f58381a7bd81ef0805696e2b)
    "no-restricted-imports": [
      "warn",
      {
        paths: restrictedImportPaths,
        patterns: restrictedImportPatterns,
      },
    ],
    // oxfmt は同じモジュールからの import を統合しないため、lint で検出する
    "import/no-duplicates": "error",
  },
  overrides: [
    {
      files: ["**/*.config.{js,mjs,cjs,ts,mts,cts}"],
      rules: {
        "import/prefer-default-export": ["error", { target: "any" }],
      },
    },
    {
      files: ["**/env.ts"],
      rules: {
        "typescript/dot-notation": "off",
        "node/no-process-env": "off",
      },
    },
  ],
  options: {
    // 利用者のルート設定にも書くことを推奨する（ドキュメント上はルート設定のみ有効とされているため）
    typeAware: true,
  },
}
