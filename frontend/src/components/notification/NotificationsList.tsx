import { Box, Divider, Typography, useTheme } from "@mui/material";
import { Notification } from "../../types/NotificationTypes";
import NotificationItem from "./NotificationItem";

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        width: "360px",
        height: "500px",
        maxHeight: "500px",
        flexDirection: "column",
        alignItems: "flex-start",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "16px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography variant="titleLarge">Messages</Typography>
        <Divider
          sx={{
            display: "flex",
            height: "0.5px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            alignSelf: "stretch",
            color: theme.palette.Neutral[500],
          }}
        />
        {notifications.map((message) => (
          <NotificationItem key={message.id} notification={message} />
        ))}
      </Box>
    </Box>
  );
}
