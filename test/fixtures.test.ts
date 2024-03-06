import { join, resolve } from 'node:path'
import { afterAll, beforeAll, it } from 'vitest'
import fs from 'fs-extra'
import { execa } from 'execa'
import fg from 'fast-glob'
import type { FlatConfigItem, OptionsConfig } from '../src/types'

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true })
})
afterAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true })
})

runWithConfig('js', {
  typescript: false,
  vue: false,
  react: false,
})
runWithConfig('all', {
  typescript: true,
  vue: true,
  toml: true,
  react: true,
  overrides: {
    react: {
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
})
runWithConfig('no-style', {
  typescript: true,
  vue: true,
  react: true,
  stylistic: false,
  toml: true,
  overrides: {
    react: {
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
})
runWithConfig(
  'tab-double-quotes',
  {
    typescript: true,
    vue: true,
    react: true,
    stylistic: {
      indent: 'tab',
      quotes: 'double',
    },
    toml: true,
    overrides: {
      react: {
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
        'react/no-unknown-property': 'off',
        'react-refresh/only-export-components': 'off',
      },
    },
  },
  {
    rules: {
      'style/no-mixed-spaces-and-tabs': 'off',
    },
  },
)

// https://github.com/antfu/eslint-config/issues/255
runWithConfig(
  'ts-override',
  {
    typescript: true,
    vue: true,
    react: true,
    overrides: {
      react: {
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
        'react/no-unknown-property': 'off',
        'react-refresh/only-export-components': 'off',
      },
    },
  },
  {
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
)

runWithConfig('with-formatters', {
  typescript: true,
  vue: true,
  react: true,
  formatters: true,
  toml: true,
  overrides: {
    react: {
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
})

runWithConfig('no-markdown-with-formatters', {
  jsx: false,
  vue: false,
  react: false,
  markdown: false,
  formatters: {
    markdown: true,
  },
})

function runWithConfig(
  name: string,
  configs: OptionsConfig,
  ...items: FlatConfigItem[]
) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const from = resolve('fixtures/input')
      const output = resolve('fixtures/output', name)
      const target = resolve('_fixtures', name)

      await fs.copy(from, target, {
        filter: (src) => {
          return !src.includes('node_modules')
        },
      })
      await fs.writeFile(
        join(target, 'eslint.config.js'),
        `
// @eslint-disable
import defineConfig from '@sundarshahi/eslint-config'

export default defineConfig(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `,
      )

      await execa('npx', ['eslint', '.', '--fix'], {
        cwd: target,
        stdio: 'pipe',
      })

      const files = await fg('**/*', {
        ignore: ['node_modules', 'eslint.config.js'],
        cwd: target,
      })

      await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(join(target, file), 'utf-8')
          const source = await fs.readFile(join(from, file), 'utf-8')
          const outputPath = join(output, file)
          if (content === source) {
            if (fs.existsSync(outputPath))
              fs.remove(outputPath)
            return
          }
          await expect.soft(content).toMatchFileSnapshot(join(output, file))
        }),
      )
    },
    30_000,
  )
}
