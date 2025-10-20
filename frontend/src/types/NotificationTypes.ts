import { HelpRequest } from "./HelpRequestType";

export type Notification = {
  id: string;
  message: string;
  seen: boolean;
  read: boolean;
  createdAt: string;
  user: string;
  link: string;
  helpRequest: HelpRequest;
};

export type NotificationsResponse = {
  notifications: Notification[];
  totalNumberOfNotifications: number;
  numberOfUnseenNotifications: number;
};
