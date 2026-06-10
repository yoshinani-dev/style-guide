// @ts-check

import { defineConfig } from "eslint/config"
import globals from "globals"

import base from "./base.mjs"
import react from "./rules/react.mjs"
import reactHooks from "./rules/react-hooks.mjs"

export default defineConfig([
  ...base,
  react,
  reactHooks,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    ignores: ["node_modules/", "dist/"],
  },
])
