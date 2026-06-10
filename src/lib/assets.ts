import type { ImageMetadata } from 'astro';
import creditsData from '../data/credits.json';

const map = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

export type Credit = { artist?: string; license?: string; title?: string };
const credits = creditsData as Record<string, Credit>;

/** 按 key(如 "m42-orion")取本地优化图,找不到返回 undefined。 */
export function objImage(key?: string): ImageMetadata | undefined {
  if (!key) return undefined;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const hit = map[`../assets/images/${key}.${ext}`];
    if (hit) return hit.default;
  }
  return undefined;
}

export function objCredit(key?: string): Credit | undefined {
  return key ? credits[key] : undefined;
}
