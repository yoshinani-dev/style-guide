import type { OxlintConfig } from "oxlint"

import base from "./base"

const config: OxlintConfig = {
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    // extends で引き継がれるのは rules / plugins / overrides だけなので、globals は overrides で渡す
    { files: ["**/*"], env: { node: true, es2021: true } },
  ],
}

export default config
