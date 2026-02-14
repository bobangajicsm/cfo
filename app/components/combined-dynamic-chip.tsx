import React from 'react';
import { Box, Typography } from '@mui/material';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface CombinedDynamicChip {
  value: number;
}

const CombinedDynamicChip = ({ value }: CombinedDynamicChip) => {
  let chipColor: string;
  let IconComponent: React.ElementType | null = null;
  let backgroundColor: string;
  let borderStyle: string;
  let text: string;

  if (value < 100) {
    chipColor = 'var(--system--300)';
    IconComponent = TrendingDownIcon;
    const alphaVar = 'var(--system--300-alpha)';
    backgroundColor = `rgba(${alphaVar}, 0.2)`;
    borderStyle = `1px solid rgba(${alphaVar}, 0.2)`;
    text = 'Attention';
  } else if (value >= 100 && value <= 120) {
    chipColor = 'var(--system--orange-300)';
    IconComponent = TrendingFlatIcon;
    const alphaVar = 'var(--system--orange-300-alpha)';
    backgroundColor = `rgba(${alphaVar}, 0.2)`;
    borderStyle = `1px solid rgba(${alphaVar}, 0.2)`;
    text = 'Satisfactory';
  } else {
    chipColor = 'var(--system--green-300)';
    IconComponent = TrendingUpIcon;
    const alphaVar = 'var(--system--green-300-alpha)';
    backgroundColor = `rgba(${alphaVar}, 0.2)`;
    borderStyle = `1px solid rgba(${alphaVar}, 0.2)`;
    text = 'Excellent';
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
          {text}
        </Typography>
        {IconComponent && <IconComponent sx={{ fontSize: '1.2rem' }} />}
      </Box>
    </Box>
  );
};

export default CombinedDynamicChip;
