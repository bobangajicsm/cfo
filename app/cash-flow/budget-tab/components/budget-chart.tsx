import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';

import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import {
  data2020,
  data2021,
  data2022,
  data2023,
  data2024,
  data2025,
} from '~/cash-flow/budget-tab/budget-tab';

const expenseProps = [154800 / 357500, 130200 / 357500, 65000 / 357500, 7500 / 357500];

const BudgetChart = ({ date }: { date: string }) => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenInfoDialog = () => setIsOpenInfoDialog(true);
  const handleCloseInfoDialog = () => setIsOpenInfoDialog(false);
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setMenuAnchorEl(null);

  let periodData = data2025;
  let scaleFactor = 1;
  switch (date) {
    case 'W':
      scaleFactor = 0.25;
      periodData = [
        {
          month: 'Week',
          earnings: data2025[11].earnings * scaleFactor,
          expenses: data2025[11].expenses * scaleFactor,
        },
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
    case '2Y':
      periodData = [...data2024, ...data2025];
      break;
    case '5Y':
      periodData = [...data2021, ...data2022, ...data2023, ...data2024, ...data2025];
      break;
    default:
      periodData = [data2025[11]];
  }

  const totalEarnings = periodData.reduce((sum, d) => sum + d.earnings, 0);
  const totalExpenses = periodData.reduce((sum, d) => sum + d.expenses, 0);
  const totalNet = totalEarnings - totalExpenses;
  const savingsRate = totalEarnings > 0 ? ((totalNet / totalEarnings) * 100).toFixed(1) : '0';

  let prevPeriodData: typeof periodData = [];
  let prevScaleFactor = scaleFactor;
  switch (date) {
    case 'W':
    case 'M':
      prevPeriodData = [data2025[10]];
      if (date === 'W') {
        prevPeriodData = [
          {
            month: 'Prior Week',
            earnings: data2025[10].earnings * prevScaleFactor,
            expenses: data2025[10].expenses * prevScaleFactor,
          },
        ];
      }
      break;
    case 'Q':
      prevPeriodData = data2025.slice(6, 9); // Prior: Jul-Sep
      break;
    case '6M':
      prevPeriodData = data2025.slice(0, 6); // Prior: Jan-Jun
      break;
    case 'Y':
      // Prior full year (2024 for 2025)
      prevPeriodData = data2024;
      break;
    case '2Y':
      prevPeriodData = [...data2022, ...data2023];
      break;
    case '5Y':
      prevPeriodData = []; // No full prior 5Y data available
      break;
    default:
      prevPeriodData = []; // No prior for full year
      break;
  }

  let prevTotalNet = 0;
  if (prevPeriodData.length > 0) {
    const prevTotalEarnings = prevPeriodData.reduce((sum, d) => sum + d.earnings, 0);
    const prevTotalExpenses = prevPeriodData.reduce((sum, d) => sum + d.expenses, 0);
    prevTotalNet = prevTotalEarnings - prevTotalExpenses;
  }

  // Dynamic trendValue as % change in TOTAL CASH FLOW $ (vs. prior); 0 if no prior
  const trendValue =
    prevTotalNet !== 0 ? Math.round(((totalNet - prevTotalNet) / prevTotalNet) * 100 * 10) / 10 : 0;

  const expenseCategories = ['Fixed', 'Variable', 'Occasional', 'Planned'];

  const incomeCategories = ['Passive', 'Active', 'Portfolio'];
  const incomeProps = [0.3, 0.6, 0.1]; // Placeholder proportions; adjust as needed
  const incomeAmounts = incomeCategories.map((_, i) => totalEarnings * incomeProps[i]);
  const passiveIncome = incomeAmounts[0];

  const categoryAmounts: number[] = [];
  expenseCategories.forEach((cat, i) => {
    const catAmt = totalExpenses * expenseProps[i];
    categoryAmounts.push(catAmt);
  });

  const chartData = [
    {
      category: 'Income',
      Passive: incomeAmounts[0],
      Active: incomeAmounts[1],
      Portfolio: incomeAmounts[2],
      Fixed: 0,
      Variable: 0,
      Occasional: 0,
      Planned: 0,
      passiveIncome,
    },
    {
      category: 'Expenses',
      Passive: 0,
      Active: 0,
      Portfolio: 0,
      Fixed: categoryAmounts[0],
      Variable: categoryAmounts[1],
      Occasional: categoryAmounts[2],
      Planned: categoryAmounts[3],
      passiveIncome,
    },
  ];

  const colors = {
    passive: '#8712ed',
    active: '#06ffb0',
    portfolio: '#b9ec4b',
    fixed: '#2c5392',
    variable: '#2563eb',
    occasional: '#dc2626',
    planned: '#d97706',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const category = dataPoint.category;
      let content = null;
      if (category === 'Income') {
        content = (
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
              {category}
            </p>
            <p style={{ padding: '4px 0', color: colors.passive }}>
              Passive: ${Math.round(dataPoint.Passive).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: colors.active }}>
              Active: ${Math.round(dataPoint.Active).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: colors.portfolio }}>
              Portfolio: ${Math.round(dataPoint.Portfolio).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: 'var(--text-color)', fontWeight: 500 }}>
              Total: ${totalEarnings.toLocaleString()}
            </p>
          </div>
        );
      } else if (category === 'Expenses') {
        content = (
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
              {category}
            </p>
            <p style={{ padding: '4px 0', color: colors.fixed }}>
              Fixed: ${Math.round(dataPoint.Fixed).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: colors.variable }}>
              Variable: ${Math.round(dataPoint.Variable).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: colors.occasional }}>
              Occasional: ${Math.round(dataPoint.Occasional).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: colors.planned }}>
              Planned: ${Math.round(dataPoint.Planned).toLocaleString()}
            </p>
            <p style={{ padding: '4px 0', color: 'var(--text-color)', fontWeight: 500 }}>
              Total: ${totalExpenses.toLocaleString()}
            </p>
          </div>
        );
      }
      if (content) {
        return content;
      }
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value, category } = props;

    if (height < 25 || value == null || value < 5000) return null;

    const formattedValue =
      value >= 10000 ? `$${(value / 1000).toFixed(0)}k` : `$${Math.round(value).toLocaleString()}`;

    const labelText = `${category} ${formattedValue}`;

    const textX = x + width / 2;
    const textY = y + height / 2;

    let fill = '#ffffff';
    // Optional: better readability on bright backgrounds
    if (category === 'Active' || category === 'Portfolio') {
      fill = '#000000';
    }

    return (
      <text
        x={textX}
        y={textY}
        fill={fill}
        fontSize={11}
        fontWeight={500}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {labelText}
      </text>
    );
  };

  const LabeledBar = ({
    dataKey,
    fill,
    ...rest
  }: {
    dataKey: string;
    fill: string;
    [key: string]: any;
  }) => {
    return (
      <Bar
        dataKey={dataKey}
        stackId="stack"
        fill={fill}
        label={<CustomLabel category={dataKey} />} // ← this injects the name!
        {...rest}
      />
    );
  };

  return (
    <>
      <Card sx={{ pb: 2, mb: 2, position: 'relative' }} className="budget-chart">
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Cash Flow (Total)
            </Typography>
            <ButtonIcon onClick={handleOpenMenu}>
              <MoreHorizIcon sx={{ fontSize: '1.6rem' }} />
            </ButtonIcon>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Typography fontSize="2.8rem" fontWeight={700} lineHeight={1}>
              ${totalNet.toLocaleString()}
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

        <Stack gap={2} pb={1} mt={2}>
          <Box>
            <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
              Income
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.passive,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Passive
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.active,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Active
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.portfolio,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Portfolio
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
              Expenses
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.fixed,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Fixed
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.variable,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Variable
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.occasional,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Occasional
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.planned,
                    borderRadius: '50%',
                  }}
                />
                <Typography fontSize="1rem" color="var(--text-color-secondary)">
                  Planned
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box sx={{ height: 500, px: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray=""
                vertical={false}
                stroke="var(--border-color-secondary)"
              />
              <XAxis
                dataKey="category"
                stroke="var(--text-color-secondary)"
                tickLine={false}
                fontSize="1rem"
              />
              <YAxis
                stroke="var(--text-color-secondary)"
                tickLine={false}
                axisLine={false}
                fontSize="1.2rem"
                tickFormatter={(value: number) => `$${Math.round(value).toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <LabeledBar dataKey="Passive" fill={colors.passive} />
              <LabeledBar dataKey="Active" fill={colors.active} />
              <LabeledBar dataKey="Portfolio" fill={colors.portfolio} />

              <LabeledBar dataKey="Fixed" fill={colors.fixed} />
              <LabeledBar dataKey="Variable" fill={colors.variable} />
              <LabeledBar dataKey="Occasional" fill={colors.occasional} />
              <LabeledBar dataKey="Planned" fill={colors.planned} />
              <Line
                type="monotone"
                dataKey="passiveIncome"
                stroke="#fff"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </BarChart>
          </ResponsiveContainer>
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
