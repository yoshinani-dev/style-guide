import { defineConfig } from "oxlint"

import config from "../../../dist/oxlint/react-library.mjs"

export default defineConfig({ extends: [config] })
