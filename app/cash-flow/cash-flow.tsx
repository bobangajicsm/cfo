import type { Route } from '.react-router/types/app/+types/root';
import CashFlowTab from './cash-flow-tab/cash-flow-tab';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import NetWorthTab from './net-worth-tab/net-worth-tab';
import BudgetTab from './budget-tab/budget-tab';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Cash Flow Organizer' }, { name: 'description', content: 'Welcome to CFO' }];
}

const CashFlow = () => {
  const [value, setValue] = useState('cash-flow');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box px={2} sx={{ borderBottom: 1, borderColor: 'var(--border-color)' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            '& .MuiTabs-list': {
              justifyContent: 'space-around',
            },
            '& .MuiButtonBase-root': {
              fontSize: '1.2rem',
              color: 'var(--text-color-secondary)',
              p: 0,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--text-color-secondary)',
            },
            '& .Mui-selected': {
              color: 'var(--text-color-primary) !important',
            },
          }}
        >
          <Tab value="cash-flow" label="Cash Flow" />
          <Tab value="budget" label="Budget" />
          <Tab value="net-worth" label="Net Worth" />
        </Tabs>
      </Box>
      {value === 'cash-flow' && <CashFlowTab />}
      {value === 'budget' && <BudgetTab />}
      {value === 'net-worth' && <NetWorthTab />}
    </Box>
  );
};

export default CashFlow;
