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
}: {
  date: string;
  periodData: TCashFlow[];
  currentCashFlow: number;
  scaleFactor: number;
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

  // Aggregate to quarterly for 5Y view
  let chartData = currentData;
  if (date === '5Y') {
    chartData = [];
    const monthToNum: Record<string, number> = {
      January: 1,
      Jan: 1,
      February: 2,
      Feb: 2,
      March: 3,
      Mar: 3,
      April: 4,
      Apr: 4,
      May: 5,
      June: 6,
      July: 7,
      Jul: 7,
      August: 8,
      Aug: 8,
      September: 9,
      Sep: 9,
      October: 10,
      Oct: 10,
      November: 11,
      Nov: 11,
      December: 12,
      Dec: 12,
    };
    for (let i = 0; i < currentData.length; i += 3) {
      const slice = currentData.slice(i, i + 3);
      if (slice.length === 0) break;
      const earnings = slice.reduce((s, d) => s + d.earnings, 0);
      const expenses = slice.reduce((s, d) => s + d.expenses, 0);
      const cashFlow = earnings - expenses;
      // Get quarter label from first month
      const firstMonthStr = slice[0].month;
      const parts = firstMonthStr.trim().split(/\s+/);
      const monthName = parts[0];
      const yearStr = parts[parts.length - 1];
      const monthNum = monthToNum[monthName];
      let quarterLabel: string;
      if (monthNum) {
        const quarter = Math.ceil(monthNum / 3);
        quarterLabel = `Q${quarter} ${yearStr}`;
      } else {
        // Fallback to first month if parsing fails
        quarterLabel = firstMonthStr;
      }
      chartData.push({
        ...slice[0], // Preserve other fields (spread first to avoid duplicate key warnings)
        month: quarterLabel,
        earnings,
        expenses,
        cashFlow,
      });
    }
  }

  // UPDATED: Compute previous period total cash flow for % change (now handles multi-year properly)
  let netPrevious = 0;
  const currentYear = 2025; // TODO: Pass as prop if dynamic
  if (date === 'M' || date === 'W') {
    // Match Budget: Prior month (e.g., Nov for Dec)
    netPrevious = (data2025[10].earnings - data2025[10].expenses) * scaleFactor;
  } else if (date === 'Q') {
    // Match Budget: Prior Q (Jul-Sep, indices 6-8)
    netPrevious =
      data2025.slice(6, 9).reduce((sum, d) => sum + (d.earnings - d.expenses), 0) * scaleFactor;
  } else if (date === '6M') {
    // Match Budget: Prior 6M (Jan-Jun, indices 0-5)
    netPrevious =
      data2025.slice(0, 6).reduce((sum, d) => sum + (d.earnings - d.expenses), 0) * scaleFactor;
  } else if (date === 'Y') {
    // Prior full year (2024 for 2025)
    netPrevious =
      yearData['2024'].reduce((sum, d) => sum + (d.earnings - d.expenses), 0) * scaleFactor;
  } else {
    // Multi-year: Prior equivalent period (e.g., for 5Y: sum 2020-2024)
    const nyears = date === '2Y' ? 2 : date === '5Y' ? 5 : 1;
    let prevSum = 0;
    for (let y = currentYear - nyears; y < currentYear; y++) {
      const yStr = y.toString();
      const yData = yearData[yStr] || [];
      prevSum += yData.reduce((sum, d) => sum + (d.earnings - d.expenses), 0);
    }
    netPrevious = prevSum * scaleFactor;
  }

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
              Cash Flow (Combined)
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
          data={chartData}
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
