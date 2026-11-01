import { execFile } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { promisify } from "node:util"

import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test"

import base from "../src/oxlint/base"
import baseEffect from "../src/oxlint/base-effect"
import library from "../src/oxlint/library"
import libraryEffect from "../src/oxlint/library-effect"
import next from "../src/oxlint/next"
import nextEffect from "../src/oxlint/next-effect"
import reactLibrary from "../src/oxlint/react-library"
import reactLibraryEffect from "../src/oxlint/react-library-effect"
import effect from "../src/oxlint/rules/effect"

const execFileAsync = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const oxlintBin = path.join(root, "node_modules", ".bin", "oxlint")
// effecttsgo プラグインは Effect 版の oxlint でしか動かないため、node_modules を書き換えずに済むラッパー経由で実行する
const effectTsgoBin = path.join(root, "node_modules", ".bin", "effect-tsgo")

// vp test の中では VP_VERSION が設定され、子プロセスの oxlint が vite.config.ts の
// lint ブロックを探すモードになる。単体の oxlint.config.ts で検査するため、外して渡す
// eslint-disable-next-line node/no-process-env -- 子プロセスに渡す環境変数を調整するため
const { VP_VERSION: _vpVersion, ...childEnv } = process.env
const execOptions = { cwd: root, env: childEnv }

interface Diagnostic {
  code: string
  severity: string
  filename: string
}

/**
 * fixture ディレクトリに oxlint を実行し、ファイル名ごとの診断を返す。
 * 違反が見つかると oxlint は終了コード 1 で終わるため、stdout をそのまま使う。
 *
 */
async function lintFixtures(
  variant: string,
  { effect = false }: { effect?: boolean } = {},
): Promise<Map<string, Diagnostic[]>> {
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
    execOptions,
  ).then(
    (result) => result.stdout,
    (error: { stdout?: string }) => {
      if (error.stdout === undefined) throw error
      return error.stdout
    },
  )
  const report = JSON.parse(stdout) as { diagnostics: Diagnostic[] }
  const byFile = new Map<string, Diagnostic[]>()
  for (const diagnostic of report.diagnostics) {
    const file = path.basename(diagnostic.filename)
    byFile.set(file, [...(byFile.get(file) ?? []), diagnostic])
  }
  return byFile
}

// -----------------------------------------------------------------------
// Shape tests
// -----------------------------------------------------------------------

describe("toolchain", () => {
  it("oxlint 関連の devDependencies が vite-plus の同梱バージョンと揃っている", async () => {
    // vp check（vite-plus 同梱の oxlint）とテスト（devDependencies の oxlint）で
    // 同じバージョンを検証するため
    const readJson = async (file: string) =>
      JSON.parse(await readFile(path.join(root, file), "utf8")) as {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
      }
    const pkg = await readJson("package.json")
    const vitePlus = await readJson("node_modules/vite-plus/package.json")
    for (const name of ["oxlint", "oxlint-tsgolint", "@oxlint/plugins"]) {
      expect({ [name]: pkg.devDependencies?.[name] }).toEqual({
        [name]: vitePlus.dependencies?.[name]?.replace(/^=/u, ""),
      })
    }
  })
})

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

  it.each([
    ["base", base],
    ["library", library],
    ["react-library", reactLibrary],
    ["next", next],
  ])("%s には Effect のルールが入っていない", (_name, config) => {
    expect(config.plugins).not.toContain("effecttsgo")
    expect(
      Object.keys(config.rules ?? {}).filter((rule) =>
        rule.startsWith("effecttsgo/"),
      ),
    ).toEqual([])
  })
})

// -----------------------------------------------------------------------
// Load tests
// -----------------------------------------------------------------------

describe("oxlint で読み込める", () => {
  let tmp: string

  beforeAll(async () => {
    tmp = await mkdtemp(path.join(tmpdir(), "style-guide-oxlint-"))
  })

  afterAll(async () => {
    await rm(tmp, { recursive: true, force: true })
  })

  it.each([
    "base",
    "library",
    "react-library",
    "next",
    "base-effect",
    "library-effect",
    "react-library-effect",
    "next-effect",
  ])("%s を extends した設定で正常なコードを検査できる", async (variant) => {
    const configUrl = pathToFileURL(
      path.join(root, "dist", "oxlint", `${variant}.mjs`),
    )
    const configFile = path.join(tmp, `${variant}.config.ts`)
    await writeFile(
      configFile,
      `import config from ${JSON.stringify(configUrl.href)}\nexport default { extends: [config] }\n`,
    )
    const [bin, ...prefix] = variant.endsWith("-effect")
      ? [effectTsgoBin, "oxlint", "--type-aware"]
      : [oxlintBin]
    // 違反や設定の読み込み失敗があると終了コードが 0 以外になり、reject される
    const { stdout } = await execFileAsync(
      bin,
      [
        ...prefix,
        "-c",
        configFile,
        "-f",
        "json",
        path.join("tests", "fixtures", "base", "src", "clean.ts"),
      ],
      execOptions,
    )
    const report = JSON.parse(stdout) as { diagnostics: Diagnostic[] }
    expect(report.diagnostics).toEqual([])
  })
})

// -----------------------------------------------------------------------
// Rule behavior tests
// -----------------------------------------------------------------------

describe("base", () => {
  let results: Map<string, Diagnostic[]>

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
  let results: Map<string, Diagnostic[]>

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
  let results: Map<string, Diagnostic[]>

  beforeAll(async () => {
    results = await lintFixtures("next")
  })

  it("oxlint の nextjs プラグインのルールがすべて error になる", async () => {
    // nextjs のルールはカテゴリ（correctness）で有効にしているため、
    // 展開後の設定（--print-config）で全ルールが error になっているかを確かめる
    const { stdout: rulesJson } = await execFileAsync(
      oxlintBin,
      ["--rules", "-f", "json"],
      execOptions,
    )
    const nextjsRules = (
      JSON.parse(rulesJson) as { scope: string; value: string }[]
    )
      .filter((rule) => rule.scope === "nextjs")
      .map((rule) => `nextjs/${rule.value}`)
    expect(nextjsRules.length).toBeGreaterThan(0)

    const { stdout: configJson } = await execFileAsync(
      oxlintBin,
      [
        "-c",
        path.join("tests", "fixtures", "next", "oxlint.config.ts"),
        "--print-config",
      ],
      execOptions,
    )
    const { rules } = JSON.parse(configJson) as {
      rules: Record<string, unknown>
    }
    const severities = Object.fromEntries(
      nextjsRules.map((rule) => {
        const value = rules[rule]
        return [rule, Array.isArray(value) ? value[0] : value]
      }),
    )
    expect(severities).toEqual(
      Object.fromEntries(nextjsRules.map((rule) => [rule, "deny"])),
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
  let results: Map<string, Diagnostic[]>

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
