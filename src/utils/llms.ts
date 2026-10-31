/**
 * Markdown views of the site for LLMs, following https://llmstxt.org: `/llms.txt` (index), `/llms-full.txt` (every
 * page inline) and a `.md` version of each page.
 */
import type { PageEntry } from "@utils/content.ts";

/** Clean Markdown of a page: its title as H1, the description as a blockquote and the page body. */
export function pageMarkdown(entry: PageEntry): string {
    const { title, description } = entry.data.seo;
    const body = (entry.body ?? "").trim();
    const summary = `> ${description}`;

    // Keep the page's own H1 if it has one, so the document has a single title
    const match = /^# .+$/m.exec(body);
    if (match?.index === 0) {
        const heading = match[0];
        return `${heading}\n\n${summary}\n\n${body.slice(heading.length).trim()}\n`;
    }
    return `# ${title}\n\n${summary}\n\n${body}\n`;
}

export function markdownResponse(markdown: string): Response {
    return new Response(markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
