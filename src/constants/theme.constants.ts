/**
 * Design system colors for places CSS cannot reach: `<meta name="theme-color">`, the web app manifest and the images
 * rendered at build time (OG images, icons). The source of truth is `src/styles/theme.css`; keep these values in sync.
 */

const light = {
    canvas: "#faf9f5",
    surfaceSunken: "#f5f4ef",
    ink: "#141413",
    inkMuted: "#6f6e68",
    accent: "#2f5d4a",
} as const;

const dark = {
    canvas: "#1a1915",
    surfaceSunken: "#201f1c",
    ink: "#f5f4ef",
    inkMuted: "#9c9a91",
    accent: "#7fb294",
} as const;

export const THEME_COLORS = { light, dark } as const;
