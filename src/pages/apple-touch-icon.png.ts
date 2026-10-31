import type { APIRoute } from "astro";
import { pngResponse, renderIcon } from "@utils/icons.ts";

/** iOS ignores transparency and fills it with black, so the icon gets an opaque background. */
export const GET: APIRoute = async () => pngResponse(await renderIcon(180, "#ffffff"));
