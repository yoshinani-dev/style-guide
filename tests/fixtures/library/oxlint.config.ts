import { defineConfig } from "oxlint"

import config from "../../../dist/oxlint/library.mjs"

export default defineConfig({ extends: [config] })
