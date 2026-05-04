import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLang } from './i18n/useLang';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { keyframes } from '@emotion/react';

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.04); }
`;

const gradientGlow = keyframes`
  0%        { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
  100%      { background-position: 0% 50%; }
`;
import AppTheme from './theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import FeatureShowcase from './components/FeatureShowcase';
import BlogPreview from './components/BlogPreview';
import ChatShowcase from './components/ChatShowcase';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  const { t } = useTranslation('home');
  const lang = useLang();
  const BASE = 'https://cx-assistant.com';
  const parallaxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * -0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppTheme {...props}>
      <Helmet>
        <title>{t('seo.homeTitle')}</title>
        <meta name="description" content={t('seo.homeDescription')} />
        <link rel="canonical" href={`${BASE}/${lang}/`} />
        <link rel="alternate" hrefLang="en" href={`${BASE}/en/`} />
        <link rel="alternate" hrefLang="es" href={`${BASE}/es/`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/en/`} />
        <meta property="og:url" content={`${BASE}/${lang}/`} />
        <meta property="og:title" content={t('seo.homeTitle')} />
        <meta property="og:type" content="website" />
      </Helmet>
      <CssBaseline enableColorScheme />
      {/* AppAppBar must live outside any filtered/animated container so position:fixed works correctly */}
      <AppAppBar />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(76deg, #b7b7b7 0%, #DCFFB6 50%, #c8e89a 72%, #b7b7b7 100%)',
          backgroundSize: '300% 300%',
          animation: `${gradientGlow} 10s ease-in-out infinite`,
          position: 'relative',
          overflow: 'clip',
        }}
      >
        {/* Parallax SVG lines — fixed layer that drifts slower than page scroll */}
        <Box
          ref={parallaxRef}
          sx={{
            position: 'fixed',
            top: '-50vh',
            left: 0,
            width: '100%',
            height: '350vh',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'transform',
            opacity: 0.18,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              animation: `${breathe} 7s ease-in-out infinite`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src="/backgrounds/background-lines.svg"
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
          </Box>
        </Box>

        {/* Content sits above the SVG layer */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          {/* <HeroCarousel /> */}
          <div>
            <Divider />
            <Divider />
            <Highlights />
            <Divider />
            <ChatShowcase />
           {/*  <AIFeature />
            <Divider /> */}
            <FeatureShowcase />
            <Divider />
            <BlogPreview />
            <Divider />
            <FAQ />
            <Divider />
            <Footer />
          </div>
        </Box>
      </Box>
    </AppTheme>
  );
}
