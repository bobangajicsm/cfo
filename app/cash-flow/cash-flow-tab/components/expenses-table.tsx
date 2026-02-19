import {
  Box,
  MenuItem,
  OutlinedInput,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Checkbox,
  TextField,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import Dropdown from '~/components/dropdown';
import dayjs from 'dayjs';

import { type TCashFlow } from '~/cash-flow/cash-flow-tab/cash-flow-tab';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ButtonIcon from '~/components/button-icon';
import InfoDialog from '~/components/info-dialog';

const data = [
  { source: 'Primary-home mortgage (P&I)', amount: '$576,000', change: 0.0, date: '2026-01-15' },
  { source: 'Groceries / household', amount: '$180,900', change: 10.8, date: '2026-01-15' },
  { source: 'Fun money (couple)', amount: '$137,600', change: 14.4, date: '2026-01-15' },
  { source: 'Health-insurance premium', amount: '$129,600', change: 0.0, date: '2026-01-15' },
  {
    source: 'Rental-duplex mortgage (P&I)',
    amount: '$108,000',
    change: 0.0,
    date: '2026-01-15',
  },
  { source: 'Christmas & gifts', amount: '$91,000', change: 11.1, date: '2025-12-15' },
  { source: 'Kid activities / sports', amount: '$79,110', change: 20.3, date: '2026-01-15' },
  { source: 'Utilities', amount: '$75,270', change: 12.2, date: '2026-01-15' },
  { source: 'Child-care / after-school', amount: '$72,000', change: 0.0, date: '2026-01-15' },
  { source: 'Fuel & routine car maint', amount: '$69,690', change: 7.7, date: '2026-01-15' },
  { source: 'New SUV (cash, Sep)', amount: '$65,000', change: 0, date: '2020-09-15' },
  { source: 'Luxury anniversary vacation', amount: '$54,000', change: 0.0, date: '2025-11-15' },
  { source: 'Around-the-world luxury cruise', amount: '$52,000', change: 0, date: '2025-07-15' },
  { source: 'IVF / fertility treatment', amount: '$37,000', change: 0.0, date: '2022-02-15' },
  { source: 'Master-bath renovation', amount: '$36,000', change: 0.0, date: '2024-10-15' },
  { source: 'Home addition / extra garage', amount: '$35,000', change: 0, date: '2024-09-15' },
  { source: 'Parent-1 3-week unpaid leave', amount: '$33,000', change: 0, date: '2023-05-15' },
  { source: 'Life & umbrella insurance', amount: '$28,800', change: 0.0, date: '2026-01-15' },
  { source: 'Rental major rehab', amount: '$28,000', change: 0, date: '2023-01-15' },
  { source: 'Early-pay 2020 property tax', amount: '$27,000', change: 0, date: '2020-02-15' },
  { source: 'Phones & streaming', amount: '$25,200', change: 0.0, date: '2026-01-15' },
  { source: 'Family vacation (Europe, Jul)', amount: '$25,000', change: 0, date: '2020-07-15' },
  { source: 'Used replacement car (Aug)', amount: '$25,000', change: 0, date: '2021-08-15' },
  { source: 'Medical (appendectomy)', amount: '$24,000', change: 0, date: '2020-11-15' },
  { source: 'Rental turnkey refurb', amount: '$22,000', change: 0, date: '2022-06-15' },
  { source: 'IRS 2019 estimate', amount: '$18,500', change: 0, date: '2020-02-15' },
  { source: 'Roof replacement (Oct)', amount: '$18,000', change: 0, date: '2021-10-15' },
  { source: 'Second IVF cycle', amount: '$18,000', change: 0, date: '2024-04-15' },
  {
    source: 'Hurricane deductible roof repair',
    amount: '$16,500',
    change: 20.0,
    date: '2025-11-15',
  },
  { source: 'Furnace replacement', amount: '$16,000', change: 0.0, date: '2025-12-15' },
  { source: 'HVAC replacement', amount: '$15,000', change: 0, date: '2020-11-15' },
  {
    source: 'Sister’s destination wedding trip',
    amount: '$15,000',
    change: 0,
    date: '2022-11-15',
  },
  { source: 'Child-care contract', amount: '$14,400', change: 0, date: '2020-09-15' },
  { source: 'Rental HVAC sudden failure', amount: '$13,000', change: -26.7, date: '2023-11-15' },
  { source: 'Emergency driveway rebuild', amount: '$13,000', change: 0.0, date: '2026-01-15' },
  { source: 'Furnace puff-back cleanup', amount: '$12,500', change: 8.3, date: '2023-12-15' },
  { source: 'Private-school spring tuition', amount: '$12,000', change: 0, date: '2020-11-15' },
  { source: 'Parent-2 coding-boot-camp loan', amount: '$12,000', change: 0, date: '2021-05-15' },
  { source: 'Furnace & duct collapse', amount: '$12,000', change: 0, date: '2021-12-15' },
  { source: 'Pet emergency surgery', amount: '$11,500', change: -56.2, date: '2024-10-15' },
  { source: 'Emergency root canal', amount: '$10,500', change: 0.0, date: '2022-02-15' },
  { source: 'COVID-medical bills (parent-1)', amount: '$9,000', change: 0, date: '2021-03-15' },
  {
    source: 'Rental AirBnB trashed—make-ready',
    amount: '$8,500',
    change: 0,
    date: '2024-09-15',
  },
  { source: 'Medical (braces / oral surgery)', amount: '$8,000', change: 0, date: '2020-02-15' },
  { source: 'Hurricane deductible roof fix', amount: '$8,000', change: 0, date: '2021-08-15' },
  { source: 'Birthday / memberships', amount: '$7,000', change: 50.0, date: '2026-03-15' },
  { source: 'Laptops & camera crash', amount: '$6,600', change: 0, date: '2020-11-15' },
  { source: 'Emergency slab leak', amount: '$6,500', change: 0, date: '2024-04-15' },
  { source: 'Major transmission repair', amount: '$5,500', change: 0, date: '2021-05-15' },
  { source: 'Pet cancer surgery', amount: '$4,500', change: 0, date: '2022-11-15' },
  { source: 'Emergency travel to relatives', amount: '$3,500', change: 0, date: '2020-10-15' },
  { source: 'Emergency wisdom-teeth', amount: '$3,500', change: 0, date: '2021-03-15' },
  { source: 'Emergency pet surgery', amount: '$3,500', change: 0, date: '2021-10-15' },
  { source: 'Summer camp / stay-cation', amount: '$3,000', change: 0, date: '2021-05-15' },
];

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

const ExpensesTable = ({
  timeframe = 'Y',
  periodData = [], // New prop: filtered monthly data from parent
  scaleFactor = 1, // New prop: for weekly scaling
}: {
  timeframe?: string;
  periodData?: TCashFlow[]; // Optional fallback to empty
  scaleFactor?: number;
}) => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['source', 'change', 'amount']);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const columnOrder = ['source', 'date', 'change', 'amount'] as const;
  const labels = {
    source: 'Source',
    date: 'Date',
    change: 'Change',
    amount: 'Amount',
  } as const;
  const visibleColKeys = columnOrder.filter((key) => selectedColumns.includes(key));

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const value = event.target.value;
    setSelectedColumns(typeof value === 'string' ? value.split(',') : value);
  };

  // Use parent's periodData to compute synced totalExpenses (ignores hardcoded data scale)
  const totalExpenses = periodData.reduce((acc, item) => acc + item.expenses, 0) * scaleFactor;

  // For sources breakdown: Keep filtering hardcoded data by date for visualization,
  // but note: this is approximate (hardcoded sums don't match monthly aggregates).
  // In a full refactor, replace with source-level data that sums to periodData.expenses per month.
  const cutoffDate = getCutoffDate(timeframe);

  const parseAmount = (amount: string): number => {
    return parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0;
  };

  const dateFilteredData = data.filter((item) => {
    const itemDate = dayjs(item.date);
    return itemDate.isAfter(cutoffDate) || itemDate.isSame(cutoffDate, 'day');
  });

  const fullHardcodedTotal = dateFilteredData.reduce(
    (acc, item) => acc + parseAmount(item.amount),
    0
  );

  const scaleForGroups =
    totalExpenses > 0 && fullHardcodedTotal > 0 ? totalExpenses / fullHardcodedTotal : 0;

  const filteredData = dateFilteredData.filter((item) =>
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fixedSources = [
    'Primary-home mortgage (P&I)',
    'Health-insurance premium',
    'Rental-duplex mortgage (P&I)',
    'Child-care / after-school',
    'Life & umbrella insurance',
    'Child-care contract',
  ];
  const variableSources = [
    'Groceries / household',
    'Fun money (couple)',
    'Kid activities / sports',
    'Utilities',
    'Fuel & routine car maint',
    'Phones & streaming',
  ];
  const occasionalSources = [
    'Christmas & gifts',
    'Luxury anniversary vacation',
    'New SUV (cash, Sep)',
    'Around-the-world luxury cruise',
    'Master-bath renovation',
    'Home addition / extra garage',
    'Parent-1 3-week unpaid leave',
    'Rental major rehab',
    'Early-pay 2020 property tax',
    'Family vacation (Europe, Jul)',
    'Used replacement car (Aug)',
    'Rental turnkey refurb',
    'Roof replacement (Oct)',
    'Second IVF cycle',
    'Furnace replacement',
    'HVAC replacement',
    'Sister’s destination wedding trip',
    'Furnace puff-back cleanup',
    'Private-school spring tuition',
    'Parent-2 coding-boot-camp loan',
    'Furnace & duct collapse',
    'COVID-medical bills (parent-1)',
    'Rental AirBnB trashed—make-ready',
    'Hurricane deductible roof fix',
    'Birthday / memberships',
    'Laptops & camera crash',
    'Emergency slab leak',
    'Major transmission repair',
    'Pet cancer surgery',
    'Emergency travel to relatives',
    'Emergency wisdom-teeth',
    'Emergency pet surgery',
    'Summer camp / stay-cation',
  ];
  const unplannedSources = [
    'IVF / fertility treatment',
    'Medical (appendectomy)',
    'IRS 2019 estimate',
    'Hurricane deductible roof repair',
    'Emergency root canal',
    'Medical (braces / oral surgery)',
    'Rental HVAC sudden failure',
    'Emergency driveway rebuild',
    'Pet emergency surgery',
  ];

  const groups = [
    {
      category: 'Fixed',
      items: filteredData.filter((item) => fixedSources.includes(item.source)),
    },
    {
      category: 'Variable',
      items: filteredData.filter((item) => variableSources.includes(item.source)),
    },
    {
      category: 'Descretionary',
      items: filteredData.filter((item) => occasionalSources.includes(item.source)),
    },
    {
      category: 'Unexpected',
      items: filteredData.filter((item) => unplannedSources.includes(item.source)),
    },
  ].filter((group) => group.items.length > 0); // Hide empty groups

  // For group totals: Use approximate sum from filtered items (for display), but overall total is synced
  const getGroupTotal = (groupItems: typeof data) => {
    return groupItems.reduce((gAcc, item) => gAcc + parseAmount(item.amount), 0) * scaleForGroups;
  };

  const getChildCellContent = (key: string, row: (typeof data)[0]) => {
    switch (key) {
      case 'source':
        return row.source;
      case 'date':
        return dayjs(row.date).format('MMM d, YYYY') || '';
      case 'change':
        return <TrendingChip value={row.change} />;
      case 'amount': {
        const num = parseAmount(row.amount) * scaleForGroups;
        return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      }
      default:
        return null;
    }
  };

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  return (
    <>
      <Card
        id="expenses-table"
        sx={{
          mb: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Typography fontSize="1.4rem">Expenses</Typography>

          <Box display="flex" width={1} gap={1} justifyContent="space-between" alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search sources..."
              value={searchTerm}
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Box display="flex" gap={1} alignItems="center">
              <Dropdown
                multiple
                size="small"
                value={selectedColumns as unknown as string}
                onChange={handleChange}
                input={<OutlinedInput />}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selected) => {
                  const selectedArray = Array.isArray(selected)
                    ? selected
                    : String(selected).split(',');
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Chip
                        sx={{
                          height: '1.6rem',
                          backgroundColor: 'rgba(var(--accent--primary-1-alpha), 0.3)',
                        }}
                        key={selectedArray[0]}
                        label={labels[selectedArray[0] as keyof typeof labels]}
                        size="small"
                      />
                      {selectedArray.length > 1 && `+${selectedArray.length - 1}`}
                    </Box>
                  );
                }}
              >
                {[
                  { value: 'source', label: 'Source' },
                  { value: 'date', label: 'Date' },
                  { value: 'change', label: 'Change' },
                  { value: 'amount', label: 'Amount' },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox
                      checked={selectedColumns.includes(item.value)}
                      size="small"
                      sx={{ verticalAlign: 'middle' }}
                    />
                    {item.label}
                  </MenuItem>
                ))}
              </Dropdown>
            </Box>
          </Box>
        </Box>
        <TableContainer
          sx={{
            mt: 1,
            backgroundColor: 'var(--bg-color-secondary)',
            '& .MuiTableCell-root': {
              fontSize: '1.2rem',
              borderColor: 'var(--neutral--600)',
              whiteSpace: 'nowrap',
              color: 'var(--text-color-primary)',
            },
            '& .MuiTableCell-root:first-of-type': {
              minWidth: '100px',
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {visibleColKeys.map((key) => (
                  <TableCell key={key} sx={{ p: 1 }} align={key === 'amount' ? 'right' : undefined}>
                    {labels[key]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => {
                const groupTotal = getGroupTotal(group.items); // Approximate group sum

                const avgChange =
                  group.items.length > 0
                    ? group.items.reduce((acc, item) => acc + item.change, 0) / group.items.length
                    : 0;

                const isOpen = openCategories[group.category];

                return (
                  <React.Fragment key={group.category}>
                    <TableRow sx={{ 'td, th': { border: 0 } }}>
                      <TableCell
                        scope="row"
                        onClick={() =>
                          setOpenCategories((prev) => ({
                            ...prev,
                            [group.category]: !prev[group.category],
                          }))
                        }
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
                      {visibleColKeys.slice(1).map((key) => (
                        <TableCell
                          key={key}
                          align={key === 'amount' ? 'right' : undefined}
                          sx={key === 'amount' ? { fontWeight: 'bold', p: 1 } : { p: 1 }}
                        >
                          {key === 'change' ? (
                            <TrendingChip value={avgChange} />
                          ) : key === 'amount' ? (
                            `$${groupTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                          ) : (
                            ''
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          p: 0,
                        }}
                        colSpan={visibleColKeys.length}
                      >
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 0 }}>
                            <Table size="small" aria-label="child table">
                              <TableBody>
                                {group.items.map((row) => (
                                  <TableRow key={row.source}>
                                    {visibleColKeys.map((key) => (
                                      <TableCell
                                        key={key}
                                        scope={key === 'source' ? 'row' : undefined}
                                        align={key === 'amount' ? 'right' : undefined}
                                        sx={{
                                          borderTop: '1px solid var(--neutral--600)',
                                          p: 1,
                                        }}
                                      >
                                        {getChildCellContent(key, row)}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
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
                  backgroundColor: 'rgba(var(--system--red-300-alpha), 0.05)',
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: 'bold', fontSize: '1.3rem', p: 1 }}
                >
                  Total
                </TableCell>
                {visibleColKeys.slice(1).map((key) => (
                  <TableCell
                    key={key}
                    align={key === 'amount' ? 'right' : undefined}
                    sx={
                      key === 'amount' ? { fontWeight: 'bold', fontSize: '1.3rem', p: 1 } : { p: 1 }
                    }
                  >
                    {key === 'amount'
                      ? `$${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                      : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
        title="Expenses"
        youtubeUrl="https://www.youtube.com/embed/dbK2Owp4hVc?si=JjpXWscCUypu_ajN"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Formula</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Fixed Expenses + Variable Expenses + Descretionary Expenses + Unexpected Expenses =
                Expenses (Total)
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Expense Types</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                <Typography mb={1}>
                  - Fixed Expenses: Consistent costs that remain unchanged over time, such as rent
                </Typography>
                <Typography mb={1}>
                  - Variable Expenses: Costs that fluctuate based on usage or activity, such as
                  groceries{' '}
                </Typography>
                <Typography mb={1}>
                  - Descretionary Expenses: Periodic costs that occur irregularly, such as annual
                  subscriptions.{' '}
                </Typography>
                <Typography>
                  - Unexpected Expenses: Unexpected costs, such as emergency repair
                </Typography>
              </Typography>
            </Box>
          </Stack>
        }
      />
    </>
  );
};

export default ExpensesTable;
