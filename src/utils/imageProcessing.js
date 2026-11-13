import { brand } from '../config/brand.js';

const MAX_SOURCE_SIDE = 1600;     // large phone photos are shrunk to this (saves memory, keeps quality)
export const CROP_WIDTH = 660;    // size of the cropped photo placed on the card (same shape as the frame)
export const CROP_HEIGHT = 810;

/** Pure maths: which part of the source picture fills the photo frame. Easy to test. */
export function computeCropRect(sw, sh, { zoom = 1, focusX = 50, focusY = 30 } = {}, outW = CROP_WIDTH, outH = CROP_HEIGHT) {
  const targetAspect = outW / outH;
  let cw;
  let ch;
  if (sw / sh > targetAspect) {
    ch = sh;
    cw = sh * targetAspect;
  } else {
    cw = sw;
    ch = sw / targetAspect;
  }
  const z = Math.min(3, Math.max(1, zoom));
  cw /= z;
  ch /= z;
  const fx = Math.min(100, Math.max(0, focusX)) / 100;
  const fy = Math.min(100, Math.max(0, focusY)) / 100;
  return { sx: (sw - cw) * fx, sy: (sh - ch) * fy, sw: cw, sh: ch };
}

function loadViaImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
    img.src = url;
  });
}

async function decodeFile(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' }); // respects phone rotation
    } catch (e) { /* fall through to <img> */ }
  }
  return loadViaImageElement(file);
}

/**
 * Decodes the chosen file (this also proves it is a real picture), applies phone rotation,
 * shrinks it, and returns a canvas. Nothing is uploaded anywhere.
 */
export async function loadImageToCanvas(file) {
  let decoded;
  try {
    decoded = await decodeFile(file);
  } catch (e) {
    throw new Error('This file could not be read as a picture. Please choose a different photograph.');
  }
  const w = decoded.width;
  const h = decoded.height;
  if (!w || !h || Math.min(w, h) < brand.limits.minPhotoPixels) {
    if (decoded.close) decoded.close();
    throw new Error(`This photograph is too small. Please use a picture at least ${brand.limits.minPhotoPixels}px wide.`);
  }
  const scale = Math.min(1, MAX_SOURCE_SIDE / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';                       // transparent PNGs get a white background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(decoded, 0, 0, canvas.width, canvas.height);
  if (decoded.close) decoded.close();
  return canvas;
}

/** Cuts the source picture to the photo-frame shape and returns a JPEG data URL for the card. */
export function cropToFrame(sourceCanvas, crop) {
  const r = computeCropRect(sourceCanvas.width, sourceCanvas.height, crop);
  const out = document.createElement('canvas');
  out.width = CROP_WIDTH;
  out.height = CROP_HEIGHT;
  const ctx = out.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, r.sx, r.sy, r.sw, r.sh, 0, 0, CROP_WIDTH, CROP_HEIGHT);
  return out.toDataURL('image/jpeg', 0.92);
}
