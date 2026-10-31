import { DEFAULT_LOCALE, LOCALES, type Locale } from "@constants/site.constants.ts";
import { DICTIONARIES, type Dictionary } from "@i18n/index.i18n.ts";
import { toPublicPath } from "@utils/url.utils.ts";

export function isLocale(value: string | undefined): value is Locale {
    return LOCALES.includes(value as Locale);
}

/**
 * Adds the locale prefix to a path written without it: `localizePath("/about", "en")` → `/en/about`,
 * `localizePath("/", "en")` → `/en`. The default locale has no prefix.
 */
export function localizePath(path: string, locale: Locale): string {
    const normalized = toPublicPath(path);
    if (locale === DEFAULT_LOCALE) return normalized;
    return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/** Dotted path of every string in the dictionary: `"breadcrumb.home"`, `"llms.intro"`… */
type TranslationKey<T, Prefix extends string = ""> = {
    [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : TranslationKey<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type Translate = (key: TranslationKey<Dictionary>, values?: Record<string, string | number>) => string;

/** Translator for a locale: `t("breadcrumb.home")`, `t("llms.intro", { languages, fullUrl })`. */
export function useTranslations(locale: Locale): Translate {
    const dictionary = DICTIONARIES[locale];
    return (key, values = {}) => {
        const text = key
            .split(".")
            .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], dictionary);
        if (typeof text !== "string") throw new Error(`Missing translation "${key}" for locale "${locale}"`);
        return text.replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder));
    };
}
