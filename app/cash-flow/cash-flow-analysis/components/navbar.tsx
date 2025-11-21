import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const breadcrumbs = [
  <Link
    underline="hover"
    key="1"
    color="var(--neutral--400)"
    href="/"
    fontSize="1.2rem"
  >
    Cash Flow
  </Link>,
  <Link underline="hover" key="2" color="var(--neutral--400)">
    Cash Flow Analysis
  </Link>,
];

const Navbar = () => {
  return (
    <Box
      px={2}
      py={1}
      sx={{ borderBottom: 1, borderColor: "var(--border-color)" }}
    >
      <Typography variant="h1" fontSize="2.4rem">
        Cash Flow Analysis
      </Typography>
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            sx={{ color: "var(--neutral--400)", fontSize: "1.2rem" }}
          />
        }
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
};

export default Navbar;
