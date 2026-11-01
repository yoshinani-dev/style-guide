// @ts-check

import base from "./base.mjs"
import react from "./rules/react.mjs"

/** @type {import("oxlint").OxlintConfig} */
export default {
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
