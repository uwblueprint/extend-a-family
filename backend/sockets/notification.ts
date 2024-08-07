import { Server, Socket } from "socket.io";
import NotificationService from "../services/implementations/notificationService";
import MgNotification, { Notification } from "../models/notification.mgmodel";
import logger from "../utilities/logger";

const Logger = logger(__filename);
const notificationService = new NotificationService();

const registerNotificationHandlers = (io: Server, socket: Socket) => {
  // change this to http request idk
  const markNotificationAsRead = async (userId: string) => {
    try {
      const updates = await notificationService.markReadNotifications(userId);
      io.to(userId).emit("notification:readUpdates", updates);
    } catch (error) {
      Logger.error(
        `Failed to mark notifications as read for user with id ${userId}`,
      );
    }
  };
  socket.on("notification:read", markNotificationAsRead);
};

const registerNotificationSchemaListener = (io: Server) => {
  MgNotification.schema.on(
    "notificationSaved",
    (notification: Notification) => {
      io.to(notification.user.toString()).emit(
        "notification:new",
        notification,
      );
    },
  );
};

const removeNotificationHandlers = (io: Server, socket: Socket) => {
  socket.removeAllListeners();
  MgNotification.schema.removeAllListeners();
};

export {
  registerNotificationHandlers,
  removeNotificationHandlers,
  registerNotificationSchemaListener,
};
