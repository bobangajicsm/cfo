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

interface IncomeItem {
  category: string;
  budget: number;
  actual: number;
}

const rawData: IncomeItem[] = [
  { category: 'Salaries (Parents)', budget: 74000, actual: 74000 },
  { category: 'Online Store Profit', budget: 6250, actual: 32000 },
  { category: 'Rental Income', budget: 583, actual: 7000 },
  { category: 'Dividends', budget: 750, actual: 0 },
  { category: 'Bonuses', budget: 1458, actual: 0 },
  { category: 'Tax Credits/Refunds', budget: 50, actual: 600 },
];

const columnOptions = ['Budget', 'Actual', 'Remaining'] as const;
type ColumnKey = (typeof columnOptions)[number];

const activeCategories = ['Salaries (Parents)', 'Online Store Profit', 'Bonuses'] as const;
type ActiveCategory = (typeof activeCategories)[number];

const portfolioCategories: (typeof rawData)[0]['category'][] = [];
type PortfolioCategory = (typeof portfolioCategories)[number];

const IncomeBudgetTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([...columnOptions]);
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const handleColumnChange = (event: SelectChangeEvent<string | string[]>) => {
    const value = event.target.value;
    setVisibleColumns(
      typeof value === 'string' ? (value.split(',') as ColumnKey[]) : (value as ColumnKey[])
    );
  };

  const filteredData = useMemo(() => {
    return rawData.filter((row) => row.category.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const groups = useMemo(
    () => [
      {
        category: 'Active',
        items: filteredData.filter((item) =>
          activeCategories.includes(item.category as ActiveCategory)
        ),
      },
      {
        category: 'Passive',
        items: filteredData.filter(
          (item) =>
            !activeCategories.includes(item.category as ActiveCategory) &&
            !portfolioCategories.includes(item.category as PortfolioCategory)
        ),
      },
      {
        category: 'Portfolio',
        items: filteredData.filter((item) =>
          portfolioCategories.includes(item.category as PortfolioCategory)
        ),
      },
    ],
    [filteredData]
  );

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => {
        acc.budget += row.budget;
        acc.actual += row.actual;
        return acc;
      },
      { budget: 0, actual: 0 }
    );
  }, [filteredData]);

  const totalRemaining = totals.budget - totals.actual;
  const format = (v: number) => (v === 0 ? '-' : `$${v.toLocaleString('en-US')}`);

  const handleToggle = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
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
              const groupBudget = group.items.reduce((acc, item) => acc + item.budget, 0);
              const groupActual = group.items.reduce((acc, item) => acc + item.actual, 0);
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
                    {visibleColumns.includes('Remaining') && (
                      <TableCell align="right" sx={{ fontWeight: 'bold', p: 1 }}>
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
                                const remaining = row.budget - row.actual;

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
                                        {format(row.budget)}
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
                                        {format(row.actual)}
                                      </TableCell>
                                    )}
                                    {visibleColumns.includes('Remaining') && (
                                      <TableCell
                                        align="right"
                                        sx={{
                                          borderTop: '1px solid var(--neutral--600)',
                                          p: 1,
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
                backgroundColor: 'rgba(var(--system--green-300-alpha), 0.1)',
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
                  {format(totals.budget)}
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
                  {format(totals.actual)}
                </TableCell>
              )}
              {visibleColumns.includes('Remaining') && (
                <TableCell align="right">{format(totalRemaining)}</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default IncomeBudgetTable;
