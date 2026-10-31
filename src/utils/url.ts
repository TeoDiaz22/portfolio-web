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
