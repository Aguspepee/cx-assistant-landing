import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Engineer Advantages',
    description:
      'Spend less time on spreadsheets and admin, more time on actual engineering. Get instant answers to repetitive questions, clear asset and project overviews, and smarter reporting with ready-to-use charts and summaries.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Decision Maker Advantages',
    description:
      'Quality & Compliance: AI-powered validation catches errors before they become risks. Efficiency: Automated workflows and real-time insights accelerate commissioning timelines. Scalability: A single platform for multiple sites and projects.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Cost Savings',
    description:
      'Reduce rework, manual effort, and delays. Cx Assistant pays for itself within the first projects.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Future-Proof',
    description:
      'Built on modern architecture with AI at its core, Cx Assistant evolves with technology and your needs.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Why Now?',
    description:
      'Commissioning is increasingly complex, global, and time-critical. Cx Assistant bridges human expertise and AI automation for faster, safer, and more consistent project delivery.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'In Short',
    description:
      'Cx Assistant is not just another commissioning app. It’s a digital partner for engineers and a strategic advantage for decision makers.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Why Cx Assistant?
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Discover how Cx Assistant transforms commissioning: smarter workflows, instant answers, compliance, and cost savings—all in one intelligent platform.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
