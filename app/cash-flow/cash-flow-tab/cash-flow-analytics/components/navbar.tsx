import { Box, Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router';

const breadcrumbs = [
  <Box
    component={Link}
    to="/"
    sx={{
      fontSize: '1.2rem',
      color: 'var(--neutral--400)',
    }}
  >
    Cash Flow
  </Box>,
  <Box
    sx={{
      fontSize: '1.2rem',
      color: 'var(--neutral--400)',
    }}
  >
    Cash Flow Analytics
  </Box>,
];

const Navbar = () => {
  return (
    <Box px={2} py={1} sx={{ borderBottom: 1, borderColor: 'var(--border-color)' }}>
      <Typography variant="h1" fontSize="2.4rem" fontWeight={500}>
        Cash Flow Analytics
      </Typography>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ color: 'var(--neutral--400)', fontSize: '1.2rem' }} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
};

export default Navbar;
