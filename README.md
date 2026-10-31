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

| Command             | Action                                                   |
| :------------------ | :------------------------------------------------------- |
| `pnpm dev`          | Start the dev server at `localhost:4321`                 |
| `pnpm build`        | Build the production site to `./dist/`                   |
| `pnpm preview`      | Preview the build locally                                |
| `pnpm format`       | Format the whole project with Prettier                   |
| `pnpm format:check` | Check formatting without writing changes                 |
| `pnpm lint`         | Lint with ESLint                                         |
| `pnpm lint:fix`     | Lint and apply automatic fixes                           |
| `pnpm typecheck`    | Type check `.astro` and `.ts` files (`astro check`)      |
| `pnpm check`        | Run `format:check`, `lint` and `typecheck` in that order |

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

## Pinned versions

Update these only after checking the reason they are pinned:

| Package                                   | Version                | Reason                                                                                                                                                                                   |
| :---------------------------------------- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript`                              | `6.0.3` (+ `override`) | `@astrojs/check` supports `^5 \|\| ^6` and `typescript-eslint` requires `<6.1.0`. Without the override, TypeScript 7 gets installed transitively. Review when both support TypeScript 7. |
| `prettier`, `prettier-plugin-tailwindcss` | exact                  | A minor release can reformat the whole repository. Update them on purpose and commit the reformat separately.                                                                            |
| `prettier-plugin-astro`                   | `0.14.1` (exact)       | 1.x changed its AST and `prettier-plugin-tailwindcss` 0.8.x no longer sorts classes in `.astro` files with it. Review when the Tailwind plugin supports `prettier-plugin-astro` 1.x.     |
| `eslint-plugin-jsx-a11y-x`                | —                      | Used instead of `eslint-plugin-jsx-a11y`, which does not support ESLint 10 yet.                                                                                                          |
