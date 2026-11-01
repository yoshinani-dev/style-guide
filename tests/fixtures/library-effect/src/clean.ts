import { Effect } from "effect"

export const program = Effect.gen(function* () {
  yield* Effect.log("hello")
  return 1
})

export const main = () => Effect.runPromise(program)
