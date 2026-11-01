import type { OxlintConfig, OxlintOverride } from "oxlint"

declare const effect: {
  plugins: NonNullable<OxlintConfig["plugins"]>
  rules: NonNullable<OxlintConfig["rules"]>
  overrides: OxlintOverride[]
}
export default effect
