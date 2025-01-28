// eslint.config.js
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ["**/*.js"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-unused-vars": ["error"],
      "import/no-unresolved": ["error"], // Ensure this rule is enabled
    },
  },
];
