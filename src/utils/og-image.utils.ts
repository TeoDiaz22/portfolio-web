/**
 * Open Graph image (1200×630 PNG) rendered at build time with satori (layout → SVG) and sharp (SVG → PNG).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { SITE } from "@constants/site.constants.ts";
import { THEME_COLORS } from "@constants/theme.constants.ts";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// satori needs TTF/OTF/WOFF (not WOFF2); the latin subset covers Spanish accents. Archivo is the design system's
// font, and its weight never exceeds 500
const fontFile = (weight: number) =>
    readFile(join(process.cwd(), `node_modules/@fontsource/archivo/files/archivo-latin-${weight}-normal.woff`));
const fonts = Promise.all([fontFile(400), fontFile(500)]);

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

/**
 * Light theme of the design system: a single tile (sunken grey, 32px radius) on the canvas, a two-level hierarchy of
 * ink and muted ink, and the accent only as the status dot.
 */
export async function renderOgImage({ title, description, url }: OgImageInput): Promise<Uint8Array<ArrayBuffer>> {
    const [regular, medium] = await fonts;
    const { canvas, surfaceSunken, ink, inkMuted, accent } = THEME_COLORS.light;

    const tile = node(
        "div",
        {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            borderRadius: 32,
            backgroundColor: surfaceSunken,
        },
        [
            node(
                "div",
                { fontSize: 22, fontWeight: 500, letterSpacing: 0.9, textTransform: "uppercase", color: inkMuted },
                SITE.name,
            ),
            node("div", { display: "flex", flexDirection: "column", gap: 28 }, [
                node(
                    "div",
                    { fontSize: 72, fontWeight: 500, lineHeight: 1.05, letterSpacing: -1.4, color: ink, lineClamp: 2 },
                    title,
                ),
                node("div", { fontSize: 30, lineHeight: 1.5, color: inkMuted, lineClamp: 3 }, description),
            ]),
            node("div", { display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: inkMuted }, [
                node("div", { width: 12, height: 12, borderRadius: 999, backgroundColor: accent }, []),
                node("div", {}, url.replace(/^https?:\/\//, "").replace(/\/$/, "")),
            ]),
        ],
    );

    const layout = node(
        "div",
        {
            width: OG_WIDTH,
            height: OG_HEIGHT,
            // satori sizes boxes as content-box; without this the padding overflows the canvas
            boxSizing: "border-box",
            display: "flex",
            padding: 16,
            backgroundColor: canvas,
            fontFamily: "Archivo",
        },
        [tile],
    );

    const svg = await satori(layout, {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
            { name: "Archivo", data: regular, weight: 400, style: "normal" },
            { name: "Archivo", data: medium, weight: 500, style: "normal" },
        ],
    });
    return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
}
