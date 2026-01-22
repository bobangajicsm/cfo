import { Box, Typography, Stack, MenuItem, OutlinedInput, Select } from '@mui/material';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import TrendingChip from '~/components/trending-chip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import React, { useState, type ReactNode, useMemo } from 'react';
import ButtonIcon from '~/components/button-icon';
import InfoDialog from '~/components/info-dialog';

export type TCashFlow = {
  month: string;
  earnings: number;
  expenses: number;
};

const data2020: TCashFlow[] = [
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

const data2021: TCashFlow[] = [
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

const data2022: TCashFlow[] = [
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

const data2023: TCashFlow[] = [
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

const data2024: TCashFlow[] = [
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

const data2025: TCashFlow[] = [
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

const yearlyData = {
  2020: data2020,
  2021: data2021,
  2022: data2022,
  2023: data2023,
  2024: data2024,
  2025: data2025,
} as const;

const home = () => {
  const [date, setDate] = useState('M');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoContent, setInfoContent] = useState<ReactNode | null>(null);
  const [infoYoutubeUrl, setInfoYoutubeUrl] = useState('');

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

  const totalEarnings = useMemo(
    () => periodData.reduce((acc, item) => acc + item.earnings, 0) * scaleFactor,
    [periodData, scaleFactor]
  );

  const totalExpenses = useMemo(
    () => periodData.reduce((acc, item) => acc + item.expenses, 0) * scaleFactor,
    [periodData, scaleFactor]
  );

  const cashFlow = totalEarnings - totalExpenses;

  const handleOpenInfoDialog = ({
    title,
    content,
    youtubeUrl,
  }: {
    title: string;
    content: React.ReactNode;
    youtubeUrl: string;
  }) => {
    setInfoTitle(title);
    setInfoContent(content);
    setInfoYoutubeUrl(youtubeUrl);
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box my={1} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Stack sx={{ maxWidth: '60%' }}>
          <Typography variant="h1" fontSize="2.2rem" fontWeight={600}>
            Welcome back, Kevin
          </Typography>
          <Typography color="var(--text-color-secondary)" mb={3} fontSize="1.2rem">
            Track spending and build savings.
          </Typography>
        </Stack>
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
              {tf === 'W'
                ? 'This Week'
                : tf === 'M'
                  ? 'This Month'
                  : tf === 'Q'
                    ? 'This Quarter'
                    : tf === '6M'
                      ? 'Past 6 Months'
                      : 'This Year'}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'var(--bg-color-secondary)',
          borderRadius: 2,
          border: '1px solid var(--border-color)',
          px: 2,
          py: 2,
          mb: 2,
        }}
      >
        <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
          Cash Flow
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize="2.8rem" fontWeight={700}>
            ${cashFlow.toLocaleString()}
          </Typography>
          <TrendingChip value={25.4} />
          <ButtonIcon
            onClick={() =>
              handleOpenInfoDialog({
                title: 'Cash Flow Overview',
                youtubeUrl: 'https://www.youtube.com/embed/5yVf4yPg0k4?si=9soD-yivIV42YjD9',
                content: (
                  <Stack px={2} gap={3} mb={2}>
                    <Box>
                      <Typography
                        sx={{ fontWeight: '400' }}
                        fontSize="1.4rem"
                        color="var(--text-color-secondary)"
                      >
                        Sum all income types (active + passive + portfolio) for total inflows, then
                        subtract categorized expenses (fixed + variable + occasional + unplanned) to
                        derive net cash flow. This personal finance approach differs from business
                        cash flow statements, which segment into operating, investing, and financing
                        activities.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: '700' }}>Cash Flow Formula</Typography>
                      <Typography
                        sx={{ fontWeight: '400' }}
                        fontSize="1.4rem"
                        color="var(--text-color-secondary)"
                      >
                        Cash Flow = Total Income (Active + Passive + Portfolio) - Total Expenses
                        (Fixed + Variable + Occasional + Unplanned)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: '700' }}>Income Types</Typography>
                      <Typography
                        sx={{ fontWeight: '400' }}
                        fontSize="1.4rem"
                        color="var(--text-color-secondary)"
                      >
                        Active income stems from direct labor or services, such as wages, salaries,
                        or freelance earnings requiring ongoing effort. Passive income generates
                        with little daily involvement, like rental payments or royalties from prior
                        work. Portfolio income arises from investments, including dividends,
                        interest, or capital gains from stocks and bonds.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: '700' }}>Expense Types</Typography>
                      <Typography
                        sx={{ fontWeight: '400' }}
                        fontSize="1.4rem"
                        color="var(--text-color-secondary)"
                      >
                        Fixed expenses stay constant regardless of activity, such as rent or
                        insurance premiums. Variable expenses change with usage, like groceries or
                        fuel costs. Occasional expenses arise periodically, such as annual
                        subscriptions; unplanned ones are unforeseen, like emergency repairs.
                      </Typography>
                    </Box>
                  </Stack>
                ),
              })
            }
            sx={{
              position: 'absolute',
              top: '-13px',
              left: '-13px',
              opacity: 0.7,
            }}
          >
            <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
          </ButtonIcon>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-around" alignItems="center" gap={2}>
        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'var(--bg-color-secondary)',
            borderRadius: 2,
            border: '1px solid var(--border-color)',
            px: 2,
            py: 2,
            mb: 2,
            flex: 1,
          }}
        >
          <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
            Income
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography fontSize="2.8rem" fontWeight={700}>
                ${totalEarnings.toLocaleString()}
              </Typography>
              <TrendingChip value={2.2} />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'var(--bg-color-secondary)',
            borderRadius: 2,
            border: '1px solid var(--border-color)',
            px: 2,
            py: 2,
            mb: 2,
            flex: 1,
          }}
        >
          <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
            Expenses
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography fontSize="2.8rem" fontWeight={700}>
                ${totalExpenses.toLocaleString()}
              </Typography>
              <TrendingChip value={2.4} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'var(--bg-color-secondary)',
          borderRadius: 2,
          border: '1px solid var(--border-color)',
          px: 2,
          py: 2,
          mb: 2,
        }}
      >
        <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
          Debt Service Coverage Ratio (DSCR)
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize="2.8rem" fontWeight={700}>
            1.39
          </Typography>
          <ButtonIcon
            onClick={() =>
              handleOpenInfoDialog({
                title: 'Debt Service Coverage Ratio',
                content: (
                  <Stack px={2} gap={3} mb={2}>
                    <Typography>
                      Calculate and monitor DSCR MONTHLY; keep a rolling 12-month history so you can
                      see seasonal dips, but the operational decision horizon is the next calendar
                      month. We could have a COLLAPSABLE graph view of the last rolling 12 months so
                      that we can see the DSCR trend is improving or getting worse.
                    </Typography>
                    <Typography>Formula:</Typography>
                    <Typography>
                      DSCR = Net recurring monthly income ÷ Total monthly contractual recurring
                      expenses (target ≥ 1.25×;)
                    </Typography>
                    <Typography>Why is the DASR important to know?</Typography>
                    <Typography>
                      A ratio of 1.0 means cash inflow exactly matches scheduled recurring expenses;
                      Good cash flow management set minimum DSCR floors (e.g., ≥1.20×); breaching
                      them triggers a cash flow emergency, so the farther the actual DSCR sits above
                      the set floor, the more resilient your cash flow is to temporary cash-flow
                      recurring expense stress or shocks.{' '}
                    </Typography>
                  </Stack>
                ),
                youtubeUrl: '',
              })
            }
            sx={{
              position: 'absolute',
              top: '-13px',
              left: '-13px',
              opacity: 0.7,
            }}
          >
            <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
          </ButtonIcon>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'var(--bg-color-secondary)',
          borderRadius: 2,
          border: '1px solid var(--border-color)',
          px: 2,
          py: 2,
          mb: 2,
        }}
      >
        <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
          Debt-Coverage Resilience
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize="2.8rem" fontWeight={700}>
            22%
          </Typography>
          <ButtonIcon
            onClick={() =>
              handleOpenInfoDialog({
                title: 'Debt-Coverage Resilience',
                content: (
                  <Stack px={2} gap={3} mb={2}>
                    <Typography>Formula:</Typography>
                    <Typography>
                      Debt-Coverage Resilience (%) = 1 – 1 ÷ Debt Service Coverage Ratio (DSCR)
                    </Typography>
                    <Typography>Overview:</Typography>
                    <Typography>
                      The largest income drop (in %) you can absorb before your debt-service
                      coverage ratio hits 1.0×.
                    </Typography>
                  </Stack>
                ),
                youtubeUrl: '',
              })
            }
            sx={{
              position: 'absolute',
              top: '-13px',
              left: '-13px',
              opacity: 0.7,
            }}
          >
            <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
          </ButtonIcon>
        </Box>
      </Box>
      <InfoDialog
        title={infoTitle}
        content={infoContent}
        youtubeUrl={infoYoutubeUrl}
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
      />
    </Box>
  );
};

export default home;
