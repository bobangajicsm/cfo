import { Box, CircularProgress } from '@mui/material';

export default function ThemeLoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
        opacity: 1,
        '&.loaded': {
          opacity: 0,
          pointerEvents: 'none',
        },
      }}
      id="theme-loader"
    >
      <CircularProgress size={40} thickness={4} />
    </Box>
  );
}
