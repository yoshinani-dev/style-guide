import type { OxlintConfig } from "oxlint"

import withoutEffect from "./library"
import effect from "./rules/effect"

const config: OxlintConfig = {
  ...withoutEffect,
  plugins: [...(withoutEffect.plugins ?? []), ...effect.plugins],
  rules: {
    ...withoutEffect.rules,
    ...effect.rules,
  },
  overrides: [...(withoutEffect.overrides ?? []), ...effect.overrides],
}

export default config
