/**
 * JSON-LD builders. Every page renders one `@graph` whose nodes reference each other by `@id`, so the site-wide nodes
 * (Person, WebSite) are described once and linked from each page.
 */
import type { BreadcrumbList, Graph, Person, Thing, WebPage, WebSite } from "schema-dts";
import { AUTHOR, LOCALE_META, SITE, type Locale } from "@constants/site.constants.ts";
import type { SeoData } from "../content.config.ts";

export type PageType = SeoData["pageType"];

export interface Breadcrumb {
    name: string;
    url: string;
}

interface PageInput {
    type: PageType;
    url: string;
    title: string;
    description: string;
    locale: Locale;
    imageUrl?: string | undefined;
    publishedAt?: Date | undefined;
    updatedAt?: Date | undefined;
    breadcrumbs: Breadcrumb[];
}

const personId = (site: string) => `${site}#person`;
const websiteId = (site: string) => `${site}#website`;

export function personNode(site: string, locale: Locale): Person {
    return {
        "@type": "Person",
        "@id": personId(site),
        name: AUTHOR.name,
        url: site,
        jobTitle: AUTHOR.jobTitle[locale],
        sameAs: [...AUTHOR.sameAs],
    };
}

export function websiteNode(site: string, locale: Locale): WebSite {
    return {
        "@type": "WebSite",
        "@id": websiteId(site),
        url: site,
        name: SITE.name,
        inLanguage: LOCALE_META[locale].lang,
        publisher: { "@id": personId(site) },
    };
}

export function breadcrumbNode(url: string, items: Breadcrumb[]): BreadcrumbList {
    return {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function webPageNode(site: string, page: PageInput): WebPage {
    const aboutPerson = page.type === "ProfilePage" || page.type === "AboutPage";
    return {
        "@type": page.type,
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.title,
        description: page.description,
        inLanguage: LOCALE_META[page.locale].lang,
        isPartOf: { "@id": websiteId(site) },
        ...(aboutPerson && { mainEntity: { "@id": personId(site) } }),
        ...(page.imageUrl && { primaryImageOfPage: { "@type": "ImageObject", url: page.imageUrl } }),
        ...(page.publishedAt && { datePublished: page.publishedAt.toISOString() }),
        ...(page.updatedAt && { dateModified: page.updatedAt.toISOString() }),
        ...(page.breadcrumbs.length > 1 && { breadcrumb: { "@id": `${page.url}#breadcrumb` } }),
    };
}

/** Full graph of a page. `extra` adds page-specific nodes (e.g. a project as `CreativeWork`). */
export function pageGraph(site: string, page: PageInput, extra: Thing[] = []): Graph {
    return {
        "@context": "https://schema.org",
        "@graph": [
            personNode(site, page.locale),
            websiteNode(site, page.locale),
            webPageNode(site, page),
            ...(page.breadcrumbs.length > 1 ? [breadcrumbNode(page.url, page.breadcrumbs)] : []),
            ...extra,
        ],
    };
}

/** Serializes JSON-LD for `set:html`; escaping `<` keeps content from closing the `<script>` tag. */
export function serializeJsonLd(graph: Graph): string {
    return JSON.stringify(graph).replace(/</g, "\\u003c");
}
