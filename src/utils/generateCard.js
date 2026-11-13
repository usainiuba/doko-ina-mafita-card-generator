import { toPng } from 'html-to-image';
import { CARD_WIDTH, CARD_HEIGHT } from '../components/cardSize.js';

const EXPORT_SCALE = 2; // 800 x 504 card -> 1600 x 1008 PNG

async function waitForAssets(node) {
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
  }
  const images = Array.from(node.querySelectorAll('img'));
  await Promise.all(images.map((img) => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    if (img.decode) return img.decode().catch(() => undefined);
    return new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
  }));
  // let the browser finish painting
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function dataUrlToBlob(dataUrl) {
  const [head, body] = dataUrl.split(',');
  const mime = (head.match(/:(.*?);/) || [])[1] || 'image/png';
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Renders the (hidden, full-size) card element to a high-resolution PNG Blob. */
export async function generateCardBlob(node) {
  if (!node) throw new Error('Card is not ready yet.');
  await waitForAssets(node);
  const options = {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    pixelRatio: EXPORT_SCALE,
    cacheBust: false,
    style: { transform: 'none', margin: '0' },
  };
  await toPng(node, options);                 // first pass warms up image/font decoding (needed on iPhone Safari)
  const dataUrl = await toPng(node, options); // second pass is the real export
  return dataUrlToBlob(dataUrl);
}

export function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function canShareImage(blob, filename) {
  try {
    if (!blob || !navigator.canShare || !navigator.share) return false;
    const file = new File([blob], filename, { type: 'image/png' });
    return navigator.canShare({ files: [file] });
  } catch (e) {
    return false;
  }
}

export async function shareImage(blob, filename) {
  const file = new File([blob], filename, { type: 'image/png' });
  await navigator.share({ files: [file], title: 'Doko Ina Mafita Membership Card' });
}
