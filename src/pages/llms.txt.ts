import type { APIRoute } from "astro";
import { DEFAULT_LOCALE, LOCALE_META, LOCALES, SITE } from "@constants/site.constants.ts";
import { getIndexablePages, getPage, pagePath } from "@utils/content.utils.ts";
import { useTranslations } from "@utils/i18n.utils.ts";
import { markdownResponse } from "@utils/llms.utils.ts";
import { absoluteUrl, markdownPath } from "@utils/url.utils.ts";

/** `/llms.txt` index (https://llmstxt.org), linking the Markdown version of every indexable page. */
export const GET: APIRoute = async ({ site }) => {
    const home = await getPage("home", DEFAULT_LOCALE);
    const pages = await getIndexablePages();

    const sections = LOCALES.map((locale) => {
        const links = [...pages]
            .flatMap(([name, translations]) => {
                const entry = translations.get(locale);
                if (!entry) return [];
                const url = absoluteUrl(markdownPath(pagePath(name, locale)), site);
                return `- [${entry.data.seo.title}](${url}): ${entry.data.seo.description}`;
            })
            .join("\n");
        return links && `## ${useTranslations(locale)("llms.pages")}\n\n${links}`;
    }).filter(Boolean);

    const languages = LOCALES.map((locale) => {
        const prefix = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
        return `${LOCALE_META[locale].name} (\`${prefix}\`)`;
    }).join(", ");

    const llms = [
        `# ${SITE.name}`,
        `> ${home.data.seo.description}`,
        // The index is written in the default locale, the site's main language; each locale gets its own section
        useTranslations(DEFAULT_LOCALE)("llms.intro", { languages, fullUrl: absoluteUrl("/llms-full.txt", site) }),
        ...sections,
    ].join("\n\n");

    return markdownResponse(`${llms}\n`);
};
