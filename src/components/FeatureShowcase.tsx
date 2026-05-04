import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { keyframes } from '@emotion/react';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LabelRoundedIcon from '@mui/icons-material/LabelRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';

// ─── Keyframes ─────────────────────────────────────────────────────────────────

const floatImg = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-7px); }
`;

// ─── useInView ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── ScreenshotFrame ───────────────────────────────────────────────────────────

interface ScreenshotFrameProps {
  images: string[];
  inView: boolean;
  slideFrom: 'left' | 'right';
}

function ScreenshotFrame({ images, inView, slideFrom }: ScreenshotFrameProps) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1 || !inView) return;
    const id = setInterval(() => setActive((prev) => (prev + 1) % images.length), 3800);
    return () => clearInterval(id);
  }, [images.length, inView]);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Ambient glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: '-40px -30px',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(220,255,182,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Slide-in wrapper */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          opacity: inView ? 1 : 0,
          transform: inView
            ? 'translateX(0px)'
            : `translateX(${slideFrom === 'left' ? '-52px' : '52px'})`,
          transition:
            'opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)',
          transitionDelay: '0.08s',
        }}
      >
        {/* Card with float */}
        <Box
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)',
            animation: inView ? `${floatImg} 7s ease-in-out infinite` : 'none',
            animationDelay: '0.85s',
          }}
        >
          {/* Browser chrome */}
          <Box
            sx={{
              backgroundColor: '#1a1d1f',
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.9, sm: 1.1 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Traffic lights */}
            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 0.65 }, flexShrink: 0 }}>
              {['#FF5F56', '#FFBD2E', '#27C93F'].map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: { xs: 8, sm: 10 },
                    height: { xs: 8, sm: 10 },
                    borderRadius: '50%',
                    backgroundColor: color,
                  }}
                />
              ))}
            </Box>

            {/* Fake URL bar */}
            <Box
              sx={{
                flex: 1,
                height: { xs: 18, sm: 22 },
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  width: { xs: 6, sm: 8 },
                  height: { xs: 6, sm: 8 },
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: '0.55rem', sm: '0.62rem' },
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'monospace',
                  letterSpacing: '-0.01em',
                  userSelect: 'none',
                }}
              >
                app.cx-assistant.com
              </Typography>
            </Box>
          </Box>

          {/* Screenshot crossfade */}
          <Box sx={{ position: 'relative', paddingTop: '60%', backgroundColor: '#0e1012' }}>
            {images.map((src, i) => (
              <Box
                key={src}
                component="img"
                src={src}
                alt=""
                loading="lazy"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top left',
                  opacity: i === active ? 1 : 0,
                  transition: 'opacity 0.9s ease',
                  display: 'block',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Dot navigation */}
        {images.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 2.5 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                role="button"
                aria-label={`Screenshot ${i + 1}`}
                onClick={() => setActive(i)}
                sx={{
                  width: i === active ? 24 : 7,
                  height: 7,
                  borderRadius: '999px',
                  backgroundColor:
                    i === active ? '#DCFFB6' : 'rgba(255,255,255,0.18)',
                  cursor: 'pointer',
                  transition: 'width 0.35s ease, background-color 0.35s ease',
                  '&:hover': {
                    backgroundColor:
                      i === active ? '#DCFFB6' : 'rgba(255,255,255,0.38)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── FeatureRow ────────────────────────────────────────────────────────────────

interface FeatureRowProps {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  bullets: Array<{ icon: React.ReactNode; text: string }>;
  images: string[];
  imageAlign: 'left' | 'right';
}

function FeatureRow({
  eyebrow,
  title,
  titleHighlight,
  description,
  bullets,
  images,
  imageAlign,
}: FeatureRowProps) {
  const { ref, inView } = useInView(0.1);

  const textContent = (
    <Stack
      spacing={3}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.75s ease, transform 0.75s ease',
        transitionDelay: '0.28s',
      }}
    >
      <Typography
        component="span"
        sx={{
          display: 'inline-block',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#DCFFB6',
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </Typography>

      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: {
            xs: 'clamp(1.7rem, 5vw, 2.5rem)',
            md: 'clamp(1.6rem, 3vw, 2.5rem)',
          },
          lineHeight: 1.18,
          color: '#ffffff',
          mt: '8px !important',
        }}
      >
        {title}{' '}
        <Box component="span" sx={{ color: '#DCFFB6' }}>
          {titleHighlight}
        </Box>
      </Typography>

      <Typography
        sx={{
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Roboto', sans-serif",
          fontSize: '1rem',
          lineHeight: 1.78,
          maxWidth: 460,
        }}
      >
        {description}
      </Typography>

      <Stack spacing={1.75} sx={{ pt: 1 }}>
        {bullets.map((bullet, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1px solid rgba(220,255,182,0.22)',
                color: '#DCFFB6',
                flexShrink: 0,
                backgroundColor: 'rgba(220,255,182,0.04)',
              }}
            >
              {bullet.icon}
            </Box>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontFamily: "'Roboto', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              {bullet.text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );

  const screenshotContent = (
    <ScreenshotFrame images={images} inView={inView} slideFrom={imageAlign} />
  );

  return (
    <Box ref={ref}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 5, md: 7, lg: 9 },
          alignItems: 'center',
        }}
      >
        {imageAlign === 'left' ? (
          <>
            <Box>{screenshotContent}</Box>
            <Box>{textContent}</Box>
          </>
        ) : (
          <>
            <Box sx={{ order: { xs: 2, md: 1 } }}>{textContent}</Box>
            <Box sx={{ order: { xs: 1, md: 2 } }}>{screenshotContent}</Box>
          </>
        )}
      </Box>
    </Box>
  );
}

// ─── FeatureShowcase ───────────────────────────────────────────────────────────

export default function FeatureShowcase() {
  const { t } = useTranslation('home');
  const headerRef = useInView(0.15);

  const features: FeatureRowProps[] = [
    {
      eyebrow: t('featureShowcase.dashboard.eyebrow'),
      title: t('featureShowcase.dashboard.title'),
      titleHighlight: t('featureShowcase.dashboard.titleHighlight'),
      description: t('featureShowcase.dashboard.description'),
      bullets: [
        {
          icon: <ShowChartRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.dashboard.bullet1'),
        },
        {
          icon: <TrendingUpRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.dashboard.bullet2'),
        },
      ],
      images: [
        '/features/dashboard/cx-assistant-dashboard-issues.png',
        '/features/dashboard/cx-assistant-dashboard-plan-vs-actual.png',
        '/features/dashboard/cx-assistant-dashboard-assets.png',
      ],
      imageAlign: 'right',
    },
    {
      eyebrow: t('featureShowcase.assets.eyebrow'),
      title: t('featureShowcase.assets.title'),
      titleHighlight: t('featureShowcase.assets.titleHighlight'),
      description: t('featureShowcase.assets.description'),
      bullets: [
        {
          icon: <LabelRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.assets.bullet1'),
        },
        {
          icon: <LinkRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.assets.bullet2'),
        },
      ],
      images: [
        '/features/assets/cx-assistant-assets-view.jpg',
        '/features/assets/cx-assistant-assets-form.jpg',
        '/features/assets/cx-assistant-assets-documentation-access-easy.jpg',
      ],
      imageAlign: 'left',
    },
    {
      eyebrow: t('featureShowcase.issues.eyebrow'),
      title: t('featureShowcase.issues.title'),
      titleHighlight: t('featureShowcase.issues.titleHighlight'),
      description: t('featureShowcase.issues.description'),
      bullets: [
        {
          icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.issues.bullet1'),
        },
        {
          icon: <HistoryRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.issues.bullet2'),
        },
      ],
      images: [
        '/features/issues/cx-assistant-issues-view.jpg',
        '/features/issues/cx-assistant-issues-form.jpg',
        '/features/issues/cx-assistant-issues-history.jpg',
      ],
      imageAlign: 'right',
    },
    {
      eyebrow: t('featureShowcase.documentation.eyebrow'),
      title: t('featureShowcase.documentation.title'),
      titleHighlight: t('featureShowcase.documentation.titleHighlight'),
      description: t('featureShowcase.documentation.description'),
      bullets: [
        {
          icon: <FolderOpenRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.documentation.bullet1'),
        },
        {
          icon: <PictureAsPdfRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.documentation.bullet2'),
        },
      ],
      images: [
        '/features/documentation/cx-assistant-documentation-module.jpg',
        '/features/assets/cx-assistant-assets-documentation-sumary.jpg',
      ],
      imageAlign: 'left',
    },
    {
      eyebrow: t('featureShowcase.tracker.eyebrow'),
      title: t('featureShowcase.tracker.title'),
      titleHighlight: t('featureShowcase.tracker.titleHighlight'),
      description: t('featureShowcase.tracker.description'),
      bullets: [
        {
          icon: <FactCheckRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.tracker.bullet1'),
        },
        {
          icon: <TaskAltRoundedIcon sx={{ fontSize: 17 }} />,
          text: t('featureShowcase.tracker.bullet2'),
        },
      ],
      images: [
        '/features/tracker/cx-assistant-assets-documentation-tracker.jpg',
        '/features/tracker/cx-assistant-assets-documentation-tracker-open-doc.jpg',
      ],
      imageAlign: 'right',
    },
  ];

  return (
    <Box id="features" sx={{ width: '100%', backgroundColor: '#111314', py: { xs: 10, sm: 16 } }}>
      <Container maxWidth="lg">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <Box
          ref={headerRef.ref}
          sx={{
            textAlign: 'center',
            mb: { xs: 8, md: 12 },
            opacity: headerRef.inView ? 1 : 0,
            transform: headerRef.inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#DCFFB6',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {t('featureShowcase.eyebrow')}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: {
                xs: 'clamp(2rem, 6vw, 3.2rem)',
                md: 'clamp(2rem, 4vw, 3.2rem)',
              },
              lineHeight: 1.15,
              color: '#ffffff',
              mb: 2.5,
            }}
          >
            {t('featureShowcase.sectionTitle')}
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.48)',
              fontFamily: "'Roboto', sans-serif",
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: 1.7,
              maxWidth: 560,
              mx: 'auto',
            }}
          >
            {t('featureShowcase.sectionSubtitle')}
          </Typography>
        </Box>

        {/* ── Feature rows ───────────────────────────────────────────────── */}
        {features.map((feature, i) => (
          <React.Fragment key={i}>
            <Box sx={{ py: { xs: 6, md: 9 } }}>
              <FeatureRow {...feature} />
            </Box>
            {i < features.length - 1 && (
              <Box
                sx={{
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Container>
    </Box>
  );
}
