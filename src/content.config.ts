import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { LOCALES, type Locale } from "@constants/site.constants.ts";

/**
 * SEO metadata shared by every collection that renders a page. Lengths follow what search engines display, so a
 * title or description that would be truncated fails the build.
 */
export const seoSchema = ({ image }: SchemaContext) =>
    z.object({
        title: z.string().min(3).max(60),
        description: z.string().min(50).max(160),
        /** Use the title as is, without `SITE.titleTemplate` (e.g. the home page). */
        fullTitle: z.boolean().default(false),
        /** Open Graph / Twitter image; resized to 1200×630. Defaults to the generated OG image. */
        image: image().optional(),
        imageAlt: z.string().optional(),
        /** Only for pages whose content lives elsewhere; defaults to the page's own URL. */
        canonical: z.url().optional(),
        noindex: z.boolean().default(false),
        ogType: z.enum(["website", "article", "profile"]).default("website"),
        /** schema.org type of the page node in JSON-LD. */
        pageType: z.enum(["WebPage", "ProfilePage", "AboutPage", "ContactPage", "CollectionPage"]).default("WebPage"),
        publishedAt: z.coerce.date().optional(),
        /** Feeds the sitemap `<lastmod>` and JSON-LD `dateModified`. */
        updatedAt: z.coerce.date().optional(),
    });

export type SeoData = z.infer<ReturnType<typeof seoSchema>>;

/**
 * URL segment(s) of a page in one locale, without the locale prefix: `sobre-mi`, `projects/portfolio`. Lowercase,
 * digits and hyphens; it cannot start with a locale code, which would clash with the `/en` prefix.
 */
const slugSchema = z
    .string()
    .regex(/^([a-z0-9]+(-[a-z0-9]+)*)(\/[a-z0-9]+(-[a-z0-9]+)*)*$/, "Use lowercase words separated by hyphens")
    .refine((slug) => !LOCALES.includes(slug.split("/")[0] as Locale), "A slug cannot start with a locale code");

/**
 * Static pages, one folder per page and one Markdown file per locale: `src/content/pages/<page>/<locale>.md`. The
 * folder name identifies the page across locales; `slug` sets its URL in each one.
 */
const pages = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/pages",
        // Id is always `<page>/<locale>`; the default would use the frontmatter `slug` instead
        generateId: ({ entry }) => entry.replace(/\.md$/, ""),
    }),
    schema: (context) =>
        z.object({
            /** Defaults to the page folder name; the `home` page is always `/`. */
            slug: slugSchema.optional(),
            seo: seoSchema(context),
        }),
});

export const collections = { pages };
