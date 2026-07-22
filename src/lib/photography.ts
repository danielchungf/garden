import fs from 'fs';
import path from 'path';
import { photoMeta } from '@/data/photoMeta';
import { readPhotoExif, formatShutter, formatFStop, formatFocal, type PhotoExif } from '@/lib/photo-exif';

// Every image in /public/photography, in capture-date order (newest first), with camera/
// settings/date read from each file's original EXIF at build time and `location` merged in
// from src/data/photoMeta.ts. Adding a photo = drop a file in the folder — no list to
// maintain. Discovery runs at build time, so new files need a rebuild (or dev refresh).

const PHOTO_DIR = path.join(process.cwd(), 'public', 'photography');
const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

export interface Photo {
  /** Absolute /public URL, e.g. "/photography/DSCF0421.jpg" */
  src: string;
  filename: string;
  /** Filename without extension — the permalink slug, e.g. "DSCF0421" */
  slug: string;
  /** Where it was taken (hand-added; not in EXIF). */
  location?: string;
  /** Camera/lens/settings/date read from the original file's EXIF. */
  exif: PhotoExif;
}

async function loadPhotos(): Promise<Photo[]> {
  let files: string[] = [];
  try {
    files = fs.readdirSync(PHOTO_DIR).filter((f) => IMAGE_RE.test(f)).sort();
  } catch {
    return [];
  }
  const photos = await Promise.all(
    files.map(async (filename) => ({
      filename,
      slug: filename.replace(/\.[^.]+$/, ''),
      src: `/photography/${filename}`,
      location: photoMeta[filename]?.location,
      exif: await readPhotoExif(filename),
    })),
  );
  // Most recent first, by EXIF capture time.
  return photos.sort((a, b) => b.exif.capturedAt.localeCompare(a.exif.capturedAt));
}

// EXIF is read from every file on each call, which is wasteful across the many pages
// generated at build. Cache the result during a production build (files don't change
// mid-build); stay uncached in dev so newly dropped photos appear on refresh.
let cache: Promise<Photo[]> | null = null;

export function getPhotos(): Promise<Photo[]> {
  if (process.env.NODE_ENV === 'production') {
    if (!cache) cache = loadPhotos();
    return cache;
  }
  return loadPhotos();
}

/** Look up a single photo by its permalink slug (filename without extension). */
export async function getPhotoBySlug(slug: string): Promise<Photo | undefined> {
  return (await getPhotos()).find((p) => p.slug === slug);
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
  const e = p.exif;
  const fstop = formatFStop(e.fNumber);
  // Display convention adds a trailing "s" to fractional shutter speeds (1/250 → 1/250s);
  // the feed keeps the bare spec form.
  const shutter = formatShutter(e.exposureTime);
  return [
    e.iso != null ? `ISO ${e.iso}` : null,
    fstop ? `f/${fstop}` : null,
    shutter ? (shutter.startsWith('1/') ? `${shutter}s` : shutter) : null,
    formatFocal(e.focalLength),
  ]
    .filter(Boolean)
    .join(' · ');
}
