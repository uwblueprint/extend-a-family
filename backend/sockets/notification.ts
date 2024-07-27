import { Server, Socket } from "socket.io";
import NotificationService from "../services/implementations/notificationService";
import MgNotification, { Notification } from "../models/notification.mgmodel";

const notificationService = new NotificationService();

const registerNotificationHandlers = (io: Server, socket: Socket) => {
  const markNotificationAsRead = async (notificationId: string) => {
    await notificationService.updateNotification(notificationId, {
      read: false,
    });
  };
  MgNotification.schema.on(
    "notificationSaved",
    (notification: Notification) => {
      io.to(notification.user).emit("notification:new", notification);
    },
  );

  socket.on("notification:read", markNotificationAsRead);
};

const removeNotificationHandlers = (io: Server, socket: Socket) => {
  socket.removeAllListeners();
  MgNotification.schema.removeAllListeners();
};

export { registerNotificationHandlers, removeNotificationHandlers };
