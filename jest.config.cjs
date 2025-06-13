const base = require('./jest.config.base.cjs');

module.exports = {
  ...base,
  projects: ['<rootDir>/apps/*', '<rootDir>/packages/*', '<rootDir>/tools/*'],
};
