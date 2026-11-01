import type { OxlintConfig } from "oxlint"

import base from "./base"
import react from "./rules/react"

const config: OxlintConfig = {
  ...base,
  plugins: [...(base.plugins ?? []), ...react.plugins],
  rules: {
    ...base.rules,
    ...react.rules,
  },
  overrides: [
    ...(base.overrides ?? []),
    // extends で引き継がれるのは rules / plugins / overrides だけなので、globals は overrides で渡す
    { files: ["**/*"], env: { browser: true, serviceworker: true } },
  ],
}

export default config
