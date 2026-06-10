// @ts-check

import reactHooks from "eslint-plugin-react-hooks"

export default /** @type {import("eslint").Linter.Config} */ ({
  name: "react-hooks",
  plugins: {
    "react-hooks": reactHooks,
  },
  rules: {
    ...reactHooks.configs["recommended-latest"].rules,
  },
})
