import type { Route } from '.react-router/types/app/+types/root';
import { Box } from '@mui/material';
import { useState } from 'react';
import InfoDialog from '~/components/info-dialog';
import AnalyticsCard from '../../../components/analytics-card';
import Navbar from './components/navbar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Cash Flow Analytics' },
    { name: 'description', content: 'Cash Flow Analytics' },
  ];
}

interface AnalyticsItem {
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down';
  fullDescription: string;
  formula: string;
  longDescription: string;
  youtubeUrl: string;
}

const data: AnalyticsItem[] = [
  {
    title: 'Net Cash Flow Surplus',
    description: 'Total Net Income / Total Income',
    value: '61.3%',
    trend: 'up',
    fullDescription:
      'Measures the portion of income retained after expenses, indicating financial surplus available for savings or investments.',
    formula: 'Net Surplus = (Total Income - Total Expenses) / Total Income × 100',
    longDescription:
      'A high surplus rate shows strong cash flow health, allowing for debt reduction, emergency funds, or growth opportunities. Over 2020-2025, your surplus has grown from 55% to 71%.',
    youtubeUrl: 'https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF',
  },
  {
    title: 'Average Annual Cash Flow',
    description: 'Net Cash Flow / Number of Years',
    value: '$625K',
    trend: 'up',
    fullDescription:
      'Annual average net cash flow across the period, reflecting consistent profitability.',
    formula: 'Avg Annual Flow = Total Net Cash Flow / 6 Years',
    longDescription:
      'This metric tracks year-over-year performance. From $552K in 2020 to $961K in 2025, showing steady improvement in cash generation.',
    youtubeUrl: 'https://www.youtube.com/embed/9q3cWx5e5gU',
  },
  {
    title: 'YoY Cash Flow Growth',
    description: 'Average Year-over-Year Net Increase',
    value: '15.2%',
    trend: 'up',
    fullDescription:
      'Percentage growth in net cash flow from prior year, averaged over the period.',
    formula: 'YoY Growth = (Current Year Net - Prior Year Net) / Prior Year Net × 100',
    longDescription:
      'Indicates accelerating financial momentum. Your net flow grew 25% from 2024 to 2025, outpacing earlier years and signaling positive trends.',
    youtubeUrl: 'https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF',
  },
];

const CashFlowAnalytics = () => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnalyticsItem | null>(null);

  const handleOpenInfoDialog = (item: AnalyticsItem) => {
    setSelectedItem(item);
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  return (
    <>
      <Box>
        <Navbar />
        <Box p={2}>
          {data.map((item, index) => (
            <AnalyticsCard
              sx={{ mb: 2 }}
              key={index}
              item={item}
              onClick={() => handleOpenInfoDialog(item)}
            />
          ))}
        </Box>
      </Box>
      {selectedItem && (
        <InfoDialog
          title={selectedItem.title}
          shortDescription={selectedItem.fullDescription}
          open={isOpenInfoDialog}
          onClose={handleCloseInfoDialog}
          formula={selectedItem.formula}
          longDescription={selectedItem.longDescription}
          youtubeUrl={selectedItem.youtubeUrl}
        />
      )}
    </>
  );
};

export default CashFlowAnalytics;
