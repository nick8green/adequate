const base = require('../../jest.config.base.cjs');
const path = require('path');

const directory = path.basename(__dirname);

module.exports = {
  ...base,
  displayName: `adequate-${directory}`,
  rootDir: '../../',
  testMatch: [`<rootDir>/apps/${directory}/**/*.(test|spec).(ts|tsx)`],
  collectCoverageFrom: [`apps/${directory}/src/**/*.{ts,tsx}`],
};
