import manifest from '../../../reference/photo-manifest.json';
import type { TouristAttraction } from '../types/TouristAttraction';

export const photoCredits = manifest;

export function sitePhoto(role: string): string {
  const photo = photoCredits.find(photo => photo.role === role);
  if (!photo) throw new Error('Missing site photograph: ' + role);
  return photo.image;
}

/** Preserve uploaded catalogue images; curated defaults use a distinct view. */
export function attractionPhoto(attraction: TouristAttraction, view: 'featured' | 'detail'): string | undefined {
  const list = photoCredits.find(photo => photo.role === 'list-' + attraction.id);
  const alternate = photoCredits.find(photo => photo.role === view + '-' + attraction.id);
  return alternate && attraction.image === list?.image ? alternate.image : attraction.image;
}
