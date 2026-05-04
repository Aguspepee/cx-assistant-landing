import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';

export default function Highlights() {
  const { t } = useTranslation('home');

  const items = [
    { icon: <ListAltRoundedIcon />, title: t('highlights.assetTracking.title'), description: t('highlights.assetTracking.description') },
    { icon: <WarningAmberRoundedIcon />, title: t('highlights.issueManagement.title'), description: t('highlights.issueManagement.description') },
    { icon: <ArticleRoundedIcon />, title: t('highlights.documentation.title'), description: t('highlights.documentation.description') },
  ];

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        backgroundColor: 'grey.100',
        width: '100%',
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
            textAlign: 'center',
          }}
        >
          <Typography
            component="h2"
            variant="h1"
            gutterBottom
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            {t('highlights.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', fontFamily: "'Roboto', sans-serif", fontSize: '1rem' }}
          >
            {t('highlights.subtitle')}
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                elevation={0}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'scale(1.04)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(155, 220, 100, 0.18)',
                    color: '#5a9e2f',
                    width: 'fit-content',
                    mb: 1,
                  }}
                >
                  {item.icon}
                </Box>
                <div>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: 700, fontFamily: "'Roboto', sans-serif", fontSize: '1rem', mb: 1 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontFamily: "'Roboto', sans-serif", lineHeight: 1.6 }}
                  >
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
