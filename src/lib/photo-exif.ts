import fs from 'fs';
import path from 'path';
import exifr from 'exifr';

// Reads EXIF from the ORIGINAL image files in public/photography at build time. This is the
// single source of camera/lens/settings/date for the whole site — the gallery, the photo
// pages, and the OpenFeed JSON feed all consume it, so nothing is hand-maintained or can
// drift. (Only `location` is added by hand, in src/data/photoMeta.ts — it's not in EXIF.)

const PHOTO_DIR = path.join(process.cwd(), 'public', 'photography');

const EXIF_TAGS = [
  'Make',
  'Model',
  'LensModel',
  'ExposureTime',
  'FNumber',
  'ISO',
  'FocalLength',
  'DateTimeOriginal',
] as const;

interface RawExif {
  Make?: string;
  Model?: string;
  LensModel?: string;
  ExposureTime?: number;
  FNumber?: number;
  ISO?: number;
  FocalLength?: number;
  /** Raw EXIF string "YYYY:MM:DD HH:MM:SS" (no timezone). */
  DateTimeOriginal?: string;
}

/** Normalized EXIF for one photo. Camera/lens are display strings; the rest are raw values
 *  each consumer formats to taste. `capturedAt` is always present (file-date fallback). */
export interface PhotoExif {
  camera?: string; // "Fujifilm X-T5"
  lens?: string; // "XF35mmF2 R WR"
  iso?: number; // 500
  fNumber?: number; // 5.6
  exposureTime?: number; // seconds, e.g. 0.00111
  focalLength?: number; // mm, e.g. 35
  /** RFC 3339 capture timestamp: EXIF DateTimeOriginal, or the file's mtime as a fallback. */
  capturedAt: string;
  /** Date portion of capturedAt for display, "2026-02-21". */
  date: string;
}

// "FUJIFILM" + "X-T5" -> "Fujifilm X-T5" (avoids doubling the make into the model).
function formatCamera(make?: string, model?: string): string | undefined {
  const model_ = model?.trim();
  const nice = make?.trim() ? make.trim().charAt(0).toUpperCase() + make.trim().slice(1).toLowerCase() : '';
  if (!model_) return nice || undefined;
  if (!nice) return model_;
  return model_.toLowerCase().startsWith(nice.toLowerCase()) ? model_ : `${nice} ${model_}`;
}

// "2026:02:14 20:11:37" -> "2026-02-14T20:11:37Z". EXIF has no timezone, so the camera's
// wall-clock is emitted as-is with a Z suffix — deterministic regardless of build machine
// timezone (exifr's revived Date would shift by the builder's local offset).
function exifDateToRfc3339(raw?: string): string | undefined {
  if (!raw) return undefined;
  const m = raw.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return undefined;
  const [, y, mo, d, h, mi, s] = m;
  return `${y}-${mo}-${d}T${h}:${mi}:${s}Z`;
}

const num = (v: unknown): number | undefined =>
  typeof v === 'number' && isFinite(v) ? v : undefined;

/** Read and normalize EXIF for a single file in public/photography. */
export async function readPhotoExif(filename: string): Promise<PhotoExif> {
  const filePath = path.join(PHOTO_DIR, filename);
  let raw: RawExif = {};
  try {
    // Read the file ourselves and hand exifr a Buffer — its own Node file-reader relies on
    // fs.promises.open, which doesn't survive the bundler's server build. reviveValues:false
    // keeps DateTimeOriginal as the raw "YYYY:MM:DD HH:MM:SS" string.
    const buf = fs.readFileSync(filePath);
    raw = (await exifr.parse(buf, { reviveValues: false, pick: EXIF_TAGS as unknown as string[] })) ?? {};
  } catch {
    raw = {};
  }

  const capturedAt =
    exifDateToRfc3339(raw.DateTimeOriginal) ??
    fs.statSync(filePath).mtime.toISOString().replace(/\.\d{3}Z$/, 'Z');

  return {
    camera: formatCamera(raw.Make, raw.Model),
    lens: raw.LensModel?.trim() || undefined,
    iso: num(raw.ISO),
    fNumber: num(raw.FNumber),
    exposureTime: num(raw.ExposureTime),
    focalLength: num(raw.FocalLength),
    capturedAt,
    date: capturedAt.slice(0, 10),
  };
}

// Shutter for display, spec-style: 0.00111 -> "1/900"; 1.3 -> "1.3s"; 2 -> "2s".
export function formatShutter(t?: number): string | undefined {
  if (t == null || !isFinite(t) || t <= 0) return undefined;
  if (t >= 1) return `${Number.isInteger(t) ? t : t.toFixed(1)}s`;
  return `1/${Math.round(1 / t)}`;
}

// Aperture, one decimal max: 5.6 -> "5.6".
export function formatFStop(f?: number): string | undefined {
  if (f == null || !isFinite(f) || f <= 0) return undefined;
  return String(Math.round(f * 10) / 10);
}

// Focal length: 35 -> "35mm".
export function formatFocal(mm?: number): string | undefined {
  if (mm == null || !isFinite(mm) || mm <= 0) return undefined;
  return `${Math.round(mm)}mm`;
}
