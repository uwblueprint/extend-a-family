import React from "react";
import { Container, Typography } from "@mui/material";
import { Notification } from "../../types/NotificationTypes";
import { formatTimeElasped } from "../../utils/DateUtils";

type NotificationProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationProps) => {
  const { message, createdAt } = notification;
  return (
    <Container sx={{ width: "100%", height: "100%" }}>
      <Typography variant="body1">{message}</Typography>
      <Typography variant="caption">{formatTimeElasped(createdAt)}</Typography>
    </Container>
  );
};

export default NotificationItem;
