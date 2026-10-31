/**
 * Open Graph image (1200×630 PNG) rendered at build time with satori (layout → SVG) and sharp (SVG → PNG).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { SITE } from "@constants/site.ts";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// satori needs TTF/OTF/WOFF (not WOFF2); the latin subset covers Spanish accents
const fontFile = (weight: number) =>
    readFile(join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
const fonts = Promise.all([fontFile(400), fontFile(700)]);

interface OgImageInput {
    title: string;
    description: string;
    url: string;
}

/** satori takes React-like nodes; plain objects avoid a JSX runtime. */
const node = (type: string, style: Record<string, unknown>, children: unknown) => ({
    type,
    props: { style, children },
});

export async function renderOgImage({ title, description, url }: OgImageInput): Promise<Uint8Array<ArrayBuffer>> {
    const [regular, bold] = await fonts;
    const muted = "#94a3b8";

    const layout = node(
        "div",
        {
            width: OG_WIDTH,
            height: OG_HEIGHT,
            // satori sizes boxes as content-box; without this the padding overflows the canvas
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            backgroundColor: SITE.themeColor,
            color: "#f8fafc",
            fontFamily: "Inter",
        },
        [
            node("div", { fontSize: 32, fontWeight: 700, color: muted }, SITE.name),
            node("div", { display: "flex", flexDirection: "column", gap: 28 }, [
                node("div", { fontSize: 68, fontWeight: 700, lineHeight: 1.1, lineClamp: 2 }, title),
                node("div", { fontSize: 32, lineHeight: 1.4, color: "#cbd5e1", lineClamp: 3 }, description),
            ]),
            node("div", { fontSize: 26, color: muted }, url.replace(/^https?:\/\//, "").replace(/\/$/, "")),
        ],
    );

    const svg = await satori(layout, {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
            { name: "Inter", data: regular, weight: 400, style: "normal" },
            { name: "Inter", data: bold, weight: 700, style: "normal" },
        ],
    });
    return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
}
