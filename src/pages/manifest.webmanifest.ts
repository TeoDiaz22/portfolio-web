import type { APIRoute } from "astro";
import { DEFAULT_LOCALE, LOCALE_META, SITE } from "@constants/site.constants.ts";
import { getPage } from "@utils/content.utils.ts";
import { ICON_SIZES } from "@utils/icons.utils.ts";

export const GET: APIRoute = async () => {
    const home = await getPage("home", DEFAULT_LOCALE);
    const manifest = {
        name: SITE.name,
        short_name: SITE.name,
        description: home.entry.data.seo.description,
        lang: LOCALE_META[DEFAULT_LOCALE].lang,
        start_url: "/",
        display: "browser",
        theme_color: SITE.themeColor,
        background_color: SITE.themeColor,
        icons: ICON_SIZES.map((size) => ({ src: `/icons/${size}.png`, sizes: `${size}x${size}`, type: "image/png" })),
    };
    return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
};
