'use client';

import { MediaItem } from '@/types/project';
import MediaRenderer from './MediaRenderer';
import ContentCard from './ContentCard';
import { useLightbox } from './Lightbox';

interface ProjectGalleryProps {
  items: MediaItem[];
}

export default function ProjectGallery({ items }: ProjectGalleryProps) {
  const { open } = useLightbox();

  if (items.length === 0) return null;

  return (
    <div className="mt-[60px] grid grid-cols-6 gap-8">
      {items.map((item, index) => {
        if (item.type === 'description') {
          return (
            <div key={index} className="col-span-6 -mt-4">
              <MediaRenderer item={item} />
            </div>
          );
        }
        const columns = item.columns ?? 2;
        const colSpanClass = columns === 2 ? 'col-span-6' : columns === 3 ? 'col-span-2' : 'col-span-3';
        const hasNoBorder = 'noBorder' in item ? !!item.noBorder : false;
        return (
          <div key={index} className={colSpanClass}>
            <ContentCard
              noPadding={item.type === 'image' || (item.type === 'video' && item.fill)}
              noBorder={hasNoBorder}
              onClick={() => open(item)}
            >
              <MediaRenderer item={item} />
            </ContentCard>
          </div>
        );
      })}
    </div>
  );
}
