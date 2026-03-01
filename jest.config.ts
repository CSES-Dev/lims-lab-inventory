import type { Config } from "jest";
import path from "path";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],

  // Test file patterns
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/__tests__/**/*.spec.ts",
    "**/.test.ts",
    "**/.spec.ts",
  ],

  // Module path mapping (for @/ imports)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Coverage settings
  collectCoverageFrom: [
    "app/*/.ts",
    "app/*/.tsx",
    "app/api/listings/route.ts",
    "app/api/listings/[id]/route.ts",
    "services/*/.ts",
    "services/listings/listings.ts",
    "models/*/.ts",
    // "lib/**/*.ts", // Include all TypeScript files in the lib directory
    // "!lib/**/*.d.ts", // Exclude type declaration files
    // "!lib/__tests__/**/*.ts", // Exclude test files
    "lib/*/.ts",
    "!*/.d.ts",
    "!*/node_modules/*",
    "!*/.next/*",
    "!*/coverage/*",
  ],

  coveragePathIgnorePatterns: ["/node_modules/", "/.next/", "/coverage/"],

  // Transform files
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
          esModuleInterop: true,
        },
      },
    ],
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Test timeout (important for DB tests)
  testTimeout: 10000,

  // Verbose output
  verbose: true,
};

export default config;
