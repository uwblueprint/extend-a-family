import { ThumbDownOutlined, ThumbUpOutlined } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useUser } from "../../hooks/useUser";
import { Feedback, FeedbackPopulated } from "../../types/FeedbackTypes";

export const RatingOfFive = ({
  rating,
  starGap = "8px",
}: {
  rating: number;
  starGap?: string;
}): React.ReactElement => {
  const theme = useTheme();
  const { role } = useUser();
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
              ? theme.palette[role].Dark.Default
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

const FeedbackCard = ({
  feedback,
  title,
}: {
  feedback: Feedback | FeedbackPopulated;
  title: React.ReactNode;
}): React.ReactElement => {
  const theme = useTheme();
  const { role } = useUser();
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
      <Typography variant="titleMedium">{title}</Typography>
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
            <RatingOfFive rating={feedback.difficulty} starGap="4px" />
            <Typography
              variant="titleMedium"
              color={theme.palette.Neutral[600]}
            >
              Easy
            </Typography>
          </Stack>
          <Stack direction="row" gap="12px" alignItems="center">
            <Stack direction="row" gap="8px" alignItems="center">
              <ThumbUpOutlined
                sx={{
                  color: feedback.isLiked
                    ? theme.palette[role].Dark.Default
                    : theme.palette.Neutral[400],
                }}
              />
              <ThumbDownOutlined
                sx={{
                  color: !feedback.isLiked
                    ? theme.palette[role].Dark.Default
                    : theme.palette.Neutral[400],
                }}
              />
            </Stack>
            <Typography
              variant="titleMedium"
              color={theme.palette.Neutral[600]}
            >
              Liked
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="bodyMedium">{feedback.message}</Typography>
      </Stack>
    </Stack>
  );
};

export default FeedbackCard;
