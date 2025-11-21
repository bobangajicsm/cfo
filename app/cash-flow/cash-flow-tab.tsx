import { Box, Button, Stack, Typography } from "@mui/material";

import CashFlowChart from "~/cash-flow/components/cash-flow-chart";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DaysToGoalChart from "~/cash-flow/components/days-to-goal-chart";
import IncomeTable from "~/cash-flow/components/income-table";
import ExpensesTable from "~/cash-flow/components/expenses-table";

const CashFlowTab = () => {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box
        my={1}
        display="flex"
        justifyContent="space-between"
        alignItems="fles-start"
      >
        <Stack sx={{ maxWidth: "60%" }}>
          <Typography variant="h1" fontSize={"2.2rem"} fontWeight={600}>
            Welcome back, Kevin
          </Typography>
          <Typography
            color="var(--text-color-secondary)"
            mb={3}
            fontSize={"1.2rem"}
          >
            Track spending and build savings.
          </Typography>
        </Stack>
        <Box>
          <Button
            sx={{
              backgroundColor: "var(--neutral--700)",
              color: "var(--neutral--100)",
              textTransform: "none",
              fontSize: "1.2rem",
            }}
          >
            Export data
            <ArrowDownwardIcon sx={{ fontSize: "1.2rem", ml: 0.5 }} />
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <CashFlowChart />
      </Box>
      <DaysToGoalChart />
      <Typography variant="h2" fontSize="2rem" fontWeight={600} mt={4} mb={4}>
        Transactions
      </Typography>
      <IncomeTable />
      <ExpensesTable />
    </Box>
  );
};

export default CashFlowTab;
