const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'adequate-admin',
  rootDir: '.',
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  testEnvironment: 'jsdom',
};
