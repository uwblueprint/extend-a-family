import { EmailOutlined, MarkChatReadOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";
import NotificationAPIClient from "../../APIClients/NotificationAPIClient";
import { Notification } from "../../types/NotificationTypes";
import { formatTimeElasped } from "../../utils/DateUtils";

interface MessageItemProps {
  notification: Notification;
  refreshNotifs: () => void;
}

const NotificationItem: React.FC<MessageItemProps> = ({
  notification,
  refreshNotifs,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [hoverBoxPosition, setHoverBoxPosition] = useState({ top: 0, left: 0 });
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleMarkAsRead = async () => {
    await NotificationAPIClient.markNotificationRead(notification.id);
    refreshNotifs();
  };

  const handleMouseEnter = () => {
    if (notificationRef.current) {
      const rect = notificationRef.current.getBoundingClientRect();
      setHoverBoxPosition({
        top: rect.top,
        left: rect.left - 360,
      });
    }
    setIsHovered(true);
  };

  return (
    <>
      <Box
        ref={notificationRef}
        sx={{
          display: "flex",
          width: "360px",
          alignItems: "flex-start",
          gap: "-4px",
          position: "relative",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
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

        {/* Hover box that appears to the left */}
        {isHovered && (
          <Box
            sx={{
              position: "fixed",
              left: `${hoverBoxPosition.left}px`,
              top: `${hoverBoxPosition.top}px`,
              width: "360px",
              maxHeight: "300px",
              backgroundColor: theme.palette.background?.paper || "#ffffff",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "auto",
            }}
          >
            <Typography variant="titleMedium">Message</Typography>
            <Typography variant="bodySmall">{notification.message}</Typography>
            <Box
              sx={{
                display: "flex",
                paddingTop: "16px",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  padding: "10px 24px 10px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 0 0",
                  alignSelf: "stretch",
                  borderRadius: "4px",
                  backgroundColor: theme.palette.Facilitator.Dark.Default,
                }}
                onClick={() => {
                  window.open(
                    `mailto:${notification.helpRequest?.learner?.email}`,
                    "_blank",
                  );
                }}
                href={`mailto:${notification.helpRequest?.learner?.email}`}
              >
                <EmailOutlined
                  sx={{
                    color: "#FFFFFF",
                    width: "18px",
                    height: "18px",
                  }}
                />
                <Typography
                  variant="labelLarge"
                  color="#FFFFFF"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Respond
                </Typography>
              </Button>
              <Button
                variant="outlined"
                sx={{
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",

                  borderRadius: "4px",
                  border: `1px solid ${theme.palette.Facilitator.Dark.Default}`,
                }}
                onClick={handleMarkAsRead}
              >
                <MarkChatReadOutlined
                  sx={{
                    width: "18px",
                    height: "18px",
                    color: theme.palette.Facilitator.Dark.Default,
                  }}
                />
              </Button>
            </Box>
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
