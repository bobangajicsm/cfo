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
  Stack,
} from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Card from '~/components/card';
import Dropdown from '~/components/dropdown';
import dayjs from 'dayjs';
import TrendingChip from '~/components/trending-chip';
import ButtonIcon from '~/components/button-icon';
import InfoDialog from '~/components/info-dialog';

const data = [
  {
    source: 'Bank Account',
    balance: '$3,786,030',
    returnRate: 45.8,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Hotel',
    balance: '$3,000,000',
    returnRate: 3.4,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Real Estate Development',
    balance: '$1,800,000',
    returnRate: 20.0,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Farmland (500 acres)',
    balance: '$1,580,000',
    returnRate: 3.9,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Affordable Housing',
    balance: '$1,050,000',
    returnRate: 5.0,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Primary Residence',
    balance: '$950,000',
    returnRate: 4.4,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Value Add Income RE',
    balance: '$900,000',
    returnRate: 9.8,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Mid-Range Rental Real Estate',
    balance: '$750,000',
    returnRate: 4.2,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Woodland (300 acres)',
    balance: '$720,000',
    returnRate: 9.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Vacation Residence',
    balance: '$520,000',
    returnRate: 4.8,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Equity (Shares in a Company)',
    balance: '$400,000',
    returnRate: 8.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Self Employed Business',
    balance: '$380,000',
    returnRate: 11.8,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Gold (kg)',
    balance: '$300,000',
    returnRate: 7.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Operating Small Business',
    balance: '$280,000',
    returnRate: 16.7,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Collateralized Debt (assets)',
    balance: '$258,000',
    returnRate: 3.2,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Currencies (EUR)',
    balance: '$220,000',
    returnRate: 6.8,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Startup Business',
    balance: '$200,000',
    returnRate: 17.6,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Precious Metal Mining',
    balance: '$178,000',
    returnRate: 4.7,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Convertible Debt (assets)',
    balance: '$178,000',
    returnRate: 4.7,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Gold (ounce)',
    balance: '$160,000',
    returnRate: 8.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Currencies (USD)',
    balance: '$160,000',
    returnRate: 8.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Oil interests',
    balance: '$134,000',
    returnRate: 3.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Currencies (GBP)',
    balance: '$120,000',
    returnRate: 7.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Gem Stones',
    balance: '$108,000',
    returnRate: 8.0,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Insurance (cash value)',
    balance: '$104,000',
    returnRate: 8.3,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Commodities (Timber)',
    balance: '$104,000',
    returnRate: 6.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Gas interests',
    balance: '$100,000',
    returnRate: 2.0,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Commodities (Grain)',
    balance: '$88,000',
    returnRate: 15.8,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Silver (kg)',
    balance: '$60,000',
    returnRate: 11.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Silver (ounce)',
    balance: '$40,000',
    returnRate: 11.1,
    lastUpdated: '12-31-2025',
  },
  {
    source: 'Commodities (Fertilizer)',
    balance: '$40,000',
    returnRate: 11.1,
    lastUpdated: '12-31-2025',
  },
];

const AssetsTable = ({ timeframe }: { timeframe: string }) => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'source',
    'returnRate',
    'balance',
  ]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const columnOrder = ['source', 'lastUpdated', 'returnRate', 'balance'] as const;

  const periodNames = {
    '6M': '6 Months',
    Y: '1 Year',
    '2Y': '2 Years',
    '5Y': '5 Years',
    All: 'All Time',
  } as const;

  const periodLabel = periodNames[timeframe as keyof typeof periodNames] || timeframe;

  const now = dayjs();
  let startDate: dayjs.Dayjs | null = null;
  if (timeframe !== 'All') {
    let subtractUnit: dayjs.ManipulateType = 'month';
    let subtractAmount = 0;
    if (timeframe === '6M') {
      subtractAmount = 6;
    } else {
      const yearsStr = timeframe.replace('Y', '');
      const years = parseInt(yearsStr) || 1;
      if (!isNaN(years)) {
        subtractAmount = years * 12;
      }
    }
    if (subtractAmount > 0) {
      startDate = now.subtract(subtractAmount, subtractUnit);
    }
  }

  const dateFilteredData =
    timeframe === 'All'
      ? data
      : data.filter((item) => {
          const itemDate = dayjs(item.lastUpdated);
          return itemDate.isAfter(startDate!) || itemDate.isSame(startDate!, 'day');
        });

  const filteredData = dateFilteredData.filter((item) =>
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const labels = {
    source: 'Asset',
    lastUpdated: 'Last Updated',
    returnRate: `${periodLabel} Return Rate`,
    balance: 'Balance',
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
    <>
      <Card sx={{ mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Typography fontSize="1.4rem">Total Assets ({periodLabel})</Typography>

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
                {columnOrder.map((key) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox checked={selectedColumns.includes(key)} size="small" />
                    {labels[key]}
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
                    {key === 'balance' ? `$${totalAssets.toLocaleString('en-US')}` : ''}
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
        youtubeUrl="https://www.youtube.com/embed/TDoYRMDUNa8?si=KuFoEeZNpaHlVCJd"
        title="Total Assets"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Overview</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Total assets in personal finance represent all valuable items you own cash,
                investments, real estate, and personal property. They form the foundation of net
                worth calculations, helping assess financial health and progress toward goals when
                compared against liabilities.
              </Typography>
            </Box>
          </Stack>
        }
      />
    </>
  );
};

export default AssetsTable;
