import { Box, Typography } from '@mui/material';
import React from 'react';
import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

interface CardProps extends React.ComponentProps<typeof Box> {
  onClick: () => void;
  item: {
    title: string;
    description: string;
    value: string;
    trend: 'up' | 'down';
  };
}

const AnalyticsCard = ({ onClick, item, ...props }: CardProps) => {
  return (
    <Card {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end">
        <Box>
          <Typography fontSize="1.4rem" mb={0.5}>
            {item.title}
          </Typography>
          <Typography color="var(--text-color-secondary)" fontSize="1rem">
            {item.description}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize="2.4rem" fontWeight={700} lineHeight={1}>
            {item.value}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{
              color: item.trend === 'up' ? 'var(--system--green-300)' : 'var(--system--300)',
              backgroundColor:
                item.trend === 'up'
                  ? 'rgba(var(--system--green-300-alpha), 0.2)'
                  : 'rgba(var(--system--300-alpha), 0.2)',
              border:
                item.trend === 'up'
                  ? '1px solid rgba(var(--system--green-300-alpha), 0.2)'
                  : '1px solid rgba(var(--system--300-alpha), 0.2)',
              borderRadius: 0.5,
              py: 0.2,
              px: 0.5,
            }}
          >
            {item.trend === 'up' ? (
              <TrendingUpIcon
                sx={{
                  fontSize: '1.2rem',
                }}
              />
            ) : (
              <TrendingUpIcon
                sx={{
                  fontSize: '1.2rem',
                  transform: 'rotate(180deg)',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <ButtonIcon
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '-13px',
          left: '-13px',
          opacity: 0.7,
        }}
      >
        <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
      </ButtonIcon>
    </Card>
  );
};

export default AnalyticsCard;
