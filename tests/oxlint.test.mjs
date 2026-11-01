// @ts-check
import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import { beforeAll, describe, expect, it } from "vitest"

import base from "../oxlint/base.mjs"
import library from "../oxlint/library.mjs"
import reactLibrary from "../oxlint/react-library.mjs"

const execFileAsync = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const oxlintBin = path.join(root, "node_modules", ".bin", "oxlint")

/**
 * @typedef {{ code: string, severity: string, filename: string }} Diagnostic
 */

/**
 * fixture ディレクトリに oxlint を実行し、ファイル名ごとの診断を返す。
 * 違反が見つかると oxlint は終了コード 1 で終わるため、stdout をそのまま使う。
 *
 * @param {string} variant
 * @returns {Promise<Map<string, Diagnostic[]>>}
 */
async function lintFixtures(variant) {
  const dir = path.join("tests", "fixtures", variant)
  const stdout = await execFileAsync(
    oxlintBin,
    [
      "-c",
      path.join(dir, "oxlint.config.ts"),
      "-f",
      "json",
      path.join(dir, "src"),
    ],
    { cwd: root },
  ).then(
    (result) => result.stdout,
    (/** @type {{ stdout?: string }} */ error) => {
      if (error.stdout === undefined) throw error
      return error.stdout
    },
  )
  const report = /** @type {{ diagnostics: Diagnostic[] }} */ (
    JSON.parse(stdout)
  )
  /** @type {Map<string, Diagnostic[]>} */
  const byFile = new Map()
  for (const diagnostic of report.diagnostics) {
    const file = path.basename(diagnostic.filename)
    byFile.set(file, [...(byFile.get(file) ?? []), diagnostic])
  }
  return byFile
}

// -----------------------------------------------------------------------
// Shape tests
// -----------------------------------------------------------------------

describe("config shape", () => {
  it.each([
    ["base", base],
    ["library", library],
    ["react-library", reactLibrary],
  ])("%s は rules を持つ設定オブジェクト", (_name, config) => {
    expect(Object.keys(config.rules ?? {}).length).toBeGreaterThan(0)
  })

  it("library と react-library は base のルールを引き継ぐ", () => {
    for (const config of [library, reactLibrary]) {
      expect(config.rules).toMatchObject(base.rules ?? {})
    }
  })
})

// -----------------------------------------------------------------------
// Rule behavior tests
// -----------------------------------------------------------------------

describe("base", () => {
  /** @type {Map<string, Diagnostic[]>} */
  let results

  beforeAll(async () => {
    results = await lintFixtures("base")
  })

  it.each([
    ["restricted-import.ts", "eslint(no-restricted-imports)", "warning"],
    ["eqeqeq.ts", "eslint(eqeqeq)", "error"],
    ["process-env.ts", "node(no-process-env)", "error"],
    ["enum.ts", "yoshinani(no-enum)", "error"],
    ["require-description.ts", "yoshinani(require-description)", "error"],
    [
      "require-description-oxlint.ts",
      "yoshinani(require-description)",
      "error",
    ],
    ["floating-promise.ts", "typescript(no-floating-promises)", "error"],
    ["duplicate-import.ts", "import(no-duplicates)", "error"],
  ])("%s で %s が %s になる", (file, code, severity) => {
    const diagnostics = results.get(file) ?? []
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ code, severity }),
    )
  })

  it.each(["clean.ts", "env.ts", "described-directive.ts"])(
    "%s では何も検出されない",
    (file) => {
      expect(results.get(file) ?? []).toEqual([])
    },
  )
})

describe("library", () => {
  it("正常なコードでは何も検出されない", async () => {
    const results = await lintFixtures("library")
    expect(results.get("clean.ts") ?? []).toEqual([])
  })
})

describe("react-library", () => {
  /** @type {Map<string, Diagnostic[]>} */
  let results

  beforeAll(async () => {
    results = await lintFixtures("react-library")
  })

  it("missing-key.tsx で react(jsx-key) が error になる", () => {
    expect(results.get("missing-key.tsx") ?? []).toContainEqual(
      expect.objectContaining({ code: "react(jsx-key)", severity: "error" }),
    )
  })

  it("clean.tsx では何も検出されない", () => {
    expect(results.get("clean.tsx") ?? []).toEqual([])
  })
})
