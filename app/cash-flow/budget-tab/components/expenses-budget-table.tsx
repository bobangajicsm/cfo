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
import Card from '~/components/card';
import Dropdown from '~/components/dropdown';
import dayjs from 'dayjs';

import {
  data2020,
  data2021,
  data2022,
  data2023,
  data2024,
  data2025,
} from '~/cash-flow/budget-tab/budget-tab';

interface ExpenseItem {
  category: string;
  budget: number;
  actual: number;
  date: string;
}

const rawData: ExpenseItem[] = [
  { category: 'Primary-home mortgage (P&I)', budget: 100000, actual: 96000, date: '2026-01-01' },
  { category: 'Groceries / household', budget: 48000, actual: 34000, date: '2026-01-15' },
  { category: 'Fun money (couple)', budget: 42000, actual: 38000, date: '2026-01-15' },
  { category: 'Health-insurance premium', budget: 30000, actual: 21600, date: '2026-01-01' },
  { category: 'Other Fixed', budget: 55000, actual: 37200, date: '2026-01-01' },
  { category: 'Other Variable', budget: 83000, actual: 58200, date: '2026-01-15' },
  { category: 'Travel', budget: 25000, actual: 24000, date: '2026-01-15' },
  { category: 'Entertainment', budget: 23000, actual: 21000, date: '2026-01-15' },
  { category: 'Gifts', budget: 22000, actual: 20000, date: '2026-01-15' },
  { category: 'Emergency Repairs', budget: 4000, actual: 3000, date: '2026-01-01' },
  { category: 'Unexpected Medical', budget: 3000, actual: 2000, date: '2026-01-01' },
  { category: 'Auto Repairs', budget: 3000, actual: 2500, date: '2026-01-01' },
];

const columnOptions = ['Budget', 'Actual', 'Difference'] as const;
type ColumnKey = (typeof columnOptions)[number];

const fixedCategories = [
  'Primary-home mortgage (P&I)',
  'Health-insurance premium',
  'Other Fixed',
] as const;

const variableCategories = [
  'Groceries / household',
  'Fun money (couple)',
  'Other Variable',
] as const;

const occasionalCategories = ['Travel', 'Entertainment', 'Gifts'] as const;

const unplannedCategories = ['Emergency Repairs', 'Unexpected Medical', 'Auto Repairs'] as const;

interface Props {
  timeframe?: string;
  userBudget?: number;
}

const getPeriodInMonths = (timeframe: string) => {
  const periodMap: Record<string, number> = {
    W: 0.25,
    M: 1,
    Q: 3,
    '6M': 6,
    Y: 12,
    '2Y': 24,
    '5Y': 60,
  };
  return periodMap[timeframe] || 12;
};

const ExpensesBudgetTable = ({ timeframe = 'Y', userBudget }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([...columnOptions]);
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const fullMonthlyData = useMemo(
    () => [...data2020, ...data2021, ...data2022, ...data2023, ...data2024, ...data2025],
    []
  );

  const getFilteredMonthlyData = (timeframe: string) => {
    const numMonthsMap: Record<string, number> = {
      W: 1,
      M: 1,
      Q: 3,
      '6M': 6,
      Y: 12,
      '2Y': 24,
      '5Y': 60,
    };
    const numMonths = numMonthsMap[timeframe] || 12;
    const recentData = fullMonthlyData.slice(-numMonths);
    const sum = recentData.reduce((acc, item) => acc + item.expenses, 0);
    const periodInMonths = getPeriodInMonths(timeframe);
    const prorate = Math.min(periodInMonths / numMonths, 1);
    return Math.round(sum * prorate);
  };

  const dateFilteredData = useMemo(() => rawData, []);

  const searchFilteredData = useMemo(
    () =>
      dateFilteredData.filter((row) =>
        row.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [dateFilteredData, searchTerm]
  );

  const effectiveTotalActual = useMemo(() => getFilteredMonthlyData(timeframe), [timeframe]);

  const hardcodedActualSum = useMemo(
    () => dateFilteredData.reduce((acc, row) => acc + row.actual, 0),
    [dateFilteredData]
  );

  const actualScale = hardcodedActualSum > 0 ? effectiveTotalActual / hardcodedActualSum : 0;

  const hardcodedBudgetSum = useMemo(
    () => dateFilteredData.reduce((acc, row) => acc + row.budget, 0),
    [dateFilteredData]
  );

  const budgetScale = userBudget ? userBudget / hardcodedBudgetSum : actualScale;

  const totalBudget = userBudget ?? Math.round(hardcodedBudgetSum * actualScale);

  const totalRemaining = totalBudget - effectiveTotalActual;

  const groups = useMemo(
    () => [
      {
        category: 'Fixed',
        items: searchFilteredData.filter((item) =>
          fixedCategories.includes(item.category as (typeof fixedCategories)[number])
        ),
      },
      {
        category: 'Variable',
        items: searchFilteredData.filter((item) =>
          variableCategories.includes(item.category as (typeof variableCategories)[number])
        ),
      },
      {
        category: 'Occasional',
        items: searchFilteredData.filter((item) =>
          occasionalCategories.includes(item.category as (typeof occasionalCategories)[number])
        ),
      },
      {
        category: 'Unplanned',
        items: searchFilteredData.filter((item) =>
          unplannedCategories.includes(item.category as (typeof unplannedCategories)[number])
        ),
      },
    ],
    [searchFilteredData]
  );

  const format = (v: number) => `$${v.toLocaleString('en-US')}`;

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
    return remaining >= 0 ? 'var(--system--green-300)' : 'var(--system--300)';
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
        <Typography fontSize="1.4rem">Expenses</Typography>

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
              {visibleColumns.includes('Difference') && (
                <TableCell align="right" sx={{ borderTop: '1px solid var(--neutral--600)' }}>
                  Difference
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
              const groupRemaining = groupBudget - groupActual;
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
                    {visibleColumns.includes('Difference') && (
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
                                const remaining = rowBudget - rowActual;

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
                                    {visibleColumns.includes('Difference') && (
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
                  totalRemaining >= 0
                    ? 'rgba(var(--system--green-300-alpha), 0.1)'
                    : 'rgba(var(--system--300-alpha), 0.1)',
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  color: 'var(--system--300)',
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
                    color: 'var(--system--300)',
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
                    color: 'var(--system--300)',
                  }}
                >
                  {format(effectiveTotalActual)}
                </TableCell>
              )}
              {visibleColumns.includes('Difference') && (
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

export default ExpensesBudgetTable;
