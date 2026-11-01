// @ts-check

/**
 * 共有 tsconfig を、PATH 上の tsc で検証する。
 * fixture には `@ts-expect-error` を置き、設定が効いていること（types: [] や
 * exactOptionalPropertyTypes）も確かめる。
 *
 * - `pnpm test:tsconfig`: devDependencies の TypeScript で検証する
 * - `pnpm --package=typescript@7 dlx node tests/tsconfig.mjs`: 指定したバージョンで検証する
 */

import { execFileSync } from "node:child_process"
import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "typescript",
)

const version = execFileSync("tsc", ["--version"], { encoding: "utf8" }).trim()
console.log(`TypeScript: ${version}`)

let failed = false
for (const variant of readdirSync(fixtures)) {
  try {
    execFileSync("tsc", ["-p", path.join(fixtures, variant)], {
      stdio: "inherit",
    })
    console.log(`ok   ${variant}`)
  } catch {
    console.error(`fail ${variant}`)
    failed = true
  }
}

if (failed) process.exit(1)
