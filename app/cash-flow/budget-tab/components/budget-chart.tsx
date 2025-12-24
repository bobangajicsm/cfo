import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Menu, MenuItem, OutlinedInput, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';

import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import Dropdown from '~/components/dropdown';
import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';

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

const BudgetChart = () => {
  const [date, setDate] = useState('M');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenInfoDialog = () => setIsOpenInfoDialog(true);
  const handleCloseInfoDialog = () => setIsOpenInfoDialog(false);
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setMenuAnchorEl(null);

  let periodData = data2025;
  switch (date) {
    case 'W':
      periodData = [
        { month: 'Week', earnings: data2025[11].earnings / 4, expenses: data2025[11].expenses / 4 },
      ];
      break;
    case 'M':
      periodData = [data2025[11]];
      break;
    case 'Q':
      periodData = data2025.slice(-3);
      break;
    case '6M':
      periodData = data2025.slice(-6);
      break;
    case 'Y':
      periodData = data2025;
      break;
    default:
      periodData = [data2025[11]];
  }

  const totalEarnings = periodData.reduce((sum, d) => sum + d.earnings, 0);
  const totalExpenses = periodData.reduce((sum, d) => sum + d.expenses, 0);
  const totalNet = totalEarnings - totalExpenses;
  const savingsRate = totalEarnings > 0 ? ((totalNet / totalEarnings) * 100).toFixed(1) : '0';

  const majorIncomes = ['Parent-1 Salary', 'Parent-2 Salary', 'Online Store', 'Rentals/Bonuses'];
  const incomeProps = [0.62, 0.12, 0.12, 0.14];

  const majorExpenses = [
    'Mortgage',
    'Groceries',
    'Fun Money',
    'Health Insurance',
    'Other Expenses',
  ];
  const expenseProps = [0.25, 0.08, 0.06, 0.06, 0.55];

  const sankeyData: [string, string, number][] = [];
  const expenseTotalProp = totalExpenses / totalEarnings;
  const savingsProp = 1 - expenseTotalProp;

  majorIncomes.forEach((inc, i) => {
    const incAmount = totalEarnings * incomeProps[i];
    majorExpenses.forEach((exp, j) => {
      const flow = incAmount * expenseProps[j] * expenseTotalProp;
      if (flow > 0) sankeyData.push([inc, exp, Math.round(flow)]);
    });
    const savingsFlow = incAmount * savingsProp;
    if (savingsFlow > 0) sankeyData.push([inc, 'Savings', Math.round(savingsFlow)]);
  });

  const tooltipHeader = { role: 'tooltip', p: { html: true } };
  const chartData = [
    ['From', 'To', 'Weight', tooltipHeader],
    ...sankeyData.map(([from, to, weight]) => {
      const flow = Math.round(weight);
      const formattedValue = `$${flow.toLocaleString()}`;
      const html = `
        <div style="background: rgba(var(--bg-color-secondary-alpha), 0.96); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 14px;">
          <div style="color: var(--text-color-secondary); font-size: 0.9rem; margin-bottom: 8px;">${from} to ${to}</div>
          <div style="padding: 4px 0; color: var(--text-color); font-weight: 500; font-size: 14px;">${formattedValue}</div>
        </div>
      `;
      return [from, to, flow, html];
    }),
  ];

  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      isHtml: true,
    },
    sankey: {
      orientation: 'vertical' as const,
      node: {
        label: {
          fontName: '--var(--font-sans)',
          fontSize: '1.2rem',
          color: 'white',
        },
        nodePadding: 32,
        width: 0,
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

  const trendValue = +savingsRate > 25 ? 12 : +savingsRate > 15 ? 4 : -3;

  return (
    <>
      <Card sx={{ pb: 2, mb: 2, position: 'relative' }} className="budget-chart">
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
            <TrendingChip value={trendValue} />
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
                  bgcolor: 'var(--secondary--color-3)',
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
        title="Budget Overview"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                A budget is a simple plan that compares the money you expect to receive (income)
                with the money you expect to spend (expenses) over a period, usually a month. It is
                powerful because it shows clearly whether you will have a surplus (extra currency)
                or a deficit (shortage of currency), so you can adjust your behavior before problems
                arise.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Budget and Income</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                An income budget is the amount of income you plan or expect to receive in the
                period, such as your salary, side-hustle pay, or benefits. Actual income is what you
                really receive, which may be higher or lower than the income budget once the month
                is over. The remaining income amount (surplus or deficit) is the difference between
                income budget and actual income; a surplus means you earned more than expected,
                while a deficit means you earned less than expected.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Budget and Expenses</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                An expense budget is what you plan or allow yourself to spend across categories such
                as rent, food, transport, and entertainment. Actual expense is what you really spend
                in each category and in total during the period. The remaining expense amount
                (surplus or deficit) is the difference between the expense budget and actual
                expense; a surplus means you spent less than planned, while a deficit means you
                overspent.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Why Creating a Budget Is Powerful?</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Putting income and expense budgets next to actual income and expenses shows, in
                advance and in hindsight, whether your choices keep you within your means. This
                turns vague intentions (“spend less, save more”) into concrete numbers, making it
                easier to cut overspending, increase saving, and avoid or reduce debt.
              </Typography>
            </Box>
          </Stack>
        }
        youtubeUrl="https://www.youtube.com/embed/tWK7IZqQlwo?si=ZCHgP4I7UIYX122r"
      />
    </>
  );
};

export default BudgetChart;
