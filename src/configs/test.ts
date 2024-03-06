import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsFiles, OptionsIsInEditor, OptionsOverrides, OptionsTestFrameworks } from '../types'
import { GLOB_SRC_EXT, GLOB_TESTS } from '../globs'
import { isPackageExists } from 'local-pkg'

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides & OptionsTestFrameworks = {},
): Promise<FlatConfigItem[]> {
  const {
    cypress = isPackageExists('cypress'),
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
    vitest = isPackageExists('vitest'),
  } = options

  await ensurePackages([
    cypress ? 'eslint-plugin-cypress' : '',
    vitest ? 'eslint-plugin-vitest' : '',
  ])

  const [
    pluginVitest,
    pluginNoOnlyTests,
    pluginCypress,
  ] = await Promise.all([
    vitest ? interopDefault(import('eslint-plugin-vitest')) : undefined,
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-no-only-tests')),
    // @ts-expect-error missing types
    cypress ? interopDefault(import('eslint-plugin-cypress')) : undefined,
  ] as const)

  return [
    {
      name: 'antfu:test:setup',
      plugins: {
        test: {
          ...pluginVitest,
          ...pluginCypress,
          rules: {
            ...pluginVitest && pluginVitest.rules,
            // extend `test/no-only-tests` rule
            ...pluginNoOnlyTests.rules,
            ...pluginCypress && pluginCypress.configs.recommended.rules,
          },
        },
      },
    },
    {
      files,
      name: 'antfu:test:rules',
      rules: {
        'node/prefer-global/process': 'off',

        'test/no-only-tests': isInEditor ? 'off' : 'error',

        ...vitest && {
          'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
          'test/no-identical-title': 'error',
          'test/no-import-node-test': 'error',
          'test/prefer-hooks-in-order': 'error',
          'test/prefer-lowercase-title': 'error',
        },

        'ts/no-unsafe-assignment': 'off',
        'ts/no-unsafe-member-access': 'off',
        'ts/unbound-method': 'off',

        ...overrides,
      },
    },
    cypress
      ? {
          files: [`**/cypress/support/**/*.${GLOB_SRC_EXT}`],
          rules: {
            'ts/no-namespace': 'off',
          },
        }
      : {},
  ]
}
