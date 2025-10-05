import { Box, Typography, useTheme } from "@mui/material";

const ChatBubbleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19.9999 17.1702L18.8299 16.0002H3.99988V4.00024H19.9999V17.1702ZM19.9999 2.00024H3.99988C2.89988 2.00024 1.99988 2.90024 1.99988 4.00024V16.0002C1.99988 17.1002 2.89988 18.0002 3.99988 18.0002H17.9999L21.9999 22.0002V4.00024C21.9999 2.90024 21.0999 2.00024 19.9999 2.00024Z"
      fill="#006C7D"
    />
  </svg>
);

const FeedbackThumbnail = () => {
  const theme = useTheme();
  return (
    <Box
      height={215}
      width={280}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        border: `1px solid ${theme.palette.Neutral[400]}`,
        background: theme.palette.Learner.Light.Default,
      }}
      px="57px"
    >
      <ChatBubbleIcon />
      <Typography
        variant="bodyMedium"
        color={theme.palette.Learner.Dark.Default}
      >
        Feedback
      </Typography>
    </Box>
  );
};

export default FeedbackThumbnail;
