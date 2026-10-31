import type { PrettierConfig } from "@ianvs/prettier-plugin-sort-imports";
import type { PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

const config: PrettierConfig & TailwindPluginOptions = {
    tabWidth: 4,
    useTabs: false,
    printWidth: 120,
    endOfLine: "lf",
    trailingComma: "all",
    arrowParens: "always",
    // The import sorting plugin must come before prettier-plugin-astro, and the Tailwind plugin must be last
    plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
        {
            // Same indentation pnpm uses when it rewrites pnpm-workspace.yaml
            files: "*.{yaml,yml}",
            options: {
                tabWidth: 2,
            },
        },
    ],
    importOrder: [
        "<BUILTIN_MODULES>",
        "<THIRD_PARTY_MODULES>",
        // Path aliases, keep in sync with tsconfig.json "paths"
        "^@(components|layouts|assets|utils|styles|constants|i18n|templates)/",
        "^[./](?!.*\\.css$)",
        // Only applies to bindings (e.g. CSS modules); side-effect imports keep their position
        "\\.css$",
    ],
    importOrderTypeScriptVersion: "6.0.0",
    importOrderParserPlugins: ["typescript"],
    // Tailwind 4 entry point, used to know the project classes and their order
    tailwindStylesheet: "./src/styles/global.css",
};

export default config;
