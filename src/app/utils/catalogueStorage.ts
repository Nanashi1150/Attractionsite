import type { TouristAttraction } from '../types/TouristAttraction';
import { safeExternalUrl, safeImageSource, MAX_DATA_IMAGE_LENGTH } from './contentSafety';

// Keep the existing key so stored visitor edits are retained across this update.
export const CATALOGUE_STORAGE_KEY = 'kamphaeng-phet.attractions.v2';
export const MAX_ATTRACTIONS = 100;
export const MAX_CATALOGUE_LENGTH = 4_000_000;
const textLimits = {
  nameTh: 200, descriptionTh: 10_000, openHoursTh: 500, feeLabel: 500,
  feeLabelTh: 500, address: 500, addressTh: 500, mapsQuery: 500,
  sourceName: 200, phone: 80, visitTip: 2_000, visitTipTh: 2_000,
} as const;
const categories = new Set(['Historical Site', 'Temple', 'National Park', 'Museum', 'Natural Attraction', 'Cultural Site']);

function boundedText(value: unknown, min: number, max: number): value is string {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return false;
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (character.length === 1 && code >= 0xd800 && code <= 0xdfff) return false;
  }
  return true;
}

export function normalizeAttraction(value: unknown): TouristAttraction | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (!Number.isSafeInteger(raw.id) || (raw.id as number) < 1 ||
      !boundedText(raw.name, 1, 200) || !boundedText(raw.place_description, 20, 10_000) ||
      !boundedText(raw.open_hours, 1, 500) || typeof raw.entrance_fee !== 'number' ||
      !Number.isFinite(raw.entrance_fee) || raw.entrance_fee < 0 || raw.entrance_fee > 1_000_000) return null;
  const result: TouristAttraction = {
    id: raw.id as number, name: raw.name.trim(), place_description: raw.place_description.trim(),
    open_hours: raw.open_hours.trim(), entrance_fee: raw.entrance_fee,
  };
  for (const [key, max] of Object.entries(textLimits)) {
    const text = raw[key];
    if (text === undefined) continue;
    if (!boundedText(text, 0, max)) return null;
    Object.assign(result, { [key]: text.trim() });
  }
  if (raw.category !== undefined) {
    if (typeof raw.category !== 'string' || !categories.has(raw.category)) return null;
    result.category = raw.category;
  }
  if (raw.rating !== undefined) {
    if (typeof raw.rating !== 'number' || !Number.isFinite(raw.rating) || raw.rating < 0 || raw.rating > 5) return null;
    result.rating = raw.rating;
  }
  if (raw.sourceUrl !== undefined && raw.sourceUrl !== '') {
    const url = safeExternalUrl(raw.sourceUrl);
    if (!url) return null;
    result.sourceUrl = url;
  }
  if (raw.image !== undefined && raw.image !== '') {
    if (typeof raw.image !== 'string' || raw.image.length > MAX_DATA_IMAGE_LENGTH) return null;
    const image = safeImageSource(raw.image);
    if (!image) return null;
    result.image = image;
  }
  return result;
}

export function normalizeCatalogue(value: unknown): TouristAttraction[] | null {
  if (!Array.isArray(value) || value.length > MAX_ATTRACTIONS) return null;
  const result: TouristAttraction[] = [];
  const ids = new Set<number>();
  for (const item of value) {
    const attraction = normalizeAttraction(item);
    if (!attraction || ids.has(attraction.id)) return null;
    ids.add(attraction.id);
    result.push(attraction);
  }
  return result;
}

export function parseStoredCatalogue(raw: string | null): TouristAttraction[] | null {
  if (raw === null || raw.length > MAX_CATALOGUE_LENGTH) return null;
  try { return normalizeCatalogue(JSON.parse(raw)); } catch { return null; }
}
