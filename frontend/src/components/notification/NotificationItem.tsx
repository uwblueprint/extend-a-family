import React from "react";
import { Notification } from "../../types/NotificationTypes";

type NotificationProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationProps) => {
  const { message } = notification;
  return <div>{message}</div>;
};

export default NotificationItem;
