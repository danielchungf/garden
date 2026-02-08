'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Hls from 'hls.js';
import { MediaItem } from '@/types/project';

interface MediaRendererProps {
  item: MediaItem;
}

function isHlsSource(src: string) {
  return src.includes('.m3u8');
}

function AutoPlayVideo({ src, poster, caption, fill }: { src: string; poster?: string; caption?: string; fill?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (isHlsSource(src)) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = src;
      }
    }

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
    return () => {
      observer.disconnect();
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <figure className="overflow-hidden rounded-lg bg-white">
      <video
        ref={videoRef}
        src={isHlsSource(src) ? undefined : src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        className={fill
          ? "block w-full h-auto"
          : "block w-full h-[472px] object-contain"
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

    case 'description':
      return (
        <p className="text-h3 text-content-muted py-3 text-center">
          {item.text}
        </p>
      );

    default:
      return null;
  }
}
