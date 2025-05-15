// @ts-check

import react from "eslint-plugin-react";

export default {
  name: "react",
  files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.flat.recommended.rules,
    // コンポーネント名はPascalCaseで記載する
    "react/jsx-pascal-case": "error",
    // 空のFragmentは記載しない
    "react/jsx-no-useless-fragment": "error",
    // import React from "react"を記載しない
    "react/react-in-jsx-scope": "off",
    // prop-typesを使用しない
    "react/prop-types": "off",
  },
};
