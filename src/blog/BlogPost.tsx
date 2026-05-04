import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLang, useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import IosShareIcon from '@mui/icons-material/IosShare';
import AppTheme from '../theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import { getPostsByLang } from './posts/index';
import type { ContentBlock } from './types';

const SITE = 'https://cx-assistant.com';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Share bar ────────────────────────────────────────────────────────────────

interface ShareBarProps {
  url: string;
  title: string;
  description: string;
  compact?: boolean;
}

function ShareBar({ url, title, description, compact = false }: ShareBarProps) {
  const { t } = useTranslation('blog');
  const { t: tc } = useTranslation('common');
  const [copied, setCopied] = React.useState(false);

  const linkedInUrl =
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // User cancelled — no-op
      }
    } else {
      // Fallback: open LinkedIn share in a popup
      window.open(linkedInUrl, '_blank', 'width=600,height=540,noopener,noreferrer');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard not available — silent no-op
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? 0.5 : 1,
        }}
      >
        {!compact && (
          <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
            {tc('actions.share')}:
          </Typography>
        )}

        {/* Native share (mobile) / LinkedIn popup (desktop) */}
        <Tooltip title={tc('actions.sharePost')}>
          <IconButton
            size="small"
            onClick={handleNativeShare}
            aria-label={tc('actions.sharePost')}
            sx={{ color: 'text.secondary', '&:hover': { color: '#0A66C2' } }}
          >
            <IosShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* LinkedIn direct */}
        <Tooltip title={tc('actions.shareLinkedIn')}>
          <IconButton
            size="small"
            component="a"
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tc('actions.shareLinkedIn')}
            sx={{ color: 'text.secondary', '&:hover': { color: '#0A66C2' } }}
          >
            <LinkedInIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Copy link */}
        <Tooltip title={copied ? tc('actions.copied') : tc('actions.copyLink')}>
          <IconButton
            size="small"
            onClick={handleCopy}
            aria-label={tc('actions.copyLink')}
            sx={{
              color: copied ? 'success.main' : 'text.secondary',
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s',
            }}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message={tc('actions.copied')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}

function MacBrowserFrame({ src, alt }: { src?: string; alt?: string }) {
  return (
    <Box
      sx={{
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        bgcolor: 'background.paper',
      }}
    >
      {/* Title bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 1,
          bgcolor: 'grey.100',
          borderBottom: '1px solid',
          borderColor: 'divider',
          gap: 1,
          '.MuiBox-root[data-theme="dark"] &': {
            bgcolor: 'grey.900',
          },
        }}
      >
        {/* Traffic-light dots */}
        <Box sx={{ display: 'flex', gap: 0.7, flexShrink: 0 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
          ))}
        </Box>
        {/* Fake address bar */}
        <Box
          sx={{
            flex: 1,
            mx: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '6px',
            height: 22,
          }}
        />
      </Box>
      {/* Screenshot */}
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          width: '100%',
          display: 'block',
          maxHeight: 480,
          objectFit: 'cover',
          objectPosition: 'top',
        }}
      />
    </Box>
  );
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'h2':
      return (
        <Typography
          key={index}
          component="h2"
          variant="h4"
          sx={{ fontWeight: 700, mt: 6, mb: 2, letterSpacing: '-0.02em' }}
        >
          {block.text}
        </Typography>
      );
    case 'h3':
      return (
        <Typography
          key={index}
          component="h3"
          variant="h6"
          sx={{ fontWeight: 700, mt: 4, mb: 1.5 }}
        >
          {block.text}
        </Typography>
      );
    case 'paragraph':
      return (
        <Typography
          key={index}
          variant="body1"
          sx={{ mb: 2, lineHeight: 1.8, color: 'text.primary' }}
        >
          {block.text}
        </Typography>
      );
    case 'bullet-list':
      return (
        <Box key={index} component="ul" sx={{ pl: 3, mb: 2 }}>
          {block.items?.map((item, i) => (
            <Typography key={i} component="li" variant="body1" sx={{ mb: 0.75, lineHeight: 1.8 }}>
              {item}
            </Typography>
          ))}
        </Box>
      );
    case 'image':
      return (
        <Box key={index} sx={{ my: 4 }}>
          <Box
            component="img"
            src={block.src}
            alt={block.alt}
            loading="lazy"
            sx={{
              width: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              display: 'block',
              maxHeight: 480,
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
          {block.caption && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic' }}
            >
              {block.caption}
            </Typography>
          )}
        </Box>
      );
    case 'screenshot':
      return (
        <Box key={index} sx={{ my: 4 }}>
          <MacBrowserFrame src={block.src} alt={block.alt} />
          {block.caption && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic' }}
            >
              {block.caption}
            </Typography>
          )}
        </Box>
      );
    case 'callout':
      return (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            my: 4,
            p: 3,
            borderRadius: 3,
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.8 }}>
            {block.text}
          </Typography>
        </Paper>
      );
    case 'divider':
      return <Divider key={index} sx={{ my: 5 }} />;
    default:
      return null;
  }
}

export default function BlogPost() {
  const { t } = useTranslation('blog');
  const { t: tc } = useTranslation('common');
  const lang = useLang();
  const lp = useLangPath();
  const posts = getPostsByLang(lang);
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to={lp('/blog')} replace />;
  }

  const canonicalUrl = `${SITE}/${lang}/blog/${post.slug}`;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Set title synchronously before browser paints to avoid flash from React 19's
  // async title hoisting (react-helmet-async v3 renders <title> as a React element
  // that React 19 hoists, which can briefly show the wrong title in the tab).
  React.useLayoutEffect(() => {
    document.title = `${post.title} | Cx Assistant`;
  }, [post.title]);

  const ogImageUrl = post.ogImage.startsWith('http') ? post.ogImage : `${SITE}${post.ogImage}`;

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: ogImageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cx Assistant',
      url: SITE,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  });

  return (
    <AppTheme>
      <Helmet>
        <title>{post.title} | Cx Assistant</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={`${SITE}/en/blog/${post.slug}`} />
        <link rel="alternate" hrefLang="es" href={`${SITE}/es/blog/${post.slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE}/en/blog/${post.slug}`} />
        {/* Open Graph — social sharing (LinkedIn, WhatsApp, Facebook) */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Cx Assistant" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={post.date} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        {/* JSON-LD structured data */}
        <script type="application/ld+json">{articleJsonLd}</script>
      </Helmet>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Box
        component="main"
        sx={{
          pt: { xs: 12, sm: 14 },
          pb: { xs: 8, sm: 12 },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="md">
          {/* Back button */}
          <Button
            component={RouterLink}
            to={lp('/blog')}
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="inherit"
            size="small"
            sx={{ mb: 4, opacity: 0.7, '&:hover': { opacity: 1 } }}
          >
            {tc('actions.allPosts')}
          </Button>

          {/* Post header */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
              <Chip label={post.category} size="small" color="primary" variant="outlined" />
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{ fontWeight: 800, mb: 2.5, letterSpacing: '-0.03em', lineHeight: 1.2 }}
            >
              {post.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, fontSize: '1.1rem', lineHeight: 1.7 }}>
              {post.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {post.author}
              </Typography>
              <Typography variant="body2" color="text.disabled">·</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(post.date)}
              </Typography>
              <Typography variant="body2" color="text.disabled">·</Typography>
              <Typography variant="body2" color="text.secondary">
                {post.readTime} {tc('meta.minRead')}
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <ShareBar url={canonicalUrl} title={post.title} description={post.description} compact />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 5 }} />

          {/* Post content */}
          <Box
            sx={{
              '& img': { maxWidth: '100%' },
              '& ul': { color: 'text.primary' },
            }}
          >
            {post.content.map((block, i) => renderBlock(block, i))}
          </Box>

          <Divider sx={{ mt: 8, mb: 4 }} />

          {/* Share + CTA */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 5,
            }}
          >
            <ShareBar url={canonicalUrl} title={post.title} description={post.description} />
          </Box>

          {/* CTA */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              {t('post.ctaTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('post.ctaSubtitle')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="https://app.cx-assistant.com/sign-up"
            >
              {t('post.ctaButton')}
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
