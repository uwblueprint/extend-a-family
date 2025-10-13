import { Box, Divider, Typography, useTheme } from "@mui/material";
import { Notification } from "../../types/NotificationTypes";
import NotificationItem from "./NotificationItem";
import NotificationsEmpty from "./NotificationsEmpty";

export default function NotificationList({
  notifications,
  refreshNotifs,
}: {
  notifications: Notification[];
  refreshNotifs: () => void;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        width: "360px",
        height: "500px",
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
        <Box
          sx={{
            display: "flex",
            padding: "8px 0",
            alignItems: "center",
            flex: "1 0 0",
            alignSelf: "stretch",
          }}
        >
          <Typography variant="titleLarge">Messages</Typography>
        </Box>
      </Box>
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
        <NotificationItem
          key={message.id}
          notification={message}
          refreshNotifs={refreshNotifs}
        />
      ))}
      {notifications.length === 0 && <NotificationsEmpty />}
    </Box>
  );
}
