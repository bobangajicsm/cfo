import { Button } from "@mui/material";
import React from "react";

interface ButtonPrimaryProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <Button
      {...props}
      sx={{
        backgroundColor: "var(--mui-elements-bg-color)",
        color: "var(--mui-elements-color)",
        textTransform: "none",
        fontSize: "1.2rem",
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonPrimary;
