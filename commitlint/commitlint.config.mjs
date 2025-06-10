export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        // ビルドシステムや依存関係のみの変更
        "build",
        // CIワークフローの変更
        "ci",
        // ドキュメントのみの変更
        "docs",
        // 新機能
        "feat",
        // バグ修正
        "fix",
        // パフォーマンス向上のためのコード変更
        "perf",
        // バグ修正や新機能追加以外のコード変更
        "refactor",
        // 以前のコミットの取り消し
        "revert",
        // コードの意味に影響しない変更
        "style",
        // テストの追加や既存テストの修正
        "test",
        // 自動リリース専用
        "release",
      ],
    ],
  },
}
