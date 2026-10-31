import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import { DEFAULT_LOCALE, LOCALES } from "./src/constants/site.constants.ts";

/**
 * Astro loads `.env.[mode]` only after reading this file, so `site` cannot come from `astro:env`.
 * This mirrors Vite's lookup order (`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`, then the real
 * environment) so `astro build --mode pre` resolves the same values here and in the app.
 */
function loadModeEnv(): Record<string, string | undefined> {
    const args = process.argv;
    const modeFlag = args.findIndex((arg) => arg === "--mode" || arg.startsWith("--mode="));
    const mode =
        modeFlag === -1
            ? args.includes("dev")
                ? "development"
                : "production"
            : (args[modeFlag]?.split("=")[1] ?? args[modeFlag + 1]);

    const files = [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`];
    const fromFiles = files.filter((file) => existsSync(file)).map((file) => parseEnv(readFileSync(file, "utf8")));

    return Object.assign({}, ...fromFiles, process.env);
}

const env = loadModeEnv();

// https://astro.build/config
export default defineConfig({
    // Placeholder until the production domain is defined; each environment overrides it with SITE_URL
    site: env.SITE_URL ?? "https://example.com",
    // One canonical URL per page: /about, never /about/. Pages are emitted as about.html
    trailingSlash: "never",
    build: {
        format: "file",
    },
    prerenderConflictBehavior: "error",
    // Internal links are fetched on hover/focus, so the next page is usually cached before the click
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "hover",
    },

    i18n: {
        locales: [...LOCALES],
        defaultLocale: DEFAULT_LOCALE,
        routing: {
            prefixDefaultLocale: false,
        },
    },

    // Design system fonts, downloaded at build time and self-hosted; Tailwind's font-sans/display/mono read these
    // variables (src/styles/theme.css). Weight never exceeds 500 in the design system
    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: "Archivo",
            cssVariable: "--font-archivo",
            weights: [400, 500],
            styles: ["normal", "italic"],
            fallbacks: ["sans-serif"],
        },
        {
            provider: fontProviders.fontsource(),
            name: "JetBrains Mono",
            cssVariable: "--font-jetbrains-mono",
            weights: [400, 500],
            styles: ["normal"],
            fallbacks: ["monospace"],
        },
    ],

    // Typed and validated environment variables, imported from "astro:env/client" or "astro:env/server".
    // Astro loads .env.[mode] files natively, e.g. `astro build --mode pre` reads .env.pre
    // https://docs.astro.build/en/guides/environment-variables/
    env: {
        schema: {
            // Only an explicit "production" allows indexing; a missing value fails closed
            SITE_ENV: envField.enum({
                values: ["production", "staging"],
                context: "server",
                access: "public",
                default: "staging",
            }),
            GOOGLE_SITE_VERIFICATION: envField.string({ context: "server", access: "public", optional: true }),
            BING_SITE_VERIFICATION: envField.string({ context: "server", access: "public", optional: true }),
            // Public by design: IndexNow verifies ownership by fetching /<key>.txt from the site
            INDEXNOW_KEY: envField.string({ context: "server", access: "public", optional: true, min: 8 }),
        },
        validateSecrets: true,
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
