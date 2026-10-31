import { DEFAULT_LOCALE, LOCALES, type Locale } from "@constants/site.constants.ts";
import { DICTIONARIES, type Dictionary } from "@i18n/index.i18n.ts";
import { toPublicPath } from "@utils/url.utils.ts";

export function isLocale(value: string | undefined): value is Locale {
    return LOCALES.includes(value as Locale);
}

/**
 * `getStaticPaths` result for a page under `src/pages/[...lang]/`: the default locale has no prefix (`/about`) and the
 * rest are prefixed (`/en/about`).
 */
export function localeStaticPaths() {
    return LOCALES.map((locale) => ({
        params: { lang: locale === DEFAULT_LOCALE ? undefined : locale },
        props: { locale },
    }));
}

/** Path without the locale prefix: `/en/about` → `/about`, `/en` → `/`. */
export function stripLocale(pathname: string): string {
    const path = toPublicPath(pathname);
    const [, first, ...rest] = path.split("/");
    if (!isLocale(first) || first === DEFAULT_LOCALE) return path;
    return `/${rest.join("/")}`;
}

/** Path of the same page in another locale: `localizePath("/about", "en")` → `/en/about`. */
export function localizePath(pathname: string, locale: Locale): string {
    const path = stripLocale(pathname);
    if (locale === DEFAULT_LOCALE) return path;
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Path of the same page in every locale, for `hreflang` and the sitemap. */
export function getAlternatePaths(pathname: string): Record<Locale, string> {
    return Object.fromEntries(LOCALES.map((locale) => [locale, localizePath(pathname, locale)])) as Record<
        Locale,
        string
    >;
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
