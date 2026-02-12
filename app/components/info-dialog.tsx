import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import { Box, DialogActions, Link, Typography } from '@mui/material';
import ButtonIcon from '~/components/button-icon';
import ButtonPrimary from '~/components/button-primary';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ServiceProviderDialog from '~/components/service-provider-dialog';
import { useState } from 'react';

export interface InfoDialogProps {
  open: boolean;
  title: string;
  shortDescription?: string;
  formula?: string;
  longDescription?: string;
  youtubeUrl?: string;
  content?: React.ReactNode;
  onClose: () => void;
}

const InfoDialog = ({
  onClose,
  open,
  title,
  shortDescription,
  formula,
  longDescription,
  youtubeUrl,
  content,
}: InfoDialogProps) => {
  const [isOpenServiceProviderDialog, setIsOpenServiceProviderDialog] = useState(false);

  const handleOpenServiceProviderDialog = () => {
    onClose();
    setIsOpenServiceProviderDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setIsOpenServiceProviderDialog(false);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{
          backdropFilter: 'blur(5px)',
          '& .MuiPaper-root': {
            color: 'var(--text-color-primary)',
            backgroundColor: 'rgba(var(--bg-color-secondary-alpha), 0.95)',
            borderRadius: 2,
            border: '1px solid var(--border-color)',
            overflow: 'visible',
          },
        }}
      >
        <Box sx={{ overflow: 'scroll' }}>
          <DialogTitle>
            <Typography fontSize="2rem" fontWeight={600}>
              {title}
            </Typography>
          </DialogTitle>

          {youtubeUrl && (
            <Box p={2}>
              <iframe
                width="100%"
                height="315"
                src={youtubeUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </Box>
          )}

          {content && content}

          {shortDescription && (
            <Box p={2}>
              <Typography fontSize="1.4rem" color="var(--text-color-secondary)">
                {shortDescription}
              </Typography>
            </Box>
          )}

          {formula && (
            <Box p={2}>
              <Typography
                fontSize="1.2rem"
                fontFamily="monospace"
                color="var(--text-color-primary)"
                sx={{
                  backgroundColor: 'var(--bg-color-tertiary)',
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {formula}
              </Typography>
            </Box>
          )}

          {longDescription && (
            <Box p={2}>
              <Typography fontSize="1.1rem" color="var(--text-color-secondary)" lineHeight={1.6}>
                {longDescription}
              </Typography>
            </Box>
          )}

          <DialogActions
            sx={{
              p: 2,
              borderTop: '1px solid var(--border-color)',
              justifyContent: 'space-between',
            }}
          >
            <Link component="a" href="https://google.com" target="_blank" rel="noopener noreferrer">
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon sx={{ fontSize: '1.4rem !important' }} />}
                size="small"
              >
                Visit Academy
              </Button>
            </Link>
            <ButtonPrimary onClick={handleOpenServiceProviderDialog}>
              Service Provider
            </ButtonPrimary>
          </DialogActions>
          <ButtonIcon
            sx={{
              position: 'absolute',
              top: '-13px',
              right: '-13px',
              opacity: 0.7,
            }}
            onClick={handleClose}
          >
            <CloseIcon
              sx={{
                fontSize: '2rem',
              }}
            />
          </ButtonIcon>
        </Box>
      </Dialog>
      <ServiceProviderDialog open={isOpenServiceProviderDialog} onClose={handleCloseInfoDialog} />
    </>
  );
};

export default InfoDialog;
