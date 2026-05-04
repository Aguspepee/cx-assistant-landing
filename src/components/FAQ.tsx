import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const { t } = useTranslation('home');
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(
        isExpanded
          ? [...expanded, panel]
          : expanded.filter((item) => item !== panel),
      );
    };

  const items = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>;

  return (
    <Box sx={{ backgroundColor: '#111314', width: '100%' }}>
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h1"
        sx={{
          color: '#ffffff',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        {t('faq.title')}
      </Typography>
      <Box sx={{ width: '100%' }}>
        {items.map((item, i) => {
          const panel = `panel${i + 1}`;
          return (
            <Accordion
              key={panel}
              expanded={expanded.includes(panel)}
              onChange={handleChange(panel)}
              elevation={0}
              sx={{ backgroundColor: '#1a1d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px !important', mb: 1, '&:before': { display: 'none' } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />}
                aria-controls={`${panel}d-content`}
                id={`${panel}d-header`}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}
              >
                <Typography component="span" variant="subtitle2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#ffffff' }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ maxWidth: { sm: '100%', md: '70%' }, fontFamily: "'Roboto', sans-serif", lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
    </Box>
  );
}
