import { IconButton } from "@mui/material";

import React from "react";

interface ButtonIconProps extends React.ComponentProps<typeof IconButton> {
  children?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const ButtonIcon = ({ onClick, children, ...props }: ButtonIconProps) => (
  <IconButton
    {...props}
    onClick={onClick}
    sx={{
      backgroundColor: "rgba(var(--accent--primary-1-alpha), 0.2)",
      color: "var(--text-color-secondary)",
      "&:hover": {
        backgroundColor: "rgba(var(--accent--primary-1-alpha), 1)",
        color: "white",
      },
      padding: 0.5,
      ...props.sx,
    }}
  >
    {children}
  </IconButton>
);

export default ButtonIcon;
