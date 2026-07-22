import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { getPhotos, getPhotoBySlug, formatSettings, formatDate } from '@/lib/photography';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getPhotos()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) return { title: 'Not Found' };

  const title = photo.location ? `${photo.location} — Daniel Chung` : 'Photo — Daniel Chung';
  return {
    title,
    description: photo.location
      ? `Photograph taken in ${photo.location} by Daniel Chung.`
      : 'Photograph by Daniel Chung.',
    openGraph: { images: [{ url: photo.src }] },
  };
}

export default async function PhotoPage({ params }: PageProps) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) notFound();

  const date = formatDate(photo.exif.date);
  const settings = formatSettings(photo);
  const gear = [photo.exif.camera, photo.exif.lens].filter(Boolean).join(' · ');

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px] flex flex-col">
      <Link href="/photography">
        <IconButton icon={ArrowLeft} />
      </Link>

      <figure className="mt-[60px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.location ?? 'Photograph by Daniel Chung'}
          className="block w-full h-auto"
        />
        {(photo.location || date || settings || gear) && (
          <figcaption className="mt-4 flex flex-col gap-0.5">
            {photo.location && (
              <p className="text-body-regular text-content-primary">{photo.location}</p>
            )}
            {date && <p className="text-body-regular text-content-tertiary">{date}</p>}
            {settings && (
              <p className="mt-2 text-body-regular text-content-tertiary">{settings}</p>
            )}
            {gear && <p className="text-body-regular text-content-tertiary">{gear}</p>}
          </figcaption>
        )}
      </figure>
    </main>
  );
}
