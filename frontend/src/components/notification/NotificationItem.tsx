import { Avatar, Box, Divider, Typography, useTheme } from "@mui/material";
import React from "react";
import { Notification } from "../../types/NotificationTypes";
import { formatTimeElasped } from "../../utils/DateUtils";

interface MessageItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<MessageItemProps> = ({ notification }) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "360px",
          alignItems: "flex-start",
          gap: "-4px",
        }}
      >
        {!notification.seen && (
          <Box
            sx={{
              display: "flex",
              width: "13px",
              height: "42px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              alignSelf: "stretch",

              position: "relative",
              left: "13px",
              top: "20px",
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
        )}
        <Box
          sx={{
            display: "flex",
            padding: "20px 30px 24px 30px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            <Avatar src={notification.helpRequest?.learner?.profilePicture} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "4px",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="titleMedium">
                {notification.helpRequest?.learner?.firstName}{" "}
                {notification.helpRequest?.learner?.lastName}
              </Typography>
              <Typography variant="bodySmall">
                {formatTimeElasped(notification.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            <Typography
              sx={{
                color: theme.palette.Facilitator.Dark.Default,
                fontFamily: "Lexend Deca",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0.32px",
              }}
            >
              {notification.helpRequest?.unit?.title} &gt;{" "}
              {notification.helpRequest?.module?.title} &gt;{" "}
              {notification.helpRequest?.page?.title}
            </Typography>
          </Box>
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
          color: theme.palette.Neutral[300],
        }}
      />
    </>
  );
};

export default NotificationItem;
