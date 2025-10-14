import { MarkChatReadOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Notification } from "../../../types/NotificationTypes";
import { formatTimeElasped } from "../../../utils/DateUtils";

export default function ChatMessageItem({
  message,
}: {
  message: Notification;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        padding: "24px 16px",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "16px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "28px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "13px",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="7"
                viewBox="0 0 7 7"
                fill="none"
              >
                <circle
                  cx="3.5"
                  cy="3.5"
                  r="3"
                  fill={theme.palette.Facilitator.Dark.Default}
                />
              </svg>
            </Box>
            <Typography variant="bodySmall">
              {formatTimeElasped(message.createdAt)}
            </Typography>
          </Box>
          <IconButton size="large" sx={{ width: "48px", height: "48px" }}>
            <MarkChatReadOutlined />
          </IconButton>
        </Box>
        <Typography variant="bodySmall">{message.message}</Typography>
      </Box>
    </Box>
  );
}
