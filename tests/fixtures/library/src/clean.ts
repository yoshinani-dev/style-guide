import { readFileSync } from "node:fs"

export const read = (path: string) => readFileSync(path, "utf8")
