// Colour moods and per-panel grading for Neon Vice Cover Lab.
// Everything is painted with plain Canvas 2D gradients and composite modes —
// no external filters, no shaders — so the lab runs fully offline.

/** The three moods. All colours are hand-picked hex values. */
export const PALETTES = {
  sunset: {
    label: 'Vice Sunset',
    skyTop: '#1b0533', skyMid: '#6d1049', skyLow: '#ff5e3a',
    sun: '#ffd23f', sunCore: '#fff3b0',
    hot: '#ff2e88', accent: '#22d3ee', deep: '#0d0616',
    gradeTop: 'rgba(43, 8, 84, 0.00)', gradeBottom: 'rgba(255, 46, 100, 0.55)',
    warm: 'rgba(255, 122, 61, 0.20)',
  },
  neon: {
    label: 'Midnight Neon',
    skyTop: '#020617', skyMid: '#0e2a5c', skyLow: '#7c3aed',
    sun: '#22d3ee', sunCore: '#a5f3fc',
    hot: '#22d3ee', accent: '#ff2e88', deep: '#01030a',
    gradeTop: 'rgba(2, 10, 40, 0.05)', gradeBottom: 'rgba(34, 211, 238, 0.42)',
    warm: 'rgba(124, 58, 237, 0.18)',
  },
  gold: {
    label: 'Golden Hour',
    skyTop: '#2b1608', skyMid: '#8a4b12', skyLow: '#f59e0b',
    sun: '#fde68a', sunCore: '#fffbeb',
    hot: '#f97316', accent: '#facc15', deep: '#170b02',
    gradeTop: 'rgba(60, 30, 4, 0.00)', gradeBottom: 'rgba(249, 115, 22, 0.45)',
    warm: 'rgba(253, 224, 71, 0.22)',
  },
};

export function paletteOf(name) {
  return PALETTES[name] ?? PALETTES.sunset;
}

/**
 * Grade one already-drawn photo panel: warm wash, mood gradient rising from
 * the bottom edge, a whisper of scanlines and a soft vignette. `strength`
 * is 0..1 from the editor slider.
 */
export function gradePanel(ctx, rect, pal, strength) {
  const { x, y, w, h } = rect;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (strength > 0) {
    ctx.globalAlpha = strength;
    ctx.fillStyle = pal.warm;
    ctx.fillRect(x, y, w, h);

    const g = ctx.createLinearGradient(0, y + h * 0.25, 0, y + h);
    g.addColorStop(0, pal.gradeTop);
    g.addColorStop(1, pal.gradeBottom);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;

    // Scanlines: cheap CRT flavour, every 5 device pixels.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
    for (let ly = y + 2; ly < y + h; ly += 5) ctx.fillRect(x, ly, w, 1);

    // Vignette corners.
    const v = ctx.createRadialGradient(
      x + w / 2, y + h / 2, Math.min(w, h) * 0.42,
      x + w / 2, y + h / 2, Math.max(w, h) * 0.78,
    );
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, `rgba(5,0,12,${0.34 * strength})`);
    ctx.fillStyle = v;
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

/** Deterministic pseudo-random generator so backdrops never flicker. */
export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
