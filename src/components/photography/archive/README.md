# Photography flythrough — ARCHIVED

> **Archived exploration.** The album pages no longer use this — they now show a
> vertical-scroll gallery of full-width photos on a dark background (see
> `src/app/photography/[library]/page.tsx`). The flythrough component is preserved here
> (`archive/PhotoFlythrough.tsx`) so the exploration isn't lost and can be re-mounted.
> To bring it back, import from `@/components/photography/archive/PhotoFlythrough` and
> wrap it in `LightboxProvider`.

A 3D "flying through a field of photos" visualizer where photos drift toward the viewer
through perspective space; clicking one opens it in the shared lightbox.

## Files

| File | Role |
| --- | --- |
| `src/lib/photography.ts` | Discovery. Scans `public/photography/` subfolders at **build time** → `PhotoLibrary[]` (`slug`, `title`, `cover`, `photos`). `getLibraries()` / `getLibrary(slug)` / `getLibrarySlugs()`. |
| `src/app/photography/page.tsx` | Library index — a responsive cover grid linking into each library. |
| `src/app/photography/[library]/page.tsx` | One library's flythrough. Wraps `PhotoFlythrough` in `LightboxProvider`; `notFound()` for unknown/empty slugs. |
| `src/components/photography/PhotoFlythrough.tsx` | Client component. The whole effect — layout, animation loop, input, recycling. Takes `images: string[]`, so it's reused per library unchanged. |
| `public/photography/<library>/*.webp` | The photos, one folder per library. |
| Home icon | `src/app/page.tsx` — the `Camera` `IconButton` linking to `/photography`. |

## Libraries

- **Add a library:** create a folder under `public/photography/` with a URL-safe name
  (lowercase, hyphens — `san-francisco`). The title is derived by prettifying the slug
  (`san-francisco` → "San Francisco").
- **Cover:** the first image alphabetically, or one named `cover.webp`.
- **Ordering:** libraries sort by slug; prefix with digits (`01-japan`) to control it.
- **Empty folders are hidden** from the index and their route 404s until they contain a
  photo — so a not-yet-populated place never shows as a broken tile. (Keep a `.gitkeep`
  inside so git tracks the empty folder.)

## Adding / changing photos

1. Drop image files into a library folder, e.g. `public/photography/japan/`. The library
   auto-discovers anything matching `jpe?g|png|webp|avif|gif` (see `src/lib/photography.ts`)
   and sorts by filename — **there is no list to maintain.**
2. Optimize to WebP. The set is normalized to a **2048px long edge, quality 90**
   (visually lossless, ~3× smaller than the JPEGs). To convert a new drop:

   ```bash
   cd public/photography/japan   # the library folder you're adding to
   for f in *.JPG; do
     cwebp -q 90 -m 6 -mt -quiet "$f" -o "${f%.JPG}.webp" && rm "$f"
   done
   # If a source is larger than 2048px on its long edge, resize while converting:
   #   cwebp -q 90 -m 6 -resize 2048 0 big.JPG -o big.webp   # landscape (height auto)
   #   cwebp -q 90 -m 6 -resize 0 2048 big.JPG -o big.webp   # portrait  (width auto)
   ```

   Avoid spaces in filenames (URLs get ugly) — rename `copy 2.jpg` → `copy-2.webp`.
   Don't use true lossless WebP for photos — it produces files **larger** than the JPEG.

> Note: `page.tsx` reads the directory at build time, so **adding photos requires a
> rebuild** (or a dev-server refresh) to appear.

## How the effect works

No Three.js. It's pure CSS perspective + a `requestAnimationFrame` loop, per
[this technique](https://x.com/nonzeroexitcode/status/2025527448536756311).

- The outer container has `perspective: 900px` (the "camera lens") and the inner
  container `transform-style: preserve-3d`. The browser does all the projection.
- Each photo is an absolutely-positioned `<img>` centered at the screen middle
  (`left/top: 50%` + `translate(-50%,-50%)`), then pushed into 3D space with
  `translate3d(x, y, z)`. We mutate `style.transform` / `style.opacity` **directly in
  the rAF loop** (not React state) so 56 tiles animate without re-rendering.

### The depth model

For a photo at depth `z`, the browser scales it by:

```
s = PERSPECTIVE / (PERSPECTIVE - z)
```

- `z` very negative (e.g. `FAR_Z = -4500`) → `s ≈ 0.17` → tiny & far.
- `z = 0` → `s = 1` → rendered at its true `BASE_WIDTH` (280px).
- `z → PERSPECTIVE` → `s → ∞` → it blows up and flies past the lens.

Its on-screen position is `(x·s, y·s)`. So a photo with any offset drifts **outward
from center** as it approaches — which is what makes it sweep off the edges.

### Lifecycle of one photo

1. **Layout (once, on mount).** Each photo gets a fixed *lane* — an `(x, y)` on a
   **golden-angle spiral** (`angle = i · 137.5°`, `radius = √((i+0.5)/n)`). This is
   sunflower-seed packing: the most even 2D spread possible, which is what prevents the
   clumping that random scatter caused. Lanes never change. Each photo also gets a fixed
   **base depth** `z0`, spread evenly across the whole loop so the field is full on
   frame 1 — and at every scroll position.
2. **Periodic depth loop (the key model).** There is **no per-photo recycling.** A single
   global `offsetRef` accumulates velocity, and every frame each photo's current depth is
   recomputed as `z = wrap(z0 - FAR_Z + offset, DEPTH) + FAR_Z`, where
   `DEPTH = NEAR_LIMIT - FAR_Z`. The whole field is one rigid set sliding through a looping
   depth range. Because of this, the field is **always full in both directions** — scrolling
   back (zooming out) shows the field receding, never blank. (The earlier recycle model
   teleported a passed photo to the far plane, so reversing left empty near-space → blank.)
3. **Opacity.** Photos are **fully opaque at every depth** — no depth fade. (An earlier
   fade-in made photos *disappear* when zooming out, since reversing pushed everything into
   the far fade zone.) The `opacity: 0` in the initial `<img>` style only hides the
   pre-animation stacked flash; `frame(0)` sets it to `1`.
4. **The wrap.** When a photo's depth crosses `NEAR_LIMIT` it jumps to `FAR_Z` (or the
   reverse). `NEAR_LIMIT` (820) is chosen so the photo is already swept **off-screen** by
   then, so the wrap is invisible at the near end. At the far end a tile pops in/out, but
   it's tiny and distant there. Wraps are staggered (each photo has a different `z0`), so
   only one crosses at a time.

### Modes (Auto / Manual)

A pill toggle (top-right) flips `mode`:

- **Auto** — constant forward velocity (`AUTO_SPEED`).
- **Manual** — the field freezes; wheel/trackpad/touch input adds velocity impulses
  (`WHEEL_GAIN` / `TOUCH_GAIN`, capped at `MAX_VELOCITY`), which decay back to zero with
  inertia (`DAMP`). Scroll down = forward, up = reverse.

The loop reads `modeRef`/`velRef` (refs, not state) so it never needs to restart. The
`useEffect` runs **once** (`[]` deps) — all live values are refs.

### Clicking & the lightbox

Each `<img>` has an `onClick` that calls the shared `useLightbox().open(...)`. Because
photos are fully opaque, hit-testing follows the 3D stacking order — the nearest photo at
the cursor gets the click. (The lightbox itself ignores clicks below 768px — see
`Lightbox.tsx`.)

### Accessibility & performance

- **Reduced motion** (`prefers-reduced-motion`): starts in Manual with zero velocity, so
  nothing auto-animates — it only moves when the user scrolls.
- **Backgrounded tabs**: the rAF loop pauses on `visibilitychange`.
- Only `transform` is animated (GPU-composited, `will-change: transform`). `aspect`
  per photo is learned from `naturalWidth/Height` on load (kept for future use; the
  periodic model no longer needs an off-screen test).

## Tuning cheat sheet

All knobs are the `const`s at the top of `PhotoFlythrough.tsx`.

| I want… | Change |
| --- | --- |
| Distant photos smaller / stronger depth | Lower `FAR_Z` (more negative). |
| More dramatic perspective overall | Lower `PERSPECTIVE` (must stay > `NEAR_LIMIT`). |
| Bigger / smaller photos overall | `BASE_WIDTH`. |
| More space between photos | Raise `SPREAD_X` / `SPREAD_Y`. |
| Denser field (more tiles) | Raise `TARGET_INSTANCES` (it repeats photos to hit this floor; e.g. 112 ≈ 2× with 56 photos). |
| Faster / slower auto drift | `AUTO_SPEED`. |
| Bigger empty center / smaller | `MIN_RADIUS` (0–1 fraction of spread). Keep ≥ ~0.45 so every lane sweeps off-screen before the wrap rather than covering the middle. |
| Where photos wrap (visible vs. perf) | `NEAR_LIMIT` — higher hides the wrap better on wide screens but makes near tiles huge; keep < `PERSPECTIVE`. |
| Size variety between photos | `MIN_SCALE` / `MAX_SCALE`. |
| Manual scroll sensitivity | `WHEEL_GAIN` / `TOUCH_GAIN`. |
| Manual glide length | `DAMP` (higher = stops sooner). |
| Manual max speed | `MAX_VELOCITY`. |

### Gotchas

- `MIN_RADIUS` too low → photos near dead-center never reach an edge before the wrap, so
  they balloon and the wrap becomes visible in the middle. Keep it ≥ ~0.45.
- `NEAR_LIMIT` must be **< `PERSPECTIVE`**, or the scale `s` goes negative/∞.
- Positions are randomized **client-side only** (in `useEffect`), never in the rendered
  markup, so there's no SSR hydration mismatch. Keep it that way if you refactor.
- `npm run build` currently fails in Conductor workspaces due to the unrelated
  `content/writing` symlink — validate this route with `npm run dev` instead.
