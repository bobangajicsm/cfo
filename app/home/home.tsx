import { Box, Typography, Stack, MenuItem, OutlinedInput } from '@mui/material';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import TrendingChip from '~/components/trending-chip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import React, { useState, type ReactNode } from 'react';
import ButtonIcon from '~/components/button-icon';
import InfoDialog from '~/components/info-dialog';
import Dropdown from '~/components/dropdown';

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

const home = () => {
  const [date, setDate] = useState('M');
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoContent, setInfoContent] = useState<ReactNode | null>(null);
  const [infoYoutubeUrl, setInfoYoutubeUrl] = useState('');

  const getTotals = (timeframe: string) => {
    let filtered = data;
    switch (timeframe) {
      case 'M':
        filtered = data.slice(-1);
        break;
      case 'Q':
        filtered = data.slice(-3);
        break;
      case '6M':
        filtered = data.slice(-6);
        break;
      case 'Y':
        filtered = data;
        break;
      case 'W':
        const lastMonth = data[data.length - 1];
        filtered = [
          {
            month: lastMonth.month,
            earnings: Math.round(lastMonth.earnings / 4),
            expenses: Math.round(lastMonth.expenses / 4),
          },
        ];
        break;
      default:
        filtered = data;
    }
    const totalEarnings = filtered.reduce((acc, item) => acc + item.earnings, 0);
    const totalExpenses = filtered.reduce((acc, item) => acc + item.expenses, 0);
    return { totalEarnings, totalExpenses };
  };

  const { totalEarnings, totalExpenses } = getTotals(date);
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
      <Box my={1} display="flex" justifyContent="space-between" alignItems="fles-start">
        <Stack sx={{ maxWidth: '60%' }}>
          <Typography variant="h1" fontSize="2.2rem" fontWeight={600}>
            Welcome back, Kevin
          </Typography>
          <Typography color="var(--text-color-secondary)" mb={3} fontSize="1.2rem">
            Track spending and build savings.
          </Typography>
        </Stack>
        <Dropdown
          value={date}
          onChange={(e) => setDate(e.target.value)}
          input={<OutlinedInput startAdornment={<CalendarTodayIcon sx={{ fontSize: 18 }} />} />}
          size="small"
          IconComponent={KeyboardArrowDownIcon}
          sx={{ width: '100%' }}
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
        </Dropdown>
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
