import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Tooltip, PieChart, Pie } from "recharts";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import InfoDialog from "~/components/info-dialog/info-dialog";

const currentDays = 30;
const totalDays = 167;
const daysLeft = totalDays - currentDays;

const chartData = [
  { name: "Progress", value: currentDays, fill: "#6c72ff" },
  { name: "Remaining", value: daysLeft, fill: "#37446b" },
];

const DaysToGoalChart = () => {
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
            <Typography
              color="var(--text-color-secondary)"
              fontSize={"1.2rem"}
              mb={0.5}
            >
              Cash flow goal
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={4}>
              <Typography fontSize={"2.8rem"} fontWeight={700}>
                $5350
              </Typography>
              <Box display="flex" gap={0.5} alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    color: "var(--system--green-300)",
                    backgroundColor:
                      "rgba(var(--system--green-300-alpha), 0.2)",
                    border:
                      "1px solid rgba(var(--system--green-300-alpha), 0.2)",
                    borderRadius: 0.5,
                    py: 0.2,
                    px: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: "0.4rem",
                      height: "0.4rem",
                      backgroundColor: "var(--system--green-300)",
                      borderRadius: "100%",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  >
                    12.8%
                  </Typography>
                  <TrendingUpIcon
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                </Box>
              </Box>
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
          <Typography fontSize="2.2rem">137</Typography>
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
                  backgroundColor: "#6c72ff",
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
                  backgroundColor: "#6c72ff",
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
        <IconButton
          onClick={handleOpenInfoDialog}
          sx={{
            backgroundColor: "rgba(var(--accent--primary-1-alpha), 0.3)",
            color: "var(--text-color-secondary)",
            "&:hover": {
              backgroundColor: "rgba(var(--accent--primary-1-alpha), 1)",
              color: "white",
            },
            position: "absolute",
            top: "-13px",
            right: "-13px",
            padding: 0.5,
          }}
        >
          <InfoOutlineIcon
            sx={{
              fontSize: "2rem",
            }}
          />
        </IconButton>
      </Box>
      <InfoDialog
        title="Cash Flow Goal"
        description="This chart shows your progress towards your cash flow goal over a specified period. The pie chart illustrates the number of days that have passed since you started tracking your cash flow compared to the total number of days in your goal period. The 'Days to goal' indicates how many days are left until you reach your target date."
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
      />
    </>
  );
};

export default DaysToGoalChart;
