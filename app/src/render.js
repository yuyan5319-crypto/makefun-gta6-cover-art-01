// The cover painter for Neon Vice Cover Lab.
// Paints, in order: a synthwave backdrop (sky, striped sun, palm silhouettes,
// perspective grid), the photo panels with white comic borders and grading,
// then the title band with a huge bold masthead. Pure Canvas 2D.

import { panelRects, titleBandHeight, clamp } from './panels.js';
import { gradePanel, seededRandom } from './filters.js';

const FONT_STACK = '"Arial Black", "Helvetica Neue", Arial, system-ui, sans-serif';
const SUB_FONT = '"Helvetica Neue", Arial, system-ui, sans-serif';

/** Cover-crop `img` into rect, honouring the panel focus point and zoom. */
function drawPhotoCrop(ctx, img, rect, fx, fy, zoom) {
  const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * zoom;
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  let dx = cx - dw * fx;
  let dy = cy - dh * fy;
  dx = clamp(dx, rect.x + rect.w - dw, rect.x);
  dy = clamp(dy, rect.y + rect.h - dh, rect.y);
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

/** Painted backdrop used behind (and, with no photo, inside) the panels. */
function paintBackdrop(ctx, W, artH, pal) {
  const sky = ctx.createLinearGradient(0, 0, 0, artH);
  sky.addColorStop(0, pal.skyTop);
  sky.addColorStop(0.55, pal.skyMid);
  sky.addColorStop(1, pal.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, artH);

  // Stars in the upper sky.
  const rand = seededRandom(20261);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let i = 0; i < 90; i++) {
    const sx = rand() * W;
    const sy = rand() * artH * 0.34;
    const r = rand() * 1.7 + 0.4;
    ctx.globalAlpha = 0.25 + rand() * 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Striped retro sun sitting on the horizon.
  const sunR = Math.min(W, artH) * 0.30;
  const sunX = W * 0.72;
  const sunY = artH * 0.60;
  const sunGrad = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sunGrad.addColorStop(0, pal.sunCore);
  sunGrad.addColorStop(0.6, pal.sun);
  sunGrad.addColorStop(1, pal.hot);
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = sunGrad;
  ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
  ctx.fillStyle = pal.skyMid;
  let stripeY = sunY + sunR * 0.08;
  let stripeH = sunR * 0.035;
  while (stripeY < sunY + sunR) {
    ctx.globalAlpha = 0.85;
    ctx.fillRect(sunX - sunR, stripeY, sunR * 2, stripeH);
    stripeY += stripeH * 3.1;
    stripeH *= 1.45;
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  // Perspective floor grid below the horizon.
  const horizon = artH * 0.78;
  ctx.strokeStyle = pal.accent;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = Math.max(1.5, W * 0.0016);
  for (let i = 0; i <= 14; i++) {
    const gx = (W / 14) * i;
    ctx.beginPath();
    ctx.moveTo(W / 2 + (gx - W / 2) * 0.24, horizon);
    ctx.lineTo(gx * 1.6 - W * 0.3, artH);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const t = i / 6;
    const gy = horizon + (artH - horizon) * t * t;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  paintPalm(ctx, W * 0.10, horizon, artH * 0.30, pal.deep, 1);
  paintPalm(ctx, W * 0.93, horizon, artH * 0.24, pal.deep, -1);
}

/** A simple palm silhouette: curved trunk plus six fronds. */
function paintPalm(ctx, baseX, baseY, height, colour, lean) {
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineCap = 'round';
  const topX = baseX + lean * height * 0.22;
  const topY = baseY - height;
  ctx.lineWidth = height * 0.055;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.quadraticCurveTo(baseX + lean * height * 0.05, baseY - height * 0.6, topX, topY);
  ctx.stroke();
  ctx.lineWidth = height * 0.028;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (0.08 + i * 0.17);
    const len = height * (0.34 + (i % 2) * 0.08);
    const ex = topX + Math.cos(a) * len * (i < 3 ? -1 : 1) * 0.9 + lean * len * 0.2;
    const ey = topY - Math.sin(a) * len * 0.42 + len * 0.22;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + (ex - topX) * 0.5, topY - len * 0.28, ex, ey);
    ctx.stroke();
  }
  ctx.restore();
}

/** Fit `text` into maxWidth by shrinking the font; returns the size used. */
function fitFont(ctx, text, maxWidth, startSize, weight = 900) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${FONT_STACK}`;
  while (ctx.measureText(text).width > maxWidth && size > 14) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${FONT_STACK}`;
  }
  return size;
}

/** The bottom title band: masthead, subtitle and corner tag. */
function paintTitleBand(ctx, W, H, artH, state, pal) {
  const bandH = H - artH;
  const band = ctx.createLinearGradient(0, artH, 0, H);
  band.addColorStop(0, 'rgba(8,2,18,0.88)');
  band.addColorStop(1, pal.deep);
  ctx.fillStyle = band;
  ctx.fillRect(0, artH, W, bandH);
  ctx.fillStyle = pal.hot;
  ctx.fillRect(0, artH, W, Math.max(4, H * 0.006));

  const title = (state.title || 'NEON VICE').trim().toUpperCase() || 'NEON VICE';
  const maxW = W * 0.92;
  const size = fitFont(ctx, title, maxW, bandH * 0.52);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  // Hard offset shadow in the accent colour, then the white face.
  ctx.fillStyle = pal.accent;
  ctx.fillText(title, W / 2 + size * 0.055, artH + bandH * 0.60 + size * 0.055);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = size * 0.16;
  ctx.fillText(title, W / 2, artH + bandH * 0.60);
  ctx.shadowBlur = 0;

  const sub = (state.subtitle || '').trim().toUpperCase();
  if (sub) {
    ctx.font = `600 ${Math.round(bandH * 0.115)}px ${SUB_FONT}`;
    ctx.fillStyle = pal.sun;
    ctx.fillText(sub, W / 2, artH + bandH * 0.845);
  }

  const tag = (state.tag || '').trim();
  if (tag) {
    const tagText = tag.toUpperCase();
    const tagSize = Math.round(H * 0.016);
    ctx.font = `700 ${tagSize}px ${SUB_FONT}`;
    const tw = ctx.measureText(tagText).width;
    const padX = tagSize * 0.7;
    const padY = tagSize * 0.42;
    const bx = W - W * 0.03 - tw - padX * 2;
    const by = artH - tagSize - padY * 2 - H * 0.012;
    ctx.fillStyle = 'rgba(8,2,18,0.78)';
    ctx.beginPath();
    ctx.roundRect(bx, by, tw + padX * 2, tagSize + padY * 2, tagSize * 0.5);
    ctx.fill();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = Math.max(1.5, H * 0.0016);
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(tagText, bx + padX, by + tagSize + padY);
    ctx.textAlign = 'center';
  }
}

/**
 * Paint the whole cover onto ctx.
 * state: { photo, title, subtitle, tag, layout, palette (object), grade 0..1 }
 */
export function paintCover(ctx, W, H, state) {
  const pal = state.palette;
  const bandH = titleBandHeight(W, H);
  const artH = H - bandH;

  paintBackdrop(ctx, W, artH, pal);

  const rects = panelRects(state.layout, W, H, artH);
  const border = Math.max(5, Math.round(W * 0.007));
  rects.forEach((rect, i) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = W * 0.02;
    ctx.shadowOffsetY = W * 0.008;
    ctx.fillStyle = '#0a0512';
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.restore();

    if (state.photo) {
      drawPhotoCrop(ctx, state.photo, rect, rect.fx, rect.fy, rect.zoom);
    } else {
      // No photo: each panel gets its own slice of the painted backdrop mood.
      const g = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
      g.addColorStop(0, pal.skyMid);
      g.addColorStop(1, i % 2 ? pal.hot : pal.skyLow);
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.globalAlpha = 1;
    }
    gradePanel(ctx, rect, pal, state.grade);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = border;
    ctx.strokeRect(rect.x + border / 2, rect.y + border / 2, rect.w - border, rect.h - border);
    ctx.strokeStyle = 'rgba(10,4,20,0.85)';
    ctx.lineWidth = Math.max(2, border * 0.32);
    ctx.strokeRect(rect.x - border * 0.16, rect.y - border * 0.16, rect.w + border * 0.32, rect.h + border * 0.32);
  });

  paintTitleBand(ctx, W, H, artH, state, pal);
}
