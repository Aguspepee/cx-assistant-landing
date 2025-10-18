import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
 

import IconButton from '@mui/material/IconButton';
import { useTheme, useColorScheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

// Gradient, matte sphere with soft glow (React + Three.js)
function GradientSphere() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    const container = containerRef.current!;
    const canvas = canvasRef.current!;
    if (!container || !canvas) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0); // transparent to blend with hero
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // a touch more punch

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 950);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
    camera.position.set(0, 0, 300);

    const setSize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    setSize();

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x111111, 0.35);
    const key = new THREE.DirectionalLight(0xffffff, 0.32);
    key.position.set(0, 450, 350);
    key.castShadow = true;
    key.shadow.camera.left = -650;
    key.shadow.camera.right = 650;
    key.shadow.camera.top = 650;
    key.shadow.camera.bottom = -650;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 1000;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    const fill = new THREE.DirectionalLight(0xffffff, 0.18);
    fill.position.set(-600, 350, 350);
    const rim = new THREE.DirectionalLight(0xffffff, 0.12);
    rim.position.set(0, -250, 300);
    scene.add(hemi, key, fill, rim);

    // Helpers to build textures
    function makeVerticalGradientTexture(stops: Array<{ offset: number; color: string }>, size = 512) {
      const c = document.createElement('canvas');
      c.width = 1; c.height = size;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, size);
      stops.forEach((s) => g.addColorStop(s.offset, s.color));
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1, size);
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      return tex;
    }
    function makeRadialGlowTexture(size = 512, rgb = '255,255,255') {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const cx = size / 2; const cy = size / 2; const r = size / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0.0, `rgba(${rgb}, 0.90)`);
      grad.addColorStop(0.4, `rgba(${rgb}, 0.35)`);
      grad.addColorStop(1.0, `rgba(${rgb}, 0.00)`);
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    }

    // Sphere geometry/material
    const segments = container.clientWidth > 575 ? 96 : 64;
  const radius = 70; // 30% smaller
    const geometry = new THREE.SphereGeometry(radius, segments, segments);

    // Store original positions for noise deformation
    const position = geometry.getAttribute('position') as THREE.BufferAttribute;
    const original = new Float32Array(position.array.length);
    original.set(position.array as ArrayLike<number>);

    const BRAND_GRADIENT = [
      { offset: 0.00, color: '#59D8FF' }, // a touch richer cyan
      { offset: 0.55, color: '#6A4CFF' }, // deeper indigo
      { offset: 1.00, color: '#FF47C5' }, // hotter pink
    ];
    const gradientTex = makeVerticalGradientTexture(BRAND_GRADIENT);
    gradientTex.colorSpace = THREE.SRGBColorSpace;   // IMPORTANT: don’t skip
    gradientTex.needsUpdate = true;

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: gradientTex,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: gradientTex,
      emissiveIntensity: 0.1, // brighter colors
      roughness: 0.4,         // matte premium
      metalness: 0.04,
      side: THREE.FrontSide,
      dithering: true,
    });

    const bubble = new THREE.Mesh(geometry, material);
    bubble.castShadow = true;
    bubble.receiveShadow = false;
    scene.add(bubble);

    // Soft aura sprite (tighter & slightly brighter)
    const glowTex = makeRadialGlowTexture(512, '255,255,255');
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.02,
    });
    const glowSprite = new THREE.Sprite(glowMat);
  const glowScale = 238; // scaled with sphere (30% smaller)
    glowSprite.scale.set(glowScale, glowScale, 1);
    glowSprite.position.set(0, 0, 0);
    scene.add(glowSprite);

    // Shadow receiver (subtle grounding)
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.ShadowMaterial({ opacity: 0.06 }),
    );
    plane.position.set(0, -135, 0); // slightly closer with smaller sphere
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Interaction state
    const noise3D = createNoise3D();
    const mouse = new THREE.Vector2();
    const center = new THREE.Vector2();
    const scale = { current: 1, target: 1 };

    const map = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
      (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    const updateMouse = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let x = 0, y = 0;
      if (e instanceof TouchEvent) {
        const t = e.touches[0] || e.changedTouches[0];
        x = t?.clientX ?? 0; y = t?.clientY ?? 0;
      } else if ('clientX' in e) {
        x = (e as MouseEvent).clientX; y = (e as MouseEvent).clientY;
      }
      const rect = container.getBoundingClientRect();
      mouse.set(x - rect.left, y - rect.top);
    };

    const onPointerDown = () => { scale.target = 0.7; };
    const onPointerUp = () => { scale.target = 1.0; };

    container.addEventListener('mousemove', updateMouse);
    container.addEventListener('touchmove', updateMouse, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handling
    const resizeObserver = new ResizeObserver(() => setSize());
    resizeObserver.observe(container);

    // Pause animation when tab not visible
    const onVis = () => {
      if (document.hidden) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      } else if (!animationRef.current && !prefersReduced) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    mountedRef.current = true;

    const animate = (t: number) => {
      // Lerp scale
      scale.current += (scale.target - scale.current) * 0.08;
      bubble.scale.setScalar(scale.current);

      // Rotate relative to mouse position
      center.set(container.clientWidth / 2, container.clientHeight / 2);
      const rotY = map(mouse.x, 0, container.clientWidth, -2.0, 2.0);
      const rotZ = map(mouse.y, 0, container.clientHeight, 2.0, -2.0);
      bubble.rotation.y = rotY;
      bubble.rotation.z = rotZ;

      // Noise deformation (smoother to avoid pixelly edges)
      const time = t * 0.0005;
      const maxDist = Math.hypot(center.x, center.y);
      const d = Math.hypot(mouse.x - center.x, mouse.y - center.y);
      const distRatio = map(d, 0, Math.max(1, maxDist), 1, 0);

      const arr = position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const ox = original[i];
        const oy = original[i + 1];
        const oz = original[i + 2];
        const n = noise3D(ox * 0.005 + time, oy * 0.005 + time, oz * 0.005);
        const ratio = (n * 0.26 * (distRatio + 0.1)) + 0.82;
        arr[i] = ox * ratio;
        arr[i + 1] = oy * ratio;
        arr[i + 2] = oz * ratio;
      }
      position.needsUpdate = true;
      geometry.computeVertexNormals();

      glowSprite.lookAt(camera.position);

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (!prefersReduced) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      mountedRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', updateMouse);
      container.removeEventListener('touchmove', updateMouse);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('visibilitychange', onVis);

      // Dispose resources
      geometry.dispose();
      material.dispose();
      gradientTex.dispose();
      glowTex.dispose();
      glowMat.dispose();
      plane.geometry.dispose();
      (plane.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 320, sm: 420, md: 520 },
        borderRadius: 2,
        overflow: 'hidden',
        backdropFilter: 'none', // ensure no haze behind canvas
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </Box>
  );
}

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

  // ---- Rotating subline ----
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

  // ---- Hero video carousel state and theme selection ----
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
    setCanPlay(false);
    v.muted = true; // iOS autoplay requirement
    if (inView) {
      setTimeout(() => v.play().catch(() => { }), 0);
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
          {/* Top hero: text left, sphere right (stack on mobile) */}
          <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 4, md: 6 }, alignItems: 'center' }}>
            <Stack spacing={2} useFlexGap sx={{ alignItems: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
              {/* Typewriter headline with real caret span (multiline-safe) */}
              <Box height={135} sx={{ width: '100%' }}>
                <Typography
                  component={motion.span}
                  variant="h1"
                  aria-live="polite"
                  sx={(theme) => ({
                    fontSize: 'clamp(1.6rem, 5.5vw, 3.6rem)',
                    display: 'inline',
                    mb: 3,
                    letterSpacing: 0.2,
                    textAlign: { xs: 'center', md: 'left' },
                    backgroundImage: `linear-gradient(90deg,
                      ${theme.palette.primary.main},
                      ${theme.palette.secondary.main},
                      ${theme.palette.primary.main})`,
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: phase === 'pausing' ? 'shimmer 8s linear infinite' : 'none',
                    position: 'relative',
                    lineHeight: 1.2,
                    minHeight: '1em',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  })}
                >
                  <span style={{ whiteSpace: 'pre-wrap' }}>{typed}</span>
                  {phase !== 'pausing' && (
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        width: '2px',
                        height: '1em',
                        ml: 0.5,
                        backgroundColor: 'currentColor',
                        animation: 'caretBlink 1s steps(2, start) infinite',
                        verticalAlign: '-0.1em',
                      }}
                    />
                  )}
                </Typography>
              </Box>

              {/* Supporting line under headline */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 640,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Cx Assistant helps commissioning teams capture issues, plan milestones, and deliver faster with AI support.
              </Typography>

              {/* Primary call-to-action */}
              <Stack direction={{ xs: 'column' }} spacing={2} useFlexGap sx={{ pt: 3, alignSelf: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href="/login"
                  sx={{
                    px: 3.5,
                    py: 1.25,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  Get started
                </Button>
              </Stack>
            </Stack>

            {/* Right column: Three.js glowing sphere */}
            <Box sx={{ width: '100%' }}>
              <GradientSphere />
            </Box>
          </Box>

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
                  content: '" "',
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
