import { CelebrationOutlined } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";

export default function NotificationsEmpty() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        padding: "60px 24px 60px 32px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        flex: "1 0 0",
        alignSelf: "stretch",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          paddingRight: "48px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          flex: "1 0 0",
        }}
      >
        <CelebrationOutlined
          sx={{
            width: "60px",
            height: "60px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <Typography variant="titleMedium">
            Hooray! No new messages.
          </Typography>
          <Typography
            sx={{
              color: theme.palette.Neutral[700],
              fontFamily: "Lexend Deca",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0.32px",
            }}
          >
            When your learners need help or send a message, you will be notified
            here!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
