// [インポートを制限](https://www.notion.so/yoshinani-note/1dff5577f58381a7bd81ef0805696e2b)
//
// oxlint のルールオプションはマージされず置き換わるため、利用者が禁止ライブラリを
// 追加するときは、この配列を展開してから追加する。

const VALIDATION_MESSAGE = "Effect Schema または valibot を使用してください。"

export interface RestrictedImportPath {
  name: string
  message: string
}

export interface RestrictedImportPattern {
  group: string[]
  message: string
}

export const restrictedImportPaths: RestrictedImportPath[] = [
  {
    name: "@material-tailwind/react",
    message: "shadcn/uiを使用してください。",
  },
  {
    name: "ajv",
    message: VALIDATION_MESSAGE,
  },
  {
    name: "axios",
    message: "Web標準のfetchを使用してください。",
  },
  {
    name: "class-validator",
    message: VALIDATION_MESSAGE,
  },
  {
    name: "daisyui",
    message: "shadcn/uiを使用してください。",
  },
  {
    name: "dayjs",
    message: "date-fnsを使用してください。",
  },
  {
    name: "express",
    message: "Next.jsのRoute HandlersまたはHonoを使用してください。",
  },
  {
    name: "formik",
    message: "react-hook-formを使用してください。",
  },
  {
    name: "jest",
    message: "vitestを使用してください。",
  },
  {
    name: "joi",
    message: VALIDATION_MESSAGE,
  },
  {
    name: "lodash",
    message: "remedaを使用してください。",
  },
  {
    name: "moment",
    message: "date-fnsを使用してください。",
  },
  {
    name: "react-charts",
    message: "rechartsを使用してください。",
  },
  {
    name: "react-final-form",
    message: "react-hook-formを使用してください。",
  },
  {
    name: "recoil",
    message: "zustandまたはjotaiを使用してください。",
  },
  {
    name: "redux",
    message: "zustandまたはjotaiを使用してください。",
  },
  {
    name: "superstruct", // cspell: disable-line
    message: VALIDATION_MESSAGE,
  },
  {
    name: "typeorm",
    message: "PrismaまたはDrizzle ORMを使用してください。",
  },
  {
    name: "yup",
    message: VALIDATION_MESSAGE,
  },
  {
    name: "zod",
    message: VALIDATION_MESSAGE,
  },
  {
    name: "tsup",
    message: "tsdownを使用してください。",
  },
]

export const restrictedImportPatterns: RestrictedImportPattern[] = [
  {
    group: ["@emotion/*"],
    message: "Tailwind CSSを使用してください。",
  },
  {
    group: ["@mui/*"],
    message: "shadcn/uiを使用してください。",
  },
  {
    group: ["@nestjs/*"],
    message: "Next.jsのRoute HandlersまたはHonoを使用してください。",
  },
  {
    group: ["lodash/*"],
    message: "remedaを使用してください。",
  },
]
