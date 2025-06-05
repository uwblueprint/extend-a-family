import React from "react";
import {
  Dialog,
  Typography,
  Box,
  IconButton,
  useTheme,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NeedHelpModalProps, ModalHandlers } from "./types";

interface ConfirmationScreenProps extends NeedHelpModalProps {
  handlers: ModalHandlers;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  open,
  handlers,
}) => {
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
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.Neutral[400]}`,
          background: theme.palette.Neutral[100],
        },
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton onClick={handlers.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          flex: "1 0 0",
          alignSelf: "stretch",
        }}
      >
        {/* Checkmark Frame */}
        <Box
          sx={{
            display: "flex",
            padding: "12px",
            alignItems: "center",
            gap: "8px",
            borderRadius: "5000px",
            border: `1px solid ${theme.palette.Neutral[700]}`,
          }}
        >
          <Box
            sx={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill={theme.palette.Neutral[700]}
              />
            </svg>
          </Box>
        </Box>

        {/* Text Frame */}
        <Box
          sx={{
            display: "flex",
            width: "476px",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            borderRadius: "4px",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.Neutral[700],
              fontFamily: "Lexend Deca",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            We let your facilitator know.
          </Typography>
          <Typography
            sx={{
              color: theme.palette.Neutral[500],
              fontFamily: "Lexend Deca",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0.32px",
              textAlign: "center",
            }}
          >
            They will help you during your next meeting.
          </Typography>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <Typography
          onClick={(e) => {
            e.stopPropagation();
            handlers.handleBackToHome();
          }}
          sx={{
            color: theme.palette.Learner.Default,
            textAlign: "center",
            fontFamily: "Lexend Deca",
            fontSize: "14px",
            fontWeight: 300,
            lineHeight: "120%",
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Back to Home
        </Typography>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handlers.handleBackToContent();
          }}
          sx={{
            display: "flex",
            height: "45px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "4px",
            background: theme.palette.Learner.Default,
            padding: "10px 24px",
            minWidth: "auto",
            width: "auto",
            "&:hover": {
              background: theme.palette.Learner.Pressed,
            },
          }}
        >
          <Typography
            sx={{
              color: theme.palette.Neutral[100],
              textAlign: "center",
              fontFamily: "Lexend Deca",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "120%",
              letterSpacing: "0.7px",
              textTransform: "uppercase",
            }}
          >
            Back to Content
          </Typography>
        </Button>
      </Box>
    </Dialog>
  );
};

export default ConfirmationScreen;
