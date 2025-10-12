import { ObjectId } from "mongoose";
import { HelpRequest } from "../models/helprequest.mgmodel";

export type NotificationDTO = {
  id: ObjectId;
  message: string;
  seen: boolean;
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
  seen?: boolean;
  read?: boolean;
  link?: string;
};

export type UserNotification = Omit<NotificationDTO, "user"> & {
  helpRequest: HelpRequest;
};

export type NotificationsResponseDTO = {
  notifications: UserNotification[];
  totalNumberOfNotifications: number;
  numberOfUnseenNotifications: number;
};
