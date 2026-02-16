import React, { useState, useEffect } from 'react';
import IncomeBudgetTable from './components/income-budget-table';
import ExpensesBudgetTable from './components/expenses-budget-table';

import { MenuItem, Select } from '@mui/material';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ButtonPrimary from '~/components/button-primary';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { Box, Typography, TextField } from '@mui/material';

import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

export type TCashFlow = {
  month: string;
  earnings: number;
  expenses: number;
};

export const data2020: TCashFlow[] = [
  { month: 'Jan', earnings: 80600, expenses: 26450 },
  { month: 'Feb', earnings: 72200, expenses: 74700 },
  { month: 'Mar', earnings: 142500, expenses: 26450 },
  { month: 'Apr', earnings: 99200, expenses: 18320 },
  { month: 'May', earnings: 72900, expenses: 17780 },
  { month: 'Jun', earnings: 73000, expenses: 18590 },
  { month: 'Jul', earnings: 82600, expenses: 43730 },
  { month: 'Aug', earnings: 73400, expenses: 18270 },
  { month: 'Sep', earnings: 73200, expenses: 83180 },
  { month: 'Oct', earnings: 81500, expenses: 21900 },
  { month: 'Nov', earnings: 74600, expenses: 80520 },
  { month: 'Dec', earnings: 75600, expenses: 19500 },
];

export const data2021: TCashFlow[] = [
  { month: 'Jan', earnings: 64100, expenses: 17950 },
  { month: 'Feb', earnings: 58400, expenses: 40200 },
  { month: 'Mar', earnings: 72300, expenses: 30920 },
  { month: 'Apr', earnings: 62000, expenses: 18280 },
  { month: 'May', earnings: 57400, expenses: 39100 },
  { month: 'Jun', earnings: 58900, expenses: 18490 },
  { month: 'Jul', earnings: 63300, expenses: 19100 },
  { month: 'Aug', earnings: 59000, expenses: 52050 },
  { month: 'Sep', earnings: 59200, expenses: 18920 },
  { month: 'Oct', earnings: 62400, expenses: 40730 },
  { month: 'Nov', earnings: 59600, expenses: 28200 },
  { month: 'Dec', earnings: 60100, expenses: 42850 },
];

export const data2022: TCashFlow[] = [
  { month: 'Jan', earnings: 72100, expenses: 18950 },
  { month: 'Feb', earnings: 65800, expenses: 40850 },
  { month: 'Mar', earnings: 86400, expenses: 19100 },
  { month: 'Apr', earnings: 71700, expenses: 18980 },
  { month: 'May', earnings: 66500, expenses: 19210 },
  { month: 'Jun', earnings: 66800, expenses: 48850 },
  { month: 'Jul', earnings: 73600, expenses: 19850 },
  { month: 'Aug', earnings: 67400, expenses: 19990 },
  { month: 'Sep', earnings: 67700, expenses: 20150 },
  { month: 'Oct', earnings: 74100, expenses: 20310 },
  { month: 'Nov', earnings: 68800, expenses: 40270 },
  { month: 'Dec', earnings: 69600, expenses: 38200 },
];

export const data2023: TCashFlow[] = [
  { month: 'Jan', earnings: 85100, expenses: 48150 },
  { month: 'Feb', earnings: 78400, expenses: 21050 },
  { month: 'Mar', earnings: 78800, expenses: 20750 },
  { month: 'Apr', earnings: 91100, expenses: 20890 },
  { month: 'May', earnings: 46400, expenses: 58550 },
  { month: 'Jun', earnings: 79800, expenses: 21410 },
  { month: 'Jul', earnings: 87900, expenses: 21870 },
  { month: 'Aug', earnings: 80800, expenses: 22050 },
  { month: 'Sep', earnings: 81300, expenses: 22210 },
  { month: 'Oct', earnings: 88800, expenses: 43850 },
  { month: 'Nov', earnings: 82600, expenses: 46350 },
  { month: 'Dec', earnings: 83600, expenses: 42350 },
];

export const data2024: TCashFlow[] = [
  { month: 'Jan', earnings: 97600, expenses: 27600 },
  { month: 'Feb', earnings: 125100, expenses: 21000 },
  { month: 'Mar', earnings: 90600, expenses: 22000 },
  { month: 'Apr', earnings: 104800, expenses: 46100 },
  { month: 'May', earnings: 91600, expenses: 21800 },
  { month: 'Jun', earnings: 92100, expenses: 22300 },
  { month: 'Jul', earnings: 101100, expenses: 23000 },
  { month: 'Aug', earnings: 93100, expenses: 23200 },
  { month: 'Sep', earnings: 93600, expenses: 67100 },
  { month: 'Oct', earnings: 102100, expenses: 45300 },
  { month: 'Nov', earnings: 94600, expenses: 49800 },
  { month: 'Dec', earnings: 95600, expenses: 45850 },
];

export const data2025: TCashFlow[] = [
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

export const yearlyData = {
  2020: data2020,
  2021: data2021,
  2022: data2022,
  2023: data2023,
  2024: data2024,
  2025: data2025,
} as const;

const BudgetTab = () => {
  const [date, setDate] = useState('Y');
  const [yearlyIncomeBudget, setYearlyIncomeBudget] = useState<number | null>(null);
  const [yearlyExpensesBudget, setYearlyExpensesBudget] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [incomeBudgetInput, setIncomeBudgetInput] = useState('');
  const [expensesBudgetInput, setExpensesBudgetInput] = useState('');

  useEffect(() => {
    const savedIncome = localStorage.getItem('yearlyIncomeBudget');
    const savedExpenses = localStorage.getItem('yearlyExpensesBudget');
    if (savedIncome && savedExpenses) {
      setYearlyIncomeBudget(parseFloat(savedIncome));
      setYearlyExpensesBudget(parseFloat(savedExpenses));
    } else {
      setEditMode(true);
    }
  }, []);

  useEffect(() => {
    if (editMode && yearlyIncomeBudget !== null && yearlyExpensesBudget !== null) {
      setIncomeBudgetInput(yearlyIncomeBudget.toString());
      setExpensesBudgetInput(yearlyExpensesBudget.toString());
    }
  }, [editMode, yearlyIncomeBudget, yearlyExpensesBudget]);

  const handleSave = () => {
    if (incomeBudgetInput && expensesBudgetInput) {
      const incomeValue = parseFloat(incomeBudgetInput);
      const expensesValue = parseFloat(expensesBudgetInput);
      localStorage.setItem('yearlyIncomeBudget', incomeValue.toString());
      localStorage.setItem('yearlyExpensesBudget', expensesValue.toString());
      setYearlyIncomeBudget(incomeValue);
      setYearlyExpensesBudget(expensesValue);
      setEditMode(false);
      setIncomeBudgetInput('');
      setExpensesBudgetInput('');
    }
  };

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data2025);

    XLSX.utils.book_append_sheet(wb, ws, 'BudgetFlow');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: fileType });
    saveAs(blob, 'budget_flow' + fileExtension);
  };

  if (editMode) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Please enter your yearly budgets:
        </Typography>
        <TextField
          type="number"
          value={incomeBudgetInput}
          onChange={(e) => setIncomeBudgetInput(e.target.value)}
          placeholder="Enter income budget"
          sx={{ mr: 2, mb: 2 }}
        />
        <TextField
          type="number"
          value={expensesBudgetInput}
          onChange={(e) => setExpensesBudgetInput(e.target.value)}
          placeholder="Enter expenses budget"
          sx={{ mr: 2, mb: 2 }}
        />
        <ButtonPrimary onClick={handleSave}>Save</ButtonPrimary>
      </Box>
    );
  }

  const periodIncomeBudget = date === 'Y' ? yearlyIncomeBudget : (yearlyIncomeBudget ?? 0) / 12;
  const periodExpensesBudget =
    date === 'Y' ? yearlyExpensesBudget : (yearlyExpensesBudget ?? 0) / 12;

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box mb={3} mt={1} display="flex" flexDirection="column" gap={1}>
        <Typography mb={0}>Income Budget: ${yearlyIncomeBudget?.toLocaleString()}</Typography>
        <Typography>Expenses Budget: ${yearlyExpensesBudget?.toLocaleString()}</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flex={1}
          mt={1}
        >
          <ButtonPrimary onClick={() => setEditMode(true)}>Edit Budgets</ButtonPrimary>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
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
              {['M', 'Y'].map((tf) => (
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
        </Box>
      </Box>

      <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={3} mb={4}>
        Transactions
      </Typography>
      <IncomeBudgetTable timeframe={date} userBudget={periodIncomeBudget ?? undefined} />
      <ExpensesBudgetTable timeframe={date} userBudget={periodExpensesBudget ?? undefined} />
    </Box>
  );
};

export default BudgetTab;
