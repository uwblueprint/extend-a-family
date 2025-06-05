import React from "react";
import {
  Dialog,
  Typography,
  Box,
  IconButton,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NeedHelpModalProps, ModalHandlers, ModalState } from "./types";

interface ContentScreenProps extends NeedHelpModalProps {
  handlers: ModalHandlers;
  state: ModalState;
}

const ContentScreen: React.FC<ContentScreenProps> = ({
  open,
  handlers,
  state,
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

      <Box
        sx={{
          display: "flex",
          height: "48px",
          paddingBottom: "16px",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <Typography
            variant="headlineMedium"
            sx={{
              color: theme.palette.Neutral[700],
              textAlign: "center",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "120%",
            }}
          >
            Help me with content
          </Typography>
        </Box>
      </Box>

      <TextField
        label="What do you need help with?"
        placeholder="I need help with..."
        multiline
        rows={8}
        value={state.helpText}
        onChange={(e) => state.setHelpText(e.target.value)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: "1 0 0",
          alignSelf: "stretch",
          "& .MuiOutlinedInput-root": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: "1 0 0",
            alignSelf: "stretch",
            borderRadius: "4px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.Neutral[500],
              borderRadius: "4px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.Neutral[500],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.Learner.Default,
              borderWidth: "2px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "16px 12px",
            flex: "1 0 0",
            alignSelf: "stretch",
          },
          "& .MuiInputLabel-root": {
            "&.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.85)",
              backgroundColor: theme.palette.Neutral[100],
              padding: "0 4px",
            },
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <Typography
          onClick={handlers.handleBackToHome}
          sx={{
            color: theme.palette.Learner.Default,
            textAlign: "center",
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
          onClick={handlers.handleNext}
          disabled={state.isSubmitting || !state.helpText.trim()}
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
            "&:disabled": {
              background: theme.palette.Neutral[400],
              color: theme.palette.Neutral[600],
            },
          }}
        >
          <Typography
            sx={{
              color:
                state.isSubmitting || !state.helpText.trim()
                  ? theme.palette.Neutral[600]
                  : theme.palette.Neutral[100],
              textAlign: "center",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "120%",
              letterSpacing: "0.7px",
              textTransform: "uppercase",
            }}
          >
            {state.isSubmitting ? "Sending..." : "Next"}
          </Typography>
        </Button>
      </Box>
    </Dialog>
  );
};

export default ContentScreen;
