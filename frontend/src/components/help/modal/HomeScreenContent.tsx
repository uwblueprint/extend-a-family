import React from "react";
import { DialogContent, Typography, Box } from "@mui/material";
import { Theme } from "@mui/material/styles";

interface HomeScreenContentProps {
  handleContentClick: () => void;
  handleNavigationClick: () => void;
  theme: Theme;
}

const HomeScreenContent: React.FC<HomeScreenContentProps> = ({
  handleContentClick,
  handleNavigationClick,
  theme,
}) => {
  return (
    <>
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
            onClick={handleContentClick}
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
            onClick={handleNavigationClick}
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
    </>
  );
};

export default HomeScreenContent;
