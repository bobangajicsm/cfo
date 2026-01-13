import React, { useState } from 'react';

import { Link } from 'react-router';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import {
  data2020,
  data2021,
  data2022,
  data2023,
  data2024,
  data2025,
  type TCashFlow,
} from '~/cash-flow/cash-flow-tab/cash-flow-tab';

const CashFlowChart = ({ date }: { date: string }) => {
  const yearData: Record<string, typeof data2025> = {
    '2020': data2020,
    '2021': data2021,
    '2022': data2022,
    '2023': data2023,
    '2024': data2024,
    '2025': data2025,
  };
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

  let currentData: (TCashFlow & { cashFlow: number })[];
  let prevData: (TCashFlow & { cashFlow: number })[] | null = null;
  let totalMonths = 12;
  let hasPrevious = true;

  const currentYearData = data2025;
  const previousYearData = data2024;

  switch (date) {
    case 'W':
    case 'M':
      totalMonths = 1;
      currentData = currentYearData
        .slice(-1)
        .map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      prevData = previousYearData
        .slice(-1)
        .map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      break;
    case 'Q':
      totalMonths = 3;
      currentData = currentYearData
        .slice(-3)
        .map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      prevData = previousYearData
        .slice(-3)
        .map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      break;
    case '6M':
      totalMonths = 6;
      currentData = currentYearData
        .slice(-6)
        .map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      prevData = previousYearData
        .slice(-6)
        .map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      break;
    case 'Y':
      totalMonths = 12;
      currentData = currentYearData.map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      prevData = previousYearData.map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
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
            cashFlow: sumEarnings - sumExpenses,
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
          prevData?.push({
            month: `${quarters[q]} ${year}`,
            earnings: sumEarnings,
            expenses: sumExpenses,
            cashFlow: sumEarnings - sumExpenses,
          });
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
          cashFlow: sumEarnings - sumExpenses,
        });
      });
      totalMonths = 60;
      hasPrevious = false;
      break;
    default:
      totalMonths = 12;
      currentData = currentYearData.map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
      prevData = previousYearData.map((d) => ({ ...d, cashFlow: d.earnings - d.expenses }));
  }

  const netCurrent = currentData.reduce((acc, { cashFlow }) => acc + cashFlow, 0);
  const avgNet = Math.round(netCurrent / totalMonths).toLocaleString('en-US');

  const netPrevious = hasPrevious
    ? prevData?.reduce((acc, { cashFlow }) => acc + cashFlow, 0) || 0
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
              Cash Flow
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
              Income
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
            <Box
              sx={{
                width: '0.8rem',
                height: '0.8rem',
                backgroundColor: 'white',
                borderRadius: '100%',
              }}
            />
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Cash Flow
            </Typography>
          </Box>
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
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const earningsPayload = payload.find((entry) => entry.name === 'earnings');
                const expensesPayload = payload.find((entry) => entry.name === 'expenses');
                const cashFlowPayload = payload.find((entry) => entry.name === 'cashFlow');
                const earnings = earningsPayload?.value || 0;
                const expenses = expensesPayload?.value || 0;
                const cashFlow = cashFlowPayload?.value ?? earnings - expenses;

                return (
                  <div
                    style={{
                      background: 'rgba(var(--bg-color-secondary-alpha), 0.96)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 12,
                      padding: '10px 14px',
                    }}
                  >
                    <p
                      style={{
                        color: 'var(--text-color-secondary)',
                        fontSize: '0.9rem',
                        marginBottom: 8,
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ padding: '4px 0', color: 'var(--secondary--color-3)' }}>
                      Income: ${Math.abs(earnings).toLocaleString()}
                    </p>
                    <p style={{ padding: '4px 0', color: 'var(--accent--primary-1)' }}>
                      Expenses: ${Math.abs(expenses).toLocaleString()}
                    </p>
                    <p style={{ padding: '4px 0' }}>Cash Flow: ${cashFlow.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar
            dataKey="earnings"
            name="earnings"
            fill="var(--secondary--color-3)"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
          <Bar
            dataKey="expenses"
            name="expenses"
            fill="var(--accent--primary-1)"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
          <Line
            type="monotone"
            dataKey="cashFlow"
            name="cashFlow"
            stroke="white"
            strokeWidth={2}
            dot={false}
            activeDot={false}
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
        title="Cash Flow Overview"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Sum all income types (active + passive + portfolio) for total inflows, then subtract
                categorized expenses (fixed + variable + occasional + unplanned) to derive net cash
                flow. This personal finance approach differs from business cash flow statements,
                which segment into operating, investing, and financing activities.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Cash Flow Formula</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Cash Flow = Total Income (Active + Passive + Portfolio) - Total Expenses (Fixed +
                Variable + Occasional + Unplanned)
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Income Types</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Active income stems from direct labor or services, such as wages, salaries, or
                freelance earnings requiring ongoing effort. Passive income generates with little
                daily involvement, like rental payments or royalties from prior work. Portfolio
                income arises from investments, including dividends, interest, or capital gains from
                stocks and bonds.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Expense Types</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Fixed expenses stay constant regardless of activity, such as rent or insurance
                premiums. Variable expenses change with usage, like groceries or fuel costs.
                Occasional expenses arise periodically, such as annual subscriptions; unplanned ones
                are unforeseen, like emergency repairs.
              </Typography>
            </Box>
          </Stack>
        }
        youtubeUrl="https://www.youtube.com/embed/5yVf4yPg0k4?si=9soD-yivIV42YjD9"
      />
    </>
  );
};

export default CashFlowChart;
