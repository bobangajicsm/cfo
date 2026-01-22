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

const CashFlowChart = ({
  date,
  periodData,
  currentCashFlow,
  scaleFactor,
  growthRate, // Ignore if passed; recompute for consistency
}: {
  date: string;
  periodData: TCashFlow[];
  currentCashFlow: number;
  scaleFactor: number;
  growthRate?: number;
}) => {
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

  // FIXED: Scale earnings/expenses/cashFlow consistently in chart data (for bar visuals)
  let currentData: (TCashFlow & { cashFlow: number; earnings: number; expenses: number })[] =
    periodData.map((d) => {
      const scaledEarnings = d.earnings * scaleFactor;
      const scaledExpenses = d.expenses * scaleFactor;
      return {
        ...d,
        earnings: scaledEarnings,
        expenses: scaledExpenses,
        cashFlow: scaledEarnings - scaledExpenses,
      };
    });

  // UPDATED: Compute previous period for total cash flow $ change (aligned with BudgetChart; now with prior year for 'Y')
  let prevData: (TCashFlow & { cashFlow: number; earnings: number; expenses: number })[] = [];
  const currentYear = 2025; // TODO: Pass as prop if dynamic
  if (date === 'M' || date === 'W') {
    // Match Budget: Prior month (e.g., Nov for Dec)
    prevData = [data2025[10]].map((d) => ({
      // Nov
      ...d,
      earnings: d.earnings * scaleFactor,
      expenses: d.expenses * scaleFactor,
      cashFlow: (d.earnings - d.expenses) * scaleFactor,
    }));
  } else if (date === 'Q') {
    // Match Budget: Prior Q (Jul-Sep, indices 6-8)
    prevData = data2025.slice(6, 9).map((d) => ({
      ...d,
      earnings: d.earnings * scaleFactor,
      expenses: d.expenses * scaleFactor,
      cashFlow: (d.earnings - d.expenses) * scaleFactor,
    }));
  } else if (date === '6M') {
    // Match Budget: Prior 6M (Jan-Jun, indices 0-5)
    prevData = data2025.slice(0, 6).map((d) => ({
      ...d,
      earnings: d.earnings * scaleFactor,
      expenses: d.expenses * scaleFactor,
      cashFlow: (d.earnings - d.expenses) * scaleFactor,
    }));
  } else if (date === 'Y') {
    // UPDATED: Prior full year (2024 for 2025)
    prevData = yearData['2024'].map((d) => ({
      ...d,
      earnings: d.earnings * scaleFactor,
      expenses: d.expenses * scaleFactor,
      cashFlow: (d.earnings - d.expenses) * scaleFactor,
    }));
  } else {
    // Fallback for multi-year/other: Prior year slice (adjust as needed)
    const getPeriodMonths = (timeframe: string): number => {
      switch (timeframe) {
        case 'W':
          return 0.25;
        case 'M':
          return 1;
        case 'Q':
          return 3;
        case '6M':
          return 6;
        case 'Y':
        case '2Y':
        case '5Y':
          return 12 * (timeframe === '2Y' ? 2 : timeframe === '5Y' ? 5 : 1);
        default:
          return 12;
      }
    };
    const monthsNeeded = getPeriodMonths(date);
    const fullMonthsCount = Math.floor(monthsNeeded);
    const numMonths = Math.min(fullMonthsCount || 1, 12);
    const prevYearData = yearData['2024'] || [];
    prevData = prevYearData.slice(-numMonths).map((d) => ({
      ...d,
      earnings: d.earnings * scaleFactor,
      expenses: d.expenses * scaleFactor,
      cashFlow: (d.earnings - d.expenses) * scaleFactor,
    }));
  }

  const netPrevious = prevData.reduce((acc, { cashFlow }) => acc + cashFlow, 0);

  // UPDATED: Compute as % change in TOTAL CASH FLOW $ (not savings rate); round to 1 decimal
  const finalGrowthRate =
    netPrevious !== 0
      ? Math.round(((currentCashFlow - netPrevious) / netPrevious) * 100 * 10) / 10
      : 0;

  return (
    <>
      <Card
        sx={{
          pb: 1,
          mb: 2,
          position: 'relative', // For absolute info button
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
              ${currentCashFlow.toLocaleString('en-US')}
            </Typography>
            <TrendingChip value={parseFloat(finalGrowthRate.toFixed(1))} />
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
                backgroundColor: 'white',
                borderRadius: '100%',
              }}
            />
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Cash Flow
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
                // FIXED: No extra scaling; data already scaled
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
