export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build", // ビルドシステムや依存関係のみの変更
        "docs", // ドキュメントのみの変更
        "feat", // 新機能
        "fix", // バグ修正
        "refactor", // バグ修正や新機能追加以外のコード変更
        "test", // テストの追加や既存テストの修正
        "release", // 自動リリース専用
      ],
    ],
    "subject-case": [
      0,
      "never",
      [
        "lower-case", // default
        "upper-case", // UPPERCASE
        "camel-case", // camelCase
        "kebab-case", // kebab-case
        "pascal-case", // PascalCase
        "sentence-case", // Sentence case
        "snake-case", // snake_case
        "start-case", // Start Case
      ],
    ],
  },
}
