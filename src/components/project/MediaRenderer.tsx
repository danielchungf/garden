'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types/project';

interface MediaRendererProps {
  item: MediaItem;
}

function AutoPlayVideo({ src, poster, caption, fill }: { src: string; poster?: string; caption?: string; fill?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <figure>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        className={fill
          ? "block w-full h-auto rounded-lg"
          : "block w-full h-[472px] object-contain rounded-lg"
        }
      />
      {caption && (
        <figcaption className="text-body-small text-content-secondary mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function MediaRenderer({ item }: MediaRendererProps) {
  switch (item.type) {
    case 'image':
      return (
        <figure className={item.fill ? 'h-full' : ''}>
          <Image
            src={item.src}
            alt={item.alt}
            width={1200}
            height={800}
            className={item.fill ? 'block w-full h-full object-cover' : 'block w-full h-auto'}
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
      return <AutoPlayVideo src={item.src} poster={item.poster} caption={item.caption} fill={item.fill} />;

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
