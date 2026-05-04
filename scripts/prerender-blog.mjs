/**
 * scripts/prerender-blog.mjs
 *
 * Runs AFTER `vite build`. Creates static index.html files under dist/ for
 * every language-prefixed route so that crawlers (Google, LinkedIn, Twitter/X,
 * WhatsApp, Facebook) see correct canonical, hreflang, OG, and JSON-LD meta
 * in the raw HTTP response — without executing JavaScript.
 *
 * Pages prerendered:
 *   dist/<lang>/index.html          — home page
 *   dist/<lang>/contact/index.html  — contact page
 *   dist/<lang>/blog/index.html     — blog list
 *   dist/<lang>/blog/<slug>/index.html — each blog post
 *
 * The React SPA still boots normally for real browser visits.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE = 'https://cx-assistant.com';

const SUPPORTED_LANGS = ['en', 'es'];

const MARKER_START = '<!-- PRERENDER:META_START -->';
const MARKER_END   = '<!-- PRERENDER:META_END -->';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Escape a string for safe use inside an HTML attribute value.
 * Non-ASCII characters are encoded as numeric HTML entities so the meta tags
 * are pure ASCII and render correctly regardless of server Content-Type charset.
 */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Encode every non-ASCII character as a decimal HTML entity
    .replace(/[^\x00-\x7F]/g, (c) => `&#${c.codePointAt(0)};`);
}

/**
 * Build an absolute image URL from a public-root path.
 * Paths must use clean slugs (no spaces/special chars) — the clean
 * /blog-images/commissioning-teams-tracker/ folder satisfies this.
 */
function encodePath(rawPath) {
  // Only encode individual path segments, never the slashes.
  return rawPath.split('/').map(s => encodeURIComponent(s)).join('/');
}

/** Serialise JSON for use in a <script type="application/ld+json"> block.
 * Uses \uXXXX escaping for non-ASCII so the JSON is pure ASCII —
 * safe regardless of server Content-Type charset.
 */
function jsonLdStr(data) {
  return JSON.stringify(data, null, 2)
    // Escape non-ASCII as \uXXXX unicode escapes (valid JSON)
    .replace(/[^\x00-\x7F]/g, (c) => {
      const cp = c.codePointAt(0);
      return cp > 0xFFFF
        ? `\\u${((cp - 0x10000) >> 10 | 0xD800).toString(16).padStart(4,'0')}\\u${((cp - 0x10000) & 0x3FF | 0xDC00).toString(16).padStart(4,'0')}`
        : `\\u${cp.toString(16).padStart(4, '0')}`;
    })
    // Prevent </script> injection
    .replace(/<\/script>/gi, '<\\/script>');
}

// ─── meta generators ──────────────────────────────────────────────────────────

function buildPostMeta(post, lang) {
  const pageUrl   = `${SITE}/${lang}/blog/${post.slug}`;
  const imageUrl  = post.ogImage.startsWith('http')
    ? post.ogImage
    : `${SITE}${encodePath(post.ogImage)}`;

  const ld = jsonLdStr({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author, url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Cx Assistant',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  });

  const articleTags = post.tags
    .map(t => `  <meta property="article:tag" content="${esc(t)}" />`)
    .join('\n');

  const hreflangLinks = SUPPORTED_LANGS
    .map(l => `  <link rel="alternate" hreflang="${l}" href="${SITE}/${l}/blog/${post.slug}" />`)
    .join('\n');

  return `
  <!-- Primary SEO -->
  <title>${esc(post.title)} | Cx Assistant</title>
  <meta name="description" content="${esc(post.description)}" />
  <meta name="keywords" content="${esc(post.tags.join(', '))}" />
  <meta name="author" content="${esc(post.author)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${pageUrl}" />
${hreflangLinks}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/blog/${post.slug}" />

  <!-- Open Graph - Facebook / LinkedIn / WhatsApp -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Cx Assistant" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${esc(post.title)}" />
  <meta property="og:description" content="${esc(post.description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content="${esc(post.title)}" />
  <meta property="article:published_time" content="${post.date}" />
  <meta property="article:modified_time" content="${post.date}" />
  <meta property="article:section" content="${esc(post.category)}" />
${articleTags}

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(post.title)}" />
  <meta name="twitter:description" content="${esc(post.description)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${esc(post.title)}" />

  <!-- Structured Data: BlogPosting (Google rich results) -->
  <script type="application/ld+json">
${ld}
  </script>
`;
}

function buildBlogListMeta(lang) {
  const pageUrl = `${SITE}/${lang}/blog`;
  const isEs    = lang === 'es';
  const title   = isEs ? 'Blog | Cx Assistant' : 'Blog | Cx Assistant';
  const desc    = isEs
    ? 'Perspectivas de ingeniería, actualizaciones de producto y mejores prácticas de commissioning del equipo de Cx Assistant.'
    : 'Engineering insights, product updates, and commissioning best practices from the Cx Assistant team.';
  const image   = `${SITE}/og-image.png`;

  const ld = jsonLdStr({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Cx Assistant Blog',
    description: desc,
    url: pageUrl,
    publisher: { '@type': 'Organization', name: 'Cx Assistant', url: SITE },
  });

  const hreflangLinks = SUPPORTED_LANGS
    .map(l => `  <link rel="alternate" hreflang="${l}" href="${SITE}/${l}/blog" />`)
    .join('\n');

  return `
  <!-- Primary SEO -->
  <title>${title}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="keywords" content="commissioning blog, engineering insights, commissioning software" />
  <meta name="author" content="Cx Assistant" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${pageUrl}" />
${hreflangLinks}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/blog" />

  <!-- Open Graph - Facebook / LinkedIn / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Cx Assistant" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content="Cx Assistant Blog" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="Cx Assistant Blog" />

  <!-- Structured Data: Blog -->
  <script type="application/ld+json">
${ld}
  </script>
`;
}

// ─── home & contact meta generators ──────────────────────────────────────────

function buildHomeMeta(lang) {
  const pageUrl = `${SITE}/${lang}/`;
  const isEs    = lang === 'es';

  const title = isEs
    ? 'Cx Assistant \u2014 Plataforma de Commissioning con IA para Equipos de Ingenier\u00eda'
    : 'Cx Assistant \u2014 AI Commissioning Platform for Engineering Teams';

  const desc = isEs
    ? 'Cx Assistant es una plataforma de commissioning impulsada por IA que ayuda a los equipos de ingenier\u00eda a gestionar issues, assets y documentaci\u00f3n \u2014 de forma m\u00e1s r\u00e1pida, inteligente y consistente.'
    : 'Cx Assistant is an AI-powered commissioning platform that helps engineering teams manage issues, assets, and documentation \u2014 faster, smarter, and more consistently.';

  const keywords = isEs
    ? 'software de commissioning, plataforma de commissioning con IA, gesti\u00f3n de proyectos de ingenier\u00eda, asistente IA de commissioning, gesti\u00f3n de issues, seguimiento de assets, gesti\u00f3n de documentaci\u00f3n, data center commissioning'
    : 'commissioning software, AI commissioning platform, engineering project management, commissioning AI assistant, issues management, assets tracking, documentation management, data center commissioning';

  const image = `${SITE}/og-image.png`;

  const hreflangLinks = SUPPORTED_LANGS
    .map(l => `  <link rel="alternate" hreflang="${l}" href="${SITE}/${l}/" />`)
    .join('\n');

  const ld = jsonLdStr({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cx Assistant',
    description: desc,
    url: pageUrl,
    publisher: { '@type': 'Organization', name: 'Cx Assistant', url: SITE },
  });

  return `
  <!-- Primary SEO -->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="keywords" content="${esc(keywords)}" />
  <meta name="author" content="Cx Assistant" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${pageUrl}" />
${hreflangLinks}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Cx Assistant" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content="Cx Assistant" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="Cx Assistant" />

  <!-- Structured Data: WebSite -->
  <script type="application/ld+json">
${ld}
  </script>
`;
}

function buildContactMeta(lang) {
  const pageUrl = `${SITE}/${lang}/contact`;
  const isEs    = lang === 'es';

  const title = isEs ? 'Contacto | Cx Assistant' : 'Contact | Cx Assistant';

  const desc = isEs
    ? 'Contacta con el equipo de Cx Assistant. Estamos aqu\u00ed para ayudarte con cualquier consulta sobre nuestra plataforma de commissioning impulsada por IA.'
    : 'Get in touch with the Cx Assistant team. We\'re here to help with questions about our AI-powered commissioning platform.';

  const image = `${SITE}/og-image.png`;

  const hreflangLinks = SUPPORTED_LANGS
    .map(l => `  <link rel="alternate" hreflang="${l}" href="${SITE}/${l}/contact" />`)
    .join('\n');

  return `
  <!-- Primary SEO -->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="author" content="Cx Assistant" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${pageUrl}" />
${hreflangLinks}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/contact" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Cx Assistant" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content="Cx Assistant" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="Cx Assistant" />
`;
}

// ─── inject helper ────────────────────────────────────────────────────────────

function inject(template, meta) {
  const startIdx = template.indexOf(MARKER_START);
  const endIdx   = template.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `Prerender markers not found in dist/index.html.\n` +
      `Add <!-- PRERENDER:META_START --> … <!-- PRERENDER:META_END --> to index.html.`
    );
  }

  return (
    template.slice(0, startIdx) +
    meta +
    template.slice(endIdx + MARKER_END.length)
  );
}

// ─── per-language post metadata ───────────────────────────────────────────────

/**
 * Blog post metadata keyed by language.
 * EN data is sourced from metadata.json (single source of truth).
 * ES metadata is kept here to avoid importing TypeScript at runtime.
 */
const enPosts = JSON.parse(
  readFileSync(join(ROOT, 'src', 'blog', 'posts', 'metadata.json'), 'utf-8')
);

const esPosts = [
  {
    slug: 'why-commissioning-teams-still-track-documentation-in-excel',
    title: 'Por qué los equipos de commissioning siguen gestionando la documentación en Excel — y por qué construimos algo mejor',
    description:
      'Los trackers de documentación basados en Excel siguen siendo la norma en commissioning. Descubre los problemas reales que generan — enlaces rotos, requisitos poco claros, sin conexión a assets — y cómo Cx Assistant fue diseñado para resolverlos.',
    date: '2026-03-08',
    author: 'Cx Assistant Team',
    category: 'Producto',
    tags: ['commissioning', 'documentación', 'asset-management', 'data-center'],
    readTime: 6,
    ogImage: '/blog-images/commissioning-teams-tracker/cx-assistant-tracker-overview.png',
  },
  {
    slug: 'plan-vs-actual-in-commissioning-why-its-harder-than-it-looks',
    title: 'Plan vs Real en Commissioning: Por qué es más complejo de lo que parece',
    description:
      'El seguimiento Plan vs Real se usa en todos los proyectos de commissioning, pero el proceso detrás es sorprendentemente complejo. Aprende qué lo hace difícil y cómo Cx Assistant lo simplifica.',
    date: '2026-03-15',
    author: 'Cx Assistant Team',
    category: 'Producto',
    tags: ['commissioning', 'planificación', 'seguimiento-progreso', 'data-center'],
    readTime: 7,
    ogImage: '/blog-images/plan-vs-actual/plan-vs-actual-overview-1.png',
  },
];

const postsByLang = { en: enPosts, es: esPosts };

// ─── main ─────────────────────────────────────────────────────────────────────

const template = readFileSync(join(ROOT, 'dist', 'index.html'), { encoding: 'utf-8' });

let totalPages = 0;

for (const lang of SUPPORTED_LANGS) {
  const posts = postsByLang[lang];

  // /<lang>/index.html (home)
  const langDir = join(ROOT, 'dist', lang);
  mkdirSync(langDir, { recursive: true });
  writeFileSync(join(langDir, 'index.html'), Buffer.from(inject(template, buildHomeMeta(lang)), 'utf-8'));
  console.log(`  ✓ dist/${lang}/index.html`);
  totalPages++;

  // /<lang>/contact/index.html
  const contactDir = join(ROOT, 'dist', lang, 'contact');
  mkdirSync(contactDir, { recursive: true });
  writeFileSync(join(contactDir, 'index.html'), Buffer.from(inject(template, buildContactMeta(lang)), 'utf-8'));
  console.log(`  ✓ dist/${lang}/contact/index.html`);
  totalPages++;

  // /<lang>/blog/index.html
  const blogDir = join(ROOT, 'dist', lang, 'blog');
  mkdirSync(blogDir, { recursive: true });
  writeFileSync(join(blogDir, 'index.html'), Buffer.from(inject(template, buildBlogListMeta(lang)), 'utf-8'));
  console.log(`  ✓ dist/${lang}/blog/index.html`);
  totalPages++;

  // /<lang>/blog/<slug>/index.html
  for (const post of posts) {
    const dir = join(ROOT, 'dist', lang, 'blog', post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), Buffer.from(inject(template, buildPostMeta(post, lang)), 'utf-8'));
    console.log(`  ✓ dist/${lang}/blog/${post.slug}/index.html`);
    totalPages++;
  }
}

console.log(`\n✅ Prerendered ${totalPages} blog page(s) with static meta tags.\n`);
