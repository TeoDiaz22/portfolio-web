/**
 * Interface strings in Spanish, the default locale. This file defines the keys: every other dictionary is typed
 * against it, so a missing or extra key fails the type check. Use `{name}` placeholders for interpolated values.
 */
const es = {
    breadcrumb: {
        home: "Inicio",
    },
    language: {
        label: "Idioma",
    },
    llms: {
        pages: "Páginas",
        intro:
            "Sitio disponible en {languages}. Cada página tiene una versión Markdown en su misma URL con `.md` al final " +
            "(`/index.html.md` para la portada). Todo el contenido junto: {fullUrl}",
    },
};

export type Dictionary = typeof es;
export default es;
