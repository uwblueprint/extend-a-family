import { Server, Socket } from "socket.io";
import MgNotification, { Notification } from "../models/notification.mgmodel";
import NotificationService from "../services/implementations/notificationService";
import logger from "../utilities/logger";

const Logger = logger(__filename);
const notificationService = new NotificationService();

const registerNotificationHandlers = (io: Server, socket: Socket) => {
  // change this to http request idk
  const markNotificationAsSeen = async (userId: string) => {
    try {
      const updates = await notificationService.markSeenNotifications(userId);
      io.to(userId).emit("notification:readUpdates", updates);
    } catch (error) {
      Logger.error(
        `Failed to mark notifications as read for user with id ${userId}`,
      );
    }
  };
  socket.on("notification:read", markNotificationAsSeen);
};

const registerNotificationSchemaListener = (io: Server) => {
  MgNotification.schema.on(
    "notificationSaved",
    async (notification: Notification) => {
      let populatedNotification = await notification.populate("helpRequest");
      populatedNotification = await notification.populate(
        "helpRequest.learner",
      );
      populatedNotification = await notification.populate(
        "helpRequest.unit",
        "title",
      );
      populatedNotification = await notification.populate(
        "helpRequest.module",
        "title",
      );
      populatedNotification = await notification.populate(
        "helpRequest.page",
        "title",
      );
      // Transform the notification to have 'id' instead of '_id' for frontend compatibility
      const notificationObj = populatedNotification.toObject();
      const notificationForFrontend = {
        ...notificationObj,
        // eslint-disable-next-line no-underscore-dangle
        id: notificationObj._id.toString(),
      };
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete, no-underscore-dangle
      delete notificationForFrontend._id;

      io.to(populatedNotification.user.toString()).emit(
        "notification:new",
        notificationForFrontend,
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
  registerNotificationSchemaListener,
  removeNotificationHandlers,
};
