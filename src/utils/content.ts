import { getEntry } from "astro:content";
import type { Locale } from "@constants/site.ts";

/** Entry of the `pages` collection for a locale; fails the build if the translation is missing. */
export async function getPage(name: string, locale: Locale) {
    const id = `${locale}/${name}`;
    const entry = await getEntry("pages", id);
    if (!entry) throw new Error(`Missing page content: src/content/pages/${id}.md`);
    return entry;
}
