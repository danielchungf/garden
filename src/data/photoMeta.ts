export interface PhotoMeta {
  /** Where it was taken, e.g. "Amsterdam, Netherlands" */
  location?: string;
  /** Capture date as ISO "YYYY-MM-DD" (from EXIF DateTimeOriginal) */
  date?: string;
  iso?: number;
  aperture?: string; // "f/2.8"
  shutter?: string; // "1/250s"
  focalLength?: string; // "35mm"
  camera?: string;
  lens?: string;
}

// Per-photo metadata, keyed by filename in /public/photography. Everything is optional —
// a photo with no entry shows no hover overlay. Camera settings + date are parsed from
// each file's original EXIF (real); location is added by hand (the files have no GPS).
export const photoMeta: Record<string, PhotoMeta> = {
  // Amsterdam, Netherlands (Feb 2025)
  'DSCF3061.jpg': { location: 'Amsterdam, Netherlands', date: '2025-02-22', iso: 8000, aperture: 'f/4.5', shutter: '1/60s', focalLength: '44mm', camera: 'Fujifilm X-T5', lens: 'XF16-50mmF2.8-4.8 R LM WR' },
  'DSCF3023.jpg': { location: 'Amsterdam, Netherlands', date: '2025-02-22', iso: 1600, aperture: 'f/3.5', shutter: '1/40s', focalLength: '25mm', camera: 'Fujifilm X-T5', lens: 'XF16-50mmF2.8-4.8 R LM WR' },
  'DSCF3059.jpg': { location: 'Amsterdam, Netherlands', date: '2025-02-22', iso: 4000, aperture: 'f/3.8', shutter: '1/50s', focalLength: '32mm', camera: 'Fujifilm X-T5', lens: 'XF16-50mmF2.8-4.8 R LM WR' },
  'DSCF3092.jpg': { location: 'Amsterdam, Netherlands', date: '2025-02-23', iso: 500, aperture: 'f/5.6', shutter: '1/1000s', focalLength: '21mm', camera: 'Fujifilm X-T5', lens: 'XF16-50mmF2.8-4.8 R LM WR' },

  // Colonial Beach, United States (Nov 2024)
  'DSCF2245.jpg': { location: 'Colonial Beach, United States', date: '2024-11-28', iso: 250, aperture: 'f/5.6', shutter: '1/550s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2257.jpg': { location: 'Colonial Beach, United States', date: '2024-11-28', iso: 250, aperture: 'f/3.6', shutter: '1/240s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2270.jpg': { location: 'Colonial Beach, United States', date: '2024-11-28', iso: 250, aperture: 'f/3.2', shutter: '1/180s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2292.jpg': { location: 'Colonial Beach, United States', date: '2024-11-29', iso: 500, aperture: 'f/5.6', shutter: '1/1800s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2334.jpg': { location: 'Colonial Beach, United States', date: '2024-11-30', iso: 500, aperture: 'f/5.6', shutter: '1/750s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2340.jpg': { location: 'Colonial Beach, United States', date: '2024-11-30', iso: 500, aperture: 'f/5.6', shutter: '1/900s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2353.jpg': { location: 'Colonial Beach, United States', date: '2024-11-30', iso: 500, aperture: 'f/3.6', shutter: '1/250s', focalLength: '35mm', camera: 'Fujifilm X-T5' },

  // Washington, DC, United States (Jan & Mar 2025)
  'DSCF2387.jpg': { location: 'Washington, DC, United States', date: '2025-01-11', iso: 125, aperture: 'f/5.6', shutter: '1/680s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2412.jpg': { location: 'Washington, DC, United States', date: '2025-01-11', iso: 500, aperture: 'f/8', shutter: '1/3800s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF3493.jpg': { location: 'Washington, DC, United States', date: '2025-03-22', iso: 500, aperture: 'f/5.6', shutter: '1/1600s', focalLength: '28mm', camera: 'Fujifilm X-T5' },

  // Edinburgh, Scotland (Feb 2025)
  'DSCF2706.jpg': { location: 'Edinburgh, Scotland', date: '2025-02-17', iso: 500, aperture: 'f/5.6', shutter: '1/240s', focalLength: '50mm', camera: 'Fujifilm X-T5' },
  'DSCF2709.jpg': { location: 'Edinburgh, Scotland', date: '2025-02-17', iso: 500, aperture: 'f/5.6', shutter: '1/250s', focalLength: '16mm', camera: 'Fujifilm X-T5' },
  'DSCF2740.jpg': { location: 'Edinburgh, Scotland', date: '2025-02-17', iso: 500, aperture: 'f/5', shutter: '1/125s', focalLength: '24mm', camera: 'Fujifilm X-T5' },
  'DSCF2756.jpg': { location: 'Edinburgh, Scotland', date: '2025-02-17', iso: 2500, aperture: 'f/4', shutter: '1/45s', focalLength: '36mm', camera: 'Fujifilm X-T5' },
  'DSCF2787.jpg': { location: 'Edinburgh, Scotland', date: '2025-02-18', iso: 500, aperture: 'f/5.6', shutter: '1/210s', focalLength: '28mm', camera: 'Fujifilm X-T5' },

  // London, England (Feb 2025)
  'DSCF2687.jpg': { location: 'London, England', date: '2025-02-15', iso: 1250, aperture: 'f/4.8', shutter: '1/70s', focalLength: '49mm', camera: 'Fujifilm X-T5' },
  'DSCF3184.jpg': { location: 'London, England', date: '2025-02-27', iso: 500, aperture: 'f/5.6', shutter: '1/1500s', focalLength: '18mm', camera: 'Fujifilm X-T5' },
  'DSCF3232.jpg': { location: 'London, England', date: '2025-02-27', iso: 500, aperture: 'f/5.6', shutter: '1/1900s', focalLength: '50mm', camera: 'Fujifilm X-T5' },
  'DSCF3317.jpg': { location: 'London, England', date: '2025-02-27', iso: 500, aperture: 'f/5.6', shutter: '1/680s', focalLength: '42mm', camera: 'Fujifilm X-T5' },
  'DSCF3349.jpg': { location: 'London, England', date: '2025-02-28', iso: 500, aperture: 'f/5.6', shutter: '1/2200s', focalLength: '50mm', camera: 'Fujifilm X-T5' },
  'DSCF3413.jpg': { location: 'London, England', date: '2025-02-28', iso: 500, aperture: 'f/6.4', shutter: '1/2000s', focalLength: '50mm', camera: 'Fujifilm X-T5' },
  'DSCF3433.jpg': { location: 'London, England', date: '2025-02-28', iso: 500, aperture: 'f/6.4', shutter: '1/2200s', focalLength: '21mm', camera: 'Fujifilm X-T5' },

  // New York City, United States (Nov 2024)
  'DSCF2149.jpg': { location: 'New York City, United States', date: '2024-11-02', iso: 500, aperture: 'f/5.6', shutter: '1/2400s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2152.jpg': { location: 'New York City, United States', date: '2024-11-02', iso: 500, aperture: 'f/6.4', shutter: '1/2500s', focalLength: '35mm', camera: 'Fujifilm X-T5' },

  // Dameron, United States (Nov 2025)
  'DSCF4484.jpg': { location: 'Dameron, United States', date: '2025-11-28', iso: 125, aperture: 'f/5.6', shutter: '1/350s', focalLength: '36mm', camera: 'Fujifilm X-T5' },
  'DSCF4522.jpg': { location: 'Dameron, United States', date: '2025-11-28', iso: 500, aperture: 'f/5', shutter: '1/240s', focalLength: '16mm', camera: 'Fujifilm X-T5' },
  'DSCF4534.jpg': { location: 'Dameron, United States', date: '2025-11-28', iso: 500, aperture: 'f/5.6', shutter: '1/480s', focalLength: '25mm', camera: 'Fujifilm X-T5' },

  // San Francisco, United States (Jan & May 2025)
  'DSCF2510.jpg': { location: 'San Francisco, United States', date: '2025-01-16', iso: 1600, aperture: 'f/2', shutter: '1/50s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2580.jpg': { location: 'San Francisco, United States', date: '2025-01-16', iso: 500, aperture: 'f/3.6', shutter: '1/180s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2586.jpg': { location: 'San Francisco, United States', date: '2025-01-16', iso: 500, aperture: 'f/5', shutter: '1/340s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2612.jpg': { location: 'San Francisco, United States', date: '2025-01-16', iso: 500, aperture: 'f/5.6', shutter: '1/640s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF2662.jpg': { location: 'San Francisco, United States', date: '2025-01-19', iso: 500, aperture: 'f/2.8', shutter: '1/110s', focalLength: '35mm', camera: 'Fujifilm X-T5' },
  'DSCF3694.jpg': { location: 'San Francisco, United States', date: '2025-05-08', iso: 500, aperture: 'f/5.6', shutter: '1/1900s', focalLength: '40mm', camera: 'Fujifilm X-T5' },
  'DSCF3741.jpg': { location: 'San Francisco, United States', date: '2025-05-08', iso: 500, aperture: 'f/6.4', shutter: '1/3000s', focalLength: '20mm', camera: 'Fujifilm X-T5' },

  // Yosemite, United States (May 2025)
  'DSCF3556.jpg': { location: 'Yosemite, United States', date: '2025-05-03', iso: 500, aperture: 'f/5.6', shutter: '1/1800s', focalLength: '31mm', camera: 'Fujifilm X-T5' },
};
