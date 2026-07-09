---
"@yoshinani/style-guide": major
---

TypeScript 6 対応と TypeScript 7 への準備

- **BREAKING**: `typescript/base.json` に `"types": []` を明示しました(TypeScript 7 のデフォルト値の先取り)。`@types/node` などのグローバル型定義が自動で読み込まれなくなるため、必要な場合は利用側の `tsconfig.json` の `compilerOptions.types` で明示してください
- `peerDependencies` の `typescript` を `^5 || ^6` に拡大しました
- 共有 tsconfig が TypeScript 6 / 7(ネイティブ実装)の両方で有効であることを CI で検証するようにしました
- ESLint の型情報ルール(typescript-eslint)は TypeScript `<6.1` までの対応です。TypeScript 7 を使う場合の併用方法は README を参照してください
