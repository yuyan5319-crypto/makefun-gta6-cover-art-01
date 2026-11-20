// Neon Vice Cover Lab — editor wiring and screenshot scenes.
// Normal mode: a control panel drives a live canvas preview and a PNG export.
// Shot mode (?shot=...): fixed scenes so screenshots are reproducible —
//   ?shot=editor  full editor with a sample photo loaded
//   ?shot=cover   the finished cover only, edge to edge
// Shot params: size=poster|square|wide, photo=pier|boulevard,
// title=..., layout=hero|quad|tri, palette=sunset|neon|gold.

import { paintCover } from './render.js';
import { paletteOf } from './filters.js';

export const SIZES = {
  poster: { w: 1080, h: 1350, label: 'Poster 1080x1350' },
  square: { w: 1080, h: 1080, label: 'Square 1080x1080' },
  wide: { w: 1920, h: 1080, label: 'Wide 1920x1080' },
};

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const state = {
  photo: null,
  title: 'Neon Vice',
  subtitle: 'One city. One night. No brakes.',
  tag: 'Cover Lab Ed.',
  layout: 'hero',
  paletteName: 'sunset',
  grade: 0.7,
  size: 'poster',
};

function currentSize() { return SIZES[state.size] ?? SIZES.poster; }

export function redraw() {
  const { w, h } = currentSize();
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  paintCover(ctx, w, h, {
    photo: state.photo,
    title: state.title,
    subtitle: state.subtitle,
    tag: state.tag,
    layout: state.layout,
    palette: paletteOf(state.paletteName),
    grade: state.grade,
  });
}

export function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });
}

async function useSample(name, noteEl) {
  state.photo = await loadImageFromUrl(`samples/${name}.jpg`);
  if (noteEl) noteEl.textContent = `Sample photo loaded: ${name}.jpg`;
  redraw();
}

function wireEditor() {
  const photoName = document.getElementById('photoName');
  const status = document.getElementById('status');

  document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    state.photo = await loadImageFromUrl(url);
    photoName.textContent = `Your photo: ${file.name}`;
    redraw();
  });

  document.querySelectorAll('[data-sample]').forEach((btn) => {
    btn.addEventListener('click', () => useSample(btn.dataset.sample, photoName));
  });

  const bindText = (id, key) => {
    document.getElementById(id).addEventListener('input', (e) => {
      state[key] = e.target.value;
      redraw();
    });
  };
  bindText('titleInput', 'title');
  bindText('subInput', 'subtitle');
  bindText('tagInput', 'tag');

  document.getElementById('layoutSelect').addEventListener('change', (e) => {
    state.layout = e.target.value;
    redraw();
  });
  document.getElementById('paletteSelect').addEventListener('change', (e) => {
    state.paletteName = e.target.value;
    redraw();
  });
  const gradeInput = document.getElementById('gradeInput');
  const gradeVal = document.getElementById('gradeVal');
  gradeInput.addEventListener('input', () => {
    state.grade = Number(gradeInput.value) / 100;
    gradeVal.textContent = `${gradeInput.value}%`;
    redraw();
  });

  document.querySelectorAll('[data-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.size = btn.dataset.size;
      document.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('is-on', b === btn));
      redraw();
    });
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const { w, h } = currentSize();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `neon-vice-cover-${w}x${h}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      status.textContent = `Saved neon-vice-cover-${w}x${h}.png`;
    }, 'image/png');
  });
}

/** Apply ?shot= scene params to state, then paint. Sets window.__shotReady. */
async function runShotMode(params) {
  const shot = params.get('shot');
  state.size = SIZES[params.get('size')] ? params.get('size') : 'poster';
  if (params.get('title')) state.title = params.get('title');
  if (params.get('subtitle')) state.subtitle = params.get('subtitle');
  if (params.get('layout')) state.layout = params.get('layout');
  if (params.get('palette')) state.paletteName = params.get('palette');
  if (params.get('grade')) state.grade = Math.min(1, Math.max(0, Number(params.get('grade')) / 100));

  const photoName = params.get('photo') ?? 'pier';
  state.photo = await loadImageFromUrl(`samples/${photoName}.jpg`);

  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const holder = document.createElement('div');
    holder.className = 'shot-stage';
    holder.appendChild(canvas);
    document.body.appendChild(holder);
  } else {
    // Editor scene: reflect the loaded scene in the controls too.
    document.getElementById('titleInput').value = state.title;
    document.getElementById('subInput').value = state.subtitle;
    document.getElementById('photoName').textContent = `Sample photo loaded: ${photoName}.jpg`;
    document.querySelectorAll('[data-size]').forEach((b) =>
      b.classList.toggle('is-on', b.dataset.size === state.size));
  }
  redraw();
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}

const params = new URLSearchParams(location.search);
if (params.get('shot')) {
  runShotMode(params);
} else {
  wireEditor();
  redraw();
}
