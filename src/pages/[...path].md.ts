import type { APIRoute, GetStaticPaths } from "astro";
import { getIndexablePages, type Page } from "@utils/content.utils.ts";
import { markdownResponse, pageMarkdown } from "@utils/llms.utils.ts";
import { markdownPath } from "@utils/url.utils.ts";

/** Markdown version of every indexable page: `/sobre-mi` → `/sobre-mi.md`, `/` → `/index.html.md`. */
export const getStaticPaths = (async () =>
    [...(await getIndexablePages()).values()].flat().map((page) => ({
        params: { path: markdownPath(page.path).replace(/^\//, "").replace(/\.md$/, "") },
        props: { page },
    }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ page: Page }> = ({ props }) => markdownResponse(pageMarkdown(props.page.entry));
