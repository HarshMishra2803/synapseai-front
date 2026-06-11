import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Context + toast files export both components and hooks/functions intentionally
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // fetchItems wraps all setX calls in try/finally — it's an async data-fetching
      // effect, not a synchronous setState. The rule is overly strict here.
      'react-hooks/set-state-in-effect': 'off',
      // Allow empty catch blocks where error is intentionally ignored
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
])
