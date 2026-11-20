[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/yuyan5319-crypto/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/yuyan5319-crypto/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

# Neon Vice Cover Lab

A GTA-style cover art maker that runs entirely offline in the browser.
Drop in one photo and the lab rebuilds it as a multi-panel, vice-city
game cover: comic-style photo panels over a painted sunset backdrop with
a striped retro sun, palm silhouettes and a perspective grid, all graded
in neon sunset colours and finished with a huge bold masthead.

## How to play

1. Open `app/index.html` (or serve it with `node serve.ts`).
2. Load a photo — your own file, or one of the two bundled samples
   (The Pier, Boulevard).
3. Type your cover title, subtitle and corner tag.
4. Pick a panel layout (Hero + duo, Quad grid, or Triptych), a colour
   mood (Vice Sunset, Midnight Neon, Golden Hour) and the grade strength.
5. Choose an export size — Poster 1080x1350, Square 1080x1080 or
   Wide 1920x1080 — and hit **Export PNG**.

Every control repaints the cover live on a Canvas 2D stage. Each panel
crops the same photo differently (wide establishing shot, tight detail
crops) and gets its own warm wash, mood gradient, scanlines and vignette,
so a single snapshot turns into box art that looks shot on location.

## Export sizes

Neon Vice Cover Lab exports your finished cover in three ready-to-use sizes. Poster 1080×1350 is the tall portrait format for classic box art and phone sharing, Square 1080×1080 is balanced for social feeds, and Wide 1920×1080 stretches the scene for banners and desktop wallpapers. Pick a size before export and the layout, panels and masthead are recomposed to fit that frame.

## Layout of this repo

- `app/` — the web app: `index.html`, `style.css`, and ES modules under
  `app/src/` (`lab.js` wiring + screenshot scenes, `render.js` the cover
  painter, `panels.js` panel geometry, `filters.js` palettes and grading).
  Sample photos live in `app/samples/`.
- `screenshots/` — renders of the app; the first by name is the cover.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  the output directory and writes `dossier.json`.
- `serve.ts` — tiny local static server for trying the app.

No Rockstar artwork, logos or fonts are used; all type is set in system
fonts and every visual is drawn or generated locally.
