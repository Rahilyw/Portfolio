# 🏄 Rahil's Portfolio — Surf the Archipelago

Personal portfolio of **Rahil Wijeyesekera** — Computer Science student at the
University of Victoria building AI agents, systems tools, and web apps.

The homepage is an interactive pixel-art ocean: each island is a section of the
portfolio (projects, experience, skills, education, achievements, about me).
Click an island to sail there. Inner pages are styled as issues of a fictional
surf magazine, *Surf & Code Quarterly*.

## Highlights

- **Procedural pixel art** — every island, the ship, the surfer, and the splash
  animations are drawn at runtime on `<canvas>` (no sprite image assets), then
  upscaled nearest-neighbor for the chunky retro look.
- **Living scene** — day/night cycle synced to real local time, clouds, a
  banner plane, sea life, and a surfer that follows the cursor (desktop,
  motion-safe only).
- **Synthesized ocean audio** — the wave sound is generated with the Web Audio
  API (filtered noise + LFO swell), no audio files shipped.
- **Accessible by default** — honors `prefers-reduced-motion`, keyboard
  focus states throughout, aria labels on all interactive art.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS 4 · Framer Motion

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes prerender as static)
npm run lint
```

Portfolio content (projects, experience, skills, islands) lives in one place:
[`src/data/content.ts`](src/data/content.ts).

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `master` deploy
automatically. Set `NEXT_PUBLIC_SITE_URL` once a custom domain is attached so
metadata, the sitemap, and robots.txt emit the canonical URL.
