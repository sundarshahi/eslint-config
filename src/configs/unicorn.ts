import type { FlatConfigItem } from '../types'
import { pluginUnicorn } from '../plugins'

export async function unicorn(): Promise<FlatConfigItem[]> {
  return [
    {
      name: 'antfu:unicorn',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs.recommended.rules,

        'unicorn/better-regex': 'off',
        'unicorn/consistent-destructuring': 'off',
        'unicorn/consistent-function-scoping': ['error', { checkArrowFunctions: false }],
        // Pass error message when throwing errors
        'unicorn/error-message': 'error',
        // Uppercase regex escapes
        'unicorn/escape-case': 'error',
        'unicorn/explicit-length-check': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/new-for-builtins': 'off',
        'unicorn/no-abusive-eslint-disable': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/no-hex-escape': 'off',
        // Array.isArray instead of instanceof
        'unicorn/no-instanceof-array': 'error',
        'unicorn/no-lonely-if': 'off',
        'unicorn/no-nested-ternary': 'off',
        // Ban `new Array` as `Array` constructor's params are ambiguous
        'unicorn/no-new-array': 'error',
        // Prevent deprecated `new Buffer()`
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-null': 'off',
        'unicorn/no-useless-spread': 'off',
        'unicorn/no-useless-undefined': 'off',
        // Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
        'unicorn/number-literal-case': 'error',
        'unicorn/numeric-separators-style': 'off',
        // textContent instead of innerText
        'unicorn/prefer-dom-node-text-content': 'error',
        // includes over indexOf when checking for existence
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-module': 'off',
        // Prefer using the node: protocol
        'unicorn/prefer-node-protocol': 'error',
        // Prefer using number properties like `Number.isNaN` rather than `isNaN`
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-regexp-test': 'off',
        'unicorn/prefer-spread': 'off',
        // String methods startsWith/endsWith instead of more complicated stuff
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-ternary': 'off',
        'unicorn/prefer-top-level-await': 'off',
        // Enforce throwing type error when throwing error while checking typeof
        'unicorn/prefer-type-error': 'error',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/text-encoding-identifier-case': 'off',
        // Use new when throwing error
        'unicorn/throw-new-error': 'error',
      },
    },
  ]
}
