// @ts-check
import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import { beforeAll, describe, expect, it } from "vitest"

import baseEffect from "../oxlint/base-effect.mjs"
import base from "../oxlint/base.mjs"
import libraryEffect from "../oxlint/library-effect.mjs"
import library from "../oxlint/library.mjs"
import nextEffect from "../oxlint/next-effect.mjs"
import next from "../oxlint/next.mjs"
import reactLibraryEffect from "../oxlint/react-library-effect.mjs"
import reactLibrary from "../oxlint/react-library.mjs"
import effect from "../oxlint/rules/effect.mjs"

const execFileAsync = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const oxlintBin = path.join(root, "node_modules", ".bin", "oxlint")
// effecttsgo プラグインは Effect 版の oxlint でしか動かないため、node_modules を書き換えずに済むラッパー経由で実行する
const effectTsgoBin = path.join(root, "node_modules", ".bin", "effect-tsgo")

/**
 * @typedef {{ code: string, severity: string, filename: string }} Diagnostic
 */

/**
 * fixture ディレクトリに oxlint を実行し、ファイル名ごとの診断を返す。
 * 違反が見つかると oxlint は終了コード 1 で終わるため、stdout をそのまま使う。
 *
 * @param {string} variant
 * @param {{ effect?: boolean }} [options]
 * @returns {Promise<Map<string, Diagnostic[]>>}
 */
async function lintFixtures(variant, { effect = false } = {}) {
  const dir = path.join("tests", "fixtures", variant)
  const [bin, ...prefix] = effect
    ? [effectTsgoBin, "oxlint", "--type-aware"]
    : [oxlintBin]
  const stdout = await execFileAsync(
    bin,
    [
      ...prefix,
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
    ["next", next],
  ])("%s は rules を持つ設定オブジェクト", (_name, config) => {
    expect(Object.keys(config.rules ?? {}).length).toBeGreaterThan(0)
  })

  it("library / react-library / next は base のルールを引き継ぐ", () => {
    for (const config of [library, reactLibrary, next]) {
      expect(config.rules).toMatchObject(base.rules ?? {})
    }
  })

  it.each([
    ["base-effect", baseEffect, base],
    ["library-effect", libraryEffect, library],
    ["react-library-effect", reactLibraryEffect, reactLibrary],
    ["next-effect", nextEffect, next],
  ])(
    "%s は Effect 無し版のルールと Effect のルールを両方持つ",
    (_name, config, withoutEffect) => {
      expect(config.rules).toMatchObject(withoutEffect.rules ?? {})
      expect(config.rules).toMatchObject(effect.rules)
      expect(config.plugins).toContain("effecttsgo")
      expect(config.overrides).toEqual(expect.arrayContaining(effect.overrides))
    },
  )

  it("Effect の unstable-api-usage はテストファイルでだけ無効になる", () => {
    expect(effect.rules["effecttsgo/unstable-api-usage"]).toBeDefined()
    expect(effect.overrides).toContainEqual({
      files: ["**/*.{test,spec}.{ts,tsx,mts,cts}"],
      rules: { "effecttsgo/unstable-api-usage": "off" },
    })
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

describe("next", () => {
  /** @type {Map<string, Diagnostic[]>} */
  let results

  beforeAll(async () => {
    results = await lintFixtures("next")
  })

  it("oxlint の nextjs プラグインのルールをすべて設定している", async () => {
    const { stdout } = await execFileAsync(
      oxlintBin,
      ["--rules", "-f", "json"],
      { cwd: root },
    )
    const nextjsRules = /** @type {{ scope: string, value: string }[]} */ (
      JSON.parse(stdout)
    )
      .filter((rule) => rule.scope === "nextjs")
      .map((rule) => `nextjs/${rule.value}`)
    expect(nextjsRules.length).toBeGreaterThan(0)
    expect(Object.keys(next.rules ?? {})).toEqual(
      expect.arrayContaining(nextjsRules),
    )
  })

  it.each([
    ["avatar.tsx", "next(no-img-element)"],
    ["client-async.tsx", "next(no-async-client-component)"],
    ["layout.tsx", "import(prefer-default-export)"],
  ])("%s で %s が error になる", (file, code) => {
    expect(results.get(file) ?? []).toContainEqual(
      expect.objectContaining({ code, severity: "error" }),
    )
  })

  it.each(["page.tsx", "opengraph-image.tsx"])(
    "%s では何も検出されない",
    (file) => {
      expect(results.get(file) ?? []).toEqual([])
    },
  )
})

describe("library-effect", () => {
  /** @type {Map<string, Diagnostic[]>} */
  let results

  beforeAll(async () => {
    results = await lintFixtures("library-effect", { effect: true })
  })

  it("Effect の実行し忘れが effecttsgo(floating-effect) で error になる", () => {
    expect(results.get("floating-effect.ts") ?? []).toContainEqual(
      expect.objectContaining({
        code: "effecttsgo(floating-effect)",
        severity: "error",
      }),
    )
  })

  it("Effect.runPromise の await し忘れが no-floating-promises で error になる", () => {
    expect(results.get("floating-run-promise.ts") ?? []).toContainEqual(
      expect.objectContaining({
        code: "typescript(no-floating-promises)",
        severity: "error",
      }),
    )
  })

  it("Effect.gen を使う正常なコードでは何も検出されない", () => {
    expect(results.get("clean.ts") ?? []).toEqual([])
  })
})
