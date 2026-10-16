# Design system

## Colour (OKLCH, tokens in `src/app/globals.css`)

Strategy: **committed**. The navy base (#080e2e, `oklch(0.182 0.065 270.4)`) carries the surface;
neutrals are tinted toward hue ~270. No pure black or white.

| Token                                                  | Role                                                                             |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `bg-deep`, `bg`, `surface`, `surface-raised`, `border` | Navy surface steps                                                               |
| `fg`, `fg-muted`                                       | Text. Use `fg` for anything a reader must take in; `fg-muted` for metadata only. |
| `accent` (cyan)                                        | Interactive: links, primary buttons, focus rings, key figures in the terminal    |
| `highlight` (amber)                                    | **One role only:** the terminal `$` prompt                                       |
| `success`, `danger`                                    | Status                                                                           |

## Typography

- Display: **Space Grotesk** (`font-display`) for H1/H2/H3 and large figures.
- Body: Geist Sans. Mono: Geist Mono for metadata, eyebrows, and the terminal.
- Body line length capped at 60–70ch. Scale steps ≥1.25.
- Eyebrows: `font-mono text-xs uppercase tracking-wide text-fg-muted`, format `01 · Label`.

## Layout

- Container `max-w-6xl`. Section rhythm varies: primary sections `py-28`, supporting `py-20`.
- Cards only where they're the real affordance (project cards on /projects, the lead project).
  Skills, credentials, and repositories are typographic lists with hairline dividers.
- Never nest cards.

## Motion

- Ease-out curves, transform/opacity only, `transition-[...]` with named properties.
- No infinite animations; the caret blinks 4 times then rests. Reduced motion disables all motion.
- The hero terminal types quickly and has a Skip control.

## Components

- Buttons: `min-h-11`, primary (accent fill) / outline / ghost.
- Form fields: `text-base min-h-11`, sentence-case labels with "(required)" / "(optional)".
