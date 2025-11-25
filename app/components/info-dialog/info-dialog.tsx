import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

import { Box, IconButton, Typography } from '@mui/material';

export interface InfoDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

const InfoDialog = ({ onClose, open, title, description }: InfoDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        backgroundColor: 'rgba(var(--bg-color-alpha), 0.7)',
        backdropFilter: 'blur(5px)',
        '& .MuiPaper-root': {
          color: 'var(--text-color-primary)',
          backgroundColor: 'var(--bg-color-secondary)',
          borderRadius: 2,
          border: '1px solid var(--border-color)',
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h1" fontSize={'2rem'} fontWeight={600}>
          {title}
        </Typography>
      </DialogTitle>

      <Box p={2}>
        <Typography fontSize="1.4rem" color="var(--text-color-secondary)">
          {description}
        </Typography>
      </Box>
      <IconButton
        onClick={handleClose}
        sx={{
          backgroundColor: 'rgba(var(--accent--primary-1-alpha), 0.3)',
          color: 'var(--text-color-secondary)',
          '&:hover': {
            backgroundColor: 'rgba(var(--accent--primary-1-alpha), 1)',
            color: 'white',
          },
          position: 'absolute',
          top: '-13px',
          right: '-13px',
          padding: 0.5,
        }}
      >
        <CloseIcon
          sx={{
            fontSize: '2rem',
          }}
        />
      </IconButton>
    </Dialog>
  );
};

export default InfoDialog;
