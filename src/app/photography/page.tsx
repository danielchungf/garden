import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { PhotoCard } from '@/components/photography/PhotoCard';
import { getPhotos, formatSettings, formatDate } from '@/lib/photography';

export const metadata: Metadata = {
  title: 'Photography — Daniel Chung',
  description: 'Photographs by Daniel Chung.',
};

export default async function PhotographyPage() {
  const photos = await getPhotos();

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
            const date = formatDate(photo.exif.date);
            const hasMeta = Boolean(photo.location || date || settings);
            return (
              <PhotoCard
                key={photo.src}
                href={`/photo/${photo.slug}`}
                src={photo.src}
                alt={photo.location ?? `Photograph ${i + 1}`}
                eager={i < 2}
                location={photo.location}
                date={date}
                settings={settings}
                hasMeta={hasMeta}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
