import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".next_trash/**",
    ".next_trash3/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/frankenmermaid/**",
  ]),
]);

export default eslintConfig;
