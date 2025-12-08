import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import ButtonPrimary from '~/components/button-primary';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NetWorthChart from './components/net-worth-chart';
import AnalyticsCard from '~/components/analytics-card';
import InfoDialog from '~/components/info-dialog';
import LiabilitiesTable from './components/liabilities-table';
import AssetsTable from './components/assets-table';

const NetWorthTab = () => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
        }}
      >
        <Box my={1} display="flex" justifyContent="flex-end" mb={3}>
          <ButtonPrimary>
            Export data
            <ArrowDownwardIcon sx={{ fontSize: '1.2rem', ml: 0.5 }} />
          </ButtonPrimary>
        </Box>
        <NetWorthChart />
        <AnalyticsCard
          item={{
            title: 'Cash Flow Net Worth',
            description: 'Income / Capitalization Rate',
            value: '13,664.03',
            trend: 'up',
          }}
          onClick={handleOpenInfoDialog}
        />
        <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={3} mb={4}>
          Transactions
        </Typography>
        <AssetsTable />
        <LiabilitiesTable />
      </Box>
      <InfoDialog
        title="Net Worth"
        shortDescription="Net Worth description"
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
        formula="Net Cash Flow = Operating Cash Flow + Investing Cash Flow + Financing Cash Flow"
        longDescription="Cash flow is the movement of money into or out of a business, project, or financial product. It is a key indicator of financial health. Positive cash flow means more money is coming in than going out, while negative cash flow indicates the opposite. Understanding cash flow helps in making informed decisions about investments, expenses, and growth strategies."
        youtubeUrl="https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF"
      />
    </>
  );
};

export default NetWorthTab;
