// @ts-check

import reactHooks from "eslint-plugin-react-hooks";

export default {
  name: "react-hooks",
  plugins: {
    "react-hooks": reactHooks,
  },
  rules: {
    ...reactHooks.configs["recommended-latest"].rules,
  },
};
