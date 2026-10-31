import type { APIRoute, GetStaticPaths } from "astro";
import { INDEXNOW_KEY } from "astro:env/server";
import { isIndexable } from "@utils/env.utils.ts";

/** IndexNow ownership file (`/<key>.txt` containing the key); only in production builds with a key. */
export const getStaticPaths = (() =>
    isIndexable && INDEXNOW_KEY ? [{ params: { indexnow: INDEXNOW_KEY } }] : []) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
    new Response(params.indexnow, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
