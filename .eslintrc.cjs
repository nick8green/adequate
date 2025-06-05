// eslint.config.js
// import js from '@eslint/js';
// import next from 'eslint-config-next';

// export default [
//   js.configs.recommended,
//   ...next(),
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//     languageOptions: {
//       parser: '@typescript-eslint/parser',
//       parserOptions: {
//         sourceType: 'module',
//         ecmaVersion: 'latest',
//       },
//     },
//     ignores: [
//       '**/node_modules/**',
//       '**/dist/**',
//       '**/build/**',
//       '**/.next/**',
//       '**/.turbo/**',
//       '**/coverage/**',
//       '**/out/**',
//     ],
//   },
// ];

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'next',
    'next/core-web-vitals',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['tools/scripts/**/*.ts'],
      parserOptions: {
        project: ['tools/scripts/tsconfig.eslint.json'],
      },
    },
    {
      files: ['**/*.spec.ts'],
      plugins: ['playwright'],
      extends: ['plugin:playwright/recommended'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['jest', 'simple-import-sort'],
  root: true,
  rules: {
    'no-console': 'warn',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',

    'react/react-in-jsx-scope': 'off',

    '@next/next/no-html-link-for-pages': 'off',
  },
};
