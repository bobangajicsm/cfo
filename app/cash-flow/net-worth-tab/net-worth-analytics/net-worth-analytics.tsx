import type { Route } from '.react-router/types/app/+types/root';
import { Box } from '@mui/material';
import { useState } from 'react';
import InfoDialog from '~/components/info-dialog';
import AnalyticsCard from '../../../components/analytics-card';
import Navbar from './components/navbar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Net Worth Analytics' },
    { name: 'description', content: 'Net Worth Analytics' },
  ];
}

interface AnalyticsItem {
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  fullDescription: string;
  formula: string;
  longDescription: string;
  youtubeUrl: string;
}

const data: AnalyticsItem[] = [
  {
    title: 'Debt Ratio',
    description: 'Total Liabilities / Total Assets',
    value: '0.56',
    trend: 'down',
    fullDescription:
      "Measures the proportion of a company's assets that are financed by debt, providing insight into overall leverage.",
    formula: 'Total Liabilities / Total Assets',
    longDescription:
      'A debt ratio of 0.56 indicates that 56% of assets are debt-financed, suggesting moderate leverage and balanced risk. Over 2020-2025, your ratio has improved from 0.65 to 0.56, reflecting stronger financial health.',
    youtubeUrl: 'https://www.youtube.com/embed/tnhCrHyE4Rg',
  },
  {
    title: 'Current Ratio',
    description: 'Current Assets / Current Liabilities',
    value: '1.06',
    trend: 'up',
    fullDescription:
      "Evaluates a company's ability to pay short-term obligations with short-term assets, indicating liquidity.",
    formula: 'Current Assets / Current Liabilities',
    longDescription:
      'With a current ratio of 1.06, your business has just enough assets to cover liabilities, showing adequate short-term solvency. Over 2020-2025, it has risen from 0.95 to 1.06, enhancing operational flexibility.',
    youtubeUrl: 'https://www.youtube.com/embed/hAfJmXEUAMU',
  },
  {
    title: 'Working Capital',
    description: 'Current Assets - Current Liabilities',
    value: '$669',
    trend: 'up',
    fullDescription:
      'Represents the capital available for day-to-day operations after covering short-term liabilities.',
    formula: 'Current Assets - Current Liabilities',
    longDescription:
      'Positive working capital of $669 ensures smooth operations and buffers against unexpected expenses. Over 2020-2025, it has increased from $450 to $669, supporting growth and stability.',
    youtubeUrl: 'https://www.youtube.com/embed/J3I-8Nf0HkA',
  },
  {
    title: 'Assets-to-Equity Ratio',
    description: "Total Assets / Owner's Equity",
    value: '2.27',
    trend: 'neutral',
    fullDescription:
      'Indicates how much of the assets are financed by equity, highlighting the extent of leverage used.',
    formula: "Total Assets / Owner's Equity",
    longDescription:
      'An assets-to-equity ratio of 2.27 means assets are more than twice the equity, reflecting leveraged growth. Over 2020-2025, it has held steady around 2.2-2.3, maintaining consistent capital structure.',
    youtubeUrl: 'https://www.youtube.com/embed/75aliUGG3Oc',
  },
  {
    title: 'Debt-to-Equity Ratio',
    description: "Total Liabilities / Owner's Equity",
    value: '1.27',
    trend: 'down',
    fullDescription:
      "Compares total liabilities to shareholders' equity, assessing the balance between debt and equity financing.",
    formula: "Total Liabilities / Owner's Equity",
    longDescription:
      'A debt-to-equity ratio of 1.27 shows moderate reliance on debt, balancing risk and return. Over 2020-2025, it has declined from 1.45 to 1.27, indicating improved equity strength.',
    youtubeUrl: 'https://www.youtube.com/embed/l35sEbdHx3A',
  },
];

const NetWorthAnalytics = () => {
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

export default NetWorthAnalytics;
