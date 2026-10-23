export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const MAX_DATA_IMAGE_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 64;

/** URL schemes are validated at both the storage and rendering boundaries. */
export function safeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length > 2048 || /[\u0000-\u001f\u007f]/.test(value)) return;
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) return;
    return url.href;
  } catch { return; }
}

export function matchesImageSignature(mime: string, bytes: Uint8Array): boolean {
  if (mime === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n);
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === 'image/gif') return ['GIF87a', 'GIF89a'].includes(String.fromCharCode(...bytes.slice(0, 6)));
  if (mime === 'image/webp') return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  return false;
}

export function safeImageSource(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length > MAX_DATA_IMAGE_LENGTH) return;
  const source = value.trim();
  if (/^\/images\/[a-z\d][a-z\d._-]*\.(?:png|jpe?g|webp|gif)$/i.test(source)) return source;
  if (!source.startsWith('data:')) return safeExternalUrl(source);
  const comma = source.indexOf(',');
  const header = source.slice(0, comma);
  if (!/^data:image\/(?:png|jpeg|webp|gif);base64$/.test(header)) return;
  const payload = source.slice(comma + 1);
  if (payload.length < 16 || payload.length % 4 !== 0 || !/^[A-Za-z\d+/]*={0,2}$/.test(payload)) return;
  const decodedSize = payload.length / 4 * 3 - (payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0);
  if (decodedSize > MAX_IMAGE_BYTES) return;
  try {
    const prefix = atob(payload.slice(0, 64));
    const bytes = Uint8Array.from(prefix, c => c.charCodeAt(0));
    const mime = header.slice(5, -7);
    if (matchesImageSignature(mime, bytes)) return source;
  } catch { return; }
}
