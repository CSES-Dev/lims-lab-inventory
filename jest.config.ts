import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
    moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
};

export default config;
