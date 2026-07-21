'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';

interface PhotoCardProps {
  src: string;
  alt: string;
  eager: boolean;
  location?: string;
  date: string;
  settings: string;
  hasMeta: boolean;
}

// On desktop the caption reveals on hover (CSS group-hover). Touch devices have no
// hover, so a tap reveals it and it fades back out after 5s.
const REVEAL_MS = 5000;

export function PhotoCard({ src, alt, eager, location, date, settings, hasMeta }: PhotoCardProps) {
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const reveal = () => {
    setRevealed(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRevealed(false), REVEAL_MS);
  };

  return (
    <figure className="group relative" onPointerDown={reveal}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className="block w-full h-auto"
      />
      {hasMeta && (
        <figcaption
          className={`pointer-events-none absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-100 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {location && <p className="text-sm font-medium text-white">{location}</p>}
          {date && <p className="mt-0.5 text-xs text-white/80">{date}</p>}
          {settings && <p className="mt-0.5 text-xs text-white/80">{settings}</p>}
        </figcaption>
      )}
    </figure>
  );
}
