/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

interface PhotoCardProps {
  href: string;
  src: string;
  alt: string;
  eager: boolean;
  location?: string;
  date: string;
  settings: string;
  hasMeta: boolean;
}

// A gallery photo that links to its permalink page (/photo/[slug]). On desktop, hovering
// fades in the caption; on touch, tapping navigates to the full page (which shows the
// same metadata).
export function PhotoCard({ href, src, alt, eager, location, date, settings, hasMeta }: PhotoCardProps) {
  return (
    <Link href={href} className="block">
      <figure className="group relative">
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          className="block w-full h-auto"
        />
        {hasMeta && (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {location && <p className="text-sm font-medium text-white">{location}</p>}
            {date && <p className="mt-0.5 text-xs text-white/80">{date}</p>}
            {settings && <p className="mt-0.5 text-xs text-white/80">{settings}</p>}
          </figcaption>
        )}
      </figure>
    </Link>
  );
}
