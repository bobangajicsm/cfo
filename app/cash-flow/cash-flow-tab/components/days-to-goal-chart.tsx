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

const currentCashFlow = 6676.75;

const DaysToGoalChart = () => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [targetDateInput, setTargetDateInput] = useState<Date | null>(null);
  const [targetGoal, setTargetGoal] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    const savedGoal = localStorage.getItem('cashFlowGoal');
    const savedDateStr = localStorage.getItem('targetDate');
    if (savedGoal) {
      setTargetGoal(parseFloat(savedGoal));
    }
    if (savedDateStr) {
      setTargetDate(new Date(savedDateStr));
    }
  }, []);

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  const handleSubmit = () => {
    const num = parseFloat(targetInput);
    const today = new Date();
    if (!isNaN(num) && num > currentCashFlow && targetDateInput && targetDateInput > today) {
      setTargetGoal(num);
      setTargetDate(targetDateInput);
      localStorage.setItem('cashFlowGoal', num.toString());
      localStorage.setItem('targetDate', targetDateInput.toISOString());
      setTargetInput('');
      setTargetDateInput(null);
    }
  };

  const resetTarget = () => {
    setTargetGoal(null);
    setTargetDate(null);
    localStorage.removeItem('cashFlowGoal');
    localStorage.removeItem('targetDate');
    setTargetInput('');
    setTargetDateInput(null);
  };

  if (targetGoal === null || targetDate === null) {
    return (
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
            Cash flow goal
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
                min: currentCashFlow,
                step: 0.01,
              }}
              helperText={`Must be higher than current cash flow ($${currentCashFlow.toLocaleString()})`}
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
          {targetGoal !== null && targetDate === null && (
            <Typography color="error.main" variant="caption" display="block" mt={1}>
              Please select a target date.
            </Typography>
          )}
          {targetDate !== null && targetGoal === null && (
            <Typography color="error.main" variant="caption" display="block" mt={1}>
              Please enter a target cash flow higher than current (
              {currentCashFlow.toLocaleString()}).
            </Typography>
          )}
        </Box>
      </LocalizationProvider>
    );
  }

  const percentage = Math.round((targetGoal / currentCashFlow) * 100);
  const today = new Date();
  const timeDiff = targetDate.getTime() - today.getTime();
  const daysToTarget = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  const achieved = currentCashFlow;
  const remaining = targetGoal - currentCashFlow;

  const chartData = [
    { name: 'Achieved', value: achieved, fill: 'var(--accent--primary-1)' },
    { name: 'Remaining', value: remaining, fill: 'var(--neutral--600)' },
  ];

  const formattedTarget = `$${targetGoal.toLocaleString()}`;

  return (
    <>
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
              Cash flow goal
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={4}>
              <Typography fontSize="2.8rem" fontWeight={700}>
                {formattedTarget}
              </Typography>
              <TrendingChip value={25.4} />
            </Box>
          </Box>
          <Button variant="outlined" size="small" onClick={resetTarget}>
            Reset
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
            innerRadius={70}
            outerRadius={100}
            labelLine={false}
          />
          <Tooltip />
        </PieChart>
        <Stack display="flex" alignItems="center" gap={1} mt={-6}>
          <Typography fontSize="2.2rem">{percentage}%</Typography>

          <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
            Days to target
          </Typography>
          <Typography fontSize="1.8rem">{daysToTarget}</Typography>
        </Stack>
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
      <InfoDialog
        title="Cash Flow Goal"
        shortDescription="This chart shows your progress towards your cash flow goal. The pie chart illustrates the achieved cash flow compared to the remaining amount needed to reach your target. The 'Target %' indicates the goal as a percentage of current cash flow. 'Days to target' shows the number of days until your set target date."
        formula="Target % = (Target Cash Flow / Current Cash Flow) × 100"
        longDescription="Cash flow is the movement of money into or out of a business, project, or financial product. It is a key indicator of financial health. Positive cash flow means more money is coming in than going out, while negative cash flow indicates the opposite. Setting a target cash flow goal helps in planning growth and making informed decisions about investments, expenses, and strategies."
        youtubeUrl="https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF"
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
      />
    </>
  );
};

export default DaysToGoalChart;
