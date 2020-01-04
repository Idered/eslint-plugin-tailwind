/**
 * @fileoverview ESLint rules for TailwindCSS
 * @author Kasper Mikiewicz
 */
'use strict'

module.exports = {
  rules: {
    'class-order': require('./rules/class-order'),
  },
  configs: {
    recommended: {
      plugins: ['tailwind'],
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      // TODO: Add overrides for vue
      // TODO: Add overrides for svelte
      // TODO: Add overrides for angular
      overrides: [
        {
          files: ['**/*.html'],
          parser: 'eslint-html-parser',
        },
      ],
      rules: {
        'tailwind/class-order': 1,
      },
    },
  },
}
