// @ts-check

import base from "./base.mjs";
import globals from "globals";

const eslintConfig = [
  ...base,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    ignores: ["node_modules/", "dist/"],
  },
];

export default eslintConfig;
