# ROAD TO DOOMSDAY

> **15 TITLES. ONE TIMELINE. ONE INEVITABLE END.**

A cinematic, classified-archive-styled watch-order guide for 15 Marvel movies/series leading toward *Doomsday*. Built to feel like a secret organization's mission dashboard — not a movie list.

---

## ✅ Currently Completed Features

- **Boot / decrypt loading screen** — terminal-style intro on page load (auto-dismisses, never traps the user)
- **Cinematic hero** — glowing "ROAD TO DOOMSDAY" title, CTA smooth-scrolls to the timeline, live `T-MINUS` clock in the nav, interactive **THREAT LEVEL** chip (click to re-scan through escalating levels)
- **Vertical mission timeline** — all 15 titles rendered from a data file, with sequence nodes, connection line, glowing end node
- **Watch progress (3 states)** — NOT WATCHED → WATCHING → COMPLETED, cycled from the card button or set in the modal; persisted in `localStorage` (`rtd_progress_v1`), no account needed
- **Journey Progress dashboard** — animated `n / 15` progress bar with 15 ticks, %, and escalating status notes
- **YOUR NEXT DESTINATION card** — appears once progress starts; CONTINUE button scrolls to and highlights the next unfinished title; completion state when all 15 are done
- **Timeline unlock effect** — completed entries glow red, the current target glows amber with a "◈ CURRENT TARGET" tag, upcoming entries are dimmed (but always clickable)
- **Detail modal** — poster slot, title, year, type, description, WATCH NOW (new tab), 3-way status toggle; ESC / backdrop / × to close, focus returned to trigger
- **Search + instant filters** — search box plus ALL / MOVIES / SERIES / COMPLETED / REMAINING, with a themed empty state
- **Easter egg** — click the nav logo **5× quickly** → ⚠ SYSTEM BREACH DETECTED overlay with glitch text and screen shake
- **Atmosphere** — film grain, scanline sweep, ember particles, grid, glassmorphism, scroll-reveal animations, `prefers-reduced-motion` respected
- **Fully responsive** — hamburger nav, single-column timeline, full-width filters on mobile; keyboard accessible (cards are focusable, Enter/Space opens modal)

## 🔗 Functional Entry URIs

| Path | Purpose |
|---|---|
| `index.html` | Entire app (single page) |
| `index.html#timeline-section` | Timeline anchor |
| `index.html#progress-section` | Progress dashboard anchor |
| `index.html#about-section` | About anchor |

All 15 external **WATCH NOW** links (nepu.io) open in a new tab and are configured per title in `js/data.js`.

## 🗂 Data Model & Storage

- **`js/data.js`** → `DOOMSDAY_TITLES` array. Each entry: `id, seq, title, year, type, typeNote, desc, link, poster`. Add / remove / reorder titles by editing this array only — UI, filters, and progress adapt automatically.
- **Posters**: `poster: null` renders a cinematic "VISUAL RECORD — CLASSIFIED" placeholder. To use a real poster, drop an image in `images/posters/` and set e.g. `poster: "images/posters/x-men-2000.jpg"`.
- **Progress storage**: browser `localStorage` key `rtd_progress_v1` → `{ [titleId]: "watching" | "completed" }`. No backend, no tables, no auth.

## 📁 Project Structure

```
index.html      — markup: nav, hero, progress, timeline, about, modal, breach overlay
css/style.css   — full cinematic theme + responsive rules
js/data.js      — the 15 titles (edit here)
js/main.js      — rendering, progress, filters, modal, easter egg
```

> Note: The prompt suggested React/TypeScript; this project platform is a static-site sandbox, so the same component-style architecture is delivered as vanilla ES modules-in-IIFE with a clean data layer — zero build step, instant load, identical UX.

## 🚧 Not Yet Implemented

- Real poster artwork (placeholders by design — no copyrighted images used)
- Per-episode tracking for the Loki series
- Shareable progress (export/import or URL-encoded state)
- Sound design (ambient hum / UI blips)

## 💡 Recommended Next Steps

1. Add poster images to `images/posters/` and wire them in `js/data.js`
2. Add an "export/import progress" JSON button
3. Optional Doomsday release-date countdown in the hero
4. More easter eggs (Konami code → variant timeline?)

## 🚀 Deployment

To publish the site, use the **Publish tab** — one click and you'll get the live URL.
