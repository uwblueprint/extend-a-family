export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  user: string;
  link: string;
};

export type NotificationsResponse = {
  notifications: Notification[];
  totalNumberOfNotifications: number;
  numberOfUnseenNotifications: number;
};
