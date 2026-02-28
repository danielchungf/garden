export interface Track {
  rank: number;
  name: string;
  artists: string[];
  album: string;
  album_art: {
    large: string;
    medium: string;
    small: string;
  };
  spotify_url: string;
  duration_ms: number;
}

export interface MonthlyMusic {
  month: string;
  generated_at: string;
  tracks: Track[];
}
