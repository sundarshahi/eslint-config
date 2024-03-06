import type { FlatConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export async function ignores(customIgnores: string[] = []): Promise<FlatConfigItem[]> {
  return [
    {
      ignores: [...GLOB_EXCLUDE, ...customIgnores],
    },
  ]
}
