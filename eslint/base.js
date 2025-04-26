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
  plugins: ["@typescript-eslint", "eslint-plugin-import"],
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: true },
    ],
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
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
    "no-process-env": "error",
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
