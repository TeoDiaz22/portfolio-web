import type { APIRoute, GetStaticPaths } from "astro";
import { ICON_SIZES, pngResponse, renderIcon } from "@utils/icons.ts";

export const getStaticPaths = (() =>
    ICON_SIZES.map((size) => ({ params: { size: String(size) } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => pngResponse(await renderIcon(Number(params.size)));
