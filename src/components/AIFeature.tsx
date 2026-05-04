import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded';

export default function AIFeature() {
  const { t } = useTranslation('home');
  const [visibleCount, setVisibleCount] = React.useState(0);

  const conversation = [
    { role: 'user', text: t('aiFeature.chatUser') },
    { role: 'assistant', text: t('aiFeature.chatAssistant') },
  ];

  React.useEffect(() => {
    if (visibleCount >= conversation.length) return;
    const delay = visibleCount === 0 ? 600 : 1200;
    const id = setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [visibleCount]);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#111314',
        py: { xs: 8, sm: 14 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* ---- Left: chat mockup ---- */}
          <Box
            sx={{
              borderRadius: 3,
              backgroundColor: '#1a1d1f',
              border: '1px solid rgba(255,255,255,0.08)',
              p: { xs: 2.5, sm: 3.5 },
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#DCFFB6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#111314',
                  fontFamily: "'Space Grotesk', sans-serif",
                  flexShrink: 0,
                }}
              >
                ✦
              </Box>
              <Typography
                sx={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.95rem',
                }}
              >
                Cx Assistant
              </Typography>
            </Box>

            {/* Messages */}
            <Stack spacing={1.5} sx={{ minHeight: 160 }}>
              {conversation.slice(0, visibleCount).map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                    animation: 'fadeUp 0.35s ease both',
                    '@keyframes fadeUp': {
                      from: { opacity: 0, transform: 'translateY(8px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '82%',
                      px: 2,
                      py: 1.5,
                      borderRadius: msg.role === 'user' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                      backgroundColor: msg.role === 'user' ? '#2a2d2f' : '#2f3a28',
                      border: '1px solid',
                      borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.07)' : 'rgba(220,255,182,0.15)',
                    }}
                  >
                    <Typography
                      sx={{
                        color: msg.role === 'user' ? 'rgba(255,255,255,0.75)' : 'rgba(220,255,182,0.9)',
                        fontSize: '0.82rem',
                        fontFamily: "'Roboto', sans-serif",
                        lineHeight: 1.55,
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Input bar */}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: '#23262a',
                px: 2,
                py: 1,
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.82rem',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {t('aiFeature.inputPlaceholder')}
              </Typography>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  backgroundColor: '#DCFFB6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111314',
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}
              >
                ▶
              </Box>
            </Box>
          </Box>

          {/* ---- Right: copy ---- */}
          <Stack spacing={3}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: { xs: 'clamp(2rem, 6vw, 3rem)', md: 'clamp(1.8rem, 4vw, 3rem)' },
                lineHeight: 1.15,
                color: '#ffffff',
              }}
            >
              {t('aiFeature.title')}{' '}
              <Box component="span" sx={{ color: '#DCFFB6' }}>
                {t('aiFeature.titleHighlight')}
              </Box>
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Roboto', sans-serif",
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: 480,
              }}
            >
              {t('aiFeature.description')}
            </Typography>

            <Stack spacing={2} sx={{ pt: 1 }}>
              {[
                { icon: <ShowChartRoundedIcon sx={{ fontSize: 18 }} />, label: t('aiFeature.feature1') },
                { icon: <BiotechRoundedIcon sx={{ fontSize: 18 }} />, label: t('aiFeature.feature2') },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '1px solid rgba(220,255,182,0.25)',
                      color: '#DCFFB6',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '0.95rem',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
