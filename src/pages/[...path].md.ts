import type { APIRoute, GetStaticPaths } from "astro";
import { getIndexablePages, pagePath, type PageEntry } from "@utils/content.utils.ts";
import { markdownResponse, pageMarkdown } from "@utils/llms.utils.ts";
import { markdownPath } from "@utils/url.utils.ts";

/** Markdown version of every indexable page: `/about` → `/about.md`, `/` → `/index.html.md`. */
export const getStaticPaths = (async () => {
    const paths = [];
    for (const [name, translations] of await getIndexablePages()) {
        for (const [locale, entry] of translations) {
            const path = markdownPath(pagePath(name, locale)).replace(/^\//, "").replace(/\.md$/, "");
            paths.push({ params: { path }, props: { entry } });
        }
    }
    return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: PageEntry }> = ({ props }) => markdownResponse(pageMarkdown(props.entry));
