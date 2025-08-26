const base = require('../../jest.config.base.cjs');
const path = require('path');

const pkg = path.basename(__dirname);

module.exports = {
  ...base,
  displayName: `adequate-${pkg}`,
  rootDir: '../../',
  testMatch: [`<rootDir>/packages/${pkg}/**/*.(test|spec).(ts|tsx)`],
  collectCoverageFrom: [`packages/${pkg}/src/**/*.{ts,tsx}`],
  transformIgnorePatterns: [
    'node_modules/(?!uncrypto|@upstash/redis|@upstash/ratelimit)',
  ],
};
