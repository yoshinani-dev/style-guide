import { defineConfig } from "oxlint"

import config from "../../../dist/oxlint/next.mjs"

export default defineConfig({ extends: [config] })
