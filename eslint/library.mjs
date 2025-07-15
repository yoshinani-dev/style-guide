// @ts-check

import globals from "globals"

import base from "./base.mjs"

const eslintConfig = [
  ...base,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    ignores: ["node_modules/", "dist/", "*.js"],
  },
]

export default eslintConfig
