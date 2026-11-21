import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  moduleNameMapper: {
    // Components import plain CSS for side effects; Jest cannot parse it.
    "\\.(css|less|sass|scss)$": "<rootDir>/src/__mocks__/styleMock.ts",
  },
};

export default config;
