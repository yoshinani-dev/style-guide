export const sum = (a: number, b: number): number => a + b

// next は types に vitest/importMeta を指定しているため、base の types: [] は上書きされる
export const isTest = import.meta.vitest !== undefined
