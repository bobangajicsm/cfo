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
  Checkbox,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Card from '~/components/card';
import Dropdown from '~/components/dropdown';
import dayjs from 'dayjs';
import TrendingChip from '~/components/trending-chip';

const data = [
  {
    source: 'High-Yield Savings',
    balance: '$18,500.00',
    returnRate: 4.85,
    lastUpdated: '2025-11-24',
  },
  {
    source: 'Brokerage Account',
    balance: '$68,200.00',
    returnRate: 12.4,
    lastUpdated: '2025-11-20',
  },
  {
    source: '401(k) - Vanguard',
    balance: '$142,800.00',
    returnRate: 9.7,
    lastUpdated: '2025-11-15',
  },
  {
    source: 'Roth IRA',
    balance: '$37,400.00',
    returnRate: 10.8,
    lastUpdated: '2025-11-20',
  },
  {
    source: 'Real Estate (Rental)',
    balance: '$285,000.00',
    returnRate: 6.2,
    lastUpdated: '2025-11-01',
  },
  {
    source: 'Emergency Fund',
    balance: '$12,000.00',
    returnRate: 4.1,
    lastUpdated: '2025-11-10',
  },
];

const AssetsTable = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'source',
    'returnRate',
    'balance',
  ]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const columnOrder = ['source', 'lastUpdated', 'returnRate', 'balance'] as const;
  const labels = {
    source: 'Asset',
    lastUpdated: 'Last Updated',
    returnRate: 'Return Rate',
    balance: 'Balance',
  } as const;

  const visibleColKeys = columnOrder.filter((key) => selectedColumns.includes(key));

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const value = event.target.value;
    setSelectedColumns(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredData = data.filter((item) =>
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssets = filteredData.reduce((acc, item) => {
    const numericBalance = parseFloat(item.balance.replace(/[^0-9.-]+/g, ''));
    return acc + (isNaN(numericBalance) ? 0 : numericBalance);
  }, 0);

  const getCellContent = (key: string, row: (typeof data)[0]) => {
    switch (key) {
      case 'source':
        return row.source;
      case 'lastUpdated':
        return dayjs(row.lastUpdated).format('MMM D, YYYY');
      case 'returnRate':
        return <TrendingChip value={row.returnRate} />;
      case 'balance':
        return row.balance;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
      >
        <Typography fontSize="1.4rem">Total Assets</Typography>

        <Box display="flex" width={1} gap={1} justifyContent="space-between" alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search assets..."
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
                { value: 'source', label: 'Asset' },
                { value: 'lastUpdated', label: 'Last Updated' },
                { value: 'returnRate', label: 'Return Rate' },
                { value: 'balance', label: 'Balance' },
              ].map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <Checkbox checked={selectedColumns.includes(item.value)} size="small" />
                  {item.label}
                </MenuItem>
              ))}
            </Dropdown>
          </Box>
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
            minWidth: '100px',
          },
        }}
      >
        <Table aria-label="assets table">
          <TableHead>
            <TableRow>
              {visibleColKeys.map((key) => (
                <TableCell key={key} align={key === 'balance' ? 'right' : undefined}>
                  {labels[key]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.source}>
                {visibleColKeys.map((key) => (
                  <TableCell key={key} align={key === 'balance' ? 'right' : undefined}>
                    {getCellContent(key, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* Total Assets Row */}
            <TableRow
              sx={{
                backgroundColor: 'rgba(var(--system--green-300-alpha), 0.1)',
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  color: 'var(--system--green-700)',
                }}
              >
                Total Assets
              </TableCell>
              {visibleColKeys.slice(1).map((key) => (
                <TableCell
                  key={key}
                  align={key === 'balance' ? 'right' : undefined}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    color: key === 'balance' ? 'var(--system--green-700)' : 'inherit',
                  }}
                >
                  {key === 'balance'
                    ? `$${totalAssets.toLocaleString('en-US', {
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

export default AssetsTable;
