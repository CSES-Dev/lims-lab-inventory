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
    "services/listings/listings.ts", // Include the service file for listings
    "app/api/listings/**/*.ts", // Include all route files for the listings API
    "lib/**/mongoose.ts", // include the mongoose test given
    "!app/api/listings/**/__tests__/**/*.ts", // Exclude test files in the listings API
    "!services/listings/**/__tests__/**/*.ts", // Exclude test files in the listings service
    "!**/*.d.ts", // Exclude type declaration files
    "!**/node_modules/**", // Exclude node_modules
    "!**/.next/**", // Exclude Next.js build files
    "!**/coverage/**", // Exclude coverage files
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
