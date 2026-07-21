import fs from 'fs';
import path from 'path';
import { photoMeta, type PhotoMeta } from '@/data/photoMeta';

// Every image in /public/photography, in filename order, merged with any per-photo
// metadata from src/data/photoMeta.ts. Adding a photo = drop a file in the folder —
// no list to maintain. Discovery runs at build time, so new files need a rebuild
// (or a dev-server refresh) to appear.

const PHOTO_DIR = path.join(process.cwd(), 'public', 'photography');
const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

export interface Photo extends PhotoMeta {
  /** Absolute /public URL, e.g. "/photography/DSCF0421.webp" */
  src: string;
  filename: string;
}

export function getPhotos(): Photo[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(PHOTO_DIR).filter((f) => IMAGE_RE.test(f)).sort();
  } catch {
    return [];
  }
  return files
    .map((filename) => ({
      filename,
      src: `/photography/${filename}`,
      ...(photoMeta[filename] ?? {}),
    }))
    // Most recent first; photos without a date sort to the end.
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2025-02-22" → "February 22, 2025" (parsed by parts to avoid timezone drift). */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Camera settings joined for display, e.g. "ISO 100 · f/2.8 · 1/250s · 35mm". */
export function formatSettings(p: Photo): string {
  return [
    p.iso != null ? `ISO ${p.iso}` : null,
    p.aperture,
    p.shutter,
    p.focalLength,
  ]
    .filter(Boolean)
    .join(' · ');
}
