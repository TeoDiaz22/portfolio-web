import { getCollection, type CollectionEntry } from "astro:content";
import { LOCALES, type Locale } from "@constants/site.constants.ts";
import { isLocale, localizePath } from "@utils/i18n.utils.ts";

export type PageEntry = CollectionEntry<"pages">;

/** A page in one locale: `src/content/pages/<name>/<locale>.md` published at `path`. */
export interface Page {
    /** Folder name, shared by every translation of the page (`home`, `about`, `404`). */
    name: string;
    locale: Locale;
    /** Public path including the locale prefix: `/`, `/sobre-mi`, `/en`, `/en/about`. */
    path: string;
    entry: PageEntry;
}

/** Path of a page in each locale it exists in, for `hreflang`, the sitemap and the language switcher. */
export type Alternates = Partial<Record<Locale, string>>;

/** `about/es` → `{ name: "about", locale: "es" }`. */
function splitPageId(id: string): { name: string; locale: Locale } {
    const separator = id.lastIndexOf("/");
    const name = id.slice(0, separator);
    const locale = id.slice(separator + 1);
    if (separator === -1 || !isLocale(locale)) {
        throw new Error(`Page "${id}" must be src/content/pages/<page>/<locale>.md, with locale one of ${LOCALES}`);
    }
    return { name, locale };
}

function toPage(entry: PageEntry): Page {
    const { name, locale } = splitPageId(entry.id);
    const slug = name === "home" ? "" : (entry.data.slug ?? name);
    return { name, locale, path: localizePath(`/${slug}`, locale), entry };
}

/** Every page in every locale: home first, then by name, and locales in the order of `LOCALES`. */
export async function getPages(): Promise<Page[]> {
    const pages = (await getCollection("pages")).map(toPage);
    const order = (page: Page) => (page.name === "home" ? "" : page.name);
    return pages.toSorted(
        (a, b) => order(a).localeCompare(order(b)) || LOCALES.indexOf(a.locale) - LOCALES.indexOf(b.locale),
    );
}

/** A page in a locale; fails the build if that translation is missing. */
export async function getPage(name: string, locale: Locale): Promise<Page> {
    const page = (await getPages()).find((candidate) => candidate.name === name && candidate.locale === locale);
    if (!page) throw new Error(`Missing page content: src/content/pages/${name}/${locale}.md`);
    return page;
}

/** Paths of every translation of a page. */
export function getAlternates(pages: Page[], name: string): Alternates {
    return Object.fromEntries(pages.filter((page) => page.name === name).map((page) => [page.locale, page.path]));
}

/** Indexable pages grouped by name, each with its translations (same order as `getPages`). */
export async function getIndexablePages(): Promise<Map<string, Page[]>> {
    const grouped = new Map<string, Page[]>();
    for (const page of await getPages()) {
        if (page.entry.data.seo.noindex) continue;
        grouped.set(page.name, [...(grouped.get(page.name) ?? []), page]);
    }
    return grouped;
}
