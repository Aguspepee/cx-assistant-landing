import { useParams, useLocation } from 'react-router-dom';
import type { Lang } from './index';
import { SUPPORTED_LANGS } from './index';

/**
 * Returns the active language code from the URL param, guaranteed to be one
 * of the supported languages. Falls back to 'en' for safety.
 */
export function useLang(): Lang {
  const { lang } = useParams<{ lang: string }>();
  if (lang && (SUPPORTED_LANGS as readonly string[]).includes(lang)) {
    return lang as Lang;
  }
  return 'en';
}

/**
 * Returns a helper function that prepends the current language prefix to a
 * path.  e.g.: lp('/blog') → '/en/blog'  or  '/es/blog'
 */
export function useLangPath() {
  const lang = useLang();
  return (path: string): string => {
    const normalised = path.startsWith('/') ? path : `/${path}`;
    return `/${lang}${normalised}`;
  };
}

/**
 * Builds a URL for the same page but in a different language by replacing the
 * first path segment.  Used by the language switcher.
 */
export function useAlternateLangPath(targetLang: Lang): string {
  const { pathname } = useLocation();
  const segments = pathname.split('/'); // ['', 'en', 'blog', …]
  segments[1] = targetLang;
  return segments.join('/') || '/';
}
