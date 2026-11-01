export const sum = (a: number, b: number): number => a + b

// @ts-expect-error -- types: [] を明示しているため、@types/node のグローバルは自動で読み込まれない
export const env = process.env
