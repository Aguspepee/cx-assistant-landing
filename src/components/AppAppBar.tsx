import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useLang, useLangPath, useAlternateLangPath } from '../i18n/useLang';
import type { Lang } from '../i18n/index';
import { SUPPORTED_LANGS } from '../i18n/index';

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'atTop',
})<{ atTop?: boolean }>(({ theme, atTop }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  // Smooth transition between top and scrolled states
  transition: 'background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease',
  ...(atTop
    ? {
        // Minimalist/transparent look at the very top
        backdropFilter: 'none',
        border: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: '8px 12px',
      }
    : {
        // Existing styled look when scrolled
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: (theme.vars || theme).palette.divider,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
          : alpha(theme.palette.background.default, 0.4),
        boxShadow: (theme.vars || theme).shadows[1],
        padding: '8px 12px',
      }),
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [isAtTop, setIsAtTop] = React.useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const lang = useLang();
  const lp = useLangPath();
  const esPath = useAlternateLangPath('es');
  const enPath = useAlternateLangPath('en');

  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 4);
    };
    // Initialize on mount in case we render not at top
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Smooth scroll handler — navigates home first if not already there
  const handleScrollTo = (id: string) => {
    const homePath = lp('/');
    if (window.location.pathname !== homePath && window.location.pathname !== `/${lang}`) {
      navigate(homePath);
      // Allow page to render before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        top: 12,
      }}
    >
      <Container maxWidth="lg">
  <StyledToolbar variant="dense" disableGutters atTop={isAtTop}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <img
              src={isAtTop ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Cx Assistant Logo"
              style={{ height: '22px', marginRight: '8px', cursor: 'pointer', transition: 'opacity 0.25s ease' }}
              onClick={() => { navigate(lp('/')); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {(['highlights', 'features', 'faq'] as const).map((id) => (
                <Button
                  key={id}
                  variant="text"
                  size="small"
                  onClick={() => handleScrollTo(id)}
                  sx={{
                    color: isAtTop ? 'rgba(255,255,255,0.72)' : 'text.secondary',
                    '&:hover': { color: isAtTop ? '#fff' : 'text.primary', bgcolor: 'transparent' },
                  }}
                >
                  {t(`nav.${id}`)}
                </Button>
              ))}
              <Button
                variant="text"
                size="small"
                component={RouterLink}
                to={lp('/blog')}
                sx={{
                  color: isAtTop ? 'rgba(255,255,255,0.72)' : 'text.secondary',
                  '&:hover': { color: isAtTop ? '#fff' : 'text.primary', bgcolor: 'transparent' },
                }}
              >
                {t('nav.blog')}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {/* Language switcher */}
            <Box sx={{ display: 'flex', gap: 0.25, mr: 0.5 }}>
              {(SUPPORTED_LANGS as readonly Lang[]).map((l) => (
                <Button
                  key={l}
                  component={RouterLink}
                  to={l === 'en' ? enPath : esPath}
                  variant="text"
                  size="small"
                  sx={{
                    minWidth: 0,
                    px: 0.75,
                    py: 0.25,
                    fontSize: '0.72rem',
                    fontWeight: lang === l ? 700 : 400,
                    color: isAtTop
                      ? (lang === l ? '#fff' : 'rgba(255,255,255,0.4)')
                      : (lang === l ? 'text.primary' : 'text.disabled'),
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    '&:hover': { color: isAtTop ? '#fff' : 'text.primary' },
                  }}
                >
                  {l}
                </Button>
              ))}
            </Box>
            <Button
              variant="text"
              size="small"
              href="https://app.cx-assistant.com/login"
              sx={{
                color: isAtTop ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                '&:hover': { color: isAtTop ? '#fff' : 'text.primary', bgcolor: 'transparent' },
              }}
            >
              {t('nav.signIn')}
            </Button>
            <Button
              variant="contained"
              size="small"
              href="https://app.cx-assistant.com/sign-up"
              sx={isAtTop ? {
                bgcolor: '#DCFFB6',
                color: '#111314',
                fontWeight: 700,
                boxShadow: '0 0 16px rgba(220,255,182,0.25)',
                '&:hover': { bgcolor: '#c8f59e', boxShadow: '0 0 24px rgba(220,255,182,0.35)' },
              } : {}}
            >
              {t('nav.signUp')}
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => { handleScrollTo('highlights'); setOpen(false); }}>{t('nav.highlights')}</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('features'); setOpen(false); }}>{t('nav.features')}</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('faq'); setOpen(false); }}>{t('nav.faq')}</MenuItem>
                <MenuItem component={RouterLink} to={lp('/blog')} onClick={() => setOpen(false)}>{t('nav.blog')}</MenuItem>
                <Divider sx={{ my: 3 }} />
                {/* Language switcher for mobile */}
                <Box sx={{ display: 'flex', gap: 1, px: 2, mb: 1 }}>
                  {(SUPPORTED_LANGS as readonly Lang[]).map((l) => (
                    <Button
                      key={l}
                      component={RouterLink}
                      to={l === 'en' ? enPath : esPath}
                      variant={lang === l ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setOpen(false)}
                      sx={{ minWidth: 0, px: 1.5, textTransform: 'uppercase', fontSize: '0.75rem' }}
                    >
                      {l}
                    </Button>
                  ))}
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth href="https://app.cx-assistant.com/sign-up">
                    {t('nav.signUp')}
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth href="https://app.cx-assistant.com/login">
                    {t('nav.signIn')}
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
