import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Box, CircularProgress, Typography } from '@mui/material';

const SsoCallback = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
      p={2}
    >
      <CircularProgress />
      <Typography variant="h6">Completing sign-in...</Typography>
      <AuthenticateWithRedirectCallback />
    </Box>
  );
};

export default SsoCallback;
