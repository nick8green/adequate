const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'adequate-app',
  rootDir: '../../',
  testMatch: ['<rootDir>/apps/app/**/*.(test|spec).(ts|tsx)'],
  coverageDirectory: '<rootDir>/coverage/app',
  collectCoverageFrom: ['apps/app/src/**/*.{ts,tsx}'],
};
