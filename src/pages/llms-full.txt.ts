import type { APIRoute } from "astro";
import { getIndexablePages } from "@utils/content.utils.ts";
import { markdownResponse, pageMarkdown } from "@utils/llms.utils.ts";

/** Every indexable page in a single Markdown document, for LLMs that read the whole site at once. */
export const GET: APIRoute = async () => {
    const pages = await getIndexablePages();
    const documents = [...pages.values()].flatMap((translations) =>
        translations.map((page) => pageMarkdown(page.entry)),
    );
    return markdownResponse(documents.join("\n---\n\n"));
};
