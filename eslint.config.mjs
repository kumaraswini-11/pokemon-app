import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "plugin:@tanstack/query/recommended",
    ],
    rules: {
      // General Best Practices
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "no-duplicate-imports": "error",
    },
  }),
];

export default eslintConfig;
