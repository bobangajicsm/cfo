import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Tooltip, PieChart, Pie } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import InfoDialog from '~/components/info-dialog';
import TrendingChip from '~/components/trending-chip';
import ButtonIcon from '~/components/button-icon';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

const getPeriodLabel = (timeframe: string): string => {
  const labels = {
    W: 'weekly',
    M: 'monthly',
    Q: 'quarterly',
    '6M': '6-month',
    Y: 'yearly',
    '2Y': '2-year',
    '5Y': '5-year',
  };
  return labels[timeframe as keyof typeof labels] || 'period';
};

const getPeriodMonths = (timeframe: string): number => {
  const mapping = { W: 0.25, M: 1, Q: 3, '6M': 6, Y: 12, '2Y': 24, '5Y': 60 } as const;
  return mapping[timeframe as keyof typeof mapping] || 12;
};

const DaysToGoalChart = ({
  currentCashFlow,
  timeframe,
}: {
  currentCashFlow: number;
  timeframe: string;
}) => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [targetDateInput, setTargetDateInput] = useState<Date | null>(null);
  const [monthlyTarget, setMonthlyTarget] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<'active' | 'accomplished' | 'missed'>('active');

  useEffect(() => {
    const savedMonthlyTarget = localStorage.getItem('monthlyCashFlowTarget');
    const savedDateStr = localStorage.getItem('targetDate');
    if (savedMonthlyTarget) {
      setMonthlyTarget(parseFloat(savedMonthlyTarget));
    }
    if (savedDateStr) {
      setTargetDate(new Date(savedDateStr));
    }
  }, []);

  useEffect(() => {
    if (monthlyTarget && targetDate) {
      const today = new Date();
      const timeDiff = targetDate.getTime() - today.getTime();
      const daysToTarget = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      const periodMonths = getPeriodMonths(timeframe);
      const periodTarget = monthlyTarget * periodMonths;
      const safeCurrent = Math.max(1, currentCashFlow);
      const percentage = (safeCurrent / periodTarget) * 100;

      if (percentage >= 100 || daysToTarget === 0) {
        if (percentage >= 100) {
          setStatus('accomplished');
        } else {
          setStatus('missed');
        }
      } else {
        setStatus('active');
      }

      if (daysToTarget === 0 && percentage < 100) {
        resetTarget();
      }
    }
  }, [monthlyTarget, targetDate, currentCashFlow, timeframe]);

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  const handleSubmit = () => {
    const num = parseFloat(targetInput);
    const today = new Date();
    const monthlyEquivalent = currentCashFlow / getPeriodMonths(timeframe);
    if (!isNaN(num) && num > monthlyEquivalent && targetDateInput && targetDateInput > today) {
      setMonthlyTarget(num);
      setTargetDate(targetDateInput);
      localStorage.setItem('monthlyCashFlowTarget', num.toString());
      localStorage.setItem('targetDate', targetDateInput.toISOString());
      setTargetInput('');
      setTargetDateInput(null);
      setStatus('active');
    }
  };

  const resetTarget = () => {
    setMonthlyTarget(null);
    setTargetDate(null);
    setStatus('active');
    localStorage.removeItem('monthlyCashFlowTarget');
    localStorage.removeItem('targetDate');
    setTargetInput('');
    setTargetDateInput(null);
  };

  const monthlyEquivalent = currentCashFlow / getPeriodMonths(timeframe);

  const periodMonths = getPeriodMonths(timeframe);
  const periodTarget = (monthlyTarget || 0) * periodMonths;
  const safeCurrent = Math.max(1, currentCashFlow);
  const rawPercentage = (safeCurrent / periodTarget) * 100;
  const percentage = Math.min(100, Math.round(rawPercentage));
  const today = new Date();
  const timeDiff = (targetDate?.getTime() || 0) - today.getTime();
  const daysToTarget = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  const achieved = safeCurrent;
  const remaining = Math.max(0, periodTarget - safeCurrent);

  let chartData = [
    { name: 'Achieved', value: achieved, fill: 'var(--accent--primary-1)' },
    { name: 'Remaining', value: remaining, fill: 'var(--neutral--600)' },
  ];

  let displayPercentage = `${percentage}%`;
  let displayDays = daysToTarget;
  let statusMessage = '';
  let showRemaining = true;

  if (status === 'accomplished') {
    chartData = [{ name: 'Accomplished', value: periodTarget, fill: 'var(--accent--primary-1)' }];
    displayPercentage = '100%';
    displayDays = 0;
    statusMessage = rawPercentage >= 100 ? 'Goal Accomplished!' : 'Target Date Passed';
    showRemaining = false;
  } else if (status === 'missed') {
    statusMessage = 'Target Missed';
  }

  const formattedTarget = `$${monthlyTarget?.toLocaleString()}`;
  const periodLabel = getPeriodLabel(timeframe);

  return (
    <>
      {monthlyTarget === null || targetDate === null ? (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem" mb={2}>
              Cash Flow Goal
            </Typography>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Target monthly cash flow"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                type="number"
                inputProps={{
                  min: monthlyEquivalent,
                  step: 0.01,
                }}
                helperText={`Must be higher than current monthly equivalent ($${monthlyEquivalent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`}
              />
              <DatePicker
                label="Target date"
                value={targetDateInput}
                onChange={(newValue) => setTargetDateInput(newValue)}
                minDate={new Date()}
                slotProps={{
                  textField: { variant: 'outlined', size: 'small' },
                }}
              />
              <Button variant="contained" onClick={handleSubmit} size="small">
                Set Goal
              </Button>
            </Stack>
            {monthlyTarget !== null && targetDate === null && (
              <Typography color="error.main" variant="caption" display="block" mt={1}>
                Please select a target date.
              </Typography>
            )}
            {targetDate !== null && monthlyTarget === null && (
              <Typography color="error.main" variant="caption" display="block" mt={1}>
                Please enter a target monthly cash flow higher than current.
              </Typography>
            )}
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
          </Box>
        </LocalizationProvider>
      ) : (
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
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Cash Flow Goal ({periodLabel})
              </Typography>
              {statusMessage && (
                <Typography
                  fontSize="1.4rem"
                  fontWeight={600}
                  color={status === 'accomplished' ? 'success.main' : 'error.main'}
                  mb={2}
                >
                  {statusMessage}
                </Typography>
              )}
              <Box display="flex" alignItems="center" gap={1} mb={4}>
                <Typography fontSize="2.8rem" fontWeight={700}>
                  {formattedTarget}
                </Typography>
                <TrendingChip value={25.4} />
              </Box>
            </Box>
            <Button variant="outlined" size="small" onClick={resetTarget}>
              {status === 'accomplished' ? 'Set New Goal' : 'Reset'}
            </Button>
          </Box>
          <PieChart width={210} height={120} style={{ margin: '0 auto' }}>
            <Pie
              stroke="none"
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={chartData}
              cx={100}
              cy={100}
              innerRadius={status === 'accomplished' ? 0 : 70}
              outerRadius={100}
              labelLine={false}
            />
            <Tooltip />
          </PieChart>
          <Stack display="flex" alignItems="center" gap={1} mt={-6}>
            <Typography fontSize="2.2rem" aria-label={`Progress: ${displayPercentage}`}>
              {displayPercentage}
            </Typography>
            <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
              Days to target
            </Typography>
            <Typography fontSize="1.8rem">{displayDays}</Typography>
          </Stack>
          {showRemaining && (
            <Stack mt={3}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                sx={{ borderBottom: '1px solid var(--border-color)', pb: 1 }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--accent--primary-1)',
                      borderRadius: '100%',
                    }}
                  />
                  <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                    Achieved cash flow
                  </Typography>
                </Box>

                <Typography fontSize="1.2rem">${achieved.toLocaleString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--neutral--600)',
                      borderRadius: '100%',
                    }}
                  />
                  <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                    Remaining to target
                  </Typography>
                </Box>

                <Typography fontSize="1.2rem">${remaining.toLocaleString()}</Typography>
              </Box>
            </Stack>
          )}
          {status === 'accomplished' && (
            <Box mt={3} textAlign="center">
              <Typography color="success.main" fontSize="1.4rem">
                You've reached your goal! 🎉
              </Typography>
            </Box>
          )}

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
        </Box>
      )}
      <InfoDialog
        title="Cash Flow Goal"
        open={isOpenInfoDialog}
        content={
          <Stack px={2} gap={3} mb={2}>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Formula</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                Progress % = min(100, (Current Period Cash Flow / (Monthly Target × Period Months))
                × 100)
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: '700' }}>Overview</Typography>
              <Typography
                sx={{ fontWeight: '400' }}
                fontSize="1.4rem"
                color="var(--text-color-secondary)"
              >
                This chart shows your progress towards your monthly cash flow goal, limited to the
                selected timeframe. The 'Progress %' indicates current cash flow as a percentage of
                the goal (capped at 100%). 'Days to target' is the number of days until your set
                target date.
              </Typography>
            </Box>
          </Stack>
        }
        onClose={handleCloseInfoDialog}
      />
    </>
  );
};

export default DaysToGoalChart;
