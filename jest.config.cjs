const path = require('path');

module.exports = {
  displayName: 'adequate',
  projects: [
    '<rootDir>/apps/app',
    '<rootDir>/apps/admin',
    '<rootDir>/apps/service',
    '<rootDir>/packages/shared',
    '<rootDir>/packages/docs',
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
};
