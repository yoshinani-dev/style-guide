---
"@yoshinani/style-guide": major
---

Prettier 設定を削除。フォーマッタは Biome に一本化したため、`@yoshinani/style-guide/prettier` の export と `prettier` の peerDependency を廃止した。利用側は Biome のフォーマッタへ移行が必要な破壊的変更。
