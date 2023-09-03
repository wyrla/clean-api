/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

module.exports = config
