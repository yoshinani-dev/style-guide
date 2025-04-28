// @ts-check

import base from "./base.mjs";
import globals from "globals";

const eslintConfig = [
  ...base,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    ignores: ["node_modules/", "dist/", "*.js"],
  },
];

export default eslintConfig;
