import path from "node:path";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: path.resolve(),
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/pages/**",
      "src/components/**",
      "src/hooks/**",
      "src/lib/**",
      "src/types/**",
    ],
  },
];

export default config;
