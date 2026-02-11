import { MediaItem } from '@/types/project';
import MediaRenderer from './MediaRenderer';
import ContentCard from './ContentCard';

interface ProjectSectionProps {
  id?: string;
  title: string;
  body: React.ReactNode;
  media?: MediaItem[];
}

// Group media items: each card (image/video/etc.) optionally followed by a description
function groupMedia(media: MediaItem[]) {
  const groups: { item: MediaItem; description?: MediaItem }[] = [];
  for (let i = 0; i < media.length; i++) {
    const item = media[i];
    if (item.type === 'description') continue; // handled as part of previous group
    const next = media[i + 1];
    if (next && next.type === 'description') {
      groups.push({ item, description: next });
      i++; // skip the description
    } else {
      groups.push({ item });
    }
  }
  return groups;
}

export default function ProjectSection({ id, title, body, media }: ProjectSectionProps) {
  return (
    <div id={id} className="scroll-mt-20">
      <h2 className="text-h2 text-content-primary mb-3">{title}</h2>
      <p className="text-body-regular text-content-tertiary">{body}</p>
      {media && media.length > 0 && (
        <div className="mt-8 grid grid-cols-6 gap-8">
          {groupMedia(media).map((group, index) => {
            const { item, description } = group;
            const columns = item.columns ?? 2;
            const colSpanClass = columns === 2 ? 'col-span-6' : columns === 3 ? 'col-span-2' : 'col-span-3';
            const hasNoBorder = 'noBorder' in item ? !!item.noBorder : (item.type === 'image' && item.fill);
            return (
              <div key={index} className={colSpanClass}>
                <ContentCard
                  noPadding={item.type === 'image' || (item.type === 'video' && item.fill)}
                  noBorder={hasNoBorder}
                  className={`${item.type === 'image' && !item.fill ? 'py-6 px-2' : ''} ${item.type === 'image' && item.fill && !description ? 'h-full' : ''}`}
                >
                  <MediaRenderer item={item} />
                </ContentCard>
                {description && (
                  <div className="mt-4">
                    <MediaRenderer item={description} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
