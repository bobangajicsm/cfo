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
    source: 'Hotel Term Loan',
    balance: '$1,400,000',
    interestRate: 5.2,
    dueDate: '12-31-2025',
  },
  {
    source: 'Construction Loan - RE Development',
    balance: '$900,000',
    interestRate: 6.1,
    dueDate: '12-31-2025',
  },
  {
    source: 'Loan - Affordable Housing',
    balance: '$520,000',
    interestRate: 4.8,
    dueDate: '12-31-2025',
  },
  {
    source: 'Mortgage - Mid-Range Rental RE',
    balance: '$380,000',
    interestRate: 4.2,
    dueDate: '12-31-2025',
  },
  {
    source: 'Mortgage - Primary Residence',
    balance: '$380,000',
    interestRate: 3.9,
    dueDate: '12-31-2025',
  },
  {
    source: 'Farmland Loan',
    balance: '$480,000',
    interestRate: 5.5,
    dueDate: '12-31-2025',
  },
  {
    source: 'Loan - Value Add Income RE',
    balance: '$420,000',
    interestRate: 5.0,
    dueDate: '12-31-2025',
  },
  {
    source: 'Mortgage - Holiday Residence',
    balance: '$230,000',
    interestRate: 4.1,
    dueDate: '12-31-2025',
  },
  {
    source: 'Woodland Loan',
    balance: '$150,000',
    interestRate: 4.7,
    dueDate: '12-31-2025',
  },
  {
    source: 'Operating Small Business Loan',
    balance: '$80,000',
    interestRate: 7.2,
    dueDate: '12-31-2025',
  },
  {
    source: 'Self-Employed Business Loan',
    balance: '$40,000',
    interestRate: 6.8,
    dueDate: '12-31-2025',
  },
  {
    source: 'Personal Line of Credit',
    balance: '$24,000',
    interestRate: 9.5,
    dueDate: '12-31-2025',
  },
];

const LiabilitiesTable = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'source',
    'interestRate',
    'balance',
  ]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const columnOrder = ['source', 'dueDate', 'interestRate', 'balance'] as const;
  const labels = {
    source: 'Liability',
    dueDate: 'Due Date',
    interestRate: 'Interest Rate',
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

  const totalLiabilities = filteredData.reduce((acc, item) => {
    const numericBalance = parseFloat(item.balance.replace(/[^0-9.-]+/g, ''));
    return acc + (isNaN(numericBalance) ? 0 : numericBalance);
  }, 0);

  const getCellContent = (key: string, row: (typeof data)[0]) => {
    switch (key) {
      case 'source':
        return row.source;
      case 'dueDate':
        return dayjs(row.dueDate).format('MMM D, YYYY');
      case 'interestRate':
        return <TrendingChip value={row.interestRate} />;
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
        <Typography fontSize="1.4rem">Total Liabilities</Typography>

        <Box display="flex" width={1} gap={1} justifyContent="space-between" alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search liabilities..."
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
                { value: 'source', label: 'Liability' },
                { value: 'dueDate', label: 'Due Date' },
                { value: 'interestRate', label: 'Interest Rate' },
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
        <Table aria-label="liabilities table">
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

            <TableRow
              sx={{
                backgroundColor: 'rgba(var(--system--300-alpha), 0.1)',
              }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                Total Liabilities
              </TableCell>
              {visibleColKeys.slice(1).map((key) => (
                <TableCell
                  key={key}
                  align={key === 'balance' ? 'right' : undefined}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                  }}
                >
                  {key === 'balance' ? `$${totalLiabilities.toLocaleString('en-US')}` : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default LiabilitiesTable;
