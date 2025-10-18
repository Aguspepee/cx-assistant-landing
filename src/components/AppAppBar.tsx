import * as React from 'react';
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
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

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

  // Smooth scroll handler
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
  <StyledToolbar variant="dense" disableGutters atTop={isAtTop}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <img src={"/logo.svg"} alt="Cx Assistant Logo" style={{ height: '22px', marginRight: '8px' }} />
           {/*  <span style={{ fontSize: '0.8rem',  }}>Cx Assistant</span> */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small" onClick={() => handleScrollTo('features')}>
                Features
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => handleScrollTo('testimonials')}>
                Testimonials
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => handleScrollTo('highlights')}>
                Highlights
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => handleScrollTo('pricing')}>
                Pricing
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => handleScrollTo('faq')}>
                FAQ
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => handleScrollTo('blog')}>
                Blog
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
            <Button color="primary" variant="text" size="small" href="https://app.cx-assistant.com/login">
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" href="https://app.cx-assistant.com/sign-up">
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
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
                <MenuItem onClick={() => { handleScrollTo('features'); setOpen(false); }}>Features</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('testimonials'); setOpen(false); }}>Testimonials</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('highlights'); setOpen(false); }}>Highlights</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('pricing'); setOpen(false); }}>Pricing</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('faq'); setOpen(false); }}>FAQ</MenuItem>
                <MenuItem onClick={() => { handleScrollTo('blog'); setOpen(false); }}>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
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
