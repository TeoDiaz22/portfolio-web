# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio built with Astro 7, TypeScript (strict) and Tailwind CSS 4. No UI framework integration (no React) for
now. `src/` still contains the Astro starter (`Welcome.astro`), meant to be replaced.

See also `AGENTS.md` (dev server usage and links to the Astro guides to consult before routing, components, content,
styling or i18n work).

## Commands

Package manager is pnpm 12 (pinned in `packageManager`); Node version in `.nvmrc`.

- `astro dev --background` to start the dev server (manage with `astro dev stop|status|logs`), as required by `AGENTS.md`
- `pnpm build` / `pnpm preview`
- `pnpm check` runs `format:check`, `lint` and `typecheck` (`astro check`); run it before considering a change done
- `pnpm format` / `pnpm lint:fix` to auto-fix; target a single file with `pnpm exec prettier --write <file>` or
  `pnpm exec eslint <file>`

There is no test runner configured.

## Conventions and tooling constraints

- **Everything is TypeScript**, including tool configs: `astro.config.ts`, `prettier.config.ts`, `eslint.config.ts`
  (loaded through `jiti`), `commitlint.config.ts`. Do not add `.js`/`.mjs`/`.cjs` config files. lint-staged config lives
  in `package.json`.
- **Path aliases** (`@components`, `@layouts`, `@assets`, `@utils`, `@styles`, `@constants`) are defined in
  `tsconfig.json` and duplicated in the `importOrder` regex of `prettier.config.ts`; keep both in sync when adding one.
  Import local TS files with their extension (`allowImportingTsExtensions`).
- `verbatimModuleSyntax` is on: type-only imports must use `import type`.
- Prettier sorts imports, but side-effect imports (`import "@styles/global.css"`) intentionally keep their position so
  the CSS cascade order is not altered. It also sorts Tailwind classes (`tailwindStylesheet: ./src/styles/global.css`).
- Tailwind entry point is `src/styles/global.css`, imported once in `src/layouts/Layout.astro`.
- ESLint includes `astro/jsx-a11y` accessibility rules for `.astro` files (via `eslint-plugin-jsx-a11y-x`).
- Environment variables go through `astro:env`: declare them in `env.schema` in `astro.config.ts` and import from
  `astro:env/client` or `astro:env/server`. Per-environment values use Astro modes (`astro build --mode pre` reads
  `.env.pre`); all `.env*` files are git-ignored except `.env.template`.
- `docs/` is excluded from Prettier.

## Pinned versions

Do not upgrade these independently; the reasons are documented in the README "Pinned versions" table:

- `typescript` 6.0.3 (exact + `overrides` in `pnpm-workspace.yaml`): `@astrojs/check` and `typescript-eslint` do not
  support TypeScript 7.
- `prettier-plugin-astro` 0.14.1: the 1.x AST breaks Tailwind class sorting in `.astro` files.
- `prettier`, `prettier-plugin-tailwindcss`: exact versions, since upgrades can reformat the whole repo; commit
  reformatting separately from config changes.

## Git

Husky hooks: `pre-commit` runs lint-staged (ESLint + Prettier on staged files), `commit-msg` enforces Conventional
Commits via commitlint, `pre-push` runs `astro check`. Commit messages must follow `type: subject`.
