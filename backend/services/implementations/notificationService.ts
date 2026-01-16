/* eslint-disable class-methods-use-this */
import { Schema, UpdateWriteOpResult } from "mongoose";
import MgNotification, {
  Notification,
} from "../../models/notification.mgmodel";
import {
  CreateNotificationDTO,
  NotificationDTO,
  NotificationsResponseDTO,
  UpdateNotificationDTO,
  UserNotification,
} from "../../types/notificationTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import INotificationService from "../interfaces/notificationService";

const Logger = logger(__filename);

class NotificationService implements INotificationService {
  async getNotifications(
    user: Schema.Types.ObjectId,
    skip: number,
    limit: number,
  ): Promise<NotificationsResponseDTO> {
    let notifications: UserNotification[];
    let totalNumberOfNotifications: number;
    let numberOfUnseenNotifications: number;
    try {
      const foundNotifications = await MgNotification.find({
        user,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      notifications = await Promise.all(
        foundNotifications.map(async (notification) => {
          let populatedNotification: UserNotification =
            await notification.populate("helpRequest");
          populatedNotification = await notification.populate(
            "helpRequest.learner",
          );
          populatedNotification = await notification.populate(
            "helpRequest.unit",
            "title displayIndex",
          );
          populatedNotification = await notification.populate(
            "helpRequest.module",
            "title pages",
          );
          populatedNotification = await notification.populate(
            "helpRequest.page",
          );
          return {
            id: populatedNotification.id,
            message: populatedNotification.message,
            seen: populatedNotification.seen,
            read: populatedNotification.read,
            createdAt: populatedNotification.createdAt,
            link: populatedNotification.link,
            helpRequest: populatedNotification.helpRequest,
          };
        }),
      );

      totalNumberOfNotifications = await MgNotification.where({
        user,
      }).countDocuments();

      numberOfUnseenNotifications = await MgNotification.where({
        user,
        seen: false,
      }).countDocuments();
    } catch (error) {
      Logger.error(
        `Failed to retrieve notifications. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      notifications,
      totalNumberOfNotifications,
      numberOfUnseenNotifications,
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
        `Failed to create notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: newNotification.id,
      user: newNotification.user,
      message: newNotification.message,
      seen: newNotification.seen,
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

    // const message = updateNotification.message
    //   ? updateNotification.message
    //   : oldNotification.message;
    // const read = updateNotification.read
    //   ? updateNotification.read
    //   : oldNotification.read;
    // const link = updateNotification.link
    //   ? updateNotification.link
    //   : oldNotification.link;
    // return {
    //   id: oldNotification.id,
    //   user: oldNotification.user,
    //   createdAt: oldNotification.createdAt,
    //   message,
    //   read,
    //   link,
    // };
    return {
      ...oldNotification,
      ...updateNotification,
    };
  }

  async markSeenNotifications(userId: string): Promise<UpdateWriteOpResult> {
    let updates: UpdateWriteOpResult | null;
    try {
      updates = await MgNotification.updateMany(
        { user: userId, seen: false },
        {
          seen: true,
        },
      );
    } catch (error) {
      Logger.error(
        `Failed to update notifications. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return updates;
  }

  async markNotificationRead(notificationId: string): Promise<NotificationDTO> {
    try {
      const updatedNotification = await this.updateNotification(
        notificationId,
        {
          read: true,
        },
      );
      return updatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to mark notification as read. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default NotificationService;
