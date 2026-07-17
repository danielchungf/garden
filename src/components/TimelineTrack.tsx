"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { LightboxProvider, useLightbox } from "@/components/project/Lightbox";
import type { TimelineEvent } from "@/types/timeline";

export default function TimelineTrack({ events }: { events: TimelineEvent[] }) {
  return (
    <LightboxProvider>
      <Track events={events} />
    </LightboxProvider>
  );
}

function Track({ events }: { events: TimelineEvent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Track drag state without re-rendering.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  // Mouse wheels only scroll vertically; translate that into horizontal motion.
  // A native, non-passive listener is required to call preventDefault.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // native touch scrolling is fine
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    };
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startScroll - dx;
  }, []);

  const endDrag = useCallback(() => {
    drag.current.active = false;
  }, []);

  // Swallow the click that follows a real drag so photos don't open by accident.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div className="relative flex h-[480px] w-max px-[max(20px,calc((100vw-660px)/2))] select-none">
          {/* the rail */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-neutral-200" />
          {events.map((event, i) => (
            <Node key={event.slug} event={event} above={i % 2 === 0} />
          ))}
        </div>
      </div>

      {/* edge fades hint that the track scrolls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent" />
    </div>
  );
}

function Node({ event, above }: { event: TimelineEvent; above: boolean }) {
  const hasPhoto = event.photos.length > 0;

  const card = (
    <div className="flex w-[212px] flex-col items-center gap-1.5 px-1 text-center">
      <time className="text-h3 text-content-muted">{event.displayDate}</time>
      <p className="text-body-small text-balance text-content-primary">
        {event.title}
      </p>
      {event.note && (
        <p className="text-body-small text-content-tertiary">{event.note}</p>
      )}
      {hasPhoto && <Photo event={event} />}
    </div>
  );

  const connector = (
    <span className="h-6 w-px bg-neutral-200 transition-colors group-hover:bg-neutral-300" />
  );

  return (
    <div className="group relative flex h-full w-[240px] shrink-0 flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center justify-end">
        {above && (
          <>
            {card}
            {connector}
          </>
        )}
      </div>

      <span
        className={`z-10 h-[9px] w-[9px] shrink-0 rounded-full border-2 border-[color:var(--background)] transition-colors ${
          hasPhoto
            ? "bg-content-accent"
            : "bg-neutral-300 group-hover:bg-neutral-400"
        }`}
      />

      <div className="flex w-full flex-1 flex-col items-center justify-start">
        {!above && (
          <>
            {connector}
            {card}
          </>
        )}
      </div>
    </div>
  );
}

function Photo({ event }: { event: TimelineEvent }) {
  const { open } = useLightbox();
  const src = event.photos[0];
  return (
    <button
      type="button"
      onClick={() => open({ type: "image", src, alt: event.title, fill: true })}
      className="mt-1 block cursor-pointer overflow-hidden rounded-lg border border-muted transition-transform duration-100 ease-[var(--ease-out)] hover:-translate-y-0.5"
    >
      <Image
        src={src}
        alt={event.title}
        width={424}
        height={280}
        className="h-[132px] w-[212px] object-cover"
        draggable={false}
      />
    </button>
  );
}
