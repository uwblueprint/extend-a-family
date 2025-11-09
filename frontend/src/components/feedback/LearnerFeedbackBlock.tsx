import {
  ExpandMore,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";

import React from "react";

const RatingOfFive = ({
  rating,
  starGap = "8px",
}: {
  rating: number;
  starGap?: string;
}): React.ReactElement => {
  const theme = useTheme();
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    stars.push(
      <Box
        key={`star-${i}`}
        sx={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background:
            i <= rating
              ? theme.palette.Facilitator.Dark.Default
              : theme.palette.Neutral[400],
        }}
      />,
    );
  }
  return (
    <Stack direction="row" gap={starGap} alignItems="center">
      {stars}
    </Stack>
  );
};

const FeedbackCard = (): React.ReactElement => {
  const theme = useTheme();
  return (
    <Stack
      direction="column"
      gap="16px"
      alignItems="flex-start"
      style={{
        flex: "1 0 0",
        borderRadius: "4px",
        border: `1px solid ${theme.palette.Neutral[300]}`,
        background: "white",
        maxWidth: "calc(50% - 12px)",
        minWidth: "calc(50% - 12px)",
      }}
      padding="32px"
    >
      <Typography variant="titleMedium">Module 1</Typography>
      <hr
        style={{
          border: "1px solid",
          width: "100%",
          color: theme.palette.Neutral[300],
          margin: 0,
        }}
      />
      <Stack direction="column" gap="12px">
        <Stack direction="row" gap="24px" alignItems="center">
          <Stack direction="row" gap="12px" alignItems="center">
            <RatingOfFive rating={3} starGap="4px" />
            <Typography variant="bodyMedium" color={theme.palette.Neutral[600]}>
              Easy
            </Typography>
          </Stack>
          <Stack direction="row" gap="12px" alignItems="center">
            <Stack direction="row" gap="8px" alignItems="center">
              <ThumbUpOutlined />
              <ThumbDownOutlined />
            </Stack>
            <Typography variant="titleMedium">Liked</Typography>
          </Stack>
        </Stack>
        <Typography variant="bodyMedium">
          I learned how to save money by making a budget and not spending on
          things I don&apos;t need. It was easy to understand, but more pictures
          or videos would make it even better. The tips were really helpful!
        </Typography>
      </Stack>
    </Stack>
  );
};

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
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
        </Stack>
      )}
    </Stack>
  );
};

export default LearnerFeedbackBlock;
