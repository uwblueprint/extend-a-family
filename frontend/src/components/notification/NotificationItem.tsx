import React from "react";
import { Link } from "react-router-dom";
import { Notification } from "../../types/NotificationTypes";

type NotificationProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationProps) => {
  const { message, link } = notification;
  return <Link to={link}>{message}</Link>;
};

export default NotificationItem;
