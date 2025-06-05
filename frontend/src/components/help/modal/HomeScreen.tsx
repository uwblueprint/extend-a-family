import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NeedHelpModalProps, ModalHandlers } from "./types";

interface HomeScreenProps extends NeedHelpModalProps {
  handlers: ModalHandlers;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ open, handlers }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handlers.handleClose}
      PaperProps={{
        sx: {
          display: "flex",
          width: "600px",
          height: "400px",
          padding: "32px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.Neutral[400]}`,
          background: theme.palette.Neutral[100],
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton onClick={handlers.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography
        variant="headlineMedium"
        color={theme.palette.Neutral[700]}
        sx={{
          textAlign: "left",
          marginTop: "8px",
        }}
      >
        Need Help?
      </Typography>

      <DialogContent
        sx={{
          padding: 0,
          width: "100%",
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* Content Help Frame */}
          <Box
            onClick={handlers.handleContentClick}
            sx={{
              display: "flex",
              padding: "16px 20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              alignSelf: "stretch",
              borderRadius: "4px",
              border: `1px dashed ${theme.palette.Learner.Default}`,
              background: theme.palette.Learner.Light,
              cursor: "pointer",
              "&:hover": {
                background: theme.palette.Learner.Hover,
              },
              minHeight: "fit-content",
            }}
          >
            <Typography
              variant="bodySmall"
              sx={{
                alignSelf: "stretch",
                color: theme.palette.Learner.Default,
              }}
            >
              Help me with
            </Typography>
            <Typography
              variant="headlineMedium"
              sx={{
                alignSelf: "stretch",
                color: theme.palette.Learner.Default,
              }}
            >
              Content
            </Typography>
            <Typography
              variant="bodySmall"
              sx={{
                alignSelf: "stretch",
                color: theme.palette.Neutral[500],
              }}
            >
              We will tell your facilitator. They will help you at your next
              meeting.
            </Typography>
          </Box>

          {/* Navigation Help Frame */}
          <Box
            onClick={handlers.handleNavigationClick}
            sx={{
              display: "flex",
              padding: "16px 20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              alignSelf: "stretch",
              borderRadius: "4px",
              border: `1px dashed ${theme.palette.Learner.Default}`,
              background: theme.palette.Learner.Light,
              cursor: "pointer",
              "&:hover": {
                background: theme.palette.Learner.Hover,
              },
              minHeight: "fit-content",
            }}
          >
            <Typography
              variant="bodySmall"
              sx={{
                alignSelf: "stretch",
                color: theme.palette.Learner.Default,
              }}
            >
              Help me with
            </Typography>
            <Typography
              variant="headlineMedium"
              sx={{
                alignSelf: "stretch",
                color: theme.palette.Learner.Default,
              }}
            >
              Navigating
            </Typography>
            <Typography
              variant="bodySmall"
              sx={{
                alignSelf: "stretch",
                color: theme.palette.Neutral[500],
              }}
            >
              We will show you the important controls. A tutorial will help you
              learn.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default HomeScreen;
