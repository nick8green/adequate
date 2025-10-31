const base = require('../../jest.config.base.cjs');
const path = require('path');

const pkg = path.basename(__dirname);

module.exports = {
  ...base,
  displayName: `adequate-${pkg}`,
  rootDir: '../../',
  testMatch: [`<rootDir>/packages/${pkg}/**/*.(test|spec).ts`],
  collectCoverageFrom: [`packages/${pkg}/src/**/*.{ts}`],
};
