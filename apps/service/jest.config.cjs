const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'adequate-service',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  testEnvironment: 'node',
};
