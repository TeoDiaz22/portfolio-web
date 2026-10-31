import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { pagePath, splitPageId, type PageEntry } from "@utils/content.utils.ts";
import { renderOgImage } from "@utils/og-image.utils.ts";
import { absoluteUrl, ogImagePath } from "@utils/url.utils.ts";

/** Default Open Graph image of every page (`seo.image` overrides it): `/about` → `/og/about.png`. */
export const getStaticPaths = (async () => {
    const entries = await getCollection("pages");
    return entries.map((entry) => {
        const { locale, name } = splitPageId(entry.id);
        const path = pagePath(name, locale);
        return {
            params: {
                path: ogImagePath(path)
                    .replace(/^\/og\//, "")
                    .replace(/\.png$/, ""),
            },
            props: { entry, path },
        };
    });
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: PageEntry; path: string }> = async ({ props, site }) => {
    const { title, description } = props.entry.data.seo;
    const png = await renderOgImage({ title, description, url: absoluteUrl(props.path, site) });
    return new Response(png, { headers: { "Content-Type": "image/png" } });
};
