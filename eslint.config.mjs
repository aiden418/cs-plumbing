import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // CommonJS scripts are preloaded with `node --require` (see start:capture),
  // so require() is the only way they can import. Everywhere else it stays an error.
  {
    files: ["scripts/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local Claude Code worktree checkouts (git-excluded); not part of the site.
    ".claude/**",
    // Local redesign review artifacts and helper scripts (git-ignored).
    ".redesign/**",
  ]),
]);

export default eslintConfig;
