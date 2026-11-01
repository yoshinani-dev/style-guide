import { defineConfig } from "oxlint"

import config from "../../../dist/oxlint/library-effect.mjs"

export default defineConfig({ extends: [config] })
