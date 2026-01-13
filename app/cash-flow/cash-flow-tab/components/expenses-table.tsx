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
} from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import Dropdown from '~/components/dropdown';
import dayjs from 'dayjs';

const data = [
  { source: 'Primary-home mortgage (P&I)', amount: '$576,000.00', change: 0.0, date: '2025-09-15' },
  { source: 'Groceries / household', amount: '$180,900.00', change: 10.8, date: '2025-09-15' },
  { source: 'Fun money (couple)', amount: '$137,600.00', change: 14.4, date: '2025-09-15' },
  { source: 'Health-insurance premium', amount: '$129,600.00', change: 0.0, date: '2025-09-15' },
  {
    source: 'Rental-duplex mortgage (P&I)',
    amount: '$108,000.00',
    change: 0.0,
    date: '2025-09-15',
  },
  { source: 'Christmas & gifts', amount: '$91,000.00', change: 11.1, date: '2025-12-15' },
  { source: 'Kid activities / sports', amount: '$79,110.00', change: 20.3, date: '2025-09-15' },
  { source: 'Utilities', amount: '$75,270.00', change: 12.2, date: '2025-09-15' },
  { source: 'Child-care / after-school', amount: '$72,000.00', change: 0.0, date: '2025-09-15' },
  { source: 'Fuel & routine car maint', amount: '$69,690.00', change: 7.7, date: '2025-09-15' },
  { source: 'New SUV (cash, Sep)', amount: '$65,000.00', change: 0, date: '2020-09-15' },
  { source: 'Luxury anniversary holiday', amount: '$54,000.00', change: 0.0, date: '2025-11-15' },
  { source: 'Around-the-world luxury cruise', amount: '$52,000.00', change: 0, date: '2025-07-15' },
  { source: 'IVF / fertility treatment', amount: '$37,000.00', change: 0.0, date: '2022-02-15' },
  { source: 'Master-bath renovation', amount: '$36,000.00', change: 0.0, date: '2024-10-15' },
  { source: 'Home addition / extra garage', amount: '$35,000.00', change: 0, date: '2024-09-15' },
  { source: 'Parent-1 3-week unpaid leave', amount: '$33,000.00', change: 0, date: '2023-05-15' },
  { source: 'Life & umbrella insurance', amount: '$28,800.00', change: 0.0, date: '2025-09-15' },
  { source: 'Rental major rehab', amount: '$28,000.00', change: 0, date: '2023-01-15' },
  { source: 'Early-pay 2020 property tax', amount: '$27,000.00', change: 0, date: '2020-02-15' },
  { source: 'Phones & streaming', amount: '$25,200.00', change: 0.0, date: '2025-09-15' },
  { source: 'Family vacation (Europe, Jul)', amount: '$25,000.00', change: 0, date: '2020-07-15' },
  { source: 'Used replacement car (Aug)', amount: '$25,000.00', change: 0, date: '2021-08-15' },
  { source: 'Medical (appendectomy)', amount: '$24,000.00', change: 0, date: '2020-11-15' },
  { source: 'Rental turnkey refurb', amount: '$22,000.00', change: 0, date: '2022-06-15' },
  { source: 'IRS 2019 estimate', amount: '$18,500.00', change: 0, date: '2020-02-15' },
  { source: 'Roof replacement (Oct)', amount: '$18,000.00', change: 0, date: '2021-10-15' },
  { source: 'Second IVF cycle', amount: '$18,000.00', change: 0, date: '2024-04-15' },
  {
    source: 'Hurricane deductible roof repair',
    amount: '$16,500.00',
    change: 20.0,
    date: '2025-11-15',
  },
  { source: 'Furnace replacement', amount: '$16,000.00', change: 0.0, date: '2025-12-15' },
  { source: 'HVAC replacement', amount: '$15,000.00', change: 0, date: '2020-11-15' },
  {
    source: 'Sister’s destination wedding trip',
    amount: '$15,000.00',
    change: 0,
    date: '2022-11-15',
  },
  { source: 'Child-care contract', amount: '$14,400.00', change: 0, date: '2020-09-15' },
  { source: 'Rental HVAC sudden failure', amount: '$13,000.00', change: -26.7, date: '2023-11-15' },
  { source: 'Emergency driveway rebuild', amount: '$13,000.00', change: 0.0, date: '2025-01-15' },
  { source: 'Furnace puff-back cleanup', amount: '$12,500.00', change: 8.3, date: '2023-12-15' },
  { source: 'Private-school spring tuition', amount: '$12,000.00', change: 0, date: '2020-11-15' },
  { source: 'Parent-2 coding-boot-camp loan', amount: '$12,000.00', change: 0, date: '2021-05-15' },
  { source: 'Furnace & duct collapse', amount: '$12,000.00', change: 0, date: '2021-12-15' },
  { source: 'Pet emergency surgery', amount: '$11,500.00', change: -56.2, date: '2024-10-15' },
  { source: 'Emergency root canal', amount: '$10,500.00', change: 0.0, date: '2022-02-15' },
  { source: 'COVID-medical bills (parent-1)', amount: '$9,000.00', change: 0, date: '2021-03-15' },
  {
    source: 'Rental AirBnB trashed—make-ready',
    amount: '$8,500.00',
    change: 0,
    date: '2024-09-15',
  },
  { source: 'Medical (braces / oral surgery)', amount: '$8,000.00', change: 0, date: '2020-02-15' },
  { source: 'Hurricane deductible roof fix', amount: '$8,000.00', change: 0, date: '2021-08-15' },
  { source: 'Birthday / memberships', amount: '$7,000.00', change: 50.0, date: '2025-03-15' },
  { source: 'Laptops & camera crash', amount: '$6,600.00', change: 0, date: '2020-11-15' },
  { source: 'Emergency slab leak', amount: '$6,500.00', change: 0, date: '2024-04-15' },
  { source: 'Major transmission repair', amount: '$5,500.00', change: 0, date: '2021-05-15' },
  { source: 'Pet cancer surgery', amount: '$4,500.00', change: 0, date: '2022-11-15' },
  { source: 'Emergency travel to relatives', amount: '$3,500.00', change: 0, date: '2020-10-15' },
  { source: 'Emergency wisdom-teeth', amount: '$3,500.00', change: 0, date: '2021-03-15' },
  { source: 'Emergency pet surgery', amount: '$3,500.00', change: 0, date: '2021-10-15' },
  { source: 'Summer camp / stay-cation', amount: '$3,000.00', change: 0, date: '2021-05-15' },
];

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
      return 12;
    case '2Y':
      return 24;
    case '5Y':
      return 60;
    default:
      return 12;
  }
};

const ExpensesTable = ({ timeframe = 'Y' }: { timeframe?: string }) => {
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

  const periodMonths = getPeriodMonths(timeframe);
  const cutoffDate = dayjs().subtract(periodMonths, 'month');

  const filteredData = data
    .filter((item) => {
      const itemDate = dayjs(item.date);
      return itemDate.isAfter(cutoffDate) || itemDate.isSame(cutoffDate, 'day');
    })
    .filter((item) => item.source.toLowerCase().includes(searchTerm.toLowerCase()));

  // Define groups with all items (no slicing to show everything)
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
    'Luxury anniversary holiday',
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
      category: 'Occasional',
      items: filteredData.filter((item) => occasionalSources.includes(item.source)),
    },
    {
      category: 'Unplanned',
      items: filteredData.filter((item) => unplannedSources.includes(item.source)),
    },
  ].filter((group) => group.items.length > 0); // Hide empty groups

  const totalExpenses = groups.reduce((acc, group) => {
    return (
      acc +
      group.items.reduce((gAcc, item) => {
        const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ''));
        return gAcc + (isNaN(numericAmount) ? 0 : numericAmount);
      }, 0)
    );
  }, 0);

  const getChildCellContent = (key: string, row: (typeof data)[0]) => {
    switch (key) {
      case 'source':
        return row.source;
      case 'date':
        return dayjs(row.date).format('MMM d, YYYY') || '';
      case 'change':
        return <TrendingChip value={row.change} />;
      case 'amount':
        return row.amount;
      default:
        return null;
    }
  };

  return (
    <Card
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
              const groupTotal = group.items.reduce((acc, item) => {
                const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ''));
                return acc + (isNaN(numericAmount) ? 0 : numericAmount);
              }, 0);

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
                          `$${groupTotal.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
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
                    ? `$${totalExpenses.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ExpensesTable;
