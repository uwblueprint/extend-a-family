import { Box, Divider, Typography, useTheme } from "@mui/material";
import { User } from "../../../types/UserTypes";
import NotifiactionsFetchError from "../../notification/NotificationsFetchError";
import ChatMessageItem from "./ChatMessageItem";
import { Notification } from "../../../types/NotificationTypes";

export default function ChatWithLearner({
  learner,
  allMessages,
  isLoading,
  errorFetchNotifs,
  fetchNotifications,
}: {
  learner: User;
  allMessages: Notification[];
  isLoading: boolean;
  errorFetchNotifs: boolean;
  fetchNotifications: () => void;
}) {
  const theme = useTheme();

  const messages = allMessages.filter(
    // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
    (message) => (message.helpRequest.learner as any)._id === learner.id,
  );

  const content = () => {
    if (isLoading) {
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
          }}
        >
          <Typography
            variant="bodyLarge"
            sx={{ color: theme.palette.Neutral[900] }}
          >
            Loading...
          </Typography>
        </Box>
      );
    }
    if (errorFetchNotifs) {
      return <NotifiactionsFetchError />;
    }
    if (messages.length === 0) {
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
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <Typography variant="titleMedium">No messages</Typography>
            <Typography variant="bodySmall">
              Once this learner sends a message, it will show up here.
            </Typography>
          </Box>
        </Box>
      );
    }
    return messages.map((message) => (
      <ChatMessageItem
        key={message.id}
        message={message}
        refreshNotifs={fetchNotifications}
      />
    ));
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "360px",
        height: "500px",
        flexDirection: "column",
        alignItems: "flex-start",
        flexShrink: 0,

        backgroundColor: theme.palette.Neutral[100],
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
          <Typography variant="titleMedium">
            {learner.firstName}&apos;s Message History
          </Typography>
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
      {content()}
    </Box>
  );
}
