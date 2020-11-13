module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // 'plugin:react/recommended',
    // 'airbnb',
    "universe/native",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/jsx-boolean-value": [1, "always"],
    "no-throw-literal": 0,
  },
};
