// eslint.config.mjs (Strict mode)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const withProject = (configs) =>
  configs.map((config) => ({
    ...config,
    languageOptions: {
      ...(config.languageOptions ?? {}),
      parserOptions: {
        ...(config.languageOptions?.parserOptions ?? {}),
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
  }));

export default [
  { ignores: [".next/**", "dist/**", "node_modules/**", "public/**"] },

  js.configs.recommended,

  ...withProject(tseslint.configs.strictTypeChecked),
  ...withProject(tseslint.configs.stylisticTypeChecked),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { react: reactPlugin, "react-hooks": reactHooks, "@next/next": nextPlugin },
    settings: { react: { version: "detect" } },
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
    },
  },

  {
    files: [
      "**/*.config.{js,cjs,mjs,ts}",
      "next.config.*",
      "postcss.config.*",
      "scripts/**/*.{js,ts}",
    ],
    languageOptions: {
      globals: { ...globals.node, ...globals.commonjs },
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@next/next": nextPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "prefer-const": ["warn", { destructuring: "all" }],
    },
  },
];
