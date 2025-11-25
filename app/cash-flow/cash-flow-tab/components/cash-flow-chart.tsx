import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from 'react-router';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { Box, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material';

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid } from 'recharts';
import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import Dropdown from '~/components/dropdown';

const data2025 = [
  { month: 'Jan', earnings: 3500, expenses: 2500 },
  { month: 'Feb', earnings: 4200, expenses: 2800 },
  { month: 'Mar', earnings: 3000, expenses: 3200 },
  { month: 'Apr', earnings: 5000, expenses: 2200 },
  { month: 'May', earnings: 4800, expenses: 2600 },
  { month: 'Jun', earnings: 5300, expenses: 2400 },
  { month: 'Jul', earnings: 6000, expenses: 3000 },
  { month: 'Aug', earnings: 5800, expenses: 2700 },
  { month: 'Sep', earnings: 6200, expenses: 2900 },
  { month: 'Oct', earnings: 7000, expenses: 3100 },
  { month: 'Nov', earnings: 7500, expenses: 3300 },
  { month: 'Dec', earnings: 8000, expenses: 3500 },
];

const data2024 = [
  { month: 'Jan', earnings: 3200, expenses: 2600 },
  { month: 'Feb', earnings: 3900, expenses: 2900 },
  { month: 'Mar', earnings: 3100, expenses: 3400 },
  { month: 'Apr', earnings: 4600, expenses: 2300 },
  { month: 'May', earnings: 4400, expenses: 2700 },
  { month: 'Jun', earnings: 4900, expenses: 2500 },
  { month: 'Jul', earnings: 5600, expenses: 3100 },
  { month: 'Aug', earnings: 5400, expenses: 2800 },
  { month: 'Sep', earnings: 5800, expenses: 3000 },
  { month: 'Oct', earnings: 6600, expenses: 3200 },
  { month: 'Nov', earnings: 7100, expenses: 3400 },
  { month: 'Dec', earnings: 7300, expenses: 3500 },
];

const yearData: Record<string, typeof data2025> = {
  '2024': data2024,
  '2025': data2025,
};

const CashFlowChart = () => {
  const [date, setDate] = useState('Y');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  let currentData: typeof data2025;
  let prevData: typeof data2025 | null = null;
  let numMonths = 12;

  const currentYearData = data2025;
  const previousYearData = data2024;

  switch (date) {
    case 'W':
    case 'M':
      numMonths = 1;
      currentData = currentYearData.slice(-numMonths);
      prevData = previousYearData.slice(-numMonths);
      break;
    case 'Q':
      numMonths = 3;
      currentData = currentYearData.slice(-numMonths);
      prevData = previousYearData.slice(-numMonths);
      break;
    case '6M':
      numMonths = 6;
      currentData = currentYearData.slice(-numMonths);
      prevData = previousYearData.slice(-numMonths);
      break;
    case 'Y':
      numMonths = 12;
      currentData = currentYearData;
      prevData = previousYearData;
      break;
    case '2Y':
      numMonths = 24;
      currentData = [
        ...previousYearData.map((item) => ({
          ...item,
          month: `${2024} ${item.month}`,
        })),
        ...currentYearData.map((item) => ({
          ...item,
          month: `${2025} ${item.month}`,
        })),
      ];
      prevData = null;
      break;
    default:
      numMonths = 12;
      currentData = currentYearData;
      prevData = previousYearData;
  }

  const netCurrent = currentData.reduce(
    (acc, { earnings, expenses }) => acc + earnings - expenses,
    0
  );
  const avgNet = Math.round(netCurrent / numMonths);

  const hasPrevious = prevData !== null;
  const netPrevious = hasPrevious
    ? prevData?.reduce((acc, { earnings, expenses }) => acc + earnings - expenses, 0)
    : netCurrent;
  const growthRate = hasPrevious
    ? ((netCurrent - (netPrevious || 0)) / (netPrevious || 0)) * 100
    : 0;

  return (
    <>
      <Card
        sx={{
          pb: 1,
          mb: 2,
        }}
      >
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Cash flow
            </Typography>
            <ButtonIcon onClick={handleOpenMenu}>
              <MoreHorizIcon sx={{ fontSize: '1.6rem' }} />
            </ButtonIcon>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontSize="2.8rem" fontWeight={700}>
              ${avgNet}
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
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: '0.8rem',
                height: '0.8rem',
                backgroundColor: 'var(--accent--primary-1)',
                borderRadius: '100%',
              }}
            />
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Revenue
            </Typography>
            <Box
              sx={{
                width: '0.8rem',
                height: '0.8rem',
                backgroundColor: 'var(--secondary--color-3)',
                borderRadius: '100%',
              }}
            />
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Expenses
            </Typography>
          </Box>
          <Dropdown
            value={date}
            onChange={(e) => setDate(e.target.value)}
            input={<OutlinedInput startAdornment={<CalendarTodayIcon />} />}
            size="small"
            IconComponent={KeyboardArrowDownIcon}
          >
            {['W', 'M', 'Q', '6M', 'Y', '2Y'].map((timeframe) => (
              <MenuItem key={timeframe} value={timeframe}>
                {timeframe}
              </MenuItem>
            ))}
          </Dropdown>
        </Box>
        <BarChart
          style={{
            width: '100%',
            aspectRatio: 1.618,
          }}
          responsive
          data={currentData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray=""
            vertical={false}
            stroke="var(--border-color-secondary)"
          />
          <XAxis
            dataKey="month"
            stroke="var(--text-color-secondary)"
            tickLine={false}
            fontSize="1rem"
          />
          <YAxis
            width="auto"
            stroke="var(--text-color-secondary)"
            tickLine={false}
            axisLine={false}
            fontSize="1.2rem"
          />

          <Bar
            dataKey="earnings"
            fill="var(--secondary--color-3)"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
          <Bar
            dataKey="expenses"
            fill="var(--accent--primary-1)"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
        <ButtonIcon
          sx={{
            position: 'absolute',
            top: '-13px',
            left: '-13px',
            opacity: 0.7,
          }}
          onClick={handleOpenInfoDialog}
        >
          <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
        </ButtonIcon>
      </Card>

      <InfoDialog
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
        title="Cash Flow"
        shortDescription="This chart displays your monthly earnings and expenses for the selected year. Use it to track your cash flow trends over time."
        formula="Net Cash Flow = Operating Cash Flow + Investing Cash Flow + Financing Cash Flow"
        longDescription="Cash flow is the movement of money into or out of a business, project, or financial product. It is a key indicator of financial health. Positive cash flow means more money is coming in than going out, while negative cash flow indicates the opposite. Understanding cash flow helps in making informed decisions about investments, expenses, and growth strategies."
        youtubeUrl="https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF"
      />
    </>
  );
};

export default CashFlowChart;
