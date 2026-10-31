import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "http://localhost:4321",
    trailingSlash: "ignore",
    prerenderConflictBehavior: "error",

    // Typed and validated environment variables, imported from "astro:env/client" or "astro:env/server".
    // Astro loads .env.[mode] files natively, e.g. `astro build --mode pre` reads .env.pre
    // https://docs.astro.build/en/guides/environment-variables/
    env: {
        schema: {
            // PUBLIC_API_URL: envField.string({ context: "client", access: "public", url: true }),
            // API_SECRET: envField.string({ context: "server", access: "secret" }),
        },
        validateSecrets: true,
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
