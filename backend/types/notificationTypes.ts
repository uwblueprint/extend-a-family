import { ObjectId } from "mongoose";

export type NotificationDTO = {
  id: ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
  user: ObjectId;
  link: string;
};

export type CreateNotificationDTO = {
  message: string;
  user: string;
  link: string;
};

export type UpdateNotificationDTO = {
  message?: string;
  read?: boolean;
  link?: string;
};

export type UserNotification = Omit<NotificationDTO, "user">;

export type NotificationsResponseDTO = {
  notifications: UserNotification[];
  totalNumberOfNotifications: number;
  numberOfUnseenNotifications: number;
};
