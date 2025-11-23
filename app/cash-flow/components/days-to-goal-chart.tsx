import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Tooltip, PieChart, Pie } from "recharts";

import InfoDialog from "~/components/info-dialog";
import TrendingChip from "~/components/trending-chip";
import ButtonIcon from "~/components/button-icon";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

const currentCashFlow = 2675;
const currentDays = 30;
const growthRate = 0.128; // Based on the 12.8% trending value, assuming monthly growth

const DaysToGoalChart = () => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [targetInput, setTargetInput] = useState("");
  const [targetGoal, setTargetGoal] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cashFlowGoal");
    if (saved) {
      setTargetGoal(parseInt(saved, 10));
    }
  }, []);

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  const handleSubmit = () => {
    const num = Number(targetInput);
    if (!isNaN(num) && num > 0) {
      setTargetGoal(num);
      localStorage.setItem("cashFlowGoal", num.toString());
      setTargetInput("");
    }
  };

  const resetTarget = () => {
    setTargetGoal(null);
    localStorage.removeItem("cashFlowGoal");
    setTargetInput("");
  };

  if (targetGoal === null) {
    return (
      <Box
        sx={{
          position: "relative",
          backgroundColor: "var(--bg-color-secondary)",
          borderRadius: 2,
          border: "1px solid var(--border-color)",
          px: 2,
          py: 2,
          mb: 2,
        }}
      >
        <Typography
          color="var(--text-color-secondary)"
          fontSize="1.2rem"
          mb={2}
        >
          Cash flow goal
        </Typography>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            label="Target monthly cash flow"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            type="number"
            size="small"
          />
          <Button variant="contained" onClick={handleSubmit} size="small">
            Set Goal
          </Button>
        </Stack>
      </Box>
    );
  }

  // Calculate days based on target
  let daysToGoal = 0;
  let totalDays = currentDays;
  if (targetGoal > currentCashFlow) {
    const growthFactor = 1 + growthRate;
    const n = Math.log(targetGoal / currentCashFlow) / Math.log(growthFactor);
    const monthsNeeded = Math.ceil(n);
    daysToGoal = monthsNeeded * 30;
    totalDays = currentDays + daysToGoal;
  }
  const daysLeft = totalDays - currentDays;

  const chartData = [
    { name: "Progress", value: currentDays, fill: "var(--accent--primary-1)" },
    { name: "Remaining", value: daysLeft, fill: "var(--neutral--600)" },
  ];

  const formattedTarget = `$${targetGoal.toLocaleString()}`;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "var(--bg-color-secondary)",
          borderRadius: 2,
          border: "1px solid var(--border-color)",
          px: 2,
          py: 2,
          mb: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
              Cash flow goal
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={4}>
              <Typography fontSize="2.8rem" fontWeight={700}>
                {formattedTarget}
              </Typography>
              <TrendingChip value={12.8} />
            </Box>
          </Box>
        </Box>
        <PieChart width={210} height={120} style={{ margin: "0 auto" }}>
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
        <Stack display="flex" alignItems="center" gap={0} mt={-6}>
          <Typography fontSize="2.2rem">{daysLeft}</Typography>
          <Typography fontSize="1.2rem" color="var(--text-color-secondary)">
            Days to goal
          </Typography>
        </Stack>
        <Stack mt={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
            sx={{ borderBottom: "1px solid var(--border-color)", pb: 1 }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "var(--accent--primary-1)",
                  borderRadius: "100%",
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Days since start
              </Typography>
            </Box>

            <Typography fontSize="1.2rem">{currentDays}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "var(--neutral--600)",
                  borderRadius: "100%",
                }}
              />
              <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
                Total days to goal
              </Typography>
            </Box>

            <Typography fontSize="1.2rem">{totalDays}</Typography>
          </Box>
        </Stack>

        <ButtonIcon
          onClick={handleOpenInfoDialog}
          sx={{
            position: "absolute",
            top: "-13px",
            left: "-13px",
            opacity: 0.7,
          }}
        >
          <InfoOutlineIcon sx={{ fontSize: "2rem" }} />
        </ButtonIcon>
      </Box>
      <InfoDialog
        title="Cash Flow Goal"
        shortDescription="This chart shows your progress towards your cash flow goal over a specified period. The pie chart illustrates the number of days that have passed since you started tracking your cash flow compared to the total number of days in your goal period. The 'Days to goal' indicates how many days are left until you reach your target date."
        formula="Net Cash Flow = Operating Cash Flow + Investing Cash Flow + Financing Cash Flow"
        longDescription="Cash flow is the movement of money into or out of a business, project, or financial product. It is a key indicator of financial health. Positive cash flow means more money is coming in than going out, while negative cash flow indicates the opposite. Understanding cash flow helps in making informed decisions about investments, expenses, and growth strategies."
        youtubeUrl="https://www.youtube.com/embed/HRwK3cbkywk?si=XflznV34c5F-q1EF"
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
      />
    </>
  );
};

export default DaysToGoalChart;
