import React, { useState } from 'react';
import IncomeBudgetTable from './components/income-budget-table';
import ExpensesBudgetTable from './components/expenses-budget-table';

import { MenuItem, Select } from '@mui/material';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ButtonPrimary from '~/components/button-primary';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { Box, Typography } from '@mui/material';
import BudgetChart from './components/budget-chart';

import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

const data = [
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

const BudgetTab = () => {
  const [date, setDate] = useState('Y');
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'BudgetFlow');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: fileType });
    saveAs(blob, 'budget_flow' + fileExtension);
  };

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box my={1} display="flex" justifyContent="flex-end" mb={3} gap={2}>
        <Select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          IconComponent={KeyboardArrowDownIcon}
          startAdornment={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select': {
              paddingLeft: 0.5,
              minHeight: 'auto !important',
            },
            '&.MuiOutlinedInput-root': {
              borderRadius: '4px',
            },
          }}
        >
          {['W', 'M', 'Q', '6M', 'Y'].map((tf) => (
            <MenuItem key={tf} value={tf}>
              {tf}
            </MenuItem>
          ))}
        </Select>

        <ButtonPrimary onClick={handleDownload}>
          Export data
          <ArrowDownwardIcon sx={{ fontSize: '1.2rem', ml: 0.5 }} />
        </ButtonPrimary>
      </Box>
      <BudgetChart date={date} />
      <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={3} mb={4}>
        Transactions
      </Typography>
      <IncomeBudgetTable timeframe={date} />
      <ExpensesBudgetTable timeframe={date} />
    </Box>
  );
};

export default BudgetTab;
