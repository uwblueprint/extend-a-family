import { ExpandMore } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";

import * as React from "react";
import { FeedbackPopulated } from "../../types/FeedbackTypes";
import FeedbackCard, { RatingOfFive } from "./FeedbackCard";

interface LearnerFeedbackBlockProps {
  learnerName: string;
  feedbacks: FeedbackPopulated[];
}

const LearnerFeedbackBlock: React.FC<LearnerFeedbackBlockProps> = ({
  learnerName,
  feedbacks,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  // calculate average difficulty and liked
  const avgDifficulty = feedbacks.length > 0
    ? Math.round(feedbacks.reduce((sum, f) => sum + f.difficulty, 0) / feedbacks.length)
    : 0;
  const likedPercentage = feedbacks.length > 0
    ? Math.round((feedbacks.filter(f => f.isLiked).length / feedbacks.length) * 100)
    : 0;

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
          {learnerName}
        </Typography>
        <Typography variant="titleMedium" color={theme.palette.Neutral[700]}>
          {feedbacks.length} Feedback{feedbacks.length !== 1 ? 's' : ''}
        </Typography>
        <Stack direction="column" gap="24px" alignItems="center">
          <Stack direction="row" gap="64px" alignItems="center">
            <Stack direction="row" gap="16px" alignItems="center">
              <RatingOfFive rating={avgDifficulty} />
              <Typography
                variant="titleMedium"
                color={theme.palette.Neutral[600]}
              >
                Avg Difficulty
              </Typography>
            </Stack>
            <Typography
              variant="titleMedium"
              color={theme.palette.Neutral[600]}
            >
              {likedPercentage}% Liked
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
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              title={feedback.moduleId.title}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default LearnerFeedbackBlock;
