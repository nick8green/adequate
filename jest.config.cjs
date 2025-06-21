const { displayName } = require('./apps/admin/jest.config.cjs');

module.exports = {
  displayName: 'adequate',
  projects: [
    '<rootDir>/apps/app',
    '<rootDir>/apps/admin',
    '<rootDir>/apps/service',
    '<rootDir>/packages/shared',
    '<rootDir>/packages/docs',
  ],
};
