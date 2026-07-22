// Per-photo location, keyed by filename in /public/photography. This is the ONE thing not
// in the files' EXIF (the camera records no GPS), so it's added by hand. Everything else —
// camera, lens, settings, date — is read from each file's original EXIF at build time (see
// src/lib/photo-exif.ts), so it never drifts and needs no maintenance here.
//
// A photo with no entry simply shows no location.
export const photoMeta: Record<string, { location?: string }> = {
  // Tokyo, Japan (Feb 2026)
  'DSCF4540.jpg': { location: 'Tokyo, Japan' },
  'DSCF4554.jpg': { location: 'Tokyo, Japan' },
  'DSCF4561.jpg': { location: 'Tokyo, Japan' },
  'DSCF4566.jpg': { location: 'Tokyo, Japan' },
  'DSCF4569.jpg': { location: 'Tokyo, Japan' },
  'DSCF4578.jpg': { location: 'Tokyo, Japan' },
  'DSCF4581.jpg': { location: 'Tokyo, Japan' },
  'DSCF4589.jpg': { location: 'Tokyo, Japan' },
  'DSCF4610.jpg': { location: 'Tokyo, Japan' },

  // Kamakura, Japan (Feb 2026)
  'DSCF4635.jpg': { location: 'Kamakura, Japan' },
  'DSCF4755.jpg': { location: 'Kamakura, Japan' },
  'DSCF4774.jpg': { location: 'Kamakura, Japan' },

  // Sintra, Portugal (Oct 2025)
  'DSCF3960.jpg': { location: 'Sintra, Portugal' },
  'DSCF4048.jpg': { location: 'Sintra, Portugal' },
  'DSCF4107.jpg': { location: 'Sintra, Portugal' },
  'DSCF4128.jpg': { location: 'Sintra, Portugal' },

  // Lisbon, Portugal (Oct 2025)
  'DSCF3853.jpg': { location: 'Lisbon, Portugal' },
  'DSCF3865.jpg': { location: 'Lisbon, Portugal' },
  'DSCF3889.jpg': { location: 'Lisbon, Portugal' },
  'DSCF3922.jpg': { location: 'Lisbon, Portugal' },

  // Porto, Portugal (Oct 2025)
  'DSCF4265.jpg': { location: 'Porto, Portugal' },
  'DSCF4269.jpg': { location: 'Porto, Portugal' },
  'DSCF4326.jpg': { location: 'Porto, Portugal' },
  'DSCF4339.jpg': { location: 'Porto, Portugal' },
  'DSCF4343.jpg': { location: 'Porto, Portugal' },
  'DSCF4351.jpg': { location: 'Porto, Portugal' },
  'DSCF4390.jpg': { location: 'Porto, Portugal' },
  'DSCF4401.jpg': { location: 'Porto, Portugal' },
  'DSCF4403.jpg': { location: 'Porto, Portugal' },
  'DSCF4418.jpg': { location: 'Porto, Portugal' },

  // Amsterdam, Netherlands (Feb 2025)
  'DSCF3061.jpg': { location: 'Amsterdam, Netherlands' },
  'DSCF3023.jpg': { location: 'Amsterdam, Netherlands' },
  'DSCF3059.jpg': { location: 'Amsterdam, Netherlands' },
  'DSCF3092.jpg': { location: 'Amsterdam, Netherlands' },

  // Colonial Beach, United States (Nov 2024)
  'DSCF2245.jpg': { location: 'Colonial Beach, United States' },
  'DSCF2257.jpg': { location: 'Colonial Beach, United States' },
  'DSCF2270.jpg': { location: 'Colonial Beach, United States' },
  'DSCF2292.jpg': { location: 'Colonial Beach, United States' },
  'DSCF2334.jpg': { location: 'Colonial Beach, United States' },
  'DSCF2340.jpg': { location: 'Colonial Beach, United States' },
  'DSCF2353.jpg': { location: 'Colonial Beach, United States' },

  // Washington, DC, United States (Jan & Mar 2025)
  'DSCF2387.jpg': { location: 'Washington, DC, United States' },
  'DSCF2412.jpg': { location: 'Washington, DC, United States' },
  'DSCF3493.jpg': { location: 'Washington, DC, United States' },

  // Edinburgh, Scotland (Feb 2025)
  'DSCF2706.jpg': { location: 'Edinburgh, Scotland' },
  'DSCF2709.jpg': { location: 'Edinburgh, Scotland' },
  'DSCF2740.jpg': { location: 'Edinburgh, Scotland' },
  'DSCF2756.jpg': { location: 'Edinburgh, Scotland' },
  'DSCF2787.jpg': { location: 'Edinburgh, Scotland' },

  // London, England (Feb 2025)
  'DSCF2687.jpg': { location: 'London, England' },
  'DSCF3184.jpg': { location: 'London, England' },
  'DSCF3232.jpg': { location: 'London, England' },
  'DSCF3317.jpg': { location: 'London, England' },
  'DSCF3349.jpg': { location: 'London, England' },
  'DSCF3413.jpg': { location: 'London, England' },
  'DSCF3433.jpg': { location: 'London, England' },

  // New York City, United States (Nov 2024)
  'DSCF2149.jpg': { location: 'New York City, United States' },
  'DSCF2152.jpg': { location: 'New York City, United States' },

  // Dameron, United States (Nov 2025)
  'DSCF4484.jpg': { location: 'Dameron, United States' },
  'DSCF4522.jpg': { location: 'Dameron, United States' },
  'DSCF4534.jpg': { location: 'Dameron, United States' },

  // Muir Woods, United States (Jan 2025)
  'DSCF2510.jpg': { location: 'Muir Woods, United States' },

  // Muir Beach, United States (Jan 2025)
  'DSCF2580.jpg': { location: 'Muir Beach, United States' },
  'DSCF2586.jpg': { location: 'Muir Beach, United States' },
  'DSCF2612.jpg': { location: 'Muir Beach, United States' },

  // San Francisco, United States (Jan & May 2025)
  'DSCF2662.jpg': { location: 'San Francisco, United States' },
  'DSCF3694.jpg': { location: 'San Francisco, United States' },
  'DSCF3741.jpg': { location: 'San Francisco, United States' },

  // Yosemite, United States (May 2025)
  'DSCF3556.jpg': { location: 'Yosemite, United States' },
};
