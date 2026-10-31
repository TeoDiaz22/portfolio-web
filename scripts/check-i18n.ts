/**
 * Checks that the content is complete in every locale (interface dictionaries are covered by the type check):
 * - every page folder in src/content/pages has exactly one `<locale>.md` per locale in LOCALES;
 * - no two pages share a URL in the same locale;
 * - internal links in Markdown point to an existing page in the same locale (`/sobre-mi` in an `en.md` is an error).
 * Run with `pnpm i18n:check` (part of `pnpm check`).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "../src/constants/site.constants.ts";

const PAGES_DIR = "src/content/pages";

interface PageFile {
    name: string;
    locale: Locale;
    file: string;
    path: string;
    body: string;
}

const errors: string[] = [];

/** Same rule as `localizePath` in src/utils/i18n.utils.ts. */
const localizePath = (slug: string, locale: Locale) => {
    const path = `/${slug}`.replace(/\/+$/, "") || "/";
    if (locale === DEFAULT_LOCALE) return path;
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

function pageFolders(dir: string): string[] {
    const entries = readdirSync(dir).map((entry) => join(dir, entry));
    const hasPages = entries.some((entry) => entry.endsWith(".md"));
    const subfolders = entries.filter((entry) => statSync(entry).isDirectory()).flatMap(pageFolders);
    return hasPages ? [dir, ...subfolders] : subfolders;
}

const pages: PageFile[] = [];

for (const folder of pageFolders(PAGES_DIR)) {
    const name = relative(PAGES_DIR, folder).replaceAll("\\", "/");
    const files = readdirSync(folder).filter((file) => file.endsWith(".md"));

    for (const locale of LOCALES) {
        if (!files.includes(`${locale}.md`)) errors.push(`${folder}: missing translation ${locale}.md`);
    }
    for (const file of files) {
        const locale = file.replace(/\.md$/, "");
        if (!LOCALES.includes(locale as Locale)) {
            errors.push(`${join(folder, file)}: unknown locale "${locale}" (expected one of ${LOCALES.join(", ")})`);
            continue;
        }
        const source = readFileSync(join(folder, file), "utf8");
        const [, frontmatter = "", body = source] = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source) ?? [];
        const slug = /^slug:\s*["']?([^"'\r\n]*)["']?\s*$/m.exec(frontmatter)?.[1];
        pages.push({
            name,
            locale: locale as Locale,
            file: join(folder, file),
            path: localizePath(name === "home" ? "" : (slug ?? name), locale as Locale),
            body,
        });
    }
}

const pathsByLocale = new Map(LOCALES.map((locale) => [locale, new Map<string, PageFile>()]));

for (const page of pages) {
    const paths = pathsByLocale.get(page.locale)!;
    const existing = paths.get(page.path);
    if (existing) errors.push(`${page.file}: URL ${page.path} is already used by ${existing.file}`);
    else paths.set(page.path, page);
}

for (const page of pages) {
    const links = [...page.body.matchAll(/\]\((\/[^)\s]*)\)|href=["'](\/[^"']*)["']/g)].map(
        ([, markdown, html]) => (markdown ?? html)!,
    );
    for (const link of links) {
        const path = link.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
        // Files (/llms.txt, /og/index.png…) are not pages
        if (/\.[a-z0-9]+$/i.test(path)) continue;
        if (pathsByLocale.get(page.locale)!.has(path)) continue;

        const other = pages.find((candidate) => candidate.path === path);
        const sameLocale = other && pages.find((p) => p.name === other.name && p.locale === page.locale);
        errors.push(
            `${page.file}: link ${link} ` +
                (sameLocale ? `points to the ${other.locale} page, use ${sameLocale.path}` : "does not match any page"),
        );
    }
}

if (errors.length > 0) {
    console.error(`i18n check failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`);
    process.exit(1);
}
console.log(`i18n check passed: ${pages.length} page files in ${LOCALES.length} locales`);
