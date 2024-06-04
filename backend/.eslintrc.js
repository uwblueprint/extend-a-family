module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.json",
    sourceType: "module",
    createDefaultProgram: true,
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".native.js"],
      },
    },
  },
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "import/no-unresolved": [2, { devDependencies: true }],
  },
  ignorePatterns: ["build/*"],
};
