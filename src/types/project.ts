// columns: 1 = half width (side by side), 2 = full width (single row)
export type MediaItem =
  | { type: 'image'; src: string; alt: string; caption?: string; columns?: 1 | 2; fill?: boolean }
  | { type: 'video'; src: string; poster?: string; caption?: string; columns?: 1 | 2; fill?: boolean }
  | { type: 'youtube'; videoId: string; caption?: string; columns?: 1 | 2 }
  | { type: 'vimeo'; videoId: string; caption?: string; columns?: 1 | 2 };

export interface TeamMember {
  name: string;
  url?: string;
  avatar?: string;
}

export interface ProjectSection {
  title: string;
  body: string;
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
