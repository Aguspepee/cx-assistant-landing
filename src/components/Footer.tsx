import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://cx-assistant.com/">
        Cx Assistant
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const { t } = useTranslation('common');
  const lp = useLangPath();
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <img src="/logo.svg" alt="Cx Assistant Logo" style={{ height: '22px' }} />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
            {t('footer.newsletter.title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('footer.newsletter.subtitle')}
            </Typography>
            <InputLabel htmlFor="email-newsletter">{t('footer.newsletter.emailLabel')}</InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="Enter your email address"
                placeholder={t('footer.newsletter.emailPlaceholder')}
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': t('footer.newsletter.emailPlaceholder'),
                  },
                }}
                sx={{ width: '250px' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
              {t('footer.newsletter.subscribe')}
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {t('footer.product.title')}
          </Typography>
          <Link color="text.secondary" variant="body2" component={RouterLink} to={lp('/#features')}>
            {t('footer.product.features')}
          </Link>
          <Link color="text.secondary" variant="body2" component={RouterLink} to={lp('/#highlights')}>
            {t('footer.product.highlights')}
          </Link>
          <Link color="text.secondary" variant="body2" component={RouterLink} to={lp('/#faq')}>
            {t('footer.product.faqs')}
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {t('footer.company.title')}
          </Typography>
          <Link color="text.secondary" variant="body2" component={RouterLink} to={lp('/about')}>
            {t('footer.company.about')}
          </Link>
          <Link color="text.secondary" variant="body2" component={RouterLink} to={lp('/blog')}>
            {t('nav.blog')}
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {t('footer.legal.title')}
          </Typography>
          <Link color="text.secondary" variant="body2" href="https://app.cx-assistant.com/legal/terms" target="_blank" rel="noopener noreferrer">
            {t('footer.legal.terms')}
          </Link>
          <Link color="text.secondary" variant="body2" href="https://app.cx-assistant.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            {t('footer.legal.privacy')}
          </Link>
          <Link color="text.secondary" variant="body2" component={RouterLink} to={lp('/contact')}>
            {t('footer.legal.contact')}
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Link color="text.secondary" variant="body2" href="https://app.cx-assistant.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            {t('footer.privacyPolicy')}
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="https://app.cx-assistant.com/legal/terms" target="_blank" rel="noopener noreferrer">
            {t('footer.termsOfService')}
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
         {/*  <IconButton
            color="inherit"
            size="small"
            href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://x.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton> */}
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/company/cx-assistant"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
