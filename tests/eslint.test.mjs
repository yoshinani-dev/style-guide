// @ts-check
import path from "path"
import { fileURLToPath } from "url"

import { ESLint } from "eslint"
import { describe, expect, it } from "vitest"

import base from "../eslint/base.mjs"
import library from "../eslint/library.mjs"
import next from "../eslint/next.mjs"
import reactInternal from "../eslint/react-internal.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// -----------------------------------------------------------------------
// Shape tests
// -----------------------------------------------------------------------

describe("config shape", () => {
  it("base is a non-empty FlatConfig array", () => {
    expect(Array.isArray(base)).toBe(true)
    expect(base.length).toBeGreaterThan(0)
  })

  it("next is a non-empty FlatConfig array", () => {
    expect(Array.isArray(next)).toBe(true)
    expect(next.length).toBeGreaterThan(0)
  })

  it("library is a non-empty FlatConfig array", () => {
    expect(Array.isArray(library)).toBe(true)
    expect(library.length).toBeGreaterThan(0)
  })

  it("react-internal is a non-empty FlatConfig array", () => {
    expect(Array.isArray(reactInternal)).toBe(true)
    expect(reactInternal.length).toBeGreaterThan(0)
  })
})

// -----------------------------------------------------------------------
// Rule behavior tests
// -----------------------------------------------------------------------

/**
 * テスト用 ESLint 設定を組み立てる。
 *
 * `projectService` を `allowDefaultProject` モードで動作させることで、
 * `lintText` の仮想ファイルにも型情報を提供し、型情報必須ルールを含む
 * base 設定をそのままテストできるようにする。
 */
function buildTestConfig() {
  const tsconfigPath = path.join(__dirname, "tsconfig.json")

  return base.map((cfg) => {
    if (!cfg.languageOptions?.parserOptions?.projectService) return cfg
    return {
      ...cfg,
      languageOptions: {
        ...cfg.languageOptions,
        parserOptions: {
          projectService: {
            // tsconfig に含まれないファイル（lintText の仮想ファイル）も許可
            allowDefaultProject: ["*.ts", "*.tsx", "*.js", "*.mjs"],
            defaultProject: tsconfigPath,
          },
          tsconfigRootDir: __dirname,
        },
      },
    }
  })
}

/**
 * @param {string} code
 * @param {string} [filename]
 */
async function lint(code, filename = "test.js") {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: buildTestConfig(),
  })
  const filePath = path.join(__dirname, filename)
  const results = await eslint.lintText(code, { filePath })
  return results[0]?.messages ?? []
}

describe("rule behavior", () => {
  it("no-restricted-imports: zod import が warn を出す", async () => {
    const messages = await lint('import { z } from "zod"\nexport { z }\n')
    const match = messages.find((m) => m.ruleId === "no-restricted-imports")
    expect(match).toBeDefined()
    expect(match?.severity).toBe(1) // warn
  })

  it("eqeqeq: == の使用が error を出す", async () => {
    const messages = await lint("const a = 1\nconst b = 2\nif (a == b) {}\n")
    const match = messages.find((m) => m.ruleId === "eqeqeq")
    expect(match).toBeDefined()
    expect(match?.severity).toBe(2) // error
  })

  it("no-process-env: process.env の参照が error を出す", async () => {
    const messages = await lint("const x = process.env.FOO\nexport { x }\n")
    const match = messages.find((m) => m.ruleId === "no-process-env")
    expect(match).toBeDefined()
    expect(match?.severity).toBe(2) // error
  })

  it("no-restricted-syntax: TSEnumDeclaration が error を出す", async () => {
    const messages = await lint(
      "enum Direction { Up, Down }\nexport {}\n",
      "test.ts",
    )
    const match = messages.find((m) => m.ruleId === "no-restricted-syntax")
    expect(match).toBeDefined()
    expect(match?.severity).toBe(2) // error
  })

  it("正常なコードでは error/warn が出ない", async () => {
    const code = "const x = 1\nexport { x }\n"
    const messages = await lint(code, "test.js")
    const issues = messages.filter((m) => m.severity >= 1)
    // 発火したルールをわかりやすく表示する
    expect(issues.map((m) => m.ruleId)).toHaveLength(0)
  })
})
