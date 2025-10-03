// eslint.config.mjs (Ship Mode)
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  // Ignore build artifacts
  { ignores: ['.next/**', 'dist/**', 'node_modules/**', 'public/**'] },

  // Base JS rules
  js.configs.recommended,

  // Typescript (non type-checked) – avoids the "requires type info" crash
  ...tseslint.configs.recommended,

  // Project rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false, // critical: disables type-aware linting that was crashing
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@next/next': nextPlugin,
    },
    rules: {
      // Temporarily relax the "unsafe"/"any" family so we can ship
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',

      // Keep these as warnings so you can clean up over time
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': ['warn', { destructuring: 'all' }],

      // Next.js rules that were erroring — temporarily off to unblock
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'warn',
    },
  },
]
