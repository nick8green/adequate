const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'adequate-scripts',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  testEnvironment: 'jsdom',
};
