// Panel geometry for Neon Vice Cover Lab.
// A cover is a comic-style stack of photo panels floating over a painted
// backdrop. Each layout returns rectangles in canvas pixels plus a "focus"
// hint per panel (where the interesting part of the photo should sit) and a
// zoom factor, so the same photograph reads differently in every panel —
// wide establishing shot up top, tight crops below, like real box art.

/** Clamp helper kept local so this module has no imports at all. */
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

/**
 * Build the panel rectangles for a layout.
 * @param {string} layout  'hero' | 'quad' | 'tri'
 * @param {number} W canvas width
 * @param {number} H canvas height
 * @param {number} artH height of the panel area (title band excluded)
 * @returns {Array<{x:number,y:number,w:number,h:number,fx:number,fy:number,zoom:number}>}
 */
export function panelRects(layout, W, H, artH) {
  const gap = Math.round(W * 0.016);
  const pad = Math.round(W * 0.028);
  const innerW = W - pad * 2;
  const innerH = artH - pad * 2;
  const top = pad;
  const left = pad;

  if (layout === 'quad') {
    const cw = (innerW - gap) / 2;
    const ch = (innerH - gap) / 2;
    return [
      { x: left, y: top, w: cw, h: ch, fx: 0.3, fy: 0.35, zoom: 1.05 },
      { x: left + cw + gap, y: top, w: cw, h: ch, fx: 0.7, fy: 0.3, zoom: 1.25 },
      { x: left, y: top + ch + gap, w: cw, h: ch, fx: 0.65, fy: 0.65, zoom: 1.3 },
      { x: left + cw + gap, y: top + ch + gap, w: cw, h: ch, fx: 0.35, fy: 0.6, zoom: 1.1 },
    ];
  }

  if (layout === 'tri') {
    const tallW = innerW * 0.52;
    const sideW = innerW - tallW - gap;
    const sideH = (innerH - gap) / 2;
    return [
      { x: left, y: top, w: tallW, h: innerH, fx: 0.42, fy: 0.4, zoom: 1.08 },
      { x: left + tallW + gap, y: top, w: sideW, h: sideH, fx: 0.6, fy: 0.3, zoom: 1.35 },
      { x: left + tallW + gap, y: top + sideH + gap, w: sideW, h: sideH, fx: 0.5, fy: 0.7, zoom: 1.2 },
    ];
  }

  // 'hero' (default): one cinematic panel, two detail panels underneath.
  const heroH = innerH * 0.62;
  const duoH = innerH - heroH - gap;
  const duoW = (innerW - gap) / 2;
  return [
    { x: left, y: top, w: innerW, h: heroH, fx: 0.5, fy: 0.38, zoom: 1.0 },
    { x: left, y: top + heroH + gap, w: duoW, h: duoH, fx: 0.28, fy: 0.55, zoom: 1.45 },
    { x: left + duoW + gap, y: top + heroH + gap, w: duoW, h: duoH, fx: 0.74, fy: 0.5, zoom: 1.45 },
  ];
}

/** Title band height for a canvas: taller on portrait art, slimmer on wide. */
export function titleBandHeight(W, H) {
  const ratio = H / W;
  if (ratio > 1.1) return Math.round(H * 0.185);
  if (ratio < 0.8) return Math.round(H * 0.21);
  return Math.round(H * 0.20);
}

export { clamp };
