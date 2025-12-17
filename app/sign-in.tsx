import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

import CommingSoonImgUrl from '~/assets/images/coming-soon-bg.png';
import LogoUrl from '~/assets/images/logo.svg';

const SignInPage = () => {
  return (
    <Stack alignItems="center" justifyContent="center" height="calc(100vh - 65px)" px={2} sx={{}}>
      <Box
        component="img"
        src={CommingSoonImgUrl}
        sx={{ position: 'absolute', top: '54px', filter: 'blur(6px)', width: '90%' }}
      />
      <Stack
        gap={2}
        alignItems="center"
        sx={{ position: 'relative', color: 'var(--text-color-primary)' }}
        mt={6}
      >
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary text-white hover:bg-primary-dark',
              headerTitle: 'text-2xl font-semibold text-white',
              headerSubtitle: 'text-neutral-200',
              socialButtonsBlockButton: 'bg-secondary text-white hover:bg-secondary-dark',
              input: 'bg-mui-elements-bg-color text-mui-elements-color border-border-color',
            },
            variables: {
              colorNeutral: 'var(--text-color-primary)',
              colorPrimary: 'var(--accent--primary-1)',
              colorBackground: 'var(--bg-color)',
              colorText: 'var(--text-color-primary)',
              colorInputBackground: 'var(--mui-elements-bg-color)',
              colorInputText: 'var(--mui-elements-color)',
              borderRadius: '0.5rem',
              fontSize: '13px',
            },
          }}
          // routing="path"
          // path="/sign-in"
          routing="virtual"
        />
      </Stack>
    </Stack>
  );
};

export default SignInPage;
