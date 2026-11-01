import { defineConfig } from "oxfmt"

import base from "./oxfmt/base.mjs"

export default defineConfig({
  ...base,
  ignorePatterns: [...(base.ignorePatterns ?? []), "pnpm-lock.yaml"],
})
