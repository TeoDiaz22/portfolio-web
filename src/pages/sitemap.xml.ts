import type { APIRoute } from "astro";
import { DEFAULT_LOCALE, LOCALE_META } from "@constants/site.constants.ts";
import { getIndexablePages } from "@utils/content.utils.ts";
import { absoluteUrl } from "@utils/url.utils.ts";

const escapeXml = (value: string) =>
    value.replace(/[<>&'"]/g, (char) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[char]};`);

/**
 * Sitemap built from the pages collection, so `noindex` pages are left out and `seo.updatedAt` becomes `<lastmod>`.
 * Each URL lists its translations (`xhtml:link`), as Google recommends for multilingual sites.
 */
export const GET: APIRoute = async ({ site }) => {
    const urls: string[] = [];

    for (const translations of (await getIndexablePages()).values()) {
        const links = translations.map(
            (page) =>
                `<xhtml:link rel="alternate" hreflang="${LOCALE_META[page.locale].lang}" href="${escapeXml(absoluteUrl(page.path, site))}"/>`,
        );
        const defaultPage = translations.find((page) => page.locale === DEFAULT_LOCALE);
        if (defaultPage) {
            const href = escapeXml(absoluteUrl(defaultPage.path, site));
            links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${href}"/>`);
        }

        for (const page of translations) {
            const { canonical, updatedAt, publishedAt } = page.entry.data.seo;
            const lastmod = updatedAt ?? publishedAt;
            urls.push(
                [
                    "<url>",
                    `<loc>${escapeXml(canonical ?? absoluteUrl(page.path, site))}</loc>`,
                    ...(lastmod ? [`<lastmod>${lastmod.toISOString()}</lastmod>`] : []),
                    ...(translations.length > 1 ? links : []),
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
