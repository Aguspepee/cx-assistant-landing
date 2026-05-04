import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme, useColorScheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function HeroCarousel() {
  const keyframes = `
    @keyframes sweep { 0% { transform: translateX(-120%); opacity: 0; } 20% { opacity:.25; } 50% { opacity:.35; } 100% { transform: translateX(120%); opacity:0; } }
    @keyframes glowPulse { 0%,100% { box-shadow: 0 8px 24px 4px rgba(0,0,0,0.25), 0 0 24px 6px rgba(80,140,255,0.12);} 50% { box-shadow: 0 8px 24px 4px rgba(0,0,0,0.25), 0 0 36px 12px rgba(80,140,255,0.18);} }
    @keyframes dotPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
  `;

  // ---- Theme & dark mode ----
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const fallbackMode = (theme as any)?.vars?.colorScheme || (theme as any)?.palette?.mode;
  const finalMode = resolvedMode ?? fallbackMode;
  const isDark = finalMode === 'dark';

  const heroFiles = isDark
    ? ['issues-dark.mp4', 'planner-dark.mp4']
    : ['issues-light.mp4', 'planner-light.mp4'];

  const [current, setCurrent] = React.useState(0);
  const [ratio, setRatio] = React.useState<number | null>(null);
  const handlePrev = () => setCurrent((p) => (p === 0 ? heroFiles.length - 1 : p - 1));
  const handleNext = () => setCurrent((p) => (p === heroFiles.length - 1 ? 0 : p + 1));

  React.useEffect(() => {
    setCurrent(0);
  }, [isDark]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ---- Lazy-load & autoplay ----
  const videoContainerRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = React.useState(false);
  const [canPlay, setCanPlay] = React.useState(false);

  React.useEffect(() => {
    const el = videoContainerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setCanPlay(false);
    v.muted = true;
    if (inView) {
      setTimeout(() => v.play().catch(() => {}), 0);
    } else {
      v.pause();
    }
  }, [current, inView]);

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      <Container sx={{ py: { xs: 6, sm: 8 } }}>
        {/* Carousel Card */}
        <Box
          component={motion.div}
          sx={(theme) => ({
            alignSelf: 'center',
            width: '100%',
            maxWidth: 1400,
            mx: 'auto',
            borderRadius: (theme.vars || theme).shape.borderRadius,
            outline: '6px solid',
            outlineColor: 'hsla(220, 25%, 80%, 0.2)',
            border: '1px solid',
            borderColor: 'rgba(80,80,82,0.98)',
            background: '#151515',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            position: 'relative',
            overflow: 'hidden',
            animation: 'glowPulse 6s ease-in-out infinite',
            ...theme.applyStyles('dark', {
              outlineColor: 'hsla(210, 35%, 40%, 0.15)',
              borderColor: 'rgba(80,80,82,0.98)',
              background: '#151515',
            }),
            transformStyle: 'preserve-3d',
            perspective: 1000,
          })}
          whileHover={{ rotateX: -2, rotateY: 2 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        >
          {/* Mac window chrome */}
          <Box
            sx={{
              width: '100%',
              height: 38,
              background: 'rgba(36,36,38,0.98)',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {/* Traffic lights */}
            <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
              {(['#FF5F57', '#FEBC2E', '#28C840']).map((color, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: color,
                    flexShrink: 0,
                    boxShadow: `0 0 4px ${color}55`,
                  }}
                />
              ))}
            </Box>
            {/* Fake URL bar */}
            <Box
              sx={{
                height: 22,
                width: 240,
                mx: 'auto',
                borderRadius: '5px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                px: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.18)',
                  flexShrink: 0,
                }}
              />
              <Box
                component="span"
                sx={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.32)',
                  fontFamily: '"SF Mono", ui-monospace, monospace',
                  letterSpacing: '0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                app.cx-assistant.com
              </Box>
            </Box>
          </Box>

          {/* Video area */}
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >

          {/* Sweep highlight */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              '&::before': {
                content: '" "',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '30%',
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.2) 50%, rgba(255,255,255,0) 100%)',
                filter: 'blur(6px)',
                animation: 'sweep 6s ease-in-out infinite',
              },
            }}
          />

          <IconButton
            aria-label="Previous slide"
            onClick={handlePrev}
            sx={{
              position: 'absolute', left: 8, top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper', opacity: 0.7,
              '&:hover': { opacity: 1 }, zIndex: 2,
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <Box
            ref={videoContainerRef}
            sx={{
              width: '100%',
              aspectRatio: ratio ?? '16 / 9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform',
            }}
          >
            <motion.video
              key={heroFiles[current]}
              ref={videoRef}
              src={inView ? `/videos/hero/${heroFiles[current]}` : undefined}
              aria-label={heroFiles[current].replace(/[-].*|\.mp4$/g, '').replace(/-/g, ' ')}
              preload="metadata"
              playsInline
              autoPlay
              muted
              loop
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain', objectPosition: 'center',
                borderRadius: 'inherit',
                willChange: 'transform, opacity',
                background: '#151515',
              }}
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onLoadedMetadata={(e) => {
                const vid = e.currentTarget as HTMLVideoElement;
                if (vid.videoWidth && vid.videoHeight) setRatio(vid.videoWidth / vid.videoHeight);
              }}
              onCanPlay={() => setCanPlay(true)}
            />
          </Box>

          <IconButton
            aria-label="Next slide"
            onClick={handleNext}
            sx={{
              position: 'absolute', right: 8, top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper', opacity: 0.7,
              '&:hover': { opacity: 1 }, zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute', bottom: 12, left: 0,
              width: '100%', display: 'flex',
              justifyContent: 'center', gap: 1,
            }}
          >
            {heroFiles.map((_, idx) => (
              <Box
                key={idx}
                role="button"
                aria-label={`Go to slide ${idx + 1}`}
                tabIndex={0}
                onClick={() => setCurrent(idx)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setCurrent(idx)}
                sx={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  bgcolor: idx === current ? 'primary.main' : 'grey.400',
                  opacity: idx === current ? 1 : 0.5,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  animation: idx === current ? 'dotPulse 2.2s ease-in-out infinite' : undefined,
                }}
              />
            ))}
          </Box>
          </Box>{/* end video area */}
        </Box>
      </Container>
    </Box>
  );
}
