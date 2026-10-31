# portfolio-web

Portfolio built with [Astro](https://astro.build), TypeScript and Tailwind CSS.

## Requirements

- Node `>=22.23.4` (`.nvmrc` pins the version used for development)
- pnpm `12` (pinned in `packageManager`)

```sh
pnpm install
```

`pnpm install` also installs the Git hooks through Husky.

## Commands

| Command             | Action                                                           |
| :------------------ | :--------------------------------------------------------------- |
| `pnpm dev`          | Start the dev server at `localhost:4321`                         |
| `pnpm build`        | Build the production site to `./dist/`                           |
| `pnpm build:pre`    | Build the staging site to `./dist/` (`--mode pre`)               |
| `pnpm indexnow`     | Submit the built sitemap URLs to IndexNow (production)           |
| `pnpm preview`      | Preview the build locally                                        |
| `pnpm format`       | Format the whole project with Prettier                           |
| `pnpm format:check` | Check formatting without writing changes                         |
| `pnpm lint`         | Lint with ESLint                                                 |
| `pnpm lint:fix`     | Lint and apply automatic fixes                                   |
| `pnpm typecheck`    | Type check `.astro` and `.ts` files (`astro check`)              |
| `pnpm i18n:check`   | Check that every page is translated and links match their locale |
| `pnpm check`        | Run `format:check`, `lint`, `typecheck` and `i18n:check`         |

## Code quality

- **Prettier** (`prettier.config.ts`) formats the code, including `.astro` files, sorts imports and sorts Tailwind classes.
- **ESLint** (`eslint.config.ts`) checks code quality, including accessibility rules for `.astro` files. Formatting
  rules are disabled through `eslint-config-prettier`.
- **Git hooks** (Husky):
    - `pre-commit`: runs ESLint and Prettier on staged files (lint-staged).
    - `commit-msg`: enforces [Conventional Commits](https://www.conventionalcommits.org) (commitlint).
    - `pre-push`: runs the type check.

## Environment variables

Variables are declared and validated with [`astro:env`](https://docs.astro.build/en/guides/environment-variables/) in
`astro.config.ts` (`env.schema`) and imported from `astro:env/client` or `astro:env/server`.

Astro loads `.env.[mode]` files natively: `astro build --mode pre` reads `.env.pre`. Every `.env*` file is ignored by
Git except `.env.template`, which lists every variable.

There are two environments:

| Environment | Build command    | `SITE_ENV`   | Indexing                                         |
| :---------- | :--------------- | :----------- | :----------------------------------------------- |
| Production  | `pnpm build`     | `production` | Indexable, `robots.txt` allows and links sitemap |
| Staging     | `pnpm build:pre` | `staging`    | `noindex` on every page, `robots.txt` blocks all |

`SITE_ENV` defaults to `staging`, so a build without it is never indexable. `SITE_URL` sets Astro's `site` (canonical
URLs, Open Graph, sitemap); it is read in `astro.config.ts` before Astro loads the env files, with the same lookup
order as Vite.

## SEO

Every page gets its SEO from the `pages` content collection, and `src/components/seo/Seo.astro` (rendered by
`Layout.astro`) turns it into title, description, canonical, robots, `hreflang`, Open Graph, Twitter Card and JSON-LD.
Site-wide values (name, author, social profiles, theme color, blocked AI crawlers) live in `src/constants/site.constants.ts`.

### Adding a page

1. Create a folder `src/content/pages/<name>/` with one Markdown file per locale, `es.md` and `en.md`. The folder name
   identifies the page across locales; `slug` sets its URL in each one (defaults to the folder name; `home` is always
   `/`). The `seo` block is validated by `seoSchema` in `src/content.config.ts`, so a title or description that is too
   long fails the build:

    ```yaml
    # src/content/pages/about/es.md → /sobre-mi   (en.md with `slug: about` → /en/about)
    slug: sobre-mi
    seo:
        title: Sobre mí # ≤ 60 chars, rendered as "Sobre mí · Mateo Díaz"
        description: … # 50–160 chars
        pageType: AboutPage # JSON-LD type (WebPage by default)
        updatedAt: 2026-10-31 # sitemap <lastmod> and dateModified
        # image, imageAlt, noindex, canonical, ogType, fullTitle, publishedAt are optional
    ```

2. Optionally, create `src/templates/<name>.astro` for a page with its own design; otherwise
   `src/templates/default.astro` renders the Markdown body. Templates receive the `page` (locale, path and entry).

`src/pages/[...slug].astro` builds every page in every locale. The page is automatically included in the sitemap,
`llms.txt`, `llms-full.txt`, gets its Markdown version (`/<path>.md`), its Open Graph image (`/og/<path>.png`), and
`hreflang` and the language switcher link its translations. `noindex: true` removes it from the sitemap and the LLM
files.

### Generated files

| URL                                     | Source                              |
| :-------------------------------------- | :---------------------------------- |
| `/robots.txt`                           | `src/pages/robots.txt.ts`           |
| `/sitemap.xml`                          | `src/pages/sitemap.xml.ts`          |
| `/llms.txt`, `/llms-full.txt`           | `src/pages/llms*.txt.ts`            |
| `/<page>.md`, `/index.html.md`          | `src/pages/[...path].md.ts`         |
| `/og/<page>.png`                        | `src/pages/og/[...path].png.ts`     |
| `/manifest.webmanifest`, icons          | generated from `public/favicon.svg` |
| `/<INDEXNOW_KEY>.txt` (production only) | `src/pages/[indexnow].txt.ts`       |

### Pending until the hosting is chosen

- Send `X-Robots-Tag: noindex` on every staging response (covers images, `.md` and `.txt`, which have no meta tags)
  and, ideally, protect staging with basic auth.
- Run `pnpm indexnow` after each production deploy.
- Lighthouse CI (`.github/workflows/lighthouse.yml`) already runs on pull requests against a production build.

## Internationalization

Spanish (`es`) is the default locale and has no URL prefix; English (`en`) lives under `/en`. Locales are defined once
in `LOCALES` (`src/constants/site.constants.ts`), which also feeds Astro's `i18n` config.

| What                         | Where                                  | Completeness enforced by                         |
| :--------------------------- | :------------------------------------- | :----------------------------------------------- |
| Page content and SEO         | `src/content/pages/<page>/<locale>.md` | `pnpm i18n:check`                                |
| Interface strings            | `src/i18n/<locale>.i18n.ts`            | Type check (dictionaries are typed against `es`) |
| Locale metadata (name, `og`) | `LOCALE_META` in `site.constants.ts`   | Type check                                       |

Interface strings are read with `useTranslations(locale)` from `@utils/i18n.utils.ts`; keys are typed and support
`{placeholder}` values:

```ts
const t = useTranslations(locale);
t("breadcrumb.home");
```

Internal links in Markdown must use the URL of the same locale (`/sobre-mi` in `es.md`, `/en/about` in `en.md`);
`pnpm i18n:check` reports links that point to another locale or to no page, missing translations and duplicated URLs.

To add a locale, add it to `LOCALES` and `LOCALE_META`, create `src/i18n/<locale>.i18n.ts` and register it in
`src/i18n/index.i18n.ts`; then the type check and `pnpm i18n:check` list every missing file.

## Pinned versions

Update these only after checking the reason they are pinned:

| Package                                   | Version                | Reason                                                                                                                                                                                   |
| :---------------------------------------- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript`                              | `6.0.3` (+ `override`) | `@astrojs/check` supports `^5 \|\| ^6` and `typescript-eslint` requires `<6.1.0`. Without the override, TypeScript 7 gets installed transitively. Review when both support TypeScript 7. |
| `prettier`, `prettier-plugin-tailwindcss` | exact                  | A minor release can reformat the whole repository. Update them on purpose and commit the reformat separately.                                                                            |
| `prettier-plugin-astro`                   | `0.14.1` (exact)       | 1.x changed its AST and `prettier-plugin-tailwindcss` 0.8.x no longer sorts classes in `.astro` files with it. Review when the Tailwind plugin supports `prettier-plugin-astro` 1.x.     |
| `eslint-plugin-jsx-a11y-x`                | —                      | Used instead of `eslint-plugin-jsx-a11y`, which does not support ESLint 10 yet.                                                                                                          |
