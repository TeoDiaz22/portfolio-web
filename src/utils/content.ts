import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { LOCALES, type Locale } from "@constants/site.ts";
import { localizePath } from "@utils/i18n.ts";

export type PageEntry = CollectionEntry<"pages">;

/**
 * Pages collection entries are named after their route: `<locale>/<route>.md`, with `home` for `/`.
 * E.g. `en/about.md` → `/en/about`, `es/projects/foo.md` → `/projects/foo`.
 */
export function splitPageId(id: string): { locale: Locale; name: string } {
    const [locale, ...name] = id.split("/");
    if (!LOCALES.includes(locale as Locale)) throw new Error(`Page "${id}" must live in a locale folder`);
    return { locale: locale as Locale, name: name.join("/") };
}

/** Public path of a page in a locale, from its name: `home` → `/`, `about` → `/about` (or `/en/about`). */
export function pagePath(name: string, locale: Locale): string {
    return localizePath(name === "home" ? "/" : `/${name}`, locale);
}

/** Entry of the `pages` collection for a locale; fails the build if the translation is missing. */
export async function getPage(name: string, locale: Locale): Promise<PageEntry> {
    const id = `${locale}/${name}`;
    const entry = await getEntry("pages", id);
    if (!entry) throw new Error(`Missing page content: src/content/pages/${id}.md`);
    return entry;
}

/** Every indexable page, grouped by name, with the locales it exists in. Default locale first. */
export async function getIndexablePages(): Promise<Map<string, Map<Locale, PageEntry>>> {
    const entries = await getCollection("pages", ({ data }) => !data.seo.noindex);
    const pages = new Map<string, Map<Locale, PageEntry>>();
    // Home first, then alphabetical; within a page, locales in the order of LOCALES (default first)
    const sortKey = (id: string) => {
        const { locale, name } = splitPageId(id);
        return { name: name === "home" ? "" : name, locale: LOCALES.indexOf(locale) };
    };
    const sorted = entries.toSorted((a, b) => {
        const left = sortKey(a.id);
        const right = sortKey(b.id);
        return left.name.localeCompare(right.name) || left.locale - right.locale;
    });
    for (const entry of sorted) {
        const { locale, name } = splitPageId(entry.id);
        const translations = pages.get(name) ?? new Map();
        translations.set(locale, entry);
        pages.set(name, translations);
    }
    return pages;
}
