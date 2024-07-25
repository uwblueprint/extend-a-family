import { User } from "../models/user.mgmodel";

export type NotificationDTO = {
  id: string;
  message: string;
  read: boolean;
  createdAt: Date;
  user: User;
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
  totalElements: number;
};