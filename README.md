# Portfolio — Engineering Showcase

Personal portfolio built as an engineering showcase: Next.js App Router, statically
prerendered, dark-first terminal aesthetic.

## Stack

| Layer     | Choice                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components), React 19, TypeScript strict |
| Styling   | Tailwind CSS v4, design tokens in `src/app/globals.css`                |
| UI        | cmdk (command palette), Lucide icons, Motion                           |
| Env       | `@t3-oss/env-nextjs` + Zod, validated at build time                    |
| Testing   | Vitest + Testing Library (unit), Playwright (e2e)                      |
| CI        | GitHub Actions — lint, format, typecheck, test, build, e2e             |
| Hosting   | Vercel (Hobby)                                                         |

## Getting started

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000. Press `Ctrl+K` (`⌘K` on macOS) for the command palette.

## Scripts

| Script              | Purpose                               |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server                  |
| `npm run build`     | Production build                      |
| `npm run lint`      | ESLint                                |
| `npm run format`    | Prettier (write)                      |
| `npm run typecheck` | Generate route types and run `tsc`    |
| `npm test`          | Unit tests (Vitest)                   |
| `npm run test:e2e`  | E2E tests (Playwright, needs a build) |

First-time Playwright setup: `npx playwright install chromium`.

## Project structure

```
src/
  app/                 routes, root layout, global styles + tokens
  components/
    command/           Cmd+K palette (lazy-loaded on first open)
    layout/            header, footer
    theme/             theme hook + toggle
    ui/                small primitives
  lib/                 site config, theme store, utilities
  env.ts               environment variable schema
tests/
  unit/                Vitest
  e2e/                 Playwright
```
