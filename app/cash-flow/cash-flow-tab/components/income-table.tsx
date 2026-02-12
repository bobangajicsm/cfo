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
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import { type TCashFlow } from '~/cash-flow/cash-flow-tab/cash-flow-tab';
import InfoDialog from '~/components/info-dialog';
import ButtonIcon from '~/components/button-icon';

const data = [
  {
    source: 'Parent-1 salary (take-home)',
    amount: '$3,825,000',
    change: 6.9,
    date: '2026-01-15',
  },
  {
    source: 'Parent-2 salary (take-home)',
    amount: '$780,000',
    change: 4.3,
    date: '2026-01-15',
  },
  {
    source: 'Online store net profit',
    amount: '$750,200',
    change: 52.4,
    date: '2026-01-15',
  },
  {
    source: 'Dividends (quarterly)',
    amount: '$170,700',
    change: 12.5,
    date: '2025-12-15',
  },
  {
    source: 'Rental duplex (net)',
    amount: '$169,600',
    change: 0.0,
    date: '2023-12-15',
  },
  {
    source: 'Rental duplex AirBnB (net)',
    amount: '$150,000',
    change: 27.3,
    date: '2026-01-15',
  },
  {
    source: 'Annual bonus (Mar)',
    amount: '$105,000',
    change: 33.3,
    date: '2022-03-15',
  },
  {
    source: 'Child-tax credit (advance)',
    amount: '$36,000',
    change: 0.0,
    date: '2026-01-15',
  },
  {
    source: 'Annual bonus (Feb)',
    amount: '$35,000',
    change: 0.0,
    date: '2024-02-15',
  },
  {
    source: 'Annual bonus + equity vest (Feb)',
    amount: '$35,000',
    change: 0.0,
    date: '2025-02-15',
  },
  {
    source: '2019 tax refund',
    amount: '$18,000',
    change: 0.0,
    date: '2020-04-15',
  },
  {
    source: 'Tax refund (2023 overpayment)',
    amount: '$6,200',
    change: 0.0,
    date: '2024-04-15',
  },
  {
    source: 'Child-tax credit',
    amount: '$6,000',
    change: 0.0,
    date: '2020-12-15',
  },
  {
    source: 'Tax refund (2022 overpayment)',
    amount: '$5,500',
    change: 0.0,
    date: '2023-04-15',
  },
  {
    source: 'House sold (net)',
    amount: '$500,000',
    change: 0.0,
    date: '2025-12-20',
  },
  {
    source: 'Investment property sale',
    amount: '$300,000',
    change: 15.2,
    date: '2025-11-15',
  },
  {
    source: 'Stock portfolio gains (capital)',
    amount: '$250,000',
    change: 8.7,
    date: '2026-01-10',
  },
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

const IncomeTable = ({
  timeframe = 'Y',
  periodData = [],
  scaleFactor = 1,
}: {
  timeframe?: string;
  periodData?: TCashFlow[];
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

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const value = event.target.value;
    setSelectedColumns(typeof value === 'string' ? value.split(',') : value);
  };

  const totalIncome = periodData.reduce((acc, item) => acc + item.earnings, 0) * scaleFactor;

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
    totalIncome > 0 && fullHardcodedTotal > 0 ? totalIncome / fullHardcodedTotal : 0;

  const filteredData = dateFilteredData.filter((item) =>
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSources = [
    'Parent-1 salary (take-home)',
    'Parent-2 salary (take-home)',
    'Online store net profit',
    'Annual bonus (Mar)',
    'Annual bonus (Feb)',
    'Annual bonus + equity vest (Feb)',
  ] as const;

  const portfolioSources = [
    'House sold (net)',
    'Investment property sale',
    'Stock portfolio gains (capital)',
  ] as const;

  const groups = [
    {
      category: 'Active',
      items: filteredData.filter((item) => activeSources.includes(item.source as any)),
    },
    {
      category: 'Passive',
      items: filteredData.filter(
        (item) =>
          !activeSources.includes(item.source as any) &&
          !portfolioSources.includes(item.source as any)
      ),
    },
    {
      category: 'Portfolio',
      items: filteredData.filter((item) => portfolioSources.includes(item.source as any)),
    },
  ];

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

  return (
    <>
      <Card
        id="income-table"
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
          <Typography mb={2} fontSize="1.4rem">
            Income
          </Typography>

          <Box display="flex" width={1} gap={1} justifyContent="space-between" alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search sources..."
              value={searchTerm}
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <TableCell sx={{ p: 1 }} key={key} align={key === 'amount' ? 'right' : undefined}>
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
                        style={{
                          padding: 0,
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
                  backgroundColor: 'rgba(var(--system--green-300-alpha), 0.05)',
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
                      ? `$${totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
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
        title="Income Overview"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Income Types</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                <Typography mb={1}>
                  - Active Income: Earnings generated through direct work{' '}
                </Typography>
                <Typography mb={1}>
                  - Passive Income: Earnings that require minimal ongoing effort, such as rental
                  income
                </Typography>
                <Typography>
                  - Portfolio Income: Returns derived from investments, including dividends,
                  interest
                </Typography>
              </Typography>
            </Box>
          </Stack>
        }
      />
    </>
  );
};

export default IncomeTable;
