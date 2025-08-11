const baseConfig = {
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: './tsconfig.jest.json', useESM: true },
    ],
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@app/(.*)$': '<rootDir>/apps/app/src/$1',
    '^@admin/(.*)$': '<rootDir>/apps/admin/src/$1',
    '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@docs/(.*)$': '<rootDir>/packages/docs/src/$1',
    '^@service/(.*)$': '<rootDir>/apps/service/src/$1',
  },
  reporters: ['default'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
};

module.exports = baseConfig;
