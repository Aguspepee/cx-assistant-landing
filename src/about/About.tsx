import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLang, useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppTheme from '../theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import { brand } from '../theme/themePrimitives';

interface ValueCardProps {
  title: string;
  description: string;
}

function ValueCard({ title, description }: ValueCardProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}22`,
        },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Box>
  );
}

export default function About() {
  const { t } = useTranslation('about');
  const lang = useLang();
  const lp = useLangPath();
  const BASE = 'https://cx-assistant.com';

  const values = t('values.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  return (
    <AppTheme>
      <Helmet>
        <title>{t('seoTitle')}</title>
        <meta name="description" content={t('seoDescription')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE}/${lang}/about`} />
        <link rel="alternate" hrefLang="en" href={`${BASE}/en/about`} />
        <link rel="alternate" hrefLang="es" href={`${BASE}/es/about`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/en/about`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE}/${lang}/about`} />
        <meta property="og:title" content={t('seoTitle')} />
        <meta property="og:description" content={t('seoDescription')} />
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
          <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <Typography
              component="h1"
              variant="h3"
              sx={{ fontWeight: 700, mb: 1.5, letterSpacing: '-0.02em' }}
            >
              {t('title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
              {t('subtitle')}
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 6, sm: 8 } }} />

          {/* Mission */}
          <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <Typography
              variant="overline"
              sx={{ color: brand[700], fontWeight: 600, letterSpacing: 1.2 }}
            >
              {t('mission.label')}
            </Typography>
            <Typography
              variant="h5"
              sx={{ mt: 1, fontWeight: 500, lineHeight: 1.6, maxWidth: 680 }}
            >
              {t('mission.text')}
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 6, sm: 8 } }} />

          {/* Story */}
          <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <Typography
              variant="overline"
              sx={{ color: brand[700], fontWeight: 600, letterSpacing: 1.2 }}
            >
              {t('story.label')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, lineHeight: 1.8, maxWidth: 680 }}
            >
              {t('story.text')}
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 6, sm: 8 } }} />

          {/* Values */}
          <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <Typography
              variant="overline"
              sx={{ color: brand[700], fontWeight: 600, letterSpacing: 1.2, display: 'block', mb: 3 }}
            >
              {t('values.label')}
            </Typography>
            <Grid container spacing={2}>
              {values.map((value) => (
                <Grid key={value.title} size={{ xs: 12, sm: 4 }}>
                  <ValueCard title={value.title} description={value.description} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ mb: { xs: 6, sm: 8 } }} />

          {/* CTA */}
          <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.01em' }}
            >
              {t('cta.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('cta.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                href="https://app.cx-assistant.com/sign-up"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('cta.signUp')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to={lp('/contact')}
              >
                {t('cta.contact')}
              </Button>
            </Box>
          </Box>

        </Container>
      </Box>

      <Footer />
    </AppTheme>
  );
}
