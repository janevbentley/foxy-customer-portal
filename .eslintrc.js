module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@stencil/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  settings: {
    react: {
      version: "latest"
    }
  },
  rules: {
    "react/jsx-no-bind": "off",
    "@stencil/decorators-style": "off"
  }
};
