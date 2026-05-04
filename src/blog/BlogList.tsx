import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLang, useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import { getPostsByLang } from './posts/index';

export default function BlogList() {
  const { t } = useTranslation('blog');
  const { t: tc } = useTranslation('common');
  const lang = useLang();
  const lp = useLangPath();
  const posts = getPostsByLang(lang);
  const BASE = 'https://cx-assistant.com';

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <AppTheme>
      <Helmet>
        <title>{t('list.seoTitle')}</title>
        <meta name="description" content={t('list.seoDescription')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE}/${lang}/blog`} />
        <link rel="alternate" hrefLang="en" href={`${BASE}/en/blog`} />
        <link rel="alternate" hrefLang="es" href={`${BASE}/es/blog`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/en/blog`} />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE}/${lang}/blog`} />
        <meta property="og:title" content={t('list.seoTitle')} />
        <meta property="og:description" content={t('list.seoDescription')} />
        <meta property="og:image" content={`${BASE}/og-image.png`} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('list.seoTitle')} />
        <meta name="twitter:description" content={t('list.seoDescription')} />
        <meta name="twitter:image" content={`${BASE}/og-image.png`} />
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
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Typography
              component="h1"
              variant="h3"
              sx={{ fontWeight: 700, mb: 1.5, letterSpacing: '-0.02em' }}
            >
              {t('list.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
              {t('list.subtitle')}
            </Typography>
          </Box>
          <Divider sx={{ mb: 6 }} />

          {/* Post cards */}
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            }}
          >
            {posts.map((post) => (
              <Card
                key={post.slug}
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <CardActionArea
                  component={RouterLink}
                  to={lp(`/blog/${post.slug}`)}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.ogImage}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                      <Chip label={post.category} size="small" color="primary" variant="outlined" />
                      {post.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.01em', lineHeight: 1.35 }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.disabled">
                        {formatDate(post.date)}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        ·
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {post.readTime} {tc('meta.minRead')}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
