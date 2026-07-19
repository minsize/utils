import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: "node",
  verbose: true,
  roots: [
    "./__tests__"
  ],
  collectCoverageFrom: ["src/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 98,
      lines: 97,
      statements: 96,
    },
  },
};

export default config;
