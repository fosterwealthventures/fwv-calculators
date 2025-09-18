import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", ".next", "dist"],
  },
  {
    plugins: {
      next: nextPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      "prettier/prettier": "error",
      "react/jsx-key": "off",
      "react/react-in-jsx-scope": "off"
    },
  },
];
