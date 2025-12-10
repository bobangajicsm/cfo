import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';

import CommingSoonImgUrl from '~/assets/images/coming-soon-bg.png';
import LogoUrl from '~/assets/images/logo.svg';
import ButtonPrimary from '~/components/button-primary';

const MorePages = () => {
  return (
    <Stack alignItems="center" justifyContent="center" height="calc(100vh - 65px)" px={2} sx={{}}>
      <Box
        component="img"
        src={CommingSoonImgUrl}
        sx={{ position: 'absolute', top: '54px', filter: 'blur(6px)', width: '90%' }}
      />
      <Stack gap={2} alignItems="center" sx={{ position: 'relative' }} mt={6}>
        <Box
          sx={{
            width: '6.8rem',
            height: '6.8rem',
            borderRadius: '0.6rem',
            boxShadow: '0 14px 14px #0a163c',
            border: '1px solid #666b97;',
            backgroundColor: '#21294c',
          }}
        >
          <Box component="img" src={LogoUrl} sx={{ scale: 1.5 }} />
        </Box>
        <Typography variant="h1" fontSize="2.8rem" fontWeight={600}>
          More pages coming soon
        </Typography>
        <Typography
          color="var(--neutral--200);"
          mb={3}
          fontSize="1.6rem"
          lineHeight="2.4rem"
          textAlign="center"
        >
          We're hard at work building the premium version of Cash Flow Organizer—packed with
          advanced forecasting tools, automated reports, and seamless integrations to supercharge
          your financial planning. In the meantime, dive into the free version today to get started
          on tracking your income, expenses, and cash flow like a pro.
        </Typography>
        <ButtonPrimary>Learn More</ButtonPrimary>
      </Stack>
    </Stack>
  );
};

export default MorePages;
