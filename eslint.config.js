import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['dist', 'site', 'coverage', 'node_modules']),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true },
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message: 'innerHTML запрещён заданием',
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: 'insertAdjacentHTML запрещён заданием',
        },
      ],
    },
  },
  {
    files: ['src/core/**/*.ts', 'src/state/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['**/ui/**', '**/storage/**'] }],
      'no-restricted-globals': ['error', 'document', 'window', 'localStorage'],
    },
  },
  {
    files: ['*.config.js', '*.config.ts', 'scripts/**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: { parserOptions: { projectService: false } },
  },
  prettier,
);
