'use client';

import Image from 'next/image';
import { MediaItem } from '@/types/project';

interface MediaRendererProps {
  item: MediaItem;
}

export default function MediaRenderer({ item }: MediaRendererProps) {
  switch (item.type) {
    case 'image':
      return (
        <figure>
          <Image
            src={item.src}
            alt={item.alt}
            width={1200}
            height={800}
            className="block w-full h-auto"
            unoptimized
          />
          {item.caption && (
            <figcaption className="text-body-small text-content-secondary mt-3">
              {item.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <figure>
          <video
            src={item.src}
            poster={item.poster}
            autoPlay
            muted
            loop
            playsInline
            className="block w-full h-[472px] object-contain rounded-lg"
          />
          {item.caption && (
            <figcaption className="text-body-small text-content-secondary mt-3">
              {item.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'youtube':
      return (
        <figure>
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${item.videoId}`}
              title={item.caption || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && (
            <figcaption className="text-body-small text-content-secondary mt-3">
              {item.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'vimeo':
      return (
        <figure>
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${item.videoId}`}
              title={item.caption || 'Vimeo video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && (
            <figcaption className="text-body-small text-content-secondary mt-3">
              {item.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
