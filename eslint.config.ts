// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import defineConfig from './src'

export default defineConfig(
  {
    formatters: true,
    ignores: ['fixtures', '_fixtures'],
    typescript: true,
    vue: true,
  },
  {
    files: ['src/**/*.ts', 'eslint.config.js'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  // Disable some sundarshahi custom rules just to keep as few conflicts as possible with upstream
  {
    files: ['{src,test}/**/*.ts'],
    rules: {
      'import/order': 'off',
      'style/linebreak-style': 'off',
      'style/arrow-parens': 'off',
      'unicorn/catch-error-name': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-useless-spread': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-optional-catch-binding': 'off',
      'unicorn/prefer-string-replace-all': 'off',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
)
