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
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prettier/prettier": ["warn", { endOfLine: "auto" }],
    "import/prefer-default-export": "off",
  },
  ignorePatterns: ["build/*", ".eslintrc.js"],
};
