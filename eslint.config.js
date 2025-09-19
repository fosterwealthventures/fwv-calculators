// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
    },
    rules: {
      // ---- RELAXED RULES ----
      "react/no-unescaped-entities": "off",           // allow apostrophes etc. in JSX
      "@typescript-eslint/no-explicit-any": "off",    // allow "any"
      "@typescript-eslint/explicit-module-boundary-types": "off", // no need to type every fn
      "no-unused-vars": "warn",                       // warn instead of error
      "no-undef": "off",                              // ignore "process not defined" errors
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        process: "readonly",
        module: "readonly",
        __dirname: "readonly",
      },
    },
    ignores: [
      ".next/",
      "node_modules/",
      "dist/",
      "out/",
    ],
  },
];
