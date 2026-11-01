/**
 * oxlint 本体にないルールを補う JS プラグイン。
 *
 * - require-description: ルールの無効化コメントに理由（`-- 理由`）を書かせる。
 *   eslint-disable に加えて oxlint-disable も対象にする。
 * - no-enum: TypeScript の enum を禁止する。
 */

import type { Plugin } from "@oxlint/plugins"

const DIRECTIVE_PATTERN =
  /^\s*((?:eslint|oxlint)-(?:disable|enable|disable-line|disable-next-line))(?:\s|$)/u

// ESLint と同じく、2 つ以上のハイフンを空白で挟んだ後ろを理由とみなす
const DESCRIPTION_PATTERN = /\s-{2,}\s+\S/u

const plugin: Plugin = {
  meta: { name: "yoshinani" },
  rules: {
    "require-description": {
      meta: {
        type: "suggestion",
        docs: {
          description: "ルールの無効化コメントに理由を書くことを求める",
        },
      },
      create(context) {
        for (const comment of context.sourceCode.getAllComments()) {
          const directive = DIRECTIVE_PATTERN.exec(comment.value)?.[1]
          if (directive === undefined) continue
          if (DESCRIPTION_PATTERN.test(comment.value)) continue
          context.report({
            node: comment,
            message: `${directive} コメントには理由を添えてください（例: // ${directive} rule-name -- 理由）。`,
          })
        }
        return {}
      },
    },
    "no-enum": {
      meta: {
        type: "suggestion",
        docs: {
          description: "TypeScript の enum を禁止する",
        },
      },
      create(context) {
        return {
          TSEnumDeclaration(node) {
            context.report({
              node,
              message:
                "TSのenumには様々な問題があります。enum as constを使用してください。",
            })
          },
        }
      },
    },
  },
}

export default plugin
