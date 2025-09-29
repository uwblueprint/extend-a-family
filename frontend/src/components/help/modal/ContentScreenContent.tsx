import React from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Theme } from "@mui/material/styles";

interface ContentScreenContentProps {
  handleBackToHome: () => void;
  handleNext: () => Promise<void>;
  helpText: string;
  setHelpText: (text: string) => void;
  isSubmitting: boolean;
  theme: Theme;
}

const ContentScreenContent: React.FC<ContentScreenContentProps> = ({
  handleBackToHome,
  handleNext,
  helpText,
  setHelpText,
  isSubmitting,
  theme,
}) => {
  return (
    <>
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
        value={helpText}
        onChange={(e) => setHelpText(e.target.value)}
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
          variant="labelMedium"
          onClick={handleBackToHome}
          sx={{
            color: theme.palette.Learner.Default,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Back to Home
        </Typography>

        <Button
          onClick={handleNext}
          disabled={isSubmitting || !helpText.trim()}
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
            variant="labelMedium"
            sx={{
              color:
                isSubmitting || !helpText.trim()
                  ? theme.palette.Neutral[600]
                  : theme.palette.Neutral[100],
            }}
          >
            {isSubmitting ? "Sending..." : "Next"}
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default ContentScreenContent;
