export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  published: boolean;
  cover?: string;
}

export interface Post extends PostMeta {
  content: string;
}
