// @ts-check

import config from "./react-library.mjs"
import effect from "./rules/effect.mjs"

/** @type {import("oxlint").OxlintConfig} */
export default {
  ...config,
  plugins: [...(config.plugins ?? []), ...effect.plugins],
  rules: {
    ...config.rules,
    ...effect.rules,
  },
  overrides: [...(config.overrides ?? []), ...effect.overrides],
}
