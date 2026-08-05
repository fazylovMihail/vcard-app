import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.config.js", "**/coverage/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: [
          "./client/tsconfig.json",
          "./server/tsconfig.json",
          "./shared/tsconfig.json",
        ],
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
