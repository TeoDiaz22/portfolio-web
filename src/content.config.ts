import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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
        publishedAt: z.coerce.date().optional(),
        /** Feeds the sitemap `<lastmod>` and JSON-LD `dateModified`. */
        updatedAt: z.coerce.date().optional(),
    });

export type SeoData = z.infer<ReturnType<typeof seoSchema>>;

/** Static pages, one Markdown file per locale: `src/content/pages/<locale>/<page>.md`. */
const pages = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
    schema: (context) =>
        z.object({
            seo: seoSchema(context),
        }),
});

export const collections = { pages };
