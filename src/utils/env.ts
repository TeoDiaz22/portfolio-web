import { SITE_ENV } from "astro:env/server";

/** Only production is indexable. Staging (and any build without `SITE_ENV`) renders `noindex` everywhere. */
export const isIndexable = SITE_ENV === "production";
