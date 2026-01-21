import React, { useState } from 'react';
import { Chart } from 'react-google-charts';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Menu, MenuItem, OutlinedInput, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';

import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
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

const BudgetChart = ({ date }: { date: string }) => {
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

  const expenseCategories = ['Fixed', 'Variable', 'Occasional', 'Unplanned'];
  const expenseProps = [0.4, 0.3, 0.2, 0.1];

  const subExpenses = {
    Fixed: [
      { name: 'Mortgage', prop: 0.5 },
      { name: 'Insurance', prop: 0.2 },
      { name: 'Utilities', prop: 0.3 },
    ],
    Variable: [
      { name: 'Groceries', prop: 0.4 },
      { name: 'Dining', prop: 0.2 },
      { name: 'Transportation', prop: 0.4 },
    ],
    Occasional: [
      { name: 'Travel', prop: 0.5 },
      { name: 'Entertainment', prop: 0.3 },
      { name: 'Gifts', prop: 0.2 },
    ],
    Unplanned: [
      { name: 'Repairs', prop: 0.4 },
      { name: 'Medical', prop: 0.4 },
      { name: 'Auto Repairs', prop: 0.2 },
    ],
  };

  const incomeNode = `Income\n$${totalEarnings.toLocaleString()}\n(100%)`;
  const savingsNode = `Cash Flow\n$${totalNet.toLocaleString()}\n(${savingsRate}%)`;

  const categoryNodes: string[] = [];
  const categoryAmounts: number[] = [];
  const subNodeData: { label: string; weight: number }[][] = [];

  expenseCategories.forEach((cat, i) => {
    const catAmt = totalExpenses * expenseProps[i];
    const catPct = ((catAmt / totalEarnings) * 100).toFixed(1);
    const catLabel = `${cat}\n$${Math.round(catAmt).toLocaleString()}\n(${catPct}%)`;
    categoryNodes.push(catLabel);
    categoryAmounts.push(catAmt);

    const subs: { label: string; weight: number }[] = [];
    subExpenses[cat as keyof typeof subExpenses].forEach((item) => {
      const subAmt = catAmt * item.prop;
      const subPct = ((subAmt / totalEarnings) * 100).toFixed(1);
      const subLabel = `${item.name}\n$${Math.round(subAmt).toLocaleString()}\n(${subPct}%)`;
      subs.push({ label: subLabel, weight: subAmt });
    });
    subNodeData.push(subs);
  });

  const sankeyData: [string, string, number][] = [];

  sankeyData.push([incomeNode, savingsNode, Math.round(totalNet)]);

  expenseCategories.forEach((cat, i) => {
    sankeyData.push([incomeNode, categoryNodes[i], Math.round(categoryAmounts[i])]);
    subNodeData[i].forEach((sub) => {
      sankeyData.push([categoryNodes[i], sub.label, Math.round(sub.weight)]);
    });
  });

  const tooltipHeader = { role: 'tooltip', p: { html: true } };
  const chartData = [
    ['From', 'To', 'Weight', tooltipHeader],
    ...sankeyData.map(([from, to, weight]) => {
      const fromName = from.split('\n')[0];
      const toName = to.split('\n')[0];
      const flow = Math.round(weight);
      const formattedValue = `$${flow.toLocaleString()}`;
      const html = `
        <div style="background: rgba(var(--bg-color-secondary-alpha), 0.96); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 14px;">
          <div style="color: var(--text-color-secondary); font-size: 0.9rem; margin-bottom: 8px;">${fromName} to ${toName}</div>
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
      orientation: 'horizontal' as const,
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
        colors: ['#8b5cf6', '#10b981', '#3b82f6', '#ef4444', '#f59e0b'],
      },
      link: {
        colorMode: 'source',
        fillOpacity: 0.75,
        colors: ['#8b5cf6', '#10b981', '#3b82f6', '#ef4444', '#f59e0b'],
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
              Cash Flow
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

        <Box mb={1} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
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
          </Box>
        </Box>
        <Stack gap={1} pb={1}>
          <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
            Expenses
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: '#10b981',
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
                  bgcolor: '#3b82f6',
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
                  bgcolor: '#ef4444',
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
                  bgcolor: '#f59e0b',
                  borderRadius: '50%',
                }}
              />
              <Typography fontSize="1rem" color="var(--text-color-secondary)">
                Unplanned
              </Typography>
            </Box>
          </Box>
        </Stack>

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
