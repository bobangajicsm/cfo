import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useState, useMemo } from 'react';
import ButtonPrimary from '~/components/button-primary';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NetWorthChart from './components/net-worth-chart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoDialog from '~/components/info-dialog';
import LiabilitiesTable from './components/liabilities-table';
import AssetsTable from './components/assets-table';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

import {
  data2020,
  data2021,
  data2022,
  data2023,
  data2024,
  data2025,
} from '~/cash-flow/budget-tab/budget-tab';
import ButtonIcon from '~/components/button-icon';
import Card from '~/components/card';

const data = [
  { period: "Jan '20", assets: 8662826, liabilities: 5011333, netWorth: 3651493 },
  { period: "Feb '20", assets: 8778652, liabilities: 5026667, netWorth: 3751985 },
  { period: "Mar '20", assets: 8894478, liabilities: 5042000, netWorth: 3852478 },
  { period: "Apr '20", assets: 9010303, liabilities: 5057333, netWorth: 3952970 },
  { period: "May '20", assets: 9126129, liabilities: 5072667, netWorth: 4053462 },
  { period: "Jun '20", assets: 9241955, liabilities: 5088000, netWorth: 4153955 },
  { period: "Jul '20", assets: 9357781, liabilities: 5103333, netWorth: 4254448 },
  { period: "Aug '20", assets: 9473607, liabilities: 5118667, netWorth: 4354940 },
  { period: "Sep '20", assets: 9589432, liabilities: 5134000, netWorth: 4455432 },
  { period: "Oct '20", assets: 9705258, liabilities: 5149333, netWorth: 4555925 },
  { period: "Nov '20", assets: 9821084, liabilities: 5164667, netWorth: 4656417 },
  { period: "Dec '20", assets: 9936910, liabilities: 5180000, netWorth: 4756910 },
  { period: "Jan '21", assets: 10052736, liabilities: 5195333, netWorth: 4857403 },
  { period: "Feb '21", assets: 10168562, liabilities: 5210667, netWorth: 4957895 },
  { period: "Mar '21", assets: 10284388, liabilities: 5226000, netWorth: 5058388 },
  { period: "Apr '21", assets: 10400213, liabilities: 5241333, netWorth: 5158880 },
  { period: "May '21", assets: 10516039, liabilities: 5256667, netWorth: 5259372 },
  { period: "Jun '21", assets: 10631865, liabilities: 5272000, netWorth: 5359865 },
  { period: "Jul '21", assets: 10747691, liabilities: 5287333, netWorth: 5460358 },
  { period: "Aug '21", assets: 10863517, liabilities: 5302667, netWorth: 5560850 },
  { period: "Sep '21", assets: 10979342, liabilities: 5318000, netWorth: 5661342 },
  { period: "Oct '21", assets: 11095168, liabilities: 5333333, netWorth: 5761835 },
  { period: "Nov '21", assets: 11210994, liabilities: 5348667, netWorth: 5862327 },
  { period: "Dec '21", assets: 11326820, liabilities: 5364000, netWorth: 5962820 },
  { period: "Jan '22", assets: 11433407, liabilities: 5379333, netWorth: 6054073 },
  { period: "Feb '22", assets: 11539993, liabilities: 5394667, netWorth: 6145327 },
  { period: "Mar '22", assets: 11646580, liabilities: 5410000, netWorth: 6236580 },
  { period: "Apr '22", assets: 11753167, liabilities: 5425333, netWorth: 6327833 },
  { period: "May '22", assets: 11859753, liabilities: 5440667, netWorth: 6419087 },
  { period: "Jun '22", assets: 11966340, liabilities: 5456000, netWorth: 6510340 },
  { period: "Jul '22", assets: 12072927, liabilities: 5471333, netWorth: 6601593 },
  { period: "Aug '22", assets: 12179513, liabilities: 5486667, netWorth: 6692847 },
  { period: "Sep '22", assets: 12286100, liabilities: 5502000, netWorth: 6784100 },
  { period: "Oct '22", assets: 12392687, liabilities: 5517333, netWorth: 6875353 },
  { period: "Nov '22", assets: 12499273, liabilities: 5532667, netWorth: 6966607 },
  { period: "Dec '22", assets: 12605860, liabilities: 5548000, netWorth: 7057860 },
  { period: "Jan '23", assets: 12795682, liabilities: 5539167, netWorth: 7256516 },
  { period: "Feb '23", assets: 12985505, liabilities: 5530333, netWorth: 7455172 },
  { period: "Mar '23", assets: 13175328, liabilities: 5521500, netWorth: 7653828 },
  { period: "Apr '23", assets: 13365150, liabilities: 5512667, netWorth: 7852483 },
  { period: "May '23", assets: 13554972, liabilities: 5503833, netWorth: 8051139 },
  { period: "Jun '23", assets: 13744795, liabilities: 5495000, netWorth: 8249795 },
  { period: "Jul '23", assets: 13934618, liabilities: 5486167, netWorth: 8448451 },
  { period: "Aug '23", assets: 14124440, liabilities: 5477333, netWorth: 8647107 },
  { period: "Sep '23", assets: 14314262, liabilities: 5468500, netWorth: 8845762 },
  { period: "Oct '23", assets: 14504085, liabilities: 5459667, netWorth: 9044418 },
  { period: "Nov '23", assets: 14693908, liabilities: 5450833, netWorth: 9243074 },
  { period: "Dec '23", assets: 14883730, liabilities: 5442000, netWorth: 9441730 },
  { period: "Jan '24", assets: 15014345, liabilities: 5431667, netWorth: 9582678 },
  { period: "Feb '24", assets: 15144960, liabilities: 5421333, netWorth: 9723627 },
  { period: "Mar '24", assets: 15275575, liabilities: 5411000, netWorth: 9864575 },
  { period: "Apr '24", assets: 15406190, liabilities: 5400667, netWorth: 10005523 },
  { period: "May '24", assets: 15536805, liabilities: 5390333, netWorth: 10146472 },
  { period: "Jun '24", assets: 15667420, liabilities: 5380000, netWorth: 10287420 },
  { period: "Jul '24", assets: 15798035, liabilities: 5369667, netWorth: 10428368 },
  { period: "Aug '24", assets: 15928650, liabilities: 5359333, netWorth: 10569317 },
  { period: "Sep '24", assets: 16059265, liabilities: 5349000, netWorth: 10710265 },
  { period: "Oct '24", assets: 16189880, liabilities: 5338667, netWorth: 10851213 },
  { period: "Nov '24", assets: 16320495, liabilities: 5328333, netWorth: 10992162 },
  { period: "Dec '24", assets: 16451110, liabilities: 5318000, netWorth: 11133110 },
  { period: "Jan '25", assets: 16635853, liabilities: 5291833, netWorth: 11344020 },
  { period: "Feb '25", assets: 16820597, liabilities: 5265667, netWorth: 11554930 },
  { period: "Mar '25", assets: 17005340, liabilities: 5239500, netWorth: 11765840 },
  { period: "Apr '25", assets: 17190083, liabilities: 5213333, netWorth: 11976750 },
  { period: "May '25", assets: 17374827, liabilities: 5187167, netWorth: 12187660 },
  { period: "Jun '25", assets: 17559570, liabilities: 5161000, netWorth: 12398570 },
  { period: "Jul '25", assets: 17744313, liabilities: 5134833, netWorth: 12609480 },
  { period: "Aug '25", assets: 17929057, liabilities: 5108667, netWorth: 12820390 },
  { period: "Sep '25", assets: 18113800, liabilities: 5082500, netWorth: 13031300 },
  { period: "Oct '25", assets: 18298543, liabilities: 5056333, netWorth: 13242210 },
  { period: "Nov '25", assets: 18483287, liabilities: 5030167, netWorth: 13453120 },
  { period: "Dec '25", assets: 18668030, liabilities: 5004000, netWorth: 13664030 },
];

const NetWorthTab = () => {
  const [date, setDate] = useState('Y');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [capRate, setCapRate] = useState(8);

  const fullMonthlyData = useMemo(
    () => [...data2020, ...data2021, ...data2022, ...data2023, ...data2024, ...data2025],
    []
  );

  const getFilteredMonthlyData = (timeframe: string) => {
    const numMonthsMap: Record<string, number> = {
      '6M': 6,
      Y: 12,
      '2Y': 24,
      '5Y': 60,
      All: fullMonthlyData.length,
    };
    const numMonths = numMonthsMap[timeframe] || 12;
    const recentData = fullMonthlyData.slice(-numMonths);
    const sum = recentData.reduce((acc, item) => acc + item.earnings, 0);
    const periodInMonths = numMonthsMap[timeframe] || 12;
    const prorate = Math.min(periodInMonths / numMonths, 1);
    return Math.round(sum * prorate);
  };

  const passiveIncome = getFilteredMonthlyData(date);

  const computedValue = Math.round(passiveIncome / (capRate / 100));

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'NetWorth');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: fileType });
    saveAs(blob, 'net_worth' + fileExtension);
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Box my={1} display="flex" gap={2}>
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
              {['6M', 'Y', '2Y', '5Y', 'All'].map((tf) => (
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

        <Card>
          <Box position="relative">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography fontSize="1.4rem" mb={0.5}>
                  Passive Income Net Worth
                </Typography>
                <Typography color="var(--text-color-secondary)" fontSize="1rem">
                  Passive Income (Total) ÷ Capitalization Rate = Passive Income Net Worth
                </Typography>
              </Box>
            </Box>
            <Box
              mt={2}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
            >
              <Typography fontSize="1.2rem">
                ${passiveIncome.toLocaleString('en-US')}&#160;
              </Typography>
              <Typography fontSize="1.2rem">÷&#160;</Typography>
              <Select
                value={capRate}
                onChange={(e) => setCapRate(Number(e.target.value))}
                size="small"
                IconComponent={KeyboardArrowDownIcon}
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
                {[2, 4, 6, 8, 10, 12].map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}%
                  </MenuItem>
                ))}
              </Select>
              <Typography fontSize="2rem">&#160;=&#160;</Typography>
              <Typography fontSize="2rem" fontWeight={700}>
                ${computedValue.toLocaleString('en-US')}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                sx={{
                  color: 'var(--system--green-300)',
                  backgroundColor: 'rgba(var(--system--green-300-alpha), 0.2)',
                  border: '1px solid rgba(var(--system--green-300-alpha), 0.2)',
                  borderRadius: 0.5,
                  py: 0.2,
                  px: 0.5,
                }}
              >
                <TrendingUpIcon
                  sx={{
                    fontSize: '1.2rem',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <ButtonIcon
            onClick={handleOpenInfoDialog}
            sx={{
              position: 'absolute',
              top: '-13px',
              left: '-13px',
              opacity: 0.7,
            }}
          >
            <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
          </ButtonIcon>
        </Card>
        <NetWorthChart date={date} />
        <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={3} mb={4}>
          Balance Sheet
        </Typography>
        <AssetsTable timeframe={date} />
        <LiabilitiesTable timeframe={date} />
      </Box>
      <InfoDialog
        open={isOpenInfoDialog}
        onClose={() => setIsOpenInfoDialog(false)}
        title="Cash Flow Net Worth"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography fontSize="1.4rem" fontWeight={600} color="var(--text-color-secondary)">
                Formula:
              </Typography>
              <Typography fontSize="1.4rem" mt={1}>
                Passive Income = Income ÷ Capitalization Rate
              </Typography>
            </Box>

            <Box>
              <Typography fontSize="1.4rem" fontWeight={600} color="var(--text-color-secondary)">
                Overview:
              </Typography>

              <Box mt={1} mb={2}>
                <Typography fontSize="1.4rem" color="var(--text-color-primary)">
                  This formula calculates the investment capital needed to generate a target passive
                  income: divide desired annual income by your expected rate of return (cap rate).
                  <br />
                  For example, $40,000 ÷ 4% = $1M required. <br />
                  It's useful because it transforms abstract financial independence goals into
                  concrete savings targets, helps evaluate if return assumptions are realistic, and
                  guides investment strategy, empowering you to plan retirement or lifestyle changes
                  based on measurable, income-producing net worth.
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography fontSize="1.4rem" color="var(--text-color-secondary)">
                  Pick the cap rate that best matches the risk profile of the income stream (stable
                  & bond-like → use 4-5 %; volatile or high-turnover → use 9-12 %).
                </Typography>
              </Box>
            </Box>
          </Stack>
        }
        youtubeUrl="https://www.youtube.com/embed/IvIfHE54viE?si=p4dYfDITKjRkiAVh"
      />
    </>
  );
};

export default NetWorthTab;
