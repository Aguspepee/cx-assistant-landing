import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLang } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AppTheme from '../theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function ContactCard({ icon, title, description, action }: ContactCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}22`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'primary.dark',
            color: 'primary.contrastText',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {description}
          </Typography>
        </Box>
        {action && <Box sx={{ mt: 'auto', pt: 1 }}>{action}</Box>}
      </CardContent>
    </Card>
  );
}

export default function Contact() {
  const { t } = useTranslation('contact');
  const lang = useLang();
  const BASE = 'https://cx-assistant.com';
  return (
    <AppTheme>
      <Helmet>
        <title>{t('seoTitle')}</title>
        <meta name="description" content={t('seoDescription')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${BASE}/${lang}/contact`} />
        <link rel="alternate" hrefLang="en" href={`${BASE}/en/contact`} />
        <link rel="alternate" hrefLang="es" href={`${BASE}/es/contact`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/en/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE}/${lang}/contact`} />
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
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
              {t('subtitle')}
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 6, sm: 8 } }} />

          {/* Contact Cards */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ContactCard
                icon={<EmailOutlinedIcon />}
                title={t('cards.email.title')}
                description={t('cards.email.description')}
                action={
                  <Button
                    variant="outlined"
                    size="small"
                    href="mailto:hello@cx-assistant.com"
                    fullWidth
                  >
                    hello@cx-assistant.com
                  </Button>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ContactCard
                icon={<LinkedInIcon />}
                title={t('cards.linkedin.title')}
                description={t('cards.linkedin.description')}
                action={
                  <Button
                    variant="outlined"
                    size="small"
                    href="https://www.linkedin.com/company/cx-assistant"
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    @cx-assistant
                  </Button>
                }
              />
            </Grid>

          </Grid>

          {/* CTA strip */}
          <Box
            sx={{
              mt: { xs: 8, sm: 10 },
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {t('cta.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cta.subtitle')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="https://app.cx-assistant.com/signup"
              sx={{ flexShrink: 0 }}
            >
              {t('cta.button')}
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
