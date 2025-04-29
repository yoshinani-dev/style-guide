// @ts-check

import react from "eslint-plugin-react";

export default {
  name: "react",
  files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
  plugins: {
    react,
  },
  rules: {
    ...react.configs.flat.recommended.rules,
    // コンポーネント名はPascalCaseで記載する
    "react/jsx-pascal-case": "error",
    // 論理値はtrue/falseで記載する
    "react/jsx-boolean-value": ["error", "always"],
    // 空のFragmentは記載しない
    "react/jsx-no-useless-fragment": "error",
  },
};
