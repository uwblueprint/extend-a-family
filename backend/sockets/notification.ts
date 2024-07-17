// file for all things related to notifications

import { Server, Socket } from "socket.io";
import NotificationService from "../services/implementations/notificationService";

const notificationService = new NotificationService();

const registerNotificationHandlers = (io: Server, socket: Socket) => {
  const markNotificationAsRead = async (notificationId: string) => {
    await notificationService.updateNotification(notificationId, {
      read: false,
    });
  };

  socket.on("notification:test", () => console.log("hello from notification"));
  socket.on("notification:read", markNotificationAsRead);
};

export default registerNotificationHandlers;
