import { brand } from '../config/brand.js';

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/** First, cheap checks on the chosen file (type, extension, size). */
export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' };

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const typeOk = ALLOWED_TYPES.includes(file.type);
  // some phones leave file.type empty, so accept a known extension in that case only
  const extOk = ALLOWED_EXTENSIONS.includes(ext);
  if (!(typeOk || (file.type === '' && extOk))) {
    return { ok: false, error: 'This file type is not allowed. Please choose a JPG, PNG or WEBP photograph.' };
  }
  if (file.size === 0) return { ok: false, error: 'This file is empty.' };

  const maxBytes = brand.limits.maxPhotoMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, error: `This photograph is too large. Maximum size is ${brand.limits.maxPhotoMB} MB.` };
  }
  return { ok: true };
}
