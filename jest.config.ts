import type { Config } from "jest";

const config: Config = {
  verbose: true,
  collectCoverageFrom: ["client/**/*.{ts,tsx}", "server/**/*.ts", "!**/node_modules/**"],

  projects: [
    {
      displayName: "server",
      testEnvironment: "node",
      testMatch: ["<rootDir>/server/**/*.test.ts", "<rootDir>/server/**/*.spec.ts"],
      transform: {
        "^.+\\.ts$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/server/tsconfig.json",
          },
        ],
      },
      moduleNameMapper: {
        "^@server/(.*)$": "<rootDir>/server/src/$1",
        "^@shared/(.*)$": "<rootDir>/shared/src/$1",
        "^@/(.*)$": "<rootDir>/server/src/$1",
      },
    },
    {
      displayName: "client",
      testEnvironment: "jsdom",
      testMatch: [
        "<rootDir>/client/**/*.test.{ts,tsx}",
        "<rootDir>/client/**/*.spec.{ts,tsx}",
      ],
      transform: {
        "^.+\\.(ts|tsx)$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/client/tsconfig.json",
          },
        ],
      },
      moduleNameMapper: {
        "^@shared/(.*)$": "<rootDir>/shared/src/$1",
        "^@/(.*)$": "<rootDir>/client/src/$1",
      },
    },
  ],
};

export default config;
