// columns: 1 = half width (side by side), 2 = full width (single row), 3 = third width (three across)
export type MediaItem =
  | { type: 'image'; src: string; alt: string; caption?: string; columns?: 1 | 2 | 3; fill?: boolean; noBorder?: boolean }
  | { type: 'video'; src: string; poster?: string; caption?: string; columns?: 1 | 2 | 3; fill?: boolean; noBorder?: boolean }
  | { type: 'youtube'; videoId: string; caption?: string; columns?: 1 | 2 | 3 }
  | { type: 'vimeo'; videoId: string; caption?: string; columns?: 1 | 2 | 3 }
  | { type: 'description'; text: string };

export interface TeamMember {
  name: string;
  url?: string;
  avatar?: string;
  hideOnMobile?: boolean;
}

export interface ProjectSection {
  title: string;
  body: React.ReactNode;
  media?: MediaItem[];
}

export interface ProjectData {
  slug: string;
  title: string;
  tagline: string;
  url?: string; // External link for the project
  heroImage?: string;
  heroVideo?: string;
  heroAlt: string;
  description: string[];
  team: TeamMember[];
  duration: string;
  sections?: ProjectSection[];
  gallery: MediaItem[];
  coverImage: string;
}
