'use client';

import { useEffect, useRef, useState } from 'react';
import { useLightbox } from '@/components/project/Lightbox';

// --- Tunable constants -------------------------------------------------------
const PERSPECTIVE = 900; // "camera lens" — smaller = stronger depth
const FAR_Z = -4500; // far plane — deeper makes distant photos read much smaller
const NEAR_LIMIT = 820; // depth wraps back to FAR_Z here (photos are off-screen by now; < PERSPECTIVE)
const DEPTH = NEAR_LIMIT - FAR_Z; // one full loop of the periodic depth field
const AUTO_SPEED = 160; // px/sec the field drifts toward the viewer in Auto mode
const BASE_WIDTH = 280; // px render width at scale 1 (source is 2048px, so sharp)
const SPREAD_X = 760; // horizontal scatter — wider = more space between photos
const SPREAD_Y = 620; // vertical scatter
const MIN_RADIUS = 0.5; // keep the dead-center clear so photos sweep off the edges
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.25;
const TARGET_INSTANCES = 30; // minimum tiles in the field (repeats photos to fill)
// Manual-scroll feel:
const WHEEL_GAIN = 2.2; // how much a wheel/trackpad delta pushes the velocity
const TOUCH_GAIN = 14; // how much a touch-drag pixel pushes the velocity
const MAX_VELOCITY = 2600; // px/sec cap so a hard flick can't teleport the field
const DAMP = 2.4; // velocity decay per second (higher = stops sooner)
// -----------------------------------------------------------------------------

type Mode = 'auto' | 'manual';

interface Instance {
  x: number;
  y: number;
  z0: number; // fixed base depth; current depth = z0 + scroll offset (wrapped)
  z: number; // current wrapped depth, recomputed each frame
  scale: number;
  aspect: number; // height / width, learned once the image loads
}

export default function PhotoFlythrough({ images }: { images: string[] }) {
  const { open } = useLightbox();
  const elsRef = useRef<(HTMLImageElement | null)[]>([]);
  const instRef = useRef<Instance[]>([]);

  const [mode, setMode] = useState<Mode>('auto');
  const modeRef = useRef<Mode>('auto');
  modeRef.current = mode; // keep the animation loop reading the current mode
  const velRef = useRef(AUTO_SPEED); // current forward velocity (px/sec)
  const offsetRef = useRef(0); // global depth scroll position (accumulated velocity)

  // Deterministic slot list (one src per tile) so SSR markup is stable.
  // Repeat the photos until we reach a dense-enough field.
  const repeats = Math.max(1, Math.ceil(TARGET_INSTANCES / Math.max(1, images.length)));
  const slots: string[] = [];
  for (let r = 0; r < repeats; r++) for (const src of images) slots.push(src);

  useEffect(() => {
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const n = slots.length;
    if (n === 0) return;

    // Lay tiles out on a golden-angle spiral (sunflower packing) — the most even
    // 2D spread there is. Each photo gets a fixed lane (angle + radius) so they
    // stay spread out instead of clumping the way random scatter does.
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°
    instRef.current = slots.map((_, i) => {
      const angle = i * GOLDEN_ANGLE + rand(-0.12, 0.12); // even fan + a touch of jitter
      const radius = MIN_RADIUS + (1 - MIN_RADIUS) * Math.sqrt((i + 0.5) / n); // even areal density
      return {
        x: Math.cos(angle) * SPREAD_X * radius,
        y: Math.sin(angle) * SPREAD_Y * radius,
        // Spread base depths evenly across the whole loop → field is full at any scroll position.
        z0: FAR_Z + DEPTH * ((i + 0.5) / n) + rand(-DEPTH / (n * 2), DEPTH / (n * 2)),
        z: 0,
        scale: rand(MIN_SCALE, MAX_SCALE),
        aspect: 0.7,
      };
    });

    // Respect reduced-motion: don't auto-play. The field stays still until the
    // user scrolls (user-initiated motion is fine under the preference).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      modeRef.current = 'manual';
      velRef.current = 0;
      setMode('manual');
    }

    // Manual input → velocity impulses (with a cap).
    const push = (delta: number) => {
      if (modeRef.current !== 'manual') return;
      velRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velRef.current + delta));
    };
    const onWheel = (e: WheelEvent) => {
      if (modeRef.current !== 'manual') return;
      e.preventDefault();
      push(e.deltaY * WHEEL_GAIN);
    };
    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (modeRef.current !== 'manual') return;
      const y = e.touches[0]?.clientY ?? lastTouchY;
      e.preventDefault();
      push((lastTouchY - y) * TOUCH_GAIN);
      lastTouchY = y;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    const apply = (i: number) => {
      const el = elsRef.current[i];
      const p = instRef.current[i];
      if (!el || !p) return;
      // Photos stay fully opaque at every depth — no depth fade — so scrolling back
      // (zooming out) keeps them visible instead of fading them into nothing.
      el.style.opacity = '1';
      el.style.transform = `translate(-50%, -50%) translate3d(${p.x}px, ${p.y}px, ${p.z}px) scale(${p.scale})`;
    };

    // Periodic depth loop: each photo's depth = its fixed base depth + the global
    // scroll offset, wrapped into [FAR_Z, NEAR_LIMIT). This keeps the field full at
    // ANY scroll position and in BOTH directions — scrolling back never goes blank,
    // it just shows the field receding. The wrap itself happens off-screen near the
    // lens (one photo at a time, since base depths differ), so it isn't visible.
    const frame = (off: number) => {
      const insts = instRef.current;
      for (let i = 0; i < insts.length; i++) {
        const p = insts[i];
        let z = (p.z0 - FAR_Z + off) % DEPTH;
        if (z < 0) z += DEPTH; // keep the modulo positive for backward scroll
        p.z = z + FAR_Z;
        apply(i);
      }
    };

    frame(0); // initial paint

    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (!last) last = t;
      const dt = Math.min(0.05, (t - last) / 1000); // clamp so tab-restore doesn't jump
      last = t;

      let v: number;
      if (modeRef.current === 'auto') {
        v = AUTO_SPEED;
        velRef.current = AUTO_SPEED; // keep synced for a smooth handoff to manual
      } else {
        velRef.current *= Math.exp(-DAMP * dt); // inertia glide to a stop
        if (Math.abs(velRef.current) < 0.4) velRef.current = 0;
        v = velRef.current;
      }

      offsetRef.current += v * dt;
      frame(offsetRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Auto / Manual toggle */}
      <div className="absolute right-5 top-5 z-20 flex items-center rounded-full border border-neutral-150 bg-white/70 p-0.5 backdrop-blur-sm">
        {(['auto', 'manual'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors cursor-pointer ${
              mode === m
                ? 'bg-neutral-100 text-content-primary'
                : 'text-content-tertiary hover:text-content-primary'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: '50% 50%' }}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {slots.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              ref={(el) => {
                elsRef.current[i] = el;
              }}
              src={src}
              alt="Photograph by Daniel Chung"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                const p = instRef.current[i];
                if (p && img.naturalWidth) p.aspect = img.naturalHeight / img.naturalWidth;
              }}
              onClick={() => open({ type: 'image', src, alt: 'Photograph by Daniel Chung', fill: true })}
              className="absolute left-1/2 top-1/2 cursor-pointer select-none rounded-[2px] border border-black/5 shadow-[0_2px_14px_rgba(0,0,0,0.10)]"
              style={{
                width: `${BASE_WIDTH}px`,
                height: 'auto',
                opacity: 0, // hidden until the first frame positions it (avoids a stacked flash)
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
