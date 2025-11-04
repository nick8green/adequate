const path = require('path');

module.exports = {
  displayName: 'adequate',
  projects: [
    '<rootDir>/apps/app',
    '<rootDir>/apps/admin',
    '<rootDir>/apps/content',
    '<rootDir>/apps/gateway',
    '<rootDir>/packages/docs',
    '<rootDir>/packages/repository',
    '<rootDir>/packages/shared',
  ],
  reporters: [
    'default',
    'summary',
    ['github-actions', { silent: false }],
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: path.resolve(__dirname, 'coverage/junit'),
        outputName: 'junit.xml',
        uniqueOutputName: false,
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
  watchPathIgnorePatterns: [
    '**/node_modules/',
    '**/dist/',
    '**/coverage/',
    '**/.next/',
  ],
};
