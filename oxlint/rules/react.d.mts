import type { OxlintConfig } from "oxlint"

declare const react: {
  plugins: NonNullable<OxlintConfig["plugins"]>
  rules: NonNullable<OxlintConfig["rules"]>
}
export default react
