import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from 'react-router';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { Box, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material';

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import Dropdown from '~/components/dropdown';

const data2020 = [
  { month: 'Jan', earnings: 80600, expenses: 26450 },
  { month: 'Feb', earnings: 72200, expenses: 74700 },
  { month: 'Mar', earnings: 142500, expenses: 26450 },
  { month: 'Apr', earnings: 99200, expenses: 18320 },
  { month: 'May', earnings: 72900, expenses: 17780 },
  { month: 'Jun', earnings: 73000, expenses: 18590 },
  { month: 'Jul', earnings: 82600, expenses: 43730 },
  { month: 'Aug', earnings: 73400, expenses: 18270 },
  { month: 'Sep', earnings: 73200, expenses: 83180 },
  { month: 'Oct', earnings: 81500, expenses: 21900 },
  { month: 'Nov', earnings: 74600, expenses: 80520 },
  { month: 'Dec', earnings: 75600, expenses: 19500 },
];

const data2021 = [
  { month: 'Jan', earnings: 64100, expenses: 17950 },
  { month: 'Feb', earnings: 58400, expenses: 40200 },
  { month: 'Mar', earnings: 72300, expenses: 30920 },
  { month: 'Apr', earnings: 62000, expenses: 18280 },
  { month: 'May', earnings: 57400, expenses: 39100 },
  { month: 'Jun', earnings: 58900, expenses: 18490 },
  { month: 'Jul', earnings: 63300, expenses: 19100 },
  { month: 'Aug', earnings: 59000, expenses: 52050 },
  { month: 'Sep', earnings: 59200, expenses: 18920 },
  { month: 'Oct', earnings: 62400, expenses: 40730 },
  { month: 'Nov', earnings: 59600, expenses: 28200 },
  { month: 'Dec', earnings: 60100, expenses: 42850 },
];

const data2022 = [
  { month: 'Jan', earnings: 72100, expenses: 18950 },
  { month: 'Feb', earnings: 65800, expenses: 40850 },
  { month: 'Mar', earnings: 86400, expenses: 19100 },
  { month: 'Apr', earnings: 71700, expenses: 18980 },
  { month: 'May', earnings: 66500, expenses: 19210 },
  { month: 'Jun', earnings: 66800, expenses: 48850 },
  { month: 'Jul', earnings: 73600, expenses: 19850 },
  { month: 'Aug', earnings: 67400, expenses: 19990 },
  { month: 'Sep', earnings: 67700, expenses: 20150 },
  { month: 'Oct', earnings: 74100, expenses: 20310 },
  { month: 'Nov', earnings: 68800, expenses: 40270 },
  { month: 'Dec', earnings: 69600, expenses: 38200 },
];

const data2023 = [
  { month: 'Jan', earnings: 85100, expenses: 48150 },
  { month: 'Feb', earnings: 78400, expenses: 21050 },
  { month: 'Mar', earnings: 78800, expenses: 20750 },
  { month: 'Apr', earnings: 91100, expenses: 20890 },
  { month: 'May', earnings: 46400, expenses: 58550 },
  { month: 'Jun', earnings: 79800, expenses: 21410 },
  { month: 'Jul', earnings: 87900, expenses: 21870 },
  { month: 'Aug', earnings: 80800, expenses: 22050 },
  { month: 'Sep', earnings: 81300, expenses: 22210 },
  { month: 'Oct', earnings: 88800, expenses: 43850 },
  { month: 'Nov', earnings: 82600, expenses: 46350 },
  { month: 'Dec', earnings: 83600, expenses: 42350 },
];

const data2024 = [
  { month: 'Jan', earnings: 97600, expenses: 27600 },
  { month: 'Feb', earnings: 125100, expenses: 21000 },
  { month: 'Mar', earnings: 90600, expenses: 22000 },
  { month: 'Apr', earnings: 104800, expenses: 46100 },
  { month: 'May', earnings: 91600, expenses: 21800 },
  { month: 'Jun', earnings: 92100, expenses: 22300 },
  { month: 'Jul', earnings: 101100, expenses: 23000 },
  { month: 'Aug', earnings: 93100, expenses: 23200 },
  { month: 'Sep', earnings: 93600, expenses: 67100 },
  { month: 'Oct', earnings: 102100, expenses: 45300 },
  { month: 'Nov', earnings: 94600, expenses: 49800 },
  { month: 'Dec', earnings: 95600, expenses: 45850 },
];

const data2025 = [
  { month: 'Jan', earnings: 110600, expenses: 29150 },
  { month: 'Feb', earnings: 137600, expenses: 22650 },
  { month: 'Mar', earnings: 103600, expenses: 23350 },
  { month: 'Apr', earnings: 113100, expenses: 23550 },
  { month: 'May', earnings: 105600, expenses: 23400 },
  { month: 'Jun', earnings: 106600, expenses: 23650 },
  { month: 'Jul', earnings: 117100, expenses: 75850 },
  { month: 'Aug', earnings: 108600, expenses: 24050 },
  { month: 'Sep', earnings: 109600, expenses: 24450 },
  { month: 'Oct', earnings: 119600, expenses: 24650 },
  { month: 'Nov', earnings: 111600, expenses: 52150 },
  { month: 'Dec', earnings: 113600, expenses: 48850 },
];

const yearData: Record<string, typeof data2025> = {
  '2020': data2020,
  '2021': data2021,
  '2022': data2022,
  '2023': data2023,
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
  let totalMonths = 12;
  let hasPrevious = true;

  const currentYearData = data2025;
  const previousYearData = data2024;

  switch (date) {
    case 'W':
    case 'M':
      totalMonths = 1;
      currentData = currentYearData.slice(-1);
      prevData = previousYearData.slice(-1);
      break;
    case 'Q':
      totalMonths = 3;
      currentData = currentYearData.slice(-3);
      prevData = previousYearData.slice(-3);
      break;
    case '6M':
      totalMonths = 6;
      currentData = currentYearData.slice(-6);
      prevData = previousYearData.slice(-6);
      break;
    case 'Y':
      totalMonths = 12;
      currentData = currentYearData;
      prevData = previousYearData;
      break;
    case '2Y':
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const currentYearOffset = [2024, 2025];
      const currentYearDatas = [previousYearData, currentYearData];
      currentData = [];
      currentYearDatas.forEach((yData, y) => {
        const year = currentYearOffset[y];
        for (let q = 0; q < 4; q++) {
          const months = yData.slice(q * 3, q * 3 + 3);
          const sumEarnings = months.reduce((acc, m) => acc + m.earnings, 0);
          const sumExpenses = months.reduce((acc, m) => acc + m.expenses, 0);
          currentData.push({
            month: `${quarters[q]} ${year}`,
            earnings: sumEarnings,
            expenses: sumExpenses,
          });
        }
      });
      totalMonths = 24;

      const prevYearOffset = [2022, 2023];
      const prevYearDatas = [data2022, data2023];
      prevData = [];
      prevYearDatas.forEach((yData, y) => {
        const year = prevYearOffset[y];
        for (let q = 0; q < 4; q++) {
          const months = yData.slice(q * 3, q * 3 + 3);
          const sumEarnings = months.reduce((acc, m) => acc + m.earnings, 0);
          const sumExpenses = months.reduce((acc, m) => acc + m.expenses, 0);
          if (prevData) {
            prevData.push({
              month: `${quarters[q]} ${year}`,
              earnings: sumEarnings,
              expenses: sumExpenses,
            });
          }
        }
      });
      break;
    case '5Y':
      const allYearKeys = ['2021', '2022', '2023', '2024', '2025'];
      currentData = [];
      allYearKeys.forEach((yearKey) => {
        const yData = yearData[yearKey];
        const sumEarnings = yData.reduce((acc, m) => acc + m.earnings, 0);
        const sumExpenses = yData.reduce((acc, m) => acc + m.expenses, 0);
        currentData.push({
          month: yearKey,
          earnings: sumEarnings,
          expenses: sumExpenses,
        });
      });
      totalMonths = 60;
      hasPrevious = false;
      break;
    default:
      totalMonths = 12;
      currentData = currentYearData;
      prevData = previousYearData;
  }

  const netCurrent = currentData.reduce(
    (acc, { earnings, expenses }) => acc + earnings - expenses,
    0
  );
  const avgNet = Math.round(netCurrent / totalMonths).toLocaleString('en-US');

  const netPrevious = hasPrevious
    ? prevData?.reduce((acc, { earnings, expenses }) => acc + earnings - expenses, 0) || 0
    : 0;
  const growthRate =
    hasPrevious && netPrevious !== 0 ? ((netCurrent - netPrevious) / netPrevious) * 100 : 0;

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
          <MenuItem onClick={handleCloseMenu} component={Link} to="/cash-flow/analytics">
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
                backgroundColor: 'var(--secondary--color-3)',
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
                backgroundColor: 'var(--accent--primary-1)',
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
            {['W', 'M', 'Q', '6M', 'Y', '2Y', '5Y'].map((timeframe) => (
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
              if (name === 'earnings') return [formattedValue, 'Earnings'];
              if (name === 'expenses') return [formattedValue, 'Expenses'];
              return [value, name];
            }}
            labelFormatter={(label) => `Month: ${label}`}
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
