import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material';
import { Link } from 'react-router';

import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import Dropdown from '~/components/dropdown';
import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';

const sankeyData: [string, string, number][] = [
  ['Salary', 'Rent/Mortgage', 1800],
  ['Freelance', 'Rent/Mortgage', 200],
  ['Salary', 'Groceries', 500],
  ['Freelance', 'Groceries', 100],
  ['Salary', 'Utilities', 200],
  ['Freelance', 'Utilities', 50],
  ['Salary', 'Transportation', 350],
  ['Freelance', 'Transportation', 50],
  ['Salary', 'Insurance', 300],
  ['Salary', 'Entertainment', 300],
  ['Freelance', 'Entertainment', 50],
  ['Salary', 'Healthcare', 180],
  ['Freelance', 'Healthcare', 20],
  ['Salary', 'Savings', 1000],
  ['Freelance', 'Savings', 200],
  ['Salary', 'Investments', 700],
  ['Freelance', 'Investments', 100],
  ['Salary', 'Debt Repayment', 400],
  ['Freelance', 'Debt Repayment', 100],
  ['Salary', 'Miscellaneous', 270],
  ['Freelance', 'Miscellaneous', 30],
];

const totalIncome = sankeyData.reduce((sum, [, , v]) => sum + v, 0);
const totalSpent = sankeyData
  .filter(([_, to]) => !['Savings', 'Investments'].includes(to))
  .reduce((sum, [, , v]) => sum + v, 0);
const savingsRate =
  totalIncome > 0 ? (((totalIncome - totalSpent) / totalIncome) * 100).toFixed(1) : '0';

const BudgetChart = () => {
  const [date, setDate] = useState('M');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenInfoDialog = () => setIsOpenInfoDialog(true);
  const handleCloseInfoDialog = () => setIsOpenInfoDialog(false);
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setMenuAnchorEl(null);

  const chartData: (string | number)[][] = [['From', 'To', 'Weight'], ...sankeyData];

  const options = {
    backgroundColor: 'transparent',
    sankey: {
      orientation: 'vertical' as const,
      node: {
        label: {
          fontName: '--var(--font-sans)',
          fontSize: '1.2rem',
          color: 'var(--text-color-primary)',
        },
        nodePadding: 32,
        width: 16,
        labelPadding: 10,
        interactivity: true,
        colors: [
          '#8b5cf6',
          '#3b82f6',
          '#11845b',
          '#d5691b',
          '#dc2b2b',
          '#8fc3ff',
          '#fdb52a',
          '#aeb9e1',
        ],
      },
      link: {
        colorMode: 'gradient' as const,
        fillOpacity: 0.75,
        colors: ['#8b5cf6', '#3b82f6', '#11845b', '#d5691b'],
      },
    },
  };

  return (
    <>
      <Card sx={{ pb: 2, mb: 2, position: 'relative' }}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Budget Flow
            </Typography>
            <ButtonIcon onClick={handleOpenMenu}>
              <MoreHorizIcon sx={{ fontSize: '1.6rem' }} />
            </ButtonIcon>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Typography fontSize="2.8rem" fontWeight={700} lineHeight={1}>
              {savingsRate}%
            </Typography>
            <TrendingChip value={+savingsRate > 25 ? 12 : +savingsRate > 15 ? 4 : -3} />
          </Box>
        </Box>

        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/analytics">
            Analytics
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/budgets">
            Edit Budget
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/reports">
            Reports
          </MenuItem>
        </Menu>

        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              maxWidth: '50%',
              flexWrap: 'wrap',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: 'var(--accent--primary-1)',
                  borderRadius: '50%',
                }}
              />
              <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
                Income
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: 'var(---secondary--color-3)',
                  borderRadius: '50%',
                }}
              />
              <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
                Expenses
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: 'var(--system--green-400)',
                  borderRadius: '50%',
                }}
              />
              <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
                Savings
              </Typography>
            </Box>
          </Box>
          <Dropdown
            value={date}
            onChange={(e) => setDate(e.target.value)}
            input={<OutlinedInput startAdornment={<CalendarTodayIcon sx={{ fontSize: 18 }} />} />}
            size="small"
            IconComponent={KeyboardArrowDownIcon}
            sx={{ width: '100%' }}
          >
            {['W', 'M', 'Q', '6M', 'Y'].map((tf) => (
              <MenuItem key={tf} value={tf}>
                {tf === 'W'
                  ? 'This Week'
                  : tf === 'M'
                    ? 'This Month'
                    : tf === 'Q'
                      ? 'This Quarter'
                      : tf === '6M'
                        ? 'Past 6 Months'
                        : 'This Year'}
              </MenuItem>
            ))}
          </Dropdown>
        </Box>

        <Box sx={{ px: 1, overflow: 'hidden' }}>
          <Chart
            chartType="Sankey"
            width="100%"
            height="680px"
            data={chartData}
            options={options}
            chartEvents={[
              {
                eventName: 'ready',
                callback: () => {
                  setTimeout(() => {
                    document.querySelectorAll('text').forEach((t) => {
                      t.setAttribute('fill', 'var(--text-color-primary)');
                    });
                  }, 50);
                },
              },
            ]}
          />
        </Box>

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
        title="Budget Flow"
        shortDescription="See exactly where your money comes from and where it goes — from top to bottom."
        formula="Savings Rate = (Income − Expenses) ÷ Income × 100"
        longDescription="This vertical Sankey diagram is optimized for mobile. Income sources appear at the top, flowing downward into expense categories and savings. The thicker the stream, the more money is allocated. Perfect for quickly understanding your financial flow on the go."
        youtubeUrl="https://www.youtube.com/embed/9q3cWx5e5gU"
      />
    </>
  );
};

export default BudgetChart;
