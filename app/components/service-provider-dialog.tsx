import * as React from "react";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

import { Avatar, Box, Link, Stack, Typography } from "@mui/material";
import ButtonIcon from "~/components/button-icon";

import ServiceProvderAvatar from "~/assets/images/john-smith.jpg";

export interface ServiceProviderDialogProps {
  open: boolean;
  onClose: () => void;
}

const ServiceProviderDialog = ({
  onClose,
  open,
}: ServiceProviderDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        backdropFilter: "blur(5px)",
        "& .MuiPaper-root": {
          color: "var(--text-color-primary)",
          backgroundColor: "rgba(var(--bg-color-secondary-alpha), 0.95)",
          borderRadius: 2,
          border: "1px solid var(--border-color)",
          overflow: "visible",
        },
      }}
    >
      <DialogTitle>
        <Typography fontSize="2rem" fontWeight={600}>
          Service Provider
        </Typography>
      </DialogTitle>

      <Box p={2}>
        <Box
          display="flex"
          gap={2}
          pb={3}
          mb={3}
          alignItems="center"
          sx={{
            borderBottom: `1px solid var(--border-color)`,
          }}
        >
          <Avatar
            sx={{ width: 80, height: 80 }}
            alt="John Smith"
            src={ServiceProvderAvatar}
          />
          <Stack>
            <Typography variant="h3" fontSize="2.4rem">
              John Smith
            </Typography>
            <Typography color="var(--text-color-secondary)">
              Certified Financial Planner
            </Typography>
          </Stack>
        </Box>
        <Stack gap={1}>
          <Typography mb={2}>
            Expert in cash flow management and financial planning with over 10
            years of experience helping individuals and businesses optimize
            their financial health.
          </Typography>
          <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
            Email:{" "}
            <Link
              sx={{
                color: "var(--text-color-secondary)",
                fontWeight: 600,
              }}
              href="mailto:expert@mycashfloworganizer.com"
            >
              expert@mycashfloworganizer.com
            </Link>
          </Typography>
          <Typography color="var(--text-color-secondary)" fontSize="1.2rem">
            Phone:{" "}
            <Link
              sx={{
                color: "var(--text-color-secondary)",
                fontWeight: 600,
              }}
              href="tel:+15551234567"
            >
              +1 (555) 123-4567
            </Link>
          </Typography>
        </Stack>
      </Box>
      <ButtonIcon
        sx={{
          position: "absolute",
          top: "-13px",
          right: "-13px",
          opacity: 0.7,
        }}
        onClick={handleClose}
      >
        <CloseIcon
          sx={{
            fontSize: "2rem",
          }}
        />
      </ButtonIcon>
    </Dialog>
  );
};

export default ServiceProviderDialog;
