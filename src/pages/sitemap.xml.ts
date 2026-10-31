import type { APIRoute } from "astro";
import { DEFAULT_LOCALE } from "@constants/site.ts";
import { getIndexablePages, pagePath } from "@utils/content.ts";
import { absoluteUrl } from "@utils/url.ts";

const escapeXml = (value: string) =>
    value.replace(/[<>&'"]/g, (char) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[char]};`);

/**
 * Sitemap built from the pages collection, so `noindex` pages are left out and `seo.updatedAt` becomes `<lastmod>`.
 * Each URL lists its translations (`xhtml:link`), as Google recommends for multilingual sites.
 */
export const GET: APIRoute = async ({ site }) => {
    const urls: string[] = [];

    for (const [name, translations] of await getIndexablePages()) {
        const links = [...translations.keys()].map(
            (locale) =>
                `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(absoluteUrl(pagePath(name, locale), site))}"/>`,
        );
        if (translations.has(DEFAULT_LOCALE)) {
            const href = escapeXml(absoluteUrl(pagePath(name, DEFAULT_LOCALE), site));
            links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${href}"/>`);
        }

        for (const [locale, entry] of translations) {
            const loc = escapeXml(entry.data.seo.canonical ?? absoluteUrl(pagePath(name, locale), site));
            const lastmod = entry.data.seo.updatedAt ?? entry.data.seo.publishedAt;
            urls.push(
                [
                    "<url>",
                    `<loc>${loc}</loc>`,
                    ...(lastmod ? [`<lastmod>${lastmod.toISOString()}</lastmod>`] : []),
                    ...(translations.size > 1 ? links : []),
                    "</url>",
                ].join(""),
            );
        }
    }

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...urls,
        "</urlset>",
    ].join("\n");

    return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
