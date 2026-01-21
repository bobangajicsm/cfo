import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  OutlinedInput,
  Checkbox,
  Chip,
  type SelectChangeEvent,
  Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import Dropdown from '~/components/dropdown';
import dayjs from 'dayjs';

import { type TCashFlow } from '~/cash-flow/cash-flow-tab/cash-flow-tab';

interface IncomeItem {
  category: string;
  budget: number;
  actual: number;
  date: string;
}

const rawData: IncomeItem[] = [
  { category: 'Salaries (Parents)', budget: 74000, actual: 740, date: '2026-01-15' },
  { category: 'Online Store Profit', budget: 6250, actual: 63, date: '2026-01-15' },
  { category: 'Rental Income', budget: 583, actual: 6, date: '2026-01-15' },
  { category: 'Dividends', budget: 750, actual: 8, date: '2025-10-15' },
  { category: 'Bonuses', budget: 1458, actual: 15, date: '2025-12-15' },
  { category: 'Tax Credits/Refunds', budget: 50, actual: 1, date: '2025-04-15' },
];

const monthlyEarnings = [
  { month: 'Jan', earnings: 110600 },
  { month: 'Feb', earnings: 137600 },
  { month: 'Mar', earnings: 103600 },
  { month: 'Apr', earnings: 113100 },
  { month: 'May', earnings: 105600 },
  { month: 'Jun', earnings: 106600 },
  { month: 'Jul', earnings: 117100 },
  { month: 'Aug', earnings: 108600 },
  { month: 'Sep', earnings: 109600 },
  { month: 'Oct', earnings: 119600 },
  { month: 'Nov', earnings: 111600 },
  { month: 'Dec', earnings: 113600 },
];

const columnOptions = ['Budget', 'Actual', 'Remaining'] as const;
type ColumnKey = (typeof columnOptions)[number];

const activeCategories = ['Salaries (Parents)', 'Online Store Profit', 'Bonuses'] as const;
type ActiveCategory = (typeof activeCategories)[number];

const portfolioCategories: (typeof rawData)[0]['category'][] = [];
type PortfolioCategory = (typeof portfolioCategories)[number];

interface Props {
  timeframe?: string;
}

const getCutoffDate = (timeframe: string) => {
  let cutoff;
  switch (timeframe) {
    case 'W':
      cutoff = dayjs().subtract(1, 'week').startOf('week');
      break;
    case 'M':
      cutoff = dayjs().startOf('month').subtract(1, 'month');
      break;
    case 'Q':
      cutoff = dayjs().startOf('month').subtract(3, 'month');
      break;
    case '6M':
      cutoff = dayjs().startOf('month').subtract(6, 'month');
      break;
    case 'Y':
      cutoff = dayjs().startOf('month').subtract(12, 'month');
      break;
    case '2Y':
      cutoff = dayjs().startOf('month').subtract(24, 'month');
      break;
    case '5Y':
      cutoff = dayjs().startOf('month').subtract(60, 'month');
      break;
    default:
      cutoff = dayjs().startOf('month').subtract(12, 'month');
  }
  return cutoff;
};

const getPeriodInMonths = (timeframe: string) => {
  const periodMap: Record<string, number> = {
    W: 7 / 30.4, // approx 1 week
    M: 1,
    Q: 3,
    '6M': 6,
    Y: 12,
    '2Y': 24,
    '5Y': 60,
  };
  return periodMap[timeframe] || 12;
};

const getFilteredMonthlyData = (timeframe: string) => {
  const numMonthsMap: Record<string, number> = {
    W: 1,
    M: 1,
    Q: 3,
    '6M': 6,
    Y: 12,
    '2Y': 12, // cap at available data
    '5Y': 12, // cap at available data
  };
  const numMonths = numMonthsMap[timeframe] || 12;
  const recentData = monthlyEarnings.slice(-numMonths);
  const sum = recentData.reduce((acc, item) => acc + item.earnings, 0);
  const periodInMonths = getPeriodInMonths(timeframe);
  return Math.round(sum * (periodInMonths / numMonths)); // prorate if needed
};

const IncomeBudgetTable = ({ timeframe = 'Y' }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([...columnOptions]);
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const cutoffDate = useMemo(() => getCutoffDate(timeframe), [timeframe]);

  const dateFilteredData = useMemo(
    () =>
      rawData.filter((row) => {
        const rowDate = dayjs(row.date);
        return rowDate.isAfter(cutoffDate) || rowDate.isSame(cutoffDate, 'day');
      }),
    [cutoffDate]
  );

  const searchFilteredData = useMemo(
    () =>
      dateFilteredData.filter((row) =>
        row.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [dateFilteredData, searchTerm]
  );

  const effectiveTotalActual = useMemo(() => getFilteredMonthlyData(timeframe), [timeframe]);

  const periodInMonths = getPeriodInMonths(timeframe);
  const budgetScale = periodInMonths / 12;

  const hardcodedBudgetSum = useMemo(
    () => dateFilteredData.reduce((acc, row) => acc + row.budget, 0),
    [dateFilteredData]
  );

  const totalBudget = Math.round(hardcodedBudgetSum * budgetScale);

  const hardcodedActualSum = useMemo(
    () => dateFilteredData.reduce((acc, row) => acc + row.actual, 0),
    [dateFilteredData]
  );

  const actualScale = hardcodedActualSum > 0 ? effectiveTotalActual / hardcodedActualSum : 0;

  const totalRemaining = Math.max(0, totalBudget - effectiveTotalActual);

  const groups = useMemo(
    () => [
      {
        category: 'Active',
        items: searchFilteredData.filter((item) =>
          activeCategories.includes(item.category as ActiveCategory)
        ),
      },
      {
        category: 'Passive',
        items: searchFilteredData.filter(
          (item) =>
            !activeCategories.includes(item.category as ActiveCategory) &&
            !portfolioCategories.includes(item.category as PortfolioCategory)
        ),
      },
      {
        category: 'Portfolio',
        items: searchFilteredData.filter((item) =>
          portfolioCategories.includes(item.category as PortfolioCategory)
        ),
      },
    ],
    [searchFilteredData]
  );

  const format = (v: number) => (v === 0 ? '-' : `$${v.toLocaleString('en-US')}`);

  const handleColumnChange = (event: SelectChangeEvent<string | string[]>) => {
    const value = event.target.value;
    setVisibleColumns(
      typeof value === 'string' ? (value.split(',') as ColumnKey[]) : (value as ColumnKey[])
    );
  };

  const handleToggle = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getRemainingColor = (remaining: number) => {
    return remaining <= 0 ? 'var(--system--green-700)' : 'var(--text-color-primary)';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Typography fontSize="1.4rem">Income</Typography>

        <Box display="flex" gap={1} alignItems="center" flex={1} minWidth={300}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ maxWidth: 300 }}
          />

          <Dropdown
            multiple
            size="small"
            value={visibleColumns as unknown as string}
            onChange={handleColumnChange}
            input={<OutlinedInput />}
            IconComponent={KeyboardArrowDownIcon}
            renderValue={(selected) => {
              const sel = selected;
              return (
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <Chip
                    sx={{
                      height: '1.6rem',
                      backgroundColor: 'rgba(var(--accent--primary-1-alpha), 0.3)',
                    }}
                    label={sel[0]}
                    size="small"
                  />
                  {sel.length > 1 && `+${sel.length - 1}`}
                </Box>
              );
            }}
          >
            {columnOptions.map((col) => (
              <MenuItem key={col} value={col}>
                <Checkbox checked={visibleColumns.includes(col)} size="small" />
                {col}
              </MenuItem>
            ))}
          </Dropdown>
        </Box>
      </Box>

      <TableContainer
        sx={{
          backgroundColor: 'var(--bg-color-secondary)',
          mt: 1,
          '& .MuiTableCell-root': {
            fontSize: '1.2rem',
            borderColor: 'var(--neutral--600)',
            whiteSpace: 'nowrap',
            color: 'var(--text-color-primary)',
            p: 1,
          },
          '& .MuiTableCell-root:first-of-type': {
            minWidth: '70px',
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderTop: '1px solid var(--neutral--600)' }}>Category</TableCell>
              {visibleColumns.includes('Budget') && (
                <TableCell align="right" sx={{ borderTop: '1px solid var(--neutral--600)' }}>
                  Budget
                </TableCell>
              )}
              {visibleColumns.includes('Actual') && (
                <TableCell align="right" sx={{ borderTop: '1px solid var(--neutral--600)' }}>
                  Actual
                </TableCell>
              )}
              {visibleColumns.includes('Remaining') && (
                <TableCell align="right" sx={{ borderTop: '1px solid var(--neutral--600)' }}>
                  Remaining
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {groups.map((group) => {
              const groupBudgetRaw = group.items.reduce((acc, item) => acc + item.budget, 0);
              const groupBudget = Math.round(groupBudgetRaw * budgetScale);
              const groupActualRaw = group.items.reduce((acc, item) => acc + item.actual, 0);
              const groupActual = Math.round(groupActualRaw * actualScale);
              const groupRemaining = Math.max(0, groupBudget - groupActual);
              const isOpen = openCategories[group.category];

              return (
                <React.Fragment key={group.category}>
                  <TableRow sx={{ 'td, th': { border: 0 } }}>
                    <TableCell
                      onClick={() => handleToggle(group.category)}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        p: 1,
                      }}
                    >
                      <KeyboardArrowDownIcon
                        sx={{
                          mr: 1,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s',
                        }}
                      />
                      {group.category}
                      {group.items.length === 0 && (
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          (No matches)
                        </Typography>
                      )}
                    </TableCell>
                    {visibleColumns.includes('Budget') && (
                      <TableCell align="right" sx={{ fontWeight: 'bold', p: 1 }}>
                        {format(groupBudget)}
                      </TableCell>
                    )}
                    {visibleColumns.includes('Actual') && (
                      <TableCell align="right" sx={{ fontWeight: 'bold', p: 1 }}>
                        {format(groupActual)}
                      </TableCell>
                    )}
                    {visibleColumns.includes('Remaining') && (
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          p: 1,
                          color: getRemainingColor(groupRemaining),
                        }}
                      >
                        {format(groupRemaining)}
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        padding: 0,
                      }}
                      colSpan={1 + visibleColumns.length}
                    >
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 0 }}>
                          <Table size="small" aria-label="child table">
                            <TableBody>
                              {group.items.map((row) => {
                                const rowBudget = Math.round(row.budget * budgetScale);
                                const rowActual = Math.round(row.actual * actualScale);
                                const remaining = Math.max(0, rowBudget - rowActual);

                                return (
                                  <TableRow key={row.category}>
                                    <TableCell
                                      sx={{
                                        borderTop: '1px solid var(--neutral--600)',
                                        p: 1,
                                      }}
                                    >
                                      {row.category}
                                    </TableCell>
                                    {visibleColumns.includes('Budget') && (
                                      <TableCell
                                        align="right"
                                        sx={{
                                          borderTop: '1px solid var(--neutral--600)',
                                          p: 1,
                                        }}
                                      >
                                        {format(rowBudget)}
                                      </TableCell>
                                    )}
                                    {visibleColumns.includes('Actual') && (
                                      <TableCell
                                        align="right"
                                        sx={{
                                          borderTop: '1px solid var(--neutral--600)',
                                          p: 1,
                                        }}
                                      >
                                        {format(rowActual)}
                                      </TableCell>
                                    )}
                                    {visibleColumns.includes('Remaining') && (
                                      <TableCell
                                        align="right"
                                        sx={{
                                          borderTop: '1px solid var(--neutral--600)',
                                          p: 1,
                                          color: getRemainingColor(remaining),
                                        }}
                                      >
                                        {format(remaining)}
                                      </TableCell>
                                    )}
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}

            <TableRow
              sx={{
                backgroundColor:
                  effectiveTotalActual >= totalBudget
                    ? 'rgba(var(--system--green-300-alpha), 0.1)'
                    : 'transparent',
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  color: 'var(--system--green-700)',
                }}
              >
                Total
              </TableCell>
              {visibleColumns.includes('Budget') && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: 'var(--system--green-700)',
                  }}
                >
                  {format(totalBudget)}
                </TableCell>
              )}
              {visibleColumns.includes('Actual') && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: 'var(--system--green-700)',
                  }}
                >
                  {format(effectiveTotalActual)}
                </TableCell>
              )}
              {visibleColumns.includes('Remaining') && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: getRemainingColor(totalRemaining),
                  }}
                >
                  {format(totalRemaining)}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default IncomeBudgetTable;
