import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import CashFlowChart from '~/cash-flow/cash-flow-tab/components/cash-flow-chart';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DaysToGoalChart from '~/cash-flow/cash-flow-tab/components/days-to-goal-chart';
import IncomeTable from '~/cash-flow/cash-flow-tab/components/income-table';
import ExpensesTable from '~/cash-flow/cash-flow-tab/components/expenses-table';
import ButtonPrimary from '~/components/button-primary';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import * as XLSX from 'xlsx';
import pkg from 'file-saver';
import { useState, useMemo } from 'react';
import IncomeExpenseChart from '~/cash-flow/cash-flow-tab/components/income-expense-chart';
import BudgetChart from '../budget-tab/components/budget-chart';
const { saveAs } = pkg;

export type TCashFlow = {
  month: string;
  earnings: number;
  expenses: number;
};

export const data2020 = [
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

export const data2021 = [
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

export const data2022 = [
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

export const data2023 = [
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

export const data2024 = [
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

export const data2025 = [
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

const CashFlowTab = () => {
  const [date, setDate] = useState('Y');
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const yearlyData = {
    2020: data2020,
    2021: data2021,
    2022: data2022,
    2023: data2023,
    2024: data2024,
    2025: data2025,
  };

  const years = Object.keys(yearlyData).map(Number);
  const currentYear = Math.max(...years);

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

  const [fullMonthsCount, scaleFactor] = useMemo(() => {
    const months = getPeriodMonths(date);
    if (months < 1) {
      return [1, months];
    }
    return [Math.min(Math.floor(months), 12), 1];
  }, [date]);

  const periodData = useMemo((): TCashFlow[] => {
    const monthsNeeded = getPeriodMonths(date);
    let data: TCashFlow[] = [];
    if (monthsNeeded <= 12) {
      const currentData = yearlyData[currentYear as keyof typeof yearlyData] || [];
      const numMonths = Math.min(fullMonthsCount, 12);
      data = currentData.slice(-numMonths);
    } else {
      const numYears = monthsNeeded / 12;
      const startYear = currentYear - numYears + 1;
      for (let y = startYear; y <= currentYear; y++) {
        if (yearlyData[y as keyof typeof yearlyData]) {
          data = [...data, ...yearlyData[y as keyof typeof yearlyData]];
        }
      }
    }
    return data;
  }, [date, currentYear, yearlyData, fullMonthsCount]);

  const currentCashFlow = useMemo(() => {
    const sumEarnings = periodData.reduce((acc, item) => acc + item.earnings, 0);
    const sumExpenses = periodData.reduce((acc, item) => acc + item.expenses, 0);
    return (sumEarnings - sumExpenses) * scaleFactor;
  }, [periodData, scaleFactor]);

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(periodData);

    XLSX.utils.book_append_sheet(wb, ws, 'CashFlow');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: fileType });
    saveAs(blob, 'cash_flow' + fileExtension);
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
          {['W', 'M', 'Q', '6M', 'Y', '2Y', '5Y'].map((tf) => (
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
      <CashFlowChart
        date={date}
        periodData={periodData}
        currentCashFlow={currentCashFlow}
        scaleFactor={scaleFactor}
      />
      <DaysToGoalChart currentCashFlow={currentCashFlow} timeframe={date} />
      <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={4} mb={4}>
        Transactions
      </Typography>
      <IncomeTable timeframe={date} periodData={periodData} scaleFactor={scaleFactor} />
      <ExpensesTable timeframe={date} periodData={periodData} scaleFactor={scaleFactor} />

      <Accordion sx={{ mb: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Income and Expense Graph</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <IncomeExpenseChart date={date} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CashFlowTab;
