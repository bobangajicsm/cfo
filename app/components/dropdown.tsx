import { Select, type SelectProps } from "@mui/material";
import React from "react";

const Dropdown = ({ children, ...props }: SelectProps<string>) => {
  return (
    <Select
      {...props}
      size="small"
      sx={{
        height: "3rem",
        borderRadius: 0.5,
        borderColor: "var(--mui-elements-color)",
        backgroundColor: "var(--mui-elements-bg-color)",
        color: "var(--mui-elements-color)",
        lineHeight: 0,
        "& .MuiSelect-select": {
          height: 30,
          fontSize: "1.2rem",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          borderColor: "var(--mui-elements-color)",
          backgroundColor: "var(--mui-elements-bg-color)",
          color: "var(--mui-elements-color)",
        },
        "& .MuiInputLabel-root": {
          fontSize: "1.2em",
          transform: "translate(14px, -6px) scale(0.75)",
        },
        "& .MuiSvgIcon-root": {
          fontSize: "1.2rem",
          color: "var(--neutral--400)",
        },
      }}
      MenuProps={{
        sx: {
          "& .MuiMenu-paper": {
            maxHeight: 200,
            borderRadius: 0.5,
            borderColor: "var(--mui-elements-color)",
            backgroundColor: "var(--mui-elements-bg-color)",
            color: "var(--mui-elements-color)",
          },
          "& .MuiMenuItem-root": {
            fontSize: "1.2rem",
            minHeight: 28,
            padding: "4px 12px",
            backgroundColor: "var(--mui-elements-bg-color)",
            color: "var(--mui-elements-color)",
          },
        },
      }}
    >
      {children}
    </Select>
  );
};

export default Dropdown;
