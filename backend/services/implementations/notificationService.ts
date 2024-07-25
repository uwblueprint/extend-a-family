/* eslint-disable class-methods-use-this */
import {
  NotificationDTO,
  CreateNotificationDTO,
  NotificationsResponseDTO,
  UserNotification,
  UpdateNotificationDTO,
} from "../../types/notificationTypes";
import INotificationService from "../interfaces/notificationService";
import MgNotification, {
  Notification,
} from "../../models/notification.mgmodel";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class NotificationService implements INotificationService {
  async getNotifications(
    user: string,
    skip: number,
    limit: number,
  ): Promise<NotificationsResponseDTO> {
    let notifications: UserNotification[];
    let numberNotifications: number;
    try {
      const foundNotifications = await MgNotification.find({ user })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      notifications = foundNotifications.map((notification) => {
        return {
          id: notification.id,
          message: notification.message,
          read: notification.read,
          createdAt: notification.createdAt,
          link: notification.link,
        };
      });

      numberNotifications = await MgNotification.where({
        user,
      }).countDocuments();
    } catch (error) {
      Logger.error(
        `Failed to retrieve notifications. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      notifications,
      totalElements: numberNotifications,
    };
  }

  async createNotification(
    notification: CreateNotificationDTO,
  ): Promise<NotificationDTO> {
    let newNotification: Notification;
    try {
      newNotification = await MgNotification.create({
        user: notification.user,
        message: notification.message,
        link: notification.link,
      });
    } catch (error) {
      Logger.error(
        `Failed to retrieve file. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: newNotification.id,
      user: newNotification.user,
      message: newNotification.message,
      read: newNotification.read,
      createdAt: newNotification.createdAt,
      link: newNotification.link,
    };
  }

  async updateNotification(
    notificationId: string,
    updateNotification: UpdateNotificationDTO,
  ): Promise<NotificationDTO> {
    let oldNotification: Notification | null;
    try {
      oldNotification = await MgNotification.findByIdAndUpdate(
        notificationId,
        updateNotification,
        { runValidators: true },
      );
      if (!oldNotification) {
        throw new Error(`Notification ${notificationId} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    const message = updateNotification.message
      ? updateNotification.message
      : oldNotification.message;
    const read = updateNotification.read
      ? updateNotification.read
      : oldNotification.read;
    const link = updateNotification.link
      ? updateNotification.link
      : oldNotification.link;
    return {
      id: notificationId,
      user: oldNotification.user,
      createdAt: oldNotification.createdAt,
      message,
      read,
      link,
    };
  }
}

export default NotificationService;