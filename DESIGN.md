# Design system: the gallery

Inspired by VSCO and studio portfolios: photos lead, type frames them.

## Colour (OKLCH, tokens in `src/app/globals.css`)

Strategy: **restrained, light-first**. One accent: ink.

| Token                               | Value                                  | Role                                                                                                                                                     |
| ----------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bg`                                | warm off-white `oklch(0.975 0.004 85)` | The gallery stage                                                                                                                                        |
| `surface`, `surface-raised`         | slightly deeper off-whites             | Image placeholders, soft buttons, inputs                                                                                                                 |
| `fg` / `fg-muted` / `fg-faint`      | ink-tinted near-black → grey           | Type hierarchy                                                                                                                                           |
| `ink`                               | `#070429` · `oklch(0.15 0.074 277.8)`  | Primary buttons, the "Available for work" pill, and full dark sections: the scroll story, the Jotex typographic tile, the contact email card, the footer |
| `ink-fg`, `ink-muted`, `ink-border` |                                        | Type and rules inside ink sections                                                                                                                       |
| `highlight`                         | gold                                   | The terminal `$` prompt only                                                                                                                             |

No pure white or black. No theme toggle: one signature look.

## Typography

- **Inter Tight** (`font-display`, `display-xl` utility): giant uppercase split headlines
  ("SELECTED ◯ WORK"), project titles, numbers. Tight tracking (−0.045em).
- **Instrument Serif italic** (`font-serif italic`): small accents and whispers,
  e.g. "[ Who I am ]", emphasised phrases inside display sentences.
- **Instrument Sans** (`font-sans`): body text and small labels (`label` utility).
- IBM Plex Mono: the single terminal artifact only.

## Layout

- Floating pill navigation, fixed at the top. Mobile: an inline disclosure menu (not a modal).
- `SplitHeading`: two words pushed to the edges with a small element between them (short words)
  or below them (long names).
- Images: `rounded-sm`, full-bleed or near full-bleed, captions underneath in small sans.
- `ProjectVisual` renders a screenshot (blur-up), a typographic ink tile (`visual: typographic`,
  for internal systems that can't be shown), or a neutral placeholder.
- No cards-for-everything: hairline rules separate lists (career, toolkit, repositories).

## Motion

- Hero carousel: native scroll-snap with arrow buttons; slow image zoom on hover.
- Pinned ink scroll story; scroll-lit intro paragraph.
- Page changes crossfade (React `<ViewTransition>`); project images morph between pages.
- Transform/opacity only, ease-out-expo; disabled under reduced motion.
