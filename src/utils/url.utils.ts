/**
 * Public path of a page, matching `trailingSlash: "never"`: build output paths (`/about.html`, `/en/index.html`) and
 * trailing slashes are removed. The home page is `/`.
 */
export function toPublicPath(pathname: string): string {
    const path = pathname
        .replace(/\.html$/, "")
        .replace(/(^|\/)index$/, "")
        .replace(/\/+$/, "");
    return path.startsWith("/") ? path || "/" : `/${path}`;
}

export function absoluteUrl(path: string, site: URL | undefined): string {
    if (!site) throw new Error("`site` must be set in astro.config.ts to build absolute URLs");
    return new URL(path, site).href;
}

/**
 * URL of the Markdown version of a page, as llmstxt.org proposes: `.md` appended to the page URL, or `index.html.md`
 * for URLs without a file name (only `/` with `trailingSlash: "never"`).
 */
export function markdownPath(path: string): string {
    return path === "/" ? "/index.html.md" : `${path}.md`;
}

/** Generated Open Graph image of a page (see `src/pages/og/[...path].png.ts`): `/` → `/og/index.png`. */
export function ogImagePath(path: string): string {
    return `/og${path === "/" ? "/index" : path}.png`;
}
