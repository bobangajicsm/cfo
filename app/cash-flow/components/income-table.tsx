import {
  Box,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

const data = [
  { source: "Salary", amount: "$6,500.00", percentage: "5.2%", trending: "up" },
  {
    source: "Freelance Project",
    amount: "$1,000.00",
    percentage: "5.0%",
    trending: "up",
  },
  {
    source: "Stock Dividends",
    amount: "$200.00",
    percentage: "2.5%",
    trending: "down",
  },
  {
    source: "Rental Property",
    amount: "$700.00",
    percentage: "0%",
    trending: "none",
  },
];

const IncomeTable = () => {
  const [date, setDate] = useState("dec");

  const totalIncome = data.reduce((acc, row) => {
    const numericAmount = parseFloat(row.amount.replace(/[^0-9.-]+/g, ""));
    return acc + (isNaN(numericAmount) ? 0 : numericAmount);
  }, 0);

  return (
    <Box
      sx={{
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
        alignItems="center"
        mb={2}
      >
        <Typography color="white" fontSize={"1.4rem"}>
          Income
        </Typography>

        <Select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          input={<OutlinedInput startAdornment={<CalendarTodayIcon />} />}
          size="small"
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            width: "8.5rem",
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
          <MenuItem value="dec">Dec</MenuItem>
          <MenuItem value="nov">Nov</MenuItem>
        </Select>
      </Box>
      <TableContainer
        sx={{
          backgroundColor: "var(--bg-color-secondary)",
          "& .MuiTableCell-root": {
            color: "white",
            fontSize: "1.2rem",
            borderColor: "var(--neutral--600)",
          },
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Change</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isUp = row.trending === "up";
              const isDown = row.trending === "down";

              let color, bgColor, borderColor, percentageDisplay, IconComponent;

              if (isUp) {
                color = "var(--system--green-300)";
                bgColor = "rgba(var(--system--green-300-alpha), 0.2)";
                borderColor = "rgba(var(--system--green-300-alpha), 0.2)";
                percentageDisplay = `+${row.percentage}`;
                IconComponent = TrendingUpIcon;
              } else if (isDown) {
                color = "var(--system--300)";
                bgColor = "rgba(var(--system--300-alpha), 0.2)";
                borderColor = "rgba(var(--system--300-alpha), 0.2)";
                percentageDisplay = `-${row.percentage}`;
                IconComponent = TrendingDownIcon;
              } else {
                color = "var(--text-color-secondary)";
                bgColor = "var(--neutral--700)";
                borderColor = "var(--neutral--700)";
                percentageDisplay = row.percentage;
                IconComponent = TrendingFlatIcon;
              }

              return (
                <TableRow
                  key={row.source}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.source}
                  </TableCell>
                  <TableCell>
                    <Box
                      display="inline-flex"
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
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                </TableRow>
              );
            })}
            <TableRow
              sx={{
                backgroundColor: "rgba(var(--system--green-300-alpha), 0.05)",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
              >
                Total
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                colSpan={2}
              >
                $
                {totalIncome.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IncomeTable;
