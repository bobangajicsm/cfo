import React, { useState } from "react";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { Link } from "react-router";

import {
  Box,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import InfoDialog from "~/components/info-dialog/info-dialog";

const data2025 = [
  { month: "Jan", earnings: 3500, expenses: 2500 },
  { month: "Feb", earnings: 4200, expenses: 2800 },
  { month: "Mar", earnings: 3000, expenses: 3200 },
  { month: "Apr", earnings: 5000, expenses: 2200 },
  { month: "May", earnings: 4800, expenses: 2600 },
  { month: "Jun", earnings: 5300, expenses: 2400 },
  { month: "Jul", earnings: 6000, expenses: 3000 },
  { month: "Aug", earnings: 5800, expenses: 2700 },
  { month: "Sep", earnings: 6200, expenses: 2900 },
  { month: "Oct", earnings: 7000, expenses: 3100 },
  { month: "Nov", earnings: 7500, expenses: 3300 },
  { month: "Dec", earnings: 8000, expenses: 3500 },
];

const data2024 = [
  { month: "Jan", earnings: 3200, expenses: 2600 },
  { month: "Feb", earnings: 3900, expenses: 2900 },
  { month: "Mar", earnings: 3100, expenses: 3400 },
  { month: "Apr", earnings: 4600, expenses: 2300 },
  { month: "May", earnings: 4400, expenses: 2700 },
  { month: "Jun", earnings: 4900, expenses: 2500 },
  { month: "Jul", earnings: 5600, expenses: 3100 },
  { month: "Aug", earnings: 5400, expenses: 2800 },
  { month: "Sep", earnings: 5800, expenses: 3000 },
  { month: "Oct", earnings: 6600, expenses: 3200 },
  { month: "Nov", earnings: 7100, expenses: 3400 },
  { month: "Dec", earnings: 7300, expenses: 3500 },
];

const yearData: Record<string, typeof data2025> = {
  "2024": data2024,
  "2025": data2025,
};

const CashFlowChart = () => {
  const [date, setDate] = useState("2025");
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);

  const handleOpenInfoDialog = () => {
    setIsOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenInfoDialog(false);
  };

  const currentData = yearData[date];
  const netCurrent = currentData.reduce(
    (acc, { earnings, expenses }) => acc + earnings - expenses,
    0
  );
  const avgNet = Math.round(netCurrent / 12);

  const previousYear = (parseInt(date) - 1).toString();
  const hasPrevious = previousYear in yearData;
  const netPrevious = hasPrevious
    ? yearData[previousYear].reduce(
        (acc, { earnings, expenses }) => acc + earnings - expenses,
        0
      )
    : netCurrent;
  const growthRate = hasPrevious
    ? ((netCurrent - netPrevious) / netPrevious) * 100
    : 0;
  const percentage = Math.abs(growthRate).toFixed(1) + "%";

  const isUp = growthRate > 0;
  const isDown = growthRate < 0;

  let color, bgColor, borderColor, IconComponent, percentageDisplay;
  if (isUp) {
    color = "var(--system--green-300)";
    bgColor = "rgba(var(--system--green-300-alpha), 0.2)";
    borderColor = "rgba(var(--system--green-300-alpha), 0.2)";
    IconComponent = TrendingUpIcon;
    percentageDisplay = `+${percentage}`;
  } else if (isDown) {
    color = "var(--system--300)";
    bgColor = "rgba(var(--system--300-alpha), 0.2)";
    borderColor = "rgba(var(--system--300-alpha), 0.2)";
    IconComponent = TrendingDownIcon;
    percentageDisplay = `-${percentage}`;
  } else {
    color = "var(--text-color-secondary)";
    bgColor = "var(--neutral--700)";
    borderColor = "var(--neutral--700)";
    IconComponent = TrendingFlatIcon;
    percentageDisplay = "0%";
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "var(--bg-color-secondary)",
          borderRadius: 2,
          border: "1px solid var(--border-color)",
          px: 2,
          pt: 2,
          pb: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box component={Link} to="/cash-flow/analysis">
            <Typography
              color="var(--text-color-secondary)"
              fontSize={"1.2rem"}
              mb={0.5}
            >
              Net passive cash flow
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize={"2.8rem"} fontWeight={700}>
                ${avgNet}
              </Typography>
              <Box display="flex" gap={0.5} alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    color,
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 0.5,
                    py: 0.2,
                    px: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: "0.4rem",
                      height: "0.4rem",
                      backgroundColor: color,
                      borderRadius: "100%",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  >
                    {percentageDisplay}
                  </Typography>
                  <IconComponent
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: "0.8rem",
                height: "0.8rem",
                backgroundColor: "#6c72ff",
                borderRadius: "100%",
              }}
            />
            <Typography color="var(--text-color-secondary)" fontSize={"1.2rem"}>
              Revenue
            </Typography>
            <Box
              sx={{
                width: "0.8rem",
                height: "0.8rem",
                backgroundColor: "#57c3ff",
                borderRadius: "100%",
              }}
            />
            <Typography color="var(--text-color-secondary)" fontSize={"1.2rem"}>
              Expenses
            </Typography>
          </Box>
          <Select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            input={<OutlinedInput startAdornment={<CalendarTodayIcon />} />}
            size="small"
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              width: "9.2rem",
              height: "3rem",
              "& .MuiSelect-select": {
                height: 30,
                fontSize: "1.2rem",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                color: "var(--neutral--400)",
              },
              "& .MuiInputLabel-root": {
                fontSize: "1.2em",
                transform: "translate(14px, -6px) scale(0.75)",
              },

              border: "1px solid var(--neutral--600)",
              borderRadius: 0.5,
              backgroundColor: "var(--neutral--700)",
              color: "var(--neutral--400)",

              "& .MuiSvgIcon-root": {
                fontSize: "1.2rem",
                color: "var(--neutral--400)",
              },
            }}
            MenuProps={{
              sx: {
                "& .MuiMenu-paper": {
                  maxHeight: 200,
                  backgroundColor: "var(--neutral--700)",
                  border: "1px solid var(--neutral--600)",
                  borderRadius: 0.5,
                },
                "& .MuiMenuItem-root": {
                  fontSize: "1.2rem",
                  minHeight: 28,
                  padding: "4px 12px",
                  color: "var(--neutral--400)",
                  "&:hover": {
                    backgroundColor: "var(--neutral--800)",
                  },
                },
              },
            }}
          >
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
          </Select>
        </Box>
        <BarChart
          style={{
            width: "100%",
            aspectRatio: 1.618,
          }}
          responsive
          data={currentData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray=""
            vertical={false}
            stroke="var(--border-color-secondary)"
          />
          <XAxis
            dataKey="month"
            stroke="var(--text-color-secondary)"
            tickLine={false}
            fontSize="1rem"
          />
          <YAxis
            width="auto"
            stroke="var(--text-color-secondary)"
            tickLine={false}
            axisLine={false}
            fontSize="1.2rem"
          />

          <Bar
            dataKey="earnings"
            fill="var(--accent)"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
          <Bar
            dataKey="expenses"
            fill="var(--ternary)"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
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
        title="Net Passive Cash Flow"
        description="This chart displays your monthly earnings and expenses for the selected year. Use it to track your cash flow trends over time."
        open={isOpenInfoDialog}
        onClose={handleCloseInfoDialog}
      />
    </>
  );
};

export default CashFlowChart;
