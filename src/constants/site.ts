/**
 * Site-wide identity and SEO defaults. Per-page values live in the content collections (`seo` field).
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Locale data that differs per language. `ogLocale` uses the `language_TERRITORY` format required by Open Graph. */
export const LOCALE_META: Record<Locale, { lang: string; ogLocale: string; name: string; homeLabel: string }> = {
    es: { lang: "es", ogLocale: "es_EC", name: "Español", homeLabel: "Inicio" },
    en: { lang: "en", ogLocale: "en_US", name: "English", homeLabel: "Home" },
};

export const SITE = {
    name: "Mateo Díaz",
    /** `%s` is replaced by the page title. The home page can opt out with `seo.fullTitle`. */
    titleTemplate: "%s · Mateo Díaz",
    themeColor: "#0f172a",
    /** X/Twitter handle including `@`, or undefined to omit `twitter:site` and `twitter:creator`. */
    twitterHandle: undefined as string | undefined,
} as const;

/** Data for the site-wide `Person` node in JSON-LD. */
export const AUTHOR = {
    name: "Mateo Díaz",
    jobTitle: { es: "Desarrollador Fullstack", en: "Fullstack developer" } satisfies Record<Locale, string>,
    /** Profiles that identify the same person (GitHub, LinkedIn…); used for `sameAs` and `rel="me"`. */
    sameAs: ["https://github.com/TeoDiaz22"],
} as const;

/**
 * AI crawlers blocked in robots.txt (production). Empty on purpose: search/answer bots (OAI-SearchBot, ChatGPT-User,
 * Claude-SearchBot, Claude-User, PerplexityBot…) cite the site with links, and training bots (GPTBot, ClaudeBot,
 * Google-Extended, CCBot, Applebot-Extended, Meta-ExternalAgent, Bytespider…) only add public portfolio content to
 * models. Add a user agent here to block it; blocking Google-Extended does not affect Google Search.
 */
export const BLOCKED_CRAWLERS: string[] = [];
