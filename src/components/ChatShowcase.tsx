import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { keyframes } from '@emotion/react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import { HeroChatCard } from './Hero';

// ─── Keyframes ─────────────────────────────────────────────────────────────────

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeSlideLeft = keyframes`
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── useInView ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
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

// ─── Bullet items ──────────────────────────────────────────────────────────────

interface BulletProps {
  icon: React.ReactNode;
  text: string;
  delay: number;
  inView: boolean;
}

function BulletItem({ icon, text, delay, inView }: BulletProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        opacity: inView ? 1 : 0,
        animation: inView ? `${fadeSlideUp} 0.6s ease ${delay}s both` : 'none',
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          bgcolor: 'rgba(220,255,182,0.08)',
          border: '1px solid rgba(220,255,182,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.72)',
          fontSize: '0.92rem',
          lineHeight: 1.5,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

// ─── ChatShowcase ──────────────────────────────────────────────────────────────

export default function ChatShowcase() {
  const { t } = useTranslation('home');
  const { ref, inView } = useInView();

  const bullets = [
    { icon: <SearchRoundedIcon sx={{ fontSize: '1.1rem', color: '#DCFFB6' }} />, text: t('chatSection.bullet1') },
    { icon: <EditNoteRoundedIcon sx={{ fontSize: '1.1rem', color: '#DCFFB6' }} />, text: t('chatSection.bullet2') },
    { icon: <QrCodeScannerRoundedIcon sx={{ fontSize: '1.1rem', color: '#DCFFB6' }} />, text: t('chatSection.bullet3') },
    { icon: <FolderOpenRoundedIcon sx={{ fontSize: '1.1rem', color: '#DCFFB6' }} />, text: t('chatSection.bullet4') },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#111314',
      }}
    >
      {/* Ambient background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '55%',
          height: '80%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(180,255,100,0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container
        ref={ref}
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 460px' },
            gap: { xs: 8, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* ── Left column: copy ── */}
          <Stack spacing={3.5}>
            <Chip
              label={t('chatSection.eyebrow')}
              size="small"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: 'rgba(220,255,182,0.1)',
                color: '#DCFFB6',
                border: '1px solid rgba(220,255,182,0.25)',
                fontWeight: 700,
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                opacity: inView ? 1 : 0,
                animation: inView ? `${fadeSlideUp} 0.5s ease 0s both` : 'none',
              }}
            />

            <Box
              sx={{
                opacity: inView ? 1 : 0,
                animation: inView ? `${fadeSlideUp} 0.6s ease 0.1s both` : 'none',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', md: '2.8rem' },
                  lineHeight: 1.15,
                  color: 'rgba(255,255,255,0.92)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.03em',
                }}
              >
                {t('chatSection.title')}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', md: '2.8rem' },
                  lineHeight: 1.15,
                  background: 'linear-gradient(90deg, #DCFFB6 0%, #a8e063 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.03em',
                }}
              >
                {t('chatSection.titleHighlight')}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: 460,
                opacity: inView ? 1 : 0,
                animation: inView ? `${fadeSlideUp} 0.6s ease 0.2s both` : 'none',
              }}
            >
              {t('chatSection.description')}
            </Typography>

            <Stack spacing={2} sx={{ pt: 1 }}>
              {bullets.map((b, i) => (
                <BulletItem
                  key={i}
                  icon={b.icon}
                  text={b.text}
                  delay={0.3 + i * 0.1}
                  inView={inView}
                />
              ))}
            </Stack>
          </Stack>

          {/* ── Right column: live chat card ── */}
          <Box
            sx={{
              opacity: inView ? 1 : 0,
              animation: inView ? `${fadeSlideLeft} 0.8s ease 0.2s both` : 'none',
              // subtle outer glow ring
              borderRadius: '26px',
              boxShadow: '0 0 0 1px rgba(180,255,150,0.08), 0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            <HeroChatCard />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
