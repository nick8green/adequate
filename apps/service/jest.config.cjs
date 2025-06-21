const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'adequate-service',
  rootDir: '../../',
  testMatch: ['<rootDir>/apps/service/**/*.(test|spec).(ts|tsx)'],
  coverageDirectory: '<rootDir>/coverage/service',
  collectCoverageFrom: ['apps/service/src/**/*.{ts,tsx}'],
};
