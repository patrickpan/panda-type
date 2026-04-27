module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
  moduleNameMapper: {
    "^#root(.*)$": "<rootDir>/src$1",
    "^framer-motion$": "<rootDir>/src/__mocks__/framer-motion.js",
    "^@react-three/fiber$": "<rootDir>/src/__mocks__/@react-three/fiber.js",
    "^three$": "<rootDir>/src/__mocks__/three.js",
  },
};
