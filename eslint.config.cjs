const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');

const playwright = require('eslint-plugin-playwright');
const tsParser = require('@typescript-eslint/parser');
const jest = require('eslint-plugin-jest');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  globalIgnores([
    './**/node_modules/*',
    './**/.docusaurus/*',
    './**/.next/*',
    'eslint.config.cjs',
    './**/jest.config.cjs',
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,

      // parserOptions: {
      //     project: "./tsconfig.json",
      // },
    },

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'next',
        'next/core-web-vitals',
        'plugin:import/recommended',
        'plugin:jest/recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
      ),
    ),

    plugins: {
      jest: fixupPluginRules(jest),
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'no-console': 'warn',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'react/react-in-jsx-scope': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'import/no-unresolved': [
        2,
        { ignore: ['^@theme', '^@docusaurus', '^@site'] },
      ],
    },
  },
  {
    files: ['tools/scripts/**/*.ts'],

    languageOptions: {
      parserOptions: {
        project: ['tools/scripts/tsconfig.eslint.json'],
      },
    },
  },
  {
    files: ['**/*.spec.ts'],

    plugins: {
      playwright,
    },

    extends: compat.extends('plugin:playwright/recommended'),
  },
]);
