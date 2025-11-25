import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import { Box, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import Dropdown from '~/components/dropdown';

const data2024 = [
  { month: 'Jan', assets: 105000, liabilities: 92000, netWorth: 105000 - 92000 }, // → 13000
  { month: 'Feb', assets: 108000, liabilities: 91000, netWorth: 108000 - 91000 }, // → 17000
  { month: 'Mar', assets: 112000, liabilities: 90500, netWorth: 112000 - 90500 }, // → 21500
  { month: 'Apr', assets: 109500, liabilities: 89500, netWorth: 109500 - 89500 }, // → 20000
  { month: 'May', assets: 115000, liabilities: 89000, netWorth: 115000 - 89000 }, // → 26000
  { month: 'Jun', assets: 118000, liabilities: 87000, netWorth: 118000 - 87000 }, // → 31000
  { month: 'Jul', assets: 122000, liabilities: 88000, netWorth: 122000 - 88000 }, // → 34000
  { month: 'Aug', assets: 128000, liabilities: 87500, netWorth: 128000 - 87500 }, // → 40500
  { month: 'Sep', assets: 132000, liabilities: 86000, netWorth: 132000 - 86000 }, // → 46000
  { month: 'Oct', assets: 129000, liabilities: 85500, netWorth: 129000 - 85500 }, // → 43500
  { month: 'Nov', assets: 138000, liabilities: 84000, netWorth: 138000 - 84000 }, // → 54000
  { month: 'Dec', assets: 135000, liabilities: 84500, netWorth: 135000 - 84500 }, // → 50500
];

const data2025 = [
  { month: 'Jan', assets: 142000, liabilities: 8300, netWorth: 142000 - 8300 }, // → 59000
  { month: 'Feb', assets: 148000, liabilities: 8250, netWorth: 148000 - 8250 }, // → 65500
  { month: 'Mar', assets: 145000, liabilities: 8150, netWorth: 145000 - 8150 }, // → 63500
  { month: 'Apr', assets: 152000, liabilities: 8100, netWorth: 152000 - 8100 }, // → 71000
  { month: 'May', assets: 158000, liabilities: 79000, netWorth: 158000 - 79000 }, // → 79000
  { month: 'Jun', assets: 162000, liabilities: 78000, netWorth: 162000 - 78000 }, // → 84000
  { month: 'Jul', assets: 175000, liabilities: 92000, netWorth: 175000 - 92000 }, // → 83000
  { month: 'Aug', assets: 182000, liabilities: 90500, netWorth: 182000 - 90500 }, // → 91500
  { month: 'Sep', assets: 188000, liabilities: 89000, netWorth: 188000 - 89000 }, // → 99000
  { month: 'Oct', assets: 185000, liabilities: 88000, netWorth: 185000 - 88000 }, // → 97000
  { month: 'Nov', assets: 198000, liabilities: 87000, netWorth: 198000 - 87000 }, // → 111000
  { month: 'Dec', assets: 210000, liabilities: 85000, netWorth: 210000 - 85000 }, // → 125000
];

const NetWorthChart = () => {
  const [date, setDate] = useState('Y');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  let displayData = data2025;
  if (date === '2Y') {
    displayData = [
      ...data2024.map((d) => ({ ...d, month: `’24 ${d.month}` })),
      ...data2025.map((d) => ({ ...d, month: `’25 ${d.month}` })),
    ];
  } else if (date === '6M') displayData = data2025.slice(-6);
  else if (date === 'Q') displayData = data2025.slice(-3);

  const latest = displayData[displayData.length - 1];
  const first = displayData[0];
  const growthRate =
    first.netWorth === 0
      ? 0
      : ((latest.netWorth - first.netWorth) / Math.abs(first.netWorth)) * 100;

  return (
    <>
      <Card sx={{ pb: 1, mb: 2 }}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Net Worth
            </Typography>
            <ButtonIcon onClick={handleOpenMenu}>
              <MoreHorizIcon sx={{ fontSize: '1.6rem' }} />
            </ButtonIcon>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontSize="2.8rem" fontWeight={700}>
              ${Math.round(latest.netWorth / 1000)}k
            </Typography>
            <TrendingChip value={parseFloat(growthRate.toFixed(1))} />
          </Box>
        </Box>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/analytics">
            Analytics
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/reports">
            Reports
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/notifications">
            Notifications
          </MenuItem>
        </Menu>

        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: '0.8rem',
                  height: '0.8rem',
                  background: 'var(--text-color-primary)',
                  borderRadius: '100%',
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Net Worth
              </Typography>
              <Box
                sx={{
                  width: '0.8rem',
                  height: '0.8rem',
                  background: 'var(--accent--primary-1)',
                  borderRadius: '100%',
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Assets
              </Typography>
              <Box
                sx={{
                  width: '0.8rem',
                  height: '0.8rem',
                  background: 'var(--secondary--color-3)',
                  borderRadius: '100%',
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Liabilities
              </Typography>
            </Box>
          </Box>

          <Dropdown
            value={date}
            onChange={(e) => setDate(e.target.value)}
            input={<OutlinedInput startAdornment={<CalendarTodayIcon />} />}
            size="small"
            IconComponent={KeyboardArrowDownIcon}
          >
            {['Q', '6M', 'Y', '2Y'].map((tf) => (
              <MenuItem key={tf} value={tf}>
                {tf}
              </MenuItem>
            ))}
          </Dropdown>
        </Box>

        <Box sx={{ width: '100%', height: { xs: 280, sm: 320, md: 360 }, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="assetsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--secondary--color-3)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--secondary--color-3)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="liabilitiesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent--primary-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--accent--primary-1)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray=""
                vertical={false}
                stroke="var(--border-color-secondary)"
                opacity={0.3}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                stroke="var(--text-color-secondary)"
                fontSize="1rem"
                padding={{ left: 0, right: 0 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="var(--text-color-secondary)"
                fontSize="1.1rem"
                width={60}
                tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
              />

              <Tooltip
                contentStyle={{
                  background: 'rgba(var(--bg-color-secondary-alpha), 0.96)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '10px 14px',
                }}
                labelStyle={{
                  color: 'var(--text-color-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: 8,
                }}
                itemStyle={{ padding: '4px 0' }}
                formatter={(value: number, name: string) => {
                  const formattedValue = `$${Math.abs(value).toLocaleString()}`;
                  if (name === 'netWorth') return [formattedValue, 'Net Worth'];
                  if (name === 'assets') return [formattedValue, 'Assets'];
                  if (name === 'liabilities') return [formattedValue, 'Debt'];
                  return [formattedValue, name];
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />

              <Area
                type="monotone"
                dataKey="assets"
                stroke="var(--secondary--color-3)"
                strokeWidth={3}
                fill="url(#assetsFill)"
                fillOpacity={1}
                dot={false}
                activeDot={false}
              />
              <Area
                type="monotone"
                dataKey="liabilities"
                stroke="var(--accent--primary-1)"
                strokeWidth={3}
                fill="url(#liabilitiesFill)"
                fillOpacity={1}
                dot={false}
                activeDot={false}
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="var(--text-color-primary)"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={{ r: 6 }}
                strokeLinecap="round"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <ButtonIcon
          sx={{ position: 'absolute', top: '-13px', left: '-13px', opacity: 0.7 }}
          onClick={() => setIsOpenInfoDialog(true)}
        >
          <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
        </ButtonIcon>
      </Card>

      <InfoDialog
        open={isOpenInfoDialog}
        onClose={() => setIsOpenInfoDialog(false)}
        title="Net Worth"
        shortDescription="Your complete financial picture: Assets, Debt, and Net Worth over time."
        formula="Net Worth = Total Assets − Total Liabilities"
        longDescription="The glowing line is your net worth. The dashed purple line above shows total assets. The dashed red line below shows total debt. This is the gold standard for wealth tracking — used by Copilot, Monarch Money, and top finance apps."
        youtubeUrl="https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF"
      />
    </>
  );
};

export default NetWorthChart;
