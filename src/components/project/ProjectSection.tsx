import { MediaItem } from '@/types/project';
import MediaRenderer from './MediaRenderer';
import ContentCard from './ContentCard';

interface ProjectSectionProps {
  title: string;
  body: string;
  media?: MediaItem[];
}

export default function ProjectSection({ title, body, media }: ProjectSectionProps) {
  return (
    <div>
      <h2 className="text-h2 text-content-primary mb-3">{title}</h2>
      <p className="text-body-regular text-content-tertiary">{body}</p>
      {media && media.length > 0 && (
        <div className="mt-8 grid grid-cols-6 gap-3">
          {media.map((item, index) => {
            const columns = item.columns ?? 2;
            const colSpanClass = columns === 2 ? 'col-span-6' : columns === 3 ? 'col-span-2' : 'col-span-3';
            const hasNoBorder = 'noBorder' in item ? !!item.noBorder : (item.type === 'image' && item.fill);
            return (
              <div key={index} className={colSpanClass}>
                <ContentCard
                  noPadding={item.type === 'image' || (item.type === 'video' && item.fill)}
                  noBorder={hasNoBorder}
                  className={`${item.type === 'image' && !item.fill ? 'py-6 px-2' : ''} ${item.type === 'image' && item.fill ? 'h-full' : ''}`}
                >
                  <MediaRenderer item={item} />
                </ContentCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
