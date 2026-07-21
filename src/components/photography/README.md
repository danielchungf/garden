# Photography

A single vertical-scroll gallery at `/photography` — every image in
`public/photography/`, full column width, keeping its proportions. Hovering a photo
fades in a metadata overlay (location + camera settings).

## Files

| File | Role |
| --- | --- |
| `src/lib/photography.ts` | Discovery. Scans `public/photography/` at **build time** → `Photo[]` (`src`, `filename`, + metadata). `getPhotos()` and `formatSettings()`. |
| `src/data/photoMeta.ts` | Per-photo metadata, keyed by filename (location, iso, aperture, shutter, focalLength, …). All optional. |
| `src/app/photography/page.tsx` | The gallery. Photos stacked full-width with a `gap-4`; CSS `group-hover` reveals the metadata overlay. |
| `public/photography/*.webp` | The photos (flat folder). |
| Home icon | `src/app/page.tsx` — the `Camera` `IconButton` linking to `/photography`. |

## Adding photos

Drop image files into `public/photography/` (any of `jpe?g|png|webp|avif|gif`); they're
auto-discovered and sorted by filename — **no list to maintain.** Optimize to WebP
(2048px long edge, q90):

```bash
cd public/photography
for f in *.JPG; do
  cwebp -q 90 -m 6 -mt -quiet "$f" -o "${f%.JPG}.webp" && rm "$f"
done
```

> Discovery runs at build time, so new photos need a rebuild (or dev-server refresh).

## Adding metadata (hover overlay)

`cwebp` strips EXIF, so metadata is hand-maintained in `src/data/photoMeta.ts`, keyed by
filename. Everything is optional — a photo with no entry just shows no overlay.

```ts
'DSCF0421.webp': { location: 'Tokyo, Japan', iso: 100, aperture: 'f/2.8', shutter: '1/250s', focalLength: '35mm' },
```

The overlay shows `location` on the first line and the camera settings joined as
`ISO 100 · f/2.8 · 1/250s · 35mm` on the second (via `formatSettings`). The entries
currently in the file are **example placeholders** — replace them with real values.

> Hover is pointer-only; on touch devices the overlay doesn't appear (a tap-to-toggle
> could be added later if wanted).

## Archived: the flythrough

The earlier 3D "flying through a field of photos" visualizer lives in
[`archive/`](./archive/README.md) — preserved but not wired into any route.
