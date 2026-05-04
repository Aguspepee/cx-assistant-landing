import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import { brand } from '../theme/themePrimitives';

export default function Pricing() {
  const { t } = useTranslation('home');
  const lp = useLangPath();

  const tiers = [
    {
      key: 'basic',
      title: t('pricing.tiers.basic.title'),
      price: '150',
      subtitle: t('pricing.tiers.basic.subtitle'),
      description: t('pricing.tiers.basic.features', { returnObjects: true }) as string[],
      footerItems: t('pricing.tiers.basic.footer', { returnObjects: true }) as string[],
      buttonText: t('pricing.tiers.basic.cta'),
      buttonVariant: 'outlined',
      buttonColor: 'primary',
      href: 'https://app.cx-assistant.com/sign-up',
    },
    {
      key: 'pro',
      title: t('pricing.tiers.pro.title'),
      subheader: t('pricing.selected'),
      price: '500',
      subtitle: t('pricing.tiers.pro.subtitle'),
      description: t('pricing.tiers.pro.features', { returnObjects: true }) as string[],
      footerItems: t('pricing.tiers.pro.footer', { returnObjects: true }) as string[],
      buttonText: t('pricing.tiers.pro.cta'),
      buttonVariant: 'contained',
      buttonColor: 'secondary',
      href: 'https://app.cx-assistant.com/sign-up',
    },
    {
      key: 'enterprise',
      title: t('pricing.tiers.enterprise.title'),
      price: null,
      subtitle: t('pricing.tiers.enterprise.subtitle'),
      description: t('pricing.tiers.enterprise.features', { returnObjects: true }) as string[],
      footerItems: [] as string[],
      buttonText: t('pricing.tiers.enterprise.cta'),
      buttonVariant: 'outlined',
      buttonColor: 'primary',
      contactRoute: true,
    },
  ];

  return (    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Box sx={{ backgroundColor: 'grey.100', width: '100%' }}>
      <Container
        id="pricing"
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
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography
            component="h2"
            variant="h1"
            gutterBottom
            sx={{ color: 'text.primary', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: 0.2 }}
          >
          {t('pricing.title')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: "'Roboto', sans-serif", fontSize: '1rem' }}>
            {t('pricing.subtitle')}
          </Typography>
        </Box>
        <Grid
          container
          spacing={1}
          sx={{ alignItems: 'stretch', justifyContent: 'center', width: '100%' }}
        >
              {tiers.map((tier) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={tier.key}
              sx={{ transform: tier.title !== 'Pro' ? 'scale(0.88)' : 'none', transition: 'transform 0.25s ease' }}
            >
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
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
                  ...(tier.title === 'Pro' && {
                    outline: '3px solid',
                    outlineColor: 'rgba(0, 0, 0, 0.12)',
                  }),
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {tier.title}
                    </Typography>
                    {tier.key === 'pro' && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={tier.subheader}
                        sx={{
                          backgroundColor: 'grey.200',
                          color: 'grey.700',
                        }}
                      />
                    )}
                  </Box>
                  {tier.price !== null ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography component="h3" variant="h2">
                          €{tier.price}
                        </Typography>
                        <Typography component="h3" variant="h6">
                          &nbsp; {t('pricing.perMonth')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        {tier.subtitle}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: 'text.primary' }}
                    >
                      {tier.subtitle}
                    </Typography>
                  )}
                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                  {tier.description.map((line) => (
                    <Box
                      key={line}
                      sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}
                    >
                      <CheckCircleRoundedIcon sx={{ width: 20, color: brand[600] }} />
                      <Typography variant="subtitle2" component={'span'}>
                        {line}
                      </Typography>
                    </Box>
                  ))}
                  {tier.footerItems.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1 }}>
                        <GroupRoundedIcon sx={{ width: 20, color: 'text.secondary' }} />
                        <Typography variant="subtitle2" component={'span'} sx={{ color: 'text.secondary' }}>
                          {tier.footerItems[0]}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <StorageRoundedIcon sx={{ width: 20, color: 'text.secondary' }} />
                        <Typography variant="subtitle2" component={'span'} sx={{ color: 'text.secondary' }}>
                          {tier.footerItems[1]}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
                <CardActions>
                  {(tier as any).contactRoute ? (
                    <Button
                      fullWidth
                      variant={tier.buttonVariant as 'outlined' | 'contained'}
                      color={tier.buttonColor as 'primary' | 'secondary'}
                      component={RouterLink}
                      to={lp('/contact')}
                    >
                      {tier.buttonText}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={tier.buttonVariant as 'outlined' | 'contained'}
                      color={tier.buttonColor as 'primary' | 'secondary'}
                      href={(tier as any).href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tier.buttonText}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>
    </motion.div>
  );
}
