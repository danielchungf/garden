import { MediaItem } from '@/types/project';
import MediaRenderer from './MediaRenderer';

interface ProjectGalleryProps {
  items: MediaItem[];
}

export default function ProjectGallery({ items }: ProjectGalleryProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-6 gap-5">
      {items.map((item, index) => {
        const columns = item.columns ?? 2; // Default to full width
        const colSpanClass = columns === 2 ? 'col-span-6' : columns === 3 ? 'col-span-2' : 'col-span-3';
        return (
          <div
            key={index}
            className={colSpanClass}
          >
            <MediaRenderer item={item} />
          </div>
        );
      })}
    </div>
  );
}
