import { Box, Stack } from '@mui/material';
import React from 'react';
import { NavLink, useLocation } from 'react-router';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

const navbar = () => {
  const location = useLocation();

  const isCashFlowActive =
    location.pathname === '/cash-flow' ||
    location.pathname === '/cash-flow/analytics' ||
    location.pathname === '/cash-flow/net-worth/analytics';

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      px={2}
      py={1}
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        color: 'var(--text-color-secondary)',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'rgba(var(--bg-color-secondary-alpha), 0.82)',
        fontSize: '1rem',
        boxShadow: 'var(--inner-glow-sm)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-color-primary)' : undefined,
        })}
      >
        <Stack alignItems="center" gap={1}>
          <HomeIcon sx={{ fontSize: '2.4rem' }} />
          Home
        </Stack>
      </NavLink>
      <NavLink
        to="/cash-flow"
        style={{
          color: isCashFlowActive ? 'var(--text-color-primary)' : undefined,
        }}
      >
        <Stack alignItems="center" gap={1}>
          <AttachMoneyIcon sx={{ fontSize: '2.4rem' }} />
          Cash Flow
        </Stack>
      </NavLink>
      <NavLink
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-color-primary)' : undefined,
        })}
        to="/portfolio/coming-soon"
      >
        <Stack alignItems="center" gap={1}>
          <WorkIcon sx={{ fontSize: '2.4rem' }} />
          Portfolio
        </Stack>
      </NavLink>
      <NavLink
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-color-primary)' : undefined,
        })}
        to="/analytics/coming-soon"
      >
        <Stack alignItems="center" gap={1}>
          <AnalyticsIcon sx={{ fontSize: '2.4rem' }} />
          Analytics
        </Stack>
      </NavLink>
      <NavLink
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-color-primary)' : undefined,
        })}
        to="/support/coming-soon"
      >
        <Stack alignItems="center" gap={1}>
          <HelpIcon sx={{ fontSize: '2.4rem' }} />
          Support
        </Stack>
      </NavLink>
      <NavLink
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-color-primary)' : undefined,
        })}
        to="/settings"
      >
        <Stack alignItems="center" gap={1}>
          <SettingsIcon sx={{ fontSize: '2.4rem' }} />
          Settings
        </Stack>
      </NavLink>
    </Box>
  );
};

export default navbar;
