export type ContentBlockType =
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'image'
  | 'screenshot'
  | 'bullet-list'
  | 'callout'
  | 'divider';

export interface ContentBlock {
  type: ContentBlockType;
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;          // ISO 8601 e.g. "2026-03-08"
  author: string;
  category: string;
  tags: string[];
  readTime: number;      // minutes
  ogImage: string;       // absolute path from public root, e.g. "/blog-images/..."
  content: ContentBlock[];
}
