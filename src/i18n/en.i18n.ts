import type { Dictionary } from "./es.i18n.ts";

const en: Dictionary = {
    breadcrumb: {
        home: "Home",
    },
    language: {
        label: "Language",
    },
    theme: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
    },
    example: {
        nav: {
            label: "Main",
            home: "Home",
            example: "Example",
        },
        eyebrow: "Design system",
        title: "Example page",
        hint: "Hover over the blocks",
        project: {
            label: "Project",
            caption: "Godot · MediaPipe · TensorFlow",
            action: "View the GestPlay case study",
        },
        about: {
            label: "Stack",
            title: "About me",
            subhead: "Full Stack Developer at Uqai",
            learning: "Astro · learning",
        },
        palette: {
            label: "Palette",
        },
        buttons: {
            label: "Buttons",
            projects: "View projects",
            contact: "Get in touch",
        },
        type: {
            label: "Type",
            lede: "I build custom software.",
            body: "From backend to the final experience.",
        },
        timeline: {
            label: "Background",
            uqaiDate: "May 2024 – Present",
            uqaiRole: "Full Stack Developer",
            uqaiPlace: "Uqai · Quito, Ecuador",
            epnDate: "Sep. 2019 – Aug. 2024",
            epnRole: "Software Engineering, Cum Laude",
            epnPlace: "Escuela Politécnica Nacional",
        },
        note: {
            label: "Links",
            text: "The code of this portfolio is on my",
            link: "GitHub profile",
            footnote: "Sample content to check the styles.",
        },
        headline: {
            subject: "Mateo Díaz",
            rest: "— Full Stack Developer.",
            lede: "I build custom software end to end, from backend logic to the final user experience, with a focus on quality, accessibility and best practices.",
            location: "Quito, Ecuador",
        },
        case: {
            label: "Case study",
            subhead: "In collaboration with LudoLab",
            period: "Period",
            periodValue: "Oct. 2023 – Aug. 2024",
            stack: "Stack",
            stackValue: "Python, Godot, React",
            audience: "Audience",
            audienceValue: "Children with disabilities",
        },
    },
    llms: {
        pages: "Pages (English)",
        intro:
            "Site available in {languages}. Every page has a Markdown version at its own URL with `.md` appended " +
            "(`/index.html.md` for the home page). All the content in one file: {fullUrl}",
    },
};

export default en;
