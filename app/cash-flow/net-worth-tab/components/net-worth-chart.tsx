import React, { useState } from 'react';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import { Box, Menu, MenuItem, OutlinedInput, Stack, Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import Card from '~/components/card';
import ButtonIcon from '~/components/button-icon';
import Dropdown from '~/components/dropdown';

const monthlyData = [
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

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}k`;
  } else {
    return `$${num}`;
  }
};

const NetWorthChart = ({ date }: { date: string }) => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const getDisplayData = () => {
    const len = monthlyData.length;
    switch (date) {
      case '6M':
        return monthlyData.slice(-6);
      case 'Y':
        return monthlyData.slice(-12);
      case '2Y':
        return monthlyData.slice(-24);
      case '5Y':
        return monthlyData.slice(-60);
      case 'All':
        return monthlyData;
      default:
        return monthlyData.slice(-12);
    }
  };

  let displayData = getDisplayData();

  const latest = displayData[displayData.length - 1];
  const first = displayData[0];
  const delta = latest.netWorth - first.netWorth;
  const growthRate =
    displayData.length === 1 || first.netWorth === 0
      ? 0
      : ((latest.netWorth - first.netWorth) / Math.abs(first.netWorth)) * 100;

  return (
    <>
      <Card sx={{ pb: 1, mb: 1, mt: 2 }}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Conventional Net Worth
            </Typography>
            <ButtonIcon onClick={handleOpenMenu}>
              <MoreHorizIcon sx={{ fontSize: '1.6rem' }} />
            </ButtonIcon>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontSize="2.8rem" fontWeight={700}>
              {formatNumber(delta)}
            </Typography>
            <TrendingChip value={parseFloat(growthRate.toFixed(1))} />
          </Box>
        </Box>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/cash-flow/net-worth/analytics">
            Analytics
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/reports">
            Reports
          </MenuItem>
          <MenuItem onClick={handleCloseMenu} component={Link} to="/notifications">
            Notifications
          </MenuItem>
        </Menu>

        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: '0.8rem',
                  height: '0.8rem',
                  background: 'var(--text-color-primary)',
                  borderRadius: '100%',
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Net Worth
              </Typography>
              <Box
                sx={{
                  width: '0.8rem',
                  height: '0.8rem',
                  background: 'var(--secondary--color-3)',
                  borderRadius: '100%',
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Assets
              </Typography>
              <Box
                sx={{
                  width: '0.8rem',
                  height: '0.8rem',
                  background: 'var(--accent--primary-1)',
                  borderRadius: '100%',
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Liabilities
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: { xs: 280, sm: 320, md: 360 }, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="assetsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--secondary--color-3)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--secondary--color-3)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="liabilitiesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent--primary-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--accent--primary-1)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray=""
                vertical={false}
                stroke="var(--border-color-secondary)"
                opacity={0.3}
              />

              <XAxis
                dataKey="period"
                tickLine={false}
                stroke="var(--text-color-secondary)"
                fontSize="1rem"
                padding={{ left: 0, right: 0 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="var(--text-color-secondary)"
                fontSize="1.1rem"
                width={60}
                tickFormatter={(v) => {
                  if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
                  return v;
                }}
              />

              <Tooltip
                contentStyle={{
                  background: 'rgba(var(--bg-color-secondary-alpha), 0.96)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '10px 14px',
                }}
                labelStyle={{
                  color: 'var(--text-color-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: 8,
                }}
                itemStyle={{ padding: '4px 0' }}
                formatter={(value: number, name: string) => {
                  const formattedValue = `$${Math.abs(value).toLocaleString()}`;
                  if (name === 'netWorth') return [formattedValue, 'Net Worth'];
                  if (name === 'assets') return [formattedValue, 'Assets'];
                  if (name === 'liabilities') return [formattedValue, 'Debt'];
                  return [formattedValue, name];
                }}
              />

              <Area
                type="monotone"
                dataKey="assets"
                stroke="var(--secondary--color-3)"
                strokeWidth={3}
                fill="url(#assetsFill)"
                fillOpacity={1}
                dot={false}
                activeDot={false}
              />
              <Area
                type="monotone"
                dataKey="liabilities"
                stroke="var(--accent--primary-1)"
                strokeWidth={3}
                fill="url(#liabilitiesFill)"
                fillOpacity={1}
                dot={false}
                activeDot={false}
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="var(--text-color-primary)"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={{ r: 6 }}
                strokeLinecap="round"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <ButtonIcon
          sx={{ position: 'absolute', top: '-13px', left: '-13px', opacity: 0.7 }}
          onClick={() => setIsOpenInfoDialog(true)}
        >
          <InfoOutlineIcon sx={{ fontSize: '2rem' }} />
        </ButtonIcon>
      </Card>

      <InfoDialog
        open={isOpenInfoDialog}
        onClose={() => setIsOpenInfoDialog(false)}
        title="Conventional Net Worth"
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography fontSize="1.4rem" fontWeight={600} color="var(--text-color-secondary)">
                Formula:
              </Typography>
              <Typography fontSize="1.4rem" mt={1}>
                Conventional Net Worth = Total Assets – Total Liabilities
              </Typography>
            </Box>

            <Box>
              <Typography fontSize="1.4rem" fontWeight={600} color="var(--text-color-secondary)">
                Overview:
              </Typography>
              <Typography fontSize="1.4rem" mt={1}>
                Conventional net worth is calculated as Total Assets minus Total Liabilities,
                providing a snapshot of financial position by showing what remains after settling
                all debts. Assets include cash, investments, property, and vehicles; liabilities
                cover loans, mortgages, and credit card balances.
              </Typography>
            </Box>

            <Box>
              <Typography fontSize="1.4rem" fontWeight={600} color="var(--text-color-secondary)">
                Key Differences:
              </Typography>
              <Typography fontSize="1.4rem" mt={1}>
                Conventional net worth focuses on current ownership minus debt, while cash flow net
                worth emphasizes sustainable income streams for a forward-looking wealth measure.
                Both track progress but suit different goals: balance sheet health versus investment
                viability.
              </Typography>
            </Box>
          </Stack>
        }
        youtubeUrl="https://www.youtube.com/embed/0DzfvNCXNoA?si=ztLdgqrndYIohB9e"
      />
    </>
  );
};

export default NetWorthChart;
