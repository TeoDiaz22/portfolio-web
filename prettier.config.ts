import type { PrettierConfig } from "@ianvs/prettier-plugin-sort-imports";

const config: PrettierConfig = {
    tabWidth: 4,
    useTabs: false,
    printWidth: 120,
    endOfLine: "lf",
    trailingComma: "es5",
    arrowParens: "avoid",
    // The import sorting plugin must come before prettier-plugin-astro
    plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-astro"],
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
        "^@(components|layouts|assets|utils|styles|constants)/",
        "^[./](?!.*\\.css$)",
        // Only applies to bindings (e.g. CSS modules); side-effect imports keep their position
        "\\.css$",
    ],
    importOrderTypeScriptVersion: "6.0.0",
    importOrderParserPlugins: ["typescript"],
};

export default config;
