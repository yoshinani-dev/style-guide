import { Effect } from "effect"

export const main = () => {
  Effect.runPromise(Effect.succeed(1))
}
