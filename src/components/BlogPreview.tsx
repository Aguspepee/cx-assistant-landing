import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLang, useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getPostsByLang } from '../blog/posts/index';
import type { BlogPostMeta } from '../blog/types';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const floatBrowser = keyframes`
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-9px); }
`;

const orbDrift1 = keyframes`
  0%,100% { transform: translate(0%,0%) scale(1);       }
  40%      { transform: translate(20%,-16%) scale(1.16); }
  72%      { transform: translate(-10%,14%) scale(0.88); }
`;

const orbDrift2 = keyframes`
  0%,100% { transform: translate(0%,0%) scale(1);       }
  45%      { transform: translate(-15%,12%) scale(1.12); }
  70%      { transform: translate(12%,-8%) scale(0.92);  }
`;

const scanLine = keyframes`
  0%   { top: -3px; opacity: 0; }
  5%   { opacity: 0.45; }
  88%  { opacity: 0.45; }
  100% { top: 100%; opacity: 0; }
`;

const arrowPulse = keyframes`
  0%      { opacity: 0.1;  transform: translateX(-5px) scale(0.8); }
  50%     { opacity: 1;    transform: translateX(0px)  scale(1);   }
  100%    { opacity: 0.1;  transform: translateX(5px)  scale(0.8); }
`;

const arrowBounce = keyframes`
  0%,100% { transform: translateX(0); }
  50%      { transform: translateX(5px); }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Carousel images ──────────────────────────────────────────────────────────

const PLAN_IMGS = [
  '/blog-images/plan-vs-actual/plan-vs-actual-overview-1.png',
  '/blog-images/plan-vs-actual/plan-vs-actual-filter-per-status.png',
  '/blog-images/plan-vs-actual/plan-vs-actual-click-see-assets.png',
];

const EXCEL_IMG = '/blog-images/commissioning-teams-tracker/excel-example.png';
const CX_IMG    = '/blog-images/commissioning-teams-tracker/cx-assistant-tracker-overview.png';

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ImageCarousel({ images, height }: { images: string[]; height: number }) {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 3200);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <Box sx={{ position: 'relative', height, overflow: 'hidden' }}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={idx}
          src={images[idx]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
        />
      </AnimatePresence>

      {/* Scan sweep */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(200,255,185,0.55), transparent)',
          animation: `${scanLine} 4.5s linear infinite`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Pill progress dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '5px',
          zIndex: 3,
        }}
      >
        {images.map((_, i) => (
          <Box
            key={i}
            sx={{
              height: 4,
              width: i === idx ? 18 : 4,
              borderRadius: '3px',
              background: i === idx ? 'rgba(200,255,185,0.88)' : 'rgba(255,255,255,0.18)',
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// ─── Mac Browser chrome ───────────────────────────────────────────────────────

function MacBrowser({ children, float }: { children: React.ReactNode; float?: boolean }) {
  return (
    <Box
      sx={{
        borderRadius: '11px',
        overflow: 'hidden',
        boxShadow: '0 22px 52px rgba(0,0,0,0.72)',
        border: '1px solid rgba(255,255,255,0.08)',
        ...(float && {
          animation: `${floatBrowser} 5s ease-in-out infinite`,
        }),
      }}
    >
      {/* Title bar */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #3c3c3c 0%, #252525 100%)',
          px: 1.5,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          flexShrink: 0,
        }}
      >
        {(
          [
            ['#FF5F57', '#E0443E'],
            ['#FFBD2E', '#DEA123'],
            ['#28C840', '#1DAD2B'],
          ] as const
        ).map(([bg, border], i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: bg,
              border: `1px solid ${border}`,
              flexShrink: 0,
            }}
          />
        ))}
        <Box
          sx={{
            flex: 1,
            mx: 1.5,
            background: 'rgba(0,0,0,0.30)',
            borderRadius: '4px',
            height: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.26)', lineHeight: 1, userSelect: 'none' }}
          >
            cx-assistant.com
          </Typography>
        </Box>
      </Box>

      {children}
    </Box>
  );
}

// ─── Shared chip dim style ────────────────────────────────────────────────────

const dimChip = {
  background: 'rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.36)',
  border: '1px solid rgba(255,255,255,0.08)',
  fontSize: '0.66rem',
  height: 20,
};

// ─── Card 1 — Plan vs Actual ──────────────────────────────────────────────────

function PlanVsActualCard({ post, lp, lang, readMore, minRead }: { post: BlogPostMeta; lp: (p: string) => string; lang: string; readMore: string; minRead: string }) {
  return (
    <Box
      component={RouterLink}
      to={lp(`/blog/${post.slug}`)}
      sx={{
        height: '100%',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        background: 'linear-gradient(155deg, #0d1a10 0%, #0a130b 100%)',
        border: '1px solid rgba(180,255,150,0.10)',
        cursor: 'pointer',
        transition: 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.38s ease, border-color 0.38s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 44px 88px rgba(50,190,80,0.20), 0 0 0 1px rgba(180,255,150,0.22)',
          borderColor: 'rgba(180,255,150,0.22)',
        },
        '&:hover .c-arrow': { animation: `${arrowBounce} 0.55s ease-in-out infinite` },
      }}
    >
      {/* Top edge highlight — brand lime */}
      <Box
        sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
          background: 'linear-gradient(90deg, transparent 0%, rgba(180,255,150,0.45) 30%, rgba(220,255,180,0.85) 50%, rgba(180,255,150,0.45) 70%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Ambient orbs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute', top: '-38%', left: '-22%',
            width: '70%', height: '70%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,220,80,0.30) 0%, rgba(60,180,80,0.12) 45%, transparent 70%)',
            filter: 'blur(40px)',
            animation: `${orbDrift1} 9s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: '-12%', right: '-18%',
            width: '56%', height: '56%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,255,160,0.18) 0%, transparent 70%)',
            filter: 'blur(32px)',
            animation: `${orbDrift2} 12s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* Card body */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Mac browser + carousel */}
        <MacBrowser float>
          <ImageCarousel images={PLAN_IMGS} height={200} />
        </MacBrowser>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap', mt: 2.5, mb: 1.5 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              background: 'rgba(180,255,150,0.12)',
              color: '#c8ffaa',
              border: '1px solid rgba(180,255,150,0.24)',
              fontSize: '0.66rem',
              height: 20,
            }}
          />
          {post.tags.slice(0, 2).map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={dimChip} />
          ))}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: { xs: '1.12rem', sm: '1.24rem', md: '1.32rem' },
            mb: 1.25,
          }}
        >
          {post.title}
        </Typography>

        {/* Description — flex:1 pushes footer to bottom */}
        <Typography sx={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.82rem', lineHeight: 1.62, flex: 1 }}>
          {post.description}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.72rem' }}>
            {fmt(post.date, lang)} · {post.readTime} {minRead}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c8ffaa', fontWeight: 600, fontSize: '0.78rem' }}>
            <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>{readMore}</Typography>
            <ArrowForwardIcon className="c-arrow" sx={{ fontSize: '0.92rem', color: 'inherit' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Card 2 — Excel → Cx Assistant

function TransformCard({ post, lp, lang, readMore, minRead }: { post: BlogPostMeta; lp: (p: string) => string; lang: string; readMore: string; minRead: string }) {
  return (
    <Box
      component={RouterLink}
      to={lp(`/blog/${post.slug}`)}
      sx={{
        height: '100%',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        background: 'linear-gradient(155deg, #110820 0%, #0c0614 100%)',
        border: '1px solid rgba(160,100,255,0.10)',
        cursor: 'pointer',
        transition: 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.38s ease, border-color 0.38s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 44px 88px rgba(120,70,240,0.18), 0 0 0 1px rgba(160,100,255,0.24)',
          borderColor: 'rgba(160,100,255,0.24)',
        },
        '&:hover .c-arrow': { animation: `${arrowBounce} 0.55s ease-in-out infinite` },
      }}
    >
      {/* Top edge highlight — violet */}
      <Box
        sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
          background: 'linear-gradient(90deg, transparent 0%, rgba(150,100,255,0.42) 30%, rgba(200,150,255,0.80) 50%, rgba(150,100,255,0.42) 70%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Ambient orbs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute', top: '-28%', right: '-18%',
            width: '65%', height: '65%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(140,80,255,0.34) 0%, rgba(100,50,230,0.12) 45%, transparent 70%)',
            filter: 'blur(40px)',
            animation: `${orbDrift1} 10s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: '-16%', left: '-12%',
            width: '52%', height: '52%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(190,80,255,0.20) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animation: `${orbDrift2} 13s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* Card body */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Before → After comparison */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 2.5 }}>

          {/* BEFORE panel */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                borderRadius: '10px', overflow: 'hidden',
                border: '1px solid rgba(255,80,80,0.20)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
                position: 'relative',
              }}
            >
              <img
                src={EXCEL_IMG}
                alt="Excel documentation tracker"
                style={{
                  width: '100%', display: 'block',
                  objectFit: 'cover', objectPosition: 'top',
                  height: 150,
                  filter: 'grayscale(0.35) brightness(0.60)',
                }}
              />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(200,50,50,0.14) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <Box sx={{ position: 'absolute', top: 7, left: 7, background: 'rgba(195,45,45,0.94)', borderRadius: '5px', px: 0.85, py: 0.35 }}>
                <Typography sx={{ color: '#fff', fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.07em', lineHeight: 1 }}>BEFORE</Typography>
              </Box>
            </Box>
            <Typography sx={{ color: 'rgba(255,100,100,0.45)', fontSize: '0.61rem', textAlign: 'center', mt: 0.75, fontWeight: 600, letterSpacing: '0.03em' }}>
              Excel tracker
            </Typography>
          </Box>

          {/* Flowing pulse arrows (horizontal) */}
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mb: 2.5 }}>
            {[0, 0.3, 0.6].map((delay, i) => (
              <ArrowForwardIcon
                key={i}
                sx={{
                  color: `rgba(170,120,255,${0.22 + i * 0.28})`,
                  fontSize: i === 2 ? '1.5rem' : '1.05rem',
                  animation: `${arrowPulse} 1.6s ease-in-out ${delay}s infinite`,
                  ml: i === 0 ? 0 : '-5px',
                }}
              />
            ))}
          </Box>

          {/* AFTER panel */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                borderRadius: '10px', overflow: 'hidden',
                border: '1px solid rgba(180,255,150,0.36)',
                boxShadow: '0 8px 28px rgba(80,200,100,0.20)',
                position: 'relative',
              }}
            >
              <img
                src={CX_IMG}
                alt="Cx Assistant documentation tracker"
                style={{
                  width: '100%', display: 'block',
                  objectFit: 'cover', objectPosition: 'top',
                  height: 150,
                }}
              />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(140,80,255,0.10) 0%, transparent 55%)', pointerEvents: 'none' }} />
              {/* AFTER badge — brand green (positive outcome) */}
              <Box sx={{ position: 'absolute', top: 7, left: 7, background: 'rgba(50,185,90,0.94)', borderRadius: '5px', px: 0.85, py: 0.35 }}>
                <Typography sx={{ color: '#fff', fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.07em', lineHeight: 1 }}>AFTER</Typography>
              </Box>
            </Box>
            <Typography sx={{ color: 'rgba(180,220,255,0.45)', fontSize: '0.61rem', textAlign: 'center', mt: 0.75, fontWeight: 600, letterSpacing: '0.03em' }}>
              Cx&nbsp;Assistant
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap', mb: 1.5 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              background: 'rgba(150,100,255,0.14)',
              color: '#c09aff',
              border: '1px solid rgba(150,100,255,0.26)',
              fontSize: '0.66rem',
              height: 20,
            }}
          />
          {post.tags.slice(0, 2).map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={dimChip} />
          ))}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: { xs: '1.12rem', sm: '1.24rem', md: '1.32rem' },
            mb: 1.25,
          }}
        >
          {post.title}
        </Typography>

        {/* Description */}
        <Typography sx={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.82rem', lineHeight: 1.62, flex: 1 }}>
          {post.description}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.72rem' }}>
            {fmt(post.date, lang)} · {post.readTime} {minRead}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c09aff', fontWeight: 600, fontSize: '0.78rem' }}>
            <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>{readMore}</Typography>
            <ArrowForwardIcon className="c-arrow" sx={{ fontSize: '0.92rem', color: 'inherit' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function BlogPreview() {
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');
  const lang = useLang();
  const lp = useLangPath();
  const posts = getPostsByLang(lang);
  const readMore = tc('actions.readMore');
  const minRead = tc('meta.minRead');

  return (
    <Box id="blog-preview" sx={{ py: { xs: 8, sm: 12 } }}>
      <Container maxWidth="lg">

        {/* Section header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            justifyContent: 'space-between',
            textAlign: { xs: 'center', sm: 'left' },
            mb: { xs: 5, sm: 7 },
            gap: 3,
          }}
        >
          <Box>
            {/* Eyebrow pill — aligns with Hero's badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.72)',
                borderRadius: '50px',
                px: 2,
                py: 0.55,
                mb: 2,
              }}
            >
              <Typography
                sx={{ color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}
              >
                {t('blogPreview.eyebrow')}
              </Typography>
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                letterSpacing: '-0.03em',
                fontSize: { xs: '2.2rem', sm: '2.9rem', md: '3.4rem' },
                lineHeight: 1.08,
                color: 'rgba(0,0,0,0.84)',
                mb: 1.5,
              }}
            >
              {t('blogPreview.title')}
            </Typography>

            <Typography
              sx={{
                color: 'rgba(0,0,0,0.46)',
                fontSize: { xs: '0.92rem', sm: '1rem' },
                maxWidth: 460,
                mx: { xs: 'auto', sm: 0 },
                lineHeight: 1.6,
              }}
            >
              {t('blogPreview.subtitle')}
            </Typography>
          </Box>

          {/* View all posts */}
          <Box
            component={RouterLink}
            to={lp('/blog')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(0,0,0,0.58)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              pb: '2px',
              borderBottom: '1.5px solid rgba(0,0,0,0.18)',
              transition: 'color 0.2s, border-color 0.2s',
              '&:hover': { color: 'rgba(0,0,0,0.86)', borderColor: 'rgba(0,0,0,0.48)' },
            }}
          >
            {t('blogPreview.viewAll')}
            <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
          </Box>
        </Box>

        {/* Cards — CSS grid stretch gives equal heights automatically */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          <PlanVsActualCard post={posts[0]} lp={lp} lang={lang} readMore={readMore} minRead={minRead} />
          <TransformCard   post={posts[1]} lp={lp} lang={lang} readMore={readMore} minRead={minRead} />
        </Box>

      </Container>
    </Box>
  );
}
