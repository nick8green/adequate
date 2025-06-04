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
//         project: './tsconfig.base.json',
//       },
//     },
//     rules: {
//       // Shared rules
//       'no-console': 'warn',
//       'react/react-in-jsx-scope': 'off',
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
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:import/recommended',
    'plugin:playwright/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['simple-import-sort'],
  rules: {
    'no-console': 'warn',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    browser: true,
    node: true,
  },
};
