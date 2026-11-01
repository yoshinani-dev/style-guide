// @ts-check

import base from "./base.mjs"

/** @type {import("oxlint").OxlintConfig} */
export default {
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    // extends で引き継がれるのは rules / plugins / overrides だけなので、globals は overrides で渡す
    { files: ["**/*"], env: { node: true, es2021: true } },
  ],
}
