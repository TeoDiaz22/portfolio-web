import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
    {
        ignores: ["dist/", ".astro/", "node_modules/"],
    },
    js.configs.recommended,
    tseslint.configs.recommended,
    eslintPluginAstro.configs.recommended,
    eslintPluginAstro.configs["jsx-a11y-recommended"],
    {
        // Project configuration files run in Node, not in the browser
        files: ["*.config.ts"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
    {
        // Application code runs in the browser
        files: ["src/**/*.{ts,astro}"],
        languageOptions: {
            globals: { ...globals.browser },
        },
        rules: {
            // TypeScript already reports undefined variables
            "no-undef": "off",
        },
    },
    // Must stay last to turn off rules that conflict with Prettier
    eslintConfigPrettier
);
