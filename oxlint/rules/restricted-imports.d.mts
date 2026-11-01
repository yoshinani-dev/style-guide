export interface RestrictedImportPath {
  name: string
  message: string
}

export interface RestrictedImportPattern {
  group: string[]
  message: string
}

export declare const restrictedImportPaths: RestrictedImportPath[]
export declare const restrictedImportPatterns: RestrictedImportPattern[]
