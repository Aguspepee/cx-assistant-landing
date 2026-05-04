import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ── Locale bundles (inline — no HTTP request, SSG-safe) ───────────────────────
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enBlog from '../locales/en/blog.json';
import enContact from '../locales/en/contact.json';
import enAbout from '../locales/en/about.json';

import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esBlog from '../locales/es/blog.json';
import esContact from '../locales/es/contact.json';
import esAbout from '../locales/es/about.json';

export const SUPPORTED_LANGS = ['en', 'es'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, home: enHome, blog: enBlog, contact: enContact, about: enAbout },
      es: { common: esCommon, home: esHome, blog: esBlog, contact: esContact, about: esAbout },
    },
    // Language detection: URL path first (/en/…, /es/…), then localStorage, then browser
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'blog', 'contact', 'about'],
    // Resources are embedded — init is synchronous
    initImmediate: false,
    interpolation: {
      escapeValue: false, // React already escapes output
    },
    // Normalise language codes: 'en-US' → 'en'
    load: 'languageOnly',
  });

export default i18next;
