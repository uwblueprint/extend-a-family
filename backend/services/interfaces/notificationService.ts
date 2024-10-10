import { Schema, UpdateWriteOpResult } from "mongoose";
import {
  NotificationDTO,
  CreateNotificationDTO,
  NotificationsResponseDTO,
  UpdateNotificationDTO,
} from "../../types/notificationTypes";

interface INotificationService {
  /**
   * Gets group of notifications
   * @param user user we want notifications fro
   * @param skip how many notifications to skip
   * @param limit number of notifications to return
   */
  getNotifications(
    user: Schema.Types.ObjectId,
    skip: number,
    limit: number,
  ): Promise<NotificationsResponseDTO>;

  /**
   * Creates a notification
   * @param notification the notification to be created
   */
  createNotification(
    notification: CreateNotificationDTO,
  ): Promise<NotificationDTO>;

  /**
   * Updates a notification
   * @param notificationId the notification to be updated
   * @param updateNotification the data to be updated
   */
  updateNotification(
    notificationId: string,
    updateNotification: UpdateNotificationDTO,
  ): Promise<NotificationDTO>;

  /**
   * Marks all unread notifications as read
   * @param userId the user that the notifications need to be updated
   */
  markReadNotifications(userId: string): Promise<UpdateWriteOpResult>;
}

export default INotificationService;
