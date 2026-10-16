# Portfolio — Engineering Showcase

Personal portfolio built as an engineering showcase: Next.js App Router, statically
prerendered, dark-first terminal aesthetic.

## Stack

| Layer     | Choice                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components), React 19, TypeScript strict |
| Styling   | Tailwind CSS v4, design tokens in `src/app/globals.css`                |
| Content   | Velite — MDX + YAML validated by Zod schemas, Shiki code highlighting  |
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
| `npm run content`   | Compile content with Velite           |
| `npm run typecheck` | Build content, route types, run `tsc` |
| `npm test`          | Unit tests (Vitest)                   |
| `npm run test:e2e`  | E2E tests (Playwright, needs a build) |

First-time Playwright setup: `npx playwright install chromium`.

## Editing content

All portfolio content lives in `content/` and is validated at build time — a typo in a
field name or a missing required field fails the build instead of breaking the site.

| File                     | What it holds                                        |
| ------------------------ | ---------------------------------------------------- |
| `content/projects/*.mdx` | One file per project; file name becomes the URL slug |
| `content/experience.yml` | Career timeline (omit `end` for a current role)      |
| `content/skills.yml`     | Skills matrix grouped by category                    |

Project frontmatter:

```yaml
---
title: Project name # required, max 80 chars
summary: One-line description # required, max 200 chars
category: Full-Stack # Full-Stack | AI/ML | Enterprise ERP/API | Open Source
techStack: [Next.js, Supabase] # required, at least one
role: Lead engineer # optional
repoUrl: https://github.com/... # optional
liveUrl: https://... # optional
featured: true # show on the home page
draft: false # true hides it in production
publishedAt: 2026-10-01
outcomes: # optional, up to 4 headline metrics
  - { label: Latency, value: "-60%" }
---
```

The MDX body supports GitHub-flavoured Markdown, syntax-highlighted code blocks, and the
`<Callout>` component.

## Project structure

```
src/
  app/                 routes, root layout, global styles + tokens
  components/
    command/           Cmd+K palette (lazy-loaded on first open)
    layout/            header, footer
    mdx/               MDX renderer + components usable inside MDX
    theme/             theme hook + toggle
    ui/                small primitives
  lib/                 content layer, site config, theme store, utilities
  env.ts               environment variable schema
content/               MDX + YAML content (see "Editing content")
velite.config.ts       content schemas
tests/
  fixtures/            stand-in content for unit tests
  unit/                Vitest
  e2e/                 Playwright
```
