// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
    },
    // TypeScript and Vue are auto-detected, you can also explicitly enable them:
    typescript: true,
    vue: true,

    // Disable jsonc and yaml support
    jsonc: false,
    yaml: false,

    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
      '**/fixtures',
      // ...globs
    ],
  },
  {
    rules: {
      'ts/no-use-before-define': 'off',
      'ts/no-unused-expressions': 'off',
      'prefer-promise-reject-errors': 'off',
      'vue/no-unused-refs': 'off',

      // 强制要求顶级作用域中的函数为命名函数
      // '@antfu/top-level-function/top-level-function': 'error',
    },
  },
)
