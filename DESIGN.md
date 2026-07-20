# DESIGN.md

## Color

Aquatic 8-bit palette, defined in `src/app/globals.css` and mirrored into
Tailwind via `@theme inline`. Strategy: **full palette** — named roles used
deliberately, always ink-outlined. The magazine-era tokens (parchment,
navy-dark, neon-yellow, coral-hot) are retired.

| Token        | Hex       | Role                                          |
| ------------ | --------- | --------------------------------------------- |
| `--ink`      | `#083344` | Outlines, borders, hard shadows. Never #000.  |
| `--foam`     | `#f0fbff` | Light text on dark panels, light button fill. |
| `--ocean-deep` | `#075985` | Dark panel fill, HUD bars.                  |
| `--sand`     | `#fde68a` | Sandy highlights, hover fills.                |
| `--mustard`  | `#f2b134` | Primary buttons, section labels, rewards.     |
| `--sunset`   | `#f4793b` | Hot accent, main-quest headers.               |
| `--coral`    | `#e76f51` | Secondary accent, quote blocks.               |
| `--tealsurf` | `#2a9d8f` | Seafoam accent, side-quest headers.           |
| `--lime`     | `#a4d92c` | "Cleared" / unlocked status.                  |
| `--navy`     | `#1d3557` | Dark text on light fills, ticker bar.         |

Deep ocean blues come from the animated `WaveCanvas` pixel background that
all pages share. Solid panels float on top of it.

## Typography

- `font-press` — Press Start 2P. The HUD voice: labels, buttons, chips,
  tickers, stat names. Tiny sizes (7–11px), uppercase, tracked.
- `font-pixel` — Pixelify Sans. Page titles and card headings, with hard
  pixel text-shadows (`4px 4px 0 var(--ink)`).
- `font-display` — Titan One. Landing-page headline only.
- Geist — body copy inside panels (readability at paragraph length).
- Retired: Bebas Neue, Newsreader, Pacifico, Permanent Marker, DxBurst.

## Components

- `.pixel-panel` / `.pixel-panel-light` (globals.css) — square corners,
  4px ink border, hard `6px 6px 0` ink shadow; dark ocean fill or cream.
  Never nest panels.
- `.pixel-btn` + `PixelLink`/`PixelButton` (`src/components/game/PixelButton.tsx`)
  — chunky arcade press: hover lifts (−1px, bigger shadow), active slams
  (+3px, shadow collapses), 80ms steps() transitions.
- `StatBar` (`game/StatBar.tsx`) — 12 discrete cells, staggered `.stat-cell`
  pop-in (60ms/cell), `role="meter"`.
- `Seashell` / `Surfboard` / `WaveIcon` / `ShellBullet` (`game/SurfMotifs.tsx`)
  — crispEdges pixel SVG motifs for bullets and labels.
- `WaveBackground` (`game/WaveBackground.tsx`) — the landing page's
  `WaveCanvas` + `SkyLife`, pinned `fixed` behind scrolling content.
- `.game-cursor` — stepped-arrow SVG cursors on fine pointers (ink default,
  sunset over interactive elements).
- `PageShell` — HUD top bar, nav, stage-title header, marquee ticker, footer.

## Layout

- Content in a `max-w-5xl` column of floating panels over open ocean.
- Square corners everywhere; no border-radius on new work.
- Gamified page grammars: quest log (projects), level map (education),
  campaign log (experience), skill tree (skills), trophy room
  (achievements), character sheet (about-me).

## Motion

- Ambient: canvas swell, drifting clouds, sun/moon arc on the shared 90s
  day/night cycle (`dayNight.ts`); `.float-panel` bob on select panels.
- Feedback: steps() and short ease-out transforms only.
- Everything gated behind `prefers-reduced-motion`.
- **Never animate `transform` on route wrappers** (`template.tsx` is
  opacity-only): a transform there becomes the containing block for the
  fixed ocean background and un-pins it from the viewport.

## Bans

- No rounded cards, soft shadows, gradient text, glassmorphism.
- No magazine fonts or tokens (see retired lists above).
- New decorative art is pixel art (crispEdges SVG rects, `PixelSprite`,
  `islandArt`, `decorArt`) — no smooth-vector illustration.
