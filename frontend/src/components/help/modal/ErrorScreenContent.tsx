import { Box, Button, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import React from "react";

interface ErrorScreenContentProps {
  handleBackToContent: () => void;
  theme: Theme;
}

const ErrorScreenContent: React.FC<ErrorScreenContentProps> = ({
  handleBackToContent,
  theme,
}) => {
  return (
    <>
      {/* Error Container */}
      <Box
        sx={{
          display: "flex",
          padding: "20px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        {/* First Heading */}
        <Typography
          variant="headlineMedium"
          sx={{
            color: theme.palette.Neutral[700],
            alignSelf: "stretch",
          }}
        >
          An error occurred
        </Typography>

        {/* Second Header */}
        <Typography
          variant="bodyMedium"
          sx={{
            color: "#681111",
            alignSelf: "stretch",
          }}
        >
          Something went wrong. Please try again later.
        </Typography>
      </Box>

      {/* Bottom Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <Button
          onClick={handleBackToContent}
          sx={{
            display: "flex",
            height: "45px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "4px",
            background: theme.palette.Learner.Dark.Default,
            padding: "10px 24px",
            minWidth: "auto",
            width: "auto",
            "&:hover": {
              background: theme.palette.Learner.Dark.Pressed,
            },
          }}
        >
          <Typography
            variant="labelMedium"
            sx={{
              color: theme.palette.Neutral[100],
            }}
          >
            Try Again
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default ErrorScreenContent;
