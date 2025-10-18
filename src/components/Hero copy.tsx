import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';

import IconButton from '@mui/material/IconButton';
import { useTheme, useColorScheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Hero() {
  const keyframes = `
    @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes gridScroll { 0% { background-position: 0 0, 0 0; } 100% { background-position: 48px 48px, 48px 48px; } }
    @keyframes sweep { 0% { transform: translateX(-120%); opacity: 0; } 20% { opacity:.25; } 50% { opacity:.35; } 100% { transform: translateX(120%); opacity:0; } }
    @keyframes glowPulse { 0%,100% { box-shadow: 0 0 24px 6px rgba(80,140,255,0.12);} 50% { box-shadow:0 0 36px 12px rgba(80,140,255,0.18);} }
    @keyframes caretBlink { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
    @keyframes dotPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
    }
  `;

  // ---- Typewriter (cycle phrases) ----
  const phrases = [
    'Empowering Commissioning',
    'AI Built for Engineers',
    'Resolve Issues Faster',
    'Plan with Ease',
  ];

  type Phase = 'typing' | 'pausing' | 'deleting';
  const [phase, setPhase] = React.useState<Phase>('typing');
  const [index, setIndex] = React.useState(0);
  const [typed, setTyped] = React.useState('');

  React.useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches) {
      setTyped(phrases[0]);
      setPhase('pausing');
      return;
    }

    const full = phrases[index];
    const TYPING_SPEED = 38;
    const DELETING_SPEED = 24;
    const PAUSE_TIME = 1400;

    if (phase === 'typing') {
      if (typed.length < full.length) {
        const id = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), TYPING_SPEED);
        return () => clearTimeout(id);
      } else {
        const id = setTimeout(() => setPhase('pausing'), PAUSE_TIME);
        return () => clearTimeout(id);
      }
    }

    if (phase === 'pausing') {
      const id = setTimeout(() => setPhase('deleting'), 300);
      return () => clearTimeout(id);
    }

    if (phase === 'deleting') {
      if (typed.length > 0) {
        const id = setTimeout(() => setTyped(typed.slice(0, -1)), DELETING_SPEED);
        return () => clearTimeout(id);
      } else {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }
    }
  }, [phase, typed, index]);

  // ---- Rotating subline (option 2) ----
  const sublines = [
    'Turn test results into insight, instantly.',
    'Cut paperwork. Focus on engineering.',
    'Commission faster. Prove every milestone.',
  ];
  const [subIndex, setSubIndex] = React.useState(0);
  const [allowAnim, setAllowAnim] = React.useState(true);

  React.useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const reduced = !!media?.matches;
    setAllowAnim(!reduced);
    if (reduced) return;

    const id = setInterval(() => {
      setSubIndex((i) => (i + 1) % sublines.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  // ---- Micro-parallax (sets CSS vars on the hero) ----
  const heroRef = React.useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const px = (x - 0.5) * 16;
    const py = (y - 0.5) * 16;
    el.style.setProperty('--px', `${px}px`);
    el.style.setProperty('--py', `${py}px`);
  };

  // ---- Hero video carousel state and theme selection (must be top-level hooks) ----
  const theme = useTheme();
  // Use useColorScheme to match the same logic as Features.tsx so system or explicit mode are handled
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  // If useColorScheme doesn't provide a value, fall back to theme vars or palette mode
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

  // reset index when theme changes
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

  // Lazy-load and ensure autoplay for the current hero video
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
    // Reset state when slide changes
    setCanPlay(false);
    // iOS requires muted + playsInline for autoplay
    v.muted = true;
    if (inView) {
      // best effort autoplay
      setTimeout(() => v.play().catch(() => {}), 0);
    } else {
      v.pause();
    }
  }, [current, inView]);

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      <Box
        id="hero"
        ref={heroRef}
        onMouseMove={onMouseMove}
        sx={(theme) => ({
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          }),
        })}
      >
        {/* Aurora (now follows cursor a tiny bit) */}
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'absolute',
            inset: -200,
            filter: 'blur(80px)',
            opacity: 0.45,
            pointerEvents: 'none',
            transform: 'translate3d(calc(var(--px, 0px) * 0.25), calc(var(--py, 0px) * 0.25), 0)',
            transition: 'transform 250ms ease-out',
            background:
              `radial-gradient(350px 220px at 20% 20%, ${theme.palette.primary.main}20, transparent),
               radial-gradient(320px 240px at 80% 15%, ${theme.palette.secondary.main}22, transparent),
               radial-gradient(300px 240px at 30% 80%, ${theme.palette.primary.light}18, transparent)`,
            ...theme.applyStyles('dark', { opacity: 0.35 }),
          })}
        />

        {/* Subtle moving grid */}
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.08,
            backgroundImage:
              `linear-gradient(to right, ${theme.palette.divider} 1px, transparent 1px),
               linear-gradient(to bottom, ${theme.palette.divider} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            animation: 'gridScroll 30s linear infinite',
            ...theme.applyStyles('dark', { opacity: 0.06 }),
          })}
        />

        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 14, sm: 20 }, pb: { xs: 8, sm: 12 } }}>
          <Stack spacing={2} useFlexGap sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}>
            {/* Typewriter headline */}
            <Box height={90}>
              <Typography
                component={motion.span}
                variant="h1"
                aria-live="polite"
                sx={(theme) => ({
                  fontSize: 'clamp(1.5rem, 6vw, 3.5rem)', // Updated for better responsiveness on smaller viewports
                  display: 'inline-flex',
                  alignItems: 'center',
                  mb: 3,
                  letterSpacing: 0.2,
                  textAlign: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap', // Ensures the text stays on one line
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  backgroundImage: `linear-gradient(90deg,
                  ${theme.palette.primary.main},
                  ${theme.palette.secondary.main},
                  ${theme.palette.primary.main})`,
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: phase === 'pausing' ? 'shimmer 8s linear infinite' : 'none',
                  position: 'relative',
                  lineHeight: 1.2, // Ensures consistent line height
                  minHeight: '1em', // Fixes the height of the text zone to prevent layout shifts
                  '&::after': {
                    content: '""',
                    width: '1.5px',
                    height: '1em',
                    ml: 0.5,
                    backgroundColor: theme.palette.text.primary,
                    opacity: phase === 'pausing' ? 0 : 1,
                    animation: phase === 'pausing' ? 'none' : 'caretBlink 1s steps(2, start) infinite',
                  },
                })}
              >
                {typed}
              </Typography>
            </Box>
            {/* Rotating subline with soft cross-fade */}
            <Box sx={{ position: 'relative', minHeight: '1.6em', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={subIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: allowAnim ? 0.8 : 0, ease: 'easeOut' }}
                  style={{ width: '100%' }}
                >
                  <Typography
                    sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      width: { sm: '100%', md: '80%' },
                      mx: 'auto',
                      backgroundImage: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.text.secondary}, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: allowAnim ? 'shimmer 18s linear infinite' : 'none',
                    }}
                  >
                    {sublines[subIndex]}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}>
              <InputLabel htmlFor="email-hero" sx={visuallyHidden}>Email</InputLabel>
              <TextField
                id="email-hero"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter your email address"
                placeholder="Your email address"
                fullWidth
                slotProps={{ htmlInput: { autoComplete: 'off', 'aria-label': 'Enter your email address' } }}
              />
              <Button variant="contained" color="primary" size="small" sx={{ minWidth: 'fit-content' }}>
                Start now
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              By clicking &quot;Start now&quot; you agree to our&nbsp;<Link href="#" color="primary">Terms &amp; Conditions</Link>.
            </Typography>
          </Stack>

          {/* Carousel Card (manual only) */}
          <Box
            component={motion.div}
            sx={(theme) => ({
              alignSelf: 'center',
              width: '100%',
              maxWidth: 1400,
              mt: { xs: 8, sm: 10 },
              borderRadius: (theme.vars || theme).shape.borderRadius,
              outline: '6px solid',
              outlineColor: 'hsla(220, 25%, 80%, 0.2)',
              border: '1px solid',
              borderColor: (theme.vars || theme).palette.grey[200],
              background: (theme.vars || theme).palette.background.paper,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              animation: 'glowPulse 6s ease-in-out infinite',
              ...theme.applyStyles('dark', {
                outlineColor: 'hsla(210, 35%, 40%, 0.15)',
                borderColor: (theme.vars || theme).palette.grey[700],
                background: (theme.vars || theme).palette.background.default,
              }),
              transformStyle: 'preserve-3d',
              perspective: 1000,
            })}
            whileHover={{ rotateX: -2, rotateY: 2 }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          >
            {/* sweep highlight */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                '&::before': {
                  content: '" "', // Adjusted to ensure valid string content
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '30%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.2) 50%, rgba(255,255,255,0) 100%)',
                  filter: 'blur(6px)',
                  animation: 'sweep 6s ease-in-out infinite',
                },
              }}
            />

            <>
              <IconButton
                aria-label="Previous slide"
                onClick={handlePrev}
                sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper', opacity: 0.7, '&:hover': { opacity: 1 }, zIndex: 2 }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <Box ref={videoContainerRef} sx={{ width: '100%', aspectRatio: ratio ?? '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform' }}>
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
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', borderRadius: 'inherit', willChange: 'transform, opacity', background: 'transparent' }}
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
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper', opacity: 0.7, '&:hover': { opacity: 1 }, zIndex: 2 }}
              >
                <ArrowForwardIosIcon />
              </IconButton>

              <Box sx={{ position: 'absolute', bottom: 12, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
                {heroFiles.map((_, idx) => (
                  <Box
                    key={idx}
                    role="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    tabIndex={0}
                    onClick={() => setCurrent(idx)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setCurrent(idx)}
                    sx={{
                      width: 10,
                      height: 10,
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
            </>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
}
