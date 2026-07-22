# Photography

A single vertical-scroll gallery at `/photography` — every image in
`public/photography/`, full column width, keeping its proportions. Hovering a photo
fades in a metadata overlay (location + camera settings).

## Files

| File | Role |
| --- | --- |
| `src/lib/photo-exif.ts` | Reads EXIF (camera, lens, settings, `DateTimeOriginal`) from each **original** file at build time. Single source of truth for the gallery, photo pages, and feed — nothing is hand-copied, so nothing drifts. |
| `src/lib/photography.ts` | Discovery. Scans `public/photography/` at **build time** → `Photo[]` (`src`, `filename`, `slug`, `location`, `exif`), newest-first by capture date. `getPhotos()`, `getPhotoBySlug()`, `formatSettings()`. |
| `src/data/photoMeta.ts` | **Location only**, keyed by filename — the one thing not in EXIF (no GPS). Optional; a photo with no entry just shows no location. |
| `src/app/photography/page.tsx` | The gallery. Photos stacked full-width (`gap-4`); each card links to its permalink and reveals a caption on hover. |
| `src/app/photo/[slug]/page.tsx` | Per-photo permalink pages (`/photo/DSCF0421/`). |
| `public/photography/*.jpg` | The photos (flat folder) — kept as **originals with EXIF intact** (do NOT strip metadata). |
| Home icon | `src/app/page.tsx` — the `Camera` `IconButton` linking to `/photography`. |

## Adding photos

Drop image files into `public/photography/` (any of `jpe?g|png|webp|avif|gif`); they're
auto-discovered, sorted newest-first by EXIF capture date — **no list to maintain.**

> **Keep the originals** (or at least their EXIF). Camera/lens/settings/date are read from
> each file's EXIF at build time; a stripped/re-exported copy loses them. If you optimize,
> use a tool that preserves EXIF (e.g. `mozjpeg`/`jpegtran`, not a bare `cwebp`).
>
> Discovery runs at build time, so new photos need a rebuild (or dev-server refresh).

## Metadata

**Camera, lens, ISO, aperture, shutter, focal length, and date come straight from EXIF** —
never hand-maintained. The only thing you add by hand is `location` (the files carry no
GPS), in `src/data/photoMeta.ts`:

```ts
'DSCF0421.jpg': { location: 'Tokyo, Japan' },
```

The caption/photo page shows `location`, the date, and the settings joined as
`ISO 100 · f/2.8 · 1/250s · 35mm` (via `formatSettings`).

> Hover is pointer-only; on touch, tapping a gallery card navigates to its permalink page,
> which shows the same metadata.

## OpenFeed (JSON Feed at `/photo/feed.json`)

The gallery also publishes a [JSON Feed 1.1](https://jsonfeed.org/version/1.1) for
[OpenFeed](https://openfeed.photo) (`_photoring.ring: "openfeed-demo"`, permanent
`creator: "danielchung"`).

| File | Role |
| --- | --- |
| `src/app/photo/feed.json/route.ts` | The feed route (`dynamic = 'force-static'` → generated at build). |
| `src/lib/photo-feed.ts` | Builds the feed from `getPhotos()` — the same EXIF the gallery uses — into `_photoring.exif`, uses each photo's `capturedAt` for `date_published` (RFC 3339), sorts newest-first. |
| `src/app/photo/[slug]/page.tsx` | Per-photo permalink pages (`/photo/DSCF4540/`) — each item's `id`/`url`. `slug` = filename without extension. |
| `src/lib/site.ts` | `SITE_URL` — the production origin baked into every absolute URL. |
| Discovery `<link>` | In `src/app/layout.tsx` metadata (`alternates.types`) → on **every** page's `<head>`. |

The feed is **never hand-edited** — the whole site (gallery, photo pages, feed) shares one
EXIF read from the originals (`photo-exif.ts`), so publishing is unchanged: drop a `.jpg` in
`public/photography/`, rebuild, deploy. The feed's `image` is the full-size file
(`/photography/<file>.jpg`); OpenFeed generates its own sizes.

## Archived: the flythrough

The earlier 3D "flying through a field of photos" visualizer lives in
[`archive/`](./archive/README.md) — preserved but not wired into any route.
