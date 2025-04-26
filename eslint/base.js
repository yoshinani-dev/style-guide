const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  plugins: ["@typescript-eslint", "import", "eslint-comments", "functional"],
  rules: {
    // [比較演算子禁止](https://www.notion.so/yoshinani-note/1dff5577f5838145acfcca9176913b79)
    eqeqeq: ["error", "always", { null: "ignore" }],
    // [any禁止](https://www.notion.so/yoshinani-note/any-1dff5577f5838174907ae6b2cfaf72ea)
    "@typescript-eslint/no-explicit-any": "error",
    // [混乱を招くvoidの使用禁止](https://www.notion.so/yoshinani-note/void-1dff5577f5838144bf0dc90e4bdffcb3)
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: true },
    ],
    // [awaitつけ忘れ防止](https://www.notion.so/yoshinani-note/await-1dff5577f58381e5ab40f29d8d3f0be4)
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-shadow": "off",
    // [誤ったpromiseの使用禁止](https://www.notion.so/yoshinani-note/promise-1dff5577f58381ae86c0d8c5b83f052a)
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
    // [不要なオプショナルチェーン禁止](https://www.notion.so/yoshinani-note/1dff5577f583816e8b5eec9963add23d)
    "@typescript-eslint/no-unnecessary-condition": "error",
    // [nullなどをそのまま文字列にするのを禁止](https://www.notion.so/yoshinani-note/null-1dff5577f5838104b3b9db6eee64f106)
    "@typescript-eslint/restrict-template-expressions": [
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
    "eslint-comments/require-description": ["error", {"ignore": []}],
    "functional/immutable-data": "error",
    // sort import statements
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc" },
      },
    ],
    // sort named imports within an import statement
    "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    "no-restricted-syntax": [
      "error",
      // [enum禁止](https://www.notion.so/yoshinani-note/enum-1dff5577f58381a2b809d81ddc486701)
      {
        selector: "TSEnumDeclaration",
        message:
          "TSのenumには様々な問題があります。enum as constを使用してください。",
      },
      {
        selector: "ForInStatement",
        message: "for文は使わず、forEach、map、filterなどを使用してください。",
      },
      {
        selector: "ForOfStatement",
        message: "for文は使わず、forEach、map、filterなどを使用してください。",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    // [process.envの乱用禁止](https://www.notion.so/yoshinani-note/process-env-1dff5577f58381f4ba04f06cac13d334)
    "no-process-env": "error",
    // [インポートを制限](https://www.notion.so/yoshinani-note/1dff5577f58381a7bd81ef0805696e2b)
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "yup",
            message: "valibotを使用してください。",
          },
          {
            name: "@material-tailwind/react",
            message: "shadcn/uiを使用してください。",
          },
          {
            name: "dayjs",
            message: "date-fnsを使用してください。",
          },
        ],
        patterns: [
          {
            group: ["lodash/*"],
            message: "remedaを使用してください。",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: [
        "*.config.{mjs,ts}",
        "app/**/{page,layout,not-found,*error,opengraph-image,apple-icon}.tsx",
        "app/**/{sitemap,robots}.ts",
      ],
      rules: {
        "import/no-default-export": "off",
        "import/prefer-default-export": ["error", { target: "any" }],
      },
    },
    {
      files: ["env.ts"],
      rules: {
        "@typescript-eslint/dot-notation": "off",
        "no-process-env": "off",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "func-names": "off",
      },
    },
  ],
}
