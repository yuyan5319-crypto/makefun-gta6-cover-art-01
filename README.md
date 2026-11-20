# Neon Vice Cover Lab

![live](https://make.fun/badge/gta6-cover-art-01.svg)
![rank](https://make.fun/badge/gta6-cover-art-01/rank.svg)
![reward](https://make.fun/badge/gta6-cover-art-01/reward.svg)

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
