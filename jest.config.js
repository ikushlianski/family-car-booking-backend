/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  // todo separate into projects for e2e and unit testing
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  },
  moduleDirectories: ["node_modules", "."],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: [
    "**/*.feature.steps.ts"
  ],
  testTimeout: 10000
};
