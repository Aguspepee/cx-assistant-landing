import type { BlogPostMeta } from '../types';
import enPosts from './en/index';
import esPosts from './es/index';

/**
 * Returns blog posts for the given language code, falling back to English.
 * Posts are ordered most-recent-first.
 */
export function getPostsByLang(lang: string): BlogPostMeta[] {
  if (lang === 'es') return esPosts;
  return enPosts;
}

// Default English export kept for any imports that haven't been migrated yet.
export default enPosts;
