/* eslint-disable no-undef */
module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "moduleDirectories": ['node_modules', 'src'],
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  },
  "testMatch": [
    "**/tests/**/*.test.ts"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
}