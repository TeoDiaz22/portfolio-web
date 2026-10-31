import type { Locale } from "@constants/site.constants.ts";
import en from "./en.i18n.ts";
import es, { type Dictionary } from "./es.i18n.ts";

export type { Dictionary };

/** One dictionary per locale; adding a locale to `LOCALES` without its dictionary fails the type check. */
export const DICTIONARIES: Record<Locale, Dictionary> = { es, en };
