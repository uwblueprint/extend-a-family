module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
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
    "airbnb-typescript",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
  ],
  rules: {
    "prettier/prettier": ["warn", { endOfLine: "auto" }],
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "import/no-unresolved": [2, { devDependencies: true }],
  },
  ignorePatterns: ["build/*", ".eslintrc.js"],
};
