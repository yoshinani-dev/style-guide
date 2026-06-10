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
    name: "global-definitions",
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    ignores: ["node_modules/", "dist/", "*.js"],
  },
])
