import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { LightboxProvider } from '@/components/project/Lightbox';
import PhotoFlythrough from '@/components/photography/PhotoFlythrough';

export const metadata: Metadata = {
  title: 'Photography — Daniel Chung',
  description: 'A flythrough of photographs by Daniel Chung.',
};

// Read everything dropped into /public/photography at build time, so adding a
// photo is just dropping a file in — no list to maintain.
function getPhotos(): string[] {
  const dir = path.join(process.cwd(), 'public', 'photography');
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
    .sort()
    .map((f) => `/photography/${f}`);
}

export default function PhotographyPage() {
  const photos = getPhotos();

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#fdfdfc]">
      <Link href="/" className="absolute left-5 top-5 z-20">
        <IconButton icon={ArrowLeft} />
      </Link>

      <LightboxProvider>
        {photos.length > 0 ? (
          <PhotoFlythrough images={photos} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-body-regular text-content-tertiary">
              Drop photos into <code>/public/photography</code> to populate this space.
            </p>
          </div>
        )}
      </LightboxProvider>
    </main>
  );
}
