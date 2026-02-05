// columns: 1 = half width (side by side), 2 = full width (single row)
export type MediaItem =
  | { type: 'image'; src: string; alt: string; caption?: string; columns?: 1 | 2 }
  | { type: 'video'; src: string; poster?: string; caption?: string; columns?: 1 | 2 }
  | { type: 'youtube'; videoId: string; caption?: string; columns?: 1 | 2 }
  | { type: 'vimeo'; videoId: string; caption?: string; columns?: 1 | 2 };

export interface TeamMember {
  name: string;
  url?: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  tagline: string;
  url?: string; // External link for the project
  heroImage: string;
  heroAlt: string;
  description: string[];
  team: TeamMember[];
  duration: string;
  gallery: MediaItem[];
  coverImage: string;
}
