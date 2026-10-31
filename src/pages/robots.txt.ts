import type { APIRoute } from "astro";
import { BLOCKED_CRAWLERS } from "@constants/site.ts";
import { isIndexable } from "@utils/env.ts";
import { absoluteUrl } from "@utils/url.ts";

/** Production allows everything but `BLOCKED_CRAWLERS` and links the sitemap; staging blocks every crawler. */
export const GET: APIRoute = ({ site }) => {
    const rules = isIndexable
        ? [
              "User-agent: *",
              "Allow: /",
              ...BLOCKED_CRAWLERS.flatMap((agent) => ["", `User-agent: ${agent}`, "Disallow: /"]),
              "",
              `Sitemap: ${absoluteUrl("/sitemap.xml", site)}`,
          ]
        : ["# Staging: not for indexing", "User-agent: *", "Disallow: /"];

    return new Response(`${rules.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
