# Design system: the engineering journal

## Editions and colour (OKLCH, tokens in `src/app/globals.css`)

Strategy: **committed**. Ink-indigo carries every surface; crimson is the only accent.

| Token           | Ink (default)                         | Paper (light)  | Role                                                  |
| --------------- | ------------------------------------- | -------------- | ----------------------------------------------------- |
| `bg`            | `#070429` · `oklch(0.15 0.074 277.8)` | warm ivory     | Page                                                  |
| `fg`            | ivory `oklch(0.94 0.022 85)`          | indigo ink     | Body and headlines                                    |
| `fg-muted`      | warm grey-ivory                       | grey-indigo    | Metadata, captions                                    |
| `accent`        | rose `oklch(0.72 0.14 15)`            | crimson        | Links and emphasis read as text (7.5:1 on ink)        |
| `accent-strong` | crimson `oklch(0.47 0.165 20)`        | crimson        | Fills, rules, bullets, marks; never small text on ink |
| `border`        | indigo hairline                       | ivory hairline | Rules between items                                   |
| `highlight`     | gold                                  | amber          | The terminal `$` prompt only                          |

A faint SVG grain overlay gives a printed-stock texture in both editions.

## Typography

- **Instrument Serif** (`font-serif`): all headlines, large figures, pull quotes. Italic is used
  for emphasis words ("The _work_", "Write _to me._").
- **Instrument Sans** (`font-sans`): body text.
- **IBM Plex Mono** (`font-mono`, `kicker` utility): folios, kickers, captions, uppercase with
  wide tracking.
- Scale is dramatic on purpose: cover name up to 14rem; page titles 10rem; section titles 5–7rem.
- Body measure 60–68ch. Articles get a drop cap on the first paragraph.

## Layout

- 12-column editorial grid, container `max-w-7xl`.
- Hairline rules (`border-border`) separate items instead of cards. No cards anywhere.
- Kicker row with folio (Nº 01 · 2026) opens the cover; chapters on About use roman numerals.

## Motion

- Cover lines rise out of a mask (CSS, plays before hydration).
- Home story chapter is pinned and scroll-linked (Motion `useScroll`/`useTransform`).
- Pull quote words light up with scroll.
- Page changes crossfade via React `<ViewTransition>`; project titles morph from the archive
  into the case-study headline.
- Transform/opacity only, ease-out-expo; everything disabled under reduced motion.

## Components

- Buttons: `rounded-full`, `min-h-11`; primary = crimson fill.
- Form fields: `text-base min-h-12`, sentence-case labels with "(required)" / "(optional)".
- `WorkIndex`: the shared editorial table of contents (Home and /work).
