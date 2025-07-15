// @ts-check

import globals from "globals"

import base from "./base.mjs"
import react from "./rules/react.mjs"
import reactHooks from "./rules/react-hooks.mjs"

const eslintConfig = [
  ...base,
  react,
  reactHooks,
  {
    name: "global-definitions",
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    ignores: ["node_modules/", "dist/", "*.js"],
  },
]

export default eslintConfig
