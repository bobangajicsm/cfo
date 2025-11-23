import { Box } from "@mui/material";
import React from "react";

interface CardProps extends React.ComponentProps<typeof Box> {
  children: React.ReactNode;
}

const Card = ({ children, ...props }: CardProps) => {
  return (
    <Box
      {...props}
      sx={{
        position: "relative",
        backgroundColor: "var(--bg-color-secondary)",
        borderRadius: 2,
        border: "1px solid var(--border-color)",
        px: 2,
        py: 2,
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
