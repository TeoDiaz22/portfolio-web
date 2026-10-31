import type { APIRoute, GetStaticPaths } from "astro";
import { getPages, type Page } from "@utils/content.utils.ts";
import { renderOgImage } from "@utils/og-image.utils.ts";
import { absoluteUrl, ogImagePath } from "@utils/url.utils.ts";

/** Default Open Graph image of every page (`seo.image` overrides it): `/sobre-mi` → `/og/sobre-mi.png`. */
export const getStaticPaths = (async () =>
    (await getPages()).map((page) => ({
        params: {
            path: ogImagePath(page.path)
                .replace(/^\/og\//, "")
                .replace(/\.png$/, ""),
        },
        props: { page },
    }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ page: Page }> = async ({ props, site }) => {
    const { title, description } = props.page.entry.data.seo;
    const png = await renderOgImage({ title, description, url: absoluteUrl(props.page.path, site) });
    return new Response(png, { headers: { "Content-Type": "image/png" } });
};
