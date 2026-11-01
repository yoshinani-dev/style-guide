import type { OxfmtConfig } from "oxfmt"

const config: OxfmtConfig = {
  // oxfmt の既定値は 100。v1（Biome）と同じ 80 に揃える
  printWidth: 80,
  semi: false,
  sortImports: {
    newlinesBetween: true,
    customGroups: [
      // モノレポのパッケージ（'@repo/ui' など）
      { groupName: "monorepo", elementNamePattern: ["@repo/**"] },
    ],
    groups: [
      // 標準ライブラリ（'node:path' など）
      "builtin",
      // 外部のパッケージ（'react' など）
      "external",
      "monorepo",
      // エイリアス（'@/lib/utils'、'~/env' など）
      ["internal", "subpath"],
      // パス（'./components/nav-bar' など）
      ["parent", "sibling", "index"],
      "unknown",
    ],
  },
  sortTailwindcss: {
    functions: ["cn", "clsx", "cva"],
  },
  // package.json のキーは並び替えない（v1 と同じ挙動）
  sortPackageJson: false,
  // Markdown はフォーマットしない
  ignorePatterns: ["**/*.md"],
}

export default config
