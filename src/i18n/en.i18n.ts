import type { Dictionary } from "./es.i18n.ts";

const en: Dictionary = {
    breadcrumb: {
        home: "Home",
    },
    llms: {
        pages: "Pages (English)",
        intro:
            "Site available in {languages}. Every page has a Markdown version at its own URL with `.md` appended " +
            "(`/index.html.md` for the home page). All the content in one file: {fullUrl}",
    },
};

export default en;
