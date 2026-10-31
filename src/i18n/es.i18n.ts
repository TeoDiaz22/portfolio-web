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
    theme: {
        label: "Tema",
        light: "Claro",
        dark: "Oscuro",
    },
    example: {
        nav: {
            label: "Principal",
            home: "Inicio",
            example: "Ejemplo",
        },
        eyebrow: "Sistema de diseño",
        title: "Página de ejemplo",
        hint: "Pasa el cursor sobre los bloques",
        project: {
            label: "Proyecto",
            caption: "Godot · MediaPipe · TensorFlow",
            action: "Ver el caso de estudio de GestPlay",
        },
        about: {
            label: "Stack",
            title: "Sobre mí",
            subhead: "Desarrollador Full Stack en Uqai",
            learning: "Astro · en aprendizaje",
        },
        palette: {
            label: "Paleta",
        },
        buttons: {
            label: "Botones",
            projects: "Ver proyectos",
            contact: "Contáctame",
        },
        type: {
            label: "Tipografía",
            lede: "Construyo software a medida.",
            body: "Del backend a la experiencia final.",
        },
        timeline: {
            label: "Trayectoria",
            uqaiDate: "May. 2024 – Presente",
            uqaiRole: "Desarrollador Full Stack",
            uqaiPlace: "Uqai · Quito, Ecuador",
            epnDate: "Sep. 2019 – Ago. 2024",
            epnRole: "Ingeniería de Software, Cum Laude",
            epnPlace: "Escuela Politécnica Nacional",
        },
        note: {
            label: "Enlaces",
            text: "El código de este portafolio está en mi",
            link: "perfil de GitHub",
            footnote: "Contenido de ejemplo para comprobar los estilos.",
        },
        headline: {
            subject: "Mateo Díaz",
            rest: "— Full Stack Developer.",
            lede: "Construyo software a medida, desde el backend hasta la experiencia final del usuario, con foco en calidad, accesibilidad y buenas prácticas.",
            location: "Quito, Ecuador",
        },
        case: {
            label: "Caso de estudio",
            subhead: "En colaboración con LudoLab",
            period: "Periodo",
            periodValue: "Oct. 2023 – Ago. 2024",
            stack: "Stack",
            stackValue: "Python, Godot, React",
            audience: "Público",
            audienceValue: "Niños con discapacidades",
        },
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
