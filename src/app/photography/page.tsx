/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { getPhotos, formatSettings, formatDate } from '@/lib/photography';

export const metadata: Metadata = {
  title: 'Photography — Daniel Chung',
  description: 'Photographs by Daniel Chung.',
};

export default function PhotographyPage() {
  const photos = getPhotos();

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px] flex flex-col">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div className="mt-[60px]">
        <h1 className="text-hero text-content-primary">Photos</h1>
        <p className="mt-3 text-body-regular text-content-primary">
          I&apos;ve always enjoyed photography, but it wasn&apos;t until I got my
          FUJIFILM X-T5 that I started taking it more seriously, especially during my
          travels. Here&apos;s a selection of my most recent shots.
        </p>
      </div>

      {photos.length === 0 ? (
        <p className="mt-[60px] text-body-regular text-content-tertiary">
          Drop photos into <code>/public/photography</code> to populate this page.
        </p>
      ) : (
        <div className="mt-[60px] flex flex-col gap-4">
          {photos.map((photo, i) => {
            const settings = formatSettings(photo);
            const date = formatDate(photo.date);
            const hasMeta = photo.location || date || settings;
            return (
              <figure key={photo.src} className="group relative">
                <img
                  src={photo.src}
                  alt={photo.location ?? `Photograph ${i + 1}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="block w-full h-auto"
                />
                {hasMeta && (
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {photo.location && (
                      <p className="text-sm font-medium text-white">{photo.location}</p>
                    )}
                    {date && (
                      <p className="mt-0.5 text-xs text-white/70">{date}</p>
                    )}
                    {settings && (
                      <p className="mt-0.5 text-xs text-white/80">{settings}</p>
                    )}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}
    </main>
  );
}
