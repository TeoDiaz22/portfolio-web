import type { APIRoute } from "astro";
import { THEME_COLORS } from "@constants/theme.constants.ts";
import { pngResponse, renderIcon } from "@utils/icons.utils.ts";

/** iOS ignores transparency and fills it with black, so the icon gets an opaque background. */
export const GET: APIRoute = async () => pngResponse(await renderIcon(180, THEME_COLORS.light.canvas));
