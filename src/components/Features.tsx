import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';

// Associate each feature with its corresponding GIF base name in /public/videos/features
// We’ll automatically pick the -light or -dark variant based on the current theme.
const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Smart Issue Management',
    description:
      'Create, track, and resolve issues directly from chat or forms. Issues are linked to assets, users, and projects automatically, reducing administrative effort.',
    gifBase: 'overview-issues',
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Asset-Centric Commissioning',
    description:
      'Every asset has its own timeline, documentation, and issue history. No more scattered spreadsheets—everything is consolidated in one place.',
    gifBase: 'assign-issue',
  },
  {
    icon: <DevicesRoundedIcon />,
    title: 'AI-Powered Assistant',
    description:
      'Ask natural questions like “How many open issues are assigned to Laura?” or “Show me all breakers missing test signatures”. The assistant fetches the right data and provides instant, validated answers.',
    gifBase: 'raise-issue',
  },
];

interface ChipProps {
  selected?: boolean;
}

const Chip = styled(MuiChip)<ChipProps>(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

interface MobileLayoutProps {
  selectedItemIndex: number;
  handleItemClick: (index: number) => void;
  selectedFeature: (typeof items)[0];
}

export function MobileLayout({
  selectedItemIndex,
  handleItemClick,
  selectedFeature,
}: MobileLayoutProps) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ px: 0, pb: 1 }}>
          <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
  <FeatureGif feature={selectedFeature} maxHeight={420} />
      </Card>
    </Box>
  );
}

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
        <Box sx={{ width: { sm: '100%', md: '60%' } }}>
          <Typography
            component="h2"
            variant="h4"
            gutterBottom
            sx={{ color: 'text.primary' }}
          >
            Key Capabilities
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
          >
            Cx Assistant is built for real commissioning workflows. Manage issues, assets, documentation, and project phases the way engineers do. Your team gets a single intelligent workspace where projects stay on track, documentation is consistent, and decisions are supported by real-time insights.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row-reverse' },
            gap: 2,
          }}
        >
          <div>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                gap: 2,
                height: '100%',
              }}
            >
              {items.map(({ icon, title, description }, index) => (
                <Box
                  key={index}
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={[
                    (theme) => ({
                      p: 2,
                      height: '100%',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: (theme.vars || theme).palette.action.hover,
                      },
                    }),
                    selectedItemIndex === index && {
                      backgroundColor: 'action.selected',
                    },
                  ]}
                >
                  <Box
                    sx={[
                      {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        gap: 1,
                        textAlign: 'left',
                        textTransform: 'none',
                        color: 'text.secondary',
                      },
                      selectedItemIndex === index && {
                        color: 'text.primary',
                      },
                    ]}
                  >
                    {icon}

                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2">{description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <MobileLayout
              selectedItemIndex={selectedItemIndex}
              handleItemClick={handleItemClick}
              selectedFeature={selectedFeature}
            />
          </div>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, width: { xs: '100%', md: '70%' } }}>
            <FeatureGif feature={selectedFeature} />
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}

// Renders the appropriate light/dark MP4 video responsively while preserving aspect ratio
function FeatureGif({
  feature,
  maxHeight,
}: {
  feature: (typeof items)[0];
  maxHeight?: number;
}) {
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const isDark = resolvedMode === 'dark';
  const base = `/videos/features/${feature.gifBase}-${isDark ? 'dark' : 'light'}`;
  const mp4Src = `${base}.mp4`;
  // Lazy-load and auto-play videos only when in view to save bandwidth, especially on mobile.
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [canPlay, setCanPlay] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
          }
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ensure autoplay on mobile/iOS once the video is ready and in view.
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoad) return;
    // iOS requires the muted attribute to be present before setting src/playing
    v.muted = true;
    const tryPlay = () => v.play().catch(() => { /* ignore autoplay block */ });
    if (canPlay) {
      tryPlay();
    }
    // Also try once when source set
    const t = setTimeout(tryPlay, 0);
    return () => clearTimeout(t);
  }, [shouldLoad, canPlay]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        // Only set src once in view to save bandwidth
        src={shouldLoad ? mp4Src : undefined}
        autoPlay={shouldLoad}
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        draggable={false}
        preload={shouldLoad ? 'metadata' : 'none'}
        onCanPlay={() => setCanPlay(true)}
        onLoadedData={() => setCanPlay(true)}
        onError={() => {
          // If playback fails, do nothing (avoid GIF fallback as it degrades quality on resize)
        }}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          maxHeight: maxHeight ? `${maxHeight}px` : 'none',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
