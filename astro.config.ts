import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

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

    i18n: {
        locales: ["es", "en"],
        defaultLocale: "es",
        routing: {
            prefixDefaultLocale: false,
        },
    },

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
        },
        validateSecrets: true,
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
