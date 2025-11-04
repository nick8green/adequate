const baseConfig = {
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/apps/app/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@admin/(.*)$': '<rootDir>/apps/admin/src/$1',
    '^@content/(.*)$': '<rootDir>/apps/content/src/$1',
    '^@repository/(.*)$': '<rootDir>/packages/repository/src/$1',
    '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@docs/(.*)$': '<rootDir>/packages/docs/src/$1',
  },
  reporters: ['default'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: './tsconfig.jest.json', useESM: true },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|rehype-.*|remark-.*)/)',
  ],
};

module.exports = baseConfig;
