/**
 * PNG icons rendered from `public/favicon.svg` at build time, so replacing that file updates every icon.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

/** Sizes generated as `/icons/<size>.png`: 192 and 512 are the ones browsers require for the web app manifest. */
export const ICON_SIZES = [192, 512] as const;

export async function renderIcon(size: number, background?: string): Promise<Uint8Array<ArrayBuffer>> {
    const svg = await readFile(join(process.cwd(), "public/favicon.svg"));
    let image = sharp(svg, { density: 300 }).resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
    if (background) image = image.flatten({ background });
    return new Uint8Array(await image.png().toBuffer());
}

export function pngResponse(png: Uint8Array<ArrayBuffer>): Response {
    return new Response(png, { headers: { "Content-Type": "image/png" } });
}
