import { ExpandMore } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";

import * as React from "react";
import FeedbackCard, { RatingOfFive } from "./FeedbackCard";

const LearnerFeedbackBlock = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Stack
      direction="column"
      alignSelf="stretch"
      sx={{
        borderRadius: "8px",
        border: `1px solid ${theme.palette.Neutral[300]}`,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="24px"
        width="100%"
        sx={{
          background: theme.palette.Facilitator.Light.Default,
        }}
      >
        <Typography variant="titleMedium" color={theme.palette.Neutral[700]}>
          Olivia C.
        </Typography>
        <Typography variant="titleMedium" color={theme.palette.Neutral[700]}>
          Unit 1
        </Typography>
        <Stack direction="column" gap="24px" alignItems="center">
          <Stack direction="row" gap="64px" alignItems="center">
            <Stack direction="row" gap="16px" alignItems="center">
              <RatingOfFive rating={3} />
              <Typography
                variant="titleMedium"
                color={theme.palette.Neutral[600]}
              >
                Easy
              </Typography>
            </Stack>
            <Typography
              variant="titleMedium"
              color={theme.palette.Neutral[600]}
            >
              100% Liked
            </Typography>
            <IconButton
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMore sx={{ fontSize: "32px" }} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      {expanded && (
        <Stack
          direction="row"
          rowGap="12px"
          columnGap="12px"
          padding="24px"
          flexWrap="wrap"
          sx={{ background: theme.palette.Neutral[200] }}
        >
          {/* Mock feedback data */}
          <FeedbackCard
            feedback={{
              id: "1",
              learnerId: "1",
              moduleId: "1",
              isLiked: true,
              difficulty: 3,
              message: "Great lesson!",
              createdAt: "2024-01-01",
            }}
            title="Feedback 1"
          />
          <FeedbackCard
            feedback={{
              id: "2",
              learnerId: "2",
              moduleId: "1",
              isLiked: false,
              difficulty: 4,
              message: "Too hard.",
              createdAt: "2024-01-02",
            }}
            title="Feedback 2"
          />
          <FeedbackCard
            feedback={{
              id: "3",
              learnerId: "3",
              moduleId: "1",
              isLiked: true,
              difficulty: 2,
              message: "Loved it!",
              createdAt: "2024-01-03",
            }}
            title="Feedback 3"
          />
          <FeedbackCard
            feedback={{
              id: "4",
              learnerId: "4",
              moduleId: "1",
              isLiked: false,
              difficulty: 5,
              message: "Not engaging.",
              createdAt: "2024-01-04",
            }}
            title="Feedback 4"
          />
          <FeedbackCard
            feedback={{
              id: "5",
              learnerId: "5",
              moduleId: "1",
              isLiked: true,
              difficulty: 1,
              message: "Very easy to follow.",
              createdAt: "2024-01-05",
            }}
            title="Feedback 5"
          />
        </Stack>
      )}
    </Stack>
  );
};

export default LearnerFeedbackBlock;
