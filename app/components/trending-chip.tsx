import React from 'react';
import { Box, Typography } from '@mui/material';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface TrendingChipProps {
  value: number;
}

const TrendingChip = ({ value }: TrendingChipProps) => {
  let chipColor: string;
  let IconComponent = null;
  let backgroundColor: string;
  let borderStyle: string;
  let positive = value > 0;

  if (value > 0) {
    chipColor = 'var(--system--green-300)';
    IconComponent = TrendingUpIcon;
    const alphaVar = 'var(--system--green-300-alpha)';
    backgroundColor = `rgba(${alphaVar}, 0.2)`;
    borderStyle = `1px solid rgba(${alphaVar}, 0.2)`;
  } else if (value < 0) {
    chipColor = 'var(--system--300)';
    IconComponent = TrendingDownIcon;
    const alphaVar = 'var(--system--300-alpha)';
    backgroundColor = `rgba(${alphaVar}, 0.2)`;
    borderStyle = `1px solid rgba(${alphaVar}, 0.2)`;
  } else {
    IconComponent = TrendingFlatIcon;
    chipColor = 'var(--mui-elements-color)';
    backgroundColor = 'var(--mui-elements-bg-color-secondary)';
    borderStyle = '1px solid var(--mui-elements-border-color)';
  }

  return (
    <Box display="flex" gap={0.5} alignItems="center">
      <Box
        display="flex"
        alignItems="center"
        gap={0.5}
        sx={{
          color: chipColor,
          backgroundColor,
          border: borderStyle,
          borderRadius: 0.5,
          py: 0.2,
          px: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '1.2rem',
          }}
        >
          {positive && '+'}
          {value}%
        </Typography>
        <IconComponent sx={{ fontSize: '1.2rem' }} />
      </Box>
    </Box>
  );
};

export default TrendingChip;
