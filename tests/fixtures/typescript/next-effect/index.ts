import { Effect, Schema } from "effect"

export const program = Effect.succeed(1)

const User = Schema.Struct({ name: Schema.optionalKey(Schema.String) })

// @ts-expect-error -- exactOptionalPropertyTypes により、省略可能なキーに undefined は代入できない
export const user: typeof User.Type = { name: undefined }
