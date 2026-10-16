# Portfolio — Engineering Showcase

Personal portfolio designed as a gallery of work: screenshots lead, giant grotesk headlines
frame them, with separate Work, About and Contact pages. Next.js App Router, statically
prerendered. See `DESIGN.md` for the design system.

## Stack

| Layer     | Choice                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components), React 19, TypeScript strict |
| Styling   | Tailwind CSS v4, OKLCH design tokens in `src/app/globals.css`          |
| Content   | Velite — MDX + YAML validated by Zod schemas, Shiki code highlighting  |
| UI        | Inter Tight, Instrument Serif/Sans, Motion, View Transitions, cmdk     |
| Data      | Supabase Postgres via Drizzle ORM (contact log, view counters)         |
| Contact   | Server Action + Zod, Cloudflare Turnstile, Resend email                |
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

| Script               | Purpose                               |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Start the dev server                  |
| `npm run build`      | Production build                      |
| `npm run lint`       | ESLint                                |
| `npm run format`     | Prettier (write)                      |
| `npm run content`    | Compile content with Velite           |
| `npm run typecheck`  | Build content, route types, run `tsc` |
| `npm test`           | Unit + integration tests (Vitest)     |
| `npm run db:migrate` | Apply database migrations             |
| `npm run test:e2e`   | E2E tests (Playwright, needs a build) |

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
order: 1 # optional: display order; 1 = the cover story
visual: image # or typographic (no screenshots, e.g. internal systems)
draft: false # true hides it in production
publishedAt: 2026-10-01
outcomes: # optional, up to 4 headline metrics
  - { label: Latency, value: "-60%" }
---
```

The MDX body supports GitHub-flavoured Markdown, syntax-highlighted code blocks, and the
`<Callout>` and `<Terminal>` components (see the Jotex case study for a `<Terminal>` example).

### Adding screenshots

1. Put images in `content/projects/images/<project-slug>/` (JPG or PNG; desktop shots at
   least 1600px wide, ideally 16:10; phone shots 1170×2532 or similar). Use dummy data, never
   real customer or personal information.
2. Reference them in the project's frontmatter (paths relative to the `.mdx` file):

```yaml
cover: ./images/vendor-performance-intelligence-platform/cover.jpg
gallery:
  - src: ./images/vendor-performance-intelligence-platform/dashboard.jpg
    alt: Vendor scorecard dashboard with three benchmark charts
    caption: Scorecard dashboard
    device: desktop # or mobile
```

Until a `cover` exists, the site shows a neutral "Screenshot coming soon" placeholder.
For work that can't be shown publicly, set `visual: typographic` instead: the project is
presented with its headline number on an ink tile, and the gallery is skipped.
See `content/projects/engineering-portfolio.mdx` for a complete example.

### Résumé

Drop your PDF at `public/resume.pdf`. The hero's "Résumé" download button appears
automatically on the next build — it stays hidden until the file exists.

## Integrations

Everything works without these — features whose keys are missing show a
"not configured" state instead of failing. Put values in `.env.local` locally
(copy `.env.example`) and in Vercel → Settings → Environment Variables in production.
**Never commit keys or paste them into issues/chats.**

| Service              | Powers                                    | Variables                                                |
| -------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Supabase             | Contact log, rate limiting, view counters | `DATABASE_URL`                                           |
| Resend               | Contact notification email                | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`                     |
| Cloudflare Turnstile | Spam protection on the contact form       | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| GitHub (optional)    | Pinned repos + contribution graph         | `GITHUB_TOKEN` (fine-grained, no permissions needed)     |

The contact form switches on only when Supabase, Resend **and** Turnstile are all set.

### Setup checklist

1. **Resend** — sign up with the address in `CONTACT_TO_EMAIL` (until you verify a
   domain, Resend only delivers to your own sign-up address) → API Keys → create a
   "Sending access" key.
2. **Supabase** — new project (region: Southeast Asia / Singapore) → **Connect** →
   copy the **Transaction pooler** string (port 6543) into `DATABASE_URL`, replacing
   `[YOUR-PASSWORD]`.
3. **Create the tables** — either run `npm run db:migrate` (reads `.env.local`), or
   open Supabase → SQL Editor and run the contents of `drizzle/0000_init.sql`.
   Tables have row-level security enabled, so Supabase's public API can't read them.
4. **Cloudflare Turnstile** — Turnstile → Add widget → hostnames `localhost` plus your
   production domain → Managed mode → copy site + secret keys.
5. **Keep Supabase awake** — free projects pause after a week idle. Once deployed, add
   a repository variable `SITE_URL` (GitHub → Settings → Secrets and variables →
   Actions → Variables); the `keep-alive` workflow then pings `/api/health` twice a week.

Contact messages are readable in Supabase → Table Editor → `contact_submissions`.

### Rate limits

3 messages per visitor per hour and 50 per day site-wide (keeps well inside Resend's
free 100/day). Visitor IPs are stored only as a keyed hash.

## Project structure

```
src/
  app/                 routes: / (cover), /work, /work/[slug], /about, /contact
  components/
    about/             career, credentials, toolkit chapters
    media/             ProjectVisual (screenshot · typographic tile · placeholder)
    command/           Cmd+K palette (lazy-loaded on first open)
    home/              hero carousel, pinned scroll story
    layout/            floating pill header, mobile menu, ink footer
    mdx/               MDX renderer + <Callout>, <Terminal>
    work/              project cards, GitHub section
    theme/             theme hook + toggle
    ui/                small primitives
  app/actions/         Server Actions (contact form)
  app/api/             route handlers (view counter, health check)
  db/                  Drizzle schema + client
  lib/                 content layer, contact pipeline, GitHub client, utilities
  env.ts               environment variable schema
drizzle/               generated SQL migrations
content/               MDX + YAML content (see "Editing content")
velite.config.ts       content schemas
tests/
  fixtures/            stand-in content for unit tests
  unit/                Vitest
  integration/         Vitest against real Postgres (set TEST_DATABASE_URL)
  e2e/                 Playwright
```
