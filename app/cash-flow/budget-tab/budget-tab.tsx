import React from 'react';
import IncomeBudgetTable from './components/income-budget-table';
import ExpensesBudgetTable from './components/expenses-budget-table';

import { Stack } from '@mui/material';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ButtonPrimary from '~/components/button-primary';

import { Box, Typography } from '@mui/material';
import BudgetChart from './components/budget-chart';

const BudgetTab = () => {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box my={1} display="flex" justifyContent="space-between" alignItems="fles-start">
        <Stack sx={{ maxWidth: '60%' }}>
          <Typography variant="h1" fontSize="2.2rem" fontWeight={600}>
            Budget for 2025
          </Typography>
          <Typography color="var(--text-color-secondary)" mb={3} fontSize="1.2rem">
            Plan further out than just this month
          </Typography>
        </Stack>
        <Box>
          <ButtonPrimary>
            Export data
            <ArrowDownwardIcon sx={{ fontSize: '1.2rem', ml: 0.5 }} />
          </ButtonPrimary>
        </Box>
      </Box>
      <BudgetChart />
      <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={3} mb={4}>
        Transactions
      </Typography>
      <IncomeBudgetTable />
      <ExpensesBudgetTable />
    </Box>
  );
};

export default BudgetTab;
